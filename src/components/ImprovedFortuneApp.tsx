import React, { useState, useMemo } from 'react';
import { 
  Star, Moon, Sun, Gem, Zap, Heart, Coins, Users, Briefcase, Shield, 
  Sparkles, Search, Filter, TrendingUp, Award, Crown, Clock, Calendar, 
  User, Book, Target, Compass, Menu, X, ArrowLeft, Settings, UserCircle
} from 'lucide-react';
import ImprovedHomepage from './ImprovedHomepage';
import FortuneCarousel from './FortuneCarousel';
import SearchAndFilter from './SearchAndFilter';
import ProgressiveDisclosure from './ProgressiveDisclosure';
import UserProfile from './UserProfile';
import ModernFortuneInterface from './ModernFortuneTelling/ModernFortuneInterface';
import { ProfileProvider, useProfile } from '../contexts/ProfileContext';

// 数据接口定义
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
  isEssential: boolean;
  detailedDescription?: string;
}

interface Category {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
  count: number;
}

// 占卜方法数据
const fortuneMethods: FortuneMethod[] = [
  // 传统命理 - 精选推荐
  {
    id: 'bazi',
    icon: Crown,
    title: '八字命理',
    description: '传统八字分析，洞察人生格局',
    category: 'traditional',
    popularity: 95,
    difficulty: 'advanced',
    color: 'from-yellow-500 to-orange-500',
    tags: ['深度分析', '传统', '专业'],
    isEssential: true,
    detailedDescription: '八字命理是中国传统命理学的精髓，通过出生年月日时的干支组合，深入分析个人的性格特质、运势走向、事业财运等各个方面。'
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
    tags: ['祈福', '指引', '简单'],
    isEssential: true,
    detailedDescription: '观音求签是古老的祈福方式，通过虔诚的祈祷和随机抽签，获得观音菩萨的慈悲指引，帮助您在迷茫时找到方向。'
  },
  {
    id: 'personality',
    icon: User,
    title: '性格测试',
    description: '深度分析性格特质，了解真实自我',
    category: 'quick',
    popularity: 95,
    difficulty: 'beginner',
    color: 'from-green-500 to-emerald-500',
    tags: ['性格', '心理', '简单'],
    isEssential: true,
    detailedDescription: '基于心理学理论的性格分析，帮助您深入了解自己的性格特点、优势劣势，为个人成长和职业发展提供科学指导。'
  },
  {
    id: 'compatibility',
    icon: Heart,
    title: '配对打分',
    description: '测试两人缘分指数，分析感情匹配度',
    category: 'relationship',
    popularity: 93,
    difficulty: 'intermediate',
    color: 'from-pink-500 to-rose-500',
    tags: ['配对', '缘分', '感情'],
    isEssential: true,
    detailedDescription: '通过姓名、生日等信息，结合传统命理学和现代心理学，全面分析两人的性格匹配度、感情发展趋势。'
  },
  
  // 非必选项目
  {
    id: 'ziwei',
    icon: Moon,
    title: '紫微斗数',
    description: '紫微星盘解析，预测命运轨迹',
    category: 'traditional',
    popularity: 88,
    difficulty: 'advanced',
    color: 'from-purple-500 to-indigo-500',
    tags: ['星盘', '预测', '专业'],
    isEssential: false,
    detailedDescription: '紫微斗数是中国古代天文学与命理学的结合，通过星盘排列分析个人命运轨迹和人生重要转折点。'
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
    tags: ['问答', '神明', '简单'],
    isEssential: false
  },
  {
    id: 'tarot',
    icon: Star,
    title: '塔罗占卜',
    description: '通过神秘的塔罗牌获得人生指引',
    category: 'modern',
    popularity: 90,
    difficulty: 'intermediate',
    color: 'from-purple-500 to-pink-500',
    tags: ['塔罗牌', '神秘', '指引'],
    isEssential: false
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
    tags: ['星座', '星象', '运势'],
    isEssential: false
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
    tags: ['数字', '能量', '命理'],
    isEssential: false
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
    tags: ['故事', '趣味', '创意'],
    isEssential: false
  }
];

