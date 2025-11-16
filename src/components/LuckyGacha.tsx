import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Gift, RotateCcw, Copy, Save, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import i18n from '../i18n'

// Custom styles for enhanced UI
const customStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
  }
  
  @keyframes animeRotate {
    0% { transform: rotate(0deg) scale(1); }
    25% { transform: rotate(90deg) scale(1.1); }
    50% { transform: rotate(180deg) scale(1.2); }
    75% { transform: rotate(270deg) scale(1.1); }
    100% { transform: rotate(360deg) scale(1); }
  }
  
  @keyframes sparkle {
    0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
    50% { opacity: 1; transform: scale(1) rotate(180deg); }
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }
  
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.5); }
    50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.8), 0 0 60px rgba(236, 72, 153, 0.6); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  
  .anime-rotate {
    animation: animeRotate 2s ease-in-out;
  }
  
  .anime-sparkle {
    animation: sparkle 1s ease-in-out infinite;
  }
  
  .anime-bounce {
    animation: bounce 1s ease-in-out;
  }
  
  .anime-glow {
    animation: glow 2s ease-in-out infinite;
  }
  
  .anime-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .slider::-webkit-slider-thumb {
    appearance: none;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(45deg, #ec4899, #8b5cf6);
    cursor: pointer;
    border: 3px solid white;
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
    transition: all 0.2s ease;
  }

  .slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.6);
  }

  .slider::-moz-range-thumb {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(45deg, #ec4899, #8b5cf6);
    cursor: pointer;
    border: 3px solid white;
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  }

  @media (max-width: 768px) {
    .slider::-webkit-slider-thumb {
      width: 32px;
      height: 32px;
    }
    
    .slider::-moz-range-thumb {
      width: 32px;
      height: 32px;
    }
    
    /* 移动端动画优化 */
    .anime-rotate {
      animation: animeRotate 1.5s ease-in-out;
    }
    
    .anime-glow {
      animation: glow 1.5s ease-in-out infinite;
    }
    
    /* 移动端减少动画强度 */
    .anime-float {
      animation: float 4s ease-in-out infinite;
    }
    
    /* 移动端优化hover效果 */
    .hover\:scale-\[1\.02\]:hover {
      transform: scale(1.01);
    }
    
    /* 移动端触摸优化 */
    button, .slider {
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }
    
    /* 增大按钮点击区域 */
    button {
      min-height: 44px;
      min-width: 44px;
    }
    
    /* 滑块触摸区域优化 */
    .slider {
      height: 44px;
      padding: 8px 0;
    }
  }
  
  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: rgba(139, 92, 246, 0.3);
    border-radius: 3px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: rgba(139, 92, 246, 0.5);
  }
