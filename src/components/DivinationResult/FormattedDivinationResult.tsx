import React, { memo } from 'react';
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Star, 
  Heart, 
  Zap, 
  Shield, 
  Clock,
  Calendar,
  Award
} from 'lucide-react';

interface FormattedDivinationResultProps {
  content: string;
  method: string;
}

const FormattedDivinationResult = memo<FormattedDivinationResultProps>(({ content, method }) => {
  // 解析占卜结果内容并格式化
  const formatDivinationResult = (text: string, divinationMethod: string) => {
    // 分割内容为段落并过滤重复的标题段落
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
    
    // 用于跟踪已经出现的主题，避免重复
    const seenTopics = new Set<string>();
    
    // 如果内容太长且没有自然段落分隔，尝试按句号分割
    const processedParagraphs = paragraphs.length === 1 && paragraphs[0].length > 300 
      ? paragraphs[0].split(/[。！？]/).filter(p => p.trim().length > 50).map(p => p.trim() + '。')
      : paragraphs;
    
    // 增强内容验证 - 确保每个段落都有实质内容
    const validatedParagraphs = processedParagraphs.filter(p => {
      const trimmed = p.trim();
      // 过滤掉只有标题没有实质内容的段落
      if (trimmed.length < 20) return false;
      // 检查是否只是标题性内容（只有emoji和几个字）
      const titleOnlyPattern = /^[🌟⭐✨🔮📅💫⚡💖💡💼💰🏥⏰🔄📖]{1,3}\s*[\u4e00-\u9fa5]{2,8}[：:]?\s*$/;
      if (titleOnlyPattern.test(trimmed)) return false;
      return true;
    });
    
    console.log('Original paragraphs:', paragraphs.length);
    console.log('Validated paragraphs:', validatedParagraphs.length);
    
    const results = validatedParagraphs.map((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (!trimmed) return null;
      
      // 检测并跳过重复的主题段落
      const topicKeywords = [
        '性格分析', '性格', '特征', '特质', '个性',
        '事业发展', '事业', '工作', '职业', '升职',
        '感情运势', '感情', '爱情', '恋爱', '婚姻',
        '财运分析', '财运', '金钱', '财富', '投资',
        '健康运势', '健康', '身体', '养生', '保健',
        '核心要点', '要点', '关键', '重点',
        '指导建议', '建议', '指导', '推荐'
      ];
      
      // 检查当前段落是否与已处理的主题重复
      for (const keyword of topicKeywords) {
        if (trimmed.includes(keyword)) {
          if (seenTopics.has(keyword)) {
            console.log(`Skipping duplicate topic: ${keyword}`);
            return null; // 跳过重复的主题段落
          }
          seenTopics.add(keyword);
          break;
        }
      }
      
      // 智能分类逻辑 - 根据占卜方法和内容关键词
      
      // 1. 检测标题性内容
      if (trimmed.includes('**') || trimmed.includes('##') || trimmed.match(/^[🌟⭐✨🔮📅💫⚡]/)) {
        return (
          <div key={index} className="bg-gradient-to-r from-indigo-800/60 to-purple-800/60 rounded-xl p-6 border border-indigo-400/50 mb-6 shadow-lg print-friendly-card print-card-title avoid-break">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md print:hidden">
                <Star className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h5 className="text-indigo-100 font-semibold mb-2 print-subtitle print-icon-title print:text-gray-800">⭐ 核心要点</h5>
                <div className="text-indigo-50 leading-relaxed print-content font-medium html-content" dangerouslySetInnerHTML={{ __html: formatTextWithEmojis(trimmed) }}></div>
              </div>
            </div>
          </div>
        );
      }
      
      // 2. 性格/特征分析
      if (trimmed.includes('性格') || trimmed.includes('特征') || trimmed.includes('特质') || trimmed.includes('个性')) {
        return (
          <div key={index} className="bg-gradient-to-r from-cyan-800/60 to-blue-800/60 rounded-xl p-6 border border-cyan-400/50 mb-6 shadow-lg print-friendly-card print-card-personality avoid-break">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md print:hidden">
                <Target className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h5 className="text-cyan-100 font-semibold mb-2 print-subtitle print-icon-personality print:text-gray-800">🎯 性格分析</h5>
                <div className="text-cyan-50 leading-relaxed print-content" dangerouslySetInnerHTML={{ __html: formatTextWithEmojis(trimmed) }}></div>
              </div>
            </div>
          </div>
        );
      }
      
      // 3. 运势/运程相关
      if (trimmed.includes('运势') || trimmed.includes('运程') || trimmed.includes('运气') || trimmed.includes('今日') || trimmed.includes('本月') || trimmed.includes('今年')) {
        return (
          <div key={index} className="bg-gradient-to-r from-amber-800/60 to-yellow-800/60 rounded-xl p-6 border border-amber-400/50 mb-6 shadow-lg print-friendly-card print-card-fortune avoid-break">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md print:hidden">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h5 className="text-amber-100 font-semibold mb-2 print-subtitle print-icon-fortune print:text-gray-800">📈 运势分析</h5>
                <div className="text-amber-50 leading-relaxed print-content" dangerouslySetInnerHTML={{ __html: formatTextWithEmojis(trimmed) }}></div>
              </div>
            </div>
          </div>
        );
      }
      
      // 4. 事业/工作相关 (排除财运内容)
      if ((trimmed.includes('事业') || trimmed.includes('工作') || trimmed.includes('职业') || trimmed.includes('升职')) && 
          !trimmed.includes('财运') && !trimmed.includes('金钱')) {
        return (
          <div key={index} className="bg-gradient-to-r from-purple-800/60 to-violet-800/60 rounded-xl p-6 border border-purple-400/50 mb-6 shadow-lg print-friendly-card print-card-career avoid-break">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md print:hidden">
                <Award className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h5 className="text-purple-100 font-semibold mb-2 print-subtitle print-icon-career print:text-gray-800">💼 事业发展</h5>
                <div className="text-purple-50 leading-relaxed print-content" dangerouslySetInnerHTML={{ __html: formatTextWithEmojis(trimmed) }}></div>
              </div>
            </div>
          </div>
        );
      }
      
      // 5. 财运相关
      if (trimmed.includes('财运') || trimmed.includes('金钱') || trimmed.includes('财富') || trimmed.includes('投资') || trimmed.includes('收入')) {
        return (
          <div key={index} className="bg-gradient-to-r from-emerald-800/60 to-green-800/60 rounded-xl p-6 border border-emerald-400/50 mb-6 shadow-lg print-friendly-card print-card-wealth avoid-break">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md print:hidden">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h5 className="text-emerald-100 font-semibold mb-2 print-subtitle print-icon-wealth print:text-gray-800">💰 财运分析</h5>
                <div className="text-emerald-50 leading-relaxed print-content" dangerouslySetInnerHTML={{ __html: formatTextWithEmojis(trimmed) }}></div>
              </div>
            </div>
          </div>
        );
      }
      
      // 6. 感情/爱情相关
      if (trimmed.includes('感情') || trimmed.includes('爱情') || trimmed.includes('恋爱') || trimmed.includes('婚姻') || trimmed.includes('配偶')) {
        return (
          <div key={index} className="bg-gradient-to-r from-pink-800/60 to-rose-800/60 rounded-xl p-6 border border-pink-400/50 mb-6 shadow-lg print-friendly-card print-card-love avoid-break">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md print:hidden">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h5 className="text-pink-100 font-semibold mb-2 print-subtitle print-icon-love print:text-gray-800">💕 感情运势</h5>
                <div className="text-pink-50 leading-relaxed print-content" dangerouslySetInnerHTML={{ __html: formatTextWithEmojis(trimmed) }}></div>
              </div>
            </div>
          </div>
        );
      }
      
      // 7. 健康相关
      if (trimmed.includes('健康') || trimmed.includes('身体') || trimmed.includes('养生') || trimmed.includes('保健')) {
        return (
          <div key={index} className="bg-gradient-to-r from-teal-800/60 to-cyan-800/60 rounded-xl p-6 border border-teal-400/50 mb-6 shadow-lg print-friendly-card print-card-health avoid-break">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md print:hidden">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h5 className="text-teal-100 font-semibold mb-2 print-subtitle print-icon-health print:text-gray-800">🏥 健康运势</h5>
                <div className="text-teal-50 leading-relaxed print-content" dangerouslySetInnerHTML={{ __html: formatTextWithEmojis(trimmed) }}></div>
              </div>
            </div>
          </div>
        );
      }
      
      // 8. 时间/流年相关
      if (trimmed.includes('流年') || trimmed.includes('年运') || trimmed.includes('月运') || trimmed.includes('时运') || trimmed.includes('大运')) {
        return (
          <div key={index} className="bg-gradient-to-r from-indigo-800/60 to-blue-800/60 rounded-xl p-6 border border-indigo-400/50 mb-6 shadow-lg print-friendly-card print-card-timing avoid-break">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md print:hidden">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h5 className="text-indigo-100 font-semibold mb-2 print-subtitle print-icon-timing print:text-gray-800">🕐 时运分析</h5>
                <div className="text-indigo-50 leading-relaxed print-content" dangerouslySetInnerHTML={{ __html: formatTextWithEmojis(trimmed) }}></div>
              </div>
            </div>
          </div>
        );
      }
      
      // 9. 建议指导相关
      if (trimmed.includes('建议') || trimmed.includes('指导') || trimmed.includes('应该') || trimmed.includes('推荐') || trimmed.includes('注意')) {
        return (
          <div key={index} className="bg-gradient-to-r from-orange-800/60 to-red-800/60 rounded-xl p-6 border border-orange-400/50 mb-6 shadow-lg print-friendly-card print-card-guidance avoid-break">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md print:hidden">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h5 className="text-orange-100 font-semibold mb-2 print-subtitle print-icon-guidance print:text-gray-800">📖 指导建议</h5>
                <div className="text-orange-50 leading-relaxed print-content">
                  {formatGuidanceList(trimmed)}
                </div>
              </div>
            </div>
          </div>
        );
      }
      
      // 10. 默认段落 - 如果内容过长，尝试拆分
      if (trimmed.length > 200) {
        // 将较长的段落拆分为多个小段落
        const sentences = trimmed.split(/[。！？]/).filter(s => s.trim().length > 20);
        if (sentences.length > 2) {
          return (
            <div key={index} className="space-y-4">
              {sentences.map((sentence, sentenceIndex) => {
                const cleanSentence = sentence.trim();
                if (!cleanSentence) return null;
                
                return (
                  <div key={sentenceIndex} className="bg-gradient-to-r from-slate-700/70 to-gray-700/70 rounded-xl p-6 border border-slate-400/50 mb-4 relative shadow-lg print-friendly-card avoid-break">
                    <div className="absolute top-3 right-3 text-2xl opacity-30 print:hidden">📝</div>
                    <div className="text-slate-100 leading-relaxed print-content html-content">
                      <p className="leading-relaxed" dangerouslySetInnerHTML={{ __html: formatTextWithEmojis(cleanSentence + '。') }}></p>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }
      }
      
      // 11. 增强的默认段落处理 - 确保所有内容都能显示
      return (
        <div key={index} className="bg-gradient-to-r from-slate-700/70 to-gray-700/70 rounded-xl p-6 border border-slate-400/50 mb-6 relative shadow-lg print-friendly-card avoid-break">
          <div className="absolute top-3 right-3 text-2xl opacity-30 print:hidden">📋</div>
          <div className="text-slate-100 leading-relaxed print-content html-content">
            <p className="leading-relaxed text-base" dangerouslySetInnerHTML={{ __html: formatTextWithEmojis(trimmed) }}></p>
          </div>
        </div>
      );
    }).filter(Boolean);
    
    // 如果没有有效内容，返回增强的备用内容
    if (results.length === 0) {
      console.warn('没有有效的格式化内容，使用增强的原始内容');
      
      // 尝试按句号分割原始内容为更小的段落
      const sentences = text.split(/[。！？]/).filter(s => s.trim().length > 15);
      
      if (sentences.length > 1) {
        return sentences.map((sentence, index) => {
          const cleanSentence = sentence.trim();
          if (!cleanSentence) return null;
          
          return (
            <div key={`fallback-${index}`} className="bg-gradient-to-r from-slate-700/70 to-gray-700/70 rounded-xl p-6 border border-slate-400/50 mb-4 relative shadow-lg print-friendly-card avoid-break">
              <div className="absolute top-3 right-3 text-2xl opacity-30 print:hidden">📝</div>
              <div className="text-slate-100 leading-relaxed print-content html-content">
                <p className="leading-relaxed text-base" dangerouslySetInnerHTML={{ __html: formatTextWithEmojis(cleanSentence + '。') }}></p>
              </div>
            </div>
          );
        }).filter(Boolean);
      }
      
      // 最终备用：显示原始内容
      return [
        <div key="fallback" className="bg-gradient-to-r from-slate-700/70 to-gray-700/70 rounded-xl p-6 border border-slate-400/50 mb-6 relative shadow-lg print-friendly-card avoid-break">
          <div className="absolute top-3 right-3 text-2xl opacity-30 print:hidden">📝</div>
          <div className="text-slate-100 leading-relaxed print-content html-content">
            <p className="leading-relaxed whitespace-pre-line text-base" dangerouslySetInnerHTML={{ __html: formatTextWithEmojis(text) }}></p>
          </div>
        </div>
      ];
    }
    
    return results;
  };

  // 格式化指导建议列表
  const formatGuidanceList = (text: string) => {
    const sentences = text.split(/[。！；]/).filter(s => s.trim());
    
    if (sentences.length > 1) {
      return (
        <ul className="space-y-2">
          {sentences.map((sentence, index) => {
            const trimmed = sentence.trim();
            if (!trimmed) return null;
            return (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-orange-300 mt-1">•</span>
                <span dangerouslySetInnerHTML={{ __html: formatTextWithEmojis(trimmed) }}></span>
              </li>
            );
          })}
        </ul>
      );
    }
    
    return <div dangerouslySetInnerHTML={{ __html: formatTextWithEmojis(text) }}></div>;
  };

  // 为文本添加合适的表情符号和格式化
  const formatTextWithEmojis = (text: string) => {
    return text
      // 清除所有markdown格式符号和重复的标题
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')  // 保留加粗但转为HTML
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')     // 保留斜体但转为HTML
      .replace(/#{1,6}\s*/g, '')            // 清除所有级别标题标记
      .replace(/_{2,}/g, '')                // 清除下划线 __ -> 
      .replace(/`([^`]+)`/g, '<code class="bg-slate-600/30 px-1 py-0.5 rounded text-sm">$1</code>')  // 代码块样式化
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 清除链接标记 [text](url) -> text
      .replace(/^[-*+]\s+/gm, '• ')         // 列表标记改为bullet点
      .replace(/^\d+\.\s+/gm, '')           // 清除数字列表标记
      .replace(/^>\s*/gm, '')               // 清除引用标记
      .replace(/^-{3,}$/gm, '')             // 清除分隔线
      .replace(/^\s*-{3,}\s*$/gm, '')       // 清除分隔线（包括空格）
      .replace(/\n\s*\n\s*\n/g, '<br><br>') // 多个空行转为HTML换行
      .replace(/\n/g, '<br>')               // 单个换行转为HTML
      // 移除重复的emoji标题和常见重复模式
      .replace(/💖\s*感情指引[：:]?\s*/gi, '')
      .replace(/💡\s*实用建议[：:]?\s*/gi, '')
      .replace(/🔮\s*未来展望[：:]?\s*/gi, '')
      .replace(/💼\s*事业发展[：:]?\s*/gi, '')
      .replace(/💰\s*财运分析[：:]?\s*/gi, '')
      .replace(/⭐\s*核心要点[：:]?\s*/gi, '')
      .replace(/📖\s*指导建议[：:]?\s*/gi, '')
      // 括号内容高亮
      .replace(/（\s*([^）]+)\s*）/g, '<span class="inline-block bg-black/20 px-2 py-1 rounded-md text-sm border border-white/20 mx-1">（$1）</span>')
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
      .replace(/(^|\s)(运势|运气)(?!.*[🍀🌟✨])/g, '$1🍀 $2')
      .replace(/(^|\s)(星座|星象)(?!.*[⭐🌟♈])/g, '$1⭐ $2')
      .replace(/(^|\s)(命运|命理)(?!.*[🔮✨📿])/g, '$1🔮 $2')
      // 清理多余的HTML标签和空格
      .replace(/<br>\s*<br>\s*<br>/g, '<br><br>') // 限制最多两个换行
      .replace(/^\s+|\s+$/g, '')               // 清除首尾空白
      .trim();
  };

  // 根据占卜方法返回特定标题
  const getMethodTitle = (method: string) => {
    const methodTitles = {
      'tarot': '🔮 塔罗解读',
      'astrology': '⭐ 星座分析', 
      'numerology': '🔢 数字命理',
      'lottery': '🎋 抽签解读',
      'jiaobei': '🥥 掷筊结果',
      'bazi': '📅 八字命理',
      'ziwei': '🌟 紫微斗数'
    };
    return methodTitles[method as keyof typeof methodTitles] || '📋 占卜解读';
  };

  return (
    <div className="space-y-4 print:space-y-1">
      <div className="text-center mb-6 print:mb-2">
        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 rounded-full px-6 py-3 border border-purple-400/40 shadow-lg print:bg-gray-100 print:border-gray-300 print:shadow-none print:px-2 print:py-1">
          <BookOpen className="w-6 h-6 text-purple-300 print:hidden" />
          <h3 className="text-xl font-bold text-purple-100 print-title print:text-gray-800 print:text-sm">{getMethodTitle(method)}</h3>
          <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse print:hidden"></div>
        </div>
        <p className="text-purple-200/80 text-sm mt-2 print:text-gray-600 print:text-xs print:mt-1">专业的占卜分析为您提供人生指引</p>
      </div>
      
      {formatDivinationResult(content, method)}
    </div>
  );
});

FormattedDivinationResult.displayName = 'FormattedDivinationResult';

export { FormattedDivinationResult };