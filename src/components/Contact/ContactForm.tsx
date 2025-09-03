import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, HelpCircle, Send, User, Phone } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type: 'feedback' | 'inquiry';
}

const ContactForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feedback' | 'inquiry'>('feedback');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab === 'feedback' || tab === 'inquiry') {
      setActiveTab(tab);
    }
  }, []);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    type: 'feedback'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleTabChange = (tab: 'feedback' | 'inquiry') => {
    setActiveTab(tab);
    setFormData(prev => ({ ...prev, type: tab, subject: '', message: '' }));
    setSubmitStatus('idle');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      // 生成邮件内容
      const emailSubject = encodeURIComponent(`算算乐 - ${formData.type === 'feedback' ? '用户反馈' : '客服咨询'}: ${formData.subject}`);
      const emailBody = encodeURIComponent(
        `类型：${formData.type === 'feedback' ? '用户反馈' : '客服咨询'}\n\n` +
        `姓名：${formData.name}\n` +
        `邮箱：${formData.email}\n` +
        `电话：${formData.phone || '未提供'}\n` +
        `主题：${formData.subject}\n\n` +
        `详细内容：\n${formData.message}\n\n` +
        `发送时间：${new Date().toLocaleString('zh-CN')}\n\n` +
        `来自：算算乐联系表单`
      );
      
      // 创建mailto链接
      const mailtoUrl = `mailto:waiwai1212faq@2925.com?subject=${emailSubject}&body=${emailBody}`;
      
      // 打开邮件客户端
      window.open(mailtoUrl, '_blank');
      
      // 模拟发送成功
      setTimeout(() => {
        setSubmitStatus('success');
        // 重置表单
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          type: activeTab
        });
        setIsSubmitting(false);
      }, 1500);
      
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitStatus('error');
      setIsSubmitting(false);
    }
  };

  const feedbackPlaceholders = {
    subject: '请简要描述您的反馈主题',
    message: '请详细描述您的建议、意见或遇到的问题...\n\n例如：\n- 功能建议\n- 使用体验\n- 界面优化\n- 其他意见'
  };

  const inquiryPlaceholders = {
    subject: '请简要描述您需要咨询的问题',
    message: '请详细描述您遇到的问题或需要帮助的内容...\n\n例如：\n- 功能使用问题\n- 账户相关问题\n- 技术故障\n- 其他咨询'
  };

  const currentPlaceholders = activeTab === 'feedback' ? feedbackPlaceholders : inquiryPlaceholders;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Mail className="w-10 h-10" />
            联系我们
          </h1>
          <p className="text-purple-200 text-lg">
            我们重视您的每一个反馈和咨询，请选择合适的方式与我们联系
          </p>
        </div>

        {/* 选项卡 */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 flex">
            <button
              onClick={() => handleTabChange('feedback')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'feedback'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              提交反馈
            </button>
            <button
              onClick={() => handleTabChange('inquiry')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'inquiry'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <HelpCircle className="w-5 h-5" />
              客服咨询
            </button>
          </div>
        </div>

        {/* 表单 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  姓名 *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                  placeholder="请输入您的姓名"
                  required
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  邮箱 *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                  placeholder="请输入您的邮箱地址"
                  required
                />
              </div>
            </div>

            {/* 电话（可选） */}
            <div>
              <label className="block text-white font-medium mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                联系电话（可选）
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                placeholder="请输入您的联系电话"
              />
            </div>

            {/* 主题 */}
            <div>
              <label className="block text-white font-medium mb-2">
                主题 *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                placeholder={currentPlaceholders.subject}
                required
              />
            </div>

            {/* 详细内容 */}
            <div>
              <label className="block text-white font-medium mb-2">
                详细内容 *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={8}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 resize-vertical"
                placeholder={currentPlaceholders.message}
                required
              />
            </div>

            {/* 提交按钮 */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-4 rounded-lg font-medium text-white transition-all duration-300 flex items-center gap-3 ${
                  activeTab === 'feedback'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                } disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    发送中...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {activeTab === 'feedback' ? '提交反馈' : '发送咨询'}
                  </>
                )}
              </button>
            </div>

            {/* 状态提示 */}
            {submitStatus === 'success' && (
              <div className="text-center p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                <p className="text-green-300 font-medium">
                  ✅ 已为您打开邮件客户端！请确认发送邮件，我们会在24小时内回复您的${activeTab === 'feedback' ? '反馈' : '咨询'}！
                </p>
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="text-center p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-300 font-medium">
                  ❌ 发送失败，请检查网络连接或稍后重试
                </p>
              </div>
            )}
          </form>
        </div>

        {/* 底部说明 */}
        <div className="text-center mt-8 text-white/70">
          <p className="mb-2">
            📧 邮件将发送至：<span className="text-purple-300 font-medium">waiwai1212faq@2925.com</span>
          </p>
          <p className="text-sm">
            我们承诺在24小时内回复您的邮件，感谢您的耐心等待
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;