import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useProfile } from '../../contexts/ProfileContext'
import { User, Mail, Calendar, Award, Flame, Star, LogOut, Edit, Save, X, UserCircle } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default function UserProfile() {
  const { user, userProfile, signOut } = useAuth()
  const { profile, updateProfile, isProfileComplete } = useProfile()
  
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState(userProfile?.username || '')
  const [loading, setLoading] = useState(false)
  
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: profile.name,
    birthDate: profile.birthDate,
    birthTime: profile.birthTime,
    birthPlace: profile.birthPlace,
    gender: profile.gender
  })
  
  // Update form when profile changes
  React.useEffect(() => {
    setProfileForm({
      name: profile.name,
      birthDate: profile.birthDate,
      birthTime: profile.birthTime,
      birthPlace: profile.birthPlace,
      gender: profile.gender
    })
  }, [profile])
  
  // Profile management functions
  const handleSaveProfile = () => {
    updateProfile(profileForm)
    setIsEditingProfile(false)
  }
  
  const handleCancelProfileEdit = () => {
    setProfileForm({
      name: profile.name,
      birthDate: profile.birthDate,
      birthTime: profile.birthTime,
      birthPlace: profile.birthPlace,
      gender: profile.gender
    })
    setIsEditingProfile(false)
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

  if (!user) {
    // Show only fortune-telling profile for unauthenticated users
    return (
      <div className="space-y-6">
        {/* Fortune-telling Profile Section */}
        <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-lg p-6 border border-purple-400/30">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <UserCircle className="w-6 h-6 text-purple-300 mr-3" />
              <h3 className="text-xl font-bold text-white">占卜资料</h3>
            </div>
            <button
              onClick={() => setIsEditingProfile(true)}
              className="p-2 text-purple-300 hover:text-white hover:bg-purple-700/50 rounded-lg transition-all duration-300"
              title="编辑占卜资料"
            >
              <Edit className="w-5 h-5" />
            </button>
          </div>
          
          {isProfileComplete ? (
            <div className="space-y-3">
              <div className="flex items-center text-purple-200">
                <span className="text-yellow-400 w-20 font-medium">姓名：</span>
                <span>{profile.name}</span>
              </div>
              <div className="flex items-center text-purple-200">
                <span className="text-yellow-400 w-20 font-medium">出生日期：</span>
                <span>{profile.birthDate}</span>
              </div>
              <div className="flex items-center text-purple-200">
                <span className="text-yellow-400 w-20 font-medium">出生时间：</span>
                <span>{profile.birthTime || '未设置'}</span>
              </div>
              <div className="flex items-center text-purple-200">
                <span className="text-yellow-400 w-20 font-medium">出生地点：</span>
                <span>{profile.birthPlace || '未设置'}</span>
              </div>
              <div className="flex items-center text-purple-200">
                <span className="text-yellow-400 w-20 font-medium">性别：</span>
                <span>{profile.gender === 'male' ? '男' : profile.gender === 'female' ? '女' : '未设置'}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <UserCircle className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <p className="text-purple-300 mb-4">完善占卜资料以获得更精准的占卜结果</p>
              <button
                onClick={() => setIsEditingProfile(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-medium transition-all duration-300"
              >
                设置占卜资料
              </button>
            </div>
          )}
        </div>
        
        {/* Login Suggestion */}
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-6 border border-purple-400/30 text-center">
          <h3 className="text-lg font-bold text-white mb-3">{t('profile.login.title')}</h3>
          <p className="text-purple-200 mb-4">{t('profile.login.desc')}</p>
          <button
            onClick={() => {
              // Navigate back to home where login modal can be triggered
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-medium transition-all duration-300"
          >
            返回首页登录
          </button>
        </div>
        
        {/* Profile Edit Modal for Unauthenticated Users */}
        {isEditingProfile && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-purple-900/95 rounded-xl p-6 max-w-md w-full border border-purple-400/30 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">编辑占卜资料</h3>
                <button
                  onClick={handleCancelProfileEdit}
                  className="p-2 text-purple-300 hover:text-white hover:bg-purple-700/50 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">姓名 *</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-800/50 border border-purple-600 rounded-lg text-white placeholder-purple-400 focus:border-yellow-400 focus:outline-none"
                    placeholder="请输入您的姓名"
                  />
                </div>
                
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">出生日期 *</label>
                  <input
                    type="date"
                    value={profileForm.birthDate}
                    onChange={(e) => setProfileForm({ ...profileForm, birthDate: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-800/50 border border-purple-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">出生时间</label>
                  <input
                    type="time"
                    value={profileForm.birthTime}
                    onChange={(e) => setProfileForm({ ...profileForm, birthTime: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-800/50 border border-purple-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                  />
                  <p className="text-xs text-purple-400 mt-1">出生时间对八字命理等占卜方法很重要</p>
                </div>
                
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">出生地点</label>
                  <input
                    type="text"
                    value={profileForm.birthPlace}
                    onChange={(e) => setProfileForm({ ...profileForm, birthPlace: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-800/50 border border-purple-600 rounded-lg text-white placeholder-purple-400 focus:border-yellow-400 focus:outline-none"
                    placeholder="如：北京市"
                  />
                </div>
                
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">性别 *</label>
                  <select
                    value={profileForm.gender}
                    onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value as 'male' | 'female' | '' })}
                    className="w-full px-3 py-2 bg-purple-800/50 border border-purple-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                  >
                    <option value="">请选择性别</option>
                    <option value="male">男</option>
                    <option value="female">女</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  保存
                </button>
                <button
                  onClick={handleCancelProfileEdit}
                  className="flex-1 py-3 bg-purple-700/50 hover:bg-purple-600/50 rounded-lg font-semibold text-white transition-all duration-300"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }



  return (
    <div className="space-y-6">
      {/* Account Profile Section */}
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
                    setUsername(userProfile?.username || '')
                  }}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm text-white"
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{userProfile?.username || user?.email}</h2>
              <button
                onClick={() => setIsEditing(true)}
                className="text-purple-300 hover:text-purple-200 text-sm flex items-center mx-auto"
              >
                <Edit className="w-4 h-4 mr-1" />
                编辑用户名
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
      
      {/* Fortune-telling Profile Section */}
      <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-lg p-6 border border-purple-400/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <UserCircle className="w-6 h-6 text-purple-300 mr-3" />
            <h3 className="text-xl font-bold text-white">占卜资料</h3>
          </div>
          <button
            onClick={() => setIsEditingProfile(true)}
            className="p-2 text-purple-300 hover:text-white hover:bg-purple-700/50 rounded-lg transition-all duration-300"
            title="编辑占卜资料"
          >
            <Edit className="w-5 h-5" />
          </button>
        </div>
        
        {isProfileComplete ? (
          <div className="space-y-3">
            <div className="flex items-center text-purple-200">
              <span className="text-yellow-400 w-20 font-medium">姓名：</span>
              <span>{profile.name}</span>
            </div>
            <div className="flex items-center text-purple-200">
              <span className="text-yellow-400 w-20 font-medium">出生日期：</span>
              <span>{profile.birthDate}</span>
            </div>
            <div className="flex items-center text-purple-200">
              <span className="text-yellow-400 w-20 font-medium">出生时间：</span>
              <span>{profile.birthTime || '未设置'}</span>
            </div>
            <div className="flex items-center text-purple-200">
              <span className="text-yellow-400 w-20 font-medium">出生地点：</span>
              <span>{profile.birthPlace || '未设置'}</span>
            </div>
            <div className="flex items-center text-purple-200">
              <span className="text-yellow-400 w-20 font-medium">性别：</span>
              <span>{profile.gender === 'male' ? '男' : profile.gender === 'female' ? '女' : '未设置'}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <UserCircle className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <p className="text-purple-300 mb-4">完善占卜资料以获得更精准的占卜结果</p>
            <button
              onClick={() => setIsEditingProfile(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-medium transition-all duration-300"
            >
              设置占卜资料
            </button>
          </div>
        )}
      </div>
      
      {/* Profile Edit Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-purple-900/95 rounded-xl p-6 max-w-md w-full border border-purple-400/30 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">编辑占卜资料</h3>
              <button
                onClick={handleCancelProfileEdit}
                className="p-2 text-purple-300 hover:text-white hover:bg-purple-700/50 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">姓名 *</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-purple-800/50 border border-purple-600 rounded-lg text-white placeholder-purple-400 focus:border-yellow-400 focus:outline-none"
                  placeholder="请输入您的姓名"
                />
              </div>
              
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">出生日期 *</label>
                <input
                  type="date"
                  value={profileForm.birthDate}
                  onChange={(e) => setProfileForm({ ...profileForm, birthDate: e.target.value })}
                  className="w-full px-3 py-2 bg-purple-800/50 border border-purple-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">出生时间</label>
                <input
                  type="time"
                  value={profileForm.birthTime}
                  onChange={(e) => setProfileForm({ ...profileForm, birthTime: e.target.value })}
                  className="w-full px-3 py-2 bg-purple-800/50 border border-purple-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                />
                <p className="text-xs text-purple-400 mt-1">出生时间对八字命理等占卜方法很重要</p>
              </div>
              
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">出生地点</label>
                <input
                  type="text"
                  value={profileForm.birthPlace}
                  onChange={(e) => setProfileForm({ ...profileForm, birthPlace: e.target.value })}
                  className="w-full px-3 py-2 bg-purple-800/50 border border-purple-600 rounded-lg text-white placeholder-purple-400 focus:border-yellow-400 focus:outline-none"
                  placeholder="如：北京市"
                />
              </div>
              
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">性别 *</label>
                <select
                  value={profileForm.gender}
                  onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value as 'male' | 'female' | '' })}
                  className="w-full px-3 py-2 bg-purple-800/50 border border-purple-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                >
                  <option value="">请选择性别</option>
                  <option value="male">男</option>
                  <option value="female">女</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleSaveProfile}
                className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center"
              >
                <Save className="w-4 h-4 mr-2" />
                保存
              </button>
              <button
                onClick={handleCancelProfileEdit}
                className="flex-1 py-3 bg-purple-700/50 hover:bg-purple-600/50 rounded-lg font-semibold text-white transition-all duration-300"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
