import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { isSupabaseConfigured } from './lib/supabase'
import LoginForm from './components/Auth/LoginForm'
import RegisterForm from './components/Auth/RegisterForm'
import DailyCheckin from './components/DailyCheckin/DailyCheckin'
import WishWall from './components/WishWall/WishWall'
import UserProfile from './components/Profile/UserProfile'
// import GrowthRecord from './components/GrowthRecord/GrowthRecord'
// import Recommendations from './components/Recommendations/Recommendations'
// import FortuneReminders from './components/FortuneReminders/FortuneReminders'
import PrintPage from './components/PrintPage'


import FAQ from './components/FAQ/FAQ'
import ContactForm from './components/Contact/ContactForm'
import AuthDebug from './components/Debug/AuthDebug'
import { NetworkStatus } from './components/NetworkStatus'
import { NetworkErrorBoundary } from './components/NetworkErrorBoundary'
import { Button, Card, Loading } from './components/ui'

import App from './App' // Original fortune telling app
// import FortuneWebsite from './fortune_telling_website' // Web version
import { User, Calendar, Heart, Sparkles, Home, LogIn, TrendingUp, BookOpen, Bell, Globe, HelpCircle, Mail, Menu, X, Star, Crown, Share2 } from 'lucide-react'

function AuthWrapper() {
  const { user, loading } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-secondary-900 to-accent-900 flex items-center justify-center">
        <Loading 
          variant="spinner" 
          size="xl" 
          color="primary" 
          text="加载中..." 
          className="animate-fade-in"
        />
      </div>
    )
  }

  return (
    <NetworkErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-primary-900 via-secondary-900 to-accent-900">
        {/* Enhanced Navigation */}
        <nav className="bg-primary-900/80 backdrop-blur-md border-b border-primary-400/30 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-accent-500 to-primary-500 rounded-xl shadow-glow">
                  <img src="/logo.png" alt="算算乐 Logo" className="w-6 h-6 object-contain" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent">
                    算算乐
                  </h1>
                  <p className="text-xs text-purple-300 hidden sm:block">算出惊喜，乐见未来。</p>
                </div>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-2">
                {user ? (
                  <>
                    <NavButton to="/" icon={Home} label="占卜" />
                    {/* <NavButton to="/web" icon={Globe} label="Web版" /> */}
                    <NavButton to="/checkin" icon={Calendar} label="签到" />
                    <NavButton to="/wishes" icon={Heart} label="许愿墙" />
                    {/* <NavButton to="/growth" icon={TrendingUp} label="成长记录" /> */}
                    {/* <NavButton to="/recommendations" icon={BookOpen} label="个性化推荐" /> */}
                    {/* <NavButton to="/reminders" icon={Bell} label="命运提醒" /> */}
                    <NavButton to="/faq" icon={HelpCircle} label="FAQ" />
                    <NavButton to="/contact" icon={Mail} label="联系我们" />
                    <NavButton to="/profile" icon={User} label="个人" />
                  </>
                ) : (
                  <>
                    <NavButton to="/faq" icon={HelpCircle} label="FAQ" />
                    <NavButton to="/contact" icon={Mail} label="联系我们" />
                    <Button
                      onClick={() => setShowAuth(true)}
                      variant="primary"
                      size="md"
                      icon={<LogIn className="w-4 h-4" />}
                      className="ml-4 shadow-glow hover:shadow-glow-accent"
                    >
                      登录
                    </Button>
                  </>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="lg:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  icon={mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  className="text-white hover:bg-primary-800/50"
                />
              </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="lg:hidden animate-slide-down">
                <div className="px-2 pt-2 pb-3 space-y-1 bg-primary-800/50 rounded-xl mt-2 mb-4 backdrop-blur-sm">
                  {user ? (
                    <>
                      <MobileNavButton to="/" icon={Home} label="占卜" onClick={() => setMobileMenuOpen(false)} />
                      {/* <MobileNavButton to="/web" icon={Globe} label="Web版" onClick={() => setMobileMenuOpen(false)} /> */}
                      <MobileNavButton to="/checkin" icon={Calendar} label="签到" onClick={() => setMobileMenuOpen(false)} />
                      <MobileNavButton to="/wishes" icon={Heart} label="许愿墙" onClick={() => setMobileMenuOpen(false)} />
                      {/* <MobileNavButton to="/growth" icon={TrendingUp} label="成长记录" onClick={() => setMobileMenuOpen(false)} /> */}
                      {/* <MobileNavButton to="/recommendations" icon={BookOpen} label="个性化推荐" onClick={() => setMobileMenuOpen(false)} /> */}
                      {/* <MobileNavButton to="/reminders" icon={Bell} label="命运提醒" onClick={() => setMobileMenuOpen(false)} /> */}
                      <MobileNavButton to="/faq" icon={HelpCircle} label="FAQ" onClick={() => setMobileMenuOpen(false)} />
                      <MobileNavButton to="/contact" icon={Mail} label="联系我们" onClick={() => setMobileMenuOpen(false)} />
                      <MobileNavButton to="/profile" icon={User} label="个人" onClick={() => setMobileMenuOpen(false)} />
                    </>
                  ) : (
                    <>
                      <MobileNavButton to="/faq" icon={HelpCircle} label="FAQ" onClick={() => setMobileMenuOpen(false)} />
                      <MobileNavButton to="/contact" icon={Mail} label="联系我们" onClick={() => setMobileMenuOpen(false)} />
                      <div className="px-3 py-2">
                        <Button
                          onClick={() => {
                            setShowAuth(true)
                            setMobileMenuOpen(false)
                          }}
                          variant="primary"
                          size="md"
                          fullWidth
                          icon={<LogIn className="w-4 h-4" />}
                          className="shadow-glow"
                        >
                          登录
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main className="min-h-[calc(100vh-4rem)]">
          <NetworkStatus />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {user ? (
              <Routes>
                <Route path="/" element={<App />} />
                {/* <Route path="/web" element={<FortuneWebsite />} /> */}
                <Route path="/print" element={<PrintPageWrapper />} />
                <Route path="/checkin" element={<DailyCheckin />} />
                <Route path="/wishes" element={<WishWall />} />
                {/* <Route path="/growth" element={<GrowthRecord />} /> */}
                {/* <Route path="/recommendations" element={<Recommendations />} /> */}
                {/* <Route path="/reminders" element={<FortuneReminders />} /> */}
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<ContactForm />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            ) : (
              <Routes>
                <Route path="/" element={<GuestHome onShowAuth={() => setShowAuth(true)} />} />
                <Route path="/print" element={<PrintPageWrapper />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<ContactForm />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-primary-900/50 backdrop-blur-md border-t border-primary-400/30 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2 text-purple-300">
                <img src="/logo.png" alt="算算乐 Logo" className="w-4 h-4 object-contain" />
                <span className="text-sm font-medium">算算乐</span>
                <span className="text-xs text-purple-400">|</span>
                <span className="text-xs">算出惊喜，乐见未来。</span>
              </div>
              <div className="text-xs text-purple-400 space-y-1">
                <p>Created by Ango, 2025.</p>
                <a 
                  href="http://n-blog.angoango.dpdns.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-300 hover:text-purple-200 transition-colors underline"
                >
                  n-blog.angoango.dpdns.org
                </a>
              </div>
            </div>
          </div>
        </footer>

        {/* Enhanced Auth Modal */}
        {showAuth && !user && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="relative max-w-md w-full animate-scale-in">
              <Button
                onClick={() => setShowAuth(false)}
                variant="error"
                size="sm"
                className="absolute -top-4 -right-4 w-10 h-10 rounded-full z-10 shadow-strong"
                icon={<X className="w-4 h-4" />}
              />
              
              <Card variant="glass" padding="lg" className="shadow-strong">
                {authMode === 'login' ? (
                  <LoginForm onSwitchToRegister={() => setAuthMode('register')} />
                ) : (
                  <RegisterForm onSwitchToLogin={() => setAuthMode('login')} />
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </Router>
    </NetworkErrorBoundary>
  )
}

function NavButton({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <a
      href={to}
      className="flex items-center space-x-2 px-3 py-2 text-primary-200 hover:text-white hover:bg-primary-700/50 rounded-xl transition-all duration-300 font-medium"
      onClick={(e) => {
        e.preventDefault()
        window.history.pushState({}, '', to)
        window.dispatchEvent(new PopStateEvent('popstate'))
      }}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm">{label}</span>
    </a>
  )
}

function MobileNavButton({ to, icon: Icon, label, onClick }: { to: string; icon: any; label: string; onClick: () => void }) {
  return (
    <a
      href={to}
      className="flex items-center space-x-3 px-3 py-3 text-primary-200 hover:text-white hover:bg-primary-700/50 rounded-lg transition-all duration-300 font-medium"
      onClick={(e) => {
        e.preventDefault()
        onClick()
        window.history.pushState({}, '', to)
        window.dispatchEvent(new PopStateEvent('popstate'))
      }}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </a>
  )
}

function GuestHome({ onShowAuth }: { onShowAuth: () => void }) {
  return (
    <div className="animate-fade-in">
      {/* Debug Info - Only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-8">
          <AuthDebug />
        </div>
      )}
      
      <div className="text-center py-12 lg:py-20">
        {/* Logo and App Branding */}
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-gradient-to-r from-accent-500 to-primary-500 rounded-2xl shadow-glow animate-pulse-gentle">
            <img src="/logo.png" alt="算算乐 Logo" className="w-16 h-16 object-contain" />
          </div>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-6 animate-slide-up">
          欢迎来到算算乐
        </h1>
        <div className="space-y-2 mb-12">
          <p className="text-lg sm:text-xl text-white leading-relaxed animate-slide-up" style={{animationDelay: '0.1s'}}>
            算出惊喜，乐见未来。
          </p>
          <p className="text-lg sm:text-xl text-white leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
            加入我们，开启您的算命之旅
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12 max-w-6xl mx-auto">
          <FeatureCard 
            icon={<Star className="w-8 h-8" />} 
            title="多种占卜方式" 
            description="塔罗、星座、易经、八字等多种占卜方式，满足不同需求"
          />
          <FeatureCard 
            icon={<Calendar className="w-8 h-8" />} 
            title="每日签到" 
            description="每天签到获取专属运势，连续签到获得更多奖励"
          />
          <FeatureCard 
            icon={<Heart className="w-8 h-8" />} 
            title="许愿墙" 
            description="在许愿墙上写下心愿，与其他用户分享美好期待"
          />
          <FeatureCard 
            icon={<TrendingUp className="w-8 h-8" />} 
            title="成长记录" 
            description="记录每次占卜历程，追踪个人成长轨迹和命运变化"
          />
          <FeatureCard 
            icon={<BookOpen className="w-8 h-8" />} 
            title="个性化推荐" 
            description="基于占卜历史智能推荐相关内容，提升占卜体验"
          />
          <FeatureCard 
            icon={<Bell className="w-8 h-8" />} 
            title="命运提醒" 
            description="设置定期提醒，回顾占卜结果，感受命运的变化轨迹"
          />
          <FeatureCard 
            icon={<Crown className="w-8 h-8" />} 
            title="大师解读" 
            description="专业命理师一对一深度解读，获得更精准的人生指导"
          />
          <FeatureCard 
            icon={<Share2 className="w-8 h-8" />} 
            title="报告分享" 
            description="生成精美运势分析报告，一键分享到社交平台"
          />
        </div>
        
        <div className="animate-bounce-gentle">
          <Button
            onClick={onShowAuth}
            variant="primary"
            size="lg"
            className="px-8 py-4 text-lg font-semibold shadow-glow hover:shadow-glow-accent transform hover:scale-105 transition-all duration-300"
          >
            立即开始占卜之旅
          </Button>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {

  return (
    <Card 
      variant="glass" 
      padding="lg" 
      hover 
      className="group cursor-pointer border-primary-400/20 hover:border-primary-400/40 transition-all duration-300"
    >
      <div className="mb-4 text-purple-400 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-primary-300 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-primary-200 text-sm leading-relaxed group-hover:text-primary-100 transition-colors duration-300">
        {description}
      </p>
    </Card>
  )
}

// 打印页面包装器组件
function PrintPageWrapper() {
  React.useEffect(() => {
    const printData = sessionStorage.getItem('printData');
    if (!printData) {
      // 如果没有打印数据，重定向到首页
      window.location.href = '/';
    }
  }, []);

  const printData = sessionStorage.getItem('printData');
  
  if (!printData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">没有找到打印数据</h1>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const data = JSON.parse(printData);
  
  return (
    <PrintPage 
      userInput={data.userInput}
      result={data.result}
      plainLanguageResult={data.plainLanguageResult}
    />
  );
}

export default function AppWithAuth() {
  // 如果没有配置Supabase，直接以访客模式运行
  if (!isSupabaseConfigured) {
    return (
      <AuthProvider>
        <AuthWrapper />
      </AuthProvider>
    )
  }

  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  )
}