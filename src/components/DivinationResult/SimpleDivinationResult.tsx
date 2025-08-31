import React, { memo } from 'react';
import { 
  AnimatedCard, 
  AnimatedButton, 
  AnimatedText, 
  Card, 
  CardContent 
} from '../ui';
import { 
  Sparkles, 
  MessageCircle, 
  Star, 
  ArrowRight, 
  Copy, 
  Printer 
} from 'lucide-react';
import { FormattedTarotResult } from './FormattedTarotResult';
import { FormattedPlainLanguageResult } from './FormattedPlainLanguageResult';
import { FormattedDivinationResult } from './FormattedDivinationResult';

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

interface SimpleDivinationResultProps {
  result: DivinationResult;
  userInput: string;
  selectedMethod: string;
  plainLanguageResult: string;
  isGeneratingInterpretation: boolean;
  onGeneratePlainLanguage: () => void;
  onReset: () => void;
  onCopyResult: () => void;
}

const SimpleDivinationResult = memo<SimpleDivinationResultProps>(({
  result,
  userInput,
  selectedMethod,
  plainLanguageResult,
  isGeneratingInterpretation,
  onGeneratePlainLanguage,
  onReset,
  onCopyResult
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleProfessionalPrint = () => {
    // 将结果数据存储到 sessionStorage
    const printData = {
      userInput,
      result,
      plainLanguageResult
    };
    sessionStorage.setItem('printData', JSON.stringify(printData));
    
    // 在新窗口中打开打印页面
    const printWindow = window.open('/print', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.focus();
    }
  };

  return (
    <div className="space-y-8 print:space-y-1">
      {/* 结果标题 */}
      <div className="bg-gradient-to-br from-purple-900/40 via-slate-800/60 to-indigo-900/40 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 shadow-2xl overflow-hidden print:bg-white print:border-gray-300 print:shadow-none print:p-2 print:rounded-none print-result-section">
        <div className="text-center mb-8 print:mb-2">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg print:hidden">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-2 print:text-black print:bg-none print-main-title print:text-lg print:mb-1">
            🔮 占卜结果
          </h3>
          <p className="text-purple-200/80 print:text-gray-600 print:text-sm print:hidden">宇宙的智慧为您揭示真相</p>
        </div>
        
        {/* 用户问题 */}
        <AnimatedCard
          animationType="slide"
          delay={700}
          className="bg-slate-800/50 border-slate-600/30 mb-8 print:bg-gray-50 print:border-gray-300 print:mb-2 avoid-break print-question"
        >
          <CardContent className="p-6 print:p-2">
            <h4 className="text-lg font-semibold text-purple-300 mb-3 flex items-center print:text-gray-800 print-question-label print:text-sm print:mb-1">
              <MessageCircle className="w-5 h-5 mr-2 print:hidden" />
              您的问题
            </h4>
            <AnimatedText
              text={`"${userInput}"`}
              className="text-slate-200 text-lg italic print:text-gray-700 print-question-text print:text-sm print:not-italic"
              animationType="typewriter"
              delay={900}
              speed={50}
            />
          </CardContent>
        </AnimatedCard>
        
        {/* 塔罗牌卡片展示 - 简化版 */}
        {selectedMethod === 'tarot' && result.cards && result.cards.length > 0 && (
          <div className="mb-8 print:mb-2">
            <h4 className="text-lg font-semibold text-purple-300 mb-4 flex items-center print:text-gray-800 print:text-sm print:mb-1">
              <Star className="w-5 h-5 mr-2 print:hidden" />
              您抽到的塔罗牌
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 print-tarot-grid print:gap-1">
              {result.cards.map((card, index) => {
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
                  <AnimatedCard
                    key={index}
                    animationType="scale"
                    delay={1000 + index * 200}
                    className="bg-slate-800/90 border-purple-400/30 print-tarot-card"
                  >
                    <CardContent className="p-6 text-center">
                      <div className="inline-block bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full px-3 py-1 border border-purple-400/30 mb-4 print-tarot-position">
                        <span className="text-xs font-medium text-purple-300">{position}</span>
                      </div>
                      
                      <div className={`w-20 h-32 bg-gradient-to-br ${cardColor} rounded-xl mx-auto mb-4 flex flex-col items-center justify-center shadow-xl border-2 border-white/20 relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        <div className="relative z-10 text-center">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mb-2 backdrop-blur-sm">
                            <span className="text-white font-bold text-sm">{index + 1}</span>
                          </div>
                          <div className="text-white/80 text-lg">
                            {['🌙', '⭐', '🔮', '✨', '🌟', '💫'][index] || '💫'}
                          </div>
                        </div>
                      </div>
                      
                      <h5 className="font-bold text-purple-200 text-lg mb-2 print-tarot-name">{card.name}</h5>
                      <p className="text-sm text-purple-300/80 font-medium leading-relaxed print-tarot-meaning">{card.meaning}</p>
                      {card.reversed && (
                        <div className="inline-block bg-red-500/20 text-red-300 px-2 py-1 rounded-full text-xs mt-2">
                          逆位
                        </div>
                      )}
                    </CardContent>
                  </AnimatedCard>
                );
              })}
            </div>
          </div>
        )}
        
        {/* 占卜结果内容 */}
        <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-xl p-6 border border-slate-600/30 print:bg-gray-50 print:border-gray-300 print:p-2 print:rounded-none avoid-break">
          {selectedMethod === 'tarot' ? (
            <FormattedTarotResult content={result.content} />
          ) : (
            <FormattedDivinationResult content={result.content} method={selectedMethod} />
          )}
        </div>
      </div>

      {/* 大白话解读 */}
      {plainLanguageResult && (
        <AnimatedCard
          animationType="fade"
          delay={1500}
          className="bg-gradient-to-br from-slate-800/50 via-green-900/20 to-slate-800/50 border border-green-500/30 print:bg-gray-50 print:border-gray-300 print:shadow-none print:rounded-none avoid-break"
        >
          <CardContent className="p-6 print:p-2">
            <FormattedPlainLanguageResult content={plainLanguageResult} />
          </CardContent>
        </AnimatedCard>
      )}

      {/* 操作按钮 */}
      <div className="flex justify-center space-x-4 flex-wrap gap-4 no-print">
        {(selectedMethod === 'tarot' || selectedMethod === 'astrology') && (
          <AnimatedButton
            onClick={onGeneratePlainLanguage}
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
          onClick={onReset}
          animationType="bounce"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-xl"
        >
          <ArrowRight className="w-5 h-5 mr-2" />
          重新占卜
        </AnimatedButton>
        
        <AnimatedButton
          onClick={onCopyResult}
          animationType="pulse"
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-8 rounded-xl"
        >
          <Copy className="w-5 h-5 mr-2" />
          复制结果
        </AnimatedButton>
        
        <AnimatedButton
          onClick={handlePrint}
          animationType="glow"
          className="bg-gradient-to-r from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600 text-white font-semibold py-3 px-8 rounded-xl"
        >
          <Printer className="w-5 h-5 mr-2" />
          快速打印
        </AnimatedButton>
        
        <AnimatedButton
          onClick={handleProfessionalPrint}
          animationType="glow"
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-3 px-8 rounded-xl"
        >
          <Printer className="w-5 h-5 mr-2" />
          专业打印
        </AnimatedButton>
      </div>
    </div>
  );
});

SimpleDivinationResult.displayName = 'SimpleDivinationResult';

export default SimpleDivinationResult;