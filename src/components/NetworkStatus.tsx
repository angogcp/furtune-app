import React, { useState, useEffect } from 'react'
import { Wifi, WifiOff, AlertCircle, CheckCircle, RotateCcw, Smartphone } from 'lucide-react'
import { networkManager } from '../utils/networkManager'
import { offlineManager } from '../utils/offlineManager'
import { Button } from './ui'

interface NetworkStatusProps {
  showDetails?: boolean
  className?: string
}

export const NetworkStatus: React.FC<NetworkStatusProps> = ({ 
  showDetails = false, 
  className = '' 
}) => {
  const [networkState, setNetworkState] = useState(networkManager.getState())
  const [isRetrying, setIsRetrying] = useState(false)
  const [offlineStats, setOfflineStats] = useState(offlineManager.getOfflineStats())

  useEffect(() => {
    const unsubscribe = networkManager.subscribe((state) => {
      setNetworkState(state)
    })

    // 定期更新离线数据统计
    const updateOfflineStats = () => {
      setOfflineStats(offlineManager.getOfflineStats())
    }
    
    updateOfflineStats()
    const interval = setInterval(updateOfflineStats, 30000) // 每30秒更新一次

    return () => {
      unsubscribe()
      clearInterval(interval)
    }
  }, [])

  const handleReconnect = async () => {
    setIsRetrying(true)
    try {
      await networkManager.forceReconnect()
    } finally {
      setIsRetrying(false)
    }
  }

  const toggleOfflineMode = () => {
    if (networkState.isOfflineMode) {
      networkManager.disableOfflineMode()
    } else {
      networkManager.enableOfflineMode()
    }
  }

  const getStatusIcon = () => {
    if (isReconnecting || networkState.isRetrying) {
      return <RefreshCw className="w-4 h-4 animate-spin" />
    }
    
    if (!networkState.isOnline) {
      return <WifiOff className="w-4 h-4 text-red-500" />
    }
    
    if (!networkState.isSupabaseConnected) {
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    }
    
    return <Wifi className="w-4 h-4 text-green-500" />
  }

  const getStatusText = () => {
    if (networkState.isOfflineMode) {
      return '离线模式 - 数据将在联网后同步'
    }
    
    if (!networkState.isOnline) {
      return '网络连接已断开'
    }
    
    if (networkState.isRetrying) {
      return '正在重新连接...'
    }
    
    if (!networkState.isSupabaseConnected) {
      return '服务器连接失败 - DNS解析错误'
    }
    
    return '网络连接正常'
  }

  const getStatusColor = () => {
    if (isReconnecting || networkState.isRetrying) {
      return 'text-blue-600'
    }
    
    if (!networkState.isOnline || !networkState.isSupabaseConnected) {
      return 'text-red-600'
    }
    
    return 'text-green-600'
  }

  // 不显示网络状态的情况（除非处于离线模式或有待同步数据）
  if (networkState.isOnline && networkState.isSupabaseConnected && !networkState.isRetrying && !networkState.isOfflineMode && !offlineStats.wishes) {
    return null
  }

  return (
    <div className={`bg-gradient-to-r from-yellow-500/10 to-blue-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {networkState.isOfflineMode ? (
            <Smartphone className="w-5 h-5 text-blue-400" />
          ) : networkState.isOnline ? (
            networkState.isSupabaseConnected ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-400" />
            )
          ) : (
            <WifiOff className="w-5 h-5 text-red-400" />
          )}
          
          <div className="flex-1">
            <p className="text-sm font-medium text-white">
              {getStatusText()}
            </p>
            
            {/* 离线数据统计 */}
            {networkState.isOfflineMode && (offlineStats.wishes > 0 || offlineStats.fortunes > 0) && (
              <p className="text-xs text-blue-300 mt-1">
                离线数据: {offlineStats.wishes} 个许愿, {offlineStats.fortunes} 个运势
              </p>
            )}
            
            {/* 待同步提示 */}
            {!networkState.isOfflineMode && offlineStats.wishes > 0 && (
              <p className="text-xs text-yellow-300 mt-1">
                有 {offlineStats.wishes} 个离线许愿待同步
              </p>
            )}
            
            {networkState.lastConnectionTest && (
              <p className="text-xs text-gray-400 mt-1">
                最后检测: {networkState.lastConnectionTest.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* 离线模式切换按钮 */}
          <Button
            onClick={toggleOfflineMode}
            variant={networkState.isOfflineMode ? "primary" : "secondary"}
            size="sm"
          >
            <Smartphone className="w-4 h-4 mr-1" />
            {networkState.isOfflineMode ? '在线模式' : '离线模式'}
          </Button>
          
          {/* 重连按钮 */}
          {!networkState.isOfflineMode && (
            <Button
              onClick={handleReconnect}
              disabled={isRetrying}
              variant="secondary"
              size="sm"
            >
              {isRetrying ? (
                <RotateCcw className="w-4 h-4 animate-spin" />
              ) : (
                <RotateCcw className="w-4 h-4" />
              )}
              {isRetrying ? '重连中...' : '重新连接'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default NetworkStatus