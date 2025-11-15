import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { Calendar, Gift, Star, Flame, Trophy } from 'lucide-react'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'

interface CheckinData {
  hasCheckedToday: boolean
  streak: number
  totalCheckins: number
  todaysFortune: string | null
}

export default function DailyCheckin() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [checkinData, setCheckinData] = useState<CheckinData>({
    hasCheckedToday: false,
    streak: 0,
    totalCheckins: 0,
    todaysFortune: null
  })
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    if (user) {
      loadCheckinData()
    }
  }, [user])

  const loadCheckinData = async () => {
    if (!user) return

    try {
      // Check today's checkin
      const today = format(new Date(), 'yyyy-MM-dd')
      const { data: todayCheckin } = await supabase
        .from('sign_ins')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      // Get user's streak and total checkins
      const { data: userData } = await supabase
        .from('users')
        .select('sign_in_streak, total_sign_ins')
        .eq('id', user.id)
        .single()

      // Get today's fortune if exists
      const { data: fortuneData } = await supabase
        .from('daily_fortunes')
        .select('fortune_content')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      setCheckinData({
        hasCheckedToday: !!todayCheckin,
        streak: userData?.sign_in_streak || 0,
        totalCheckins: userData?.total_sign_ins || 0,
        todaysFortune: fortuneData?.fortune_content || null
      })
    } catch (error) {
      console.error('Error loading checkin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateDailyFortune = () => {
    const fortunes = t('daily.fortunes', { returnObjects: true }) as string[]
    const list = Array.isArray(fortunes) && fortunes.length > 0 ? fortunes : []
    const fallback = [
      '今日运势良好，保持积极心态。'
    ]
    const pool = list.length ? list : fallback
    const randomIndex = Math.floor(Math.random() * pool.length)
    return pool[randomIndex]
  }

  const handleCheckin = async () => {
    if (!user || checkinData.hasCheckedToday) return

    setChecking(true)
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const yesterday = format(new Date(Date.now() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd')

      // Check if user checked in yesterday
      const { data: yesterdayCheckin } = await supabase
        .from('sign_ins')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', yesterday)
        .single()

      const newStreak = yesterdayCheckin ? checkinData.streak + 1 : 1
      const newTotal = checkinData.totalCheckins + 1

      // Insert today's checkin
      await supabase
        .from('sign_ins')
        .insert({
          user_id: user.id,
          date: today,
          created_at: new Date().toISOString()
        })

      // Update user's streak and total
      await supabase
        .from('users')
        .update({
          sign_in_streak: newStreak,
          total_sign_ins: newTotal,
          last_sign_in: new Date().toISOString()
        })
        .eq('id', user.id)

      // Generate and save today's fortune
      const fortune = generateDailyFortune()
      await supabase
        .from('daily_fortunes')
        .insert({
          user_id: user.id,
          date: today,
          fortune_type: 'daily',
          fortune_content: fortune,
          created_at: new Date().toISOString()
        })

      setCheckinData({
        hasCheckedToday: true,
        streak: newStreak,
        totalCheckins: newTotal,
        todaysFortune: fortune
      })
    } catch (error) {
      console.error('Error during checkin:', error)
    } finally {
      setChecking(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-purple-900/50 rounded-lg p-6 border border-purple-400/30">
        <div className="animate-pulse">
          <div className="h-6 bg-purple-700 rounded mb-4"></div>
          <div className="h-20 bg-purple-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-6 border border-purple-400/30">
      <div className="text-center mb-6">
        <Calendar className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
        <h2 className="text-2xl font-bold text-white mb-2">{t('daily.title')}</h2>
        <p className="text-purple-200">{t('daily.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-purple-800/30 rounded-lg p-4 text-center">
          <Flame className="w-8 h-8 mx-auto mb-2 text-orange-400" />
          <div className="text-2xl font-bold text-white">{checkinData.streak}</div>
          <div className="text-sm text-purple-200">{t('daily.stats.streak')}</div>
        </div>
        
        <div className="bg-purple-800/30 rounded-lg p-4 text-center">
          <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
          <div className="text-2xl font-bold text-white">{checkinData.totalCheckins}</div>
          <div className="text-sm text-purple-200">{t('daily.stats.total')}</div>
        </div>
        
        <div className="bg-purple-800/30 rounded-lg p-4 text-center">
          <Star className="w-8 h-8 mx-auto mb-2 text-pink-400" />
          <div className="text-2xl font-bold text-white">
            {checkinData.hasCheckedToday ? t('daily.status.checked') : t('daily.status.notChecked')}
          </div>
          <div className="text-sm text-purple-200">{t('daily.stats.status')}</div>
        </div>
      </div>

      {!checkinData.hasCheckedToday ? (
        <button
          onClick={handleCheckin}
          disabled={checking}
          className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-600 rounded-lg font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed mb-4"
        >
          {checking ? t('daily.checking') : (
            <>
              <Gift className="w-5 h-5 inline mr-2" />
              {t('daily.checkButton')}
            </>
          )}
        </button>
      ) : (
        <div className="bg-green-900/50 border border-green-500 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-center text-green-200">
            <Gift className="w-5 h-5 mr-2" />
            {t('daily.checkedToday')}
          </div>
        </div>
      )}

      {checkinData.todaysFortune && (
        <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-400 mb-2 flex items-center">
            <Star className="w-5 h-5 mr-2" />
            {t('daily.fortuneTitle')}
          </h3>
          <p className="text-yellow-100">{checkinData.todaysFortune}</p>
        </div>
      )}
    </div>
  )
}
