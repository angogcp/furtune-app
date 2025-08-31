import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase, type Wish } from '../../lib/supabase'
import { Heart, MessageCircle, Send, Star, Sparkles } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default function WishWall() {
  const { user } = useAuth()
  const [wishes, setWishes] = useState<Wish[]>([])
  const [newWish, setNewWish] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadWishes()
  }, [])

  const loadWishes = async () => {
    try {
      const { data, error } = await supabase
        .from('wishes')
        .select(`
          *,
          users!wishes_user_id_fkey(username)
        `)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error loading wishes:', error)
      } else {
        setWishes(data || [])
      }
    } catch (error) {
      console.error('Error loading wishes:', error)
    } finally {
      setLoading(false)
    }
  }

  const submitWish = async () => {
    if (!newWish.trim() || !user) return

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('wishes')
        .insert({
          user_id: isAnonymous ? null : user.id,
          content: newWish.trim(),
          is_anonymous: isAnonymous,
          likes: 0,
          created_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error submitting wish:', error)
      } else {
        setNewWish('')
        loadWishes() // Reload wishes
      }
    } catch (error) {
      console.error('Error submitting wish:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const likeWish = async (wishId: string) => {
    try {
      const wish = wishes.find(w => w.id === wishId)
      if (!wish) return

      const { error } = await supabase
        .from('wishes')
        .update({ likes: wish.likes + 1 })
        .eq('id', wishId)

      if (!error) {
        setWishes(wishes.map(w => 
          w.id === wishId ? { ...w, likes: w.likes + 1 } : w
        ))
      }
    } catch (error) {
      console.error('Error liking wish:', error)
    }
  }



  if (loading) {
    return (
      <div className="bg-purple-900/50 rounded-lg p-6 border border-purple-400/30">
        <div className="animate-pulse">
          <div className="h-6 bg-purple-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-purple-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg p-6 border border-purple-400/30">
      <div className="text-center mb-6">
        <Sparkles className="w-12 h-12 mx-auto mb-4 text-pink-400" />
        <h2 className="text-2xl font-bold text-white mb-2">许愿墙</h2>
        <p className="text-purple-200">在这里许下心愿，让宇宙听见你的声音</p>
      </div>

      {/* Wish Input */}
      {user && (
        <div className="bg-purple-800/30 rounded-lg p-4 mb-6">
          <textarea
            value={newWish}
            onChange={(e) => setNewWish(e.target.value)}
            placeholder="写下你的心愿..."
            className="w-full p-3 bg-purple-700/50 border border-purple-600 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 resize-none"
            rows={3}
            maxLength={200}
          />
          
          <div className="flex items-center justify-between mt-3">
            <label className="flex items-center text-purple-200">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="mr-2 rounded"
              />
              匿名许愿
            </label>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-purple-300">
                {newWish.length}/200
              </span>
              <button
                onClick={submitWish}
                disabled={!newWish.trim() || submitting}
                className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 rounded-lg font-medium text-white transition-all duration-300 disabled:cursor-not-allowed flex items-center"
              >
                <Send className="w-4 h-4 mr-1" />
                {submitting ? '发送中...' : '许愿'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wishes List */}
      <div className="space-y-4">
        {wishes.length === 0 ? (
          <div className="text-center py-8">
            <Star className="w-16 h-16 mx-auto mb-4 text-purple-400 opacity-50" />
            <p className="text-purple-300">还没有人许愿，成为第一个许愿的人吧！</p>
          </div>
        ) : (
          wishes.map((wish) => (
            <div
              key={wish.id}
              className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/50 rounded-lg p-4 border"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-purple-300" />
                  <span className="text-sm text-purple-200">
                    {wish.is_anonymous ? '匿名用户' : '用户'}
                  </span>
                </div>
                <span className="text-xs text-purple-300">
                  {formatDistanceToNow(new Date(wish.created_at), {
                    addSuffix: true,
                    locale: zhCN
                  })}
                </span>
              </div>
              
              <p className="text-white mb-3 leading-relaxed">{wish.content}</p>
              
              <div className="flex items-center justify-between">
                <button
                  onClick={() => likeWish(wish.id)}
                  className="flex items-center space-x-1 text-pink-300 hover:text-pink-200 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{wish.likes}</span>
                </button>
                
                <div className="flex items-center space-x-1 text-yellow-300">
                  <Star className="w-4 h-4" />
                  <span className="text-sm">愿望成真</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {wishes.length >= 50 && (
        <div className="text-center mt-6">
          <p className="text-purple-300 text-sm">显示最新50条愿望</p>
        </div>
      )}
    </div>
  )
}