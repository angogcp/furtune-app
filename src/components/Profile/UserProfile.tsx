import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { User, Mail, Calendar, Award, Flame, Star, LogOut, Edit } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default function UserProfile() {
  const { user, signOut } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState(user?.username || '')
  const [loading, setLoading] = useState(false)

  if (!user) {
    return (
      <div className="bg-purple-900/50 rounded-lg p-6 border border-purple-400/30 text-center">
        <p className="text-purple-200">请先登录查看个人资料</p>
      </div>
    )
  }

  const handleUpdateProfile = async () => {
    // This would be implemented with the updateProfile function from AuthContext
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsEditing(false)
      setLoading(false)
    }, 1000)
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-6 border border-purple-400/30">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-white" />
        </div>
        
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="text-xl font-bold bg-purple-800/50 border border-purple-600 rounded px-3 py-1 text-white text-center"
            />
            <div className="flex justify-center space-x-2">
              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm text-white"
              >
                {loading ? '保存中...' : '保存'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setUsername(user.username)
                }}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm text-white"
              >
                取消
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{user.username}</h2>
            <button
              onClick={() => setIsEditing(true)}
              className="text-purple-300 hover:text-purple-200 text-sm flex items-center mx-auto"
            >
              <Edit className="w-4 h-4 mr-1" />
              编辑资料
            </button>
          </div>
        )}
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-purple-800/30 rounded-lg p-4 text-center">
          <Flame className="w-8 h-8 mx-auto mb-2 text-orange-400" />
          <div className="text-2xl font-bold text-white">{user.sign_in_streak}</div>
          <div className="text-sm text-purple-200">连续签到</div>
        </div>
        
        <div className="bg-purple-800/30 rounded-lg p-4 text-center">
          <Award className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
          <div className="text-2xl font-bold text-white">{user.total_sign_ins}</div>
          <div className="text-sm text-purple-200">累计签到</div>
        </div>
        
        <div className="bg-purple-800/30 rounded-lg p-4 text-center">
          <Star className="w-8 h-8 mx-auto mb-2 text-pink-400" />
          <div className="text-2xl font-bold text-white">
            {Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))}
          </div>
          <div className="text-sm text-purple-200">加入天数</div>
        </div>
      </div>

      {/* User Info */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-purple-200">
          <Mail className="w-5 h-5 mr-3 text-purple-400" />
          <span>{user.email}</span>
        </div>
        
        <div className="flex items-center text-purple-200">
          <Calendar className="w-5 h-5 mr-3 text-purple-400" />
          <span>
            加入时间：{format(new Date(user.created_at), 'yyyy年MM月dd日', { locale: zhCN })}
          </span>
        </div>
        
        {user.last_sign_in && (
          <div className="flex items-center text-purple-200">
            <Star className="w-5 h-5 mr-3 text-purple-400" />
            <span>
              最后签到：{format(new Date(user.last_sign_in), 'yyyy年MM月dd日', { locale: zhCN })}
            </span>
          </div>
        )}
      </div>

      {/* Achievement Badges */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">成就徽章</h3>
        <div className="flex flex-wrap gap-2">
          {user.total_sign_ins >= 1 && (
            <div className="bg-green-900/50 border border-green-500 rounded-full px-3 py-1 text-sm text-green-200">
              🌟 初次签到
            </div>
          )}
          {user.sign_in_streak >= 7 && (
            <div className="bg-orange-900/50 border border-orange-500 rounded-full px-3 py-1 text-sm text-orange-200">
              🔥 连续一周
            </div>
          )}
          {user.sign_in_streak >= 30 && (
            <div className="bg-purple-900/50 border border-purple-500 rounded-full px-3 py-1 text-sm text-purple-200">
              💎 连续一月
            </div>
          )}
          {user.total_sign_ins >= 100 && (
            <div className="bg-yellow-900/50 border border-yellow-500 rounded-full px-3 py-1 text-sm text-yellow-200">
              👑 签到达人
            </div>
          )}
        </div>
      </div>

      {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center"
      >
        <LogOut className="w-5 h-5 mr-2" />
        退出登录
      </button>
    </div>
  )
}