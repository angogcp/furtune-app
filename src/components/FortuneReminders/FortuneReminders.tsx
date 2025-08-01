import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Plus, Edit, Trash2, AlertCircle, CheckCircle, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface FortuneReminder {
  id: string;
  reminderType: 'monthly' | 'yearly' | 'custom';
  title: string;
  content: string;
  triggerDate: string;
  isSent: boolean;
  createdAt: string;
}

interface ReminderForm {
  reminderType: 'monthly' | 'yearly' | 'custom';
  title: string;
  content: string;
  triggerDate: string;
  customInterval?: number;
  customUnit?: 'days' | 'weeks' | 'months';
}

const reminderTypeNames: Record<string, { name: string; description: string; icon: any }> = {
  monthly: { 
    name: '月度提醒', 
    description: '每月定期提醒命运变化', 
    icon: Moon 
  },
  yearly: { 
    name: '年度提醒', 
    description: '每年回顾和展望', 
    icon: Sun 
  },
  custom: { 
    name: '自定义提醒', 
    description: '根据个人需求设置提醒', 
    icon: Bell 
  }
};

export default function FortuneReminders() {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<FortuneReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState<FortuneReminder | null>(null);
  const [formData, setFormData] = useState<ReminderForm>({
    reminderType: 'monthly',
    title: '',
    content: '',
    triggerDate: '',
    customInterval: 1,
    customUnit: 'months'
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      fetchReminders();
    }
  }, [user]);

  const fetchReminders = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('fortune_reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('trigger_date', { ascending: true });

      if (error) throw error;

      if (data) {
        setReminders(data.map(item => ({
          id: item.id,
          reminderType: item.reminder_type,
          title: item.title,
          content: item.content,
          triggerDate: item.trigger_date,
          isSent: item.is_sent,
          createdAt: item.created_at
        })));
      }
    } catch (error) {
      console.error('获取提醒失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = '请输入提醒标题';
    }
    
    if (!formData.content.trim()) {
      errors.content = '请输入提醒内容';
    }
    
    if (!formData.triggerDate) {
      errors.triggerDate = '请选择提醒日期';
    } else {
      const selectedDate = new Date(formData.triggerDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.triggerDate = '提醒日期不能早于今天';
      }
    }
    
    if (formData.reminderType === 'custom') {
      if (!formData.customInterval || formData.customInterval < 1) {
        errors.customInterval = '请输入有效的间隔数值';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;
    
    try {
      const reminderData = {
        user_id: user.id,
        reminder_type: formData.reminderType,
        title: formData.title,
        content: formData.content,
        trigger_date: formData.triggerDate
      };
      
      if (editingReminder) {
        // 更新现有提醒
        const { error } = await supabase
          .from('fortune_reminders')
          .update(reminderData)
          .eq('id', editingReminder.id);
        
        if (error) throw error;
      } else {
        // 创建新提醒
        const { error } = await supabase
          .from('fortune_reminders')
          .insert(reminderData);
        
        if (error) throw error;
      }
      
      // 重置表单
      setFormData({
        reminderType: 'monthly',
        title: '',
        content: '',
        triggerDate: '',
        customInterval: 1,
        customUnit: 'months'
      });
      setFormErrors({});
      setShowForm(false);
      setEditingReminder(null);
      
      // 刷新列表
      fetchReminders();
      
    } catch (error) {
      console.error('保存提醒失败:', error);
    }
  };

  const handleEdit = (reminder: FortuneReminder) => {
    setEditingReminder(reminder);
    setFormData({
      reminderType: reminder.reminderType,
      title: reminder.title,
      content: reminder.content,
      triggerDate: reminder.triggerDate,
      customInterval: 1,
      customUnit: 'months'
    });
    setShowForm(true);
  };

  const handleDelete = async (reminderId: string) => {
    if (!confirm('确定要删除这个提醒吗？')) return;
    
    try {
      const { error } = await supabase
        .from('fortune_reminders')
        .delete()
        .eq('id', reminderId);
      
      if (error) throw error;
      
      fetchReminders();
    } catch (error) {
      console.error('删除提醒失败:', error);
    }
  };

  const generateSuggestedContent = (type: string): string => {
    const suggestions = {
      monthly: `亲爱的朋友，又到了月度回顾的时刻！\n\n回顾这个月的占卜记录，您是否发现了一些有趣的模式？\n\n建议您：\n• 回顾本月的占卜结果，看看哪些预测已经应验\n• 思考最近的生活变化和心境转换\n• 为下个月设定新的目标和期望\n\n愿星辰指引您前行的道路！`,
      yearly: `时光荏苒，又是一年的轮回！\n\n这一年来，您在占卜的陪伴下走过了怎样的心路历程？\n\n年度回顾建议：\n• 统计这一年的占卜次数和主要关注领域\n• 回顾年初的愿望和目标，看看实现了多少\n• 总结这一年最重要的人生感悟\n• 为新的一年许下美好的愿望\n\n感谢您与我们一起度过这充满神秘与智慧的一年！`,
      custom: `这是您的专属提醒时刻！\n\n根据您的个人节奏，现在是时候：\n• 回顾最近的占卜体验\n• 思考生活中的变化和成长\n• 为接下来的日子做好准备\n\n记住，每一次回顾都是新的开始！`
    };
    
    return suggestions[type as keyof typeof suggestions] || suggestions.custom;
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 页面标题 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">命运变化提醒</h1>
        <p className="text-purple-200">定期回顾您的占卜历程，感受命运的变化轨迹</p>
      </div>

      {/* 添加提醒按钮 */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => {
            setShowForm(true);
            setEditingReminder(null);
            setFormData({
              reminderType: 'monthly',
              title: '',
              content: '',
              triggerDate: '',
              customInterval: 1,
              customUnit: 'months'
            });
          }}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300"
        >
          <Plus className="w-5 h-5 mr-2" />
          创建新提醒
        </button>
      </div>

      {/* 提醒类型说明 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {Object.entries(reminderTypeNames).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <div key={key} className="bg-purple-800/30 rounded-lg p-4 border border-purple-400/20">
              <div className="flex items-center mb-2">
                <Icon className="w-6 h-6 text-purple-400 mr-2" />
                <h3 className="text-white font-semibold">{config.name}</h3>
              </div>
              <p className="text-purple-200 text-sm">{config.description}</p>
            </div>
          );
        })}
      </div>

      {/* 提醒列表 */}
      <div className="space-y-4">
        {reminders.map(reminder => {
          const typeConfig = reminderTypeNames[reminder.reminderType];
          const Icon = typeConfig.icon;
          const isUpcoming = new Date(reminder.triggerDate) > new Date();
          const isPast = new Date(reminder.triggerDate) < new Date();
          
          return (
            <div key={reminder.id} className={`bg-purple-800/30 rounded-lg p-6 border ${
              reminder.isSent 
                ? 'border-green-400/30 bg-green-900/10'
                : isUpcoming 
                ? 'border-purple-400/30'
                : 'border-orange-400/30 bg-orange-900/10'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <Icon className="w-5 h-5 text-purple-400 mr-2" />
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm mr-3">
                      {typeConfig.name}
                    </span>
                    <div className="flex items-center text-purple-300 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(reminder.triggerDate).toLocaleDateString('zh-CN')}
                    </div>
                    {reminder.isSent && (
                      <div className="flex items-center ml-3 text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        已发送
                      </div>
                    )}
                    {isPast && !reminder.isSent && (
                      <div className="flex items-center ml-3 text-orange-400 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        待处理
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">{reminder.title}</h3>
                  <p className="text-purple-200 leading-relaxed whitespace-pre-line">
                    {reminder.content.length > 200 
                      ? `${reminder.content.substring(0, 200)}...` 
                      : reminder.content
                    }
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(reminder)}
                    className="p-2 text-purple-400 hover:text-purple-300 transition-colors"
                    title="编辑提醒"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(reminder.id)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    title="删除提醒"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        
        {reminders.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <p className="text-purple-300 text-lg">暂无设置提醒</p>
            <p className="text-purple-400">创建您的第一个命运变化提醒吧！</p>
          </div>
        )}
      </div>

      {/* 创建/编辑提醒表单模态框 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-purple-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingReminder ? '编辑提醒' : '创建新提醒'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingReminder(null);
                    setFormErrors({});
                  }}
                  className="text-purple-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 提醒类型 */}
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-3">提醒类型</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {Object.entries(reminderTypeNames).map(([key, config]) => {
                      const Icon = config.icon;
                      return (
                        <label key={key} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                          formData.reminderType === key
                            ? 'border-purple-400 bg-purple-600/20'
                            : 'border-purple-600 hover:border-purple-400'
                        }`}>
                          <input
                            type="radio"
                            name="reminderType"
                            value={key}
                            checked={formData.reminderType === key}
                            onChange={(e) => {
                              setFormData(prev => ({ ...prev, reminderType: e.target.value as any }));
                              // 自动填充建议内容
                              if (!formData.content) {
                                setFormData(prev => ({ 
                                  ...prev, 
                                  reminderType: e.target.value as any,
                                  content: generateSuggestedContent(e.target.value)
                                }));
                              }
                            }}
                            className="sr-only"
                          />
                          <Icon className="w-5 h-5 text-purple-400 mr-2" />
                          <div>
                            <div className="text-white font-medium">{config.name}</div>
                            <div className="text-purple-300 text-xs">{config.description}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
                
                {/* 提醒标题 */}
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">提醒标题</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className={`w-full p-3 bg-purple-800/30 border rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 ${
                      formErrors.title ? 'border-red-500' : 'border-purple-600'
                    }`}
                    placeholder="例如：月度命运回顾"
                  />
                  {formErrors.title && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.title}</p>
                  )}
                </div>
                
                {/* 提醒日期 */}
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">提醒日期</label>
                  <input
                    type="date"
                    value={formData.triggerDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, triggerDate: e.target.value }))}
                    className={`w-full p-3 bg-purple-800/30 border rounded-lg text-white focus:outline-none focus:border-purple-400 ${
                      formErrors.triggerDate ? 'border-red-500' : 'border-purple-600'
                    }`}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {formErrors.triggerDate && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.triggerDate}</p>
                  )}
                </div>
                
                {/* 提醒内容 */}
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">提醒内容</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    className={`w-full p-3 bg-purple-800/30 border rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 h-32 resize-none ${
                      formErrors.content ? 'border-red-500' : 'border-purple-600'
                    }`}
                    placeholder="输入提醒的具体内容..."
                  />
                  {formErrors.content && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.content}</p>
                  )}
                  <p className="text-purple-400 text-sm mt-1">
                    建议包含回顾要点、思考方向等内容
                  </p>
                </div>
                
                {/* 提交按钮 */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingReminder(null);
                      setFormErrors({});
                    }}
                    className="px-6 py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-lg transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300"
                  >
                    {editingReminder ? '更新提醒' : '创建提醒'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}