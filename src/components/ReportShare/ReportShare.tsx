import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Share2, Download, Copy, Wand2, Calendar, Star, TrendingUp, Heart, Zap, Shield } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface DivinationResult {
  id: string
  method: string
  question: string
  result: any
  interpretation: string
  created_at: string
  user_id: string
}

interface ReportData {
  title: string
  subtitle: string
  divination_result: DivinationResult
  analysis_sections: {
    overall_fortune: string
    love_fortune: string
    career_fortune: string
    health_fortune: string
    wealth_fortune: string
    suggestions: string[]
  }
  lucky_elements: {
    color: string
    number: number
    direction: string
    time: string
  }
  created_at: string
}

const ReportShare: React.FC = () => {
  const { user } = useAuth()
  const [divinationResults, setDivinationResults] = useState<DivinationResult[]>([])
  const [_selectedResult, setSelectedResult] = useState<DivinationResult | null>(null)
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user) {
      fetchDivinationResults()
    }
  }, [user])

  const fetchDivinationResults = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('divination_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      setDivinationResults(data || [])
    } catch (error) {
      console.error('获取占卜记录失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateReport = async (result: DivinationResult) => {
    setGenerating(true)
    setSelectedResult(result)

    try {
      // 生成详细的运势分析报告
      const report: ReportData = {
        title: `${getMethodName(result.method)}运势分析报告`,
        subtitle: `${new Date(result.created_at).toLocaleDateString()} 专属解读`,
        divination_result: result,
        analysis_sections: {
          overall_fortune: generateOverallFortune(result),
          love_fortune: generateLoveFortune(result),
          career_fortune: generateCareerFortune(result),
          health_fortune: generateHealthFortune(result),
          wealth_fortune: generateWealthFortune(result),
          suggestions: generateSuggestions(result)
        },
        lucky_elements: generateLuckyElements(result),
        created_at: new Date().toISOString()
      }

      setReportData(report)
      setShowShareModal(true)
    } catch (error) {
      console.error('生成报告失败:', error)
      alert('生成报告失败，请稍后重试')
    } finally {
      setGenerating(false)
    }
  }

  const getMethodName = (method: string) => {
    const methodMap: { [key: string]: string } = {
      tarot: '塔罗牌',
      iching: '易经',
      astrology: '星座',
      numerology: '数字命理',
      palmistry: '手相',
      faceReading: '面相'
    }
    return methodMap[method] || method
  }

  const generateOverallFortune = (_result: DivinationResult) => {
    const fortunes = [
      '您的整体运势呈现上升趋势，近期将有不错的发展机会。保持积极的心态，勇敢面对挑战。',
      '当前运势平稳，适合稳扎稳打。避免冒险行为，专注于现有的目标和计划。',
      '运势波动较大，需要特别注意情绪管理。保持冷静理性，等待时机成熟再行动。',
      '整体运势向好，贵人运旺盛。多与他人交流合作，将获得意想不到的帮助。'
    ]
    return fortunes[Math.floor(Math.random() * fortunes.length)]
  }

  const generateLoveFortune = (_result: DivinationResult) => {
    const fortunes = [
      '感情运势良好，单身者有望遇到心仪对象。已有伴侣的朋友感情稳定，适合进一步发展。',
      '感情方面需要更多耐心和理解。多关注对方的感受，避免因小事产生矛盾。',
      '桃花运旺盛，但要注意甄别真心。保持理性，不要被表面现象迷惑。',
      '感情生活平淡，适合修复旧有关系。主动沟通，化解误会，重燃爱火。'
    ]
    return fortunes[Math.floor(Math.random() * fortunes.length)]
  }

  const generateCareerFortune = (_result: DivinationResult) => {
    const fortunes = [
      '事业运势强劲，工作中将有重要突破。把握机会，展现自己的能力和才华。',
      '职场运势稳定，适合学习新技能。投资自己，为未来的发展做好准备。',
      '工作压力较大，需要合理安排时间。保持工作与生活的平衡，避免过度疲劳。',
      '团队合作运佳，与同事关系融洽。发挥团队精神，共同完成重要项目。'
    ]
    return fortunes[Math.floor(Math.random() * fortunes.length)]
  }

  const generateHealthFortune = (_result: DivinationResult) => {
    const fortunes = [
      '健康状况良好，精力充沛。保持规律作息，适量运动，身心都会更加健康。',
      '需要注意休息，避免过度劳累。多关注身体信号，及时调整生活节奏。',
      '身体抵抗力较弱，要注意预防疾病。加强营养，提高免疫力。',
      '心理健康需要关注，保持乐观心态。多与朋友交流，释放压力。'
    ]
    return fortunes[Math.floor(Math.random() * fortunes.length)]
  }

  const generateWealthFortune = (_result: DivinationResult) => {
    const fortunes = [
      '财运亨通，有意外收入的可能。理性投资，避免盲目跟风。',
      '财务状况稳定，适合储蓄理财。制定合理的财务计划，为未来做准备。',
      '支出较大，需要控制消费。避免不必要的开销，理性购物。',
      '偏财运不错，可以适当尝试小额投资。但要谨慎行事，不可贪心。'
    ]
    return fortunes[Math.floor(Math.random() * fortunes.length)]
  }

  const generateSuggestions = (_result: DivinationResult) => {
    const suggestions = [
      '保持积极乐观的心态，相信自己的能力',
      '多与他人交流沟通，扩展人际关系',
      '注重身心健康，保持良好的生活习惯',
      '学习新知识新技能，提升自我价值',
      '理性面对挑战，冷静分析问题',
      '珍惜身边的人和事，感恩当下拥有的一切'
    ]
    return suggestions.slice(0, 3)
  }

  const generateLuckyElements = (_result: DivinationResult) => {
    const colors = ['红色', '蓝色', '绿色', '紫色', '金色', '银色']
    const numbers = [1, 3, 6, 8, 9, 18, 28, 38]
    const directions = ['东方', '南方', '西方', '北方', '东南', '西南', '东北', '西北']
    const times = ['早晨6-8点', '上午9-11点', '下午2-4点', '傍晚5-7点', '晚上8-10点']

    return {
      color: colors[Math.floor(Math.random() * colors.length)],
      number: numbers[Math.floor(Math.random() * numbers.length)],
      direction: directions[Math.floor(Math.random() * directions.length)],
      time: times[Math.floor(Math.random() * times.length)]
    }
  }

  const downloadAsPDF = async () => {
    if (!reportRef.current || !reportData) return

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`${reportData.title}.pdf`)
    } catch (error) {
      console.error('下载PDF失败:', error)
      alert('下载失败，请稍后重试')
    }
  }

  const downloadAsImage = async () => {
    if (!reportRef.current) return

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      })

      const link = document.createElement('a')
      link.download = `${reportData?.title || '运势报告'}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error('下载图片失败:', error)
      alert('下载失败，请稍后重试')
    }
  }

  const copyShareText = () => {
    if (!reportData) return

    const shareText = `🔮 ${reportData.title}

