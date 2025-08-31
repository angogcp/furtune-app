import React, { memo } from 'react';
import { CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { AnimatedCard } from '../ui/AnimatedCard';
import { AnimatedText } from '../ui/AnimatedText';
import { Loading } from '../ui/Loading';
import { ParticleEffect } from '../ui/ParticleEffect';
import { Sparkles, MessageCircle, Star, ArrowLeft, RotateCcw } from 'lucide-react';
import type { DivinationMethodId, SpecialData, DivinationMethodConfig, ReadingType } from '../../types';
import { allTarotCards } from '../../data/tarotCards';

interface DivinationResultProps {
  isLoading: boolean;
  result: string;
  selectedMethod: DivinationMethodId;
  selectedMethodData: DivinationMethodConfig;
  selectedTypeData: ReadingType;
  userInput: string;
  specialData: SpecialData;
  onRestart: () => void;
  onBack: () => void;
}

export const DivinationResult = memo<DivinationResultProps>(({
  isLoading,
  result,
  selectedMethod,
  selectedMethodData,
  selectedTypeData,
  userInput,
  specialData,
  onRestart,
  onBack
}) => {
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 relative">
        <ParticleEffect 
          particleCount={30}
          theme="mystical"
          speed={0.5}
          interactive
          className="absolute inset-0 pointer-events-none"
        />
        <div className="text-center py-16">
          <Loading size="lg" className="mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">正在为您占卜...</h2>
          <p className="text-slate-300">请稍候，神秘的力量正在为您揭示答案</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
      {/* 粒子背景效果 */}
      <ParticleEffect 
        particleCount={30}
        theme="mystical"
        speed={0.5}
        interactive
        className="absolute inset-0 pointer-events-none"
      />
      
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
        
        {selectedMethod === 'tarot' ? (
          <TarotResult 
            userInput={userInput}
            result={result}
            specialData={specialData}
          />
        ) : selectedMethod === 'astrology' ? (
          <AstrologyResult 
            userInput={userInput}
            result={result}
            specialData={specialData}
          />
        ) : (
          <GeneralResult 
            result={result}
            selectedMethod={selectedMethod}
          />
        )}
        
        {/* 操作按钮 */}
        <div className="flex justify-center space-x-4 pt-8">
          <Button
            onClick={onRestart}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            重新占卜
          </Button>
          <Button
            variant="outline"
            onClick={onBack}
            className="text-slate-300 border-slate-600 hover:border-slate-500 font-semibold py-3 px-8 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回
          </Button>
        </div>
      </div>
    </div>
  );
});

DivinationResult.displayName = 'DivinationResult';

// 塔罗牌结果组件
const TarotResult: React.FC<{
  userInput: string;
  result: string;
  specialData: SpecialData;
}> = ({ userInput, result, specialData }) => {
  return (
    <div id="tarot-result-content" className="space-y-6">
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
        {specialData?.selectedCards && specialData.selectedCards.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-purple-300 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2" />
              您选择的塔罗牌
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {specialData.selectedCards.map((cardIndex: number, index: number) => {
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
                      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
                        <div className="text-center mb-4">
                          <div className="inline-block bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full px-3 py-1 border border-purple-400/30">
                            <span className="text-xs font-medium text-purple-300">{position}</span>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <div className={`w-20 h-32 bg-gradient-to-br ${cardColor} rounded-xl mx-auto mb-4 flex flex-col items-center justify-center shadow-xl border-2 border-white/20 relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                            <div className="absolute top-2 left-2 w-3 h-3 bg-white/30 rounded-full"></div>
                            <div className="absolute bottom-2 right-2 w-2 h-2 bg-white/20 rounded-full"></div>
                            
                            <div className="relative z-10 text-center">
                              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mb-2 backdrop-blur-sm">
                                <span className="text-white font-bold text-sm">{index + 1}</span>
                              </div>
                              
                              <div className="text-white/80">
                                {index === 0 && <div className="text-lg">🌙</div>}
                                {index === 1 && <div className="text-lg">⭐</div>}
                                {index === 2 && <div className="text-lg">🔮</div>}
                                {index === 3 && <div className="text-lg">✨</div>}
                                {index === 4 && <div className="text-lg">🌟</div>}
                                {index > 4 && <div className="text-lg">💫</div>}
                              </div>
                            </div>
                            
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 group-hover:animate-pulse"></div>
                          </div>
                          
                          <div className={`absolute top-1 left-1/2 transform -translate-x-1/2 w-20 h-32 bg-gradient-to-br ${cardColor} rounded-xl opacity-30 blur-sm -z-10`}></div>
                        </div>
                        
                        <div className="text-center space-y-2">
                          <h5 className="font-bold text-purple-200 text-lg">{card.name}</h5>
                          <p className="text-sm text-purple-300/80 font-medium leading-relaxed">{card.meaning}</p>
                          
                          <div className="flex items-center justify-center space-x-2 py-2">
                            <div className="w-8 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
                            <div className="w-1 h-1 bg-purple-400/50 rounded-full"></div>
                            <div className="w-8 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
                          </div>
                        </div>
                        
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
  );
};

// 星座结果组件
const AstrologyResult: React.FC<{
  userInput: string;
  result: string;
  specialData: SpecialData;
}> = ({ userInput, result }) => {
  return (
    <div id="astrology-result-content" className="space-y-6">
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
    </div>
  );
};

// 通用结果组件
const GeneralResult: React.FC<{
  result: string;
  selectedMethod: DivinationMethodId;
}> = ({ result }) => {
  return (
    <AnimatedCard
      animationType="slide"
      delay={800}
      variant="glass"
      className="bg-gradient-to-br from-slate-800/60 to-slate-700/60 border-slate-600/30"
    >
      <CardContent className="p-8">
        <div className="prose prose-invert max-w-none">
          <div className="text-slate-200 leading-relaxed whitespace-pre-line text-lg">
            {result}
          </div>
        </div>
      </CardContent>
    </AnimatedCard>
  );
};