// 分类数据
const categories: Category[] = [
  {
    id: 'traditional',
    title: '传统命理',
    icon: Crown,
    description: '古法传承，深度解析',
    color: 'from-yellow-500 to-orange-500',
    count: fortuneMethods.filter(m => m.category === 'traditional').length
  },
  {
    id: 'modern',
    title: '现代占卜',
    icon: Star,
    description: '时尚趣味，轻松体验',
    color: 'from-purple-500 to-pink-500',
    count: fortuneMethods.filter(m => m.category === 'modern').length
  },
  {
    id: 'quick',
    title: '快速测试',
    icon: Zap,
    description: '即时体验，快速获得答案',
    color: 'from-green-500 to-teal-500',
    count: fortuneMethods.filter(m => m.category === 'quick').length
  },
  {
    id: 'relationship',
    title: '情感专区',
    icon: Heart,
    description: '爱情运势，关系分析',
    color: 'from-pink-500 to-rose-500',
    count: fortuneMethods.filter(m => m.category === 'relationship').length
  }
];

// 界面模式类型
type ViewMode = 'progressive' | 'category' | 'carousel' | 'grid';

interface FilterOptions {
  category: string[];
  difficulty: string[];
  popularity: { min: number; max: number };
  tags: string[];
}

interface ImprovedFortuneAppContentProps {
  onNavigateToProfile?: () => void;
  onMethodSelect?: (methodId: string) => void;
}

