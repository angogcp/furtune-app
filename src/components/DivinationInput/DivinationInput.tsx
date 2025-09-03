import React, { memo, useState } from 'react';
import type { DivinationMethodId, BirthInfo, PartnerInfo } from '../../types';
import { TarotCardSelector } from '../TarotCardSelector/TarotCardSelector';
import { TarotSpreadSelector } from '../TarotSpreadSelector/TarotSpreadSelector';
import { TarotCardGrid } from '../TarotCardGrid/TarotCardGrid';
import { tarotSpreads } from '../../data/tarotCards';
import { User, Calendar, Clock, MapPin } from 'lucide-react';

interface DivinationInputProps {
  selectedMethod: DivinationMethodId;
  userInput: string;
  setUserInput: (input: string) => void;
  birthInfo: BirthInfo;
  setBirthInfo: (info: BirthInfo) => void;
  partnerInfo: PartnerInfo;
  setPartnerInfo: (info: PartnerInfo) => void;
  specialData: Record<string, any>;
  setSpecialData: (data: Record<string, any>) => void;
  isDrawing: boolean;
  drawingResult: any;
  jiaobeiBlessConfirmed: boolean;
  setJiaobeiBlessConfirmed: (confirmed: boolean) => void;
  onBack: () => void;
  onSubmit: () => void;
  onStartDrawing: () => void;
  onNextStep: () => void;
}