📅 ${reportData.subtitle}

✨ 整体运势：${reportData.analysis_sections.overall_fortune}

🍀 幸运元素：
• 幸运颜色：${reportData.lucky_elements.color}
• 幸运数字：${reportData.lucky_elements.number}
• 幸运方位：${reportData.lucky_elements.direction}
• 幸运时间：${reportData.lucky_elements.time}

💡 建议：
${reportData.analysis_sections.suggestions.map(s => `• ${s}`).join('\n')}

🌟 来自专业占卜师的解读，仅供参考`

    navigator.clipboard.writeText(shareText).then(() => {
      alert('分享文本已复制到剪贴板')
    }).catch(() => {
      alert('复制失败，请手动复制')
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">运势分析报告</h1>
          <p className="text-gray-600 text-sm sm:text-base px-4">生成精美的运势分析报告，一键分享到社交平台</p>
        </div>

        {/* 占卜记录列表 */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">选择占卜记录</h2>
          {divinationResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Wand2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>暂无占卜记录</p>
              <p className="text-sm">请先进行占卜，然后回来生成报告</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {divinationResults.map((result) => (
                <div key={result.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800 text-sm sm:text-base">
                      {getMethodName(result.method)}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500">
                      {new Date(result.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                    {result.question || '未记录问题'}
                  </p>
                  <button
                    onClick={() => generateReport(result)}
                    disabled={generating}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-sm sm:text-base"
                  >
                    {generating ? (
                      <div className="animate-spin rounded-full h-3 h-3 sm:h-4 sm:w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    )}
                    生成报告
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 分享弹窗 */}
      {showShareModal && reportData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <h3 className="text-lg sm:text-xl font-semibold">运势分析报告</h3>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button
                  onClick={downloadAsPDF}
                  className="px-2 sm:px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-xs sm:text-sm"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  PDF
                </button>
                <button
                  onClick={downloadAsImage}
                  className="px-2 sm:px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center text-xs sm:text-sm"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  图片
                </button>
                <button
                  onClick={copyShareText}
                  className="px-2 sm:px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center text-xs sm:text-sm"
                >
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  复制
                </button>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-2 sm:px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm"
                >
                  关闭
                </button>
              </div>
            </div>

            {/* 报告内容 */}
            <div ref={reportRef} className="p-4 sm:p-8 bg-gradient-to-br from-purple-50 to-pink-50">
              {/* 报告头部 */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-purple-600 text-white rounded-full mb-4">
                  <Star className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-2">{reportData.title}</h1>
                <p className="text-base sm:text-lg text-gray-600">{reportData.subtitle}</p>
              </div>

              {/* 占卜结果概览 */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Wand2 className="w-5 h-5 mr-2 text-purple-600" />
                  占卜概览
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">占卜方式：</span>
                    <p className="font-medium">{getMethodName(reportData.divination_result.method)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">占卜时间：</span>
                    <p className="font-medium">{new Date(reportData.divination_result.created_at).toLocaleString()}</p>
                  </div>
                  {reportData.divination_result.question && (
                    <div className="md:col-span-2">
                      <span className="text-sm text-gray-500">咨询问题：</span>
                      <p className="font-medium">{reportData.divination_result.question}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 运势分析 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                    整体运势
                  </h3>
                  <p className="text-gray-600">{reportData.analysis_sections.overall_fortune}</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-600" />
                    感情运势
                  </h3>
                  <p className="text-gray-600">{reportData.analysis_sections.love_fortune}</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                    事业运势
                  </h3>
                  <p className="text-gray-600">{reportData.analysis_sections.career_fortune}</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-green-600" />
                    健康运势
                  </h3>
                  <p className="text-gray-600">{reportData.analysis_sections.health_fortune}</p>
                </div>
              </div>

              {/* 幸运元素 */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-purple-600" />
                  幸运元素
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                    </div>
                    <p className="text-sm text-gray-500">幸运颜色</p>
                    <p className="font-medium">{reportData.lucky_elements.color}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-blue-600 font-bold">{reportData.lucky_elements.number}</span>
                    </div>
                    <p className="text-sm text-gray-500">幸运数字</p>
                    <p className="font-medium">{reportData.lucky_elements.number}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-green-600 text-xs">方</span>
                    </div>
                    <p className="text-sm text-gray-500">幸运方位</p>
                    <p className="font-medium">{reportData.lucky_elements.direction}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Calendar className="w-6 h-6 text-yellow-600" />
                    </div>
                    <p className="text-sm text-gray-500">幸运时间</p>
                    <p className="font-medium text-xs">{reportData.lucky_elements.time}</p>
                  </div>
                </div>
              </div>

              {/* 建议 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">专业建议</h3>
                <ul className="space-y-2">
                  {reportData.analysis_sections.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-600">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 报告尾部 */}
              <div className="text-center mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  本报告由专业占卜师解读生成，仅供参考娱乐
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  生成时间：{new Date(reportData.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportShare