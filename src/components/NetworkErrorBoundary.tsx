import React, { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Wifi } from 'lucide-react'
import { networkManager } from '../utils/networkManager'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  isNetworkError: boolean
  isRetrying: boolean
}

export class NetworkErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      isNetworkError: false,
      isRetrying: false
    }
  }

  static getDerivedStateFromError(error: Error): State {
    const isNetworkError = NetworkErrorBoundary.isNetworkRelatedError(error)
    
    return {
      hasError: true,
      error,
      isNetworkError,
      isRetrying: false
    }
  }

  private static isNetworkRelatedError(error: Error): boolean {
    const networkErrorPatterns = [
      'ERR_NAME_NOT_RESOLVED',
      'ERR_CONNECTION_REFUSED',
      'ERR_CONNECTION_TIMED_OUT',
      'Failed to fetch',
      'DNS resolution failed',
      'getaddrinfo ENOTFOUND',
      'Network request failed',
      'TypeError: Failed to fetch'
    ]

    const errorMessage = error.message || error.toString() || ''
    return networkErrorPatterns.some(pattern => 
      errorMessage.toLowerCase().includes(pattern.toLowerCase())
    )
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('NetworkErrorBoundary caught an error:', error, errorInfo)
    
    if (this.state.isNetworkError) {
      // 自动重试网络错误
      this.scheduleRetry()
    }
  }

  private scheduleRetry = () => {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
    }

    this.setState({ isRetrying: true })
    
    this.retryTimeoutId = setTimeout(() => {
      this.handleRetry()
    }, 3000) // 3秒后重试
  }

  private handleRetry = async () => {
    try {
      // 测试网络连接
      await networkManager.testConnection()
      
      // 如果连接成功，重置错误状态
      this.setState({
        hasError: false,
        error: null,
        isNetworkError: false,
        isRetrying: false
      })
    } catch (error) {
      // 重试失败，保持错误状态
      this.setState({ isRetrying: false })
      
      // 再次安排重试
      this.scheduleRetry()
    }
  }

  private handleManualRetry = () => {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
    }
    
    this.handleRetry()
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      if (this.state.isNetworkError) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="mb-4">
                {this.state.isRetrying ? (
                  <RefreshCw className="w-16 h-16 text-blue-500 mx-auto animate-spin" />
                ) : (
                  <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
                )}
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {this.state.isRetrying ? '正在重新连接...' : '网络连接异常'}
              </h2>
              
              <p className="text-gray-600 mb-6">
                {this.state.isRetrying 
                  ? '正在尝试重新建立连接，请稍候...'
                  : '无法连接到服务器，请检查您的网络连接'}
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={this.handleManualRetry}
                  disabled={this.state.isRetrying}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 ${this.state.isRetrying ? 'animate-spin' : ''}`} />
                  {this.state.isRetrying ? '重新连接中...' : '重新连接'}
                </button>
                
                <div className="text-sm text-gray-500">
                  <p>请检查以下项目：</p>
                  <ul className="mt-2 text-left space-y-1">
                    <li>• 网络连接是否正常</li>
                    <li>• 防火墙设置是否阻止连接</li>
                    <li>• DNS 设置是否正确</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )
      }

      // 非网络错误的通用错误界面
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">出现了一些问题</h2>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || '应用程序遇到了未知错误'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              刷新页面
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default NetworkErrorBoundary