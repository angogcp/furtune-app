import { useState, useCallback, useMemo } from 'react';
import { API_BASE_URL } from './config/api';

import { Star, Moon, Sun, Gem, Heart, Coins, Briefcase, Shield, Sparkles, BookOpen, Copy, Brain, UserPlus, Scroll, ArrowRight, MessageCircle, Shuffle, RotateCcw } from 'lucide-react';
import { Button, Card, CardContent, Loading, InteractiveBackground, ToastContainer, useToast, AnimatedCard, AnimatedButton, ParticleEffect, AnimatedText, FloatingActionButton, Input } from './components/ui';

// 占卜方法配置 - 完整版本
const divinationMethods = [
  // 西方占卜
  {
    id: 'tarot',
    name: '塔罗占卜',
    description: '通过神秘的塔罗牌获得人生指引',
    icon: <Star className="w-8 h-8" />,
    gradient: 'from-purple-600 to-pink-600',
    color: 'purple',
    category: 'western'
  },
  {
    id: 'astrology',
    name: '星座占星',
    description: '解读星象运行对您的影响',
    icon: <Moon className="w-8 h-8" />,
    gradient: 'from-blue-600 to-indigo-600',
    color: 'blue',
    category: 'western'
  },
  {
    id: 'numerology',
    name: '数字命理',
    description: '通过数字能量揭示命运密码',
    icon: <Gem className="w-8 h-8" />,
    gradient: 'from-emerald-600 to-teal-600',
    color: 'emerald',
    category: 'western'
  },
  // 东方占卜
  {
    id: 'lottery',
    name: '观音求签',
    description: '虔诚祈祷，抽取灵签获得指引',
    icon: <Sun className="w-8 h-8" />,
    gradient: 'from-orange-600 to-red-600',
    color: 'orange',
    category: 'eastern'
  },
  {
    id: 'jiaobei',
    name: '问卦擲筊',
    description: '擲筊求神明指示，获得明确答案',
    icon: <Coins className="w-8 h-8" />,
    gradient: 'from-green-600 to-teal-600',
    color: 'green',
    category: 'eastern'
  },
  {
    id: 'bazi',
    name: '八字命理',
    description: '传统八字分析，洞察人生格局',
    icon: <BookOpen className="w-8 h-8" />,
    gradient: 'from-yellow-600 to-orange-600',
    color: 'yellow',
    category: 'eastern'
  },
  {
    id: 'ziwei',
    name: '紫微斗数',
    description: '紫微星盘解析，预测命运轨迹',
    icon: <Sparkles className="w-8 h-8" />,
    gradient: 'from-purple-600 to-indigo-600',
    color: 'purple',
    category: 'eastern'
  },
  // 心理测试
  {
    id: 'personality',
    name: '性格测试',
    description: '深度分析性格特质，了解真实自我',
    icon: <Brain className="w-8 h-8" />,
    gradient: 'from-pink-600 to-rose-600',
    color: 'pink',
    category: 'psychology'
  },
  {
    id: 'compatibility',
    name: '配对打分',
    description: '测试两人缘分指数，分析感情匹配度',
    icon: <UserPlus className="w-8 h-8" />,
    gradient: 'from-red-600 to-pink-600',
    color: 'red',
    category: 'psychology'
  },
  {
    id: 'lifestory',
    name: '命格小故事',
    description: '生成专属命运故事，趣味了解人生轨迹',
    icon: <Scroll className="w-8 h-8" />,
    gradient: 'from-indigo-600 to-purple-600',
    color: 'indigo',
    category: 'psychology'
  }
];

// 占卜类型配置
const readingTypes = [
  { id: 'love', name: '爱情运势', icon: <Heart className="w-6 h-6" /> },
  { id: 'career', name: '事业发展', icon: <Briefcase className="w-6 h-6" /> },
  { id: 'wealth', name: '财富运势', icon: <Coins className="w-6 h-6" /> },
  { id: 'health', name: '健康状况', icon: <Shield className="w-6 h-6" /> },
  { id: 'general', name: '综合运势', icon: <Sparkles className="w-6 h-6" /> }
];

// 导入完整的塔罗牌数据
import { allTarotCards, majorArcana, tarotSpreads } from './data/tarotCards';

// 导入完整的星座占星数据
import { getZodiacSign, calculateCompatibility, generateBirthChart } from './data/astrologyData';

// 导入完整的数字命理数据
import { calculateLifeNumber, getLifeNumberInfo, calculateNumerologyCompatibility, generateDailyNumerologyFortune, generateLuckyElementsRecommendation, calculateExpressionNumber, calculateAdvancedNameAnalysis } from './data/numerologyData';
// 导入完整的观音灵签数据
import { lotteryData } from './data/lotteryData';
// 导入心理测试数据
import { mbtiTypes, calculateMBTIResult } from './data/mbtiData';
import { calculateCompatibilityScore, generateLifeStory } from './data/psychologyData';

// 导入心理测试组件
import MBTITest from './components/MBTITest/MBTITest';
import CompatibilityTest from './components/CompatibilityTest/CompatibilityTest';
import LifeStoryInput from './components/LifeStoryInput/LifeStoryInput';


// 保持向后兼容的塔罗牌数据
const tarotCards = majorArcana;

// 生成个性化的今日运势
function generatePersonalizedDailyHoroscope(sign: any, userQuestion: string, timeBasedSeed: number): string {
  // 基于用户问题和时间生成个性化运势
  const questionKeywords = userQuestion.toLowerCase();
  const isLoveQuestion = questionKeywords.includes('爱情') || questionKeywords.includes('感情') || questionKeywords.includes('恋爱');
  const isCareerQuestion = questionKeywords.includes('事业') || questionKeywords.includes('工作') || questionKeywords.includes('职业');
  const isWealthQuestion = questionKeywords.includes('财运') || questionKeywords.includes('金钱') || questionKeywords.includes('财富');
  const isHealthQuestion = questionKeywords.includes('健康') || questionKeywords.includes('身体');
  
  // 基于时间种子生成不同的运势内容
  const fortuneVariations = {
    love: [
      '今日桃花运旺盛，单身者有机会遇到心仪对象，已有伴侣的感情更加稳定。',
      '感情方面需要更多耐心，避免因小事产生争执，多关注对方的感受。',
      '爱情能量强烈，适合表达真心，但要注意不要过于急躁。'
    ],
    career: [
      '事业运势上升，工作中会有新的机遇出现，把握时机展现能力。',
      '职场人际关系和谐，贵人运旺盛，适合寻求合作或建议。',
      '工作压力较大，需要合理安排时间，保持工作与生活的平衡。'
    ],
    wealth: [
      '财运亨通，有意外收入的可能，但需要理性投资，避免冲动消费。',
      '财务状况稳定，适合制定长期理财计划，储蓄为主。',
      '偏财运不错，可以适当尝试小额投资，但要谨慎行事。'
    ],
    health: [
      '健康运势良好，精力充沛，适合开始新的健身计划。',
      '注意休息，避免过度劳累，保持规律的作息时间。',
      '身心状态佳，适合进行放松活动，如瑜伽或冥想。'
    ],
    general: [
      '整体运势呈上升趋势，各方面都有不错的发展机会。',
      '运势平稳，适合稳扎稳打，专注于现有的目标和计划。',
      '运势波动较大，需要保持冷静理性，等待时机成熟。'
    ]
  };
  
  let mainFortune = '';
  if (isLoveQuestion) {
    mainFortune = fortuneVariations.love[timeBasedSeed % 3];
  } else if (isCareerQuestion) {
    mainFortune = fortuneVariations.career[timeBasedSeed % 3];
  } else if (isWealthQuestion) {
    mainFortune = fortuneVariations.wealth[timeBasedSeed % 3];
  } else if (isHealthQuestion) {
    mainFortune = fortuneVariations.health[timeBasedSeed % 3];
  } else {
    mainFortune = fortuneVariations.general[timeBasedSeed % 3];
  }
  
  // 基于星座特质的个性化建议
  const signAdvice = {
    aries: '发挥您的领导才能，但要注意控制冲动。',
    taurus: '保持稳重的步调，耐心等待最佳时机。',
    gemini: '善用您的沟通技巧，多方面收集信息。',
    cancer: '相信直觉，关注内心的声音和感受。',
    leo: '展现自信魅力，但要避免过于自我中心。',
    virgo: '注重细节，完美主义有助于成功。',
    libra: '寻求平衡与和谐，避免过度犹豫不决。',
    scorpio: '深入探索真相，但要控制占有欲。',
    sagittarius: '保持乐观态度，勇于探索新机会。',
    capricorn: '制定实际计划，一步步实现目标。',
    aquarius: '发挥创新思维，但要考虑实际可行性。',
    pisces: '相信直觉和想象力，但要保持现实感。'
  };
  
  const personalAdvice = signAdvice[sign.id as keyof typeof signAdvice] || '相信自己的判断，勇敢前行。';
  
  return `🌟 ${sign.name}今日运势\n\n` +
    `${mainFortune}\n\n` +
    `💫 **个人建议**：${personalAdvice}\n\n` +
    `🍀 **幸运提示**\n` +
    `• 幸运数字：${sign.luckyNumbers[timeBasedSeed % sign.luckyNumbers.length]}\n` +
    `• 幸运颜色：${sign.luckyColors[timeBasedSeed % sign.luckyColors.length]}\n` +
    `• 开运方位：${['东方', '南方', '西方', '北方'][timeBasedSeed % 4]}\n\n` +
    `✨ **今日关键词**：${sign.keywords.slice(0, 3).join('、')}`;
}

