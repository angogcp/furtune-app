import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface LoginFormProps {
  onSwitchToRegister: () => void
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn, signInAnonymously } = useAuth()

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

  const handleGuestLogin = async () => {
    setLoading(true)
    setError('')

    const { error } = await signInAnonymously()
    if (error) {
      setError(error)
    }

    setLoading(false)
  }

  return (
    <div className="bg-purple-900/50 rounded-lg p-8 border border-purple-400/30 max-w-md mx-auto">
      <div className="text-center mb-6">
        <LogIn className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
        <h2 className="text-2xl font-bold text-white mb-2">{t('auth.welcomeBack')}</h2>
        <p className="text-purple-200">{t('auth.loginSubtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">{t('auth.email')}</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-purple-800/50 border border-purple-600 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
              placeholder={t('auth.emailPlaceholder')}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">{t('auth.password')}</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 bg-purple-800/50 border border-purple-600 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
              placeholder={t('auth.passwordPlaceholder')}
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

        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-3">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 rounded-lg font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed"
        >
          {loading ? t('auth.loggingIn') : t('auth.login')}
        </button>

        <button
          type="button"
          onClick={handleGuestLogin}
          disabled={loading}
          className="w-full py-3 px-4 mt-3 bg-purple-800/60 hover:bg-purple-700/60 disabled:bg-gray-700/60 border border-purple-600 rounded-lg font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed"
        >
          {loading ? t('auth.guestLoggingIn') : t('auth.guestLogin')}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-purple-200">
          {t('auth.noAccount')}{' '}
          <button onClick={onSwitchToRegister} className="text-yellow-400 hover:text-yellow-300 font-medium">
            {t('auth.registerNow')}
          </button>
        </p>
      </div>
    </div>
  )
}
