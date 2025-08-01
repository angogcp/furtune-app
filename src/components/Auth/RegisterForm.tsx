import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Mail, Lock, User, Eye, EyeOff, UserPlus } from 'lucide-react'

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validation
    if (password !== confirmPassword) {
      setError('密码确认不匹配')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('密码长度至少6位')
      setLoading(false)
      return
    }

    if (username.length < 2) {
      setError('用户名长度至少2位')
      setLoading(false)
      return
    }

    const { error } = await signUp(email, password, username)
    if (error) {
      setError(error)
    } else {
      setSuccess('注册成功！请检查邮箱验证链接。')
    }

    setLoading(false)
  }

  return (
    <div className="bg-purple-900/50 rounded-lg p-8 border border-purple-400/30 max-w-md mx-auto">
      <div className="text-center mb-6">
        <UserPlus className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
        <h2 className="text-2xl font-bold text-white mb-2">创建账户</h2>
        <p className="text-purple-200">加入我们的占卜社区</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            用户名
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-purple-800/50 border border-purple-600 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
              placeholder="请输入用户名"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            邮箱地址
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-purple-800/50 border border-purple-600 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
              placeholder="请输入邮箱地址"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            密码
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 bg-purple-800/50 border border-purple-600 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
              placeholder="请输入密码（至少6位）"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-200"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            确认密码
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 bg-purple-800/50 border border-purple-600 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
              placeholder="请再次输入密码"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-200"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-3">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-900/50 border border-green-500 rounded-lg p-3">
            <p className="text-green-200 text-sm">{success}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 rounded-lg font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed"
        >
          {loading ? '注册中...' : '注册'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-purple-200">
          已有账户？{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-yellow-400 hover:text-yellow-300 font-medium"
          >
            立即登录
          </button>
        </p>
      </div>
    </div>
  )
}