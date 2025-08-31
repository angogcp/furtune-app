import { useState, useCallback } from 'react';
import { Button, Card, CardContent, Input, AnimatedButton } from '../ui';
import { Heart, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { getZodiacSign } from '../../data/astrologyData';
import { calculateLifeNumber } from '../../data/numerologyData';

interface CompatibilityTestProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

export function CompatibilityTest({ onComplete, onBack }: CompatibilityTestProps) {
  const [step, setStep] = useState<'person1' | 'person2' | 'complete'>('person1');
  const [person1Data, setPerson1Data] = useState({
    name: '',
    birthDate: '',
    mbtiType: '',
    zodiacSign: '',
    lifeNumber: 0
  });
  const [person2Data, setPerson2Data] = useState({
    name: '',
    birthDate: '',
    mbtiType: '',
    zodiacSign: '',
    lifeNumber: 0
  });

  const mbtiTypes = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
  ];

  const handlePerson1Submit = useCallback(() => {
    if (!person1Data.name || !person1Data.birthDate) {
      alert('请填写完整信息');
      return;
    }
    
    // 自动计算星座和生命数字
    const zodiacSign = getZodiacSign(person1Data.birthDate);
    const lifeNumber = calculateLifeNumber(person1Data.birthDate);
    
    setPerson1Data(prev => ({
      ...prev,
      zodiacSign: zodiacSign?.name || '',
      lifeNumber
    }));
    
    setStep('person2');
  }, [person1Data]);

  const handlePerson2Submit = useCallback(() => {
    if (!person2Data.name || !person2Data.birthDate) {
      alert('请填写完整信息');
      return;
    }
    
    // 自动计算星座和生命数字
    const zodiacSign = getZodiacSign(person2Data.birthDate);
    const lifeNumber = calculateLifeNumber(person2Data.birthDate);
    
    const finalPerson2Data = {
      ...person2Data,
      zodiacSign: zodiacSign?.name || '',
      lifeNumber
    };
    
    setPerson2Data(finalPerson2Data);
    
    // 完成配对测试
    onComplete({
      compatibilityData: {
        person1: person1Data,
        person2: finalPerson2Data
      }
    });
    
    setStep('complete');
  }, [person2Data, person1Data, onComplete]);

  const renderPersonForm = (personData: any, setPerson: any, personNumber: number) => (
    <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
      <CardContent className="p-8">
        <div className="flex items-center mb-6">
          <User className="w-8 h-8 text-red-600 mr-3" />
          <h2 className="text-xl font-bold text-gray-800">
            {personNumber === 1 ? '第一个人的信息' : '第二个人的信息'}
          </h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              姓名 *
            </label>
            <Input
              value={personData.name}
              onChange={(e) => setPerson((prev: any) => ({ ...prev, name: e.target.value }))}
              placeholder="请输入姓名"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              出生日期 *
            </label>
            <Input
              type="date"
              value={personData.birthDate}
              onChange={(e) => setPerson((prev: any) => ({ ...prev, birthDate: e.target.value }))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              MBTI性格类型（可选）
            </label>
            <select
              value={personData.mbtiType}
              onChange={(e) => setPerson((prev: any) => ({ ...prev, mbtiType: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">请选择MBTI类型</option>
              {mbtiTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              💡 系统将自动根据出生日期计算星座和生命数字
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (step === 'complete') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
          <CardContent className="p-8 text-center">
            <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">配对分析完成！</h2>
            <p className="text-gray-600 mb-6">
              系统正在为您分析 {person1Data.name} 和 {person2Data.name} 的匹配度...
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">{person1Data.name}</h3>
                <p className="text-sm text-gray-600">星座：{person1Data.zodiacSign}</p>
                <p className="text-sm text-gray-600">生命数字：{person1Data.lifeNumber}</p>
                {person1Data.mbtiType && (
                  <p className="text-sm text-gray-600">MBTI：{person1Data.mbtiType}</p>
                )}
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">{person2Data.name}</h3>
                <p className="text-sm text-gray-600">星座：{person2Data.zodiacSign}</p>
                <p className="text-sm text-gray-600">生命数字：{person2Data.lifeNumber}</p>
                {person2Data.mbtiType && (
                  <p className="text-sm text-gray-600">MBTI：{person2Data.mbtiType}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* 进度指示器 */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step === 'person1' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600'
          }`}>
            1
          </div>
          <div className="w-16 h-1 bg-gray-200 mx-2">
            <div className={`h-full bg-red-500 transition-all duration-300 ${
              step === 'person2' ? 'w-full' : 'w-0'
            }`} />
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step === 'person2' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            2
          </div>
        </div>
      </div>

      {step === 'person1' && (
        <>
          {renderPersonForm(person1Data, setPerson1Data, 1)}
          <div className="flex justify-between mt-6">
            <Button onClick={onBack} variant="outline" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
            <AnimatedButton
              onClick={handlePerson1Submit}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 flex items-center"
            >
              下一步
              <ArrowRight className="w-4 h-4 ml-2" />
            </AnimatedButton>
          </div>
        </>
      )}

      {step === 'person2' && (
        <>
          {renderPersonForm(person2Data, setPerson2Data, 2)}
          <div className="flex justify-between mt-6">
            <Button
              onClick={() => setStep('person1')}
              variant="outline"
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              上一步
            </Button>
            <AnimatedButton
              onClick={handlePerson2Submit}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 flex items-center"
            >
              开始分析
              <Heart className="w-4 h-4 ml-2" />
            </AnimatedButton>
          </div>
        </>
      )}
    </div>
  );
}

export default CompatibilityTest;