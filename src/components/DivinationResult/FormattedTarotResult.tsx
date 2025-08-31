import React, { memo } from 'react';
import { Star, Sparkles, TrendingUp, Heart } from 'lucide-react';

interface FormattedTarotResultProps {
  content: string;
}

const FormattedTarotResult = memo<FormattedTarotResultProps>(({ content }) => {
  // 清除markdown格式符号
  const cleanMarkdown = (text: string) => {
    return text
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
      .trim();
  };

  // 解析AI生成的内容并格式化
  const formatContent = (text: string) => {
    // 分割内容为不同的段落
    const sections = text.split(/\n\n+/);
    
    return sections.map((section, index) => {
      const trimmed = section.trim();
      if (!trimmed) return null;
      
      // 检测不同类型的标题和内容
      if (trimmed.startsWith('##') || trimmed.includes('**') && trimmed.length < 100) {
        // 标题类型
        const cleanTitle = cleanMarkdown(trimmed);
        return (
          <div key={index} className="mb-6 print:mb-1 print:mt-1">
            <div className="flex items-center space-x-3 mb-4 print:mb-1 print:space-x-1">
              {getIconForTitle(cleanTitle)}
              <h4 className="text-xl font-bold text-purple-200 border-b border-purple-400/30 pb-2 print:text-black print:border-gray-400 print:pb-0 print:text-base print:font-bold">
                {cleanTitle}
              </h4>
            </div>
          </div>
        );
      } else if (trimmed.includes('位置') || trimmed.includes('牌位') || trimmed.includes('第') && trimmed.includes('张牌')) {
        // 塔罗牌位置解读
        return (
          <div key={index} className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl p-6 border border-indigo-500/30 mb-6 print:bg-white print:border-gray-300 print:rounded-none print:p-1 print:mb-1 avoid-break">
            <div className="flex items-start space-x-3 print:space-x-1">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 print:hidden">
                <Star className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-indigo-200 leading-relaxed whitespace-pre-line print:text-black print:text-xs print:leading-tight">
                  {formatCardPosition(cleanMarkdown(trimmed))}
                </div>
              </div>
            </div>
          </div>
        );
      } else if (trimmed.includes('建议') || trimmed.includes('指导') || trimmed.includes('注意')) {
        // 建议和指导
        return (
          <div key={index} className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl p-6 border border-green-500/30 mb-6 print:bg-white print:border-gray-300 print:rounded-none print:p-1 print:mb-1 avoid-break">
            <div className="flex items-start space-x-3 print:space-x-1">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 print:hidden">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-green-200 leading-relaxed whitespace-pre-line print:text-black print:text-xs print:leading-tight">
                  {cleanMarkdown(trimmed)}
                </div>
              </div>
            </div>
          </div>
        );
      } else if (trimmed.includes('未来') || trimmed.includes('趋势') || trimmed.includes('发展')) {
        // 未来趋势
        return (
          <div key={index} className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-xl p-6 border border-amber-500/30 mb-6 print:bg-white print:border-gray-300 print:rounded-none print:p-1 print:mb-1 avoid-break">
            <div className="flex items-start space-x-3 print:space-x-1">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 print:hidden">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-amber-200 leading-relaxed whitespace-pre-line print:text-black print:text-xs print:leading-tight">
                  {cleanMarkdown(trimmed)}
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        // 普通段落
        return (
          <div key={index} className="bg-slate-800/40 rounded-lg p-4 border border-slate-600/30 mb-4 print:bg-white print:border-gray-300 print:rounded-none print:p-1 print:mb-1 avoid-break">
            <div className="text-slate-200 leading-relaxed whitespace-pre-line print:text-black print:text-xs print:leading-tight">
              {cleanMarkdown(trimmed)}
            </div>
          </div>
        );
      }
    }).filter(Boolean);
  };

  const getIconForTitle = (title: string) => {
    if (title.includes('牌') || title.includes('解读')) {
      return <Star className="w-6 h-6 text-purple-400" />;
    } else if (title.includes('建议') || title.includes('指导')) {
      return <Heart className="w-6 h-6 text-green-400" />;
    } else if (title.includes('未来') || title.includes('趋势')) {
      return <TrendingUp className="w-6 h-6 text-amber-400" />;
    }
    return <Sparkles className="w-6 h-6 text-purple-400" />;
  };

  const formatCardPosition = (text: string) => {
    // 尝试提取牌名和含义
    const lines = text.split('\n');
    return lines.map((line, index) => {
      const cleanLine = cleanMarkdown(line);
      if (cleanLine.includes('：') || cleanLine.includes(':')) {
        const [label, content] = cleanLine.split(/[：:]/);
        return (
          <div key={index} className="mb-2">
            <span className="font-semibold text-indigo-300">{label.trim()}：</span>
            <span className="text-indigo-100">{content?.trim()}</span>
          </div>
        );
      }
      return <div key={index} className="mb-1">{cleanLine}</div>;
    });
  };

  return (
    <div className="space-y-4 print:space-y-1">
      {formatContent(content)}
    </div>
  );
});

FormattedTarotResult.displayName = 'FormattedTarotResult';

export { FormattedTarotResult };