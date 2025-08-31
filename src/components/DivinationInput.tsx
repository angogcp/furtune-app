import React, { useState, memo } from 'react';
import type { DivinationMethodConfig, ReadingType } from '../types';
import { AnimatedCard } from './ui/AnimatedCard';
import { AnimatedText } from './ui/AnimatedText';
import { CardContent } from './ui/Card';
import { Input } from './ui/Input';

interface DivinationInputProps {
  method: DivinationMethodConfig;
  type: ReadingType;
  userInput: string;
  onUserInputChange: (input: string) => void;
  birthInfo: any;
  onBirthInfoChange: (info: any) => void;
  specialData: any;
  onSpecialDataChange: (data: any) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading: boolean;
  drawingResult?: any;
}

const DivinationInput: React.FC<DivinationInputProps> = ({
  method,
  type,
  userInput,
  onUserInputChange,
  birthInfo,
  onBirthInfoChange,
  specialData,
  onSpecialDataChange,
  onSubmit,
  onBack,
  isLoading,
  drawingResult
}) => {
  const [showDrawingAnimation, setShowDrawingAnimation] = useState(false);
  
  const handleDrawLottery = () => {
    setShowDrawingAnimation(true);
    // Simulate drawing process
    setTimeout(() => {
      const lotteryNumbers = Array.from({length: 100}, (_, i) => i + 1);
      const randomNumber = lotteryNumbers[Math.floor(Math.random() * lotteryNumbers.length)];
      const poems = [
        "天时地利人和，万事如意吉祥",
        "山重水复疑无路，柳暗花明又一村",
        "宝剑锋从磨砺出，梅花香自苦寒来",
        "海阔凭鱼跃，天高任鸟飞",
        "千里之行始于足下，积少成多终有成"
      ];
      const randomPoem = poems[Math.floor(Math.random() * poems.length)];
      
      const result = {
        type: 'lottery',
        number: randomNumber,
        poem: randomPoem
      };
      
      onSpecialDataChange({ ...specialData, drawingResult: result });
      setShowDrawingAnimation(false);
    }, 2000);
  };
  


  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
          {method.icon}
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">{method.name}</h2>
        <div className="flex items-center justify-center space-x-2 text-purple-300 mb-6">
          {type.icon}
          <span className="text-lg font-medium">{type.name}</span>
        </div>
      </div>
      
      <AnimatedCard 
        animationType="fade"
        delay={200}
        variant="glass"
        className="bg-slate-800/50 border-slate-600/50"
      >
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* 八字命理输入 */}
            {method.id === 'bazi' && (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="text-6xl">☯️</div>
                  <h3 className="text-xl font-semibold text-white">八字命理</h3>
                  <p className="text-slate-300">请准确填写您的出生信息，以便进行精准的八字分析</p>
                </div>
                
                {/* 八字说明 */}
                <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-xl p-6 border border-amber-600/30 space-y-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📜</div>
                    <h4 className="text-lg font-semibold text-amber-300 mb-3">八字命理说明</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-amber-800/20 rounded-lg p-3">
                      <div className="text-2xl mb-1">年</div>
                      <p className="text-amber-200 text-sm">年柱</p>
                      <p className="text-amber-300 text-xs">祖业根基</p>
                    </div>
                    <div className="bg-amber-800/20 rounded-lg p-3">
                      <div className="text-2xl mb-1">月</div>
                      <p className="text-amber-200 text-sm">月柱</p>
                      <p className="text-amber-300 text-xs">父母宫位</p>
                    </div>
                    <div className="bg-amber-800/20 rounded-lg p-3">
                      <div className="text-2xl mb-1">日</div>
                      <p className="text-amber-200 text-sm">日柱</p>
                      <p className="text-amber-300 text-xs">自身命格</p>
                    </div>
                    <div className="bg-amber-800/20 rounded-lg p-3">
                      <div className="text-2xl mb-1">时</div>
                      <p className="text-amber-200 text-sm">时柱</p>
                      <p className="text-amber-300 text-xs">子女后代</p>
                    </div>
                  </div>
                </div>
                
                {/* 出生信息输入 */}
                <AnimatedCard 
                  animationType="slide"
                  delay={400}
                  variant="soft"
                  className="space-y-4 bg-slate-700/20 border-amber-600/30"
                >
                  <CardContent className="p-6">
                    <AnimatedText 
                      text="生辰八字信息"
                      className="text-lg font-semibold text-white mb-4"
                      animationType="fade-in"
                      delay={500}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">出生日期</label>
                        <Input
                          type="date"
                          value={birthInfo.year && birthInfo.month && birthInfo.day ? `${birthInfo.year}-${birthInfo.month.toString().padStart(2, '0')}-${birthInfo.day.toString().padStart(2, '0')}` : ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const dateValue = e.target.value;
                            if (dateValue) {
                              const [year, month, day] = dateValue.split('-').map(Number);
                              onBirthInfoChange({...birthInfo, year, month, day});
                            } else {
                              onBirthInfoChange({...birthInfo, year: 0, month: 0, day: 0});
                            }
                          }}
                          className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 hover:shadow-glow"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">出生时间</label>
                        <Input
                          type="time"
                          value={birthInfo.time}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onBirthInfoChange({...birthInfo, time: e.target.value})}
                          className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 hover:shadow-glow"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">出生地点</label>
                        <Input
                          type="text"
                          value={birthInfo.place}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onBirthInfoChange({...birthInfo, place: e.target.value})}
                          placeholder="请输入出生城市，如：北京、上海"
                          className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 hover:shadow-glow"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">性别</label>
                        <select
                          value={birthInfo.gender}
                          onChange={(e) => onBirthInfoChange({...birthInfo, gender: e.target.value})}
                          className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 hover:shadow-glow"
                        >
                          <option value="">请选择</option>
                          <option value="男">男</option>
                          <option value="女">女</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </AnimatedCard>
                
                {/* 问题输入 */}
                <AnimatedCard 
                  animationType="scale"
                  delay={600}
                  variant="soft"
                  className="bg-slate-700/20 border-amber-600/30"
                >
                  <CardContent className="p-6">
                    <AnimatedText 
                      text="您的问题"
                      className="block text-sm font-medium text-white mb-2"
                      animationType="fade-in"
                      delay={700}
                    />
                    <textarea
                      value={userInput}
                      onChange={(e) => onUserInputChange(e.target.value)}
                      placeholder="请输入您想要了解的命理问题，如：事业发展、财运状况、婚姻感情等..."
                      className="w-full h-24 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none transition-all duration-300 hover:shadow-glow"
                    />
                  </CardContent>
                </AnimatedCard>
                
                {/* 五行展示 */}
                <AnimatedCard 
                  animationType="glow"
                  delay={800}
                  variant="glass"
                  className="bg-slate-800/30"
                >
                  <CardContent className="p-4">
                    <AnimatedText 
                      text="五行相生相克"
                      className="text-sm font-medium text-white mb-3 text-center"
                      animationType="fade-in"
                      delay={900}
                    />
                    <div className="flex justify-center space-x-4 text-xs">
                      {[
                        { name: '金', color: 'yellow' },
                        { name: '木', color: 'green' },
                        { name: '水', color: 'blue' },
                        { name: '火', color: 'red' },
                        { name: '土', color: 'amber' }
                      ].map((element, index) => (
                        <span 
                          key={element.name}
                          className={`px-3 py-1 bg-${element.color}-600/30 text-${element.color}-300 rounded-full animate-pulse-soft hover:scale-110 transition-transform duration-300 cursor-pointer`}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          {element.name}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </AnimatedCard>
              </div>
            )}
            
            {/* 紫微斗数输入 */}
            {method.id === 'ziwei' && (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="text-6xl">⭐</div>
                  <h3 className="text-xl font-semibold text-white">紫微斗数</h3>
                  <p className="text-slate-300">请填写详细的出生信息，以便排出准确的紫微星盘</p>
                </div>
                
                {/* 紫微斗数说明 */}
                <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-600/30 space-y-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🌟</div>
                    <h4 className="text-lg font-semibold text-purple-300 mb-3">紫微星盘十二宫</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
                    <div className="bg-purple-800/20 rounded-lg p-2">
                      <p className="text-purple-200 font-medium">命宫</p>
                      <p className="text-purple-300">主性格</p>
                    </div>
                    <div className="bg-purple-800/20 rounded-lg p-2">
                      <p className="text-purple-200 font-medium">财帛宫</p>
                      <p className="text-purple-300">主财运</p>
                    </div>
                    <div className="bg-purple-800/20 rounded-lg p-2">
                      <p className="text-purple-200 font-medium">事业宫</p>
                      <p className="text-purple-300">主工作</p>
                    </div>
                    <div className="bg-purple-800/20 rounded-lg p-2">
                      <p className="text-purple-200 font-medium">夫妻宫</p>
                      <p className="text-purple-300">主婚姻</p>
                    </div>
                  </div>
                </div>
                
                {/* 出生信息输入 */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">紫微星盘信息</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">出生日期</label>
                      <input
                        type="date"
                        value={birthInfo.year && birthInfo.month && birthInfo.day ? `${birthInfo.year}-${birthInfo.month.toString().padStart(2, '0')}-${birthInfo.day.toString().padStart(2, '0')}` : ''}
                        onChange={(e) => {
                          const dateValue = e.target.value;
                          if (dateValue) {
                            const [year, month, day] = dateValue.split('-').map(Number);
                            onBirthInfoChange({...birthInfo, year, month, day});
                          } else {
                            onBirthInfoChange({...birthInfo, year: 0, month: 0, day: 0});
                          }
                        }}
                        className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">出生时间</label>
                      <input
                        type="time"
                        value={birthInfo.time}
                        onChange={(e) => onBirthInfoChange({...birthInfo, time: e.target.value})}
                        className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">出生地点</label>
                      <input
                        type="text"
                        value={birthInfo.place}
                        onChange={(e) => onBirthInfoChange({...birthInfo, place: e.target.value})}
                        placeholder="请输入出生城市，用于计算经纬度"
                        className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">性别</label>
                      <select
                        value={birthInfo.gender}
                        onChange={(e) => onBirthInfoChange({...birthInfo, gender: e.target.value})}
                        className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">请选择</option>
                        <option value="男">男</option>
                        <option value="女">女</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* 问题输入 */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">您的问题</label>
                  <textarea
                    value={userInput}
                    onChange={(e) => onUserInputChange(e.target.value)}
                    placeholder="请输入您想要了解的问题，如：命宫分析、财运预测、事业发展、感情婚姻等..."
                    className="w-full h-24 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>
                
                {/* 星曜展示 */}
                <div className="bg-slate-800/30 rounded-xl p-4">
                  <h5 className="text-sm font-medium text-white mb-3">主要星曜</h5>
                  <div className="flex flex-wrap justify-center gap-2 text-xs">
                    <span className="px-2 py-1 bg-purple-600/30 text-purple-300 rounded-full">紫微</span>
                    <span className="px-2 py-1 bg-indigo-600/30 text-indigo-300 rounded-full">天机</span>
                    <span className="px-2 py-1 bg-blue-600/30 text-blue-300 rounded-full">太阳</span>
                    <span className="px-2 py-1 bg-cyan-600/30 text-cyan-300 rounded-full">武曲</span>
                    <span className="px-2 py-1 bg-teal-600/30 text-teal-300 rounded-full">天府</span>
                    <span className="px-2 py-1 bg-green-600/30 text-green-300 rounded-full">太阴</span>
                  </div>
                </div>
              </div>
            )}

            {/* 兼容性测试 */}
            {method.id === 'compatibility' && (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="text-6xl">💕</div>
                  <h3 className="text-xl font-semibold text-white">配对分析</h3>
                  <p className="text-slate-300">请填写双方的基本信息进行配对分析</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-white">您的信息</h4>
                    <Input
                      type="text"
                      placeholder="您的姓名"
                      className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white"
                    />
                    <Input
                      type="date"
                      className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white"
                    />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-white">对方信息</h4>
                    <Input
                      type="text"
                      placeholder="对方姓名"
                      className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white"
                      onChange={() => {}}
                    />
                    <Input
                      type="date"
                      className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">配对问题</label>
                  <textarea
                    value={userInput}
                    onChange={(e) => onUserInputChange(e.target.value)}
                    placeholder="请输入您想了解的配对问题..."
                    className="w-full h-24 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            )}

            {/* 观音求签 */}
            {method.id === 'lottery' && (
              <div className="text-center space-y-6">
                <div className="space-y-4">
                  <div className="text-6xl animate-pulse">🙏</div>
                  <h3 className="text-xl font-semibold text-white">观音求签</h3>
                  <p className="text-slate-300">请虔诚地在心中默念您的问题，然后点击下方按钮抽签</p>
                </div>
                
                {/* 祈祷仪式步骤 */}
                <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-xl p-6 border border-yellow-600/30 space-y-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🕯️</div>
                    <h4 className="text-lg font-semibold text-yellow-300 mb-3">祈祷仪式</h4>
                  </div>
                  
                  <div className="space-y-3 text-left">
                    <div className="flex items-start space-x-3">
                      <span className="text-yellow-400 font-bold">1.</span>
                      <div>
                        <p className="text-yellow-200 font-medium">净心静气</p>
                        <p className="text-yellow-300 text-sm">请先深呼吸三次，让心境平静下来</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <span className="text-yellow-400 font-bold">2.</span>
                      <div>
                        <p className="text-yellow-200 font-medium">虔诚祈祷</p>
                        <p className="text-yellow-300 text-sm">在心中默念："南无观世音菩萨，弟子诚心求签，请菩萨慈悲指点迷津"</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <span className="text-yellow-400 font-bold">3.</span>
                      <div>
                        <p className="text-yellow-200 font-medium">专心问事</p>
                        <p className="text-yellow-300 text-sm">在心中清晰地描述您想要询问的问题</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 问题输入 */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">您的问题（可选）</label>
                  <textarea
                    value={userInput}
                    onChange={(e) => onUserInputChange(e.target.value)}
                    placeholder="您可以在此记录您的问题，或直接在心中默念..."
                    className="w-full h-20 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                  />
                </div>
                
                {/* 签筒动画区域 */}
                <div className="relative">
                  {showDrawingAnimation ? (
                    <div className="space-y-4">
                      <div className="text-8xl animate-bounce">
                        🏺
                      </div>
                      <div className="flex justify-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                      <p className="text-yellow-300 text-sm animate-pulse">正在为您抽取灵签...</p>
                    </div>
                  ) : drawingResult && drawingResult.type === 'lottery' ? (
                    <div className="space-y-4">
                      <div className="text-6xl animate-pulse">
                        📜
                      </div>
                      <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded-xl p-4 border border-yellow-500/30">
                        <h4 className="text-yellow-300 font-bold text-lg mb-2">第{drawingResult.number}签</h4>
                        <p className="text-yellow-200 text-sm">{drawingResult.poem}</p>
                      </div>
                      <div className="bg-gradient-to-r from-amber-900/40 to-yellow-900/40 rounded-xl p-4 border border-amber-500/30">
                        <p className="text-amber-200 text-sm mb-3">🙏 请仔细阅读签文内容，准备好后点击下方按钮获取详细解读</p>
                        <div className="text-center">
                          <button
                            onClick={onSubmit}
                            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-amber-500/25"
                          >
                            <span className="flex items-center justify-center">
                              🔮 继续占卜解读
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-8xl mb-4 transform transition-transform duration-500 hover:scale-110">
                        🏺
                      </div>
                      <p className="text-sm text-gray-500 mb-4">点击下方按钮开始抽签</p>
                      <button
                        onClick={handleDrawLottery}
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-yellow-500/25"
                      >
                        🙏 开始抽签
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MBTI性格测试 */}
            {method.id === 'numerology' && (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="text-6xl">🧠</div>
                  <h3 className="text-xl font-semibold text-white">MBTI性格测试</h3>
                  <p className="text-slate-300">请描述您的性格特点和行为习惯</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">性格描述</label>
                  <textarea
                    value={userInput}
                    onChange={(e) => onUserInputChange(e.target.value)}
                    placeholder="请描述您的性格特点、行为习惯、思维方式等..."
                    className="w-full h-32 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            )}

            {/* 人生故事 */}
            {method.id === 'palmistry' && (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="text-6xl">📖</div>
                  <h3 className="text-xl font-semibold text-white">人生故事</h3>
                  <p className="text-slate-300">请分享您的人生经历和故事</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">您的姓名</label>
                    <Input
                      type="text"
                      placeholder="请输入您的姓名"
                      className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">人生故事</label>
                    <textarea
                      value={userInput}
                      onChange={(e) => onUserInputChange(e.target.value)}
                      placeholder="请分享您的人生经历、重要事件、感悟等..."
                      className="w-full h-32 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 通用问题输入（用于其他占卜方法） */}
            {!['bazi', 'ziwei', 'compatibility', 'lottery', 'numerology', 'palmistry'].includes(method.id) && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">您的问题</label>
                <textarea
                  value={userInput}
                  onChange={(e) => onUserInputChange(e.target.value)}
                  placeholder="请输入您的问题..."
                  className="w-full h-24 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>
            )}
            
            {/* 操作按钮 */}
            {!['compatibility', 'numerology', 'palmistry'].includes(method.id) && (
              <div className="flex justify-between mt-8">
                <button
                  onClick={onBack}
                  className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-xl transition-colors duration-300"
                >
                  返回
                </button>
                {method.id !== 'lottery' || (drawingResult && drawingResult.type === 'lottery') ? (
                  <button
                    onClick={onSubmit}
                    disabled={isLoading}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? '占卜中...' : '开始占卜'}
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </CardContent>
      </AnimatedCard>
    </div>
  );
};

export default memo(DivinationInput);