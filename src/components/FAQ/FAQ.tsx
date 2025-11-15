import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search, MessageCircle, Star, Shield, Clock, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  icon: React.ComponentType<any>;
}

function buildFaqData(t: any): FAQItem[] {
  return [
    {
    id: '1',
    question: t('faq.items.1.question'),
    answer: t('faq.items.1.answer'),
    category: t('faq.categories.basics'),
    icon: HelpCircle
    },
    {
    id: '2',
    question: t('faq.items.2.question'),
    answer: t('faq.items.2.answer'),
    category: t('faq.categories.guide'),
    icon: Search
    },
    {
    id: '3',
    question: t('faq.items.3.question'),
    answer: t('faq.items.3.answer'),
    category: t('faq.categories.privacy'),
    icon: Shield
    },
    {
    id: '4',
    question: t('faq.items.4.question'),
    answer: t('faq.items.4.answer'),
    category: t('faq.categories.guide'),
    icon: Clock
    },
    {
    id: '5',
    question: t('faq.items.5.question'),
    answer: t('faq.items.5.answer'),
    category: t('faq.categories.guide'),
    icon: MessageCircle
    },
    {
    id: '6',
    question: t('faq.items.6.question'),
    answer: t('faq.items.6.answer'),
    category: t('faq.categories.tips'),
    icon: Star
    },
    {
    id: '7',
    question: t('faq.items.7.question'),
    answer: t('faq.items.7.answer'),
    category: t('faq.categories.basics'),
    icon: Heart
    },
    {
    id: '8',
    question: t('faq.items.8.question'),
    answer: t('faq.items.8.answer'),
    category: t('faq.categories.features'),
    icon: Star
    }
  ];
}

const buildCategories = (t: any) => [
  t('faq.categories.all'),
  t('faq.categories.basics'),
  t('faq.categories.guide'),
  t('faq.categories.privacy'),
  t('faq.categories.tips'),
  t('faq.categories.features')
];

const FAQ: React.FC = () => {
  const { t } = useTranslation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(t('faq.categories.all'));
  const [searchTerm, setSearchTerm] = useState('');
  const faqData = buildFaqData(t);
  const categories = buildCategories(t);

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFAQs = faqData.filter(item => {
    const matchesCategory = selectedCategory === t('faq.categories.all') || item.category === selectedCategory;
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
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">{t('faq.title')}</h1>
            <HelpCircle className="w-8 h-8 text-yellow-400 ml-3" />
          </div>
          <p className="text-xl text-purple-200 mb-6">{t('faq.subtitle')}</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              placeholder={t('faq.searchPlaceholder')}
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
            <h3 className="text-xl font-semibold text-purple-300 mb-2">{t('faq.notFoundTitle')}</h3>
            <p className="text-purple-400">{t('faq.notFoundDesc')}</p>
          </div>
        )}

        {/* Contact Section */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <div className="bg-purple-900/30 rounded-xl p-6 border border-purple-600/50">
            <MessageCircle className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">{t('faq.moreQuestionsTitle')}</h3>
            <p className="text-purple-200 mb-4">{t('faq.moreQuestionsDesc')}</p>
            
            {/* Question Submit Form */}
            <div className="bg-purple-800/30 rounded-lg p-4 mb-4 border border-purple-600/30">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2 text-left">{t('faq.labelQuestion')}</label>
                  <textarea
                    placeholder={t('faq.placeholderQuestion')}
                    className="w-full p-3 bg-purple-700/30 border border-purple-600 rounded-lg text-white placeholder-purple-400 focus:border-yellow-400 focus:outline-none resize-none"
                    rows={4}
                    id="question-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2 text-left">{t('faq.labelEmail')}</label>
                  <input
                    type="email"
                    placeholder={t('faq.placeholderEmail')}
                    className="w-full p-3 bg-purple-700/30 border border-purple-600 rounded-lg text-white placeholder-purple-400 focus:border-yellow-400 focus:outline-none"
                    id="email-input"
                  />
                </div>
                <button
                  onClick={() => {
                    const question = (document.getElementById('question-input') as HTMLTextAreaElement)?.value;
                    const email = (document.getElementById('email-input') as HTMLInputElement)?.value;
                    if (question.trim()) {
                      const subject = t('faq.mailSubject');
                      const body = t('faq.mailBody', { question, email: email || t('faq.mailEmailMissing') });
                      const mailtoLink = `mailto:angogcp@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                      window.open(mailtoLink, '_blank');
                      // 清空表单
                      (document.getElementById('question-input') as HTMLTextAreaElement).value = '';
                      (document.getElementById('email-input') as HTMLInputElement).value = '';
                      alert(t('faq.submitSuccess'));
                    } else {
                      alert(t('faq.submitEmpty'));
                    }
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  {t('faq.submitButton')}
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