const DivinationInput = memo<DivinationInputProps>(({
  selectedMethod,
  userInput,
  setUserInput,
  birthInfo,
  setBirthInfo,
  partnerInfo,
  setPartnerInfo,
  specialData,
  setSpecialData,
  isDrawing,
  drawingResult,
  jiaobeiBlessConfirmed,
  setJiaobeiBlessConfirmed,
  onBack,
  onSubmit,
  onStartDrawing,
  onNextStep
}) => {
  const [tarotStep, setTarotStep] = useState<'spreadSelection' | 'cardSelection' | 'manualSelection' | 'question'>('spreadSelection');
  const [selectedCardCount, setSelectedCardCount] = useState<number>(0);
  const [selectedSpread, setSelectedSpread] = useState<string>('');
  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  const handleSpreadSelect = (spreadId: string) => {
    const spread = tarotSpreads.find(s => s.id === spreadId);
    if (spread) {
      setSelectedSpread(spreadId);
      setSelectedCardCount(spread.positions.length);
      setSpecialData({
        ...specialData,
        selectedSpread: spreadId,
        cardCount: spread.positions.length
      });
      setTarotStep('manualSelection');
    }
  };

  const handleCardSelect = (cardIndex: number) => {
    const isSelected = selectedCards.includes(cardIndex);
    const maxCards = selectedCardCount;
    const canSelect = !isSelected && selectedCards.length < maxCards;
    
    let newSelected;
    if (isSelected) {
      newSelected = selectedCards.filter(i => i !== cardIndex);
    } else if (canSelect) {
      newSelected = [...selectedCards, cardIndex];
    } else {
      return;
    }
    
    setSelectedCards(newSelected);
    setSpecialData({
      ...specialData,
      selectedCards: newSelected
    });
  };

  const handleClearSelection = () => {
    setSelectedCards([]);
    setSpecialData({
      ...specialData,
      selectedCards: []
    });
  };

  const handleTarotSubmit = () => {
    console.log('=== TAROT SUBMIT CLICKED ===');
    console.log('selectedCards.length:', selectedCards.length);
    console.log('selectedCardCount:', selectedCardCount);
    console.log('userInput.trim():', userInput.trim());
    
    if (selectedCards.length === selectedCardCount && userInput.trim()) {
      setSpecialData({
        ...specialData,
        selectedCards,
        cardCount: selectedCardCount,
        selectedSpread
      });
      console.log('Calling onSubmit for tarot');
      onSubmit();
    } else {
      console.log('Tarot submit conditions not met');
    }
  };

  const renderTarotInput = () => {
    if (tarotStep === 'spreadSelection') {
      return (
        <div className="space-y-6">
          <TarotSpreadSelector
            selectedSpread={selectedSpread}
            onSpreadSelect={handleSpreadSelect}
          />
          
          <div className="flex gap-3">
            <button
              onClick={() => onBack()}
              className="flex-1 bg-slate-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-slate-700 transition-colors"
            >
              返回上一步
            </button>
          </div>
        </div>
      );
    } else if (tarotStep === 'manualSelection') {
      return (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="text-6xl animate-pulse">🔮</div>
            <h3 className="text-xl font-semibold text-white">手动选择塔罗牌</h3>
            <p className="text-slate-300">从78张塔罗牌中选择 {selectedCardCount} 张</p>
          </div>
          
          <TarotCardGrid
            selectedCards={selectedCards}
            onCardSelect={handleCardSelect}
            onClearSelection={handleClearSelection}
            maxCards={selectedCardCount}
            selectedSpread={selectedSpread}
          />
          
          <div className="flex gap-3">
            <button
              onClick={() => setTarotStep('spreadSelection')}
              className="flex-1 bg-slate-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-slate-700 transition-colors"
            >
              返回选择牌阵
            </button>
            <button
              onClick={() => setTarotStep('question')}
              disabled={selectedCards.length !== selectedCardCount}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed"
            >
              下一步：输入问题
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="text-6xl animate-pulse">🔮</div>
            <h3 className="text-xl font-semibold text-white">塔罗占卜</h3>
            <p className="text-slate-300">请专注于您的问题，让塔罗牌为您揭示答案</p>
          </div>
          
          {/* 已选择的牌阵和卡片预览 */}
          <div className="bg-slate-800/30 rounded-xl p-4">
            <h4 className="text-white font-medium mb-3">已选择配置</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">牌阵：</span>
                <span className="text-purple-300">{tarotSpreads.find(s => s.id === selectedSpread)?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">已选牌数：</span>
                <span className="text-purple-300">{selectedCards.length} / {selectedCardCount}</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">您的问题</label>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="请输入您想要占卜的具体问题，越详细越能得到准确的指引..."
              className="w-full h-24 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>
          
          {/* 状态提示 */}
          {(!userInput.trim() || selectedCards.length !== selectedCardCount) && (
            <div className="bg-yellow-900/30 border border-yellow-600/30 rounded-xl p-4">
              <div className="text-yellow-300 text-sm">
                💡 开始占卜需要满足以下条件：
                <ul className="mt-2 space-y-1 ml-4">
                  <li className={userInput.trim() ? 'text-green-400' : 'text-yellow-300'}>
                    {userInput.trim() ? '✓' : '•'} 输入您的占卜问题
                  </li>
                  <li className={selectedCards.length === selectedCardCount ? 'text-green-400' : 'text-yellow-300'}>
                    {selectedCards.length === selectedCardCount ? '✓' : '•'} 选择 {selectedCardCount} 张塔罗牌
                    <span className="ml-2 text-xs">(当前: {selectedCards.length}/{selectedCardCount})</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
          
          <div className="flex gap-3">
            <button
              onClick={() => setTarotStep('manualSelection')}
              className="flex-1 bg-slate-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-slate-700 transition-colors"
            >
              返回选择卡片
            </button>
            <button
              onClick={handleTarotSubmit}
              disabled={!userInput.trim() || selectedCards.length !== selectedCardCount}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed"
            >
              🔮 开始占卜
            </button>
          </div>
        </div>
      );
    }
  };

  const renderAstrologyInput = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="text-6xl animate-pulse">⭐</div>
        <h3 className="text-xl font-semibold text-white">星座占星</h3>
        <p className="text-slate-300">基于您的出生信息，为您解读星象密码</p>
      </div>
      
      {/* 出生信息表单 */}
      <div className="bg-slate-800/30 rounded-xl p-6 space-y-4">
        <h4 className="text-white font-medium mb-4">📅 出生信息</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">出生日期 *</label>
            <input
              type="date"
              value={`${birthInfo.year}-${birthInfo.month.toString().padStart(2, '0')}-${birthInfo.day.toString().padStart(2, '0')}`}
              onChange={(e) => {
                const dateValue = e.target.value;
                if (dateValue) {
                  const [year, month, day] = dateValue.split('-').map(Number);
                  setBirthInfo({
                    ...birthInfo,
                    year,
                    month,
                    day
                  });
                }
              }}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="yyyy/mm/dd"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              出生时间
              <span className="text-xs text-slate-400 ml-1">(可选)</span>
            </label>
            <input
              type="time"
              value={birthInfo.time}
              onChange={(e) => setBirthInfo({
                ...birthInfo, 
                time: e.target.value
              })}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            出生地点
            <span className="text-xs text-slate-400 ml-1">(可选)</span>
          </label>
          <input
            type="text"
            value={birthInfo.place}
            onChange={(e) => setBirthInfo({
              ...birthInfo, 
              place: e.target.value
            })}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="例如：北京市、上海市、广州市"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          您的问题
          <span className="text-xs text-slate-400 ml-1">(请尽量具体和明确)</span>
        </label>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="请输入您想要咨询的问题，例如：\n• 我的爱情运势如何？\n• 今年事业发展怎么样？\n• 最近需要注意什么？"
          className="w-full h-24 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>
    </div>
  );

  const renderGenericInput = (icon: string, title: string, description: string) => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="text-6xl animate-pulse">{icon}</div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-slate-300">{description}</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white mb-2">您的问题</label>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="请输入您想要了解的问题..."
          className="w-full h-24 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
        />
      </div>
    </div>
  );

  const canSubmit = () => {
    if (selectedMethod === 'tarot') {
      if (tarotStep === 'question') {
        return userInput.trim() && selectedCards.length === selectedCardCount;
      }
      return false;
    }
    return userInput.trim();
  };

  const renderInputContent = () => {
    switch (selectedMethod) {
      case 'tarot':
        return renderTarotInput();
      case 'astrology':
        return renderAstrologyInput();
      case 'numerology':
        return renderNumerologyInput();
      case 'bazi':
        return renderBaziInput();
      case 'ziwei':
        return renderZiweiInput();
      case 'compatibility':
        return renderCompatibilityInput();
      case 'lottery':
        return renderLotteryInput();
      case 'jiaobei':
        return renderJiaobeiInput();
      case 'personality':
        return renderPersonalityInput();
      case 'lifestory':
        return renderLifestoryInput();
      default:
        return null;
    }
  };

  // 新增的专门输入组件
  const renderNumerologyInput = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="text-6xl animate-pulse">🔢</div>
        <h3 className="text-xl font-semibold text-white">数字命理</h3>
        <p className="text-slate-300">通过数字能量揭示命运密码</p>
      </div>
      
      <div className="bg-slate-800/30 rounded-xl p-6 space-y-4">
        <h4 className="text-white font-medium mb-4">📅 基本信息</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">出生日期 *</label>
            <input
              type="date"
              value={`${birthInfo.year}-${birthInfo.month.toString().padStart(2, '0')}-${birthInfo.day.toString().padStart(2, '0')}`}
              onChange={(e) => {
                const dateValue = e.target.value;
                if (dateValue) {
                  const [year, month, day] = dateValue.split('-').map(Number);
                  setBirthInfo({...birthInfo, year, month, day});
                }
              }}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">姓名 *</label>
            <input
              type="text"
              value={partnerInfo.name}
              onChange={(e) => setPartnerInfo({...partnerInfo, name: e.target.value})}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500"
              placeholder="请输入您的姓名"
            />
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white mb-2">您的问题</label>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="请输入您想要了解的问题...\n• 我的性格特质如何？\n• 今年的运势怎么样？"
          className="w-full h-24 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 resize-none"
        />
      </div>
    </div>
  );

  const renderBaziInput = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="text-6xl animate-pulse">☯️</div>
        <h3 className="text-xl font-semibold text-white">八字命理</h3>
        <p className="text-slate-300">传统八字分析，洞察人生格局</p>
      </div>
      
      <div className="bg-slate-800/30 rounded-xl p-6 space-y-4">
        <h4 className="text-white font-medium mb-4">📅 详细出生信息</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">出生日期 *</label>
            <input
              type="date"
              value={`${birthInfo.year}-${birthInfo.month.toString().padStart(2, '0')}-${birthInfo.day.toString().padStart(2, '0')}`}
              onChange={(e) => {
                const dateValue = e.target.value;
                if (dateValue) {
                  const [year, month, day] = dateValue.split('-').map(Number);
                  setBirthInfo({...birthInfo, year, month, day});
                }
              }}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">出生时间 *</label>
            <input
              type="time"
              value={birthInfo.time}
              onChange={(e) => setBirthInfo({...birthInfo, time: e.target.value})}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">出生地点</label>
            <input
              type="text"
              value={birthInfo.place}
              onChange={(e) => setBirthInfo({...birthInfo, place: e.target.value})}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500"
              placeholder="请输入出生城市"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">性别</label>
            <select
              value={birthInfo.gender}
              onChange={(e) => setBirthInfo({...birthInfo, gender: e.target.value as 'male' | 'female'})}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500"
            >
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white mb-2">您的问题</label>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="请输入您想要了解的问题...\n• 我的命格如何？\n• 今年运势怎么样？\n• 事业发展方向？"
          className="w-full h-24 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-yellow-500 resize-none"
        />
      </div>
    </div>
  );

  const renderZiweiInput = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="text-6xl animate-pulse">🎯</div>
        <h3 className="text-xl font-semibold text-white">紫微斗数</h3>
        <p className="text-slate-300">紫微星盘解析，预测命运轨迹</p>
      </div>
      
      <div className="bg-slate-800/30 rounded-xl p-6 space-y-4">
        <h4 className="text-white font-medium mb-4">📅 详细出生信息</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">出生日期 *</label>
            <input
              type="date"
              value={`${birthInfo.year}-${birthInfo.month.toString().padStart(2, '0')}-${birthInfo.day.toString().padStart(2, '0')}`}
              onChange={(e) => {
                const dateValue = e.target.value;
                if (dateValue) {
                  const [year, month, day] = dateValue.split('-').map(Number);
                  setBirthInfo({...birthInfo, year, month, day});
                }
              }}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">出生时间 *</label>
            <input
              type="time"
              value={birthInfo.time}
              onChange={(e) => setBirthInfo({...birthInfo, time: e.target.value})}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">性别</label>
          <select
            value={birthInfo.gender}
            onChange={(e) => setBirthInfo({...birthInfo, gender: e.target.value as 'male' | 'female'})}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="male">男</option>
            <option value="female">女</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white mb-2">您的问题</label>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="请输入您想要了解的问题...\n• 我的紫微星盘如何？\n• 命宫主星是什么？\n• 今年大运如何？"
          className="w-full h-24 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 resize-none"
        />
      </div>
    </div>
  );

  const renderCompatibilityInput = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="text-6xl animate-pulse">💕</div>
        <h3 className="text-xl font-semibold text-white">缘分匹配</h3>
        <p className="text-slate-300">分析您与他人的缘分匹配度</p>
      </div>
      
      <div className="bg-slate-800/30 rounded-xl p-6 space-y-4">
        <h4 className="text-white font-medium mb-4">👫 双方信息</h4>
        <div className="space-y-6">
          <div className="bg-slate-700/30 rounded-lg p-4">
            <h5 className="text-white font-medium mb-3">您的信息</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">您的出生日期 *</label>
                <input
                  type="date"
                  value={`${birthInfo.year}-${birthInfo.month.toString().padStart(2, '0')}-${birthInfo.day.toString().padStart(2, '0')}`}
                  onChange={(e) => {
                    const dateValue = e.target.value;
                    if (dateValue) {
                      const [year, month, day] = dateValue.split('-').map(Number);
                      setBirthInfo({...birthInfo, year, month, day});
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">您的性别</label>
                <select
                  value={birthInfo.gender}
                  onChange={(e) => setBirthInfo({...birthInfo, gender: e.target.value as 'male' | 'female'})}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-red-500"
                >
                  <option value="male">男</option>
                  <option value="female">女</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-700/30 rounded-lg p-4">
            <h5 className="text-white font-medium mb-3">对方信息</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">对方姓名</label>
                <input
                  type="text"
                  value={partnerInfo.name}
                  onChange={(e) => setPartnerInfo({...partnerInfo, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-red-500"
                  placeholder="请输入对方姓名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">对方出生日期 *</label>
                <input
                  type="date"
                  value={partnerInfo.birthInfo ? `${partnerInfo.birthInfo.year}-${partnerInfo.birthInfo.month.toString().padStart(2, '0')}-${partnerInfo.birthInfo.day.toString().padStart(2, '0')}` : ''}
                  onChange={(e) => {
                    const dateValue = e.target.value;
                    if (dateValue) {
                      const [year, month, day] = dateValue.split('-').map(Number);
                      setPartnerInfo({
                        ...partnerInfo,
                        birthInfo: {...partnerInfo.birthInfo, year, month, day}
                      });
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white mb-2">您想了解什么</label>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="请输入您想要了解的问题...\n• 我们的缘分如何？\n• 性格是否匹配？\n• 适合在一起吗？"
          className="w-full h-24 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-red-500 resize-none"
        />
      </div>
    </div>
  );

  const renderLotteryInput = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="text-6xl animate-pulse">🏺</div>
        <h3 className="text-xl font-semibold text-white">观音求签</h3>
        <p className="text-slate-300">虔诚祈祷，抽取灵签获得指引</p>
      </div>
      
      <div className="bg-slate-800/30 rounded-xl p-6 space-y-4">
        <h4 className="text-white font-medium mb-4">🙏 祈福步骤</h4>
        <div className="text-slate-300 space-y-2">
          <p>1. 静心凝神，双手合十</p>
          <p>2. 虔诚默念您的问题</p>
          <p>3. 祈求观音菩萨指引</p>
          <p>4. 点击下方按钮抽取灵签</p>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white mb-2">您的问题</label>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="请输入您想要祈求指引的问题...\n• 近期运势如何？\n• 工作是否顺利？\n• 感情发展怎样？"
          className="w-full h-24 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-orange-500 resize-none"
        />
      </div>
      
      {drawingResult && (
        <div className="bg-orange-900/30 rounded-xl p-4 border border-orange-500/30">
          <h4 className="font-bold text-orange-300 mb-2">🎋 抽签结果</h4>
          <p className="text-orange-200">您抽到了第{drawingResult.number || Math.floor(Math.random() * 100) + 1}签</p>
          <div className="mt-2 text-sm text-orange-300">
            <p>{drawingResult.meaning || '观音菩萨的指引即将为您揭示'}</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderJiaobeiInput = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="text-6xl animate-pulse">🥥</div>
        <h3 className="text-xl font-semibold text-white">问卦擲筊</h3>
        <p className="text-slate-300">擲筊求神明指示，获得明确答案</p>
      </div>
      
      <div className="bg-slate-800/30 rounded-xl p-6 space-y-4">
        <h4 className="text-white font-medium mb-4">🙏 擲筊步骤</h4>
        <div className="text-slate-300 space-y-2">
          <p>1. 心诚意正，恭敬跪拜</p>
          <p>2. 明确说出您的问题</p>
          <p>3. 祈求神明指点迷津</p>
          <p>4. 投掷圣筊获得答案</p>
        </div>
        
        {!jiaobeiBlessConfirmed && (
          <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/30">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="blessConfirm"
                checked={jiaobeiBlessConfirmed}
                onChange={(e) => setJiaobeiBlessConfirmed(e.target.checked)}
                className="w-4 h-4 text-green-600 bg-slate-700 border-slate-600 rounded focus:ring-green-500"
              />
              <label htmlFor="blessConfirm" className="text-green-300 text-sm">
                我已虔诚祈福，心诚意正
              </label>
            </div>
          </div>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white mb-2">您的问题（请具体明确）</label>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="请输入您想要问神明的具体问题...\n• 我应该接受这份工作吗？\n• 这个决定是否正确？\n• 现在是合适的时机吗？"
          className="w-full h-24 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-green-500 resize-none"
        />
      </div>
      
      {drawingResult && (
        <div className="bg-green-900/30 rounded-xl p-4 border border-green-500/30">
          <h4 className="font-bold text-green-300 mb-2">🎋 擲筊结果</h4>
          <p className="text-2xl font-bold text-green-400 mb-2">{drawingResult.name || '圣杯'}</p>
          <p className="text-green-200">{drawingResult.meaning || '神明给予您积极的回应'}</p>
        </div>
      )}
    </div>
  );

  const renderPersonalityInput = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="text-6xl animate-pulse">🧠</div>
        <h3 className="text-xl font-semibold text-white">性格测试</h3>
        <p className="text-slate-300">深度分析性格特质，了解真实自我</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white mb-2">您想了解什么</label>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="请输入您想要了解的问题...\n• 我的性格特点是什么？\n• 我适合什么样的工作？\n• 我的优缺点有哪些？"
          className="w-full h-24 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-pink-500 resize-none"
        />
      </div>
    </div>
  );

  const renderLifestoryInput = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="text-6xl animate-pulse">📜</div>
        <h3 className="text-xl font-semibold text-white">命格小故事</h3>
        <p className="text-slate-300">生成专属命运故事，趣味了解人生轨迹</p>
      </div>
      
      <div className="bg-slate-800/30 rounded-xl p-6 space-y-4">
        <h4 className="text-white font-medium mb-4">📅 基本信息</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">您的姓名</label>
            <input
              type="text"
              value={partnerInfo.name}
              onChange={(e) => setPartnerInfo({...partnerInfo, name: e.target.value})}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
              placeholder="请输入您的姓名"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">出生日期</label>
            <input
              type="date"
              value={`${birthInfo.year}-${birthInfo.month.toString().padStart(2, '0')}-${birthInfo.day.toString().padStart(2, '0')}`}
              onChange={(e) => {
                const dateValue = e.target.value;
                if (dateValue) {
                  const [year, month, day] = dateValue.split('-').map(Number);
                  setBirthInfo({...birthInfo, year, month, day});
                }
              }}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white mb-2">您想了解什么</label>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="请输入您想要了解的问题...\n• 我的人生故事会是什么样？\n• 我的命运轨迹如何？\n• 未来会遇到什么？"
          className="w-full h-24 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {renderInputContent()}
      
      {/* 通用操作按钮 */}
      {(selectedMethod !== 'tarot' && selectedMethod !== 'compatibility') && (
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            onClick={onBack}
            className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
          >
            ← 返回选择类型
          </button>

          {(selectedMethod === 'lottery' || selectedMethod === 'ziwei') ? (
            <button
              onClick={onStartDrawing}
              disabled={isDrawing || (selectedMethod === 'ziwei' && !jiaobeiBlessConfirmed)}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
            >
              {isDrawing ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {selectedMethod === 'lottery' ? '抽签中...' : '占卜中...'}
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  {selectedMethod === 'lottery' ? '🏺 开始抽签' : '🔮 开始占卜'}
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={() => {
                console.log('=== DIVINATION BUTTON CLICKED ===');
                console.log('onNextStep being called');
                onNextStep();
              }}
              disabled={!canSubmit()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
            >
              <span className="flex items-center justify-center">
                🔮 开始占卜
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
});

DivinationInput.displayName = 'DivinationInput';

export default DivinationInput;