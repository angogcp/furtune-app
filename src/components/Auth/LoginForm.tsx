import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import { Button, Input, Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui'

interface LoginFormProps {
  onSwitchToRegister: () => void
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await signIn(email, password)
    if (error) {
      setError(error)
    }

    setLoading(false)
  }

  return (
    <div className="animate-scale-in">
      <Card variant="glass" padding="lg" className="max-w-md mx-auto shadow-strong border-primary-400/30">
        <CardHeader className="text-center">
          <div className="animate-bounce-gentle mb-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-accent-500 to-primary-500 rounded-2xl flex items-center justify-center shadow-glow">
              <LogIn className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white mb-2 animate-slide-up">
            欢迎回来
          </CardTitle>
          <p className="text-primary-200 animate-slide-up" style={{animationDelay: '0.1s'}}>
            登录您的占卜账户
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
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

            <div className="animate-slide-up" style={{animationDelay: '0.3s'}}>
              <Input
                type={showPassword ? 'text' : 'password'}
                label="密码"
                placeholder="请输入密码"
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

            {error && (
              <div className="animate-slide-down bg-error-900/50 border border-error-500/50 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-error-200 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 shadow-glow hover:shadow-glow-accent transform hover:scale-[1.02] transition-all duration-300"
              >
                {loading ? '登录中...' : '登录'}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <div className="animate-fade-in" style={{animationDelay: '0.5s'}}>
            <p className="text-primary-200 text-center">
              还没有账户？{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-accent-400 hover:text-accent-300 font-medium transition-colors duration-200 hover:underline"
              >
                立即注册
              </button>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}