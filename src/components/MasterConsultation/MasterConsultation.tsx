import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Star, Clock, MessageCircle, Crown, User, Calendar, CreditCard } from 'lucide-react'

interface Master {
  id: string
  name: string
  avatar: string
  specialties: string[]
  rating: number
  experience_years: number
  consultation_count: number
  price_per_session: number
  is_online: boolean
  description: string
}

interface ConsultationSession {
  id: string
  master_id: string
  user_id: string
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  created_at: string
  scheduled_at: string
  duration_minutes: number
  price: number
  topic: string
  notes?: string
}

const MasterConsultation: React.FC = () => {
  const { user } = useAuth()
  const [masters, setMasters] = useState<Master[]>([])
  const [sessions, setSessions] = useState<ConsultationSession[]>([])
  const [selectedMaster, setSelectedMaster] = useState<Master | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [bookingForm, setBookingForm] = useState({
    topic: '',
    scheduled_date: '',
    scheduled_time: '',
    duration: 30,
    notes: ''
  })

  useEffect(() => {
    fetchMasters()
    if (user) {
      fetchUserSessions()
    }
  }, [user])

  const fetchMasters = async () => {
    try {
      const { data, error } = await supabase
        .from('masters')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false })

      if (error) throw error
      setMasters(data || [])
    } catch (error) {
      console.error('获取大师列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserSessions = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('consultation_sessions')
        .select(`
          *,
          masters (name, avatar)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSessions(data || [])
    } catch (error) {
      console.error('获取咨询记录失败:', error)
    }
  }

  const handleBookConsultation = async () => {
    if (!user || !selectedMaster) return

    try {
      const scheduledDateTime = new Date(`${bookingForm.scheduled_date}T${bookingForm.scheduled_time}`)
      
      const { error } = await supabase
        .from('consultation_sessions')
        .insert({
          master_id: selectedMaster.id,
          user_id: user.id,
          topic: bookingForm.topic,
          scheduled_at: scheduledDateTime.toISOString(),
          duration_minutes: bookingForm.duration,
          price: selectedMaster.price_per_session,
          notes: bookingForm.notes,
          status: 'pending'
        })
        .select()
        .single()

      if (error) throw error

      // 这里可以集成支付系统
      alert('预约成功！请等待大师确认。')
      setShowBookingModal(false)
      setBookingForm({ topic: '', scheduled_date: '', scheduled_time: '', duration: 30, notes: '' })
      fetchUserSessions()
    } catch (error) {
      console.error('预约失败:', error)
      alert('预约失败，请稍后重试')
    }
  }

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: '待确认',
      active: '进行中',
      completed: '已完成',
      cancelled: '已取消'
    }
    return statusMap[status as keyof typeof statusMap] || status
  }



  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">大师解读</h1>
          <p className="text-gray-600">专业命理师为您提供深度解读服务</p>
        </div>

        {/* 大师列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {masters.map((master) => (
            <div key={master.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <img
                  src={master.avatar || '/default-avatar.png'}
                  alt={master.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                    {master.name}
                    <Crown className="w-5 h-5 text-yellow-500 ml-2" />
                  </h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>{master.rating.toFixed(1)}</span>
                    <span className="mx-2">•</span>
                    <span>{master.experience_years}年经验</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  {master.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm line-clamp-3">{master.description}</p>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  <span>{master.consultation_count}次咨询</span>
                </div>
                <div className={`flex items-center text-sm ${
                  master.is_online ? 'text-green-600' : 'text-gray-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    master.is_online ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  {master.is_online ? '在线' : '离线'}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-purple-600">
                  ¥{master.price_per_session}/次
                </div>
                <button
                  onClick={() => {
                    setSelectedMaster(master)
                    setShowBookingModal(true)
                  }}
                  disabled={!master.is_online}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  立即预约
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 我的咨询记录 */}
        {user && sessions.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">我的咨询记录</h2>
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="font-medium">{(session as any).masters?.name}</span>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                      {getStatusText(session.status)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <div className="flex items-center mb-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{new Date(session.scheduled_at).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{session.duration_minutes}分钟</span>
                      <span className="mx-2">•</span>
                      <CreditCard className="w-4 h-4 mr-1" />
                      <span>¥{session.price}</span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">咨询主题：</span>
                    <span className="text-gray-600">{session.topic}</span>
                  </div>
                  {session.notes && (
                    <div className="text-sm mt-2">
                      <span className="font-medium">备注：</span>
                      <span className="text-gray-600">{session.notes}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 预约弹窗 */}
      {showBookingModal && selectedMaster && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">预约 {selectedMaster.name}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  咨询主题 *
                </label>
                <input
                  type="text"
                  value={bookingForm.topic}
                  onChange={(e) => setBookingForm({ ...bookingForm, topic: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="请输入您想咨询的问题"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    预约日期 *
                  </label>
                  <input
                    type="date"
                    value={bookingForm.scheduled_date}
                    onChange={(e) => setBookingForm({ ...bookingForm, scheduled_date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    预约时间 *
                  </label>
                  <input
                    type="time"
                    value={bookingForm.scheduled_time}
                    onChange={(e) => setBookingForm({ ...bookingForm, scheduled_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  咨询时长
                </label>
                <select
                  value={bookingForm.duration}
                  onChange={(e) => setBookingForm({ ...bookingForm, duration: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value={30}>30分钟</option>
                  <option value={60}>60分钟</option>
                  <option value={90}>90分钟</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  备注
                </label>
                <textarea
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="其他需要说明的信息"
                />
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">咨询费用：</span>
                  <span className="text-lg font-semibold text-purple-600">
                    ¥{selectedMaster.price_per_session}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleBookConsultation}
                disabled={!bookingForm.topic || !bookingForm.scheduled_date || !bookingForm.scheduled_time}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                确认预约
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MasterConsultation