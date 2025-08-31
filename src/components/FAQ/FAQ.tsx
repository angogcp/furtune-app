import { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle, Search, Book, Star, Users, Settings, Globe } from 'lucide-react'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
}

const FAQ_DATA: FAQItem[] = [
  // 基础使用
  {
    id: '1',
    question: '如何开始使用占卜功能？',
    answer: '您可以直接访问首页开始占卜，无需注册。选择您感兴趣的占卜方式（塔罗牌、生辰八字、抽签等），输入您的问题，系统会为您生成详细的占卜结果。注册用户可以享受更多功能，如每日签到、许愿墙等。',
    category: '基础使用',
    tags: ['占卜', '开始', '注册']
  },
  {
    id: '2',
    question: '支持哪些占卜方式？',
    answer: '我们提供多种占卜方式：\n• 塔罗牌占卜 - 经典的塔罗牌解读\n• 生辰八字 - 基于出生信息的命理分析\n• 抽签占卜 - 传统的抽签问卦\n• 掷筊占卜 - 神明指引的问答\n• 数字占卜 - 基于数字能量的分析\n• 星座运势 - 天体运行的影响分析',
    category: '基础使用',
    tags: ['占卜方式', '塔罗牌', '八字', '抽签']
  },
  {
    id: '3',
    question: '占卜结果准确吗？',
    answer: '占卜结果仅供参考和娱乐，不应作为人生重大决策的唯一依据。我们使用先进的AI技术结合传统占卜理论生成结果，但请理性对待，将其作为自我反思和启发的工具。真正的命运掌握在您自己手中。',
    category: '基础使用',
    tags: ['准确性', '参考', '娱乐']
  },
  
  // 账户功能
  {
    id: '4',
    question: '注册账户有什么好处？',
    answer: '注册用户可以享受以下功能：\n• 每日签到获取专属运势\n• 许愿墙发布和互动\n• 个人成长记录追踪\n• 个性化推荐内容\n• 命运提醒功能\n• 占卜历史记录保存\n• 用户资料和成就系统',
    category: '账户功能',
    tags: ['注册', '签到', '许愿墙', '记录']
  },
  {
    id: '5',
    question: '如何每日签到？',
    answer: '登录后点击导航栏的"签到"按钮，每天可以签到一次获取当日专属运势。连续签到会获得额外奖励，包括特殊徽章和更详细的运势解读。签到记录会保存在您的个人档案中。',
    category: '账户功能',
    tags: ['签到', '运势', '奖励']
  },
  {
    id: '6',
    question: '许愿墙是什么？',
    answer: '许愿墙是用户社区功能，您可以发布愿望与其他用户分享。支持匿名和实名发布，其他用户可以为您的愿望点赞。这是一个充满正能量的社区空间，大家互相鼓励和支持。',
    category: '账户功能',
    tags: ['许愿墙', '社区', '互动']
  },
  
  // 技术问题
  {
    id: '7',
    question: '为什么占卜结果加载很慢？',
    answer: '占卜结果的生成需要AI处理，通常需要几秒到几十秒时间。影响速度的因素包括：\n• 网络连接状况\n• 服务器负载\n• 问题复杂程度\n• 选择的占卜方式\n如果长时间无响应，请刷新页面重试。',
    category: '技术问题',
    tags: ['加载', '速度', '网络']
  },
  {
    id: '8',
    question: '支持哪些设备和浏览器？',
    answer: '我们的应用采用响应式设计，支持：\n• 桌面浏览器：Chrome、Firefox、Safari、Edge\n• 移动设备：iOS Safari、Android Chrome\n• 平板设备：iPad、Android平板\n建议使用最新版本的浏览器以获得最佳体验。',
    category: '技术问题',
    tags: ['设备', '浏览器', '兼容性']
  },
  {
    id: '9',
    question: '数据安全和隐私保护如何？',
    answer: '我们非常重视用户隐私：\n• 所有数据传输使用HTTPS加密\n• 个人信息严格保密，不会泄露给第三方\n• 占卜记录仅用户本人可见\n• 许愿墙支持匿名发布\n• 遵循相关数据保护法规\n• 用户可随时删除个人数据',
    category: '技术问题',
    tags: ['安全', '隐私', '数据保护']
  },
  
  // 功能说明
  {
    id: '10',
    question: '什么是个性化推荐？',
    answer: '基于您的占卜历史、偏好设置和互动行为，系统会推荐相关的文章、小贴士、冥想练习等内容。这些推荐旨在帮助您更好地理解占卜结果，提升个人成长。您可以对推荐内容进行评分和收藏。',
    category: '功能说明',
    tags: ['推荐', '个性化', '内容']
  },
  {
    id: '11',
    question: '命运提醒功能如何使用？',
    answer: '命运提醒会根据您的占卜历史和重要日期，定期发送提醒通知。包括：\n• 重要日期的运势提醒\n• 定期占卜建议\n• 个人成长里程碑\n• 特殊天象影响提醒\n您可以在设置中自定义提醒频率和类型。',
    category: '功能说明',
    tags: ['提醒', '通知', '设置']
  },
  {
    id: '12',
    question: '如何查看占卜历史？',
    answer: '登录用户的所有占卜记录都会自动保存。在个人中心可以查看：\n• 占卜历史记录\n• 结果详情回顾\n• 占卜统计数据\n• 成长轨迹分析\n您可以搜索、筛选和导出历史记录。',
    category: '功能说明',
    tags: ['历史', '记录', '统计']
  },
  
  // 常见问题
  {
    id: '13',
    question: '忘记密码怎么办？',
    answer: '在登录页面点击"忘记密码"，输入注册邮箱，系统会发送重置密码的链接到您的邮箱。请检查垃圾邮件文件夹，如果没有收到邮件，请联系客服。',
    category: '常见问题',
    tags: ['密码', '重置', '邮箱']
  },
  {
    id: '14',
    question: '可以修改用户名吗？',
    answer: '目前用户名设置后暂不支持修改，请在注册时谨慎选择。如有特殊需求，请联系客服协助处理。您可以在个人资料中修改其他信息，如头像、个人简介等。',
    category: '常见问题',
    tags: ['用户名', '修改', '资料']
  },
  {
    id: '15',
    question: '如何联系客服？',
    answer: '如果您遇到问题或有建议，可以通过以下方式联系我们：\n• 在应用内发送反馈\n• 发送邮件到客服邮箱\n• 关注官方社交媒体账号\n• 查看帮助文档和FAQ\n我们会尽快回复您的问题。',
    category: '常见问题',
    tags: ['客服', '联系', '反馈']
  }
]

