import type { TarotCard } from '../data/tarotCards';
import { allTarotCards, tarotSpreads } from '../data/tarotCards';

// 随机抽取指定数量的塔罗牌
export function drawRandomTarotCards(count: number): TarotCard[] {
  if (count <= 0 || count > allTarotCards.length) {
    throw new Error(`Invalid card count: ${count}. Must be between 1 and ${allTarotCards.length}`);
  }

  // 创建牌组副本以避免修改原数组
  const deck = [...allTarotCards];
  const drawnCards: TarotCard[] = [];

  // 使用Fisher-Yates洗牌算法随机抽取
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * deck.length);
    const drawnCard = deck.splice(randomIndex, 1)[0];
    drawnCards.push(drawnCard);
  }

  return drawnCards;
}

// 根据卡片数量获取对应的牌阵
export function getTarotSpreadByCardCount(count: number) {
  return tarotSpreads.find(spread => spread.cardCount === count) || tarotSpreads[0];
}

// 生成塔罗占卜结果
export interface TarotReading {
  cards: TarotCard[];
  spread: typeof tarotSpreads[0];
  interpretation: string;
  advice: string;
}

export function generateTarotReading(cardCount: number): TarotReading {
  const cards = drawRandomTarotCards(cardCount);
  const spread = getTarotSpreadByCardCount(cardCount);
  
  // 生成解读
  const interpretation = generateInterpretation(cards, spread);
  const advice = generateAdvice(cards);

  return {
    cards,
    spread,
    interpretation,
    advice
  };
}

// 生成牌阵解读
function generateInterpretation(cards: TarotCard[], spread: typeof tarotSpreads[0]): string {
  let interpretation = `本次为您抽取了${cards.length}张塔罗牌，使用${spread.name}进行解读：\n\n`;
  
  cards.forEach((card, index) => {
    const position = spread.positions[index];
    if (position) {
      interpretation += `**${position.name}** - ${card.name}\n`;
      interpretation += `${position.meaning}：${card.meaning}\n`;
      interpretation += `${card.description}\n\n`;
    } else {
      interpretation += `**第${index + 1}张牌** - ${card.name}\n`;
      interpretation += `含义：${card.meaning}\n`;
      interpretation += `${card.description}\n\n`;
    }
  });

  return interpretation;
}

// 生成建议
function generateAdvice(cards: TarotCard[]): string {
  const keywords = cards.flatMap(card => card.keywords);
  const uniqueKeywords = [...new Set(keywords)];
  
  let advice = '根据您抽取的塔罗牌，我为您提供以下建议：\n\n';
  
  // 根据关键词生成建议
  if (uniqueKeywords.includes('爱情')) {
    advice += '💕 **感情方面**：保持开放的心态，真诚地表达自己的感受。\n';
  }
  if (uniqueKeywords.includes('事业')) {
    advice += '💼 **事业方面**：专注于当前的目标，耐心等待机会的到来。\n';
  }
  if (uniqueKeywords.includes('财富')) {
    advice += '💰 **财运方面**：理性管理财务，避免冲动消费。\n';
  }
  if (uniqueKeywords.includes('健康')) {
    advice += '🌿 **健康方面**：注意身心平衡，适当休息和放松。\n';
  }
  
  advice += '\n记住，塔罗牌只是指引，最终的选择权在您手中。相信自己的直觉，勇敢地走向未来。';
  
  return advice;
}

// 添加正逆位信息到塔罗牌
export function addReversedInfo(cards: TarotCard[]): (TarotCard & { isReversed: boolean })[] {
  return cards.map(card => ({
    ...card,
    isReversed: Math.random() < 0.3 // 30%概率为逆位
  }));
}

// 生成带正逆位的塔罗占卜结果
export function generateTarotReadingWithReversed(cardCount: number): TarotReading & { cardsWithReversed: (TarotCard & { isReversed: boolean })[] } {
  const cards = drawRandomTarotCards(cardCount);
  const cardsWithReversed = addReversedInfo(cards);
  const spread = getTarotSpreadByCardCount(cardCount);
  
  // 生成解读（考虑正逆位）
  const interpretation = generateInterpretationWithReversed(cardsWithReversed, spread);
  const advice = generateAdvice(cards);

  return {
    cards,
    cardsWithReversed,
    spread,
    interpretation,
    advice
  };
}

// 生成带正逆位的牌阵解读
function generateInterpretationWithReversed(cards: (TarotCard & { isReversed: boolean })[], spread: typeof tarotSpreads[0]): string {
  let interpretation = `本次为您抽取了${cards.length}张塔罗牌，使用${spread.name}进行解读：\n\n`;
  
  cards.forEach((card, index) => {
    const position = spread.positions[index];
    const reversedText = card.isReversed ? ' (逆位)' : ' (正位)';
    
    if (position) {
      interpretation += `**${position.name}** - ${card.name}${reversedText}\n`;
      interpretation += `${position.meaning}：`;
      
      if (card.isReversed && card.reversedMeaning) {
        interpretation += `${card.reversedMeaning}\n`;
      } else {
        interpretation += `${card.meaning}\n`;
      }
      
      interpretation += `${card.description}\n\n`;
    } else {
      interpretation += `**第${index + 1}张牌** - ${card.name}${reversedText}\n`;
      
      if (card.isReversed && card.reversedMeaning) {
        interpretation += `含义：${card.reversedMeaning}\n`;
      } else {
        interpretation += `含义：${card.meaning}\n`;
      }
      
      interpretation += `${card.description}\n\n`;
    }
  });

  return interpretation;
}