import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { User, Mail, Calendar, Award, Flame, Star, LogOut, Edit, MapPin, Clock, UserIcon } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default function UserProfile() {
  const { user, userProfile, signOut, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Form state for personal information
  const [formData, setFormData] = useState({
    username: userProfile?.username || '',
    full_name: userProfile?.full_name || '',
    date_of_birth: userProfile?.date_of_birth || '',
    time_of_birth: userProfile?.time_of_birth || '',
    place_of_birth: userProfile?.place_of_birth || '',
    gender: userProfile?.gender || 'male' as 'male' | 'female'
  })

  if (!user) {
    return (
      <div className="bg-purple-900/50 rounded-lg p-6 border border-purple-400/30 text-center">
        <p className="text-purple-200">请先登录查看个人资料</p>
      </div>
    )
  }

  const handleUpdateProfile = async () => {
    if (!updateProfile) {
      console.error('updateProfile function not available')
      return
    }
    
    setLoading(true)
    try {
      const result = await updateProfile(formData)
      if (!result.error) {
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      username: userProfile?.username || '',
      full_name: userProfile?.full_name || '',
      date_of_birth: userProfile?.date_of_birth || '',
      time_of_birth: userProfile?.time_of_birth || '',
      place_of_birth: userProfile?.place_of_birth || '',
      gender: userProfile?.gender || 'male'
    })
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
          <div className="space-y-4 max-w-md mx-auto">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-1">用户名</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full bg-purple-800/50 border border-purple-600 rounded px-3 py-2 text-white text-center"
                placeholder="请输入用户名"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-1">姓名</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                className="w-full bg-purple-800/50 border border-purple-600 rounded px-3 py-2 text-white text-center"
                placeholder="请输入真实姓名"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-1">出生日期</label>
              <input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                className="w-full bg-purple-800/50 border border-purple-600 rounded px-3 py-2 text-white text-center"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-1">出生时间</label>
              <input
                type="time"
                value={formData.time_of_birth}
                onChange={(e) => setFormData(prev => ({ ...prev, time_of_birth: e.target.value }))}
                className="w-full bg-purple-800/50 border border-purple-600 rounded px-3 py-2 text-white text-center"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-1">出生地点</label>
              <input
                type="text"
                value={formData.place_of_birth}
                onChange={(e) => setFormData(prev => ({ ...prev, place_of_birth: e.target.value }))}
                className="w-full bg-purple-800/50 border border-purple-600 rounded px-3 py-2 text-white text-center"
                placeholder="请输入出生地点"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-1">性别</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' }))}
                className="w-full bg-purple-800/50 border border-purple-600 rounded px-3 py-2 text-white text-center"
              >
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </div>
            
            <div className="flex justify-center space-x-3 pt-4">
              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded text-white font-medium transition-colors"
              >
                {loading ? '保存中...' : '保存'}
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 rounded text-white font-medium transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{userProfile?.full_name || userProfile?.username || user?.email}</h2>
            <p className="text-purple-300 text-sm mb-3">{userProfile?.username}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="text-purple-300 hover:text-purple-200 text-sm flex items-center mx-auto transition-colors"
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
          <div className="text-2xl font-bold text-white">{userProfile?.sign_in_streak || 0}</div>
          <div className="text-sm text-purple-200">连续签到</div>
        </div>
        
        <div className="bg-purple-800/30 rounded-lg p-4 text-center">
          <Award className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
          <div className="text-2xl font-bold text-white">{userProfile?.total_sign_ins || 0}</div>
          <div className="text-sm text-purple-200">累计签到</div>
        </div>
        
        <div className="bg-purple-800/30 rounded-lg p-4 text-center">
          <Star className="w-8 h-8 mx-auto mb-2 text-pink-400" />
          <div className="text-2xl font-bold text-white">
            {Math.floor((Date.now() - new Date(userProfile?.created_at || user?.created_at || new Date()).getTime()) / (1000 * 60 * 60 * 24))}
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
            加入时间：{format(new Date(userProfile?.created_at || user?.created_at || new Date()), 'yyyy年MM月dd日', { locale: zhCN })}
          </span>
        </div>
        
        {user?.last_sign_in_at && (
          <div className="flex items-center text-purple-200">
            <Star className="w-5 h-5 mr-3 text-purple-400" />
            <span>
              最后登录：{format(new Date(user.last_sign_in_at), 'yyyy年MM月dd日', { locale: zhCN })}
            </span>
          </div>
        )}
      </div>

      {/* Personal Information Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <UserIcon className="w-5 h-5 mr-2 text-purple-400" />
          个人信息
        </h3>
        <div className="bg-purple-800/20 rounded-lg p-4 space-y-3">
          {userProfile?.full_name ? (
            <div className="flex items-center text-purple-200">
              <User className="w-4 h-4 mr-3 text-purple-400" />
              <span>姓名：{userProfile.full_name}</span>
            </div>
          ) : (
            <div className="flex items-center text-purple-300">
              <User className="w-4 h-4 mr-3 text-purple-500" />
              <span className="text-sm">未设置姓名</span>
            </div>
          )}
          
          {userProfile?.date_of_birth ? (
            <div className="flex items-center text-purple-200">
              <Calendar className="w-4 h-4 mr-3 text-purple-400" />
              <span>出生日期：{userProfile.date_of_birth}</span>
            </div>
          ) : (
            <div className="flex items-center text-purple-300">
              <Calendar className="w-4 h-4 mr-3 text-purple-500" />
              <span className="text-sm">未设置出生日期</span>
            </div>
          )}
          
          {userProfile?.time_of_birth ? (
            <div className="flex items-center text-purple-200">
              <Clock className="w-4 h-4 mr-3 text-purple-400" />
              <span>出生时间：{userProfile.time_of_birth}</span>
            </div>
          ) : (
            <div className="flex items-center text-purple-300">
              <Clock className="w-4 h-4 mr-3 text-purple-500" />
              <span className="text-sm">未设置出生时间</span>
            </div>
          )}
          
          {userProfile?.place_of_birth ? (
            <div className="flex items-center text-purple-200">
              <MapPin className="w-4 h-4 mr-3 text-purple-400" />
              <span>出生地点：{userProfile.place_of_birth}</span>
            </div>
          ) : (
            <div className="flex items-center text-purple-300">
              <MapPin className="w-4 h-4 mr-3 text-purple-500" />
              <span className="text-sm">未设置出生地点</span>
            </div>
          )}
          
          {userProfile?.gender && (
            <div className="flex items-center text-purple-200">
              <Star className="w-4 h-4 mr-3 text-purple-400" />
              <span>性别：{userProfile.gender === 'male' ? '男' : '女'}</span>
            </div>
          )}
          
          {(!userProfile?.full_name || !userProfile?.date_of_birth || !userProfile?.time_of_birth || !userProfile?.place_of_birth) && (
            <div className="mt-4 p-3 bg-amber-900/30 border border-amber-500/50 rounded-lg">
              <p className="text-amber-200 text-sm">
                ✨ 完善个人信息可以获得更准确的占卜结果
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">成就徽章</h3>
        <div className="flex flex-wrap gap-2">
          {(userProfile?.total_sign_ins || 0) >= 1 && (
            <div className="bg-green-900/50 border border-green-500 rounded-full px-3 py-1 text-sm text-green-200">
              🌟 初次签到
            </div>
          )}
          {(userProfile?.sign_in_streak || 0) >= 7 && (
            <div className="bg-orange-900/50 border border-orange-500 rounded-full px-3 py-1 text-sm text-orange-200">
              🔥 连续一周
            </div>
          )}
          {(userProfile?.sign_in_streak || 0) >= 30 && (
            <div className="bg-purple-900/50 border border-purple-500 rounded-full px-3 py-1 text-sm text-purple-200">
              💎 连续一月
            </div>
          )}
          {(userProfile?.total_sign_ins || 0) >= 100 && (
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