const CATEGORIES = ['全部', '基础使用', '账户功能', '技术问题', '功能说明', '常见问题']

const CATEGORY_ICONS: { [key: string]: any } = {
  '基础使用': Book,
  '账户功能': Users,
  '技术问题': Settings,
  '功能说明': Star,
  '常见问题': HelpCircle
}

export default function FAQ() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [searchQuery, setSearchQuery] = useState('')

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const filteredFAQs = FAQ_DATA.filter(item => {
    const matchesCategory = selectedCategory === '全部' || item.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 页面标题 */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-center mb-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-3 sm:mb-0 sm:mr-4">
            <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              常见问题
            </h1>
            <p className="text-purple-300 mt-2 text-sm sm:text-base">快速找到您需要的答案</p>
          </div>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
          <input
            type="text"
            placeholder="搜索问题、答案或标签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-purple-900/30 border border-purple-400/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
          />
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(category => {
            const Icon = CATEGORY_ICONS[category] || Globe
            const isSelected = selectedCategory === category
            
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-purple-900/30 text-purple-300 hover:bg-purple-800/40 hover:text-white border border-purple-400/20'
                }`}
              >
                {category !== '全部' && <Icon className="w-3 h-3 sm:w-4 sm:h-4" />}
                <span>{category}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* FAQ列表 */}
      <div className="space-y-4">
        {filteredFAQs.map(item => {
          const isExpanded = expandedItems.has(item.id)
          const Icon = CATEGORY_ICONS[item.category] || HelpCircle
          
          return (
            <div
              key={item.id}
              className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 backdrop-blur-sm rounded-xl border border-purple-400/20 overflow-hidden transition-all duration-300 hover:border-purple-400/40"
            >
              <button
                onClick={() => toggleExpanded(item.id)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between hover:bg-purple-800/20 transition-colors"
              >
                <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-1 truncate">{item.question}</h3>
                    <div className="flex items-center space-x-1 sm:space-x-2 flex-wrap">
                      <span className="text-xs px-2 py-1 bg-purple-600/30 rounded-full text-purple-300">
                        {item.category}
                      </span>
                      {item.tags.slice(0, window.innerWidth < 640 ? 2 : 3).map(tag => (
                        <span key={tag} className="text-xs px-2 py-1 bg-indigo-600/30 rounded-full text-indigo-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-2 sm:ml-4">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  )}
                </div>
              </button>
              
              {isExpanded && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <div className="ml-0 sm:ml-14 pt-4 border-t border-purple-400/20">
                    <div className="prose prose-invert max-w-none">
                      <p className="text-purple-100 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                        {item.answer}
                      </p>
                    </div>
                    
                    {/* 所有标签 */}
                    {item.tags.length > (window.innerWidth < 640 ? 2 : 3) && (
                      <div className="mt-4 pt-4 border-t border-purple-400/10">
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs sm:text-sm text-purple-400 mr-2">相关标签：</span>
                          {item.tags.map(tag => (
                            <span key={tag} className="text-xs px-2 py-1 bg-indigo-600/20 rounded-full text-indigo-300 border border-indigo-400/20">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 无结果提示 */}
      {filteredFAQs.length === 0 && (
        <div className="text-center py-12">
          <HelpCircle className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-purple-300 mb-2">没有找到相关问题</h3>
          <p className="text-purple-400 mb-4">尝试调整搜索关键词或选择不同的分类</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('全部')
            }}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-medium text-white transition-all duration-300"
          >
            重置筛选
          </button>
        </div>
      )}

      {/* 底部提示 */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 backdrop-blur-sm rounded-xl p-6 border border-purple-400/20">
          <h3 className="text-lg font-semibold text-purple-300 mb-2">没有找到您的问题？</h3>
          <p className="text-purple-400 mb-4">
            如果您的问题没有在FAQ中找到答案，欢迎联系我们的客服团队，我们会尽快为您解答。
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <button
              onClick={() => window.location.href = '/contact?tab=inquiry'}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-medium text-white transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              联系客服
            </button>
            <button
              onClick={() => window.location.href = '/contact?tab=feedback'}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg font-medium text-white transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              提交反馈
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}