import React, { useState, useMemo } from 'react';
import { 
  Star, Moon, Sun, Gem, Zap, Heart, Coins, Users, Briefcase, Shield, 
  Sparkles, Search, Filter, ChevronRight, TrendingUp, Award, Crown,
  Clock, Calendar, User, Book, Target, Compass, UserCircle, Settings
} from 'lucide-react';
import { useProfile } from '../contexts/ProfileContext';

interface FortuneMethod {
  id: string;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  category: string;
  popularity: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  color: string;
  tags: string[];
}

interface Category {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
}

const categories: Category[] = [
  {
    id: 'traditional',
    title: '传统命理',
    icon: Crown,
    description: '古法传承，深度解析',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'modern',
    title: '现代占卜',
    icon: Star,
    description: '时尚趣味，轻松体验',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'quick',
    title: '快速测试',
    icon: Zap,
    description: '即时体验，快速获得答案',
    color: 'from-green-500 to-teal-500'
  },
  {
    id: 'relationship',
    title: '情感专区',
    icon: Heart,
    description: '爱情运势，关系分析',
    color: 'from-pink-500 to-rose-500'
  }
];

const fortuneMethods: FortuneMethod[] = [
  // 传统命理
  {
    id: 'bazi',
    icon: Crown,
    title: '八字命理',
    description: '传统八字分析，洞察人生格局',
    category: 'traditional',
    popularity: 95,
    difficulty: 'advanced',
    color: 'from-yellow-500 to-orange-500',
    tags: ['深度分析', '传统', '专业']
  },
  {
    id: 'ziwei',
    icon: Moon,
    title: '紫微斗数',
    description: '紫微星盘解析，预测命运轨迹',
    category: 'traditional',
    popularity: 88,
    difficulty: 'advanced',
    color: 'from-purple-500 to-indigo-500',
    tags: ['星盘', '预测', '专业']
  },
  {
    id: 'lottery',
    icon: Sun,
    title: '观音求签',
    description: '虔诚祈祷，抽取灵签获得指引',
    category: 'traditional',
    popularity: 92,
    difficulty: 'beginner',
    color: 'from-orange-500 to-red-500',
    tags: ['祈福', '指引', '简单']
  },
  {
    id: 'jiaobei',
    icon: Gem,
    title: '擲筊问卜',
    description: '擲筊求神明指示，获得明确答案',
    category: 'traditional',
    popularity: 85,
    difficulty: 'beginner',
    color: 'from-green-500 to-teal-500',
    tags: ['问答', '神明', '简单']
  },
  
  // 现代占卜
  {
    id: 'tarot',
    icon: Star,
    title: '塔罗占卜',
    description: '通过神秘的塔罗牌获得人生指引',
    category: 'modern',
    popularity: 90,
    difficulty: 'intermediate',
    color: 'from-purple-500 to-pink-500',
    tags: ['塔罗牌', '神秘', '指引']
  },
  {
    id: 'astrology',
    icon: Compass,
    title: '星座占星',
    description: '解读星象运行对您的影响',
    category: 'modern',
    popularity: 87,
    difficulty: 'intermediate',
    color: 'from-blue-500 to-purple-500',
    tags: ['星座', '星象', '运势']
  },
  {
    id: 'numerology',
    icon: Target,
    title: '数字命理',
    description: '通过数字能量揭示命运密码',
    category: 'modern',
    popularity: 80,
    difficulty: 'intermediate',
    color: 'from-indigo-500 to-blue-500',
    tags: ['数字', '能量', '命理']
  },
  
  // 快速测试
  {
    id: 'personality',
    icon: User,
    title: '性格测试',
    description: '深度分析性格特质，了解真实自我',
    category: 'quick',
    popularity: 95,
    difficulty: 'beginner',
    color: 'from-green-500 to-emerald-500',
    tags: ['性格', '心理', '简单']
  },
  {
    id: 'lifestory',
    icon: Book,
    title: '命格小故事',
    description: '生成专属命运故事，趣味了解人生轨迹',
    category: 'quick',
    popularity: 75,
    difficulty: 'beginner',
    color: 'from-teal-500 to-cyan-500',
    tags: ['故事', '趣味', '创意']
  },
  
  // 情感专区
  {
    id: 'compatibility',
    icon: Heart,
    title: '配对打分',
    description: '测试两人缘分指数，分析感情匹配度',
    category: 'relationship',
    popularity: 93,
    difficulty: 'intermediate',
    color: 'from-pink-500 to-rose-500',
    tags: ['配对', '缘分', '感情']
  },
  {
    id: 'gacha',
    icon: Gem,
    title: '命运扭蛋机',
    description: '盲盒式预言，轻轻一扭获得神秘启示',
    category: 'quick',
    popularity: 88,
    difficulty: 'beginner',
    color: 'from-pink-500 to-purple-500',
    tags: ['扭蛋', '随机', '趣味']
  }
];

