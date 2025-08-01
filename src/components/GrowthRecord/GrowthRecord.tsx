import React, { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Calendar, Star, BookOpen, Target, Award, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface GrowthStats {
  totalDivinations: number;
  methodsTried: number;
  achievementsEarned: number;
  currentStreak: number;
  totalSignIns: number;
  level: number;
  points: number;
  experience: number;
  avgAccuracyRating: number;
  joinDate: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  rewardPoints: number;
}

interface DivinationRecord {
  id: string;
  method: string;
  type: string;
  question: string;
  result: string;
  createdAt: string;
  tags: string[];
  moodRating?: number;
  isFavorite: boolean;
  accuracyFeedback?: number;
}

interface GrowthMilestone {
  id: string;
  recordType: string;
  title: string;
  description: string;
  date: string;
}

const methodNames: Record<string, string> = {
  tarot: '塔罗占卜',
  astrology: '星座占星',
  iching: '易经占卜',
  numerology: '数字命理',
  palmistry: '手相占卜'
};

const typeNames: Record<string, string> = {
  love: '感情运势',
  career: '事业发展',
  wealth: '财富运程',
  health: '健康状况',
  general: '综合运势'
};

export default function GrowthRecord() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'achievements' | 'milestones'>('overview');
  const [growthStats, setGrowthStats] = useState<GrowthStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [divinationHistory, setDivinationHistory] = useState<DivinationRecord[]>([]);
  const [milestones, setMilestones] = useState<GrowthMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year' | 'all'>('month');

  useEffect(() => {
    if (user) {
      fetchGrowthData();
    }
  }, [user, selectedPeriod]);

  const fetchGrowthData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // 获取成长概览数据
      const { data: statsData } = await supabase
        .from('user_growth_overview')
        .select('*')
        .eq('id', user.id)
        .single();

      if (statsData) {
        setGrowthStats({
          totalDivinations: statsData.total_divinations || 0,
          methodsTried: statsData.methods_tried || 0,
          achievementsEarned: statsData.achievements_earned || 0,
          currentStreak: statsData.sign_in_streak || 0,
          totalSignIns: statsData.total_sign_ins || 0,
          level: statsData.level || 1,
          points: statsData.points || 0,
          experience: statsData.experience || 0,
          avgAccuracyRating: statsData.avg_accuracy_rating || 0,
          joinDate: statsData.join_date
        });
      }

      // 获取用户成就
      const { data: achievementsData } = await supabase
        .from('user_achievements')
        .select(`
          earned_at,
          achievements (
            id,
            name,
            description,
            icon,
            reward_points
          )
        `)
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (achievementsData) {
        setAchievements(achievementsData.map(item => ({
          id: item.achievements.id,
          name: item.achievements.name,
          description: item.achievements.description,
          icon: item.achievements.icon,
          earnedAt: item.earned_at,
          rewardPoints: item.achievements.reward_points
        })));
      }

      // 获取占卜历史（根据时间段筛选）
      let query = supabase
        .from('divination_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (selectedPeriod !== 'all') {
        const now = new Date();
        let startDate: Date;
        
        switch (selectedPeriod) {
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case 'year':
            startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
          default:
            startDate = new Date(0);
        }
        
        query = query.gte('created_at', startDate.toISOString());
      }

      const { data: historyData } = await query.limit(50);

      if (historyData) {
        setDivinationHistory(historyData.map(item => ({
          id: item.id,
          method: item.method,
          type: item.type,
          question: item.question,
          result: item.result,
          createdAt: item.created_at,
          tags: item.tags || [],
          moodRating: item.mood_rating,
          isFavorite: item.is_favorite || false,
          accuracyFeedback: item.accuracy_feedback
        })));
      }

      // 获取成长里程碑
      const { data: milestonesData } = await supabase
        .from('growth_records')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(20);

      if (milestonesData) {
        setMilestones(milestonesData.map(item => ({
          id: item.id,
          recordType: item.record_type,
          title: item.title,
          description: item.description || '',
          date: item.date
        })));
      }

    } catch (error) {
      console.error('获取成长数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (recordId: string, currentFavorite: boolean) => {
    try {
      await supabase
        .from('divination_history')
        .update({ is_favorite: !currentFavorite })
        .eq('id', recordId);
      
      setDivinationHistory(prev => 
        prev.map(record => 
          record.id === recordId 
            ? { ...record, isFavorite: !currentFavorite }
            : record
        )
      );
    } catch (error) {
      console.error('更新收藏状态失败:', error);
    }
  };

  const updateAccuracyFeedback = async (recordId: string, rating: number) => {
    try {
      await supabase
        .from('divination_history')
        .update({ accuracy_feedback: rating })
        .eq('id', recordId);
      
      setDivinationHistory(prev => 
        prev.map(record => 
          record.id === recordId 
            ? { ...record, accuracyFeedback: rating }
            : record
        )
      );
    } catch (error) {
      console.error('更新准确性反馈失败:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* 页面标题 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">成长记录</h1>
        <p className="text-purple-200">追踪您的占卜之旅，见证心灵成长</p>
      </div>

      {/* 标签页导航 */}
      <div className="flex justify-center mb-8">
        <div className="bg-purple-800/30 rounded-lg p-1 flex space-x-1">
          {[
            { key: 'overview', label: '概览', icon: TrendingUp },
            { key: 'history', label: '历史记录', icon: BookOpen },
            { key: 'achievements', label: '成就', icon: Trophy },
            { key: 'milestones', label: '里程碑', icon: Target }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center px-4 py-2 rounded-md transition-all ${
                activeTab === key
                  ? 'bg-purple-600 text-white'
                  : 'text-purple-200 hover:text-white hover:bg-purple-700/50'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 概览标签页 */}
      {activeTab === 'overview' && growthStats && (
        <div className="space-y-6">
          {/* 等级和积分 */}
          <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-6 border border-purple-400/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Award className="w-8 h-8 text-yellow-400 mr-3" />
                <div>
                  <h2 className="text-2xl font-bold text-white">等级 {growthStats.level}</h2>
                  <p className="text-purple-200">经验值: {growthStats.experience}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-yellow-400">{growthStats.points}</div>
                <div className="text-purple-200">积分</div>
              </div>
            </div>
            
            {/* 经验值进度条 */}
            <div className="w-full bg-purple-800/50 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(growthStats.experience % 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-purple-300 mt-2">
              距离下一级还需 {100 - (growthStats.experience % 100)} 经验值
            </p>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-purple-800/30 rounded-lg p-4 text-center">
              <BookOpen className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{growthStats.totalDivinations}</div>
              <div className="text-purple-200 text-sm">总占卜次数</div>
            </div>
            
            <div className="bg-purple-800/30 rounded-lg p-4 text-center">
              <Star className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{growthStats.methodsTried}</div>
              <div className="text-purple-200 text-sm">尝试方法</div>
            </div>
            
            <div className="bg-purple-800/30 rounded-lg p-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{growthStats.achievementsEarned}</div>
              <div className="text-purple-200 text-sm">获得成就</div>
            </div>
            
            <div className="bg-purple-800/30 rounded-lg p-4 text-center">
              <Calendar className="w-8 h-8 text-pink-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{growthStats.currentStreak}</div>
              <div className="text-purple-200 text-sm">连续签到</div>
            </div>
          </div>

          {/* 准确性评分 */}
          {growthStats.avgAccuracyRating > 0 && (
            <div className="bg-purple-800/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                占卜准确性评分
              </h3>
              <div className="flex items-center">
                <div className="flex space-x-1 mr-4">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${
                        star <= growthStats.avgAccuracyRating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-400'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-white text-lg font-semibold">
                  {growthStats.avgAccuracyRating.toFixed(1)}/5.0
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 历史记录标签页 */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* 时间段筛选 */}
          <div className="flex justify-center mb-6">
            <div className="bg-purple-800/30 rounded-lg p-1 flex space-x-1">
              {[
                { key: 'week', label: '本周' },
                { key: 'month', label: '本月' },
                { key: 'year', label: '本年' },
                { key: 'all', label: '全部' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSelectedPeriod(key as any)}
                  className={`px-4 py-2 rounded-md transition-all ${
                    selectedPeriod === key
                      ? 'bg-purple-600 text-white'
                      : 'text-purple-200 hover:text-white hover:bg-purple-700/50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 占卜记录列表 */}
          <div className="space-y-4">
            {divinationHistory.map(record => (
              <div key={record.id} className="bg-purple-800/30 rounded-lg p-6 border border-purple-400/20">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm mr-2">
                        {methodNames[record.method] || record.method}
                      </span>
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm mr-2">
                        {typeNames[record.type] || record.type}
                      </span>
                      <Clock className="w-4 h-4 text-purple-300 mr-1" />
                      <span className="text-purple-300 text-sm">
                        {new Date(record.createdAt).toLocaleString('zh-CN')}
                      </span>
                    </div>
                    <h3 className="text-white font-semibold mb-2">问题：{record.question}</h3>
                  </div>
                  
                  <button
                    onClick={() => toggleFavorite(record.id, record.isFavorite)}
                    className={`p-2 rounded-full transition-colors ${
                      record.isFavorite
                        ? 'text-yellow-400 hover:text-yellow-300'
                        : 'text-gray-400 hover:text-yellow-400'
                    }`}
                  >
                    <Star className={`w-5 h-5 ${record.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>
                
                <div className="text-purple-100 mb-4 leading-relaxed">
                  {record.result.length > 200 
                    ? `${record.result.substring(0, 200)}...` 
                    : record.result
                  }
                </div>
                
                {/* 标签 */}
                {record.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {record.tags.map(tag => (
                      <span key={tag} className="bg-purple-700/50 text-purple-200 px-2 py-1 rounded text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* 准确性评分 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-purple-300 text-sm mr-2">准确性评分：</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => updateAccuracyFeedback(record.id, star)}
                          className={`w-4 h-4 transition-colors ${
                            star <= (record.accuracyFeedback || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-400 hover:text-yellow-300'
                          }`}
                        >
                          <Star className="w-full h-full" />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {record.moodRating && (
                    <div className="text-purple-300 text-sm">
                      心情指数：{record.moodRating}/5
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {divinationHistory.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <p className="text-purple-300 text-lg">暂无占卜记录</p>
                <p className="text-purple-400">开始您的第一次占卜之旅吧！</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 成就标签页 */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map(achievement => (
            <div key={achievement.id} className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-lg p-6 border border-yellow-400/30">
              <div className="text-center">
                <div className="text-4xl mb-3">{achievement.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{achievement.name}</h3>
                <p className="text-purple-200 mb-4">{achievement.description}</p>
                <div className="flex justify-between items-center">
                  <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm">
                    +{achievement.rewardPoints} 积分
                  </span>
                  <span className="text-purple-300 text-sm">
                    {new Date(achievement.earnedAt).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {achievements.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Trophy className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <p className="text-purple-300 text-lg">暂无获得成就</p>
              <p className="text-purple-400">继续使用应用来解锁更多成就！</p>
            </div>
          )}
        </div>
      )}

      {/* 里程碑标签页 */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          {milestones.map(milestone => (
            <div key={milestone.id} className="bg-purple-800/30 rounded-lg p-6 border-l-4 border-purple-400">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{milestone.title}</h3>
                  {milestone.description && (
                    <p className="text-purple-200 mb-2">{milestone.description}</p>
                  )}
                  <div className="flex items-center text-purple-300 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(milestone.date).toLocaleDateString('zh-CN')}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  milestone.recordType === 'achievement' 
                    ? 'bg-yellow-600 text-white'
                    : milestone.recordType === 'milestone'
                    ? 'bg-blue-600 text-white'
                    : 'bg-green-600 text-white'
                }`}>
                  {milestone.recordType === 'achievement' ? '成就' : 
                   milestone.recordType === 'milestone' ? '里程碑' : '洞察'}
                </span>
              </div>
            </div>
          ))}
          
          {milestones.length === 0 && (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <p className="text-purple-300 text-lg">暂无里程碑记录</p>
              <p className="text-purple-400">您的成长历程将在这里记录！</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}