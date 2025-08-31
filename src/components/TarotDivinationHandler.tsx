import React from 'react';
import { generateTarotReadingWithReversed } from '../utils/tarotUtils';
// DivinationResult type definition
interface DivinationResult {
  result: string;
  cards?: {
    name: string;
    meaning: string;
    description: string;
    reversed?: boolean;
  }[];
}

interface TarotDivinationHandlerProps {
  cardCount: number;
  onResult: (result: DivinationResult) => void;
}

export const TarotDivinationHandler: React.FC<TarotDivinationHandlerProps> = ({
  cardCount,
  onResult
}) => {
  const handleTarotDivination = () => {
    // 使用传入的卡片数量
    
    // 生成真实的塔罗牌占卜结果
    const tarotReading = generateTarotReadingWithReversed(cardCount);
    
    // 构建占卜结果
    const result: DivinationResult = {
      result: tarotReading.interpretation,
      cards: tarotReading.cardsWithReversed.map(card => ({
        name: card.isReversed ? `${card.name}（逆位）` : card.name,
        meaning: card.isReversed ? card.reversedMeaning : card.meaning,
        description: card.description,
        reversed: card.isReversed
      }))
    };
    
    onResult(result);
  };

  // 组件挂载时自动执行占卜
  React.useEffect(() => {
    handleTarotDivination();
  }, []);

  return null; // 这是一个逻辑组件，不渲染任何UI
};

export default TarotDivinationHandler;