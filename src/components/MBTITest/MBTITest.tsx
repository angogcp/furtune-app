import { useState, useCallback } from 'react';
import { Button, Card, CardContent, AnimatedButton } from '../ui';
import { mbtiQuestions } from '../../data/mbtiData';
import { Brain, ArrowLeft, ArrowRight, CheckCircle, User, Calendar } from 'lucide-react';

interface MBTITestProps {
  onComplete: (result: any) => void;
  onBack: () => void;
}

export function MBTITest({ onComplete, onBack }: MBTITestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: number }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [showPersonalInfo, setShowPersonalInfo] = useState(true);

  const handleAnswer = useCallback((questionId: string, optionIndex: number) => {
    const question = mbtiQuestions[currentQuestion];
    const selectedOption = question.options[optionIndex];
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption.score
    }));
  }, [currentQuestion]);

  const handleNext = useCallback(() => {
    if (currentQuestion < mbtiQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // 测试完成
      setIsCompleted(true);
      onComplete({
        answers: answers,
        name: name,
        birthDate: birthDate
      });
    }
  }, [currentQuestion, answers, name, birthDate, onComplete]);

  const handlePrevious = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  }, [currentQuestion]);

  const currentQuestionData = mbtiQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / mbtiQuestions.length) * 100;
  const hasAnswered = currentQuestionData && answers[currentQuestionData.id] !== undefined;

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">MBTI测试完成！</h2>
            <p className="text-gray-600 mb-6">
              您已完成所有测试题目，系统正在为您生成详细的性格分析报告...
            </p>
            <AnimatedButton
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
            >
              查看完整报告
            </AnimatedButton>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 个人信息输入界面
  if (showPersonalInfo) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <Brain className="w-8 h-8 text-pink-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-800">MBTI性格测试</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              在开始测试前，请先填写您的基本信息：
            </p>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2" />
                  姓名
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="请输入您的姓名"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  出生日期
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button
                onClick={onBack}
                variant="outline"
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回
              </Button>
              
              <AnimatedButton
                onClick={() => setShowPersonalInfo(false)}
                disabled={!name.trim() || !birthDate}
                className={`flex items-center ${
                  name.trim() && birthDate
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                开始测试
                <ArrowRight className="w-4 h-4 ml-2" />
              </AnimatedButton>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* 进度条 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            问题 {currentQuestion + 1} / {mbtiQuestions.length}
          </span>
          <span className="text-sm font-medium text-gray-600">
            {Math.round(progress)}% 完成
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 问题卡片 */}
      <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200 mb-6">
        <CardContent className="p-8">
          <div className="flex items-center mb-6">
            <Brain className="w-8 h-8 text-pink-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-800">MBTI性格测试</h2>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {currentQuestionData?.question}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              请选择最符合您真实想法的选项：
            </p>
            
            <div className="space-y-3">
              {currentQuestionData?.options.map((option, index) => {
                const isSelected = answers[currentQuestionData.id] === option.score;
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(currentQuestionData.id, index)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-pink-500 bg-pink-100 text-pink-800'
                        : 'border-gray-200 bg-white hover:border-pink-300 hover:bg-pink-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        isSelected
                          ? 'border-pink-500 bg-pink-500'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <div className="w-full h-full rounded-full bg-white scale-50" />
                        )}
                      </div>
                      <span className="font-medium">{option.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 导航按钮 */}
      <div className="flex justify-between">
        <Button
          onClick={currentQuestion === 0 ? () => setShowPersonalInfo(true) : handlePrevious}
          variant="outline"
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {currentQuestion === 0 ? '返回信息页' : '上一题'}
        </Button>
        
        <AnimatedButton
          onClick={handleNext}
          disabled={!hasAnswered}
          className={`flex items-center ${
            hasAnswered
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {currentQuestion === mbtiQuestions.length - 1 ? '完成测试' : '下一题'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </AnimatedButton>
      </div>
    </div>
  );
}

export default MBTITest;