`;

interface Prediction {
  text: string;
  cat: 'love' | 'career' | 'wealth' | 'health' | 'luck';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic';
  category?: string;
  emoji?: string;
  weekTheme?: string;
}

interface HistoryItem extends Prediction {
  time: number;
  note?: string;
}

// 获取当前周数（用于内容轮换）
const getCurrentWeek = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
};

// 每周主题轮换
const weeklyThemes = [
  { name: "魔法奇迹周", emoji: "✨", color: "purple" },
  { name: "幸运财富周", emoji: "💰", color: "yellow" },
  { name: "爱情浪漫周", emoji: "💕", color: "pink" },
  { name: "事业成功周", emoji: "🚀", color: "blue" },
  { name: "健康活力周", emoji: "🌟", color: "green" },
  { name: "创意灵感周", emoji: "🎨", color: "orange" },
  { name: "友谊社交周", emoji: "🤝", color: "cyan" },
  { name: "冒险探索周", emoji: "🗺️", color: "red" }
];

const getCurrentTheme = () => {
  const weekIndex = getCurrentWeek() % weeklyThemes.length;
  return weeklyThemes[weekIndex];
};

// 基础预测内容库
const basePredictions: Prediction[] = [
  // Common predictions
  { text: '今天有人会对你暗暗好感，微笑回应即可。', cat: 'love', rarity: 'common', category: '爱情', emoji: '💕' },
  { text: '你的直觉很准，跟着感觉去做一件小决定。', cat: 'career', rarity: 'common', category: '直觉', emoji: '🧭' },
  { text: '钱包里有惊喜，别忘了检查口袋。', cat: 'wealth', rarity: 'common', category: '财富', emoji: '💰' },
  { text: '午休 15 分钟，会让你精力翻倍。', cat: 'health', rarity: 'common', category: '健康', emoji: '😴' },
  { text: '今天适合尝试新事物，惊喜常在小改变里。', cat: 'luck', rarity: 'common', category: '尝试', emoji: '🎪' },
  { text: '今天会是平静而美好的一天，享受这份宁静。', cat: 'luck', rarity: 'common', category: '平静', emoji: '🌸' },
  { text: '保持耐心，一切都会按最好的计划进行。', cat: 'career', rarity: 'common', category: '耐心', emoji: '🌱' },
  { text: '今天适合整理思绪和制定未来的计划。', cat: 'career', rarity: 'common', category: '规划', emoji: '📝' },
  { text: '小心谨慎会为你避免不必要的麻烦。', cat: 'luck', rarity: 'common', category: '谨慎', emoji: '🛡️' },
  { text: '今天是反思和总结的好时机，回顾过往收获智慧。', cat: 'career', rarity: 'common', category: '反思', emoji: '🤔' },
  { text: '保持健康的生活习惯很重要，身体是革命的本钱。', cat: 'health', rarity: 'common', category: '健康', emoji: '🍎' },
  { text: '今天适合与家人共度温馨时光，珍惜亲情。', cat: 'love', rarity: 'common', category: '家庭', emoji: '🏠' },
  { text: '简单的快乐往往最珍贵，学会知足常乐。', cat: 'luck', rarity: 'common', category: '快乐', emoji: '😌' },
  { text: '今天记得多喝水，照顾好自己的身体。', cat: 'health', rarity: 'common', category: '保健', emoji: '💧' },
  { text: '温和的阳光会为你带来好心情。', cat: 'luck', rarity: 'common', category: '心情', emoji: '☀️' },

  // Uncommon predictions
  { text: '喜欢的人可能会发来意外消息，保持镇定。', cat: 'love', rarity: 'uncommon', category: '消息', emoji: '📨' },
  { text: '你会在工作中发现可以简化流程的好主意。', cat: 'career', rarity: 'uncommon', category: '创新', emoji: '💡' },
  { text: '小额投资或理财阅读会给你新的方向。', cat: 'wealth', rarity: 'uncommon', category: '理财', emoji: '📈' },
  { text: '今晚适合做一次放松拉伸或热水泡脚。', cat: 'health', rarity: 'uncommon', category: '放松', emoji: '🛁' },
  { text: '路上的一场小乌龙将变成笑谈，别放在心上。', cat: 'luck', rarity: 'uncommon', category: '乌龙', emoji: '😅' },
  { text: '一个意外的电话将带来好消息。', cat: 'luck', rarity: 'uncommon', category: '消息', emoji: '📞' },
  { text: '保持积极的心态，好事正在悄悄向你靠近。', cat: 'luck', rarity: 'uncommon', category: '心态', emoji: '😊' },
  { text: '你的笑容将感染身边的每一个人，成为他们的阳光。', cat: 'love', rarity: 'uncommon', category: '魅力', emoji: '☀️' },
  { text: '今天是学习新技能的好日子，你的学习能力超乎想象。', cat: 'career', rarity: 'uncommon', category: '学习', emoji: '📚' },
  { text: '一个小小的改变将带来大大的不同，勇敢迈出第一步。', cat: 'luck', rarity: 'uncommon', category: '改变', emoji: '🦋' },
  { text: '今天你会发现生活中被忽略的小美好。', cat: 'luck', rarity: 'uncommon', category: '发现', emoji: '🔍' },
  { text: '相信自己的能力，你比想象中更强大更有潜力。', cat: 'career', rarity: 'uncommon', category: '自信', emoji: '💪' },

  // Rare predictions
  { text: '有人会在你最不经意时为你撑腰，记住感恩。', cat: 'love', rarity: 'rare', category: '贵人', emoji: '🤝' },
  { text: '有机会参加对你长远有利的项目，主动出击。', cat: 'career', rarity: 'rare', category: '机会', emoji: '🎯' },
  { text: '你会得到一笔意外之财（可能是退税或报销）。', cat: 'wealth', rarity: 'rare', category: '意外财', emoji: '💎' },
  { text: '你的精神状态会有明显提升，适合开始新习惯。', cat: 'health', rarity: 'rare', category: '精神', emoji: '🌟' },
  { text: '一件旧事将得到圆满的结局，庆祝一下吧。', cat: 'luck', rarity: 'rare', category: '圆满', emoji: '🎉' },
  { text: '今天是展现你才华的绝佳时机，所有人都会被你的能力所震撼。', cat: 'career', rarity: 'rare', category: '才华', emoji: '⭐' },
  { text: '一个重要的决定将为你打开通往成功的新道路。', cat: 'career', rarity: 'rare', category: '决策', emoji: '🚪' },
  { text: '你的努力即将得到应有的回报，收获的季节已经到来。', cat: 'career', rarity: 'rare', category: '回报', emoji: '🏆' },
  { text: '新的友谊将为你的生活带来意想不到的色彩和机会。', cat: 'love', rarity: 'rare', category: '友谊', emoji: '🌈' },
  { text: '一个重要的人将在关键时刻给你指导。', cat: 'luck', rarity: 'rare', category: '指导', emoji: '🎓' },

  // Epic predictions
  { text: '命运之门对你短暂开启：大胆说出你的心意吧。', cat: 'love', rarity: 'epic', category: '命运', emoji: '💖' },
  { text: '你将遇到改变职业轨迹的关键人物，把握时机。', cat: 'career', rarity: 'epic', category: '贵人', emoji: '👑' },
  { text: '财富星高照：一个长期目标将迎来关键突破。', cat: 'wealth', rarity: 'epic', category: '突破', emoji: '💎' },
  { text: '健康能量爆棚，适合挑战自我并获显著回报。', cat: 'health', rarity: 'epic', category: '能量', emoji: '⚡' },
  { text: '极其罕见的好运：今天可能是你记忆中的幸运日。', cat: 'luck', rarity: 'epic', category: '奇迹', emoji: '🌟' },
  { text: '今天你将遇到改变人生的重要机会！宇宙的能量正在为你排列最完美的时机。', cat: 'luck', rarity: 'epic', category: '机遇', emoji: '🔮' },
  { text: '意外之财即将降临！一个神秘的财富机会正在向你招手，准备好迎接惊喜吧！', cat: 'wealth', rarity: 'epic', category: '财富', emoji: '💰' },
  { text: '真爱就在不远处等待着你的到来，今天可能就是命运安排的相遇之日。', cat: 'love', rarity: 'epic', category: '真爱', emoji: '💖' },
  { text: '你的创意将获得巨大成功和认可！今天是展现天赋的绝佳时机。', cat: 'career', rarity: 'epic', category: '创意', emoji: '🎭' },
];

// 每周特殊预测（根据主题生成）
const getWeeklySpecialPredictions = (theme: any): Prediction[] => {
  const specials: { [key: string]: Prediction[] } = {
    "魔法奇迹周": [
      { text: "✨ 魔法奇迹周：今天你身上散发着神秘的魔法光芒，奇迹即将发生！", cat: 'luck', rarity: 'epic', category: "魔法", emoji: "🔮" },
      { text: "✨ 魔法能量正在你周围聚集，准备施展你的魔法吧！", cat: 'luck', rarity: 'rare', category: "魔法", emoji: "⚡" },
      { text: "✨ 今天你的愿望有特殊的实现力量。", cat: 'luck', rarity: 'uncommon', category: "魔法", emoji: "🌟" }
    ],
    "幸运财富周": [
      { text: "💰 财富之神正在眷顾你，金钱运势达到顶峰！", cat: 'wealth', rarity: 'epic', category: "财富", emoji: "💎" },
      { text: "💰 今天是投资和理财的黄金时机。", cat: 'wealth', rarity: 'rare', category: "财富", emoji: "📈" },
      { text: "💰 小额意外收入正在路上。", cat: 'wealth', rarity: 'uncommon', category: "财富", emoji: "🪙" }
    ],
    "爱情浪漫周": [
      { text: "💕 爱神丘比特的箭正瞄准你，真爱即将降临！", cat: 'love', rarity: 'epic', category: "爱情", emoji: "💘" },
      { text: "💕 今天你的魅力值爆表，桃花运旺盛。", cat: 'love', rarity: 'rare', category: "爱情", emoji: "🌹" },
      { text: "💕 一个温暖的拥抱正在等待你。", cat: 'love', rarity: 'uncommon', category: "爱情", emoji: "🤗" }
    ],
    "事业成功周": [
      { text: "🚀 事业火箭即将发射，成功的轨道已经锁定！", cat: 'career', rarity: 'epic', category: "事业", emoji: "🎯" },
      { text: "🚀 今天你的工作表现将获得上级认可。", cat: 'career', rarity: 'rare', category: "事业", emoji: "👔" },
      { text: "🚀 一个职场机会正在向你招手。", cat: 'career', rarity: 'uncommon', category: "事业", emoji: "📊" }
    ],
    "健康活力周": [
      { text: "🌟 生命能量达到巅峰，你将拥有超人般的活力！", cat: 'health', rarity: 'epic', category: "健康", emoji: "💪" },
      { text: "🌟 今天你的身体状态特别好，适合运动。", cat: 'health', rarity: 'rare', category: "健康", emoji: "🏃" },
      { text: "🌟 一个健康的新习惯将改善你的生活。", cat: 'health', rarity: 'uncommon', category: "健康", emoji: "🥗" }
    ],
    "创意灵感周": [
      { text: "🎨 创意之神附体，你将创造出惊世之作！", cat: 'career', rarity: 'epic', category: "创意", emoji: "🖼️" },
      { text: "🎨 今天你的想象力无限，灵感如泉涌。", cat: 'career', rarity: 'rare', category: "创意", emoji: "💡" },
      { text: "🎨 一个小小的创意将带来大大的惊喜。", cat: 'career', rarity: 'uncommon', category: "创意", emoji: "✏️" }
    ],
    "友谊社交周": [
      { text: "🤝 友谊之花将绽放出最美丽的光芒，贵人相助！", cat: 'love', rarity: 'epic', category: "友谊", emoji: "👑" },
      { text: "🤝 今天你会结识一个重要的朋友。", cat: 'love', rarity: 'rare', category: "友谊", emoji: "👫" },
      { text: "🤝 朋友圈将为你带来好消息。", cat: 'love', rarity: 'uncommon', category: "友谊", emoji: "📱" }
    ],
    "冒险探索周": [
      { text: "🗺️ 冒险之路将引领你发现人生的宝藏！", cat: 'luck', rarity: 'epic', category: "冒险", emoji: "🏴‍☠️" },
      { text: "🗺️ 今天适合尝试从未做过的事情。", cat: 'luck', rarity: 'rare', category: "冒险", emoji: "🧗" },
      { text: "🗺️ 一次小小的探索将带来新发现。", cat: 'luck', rarity: 'uncommon', category: "冒险", emoji: "🔍" }
    ]
  };
  
  return specials[theme.name] || [];
};

// 获取当前可用的预测列表（基础+每周特殊）
const getPredictions = (): Prediction[] => {
  const currentTheme = getCurrentTheme();
  const weeklySpecials = getWeeklySpecialPredictions(currentTheme);
  
  // 为每周特殊预测添加主题标识
  const themedSpecials = weeklySpecials.map(pred => ({
    ...pred,
    weekTheme: currentTheme.name
  }));
  
  return [...basePredictions, ...themedSpecials];
};

const PREDICTIONS = getPredictions();

const RARITY_WEIGHTS = { common: 70, uncommon: 20, rare: 8, epic: 2 };

const CATEGORY_LABELS = {
  love: 'gacha.categories.love',
  career: 'gacha.categories.career',
  wealth: 'gacha.categories.wealth',
  health: 'gacha.categories.health',
  luck: 'gacha.categories.luck'
};

const RARITY_STYLES = {
  common: 'bg-gray-100 text-gray-700',
  uncommon: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800',
  rare: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800',
  epic: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800'
};

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  ttl: number;
  color: string;
}

const LuckyGacha: React.FC = () => {
  const [currentPrediction, setCurrentPrediction] = useState<Prediction | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [rarityBonus, setRarityBonus] = useState(10);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const { t } = useTranslation()
  const [copyText, setCopyText] = useState(t('gacha.copy'));
  const [saveText, setSaveText] = useState(t('gacha.saveToHistory'));
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('gacha_history_v1');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Confetti animation
  const animateConfetti = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    setConfettiPieces(pieces => {
      const newPieces = pieces.map(piece => ({
        ...piece,
        x: piece.x + piece.vx,
        y: piece.y + piece.vy,
        vy: piece.vy + 0.05,
        life: piece.life + 1
      })).filter(piece => piece.life < piece.ttl && piece.y < canvas.height + 60);

      newPieces.forEach(piece => {
        ctx.fillStyle = piece.color;
        ctx.fillRect(piece.x, piece.y, piece.size, piece.size);
      });

      return newPieces;
    });

    animationRef.current = requestAnimationFrame(animateConfetti);
  }, []);

  useEffect(() => {
    animateConfetti();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animateConfetti]);

  const spawnConfetti = (count: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
    const newPieces: ConfettiPiece[] = [];
    
    for (let i = 0; i < count; i++) {
      newPieces.push({
        x: Math.random() * canvas.clientWidth,
        y: -10,
        vx: Math.random() * 4 - 2,
        vy: Math.random() * 3 + 1,
        size: Math.floor(Math.random() * 8) + 4,
        life: 0,
        ttl: 120 + Math.floor(Math.random() * 80),
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    
    setConfettiPieces(prev => [...prev, ...newPieces]);
  };

  const pickRarity = (): string => {
    const bonus = rarityBonus / 100;
    const weights = { ...RARITY_WEIGHTS };
    
    const shift = weights.common * bonus * 0.6;
    weights.common -= shift;
    weights.uncommon += shift * 0.55;
    weights.rare += shift * 0.30;
    weights.epic += shift * 0.15;

    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    let random = Math.random() * total;
    
    for (const [rarity, weight] of Object.entries(weights)) {
      random -= weight;
      if (random <= 0) return rarity;
    }
    
    return 'common';
  };

  const pickPrediction = (category: string): Prediction => {
    const rarity = pickRarity();
    let pool = PREDICTIONS.filter(p => 
      (category === 'all' || p.cat === category) && p.rarity === rarity
    );
    
    if (pool.length === 0) {
      pool = PREDICTIONS.filter(p => p.rarity === rarity);
    }
    
    const pick = pool[Math.floor(Math.random() * pool.length)];
    return pick || PREDICTIONS[Math.floor(Math.random() * PREDICTIONS.length)];
  };

  const playTone = (frequency: number, duration: number) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gainNode.gain.value = 0.1;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
      
      setTimeout(() => oscillator.stop(), duration * 1000 + 30);
    } catch (e) {
      // Audio may be blocked
    }
  };

  const handlePull = async () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setShowResult(false);
    toast.dismiss()
    toast(t('gacha.spinning'))
    
    // Simulate spinning animation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const prediction = pickPrediction(selectedCategory);
    setCurrentPrediction(prediction);
    setShowResult(true);
    
    // Play sound and show confetti based on rarity
    switch (prediction.rarity) {
      case 'epic':
        spawnConfetti(80);
        playTone(880, 0.2);
        playTone(1100, 0.15);
        break;
      case 'rare':
        spawnConfetti(40);
        playTone(660, 0.15);
        break;
      case 'uncommon':
        spawnConfetti(20);
        playTone(520, 0.08);
        break;
      default:
        playTone(420, 0.06);
    }
    
    setIsSpinning(false);
  };

  const handleMultiPull = async () => {
    const results: Prediction[] = [];
    
    for (let i = 0; i < 5; i++) {
      await handlePull();
      if (currentPrediction) {
        results.push(currentPrediction);
      }
      await new Promise(resolve => setTimeout(resolve, 450));
    }
    
    // Save all results to history
    results.forEach(result => {
      const historyItem: HistoryItem = {
        ...result,
        time: Date.now(),
        note: t('gacha.noteMulti')
      };
      saveToHistory(historyItem);
    });
  };

  const handleCopy = async () => {
    if (!currentPrediction) return;
    
    const text = `【${t('gacha.copyTitle')}】${localizedText(currentPrediction.text)}\n${t('gacha.copyCategory')}: ${t(CATEGORY_LABELS[currentPrediction.cat])} · ${t('gacha.copyRarity')}: ${currentPrediction.rarity.toUpperCase()}`;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopyText(t('gacha.copied'));
      setTimeout(() => setCopyText(t('gacha.copy')), 1200);
    } catch (e) {
      console.error('Failed to copy:', e);
    }
  };

  const saveToHistory = (item: HistoryItem) => {
    const newHistory = [item, ...history].slice(0, 50);
    setHistory(newHistory);
    localStorage.setItem('gacha_history_v1', JSON.stringify(newHistory));
  };

  const handleSave = () => {
    if (!currentPrediction) return;
    
    const historyItem: HistoryItem = {
      ...currentPrediction,
      time: Date.now()
    };
    
    saveToHistory(historyItem);
    setSaveText(t('gacha.saved'));
    setTimeout(() => setSaveText(t('gacha.saveToHistory')), 1000);
  };

  const clearHistory = () => {
    if (confirm(t('gacha.clearConfirm'))) {
      setHistory([]);
      localStorage.removeItem('gacha_history_v1');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-3 md:p-4 relative overflow-hidden">
      {/* Inject custom styles */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-2xl animate-bounce">
              🎰
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              {t('gacha.title')}
            </h1>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-2xl animate-bounce delay-300">
              ✨
            </div>
          </div>
          <p className="text-lg text-purple-200 mb-2">{t('gacha.subtitle')}</p>
          <div className="flex items-center justify-center gap-2 text-sm text-purple-300 mb-4">
            <span className="px-3 py-1 bg-purple-800/30 rounded-full border border-purple-500/30">🎲 {t('gacha.pill.random')}</span>
            <span className="px-3 py-1 bg-pink-800/30 rounded-full border border-pink-500/30">🎁 {t('gacha.pill.blind')}</span>
            <span className="px-3 py-1 bg-indigo-800/30 rounded-full border border-indigo-500/30">⭐ {t('gacha.pill.rarity')}</span>
          </div>
          
          {/* 每周主题显示 */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-indigo-300/20">
            <span className="text-2xl animate-pulse">{getCurrentTheme().emoji}</span>
            <div className="text-center">
              <div className="text-sm font-semibold text-indigo-300">{getCurrentTheme().name}</div>
              <div className="text-xs text-indigo-400/70">{t('gacha.weekLabel', { week: getCurrentWeek() })}</div>
            </div>
            <span className="text-2xl animate-pulse">{getCurrentTheme().emoji}</span>
          </div>
        </div>

        {/* Enhanced Main Machine */}
        <div className="bg-gradient-to-b from-slate-800/30 to-slate-900/50 backdrop-blur-xl rounded-3xl p-4 md:p-8 border border-purple-500/30 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
            {/* Enhanced Gacha Area */}
            <div className="lg:col-span-2 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-2xl p-4 md:p-8 relative overflow-hidden min-h-[300px] md:min-h-[400px] lg:min-h-[500px] border border-purple-400/20">
              <canvas 
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none z-20"
              />
              
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-500/10 to-purple-500/10 animate-pulse"></div>
                <div className="absolute top-4 left-4 w-8 h-8 bg-pink-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 bg-purple-400 rounded-full animate-ping delay-1000"></div>
                <div className="absolute top-1/3 right-8 w-4 h-4 bg-indigo-400 rounded-full animate-ping delay-500"></div>
              </div>
              
              <div className="absolute top-6 left-6 flex items-center gap-2 text-sm text-purple-200 bg-purple-900/50 px-3 py-2 rounded-full border border-purple-400/30">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                {t('gacha.running')}
              </div>
              
              <div className="flex flex-col items-center justify-center h-full relative z-10">
                {/* Enhanced Capsule */}
                <div className="relative">
                  {/* Glow effect */}
                  <div className={`absolute inset-0 w-32 h-32 md:w-40 lg:w-48 md:h-40 lg:h-48 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 blur-xl opacity-50 transition-all duration-700 ${
                    isSpinning ? 'animate-pulse scale-110' : 'scale-100'
                  }`}></div>
                  
                  {/* Enhanced Anime-Style Capsule */}
                <div className="relative">
                  {/* Floating Particles */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-2 md:top-4 left-4 md:left-8 w-1.5 md:w-2 h-1.5 md:h-2 bg-yellow-300 rounded-full anime-sparkle" style={{ animationDelay: '0s' }}></div>
                    <div className="absolute top-6 md:top-12 right-3 md:right-6 w-1 md:w-1.5 h-1 md:h-1.5 bg-pink-300 rounded-full anime-sparkle" style={{ animationDelay: '0.3s' }}></div>
                    <div className="absolute bottom-4 md:bottom-8 left-6 md:left-12 w-2 md:w-2.5 h-2 md:h-2.5 bg-blue-300 rounded-full anime-sparkle" style={{ animationDelay: '0.6s' }}></div>
                    <div className="absolute bottom-2 md:bottom-4 right-5 md:right-10 w-0.5 md:w-1 h-0.5 md:h-1 bg-green-300 rounded-full anime-sparkle" style={{ animationDelay: '0.9s' }}></div>
                    <div className="absolute top-4 md:top-8 left-2 md:left-4 w-1 md:w-1.5 h-1 md:h-1.5 bg-purple-300 rounded-full anime-sparkle" style={{ animationDelay: '1.2s' }}></div>
                    <div className="absolute bottom-6 md:bottom-12 right-2 md:right-4 w-1.5 md:w-2 h-1.5 md:h-2 bg-orange-300 rounded-full anime-sparkle" style={{ animationDelay: '1.5s' }}></div>
                  </div>
                  
                  {/* Main Capsule with Anime Effects */}
                  <div
                    onClick={handlePull}
                    role="button"
                    aria-disabled={isSpinning}
                    className={`relative w-32 h-32 md:w-36 lg:w-44 md:h-36 lg:h-44 rounded-full bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-300 flex items-center justify-center text-2xl md:text-3xl font-bold text-white shadow-2xl border-2 md:border-4 border-white/20 transition-all duration-700 ${
                      isSpinning ? 'anime-rotate scale-95 shadow-pink-500/50 anime-glow cursor-not-allowed' : 'hover:scale-105 shadow-purple-500/30 anime-float cursor-pointer'
                    }`}>
                    {/* Inner magical glow */}
                    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-pink-400/30 to-purple-400/30 backdrop-blur-sm"></div>
                    
                    {/* Center magical core */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-yellow-200 to-pink-200 rounded-full opacity-80 anime-glow"></div>
                    
                    <span className="relative z-10 drop-shadow-lg">
                      {isSpinning ? '✨' : '🎁'}
                    </span>
                  </div>
                  
                  {/* Multiple Rotating rings */}
                  <div className={`absolute inset-0 w-48 h-48 rounded-full border-2 border-dashed border-pink-400/50 transition-transform duration-1000 ${
                    isSpinning ? 'anime-rotate' : ''
                  }`} style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
                  
                  <div className={`absolute inset-0 w-56 h-56 rounded-full border border-dotted border-purple-300/30 transition-transform duration-1000 ${
                    isSpinning ? 'animate-spin' : ''
                  }`} style={{ animationDuration: '4s' }}></div>
                  
                  {/* Energy Waves */}
                  {isSpinning && (
                    <>
                      <div className="absolute inset-0 w-52 h-52 rounded-full border-4 border-purple-400/20 animate-ping"></div>
                      <div className="absolute inset-0 w-60 h-60 rounded-full border-2 border-pink-400/20 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                    </>
                  )}
                </div>
                </div>
                
                {/* Enhanced Anime-Style Result Card */}
                {showResult && currentPrediction && (
                  <div className={`animate-fadeIn anime-bounce w-full max-w-lg mt-8 rounded-2xl p-6 border-2 shadow-2xl transform transition-all duration-500 relative overflow-hidden ${
                    currentPrediction.rarity === 'epic' ? 'bg-gradient-to-br from-purple-800/80 to-pink-800/80 border-purple-400/50 shadow-purple-500/30 anime-glow' :
                    currentPrediction.rarity === 'rare' ? 'bg-gradient-to-br from-yellow-800/80 to-orange-800/80 border-yellow-400/50 shadow-yellow-500/30' :
                    currentPrediction.rarity === 'uncommon' ? 'bg-gradient-to-br from-blue-800/80 to-indigo-800/80 border-blue-400/50 shadow-blue-500/30' :
                    'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-400/50 shadow-slate-500/30'
                  }`}>
                    {/* Magical Background Effects */}
                    <div className="absolute inset-0 pointer-events-none">
                      {currentPrediction.rarity === 'epic' && (
                        <>
                          <div className="absolute top-2 right-4 w-3 h-3 bg-yellow-300 rounded-full anime-sparkle"></div>
                          <div className="absolute top-8 left-6 w-2 h-2 bg-pink-300 rounded-full anime-sparkle" style={{ animationDelay: '0.5s' }}></div>
                          <div className="absolute bottom-4 right-8 w-2.5 h-2.5 bg-purple-300 rounded-full anime-sparkle" style={{ animationDelay: '1s' }}></div>
                          <div className="absolute bottom-8 left-4 w-1.5 h-1.5 bg-blue-300 rounded-full anime-sparkle" style={{ animationDelay: '1.5s' }}></div>
                        </>
                      )}
                      {currentPrediction.rarity === 'rare' && (
                        <>
                          <div className="absolute top-3 right-6 w-2 h-2 bg-yellow-400 rounded-full anime-sparkle"></div>
                          <div className="absolute bottom-6 left-8 w-2 h-2 bg-orange-400 rounded-full anime-sparkle" style={{ animationDelay: '0.7s' }}></div>
                        </>
                      )}
                    </div>
                    {/* Rarity indicator */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 ${
                        currentPrediction.rarity === 'epic' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-300 shadow-lg' :
                        currentPrediction.rarity === 'rare' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-yellow-300 shadow-lg' :
                        currentPrediction.rarity === 'uncommon' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-300 shadow-lg' :
                        'bg-gradient-to-r from-slate-500 to-slate-600 text-white border-slate-300 shadow-lg'
                      }`}>
                        <span className="text-lg">
                          {currentPrediction.rarity === 'epic' ? '💎' :
                           currentPrediction.rarity === 'rare' ? '⭐' :
                           currentPrediction.rarity === 'uncommon' ? '🔮' : '🎯'}
                        </span>
                        {t(`gacha.rarity.${currentPrediction.rarity}`)}
                      </div>
                      <div className="text-sm text-purple-200 opacity-75">
                        {new Date().toLocaleDateString()}
                      </div>
                    </div>
                    
                    {/* Enhanced Prediction content with emoji and category */}
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl anime-float">{currentPrediction.emoji || '🎯'}</span>
                        <div className="flex flex-col">
                          <span className="text-sm text-purple-300 opacity-75">{t(`gacha.weekThemes.${themeNameMap[getCurrentTheme().name] || 'adventure'}`)}</span>
                          <span className="text-xs text-purple-400 opacity-60">{t('gacha.weekSpecial', { week: getCurrentWeek() })}</span>
                        </div>
                      </div>
                      <div className="text-lg md:text-xl font-bold mb-3 leading-relaxed md:leading-relaxed text-white">
                        {localizedText(currentPrediction.text)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-purple-200">
                        <span className="px-3 py-1.5 bg-purple-700/50 rounded-full border border-purple-500/30 backdrop-blur-sm">
                          {t(CATEGORY_LABELS[currentPrediction.cat])}
                        </span>
                        <span className="px-2 py-1 bg-slate-700/50 rounded-full text-xs opacity-75">
                          {t(CATEGORY_LABELS[currentPrediction.cat])}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 md:gap-3">
                      <button 
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3 md:px-4 py-4 md:py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-base md:text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 touch-manipulation flex-1 justify-center"
                      >
                        <Copy size={18} className="md:w-4 md:h-4" />
                        <span className="hidden sm:inline">{copyText}</span>
                        <span className="sm:hidden">{t('gacha.copy')}</span>
                      </button>
                      <button 
                        onClick={handleSave}
                        className="flex items-center gap-2 px-3 md:px-4 py-4 md:py-3 bg-slate-700/80 border border-slate-500/50 rounded-xl text-base md:text-sm font-medium hover:bg-slate-600/80 transition-all duration-200 transform hover:scale-105 shadow-lg backdrop-blur-sm touch-manipulation flex-1 justify-center"
                      >
                        <Save size={18} className="md:w-4 md:h-4" />
                        <span className="hidden sm:inline">{saveText}</span>
                        <span className="sm:hidden">{t('gacha.save')}</span>
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Enhanced Anime-Style Pull Lever */}
                <div className="absolute right-2 md:right-8 bottom-8 md:bottom-16">
                  <div className="relative">
                    {/* Magical Aura */}
                    <div className={`absolute inset-0 bg-gradient-to-b from-pink-400 to-purple-400 rounded-2xl blur-xl opacity-60 transition-all duration-300 ${
                      isSpinning ? 'anime-glow scale-110' : 'scale-100 anime-float'
                    }`}></div>
                    
                    {/* Floating Magic Particles */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute -top-2 md:-top-4 left-1 md:left-2 w-1.5 md:w-2 h-1.5 md:h-2 bg-yellow-300 rounded-full anime-sparkle"></div>
                      <div className="absolute -top-1 md:-top-2 right-2 md:right-4 w-1 md:w-1.5 h-1 md:h-1.5 bg-pink-300 rounded-full anime-sparkle" style={{ animationDelay: '0.3s' }}></div>
                      <div className="absolute -bottom-2 md:-bottom-3 left-3 md:left-6 w-2 md:w-2.5 h-2 md:h-2.5 bg-purple-300 rounded-full anime-sparkle" style={{ animationDelay: '0.6s' }}></div>
                      <div className="absolute -bottom-1 right-1 md:right-2 w-0.5 md:w-1 h-0.5 md:h-1 bg-blue-300 rounded-full anime-sparkle" style={{ animationDelay: '0.9s' }}></div>
                    </div>
                    
                    <button 
                      onClick={handlePull}
                      disabled={isSpinning}
                      className={`relative px-4 md:px-6 py-6 md:py-10 bg-gradient-to-b from-white via-pink-50 to-pink-100 text-pink-900 font-bold rounded-xl md:rounded-2xl shadow-2xl border-2 md:border-4 border-pink-200/50 transition-all duration-300 transform overflow-hidden touch-manipulation ${
                        isSpinning 
                          ? 'scale-95 opacity-70 cursor-not-allowed shadow-pink-500/30 anime-glow' 
                          : 'hover:scale-110 hover:shadow-pink-500/50 hover:from-pink-50 hover:to-pink-200 active:scale-95 anime-float'
                      }`}
                      style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                    >
                      {/* Button inner glow */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-2xl"></div>
                      
                      <div className="relative flex flex-col items-center gap-2 z-10">
                        <span className={`text-2xl ${
                          isSpinning ? 'anime-rotate' : 'anime-float'
                        }`}>{isSpinning ? '🎴' : '🎰'}</span>
                        <span className="text-lg font-black tracking-wider">
                          {isSpinning ? t('gacha.spinning') : t('gacha.pull')}
                        </span>
                      </div>
                      
                      {/* Button sparkles */}
                      {!isSpinning && (
                        <>
                          <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full anime-sparkle"></div>
                          <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-pink-200 rounded-full anime-sparkle" style={{ animationDelay: '0.5s' }}></div>
                        </>
                      )}
                    </button>
                    
                    {/* Magical Decorative elements */}
                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full anime-bounce border-2 border-white/40"></div>
                    <div className="absolute -bottom-3 -left-3 w-5 h-5 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full anime-bounce border-2 border-white/40" style={{ animationDelay: '0.5s' }}></div>
                    
                    {/* Energy rings when spinning */}
                    {isSpinning && (
                      <>
                        <div className="absolute inset-0 w-full h-full border-2 border-pink-300/50 rounded-2xl animate-ping"></div>
                        <div className="absolute inset-0 w-full h-full border border-purple-300/30 rounded-2xl animate-ping" style={{ animationDelay: '0.3s' }}></div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Controls */}
            <div className="bg-gradient-to-b from-slate-800/40 to-slate-900/60 rounded-2xl p-6 border border-purple-400/20 backdrop-blur-sm">
              <div className="space-y-6">
                {/* Category Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-purple-200 mb-3">
                    <span className="text-lg">🎯</span>
                    类别偏好
                  </label>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-slate-700/80 border border-slate-500/50 rounded-xl px-3 md:px-4 py-4 md:py-3 text-white font-medium focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200 backdrop-blur-sm text-base md:text-sm touch-manipulation"
                  >
                    <option value="all">🌟 全部类别</option>
                    <option value="love">💕 爱情</option>
                    <option value="career">💼 事业</option>
                    <option value="wealth">💰 财富</option>
                    <option value="health">🏃 健康</option>
                    <option value="luck">🍀 幸运提示</option>
                  </select>
                </div>
                
                {/* Rarity Bonus Slider */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-purple-200 mb-3">
                    <span className="text-lg">✨</span>
                    稀有率加成 ({rarityBonus}%)
                  </label>
                  <div className="relative">
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      value={rarityBonus}
                      onChange={(e) => setRarityBonus(Number(e.target.value))}
                      className="slider w-full h-4 md:h-3 bg-slate-600 rounded-full appearance-none cursor-pointer touch-manipulation"
                      style={{
                        background: `linear-gradient(to right, #8b5cf6 0%, #ec4899 ${rarityBonus}%, #475569 ${rarityBonus}%, #475569 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-purple-300 mt-2">
                      <span>普通</span>
                      <span>稀有</span>
                      <span>史诗</span>
                    </div>
                  </div>
                  <div className="text-xs text-purple-400 mt-2 bg-purple-900/30 p-2 rounded-lg border border-purple-500/20">
                    💡 提示：向右滑动可稍微提高获得稀有预言的概率
                  </div>
                </div>
                
                {/* Enhanced Anime-Style Action Buttons */}
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    {/* Floating particles for multi-pull */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute -top-2 left-4 w-1.5 h-1.5 bg-purple-300 rounded-full anime-sparkle"></div>
                      <div className="absolute -top-1 right-6 w-1 h-1 bg-pink-300 rounded-full anime-sparkle" style={{ animationDelay: '0.3s' }}></div>
                    </div>
                    
                    <button 
                      onClick={handleMultiPull}
                      disabled={isSpinning}
                      className={`relative w-full flex items-center justify-center gap-2 px-3 md:px-4 py-5 md:py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-xl text-base md:text-sm font-bold transition-all duration-300 transform overflow-hidden shadow-lg touch-manipulation ${
                        isSpinning 
                          ? 'scale-95 opacity-50 cursor-not-allowed anime-glow' 
                          : 'hover:scale-110 hover:from-purple-600 hover:to-pink-600 hover:shadow-purple-500/40 active:scale-95 anime-float'
                      }`}
                    >
                      {/* Button inner glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl"></div>
                      
                      <Sparkles size={18} className={`relative z-10 ${
                        isSpinning ? 'anime-rotate' : 'anime-sparkle'
                      }`} />
                      <span className="relative z-10">{t('gacha.multiPull')}</span>
                      <span className="relative z-10 text-xs bg-white/20 px-2 py-1 rounded-full anime-bounce">🎁</span>
                      
                      {/* Button sparkles */}
                      {!isSpinning && (
                        <>
                          <div className="absolute top-1 right-2 w-1 h-1 bg-white rounded-full anime-sparkle"></div>
                          <div className="absolute bottom-1 left-3 w-1.5 h-1.5 bg-purple-200 rounded-full anime-sparkle" style={{ animationDelay: '0.5s' }}></div>
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="relative">
                    {/* Floating particles for clear history */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute -top-2 left-2 w-1.5 h-1.5 bg-red-300 rounded-full anime-sparkle"></div>
                      <div className="absolute -top-1 right-1 w-1 h-1 bg-orange-300 rounded-full anime-sparkle" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    
                    <button 
                      onClick={clearHistory}
                      className="relative px-5 md:px-4 py-5 md:py-4 bg-gradient-to-r from-slate-700/80 to-slate-800/80 border border-slate-500/50 rounded-xl text-sm font-medium transition-all duration-300 transform shadow-lg backdrop-blur-sm group overflow-hidden hover:scale-110 hover:bg-slate-600/80 hover:shadow-slate-500/30 active:scale-95 anime-float touch-manipulation"
                      title={t('gacha.clearHistoryTitle')}
                    >
                      {/* Button inner glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl"></div>
                      
                      <RotateCcw size={18} className="relative z-10 group-hover:anime-rotate transition-transform duration-300 anime-float" />
                      
                      {/* Button sparkles */}
                      <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full anime-sparkle"></div>
                      <div className="absolute bottom-1 left-2 w-1.5 h-1.5 bg-slate-200 rounded-full anime-sparkle" style={{ animationDelay: '0.6s' }}></div>
                    </button>
                  </div>
                </div>
                
                {/* Enhanced History */}
                <div className="border-t border-purple-500/20 pt-6">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-purple-200 mb-4">
                    <span className="text-lg">📜</span>
                    {t('gacha.historyTitle')}
                    {history.length > 0 && (
                      <span className="bg-purple-600/30 text-purple-200 px-2 py-1 rounded-full text-xs">
                        {history.length}
                      </span>
                    )}
                  </h3>
                  <div className="max-h-64 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent">
                    {history.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-2">🎲</div>
                        <div className="text-sm text_slate-400">{t('gacha.historyEmpty')}</div>
                        <div className="text-xs text-purple-400 mt-1">{t('gacha.historyHint')}</div>
                      </div>
                    ) : (
                      history.map((item, index) => (
                        <div key={index} className={`bg-gradient-to-r rounded-xl p-3 border transition-all duration-200 hover:scale-[1.02] ${
                          item.rarity === 'epic' ? 'from-purple-800/40 to-pink-800/40 border-purple-400/30' :
                          item.rarity === 'rare' ? 'from-yellow-800/40 to-orange-800/40 border-yellow-400/30' :
                          item.rarity === 'uncommon' ? 'from-blue-800/40 to-indigo-800/40 border-blue-400/30' :
                          'from-slate-800/40 to-slate-700/40 border-slate-500/30'
                        }`}>
                          <div className="flex items-start justify-between mb-2">
                          <div className="font-medium text-base md:text-sm text-white leading-relaxed md:leading-normal flex-1">
                            {localizedText(item.text)}
                          </div>
                            <div className={`ml-2 px-2 py-1 rounded-full text-xs font-bold shrink-0 ${
                              item.rarity === 'epic' ? 'bg-purple-500 text-white' :
                              item.rarity === 'rare' ? 'bg-yellow-500 text-white' :
                              item.rarity === 'uncommon' ? 'bg-blue-500 text-white' :
                              'bg-slate-500 text-white'
                            }`}>
                              {item.rarity === 'epic' ? '💎' :
                               item.rarity === 'rare' ? '⭐' :
                               item.rarity === 'uncommon' ? '🔮' : '🎯'}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm md:text-xs text-purple-200">
                            <span className="bg-purple-700/50 px-2 py-1 rounded-full text-xs md:text-xs">
                              {t(CATEGORY_LABELS[item.cat])}
                            </span>
                            <span className="opacity-75 text-xs md:text-xs">
                              {new Date(item.time).toLocaleDateString()}
                            </span>
                            {item.note && (
                              <span className="bg-pink-700/50 px-2 py-1 rounded-full text-xs md:text-xs">
                                {item.note}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Footer */}
          <div className="text-center mt-8 space-y-3">
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-sm md:text-sm text-purple-300">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>{t('gacha.footer.realtime')}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">⚡</span>
                <span>{t('gacha.footer.instant')}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-pink-400">🎨</span>
                <span>{t('gacha.footer.effects')}</span>
              </div>
            </div>
            <div className="text-xs md:text-sm text-purple-400 bg-purple-900/20 px-3 md:px-4 py-2 rounded-full border border-purple-500/20 inline-block max-w-full">
              ✨ {t('gacha.disclaimer')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuckyGacha;
  const themeNameMap: Record<string, string> = {
    '魔法奇迹周': 'magic',
    '幸运财富周': 'wealth',
    '爱情浪漫周': 'love',
    '事业成功周': 'career',
    '健康活力周': 'health',
    '创意灵感周': 'creativity',
    '友谊社交周': 'friendship',
    '冒险探索周': 'adventure'
  }

  const cn2ja: Record<string, string> = {
    '今天有人会对你暗暗好感，微笑回应即可。': '今日はあなたに好意を寄せる人がいるかも。笑顔で返しましょう。',
    '你的直觉很准，跟着感觉去做一件小决定。': '直感が冴えています。感覚に従って小さな決断を。',
    '钱包里有惊喜，别忘了检查口袋。': '財布に嬉しいサプライズ。ポケットの確認も忘れずに。',
    '午休 15 分钟，会让你精力翻倍。': '15分の昼休みで元気倍増。',
    '今天适合尝试新事物，惊喜常在小改变里。': '今日は新しいことに挑戦を。小さな変化に喜びが宿ります。',
    '今天会是平静而美好的一天，享受这份宁静。': '穏やかで素敵な一日。静けさを楽しんで。',
    '保持耐心，一切都会按最好的计划进行。': '忍耐を保てば、すべては最善の計画通りに進みます。',
    '今天适合整理思绪和制定未来的计划。': '思考を整理し、将来の計画を立てるのに適した日。',
    '小心谨慎会为你避免不必要的麻烦。': '慎重さが不要なトラブルを避けてくれます。',
    '今天是反思和总结的好时机，回顾过往收获智慧。': '振り返りと総括に最適な時。過去から学びを得ましょう。',
    '保持健康的生活习惯很重要，身体是革命的本钱。': '健康的な生活習慣が大切。体は何よりの資本です。',
    '今天适合与家人共度温馨时光，珍惜亲情。': '家族と温かな時間を。絆を大切に。',
    '简单的快乐往往最珍贵，学会知足常乐。': 'シンプルな幸せが一番尊い。足るを知る心を。',
    '今天记得多喝水，照顾好自己的身体。': '今日は水分をしっかりとって、体をいたわりましょう。',
    '温和的阳光会为你带来好心情。': '柔らかな陽光が良い気分を連れてきます。',
    '喜欢的人可能会发来意外消息，保持镇定。': '好きな人から思わぬ連絡があるかも。落ち着いて。',
    '你会在工作中发现可以简化流程的好主意。': '仕事で手順を簡素化する良いアイデアが見つかります。',
    '小额投资或理财阅读会给你新的方向。': '少額投資やマネー記事が新たな方向性を示します。',
    '今晚适合做一次放松拉伸或热水泡脚。': '今夜はストレッチや足湯でリラックスを。',
    '路上的一场小乌龙将变成笑谈，别放在心上。': '道中の小さなハプニングは笑い話に。気にしすぎないで。',
    '一个意外的电话将带来好消息。': '意外な電話が良い知らせを運びます。',
    '保持积极的心态，好事正在悄悄向你靠近。': '前向きな心が幸運を静かに呼び寄せます。',
    '你的笑容将感染身边的每一个人，成为他们的阳光。': 'あなたの笑顔が周りを照らします。',
    '今天是学习新技能的好日子，你的学习能力超乎想象。': '新しいスキル習得に最適な日。学習力は想像以上。',
    '一个小小的改变将带来大大的不同，勇敢迈出第一步。': '小さな変化が大きな違いに。勇気ある一歩を。',
    '今天你会发现生活中被忽略的小美好。': '見過ごしていた小さな美しさに気づけます。',
    '相信自己的能力，你比想象中更强大更有潜力。': '自分の力を信じて。可能性は想像以上。',
    '有人会在你最不经意时为你撑腰，记住感恩。': '思いがけない支えに感謝を忘れずに。',
    '有机会参加对你长远有利的项目，主动出击。': '長期的利益につながる案件に参加するチャンス。主体的に。',
    '你会得到一笔意外之财（可能是退税或报销）。': '臨時収入あり（返金や精算の可能性）。',
    '你的精神状态会有明显提升，适合开始新习惯。': '精神状態が向上。新しい習慣を始める好機。',
    '一件旧事将得到圆满的结局，庆祝一下吧。': '古い件が円満に決着。少し祝おう。',
    '今天是展现你才华的绝佳时机，所有人都会被你的能力所震撼。': '才能を示す絶好の機会。周囲を驚かせます。',
    '一个重要的决定将为你打开通往成功的新道路。': '重要な決断が成功への新しい道を開きます。',
    '你的努力即将得到应有的回报，收获的季节已经到来。': '努力に見合う成果が近づいています。収穫の季節。',
    '新的友谊将为你的生活带来意想不到的色彩和机会。': '新しい友情が予想外の彩りと機会をもたらします。',
    '一个重要的人将在关键时刻给你指导。': '大切な人が要所で指針を示してくれます。',
    '命运之门对你短暂开启：大胆说出你的心意吧。': '運命の扉が一時開きます。思いを大胆に伝えて。',
    '你将遇到改变职业轨迹的关键人物，把握时机。': 'キャリア軌道を変える重要人物に出会います。好機を逃さず。',
    '财富星高照：一个长期目标将迎来关键突破。': '財運の星が輝く。長期目標が大きく前進。',
    '健康能量爆棚，适合挑战自我并获显著回报。': '健康エネルギーが満ちています。挑戦に大きな成果。',
    '极其罕见的好运：今天可能是你记忆中的幸运日。': '非常に稀な幸運。今日は記憶に残るラッキーな日かも。',
    '今天你将遇到改变人生的重要机会！宇宙的能量正在为你排列最完美的时机。': '人生を変える重要なチャンスに遭遇！宇宙のエネルギーが最良のタイミングを整えています。',
    '意外之财即将降临！一个神秘的财富机会正在向你招手，准备好迎接惊喜吧！': '臨時収入が近づいています！神秘的な財の機会に備えて。',
    '真爱就在不远处等待着你的到来，今天可能就是命运安排的相遇之日。': '真実の愛がすぐそばに。今日は運命的な出会いの日かも。',
    '你的创意将获得巨大成功和认可！今天是展现天赋的绝佳时机。': '創意が大成功と評価を得ます！才能を示す絶好の時。',
    '✨ 魔法奇迹周：今天你身上散发着神秘的魔法光芒，奇迹即将发生！': '✨ 魔法奇跡ウィーク：あなたに神秘の光が宿り、奇跡が起こりそう！',
    '✨ 魔法能量正在你周围聚集，准备施展你的魔法吧！': '✨ 魔法のエネルギーが集まっています。魔法をかける準備を！',
    '✨ 今天你的愿望有特殊的实现力量。': '✨ 今日は願いが特別に叶いやすい日。',
    '💰 财富之神正在眷顾你，金钱运势达到顶峰！': '💰 財の神が微笑みます。金運は最高潮！',
    '💰 今天是投资和理财的黄金时机。': '💰 投資や資産管理の黄金タイミング。',
    '💰 小额意外收入正在路上。': '💰 少額の臨時収入がやってきます。',
    '💕 爱神丘比特的箭正瞄准你，真爱即将降临！': '💕 キューピッドの矢があなたへ。真実の愛が近づいています！',
    '💕 今天你的魅力值爆表，桃花运旺盛。': '💕 魅力が最大限。恋愛運が好調。',
    '💕 一个温暖的拥抱正在等待你。': '💕 温かなハグがあなたを待っています。',
    '🚀 事业火箭即将发射，成功的轨道已经锁定！': '🚀 仕事のロケットが発射準備完了。成功の軌道へ。',
    '🚀 今天你的工作表现将获得上级认可。': '🚀 業務の評価が上がります。',
    '🚀 一个职场机会正在向你招手。': '🚀 職場で新たな機会が手招き。',
    '🌟 生命能量达到巅峰，你将拥有超人般的活力！': '🌟 生命エネルギーが頂点へ。驚異的な活力！',
    '🌟 今天你的身体状态特别好，适合运动。': '🌟 今日の体調は特に良好。運動に適しています。',
    '🌟 一个健康的新习惯将改善你的生活。': '🌟 新しい健康習慣が生活を改善します。',
    '🎨 创意之神附体，你将创造出惊世之作！': '🎨 創意の神が降臨。傑作を生み出すでしょう！',
    '🎨 今天你的想象力无限，灵感如泉涌。': '🎨 想像力が無限。インスピレーションが湧きます。',
    '🎨 一个小小的创意将带来大大的惊喜。': '🎨 小さなアイデアが大きな驚きを。',
    '🤝 友谊之花将绽放出最美丽的光芒，贵人相助！': '🤝 友情の花が最も美しく咲き、支援者が現れます！',
    '🤝 今天你会结识一个重要的朋友。': '🤝 重要な友人と出会えます。',
    '🤝 朋友圈将为你带来好消息。': '🤝 友人の輪が良い知らせを運びます。',
    '🗺️ 冒险之路将引领你发现人生的宝藏！': '🗺️ 冒険の道が人生の宝物へ導きます！',
    '🗺️ 今天适合尝试从未做过的事情。': '🗺️ 未経験のことに挑戦するのに最適な日。',
    '🗺️ 一次小小的探索将带来新发现。': '🗺️ 小さな探索が新発見をもたらします。'
  }

  const localizedText = (text: string) => {
    const lang = (i18n.language || 'en').toLowerCase()
    if (lang.startsWith('ja') && cn2ja[text]) return cn2ja[text]
    return text
  }
