import { useState, useCallback } from 'react';
import { Star, Moon, Sun, Gem, Heart, Coins, Briefcase, Shield, AlertCircle, Sparkles, BookOpen, MessageCircle, Clock, Copy, X, AlertTriangle } from 'lucide-react';

// Type definitions
interface DivinationResult {
  question: string;
  reading: string;
  timestamp: number;
  method?: string;
  type?: string;
}

interface LotteryResult {
  number: string;
  poem: string;
  meaning: string;
  interpretation: string;
}

interface JiaobeResult {
  result: string;
  meaning: string;
}

interface InputData {
  birthInfo: {
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    gender: string;
  };
  lottery: LotteryResult | null;
  jiaobei: JiaobeResult | null;
}

// 中文文本配置
const texts = {
  title: '算算乐',
  subtitle: '算出惊喜，乐见未来。',
  selectMethod: '选择占卜方式',
  selectType: '选择咨询类型',
  detailInfo: '详细信息',
  question: '您想要咨询的问题',
  questionPlaceholder: '请详细描述您想要了解的问题...',
  startDivination: '开始占卜',
  divining: '正在占卜中...',
  result: '占卜结果',
  yourQuestion: '您的问题：',
  interpretation: '占卜解读：',
  timestamp: '占卜时间：',
  disclaimer: '✨ 占卜结果仅供参考，重要决定请结合理性思考 ✨',
  copyResult: '复制结果',
  clearResult: '清除结果',
  exportPDF: '导出PDF',
  print: '打印',
  aiGenerated: 'AI生成',
  offlineMode: '离线模式',
  webSearch: '网络搜索增强',
  nextSteps: '下一步建议：',
  generated: '生成',
  fallback: '离线模式',
  webSearchResults: '网络搜索结果',
  aiEnhanced: 'AI增强',
  searchEnhanced: '搜索增强',
  exportingPDF: '正在导出PDF...',
  printReady: '准备打印',
  copied: '已复制',
  // 表单字段标签
  name: '姓名',
  birthDate: '出生日期',
  birthTime: '出生时间',
  birthPlace: '出生地点',
  birthHour: '出生时辰',
  gender: '性别',
  selectHexagram: '选择卦象',
  cityName: '城市名称',
  // 求签相关文本
  drawLot: '虔诚求签',
  drawingLot: '正在抽签...',
  lotNumber: '签号',
  lotPoem: '签文',
  lotMeaning: '签意',
  prayFirst: '请先虔诚祈祷，然后点击抽签',
  lotResult: '求签结果',
  redrawLot: '重新抽签',
  // 擲筊相关文本
  throwJiaobei: '擲筊问卜',
  throwingJiaobei: '正在擲筊...',
  jiaobeResult: '擲筊结果',
  shengJiao: '聖筊',
  xiaoJiao: '笑筊',
  yinJiao: '陰筊',
  shengJiaoMeaning: '一正一反，神明同意您的请求',
  xiaoJiaoMeaning: '两个平面向上，神明在笑，并没有表示同意',
  yinJiaoMeaning: '平面朝下，表示请求驳回',
  prayBeforeJiaobei: '请先虔诚祈祷，然后点击擲筊',
  rethrowJiaobei: '重新擲筊',
  jiaobeResults: {
    'holy': '聖筊',
    'laughing': '笑筊',
    'yin': '陰筊'
  },
  // 占位符文本
  enterName: '请输入您的姓名',
  enterCity: '请输入出生城市，如：北京',
  selectGender: '请选择性别',
  selectHour: '请选择时辰',
  selectHexagramOption: '请选择卦象',
  // 性别选项
  male: '男',
  female: '女',
  // 错误信息
  errorSelectCards: '请选择至少一张塔罗牌',
  errorMaxCards: '最多选择10张塔罗牌',
  errorBirthInfo: '请提供完整的出生日期和时间',
  errorValidDate: '请提供有效的出生日期',
  errorHexagram: '请提供有效的卦象信息',
  errorNameAndDate: '请提供姓名和出生日期',
  errorValidName: '请提供有效的姓名（至少2个字符）',
  errorUnsupportedMethod: '不支持的占卜方法',
  errorAIService: 'AI服务暂时不可用，请稍后重试',
  errorEnterQuestion: '请输入您想要咨询的问题',
  selectTarotCards: '选择塔罗牌（多选）',
  optional: '可选',
  // 占卜方法标题和描述
  tarotReading: '塔罗占卜',
  tarotDescription: '通过神秘的塔罗牌获得人生指引',
  astrology: '星座占星',
  astrologyDescription: '解读星象运行对您的影响',
  lottery: '观音求签',
  lotteryDescription: '虔诚祈祷，抽取灵签获得指引',
  jiaobei: '擲筊问卜',
  jiaobeDescription: '擲筊求神明指示，获得明确答案',
  numerology: '数字命理',
  numerologyDescription: '通过数字能量揭示命运密码',
  bazi: '八字命理',
  baziDescription: '传统八字分析，洞察人生格局',
  ziwei: '紫微斗数',
  ziweiDescription: '紫微星盘解析，预测命运轨迹',
  personality: '性格测试',
  personalityDescription: '深度分析性格特质，了解真实自我',
  compatibility: '配对打分',
  compatibilityDescription: '测试两人缘分指数，分析感情匹配度',
  lifestory: '命格小故事',
  lifestoryDescription: '生成专属命运故事，趣味了解人生轨迹',
  // 咨询类型标题
  loveFortune: '感情运势',
  careerDevelopment: '事业发展',
  wealthFortune: '财富运程',
  healthStatus: '健康状况',
  generalFortune: '综合运势',
  // 塔罗牌名称
  tarotCards: {
    '愚者': '愚者',
    '魔术师': '魔术师',
    '女教皇': '女教皇',
    '皇后': '皇后',
    '皇帝': '皇帝',
    '教皇': '教皇',
    '恋人': '恋人',
    '战车': '战车',
    '力量': '力量',
    '隐者': '隐者',
    '命运之轮': '命运之轮',
    '正义': '正义',
    '倒吊人': '倒吊人',
    '死神': '死神',
    '节制': '节制',
    '恶魔': '恶魔',
    '塔': '塔',
    '星星': '星星',
    '月亮': '月亮',
    '太阳': '太阳',
    '审判': '审判',
    '世界': '世界'
  },
  // 易经64卦名称
  ichingHexagrams: {
    '1': '乾为天',
    '2': '坤为地',
    '3': '水雷屯',
    '4': '山水蒙',
    '5': '水天需',
    '6': '天水讼',
    '7': '地水师',
    '8': '水地比',
    '9': '风天小畜',
    '10': '天泽履',
    '11': '地天泰',
    '12': '天地否',
    '13': '天火同人',
    '14': '火天大有',
    '15': '地山谦',
    '16': '雷地豫',
    '17': '泽雷随',
    '18': '山风蛊',
    '19': '地泽临',
    '20': '风地观',
    '21': '火雷噬嗑',
    '22': '山火贲',
    '23': '山地剥',
    '24': '地雷复',
    '25': '天雷无妄',
    '26': '山天大畜',
    '27': '山雷颐',
    '28': '泽风大过',
    '29': '坎为水',
    '30': '离为火',
    '31': '泽山咸',
    '32': '雷风恒',
    '33': '天山遁',
    '34': '雷天大壮',
    '35': '火地晋',
    '36': '地火明夷',
    '37': '风火家人',
    '38': '火泽睽',
    '39': '水山蹇',
    '40': '雷水解',
    '41': '山泽损',
    '42': '风雷益',
    '43': '泽天夬',
    '44': '天风姤',
    '45': '泽地萃',
    '46': '地风升',
    '47': '泽水困',
    '48': '水风井',
    '49': '泽火革',
    '50': '火风鼎',
    '51': '震为雷',
    '52': '艮为山',
    '53': '风山渐',
    '54': '雷泽归妹',
    '55': '雷火丰',
    '56': '火山旅',
    '57': '巽为风',
    '58': '兑为泽',
    '59': '风水涣',
    '60': '水泽节',
    '61': '风泽中孚',
    '62': '雷山小过',
    '63': '水火既济',
    '64': '火水未济'
  },
  // 易经卦象简称（用于显示）
  qian: '乾',
  kun: '坤',
  zhun: '屯',
  meng: '蒙',
  xu: '需',
  song: '讼',
  shi: '师',
  bi: '比',
  xiaoxu: '小畜',
  lv: '履',
  tai: '泰',
  pi: '否',
  // 十二时辰
  zi: '子时(23:00-01:00)',
  chou: '丑时(01:00-03:00)',
  yin: '寅时(03:00-05:00)',
  mao: '卯时(05:00-07:00)',
  chen: '辰时(07:00-09:00)',
  si: '巳时(09:00-11:00)',
  wu: '午时(11:00-13:00)',
  wei: '未时(13:00-15:00)',
  shen: '申时(15:00-17:00)',
  you: '酉时(17:00-19:00)',
  xu_time: '戌时(19:00-21:00)',
  hai: '亥时(21:00-23:00)',
  
  // 观音灵签数据（100签）
  lotteryData: {
    '1': { poem: '锤凿玉成器，功名得遂心。如今时运至，只怕不专心。', meaning: '上上签', interpretation: '此签暗示经过努力雕琢，必能成就大器。当前时运亨通，只要专心致志，功名利禄皆可得。' },
    '2': { poem: '鲸鱼未变化，不可妄求谋。若是逢雷雨，头角始昂头。', meaning: '中平签', interpretation: '时机未到，不宜急进。需等待合适的机会，如遇贵人相助或环境改变，方能展现才华。' },
    '3': { poem: '临风冒雨去，恰似采花蜂。得甜须有毒，暗里有人攻。', meaning: '下下签', interpretation: '表面看似有利可图，实则暗藏危险。需谨慎行事，防范小人暗算。' },
    '4': { poem: '千里求师访道，早晚必定成功。劝君且守静，待时运亨通。', meaning: '中吉签', interpretation: '求学问道的路虽远，但终有所成。目前宜静待时机，不可急躁。' },
    '5': { poem: '一锹挖出土，两锹不见泥。直待三锹下，好土才能得。', meaning: '中平签', interpretation: '做事需要坚持，不能半途而废。只有持续努力，才能获得真正的成果。' },
    '6': { poem: '何须问神佛，自有好前程。莫听闲人语，荣华在后生。', meaning: '上吉签', interpretation: '前程光明，无需过分担忧。不要被他人闲言影响，坚持自己的道路必有成就。' },
    '7': { poem: '红轮西坠兔东升，阴长阳消百事亨。若问前程归宿地，秋冬时节见分明。', meaning: '中吉签', interpretation: '时运正在转换，阴阳调和万事顺利。前程需在秋冬季节才能明朗。' },
    '8': { poem: '一舟行在水中央，风恶浪高难进港。若得顺风相助力，不须劳力自安康。', meaning: '中平签', interpretation: '目前处境如船在风浪中，需要外力相助才能脱困。耐心等待贵人出现。' },
    '9': { poem: '望渠消息向长安，常把菱花仔细看。见说文书将入境，几回梦里笑开颜。', meaning: '上吉签', interpretation: '好消息即将到来，心中期盼的事情将有结果。保持乐观心态，喜事临门。' },
    '10': { poem: '石藏美玉在其中，得遇明师道始通。自此琢磨成大器，一朝身价与天同。', meaning: '上上签', interpretation: '如璞玉藏于石中，遇到明师指点方能成器。经过磨练必成大才，身价倍增。' },
    '11': { poem: '欲求财利似登天，若是求之亦枉然。劝君且守分内事，免使身心受熬煎。', meaning: '下签', interpretation: '求财如登天般困难，强求无益。应安分守己，避免身心煎熬。' },
    '12': { poem: '时来运转喜气生，登台拜将入王庭。一旦功成名就日，四海传扬播令名。', meaning: '上上签', interpretation: '时运转好，喜事临门。功成名就指日可待，声名远播四海。' },
    '13': { poem: '君今庚甲未亨通，且向江头作钓翁。玉兔重生应发迹，万人头上逞英雄。', meaning: '中吉签', interpretation: '目前运势未通，需耐心等待。待时机成熟，必能脱颖而出，成为人中豪杰。' },
    '14': { poem: '一朝无事忽遭官，也是前生作业愆。好把身心重改革，免教后世受熬煎。', meaning: '下签', interpretation: '突遇官司是前世业障，需改过自新，修身养性，避免后患。' },
    '15': { poem: '威人威威不是威，只当著力有箴规。劝君不用强梁志，天理昭彰不可欺。', meaning: '中平签', interpretation: '威势不可恃，应以德服人。不可强横霸道，天理昭彰，因果不虚。' },
    '16': { poem: '天边消息实难思，切莫多心望息时。若问求谋何日遂，贵人接引笑嘻嘻。', meaning: '中吉签', interpretation: '远方消息难料，不必多虑。若问谋事何时成，需等贵人相助，自有喜事。' },
    '17': { poem: '莫听闲言说是非，晨昏只好念阿弥。若将狂话为真实，书到终头悔恨迟。', meaning: '中平签', interpretation: '不要听信谣言是非，应专心修行念佛。若信谣言当真，到头来必定后悔。' },
    '18': { poem: '金乌西坠兔东升，日夜循环不暂停。僧道得之无不利，工商农士各相应。', meaning: '上吉签', interpretation: '日月循环，昼夜不停。无论僧道还是各行各业，都能获得相应的利益。' },
    '19': { poem: '急水滩头放船归，风波作浪欲何为。若要安然求稳静，等待时来运转时。', meaning: '中平签', interpretation: '如船在急流中，风波险恶。若要平安，需静待时机，等运势好转。' },
    '20': { poem: '当春久雨喜初晴，玉兔金乌渐渐明。旧事消散新事遂，看看一跳过龙门。', meaning: '上吉签', interpretation: '久雨初晴，阴霾散去。旧事了结新事顺遂，如鱼跃龙门，前程似锦。' }
  }

};

