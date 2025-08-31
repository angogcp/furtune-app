import React, { memo } from 'react';
import { allTarotCards, tarotSpreads } from '../../data/tarotCards';
import { Shuffle, RotateCcw } from 'lucide-react';

interface TarotCardGridProps {
  selectedCards: number[];
  onCardSelect: (cardIndex: number) => void;
  onClearSelection: () => void;
  maxCards: number;
  selectedSpread: string;
}

const TarotCardGrid = memo<TarotCardGridProps>(({
  selectedCards,
  onCardSelect,
  onClearSelection,
  maxCards,
  selectedSpread
}) => {
  const handleCardClick = (index: number) => {
    const isSelected = selectedCards.includes(index);
    const canSelect = !isSelected && selectedCards.length < maxCards;
    
    if (isSelected || canSelect) {
      onCardSelect(index);
    }
  };

  return (
    <div className="space-y-4">
      {/* 塔罗牌选择界面 */}
      <div className="bg-slate-800/30 rounded-xl p-4">
        <h4 className="text-white font-medium mb-3">选择您的塔罗牌</h4>
        <p className="text-slate-400 text-sm mb-4">
          请选择 {maxCards} 张牌
        </p>
        
        <div className="grid grid-cols-6 md:grid-cols-10 gap-2 mb-4 max-h-96 overflow-y-auto">
          {allTarotCards.map((card, index) => {
            const isSelected = selectedCards.includes(index);
            const canSelect = !isSelected && selectedCards.length < maxCards;
            
            return (
              <button
                key={index}
                onClick={() => handleCardClick(index)}
                disabled={!canSelect && !isSelected}
                className={`aspect-[2/3] rounded-lg border-2 transition-all duration-300 relative ${
                  isSelected
                    ? 'border-purple-400 bg-purple-500/20 shadow-lg shadow-purple-500/50'
                    : canSelect
                    ? 'border-slate-600 bg-slate-700/50 hover:border-purple-400/60 hover:bg-slate-600/50'
                    : 'border-slate-700 bg-slate-800/30 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="h-full flex flex-col items-center justify-center p-1">
                  <div className="text-xs font-bold text-purple-300 mb-1">{index + 1}</div>
                  <div className="text-[10px] text-slate-400 text-center leading-tight">{card.name}</div>
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {selectedCards.indexOf(index) + 1}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">
            已选择 {selectedCards.length} / {maxCards} 张牌
          </span>
          <button
            onClick={onClearSelection}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            重新选择
          </button>
        </div>
      </div>
      
      {/* 洗牌信息 */}
      <div className="flex items-center justify-between bg-slate-800/30 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <Shuffle className="w-5 h-5 text-purple-400" />
          <span className="text-white font-medium">自动洗牌</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-300">
          <span>支持正逆位解读</span>
          <RotateCcw className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
});

TarotCardGrid.displayName = 'TarotCardGrid';

export { TarotCardGrid };