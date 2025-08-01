import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { isSupabaseConfigured } from './lib/supabase'
import LoginForm from './components/Auth/LoginForm'
import RegisterForm from './components/Auth/RegisterForm'
import DailyCheckin from './components/DailyCheckin/DailyCheckin'
import WishWall from './components/WishWall/WishWall'
import UserProfile from './components/Profile/UserProfile'
import GrowthRecord from './components/GrowthRecord/GrowthRecord'
import Recommendations from './components/Recommendations/Recommendations'
import FortuneReminders from './components/FortuneReminders/FortuneReminders'
import MasterConsultation from './components/MasterConsultation/MasterConsultation'
import ReportShare from './components/ReportShare/ReportShare'
import AuthDebug from './components/Debug/AuthDebug'
import { NetworkStatus } from './components/NetworkStatus'

import App from './App' // Original fortune telling app
import FortuneWebsite from './fortune_telling_website' // Web version
import { User, Calendar, Heart, Sparkles, Home, LogIn, AlertTriangle, TrendingUp, BookOpen, Bell, Crown, Share2, Globe } from 'lucide-react'

function AuthWrapper() {
  const { user, loading } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-yellow-400 animate-spin" />
          <p className="text-white text-xl">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <NetworkStatus />
        {/* Navigation */}
        <nav className="bg-purple-900/50 border-b border-purple-400/30 p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-yellow-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                神秘占卜馆
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <NavButton to="/" icon={Home} label="占卜" />
                  <NavButton to="/web" icon={Globe} label="Web版" />
                  <NavButton to="/checkin" icon={Calendar} label="签到" />
                  <NavButton to="/wishes" icon={Heart} label="许愿墙" />
                  <NavButton to="/growth" icon={TrendingUp} label="成长记录" />
                  <NavButton to="/recommendations" icon={BookOpen} label="个性化推荐" />
                  <NavButton to="/reminders" icon={Bell} label="命运提醒" />
                  <NavButton to="/master" icon={Crown} label="大师解读" />
                  <NavButton to="/report" icon={Share2} label="报告分享" />
                  <NavButton to="/profile" icon={User} label="个人" />
                </>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-medium text-white transition-all duration-300"
                >
                  <LogIn className="w-5 h-5" />
                  <span>登录</span>
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="p-4">
          {user ? (
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/web" element={<FortuneWebsite />} />
              <Route path="/checkin" element={<DailyCheckin />} />
              <Route path="/wishes" element={<WishWall />} />
              <Route path="/growth" element={<GrowthRecord />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/reminders" element={<FortuneReminders />} />
                <Route path="/master" element={<MasterConsultation />} />
                <Route path="/report" element={<ReportShare />} />
                <Route path="/profile" element={<UserProfile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/" element={<GuestHome onShowAuth={() => setShowAuth(true)} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </div>

        {/* Auth Modal */}
        {showAuth && !user && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="relative max-w-md w-full">
              <button
                onClick={() => setShowAuth(false)}
                className="absolute -top-4 -right-4 w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white z-10"
              >
                ×
              </button>
              
              {authMode === 'login' ? (
                <LoginForm onSwitchToRegister={() => setAuthMode('register')} />
              ) : (
                <RegisterForm onSwitchToLogin={() => setAuthMode('login')} />
              )}
            </div>
          </div>
        )}
      </div>
    </Router>
  )
}

function NavButton({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <a
      href={to}
      className="flex items-center space-x-2 px-3 py-2 text-purple-200 hover:text-white hover:bg-purple-700/50 rounded-lg transition-all duration-300"
      onClick={(e) => {
        e.preventDefault()
        window.history.pushState({}, '', to)
        window.dispatchEvent(new PopStateEvent('popstate'))
      }}
    >
      <Icon className="w-5 h-5" />
      <span className="hidden md:inline">{label}</span>
    </a>
  )
}

function GuestHome({ onShowAuth }: { onShowAuth: () => void }) {
  return (
    <div className="max-w-4xl mx-auto">
      <NetworkStatus />
      {/* Debug Info */}
      <div className="mb-8">
        <AuthDebug />
      </div>
      
      <div className="text-center py-16">
        <Sparkles className="w-24 h-24 mx-auto mb-8 text-yellow-400" />
        <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent mb-6">
          欢迎来到神秘占卜馆
        </h1>
        <p className="text-xl text-purple-200 mb-8 leading-relaxed">
          探索命运奥秘，指引人生方向<br />
          加入我们，开启您的神秘之旅
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-purple-900/50 rounded-lg p-6 border border-purple-400/30">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
          <h3 className="text-xl font-semibold text-white mb-2">多种占卜方式</h3>
          <p className="text-purple-200">塔罗、星座、易经、八字等多种占卜方式，满足不同需求</p>
        </div>
        
        <div className="bg-purple-900/50 rounded-lg p-6 border border-purple-400/30">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-blue-400" />
          <h3 className="text-xl font-semibold text-white mb-2">每日签到</h3>
          <p className="text-purple-200">每天签到获取专属运势，连续签到获得更多奖励</p>
        </div>
        
        <div className="bg-purple-900/50 rounded-lg p-6 border border-purple-400/30">
          <Heart className="w-12 h-12 mx-auto mb-4 text-pink-400" />
          <h3 className="text-xl font-semibold text-white mb-2">许愿墙</h3>
          <p className="text-purple-200">在许愿墙上写下心愿，与其他用户分享美好期待</p>
        </div>
        
        <div className="bg-purple-900/50 rounded-lg p-6 border border-purple-400/30">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-400" />
          <h3 className="text-xl font-semibold text-white mb-2">成长记录</h3>
          <p className="text-purple-200">记录每次占卜历程，追踪个人成长轨迹和命运变化</p>
        </div>
        
        <div className="bg-purple-900/50 rounded-lg p-6 border border-purple-400/30">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-indigo-400" />
          <h3 className="text-xl font-semibold text-white mb-2">个性化推荐</h3>
          <p className="text-purple-200">基于占卜历史智能推荐相关内容，提升占卜体验</p>
        </div>
        
        <div className="bg-purple-900/50 rounded-lg p-6 border border-purple-400/30">
          <Bell className="w-12 h-12 mx-auto mb-4 text-orange-400" />
          <h3 className="text-xl font-semibold text-white mb-2">命运提醒</h3>
          <p className="text-purple-200">设置定期提醒，回顾占卜结果，感受命运的变化轨迹</p>
        </div>
        
        <div className="bg-purple-900/50 rounded-lg p-6 border border-purple-400/30">
          <Crown className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
          <h3 className="text-xl font-semibold text-white mb-2">大师解读</h3>
          <p className="text-purple-200">专业命理师一对一深度解读，获得更精准的人生指导</p>
        </div>
        
        <div className="bg-purple-900/50 rounded-lg p-6 border border-purple-400/30">
          <Share2 className="w-12 h-12 mx-auto mb-4 text-green-400" />
          <h3 className="text-xl font-semibold text-white mb-2">报告分享</h3>
          <p className="text-purple-200">生成精美运势分析报告，一键分享到社交平台</p>
        </div>
        </div>
        
        <button
          onClick={onShowAuth}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold text-white text-lg transition-all duration-300 transform hover:scale-105"
        >
          立即开始占卜之旅
         </button>
       </div>
 
     </div>
  )
}

export default function AppWithAuth() {
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-purple-900/50 rounded-lg p-6 border border-purple-400/30 text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white mb-4">配置提示</h2>
          <p className="text-purple-200 mb-4">
            请配置 Supabase 环境变量以启用完整功能：
          </p>
          <div className="text-left bg-black/30 rounded p-3 mb-4 text-sm font-mono">
            <div className="text-green-400">VITE_SUPABASE_URL=your_supabase_url</div>
            <div className="text-green-400">VITE_SUPABASE_ANON_KEY=your_anon_key</div>
          </div>
          <p className="text-purple-200 text-sm">
            配置完成后重新启动应用即可使用登录、签到、许愿墙等功能。
          </p>
        </div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  )
}