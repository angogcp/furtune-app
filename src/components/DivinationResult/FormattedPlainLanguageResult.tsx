import React, { memo } from 'react';
import { MessageCircle, Lightbulb, Heart, TrendingUp, AlertCircle, CheckCircle, Target, Zap, Clock } from 'lucide-react';

interface FormattedPlainLanguageResultProps {
  content: string;
}

const FormattedPlainLanguageResult = memo<FormattedPlainLanguageResultProps>(({ content }) => {
  // 解析大白话内容并格式化
  const formatPlainLanguage = (text: string) => {
    // 分割内容为段落
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (!trimmed) return null;
      
      // 优化的分类逻辑 - 按照优先级排序，避免误分类
      
      // 1. 首先检测最具体的关键词
      if (trimmed.includes('简单来说') || trimmed.includes('通俗地说') || trimmed.includes('大白话') || trimmed.includes('换句话说') || trimmed.includes('总的来说')) {
        // 总结性段落
        return (
          <div key={index} className="bg-gradient-to-r from-blue-800/50 to-indigo-800/50 rounded-xl p-6 border border-blue-400/40 mb-6 shadow-lg print-friendly-card print-card-summary avoid-break">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md print:hidden">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h5 className="text-blue-100 font-semibold mb-2 print-subtitle print-icon-summary print:text-gray-800">💬 简单总结</h5>
                <div className="text-blue-50 leading-relaxed print-content" dangerouslySetInnerHTML={{ __html: formatTextWithEmojis(trimmed) }}></div>
              </div>
            </div>
          </div>
        );
      }
      
      // 2. 具体的占卜领域分类
      if ((trimmed.includes('感情') || trimmed.includes('爱情') || trimmed.includes('恋爱') || trimmed.includes('关系') || trimmed.includes('伴侣')) && 
          !trimmed.includes('事业') && !trimmed.includes('财运')) {
        // 感情相关段落 - 排除事业和财运相关的复合内容
        return (
          <div key={index} className="bg-gradient-to-r from-teal-800/50 to-emerald-800/50 rounded-xl p-6 border border-teal-400/40 mb-6 shadow-lg print-friendly-card print-card-emotion avoid-break">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md print:hidden">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h5 className="text-teal-100 font-semibold mb-2 print-subtitle print-icon-emotion print:text-gray-800">💖 感情指引</h5>
                <div className="text-teal-50 leading-relaxed print-content" dangerouslySetInnerHTML={{ __html: formatTextWithEmojis(trimmed) }}></div>
              </div>
            </div>
          </div>
        );
      }
      
      if ((trimmed.includes('事业') || trimmed.includes('工作') || trimmed.includes('职场') || trimmed.includes('职业') || trimmed.includes('升职')) && 
          !trimmed.includes('财运') && !trimmed.includes('金钱')) {
        // 事业相关段落 - 排除财运相关的复合内容
        return (
          <div key={index} className="bg-gradient-to-r from-violet-800/50 to-purple-800/50 rounded-xl p-6 border border-violet-400/40 mb-6 shadow-lg print-friendly-card print-card-career avoid-break">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md print:hidden">
                <Target className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h5 className="text-violet-100 font-semibold mb-2 print-subtitle print-icon-career print:text-gray-800">💼 事业发展</h5>
                <div className="text-violet-50 leading-relaxed print-content" dangerouslySetInnerHTML={{ __html: formatTextWithEmojis(trimmed) }}></div>
              </div>
            </div>
          </div>
        );
      }
      
      if (trimmed.includes('财运') || trimmed.includes('金钱') || trimmed.includes('财富') || trimmed.includes('投资') || trimmed.includes('收入') || trimmed.includes('经济')) {
        // 财运相关段落
        return (
          <div key={index} className="bg-gradient-to-r from-orange-800/50 to-amber-800/50 rounded-xl p-6 border border-orange-400/40 mb-6 shadow-lg print-friendly-card print-card-finance avoid-break">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md print:hidden">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h5 className="text-orange-100 font-semibold mb-2 print-subtitle print-icon-finance print:text-gray-800">💰 财运分析</h5>
                <div className="text-orange-50 leading-relaxed print-content" dangerouslySetInnerHTML={{ __html: formatTextWithEmojis(trimmed) }}></div>
              </div>
            </div>
          </div>
        );
      }
      
      // 3. 行为指导类
      if (trimmed.includes('建议') || trimmed.includes('推荐') || trimmed.includes('应该') || trimmed.includes('不妨') || trimmed.includes('可以试试')) {
        // 建议类段落
        return (
          <div key={index} className="bg-gradient-to-r from-lime-800/50 to-green-800/50 rounded-xl p-6 border border-lime-400/40 mb-6 shadow-lg print-friendly-card print-card-advice avoid-break">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-lime-400 to-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md print:hidden">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h5 className="text-lime-100 font-semibold mb-2 print-subtitle print-icon-advice print:text-gray-800">💡 实用建议</h5>
                <div className="text-lime-50 leading-relaxed print-content">
                  {formatAdviceList(trimmed)}
                </div>
              </div>
            </div>
          </div>
        );
      }
      
      // 4. 时间相关
      if (trimmed.includes('时机') || trimmed.includes('时间') || trimmed.includes('什么时候') || trimmed.includes('何时') || trimmed.includes('时候')) {
        // 时机相关段落
        return (
          <div key={index} className="bg-gradient-to-r from-sky-800/50 to-cyan-800/50 rounded-xl p-6 border border-sky-400/40 mb-6 shadow-lg print-friendly-card print-card-timing avoid-break">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md print:hidden">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h5 className="text-sky-100 font-semibold mb-2 print-subtitle print-icon-timing print:text-gray-800">⏰ 时机把握</h5>
                <div className="text-sky-50 leading-relaxed print-content" dangerouslySetInnerHTML={{ __html: formatTextWithEmojis(trimmed) }}></div>
              </div>
            </div>
          </div>
        );
      }
      
      // 5. 未来展望
      if (trimmed.includes('未来') || trimmed.includes('接下来') || trimmed.includes('后续') || trimmed.includes('将来') || trimmed.includes('以后')) {
        // 未来趋势段落
        return (
          <div key={index} className="bg-gradient-to-r from-rose-800/50 to-pink-800/50 rounded-xl p-6 border border-rose-400/40 mb-6 shadow-lg print-friendly-card print-card-future avoid-break">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md print:hidden">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h5 className="text-rose-100 font-semibold mb-2 print-subtitle print-icon-future print:text-gray-800">🔮 未来展望</h5>
                <div className="text-rose-50 leading-relaxed print-content" dangerouslySetInnerHTML={{ __html: formatTextWithEmojis(trimmed) }}></div>
              </div>
            </div>
          </div>
        );
      }
      
      // 6. 警告提醒
      if (trimmed.includes('注意') || trimmed.includes('小心') || trimmed.includes('避免') || trimmed.includes('警惕') || trimmed.includes('谨慎')) {
        // 注意事项段落
        return (
          <div key={index} className="bg-gradient-to-r from-red-800/50 to-rose-800/50 rounded-xl p-6 border border-red-400/40 mb-6 shadow-lg print-friendly-card print-card-warning avoid-break">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-rose-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md print:hidden">
                <AlertCircle className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h5 className="text-red-100 font-semibold mb-2 print-subtitle print-icon-warning print:text-gray-800">⚠️ 温馨提醒</h5>
                <div className="text-red-50 leading-relaxed print-content" dangerouslySetInnerHTML={{ __html: formatTextWithEmojis(trimmed) }}></div>
              </div>
            </div>
          </div>
        );
      }
      
      // 7. 积极正面
      if (trimmed.includes('优势') || trimmed.includes('好的') || trimmed.includes('积极') || trimmed.includes('正面') || trimmed.includes('有利')) {
        // 积极正面段落
        return (
          <div key={index} className="bg-gradient-to-r from-emerald-800/50 to-teal-800/50 rounded-xl p-6 border border-emerald-400/40 mb-6 shadow-lg print-friendly-card print-card-positive avoid-break">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md print:hidden">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h5 className="text-emerald-100 font-semibold mb-2 print-subtitle print-icon-positive print:text-gray-800">✨ 积极因素</h5>
                <div className="text-emerald-50 leading-relaxed print-content" dangerouslySetInnerHTML={{ __html: formatTextWithEmojis(trimmed) }}></div>
              </div>
            </div>
          </div>
        );
      }
      
      // 8. 默认段落
      return (
        <div key={index} className="bg-gradient-to-r from-slate-700/60 to-gray-700/60 rounded-xl p-6 border border-slate-400/40 mb-6 relative shadow-lg print-friendly-card avoid-break">
          <div className="absolute top-3 right-3 text-2xl opacity-30 print:hidden">💭</div>
          <div className="text-slate-100 leading-relaxed print-content" dangerouslySetInnerHTML={{ __html: formatTextWithEmojis(trimmed) }}></div>
        </div>
      );
    }).filter(Boolean);
  };

  // 格式化建议列表
  const formatAdviceList = (text: string) => {
    const sentences = text.split(/[。！；]/).filter(s => s.trim());
    
    if (sentences.length > 1) {
      return (
        <ul className="space-y-2">
          {sentences.map((sentence, index) => {
            const trimmed = sentence.trim();
            if (!trimmed) return null;
            return (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-lime-300 mt-1">•</span>
                <span>{formatTextWithEmojis(trimmed)}</span>
              </li>
            );
          })}
        </ul>
      );
    }
    
    return formatTextWithEmojis(text);
  };

  // 为文本添加合适的表情符号
  const formatTextWithEmojis = (text: string) => {
    return text
      // 清除所有markdown格式符号
      .replace(/\*\*([^*]+)\*\*/g, '$1')  // 清除加粗标记 **text** -> text
      .replace(/\*([^*]+)\*/g, '$1')     // 清除斜体标记 *text* -> text
      .replace(/##\s*/g, '')            // 清除二级标题标记 ## -> 
      .replace(/#\s*/g, '')             // 清除一级标题标记 # -> 
      .replace(/_{2,}/g, '')            // 清除下划线 __ -> 
      .replace(/`([^`]+)`/g, '$1')      // 清除代码标记 `code` -> code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 清除链接标记 [text](url) -> text
      .replace(/^[-*+]\s+/gm, '')       // 清除列表标记 - item -> item
      .replace(/^\d+\.\s+/gm, '')       // 清除数字列表标记 1. item -> item
      .replace(/^>\s*/gm, '')           // 清除引用标记 > text -> text
      .replace(/^-{3,}$/gm, '')         // 清除分隔线 --- -> 
      .replace(/^\s*-{3,}\s*$/gm, '')   // 清除分隔线（包括空格）
      .replace(/\n\s*\n\s*\n/g, '\n\n') // 清理多余空行
      .replace(/（\s*([^）]+)\s*）/g, '<span class="inline-block bg-slate-700/30 px-2 py-1 rounded-md text-sm border border-slate-600/30 mx-1">（$1）</span>')
      .replace(/(\s|^)(爱情|感情)(\s|$)/g, '$1❤️ $2$3')
      .replace(/(\s|^)(事业|工作)(\s|$)/g, '$1💼 $2$3')
      .replace(/(\s|^)(财运|金钱|财富)(\s|$)/g, '$1💰 $2$3')
      .replace(/(\s|^)(健康|身体)(\s|$)/g, '$1🏥 $2$3')
      .replace(/(\s|^)(未来|将来)(\s|$)/g, '$1🔮 $2$3')
      .replace(/(\s|^)(机会|机遇)(\s|$)/g, '$1🌟 $2$3')
      .replace(/(\s|^)(挑战|困难)(\s|$)/g, '$1⚡ $2$3')
      .replace(/(\s|^)(成功|胜利)(\s|$)/g, '$1🎉 $2$3')
      .replace(/(\s|^)(幸福|快乐)(\s|$)/g, '$1😊 $2$3')
      .replace(/(\s|^)(平衡|和谐)(\s|$)/g, '$1⚖️ $2$3')
      .replace(/(\s|^)(变化|转变)(\s|$)/g, '$1🔄 $2$3')
      .replace(/(\s|^)(沟通|交流)(\s|$)/g, '$1💬 $2$3')
      .replace(/(\s|^)(信心|自信)(\s|$)/g, '$1💪 $2$3')
      .replace(/(\s|^)(创新|创造)(\s|$)/g, '$1💡 $2$3');
  };

  return (
    <div className="space-y-4 print:space-y-1">
      <div className="text-center mb-6 print:mb-2 print-interpretation-header">
        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-600/30 to-teal-600/30 rounded-full px-6 py-3 border border-emerald-400/40 shadow-lg print:bg-gray-100 print:border-gray-300 print:shadow-none print:px-2 print:py-1">
          <MessageCircle className="w-6 h-6 text-emerald-300 print:hidden" />
          <h3 className="text-xl font-bold text-emerald-100 print-interpretation-title print:text-gray-800 print:text-sm">🎯 大白话解读</h3>
          <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse print:hidden"></div>
        </div>
        <p className="text-emerald-200/80 text-sm mt-2 print:text-gray-600 print:text-xs print-interpretation-subtitle">用最通俗易懂的话为您解释占卜结果</p>
      </div>
      
      {formatPlainLanguage(content)}
    </div>
  );
});

FormattedPlainLanguageResult.displayName = 'FormattedPlainLanguageResult';

export { FormattedPlainLanguageResult };