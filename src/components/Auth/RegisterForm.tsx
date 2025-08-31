import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Mail, Lock, User, Eye, EyeOff, UserPlus } from 'lucide-react'
import { Button, Input, Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui'

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
    <div className="animate-scale-in">
      <Card variant="glass" padding="lg" className="max-w-md mx-auto shadow-strong border-primary-400/30">
        <CardHeader className="text-center">
          <div className="animate-bounce-gentle mb-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-accent-500 to-primary-500 rounded-2xl flex items-center justify-center shadow-glow">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white mb-2 animate-slide-up">
            创建账户
          </CardTitle>
          <p className="text-primary-200 animate-slide-up" style={{animationDelay: '0.1s'}}>
            加入我们的占卜社区
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
              <Input
                type="text"
                label="用户名"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
                variant="filled"
                inputSize="lg"
                required
                className="bg-primary-800/30 border-primary-600/50 focus:border-accent-400 focus:ring-accent-400/20"
              />
            </div>

            <div className="animate-slide-up" style={{animationDelay: '0.3s'}}>
              <Input
                type="email"
                label="邮箱地址"
                placeholder="请输入邮箱地址"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                variant="filled"
                inputSize="lg"
                required
                className="bg-primary-800/30 border-primary-600/50 focus:border-accent-400 focus:ring-accent-400/20"
              />
            </div>

            <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
              <Input
                type={showPassword ? 'text' : 'password'}
                label="密码"
                placeholder="请输入密码（至少6位）"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-primary-400 hover:text-primary-200 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                variant="filled"
                inputSize="lg"
                required
                className="bg-primary-800/30 border-primary-600/50 focus:border-accent-400 focus:ring-accent-400/20"
              />
            </div>

            <div className="animate-slide-up" style={{animationDelay: '0.5s'}}>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                label="确认密码"
                placeholder="请再次输入密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-primary-400 hover:text-primary-200 transition-colors duration-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                variant="filled"
                inputSize="lg"
                required
                className="bg-primary-800/30 border-primary-600/50 focus:border-accent-400 focus:ring-accent-400/20"
              />
            </div>

            {error && (
              <div className="animate-slide-down bg-error-900/50 border border-error-500/50 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-error-200 text-sm font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="animate-slide-down bg-success-900/50 border border-success-500/50 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-success-200 text-sm font-medium">{success}</p>
              </div>
            )}

            <div className="animate-slide-up" style={{animationDelay: '0.6s'}}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 shadow-glow hover:shadow-glow-accent transform hover:scale-[1.02] transition-all duration-300"
              >
                {loading ? '注册中...' : '注册'}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <div className="animate-fade-in" style={{animationDelay: '0.7s'}}>
            <p className="text-primary-200 text-center">
              已有账户？{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-accent-400 hover:text-accent-300 font-medium transition-colors duration-200 hover:underline"
              >
                立即登录
              </button>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}