import React, { memo } from 'react';
import { Star, Moon, Sun, Gem, Heart, Coins, Briefcase, Shield, Sparkles, BookOpen, Brain, UserPlus, Scroll } from 'lucide-react';
import { AnimatedCard, Button } from '../ui';

export interface DivinationMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  color: string;
  category: 'western' | 'eastern' | 'psychology';
}

// 完整的占卜方法配置
export const divinationMethods: DivinationMethod[] = [
  // 西方占卜
  {
    id: 'tarot',
    name: '塔罗占卜',
    description: '通过神秘的塔罗牌获得人生指引',
    icon: <Star className="w-8 h-8" />,
    gradient: 'from-purple-600 to-pink-600',
    color: 'purple',
    category: 'western'
  },
  {
    id: 'astrology',
    name: '星座占星',
    description: '解读星象运行对您的影响',
    icon: <Moon className="w-8 h-8" />,
    gradient: 'from-blue-600 to-indigo-600',
    color: 'blue',
    category: 'western'
  },
  {
    id: 'numerology',
    name: '数字命理',
    description: '通过数字能量揭示命运密码',
    icon: <Gem className="w-8 h-8" />,
    gradient: 'from-emerald-600 to-teal-600',
    color: 'emerald',
    category: 'western'
  },
  // 东方占卜
  {
    id: 'lottery',
    name: '观音求签',
    description: '虔诚祈祷，抽取灵签获得指引',
    icon: <Sun className="w-8 h-8" />,
    gradient: 'from-orange-600 to-red-600',
    color: 'orange',
    category: 'eastern'
  },
  {
    id: 'jiaobei',
    name: '问卦擲筊',
    description: '擲筊求神明指示，获得明确答案',
    icon: <Coins className="w-8 h-8" />,
    gradient: 'from-green-600 to-teal-600',
    color: 'green',
    category: 'eastern'
  },
  {
    id: 'bazi',
    name: '八字命理',
    description: '传统八字分析，洞察人生格局',
    icon: <BookOpen className="w-8 h-8" />,
    gradient: 'from-yellow-600 to-orange-600',
    color: 'yellow',
    category: 'eastern'
  },
  {
    id: 'ziwei',
    name: '紫微斗数',
    description: '紫微星盘解析，预测命运轨迹',
    icon: <Sparkles className="w-8 h-8" />,
    gradient: 'from-purple-600 to-indigo-600',
    color: 'purple',
    category: 'eastern'
  },
  // 心理测试
  {
    id: 'personality',
    name: '性格测试',
    description: '深度分析性格特质，了解真实自我',
    icon: <Brain className="w-8 h-8" />,
    gradient: 'from-pink-600 to-rose-600',
    color: 'pink',
    category: 'psychology'
  },
  {
    id: 'compatibility',
    name: '配对打分',
    description: '测试两人缘分指数，分析感情匹配度',
    icon: <UserPlus className="w-8 h-8" />,
    gradient: 'from-red-600 to-pink-600',
    color: 'red',
    category: 'psychology'
  },
  {
    id: 'lifestory',
    name: '命格小故事',
    description: '生成专属命运故事，趣味了解人生轨迹',
    icon: <Scroll className="w-8 h-8" />,
    gradient: 'from-indigo-600 to-purple-600',
    color: 'indigo',
    category: 'psychology'
  }
];

interface DivinationMethodSelectorProps {
  selectedMethod: string;
  onMethodSelect: (methodId: string) => void;
  onBack?: () => void;
}

const DivinationMethodSelector = memo<DivinationMethodSelectorProps>(({ 
  selectedMethod, 
  onMethodSelect, 
  onBack 
}) => {
  const categories = {
    western: { name: '西方占卜', emoji: '🔮' },
    eastern: { name: '东方占卜', emoji: '☯️' },
    psychology: { name: '心理测试', emoji: '🧠' }
  };

  const groupedMethods = divinationMethods.reduce((acc, method) => {
    if (!acc[method.category]) {
      acc[method.category] = [];
    }
    acc[method.category].push(method);
    return acc;
  }, {} as Record<string, DivinationMethod[]>);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          选择占卜方式
        </h2>
        <p className="text-gray-400 text-lg">
          选择最适合您的占卜方式，开启神秘的心灵之旅
        </p>
      </div>

      {Object.entries(categories).map(([categoryKey, category]) => (
        <div key={categoryKey} className="space-y-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="text-2xl">{category.emoji}</span>
            {category.name}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedMethods[categoryKey]?.map((method) => (
              <AnimatedCard
                key={method.id}
                className={`cursor-pointer transition-all duration-300 transform hover:scale-105 border-2 ${
                  selectedMethod === method.id
                    ? `border-${method.color}-500 bg-${method.color}-500/10`
                    : 'border-gray-700 hover:border-gray-600'
                } bg-gray-800/50 backdrop-blur-sm`}
                onClick={() => onMethodSelect(method.id)}
              >
                <div className="p-6 text-center space-y-4">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${method.gradient} flex items-center justify-center text-white`}>
                    {method.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {method.name}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {method.description}
                    </p>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      ))}

      {onBack && (
        <div className="flex justify-center pt-6">
          <Button
            onClick={onBack}
            variant="outline"
            className="px-8 py-3"
          >
            ← 返回
          </Button>
        </div>
      )}
    </div>
  );
});

DivinationMethodSelector.displayName = 'DivinationMethodSelector';

export default DivinationMethodSelector;