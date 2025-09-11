import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search, MessageCircle, Star, Shield, Clock, Heart } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  icon: React.ComponentType<any>;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: '占卜结果准确吗？',
    answer: '占卜结果会根据您提供的信息和选择的方法进行分析。我们建议您将占卜结果与理性思考相结合，作为人生指导的参考之一。',
    category: '基础问题',
    icon: HelpCircle
  },
  {
    id: '2',
    question: '如何选择适合的占卜方式？',
    answer: '不同的占卜方式适合不同的问题类型：\n• 八字命理：适合深度分析人生格局\n• 塔罗占卜：适合情感和人际关系问题\n• 观音求签：适合寻求人生指引\n• 星座占星：适合了解性格特质和运势\n建议根据您的具体需求选择。',
    category: '使用指南',
    icon: Search
  },
  {
    id: '3',
    question: '个人信息会被保护吗？',
    answer: '我们非常重视用户隐私保护：\n• 所有个人信息都经过加密存储\n• 不会向第三方泄露您的信息\n• 您可以随时删除或修改个人资料\n• 占卜记录仅供个人查看',
    category: '隐私安全',
    icon: Shield
  },
  {
    id: '4',
    question: '占卜需要多长时间？',
    answer: '不同占卜方式的时间不同：\n• 快速测试：1-2分钟\n• 塔罗占卜：3-5分钟\n• 八字命理：5-10分钟\n• 紫微斗数：8-15分钟\n具体时间取决于问题复杂度和网络状况。',
    category: '使用指南',
    icon: Clock
  },
  {
    id: '5',
    question: '可以重复占卜同一个问题吗？',
    answer: '建议不要在短时间内重复占卜同一个问题。如果情况发生重大变化，或者距离上次占卜已经过去较长时间（建议至少1个月），可以重新进行占卜。',
    category: '使用指南',
    icon: MessageCircle
  },
  {
    id: '6',
    question: '如何提高占卜的准确性？',
    answer: '为了获得更准确的占卜结果：\n• 完善个人资料信息\n• 明确具体的问题\n• 保持诚恳的态度\n• 选择合适的占卜时机\n• 详细描述您的情况',
    category: '使用技巧',
    icon: Star
  },
  {
    id: '7',
    question: '占卜结果可以改变命运吗？',
    answer: '占卜结果是对当前趋势的分析和预测，而非绝对的命运安排。通过了解可能的发展方向，您可以：\n• 做出更明智的选择\n• 提前准备应对挑战\n• 把握有利时机\n• 调整心态和行为\n真正的改变来自于您的行动和努力。',
    category: '基础问题',
    icon: Heart
  },
  {
    id: '8',
    question: '签到和许愿墙有什么用？',
    answer: '签到功能：\n• 每日签到可获得积分奖励\n• 连续签到有额外奖励\n• 积分可用于解锁特殊功能\n\n许愿墙功能：\n• 记录您的心愿和目标\n• 与其他用户分享正能量\n• 定期回顾愿望实现情况',
    category: '功能介绍',
    icon: Star
  }
];

const categories = ['全部', '基础问题', '使用指南', '隐私安全', '使用技巧', '功能介绍'];

const FAQ: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchTerm, setSearchTerm] = useState('');

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFAQs = faqData.filter(item => {
    const matchesCategory = selectedCategory === '全部' || item.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="w-8 h-8 text-yellow-400 mr-3" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              常见问题
            </h1>
            <HelpCircle className="w-8 h-8 text-yellow-400 ml-3" />
          </div>
          <p className="text-xl text-purple-200 mb-6">解答您关于占卜的疑问</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              placeholder="搜索问题..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-purple-800/50 border border-purple-600 rounded-xl text-white placeholder-purple-400 focus:border-yellow-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/50'
                  : 'bg-purple-800/50 text-purple-300 border border-purple-600/50 hover:bg-purple-700/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFAQs.map((item) => {
            const IconComponent = item.icon;
            const isExpanded = expandedItems.includes(item.id);
            
            return (
              <div
                key={item.id}
                className="bg-purple-800/30 rounded-xl border border-purple-600/50 overflow-hidden transition-all duration-300 hover:border-purple-400/50"
              >
                <button
                  onClick={() => toggleExpanded(item.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-purple-700/20 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{item.question}</h3>
                      <span className="text-sm text-purple-300">{item.category}</span>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-purple-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-purple-400" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="px-6 pb-6">
                    <div className="bg-purple-900/30 rounded-lg p-4 border-l-4 border-yellow-400">
                      <p className="text-purple-100 leading-relaxed whitespace-pre-line">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-purple-300 mb-2">未找到相关问题</h3>
            <p className="text-purple-400">请尝试其他搜索关键词或选择不同的分类</p>
          </div>
        )}

        {/* Contact Section */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <div className="bg-purple-900/30 rounded-xl p-6 border border-purple-600/50">
            <MessageCircle className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">还有其他问题？</h3>
            <p className="text-purple-200 mb-4">
              如果您没有找到想要的答案，欢迎提交您的问题，我们会尽快为您解答。
            </p>
            
            {/* Question Submit Form */}
            <div className="bg-purple-800/30 rounded-lg p-4 mb-4 border border-purple-600/30">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2 text-left">您的问题</label>
                  <textarea
                    placeholder="请详细描述您的问题..."
                    className="w-full p-3 bg-purple-700/30 border border-purple-600 rounded-lg text-white placeholder-purple-400 focus:border-yellow-400 focus:outline-none resize-none"
                    rows={4}
                    id="question-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2 text-left">您的邮箱（可选）</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full p-3 bg-purple-700/30 border border-purple-600 rounded-lg text-white placeholder-purple-400 focus:border-yellow-400 focus:outline-none"
                    id="email-input"
                  />
                </div>
                <button
                  onClick={() => {
                    const question = (document.getElementById('question-input') as HTMLTextAreaElement)?.value;
                    const email = (document.getElementById('email-input') as HTMLInputElement)?.value;
                    if (question.trim()) {
                      const subject = '算算乐 - 用户问题';
                      const body = `用户问题：\n${question}\n\n用户邮箱：${email || '未提供'}`;
                      const mailtoLink = `mailto:angogcp@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                      window.open(mailtoLink, '_blank');
                      // 清空表单
                      (document.getElementById('question-input') as HTMLTextAreaElement).value = '';
                      (document.getElementById('email-input') as HTMLInputElement).value = '';
                      alert('邮件客户端已打开，请发送邮件！');
                    } else {
                      alert('请输入您的问题');
                    }
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  提交问题
                </button>
              </div>
            </div>
            
            <div className="text-sm text-purple-300">
              <p>💫 我们致力于为您提供最好的占卜体验</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;