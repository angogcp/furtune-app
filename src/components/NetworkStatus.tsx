import React, { useState, useEffect } from 'react'
import { networkManager, NetworkState } from '../utils/networkManager'

interface NetworkStatusProps {
  onNetworkChange?: (isConnected: boolean) => void
}

export function NetworkStatus({ onNetworkChange }: NetworkStatusProps) {
  const [networkState, setNetworkState] = useState<NetworkState>(networkManager.getState())
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Subscribe to network state changes
    const unsubscribe = networkManager.subscribe((state) => {
      setNetworkState(state)
      
      // Determine if we should show the status bar
      const shouldShow = !state.isOnline || !state.isSupabaseConnected || state.isRetrying
      setIsVisible(shouldShow)
      
      // Notify parent component
      onNetworkChange?.(state.isOnline && state.isSupabaseConnected)
    })

    return unsubscribe
  }, [onNetworkChange])

  const handleRetry = async () => {
    try {
      await networkManager.forceReconnect()
    } catch (error) {
      console.error('Manual reconnect failed:', error)
    }
  }

  const getStatusMessage = () => {
    if (!networkState.isOnline) {
      return '网络连接已断开，请检查您的网络设置'
    }
    
    if (!networkState.isSupabaseConnected) {
      if (networkState.isRetrying) {
        return `正在重新连接服务器... (尝试 ${networkState.connectionAttempts}/5)`
      }
      return '服务器连接不稳定，部分功能可能受影响'
    }
    
    if (networkState.isRetrying) {
      return '正在检查连接状态...'
    }
    
    return '连接正常'
  }

  const getStatusColor = () => {
    if (!networkState.isOnline) {
      return 'bg-red-600'
    }
    
    if (!networkState.isSupabaseConnected) {
      return networkState.isRetrying ? 'bg-yellow-600' : 'bg-orange-600'
    }
    
    return 'bg-green-600'
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${getStatusColor()} text-white px-4 py-2 text-center text-sm transition-all duration-300`}>
      <div className="flex items-center justify-center gap-3 max-w-4xl mx-auto">
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            networkState.isRetrying 
              ? 'bg-white animate-pulse' 
              : networkState.isOnline && networkState.isSupabaseConnected
                ? 'bg-green-300'
                : 'bg-red-300'
          }`}></div>
          <span className="font-medium">{getStatusMessage()}</span>
        </div>

        {/* Connection info */}
        {networkState.lastConnectionTest && (
          <span className="text-xs opacity-75 hidden sm:inline">
            最后检查: {networkState.lastConnectionTest.toLocaleTimeString()}
          </span>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRetry}
            disabled={networkState.isRetrying}
            className="px-3 py-1 bg-white bg-opacity-20 rounded text-xs font-medium hover:bg-opacity-30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {networkState.isRetrying ? '重试中...' : '重试连接'}
          </button>
          
          {/* Dismiss button for non-critical issues */}
          {networkState.isOnline && networkState.isSupabaseConnected && (
            <button 
              onClick={() => setIsVisible(false)}
              className="px-2 py-1 bg-white bg-opacity-20 rounded text-xs hover:bg-opacity-30 transition-colors"
              title="暂时隐藏"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Hook for using network status in components
export function useNetworkStatus() {
  const [networkState, setNetworkState] = useState<NetworkState>(networkManager.getState())

  useEffect(() => {
    const unsubscribe = networkManager.subscribe(setNetworkState)
    return unsubscribe
  }, [])

  return {
    isOnline: networkState.isOnline,
    isSupabaseConnected: networkState.isSupabaseConnected,
    isConnected: networkState.isOnline && networkState.isSupabaseConnected,
    isRetrying: networkState.isRetrying,
    connectionAttempts: networkState.connectionAttempts,
    lastConnectionTest: networkState.lastConnectionTest,
    testConnection: () => networkManager.testConnection(),
    forceReconnect: () => networkManager.forceReconnect()
  }
}
