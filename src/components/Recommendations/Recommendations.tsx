import { useState, useEffect } from 'react';
import { BookOpen, Heart, Bookmark, Star, Eye, Filter, Search, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface RecommendationContent {
  id: string;
  title: string;
  content: string;
  contentType: 'article' | 'tip' | 'ritual' | 'meditation';
  tags: string[];
  targetMethods: string[];
  targetTypes: string[];
  difficultyLevel: number;
  relevanceScore?: number;
  isBookmarked?: boolean;
  rating?: number;
  viewedAt?: string;
}

interface UserPreferences {
  preferredMethods: string[];
  preferredTypes: string[];
  notificationSettings: Record<string, boolean>;
  themePreferences: Record<string, any>;
}

const contentTypeNames: Record<string, { name: string; icon: any; color: string }> = {
  article: { name: '文章', icon: BookOpen, color: 'blue' },
  tip: { name: '技巧', icon: Sparkles, color: 'yellow' },
  ritual: { name: '仪式', icon: Star, color: 'purple' },
  meditation: { name: '冥想', icon: Heart, color: 'pink' }
};

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

export default function Recommendations() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<RecommendationContent[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<RecommendationContent | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRecommendations();
      fetchUserPreferences();
    }
  }, [user]);

  const fetchRecommendations = async () => {
    if (!user) return;
    
    try {
      // 调用个性化推荐函数
      const { data: recommendationsData, error } = await supabase
        .rpc('get_personalized_recommendations', {
          user_uuid: user.id,
          limit_count: 20
        });

      if (error) throw error;

      if (recommendationsData) {
        // 获取用户的推荐记录（书签和评分）
        const { data: userRecommendations } = await supabase
          .from('user_recommendations')
          .select('content_id, is_bookmarked, rating, viewed_at')
          .eq('user_id', user.id);

        const userRecMap = new Map(userRecommendations?.map(rec => [rec.content_id, rec]) || []);

        const enrichedRecommendations = recommendationsData.map((item: any) => {
          const userRec = userRecMap.get(item.content_id);
          return {
            id: item.content_id,
            title: item.title,
            content: item.content,
            contentType: item.content_type,
            tags: [], // 需要从原表获取
            targetMethods: [],
            targetTypes: [],
            difficultyLevel: 1,
            relevanceScore: item.relevance_score,
            isBookmarked: userRec?.is_bookmarked || false,
            rating: userRec?.rating,
            viewedAt: userRec?.viewed_at
          };
        });

        setRecommendations(enrichedRecommendations);
      }
    } catch (error) {
      console.error('获取推荐内容失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPreferences = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setUserPreferences({
          preferredMethods: data.preferred_methods || [],
          preferredTypes: data.preferred_types || [],
          notificationSettings: data.notification_settings || {},
          themePreferences: data.theme_preferences || {}
        });
      }
    } catch (error) {
      console.error('获取用户偏好失败:', error);
    }
  };

  const updateUserPreferences = async (newPreferences: Partial<UserPreferences>) => {
    if (!user) return;
    
    try {
      const updatedPreferences: UserPreferences = {
        preferredMethods: newPreferences.preferredMethods || userPreferences?.preferredMethods || [],
        preferredTypes: newPreferences.preferredTypes || userPreferences?.preferredTypes || [],
        notificationSettings: newPreferences.notificationSettings || userPreferences?.notificationSettings || {},
        themePreferences: newPreferences.themePreferences || userPreferences?.themePreferences || {}
      };
      
      await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          preferred_methods: updatedPreferences.preferredMethods,
          preferred_types: updatedPreferences.preferredTypes,
          notification_settings: updatedPreferences.notificationSettings,
          theme_preferences: updatedPreferences.themePreferences,
          updated_at: new Date().toISOString()
        });
      
      setUserPreferences(updatedPreferences);
      // 重新获取推荐
      fetchRecommendations();
    } catch (error) {
      console.error('更新用户偏好失败:', error);
    }
  };

  const markAsViewed = async (contentId: string) => {
    if (!user) return;
    
    try {
      await supabase
        .from('user_recommendations')
        .upsert({
          user_id: user.id,
          content_id: contentId,
          viewed_at: new Date().toISOString()
        });
      
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === contentId 
            ? { ...rec, viewedAt: new Date().toISOString() }
            : rec
        )
      );
    } catch (error) {
      console.error('标记为已查看失败:', error);
    }
  };

  const toggleBookmark = async (contentId: string, currentBookmarked: boolean) => {
    if (!user) return;
    
    try {
      await supabase
        .from('user_recommendations')
        .upsert({
          user_id: user.id,
          content_id: contentId,
          is_bookmarked: !currentBookmarked
        });
      
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === contentId 
            ? { ...rec, isBookmarked: !currentBookmarked }
            : rec
        )
      );
    } catch (error) {
      console.error('更新书签状态失败:', error);
    }
  };

  const rateContent = async (contentId: string, rating: number) => {
    if (!user) return;
    
    try {
      await supabase
        .from('user_recommendations')
        .upsert({
          user_id: user.id,
          content_id: contentId,
          rating: rating
        });
      
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === contentId 
            ? { ...rec, rating: rating }
            : rec
        )
      );
    } catch (error) {
      console.error('评分失败:', error);
    }
  };

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesType = filterType === 'all' || rec.contentType === filterType;
    const matchesSearch = searchQuery === '' || 
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

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
        <h1 className="text-3xl font-bold text-white mb-2">个性化推荐</h1>
        <p className="text-purple-200">根据您的兴趣和历史，为您精选内容</p>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
          <input
            type="text"
            placeholder="搜索推荐内容..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-purple-800/30 border border-purple-600 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 bg-purple-800/30 border border-purple-600 rounded-lg text-white focus:outline-none focus:border-purple-400"
          >
            <option value="all">全部类型</option>
            {Object.entries(contentTypeNames).map(([key, { name }]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
          
          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center"
          >
            <Filter className="w-5 h-5 mr-2" />
            偏好设置
          </button>
        </div>
      </div>

      {/* 偏好设置面板 */}
      {showPreferences && userPreferences && (
        <div className="bg-purple-800/30 rounded-lg p-6 mb-8 border border-purple-400/30">
          <h3 className="text-lg font-semibold text-white mb-4">个性化偏好设置</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 偏好的占卜方法 */}
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-3">偏好的占卜方法</label>
              <div className="space-y-2">
                {Object.entries(methodNames).map(([key, name]) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={userPreferences.preferredMethods.includes(key)}
                      onChange={(e) => {
                        const newMethods = e.target.checked
                          ? [...userPreferences.preferredMethods, key]
                          : userPreferences.preferredMethods.filter(m => m !== key);
                        updateUserPreferences({ preferredMethods: newMethods });
                      }}
                      className="mr-2 rounded border-purple-600 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-purple-200">{name}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* 偏好的咨询类型 */}
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-3">偏好的咨询类型</label>
              <div className="space-y-2">
                {Object.entries(typeNames).map(([key, name]) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={userPreferences.preferredTypes.includes(key)}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...userPreferences.preferredTypes, key]
                          : userPreferences.preferredTypes.filter(t => t !== key);
                        updateUserPreferences({ preferredTypes: newTypes });
                      }}
                      className="mr-2 rounded border-purple-600 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-purple-200">{name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 推荐内容列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecommendations.map(recommendation => {
          const typeConfig = contentTypeNames[recommendation.contentType];
          const TypeIcon = typeConfig.icon;
          
          return (
            <div key={recommendation.id} className="bg-purple-800/30 rounded-lg p-6 border border-purple-400/20 hover:border-purple-400/40 transition-all">
              {/* 内容头部 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-purple-600/20 mr-3">
                    <TypeIcon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <span className="text-purple-400 text-sm font-medium">
                      {typeConfig.name}
                    </span>
                    {recommendation.relevanceScore && (
                      <div className="flex items-center mt-1">
                        <Star className="w-3 h-3 text-yellow-400 mr-1" />
                        <span className="text-yellow-400 text-xs">
                          匹配度 {recommendation.relevanceScore}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => toggleBookmark(recommendation.id, recommendation.isBookmarked || false)}
                  className={`p-2 rounded-full transition-colors ${
                    recommendation.isBookmarked
                      ? 'text-yellow-400 hover:text-yellow-300'
                      : 'text-gray-400 hover:text-yellow-400'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${recommendation.isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              {/* 标题和内容预览 */}
              <h3 className="text-lg font-semibold text-white mb-3">{recommendation.title}</h3>
              <p className="text-purple-200 text-sm mb-4 line-clamp-3">
                {recommendation.content.length > 150 
                  ? `${recommendation.content.substring(0, 150)}...` 
                  : recommendation.content
                }
              </p>
              
              {/* 操作按钮 */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedContent(recommendation);
                    markAsViewed(recommendation.id);
                  }}
                  className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  查看详情
                </button>
                
                {/* 评分 */}
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => rateContent(recommendation.id, star)}
                      className={`w-4 h-4 transition-colors ${
                        star <= (recommendation.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-400 hover:text-yellow-300'
                      }`}
                    >
                      <Star className="w-full h-full" />
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 已查看标识 */}
              {recommendation.viewedAt && (
                <div className="mt-3 text-xs text-purple-400 flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  已于 {new Date(recommendation.viewedAt).toLocaleDateString('zh-CN')} 查看
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {filteredRecommendations.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <p className="text-purple-300 text-lg">暂无推荐内容</p>
          <p className="text-purple-400">完善您的偏好设置以获得更精准的推荐</p>
        </div>
      )}

      {/* 内容详情模态框 */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-purple-900 rounded-lg max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedContent.title}</h2>
                  <div className="flex items-center">
                    <span className="px-3 py-1 rounded-full text-sm bg-purple-600/20 text-purple-400">
                      {contentTypeNames[selectedContent.contentType].name}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedContent(null)}
                  className="text-purple-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="text-purple-100 leading-relaxed whitespace-pre-line">
                {selectedContent.content}
              </div>
              
              <div className="mt-6 pt-6 border-t border-purple-700 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => toggleBookmark(selectedContent.id, selectedContent.isBookmarked || false)}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      selectedContent.isBookmarked
                        ? 'bg-yellow-600 text-white'
                        : 'bg-purple-700 text-purple-200 hover:bg-purple-600'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 mr-2 ${selectedContent.isBookmarked ? 'fill-current' : ''}`} />
                    {selectedContent.isBookmarked ? '已收藏' : '收藏'}
                  </button>
                </div>
                
                <div className="flex items-center">
                  <span className="text-purple-300 text-sm mr-2">评分：</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => rateContent(selectedContent.id, star)}
                        className={`w-5 h-5 transition-colors ${
                          star <= (selectedContent.rating || 0)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-400 hover:text-yellow-300'
                        }`}
                      >
                        <Star className="w-full h-full" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}