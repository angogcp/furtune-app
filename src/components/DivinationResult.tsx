import type { BirthInfo, SpecialData } from '../types';
import { AnimatedCard } from './ui/AnimatedCard';
import { Copy, RotateCcw, Sparkles, Loader2 } from 'lucide-react';

interface DivinationResultProps {
  result: string;
  userInput: string;
  birthInfo?: BirthInfo;
  specialData?: SpecialData;
  isLoading?: boolean;
  isGeneratingInterpretation: boolean;
  onGenerateInterpretation: () => void;
  onReset: () => void;
  onCopyResult: () => Promise<void>;
}

export function DivinationResult({
  result,
  userInput,
  isLoading = false,
  isGeneratingInterpretation,
  onGenerateInterpretation,
  onReset,
  onCopyResult
}: DivinationResultProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <AnimatedCard className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔮</div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            占卜结果
          </h2>
          <p className="text-slate-300">您的问题：{userInput}</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 mb-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
              <p className="text-slate-300 text-lg mb-2">神秘的力量正在为您揭示答案...</p>
              <p className="text-slate-400 text-sm">请稍候，占卜结果即将呈现</p>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-slate-200 leading-relaxed">
                {result}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          {!isLoading && (
            <>
              <button
                onClick={onGenerateInterpretation}
                disabled={isGeneratingInterpretation}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
              >
                {isGeneratingInterpretation ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                <span>{isGeneratingInterpretation ? '生成中...' : '生成大白话解读'}</span>
              </button>

              <button
                onClick={onCopyResult}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
              >
                <Copy className="w-5 h-5" />
                <span>复制结果</span>
              </button>
            </>
          )}

          <button
            onClick={onReset}
            className="flex items-center space-x-2 bg-gradient-to-r from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-gray-500/25"
          >
            <RotateCcw className="w-5 h-5" />
            <span>重新开始</span>
          </button>
        </div>
      </AnimatedCard>
    </div>
  );
}