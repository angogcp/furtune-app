import { useState, useCallback } from 'react';
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
import { Sparkles } from 'lucide-react';
import { API_BASE_URL } from './config/api';

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
  const [partnerInfo, setPartnerInfo] = useState<PartnerInfo>({
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
  });
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawingResult, setDrawingResult] = useState<any>(null);
  const { toasts, showSuccess, showError, showInfo, removeToast } = useToast();

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
    if (!userInput.trim()) {
      showError('请输入您的问题');
      return;
    }

    // 针对星座占卜的特殊验证
    if (selectedMethod === 'astrology') {
      if (!birthInfo.year || !birthInfo.month || !birthInfo.day) {
        showError('请输入完整的出生日期');
        return;
      }
      console.log('Birth info validation passed:', birthInfo);
    }

    setIsLoading(true);
    setCurrentStep('result'); // 立即切换到结果页面显示加载状态
    
    try {
      let resultContent = '';
      let aiGeneratedResult = '';
      
      // 对于塔罗占卜，直接使用LLM生成智能解读
      if (selectedMethod === 'tarot') {
        // 首先生成基础的塔罗牌信息
        showInfo('正在生成塔罗牌信息...', '请稍候，正在为您准备牌阵');
        
        const baseResult = generateDivinationResult(
          selectedMethod,
          selectedType,
          userInput,
          specialData,
          birthInfo,
          partnerInfo
        );
        
        // 然后调用LLM生成专业的塔罗解读
        showInfo('AI占卜师正在解读...', '神秘的力量正在为您揭示答案');
        
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
                  content: '你是一位专业的塔罗占卜师，拥有丰富的塔罗牌解读经验。请基于用户抽取的塔罗牌，结合牌阵含义和用户问题，提供深入、专业、有洞察力的占卜解读。解读应该包含：1)对每张牌在当前位置的具体含义解释；2)牌与牌之间的关联性分析；3)针对用户问题的具体建议和指导；4)未来发展趋势的预测。语气要专业而温暖，富有智慧。'
                },
                {
                  role: 'user',
                  content: `请为以下塔罗占卜提供专业解读：\n\n用户问题："${userInput}"\n\n${baseResult}\n\n请提供深入的专业解读，包括每张牌的具体含义、牌之间的关联、针对用户问题的建议，以及未来发展趋势。`
                }
              ],
              temperature: 0.8,
              max_tokens: 1200
            })
          });

          if (response.ok) {
            const data = await response.json();
            aiGeneratedResult = data.choices[0]?.message?.content || '';
          }
        } catch (error) {
          console.error('LLM解读生成失败:', error);
          showError('AI解读生成失败', '将使用基础解读');
        }
        
        // 如果LLM解读成功，使用AI结果；否则使用基础结果
        resultContent = aiGeneratedResult || baseResult;
      } else {
        // 其他占卜方法使用原来的模板化结果
        console.log('Generating divination result for:', {
          method: selectedMethod,
          type: selectedType,
          input: userInput,
          birthInfo,
          partnerInfo
        });
        
        resultContent = generateDivinationResult(
          selectedMethod,
          selectedType,
          userInput,
          specialData,
          birthInfo,
          partnerInfo
        );
        
        console.log('Generated result content:', resultContent);
      }

      if (!resultContent || resultContent.trim().length === 0) {
        throw new Error('占卜结果生成失败，请检查输入信息');
      }

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

      setResult(newResult);
      showSuccess('占卜完成', selectedMethod === 'tarot' ? 'AI占卜师已为您完成专业解读！' : '您的占卜结果已生成');
    } catch (error) {
      console.error('占卜过程中出错:', error);
      showError('占卜失败', '请重试或选择其他占卜方式');
      setCurrentStep('input'); // 如果出错，返回输入页面
    } finally {
      setIsLoading(false);
    }
  }, [userInput, selectedMethod, selectedType, specialData, birthInfo, partnerInfo, showError, showSuccess, showInfo]);

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
              content: '你是一位经验丰富的占卜师，擅长用通俗易懂的语言解释占卜结果。请用中文回复，语气亲切、温暖、鼓励。'
            },
            {
              role: 'user',
              content: `请用通俗易懂的语言重新解释下面的占卜结果，让普通人也能理解：\n\n${result.content}`
            }
          ],
          temperature: 0.8,
          max_tokens: 800
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
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent mb-4">
              神秘占卜屋
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              探索命运的奥秘，聆听宇宙的声音
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
                  onNextStep={() => setCurrentStep('result')}
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