export default function App() {
  const [currentStep, setCurrentStep] = useState<'method' | 'type' | 'input' | 'result'>('method');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [isGeneratingInterpretation, setIsGeneratingInterpretation] = useState(false);
  const [plainLanguageResult, setPlainLanguageResult] = useState('');
  const [specialData, setSpecialData] = useState<Record<string, unknown>>({});  // 用于存储抽签、擲筊等特殊数据
  const [isDrawing, setIsDrawing] = useState(false);  // 抽签/投掷动画状态
  const [drawingResult, setDrawingResult] = useState<any>(null);  // 抽签/投掷结果
  const [jiaobeiBlessConfirmed, setJiaobeiBlessConfirmed] = useState(false);  // 擲筊祈福确认状态
  const [birthInfo, setBirthInfo] = useState({ date: '', time: '', place: '', gender: '' });
  // const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [partnerInfo, setPartnerInfo] = useState({ name: '', birthDate: '', zodiac: '' });
  const { toasts, showSuccess, showError, showInfo, removeToast } = useToast();

  const handleMethodSelect = useCallback((methodId: string) => {
    setSelectedMethod(methodId);
    setCurrentStep('type');
    const method = divinationMethods.find(m => m.id === methodId);
    showInfo('占卜方法已选择', `您选择了${method?.name}，请继续选择占卜类型`);
    setPlainLanguageResult(''); // 清除之前的大白话解读结果
  }, [showInfo]);

  const handleTypeSelect = useCallback((typeId: string) => {
    setSelectedType(typeId);
    setCurrentStep('input');
    // 重置specialData，确保塔罗牌选择界面能正常显示
    if (selectedMethod === 'tarot') {
      setSpecialData({ selectedCards: [], cardCount: undefined });
    } else {
      setSpecialData({});
    }
    const type = readingTypes.find(t => t.id === typeId);
    setPlainLanguageResult(''); // 清除之前的大白话解读结果
    showInfo('占卜类型已选择', `您选择了${type?.name}，请输入您的问题`);
  }, [showInfo, selectedMethod]);

  // 生成详细的占卜结果
  const generateDivinationResult = useCallback((methodId: string, typeId: string, input: string, _specialData?: Record<string, unknown>) => {
    const method = divinationMethods.find(m => m.id === methodId);
    const type = readingTypes.find(t => t.id === typeId);
    
    switch (methodId) {
      case 'tarot':
        // 根据占卜类型选择牌阵
        const spreadType = typeId || 'single';
        const currentSpread = tarotSpreads.find(s => s.id === spreadType) || tarotSpreads[0];
        const cardCount = currentSpread.positions.length;
        
        // 使用用户选择的牌或随机选择
        let selectedCards;
        const userSelectedCards = (_specialData as any)?.selectedCards;
        
        if (userSelectedCards && userSelectedCards.length > 0) {
          // 确保用户选择的所有牌都被处理，不限制数量
          selectedCards = userSelectedCards.map((cardIndex: number, index: number) => {
            const card = allTarotCards[cardIndex];
            if (!card) {
              console.warn(`Card with index ${cardIndex} not found in allTarotCards.`);
              return null;
            }
            return {
              ...card,
              isReversed: Math.random() < 0.3, // 30%概率为逆位
              position: currentSpread.positions[index] || { name: `位置 ${index + 1}`, meaning: `牌阵位置 ${index + 1}` }
            };
          }).filter(card => card !== null);
          

        } else {
          // 如果用户没有选择牌，则随机选择
          selectedCards = Array.from({length: currentSpread.positions.length}, (_, i) => {
            const randomIndex = Math.floor(Math.random() * allTarotCards.length);
            const card = allTarotCards[randomIndex];
            return {
              ...card,
              isReversed: Math.random() < 0.3,
              position: currentSpread.positions[i]
            };
          });
        }
        
        // 将处理后的牌信息保存到 specialData 中，以便后续使用
        if (_specialData) {
          _specialData.processedTarotCards = selectedCards;
        }
        
        // 生成牌面解读
        const cardInterpretations = selectedCards
          .filter((card: any) => 
            card && 
            typeof card === 'object' && 
            'name' in card && 
            card.name !== undefined && 
            card.name !== null &&
            'isReversed' in card &&
            'meaning' in card &&
            'reversedMeaning' in card &&
            'keywords' in card &&
            Array.isArray(card.keywords)
          )
          .map((card: any, index: number) => {
            const position = currentSpread.positions[index] || { name: `位置 ${index + 1}`, meaning: `牌阵位置 ${index + 1}` };
            
            const meaning = card.isReversed ? card.reversedMeaning : card.meaning;
            const orientation = card.isReversed ? '（逆位）' : '（正位）';
            
            return `**${position.name}${orientation}：${card.name}**\n${position.meaning}\n解读：${meaning}\n关键词：${card.keywords.join('、')}`;
          })
          .filter(Boolean)
          .join('\n\n');
        
        // 生成综合分析
        const majorCards = selectedCards.filter((card: any) => card.category === 'major');
        const minorCards = selectedCards.filter((card: any) => card.category === 'minor');
        const reversedCards = selectedCards.filter((card: any) => card.isReversed);
        
        let analysis = '';
        if (majorCards.length > minorCards.length) {
          analysis += '大阿卡纳牌较多，表示这次占卜涉及重要的人生课题和精神层面的成长。';
        } else {
          analysis += '小阿卡纳牌较多，表示这次占卜主要关注日常生活中的具体事务。';
        }
        
        if (reversedCards.length > 0) {
          analysis += `\n\n出现${reversedCards.length}张逆位牌，提醒你需要从内在寻找答案，或者重新审视当前的方向。`;
        }
        
        return `🔮 **${currentSpread.name}牌阵解读**\n\n针对您的${type?.name}问题:"${input}"\n\n${cardInterpretations}\n\n📊 **牌阵分析**\n\n${analysis}\n\n✨ **综合建议**\n\n${currentSpread.description}根据当前牌面显示，宇宙正在为你揭示重要的信息。每张牌的出现都有其深层含义，建议你静心感受牌面传达的能量。\n\n🔮 **塔罗师的话**\n\n塔罗牌是连接潜意识与宇宙智慧的桥梁。相信直觉，让内心的声音指引你前进的方向。`;
      case 'astrology':
        // 简化的星座分析，突出今日运势
        const birthChart = generateBirthChart(birthInfo.date, birthInfo.time, birthInfo.place);
        if (!birthChart) {
          return '请提供正确的出生信息以进行星座分析。';
        }
        
        const { sunSign, moonSign, ascendant } = birthChart;
        
        // 生成个性化的今日运势（基于问题和时间）
        const currentTime = new Date();
        const timeBasedSeed = currentTime.getDate() + currentTime.getMonth() + input.length;
        const dailyHoroscope = generatePersonalizedDailyHoroscope(sunSign, input, timeBasedSeed);
        
        // 生成星座兼容性分析（如果有配对信息）
        let compatibilityAnalysis = '';
        if (partnerInfo.name && partnerInfo.birthDate) {
          const partnerSign = getZodiacSign(partnerInfo.birthDate);
          if (partnerSign) {
            const compatibilityScore = calculateCompatibility(sunSign.id, partnerSign.id);
            compatibilityAnalysis = `\n\n\u{1F495} **与${partnerInfo.name}的星座配对分析**\n\n` +
              `配对星座：${sunSign.name} × ${partnerSign.name}\n` +
              `配对指数：${compatibilityScore}分\n` +
              `配对评价：${compatibilityScore >= 85 ? '天作之合，非常匹配' : compatibilityScore >= 70 ? '相当合适，互补性强' : compatibilityScore >= 55 ? '需要磨合，但有潜力' : '挑战较大，需要更多理解'}\n` +
              `元素组合：${sunSign.element} × ${partnerSign.element}`;
          }
        }
        
        return `⭐ **星座运势分析**\n\n` +
          `🌟 **您的星座信息**\n` +
          `太阳星座：${sunSign.name}${sunSign.symbol} (${sunSign.dates})\n` +
          `月亮星座：${moonSign.name}${moonSign.symbol}\n` +
          `上升星座：${ascendant.name}${ascendant.symbol}\n\n` +
          `🎯 **针对您的${type?.name}问题**\n` +
          `"${input}"\n\n` +
          `📅 **今日星座运势**\n\n${dailyHoroscope}\n\n` +
          `✨ **${sunSign.name}座特质解析**\n\n` +
          `元素属性：${sunSign.element} - ${sunSign.element === '火象' ? '热情主动，充满活力' : sunSign.element === '土象' ? '务实稳重，注重安全' : sunSign.element === '风象' ? '思维敏捷，善于沟通' : '感性直觉，情感丰富'}\n` +
          `星座性质：${sunSign.quality} - ${sunSign.quality === '基本宫' ? '开创性强，喜欢主导' : sunSign.quality === '固定宫' ? '坚持不懈，稳定可靠' : '适应性强，灵活变通'}\n` +
          `核心特质：${sunSign.traits.join('、')}\n` +
          `天赋优势：${sunSign.strengths.join('、')}\n` +
          `需要平衡：${sunSign.weaknesses.join('、')}\n\n` +
          `🌙 **情感特质（月亮${moonSign.name}）**\n\n` +
          `情感模式：${moonSign.traits.slice(0, 3).join('、')}\n` +
          `内在需求：${moonSign.strengths.slice(0, 2).join('、')}\n\n` +
          `🔮 **外在印象（上升${ascendant.name}）**\n\n` +
          `第一印象：${ascendant.traits.slice(0, 3).join('、')}\n` +
          `行为风格：${ascendant.strengths.slice(0, 2).join('、')}\n\n` +
          `${compatibilityAnalysis}\n\n` +
          `🌟 **针对${type?.name}的建议**\n\n` +
          `• 发挥${sunSign.name}座的${sunSign.strengths[0]}优势\n` +
          `• 注意平衡${sunSign.weaknesses[0]}的倾向\n` +
          `• 结合月亮${moonSign.name}的情感需求做决定\n` +
          `• 利用上升${ascendant.name}的${ascendant.strengths[0]}特质\n\n` +
          `🍀 **幸运指引**\n\n` +
          `幸运数字：${sunSign.luckyNumbers.join('、')}\n` +
          `幸运颜色：${sunSign.luckyColors.join('、')}\n` +
          `最佳配对：${sunSign.compatibility.join('、')}\n\n` +
          `🔮 **星座师的话**\n\n星座只是人生的参考，真正的力量来自于您内心的选择。在${type?.name}方面，相信自己的直觉，结合星座的指引，勇敢地走向属于您的道路。`;
      
      case 'numerology':
        // 使用增强的数字命理系统
        const userName = (specialData as any)?.name || '用户';
        const userBirthDate = birthInfo.date;
        
        if (!userBirthDate) {
          return '请提供完整的出生日期信息以进行数字命理分析。';
        }
        
        // 计算各种数字
        const lifeNumber = calculateLifeNumber(userBirthDate);
        const expressionNumber = calculateExpressionNumber(userName);
        
        const lifeInfo = getLifeNumberInfo(lifeNumber);
        const expressionInfo = getLifeNumberInfo(expressionNumber);
        
        if (!lifeInfo || !expressionInfo) {
          return '数字命理分析出现错误，请检查输入信息。';
        }
        
        // 计算数字兼容性
        const compatibility = calculateNumerologyCompatibility(lifeNumber, expressionNumber);
        
        // 生成今日运势
        const dailyFortune = generateDailyNumerologyFortune(lifeNumber);
        
        // 高级姓名分析（仅对中文姓名）
        let advancedNameAnalysis: any = undefined;
        if (!/^[a-zA-Z\s]+$/.test(userName) && userName.length >= 2) {
          const surname = userName.substring(0, 1);
          const givenName = userName.substring(1);
          advancedNameAnalysis = calculateAdvancedNameAnalysis(surname, givenName);
        }
        
        // 生成幸运元素推荐
        const luckyElementsRecommendation = generateLuckyElementsRecommendation(lifeNumber, advancedNameAnalysis);
        
        let result = `🔢 **数字命理完整分析**\n\n` +
          `👤 **基本信息**\n` +
          `姓名：${userName}\n` +
          `出生日期：${userBirthDate}\n` +
          `占卜类型：${type?.name}\n` +
          `您的问题："${input}"\n\n` +
          `🌟 **生命数字：${lifeNumber} - ${lifeInfo.name}**\n` +
          `核心含义：${lifeInfo.meaning}\n` +
          `性格特质：${lifeInfo.personality.join('、')}\n` +
          `天赋优势：${lifeInfo.strengths.join('、')}\n` +
          `需要注意：${lifeInfo.weaknesses.join('、')}\n\n` +
          `📝 **表达数字：${expressionNumber} - ${expressionInfo.name}**\n` +
          `姓名能量：${expressionInfo.meaning}\n` +
          `影响特质：${expressionInfo.personality.slice(0, 3).join('、')}\n\n`;
        
        // 添加高级姓名分析（如果有）
        if (advancedNameAnalysis) {
          result += `🏮 **五格姓名分析**\n` +
            `总笔画：${advancedNameAnalysis.totalStrokes}画\n` +
            `人格数：${advancedNameAnalysis.personalityNumber}（主导性格）\n` +
            `天格数：${advancedNameAnalysis.destinyNumber}（先天运势）\n` +
            `地格数：${advancedNameAnalysis.earthNumber}（基础运势）\n` +
            `外格数：${advancedNameAnalysis.externalNumber}（社交运势）\n\n` +
            `📊 **各项运势评级**\n` +
            `• 综合运势：${advancedNameAnalysis.overallFortune}\n` +
            `• 事业运势：${advancedNameAnalysis.careerLuck}\n` +
            `• 财富运势：${advancedNameAnalysis.wealthLuck}\n` +
            `• 感情运势：${advancedNameAnalysis.loveLuck}\n` +
            `• 健康运势：${advancedNameAnalysis.healthLuck}\n\n`;
        }
        
        result += `💫 **数字和谐度：${compatibility}%**\n` +
          `${compatibility >= 80 ? '您的姓名与生命数字非常和谐，能够很好地支持您的人生发展。' : 
            compatibility >= 60 ? '您的姓名与生命数字基本和谐，在某些方面可能需要平衡。' : 
            '您的姓名与生命数字存在一定冲突，建议在重要决策时多加考虑。'}\n\n` +
          `🎯 **${type?.name}方面的指引**\n` +
          `适合发展：${lifeInfo.career.join('、')}\n` +
          `核心建议：发挥${lifeInfo.strengths[0]}的优势，在${type?.name}方面要注意平衡${lifeInfo.weaknesses[0]}的倾向\n` +
          `行动策略：结合生命数字${lifeNumber}的特质，在${type?.name}领域中展现${lifeInfo.keywords.join('、')}的品质\n\n` +
          `💕 **感情运势特点**\n` +
          `${lifeInfo.love.join('、')}\n` +
          `兼容数字：${lifeInfo.compatibleNumbers.join('、')}\n\n` +
          `🏥 **健康提醒**\n` +
          `${lifeInfo.health.join('、')}\n\n` +
          `📅 **今日数字运势**\n` +
          `${dailyFortune}\n\n` +
          `${luckyElementsRecommendation}\n\n` +
          `🔮 **专属建议**\n` +
          `基于您的数字命理分析，在${type?.name}方面建议您：\n` +
          `• 充分发挥生命数字${lifeNumber}的${lifeInfo.strengths[0]}特质\n` +
          `• 注意平衡${lifeInfo.weaknesses[0]}的倾向\n` +
          `• 在重要决策时参考幸运颜色${lifeInfo.luckyColors[0]}的指引\n` +
          `• 与数字${lifeInfo.compatibleNumbers.join('、')}相关的人或事物可能带来好运`;
        
        if (advancedNameAnalysis) {
          result += `\n• 根据五行属性，多运用${advancedNameAnalysis.luckyElements.colors[0]}色系增强运势\n` +
            `• 朝向${advancedNameAnalysis.luckyElements.directions[0]}发展事业会更顺利`;
        }
        
        return result;
      
      case 'lottery':
         // 使用从drawingResult传递的签号，如果没有则随机生成
         const lotteryNum = _specialData?.drawingResult || Math.floor(Math.random() * 100) + 1;
         const lottery = lotteryData[lotteryNum.toString() as keyof typeof lotteryData];
         
         // 根据签类获取对应的吉凶指引
         const categoryGuidance = {
           '上上签': '🌟 大吉大利！此签为上上之签，预示着您的愿望将会实现，前程似锦。',
           '上吉签': '✨ 吉利亨通！此签为上吉之签，表示您的努力将得到回报，好运即将到来。',
           '中吉签': '🍀 中等吉利！此签为中吉之签，提醒您保持耐心，稳步前进必有收获。',
           '中平签': '⚖️ 平稳安康！此签为中平之签，建议您保持现状，静待时机成熟。',
           '下下签': '🙏 需要谨慎！此签提醒您要小心行事，多行善事可化解不利。'
         };
         
         const lotteryGuidance = categoryGuidance[lottery.category as keyof typeof categoryGuidance] || '观音菩萨慈悲护佑，一切都会好起来的。';
         
         let lotteryResult = `🙏 **观音灵签第${lotteryNum}签**\n\n**${lottery.category}** - ${lottery.meaning}\n\n📜 **古签诗**\n${lottery.poem}\n\n🔍 **针对您的${type?.name}问题**\n\"${input}\"\n\n💡 **签文解读**\n${lottery.interpretation}\n\n🌸 **观音慈悲指引**\n${lotteryGuidance}\n\n`;
         lotteryResult += `在${type?.name}方面，观音菩萨的慈悲光芒将照亮您前进的道路。此签的深层含义提醒您要保持虔诚的心，相信善有善报的因果循环。\n\n🎯 **具体建议**\n${lottery.advice}\n\n🍀 **幸运元素**\n• 幸运方位：${lottery.luckyElements.direction}\n• 幸运颜色：${lottery.luckyElements.color}\n• 幸运数字：${lottery.luckyElements.number.join('、')}\n• 吉祥时辰：${lottery.luckyElements.time}\n\n`;
         lotteryResult += `🧘 **修行建议**\n• 每日诵读观音心咒或《心经》\n• 多行善事，积累功德\n• 保持内心的平静与慈悲\n• 向${lottery.luckyElements.direction}方祈福效果更佳\n\n⏰ **祈福时间**\n每日${lottery.luckyElements.time}或清晨黄昏时分\n\n💫 **温馨提示**\n签文只是指引，真正的命运掌握在自己手中。保持善心，积极行动，必能转运开运！`;
         return lotteryResult;
      
      case 'jiaobei':
        // 使用从drawingResult传递的结果对象
        const jiaobeiDrawResult = _specialData?.drawingResult;
        let jiaobeiResultName, jiaobeiMeaning;
        
        if (jiaobeiDrawResult && typeof jiaobeiDrawResult === 'object' && 'name' in jiaobeiDrawResult && 'meaning' in jiaobeiDrawResult) {
          jiaobeiResultName = jiaobeiDrawResult.name || '未知';
          jiaobeiMeaning = jiaobeiDrawResult.meaning || '神明指示不明';
        } else {
          // 备用随机生成
          const outcomes = [
            { name: '圣筊', meaning: '神明同意，吉利' },
            { name: '笑筊', meaning: '神明发笑，需要重新考虑' },
            { name: '阴筊', meaning: '神明不同意，需要改变方向' }
          ];
          const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
          jiaobeiResultName = randomOutcome.name;
          jiaobeiMeaning = randomOutcome.meaning;
        }
        
        // 根据问题类型生成相应的建议
        const questionType = type?.name || '未知问题';
        const jiaobeiGuidance = jiaobeiResultName === '圣筊' ? 
          `神明赐福，您的想法得到认可。在${questionType}方面，可以按照原计划进行，必有好结果。` :
          jiaobeiResultName === '笑筊' ? 
          `神明提醒您需要更加谨慎思考。在${questionType}方面，建议您重新审视自己的想法和计划。` :
          `神明暗示现在不是行动的最佳时机。在${questionType}方面，建议您暂缓行动，等待更好的时机。`;
        
        return `🎋 **擲筊问卜结果**\n\n` +
          `**擲筊结果**：${jiaobeiResultName}\n` +
          `**卜意**：${jiaobeiMeaning}\n\n` +
          `**针对您的${questionType}问题**："${input}"\n\n` +
          `**神明指示**：\n${jiaobeiGuidance}\n\n` +
          `**祈福建议**：\n` +
          `• 到庙宇上香祈福\n` +
          `• 保持虔诚的心\n` +
          `• 多做善事积德\n\n` +
          `**再次问卜时间**：七天后`;
      
      case 'bazi':
        // 生成详细的八字命理分析
        const baziElements = ['甲木', '乙木', '丙火', '丁火', '戊土', '己土', '庚金', '辛金', '壬水', '癸水'];
        const earthlyBranches = ['子水', '丑土', '寅木', '卯木', '辰土', '巳火', '午火', '未土', '申金', '酉金', '戌土', '亥水'];
        const yearPillar = baziElements[Math.floor(Math.random() * baziElements.length)] + earthlyBranches[Math.floor(Math.random() * earthlyBranches.length)];
        const monthPillar = baziElements[Math.floor(Math.random() * baziElements.length)] + earthlyBranches[Math.floor(Math.random() * earthlyBranches.length)];
        const dayPillar = baziElements[Math.floor(Math.random() * baziElements.length)] + earthlyBranches[Math.floor(Math.random() * earthlyBranches.length)];
        const hourPillar = baziElements[Math.floor(Math.random() * baziElements.length)] + earthlyBranches[Math.floor(Math.random() * earthlyBranches.length)];
        
        const wuxingScores = {
          金: Math.floor(Math.random() * 30) + 10,
          木: Math.floor(Math.random() * 30) + 10,
          水: Math.floor(Math.random() * 30) + 10,
          火: Math.floor(Math.random() * 30) + 10,
          土: Math.floor(Math.random() * 30) + 10
        };
        
        const strongestElement = Object.keys(wuxingScores).reduce((a, b) => wuxingScores[a as keyof typeof wuxingScores] > wuxingScores[b as keyof typeof wuxingScores] ? a : b) as keyof typeof wuxingScores;
        const weakestElement = Object.keys(wuxingScores).reduce((a, b) => wuxingScores[a as keyof typeof wuxingScores] < wuxingScores[b as keyof typeof wuxingScores] ? a : b) as keyof typeof wuxingScores;
        
        const luckyColors = {
          金: ['白色', '银色', '金色'],
          木: ['绿色', '青色', '翠绿'],
          水: ['黑色', '蓝色', '深蓝'],
          火: ['红色', '紫色', '橙色'],
          土: ['黄色', '棕色', '土黄']
        };
        
        const luckyDirections = {
          金: '西方',
          木: '东方',
          水: '北方',
          火: '南方',
          土: '中央'
        };
        
        return `📅 **八字命理详细分析**\n\n` +
          `🕐 **生辰八字**\n` +
          `出生时间：${birthInfo.date} ${birthInfo.time}\n` +
          `性别：${birthInfo.gender}\n\n` +
          `📊 **四柱排盘**\n` +
          `年柱：${yearPillar.slice(0,2)} ${yearPillar.slice(2)}\n` +
          `月柱：${monthPillar.slice(0,2)} ${monthPillar.slice(2)}\n` +
          `日柱：${dayPillar.slice(0,2)} ${dayPillar.slice(2)} （日主）\n` +
          `时柱：${hourPillar.slice(0,2)} ${hourPillar.slice(2)}\n\n` +
          `针对您的${type?.name}问题："${input}"\n\n` +
          `⚖️ **五行分析**\n` +
          `金：${wuxingScores.金}分 ${'★'.repeat(Math.floor(wuxingScores.金/10))}\n` +
          `木：${wuxingScores.木}分 ${'★'.repeat(Math.floor(wuxingScores.木/10))}\n` +
          `水：${wuxingScores.水}分 ${'★'.repeat(Math.floor(wuxingScores.水/10))}\n` +
          `火：${wuxingScores.火}分 ${'★'.repeat(Math.floor(wuxingScores.火/10))}\n` +
          `土：${wuxingScores.土}分 ${'★'.repeat(Math.floor(wuxingScores.土/10))}\n\n` +
          `🎯 **命格特征**\n` +
          `• 五行最旺：${strongestElement}（${wuxingScores[strongestElement]}分）\n` +
          `• 五行最弱：${weakestElement}（${wuxingScores[weakestElement]}分）\n` +
          `• 日主强弱：${wuxingScores[dayPillar.slice(0,1) as keyof typeof wuxingScores] > 25 ? '身强' : '身弱'}\n` +
          `• 格局类型：${strongestElement === '金' ? '从革格' : strongestElement === '木' ? '曲直格' : strongestElement === '水' ? '润下格' : strongestElement === '火' ? '炎上格' : '稼穑格'}\n\n` +
          `🌟 **性格分析**\n` +
          `基于您的八字组合，您具有以下性格特征：\n` +
          `• ${strongestElement === '金' ? '果断坚毅，执行力强，有领导才能' : strongestElement === '木' ? '仁慈善良，富有创造力，适应性强' : strongestElement === '水' ? '聪明智慧，灵活变通，善于思考' : strongestElement === '火' ? '热情开朗，积极主动，富有感染力' : '稳重踏实，包容性强，值得信赖'}\n` +
          `• ${wuxingScores[dayPillar.slice(0,1) as keyof typeof wuxingScores] > 25 ? '自信独立，有主见，不易受他人影响' : '温和谦逊，善于合作，重视他人意见'}\n` +
          `• 在${type?.name}方面，您的${strongestElement}属性为您带来独特优势\n\n` +
          `💰 **财运分析**\n` +
          `• 财星状态：${wuxingScores.金 > 20 ? '财星有力，财运亨通' : '财星稍弱，需努力求财'}\n` +
          `• 求财方式：${strongestElement === '水' ? '适合流动性行业，如贸易、运输' : strongestElement === '火' ? '适合服务业、娱乐业' : strongestElement === '土' ? '适合房地产、农业' : strongestElement === '金' ? '适合金融、制造业' : '适合教育、文化产业'}\n` +
          `• 财富积累：${wuxingScores.土 > 20 ? '善于储蓄，财富稳定增长' : '需要理财规划，避免冲动消费'}\n\n` +
          `💕 **感情婚姻**\n` +
          `• 桃花运势：${wuxingScores.水 > 25 ? '桃花旺盛，异性缘佳' : '感情稳定，重质不重量'}\n` +
          `• 婚姻状态：${wuxingScores[dayPillar.slice(0,1) as keyof typeof wuxingScores] > 25 ? '适合晚婚，婚后和谐' : '早婚也佳，夫妻恩爱'}\n` +
          `• 配偶特征：${strongestElement === '金' ? '配偶性格坚强，事业有成' : strongestElement === '木' ? '配偶温和善良，有艺术天赋' : strongestElement === '水' ? '配偶聪明机智，善于沟通' : strongestElement === '火' ? '配偶热情开朗，社交能力强' : '配偶稳重可靠，顾家爱家'}\n\n` +
          `🏥 **健康运势**\n` +
          `• 体质特点：${strongestElement}旺，需注意${strongestElement === '金' ? '呼吸系统和皮肤' : strongestElement === '木' ? '肝胆和筋骨' : strongestElement === '水' ? '肾脏和泌尿系统' : strongestElement === '火' ? '心脏和血液循环' : '脾胃和消化系统'}健康\n` +
          `• 养生建议：${weakestElement === '金' ? '多吃白色食物，注意肺部保养' : weakestElement === '木' ? '多吃绿色蔬菜，保护肝脏' : weakestElement === '水' ? '多喝水，注意肾脏保养' : weakestElement === '火' ? '适量运动，保护心脏' : '规律饮食，养护脾胃'}\n\n` +
          `🎯 **事业发展**\n` +
          `• 适合行业：${strongestElement === '金' ? '金融、制造、机械、汽车' : strongestElement === '木' ? '教育、文化、医疗、环保' : strongestElement === '水' ? '贸易、运输、旅游、媒体' : strongestElement === '火' ? '能源、化工、餐饮、娱乐' : '房地产、农业、建筑、服务'}\n` +
          `• 发展方向：${luckyDirections[strongestElement]}方有利于事业发展\n` +
          `• 合作伙伴：与${strongestElement === '金' ? '土' : strongestElement === '木' ? '水' : strongestElement === '水' ? '金' : strongestElement === '火' ? '木' : '火'}属性的人合作更佳\n\n` +
          `🍀 **开运指南**\n` +
          `• 幸运颜色：${luckyColors[strongestElement].join('、')}\n` +
          `• 开运方位：${luckyDirections[strongestElement]}\n` +
          `• 幸运数字：${strongestElement === '金' ? '4、9' : strongestElement === '木' ? '3、8' : strongestElement === '水' ? '1、6' : strongestElement === '火' ? '2、7' : '5、0'}\n` +
          `• 开运时间：${strongestElement === '金' ? '申时、酉时（15-19点）' : strongestElement === '木' ? '寅时、卯时（3-7点）' : strongestElement === '水' ? '子时、亥时（21-1点）' : strongestElement === '火' ? '巳时、午时（9-13点）' : '辰时、戌时、丑时、未时'}\n\n` +
          `📅 **流年运势**\n` +
          `• 今年运势：${wuxingScores[strongestElement] > 25 ? '运势强劲，适合进取' : '运势平稳，宜守不宜攻'}\n` +
          `• 关键月份：${strongestElement === '金' ? '秋季（7-9月）' : strongestElement === '木' ? '春季（1-3月）' : strongestElement === '水' ? '冬季（10-12月）' : strongestElement === '火' ? '夏季（4-6月）' : '四季末月'}运势最佳\n` +
          `• 注意事项：避免在${weakestElement}旺的时期做重大决定\n\n` +
          `🔮 **针对${type?.name}的专业建议**\n\n` +
          `基于您的八字分析，在${type?.name}方面：\n` +
          `• 发挥${strongestElement}的优势，${strongestElement === '金' ? '果断决策，把握机会' : strongestElement === '木' ? '发挥创造力，稳步成长' : strongestElement === '水' ? '灵活应变，智慧取胜' : strongestElement === '火' ? '积极进取，扩大影响' : '稳扎稳打，厚积薄发'}\n` +
          `• 补强${weakestElement}的不足，${weakestElement === '金' ? '增强执行力和决断力' : weakestElement === '木' ? '培养耐心和包容心' : weakestElement === '水' ? '提高应变能力和智慧' : weakestElement === '火' ? '增加热情和行动力' : '加强稳定性和持久力'}\n` +
          `• 选择${luckyDirections[strongestElement]}方向发展，穿戴${luckyColors[strongestElement][0]}色饰品增运\n` +
          `• 在${strongestElement === '金' ? '申酉' : strongestElement === '木' ? '寅卯' : strongestElement === '水' ? '子亥' : strongestElement === '火' ? '巳午' : '辰戌丑未'}月份行动，成功率更高\n\n` +
          `💡 **命理格言**\n\n` +
          `"命由天定，运由己造。八字只是人生的底色，真正的精彩需要您用智慧和努力去描绘。"\n\n` +
          `愿您在了解自己命理特征的基础上，趋吉避凶，创造美好人生！`;
      
      case 'ziwei':
        // 生成详细的紫微斗数分析
        const palaces = [
          '命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫',
          '迁移宫', '奴仆宫', '官禄宫', '田宅宫', '福德宫', '父母宫'
        ];
        
        const mainStars = [
          '紫微星', '天机星', '太阳星', '武曲星', '天同星', '廉贞星',
          '天府星', '太阴星', '贪狼星', '巨门星', '天相星', '天梁星',
          '七杀星', '破军星'
        ];
        
        const minorStars = [
          '左辅星', '右弼星', '文昌星', '文曲星', '禄存星', '天马星',
          '擎羊星', '陀罗星', '火星', '铃星', '天空星', '地劫星'
        ];
        
        // 随机生成命盘配置
        const birthYear = new Date(birthInfo.date).getFullYear();
        const randomSeed = birthYear + (birthInfo.time ? parseInt(birthInfo.time.replace(':', '')) : 1200);
        
        // 生成主星分布
        const shuffledMainStars = [...mainStars].sort(() => (randomSeed % 7) - 3.5);
        const shuffledMinorStars = [...minorStars].sort(() => (randomSeed % 11) - 5.5);
        
        const palaceStars = palaces.map((palace, index) => {
          const mainStar = shuffledMainStars[index % shuffledMainStars.length];
          const minorStar = shuffledMinorStars[index % shuffledMinorStars.length];
          return {
            palace,
            mainStar,
            minorStar,
            brightness: ['庙', '旺', '得地', '利益', '平和', '不得地', '陷'][index % 7]
          };
        });
        
        // 找到命宫主星
        const mingGong = palaceStars[0];
        const caiBoGong = palaceStars[4]; // 财帛宫
        const guanLuGong = palaceStars[8]; // 官禄宫
        const fuQiGong = palaceStars[2]; // 夫妻宫
        
        // 生成流年运势
        const currentYear = new Date().getFullYear();
        const yearlyFortune = {
          overall: ['大吉', '中吉', '小吉', '平稳', '小凶'][randomSeed % 5],
          career: ['事业有成', '稳步发展', '需要努力', '变动较大', '谨慎行事'][randomSeed % 5],
          wealth: ['财运亨通', '收入稳定', '理财谨慎', '支出较多', '投资小心'][randomSeed % 5],
          relationship: ['感情和谐', '桃花运旺', '关系稳定', '沟通重要', '避免争执'][randomSeed % 5],
          health: ['身体健康', '精神饱满', '注意休息', '小心保养', '定期检查'][randomSeed % 5]
        };
        
        return `🌟 **紫微斗数详细命盘分析**\n\n` +
          `📅 **基本信息**\n` +
          `出生时间：${birthInfo.date} ${birthInfo.time || '未知时辰'}\n` +
          `出生地点：${birthInfo.place || '未知地点'}\n` +
          `性别：${birthInfo.gender}\n\n` +
          `针对您的${type?.name}问题："${input}"\n\n` +
          `🏛️ **十二宫位星曜分布**\n\n` +
          palaceStars.map(p => 
            `**${p.palace}**：${p.mainStar}（${p.brightness}）+ ${p.minorStar}`
          ).join('\n') + '\n\n' +
          `👑 **命宫详解**\n` +
          `主星：${mingGong.mainStar}\n` +
          `辅星：${mingGong.minorStar}\n` +
          `星曜亮度：${mingGong.brightness}\n\n` +
          `${mingGong.mainStar === '紫微星' ? 
            '紫微星坐命，您天生具有帝王之相，领导才能出众，有贵人相助。性格高贵典雅，做事有条理，适合担任管理职务。' :
            mingGong.mainStar === '天机星' ?
            '天机星坐命，您聪明机智，善于谋划，反应敏捷。具有很强的学习能力和适应能力，适合从事需要动脑的工作。' :
            mingGong.mainStar === '太阳星' ?
            '太阳星坐命，您性格开朗，热情大方，有正义感。天生具有领导魅力，容易获得他人信任和支持。' :
            mingGong.mainStar === '武曲星' ?
            '武曲星坐命，您意志坚强，执行力强，有很好的理财能力。做事果断，不怕困难，适合从事金融或实业。' :
            mingGong.mainStar === '天同星' ?
            '天同星坐命，您性格温和，人缘很好，有福气。天生乐观，容易知足，适合从事服务性行业。' :
            mingGong.mainStar === '廉贞星' ?
            '廉贞星坐命，您个性鲜明，有艺术天赋，感情丰富。具有很强的创造力，适合从事创意或艺术相关工作。' :
            '您的命宫主星赋予您独特的性格特质，在人生道路上将发挥重要作用。'
          }\n\n` +
          `💰 **财帛宫分析**\n` +
          `主星：${caiBoGong.mainStar}\n` +
          `财运特征：${caiBoGong.mainStar === '武曲星' ? '正财运佳，适合稳健投资' :
            caiBoGong.mainStar === '贪狼星' ? '偏财运旺，但需谨慎理财' :
            caiBoGong.mainStar === '天府星' ? '财库丰厚，善于积累财富' :
            caiBoGong.mainStar === '太阴星' ? '财运平稳，适合长期储蓄' :
            '财运中等，需要努力经营'}\n` +
          `理财建议：${caiBoGong.brightness === '庙' || caiBoGong.brightness === '旺' ? 
            '财星有力，可以适当进行投资理财，但仍需谨慎' :
            '财星较弱，建议以稳健理财为主，避免高风险投资'}\n\n` +
          `🏢 **官禄宫分析**\n` +
          `主星：${guanLuGong.mainStar}\n` +
          `事业特征：${guanLuGong.mainStar === '紫微星' ? '适合管理职位，有领导才能' :
            guanLuGong.mainStar === '天机星' ? '适合策划、咨询类工作' :
            guanLuGong.mainStar === '太阳星' ? '适合公职或需要与人接触的工作' :
            guanLuGong.mainStar === '武曲星' ? '适合金融、实业等实务性工作' :
            '事业发展需要找到适合的方向'}\n` +
          `发展建议：${guanLuGong.brightness === '庙' || guanLuGong.brightness === '旺' ? 
            '事业星有力，适合积极进取，把握机会' :
            '事业星较弱，建议稳扎稳打，循序渐进'}\n\n` +
          `💕 **夫妻宫分析**\n` +
          `主星：${fuQiGong.mainStar}\n` +
          `感情特征：${fuQiGong.mainStar === '太阴星' ? '感情细腻，重视家庭和谐' :
            fuQiGong.mainStar === '天同星' ? '感情温和，容易获得幸福' :
            fuQiGong.mainStar === '廉贞星' ? '感情热烈，但需要理性沟通' :
            fuQiGong.mainStar === '天相星' ? '感情稳定，适合长久关系' :
            '感情方面需要用心经营'}\n` +
          `婚姻建议：${fuQiGong.brightness === '庙' || fuQiGong.brightness === '旺' ? 
            '婚姻运佳，容易遇到合适的对象' :
            '婚姻需要耐心等待，不宜急躁'}\n\n` +
          `🌟 **主要星曜影响力分析**\n\n` +
          `**主星系统**\n` +
          palaceStars.filter(p => ['命宫', '财帛宫', '官禄宫', '夫妻宫'].includes(p.palace))
            .map(p => `• ${p.palace}${p.mainStar}：${p.brightness === '庙' ? '★★★★★' :
              p.brightness === '旺' ? '★★★★☆' :
              p.brightness === '得地' ? '★★★☆☆' :
              p.brightness === '利益' ? '★★☆☆☆' :
              p.brightness === '平和' ? '★☆☆☆☆' : '☆☆☆☆☆'} ${p.brightness}`)
            .join('\n') + '\n\n' +
          `**辅星系统**\n` +
          `• 文昌文曲：${shuffledMinorStars.includes('文昌星') ? '有助学业和考试运' : '需要加强学习能力'}\n` +
          `• 左辅右弼：${shuffledMinorStars.includes('左辅星') ? '贵人运佳，容易得到帮助' : '需要靠自己努力'}\n` +
          `• 禄存天马：${shuffledMinorStars.includes('禄存星') ? '财禄丰厚，适合经商' : '财运需要努力开创'}\n\n` +
          `📊 **${currentYear}年流年运势**\n\n` +
          `**整体运势**：${yearlyFortune.overall} ${yearlyFortune.overall === '大吉' ? '🌟🌟🌟🌟🌟' :
            yearlyFortune.overall === '中吉' ? '🌟🌟🌟🌟' :
            yearlyFortune.overall === '小吉' ? '🌟🌟🌟' :
            yearlyFortune.overall === '平稳' ? '🌟🌟' : '🌟'}\n` +
          `**事业运势**：${yearlyFortune.career}\n` +
          `**财运状况**：${yearlyFortune.wealth}\n` +
          `**感情运势**：${yearlyFortune.relationship}\n` +
          `**健康运势**：${yearlyFortune.health}\n\n` +
          `🎯 **针对${type?.name}的专业指导**\n\n` +
          `基于您的紫微命盘分析，在${type?.name}方面：\n\n` +
          `**优势分析**\n` +
          `• 命宫${mingGong.mainStar}赋予您${mingGong.mainStar === '紫微星' ? '领导统御' :
            mingGong.mainStar === '天机星' ? '智慧谋略' :
            mingGong.mainStar === '太阳星' ? '光明正大' :
            mingGong.mainStar === '武曲星' ? '坚毅果断' : '独特天赋'}的特质\n` +
          `• ${mingGong.brightness === '庙' || mingGong.brightness === '旺' ? 
            '主星庙旺，能量充沛，适合积极行动' :
            '主星平和，宜稳健发展，循序渐进'}\n` +
          `• 辅星${mingGong.minorStar}提供额外的${mingGong.minorStar.includes('文') ? '智慧' :
            mingGong.minorStar.includes('辅') || mingGong.minorStar.includes('弼') ? '贵人' :
            mingGong.minorStar.includes('禄') ? '财禄' : '能量'}支持\n\n` +
          `**行动建议**\n` +
          `• 发挥${mingGong.mainStar}的核心优势，在${type?.name}领域展现专长\n` +
          `• 利用${yearlyFortune.overall === '大吉' || yearlyFortune.overall === '中吉' ? 
            '今年的好运势，积极把握机会' :
            '稳定的运势，踏实前进，避免冒险'}\n` +
          `• 注意${caiBoGong.mainStar}财星的特性，在${type?.name}相关的财务决策上要${caiBoGong.brightness === '庙' ? '大胆' : '谨慎'}\n` +
          `• 借助${guanLuGong.mainStar}事业星的力量，在职场上${guanLuGong.brightness === '庙' ? '主动出击' : '稳健发展'}\n\n` +
          `🔮 **改运开运指南**\n\n` +
          `**颜色开运**\n` +
          `• 主色调：${mingGong.mainStar === '紫微星' ? '紫色、金色' :
            mingGong.mainStar === '天机星' ? '绿色、青色' :
            mingGong.mainStar === '太阳星' ? '红色、橙色' :
            mingGong.mainStar === '武曲星' ? '白色、银色' :
            mingGong.mainStar === '天同星' ? '蓝色、白色' :
            mingGong.mainStar === '廉贞星' ? '红色、紫色' : '根据主星选择'}\n` +
          `• 辅助色：根据辅星${mingGong.minorStar}选择相应颜色\n\n` +
          `**方位开运**\n` +
          `• 有利方位：${mingGong.mainStar === '紫微星' ? '正北方' :
            mingGong.mainStar === '天机星' ? '东方' :
            mingGong.mainStar === '太阳星' ? '南方' :
            mingGong.mainStar === '武曲星' ? '西方' : '根据主星确定'}\n` +
          `• 办公座位：面向有利方位\n` +
          `• 居住选择：选择有利方位的房屋\n\n` +
          `**时间开运**\n` +
          `• 最佳时辰：${mingGong.mainStar === '太阳星' ? '巳时、午时（9-13点）' :
            mingGong.mainStar === '太阴星' ? '酉时、戌时（17-21点）' :
            mingGong.mainStar === '天机星' ? '寅时、卯时（3-7点）' : '根据主星选择'}\n` +
          `• 重要决策：选择在有利时辰进行\n\n` +
          `**数字开运**\n` +
          `• 幸运数字：${mingGong.mainStar === '紫微星' ? '1、6、9' :
            mingGong.mainStar === '天机星' ? '3、8' :
            mingGong.mainStar === '太阳星' ? '2、7' :
            mingGong.mainStar === '武曲星' ? '4、9' : '根据主星选择'}\n` +
          `• 避免数字：与主星相冲的数字\n\n` +
          `💎 **专业建议总结**\n\n` +
          `基于您的紫微命盘，您在${type?.name}方面具有${mingGong.brightness === '庙' || mingGong.brightness === '旺' ? '很强' : '一定'}的潜力。\n\n` +
          `关键成功要素：\n` +
          `1. 发挥${mingGong.mainStar}的天赋优势\n` +
          `2. 把握${yearlyFortune.overall}的流年运势\n` +
          `3. 注意${fuQiGong.mainStar}在人际关系上的影响\n` +
          `4. 利用${caiBoGong.mainStar}的财运特性\n` +
          `5. 遵循紫微命理的开运方法\n\n` +
          `🌸 **紫微格言**\n\n` +
          `"命由天定，运由己造。紫微斗数揭示天赋，人生精彩靠自己创造。"\n\n` +
          `记住，紫微斗数是了解自己的工具，真正的成功需要结合天时、地利、人和。愿您在了解命盘的基础上，积极进取，创造美好人生！`;
      
      case 'personality':
        // 使用MBTI性格测试系统
        const mbtiAnswers = (specialData as any)?.mbtiAnswers || {};
        
        if (Object.keys(mbtiAnswers).length === 0) {
          // 如果没有测试答案，基于用户输入、时间戳和随机数生成伪随机结果
          const randomSalt = Math.random().toString(36).substring(2, 15);
          const seed = (input + Date.now().toString() + randomSalt + Math.random().toString()).split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
          }, 0);
          const randomIndex = Math.abs(seed) % mbtiTypes.length;
          const randomType = mbtiTypes[randomIndex];
          return `🧠 **MBTI性格测试结果**\n\n` +
            `您的性格类型：**${randomType.code} - ${randomType.name}**\n\n` +
            `类型描述：${randomType.description}\n\n` +
            `针对您的${type?.name}问题："${input}"\n\n` +
            `🎯 **核心特质**\n${randomType.traits.map(trait => `• ${trait}`).join('\n')}\n\n` +
            `💪 **优势特质**\n${randomType.strengths.map(strength => `• ${strength}`).join('\n')}\n\n` +
            `⚠️ **需要注意**\n${randomType.weaknesses.map(weakness => `• ${weakness}`).join('\n')}\n\n` +
            `💼 **适合职业**\n${randomType.careers.join('、')}\n\n` +
            `💕 **感情特点**\n${randomType.relationships}\n\n` +
            `🌱 **成长建议**\n${randomType.growth}\n\n` +
            `⭐ **名人代表**\n${randomType.famous.join('、')}\n\n` +
            `📊 **人群占比**\n约${randomType.percentage}%的人属于此类型\n\n` +
            `🔮 **在${type?.name}方面的建议**\n\n` +
            `基于您的${randomType.code}性格类型，在${type?.name}方面建议您：\n` +
            `• 发挥${randomType.strengths[0]}的优势\n` +
            `• 注意平衡${randomType.weaknesses[0]}的倾向\n` +
            `• 在决策时结合${randomType.traits[0]}的特质\n` +
            `• 与他人合作时展现${randomType.traits[1]}的品质\n\n` +
            `💡 **个人发展提示**\n\n` +
            `${randomType.growth}记住，了解自己的性格类型只是开始，真正的成长在于如何运用这些洞察来改善生活。`;
        }
        
        // 如果有完整的测试答案，计算真实结果
        const mbtiResult = calculateMBTIResult(mbtiAnswers);
        const { type: personalityType, scores, confidence } = mbtiResult;
        
        return `🧠 **MBTI性格测试完整报告**\n\n` +
          `您的性格类型：**${personalityType.code} - ${personalityType.name}**\n` +
          `测试置信度：${confidence}%\n\n` +
          `类型描述：${personalityType.description}\n\n` +
          `针对您的${type?.name}问题："${input}"\n\n` +
          `📊 **维度得分分析**\n` +
          `外向(E) vs 内向(I)：${scores.E}:${scores.I} - ${scores.E > scores.I ? '偏向外向' : '偏向内向'}\n` +
          `感觉(S) vs 直觉(N)：${scores.S}:${scores.N} - ${scores.S > scores.N ? '偏向感觉' : '偏向直觉'}\n` +
          `思考(T) vs 情感(F)：${scores.T}:${scores.F} - ${scores.T > scores.F ? '偏向思考' : '偏向情感'}\n` +
          `判断(J) vs 感知(P)：${scores.J}:${scores.P} - ${scores.J > scores.P ? '偏向判断' : '偏向感知'}\n\n` +
          `🎯 **核心特质**\n${personalityType.traits.map(trait => `• ${trait}`).join('\n')}\n\n` +
          `💪 **天赋优势**\n${personalityType.strengths.map(strength => `• ${strength}`).join('\n')}\n\n` +
          `⚠️ **发展领域**\n${personalityType.weaknesses.map(weakness => `• ${weakness}`).join('\n')}\n\n` +
          `💼 **理想职业**\n${personalityType.careers.join('、')}\n\n` +
          `💕 **感情模式**\n${personalityType.relationships}\n\n` +
          `🌱 **成长方向**\n${personalityType.growth}\n\n` +
          `⭐ **同类型名人**\n${personalityType.famous.join('、')}\n\n` +
          `📊 **稀有程度**\n约${personalityType.percentage}%的人属于${personalityType.code}类型\n\n` +
          `🔮 **在${type?.name}方面的专业建议**\n\n` +
          `基于您的${personalityType.code}性格特质，在${type?.name}领域：\n\n` +
          `✅ **发挥优势**\n` +
          `• 利用${personalityType.strengths[0]}来处理相关问题\n` +
          `• 发挥${personalityType.strengths[1]}的天赋\n` +
          `• 在团队中展现${personalityType.traits[0]}的特质\n\n` +
          `⚡ **注意事项**\n` +
          `• 避免${personalityType.weaknesses[0]}的倾向\n` +
          `• 平衡${personalityType.weaknesses[1]}的影响\n` +
          `• 在压力下保持${personalityType.traits[1]}的品质\n\n` +
          `🎯 **行动建议**\n` +
          `• 制定符合${personalityType.code}特质的策略\n` +
          `• 寻找能发挥${personalityType.strengths[0]}的机会\n` +
          `• 与互补性格类型的人合作\n` +
          `• 持续关注个人成长和发展\n\n` +
          `💡 **深度洞察**\n\n` +
          `${personalityType.growth}\n\n` +
          `记住，MBTI只是了解自己的工具之一。真正的智慧在于如何运用这些洞察来创造更好的人生。每个人都是独特的，不要被类型所限制，而要用它来更好地理解和发展自己。`;
      
      case 'compatibility':
        // 使用综合配对打分系统
        const compatibilityData = (specialData as any)?.compatibilityData || {};
        const { person1, person2 } = compatibilityData;
        
        if (!person1 || !person2) {
          // 如果没有完整数据，基于用户输入、时间戳和随机数生成伪随机结果
          const randomSalt = Math.random().toString(36).substring(2, 15);
          const seed = (input + partnerInfo.name + Date.now().toString() + randomSalt + Math.random().toString()).split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
          }, 0);
          const score = Math.abs(seed) % 30 + 70;
          return `💕 **配对打分分析**\n\n` +
            `配对对象：${partnerInfo.name}\n` +
            `综合匹配度：**${score}分**\n\n` +
            `针对您的${type?.name}问题："${input}"\n\n` +
            `📊 **各维度分析**\n` +
            `• 性格匹配：${Math.abs(seed * 2) % 20 + 75}分\n` +
            `• 价值观契合：${Math.abs(seed * 3) % 20 + 75}分\n` +
            `• 沟通方式：${Math.abs(seed * 5) % 25 + 70}分\n` +
            `• 生活节奏：${Math.abs(seed * 7) % 20 + 75}分\n` +
            `• 未来规划：${Math.abs(seed * 11) % 20 + 80}分\n\n` +
            `💡 **关系建议**\n` +
            `• 发挥各自优势，互相支持\n` +
            `• 在差异中寻找平衡点\n` +
            `• 保持开放的沟通态度\n` +
            `• 共同制定未来目标\n\n` +
            `⚠️ **注意事项**\n` +
            `• 尊重彼此的个性差异\n` +
            `• 给对方足够的个人空间\n` +
            `• 在冲突中寻求理解而非胜负\n\n` +
            `🎯 **发展方向**\n` +
            `基于当前的匹配度，建议你们${score > 80 ? '保持现有优势的基础上，进一步深化感情' : '加强沟通理解，提升关系质量'}。`;
        }
        
        // 使用完整的配对分析系统
        const compatibilityTest = {
          person1: {
            name: (specialData as any)?.name || '用户',
            birthDate: birthInfo.date,
            mbtiType: person1.mbtiType,
            zodiacSign: person1.zodiacSign,
            lifeNumber: person1.lifeNumber
          },
          person2: {
            name: partnerInfo.name,
            birthDate: partnerInfo.birthDate,
            mbtiType: person2.mbtiType,
            zodiacSign: person2.zodiacSign,
            lifeNumber: person2.lifeNumber
          }
        };
        const compatibilityResult = calculateCompatibilityScore(compatibilityTest);
        const { 
          overallScore, 
          mbtiScore, 
          astrologyScore, 
          numerologyScore,
          strengths,
          challenges,
          advice
        } = compatibilityResult;
        
        return `💕 **深度配对分析报告**\n\n` +
          `配对对象：${partnerInfo.name}\n` +
          `综合匹配度：**${overallScore}分** ${overallScore >= 85 ? '🔥 极佳匹配' : overallScore >= 75 ? '💖 很好匹配' : overallScore >= 65 ? '💕 良好匹配' : '💙 需要努力'}\n\n` +
          `针对您的${type?.name}问题："${input}"\n\n` +
          `📊 **多维度匹配分析**\n` +
          `🧠 MBTI性格匹配：${mbtiScore}分\n` +
          `⭐ 星座占星匹配：${astrologyScore}分\n` +
          `🔢 数字命理匹配：${numerologyScore}分\n\n` +
          `✨ **关系优势**\n${strengths.map(strength => `• ${strength}`).join('\n')}\n\n` +
          `⚡ **潜在挑战**\n${challenges.map(challenge => `• ${challenge}`).join('\n')}\n\n` +
          `💡 **专业建议**\n${advice.map(tip => `• ${tip}`).join('\n')}\n\n` +
          `🎯 **关系发展指南**\n\n` +
          `**短期目标（1-3个月）**\n` +
          `• 加深对彼此性格特质的理解\n` +
          `• 建立有效的沟通模式\n` +
          `• 寻找共同兴趣和价值观\n\n` +
          `**中期目标（3-12个月）**\n` +
          `• 处理和化解主要分歧\n` +
          `• 建立互信和安全感\n` +
          `• 制定共同的未来规划\n\n` +
          `**长期愿景（1年以上）**\n` +
          `• 在保持个性的同时实现深度融合\n` +
          `• 建立稳定和谐的关系模式\n` +
          `• 共同成长和相互支持\n\n` +
          `🔮 **关系预测**\n\n` +
          `基于综合分析，你们的关系${overallScore >= 80 ? 
            '具有很强的发展潜力。你们在多个维度上都表现出良好的兼容性，只要保持开放和理解的态度，关系将会越来越稳固。' :
            overallScore >= 70 ?
            '有着不错的基础。虽然存在一些挑战，但通过努力和理解，你们完全可以建立起美好的关系。关键在于学会欣赏彼此的差异。' :
            '需要双方的共同努力。你们之间存在一些根本性的差异，但这并不意味着不可能。真爱能够跨越所有障碍，关键在于是否愿意为对方改变和成长。'
          }\n\n` +
          `💖 **爱情箴言**\n\n` +
          `"最好的关系不是找到一个完美的人，而是学会用完美的眼光看待一个不完美的人。"\n\n` +
          `记住，任何分析都只是参考。真正的爱情需要时间、理解、包容和共同努力来培养。愿你们的关系在理解和爱中不断成长！`;
      
      case 'lifestory':
        // 使用数字命理生成生命故事
        const userData = (specialData as any) || {};
        const { name } = userData;
        
        if (!name || !birthInfo.date) {
          // 如果没有完整数据，基于用户输入、时间戳和随机数生成伪随机故事
          const themes = ['勇者之路', '智者之旅', '治愈之光', '创造之源', '守护天使', '探索先锋'];
          const randomSalt = Math.random().toString(36).substring(2, 15);
          const seed = (input + Date.now().toString() + randomSalt + Math.random().toString()).split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
          }, 0);
          const theme = themes[Math.abs(seed) % themes.length];
          return `📖 **命格小故事**\n\n` +
            `您的人生主题：**${theme}**\n\n` +
            `针对您的${type?.name}问题："${input}"\n\n` +
            `🌟 **灵魂故事**\n\n` +
            `在遥远的时空中，有一个灵魂选择了${theme}的人生剧本。这个灵魂就是您，带着特殊的使命来到这个世界。\n\n` +
            `在${type?.name}的章节中，您的故事正在展开。每一个挑战都是成长的机会，每一次选择都在塑造着您独特的人生轨迹。\n\n` +
            `✨ **故事启示**\n` +
            `• 您拥有独特的天赋和使命\n` +
            `• 当前的困难是成长的必经之路\n` +
            `• 相信自己的内在智慧\n` +
            `• 每个人都是自己人生的主角\n\n` +
            `🔮 **下一章预告**\n\n` +
            `在接下来的人生章节中，您将遇到重要的转折点。保持初心，勇敢前行，精彩的故事还在后面。\n\n` +
            `💫 **人生格言**\n\n` +
            `"每一个今天，都是余生的第一天。"\n\n` +
            `记住，您的故事由您自己书写，每一个选择都在创造着独特的人生篇章。`;
        }
        
        // 使用完整的生命故事生成系统
        const lifeStory = generateLifeStory(birthInfo.date, name);
        const { 
          lifeNumber: lifePathNumber, 
          template: storyTemplate, 
          story: personalizedStory, 
          personalizedElements: _personalizedElements 
        } = lifeStory;
        
        const keyThemes = storyTemplate.theme ? [storyTemplate.theme] : ['人生探索'];
        const lifeChallenges = storyTemplate.challenges || ['未知挑战'];
        const gifts = storyTemplate.opportunities || ['潜在机会'];
        const lifePhases = {
          youth: storyTemplate.ageRanges[0]?.description || '青年期充满可能性',
          adult: storyTemplate.ageRanges[1]?.description || '成年期稳步发展',
          elder: storyTemplate.ageRanges[2]?.description || '智慧期传承经验'
        };
        
        return `📖 **${name}的生命故事**\n\n` +
          `生命路径数字：**${lifePathNumber}号**\n\n` +
          `针对您的${type?.name}问题："${input}"\n\n` +
          `🌟 **您的生命故事**\n\n` +
          `${personalizedStory}\n\n` +
          `🎭 **人生主题**\n${keyThemes.map((theme: string) => `• ${theme}`).join('\n')}\n\n` +
          `💎 **天赋礼物**\n${gifts.map((gift: string) => `• ${gift}`).join('\n')}\n\n` +
          `⚡ **人生挑战**\n${lifeChallenges.map((challenge: string) => `• ${challenge}`).join('\n')}\n\n` +
          `🌙 **生命阶段解读**\n\n` +
          `**青年期（0-28岁）**\n${lifePhases.youth}\n\n` +
          `**成年期（29-56岁）**\n${lifePhases.adult}\n\n` +
          `**智慧期（57岁以后）**\n${lifePhases.elder}\n\n` +
          `🔮 **在${type?.name}方面的指引**\n\n` +
          `基于您的${lifePathNumber}号生命路径，在${type?.name}领域：\n\n` +
          `✅ **发挥优势**\n` +
          `• 运用您的${gifts[0]}天赋\n` +
          `• 践行${keyThemes[0]}的人生主题\n` +
          `• 在决策中体现${keyThemes[1]}的智慧\n\n` +
          `⚠️ **注意平衡**\n` +
          `• 避免${lifeChallenges[0]}的陷阱\n` +
          `• 转化${lifeChallenges[1]}为成长动力\n` +
          `• 在压力下保持内心的平静\n\n` +
          `🎯 **行动建议**\n` +
          `• 制定符合您生命路径的策略\n` +
          `• 寻找能发挥${gifts[0]}的机会\n` +
          `• 与志同道合的人建立连接\n` +
          `• 持续学习和自我完善\n\n` +
          `💫 **生命智慧**\n\n` +
          `${storyTemplate.advice.join('\n• ')}\n\n` +
          `🌈 **未来展望**\n\n` +
          `您的生命故事还在继续书写。每一个今天都是新的开始，每一个选择都在塑造着您独特的人生轨迹。相信自己的内在智慧，勇敢地走向属于您的光明未来。\n\n` +
          `记住：您不仅是故事的主角，更是故事的作者。用爱、智慧和勇气，书写属于您的精彩人生！`;
      
      default:
        return `根据${method?.name}的指引，关于您的${type?.name}：\n\n您当前正处于一个重要的转折点。星象显示，未来几周将是充满机遇的时期。保持积极的心态，相信自己的直觉，好运将会降临。\n\n建议您在做重要决定时多听取内心的声音，同时也要理性分析现实情况。记住，命运掌握在自己手中。`;
    }
  }, [birthInfo, partnerInfo]);

  const handleSubmit = useCallback(async () => {
    // 根据不同的占卜方法验证输入
    if (selectedMethod === 'tarot') {
      if (!(specialData as any)?.selectedSpread) {
        showError('请选择牌阵', '请选择一个牌阵布局来开始占卜');
        return;
      }
      const selectedSpread = tarotSpreads.find(s => s.id === (specialData as any)?.selectedSpread);
      const requiredCards = selectedSpread?.positions.length || 1;
      const selectedCards = (specialData as any)?.selectedCards || [];
      if (selectedCards.length !== requiredCards) {
        showError('请选择塔罗牌', `请选择 ${requiredCards} 张塔罗牌来开始占卜`);
        return;
      }
      if (!userInput.trim()) {
        showError('请输入问题', '请输入您想要占卜的问题');
        return;
      }
    } else if (selectedMethod === 'astrology') {
      if (!birthInfo.date || !birthInfo.time || !birthInfo.place) {
        showError('信息不完整', '请填写完整的出生信息（日期、时间、地点）');
        return;
      }
      if (!userInput.trim()) {
        showError('请输入问题', '请输入您想要了解的星座问题');
        return;
      }
    } else if (selectedMethod === 'numerology') {
      if (!(specialData as any)?.name || !birthInfo.date) {
        showError('信息不完整', '请填写姓名和出生日期');
        return;
      }
      if (!userInput.trim()) {
        showError('请输入问题', '请输入您想要了解的数字命理问题');
        return;
      }
    } else if (['personality', 'lifestory'].includes(selectedMethod)) {
      if (!(specialData as any)?.name || !birthInfo.date) {
        showError('信息不完整', '请填写姓名和出生日期');
        return;
      }
      if (!userInput.trim()) {
        showError('请输入问题', '请描述您想了解的方面');
        return;
      }
    } else if (['bazi', 'ziwei'].includes(selectedMethod)) {
      if (!birthInfo.date || !birthInfo.time) {
        showError('输入不完整', '请填写完整的出生信息');
        return;
      }
    } else if (selectedMethod === 'compatibility') {
      if (!partnerInfo.name || !partnerInfo.birthDate) {
        showError('输入不完整', '请填写配对对象的信息');
        return;
      }
    } else if (!['lottery', 'jiaobei'].includes(selectedMethod) && !userInput.trim()) {
      showError('输入不能为空', '请描述您的问题后再开始占卜');
      return;
    }
    
    // 观音求签和问卜需要先显示抽签/投掷动画
    if (selectedMethod === 'lottery' || selectedMethod === 'jiaobei') {
      setIsDrawing(true);
      showInfo(selectedMethod === 'lottery' ? '正在抽签...' : '正在擲筊...', '请稍候，神明正在为您指引...');
      
      // 抽签/投掷动画过程
      setTimeout(() => {
        // 生成抽签/投掷结果
        let drawResult;
        if (selectedMethod === 'lottery') {
          // 观音求签结果
          const numbers = Object.keys(lotteryData);
          const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
          const lotteryResult = lotteryData[randomNumber as keyof typeof lotteryData];
          drawResult = {
            type: 'lottery',
            number: randomNumber,
            ...lotteryResult
          };
        } else {
          // 擲筊结果
          const outcomes = [
            { type: 'holy', name: '圣筊', meaning: '神明同意，吉利', emoji: '⚪⚪', color: 'green' },
            { type: 'negative', name: '阴筊', meaning: '神明不同意', emoji: '⚫⚫', color: 'yellow' },
            { type: 'laughing', name: '笑筊', meaning: '问题不明确，需重新思考', emoji: '⚪⚫', color: 'red' }
          ];
          drawResult = outcomes[Math.floor(Math.random() * outcomes.length)];
        }
        
        setDrawingResult(drawResult);
        setIsDrawing(false);
        
        // 不再自动继续，等待用户手动点击继续按钮
      }, 3000); // 抽签/投掷动画3秒
    } else {
      // 其他占卜方法直接进入结果
      setIsLoading(true);
      setCurrentStep('result');
      showInfo('开始占卜', '神秘的力量正在为您揭示答案...');
      
      // 模拟占卜过程
      setTimeout(() => {
        const result = generateDivinationResult(selectedMethod, selectedType, userInput, specialData);
        setResult(result);
        setIsLoading(false);
        showSuccess('占卜完成', '您的占卜结果已生成，请查看详细解读');
      }, 3000);
    }
  }, [userInput, selectedMethod, selectedType, birthInfo, partnerInfo, specialData, generateDivinationResult, showError, showInfo, showSuccess]);

  const handleReset = useCallback(() => {
    setCurrentStep('method');
    setSelectedMethod('');
    setSelectedType('');
    setUserInput('');
    setResult('');
    setIsLoading(false);
    setJiaobeiBlessConfirmed(false);  // 重置擲筊祈福确认状态
    setIsDrawing(false);
    setDrawingResult(null);
    showInfo('已重置', '您可以重新开始占卜');
  }, [showInfo]);

  const handleCopyResult = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(result);
      showSuccess('复制成功', '占卜结果已复制到剪贴板');
    } catch (error) {
      showError('复制失败', '请手动选择文本进行复制');
    }
  }, [result, showSuccess, showError]);

  const handlePlainLanguageInterpretation = useCallback(async () => {
    setIsGeneratingInterpretation(true);
    try {
      // 构建发送给LLM的内容
      let contentToInterpret = '';
      
      if (selectedMethod === 'tarot') {
        const processedTarotCards = (specialData as any)?.processedTarotCards || [];
        if (processedTarotCards && processedTarotCards.length > 0) {
          const cardDetails = processedTarotCards.map((card: any, index: number) => {
            const orientation = card.isReversed ? '（逆位）' : '（正位）';
            const positionName = card.position?.name || `第${index + 1}张牌`;
            return `${positionName}${orientation}: ${card.name} - ${card.meaning}`;
          }).join('\n');
          contentToInterpret = `塔罗占卜结果：\n问题：${userInput}\n抽取的牌：\n${cardDetails}\n\n详细解读：\n${result}`;
        } else {
          contentToInterpret = `塔罗占卜结果：\n问题：${userInput}\n\n详细解读：\n${result}`;
        }
      } else if (selectedMethod === 'astrology') {
        contentToInterpret = `星座占卜结果：\n问题：${userInput}\n\n详细分析：\n${result}`;
      } else {
        contentToInterpret = `占卜结果：\n问题：${userInput}\n\n详细分析：\n${result}`;
      }
      
      // 调用LLM API进行大白话解读
      const response = await fetch('/api/llm/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: '你是一个专业的占卜解读师，擅长将复杂的占卜结果转换成通俗易懂的大白话解读。请用亲切、温暖的语气，结合生活化的比喻和实用的建议，帮助用户理解占卜结果的含义。'
            },
            {
              role: 'user',
              content: `请将以下占卜结果转换成大白话解读，要求：1. 用通俗易懂的语言解释 2. 提供实用的生活建议 3. 用温暖亲切的语气 4. 结合生活化的比喻\n\n${contentToInterpret}`
            }
          ]
        })
      });
      
      if (!response.ok) {
          const errorBody = await response.json();
          console.error('LLM_API_ERROR: Status:', response.status, 'StatusText:', response.statusText, 'Body:', errorBody);
          throw new Error(`解读生成失败: ${errorBody.error || response.statusText}`);
      }
      
      const data = await response.json();
      console.log('LLM_RESPONSE_DEBUG: Received data:', data);
      const interpretation = data.choices?.[0]?.message?.content || '解读生成失败，请重试。';
      console.log('LLM_INTERPRETATION_DEBUG: Interpretation:', interpretation);
      
      // interpretation 变量已在上面的API调用中定义
      
      setPlainLanguageResult(interpretation);
      showSuccess('解读完成', '大白话解读已生成，请查看');
    } catch (error) {
      console.error('生成大白话解读失败:', error);
      setPlainLanguageResult('抱歉，解读生成失败了。可能是网络问题，请稍后重试。');
      showError('生成失败', '解读生成失败，请重试');
    } finally {
      setIsGeneratingInterpretation(false);
    }
  }, [selectedMethod, userInput, result, specialData, showSuccess, showError]);

  const selectedMethodData = useMemo(() => 
    divinationMethods.find(m => m.id === selectedMethod), [selectedMethod]
  );

  const selectedTypeData = useMemo(() => 
    readingTypes.find(t => t.id === selectedType), [selectedType]
  );

  return (
    <InteractiveBackground className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Toast 容器 */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* 头部 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-4">
            神秘占卜馆
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            探索命运奥秘，指引人生方向。让古老的智慧为您揭示未来的可能性。
          </p>
        </div>

        {/* 进度指示器 */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-center space-x-4">
            {[
              { key: 'method', label: '选择方法', active: currentStep === 'method' },
              { key: 'type', label: '选择类型', active: currentStep === 'type' },
              { key: 'input', label: '输入信息', active: currentStep === 'input' },
              { key: 'result', label: '查看结果', active: currentStep === 'result' }
            ].map((step, index) => (
              <div key={step.key} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step.active
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                    : 'bg-slate-700 text-slate-400'
                }`}>
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step.active ? 'text-purple-300' : 'text-slate-500'
                }`}>
                  {step.label}
                </span>
                {index < 3 && (
                  <ArrowRight className="w-4 h-4 text-slate-600 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="max-w-6xl mx-auto">
          {currentStep === 'method' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">选择占卜方法</h2>
                <p className="text-slate-300 text-lg">每种方法都有其独特的智慧，选择最能引起您共鸣的一种</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {divinationMethods.map((method, index) => (
                  <AnimatedCard
                    key={method.id}
                    animationType="scale"
                    delay={index * 100}
                    variant="glass"
                    hover
                    interactive
                    className="cursor-pointer bg-slate-800/50 border-2 border-slate-600/50 hover:border-purple-400/60 hover:shadow-glow"
                    onClick={() => handleMethodSelect(method.id)}
                 >
                 </AnimatedCard>
               ))}
                    <div className="text-center p-6 relative">
                      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${method.gradient} rounded-full mb-4 shadow-lg animate-float`}>
                        {method.icon}
  
      
                    <div>
                    <div>
                      <AnimatedText
                        className="text-xl font-bold text-white mb-2"
                        animationType="fade-in"
                        delay={index * 150}
                        text={method.name}
                      />
                      <p className="text-slate-300 text-sm leading-relaxed">{method.description}</p>
                      
                      {/* 装饰性光效 */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  </AnimatedCard>
              </div>
            </div>
          )}

          {currentStep === 'type' && selectedMethodData && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
                  {selectedMethodData.icon}
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">{selectedMethodData.name}</h2>
                <p className="text-slate-300 text-lg">请选择您想要了解的方面</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
                {readingTypes.map((type, index) => (
                  <AnimatedCard
                    key={type.id}
                    animationType="slide"
                    delay={index * 80}
                    variant="glass"
                    hover
                    interactive
                    className="cursor-pointer bg-slate-800/50 border-2 border-slate-600/50 hover:border-purple-400/60 hover:shadow-glow"
                    onClick={() => handleTypeSelect(type.id)}
                  >
                    <div className="text-center p-4 relative">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-3 animate-pulse-soft">
                        {type.icon}
                      </div>
  
                      <AnimatedText
                        text={type.name}
                        className="text-lg font-semibold text-white"
                        animationType="fade-in"
                        delay={index * 120}
                      />
                      
                      {/* 悬浮光效 */}
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
              
              <div className="text-center">
                <AnimatedButton
                  variant="outline"
                  animationType="bounce"
                  onClick={() => setCurrentStep('method')}
                  className="text-slate-300 border-slate-600 hover:border-slate-500"
                >
                  返回选择方法
                </AnimatedButton>
              </div>
            </div>
          )}

          {currentStep === 'input' && selectedMethodData && selectedTypeData && (
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
                  {selectedMethodData.icon}
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">{selectedMethodData.name}</h2>
                <div className="flex items-center justify-center space-x-2 text-purple-300 mb-6">
                  {selectedTypeData.icon}
                  <span className="text-lg font-medium">{selectedTypeData.name}</span>
                </div>
              </div>
              
              <AnimatedCard 
                animationType="fade"
                delay={200}
                variant="glass"
                className="bg-slate-800/50 border-slate-600/50"
              >
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {/* 根据不同占卜方法显示不同的输入界面 */}
                    {selectedMethod === 'bazi' && (
                      <div className="space-y-6">
                        <div className="text-center space-y-4">
                          <div className="text-6xl">☯️</div>
                          <h3 className="text-xl font-semibold text-white">八字命理</h3>
                          <p className="text-slate-300">请准确填写您的出生信息，以便进行精准的八字分析</p>

                        
                        {/* 八字说明 */}
                        <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-xl p-6 border border-amber-600/30 space-y-4">
                          <div className="text-center">
                            <div className="text-4xl mb-2">📜</div>
                            <h4 className="text-lg font-semibold text-amber-300 mb-3">八字命理说明</h4>
      
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div className="bg-amber-800/20 rounded-lg p-3">
                              <div className="text-2xl mb-1">年</div>
                              <p className="text-amber-200 text-sm">年柱</p>
                              <p className="text-amber-300 text-xs">祖业根基</p>
        
                            <div className="bg-amber-800/20 rounded-lg p-3">
                              <div className="text-2xl mb-1">月</div>
                              <p className="text-amber-200 text-sm">月柱</p>
                              <p className="text-amber-300 text-xs">父母宫位</p>
        
                            <div className="bg-amber-800/20 rounded-lg p-3">
                              <div className="text-2xl mb-1">日</div>
                              <p className="text-amber-200 text-sm">日柱</p>
                              <p className="text-amber-300 text-xs">自身命格</p>
                            </div>
                            <div className="bg-amber-800/20 rounded-lg p-3">
                              <div className="text-2xl mb-1">时</div>
                              <p className="text-amber-200 text-sm">时柱</p>
                              <p className="text-amber-300 text-xs">子女后代</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* 出生信息输入 */}
                        <AnimatedCard 
                          animationType="slide"
                          delay={400}
                          variant="soft"
                          className="space-y-4 bg-slate-700/20 border-amber-600/30"
                        >
                          <CardContent className="p-6">
                            <AnimatedText 
                              text="生辰八字信息"
                              className="text-lg font-semibold text-white mb-4"
                              animationType="fade-in"
                              delay={500}
                          />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-white mb-2">出生日期</label>
                                <Input
                                  type="date"
                                  value={birthInfo.date}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBirthInfo({...birthInfo, date: e.target.value})}
                                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 hover:shadow-glow"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-white mb-2">出生时间</label>
                                <Input
                                  type="time"
                                  value={birthInfo.time}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBirthInfo({...birthInfo, time: e.target.value})}
                                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 hover:shadow-glow"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-white mb-2">出生地点</label>
                                <Input
                                  type="text"
                                  value={birthInfo.place}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBirthInfo({...birthInfo, place: e.target.value})}
                                  placeholder="请输入出生城市，如：北京、上海"
                                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 hover:shadow-glow"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-white mb-2">性别</label>
                                <select
                                  value={birthInfo.gender}
                                  onChange={(e) => setBirthInfo({...birthInfo, gender: e.target.value})}
                                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 hover:shadow-glow"
                                >
                                  <option value="">请选择</option>
                                  <option value="男">男</option>
                                  <option value="女">女</option>
                                </select>
                              </div>
                            </div>
                          </CardContent>
                        </AnimatedCard>
                        
                        {/* 问题输入 */}
                        <AnimatedCard 
                          animationType="scale"
                          delay={600}
                          variant="soft"
                          className="bg-slate-700/20 border-amber-600/30"
                        >
                          <CardContent className="p-6">
                            <AnimatedText 
                              text="您的问题"
                              className="block text-sm font-medium text-white mb-2"
                              animationType="fade-in"
                              delay={700}
                            />
                            <textarea
                              value={userInput}
                              onChange={(e) => setUserInput(e.target.value)}
                              placeholder="请输入您想要了解的命理问题，如：事业发展、财运状况、婚姻感情等..."
                              className="w-full h-24 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none transition-all duration-300 hover:shadow-glow"
                            />
                          </CardContent>
                        </AnimatedCard>
                        
                        {/* 五行展示 */}
                        <AnimatedCard 
                          animationType="glow"
                          delay={800}
                          variant="glass"
                          className="bg-slate-800/30"
                        >
                          <CardContent className="p-4">
                            <AnimatedText 
                              text="五行相生相克"
                              className="text-sm font-medium text-white mb-3 text-center"
                              animationType="fade-in"
                              delay={900}
                            />
                            <div className="flex justify-center space-x-4 text-xs">
                              {[
                                { name: '金', color: 'yellow' },
                                { name: '木', color: 'green' },
                                { name: '水', color: 'blue' },
                                { name: '火', color: 'red' },
                                { name: '土', color: 'amber' }
                              ].map((element, index) => (
                                <span 
                                  key={element.name}
                                  className={`px-3 py-1 bg-${element.color}-600/30 text-${element.color}-300 rounded-full animate-pulse-soft hover:scale-110 transition-transform duration-300 cursor-pointer`}
                                  style={{ animationDelay: `${index * 100}ms` }}
                                >
                                  {element.name}
                                </span>
                              </div>
               ))}
                            </div>
                          </CardContent>
                        </div>
                  </AnimatedCard>
                    )}
                    
                    {selectedMethod === 'ziwei' && (
                      <div className="space-y-6">
                        <div className="text-center space-y-4">
                          <div className="text-6xl">⭐</div>
                          <h3 className="text-xl font-semibold text-white">紫微斗数</h3>
                          <p className="text-slate-300">请填写详细的出生信息，以便排出准确的紫微星盘</p>
                        </div>
                        
                        {/* 紫微斗数说明 */}
                        <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-600/30 space-y-4">
                          <div className="text-center">
                            <div className="text-4xl mb-2">🌟</div>
                            <h4 className="text-lg font-semibold text-purple-300 mb-3">紫微星盘十二宫</h4>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
                            <div className="bg-purple-800/20 rounded-lg p-2">
                              <p className="text-purple-200 font-medium">命宫</p>
                              <p className="text-purple-300">主性格</p>
                            </div>
                            <div className="bg-purple-800/20 rounded-lg p-2">
                              <p className="text-purple-200 font-medium">财帛宫</p>
                              <p className="text-purple-300">主财运</p>
                            </div>
                            <div className="bg-purple-800/20 rounded-lg p-2">
                              <p className="text-purple-200 font-medium">事业宫</p>
                              <p className="text-purple-300">主工作</p>
                            </div>
                            <div className="bg-purple-800/20 rounded-lg p-2">
                              <p className="text-purple-200 font-medium">夫妻宫</p>
                              <p className="text-purple-300">主婚姻</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* 出生信息输入 */}
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-white">紫微星盘信息</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-white mb-2">出生日期</label>
                              <input
                                type="date"
                                value={birthInfo.date}
                                onChange={(e) => setBirthInfo({...birthInfo, date: e.target.value})}
                                className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-white mb-2">出生时间</label>
                              <input
                                type="time"
                                value={birthInfo.time}
                                onChange={(e) => setBirthInfo({...birthInfo, time: e.target.value})}
                                className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-white mb-2">出生地点</label>
                              <input
                                type="text"
                                value={birthInfo.place}
                                onChange={(e) => setBirthInfo({...birthInfo, place: e.target.value})}
                                placeholder="请输入出生城市，用于计算经纬度"
                                className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-white mb-2">性别</label>
                              <select
                                value={birthInfo.gender}
                                onChange={(e) => setBirthInfo({...birthInfo, gender: e.target.value})}
                                className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              >
                                <option value="">请选择</option>
                                <option value="男">男</option>
                                <option value="女">女</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        
                        {/* 问题输入 */}
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">您的问题</label>
                          <textarea
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="请输入您想要了解的问题，如：命宫分析、财运预测、事业发展、感情婚姻等..."
                            className="w-full h-24 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                          />
                        </div>
                        
                        {/* 星曜展示 */}
                        <div className="bg-slate-800/30 rounded-xl p-4">
                          <h5 className="text-sm font-medium text-white mb-3">主要星曜</h5>
                          <div className="flex flex-wrap justify-center gap-2 text-xs">
                            <span className="px-2 py-1 bg-purple-600/30 text-purple-300 rounded-full">紫微</span>
                            <span className="px-2 py-1 bg-indigo-600/30 text-indigo-300 rounded-full">天机</span>
                            <span className="px-2 py-1 bg-blue-600/30 text-blue-300 rounded-full">太阳</span>
                            <span className="px-2 py-1 bg-cyan-600/30 text-cyan-300 rounded-full">武曲</span>
                            <span className="px-2 py-1 bg-teal-600/30 text-teal-300 rounded-full">天府</span>
                            <span className="px-2 py-1 bg-green-600/30 text-green-300 rounded-full">太阴</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedMethod === 'compatibility' && (
                      <CompatibilityTest
                        onComplete={(data) => {
                          setSpecialData({ ...specialData, compatibilityData: data.compatibilityData });
                          setPartnerInfo({ name: data.compatibilityData.person2.name, birthDate: data.compatibilityData.person2.birthDate, zodiac: data.compatibilityData.person2.zodiacSign });
                          setBirthInfo({ ...birthInfo, date: data.compatibilityData.person1.birthDate });
                          setUserInput(`配对分析 - ${data.compatibilityData.person1.name} & ${data.compatibilityData.person2.name}`);
                          handleSubmit();
                        }}
                        onBack={() => setCurrentStep('type')}
                      />
                    )}

                    {selectedMethod === 'lottery' && (
                      <div className="text-center space-y-6">
                        <div className="space-y-4">
                          <div className="text-6xl animate-pulse">🙏</div>
                          <h3 className="text-xl font-semibold text-white">观音求签</h3>
                          <p className="text-slate-300">请虔诚地在心中默念您的问题，然后点击下方按钮抽签</p>
                        </div>
                        
                        {/* 祈祷仪式步骤 */}
                        <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-xl p-6 border border-yellow-600/30 space-y-4">
                          <div className="text-center">
                            <div className="text-4xl mb-2">🕯️</div>
                            <h4 className="text-lg font-semibold text-yellow-300 mb-3">祈祷仪式</h4>
                          </div>
                          
                          <div className="space-y-3 text-left">
                            <div className="flex items-start space-x-3">
                              <span className="text-yellow-400 font-bold">1.</span>
                              <div>
                                <p className="text-yellow-200 font-medium">净心静气</p>
                                <p className="text-yellow-300 text-sm">请先深呼吸三次，让心境平静下来</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                              <span className="text-yellow-400 font-bold">2.</span>
                              <div>
                                <p className="text-yellow-200 font-medium">虔诚祈祷</p>
                                <p className="text-yellow-300 text-sm">在心中默念："南无观世音菩萨，弟子诚心求签，请菩萨慈悲指点迷津"</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                              <span className="text-yellow-400 font-bold">3.</span>
                              <div>
                                <p className="text-yellow-200 font-medium">专心问事</p>
                                <p className="text-yellow-300 text-sm">在心中清晰地描述您想要询问的问题</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* 问题输入 */}
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">您的问题（可选）</label>
                          <textarea
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="您可以在此记录您的问题，或直接在心中默念..."
                            className="w-full h-20 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                          />
                        </div>
                        
                        {/* 签筒动画区域 */}
                        <div className="relative">
                          {isDrawing ? (
                            <div className="space-y-4">
                              <div className="text-8xl animate-bounce">
                                🏺
                              </div>
                              <div className="flex justify-center space-x-2">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                              </div>
                              <p className="text-yellow-300 text-sm animate-pulse">正在为您抽取灵签...</p>
                            </div>
                          ) : drawingResult && drawingResult.type === 'lottery' ? (
                            <div className="space-y-4">
                              <div className="text-6xl animate-pulse">
                                📜
                              </div>
                              <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded-xl p-4 border border-yellow-500/30">
                                <h4 className="text-yellow-300 font-bold text-lg mb-2">第{drawingResult.number}签</h4>
                                <p className="text-yellow-200 text-sm">{drawingResult.poem}</p>
                              </div>
                              <div className="bg-gradient-to-r from-amber-900/40 to-yellow-900/40 rounded-xl p-4 border border-amber-500/30">
                                <p className="text-amber-200 text-sm mb-3">🙏 请仔细阅读签文内容，准备好后点击下方按钮获取详细解读</p>
                                <div className="text-center">
                                  <button
                                    onClick={() => {
                                      setIsLoading(true);
                                      setCurrentStep('result');
                                      showInfo('开始占卜', '神秘的力量正在为您揭示答案...');
                                      
                                      setTimeout(() => {
                                        const result = generateDivinationResult(selectedMethod, selectedType, userInput, { ...specialData, drawingResult });
                                        setResult(result);
                                        setIsLoading(false);
                                        showSuccess('占卜完成', '您的占卜结果已生成，请查看详细解读');
                                      }, 2000);
                                    }}
                                    className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-amber-500/25"
                                  >
                                    <span className="flex items-center justify-center">
                                      🔮 继续占卜解读
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="text-8xl mb-4 transform transition-transform duration-500 hover:scale-110">
                                🏺
                              </div>
                              <p className="text-sm text-gray-500">点击下方按钮开始抽签</p>
                            </div>
                        </div>
                    </div>
                    )

                    {selectedMethod === 'jiaobei' && (
                      <div className="space-y-6">
                        <div className="text-center space-y-4">
                          <div className="text-6xl animate-bounce">🎋</div>
                          <h3 className="text-xl font-semibold text-white">擲筊问卜</h3>
                          <p className="text-slate-300">虔诚祈祷，向神明请示您心中的疑问</p>
                        </div>
                        
                        {/* 擲筊文化背景介绍 */}
                        <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-xl p-6 border border-amber-600/30 space-y-4">
                          <div className="text-center">
                            <div className="text-4xl mb-2">🏛️</div>
                            <h4 className="text-lg font-semibold text-amber-300 mb-3">擲筊的由来</h4>
                          </div>
                          <div className="text-amber-200 text-sm leading-relaxed space-y-2">
                            <p>擲筊是中华传统文化中重要的占卜方式，又称"掷杯"、"博杯"。相传起源于古代祭祀仪式，是人与神明沟通的神圣桥梁。</p>
                            <p>筊杯通常由竹根或木材制成，一面平坦（阴面），一面凸起（阳面），象征阴阳调和、天地相应的宇宙法则。</p>
                            <p>通过擲筊，虔诚的信众可以向神明请示人生重要问题，获得神圣的指引和答案。</p>
                          </div>
                        </div>
                        
                        {/* 擲筊说明 */}
                        <div className="bg-gradient-to-r from-green-900/30 to-teal-900/30 rounded-xl p-6 border border-green-600/30 space-y-4">
                          <div className="text-center">
                            <div className="text-4xl mb-2">⚪⚫</div>
                            <h4 className="text-lg font-semibold text-green-300 mb-3">三种筊象含义</h4>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div className="bg-green-800/20 rounded-lg p-4 border border-green-600/20">
                              <div className="text-3xl mb-3">⚪⚪</div>
                              <p className="text-green-200 font-bold text-lg mb-2">圣筊（胜筊）</p>
                              <p className="text-green-300 text-sm mb-2">一阴一阳，阴阳调和</p>
                              <p className="text-green-400 text-xs leading-relaxed">神明同意您的请求，事情将会顺利进行，是最吉利的筊象</p>
                            </div>
                            <div className="bg-yellow-800/20 rounded-lg p-4 border border-yellow-600/20">
                              <div className="text-3xl mb-3">⚫⚫</div>
                              <p className="text-yellow-200 font-bold text-lg mb-2">阴筊（隐筊）</p>
                              <p className="text-yellow-300 text-sm mb-2">双阴朝下，阴气过重</p>
                              <p className="text-yellow-400 text-xs leading-relaxed">神明不同意，或时机未到，建议重新考虑或改变方向</p>
                            </div>
                            <div className="bg-red-800/20 rounded-lg p-4 border border-red-600/20">
                              <div className="text-3xl mb-3">⚪⚫</div>
                              <p className="text-red-200 font-bold text-lg mb-2">笑筊（无筊）</p>
                              <p className="text-red-300 text-sm mb-2">双阳朝上，神明发笑</p>
                              <p className="text-red-400 text-xs leading-relaxed">问题不够明确或心意不诚，神明在笑，需要重新整理思绪</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* 擲筊仪式指导 */}
                        <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-600/30 space-y-4">
                          <div className="text-center">
                            <div className="text-4xl mb-2">🙏</div>
                            <h4 className="text-lg font-semibold text-purple-300 mb-3">擲筊仪式步骤</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                            <div className="space-y-2">
                              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                                <span className="text-purple-300 font-bold">1</span>
                              </div>
                              <p className="text-purple-200 font-medium">净心祈祷</p>
                              <p className="text-purple-300 text-xs">静心凝神，诚心祈祷</p>
                            </div>
                            <div className="space-y-2">
                              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                                <span className="text-purple-300 font-bold">2</span>
                              </div>
                              <p className="text-purple-200 font-medium">明确问题</p>
                              <p className="text-purple-300 text-xs">心中默念具体问题</p>
                            </div>
                            <div className="space-y-2">
                              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                                <span className="text-purple-300 font-bold">3</span>
                              </div>
                              <p className="text-purple-200 font-medium">虔诚擲筊</p>
                              <p className="text-purple-300 text-xs">恭敬地投掷筊杯</p>
                            </div>
                            <div className="space-y-2">
                              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                                <span className="text-purple-300 font-bold">4</span>
                              </div>
                              <p className="text-purple-200 font-medium">接受指引</p>
                              <p className="text-purple-300 text-xs">感恩神明的指示</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* 问题输入 */}
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">请输入您想要请示神明的问题</label>
                          <textarea
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="请输入您想要问神明的问题，建议问是非题，如：我应该接受这份工作吗？这段感情适合我吗？..."
                            className="w-full h-24 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                          />
                        </div>
                        
                        {/* 祈福确认步骤 */}
                        {!jiaobeiBlessConfirmed ? (
                          <div className="bg-gradient-to-r from-amber-900/40 to-yellow-900/40 rounded-xl p-6 border border-amber-500/30 space-y-4">
                            <div className="text-center">
                              <div className="text-5xl mb-3">🙏</div>
                              <h4 className="text-xl font-semibold text-amber-300 mb-3">开始擲筊前的准备</h4>
                              <p className="text-amber-200 text-sm leading-relaxed mb-4">
                                擲筊是神圣的仪式，需要您以虔诚的心态参与。请确认您已经：
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-amber-300 text-xs">✓</span>
                                </div>
                                <div>
                                  <p className="text-amber-200 font-medium">理解三种筊象含义</p>
                                  <p className="text-amber-300/80 text-xs">圣筊、阴筊、笑筊的不同指示</p>
                                </div>
                              </div>
                              <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-amber-300 text-xs">✓</span>
                                </div>
                                <div>
                                  <p className="text-amber-200 font-medium">明确您的问题</p>
                                  <p className="text-amber-300/80 text-xs">在心中清晰地表达疑问</p>
                                </div>
                              </div>
                              <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-amber-300 text-xs">✓</span>
                                </div>
                                <div>
                                  <p className="text-amber-200 font-medium">保持虔诚心态</p>
                                  <p className="text-amber-300/80 text-xs">以恭敬的态度面对神明</p>
                                </div>
                              </div>
                              <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-amber-300 text-xs">✓</span>
                                </div>
                                <div>
                                  <p className="text-amber-200 font-medium">接受神明指引</p>
                                  <p className="text-amber-300/80 text-xs">无论结果如何都心怀感恩</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-center pt-4">
                              <button
                                onClick={() => setJiaobeiBlessConfirmed(true)}
                                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-amber-500/25"
                              >
                                <span className="flex items-center">
                                  🙏 我已准备好，开始擲筊
                                </span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            {/* 擲筊动画区域 */}
                            <div className="text-center">
                              {isDrawing ? (
                                <div className="space-y-6">
                                  <div className="relative inline-block">
                                    {/* 主要椰子动画 */}
                                    <div className="relative">
                                      <div className="text-7xl animate-spin" style={{animationDuration: '0.8s'}}>
                                        🥥
                                      </div>
                                      <div className="absolute top-0 left-0 text-7xl animate-spin" style={{animationDuration: '1.2s', animationDirection: 'reverse'}}>
                                        🥥
                                      </div>
                                    </div>
                                    
                                    {/* 环绕特效 */}
                                    <div className="absolute -top-4 -right-4 text-3xl animate-bounce" style={{animationDelay: '0s'}}>
                                      ✨
                                    </div>
                                    <div className="absolute -bottom-4 -left-4 text-2xl animate-bounce" style={{animationDelay: '0.3s'}}>
                                      🌟
                                    </div>
                                    <div className="absolute -top-4 -left-4 text-xl animate-bounce" style={{animationDelay: '0.6s'}}>
                                      💫
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 text-2xl animate-bounce" style={{animationDelay: '0.9s'}}>
                                      ⭐
                                    </div>
                                    
                                    {/* 光环效果 */}
                                    <div className="absolute inset-0 rounded-full border-4 border-amber-400/30 animate-ping" style={{animationDuration: '2s'}}></div>
                                    <div className="absolute inset-2 rounded-full border-2 border-yellow-400/40 animate-ping" style={{animationDuration: '1.5s', animationDelay: '0.5s'}}></div>
                                  </div>
                                  
                                  {/* 跳动的点 */}
                                  <div className="flex justify-center space-x-3">
                                    <div className="w-4 h-4 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-bounce shadow-lg"></div>
                                    <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce shadow-lg" style={{animationDelay: '0.15s'}}></div>
                                    <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-bounce shadow-lg" style={{animationDelay: '0.3s'}}></div>
                                  </div>
                                  
                                  {/* 状态提示 */}
                                  <div className="bg-gradient-to-r from-amber-900/60 to-yellow-900/60 rounded-xl p-6 border border-amber-500/40 shadow-lg">
                                    <div className="flex items-center justify-center space-x-3 mb-3">
                                      <div className="text-2xl animate-pulse">🙏</div>
                                      <p className="text-amber-200 text-xl font-bold animate-pulse">神明正在为您指示...</p>
                                      <div className="text-2xl animate-pulse">🙏</div>
                                    </div>
                                    <p className="text-amber-300 text-sm">请保持虔诚的心态，静待神明回应</p>
                                    <div className="mt-3 flex justify-center space-x-1">
                                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                                    </div>
                                  </div>
                                </div>
                              ) : drawingResult && drawingResult.type !== 'lottery' ? (
                                <div className="space-y-6">
                                  {/* 擲筊结果展示 */}
                                  <div className="text-center">
                                    <div className="relative inline-block">
                                      <div className="text-8xl animate-pulse mb-4">
                                        {drawingResult.emoji}
                                      </div>
                                      {/* 光环效果 */}
                                      <div className="absolute inset-0 rounded-full border-4 border-amber-400/20 animate-pulse" style={{animationDuration: '3s'}}></div>
                                    </div>
                                  </div>
                                  
                                  {/* 神明指示卡片 */}
                                  <div className={`bg-gradient-to-br from-${drawingResult.color}-900/70 to-${drawingResult.color}-800/70 rounded-2xl p-8 border-2 border-${drawingResult.color}-500/50 shadow-2xl relative overflow-hidden`}>
                                    {/* 装饰性背景 */}
                                    <div className="absolute top-0 right-0 text-6xl opacity-10 transform rotate-12">
                                      🙏
                                    </div>
                                    <div className="absolute bottom-0 left-0 text-4xl opacity-10 transform -rotate-12">
                                      ✨
                                    </div>
                                    
                                    <div className="relative z-10">
                                      {/* 标题区域 */}
                                      <div className="text-center mb-6">
                                        <div className="flex items-center justify-center space-x-3 mb-3">
                                          <div className="text-3xl">🔮</div>
                                          <h4 className={`text-${drawingResult.color}-200 font-bold text-2xl`}>神明指示</h4>
                                          <div className="text-3xl">🔮</div>
                                        </div>
                                        <div className={`inline-block bg-${drawingResult.color}-800/50 rounded-full px-6 py-2 border border-${drawingResult.color}-400/30`}>
                                          <span className={`text-${drawingResult.color}-300 font-bold text-lg`}>{drawingResult.name}</span>
                                        </div>
                                      </div>
                                      
                                      {/* 含义解释 */}
                                      <div className={`bg-${drawingResult.color}-950/50 rounded-xl p-6 border border-${drawingResult.color}-600/30`}>
                                        <div className="flex items-start space-x-3">
                                          <div className="text-2xl mt-1">📜</div>
                                          <div>
                                            <h5 className={`text-${drawingResult.color}-200 font-semibold text-lg mb-3`}>神明的回应</h5>
                                            <p className={`text-${drawingResult.color}-100 text-base leading-relaxed`}>{drawingResult.meaning}</p>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* 指导建议 */}
                                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className={`bg-${drawingResult.color}-900/30 rounded-lg p-4 border border-${drawingResult.color}-600/20`}>
                                          <div className="flex items-center space-x-2 mb-2">
                                            <span className="text-xl">💡</span>
                                            <span className={`text-${drawingResult.color}-200 font-medium`}>建议行动</span>
                                          </div>
                                          <p className={`text-${drawingResult.color}-300 text-sm`}>
                                            {drawingResult.name === '聖筊' ? '积极行动，神明支持您的决定' : 
                                             drawingResult.name === '笑筊' ? '保持耐心，时机尚未成熟' : 
                                             '重新审视，寻找更好的方案'}
                                          </p>
                                        </div>
                                        <div className={`bg-${drawingResult.color}-900/30 rounded-lg p-4 border border-${drawingResult.color}-600/20`}>
                                          <div className="flex items-center space-x-2 mb-2">
                                            <span className="text-xl">🌟</span>
                                            <span className={`text-${drawingResult.color}-200 font-medium`}>心态调整</span>
                                          </div>
                                          <p className={`text-${drawingResult.color}-300 text-sm`}>
                                            {drawingResult.name === '聖筊' ? '保持感恩和谦逊的心态' : 
                                             drawingResult.name === '笑筊' ? '以平常心对待，继续努力' : 
                                             '反思自己的想法和动机'}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* 手动继续按钮 */}
                                  <div className="bg-gradient-to-r from-amber-900/40 to-yellow-900/40 rounded-xl p-4 border border-amber-500/30">
                                    <p className="text-amber-200 text-sm mb-3 text-center">🙏 请仔细查看擲筊结果，准备好后点击下方按钮获取详细解读</p>
                                    <div className="text-center">
                                      <button
                                        onClick={() => {
                                          setIsLoading(true);
                                          setCurrentStep('result');
                                          showInfo('开始占卜', '神秘的力量正在为您揭示答案...');
                                          
                                          setTimeout(() => {
                                            const result = generateDivinationResult(selectedMethod, selectedType, userInput, { ...specialData, drawingResult });
                                            setResult(result);
                                            setIsLoading(false);
                                            showSuccess('占卜完成', '您的占卜结果已生成，请查看详细解读');
                                          }, 2000);
                                        }}
                                        className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                                      >
                                        <span className="flex items-center justify-center">
                                          🔮 继续占卜解读
                                        </span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  <div className="relative inline-block">
                                    <div className="text-6xl mb-4 transform transition-transform duration-300 hover:rotate-12">
                                      🥥🥥
                                    </div>
                                    <div className="absolute -top-2 -right-2 text-2xl animate-spin">
                                      ✨
                                    </div>
                                  </div>
                                  <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-lg p-4 border border-slate-600/30">
                                    <p className="text-slate-300 text-sm mb-2">🙏 请在心中默念您的问题</p>
                                    <p className="text-slate-400 text-xs">准备好后点击下方"擲筊问卜"按钮</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedMethod === 'tarot' && (
                      <div className="space-y-6">
                        <div className="text-center space-y-4">
                          <div className="text-6xl">🔮</div>
                          <h3 className="text-xl font-semibold text-white">塔罗占卜</h3>
                          <p className="text-slate-300">选择牌阵布局，体验78张塔罗牌的神秘力量</p>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-white mb-3">选择牌阵布局</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {tarotSpreads.map(spread => (
                                <button
                                  key={spread.id}
                                  onClick={() => setSpecialData({...specialData, selectedSpread: spread.id})}
                                  className={`p-4 rounded-xl text-left transition-all duration-300 ${
                                    (specialData as any)?.selectedSpread === spread.id
                                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                                  }`}
                                >
                                  <div className="font-semibold mb-1">{spread.name}</div>
                                  <div className="text-sm opacity-90">{spread.description}</div>
                                  <div className="text-xs mt-2 opacity-75">{spread.positions.length}张牌</div>
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          {(specialData as any)?.selectedSpread && (
                            <div className="space-y-4">
                              <div className="bg-slate-800/30 rounded-xl p-4">
                                <h4 className="text-white font-medium mb-3">牌阵说明</h4>
                                <div className="space-y-2">
                                  {tarotSpreads.find(s => s.id === (specialData as any)?.selectedSpread)?.positions.map((position, index) => (
                                    <div key={index} className="flex items-center text-sm text-slate-300">
                                      <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                                        {index + 1}
                                      </div>
                                      <div>
                                        <span className="font-medium">{position.name}：</span>
                                        <span className="opacity-80">{position.meaning}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              {/* 塔罗牌选择界面 */}
                              <div className="bg-slate-800/30 rounded-xl p-4">
                                <h4 className="text-white font-medium mb-3">选择您的塔罗牌</h4>
                                <p className="text-slate-400 text-sm mb-4">请选择 {tarotSpreads.find(s => s.id === (specialData as any)?.selectedSpread)?.positions.length} 张牌</p>
                                
                                <div className="grid grid-cols-6 md:grid-cols-10 gap-2 mb-4 max-h-96 overflow-y-auto">
                                  {allTarotCards.map((card, index) => {
                                    const isSelected = ((specialData as any)?.selectedCards || []).includes(index);
                                    const selectedSpread = tarotSpreads.find(s => s.id === (specialData as any)?.selectedSpread);
                                    const maxCards = selectedSpread?.positions.length || 1;
                                    const canSelect = !isSelected && ((specialData as any)?.selectedCards || []).length < maxCards;
                                    
                                    return (
                                      <button
                                        key={index}
                                        onClick={() => {
                                          const currentSelected = (specialData as any)?.selectedCards || [];
                                          let newSelected;
                                          if (isSelected) {
                                            newSelected = currentSelected.filter((i: number) => i !== index);
                                          } else if (canSelect) {
                                            newSelected = [...currentSelected, index];
                                          } else {
                                            return;
                                          }
                                          setSpecialData({...specialData, selectedCards: newSelected});
                                        }}
                                        disabled={!canSelect && !isSelected}
                                        className={`aspect-[2/3] rounded-lg border-2 transition-all duration-300 ${
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
                                              <span className="text-white text-xs font-bold">{((specialData as any)?.selectedCards || []).indexOf(index) + 1}</span>
                                            </div>
                                          )}
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                                
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-slate-400">
                                    已选择 {((specialData as any)?.selectedCards || []).length} / {tarotSpreads.find(s => s.id === (specialData as any)?.selectedSpread)?.positions.length} 张牌
                                  </span>
                                  <button
                                    onClick={() => setSpecialData({...specialData, selectedCards: []})}
                                    className="text-purple-400 hover:text-purple-300 transition-colors"
                                  >
                                    重新选择
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                          
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
                        
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">您的问题</label>
                          <textarea
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="请输入您想要占卜的具体问题，越详细越能得到准确的指引..."
                            className="w-full h-24 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                          />
                        </div>
                      </div>
                    )}

                    {selectedMethod === 'astrology' && (
                      <div className="space-y-6">
                        <div className="text-center space-y-4">
                          <div className="text-6xl">⭐</div>
                          <h3 className="text-xl font-semibold text-white">星座占星分析</h3>
                          <p className="text-slate-300">通过精确的出生信息，为您解读星盘奥秘</p>
                        </div>
                        
                        {/* 星座说明 */}
                        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-600/30 space-y-4">
                          <div className="text-center">
                            <div className="text-4xl mb-2">🌟</div>
                            <h4 className="text-lg font-semibold text-purple-200 mb-3">星盘要素</h4>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-purple-800/20 rounded-lg p-3 text-center">
                              <div className="text-2xl mb-1">🪐</div>
                              <p className="text-purple-200 text-sm">行星</p>
                              <p className="text-purple-300 text-xs">能量源泉</p>
                            </div>
                            <div className="bg-purple-800/20 rounded-lg p-3 text-center">
                              <div className="text-2xl mb-1">🏠</div>
                              <p className="text-purple-200 text-sm">宫位</p>
                              <p className="text-purple-300 text-xs">生活领域</p>
                            </div>
                            <div className="bg-purple-800/20 rounded-lg p-3 text-center">
                              <div className="text-2xl mb-1">⚡</div>
                              <p className="text-purple-200 text-sm">相位</p>
                              <p className="text-purple-300 text-xs">能量关系</p>
                            </div>
                            <div className="bg-purple-800/20 rounded-lg p-3 text-center">
                              <div className="text-2xl mb-1">🔮</div>
                              <p className="text-purple-200 text-sm">星座</p>
                              <p className="text-purple-300 text-xs">性格特质</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* 出生信息输入 */}
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-white">出生信息</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-white mb-2">出生日期 *</label>
                              <input
                                type="date"
                                value={birthInfo.date}
                                onChange={(e) => setBirthInfo({...birthInfo, date: e.target.value})}
                                className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-white mb-2">出生时间 *</label>
                              <input
                                type="time"
                                value={birthInfo.time}
                                onChange={(e) => setBirthInfo({...birthInfo, time: e.target.value})}
                                className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-white mb-2">出生地点 *</label>
                              <input
                                type="text"
                                value={birthInfo.place}
                                onChange={(e) => setBirthInfo({...birthInfo, place: e.target.value})}
                                placeholder="请输入出生城市，如：北京、上海、广州等"
                                className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* 星座预览 */}
                        {birthInfo.date && (
                          <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl p-4 border border-indigo-600/30">
                            <div className="flex items-center space-x-4">
                              <div className="text-3xl">
                                {(() => {
                                  const sign = getZodiacSign(birthInfo.date);
                                  return sign ? sign.symbol : '⭐';
                                })()}
                              </div>
                              <div>
                                <p className="text-white font-medium">
                                  您的星座：{(() => {
                                    const sign = getZodiacSign(birthInfo.date);
                                    return sign ? sign.name : '未知';
                                  })()}
                                </p>
                                <p className="text-slate-300 text-sm">
                                  {(() => {
                                    const sign = getZodiacSign(birthInfo.date);
                                    return sign ? `${sign.element} | ${sign.quality} | 守护星：${sign.rulingPlanet}` : '请输入正确的出生日期';
                                  })()}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">您的问题</label>
                          <textarea
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="请输入您想要了解的星座运势问题，如：我的爱情运势如何？事业发展方向？财运状况？等等..."
                            className="w-full h-24 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                          />
                        </div>
                      </div>
                    )}

                    {selectedMethod === 'numerology' && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white mb-4">数字命理信息</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-white mb-2">您的姓名</label>
                            <input
                              type="text"
                              value={(specialData as any)?.name || ''}
                              onChange={(e) => setSpecialData({...specialData, name: e.target.value})}
                              placeholder="请输入您的姓名"
                              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-white mb-2">出生日期</label>
                            <input
                              type="date"
                              value={birthInfo.date}
                              onChange={(e) => setBirthInfo({...birthInfo, date: e.target.value})}
                              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">您的问题</label>
                          <textarea
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="请输入您想要了解的数字命理问题..."
                            className="w-full h-24 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                          />
                        </div>
                      </div>
                    )}

                    {selectedMethod === 'personality' && (
                      <MBTITest
                        onComplete={(data) => {
                          setSpecialData({ ...specialData, mbtiAnswers: data.answers, name: data.name });
                          setBirthInfo({ ...birthInfo, date: data.birthDate });
                          setUserInput(`MBTI性格测试 - ${data.name}`);
                          handleSubmit();
                        }}
                        onBack={() => setCurrentStep('type')}
                      />
                    )}

                    {selectedMethod === 'lifestory' && (
                      <LifeStoryInput
                        onComplete={(data) => {
                          setSpecialData({ ...specialData, name: data.name });
                          setBirthInfo({ ...birthInfo, date: data.birthDate, time: data.birthTime, gender: data.gender });
                          setUserInput(data.question || '');
                          handleSubmit();
                        }}
                        onBack={() => setCurrentStep('type')}
                      />
                    )}

                    {!['tarot', 'astrology', 'numerology', 'personality', 'lifestory', 'bazi', 'ziwei', 'compatibility', 'lottery', 'jiaobei'].includes(selectedMethod) && (
                      <div>
                        <label className="block text-lg font-medium text-white mb-3">
                          请描述您的问题或想了解的情况
                        </label>
                        <textarea
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          placeholder="请详细描述您的问题，越具体越能得到准确的指引..."
                          className="w-full h-32 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        />
                      </div>
                    )}
                    
                    <div className="flex space-x-4">
                      <Button
                        onClick={handleSubmit}
                        disabled={selectedMethod === 'jiaobei' && !jiaobeiBlessConfirmed}
                        className={`flex-1 font-semibold py-3 px-6 rounded-xl transition-all duration-300 ${
                          selectedMethod === 'jiaobei' && !jiaobeiBlessConfirmed 
                            ? 'bg-gray-500 cursor-not-allowed text-gray-300' 
                            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                        }`}
                      >
                        <ArrowRight className="w-5 h-5 mr-2" />
                        {selectedMethod === 'lottery' ? '虔诚抽签' : selectedMethod === 'jiaobei' ? (jiaobeiBlessConfirmed ? '擲筊问卜' : '请先完成祈福准备') : '开始占卜'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep('type')}
                        className="text-slate-300 border-slate-600 hover:border-slate-500 px-6"
                      >
                        返回
                      </Button>
                    </div>
                  </div>
                </CardContent>
              
          )}

          {currentStep === 'result' && (
            <div className="max-w-4xl mx-auto space-y-8 relative">
              {/* 粒子背景效果 */}
              <ParticleEffect 
                particleCount={30}
                theme="mystical"
                speed={0.5}
                interactive
                className="absolute inset-0 pointer-events-none"
              />
              {isLoading ? (
                <div className="text-center py-16">
                  <Loading size="lg" className="mb-6" />
                  <h2 className="text-2xl font-bold text-white mb-4">正在为您占卜...</h2>
                  <p className="text-slate-300">请稍候，神秘的力量正在为您揭示答案</p>
                </div>
              ) : (
                <div className="space-y-8 relative z-10">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 animate-pulse-soft">
                      {selectedMethodData?.icon}
                    </div>
                    <AnimatedText 
                      text="占卜结果"
                      className="text-3xl font-bold text-white mb-2"
                      animationType="fade-in"
                      delay={300}
                    />
                    <div className="flex items-center justify-center space-x-2 text-purple-300">
                      {selectedTypeData?.icon}
                      <AnimatedText 
                        text={selectedTypeData?.name || ''}
                        className="text-lg font-medium"
                        animationType="slide-up"
                        delay={500}
                      />
                    </div>
                  </div>
                  
                  {(selectedMethod === 'tarot' || selectedMethod === 'astrology') ? (
                    // For Tarot and Astrology, use the enhanced display
                    selectedMethod === 'tarot' ? (
                      <div id="tarot-result-content" className="space-y-6">
                        {/* 塔罗占卜专用精美结果展示 */}
                        <div className="relative bg-gradient-to-br from-purple-900/40 via-slate-800/60 to-indigo-900/40 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 shadow-2xl overflow-hidden">
                          <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
                              <Sparkles className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">
                              🔮 塔罗神谕
                            </h3>
                            <p className="text-purple-200/80">宇宙的智慧为您揭示真相</p>
                          </div>
                          
                          {/* 问题展示 */}
                          <AnimatedCard
                            animationType="slide"
                            delay={700}
                            variant="glass"
                            className="bg-slate-800/50 border-slate-600/30 mb-8"
                          >
                            <CardContent className="p-6">
                              <h4 className="text-lg font-semibold text-purple-300 mb-3 flex items-center">
                                <MessageCircle className="w-5 h-5 mr-2" />
                                您的问题
                              </h4>
                              <AnimatedText
                                text={`"${userInput}"`}
                                className="text-slate-200 text-lg italic"
                                animationType="typewriter"
                                delay={900}
                                speed={50}
                              />
                            </CardContent>
                          </AnimatedCard>
                          
                          {/* 选中的塔罗牌展示 */}
                          {(specialData as any)?.selectedCards && (specialData as any)?.selectedCards.length > 0 && (
                            <div className="mb-8">
                              <h4 className="text-lg font-semibold text-purple-300 mb-4 flex items-center">
                                <Star className="w-5 h-5 mr-2" />
                                您选择的塔罗牌
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                 {(specialData as any).selectedCards.map((cardIndex: number, index: number) => {
                                   const card = allTarotCards[cardIndex];
                                   const positions = ['过去/根源', '现在/挑战', '未来/指引', '深层影响', '最终结果'];
                                   const position = positions[index] || `第${index + 1}张牌`;
                                   const cardColors = [
                                     'from-red-600 to-pink-600',
                                     'from-blue-600 to-indigo-600',
                                     'from-green-600 to-emerald-600',
                                     'from-purple-600 to-violet-600',
                                     'from-orange-600 to-amber-600'
                                   ];
                                   const cardColor = cardColors[index % cardColors.length];
                                   
                                   return (
                                     <div key={index} className="group perspective-1000">
                                       <div className="relative transform-gpu transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                                         {/* 塔罗牌卡片 */}
                                         <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
                                           {/* 位置标签 */}
                                           <div className="text-center mb-4">
                                             <div className="inline-block bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full px-3 py-1 border border-purple-400/30">
                                               <span className="text-xs font-medium text-purple-300">{position}</span>
                                             </div>
                                           </div>
                                           
                                           {/* 塔罗牌主体 */}
                                           <div className="relative">
                                             <div className={`w-20 h-32 bg-gradient-to-br ${cardColor} rounded-xl mx-auto mb-4 flex flex-col items-center justify-center shadow-xl border-2 border-white/20 relative overflow-hidden`}>
                                               {/* 卡片装饰背景 */}
                                               <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                                               <div className="absolute top-2 left-2 w-3 h-3 bg-white/30 rounded-full"></div>
                                               <div className="absolute bottom-2 right-2 w-2 h-2 bg-white/20 rounded-full"></div>
                                               
                                               {/* 卡片编号 */}
                                               <div className="relative z-10 text-center">
                                                 <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mb-2 backdrop-blur-sm">
                                                   <span className="text-white font-bold text-sm">{index + 1}</span>
                                                 </div>
                                                 
                                                 {/* 神秘符号 */}
                                                 <div className="text-white/80">
                                                   {index === 0 && <div className="text-lg">🌙</div>}
                                                   {index === 1 && <div className="text-lg">⭐</div>}
                                                   {index === 2 && <div className="text-lg">🔮</div>}
                                                   {index === 3 && <div className="text-lg">✨</div>}
                                                   {index === 4 && <div className="text-lg">🌟</div>}
                                                   {index > 4 && <div className="text-lg">💫</div>}
                                                 </div>
                                               </div>
                                               
                                               {/* 卡片光效 */}
                                               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 group-hover:animate-pulse"></div>
                                             </div>
                                             
                                             {/* 卡片阴影效果 */}
                                             <div className={`absolute top-1 left-1/2 transform -translate-x-1/2 w-20 h-32 bg-gradient-to-br ${cardColor} rounded-xl opacity-30 blur-sm -z-10`}></div>
                                           </div>
                                           
                                           {/* 卡片信息 */}
                                           <div className="text-center space-y-2">
                                             <h5 className="font-bold text-purple-200 text-lg">{card.name}</h5>
                                             <p className="text-sm text-purple-300/80 font-medium leading-relaxed">{card.meaning}</p>
                                             
                                             {/* 装饰性分割线 */}
                                             <div className="flex items-center justify-center space-x-2 py-2">
                                               <div className="w-8 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
                                               <div className="w-1 h-1 bg-purple-400/50 rounded-full"></div>
                                               <div className="w-8 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
                                             </div>
                                           </div>
                                           
                                           {/* 卡片边框光效 */}
                                           <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                         </div>
                                       </div>
                                     </div>
                                   );
                                 })}
                               </div>
                            </div>
                          )}
                          
                          {/* 详细解读 */}
                          <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-xl p-6 border border-slate-600/30">
                            <div className="prose prose-invert max-w-none">
                              <div className="text-slate-200 leading-relaxed whitespace-pre-line">
                                {result}
                              </div>
                            </div>
                          </div>

                          {/* 装饰性元素 */}
                          <div className="absolute top-4 right-4 opacity-20">
                            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl"></div>
                          </div>
                          <div className="absolute bottom-4 left-4 opacity-20">
                            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full blur-2xl"></div>
                          </div>
                        </div>
                      </div>
                    ) : selectedMethod === 'astrology' ? (
                      <div id="astrology-result-content" className="space-y-6">
                        {/* 星座占卜专用精美结果展示 */}
                        <div className="relative bg-gradient-to-br from-purple-900/40 via-slate-800/60 to-indigo-900/40 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 shadow-2xl overflow-hidden">
                          <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
                              <Sparkles className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">
                              ⭐ 星座神谕
                            </h3>
                            <p className="text-purple-200/80">星辰的指引为您揭示命运</p>
                          </div>

                          {/* 问题展示 */}
                          <AnimatedCard
                            animationType="slide"
                            delay={700}
                            variant="glass"
                            className="bg-slate-800/50 border-slate-600/30 mb-8"
                          >
                            <CardContent className="p-6">
                              <h4 className="text-lg font-semibold text-purple-300 mb-3 flex items-center">
                                <MessageCircle className="w-5 h-5 mr-2" />
                                您的问题
                              </h4>
                              <AnimatedText
                                text={`"${userInput}"`}
                                className="text-slate-200 text-lg italic"
                                animationType="typewriter"
                                delay={900}
                                speed={50}
                              />
                            </CardContent>
                          </AnimatedCard>

                          {/* 详细解读 */}
                          <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-xl p-6 border border-slate-600/30">
                            <div className="prose prose-invert max-w-none">
                              <div className="text-slate-200 leading-relaxed whitespace-pre-line">
                                {result}
                              </div>
                            </div>
                          </div>

                          {/* 装饰性元素 */}
                          <div className="absolute top-4 right-4 opacity-20">
                            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl"></div>
                          </div>
                          <div className="absolute bottom-4 left-4 opacity-20">
                            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full blur-2xl"></div>
                          </div>
                        </div>
                        {/* 大白话解读显示区域 */}
                        {plainLanguageResult && (
                          <div className="bg-gradient-to-r from-green-800/40 to-emerald-800/40 rounded-xl p-6 border border-green-500/30 mt-6">
                            <div className="flex items-center space-x-2 mb-4">
                              <MessageCircle className="w-6 h-6 text-green-400" />
                              <h3 className="text-xl font-bold text-green-200">大白话解读</h3>
                              <div className="flex-1 h-px bg-gradient-to-r from-green-400/50 to-transparent"></div>
                            </div>
                            <div className="prose prose-invert max-w-none">
                              <div className="text-green-100 leading-relaxed whitespace-pre-line">
                                {plainLanguageResult}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null
                  )}
                      {/* 塔罗占卜专用精美结果展示 */}
                      <div className="relative bg-gradient-to-br from-purple-900/40 via-slate-800/60 to-indigo-900/40 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 shadow-2xl overflow-hidden">
                        <div className="text-center mb-8">
                          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
                            <Sparkles className="w-10 h-10 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">
                            🔮 塔罗神谕
                          </h3>
                          <p className="text-purple-200/80">宇宙的智慧为您揭示真相</p>
                        </div>
                        
                        {/* 问题展示 */}
                        <AnimatedCard 
                          animationType="slide"
                          delay={700}
                          variant="glass"
                          className="bg-slate-800/50 border-slate-600/30 mb-8"
                        >
                          <CardContent className="p-6">
                            <h4 className="text-lg font-semibold text-purple-300 mb-3 flex items-center">
                              <MessageCircle className="w-5 h-5 mr-2" />
                              您的问题
                            </h4>
                            <AnimatedText 
                              text={`"${userInput}"`}
                              className="text-slate-200 text-lg italic"
                              animationType="typewriter"
                              delay={900}
                              speed={50}
                            />
                          </CardContent>
                        </AnimatedCard>
                        
                        {/* 选中的塔罗牌展示 */}
                        {(specialData as any)?.selectedCards && (specialData as any)?.selectedCards.length > 0 && (
                          <div className="mb-8">
                            <h4 className="text-lg font-semibold text-purple-300 mb-4 flex items-center">
                              <Star className="w-5 h-5 mr-2" />
                              您选择的塔罗牌
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                               {(specialData as any).selectedCards.map((cardIndex: number, index: number) => {
                                 const card = allTarotCards[cardIndex];
                                 const positions = ['过去/根源', '现在/挑战', '未来/指引', '深层影响', '最终结果'];
                                 const position = positions[index] || `第${index + 1}张牌`;
                                 const cardColors = [
                                   'from-red-600 to-pink-600',
                                   'from-blue-600 to-indigo-600', 
                                   'from-green-600 to-emerald-600',
                                   'from-purple-600 to-violet-600',
                                   'from-orange-600 to-amber-600'
                                 ];
                                 const cardColor = cardColors[index % cardColors.length];
                                 
                                 return (
                                   <div key={index} className="group perspective-1000">
                                     <div className="relative transform-gpu transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                                       {/* 塔罗牌卡片 */}
                                       <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
                                         {/* 位置标签 */}
                                         <div className="text-center mb-4">
                                           <div className="inline-block bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full px-3 py-1 border border-purple-400/30">
                                             <span className="text-xs font-medium text-purple-300">{position}</span>
                                           </div>
                                         </div>
                                         
                                         {/* 塔罗牌主体 */}
                                         <div className="relative">
                                           <div className={`w-20 h-32 bg-gradient-to-br ${cardColor} rounded-xl mx-auto mb-4 flex flex-col items-center justify-center shadow-xl border-2 border-white/20 relative overflow-hidden`}>
                                             {/* 卡片装饰背景 */}
                                             <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                                             <div className="absolute top-2 left-2 w-3 h-3 bg-white/30 rounded-full"></div>
                                             <div className="absolute bottom-2 right-2 w-2 h-2 bg-white/20 rounded-full"></div>
                                             
                                             {/* 卡片编号 */}
                                             <div className="relative z-10 text-center">
                                               <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mb-2 backdrop-blur-sm">
                                                 <span className="text-white font-bold text-sm">{index + 1}</span>
                                               </div>
                                               
                                               {/* 神秘符号 */}
                                               <div className="text-white/80">
                                                 {index === 0 && <div className="text-lg">🌙</div>}
                                                 {index === 1 && <div className="text-lg">⭐</div>}
                                                 {index === 2 && <div className="text-lg">🔮</div>}
                                                 {index === 3 && <div className="text-lg">✨</div>}
                                                 {index === 4 && <div className="text-lg">🌟</div>}
                                                 {index > 4 && <div className="text-lg">💫</div>}
                                               </div>
                                             </div>
                                             
                                             {/* 卡片光效 */}
                                             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 group-hover:animate-pulse"></div>
                                           </div>
                                           
                                           {/* 卡片阴影效果 */}
                                           <div className={`absolute top-1 left-1/2 transform -translate-x-1/2 w-20 h-32 bg-gradient-to-br ${cardColor} rounded-xl opacity-30 blur-sm -z-10`}></div>
                                         </div>
                                         
                                         {/* 卡片信息 */}
                                         <div className="text-center space-y-2">
                                           <h5 className="font-bold text-purple-200 text-lg">{card.name}</h5>
                                           <p className="text-sm text-purple-300/80 font-medium leading-relaxed">{card.meaning}</p>
                                           
                                           {/* 装饰性分割线 */}
                                           <div className="flex items-center justify-center space-x-2 py-2">
                                             <div className="w-8 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
                                             <div className="w-1 h-1 bg-purple-400/50 rounded-full"></div>
                                             <div className="w-8 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
                                           </div>
                                         </div>
                                         
                                         {/* 卡片边框光效 */}
                                         <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                       </div>
                                     </div>
                                   </div>
                                 );
                               })}
                             </div>
                          </div>
                        )}
                        
                        {/* 详细解读 */}
                        <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-xl p-6 border border-slate-600/30">
                          <div className="prose prose-invert max-w-none">
                            <div className="text-slate-200 leading-relaxed whitespace-pre-line">
                              {result}
                            </div>
                          </div>
                        </div>

                        {/* 装饰性元素 */}
                        <div className="absolute top-4 right-4 opacity-20">
                          <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl"></div>
                        </div>
                        <div className="absolute bottom-4 left-4 opacity-20">
                          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full blur-2xl"></div>
                        </div>
                      </div>
                    </div>
                  ) : selectedMethod === 'astrology' ? (
                    <div id="astrology-result-content" className="space-y-6">
                      {/* 星座占卜专用精美结果展示 */}
                      <div className="relative bg-gradient-to-br from-purple-900/40 via-slate-800/60 to-indigo-900/40 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 shadow-2xl overflow-hidden">
                        <div className="text-center mb-8">
                          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
                            <Sparkles className="w-10 h-10 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">
                            ⭐ 星座神谕
                          </h3>
                          <p className="text-purple-200/80">星辰的指引为您揭示命运</p>
                        </div>

                        {/* 问题展示 */}
                        <AnimatedCard
                          animationType="slide"
                          delay={700}
                          variant="glass"
                          className="bg-slate-800/50 border-slate-600/30 mb-8"
                        >
                          <CardContent className="p-6">
                            <h4 className="text-lg font-semibold text-purple-300 mb-3 flex items-center">
                              <MessageCircle className="w-5 h-5 mr-2" />
                              您的问题
                            </h4>
                            <AnimatedText
                              text={`"${userInput}"`}
                              className="text-slate-200 text-lg italic"
                              animationType="typewriter"
                              delay={900}
                              speed={50}
                            />
                          </CardContent>
                        </AnimatedCard>

                        {/* 详细解读 */}
                        <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-xl p-6 border border-slate-600/30">
                          <div className="prose prose-invert max-w-none">
                            <div className="text-slate-200 leading-relaxed whitespace-pre-line">
                              {result}
                            </div>
                          </div>
                        </div>

                        {/* 装饰性元素 */}
                        <div className="absolute top-4 right-4 opacity-20">
                          <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl"></div>
                        </div>
                        <div className="absolute bottom-4 left-4 opacity-20">
                          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full blur-2xl"></div>
                        </div>
                      </div>
                      {/* 大白话解读显示区域 */}
                      {plainLanguageResult && (
                        <div className="bg-gradient-to-r from-green-800/40 to-emerald-800/40 rounded-xl p-6 border border-green-500/30 mt-6">
                          <div className="flex items-center space-x-2 mb-4">
                            <MessageCircle className="w-6 h-6 text-green-400" />
                            <h3 className="text-xl font-bold text-green-200">大白话解读</h3>
                            <div className="flex-1 h-px bg-gradient-to-r from-green-400/50 to-transparent"></div>
                          </div>
                          <div className="prose prose-invert max-w-none">
                            <div className="text-green-100 leading-relaxed whitespace-pre-line">
                              {plainLanguageResult}
                            </div>
                          </div>
                        </div>
                      )}

                  )}
                  
                  <div className="flex justify-center space-x-4 flex-wrap gap-4">
                    {/* 大白话解读按钮 - 仅在塔罗和星座占卜时显示 */}
                    {(selectedMethod === 'tarot' || selectedMethod === 'astrology') && (
                      <AnimatedButton
                        onClick={() => handlePlainLanguageInterpretation()}
                        animationType="glow"
                        disabled={isGeneratingInterpretation}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-8 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingInterpretation ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            生成中...
                          </>
                        ) : (
                          <>
                            <MessageCircle className="w-5 h-5 mr-2" />
                            大白话解读
                          </>
                        )}
                      </AnimatedButton>
                    )}
                    <AnimatedButton
                      onClick={handleReset}
                      animationType="bounce"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-xl"
                    >
                      <ArrowRight className="w-5 h-5 mr-2" />
                      重新占卜
                    </AnimatedButton>
                    <AnimatedButton
                       variant="outline"
                       animationType="pulse"
                       onClick={handleCopyResult}
                       className="text-slate-300 border-slate-600 hover:border-slate-500 py-3 px-8"
                     >
                       <Copy className="w-5 h-5 mr-2" />
                       复制结果
                     </AnimatedButton>
                     
                     {/* 通用打印功能 */}
                     <AnimatedButton
                       variant="outline"
                       animationType="glow"
                       onClick={() => {
                         const printWindow = window.open('', '_blank');
                         if (printWindow) {
                           const methodName = selectedMethodData?.name || '占卜';
                           const typeName = selectedTypeData?.name || '';
                           
                           // 生成特殊内容（如塔罗牌展示）
                           let specialContent = '';
                           if (selectedMethod === 'tarot' && (specialData as any)?.selectedCards && (specialData as any)?.selectedCards.length > 0) {
                             specialContent = `
                               <div class="cards-section">
                                 <h3>您选择的塔罗牌</h3>
                                 <div class="card-grid">
                                   ${(specialData as any).selectedCards.map((cardIndex: number, index: number) => {
                                     const card = tarotCards[cardIndex];
                                     const positions = ['过去/根源', '现在/挑战', '未来/指引', '深层影响', '最终结果'];
                                     const position = positions[index] || `第${index + 1}张牌`;
                                     return `
                                       <div class="card">
                                         <div class="card-position">${position}</div>
                                         <div class="card-visual">${index + 1}</div>
                                         <div class="card-name">${card.name}</div>
                                         <div class="card-meaning">${card.meaning}</div>
                                       </div>
                                     `;
                                   }).join('')}
                                 </div>
                               </div>
                             `;
                           }
                           
                           printWindow.document.write(`
                             <html>
                               <head>
                                 <title>${methodName}占卜结果</title>
                                 <style>
                                   body { font-family: 'Microsoft YaHei', sans-serif; margin: 20px; background: white; color: #333; }
                                   .header { text-align: center; margin-bottom: 30px; }
                                   .title { font-size: 24px; font-weight: bold; color: #7c3aed; margin-bottom: 10px; }
                                   .subtitle { font-size: 16px; color: #666; }
                                   .question { background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #7c3aed; }
                                   .cards-section { margin: 30px 0; }
                                   .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
                                   .card { border: 2px solid #e5e7eb; border-radius: 10px; padding: 15px; text-align: center; background: #f9fafb; }
                                   .card-visual { width: 60px; height: 90px; background: linear-gradient(135deg, #7c3aed, #ec4899); border-radius: 8px; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; }
                                   .card-position { font-size: 12px; color: #7c3aed; font-weight: bold; margin-bottom: 5px; }
                                   .card-name { font-weight: bold; margin: 5px 0; }
                                   .card-meaning { font-size: 14px; color: #666; }
                                   .result-content { line-height: 1.8; white-space: pre-line; margin: 20px 0; }
                                   .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #999; }
                                   @media print { body { margin: 0; } }
                                 </style>
                               </head>
                               <body>
                                 <div class="header">
                                   <div class="title">${selectedMethodData?.icon ? '🔮' : '✨'} ${methodName}占卜结果</div>
                                   <div class="subtitle">神秘占卜馆 - ${typeName ? `${typeName} - ` : ''}宇宙智慧指引</div>
                                 </div>
                                 
                                 ${userInput ? `<div class="question"><strong>您的问题：</strong>${userInput}</div>` : ''}
                                 
                                 ${specialContent}
                                 
                                 <div class="result-content">${result}</div>
                                 
                                 <div class="footer">
                                   占卜时间：${new Date().toLocaleString('zh-CN')}<br>
                                   神秘占卜馆 - 探索命运奥秘，指引人生方向
                                 </div>
                               </body>
                             </html>
                           `);
                           printWindow.document.close();
                           printWindow.print();
                         }
                       }}
                       className="text-slate-300 border-slate-600 hover:border-slate-500 py-3 px-8"
                     >
                       <BookOpen className="w-5 h-5 mr-2" />
                       打印结果
                     </AnimatedButton>
                     
                     {/* 通用下载功能 */}
                     <Button
                       variant="outline"
                       onClick={() => {
                         const element = document.createElement('a');
                         const methodName = selectedMethodData?.name || '占卜';
                         const typeName = selectedTypeData?.name || '';
                         
                         // 生成特殊内容（如塔罗牌信息）
                         let specialContent = '';
                         if (selectedMethod === 'tarot' && (specialData as any)?.selectedCards && (specialData as any)?.selectedCards.length > 0) {
                           specialContent = `您选择的塔罗牌：\n${(specialData as any).selectedCards.map((cardIndex: number, index: number) => {
                             const card = tarotCards[cardIndex];
                             const positions = ['过去/根源', '现在/挑战', '未来/指引', '深层影响', '最终结果'];
                             const position = positions[index] || `第${index + 1}张牌`;
                             return `${position}：${card.name} - ${card.meaning}`;
                           }).join('\n')}\n\n`;
                         }
                         
                         const fileContent = `${methodName}占卜结果${typeName ? ` - ${typeName}` : ''}\n\n${userInput ? `您的问题：${userInput}\n\n` : ''}${specialContent}${result}\n\n占卜时间：${new Date().toLocaleString('zh-CN')}\n神秘占卜馆 - 探索命运奥秘，指引人生方向`;
                         
                         const file = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
                         element.href = URL.createObjectURL(file);
                         element.download = `${methodName}占卜结果_${new Date().toISOString().slice(0, 10)}.txt`;
                         document.body.appendChild(element);
                         element.click();
                         document.body.removeChild(element);
                         URL.revokeObjectURL(element.href);
                       }}
                       className="text-slate-300 border-slate-600 hover:border-slate-500 py-3 px-8"
                     >
                       <ArrowRight className="w-5 h-5 mr-2" />
                       下载结果
                     </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* 浮动操作按钮 */}
        <FloatingActionButton
          position="bottom-right"
          actions={[
            {
              id: "reset",
              icon: <ArrowRight className="w-5 h-5" />,
              label: "重新开始",
              onClick: handleReset,
              color: "purple"
            },
            {
              id: "copy",
              icon: <Copy className="w-5 h-5" />,
              label: "复制结果",
              onClick: handleCopyResult,
              color: "blue"
            },
            {
              id: "random",
              icon: <Sparkles className="w-5 h-5" />,
              label: "随机占卜",
              onClick: () => {
                const methods = Object.keys(divinationMethods);
                const randomMethod = methods[Math.floor(Math.random() * methods.length)];
                setSelectedMethod(randomMethod);
                setCurrentStep('type');
              },
              color: "pink"
            }
          ]}
          className={currentStep === 'result' ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        />
      </div>
    </InteractiveBackground>
  );
}