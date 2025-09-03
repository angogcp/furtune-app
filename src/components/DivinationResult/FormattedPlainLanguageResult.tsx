import React, { memo } from 'react';
import { MessageCircle, Lightbulb, Heart, TrendingUp, AlertCircle, CheckCircle, Target, Zap, Clock } from 'lucide-react';

interface FormattedPlainLanguageResultProps {
  content: string;
}

const FormattedPlainLanguageResult = memo<FormattedPlainLanguageResultProps>(({ content }) => {
  // 解析大白话内容并格式化
  const formatPlainLanguage = (text: string) => {
    // 分割内容为段落，支持多种分割方式
    const paragraphs = text
      .split(/\n\n+/)
      .filter(p => p.trim())
      .map(p => p.trim())
      .filter(p => p.length > 10); // 过滤太短的段落
    
    // 用于跟踪已经出现的主题，避免重复
    const seenTopics = new Set<string>();
    
    return paragraphs.map((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (!trimmed) return null;
      
      // 检测并跳过重复的主题段落
      const topicKeywords = [
        '感情指引', '感情', '爱情', '恋爱',
        '事业发展', '事业', '工作', '职业',
        '财运分析', '财运', '金钱', '财富',
        '实用建议', '建议', '指导',
        '未来展望', '未来', '将来',
        '简单总结', '总结', '大白话'
      ];
      
      // 检查当前段落是否与已处理的主题重复
      for (const keyword of topicKeywords) {
        if (trimmed.includes(keyword)) {
          if (seenTopics.has(keyword)) {
            console.log(`Skipping duplicate plain language topic: ${keyword}`);
            return null; // 跳过重复的主题段落
          }
          seenTopics.add(keyword);
          break;
        }
      }
      
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
                <h5 className="text-blue-100 font-semibold mb-3 print-subtitle print-icon-summary print:text-gray-800">💬 简单总结</h5>
                <div className="text-blue-50 leading-relaxed text-base print-content html-content">
                  <p className="leading-relaxed" dangerouslySetInnerHTML={{ __html: formatTextWithEmojis(trimmed) }}></p>
                </div>
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
      
      // 8. 默认段落 - 增强可读性
      return (
        <div key={index} className="bg-gradient-to-r from-slate-700/60 to-gray-700/60 rounded-xl p-6 border border-slate-400/40 mb-6 relative shadow-lg print-friendly-card avoid-break">
          <div className="absolute top-3 right-3 text-2xl opacity-30 print:hidden">💭</div>
          <div className="text-slate-100 leading-relaxed text-base print-content">
            <p className="leading-relaxed" dangerouslySetInnerHTML={{ __html: formatTextWithEmojis(trimmed) }}></p>
          </div>
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
      // 清除所有markdown格式符号和重复的标题
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')  // 保留加粗但转为HTML
      .replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>')     // 保留斜体但转为HTML
      .replace(/#{1,6}\s*/g, '')            // 清除所有级别标题标记
      .replace(/_{2,}/g, '')                // 清除下划线 __ -> 
      .replace(/`([^`]+)`/g, '<code class="bg-slate-600/40 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')  // 代码块样式化
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 清除链接标记 [text](url) -> text
      .replace(/^[-*+]\s+/gm, '• ')         // 列表标记改为bullet点
      .replace(/^\d+\.\s+/gm, '')           // 清除数字列表标记
      .replace(/^>\s*/gm, '')               // 清除引用标记
      .replace(/^-{3,}$/gm, '')             // 清除分隔线
      .replace(/^\s*-{3,}\s*$/gm, '')       // 清除分隔线（包括空格）
      .replace(/\n\s*\n\s*\n/g, '</p><p class="mt-4 leading-relaxed">') // 段落分隔
      .replace(/\n/g, '<br class="leading-relaxed">')               // 单个换行转为HTML
      // 移除重复的emoji标题和常见重复模式
      .replace(/💖\s*感情指引[：:]?\s*/gi, '')
      .replace(/💡\s*实用建议[：:]?\s*/gi, '')
      .replace(/🔮\s*未来展望[：:]?\s*/gi, '')
      .replace(/💼\s*事业发展[：:]?\s*/gi, '')
      .replace(/💰\s*财运分析[：:]?\s*/gi, '')
      .replace(/⭐\s*核心要点[：:]?\s*/gi, '')
      .replace(/📖\s*指导建议[：:]?\s*/gi, '')
      .replace(/💬\s*简单总结[：:]?\s*/gi, '')
      .replace(/🎯\s*大白话解读[：:]?\s*/gi, '')
      // 清除重复的分段标识
      .replace(/(第[一二三四五六七八九十一-九]|１|２|３|４|５)[个]?方面[：，。是]?\s*/gi, '')
      .replace(/[首先|其次|最后|另外|此外][：，]?\s*/gi, '')
      // 括号内容高亮
      .replace(/（\s*([^）]+)\s*）/g, '<span class="inline-block bg-slate-700/30 px-2 py-1 rounded-md text-sm border border-slate-600/30 mx-1">（$1）</span>')
      // 表情符号增强 - 仅在开头没有emoji时添加
      .replace(/(^|\s)(爱情|感情)(?!.*[❤️💕💖])/g, '$1❤️ $2')
      .replace(/(^|\s)(事业|工作)(?!.*[💼🏢👔])/g, '$1💼 $2')
      .replace(/(^|\s)(财运|金钱|财富)(?!.*[💰💸💵])/g, '$1💰 $2')
      .replace(/(^|\s)(健康|身体)(?!.*[🏥❤️‍🩹💪])/g, '$1🏥 $2')
      .replace(/(^|\s)(未来|将来)(?!.*[🔮✨🌟])/g, '$1🔮 $2')
      .replace(/(^|\s)(机会|机遇)(?!.*[🌟✨💫])/g, '$1🌟 $2')
      .replace(/(^|\s)(挑战|困难)(?!.*[⚡🔥💪])/g, '$1⚡ $2')
      .replace(/(^|\s)(成功|胜利)(?!.*[🎉🏆👑])/g, '$1🎉 $2')
      .replace(/(^|\s)(幸福|快乐)(?!.*[😊😄🌈])/g, '$1😊 $2')
      .replace(/(^|\s)(平衡|和谐)(?!.*[⚖️☯️🤝])/g, '$1⚖️ $2')
      .replace(/(^|\s)(变化|转变)(?!.*[🔄🌀🦋])/g, '$1🔄 $2')
      .replace(/(^|\s)(沟通|交流)(?!.*[💬🗣️📞])/g, '$1💬 $2')
      .replace(/(^|\s)(信心|自信)(?!.*[💪👑✨])/g, '$1💪 $2')
      .replace(/(^|\s)(创新|创造)(?!.*[💡🚀🎨])/g, '$1💡 $2')
      // 清理多余的HTML标签和空格
      .replace(/<br>\s*<br>\s*<br>/g, '</p><p class="mt-4 leading-relaxed">') // 限制最多两个换行
      .replace(/^\s+|\s+$/g, '')               // 清除首尾空白
      .trim();
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