import { useState, useCallback } from 'react';
import { Button, Card, CardContent, Input, AnimatedButton } from '../ui';
import { Scroll, User, Calendar, ArrowLeft, Sparkles } from 'lucide-react';

interface LifeStoryInputProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

export function LifeStoryInput({ onComplete, onBack }: LifeStoryInputProps) {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    gender: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!formData.name || !formData.birthDate) {
      alert('请填写完整信息');
      return;
    }

    setIsSubmitting(true);
    
    // 模拟处理时间
    setTimeout(() => {
      onComplete({
        name: formData.name,
        birthDate: formData.birthDate,
        gender: formData.gender
      });
      setIsSubmitting(false);
    }, 1000);
  }, [formData, onComplete]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <CardContent className="p-8">
          <div className="flex items-center mb-6">
            <Scroll className="w-8 h-8 text-indigo-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-800">命格小故事</h2>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              基于您的姓名和出生日期，我们将为您生成一个独特的生命故事，
              揭示您的人生主题、天赋才能和成长轨迹。
            </p>
            <div className="bg-indigo-100 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Sparkles className="w-5 h-5 text-indigo-600 mr-2" />
                <span className="font-medium text-indigo-800">故事将包含：</span>
              </div>
              <ul className="text-sm text-indigo-700 space-y-1 ml-7">
                <li>• 您的生命数字和人生主题</li>
                <li>• 不同人生阶段的发展特点</li>
                <li>• 天赋才能和潜在挑战</li>
                <li>• 个性化的人生建议和指引</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                姓名 *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="请输入您的姓名"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                姓名将用于计算您的生命数字和个性化故事内容
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                出生日期 *
              </label>
              <Input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                出生日期用于计算您的生命路径数字
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                性别（可选）
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">请选择性别</option>
                <option value="male">男</option>
                <option value="female">女</option>
                <option value="other">其他</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                性别信息有助于生成更贴合的故事内容
              </p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <Sparkles className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-1">隐私保护</h4>
                <p className="text-sm text-yellow-700">
                  您的个人信息仅用于生成命格故事，不会被存储或用于其他用途。
                  所有计算都在本地完成，确保您的隐私安全。
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between mt-6">
        <Button onClick={onBack} variant="outline" className="flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回
        </Button>
        
        <AnimatedButton
          onClick={handleSubmit}
          disabled={!formData.name || !formData.birthDate || isSubmitting}
          className={`flex items-center ${
            formData.name && formData.birthDate && !isSubmitting
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              生成中...
            </>
          ) : (
            <>
              生成故事
              <Scroll className="w-4 h-4 ml-2" />
            </>
          )}
        </AnimatedButton>
      </div>
    </div>
  );
}

export default LifeStoryInput;