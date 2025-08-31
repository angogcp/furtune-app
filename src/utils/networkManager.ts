import { supabase } from '../lib/supabase'
import { toast } from 'sonner'
import { offlineManager } from './offlineManager'

// Network status types
export interface NetworkState {
  isOnline: boolean
  isSupabaseConnected: boolean
  lastConnectionTest: Date | null
  connectionAttempts: number
  isRetrying: boolean
  isOfflineMode: boolean
}

// Connection test result
export interface ConnectionTestResult {
  success: boolean
  latency?: number
  error?: string
  timestamp: Date
}

// Network manager class for centralized network handling
class NetworkManager {
  private state: NetworkState = {
    isOnline: navigator.onLine,
    isSupabaseConnected: true,
    lastConnectionTest: null,
    connectionAttempts: 0,
    isRetrying: false,
    isOfflineMode: false
  }

  private listeners: Array<(state: NetworkState) => void> = []
  private connectionTestInterval: NodeJS.Timeout | null = null
  private retryTimeout: NodeJS.Timeout | null = null
  private maxRetries = 5
  private baseRetryDelay = 1000

  constructor() {
    this.initializeListeners()
    this.startPeriodicTests()
  }

  private initializeListeners() {
    // Browser online/offline events
    window.addEventListener('online', this.handleOnline.bind(this))
    window.addEventListener('offline', this.handleOffline.bind(this))

    // Supabase auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED' && !session) {
        console.warn('Token refresh failed - network issue detected')
        this.handleConnectionIssue('Token refresh failed')
      }
    })

    // Page visibility changes (to test connection when page becomes visible)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.state.connectionAttempts > 0) {
        this.testConnection()
      }
    })
  }

  private handleOnline() {
    console.log('Browser online event detected')
    this.updateState({ isOnline: true })
    this.testConnection()
  }

  private handleOffline() {
    console.log('Browser offline event detected')
    this.updateState({ 
      isOnline: false, 
      isSupabaseConnected: false 
    })
    this.notifyListeners()
  }

  private updateState(updates: Partial<NetworkState>) {
    this.state = { ...this.state, ...updates }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state))
  }

  private startPeriodicTests() {
    // Test connection every 15 seconds
    this.connectionTestInterval = setInterval(() => {
      if (this.state.isOnline && !this.state.isRetrying) {
        this.testConnection()
      }
    }, 15000)
  }

  public async testConnection(): Promise<ConnectionTestResult> {
    const startTime = Date.now()
    
    try {
      // Test with a simple query that should always work
      const { error } = await Promise.race([
        supabase.from('users').select('count').limit(1),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout')), 5000)
        )
      ]) as any

      const latency = Date.now() - startTime
      const success = !error || !this.isNetworkError(error)

      this.updateState({
        isSupabaseConnected: success,
        lastConnectionTest: new Date(),
        connectionAttempts: success ? 0 : this.state.connectionAttempts + 1
      })

      if (!success && this.state.connectionAttempts === 1) {
        this.handleConnectionIssue(error?.message || 'Connection test failed')
      }

      this.notifyListeners()

      return {
        success,
        latency: success ? latency : undefined,
        error: success ? undefined : error?.message,
        timestamp: new Date()
      }
    } catch (error: any) {
      this.updateState({
        isSupabaseConnected: false,
        lastConnectionTest: new Date(),
        connectionAttempts: this.state.connectionAttempts + 1
      })

      this.handleConnectionIssue(error.message)
      this.notifyListeners()

      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      }
    }
  }

  private isNetworkError(error: any): boolean {
    if (!error) return false
    
    const networkErrorPatterns = [
      'network',
      'fetch',
      'connection',
      'timeout',
      'ERR_NETWORK',
      'ERR_INTERNET_DISCONNECTED',
      'ERR_NETWORK_CHANGED',
      'ERR_NAME_NOT_RESOLVED',
      'ERR_CONNECTION_REFUSED',
      'ERR_CONNECTION_TIMED_OUT',
      'Failed to fetch',
      'DNS resolution failed',
      'getaddrinfo ENOTFOUND'
    ]

    const errorMessage = error.message || error.toString() || ''
    return networkErrorPatterns.some(pattern => 
      errorMessage.toLowerCase().includes(pattern.toLowerCase())
    )
  }

  private isDNSError(error: any): boolean {
    if (!error) return false
    
    const dnsErrorPatterns = [
      'ERR_NAME_NOT_RESOLVED',
      'DNS resolution failed',
      'getaddrinfo ENOTFOUND',
      'ENOTFOUND'
    ]

    const errorMessage = error.message || error.toString() || ''
    return dnsErrorPatterns.some(pattern => 
      errorMessage.toLowerCase().includes(pattern.toLowerCase())
    )
  }

  private getErrorMessage(error: any): string {
    if (this.isDNSError(error)) {
      return '无法解析服务器地址，请检查网络连接或稍后重试'
    }
    
    if (this.isNetworkError(error)) {
      return '网络连接失败，请检查网络设置'
    }
    
    return error?.message || '未知错误'
  }

  private handleConnectionIssue(errorMessage: string) {
    if (this.state.isRetrying || this.state.connectionAttempts >= this.maxRetries) {
      return
    }

    this.updateState({ isRetrying: true })
    
    // 如果连续失败次数过多，切换到离线模式
    if (this.state.connectionAttempts >= 3 && !this.state.isOfflineMode) {
      this.updateState({ isOfflineMode: true })
    }
    
    const retryDelay = this.baseRetryDelay * Math.pow(2, this.state.connectionAttempts)
    
    console.log(`Connection issue detected: ${errorMessage}. Retrying in ${retryDelay}ms`)
    
    this.retryTimeout = setTimeout(() => {
      this.updateState({ isRetrying: false })
      this.testConnection()
    }, retryDelay)
  }

  public async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxAttempts: number = 3
  ): Promise<T> {
    let lastError: Error = new Error('Unknown error')
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // Test connection before attempting operation
        if (!this.state.isOnline) {
          throw new Error('设备离线，请检查网络连接')
        }

        const result = await operation()
        
        // Reset connection attempts on success
        if (this.state.connectionAttempts > 0) {
          this.updateState({ connectionAttempts: 0 })
          this.notifyListeners()
        }
        
        return result
      } catch (error: any) {
        lastError = error
        
        if (this.isNetworkError(error) && attempt < maxAttempts) {
          const delay = this.baseRetryDelay * Math.pow(2, attempt - 1)
          console.log(`Network operation failed (attempt ${attempt}/${maxAttempts}). Retrying in ${delay}ms...`)
          
          await new Promise(resolve => setTimeout(resolve, delay))
          
          // Test connection before retry
          await this.testConnection()
          
          if (!this.state.isSupabaseConnected) {
            throw new Error(this.getErrorMessage(lastError))
          }
        } else {
          break
        }
      }
    }
    
    throw lastError
  }

  public subscribe(listener: (state: NetworkState) => void): () => void {
    this.listeners.push(listener)
    
    // Immediately notify with current state
    listener(this.state)
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  public getState(): NetworkState {
    return { ...this.state }
  }

  public async forceReconnect(): Promise<void> {
    this.updateState({ 
      connectionAttempts: 0, 
      isRetrying: false,
      isOfflineMode: false
    })
    
    // Clear any existing timeouts
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout)
      this.retryTimeout = null
    }
    
    // Force refresh auth session
    try {
      await supabase.auth.refreshSession()
    } catch (error) {
      console.warn('Failed to refresh session during reconnect:', error)
    }
    
    // Test connection
    await this.testConnection()
    
    // 如果重新连接成功，尝试同步离线数据
    if (this.state.isSupabaseConnected && offlineManager.hasPendingSync()) {
      try {
        await offlineManager.syncToServer(supabase)
        this.showNetworkSuccess('离线数据已同步')
      } catch (error) {
        console.error('Failed to sync offline data:', error)
      }
    }
  }

  // 启用离线模式
  public enableOfflineMode(): void {
    this.updateState({ isOfflineMode: true })
    this.notifyListeners()
    this.showNetworkError('已切换到离线模式')
  }

  // 禁用离线模式
  public disableOfflineMode(): void {
    this.updateState({ isOfflineMode: false })
    this.notifyListeners()
  }

  // 检查是否处于离线模式
  public isOfflineMode(): boolean {
    return this.state.isOfflineMode
  }

  public showNetworkError(error: string) {
    toast.error(error, {
      duration: 5000,
      position: 'top-center',
      style: {
        background: '#ef4444',
        color: 'white',
        fontWeight: '500'
      }
    })
  }

  public showNetworkSuccess(message: string) {
    toast.success(message, {
      duration: 3000,
      position: 'top-center',
      style: {
        background: '#10b981',
        color: 'white',
        fontWeight: '500'
      }
    })
  }

  public destroy() {
    window.removeEventListener('online', this.handleOnline.bind(this))
    window.removeEventListener('offline', this.handleOffline.bind(this))
    
    if (this.connectionTestInterval) {
      clearInterval(this.connectionTestInterval)
    }
    
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout)
    }
    
    this.listeners = []
  }
}

// Export singleton instance
export const networkManager = new NetworkManager()

// Export hook for React components
export function useNetworkManager() {
  return networkManager
}
