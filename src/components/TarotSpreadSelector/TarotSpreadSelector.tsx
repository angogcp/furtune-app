import React, { memo } from 'react';
import { tarotSpreads } from '../../data/tarotCards';
import { Star, Sparkles } from 'lucide-react';

interface TarotSpreadSelectorProps {
  selectedSpread: string;
  onSpreadSelect: (spreadId: string) => void;
}

const TarotSpreadSelector = memo<TarotSpreadSelectorProps>(({
  selectedSpread,
  onSpreadSelect
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="text-6xl animate-pulse">🔮</div>
        <h3 className="text-xl font-semibold text-white">选择塔罗牌阵</h3>
        <p className="text-slate-300">不同的牌阵能为您提供不同角度的洞察</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tarotSpreads.map((spread) => (
          <div
            key={spread.id}
            className={`relative p-6 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedSpread === spread.id
                ? 'bg-gradient-to-br from-purple-600/50 to-pink-600/50 border-2 border-purple-400 shadow-lg shadow-purple-500/25'
                : 'bg-gradient-to-br from-slate-800/50 to-purple-800/30 border border-slate-600 hover:border-purple-400'
            }`}
            onClick={() => onSpreadSelect(spread.id)}
          >
            {selectedSpread === spread.id && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            )}
            
            <div className="text-center space-y-3">
              <div className="text-4xl mb-3">
                {spread.id === 'single' ? '🃏' : 
                 spread.id === 'three_card' ? '🎴' : 
                 spread.id === 'five_card' ? '✨' : '🌟'}
              </div>
              <h4 className="text-xl font-semibold text-white">{spread.name}</h4>
              <p className="text-slate-300 text-sm leading-relaxed">{spread.description}</p>
              <div className="text-lg font-bold text-purple-300">{spread.cardCount}张牌</div>
              
              {/* 牌阵位置预览 */}
              <div className="bg-slate-700/30 rounded-lg p-3 mt-4">
                <div className="text-xs text-slate-400 mb-2">牌位含义：</div>
                <div className="space-y-1">
                  {spread.positions.slice(0, 3).map((position, index) => (
                    <div key={index} className="text-xs text-slate-300">
                      {index + 1}. {position.name} - {position.meaning}
                    </div>
                  ))}
                  {spread.positions.length > 3 && (
                    <div className="text-xs text-slate-400">
                      还有 {spread.positions.length - 3} 个位置...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

TarotSpreadSelector.displayName = 'TarotSpreadSelector';

export { TarotSpreadSelector };