// Constants for divination methods and configurations
const DIVINATION_METHODS = {
  BAZI: 'bazi',
  ZIWEI: 'ziwei',
  LOTTERY: 'lottery',
  JIAOBEI: 'jiaobei'
};

const READING_TYPES = {
  LOVE: 'love',
  CAREER: 'career',
  WEALTH: 'wealth',
  HEALTH: 'health',
  GENERAL: 'general'
};

// 占卜方法配置
const methodConfig = {
  [DIVINATION_METHODS.BAZI]: {
    icon: Star,
    title: texts.bazi,
    description: texts.baziDescription,
    color: 'from-yellow-500 to-orange-500'
  },
  [DIVINATION_METHODS.ZIWEI]: {
    icon: Moon,
    title: texts.ziwei,
    description: texts.ziweiDescription,
    color: 'from-purple-500 to-indigo-500'
  },
  [DIVINATION_METHODS.LOTTERY]: {
    icon: Sun,
    title: texts.lottery,
    description: texts.lotteryDescription,
    color: 'from-orange-500 to-red-500'
  },
  [DIVINATION_METHODS.JIAOBEI]: {
    icon: Gem,
    title: texts.jiaobei,
    description: texts.jiaobeDescription,
    color: 'from-green-500 to-teal-500'
  }
};