interface ImprovedHomepageProps {
  onSelectMethod: (methodId: string) => void;
  onNavigateToProfile?: () => void;
}

const ImprovedHomepage: React.FC<ImprovedHomepageProps> = ({ onSelectMethod, onNavigateToProfile }) => {
  const [activeCategory, setActiveCategory] = useState('traditional');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  const { profile, isProfileComplete } = useProfile();
  
  const handleNavigateToProfile = () => {
    if (onNavigateToProfile) {
      onNavigateToProfile();
    } else {
      // Fallback navigation using history API
      window.history.pushState({}, '', '/profile');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  // 筛选方法
  const filteredMethods = useMemo(() => {
    let methods = fortuneMethods;
    
    if (activeCategory !== 'all') {
      methods = methods.filter(method => method.category === activeCategory);
    }
    
    if (searchTerm) {
      methods = methods.filter(method => 
        method.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        method.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        method.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return methods.sort((a, b) => b.popularity - a.popularity);
  }, [activeCategory, searchTerm]);

  // 热门推荐（取最受欢迎的4个）
  const popularMethods = useMemo(() => {
    return fortuneMethods
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 4);
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-500/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-500/20';
      case 'advanced': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '入门';
      case 'intermediate': return '进阶';
      case 'advanced': return '专业';
      default: return '未知';
    }
  };
  


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-yellow-400 mr-3" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              算算乐
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-400 ml-3" />
          </div>
          <p className="text-xl text-purple-200 mb-6">今天算了吗？一起乐一乐！</p>
        </div>



        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Filter className="w-6 h-6 text-yellow-400 mr-2" />
            <h2 className="text-2xl font-bold">分类浏览</h2>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isActive = activeCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    isActive
                      ? `bg-gradient-to-r ${category.color} shadow-xl border-2 border-yellow-400`
                      : 'bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600'
                  }`}
                >
                  <IconComponent className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold">{category.title}</div>
                    <div className="text-xs opacity-80">{category.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Methods Grid */}
        <div className="mb-8">
          {filteredMethods.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-purple-300 mb-2">未找到匹配的占卜方法</h3>
              <p className="text-purple-400">请尝试其他搜索关键词或选择不同的分类</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMethods.map((method) => {
                const IconComponent = method.icon;
                
                return (
                  <div
                    key={method.id}
                    onClick={() => onSelectMethod(method.id)}
                    className="group relative bg-gradient-to-br from-purple-900/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/20 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-yellow-400/50"
                  >
                    {/* Popularity Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-400/30">
                        <span className="text-xs text-yellow-400 font-semibold flex items-center">
                          <Award className="w-3 h-3 mr-1" />
                          {method.popularity}%
                        </span>
                      </div>
                    </div>

                    {/* Difficulty Badge */}
                    <div className="absolute top-4 left-4">
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(method.difficulty)}`}>
                        {getDifficultyText(method.difficulty)}
                      </div>
                    </div>

                    <div className="mt-8">
                      {/* Icon */}
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${method.color} p-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <IconComponent className="w-full h-full text-white" />
                      </div>

                      {/* Content */}
                      <div className="text-center">
                        <h3 className="text-xl font-bold mb-3 group-hover:text-yellow-400 transition-colors">
                          {method.title}
                        </h3>
                        <p className="text-purple-200 text-sm leading-relaxed mb-4 line-clamp-3">
                          {method.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 justify-center mb-4">
                          {method.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-700/50 rounded-full text-xs text-purple-200 border border-purple-600/30"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Action Button */}
                        <div className="flex items-center justify-center space-x-2 text-purple-300 group-hover:text-yellow-400 transition-colors">
                          <span className="text-sm font-medium">开始体验</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="text-center py-8 border-t border-purple-400/20">
          {/* Disclaimer */}
          <div className="mb-6">
            <p className="text-purple-300 text-sm">
              ✨ 占卜结果仅供参考，重要决定请结合理性思考 ✨
            </p>
          </div>
          
          {/* Creator Info */}
          <div className="mt-6 pt-6 border-t border-purple-400/10">
            <p className="text-purple-300 text-sm">
              Created by Ango, 2025.
            </p>
            <p className="text-purple-400 text-xs mt-1">
              <a href="https://n-blog.angoango.dpdns.org" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors">
                n-blog.angoango.dpdns.org
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImprovedHomepage;