import { allTarotCards, tarotSpreads } from '../../data/tarotCards';
import { getZodiacSign, calculateCompatibility, generateBirthChart } from '../../data/astrologyData';
import { calculateLifeNumber, getLifeNumberInfo, calculateNumerologyCompatibility, generateDailyNumerologyFortune, generateLuckyElementsRecommendation, calculateExpressionNumber, calculateAdvancedNameAnalysis } from '../../data/numerologyData';
import { lotteryData } from '../../data/lotteryData';
import { calculateMBTIResult, mbtiTypes } from '../../data/mbtiData';
import { calculateCompatibilityScore, generateLifeStory } from '../../data/psychologyData';
import { divinationMethods } from '../DivinationMethodSelector/DivinationMethodSelector';
import { readingTypes } from '../DivinationTypeSelector/DivinationTypeSelector';

// 生成个性化的今日运势
function generatePersonalizedDailyHoroscope(sign: any, userQuestion: string, timeBasedSeed: number): string {
  const questionKeywords = userQuestion.toLowerCase();
  const isLoveQuestion = questionKeywords.includes('爱情') || questionKeywords.includes('感情') || questionKeywords.includes('恋爱');
  const isCareerQuestion = questionKeywords.includes('事业') || questionKeywords.includes('工作') || questionKeywords.includes('职业');
  const isWealthQuestion = questionKeywords.includes('财运') || questionKeywords.includes('金钱') || questionKeywords.includes('财富');
  const isHealthQuestion = questionKeywords.includes('健康') || questionKeywords.includes('身体');
  
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

// 主要的占卜结果生成函数
export function generateDivinationResult(
  methodId: string, 
  typeId: string, 
  input: string, 
  specialData?: Record<string, unknown>,
  birthInfo?: any,
  partnerInfo?: any
): string {
  console.log('=== DivinationEngine Debug ===');
  console.log('Method ID:', methodId);
  console.log('Type ID:', typeId);
  console.log('Input:', input);
  console.log('Birth Info:', birthInfo);
  console.log('Special Data:', specialData);
  console.log('Available methods:', divinationMethods?.length || 'undefined');
  console.log('Available types:', readingTypes?.length || 'undefined');
  
  if (!methodId || !typeId || !input) {
    console.error('Missing required parameters');
    return '请提供完整的占卜信息。';
  }
  
  const method = divinationMethods.find(m => m.id === methodId);
  const type = readingTypes.find(t => t.id === typeId);
  
  console.log('Found method:', method?.name || 'not found');
  console.log('Found type:', type?.name || 'not found');
  
  if (!method) {
    console.error('Method not found:', methodId);
    return `未找到占卜方法: ${methodId}`;
  }
  
  if (!type) {
    console.error('Type not found:', typeId);
    return `未找到占卜类型: ${typeId}`;
  }
  
  // 转换数据格式以兼容原版本
  const convertedBirthInfo = birthInfo ? {
    date: `${birthInfo.year}-${birthInfo.month.toString().padStart(2, '0')}-${birthInfo.day.toString().padStart(2, '0')}`,
    time: birthInfo.time || '12:00',
    place: birthInfo.place || '',
    gender: birthInfo.gender || 'male'
  } : null;
  
  const convertedPartnerInfo = partnerInfo ? {
    name: partnerInfo.name || '',
    birthDate: partnerInfo.birthInfo ? 
      `${partnerInfo.birthInfo.year}-${partnerInfo.birthInfo.month.toString().padStart(2, '0')}-${partnerInfo.birthInfo.day.toString().padStart(2, '0')}` : '',
    zodiac: ''
  } : null;
  
  try {
    switch (methodId) {
      case 'tarot':
        // 塔罗牌占卜逻辑
        const spreadType = typeId || 'single';
        const currentSpread = tarotSpreads.find(s => s.id === spreadType) || tarotSpreads[0];
        
        let selectedCards;
        const userSelectedCards = (specialData as any)?.selectedCards;
        
        if (userSelectedCards && userSelectedCards.length > 0) {
          selectedCards = userSelectedCards.map((cardIndex: number, index: number) => {
            const card = allTarotCards[cardIndex];
            if (!card) return null;
            return {
              ...card,
              isReversed: Math.random() < 0.3,
              position: currentSpread.positions[index] || { name: `位置 ${index + 1}`, meaning: `牌阵位置 ${index + 1}` }
            };
          }).filter((card: any) => card !== null);
        } else {
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
        
        const cardInterpretations = selectedCards
          .filter((card: any) => card && card.name)
          .map((card: any, index: number) => {
            const position = currentSpread.positions[index] || { name: `位置 ${index + 1}`, meaning: `牌阵位置 ${index + 1}` };
            const meaning = card.isReversed ? card.reversedMeaning : card.meaning;
            const orientation = card.isReversed ? '（逆位）' : '（正位）';
            
            return `**${position.name}${orientation}：${card.name}**\n${position.meaning}\n解读：${meaning}\n关键词：${card.keywords.join('、')}`;
          })
          .join('\n\n');
        
        return `🔮 **${currentSpread.name}牌阵解读**\n\n针对您的${type?.name}问题:"${input}"\n\n${cardInterpretations}\n\n✨ **塔罗师的话**\n\n塔罗牌是连接潜意识与宇宙智慧的桥梁。相信直觉，让内心的声音指引你前进的方向。`;

      case 'astrology':
        // 星座占星逻辑
        console.log('Astrology divination - convertedBirthInfo:', convertedBirthInfo);
        
        if (!convertedBirthInfo || !convertedBirthInfo.date) {
          console.error('Missing birth info for astrology');
          return '请提供正确的出生日期以进行星座分析。';
        }
        
        console.log('Birth date:', convertedBirthInfo.date);
        console.log('Birth time:', convertedBirthInfo.time);
        
        const birthChart = generateBirthChart(convertedBirthInfo.date, convertedBirthInfo.time, convertedBirthInfo.place);
        console.log('Generated birth chart:', birthChart);
        
        if (!birthChart) {
          console.error('Failed to generate birth chart');
          return '无法生成星盘，请检查出生信息。';
        }
        
        const { sunSign, moonSign, ascendant } = birthChart;
        const currentTime = new Date();
        const timeBasedSeed = currentTime.getDate() + currentTime.getMonth() + input.length;
        const dailyHoroscope = generatePersonalizedDailyHoroscope(sunSign, input, timeBasedSeed);
        
        let compatibilityAnalysis = '';
        if (convertedPartnerInfo && convertedPartnerInfo.name && convertedPartnerInfo.birthDate) {
          const partnerSign = getZodiacSign(convertedPartnerInfo.birthDate);
          if (partnerSign) {
            const compatibilityScore = calculateCompatibility(sunSign.id, partnerSign.id);
            compatibilityAnalysis = `\n\n💕 **与${convertedPartnerInfo.name}的星座配对分析**\n\n` +
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
        const userBirthDate = convertedBirthInfo?.date;
        
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
        
        return `🔢 **数字命理完整分析**\n\n` +
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
          `影响特质：${expressionInfo.personality.slice(0, 3).join('、')}\n\n` +
          `💫 **数字和谐度：${compatibility}%**\n` +
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

      case 'lottery':
        // 观音求签逻辑
        const lotteryNum = Math.floor(Math.random() * 100) + 1;
        const lottery = lotteryData[lotteryNum.toString() as keyof typeof lotteryData];
        return `🏺 **观音灵签解读**\n\n` +
          `签类：${lottery.category}\n` +
          `签诗：${lottery.poem}\n\n` +
          `🎯 **针对您的问题**："${input}"\n\n` +
          `📜 **签意解释**：${lottery.meaning}\n\n` +
          `💡 **详细解读**：${lottery.interpretation}\n\n` +
          `🌟 **行动建议**：${lottery.advice}\n\n` +
          `🍀 **开运指引**\n` +
          `• 开运方位：${lottery.luckyElements.direction}\n` +
          `• 开运颜色：${lottery.luckyElements.color}\n` +
          `• 幸运数字：${lottery.luckyElements.number.join('、')}\n` +
          `• 最佳时机：${lottery.luckyElements.time}`;

      case 'jiaobei':
        // 擲筊占卜逻辑
        const results = ['圣杯', '笑杯', '阴杯'];
        const resultNames = {
          '圣杯': '神明同意，吉利',
          '笑杯': '神明发笑，再问一次',
          '阴杯': '神明不同意，需要重新考虑'
        };
        const randomResult = results[Math.floor(Math.random() * results.length)];
        
        return `🥥 **擲筊问卜结果**\n\n` +
          `🎯 **您的问题**："${input}"\n\n` +
          `🔮 **擲筊结果**：${randomResult}\n` +
          `📝 **结果含义**：${resultNames[randomResult as keyof typeof resultNames]}\n\n` +
          `💫 **神明指示**\n` +
          `${randomResult === '圣杯' ? '神明给予您积极的回应，您的想法得到认可，可以按计划进行。' :
            randomResult === '笑杯' ? '神明认为您的问题需要更仔细地考虑，建议重新整理思路后再询问。' :
            '神明提醒您需要重新审视这个问题，可能存在您未考虑到的因素。'}\n\n` +
          `🙏 **建议**：保持虔诚的心，相信神明的指引，按照结果调整您的计划。`;

      case 'bazi':
        // 八字命理逻辑
        if (!birthInfo || !birthInfo.year || !birthInfo.month || !birthInfo.day) {
          return '请提供完整的出生信息以进行八字分析。';
        }
        
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
        
        return `📅 **八字命理详细分析**\n\n` +
          `🎯 **针对您的${type?.name}问题**\n"${input}"\n\n` +
          `👤 **基本信息**\n` +
          `出生日期：${birthInfo.year}年${birthInfo.month}月${birthInfo.day}日\n` +
          `出生时间：${birthInfo.time || '未提供'}\n` +
          `性别：${birthInfo.gender === 'male' ? '男' : '女'}\n\n` +
          `🏛️ **四柱八字**\n` +
          `年柱：${yearPillar}\n` +
          `月柱：${monthPillar}\n` +
          `日柱：${dayPillar}\n` +
          `时柱：${hourPillar}\n\n` +
          `⚖️ **五行分析**\n` +
          `金：${wuxingScores.金}分\n` +
          `木：${wuxingScores.木}分\n` +
          `水：${wuxingScores.水}分\n` +
          `火：${wuxingScores.火}分\n` +
          `土：${wuxingScores.土}分\n\n` +
          `最强五行：${strongestElement}（${wuxingScores[strongestElement]}分）\n` +
          `最弱五行：${weakestElement}（${wuxingScores[weakestElement]}分）\n\n` +
          `🌟 **命格分析**\n` +
          `根据您的八字分析，您的五行以${strongestElement}为主，性格特点倾向于${strongestElement === '金' ? '果断坚定，有领导力' : strongestElement === '木' ? '温和善良，富有创造力' : strongestElement === '水' ? '聪明机智，适应能力强' : strongestElement === '火' ? '热情开朗，行动力强' : '稳重踏实，有耐心'}。\n\n` +
          `需要平衡的五行是${weakestElement}，建议在生活中多接触${weakestElement}属性的事物来调和五行平衡。\n\n` +
          `🎯 **${type?.name}运势**\n` +
          `基于您的八字分析，在${type?.name}方面建议：发挥${strongestElement}的优势特质，同时注意补强${weakestElement}方面的不足。当前运势整体向好，适合积极行动。`;

      case 'ziwei':
        // 紫微斗数逻辑
        if (!birthInfo || !birthInfo.year || !birthInfo.month || !birthInfo.day) {
          return '请提供完整的出生信息以进行紫微斗数分析。';
        }
        
        const ziweiStars = ['紫微', '天机', '太阳', '武曲', '天同', '廉贞', '天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'];
        const palaces = ['命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫', '迁移宫', '奴仆宫', '官禄宫', '田宅宫', '福德宫', '父母宫'];
        
        const mainStar = ziweiStars[Math.floor(Math.random() * ziweiStars.length)];
        const palace = palaces[Math.floor(Math.random() * palaces.length)];
        
        return `🌟 **紫微斗数详细分析**\n\n` +
          `🎯 **针对您的${type?.name}问题**\n"${input}"\n\n` +
          `👤 **基本信息**\n` +
          `出生日期：${birthInfo.year}年${birthInfo.month}月${birthInfo.day}日\n` +
          `出生时间：${birthInfo.time || '未提供'}\n` +
          `性别：${birthInfo.gender === 'male' ? '男' : '女'}\n\n` +
          `⭐ **主星分析**\n` +
          `命宫主星：${mainStar}\n` +
          `主星特质：${mainStar === '紫微' ? '帝王之星，具有领导才能和贵人运' : mainStar === '天机' ? '智慧之星，善于思考和策划' : '各有特色的星曜特质'}\n\n` +
          `🏛️ **十二宫概况**\n` +
          `重点宫位：${palace}\n` +
          `宫位影响：对您的${type?.name}方面有重要影响\n\n` +
          `🔮 **运势预测**\n` +
          `根据紫微斗数显示，您的${palace}有吉星照耀，在${type?.name}方面运势向好。建议把握当前时机，积极行动必有收获。\n\n` +
          `💡 **指导建议**\n` +
          `发挥${mainStar}的优势特质，在${type?.name}领域中展现您的天赋。注意与贵人的合作机会，将为您带来意想不到的帮助。`;

      case 'personality':
        // 性格测试逻辑
        const personalityTypes = [
          { type: 'INTJ', name: '建筑师型', traits: ['独立思考', '战略眼光', '追求完美', '内向理性'] },
          { type: 'ENFP', name: '竞选者型', traits: ['热情洋溢', '富有创意', '善于交际', '乐观积极'] },
          { type: 'ISFJ', name: '守护者型', traits: ['细心体贴', '责任感强', '忠诚可靠', '注重和谐'] },
          { type: 'ESTP', name: '企业家型', traits: ['行动力强', '适应能力佳', '善于沟通', '现实主义'] }
        ];
        
        const randomPersonality = personalityTypes[Math.floor(Math.random() * personalityTypes.length)];
        
        return `🧠 **性格测试分析报告**\n\n` +
          `🎯 **针对您的问题**\n"${input}"\n\n` +
          `🔍 **性格类型**\n` +
          `类型：${randomPersonality.type} - ${randomPersonality.name}\n\n` +
          `✨ **核心特质**\n` +
          `${randomPersonality.traits.map(trait => `• ${trait}`).join('\n')}\n\n` +
          `💼 **职业建议**\n` +
          `适合的工作领域包括创意、分析、管理等方面，建议发挥您的核心优势。\n\n` +
          `💕 **人际关系**\n` +
          `在人际交往中，保持真诚和理解，发挥您的沟通优势。\n\n` +
          `🎯 **成长建议**\n` +
          `继续发展您的天赋特质，同时注意平衡和完善性格的各个方面。`;

      case 'compatibility':
        // 配对打分逻辑
        if (!birthInfo || !partnerInfo) {
          return '请提供双方的完整信息以进行配对分析。';
        }
        
        const compatibilityScore = Math.floor(Math.random() * 40) + 60; // 60-100分
        const aspects = ['性格互补', '价值观匹配', '生活节奏', '沟通方式', '未来规划'];
        
        return `💕 **缘分配对分析报告**\n\n` +
          `🎯 **针对您的问题**\n"${input}"\n\n` +
          `👫 **基本信息**\n` +
          `您的信息：${birthInfo.gender === 'male' ? '男' : '女'}，${birthInfo.year}年${birthInfo.month}月${birthInfo.day}日\n` +
          `对方信息：${partnerInfo.name || '未提供姓名'}\n\n` +
          `💖 **配对指数：${compatibilityScore}分**\n` +
          `${compatibilityScore >= 85 ? '💯 天作之合！你们非常匹配' : compatibilityScore >= 75 ? '💕 相当合适，有很好的发展潜力' : '💝 需要相互理解和包容'}\n\n` +
          `📊 **详细分析**\n` +
          `${aspects.map(aspect => `• ${aspect}：${Math.floor(Math.random() * 40) + 60}分`).join('\n')}\n\n` +
          `💡 **建议**\n` +
          `多沟通、多理解，发挥各自的优势，补足彼此的不足。在相处中保持开放和包容的心态。`;

      case 'lifestory':
        // 命格小故事逻辑
        const storyTemplates = [
          '在一个充满机遇的年代，您的人生故事正在展开...',
          '命运的齿轮开始转动，为您编织独特的人生篇章...',
          '在星辰的指引下，您的命运之书缓缓打开...'
        ];
        
        const randomTemplate = storyTemplates[Math.floor(Math.random() * storyTemplates.length)];
        
        return `📖 **您的专属命格故事**\n\n` +
          `🎯 **针对您的问题**\n"${input}"\n\n` +
          `📚 **故事开篇**\n` +
          `${randomTemplate}\n\n` +
          `🌟 **命运转折**\n` +
          `在您的人生中，将会经历几个重要的转折点，每一次都将为您带来新的机遇和挑战。\n\n` +
          `💎 **天赋才能**\n` +
          `您拥有独特的天赋和才能，善于在关键时刻做出正确的选择。\n\n` +
          `🎊 **未来展望**\n` +
          `未来的道路充满希望，相信自己的直觉，勇敢追求梦想，您的人生故事将会精彩纷呈。`;

      default:
        console.log('Using default divination logic for method:', methodId);
        return `🔮 **${method?.name || '占卜'}结果**\n\n` +
          `🎯 **针对您的${type?.name || '问题'}**\n` +
          `"${input}"\n\n` +
          `🌟 **占卜解读**\n` +
          `根据${method?.name || '占卜方法'}的指引，对于您的${type?.name || '问题'}，我们可以看到以下信息：\n\n` +
          `• 当前运势整体向好，适合积极行动\n` +
          `• 需要保持耐心，等待最佳时机\n` +
          `• 相信自己的直觉，勇敢前进\n\n` +
          `💫 **建议**\n` +
          `在${type?.name || '相关'}方面，建议您保持积极的心态，相信自己的能力。命运掌握在自己手中，勇敢追求梦想！`;
    }
  } catch (error) {
    console.error('生成占卜结果时出错:', error);
    return `🙏 **抱歉，占卜过程中出现了问题**\n\n` +
      `针对您的${type?.name || '问题'}："${input}"\n\n` +
      `虽然占卜系统遇到了一些技术困难，但请相信宇宙的智慧依然在指引着您。\n\n` +
      `✨ **简单的指引**\n` +
      `• 相信自己的直觉和判断\n` +
      `• 保持积极乐观的心态\n` +
      `• 遇到困难时勇敢面对\n` +
      `• 珍惜当下，感恩拥有的一切\n\n` +
      `请稍后重试，或选择其他占卜方式。`;
  }
}