export const ImprovedFortuneAppContent: React.FC<ImprovedFortuneAppContentProps> = ({ onNavigateToProfile, onMethodSelect }) => {
  const { profile, isProfileComplete } = useProfile();
  const [viewMode, setViewMode] = useState<ViewMode>('progressive');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [showModernFortune, setShowModernFortune] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterOptions>({
    category: [],
    difficulty: [],
    popularity: { min: 0, max: 100 },
    tags: []
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 获取所有可用标签
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    fortuneMethods.forEach(method => {
      method.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, []);

  // 应用筛选和搜索
  const filteredMethods = useMemo(() => {
    let methods = fortuneMethods;

    // 应用搜索
    if (searchTerm) {
      methods = methods.filter(method =>
        method.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        method.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        method.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // 应用分类筛选
    if (filters.category.length > 0) {
      methods = methods.filter(method => filters.category.includes(method.category));
    }

    // 应用难度筛选
    if (filters.difficulty.length > 0) {
      methods = methods.filter(method => filters.difficulty.includes(method.difficulty));
    }

    // 应用热门度筛选
    methods = methods.filter(method => 
      method.popularity >= filters.popularity.min && 
      method.popularity <= filters.popularity.max
    );

    // 应用标签筛选
    if (filters.tags.length > 0) {
      methods = methods.filter(method =>
        filters.tags.some(tag => method.tags.includes(tag))
      );
    }

    return methods;
  }, [searchTerm, filters]);

  // 处理占卜方法选择
  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setShowModernFortune(true);
    // Also call parent callback if provided for compatibility
    if (onMethodSelect) {
      onMethodSelect(methodId);
    }
  };

  // 返回到方法选择页面
  const handleBackToSelection = () => {
    setShowModernFortune(false);
    setSelectedMethod('');
  };

  // 视图模式选择器
  const ViewModeSelector = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">显示模式</h3>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 bg-purple-800/50 rounded-lg border border-purple-600"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { id: 'progressive', label: '智能推荐', icon: TrendingUp, description: '个性化推荐' },
            { id: 'category', label: '分类浏览', icon: Filter, description: '按类别查看' },
            { id: 'carousel', label: '轮播展示', icon: Clock, description: '滑动浏览' },
            { id: 'grid', label: '网格视图', icon: Search, description: '全部显示' }
          ].map((mode) => {
            const IconComponent = mode.icon;
            const isActive = viewMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setViewMode(mode.id as ViewMode);
                  setIsMobileMenuOpen(false);
                }}
                className={`p-3 rounded-lg transition-all duration-300 text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-2 border-yellow-400'
                    : 'bg-purple-800/30 hover:bg-purple-700/50 border border-purple-600'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium text-sm">{mode.label}</span>
                </div>
                <p className="text-xs opacity-80">{mode.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  // 渲染不同的视图模式
  const renderViewMode = () => {
    const carouselItems = filteredMethods.map(method => ({
      id: method.id,
      icon: method.icon,
      title: method.title,
      description: method.description,
      color: method.color,
      popularity: method.popularity,
      tags: method.tags
    }));

    const disclosureItems = filteredMethods.map(method => ({
      id: method.id,
      icon: method.icon,
      title: method.title,
      description: method.description,
      color: method.color,
      isEssential: method.isEssential,
      popularity: method.popularity,
      tags: method.tags,
      detailedDescription: method.detailedDescription
    }));

    switch (viewMode) {
      case 'progressive':
        return (
          <ProgressiveDisclosure
            items={disclosureItems}
            onItemClick={handleMethodSelect}
            maxInitialItems={4}
          />
        );

      case 'category':
        return (
          <ImprovedHomepage
            onSelectMethod={handleMethodSelect}
            onNavigateToProfile={onNavigateToProfile}
          />
        );

      case 'carousel':
        return (
          <div className="space-y-8">
            {categories.map(category => {
              const categoryMethods = filteredMethods.filter(m => m.category === category.id);
              if (categoryMethods.length === 0) return null;

              const categoryItems = categoryMethods.map(method => ({
                id: method.id,
                icon: method.icon,
                title: method.title,
                description: method.description,
                color: method.color,
                popularity: method.popularity,
                tags: method.tags
              }));

              return (
                <FortuneCarousel
                  key={category.id}
                  title={category.title}
                  items={categoryItems}
                  onItemClick={handleMethodSelect}
                />
              );
            })}
          </div>
        );

      case 'grid':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <div
                  key={method.id}
                  onClick={() => handleMethodSelect(method.id)}
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

                  {/* Essential Badge */}
                  {method.isEssential && (
                    <div className="absolute top-4 left-4">
                      <div className="bg-green-500/20 px-2 py-1 rounded-full border border-green-400/30">
                        <span className="text-xs text-green-400 font-semibold">推荐</span>
                      </div>
                    </div>
                  )}

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
                      <p className="text-purple-200 text-sm leading-relaxed mb-4">
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
                      <button 
                        onClick={() => handleMethodSelect(method.id)}
                        className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition-all duration-300"
                      >
                        开始体验
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  // 如果选择了占卜方法，显示现代占卜界面
  if (showModernFortune && selectedMethod) {
    return (
      <ModernFortuneInterface 
        selectedMethodId={selectedMethod}
        onBack={handleBackToSelection}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-yellow-400 mr-3" />
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              神秘占卜馆
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-400 ml-3" />
          </div>
          <p className="text-lg md:text-xl text-purple-200">探索命运奥秘，指引人生方向</p>
          
          {/* Profile Status and Quick Access */}
          <div className="flex items-center justify-center space-x-4 mt-6">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${isProfileComplete ? 'bg-green-900/20 border-green-400/30 text-green-200' : 'bg-yellow-900/20 border-yellow-400/30 text-yellow-200'}`}>
              <UserCircle className="w-4 h-4" />
              <span className="text-sm">
                {isProfileComplete ? '个人资料已完善' : '建议完善个人资料'}
              </span>
            </div>
            <button
              onClick={() => setShowProfile(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/50 rounded-lg font-medium text-blue-300 transition-all duration-300"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">个人资料</span>
            </button>
          </div>
        </div>

        {/* View Mode Selector */}
        <ViewModeSelector />

        {/* Search and Filter - Only show for certain view modes */}
        {(viewMode === 'grid' || viewMode === 'category') && (
          <SearchAndFilter
            onSearch={setSearchTerm}
            onFilter={setFilters}
            categories={categories}
            availableTags={availableTags}
            className="mb-8"
          />
        )}

        {/* Main Content */}
        <div className="mb-8">
          {renderViewMode()}
        </div>

        {/* Empty State */}
        {filteredMethods.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-purple-300 mb-2">未找到匹配的占卜方法</h3>
            <p className="text-purple-400 mb-4">请尝试调整搜索条件或筛选设置</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  category: [],
                  difficulty: [],
                  popularity: { min: 0, max: 100 },
                  tags: []
                });
              }}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all duration-300"
            >
              重置筛选条件
            </button>
          </div>
        )}

        {/* Profile Modal */}
        {showProfile && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <UserProfile 
                onClose={() => setShowProfile(false)}
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-8 border-t border-purple-400/20">
          <div className="bg-purple-900/30 rounded-xl p-4 max-w-2xl mx-auto">
            <p className="text-purple-200 text-sm">
              ✨ 所有占卜结果仅供参考和娱乐，请理性对待。重要决定请结合现实情况和理性思考。✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImprovedFortuneAppContent;