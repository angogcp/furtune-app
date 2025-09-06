import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, ChevronRight, Star, Zap, Eye, EyeOff, 
  Lightbulb, Info, ArrowRight, Sparkles, Award
} from 'lucide-react';

interface DisclosureItem {
  id: string;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  color: string;
  isEssential: boolean;
  popularity?: number;
  tags?: string[];
  detailedDescription?: string;
}

interface ProgressiveDisclosureProps {
  items: DisclosureItem[];
  onItemClick: (itemId: string) => void;
  maxInitialItems?: number;
  className?: string;
}

const ProgressiveDisclosure: React.FC<ProgressiveDisclosureProps> = ({
  items,
  onItemClick,
  maxInitialItems = 4,
  className = ''
}) => {
  const [showAll, setShowAll] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [showRecommendations, setShowRecommendations] = useState(true);

  // Separate essential and non-essential items
  const essentialItems = items.filter(item => item.isEssential);
  const nonEssentialItems = items.filter(item => !item.isEssential);
  
  // Displayed items based on current state
  const displayedItems = showAll ? items : essentialItems.slice(0, maxInitialItems);
  const hiddenItemsCount = items.length - displayedItems.length;

  // Track user interaction for progressive disclosure
  const [userInteractions, setUserInteractions] = useState(0);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  useEffect(() => {
    // Show more options after user has interacted enough
    if (userInteractions >= 3) {
      setShowMoreOptions(true);
    }
  }, [userInteractions]);

  const handleItemClick = (itemId: string) => {
    setUserInteractions(prev => prev + 1);
    onItemClick(itemId);
  };

  const toggleItemExpansion = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Get recommendations based on user behavior
  const getRecommendations = () => {
    return items
      .filter(item => item.popularity && item.popularity > 85)
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 3);
  };

  const recommendations = getRecommendations();

  return (
    <div className={`${className}`}>
      {/* Beginner's Guide */}
      {showRecommendations && recommendations.length > 0 && (
        <div className="mb-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-xl border border-blue-400/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">新手推荐</h3>
              <span className="px-2 py-1 bg-yellow-500/20 rounded-full text-xs text-yellow-400 font-medium">
                热门
              </span>
            </div>
            <button
              onClick={() => setShowRecommendations(false)}
              className="text-purple-400 hover:text-white transition-colors"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-purple-200 text-sm mb-4">
            首次使用？这些是最受欢迎的占卜方法，简单易懂，适合入门体验。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={`rec-${item.id}`}
                  onClick={() => handleItemClick(item.id)}
                  className="group relative bg-gradient-to-br from-purple-800/40 to-blue-800/40 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border border-purple-600/30 hover:border-yellow-400/50"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${item.color} p-2 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-full h-full text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white group-hover:text-yellow-400 transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <Award className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs text-yellow-400">{item.popularity}% 好评</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-purple-400 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Items Grid */}
      <div className="space-y-4">
        {/* Essential Items - Always Visible */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Star className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">精选推荐</h3>
            <span className="px-2 py-1 bg-yellow-500/20 rounded-full text-xs text-yellow-400 font-medium">
              必试
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedItems.map((item) => {
              const IconComponent = item.icon;
              const isExpanded = expandedItems.has(item.id);
              
              return (
                <div
                  key={item.id}
                  className="group relative bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-sm rounded-xl border border-purple-400/20 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-yellow-400/50"
                >
                  {/* Essential Badge */}
                  {item.isEssential && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="bg-yellow-500/20 px-2 py-1 rounded-full border border-yellow-400/30">
                        <span className="text-xs text-yellow-400 font-semibold flex items-center">
                          <Sparkles className="w-3 h-3 mr-1" />
                          推荐
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Main Content */}
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${item.color} p-3 group-hover:scale-110 transition-transform duration-300 shadow-lg flex-shrink-0`}>
                        <IconComponent className="w-full h-full text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                            {item.title}
                          </h4>
                          {item.detailedDescription && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleItemExpansion(item.id);
                              }}
                              className="text-purple-400 hover:text-yellow-400 transition-colors"
                            >
                              {isExpanded ? <ChevronDown className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                            </button>
                          )}
                        </div>

                        <p className="text-purple-200 text-sm leading-relaxed mb-3">
                          {item.description}
                        </p>

                        {/* Expanded Content */}
                        {isExpanded && item.detailedDescription && (
                          <div className="bg-purple-800/30 rounded-lg p-3 mb-3 border border-purple-600/30">
                            <p className="text-purple-100 text-sm leading-relaxed">
                              {item.detailedDescription}
                            </p>
                          </div>
                        )}

                        {/* Tags and Popularity */}
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {item.tags?.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-purple-700/50 rounded-full text-xs text-purple-200 border border-purple-600/30"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          {item.popularity && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-yellow-400 font-semibold">
                                {item.popularity}%
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() => handleItemClick(item.id)}
                          className="w-full mt-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold text-white transition-all duration-300 group-hover:shadow-lg"
                        >
                          开始体验
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progressive Disclosure Controls */}
        {hiddenItemsCount > 0 && (
          <div className="text-center py-6">
            <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 backdrop-blur-sm rounded-xl border border-purple-400/20 p-6">
              <div className="flex items-center justify-center mb-4">
                <Eye className="w-5 h-5 text-purple-400 mr-2" />
                <span className="text-purple-300">
                  还有 {hiddenItemsCount} 个占卜方法
                </span>
              </div>
              
              {showMoreOptions && (
                <div className="bg-blue-900/20 rounded-lg p-4 mb-4 border border-blue-400/20">
                  <div className="flex items-center justify-center mb-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400 mr-2" />
                    <span className="text-yellow-400 text-sm font-medium">专家建议</span>
                  </div>
                  <p className="text-purple-200 text-sm">
                    您已经有一定的使用经验，可以尝试更多高级的占卜方法获得更深入的洞察。
                  </p>
                </div>
              )}
              
              <button
                onClick={() => setShowAll(!showAll)}
                className="flex items-center justify-center space-x-2 mx-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105"
              >
                {showAll ? (
                  <>
                    <EyeOff className="w-5 h-5" />
                    <span>简化显示</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5" />
                    <span>查看全部选项</span>
                  </>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        )}

        {/* Advanced Options - Only shown when expanded */}
        {showAll && nonEssentialItems.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">更多选择</h3>
              <span className="px-2 py-1 bg-blue-500/20 rounded-full text-xs text-blue-400 font-medium">
                进阶
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nonEssentialItems.map((item) => {
                const IconComponent = item.icon;
                
                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className="group relative bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600/20 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-blue-400/50"
                  >
                    <div className="text-center">
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-r ${item.color} p-3 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-full h-full text-white" />
                      </div>
                      
                      <h4 className="font-bold text-lg mb-2 group-hover:text-blue-400 transition-colors text-white">
                        {item.title}
                      </h4>
                      
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      
                      {item.tags && (
                        <div className="flex flex-wrap gap-1 justify-center">
                          {item.tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <ArrowRight className="absolute bottom-3 right-3 w-4 h-4 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Usage Tips */}
      {userInteractions >= 1 && userInteractions < 3 && (
        <div className="mt-8 bg-gradient-to-r from-green-900/20 to-teal-900/20 backdrop-blur-sm rounded-xl border border-green-400/20 p-4">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-green-400 font-medium mb-1">使用小贴士</h4>
              <p className="text-green-200 text-sm">
                试试不同类型的占卜方法，每种都有独特的视角。多尝试几次后，系统会为您推荐更适合的选项。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressiveDisclosure;