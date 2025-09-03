import { useState, useCallback, useEffect } from 'react';
import type { BirthInfo, PartnerInfo } from './types';
import { divinationMethods } from './components/DivinationMethodSelector/DivinationMethodSelector';
import DivinationMethodSelector from './components/DivinationMethodSelector';
import DivinationTypeSelector from './components/DivinationTypeSelector';
import DivinationInput from './components/DivinationInput/DivinationInput';
import SimpleDivinationResult from './components/DivinationResult/SimpleDivinationResult';
import { ErrorBoundary } from './components/ErrorBoundary';
import { generateDivinationResult } from './components/DivinationEngine/DivinationEngine';
import { allTarotCards } from './data/tarotCards';
import { 
  InteractiveBackground, 
  ToastContainer, 
  useToast, 
  ParticleEffect,
  Loading
} from './components/ui';
import { Copy, RotateCcw } from 'lucide-react';
import { API_BASE_URL } from './config/api';
import { useAuth } from './contexts/AuthContext';

type DivinationStep = 'method' | 'type' | 'input' | 'result';

interface DivinationResult {
  content: string;
  method: string;
  type: string;
  timestamp: Date;
  cards?: Array<{
    name: string;
    meaning: string;
    reversed?: boolean;
  }>;
}

function App(): React.JSX.Element {
  const [currentStep, setCurrentStep] = useState<DivinationStep>('method');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<DivinationResult | null>(null);
  const [plainLanguageResult, setPlainLanguageResult] = useState<string>('');
  const [isGeneratingInterpretation, setIsGeneratingInterpretation] = useState<boolean>(false);
  const [specialData, setSpecialData] = useState<Record<string, any>>({});
  const [jiaobeiBlessConfirmed, setJiaobeiBlessConfirmed] = useState<boolean>(false);
  
  // Enhanced LLM prompt system for professional divination results
  const getSystemPromptForMethod = (methodId: string, typeId: string): string => {
    const methodPrompts: Record<string, string> = {
      tarot: `你是一位资深的塔罗大师，拥有20年以上的专业解读经验。你精通韦特塔罗、马赛塔罗等各种体系，深刻理解78张牌的象征意义、数字学原理、元素对应和神话内涵。你能够准确解读牌阵中各张牌的位置关系、能量流动和深层信息。请提供专业、深入、具有洞察力的塔罗解读，包含具体的行动指导和时间节点建议。`,
      astrology: `你是一位国际认证的占星大师，精通西方占星学、吠陀占星和中国占星体系。你深度掌握行星运行规律、星座特质、宫位含义、相位分析和流年推运。你能够根据出生星盘准确分析人格特质、人生走向、流年运势和重要时机。请提供专业的占星分析，包含具体的星象影响、时间周期和实用建议。`,
      numerology: `你是一位数字命理学权威专家，精通毕达哥拉斯数字体系、卡巴拉数字学和中国数字玄学。你深刻理解生命数字、表达数字、心灵数字、成熟数字等各种数字计算方法及其深层含义。你能够通过数字分析揭示人的天赋、使命、挑战和人生周期。请提供准确的数字命理分析，包含具体的数字能量解读和人生指导。`,
      bazi: `你是一位传统八字命理大师，师承正宗子平术，精通四柱排盘、五行生克、十神分析、格局判断和大运流年推算。你深谙《滴天髓》、《三命通会》等经典命理著作，能够准确分析命主的五行喜忌、格局高低、六亲关系和人生起伏。请提供专业的八字命理分析，包含格局解析、喜用神分析和具体的人生建议。`,
      lottery: `你是一位德高望重的灵签解读大师，深谙观音灵签、吕祖签、关帝签等各种签文的深层内涵。你精通古典诗词、易经哲学和佛道思想，能够透过签文的表面含义洞察天机，为求签者指点迷津。请提供富有智慧的签文解读，包含诗意解析、现实指导和心灵启发。`,
      jiaobei: `你是一位虔诚的神明代言人，深谙掷杯占卜的神圣仪式和神明旨意的传达方式。你理解圣杯、笑杯、阴杯三种结果的深层含义，能够准确传达神明的指引和建议。请以庄重而慈悲的语调传达神明的旨意，包含具体的行动指导和精神启发。`,
      ziwei: `你是一位紫微斗数宗师，精通紫微星系、天府星系和各种星曜的性质与作用。你深刻理解命宫、身宫、十二宫位的含义，能够准确分析星曜配置、四化飞星和大限流年的影响。请提供专业的紫微斗数分析，包含星曜解析、宫位互动和人生预测。`,
      personality: `你是一位心理学专家和性格分析师，精通MBTI、九型人格、大五人格等多种性格理论。你能够通过深入的心理分析揭示个体的性格特质、行为模式、潜在动机和发展方向。请提供专业的性格分析，包含性格类型判断、优势劣势分析和个人成长建议。`,
      compatibility: `你是一位资深的关系咨询师和配对分析专家，精通心理学、占星学、数字学等多种配对理论。你能够从多个维度分析两人的匹配度，包含性格互补、价值观契合、生活方式协调等方面。请提供专业的配对分析，包含匹配度评估、关系建议和相处指导。`,
      lifestory: `你是一位富有创意的命运故事编撰师，精通命理学、心理学和文学创作。你能够基于个人的出生信息和性格特质，编织出富有哲理和启发性的人生故事。请创作一个深具意义的命运故事，包含人生主题、关键转折和成长启示。`
    };
    
    return methodPrompts[methodId] || '你是一位经验丰富的占卜大师，擅长各种占卜方式。请为用户提供专业而深刻的指导。';
  };
  
  const getMethodName = (methodId: string): string => {
    const methodNames: Record<string, string> = {
      tarot: '塔罗牌占卜',
      astrology: '占星学分析',
      numerology: '数字命理学',
      bazi: '传统八字命理',
      lottery: '观音灵签',
      jiaobei: '问卜掷杯',
      ziwei: '紫微斗数',
      personality: '性格心理分析',
      compatibility: '缘分配对分析',
      lifestory: '命运故事创作'
    };
    
    return methodNames[methodId] || '占卜分析';
  };

  const getTypeDescription = (typeId: string): string => {
    const typeDescriptions: Record<string, string> = {
      love: '感情运势与爱情问题',
      career: '事业发展与职场运势',
      wealth: '财富运程与投资理财',
      health: '身心健康与养生保健',
      general: '综合运势与人生指导'
    };
    
    return typeDescriptions[typeId] || '人生综合分析';
  };

  const createEnhancedUserPrompt = (
    methodId: string,
    typeId: string,
    userInput: string,
    baseResult: string,
    birthInfo: BirthInfo,
    partnerInfo: PartnerInfo,
    specialData: Record<string, any>
  ): string => {
    const methodName = getMethodName(methodId);
    const typeDesc = getTypeDescription(typeId);
    
    // Build contextual information based on method
    let contextInfo = '';
    
    if (methodId === 'astrology' && birthInfo) {
      contextInfo = `\n\n✨ **用户星盘信息**：\n` +
        `- 出生日期：${birthInfo.year}年${birthInfo.month}月${birthInfo.day}日\n` +
        `- 出生时间：${birthInfo.time}\n` +
        `- 出生地点：${birthInfo.place || '未提供'}\n` +
        `- 性别：${birthInfo.gender === 'male' ? '男' : '女'}`;
    }
    
    if (methodId === 'numerology' && partnerInfo.name) {
      contextInfo = `\n\n🔢 **数字命理信息**：\n` +
        `- 姓名：${partnerInfo.name}\n` +
        `- 出生日期：${birthInfo.year}年${birthInfo.month}月${birthInfo.day}日`;
    }
    
    if (methodId === 'tarot' && specialData.selectedCards) {
      contextInfo = `\n\n🃏 **塔罗牌阵信息**：\n` +
        `- 抽取牌数：${specialData.selectedCards.length}张\n` +
        `- 牌阵类型：${typeDesc}占卜`;
    }
    
    if (methodId === 'compatibility' && partnerInfo.name) {
      contextInfo = `\n\n💕 **配对分析信息**：\n` +
        `- 用户：${birthInfo.gender === 'male' ? '男' : '女'}，${birthInfo.year}年${birthInfo.month}月${birthInfo.day}日生\n` +
        `- 对方：${partnerInfo.name}`;
    }
    
    const prompt = `作为专业的${methodName}大师，请为用户提供一份深入专业的${typeDesc}分析报告。

🎯 **用户问题**：“${userInput}”

🔮 **占卜结果基础**：
${baseResult}${contextInfo}

🎆 **请按以下专业结构提供详细分析**：

**第一部分 - 核心解读与深层含义**：
请深入解读${methodName}的核心含义，包括象征意义、能量流动和精神层面的指导。请解释为什么这个结果对用户的${typeDesc}问题具有特别意义。

**第二部分 - 当前状况评估与具体分析**：
基于占卜结果，分析用户在${typeDesc}方面的当前状况、面临的机遇与挑战。请提供具体而深入的分析，包含内在动机、外在影响因素和关键转折点。

**第三部分 - 专业指导与实用建议**：
提供具体可行的行动指导，包括：
- 立即可以采取的具体步骤
- 需要避免的行为或情况
- 最佳时机和时间节点选择
- 提升成功率的关键策略

**第四部分 - 未来趋势与长期展望**：
基于${methodName}的预测能力，描绘用户在${typeDesc}方面的未来发展趋势。包括可能的机遇、挑战和转折点，以及如何为长期成功做准备。

⚠️ **绝对要求**：
- **内容充实**：每个部分必须包含具体、详细的分析内容，禁止空洞的标题
- **实质性内容**：确保每段都有至少3-5句具体的分析和建议，不要只给标题
- **禁止空段落**：不允许出现只有标题没有内容的情况
- **具体化**：所有建议必须具体可操作，避免模糊或空洞的表达
- **个性化**：针对用户的具体问题和情况提供定制化分析
- **语言风格**：专业而温暖，具有深度和洞察力，使用自然段落结构
- **禁止使用**：emoji标题、重复的分段标记、空洞的标题句

**示例格式要求**：
每个部分都应该以如下方式开始：
"第一部分 - 核心解读与深层含义

根据您的占卜结果，[...]这个结果表明[...]象征着[...]。具体来说，[...]。从能量层面来看，[...]。这对您的${typeDesc}问题意味着[...]。"

请确保每个部分都有完整、详细的内容，绝不允许出现空段落或只有标题的情况。`;

    return prompt;
  };

  // Get personal info from user profile
  const { userProfile } = useAuth();
  
  // Advanced content quality validation function
  const validateContentQuality = (content: string) => {
    const issues: string[] = [];
    let score = 1.0;
    
    // Split into paragraphs for analysis
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    // Check for empty or title-only sections
    let substantialParagraphs = 0;
    let titleOnlyCount = 0;
    
    paragraphs.forEach(paragraph => {
      const trimmed = paragraph.trim();
      const cleanText = trimmed.replace(/[🌟⭐✨🔮📅💫⚡💖💡💼💰🏥⏰🔄📖\*\#]/g, '').trim();
      
      // Check if paragraph has substantial content (more than just a title)
      if (cleanText.length < 30) {
        titleOnlyCount++;
        issues.push(`发现标题段落: "${trimmed.substring(0, 50)}..."`);
      } else if (cleanText.length > 100) {
        substantialParagraphs++;
      }
      
      // Check for common empty section patterns
      const emptyPatterns = [
        /^[🌟⭐✨🔮📅💫⚡💖💡💼💰🏥⏰🔄📖]{1,3}\s*[\u4e00-\u9fa5]{2,15}[：:]?\s*$/,
        /^\*\*[\u4e00-\u9fa5\s]{2,20}\*\*\s*$/,
        /^#{1,6}\s*[\u4e00-\u9fa5\s]{2,20}\s*$/,
        /^第[一二三四五]部分[\s\-–—]*[\u4e00-\u9fa5\s]{2,30}\s*$/
      ];
      
      if (emptyPatterns.some(pattern => pattern.test(trimmed))) {
        titleOnlyCount++;
        issues.push(`发现空标题模式: "${trimmed}"`);
      }
    });
    
    // Calculate quality score
    const totalParagraphs = paragraphs.length;
    if (totalParagraphs === 0) {
      score = 0;
      issues.push('内容为空');
    } else {
      const substantialRatio = substantialParagraphs / totalParagraphs;
      const titleRatio = titleOnlyCount / totalParagraphs;
      
      score = substantialRatio - (titleRatio * 0.8);
      
      if (substantialParagraphs < 2) {
        issues.push(`实质性内容段落过少: ${substantialParagraphs}`);
        score *= 0.5;
      }
      
      if (titleOnlyCount > totalParagraphs * 0.4) {
        issues.push(`标题段落过多: ${titleOnlyCount}/${totalParagraphs}`);
        score *= 0.6;
      }
    }
    
    return {
      score: Math.max(0, Math.min(1, score)),
      details: {
        totalParagraphs,
        substantialParagraphs,
        titleOnlyCount,
        avgParagraphLength: paragraphs.reduce((sum, p) => sum + p.trim().length, 0) / paragraphs.length || 0
      },
      issues
    };
  };
  
  const [birthInfo, setBirthInfo] = useState<BirthInfo>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    hour: 12,
    minute: 0,
    time: '12:00',
    place: '',
    gender: 'male'
  });
  const [partnerInfo, setPartnerInfo] = useState<PartnerInfo>(() => {
    // Initialize with user profile name if available
    const initialName = userProfile?.full_name || '';
    return {
      name: initialName,
      birthInfo: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
        hour: 12,
        minute: 0,
        time: '12:00',
        place: '',
        gender: 'male'
      }
    };
  });
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawingResult, setDrawingResult] = useState<any>(null);
  const { toasts, showSuccess, showError, showInfo, removeToast } = useToast();
  
  // Update birth info when user profile changes
  useEffect(() => {
    if (userProfile?.date_of_birth) {
      // Parse date from profile
      const birthDate = new Date(userProfile.date_of_birth);
      const timeString = userProfile.time_of_birth || '12:00';
      
      const newBirthInfo: BirthInfo = {
        year: birthDate.getFullYear(),
        month: birthDate.getMonth() + 1,
        day: birthDate.getDate(),
        hour: parseInt(timeString.split(':')[0]) || 12,
        minute: parseInt(timeString.split(':')[1]) || 0,
        time: timeString,
        place: userProfile.place_of_birth || '',
        gender: (userProfile.gender as 'male' | 'female') || 'male'
      };
      setBirthInfo(newBirthInfo);
    } else {
      // Default values when no profile data
      const defaultBirthInfo: BirthInfo = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
        hour: 12,
        minute: 0,
        time: '12:00',
        place: '',
        gender: 'male' as const
      };
      setBirthInfo(defaultBirthInfo);
    }
    
    // Auto-populate partner name from user profile
    if (userProfile?.full_name && partnerInfo.name !== userProfile.full_name) {
      setPartnerInfo(prev => ({
        ...prev,
        name: userProfile.full_name || ''
      }));
    }
  }, [
    userProfile?.date_of_birth,
    userProfile?.time_of_birth,
    userProfile?.place_of_birth,
    userProfile?.gender,
    userProfile?.full_name
  ]);

  // 处理函数
  const handleMethodSelect = useCallback((methodId: string) => {
    setSelectedMethod(methodId);
    setCurrentStep('type');
    showInfo('占卜方法已选择', `您选择了占卜方法，请继续选择占卜类型`);
    setPlainLanguageResult('');
  }, [showInfo]);

  const handleTypeSelect = useCallback((typeId: string) => {
    setSelectedType(typeId);
    setCurrentStep('input');
    if (selectedMethod === 'tarot') {
      setSpecialData({ selectedCards: [], cardCount: undefined });
    } else {
      setSpecialData({});
    }
    setPlainLanguageResult('');
    showInfo('占卜类型已选择', `请输入您的问题`);
  }, [showInfo, selectedMethod]);

  const handleDivinationSubmit = useCallback(async () => {
    console.log('=== DIVINATION SUBMIT DEBUG ===');
    console.log('User Input:', userInput);
    console.log('Selected Method:', selectedMethod);
    console.log('Selected Type:', selectedType);
    console.log('Birth Info:', birthInfo);
    console.log('Special Data:', specialData);
    console.log('Partner Info:', partnerInfo);
    
    if (!userInput.trim()) {
      console.error('ERROR: Empty user input');
      showError('请输入您的问题');
      return;
    }

    // 针对星座占卜的特殊验证
    if (selectedMethod === 'astrology') {
      if (!birthInfo.year || !birthInfo.month || !birthInfo.day) {
        console.error('ERROR: Incomplete birth info for astrology');
        showError('请输入完整的出生日期');
        return;
      }
      console.log('Birth info validation passed:', birthInfo);
    }

    setIsLoading(true);
    setCurrentStep('result'); // 立即切换到结果页面显示加载状态
    
    try {
      let resultContent = '';
      
      console.log('=== STARTING DIVINATION PROCESS ===');
      // All divination methods now use LLM API for consistent results and easier debugging
      showInfo('AI占卜师正在解读...', '神秘的力量正在为您揭示答案');
      
      console.log('=== GENERATING BASE RESULT ===');
      // Add safety check for DivinationEngine imports
      console.log('Testing DivinationEngine imports...');
      
      // First generate base result using local engine for context
      let baseResult;
      try {
        console.log('Testing DivinationEngine before call...');
        console.log('selectedMethod:', selectedMethod);
        console.log('selectedType:', selectedType);
        console.log('userInput length:', userInput?.length);
        
        // Validate inputs before calling engine
        if (!selectedMethod || selectedMethod.trim() === '') {
          throw new Error('Selected method is empty');
        }
        if (!selectedType || selectedType.trim() === '') {
          throw new Error('Selected type is empty');
        }
        if (!userInput || userInput.trim() === '') {
          throw new Error('User input is empty');
        }
        
        baseResult = generateDivinationResult(
          selectedMethod,
          selectedType,
          userInput,
          specialData,
          birthInfo,
          partnerInfo
        );
        
        console.log('DivinationEngine call successful');
        console.log('Base result type:', typeof baseResult);
        console.log('Base result length:', baseResult?.length);
      } catch (engineError) {
        console.error('DivinationEngine failed:', engineError);
        // Create a basic fallback result
        baseResult = `🔮 **占卜结果**\n\n🎯 **针对您的问题**\n"${userInput}"\n\n🌟 **解读**\n根据您选择的占卜方式，我们为您提供以下指引：\n\n• 当前运势整体向好，适合积极行动\n• 保持积极的心态，相信自己的能力\n• 遇到困难时要有耐心，等待最佳时机\n\n💫 **建议**\n相信自己的直觉，勇敢追求目标。命运掌握在自己手中！\n\n🙏 **温馨提示**\n占卜结果仅供参考，最重要的是相信自己的判断和努力。`;
      }
      
      console.log('Base result generated:', baseResult ? 'SUCCESS' : 'FAILED');
      console.log('Base result length:', baseResult?.length || 0);
      
      // Ensure base result is valid
      if (!baseResult || baseResult.trim().length === 0) {
        console.error('ERROR: Base result is empty or invalid');
        throw new Error('本地占卜引擎无法生成结果');
      }
      
      // Use base result as primary result (local divination is reliable)
      resultContent = baseResult;
      console.log('Using base result as primary content');

      // Try to enhance with LLM interpretation (preferred enhancement)
      console.log('=== ATTEMPTING LLM ENHANCEMENT ===');
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
        
        const response = await fetch(`${API_BASE_URL}/api/llm/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messages: [
              {
                role: 'system',
                content: getSystemPromptForMethod(selectedMethod, selectedType)
              },
              {
                role: 'user',
                content: createEnhancedUserPrompt(
                  selectedMethod,
                  selectedType,
                  userInput,
                  baseResult,
                  birthInfo,
                  partnerInfo,
                  specialData
                )
              }
            ],
            temperature: 0.7,
            max_tokens: 2500
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          const enhancedResult = data.choices[0]?.message?.content;
          console.log('=== LLM RESPONSE ANALYSIS ===');
          console.log('Raw LLM response length:', enhancedResult?.length || 0);
          console.log('Raw LLM response preview:', enhancedResult?.substring(0, 200) + '...');
          
          // Advanced content quality validation
          if (enhancedResult && enhancedResult.trim().length > 0) {
            const contentQuality = validateContentQuality(enhancedResult);
            console.log('Content quality score:', contentQuality.score);
            console.log('Content validation details:', contentQuality.details);
            
            if (contentQuality.score >= 0.6) {
              resultContent = enhancedResult;
              console.log('Enhanced with LLM result (quality passed)');
              showInfo('AI增强成功', '已获得AI专业解读');
            } else {
              console.log('LLM result quality too low, using base result');
              console.log('Quality issues:', contentQuality.issues);
              showInfo('使用本地结果', 'AI内容质量不佳，使用本地占卜结果');
            }
          }
        } else {
          console.log('LLM API response not ok:', response.status, response.statusText);
          console.log('Using local result as fallback');
        }
      } catch (error) {
        console.log('LLM enhancement failed, using local result:', error instanceof Error ? error.message : String(error));
        showInfo('使用本地结果', 'API不可用，使用本地占卜结果');
      }

      // Ensure we always have valid content
      console.log('=== FINAL VALIDATION ===');
      console.log('Final result content length:', resultContent?.length || 0);
      if (!resultContent || resultContent.trim().length === 0) {
        console.warn('Empty result content, using base result as fallback');
        resultContent = baseResult;
      }
      
      console.log('=== CREATING DIVINATION RESULT ===');
      const newResult: DivinationResult = {
        content: resultContent,
        method: selectedMethod,
        type: selectedType,
        timestamp: new Date(),
        // 保存塔罗牌信息用于显示
        cards: selectedMethod === 'tarot' && specialData?.selectedCards ? 
          (specialData.selectedCards as number[]).map((cardIndex: number, index: number) => {
            const card = allTarotCards[cardIndex];
            const isReversed = Math.random() < 0.3;
            return {
              name: card.name,
              meaning: isReversed ? card.reversedMeaning : card.meaning,
              reversed: isReversed
            };
          }) : undefined
      };

      console.log('Divination result created successfully:', newResult);
      setResult(newResult);
      showSuccess('占卜完成', selectedMethod === 'tarot' ? 'AI占卜师已为您完成专业解读！' : '您的占卜结果已生成');
    } catch (error) {
      console.error('=== DIVINATION PROCESS FAILED ===');
      console.error('占卜过程中出错:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack available');
      console.error('Current state:', {
        selectedMethod,
        selectedType,
        userInput: userInput?.substring(0, 50) + '...',
        hasSpecialData: !!specialData,
        hasBirthInfo: !!birthInfo
      });
      showError('占卜失败', '请重试或选择其他占卜方式');
      setCurrentStep('input'); // 如果出错，返回输入页面
    } finally {
      setIsLoading(false);
    }
  }, [userInput, selectedMethod, selectedType, specialData, birthInfo, partnerInfo, showError, showSuccess, showInfo, getMethodName, getSystemPromptForMethod, createEnhancedUserPrompt]);

  const generatePlainLanguageInterpretation = useCallback(async () => {
    if (!result) return;
    
    setIsGeneratingInterpretation(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/llm/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: '你是一位经验丰富的占卜师，擅长用通俗易懂、详细全面的语言解释占卜结果。请用中文回复，语气亲切、温暖、鼓励。非常重要：请用连续流畅的段落文字，不要使用任何emoji标题、小标题或重复的分段标记。'
            },
            {
              role: 'user',
              content: `请用最通俗易懂的表达方式，把下面的占卜结果重新说一遍，让普通人都能很容易理解。请分成3-4个自然段落来阐述，每个段落说一个主要方面，但不要加标题、emoji符号或分点标记，直接用白话讲出来就好。请包含：第一段说这个结果的意思，第二段说对你现在的影响，第三段给具体的建议，最后一段给积极的鼓励。\n\n${result.content}`
            }
          ],
          temperature: 0.8,
          max_tokens: 1200
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const interpretation = data.choices[0]?.message?.content || '无法生成解读，请重试。';
      setPlainLanguageResult(interpretation);
      showSuccess('解读生成成功', '已生成通俗易懂的解读');
    } catch (error) {
      console.error('生成解读时出错:', error);
      showError('生成失败', '无法生成通俗解读，请检查网络连接');
    } finally {
      setIsGeneratingInterpretation(false);
    }
  }, [result, showSuccess, showError]);

  const handleCopyResult = useCallback(async (): Promise<void> => {
    if (!result) return;
    
    try {
      const resultText = `🔮 占卜结果\n\n问题："${userInput}"\n\n${result.content}${plainLanguageResult ? `\n\n🎯 大白话解读\n${plainLanguageResult}` : ''}\n\n占卜时间：${result.timestamp.toLocaleString('zh-CN')}`;
      
      await navigator.clipboard.writeText(resultText);
      showSuccess('复制成功', '占卜结果已复制到剪贴板');
    } catch (error) {
      console.error('复制失败:', error);
      showError('复制失败', '无法复制到剪贴板');
    }
  }, [result, userInput, plainLanguageResult, showSuccess, showError]);

  const handleReset = useCallback((): void => {
    setCurrentStep('method');
    setSelectedMethod('');
    setSelectedType('');
    setUserInput('');
    setResult(null);
    setPlainLanguageResult('');
    setSpecialData({});
    setJiaobeiBlessConfirmed(false);
    setBirthInfo(() => ({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
      hour: 12,
      minute: 0,
      time: '12:00',
      place: '',
      gender: 'male'
    }));
    setPartnerInfo(() => ({
      name: '',
      birthInfo: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
        hour: 12,
        minute: 0,
        time: '12:00',
        place: '',
        gender: 'male'
      }
    }));
    setIsDrawing(false);
    setDrawingResult(null);
    showInfo('重新开始', '已重置所有设置，可以开始新的占卜');
  }, [showInfo]);

  const handleStartDrawing = useCallback((): void => {
    setIsDrawing(true);
    // 模拟抽签过程
    setTimeout(() => {
      setDrawingResult({
        type: 'jiaobei',
        name: '圣杯',
        meaning: '神明给予您积极的回应',
        color: 'green',
        emoji: '🏆'
      });
      setIsDrawing(false);
      showSuccess('抽签成功', '神明已给出回应');
    }, 2000);
  }, [showSuccess]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <InteractiveBackground className="fixed inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/40 to-slate-900"></div>
        </InteractiveBackground>
        
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6 shadow-2xl">
              <img src="/logo.png" alt="算算乐 Logo" className="w-12 h-12 object-contain" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent mb-4">
              算算乐
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              算出惊喜，乐见未来。
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {currentStep === 'method' && (
              <div className="max-w-4xl mx-auto">
                <DivinationMethodSelector
                  selectedMethod={selectedMethod}
                  onMethodSelect={handleMethodSelect}
                />
              </div>
            )}

            {currentStep === 'type' && (
              <div className="max-w-4xl mx-auto">
                <DivinationTypeSelector
                  selectedType={selectedType}
                  onTypeSelect={handleTypeSelect}
                  selectedMethod={selectedMethod}
                  onBack={() => setCurrentStep('method')}
                />
              </div>
            )}

            {currentStep === 'input' && (
              <div className="max-w-4xl mx-auto">
                <DivinationInput
                  selectedMethod={selectedMethod as any}
                  userInput={userInput}
                  setUserInput={setUserInput}
                  birthInfo={birthInfo}
                  setBirthInfo={setBirthInfo}
                  partnerInfo={partnerInfo}
                  setPartnerInfo={setPartnerInfo}
                  specialData={specialData}
                  setSpecialData={setSpecialData}
                  isDrawing={isDrawing}
                  drawingResult={drawingResult}
                  jiaobeiBlessConfirmed={jiaobeiBlessConfirmed}
                  setJiaobeiBlessConfirmed={setJiaobeiBlessConfirmed}
                  onBack={() => setCurrentStep('type')}
                  onSubmit={handleDivinationSubmit}
                  onStartDrawing={handleStartDrawing}
                  onNextStep={handleDivinationSubmit}
                />
              </div>
            )}

            {currentStep === 'result' && (
              <div className="max-w-4xl mx-auto space-y-8 relative">
                <ParticleEffect 
                  particleCount={30}
                  theme="mystical"
                  speed={0.5}
                  interactive
                  className="absolute inset-0 pointer-events-none"
                />
                
                {isLoading ? (
                  <div className="text-center py-16">
                    {/* 动态加载动画 */}
                    <div className="relative mb-8">
                      <div className="w-32 h-32 mx-auto relative">
                        {/* 旋转的外圈 */}
                        <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full animate-spin" style={{animationDuration: '3s'}}></div>
                        <div className="absolute inset-2 border-4 border-pink-500/30 rounded-full animate-spin" style={{animationDuration: '2s', animationDirection: 'reverse'}}></div>
                        <div className="absolute inset-4 border-4 border-indigo-500/30 rounded-full animate-spin" style={{animationDuration: '4s'}}></div>
                        
                        {/* 中心图标 */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-6xl animate-pulse">
                            {selectedMethod === 'tarot' ? '🔮' : '✨'}
                          </div>
                        </div>
                        
                        {/* 环绕的星星 */}
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-2xl animate-bounce" style={{animationDelay: '0s'}}>✨</div>
                        <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 text-xl animate-bounce" style={{animationDelay: '0.5s'}}>🌟</div>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-2xl animate-bounce" style={{animationDelay: '1s'}}>💫</div>
                        <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 text-xl animate-bounce" style={{animationDelay: '1.5s'}}>⭐</div>
                      </div>
                    </div>
                    
                    {selectedMethod === 'tarot' ? (
                      <div className="space-y-4">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-4">
                          AI塔罗占卜师正在为您解读...
                        </h2>
                        <div className="max-w-md mx-auto space-y-3">
                          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-4 border border-purple-500/30">
                            <p className="text-purple-200 text-lg font-medium">🎴 正在解读您选择的塔罗牌...</p>
                          </div>
                          <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-xl p-4 border border-indigo-500/30">
                            <p className="text-indigo-200 text-lg font-medium">🧙‍♀️ 分析牌与牌之间的关联...</p>
                          </div>
                          <div className="bg-gradient-to-r from-pink-900/50 to-purple-900/50 rounded-xl p-4 border border-pink-500/30">
                            <p className="text-pink-200 text-lg font-medium">🕮️ 生成个性化的智慧指引...</p>
                          </div>
                        </div>
                        <p className="text-slate-400 mt-6">请耐心等待，AI正在为您深度解读塔罗牌的神秘含义</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white mb-4">正在为您占卜...</h2>
                        <p className="text-slate-300">请稍候，神秘的力量正在为您揭示答案</p>
                      </div>
                    )}
                  </div>
                ) : result ? (
                  <SimpleDivinationResult
                    result={result}
                    userInput={userInput}
                    selectedMethod={selectedMethod}
                    plainLanguageResult={plainLanguageResult}
                    isGeneratingInterpretation={isGeneratingInterpretation}
                    onGeneratePlainLanguage={generatePlainLanguageInterpretation}
                    onReset={handleReset}
                    onCopyResult={handleCopyResult}
                  />
                ) : (
                  <div className="text-center py-16">
                    <div className="bg-red-900/30 border border-red-600/30 rounded-xl p-8 max-w-md mx-auto">
                      <div className="text-6xl mb-4">😔</div>
                      <h3 className="text-xl font-semibold text-white mb-4">占卜失败</h3>
                      <p className="text-red-300 mb-6">抱歉，占卜过程中出现了问题。请检查您的输入信息并重试。</p>
                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            setCurrentStep('input');
                            setIsLoading(false);
                          }}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                        >
                          🔄 重新输入
                        </button>
                        <button
                          onClick={handleReset}
                          className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                        >
                          🎆 重新开始
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
