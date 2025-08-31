import React, { memo } from 'react';
import { Heart, Briefcase, Coins, Shield, Sparkles } from 'lucide-react';
import { AnimatedCard, Button } from '../ui';

export interface ReadingType {
  id: string;
  name: string;
  icon: React.ReactNode;
  description?: string;
}

// 占卜类型配置
export const readingTypes: ReadingType[] = [
  { 
    id: 'love', 
    name: '爱情运势', 
    icon: <Heart className="w-6 h-6" />,
    description: '探索感情道路，寻找爱情真谛'
  },
  { 
    id: 'career', 
    name: '事业发展', 
    icon: <Briefcase className="w-6 h-6" />,
    description: '洞察职场运势，规划事业方向'
  },
  { 
    id: 'wealth', 
    name: '财富运势', 
    icon: <Coins className="w-6 h-6" />,
    description: '解读财运密码，把握财富机遇'
  },
  { 
    id: 'health', 
    name: '健康状况', 
    icon: <Shield className="w-6 h-6" />,
    description: '关注身心健康，获得养生建议'
  },
  { 
    id: 'general', 
    name: '综合运势', 
    icon: <Sparkles className="w-6 h-6" />,
    description: '全方位分析，获得全面指引'
  }
];

interface DivinationTypeSelectorProps {
  selectedType: string;
  selectedMethod: string;
  onTypeSelect: (typeId: string) => void;
  onBack: () => void;
}

const DivinationTypeSelector = memo<DivinationTypeSelectorProps>(({ 
  selectedType, 
  selectedMethod,
  onTypeSelect, 
  onBack 
}) => {
  // 某些占卜方法可能不需要类型选择，直接跳转到输入
  const methodsWithoutTypeSelection = ['personality', 'compatibility', 'lifestory', 'jiaobei'];
  
  if (methodsWithoutTypeSelection.includes(selectedMethod)) {
    // 对于这些方法，自动选择综合类型并跳转到输入阶段
    React.useEffect(() => {
      onTypeSelect('general');
    }, [onTypeSelect]);
    
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          选择占卜类型
        </h2>
        <p className="text-gray-400 text-lg">
          请选择您最关心的人生领域
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {readingTypes.map((type) => (
          <AnimatedCard
            key={type.id}
            className={`cursor-pointer transition-all duration-300 transform hover:scale-105 border-2 ${
              selectedType === type.id
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-700 hover:border-gray-600'
            } bg-gray-800/50 backdrop-blur-sm`}
            onClick={() => onTypeSelect(type.id)}
          >
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white">
                {type.icon}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  {type.name}
                </h4>
                {type.description && (
                  <p className="text-sm text-gray-400">
                    {type.description}
                  </p>
                )}
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>

      <div className="flex justify-center pt-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="px-8 py-3"
        >
          ← 返回选择占卜方式
        </Button>
      </div>
    </div>
  );
});

DivinationTypeSelector.displayName = 'DivinationTypeSelector';

export default DivinationTypeSelector;