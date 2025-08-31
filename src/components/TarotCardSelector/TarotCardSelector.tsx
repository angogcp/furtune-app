import React from 'react';
import { Star, Sparkles } from 'lucide-react';

interface TarotCardSelectorProps {
  selectedCount: number;
  onCountSelect: (count: number) => void;
  onConfirm: () => void;
}

const cardOptions = [
  { count: 1, name: '单张占卜', description: '简单直接的指引', icon: '🔮' },
  { count: 3, name: '三张牌阵', description: '过去·现在·未来', icon: '✨' },
  { count: 5, name: '五张牌阵', description: '深度分析指引', icon: '🌟' },
  { count: 10, name: '十张牌阵', description: '全面人生解读', icon: '💫' }
];

export const TarotCardSelector: React.FC<TarotCardSelectorProps> = ({
  selectedCount,
  onCountSelect,
  onConfirm
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 shadow-2xl">
          <Star className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent mb-2">
          选择塔罗牌数量
        </h2>
        <p className="text-slate-300 text-lg">
          从78张神秘塔罗牌中为您抽取指引
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cardOptions.map((option) => (
          <div
            key={option.count}
            className={`relative p-6 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedCount === option.count
                ? 'bg-gradient-to-br from-purple-600/50 to-pink-600/50 border-2 border-purple-400 shadow-lg shadow-purple-500/25'
                : 'bg-gradient-to-br from-slate-800/50 to-purple-800/30 border border-slate-600 hover:border-purple-400'
            }`}
            onClick={() => onCountSelect(option.count)}
          >
            {selectedCount === option.count && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            )}
            
            <div className="text-center">
              <div className="text-4xl mb-3">{option.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{option.name}</h3>
              <p className="text-slate-300 text-sm mb-3">{option.description}</p>
              <div className="text-2xl font-bold text-purple-300">{option.count}张</div>
            </div>
          </div>
        ))}
      </div>

      {selectedCount > 0 && (
        <div className="text-center">
          <button
            onClick={onConfirm}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            开始抽取 {selectedCount} 张塔罗牌
          </button>
        </div>
      )}
    </div>
  );
};