// 咨询类型配置
const typeConfig = {
  [READING_TYPES.LOVE]: {
    icon: Heart,
    title: texts.loveFortune,
    color: 'from-pink-500 to-rose-500'
  },
  [READING_TYPES.CAREER]: {
    icon: Briefcase,
    title: texts.careerDevelopment,
    color: 'from-blue-500 to-cyan-500'
  },
  [READING_TYPES.WEALTH]: {
    icon: Coins,
    title: texts.wealthFortune,
    color: 'from-yellow-500 to-amber-500'
  },
  [READING_TYPES.HEALTH]: {
    icon: Shield,
    title: texts.healthStatus,
    color: 'from-green-500 to-emerald-500'
  },
  [READING_TYPES.GENERAL]: {
    icon: Sparkles,
    title: texts.generalFortune,
    color: 'from-purple-500 to-violet-500'
  }
};

// 简化的占卜应用组件
export default function FortuneTellingWebsite() {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DivinationResult | null>(null);
  const [error, setError] = useState('');
  const [inputData, setInputData] = useState<InputData>({
    birthInfo: { birthDate: '', birthTime: '', birthPlace: '', gender: '' },
    lottery: null,
    jiaobei: null
  });

  const updateInputData = useCallback((key: keyof InputData, value: any) => {
    setInputData(prev => ({ ...prev, [key]: value }));
  }, []);

  // 模拟占卜处理
  const processReading = async (method: string, type: string, question: string, data: any) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockResponses = {
      [DIVINATION_METHODS.BAZI]: '根据您的八字分析，您的命格属于偏财格，天生具有商业头脑和理财能力。当前大运走势良好，适合投资和创业。建议在今年下半年关注金融、科技等行业的机会。',
      [DIVINATION_METHODS.ZIWEI]: '紫微星盘显示，您的命宫主星为紫微星，具有领导才能和贵人运。近期财帛宫有吉星照耀，财运亨通。建议把握机会，积极进取。',
      [DIVINATION_METHODS.LOTTERY]: `您抽到的是第${data.lottery?.number || '1'}签：${data.lottery?.poem || '锤凿玉成器，功名得遂心'}。此签为${data.lottery?.meaning || '上上签'}，预示着经过努力必有收获。`,
      [DIVINATION_METHODS.JIAOBEI]: `擲筊结果为${data.jiaobei?.result || '聖筊'}，神明${data.jiaobei?.result === '聖筊' ? '同意' : data.jiaobei?.result === '笑筊' ? '未明确表态' : '不同意'}您的请求。建议${data.jiaobei?.result === '聖筊' ? '积极行动' : '重新考虑或等待时机'}。`
    };

    return {
      method,
      type,
      question,
      reading: mockResponses[method] || '占卜结果生成中，请稍候...',
      timestamp: Date.now(),
      isAIGenerated: false
    };
  };

  const handleSubmitReading = async () => {
    if (!selectedMethod || !selectedType || !question.trim()) {
      setError('请完整填写所有必填信息');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await processReading(selectedMethod, selectedType, question, inputData);
      setResult(result);
    } catch (err) {
      setError('占卜服务暂时不可用，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 抽签功能
  const drawLottery = () => {
    const numbers = Object.keys(texts.lotteryData);
    const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
    const lotteryData = texts.lotteryData[randomNumber as keyof typeof texts.lotteryData];
    const lottery = {
      number: randomNumber,
      ...lotteryData
    };
    updateInputData('lottery', lottery);
  };

  // 擲筊功能
  const throwJiaobei = () => {
    const results = ['holy', 'laughing', 'yin'] as const;
    const randomResult = results[Math.floor(Math.random() * results.length)];
    const meanings = {
      'holy': texts.shengJiaoMeaning,
      'laughing': texts.xiaoJiaoMeaning,
      'yin': texts.yinJiaoMeaning
    };
    
    const jiaobei = {
      result: texts.jiaobeResults[randomResult],
      meaning: meanings[randomResult]
    };
    updateInputData('jiaobei', jiaobei);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-yellow-400 mr-3" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              {texts.title}
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-400 ml-3" />
          </div>
          <p className="text-xl text-purple-200">{texts.subtitle}</p>
        </div>

        {/* Method Selection */}
        <div className="max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">{texts.selectMethod}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(methodConfig).map(([key, config]) => {
              const IconComponent = config.icon;
              return (
                <div
                  key={key}
                  onClick={() => setSelectedMethod(key)}
                  className={`relative p-6 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    selectedMethod === key
                      ? 'bg-gradient-to-r ' + config.color + ' shadow-2xl border-2 border-yellow-400'
                      : 'bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600'
                  }`}
                >
                  {selectedMethod === key && (
                    <Star className="absolute top-2 right-2 w-6 h-6 text-yellow-400 fill-current" />
                  )}
                  <div className="text-center">
                    <IconComponent className="w-12 h-12 mx-auto mb-3" />
                    <h3 className="font-bold text-lg mb-2">{config.title}</h3>
                    <p className="text-sm opacity-80">{config.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Type Selection */}
        {selectedMethod && (
          <div className="max-w-4xl mx-auto mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">{texts.selectType}</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(typeConfig).map(([key, config]) => {
                const IconComponent = config.icon;
                return (
                  <div
                    key={key}
                    onClick={() => setSelectedType(key)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                      selectedType === key
                        ? 'bg-gradient-to-r ' + config.color + ' shadow-xl border-2 border-yellow-400'
                        : 'bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600'
                    }`}
                  >
                    <div className="text-center">
                      <IconComponent className="w-8 h-8 mx-auto mb-2" />
                      <p className="font-semibold text-sm">{config.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Input Forms */}
        {selectedMethod && selectedType && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-purple-900/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/20">
              <h2 className="text-2xl font-bold mb-6 text-center">{texts.detailInfo}</h2>

              {/* 八字命理输入 */}
              {selectedMethod === DIVINATION_METHODS.BAZI && (
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">{texts.birthDate} <span className="text-red-400">*</span></label>
                      <input
                        type="date"
                        className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white"
                        onChange={(e) => updateInputData('birthInfo', {
                          ...inputData.birthInfo,
                          birthDate: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{texts.birthTime} <span className="text-red-400">*</span></label>
                      <input
                        type="time"
                        className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white"
                        onChange={(e) => updateInputData('birthInfo', {
                          ...inputData.birthInfo,
                          birthTime: e.target.value
                        })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">{texts.birthPlace}</label>
                      <input
                        type="text"
                        placeholder={texts.enterCity}
                        className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400"
                        onChange={(e) => updateInputData('birthInfo', {
                          ...inputData.birthInfo,
                          birthPlace: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{texts.gender}</label>
                      <select
                        className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white"
                        onChange={(e) => updateInputData('birthInfo', {
                          ...inputData.birthInfo,
                          gender: e.target.value
                        })}
                      >
                        <option value="">{texts.selectGender}</option>
                        <option value="male">{texts.male}</option>
                        <option value="female">{texts.female}</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* 紫微斗数输入 */}
              {selectedMethod === DIVINATION_METHODS.ZIWEI && (
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">{texts.birthDate} <span className="text-red-400">*</span></label>
                      <input
                        type="date"
                        className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white"
                        onChange={(e) => updateInputData('birthInfo', {
                          ...inputData.birthInfo,
                          birthDate: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{texts.birthTime} <span className="text-red-400">*</span></label>
                      <input
                        type="time"
                        className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white"
                        onChange={(e) => updateInputData('birthInfo', {
                          ...inputData.birthInfo,
                          birthTime: e.target.value
                        })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{texts.gender}</label>
                    <select
                      className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white"
                      onChange={(e) => updateInputData('birthInfo', {
                        ...inputData.birthInfo,
                        gender: e.target.value
                      })}
                    >
                      <option value="">{texts.selectGender}</option>
                      <option value="male">{texts.male}</option>
                      <option value="female">{texts.female}</option>
                    </select>
                  </div>
                </div>
              )}

              {/* 观音求签 */}
              {selectedMethod === DIVINATION_METHODS.LOTTERY && (
                <div className="mb-6">
                  <div className="text-center">
                    <p className="mb-4 text-purple-200">{texts.prayFirst}</p>
                    <button
                      onClick={drawLottery}
                      className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-lg font-semibold transition-all duration-300 mb-4"
                    >
                      {texts.drawLot}
                    </button>
                    {inputData.lottery && (
                      <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-500/30">
                        <h4 className="font-bold text-orange-300 mb-2">{texts.lotResult}</h4>
                        <p><strong>{texts.lotNumber}：</strong>第{inputData.lottery.number}签</p>
                        <p><strong>{texts.lotPoem}：</strong>{inputData.lottery.poem}</p>
                        <p><strong>{texts.lotMeaning}：</strong>{inputData.lottery.meaning}</p>
                        <button
                          onClick={drawLottery}
                          className="mt-3 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded text-sm transition-colors"
                        >
                          {texts.redrawLot}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 擲筊问卜 */}
              {selectedMethod === DIVINATION_METHODS.JIAOBEI && (
                <div className="mb-6">
                  <div className="text-center">
                    <p className="mb-4 text-purple-200">{texts.prayBeforeJiaobei}</p>
                    <button
                      onClick={throwJiaobei}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 rounded-lg font-semibold transition-all duration-300 mb-4"
                    >
                      {texts.throwJiaobei}
                    </button>
                    {inputData.jiaobei && (
                      <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/30">
                        <h4 className="font-bold text-green-300 mb-2">{texts.jiaobeResult}</h4>
                        <p className="text-2xl font-bold text-green-400 mb-2">{inputData.jiaobei.result}</p>
                        <p className="text-green-200">{inputData.jiaobei.meaning}</p>
                        <button
                          onClick={throwJiaobei}
                          className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
                        >
                          {texts.rethrowJiaobei}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Question Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">{texts.question} <span className="text-red-400">*</span></label>
                <textarea
                  className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400 h-24 resize-none"
                  placeholder={texts.questionPlaceholder}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitReading}
                disabled={isLoading}
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 rounded-lg font-semibold transition-all duration-300 disabled:cursor-not-allowed"
              >
                {isLoading ? texts.divining : texts.startDivination}
              </button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                <span className="text-red-200">{error}</span>
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 backdrop-blur-sm rounded-2xl p-8 mb-6 border border-purple-400/20 shadow-2xl">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mb-4 shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
                  {texts.result}
                </h2>
                <div className="flex items-center justify-center space-x-3 mb-3">
                  {result.method && methodConfig[result.method] && (
                    <span className="px-4 py-2 bg-purple-600/30 rounded-full text-purple-200 text-sm font-medium">
                      {methodConfig[result.method].title}
                    </span>
                  )}
                  {result.method && result.type && methodConfig[result.method] && typeConfig[result.type] && (
                    <span className="text-purple-400">·</span>
                  )}
                  {result.type && typeConfig[result.type] && (
                    <span className="px-4 py-2 bg-blue-600/30 rounded-full text-blue-200 text-sm font-medium">
                      {typeConfig[result.type].title}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl border border-purple-400/20 shadow-2xl overflow-hidden">
              {/* Question Section */}
              <div className="bg-gradient-to-r from-purple-800/40 to-indigo-800/40 p-6 border-b border-purple-400/20">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <MessageCircle className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-yellow-400 mb-3">{texts.yourQuestion}</h3>
                    <div className="bg-purple-700/30 rounded-xl p-4 border-l-4 border-yellow-400">
                      <p className="text-purple-100 text-base leading-relaxed italic">"{result.question}"</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reading Section */}
              <div className="p-6">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <BookOpen className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-orange-400 mb-4">{texts.interpretation}</h3>
                    <div className="bg-gradient-to-br from-slate-800/40 via-purple-800/30 to-blue-800/40 rounded-xl p-8 border border-purple-400/30 shadow-2xl backdrop-blur-sm">
                      <div className="text-purple-50 text-base leading-relaxed">
                        {result.reading}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gradient-to-r from-purple-800/30 to-indigo-800/30 p-6 border-t border-purple-400/20">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-center space-x-2 text-purple-300">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{texts.timestamp}{new Date(result.timestamp).toLocaleString('zh-CN')}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <button 
                      onClick={() => navigator.clipboard.writeText(`${texts.yourQuestion}${result.question}\n\n${texts.interpretation}${result.reading}`)}
                      className="px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2 border border-purple-500/30 hover:border-purple-400/50"
                    >
                      <Copy className="w-4 h-4" />
                      <span>{texts.copyResult}</span>
                    </button>
                    <button 
                      onClick={() => setResult(null)}
                      className="px-4 py-2 bg-gray-600/30 hover:bg-gray-600/50 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2 border border-gray-500/30 hover:border-gray-400/50"
                    >
                      <X className="w-4 h-4" />
                      <span>{texts.clearResult}</span>
                    </button>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-purple-400/20">
                  <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-400/20">
                    <p className="text-yellow-300 text-sm text-center flex items-center justify-center space-x-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{texts.disclaimer}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}