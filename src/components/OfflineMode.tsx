import React from 'react'
import { WifiOff, Heart, Calendar, BookOpen } from 'lucide-react'
import { Card, Button } from './ui'

interface OfflineModeProps {
  onRetry: () => void
}

export function OfflineMode({ onRetry }: OfflineModeProps) {
  const offlineFeatures = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "本地运势",
      description: "查看缓存的运势信息",
      available: true
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "离线许愿",
      description: "记录心愿，联网后同步",
      available: true
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "占卜历史",
      description: "浏览本地保存的占卜记录",
      available: true
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <Card variant="glass" padding="xl" className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-700/50 rounded-full mb-6">
            <WifiOff className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            离线模式
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            网络连接不可用，但您仍可以使用以下功能
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {offlineFeatures.map((feature, index) => (
            <Card 
              key={index}
              variant="glass" 
              padding="lg" 
              className={`border-gray-600/30 ${
                feature.available 
                  ? 'hover:border-primary-400/40 cursor-pointer' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <div className={`mb-3 ${
                feature.available ? 'text-primary-400' : 'text-gray-500'
              }`}>
                {feature.icon}
              </div>
              <h3 className="text-white font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <Button
            onClick={onRetry}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto px-8"
          >
            重新连接
          </Button>
          
          <div className="text-sm text-gray-400">
            <p>网络恢复后，离线数据将自动同步</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default OfflineMode