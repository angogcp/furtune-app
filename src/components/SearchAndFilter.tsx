import React, { useState, useMemo, useCallback } from 'react';
import { 
  Search, Filter, X, SlidersHorizontal, Star, Clock, 
  TrendingUp, Award, ChevronDown, Check, RotateCcw
} from 'lucide-react';

interface FilterOptions {
  category: string[];
  difficulty: string[];
  popularity: { min: number; max: number };
  tags: string[];
}

interface SearchAndFilterProps {
  onSearch: (term: string) => void;
  onFilter: (filters: FilterOptions) => void;
  categories: Array<{ id: string; title: string; count: number }>;
  availableTags: string[];
  className?: string;
}

const difficultyOptions = [
  { id: 'beginner', label: '入门', color: 'text-green-400' },
  { id: 'intermediate', label: '进阶', color: 'text-yellow-400' },
  { id: 'advanced', label: '专业', color: 'text-red-400' }
];

const popularityRanges = [
  { id: 'high', label: '热门 (80-100%)', min: 80, max: 100 },
  { id: 'medium', label: '常见 (60-79%)', min: 60, max: 79 },
  { id: 'low', label: '小众 (0-59%)', min: 0, max: 59 }
];

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  onSearch,
  onFilter,
  categories,
  availableTags,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedPopularity, setSelectedPopularity] = useState<{ min: number; max: number }>({ min: 0, max: 100 });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Quick filters
  const [quickFilter, setQuickFilter] = useState<string>('');

  // Search suggestions
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchSuggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const suggestions = [
      ...categories.map(cat => ({ type: 'category', label: cat.title, value: cat.id })),
      ...availableTags.map(tag => ({ type: 'tag', label: tag, value: tag })),
      ...difficultyOptions.map(diff => ({ type: 'difficulty', label: diff.label, value: diff.id }))
    ];
    
    return suggestions
      .filter(suggestion => 
        suggestion.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 8);
  }, [searchTerm, categories, availableTags]);

  // Handle search
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    onSearch(term);
    setShowSuggestions(false);
  }, [onSearch]);

  // Handle filter changes
  const applyFilters = useCallback(() => {
    onFilter({
      category: selectedCategories,
      difficulty: selectedDifficulties,
      popularity: selectedPopularity,
      tags: selectedTags
    });
  }, [selectedCategories, selectedDifficulties, selectedPopularity, selectedTags, onFilter]);

  // Apply filters whenever they change
  React.useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Quick filter handlers
  const handleQuickFilter = (type: string) => {
    setQuickFilter(type);
    switch (type) {
      case 'popular':
        setSelectedPopularity({ min: 80, max: 100 });
        break;
      case 'beginner':
        setSelectedDifficulties(['beginner']);
        break;
      case 'traditional':
        setSelectedCategories(['traditional']);
        break;
      case 'modern':
        setSelectedCategories(['modern']);
        break;
      default:
        break;
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedDifficulties([]);
    setSelectedPopularity({ min: 0, max: 100 });
    setSelectedTags([]);
    setQuickFilter('');
    setSearchTerm('');
    onSearch('');
  };

  // Count active filters
  const activeFiltersCount = selectedCategories.length + selectedDifficulties.length + selectedTags.length + 
    (selectedPopularity.min > 0 || selectedPopularity.max < 100 ? 1 : 0);

  return (
    <div className={`${className}`}>
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="flex items-center space-x-2">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-purple-400" />
            </div>
            <input
              type="text"
              placeholder="搜索占卜方法、标签或类别..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full pl-10 pr-4 py-3 bg-purple-800/50 border border-purple-600 rounded-xl text-white placeholder-purple-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearch('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="w-5 h-5 text-purple-400 hover:text-white transition-colors" />
              </button>
            )}
            
            {/* Search Suggestions */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-purple-900/95 backdrop-blur-sm border border-purple-600 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(suggestion.label)}
                    className="w-full text-left px-4 py-3 hover:bg-purple-700/50 transition-colors border-b border-purple-700/30 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-purple-400 uppercase font-medium w-16">
                        {suggestion.type}
                      </span>
                      <span className="text-white">{suggestion.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative p-3 rounded-xl border transition-all duration-300 ${
              showFilters || activeFiltersCount > 0
                ? 'bg-yellow-500/20 border-yellow-400 text-yellow-400'
                : 'bg-purple-800/50 border-purple-600 text-purple-400 hover:border-purple-500'
            }`}
          >
            <Filter className="w-5 h-5" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Reset Button */}
          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="p-3 bg-gray-600/50 hover:bg-gray-600/70 border border-gray-500 rounded-xl transition-all duration-300"
              title="清除所有筛选"
            >
              <RotateCcw className="w-5 h-5 text-gray-300" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium text-purple-200">快速筛选</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'popular', label: '热门推荐', icon: TrendingUp },
            { id: 'beginner', label: '新手友好', icon: Award },
            { id: 'traditional', label: '传统命理', icon: Star },
            { id: 'modern', label: '现代占卜', icon: Clock }
          ].map((filter) => {
            const IconComponent = filter.icon;
            const isActive = quickFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => handleQuickFilter(filter.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/50'
                    : 'bg-purple-800/30 text-purple-300 border border-purple-600/30 hover:bg-purple-700/30'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{filter.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mb-6 bg-purple-900/30 backdrop-blur-sm rounded-xl border border-purple-600/30 overflow-hidden">
          <div className="p-4 border-b border-purple-600/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-5 h-5 text-purple-400" />
                <span className="font-medium text-white">高级筛选</span>
              </div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-3">类别</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {categories.map((category) => {
                  const isSelected = selectedCategories.includes(category.id);
                  return (
                    <button
                      key={category.id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedCategories(prev => prev.filter(id => id !== category.id));
                        } else {
                          setSelectedCategories(prev => [...prev, category.id]);
                        }
                      }}
                      className={`flex items-center justify-between p-3 rounded-lg text-sm transition-all duration-300 ${
                        isSelected
                          ? 'bg-purple-600/50 border-2 border-purple-400 text-white'
                          : 'bg-purple-800/30 border border-purple-600/50 text-purple-300 hover:bg-purple-700/30'
                      }`}
                    >
                      <span>{category.title}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs opacity-70">({category.count})</span>
                        {isSelected && <Check className="w-4 h-4 text-green-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-3">难度等级</label>
              <div className="flex flex-wrap gap-2">
                {difficultyOptions.map((difficulty) => {
                  const isSelected = selectedDifficulties.includes(difficulty.id);
                  return (
                    <button
                      key={difficulty.id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedDifficulties(prev => prev.filter(id => id !== difficulty.id));
                        } else {
                          setSelectedDifficulties(prev => [...prev, difficulty.id]);
                        }
                      }}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isSelected
                          ? 'bg-purple-600/50 border-2 border-purple-400 text-white'
                          : 'bg-purple-800/30 border border-purple-600/50 text-purple-300 hover:bg-purple-700/30'
                      }`}
                    >
                      <span className={difficulty.color}>{difficulty.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-green-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Popularity */}
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-3">热门度</label>
              <div className="flex flex-wrap gap-2">
                {popularityRanges.map((range) => {
                  const isSelected = selectedPopularity.min === range.min && selectedPopularity.max === range.max;
                  return (
                    <button
                      key={range.id}
                      onClick={() => setSelectedPopularity({ min: range.min, max: range.max })}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isSelected
                          ? 'bg-yellow-500/20 border-2 border-yellow-400 text-yellow-400'
                          : 'bg-purple-800/30 border border-purple-600/50 text-purple-300 hover:bg-purple-700/30'
                      }`}
                    >
                      <span>{range.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-green-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Advanced Options */}
            {showAdvanced && (
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-3">标签</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedTags(prev => prev.filter(t => t !== tag));
                          } else {
                            setSelectedTags(prev => [...prev, tag]);
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                          isSelected
                            ? 'bg-blue-500/20 border border-blue-400 text-blue-400'
                            : 'bg-purple-800/30 border border-purple-600/50 text-purple-300 hover:bg-purple-700/30'
                        }`}
                      >
                        {tag}
                        {isSelected && <Check className="w-3 h-3 ml-1 inline" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;