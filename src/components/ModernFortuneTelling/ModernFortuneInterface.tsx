import React, { useState, useMemo } from 'react';
import { 
  Star, Moon, Sun, Gem, Zap, Heart, Crown, ArrowLeft, Sparkles, 
  Send, Shuffle, Download, Share2, BookOpen, Clock, User, Calendar,
  MapPin, Wand2, Eye, Target, ChevronRight, Loader2, Wifi, WifiOff,
  FileText, Printer, Lightbulb, Trash2, Hash, Briefcase, DollarSign, Activity
} from 'lucide-react';
import { useProfile } from '../../contexts/ProfileContext';
import llmService from '../../utils/llmService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../../styles/modern-fortune.css';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface FortuneMethod {
  id: string;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  color: string;
  category: string;
}

interface ModernFortuneInterfaceProps {
  selectedMethodId: string;
  onBack: () => void;
}

const fortuneMethods: Record<string, FortuneMethod> = {
  'astrology': {
    id: 'astrology',
    icon: Star,
    title: '星座占星',
    description: '解读星象运行对您的影响',
    color: 'from-blue-500 to-indigo-500',
    category: 'modern'
  },
  'bazi': {
    id: 'bazi',
    icon: Crown,
    title: '八字命理',
    description: '传统八字分析，洞察人生格局',
    color: 'from-yellow-500 to-orange-500',
    category: 'traditional'
  },
  'ziwei': {
    id: 'ziwei',
    icon: Moon,
    title: '紫微斗数',
    description: '紫微星盘解析，预测命运轨迹',
    color: 'from-purple-500 to-indigo-500',
    category: 'traditional'
  },
  'lottery': {
    id: 'lottery',
    icon: Sun,
    title: '观音求签',
    description: '虔诚祈祷，抽取灵签获得指引',
    color: 'from-orange-500 to-red-500',
    category: 'traditional'
  },
  'jiaobei': {
    id: 'jiaobei',
    icon: Gem,
    title: '擲筊问卜',
    description: '擲筊求神明指示，获得明确答案',
    color: 'from-green-500 to-teal-500',
    category: 'traditional'
  },
  'tarot': {
    id: 'tarot',
    icon: Star,
    title: '塔罗占卜',
    description: '通过神秘的塔罗牌获得人生指引',
    color: 'from-purple-500 to-pink-500',
    category: 'modern'
  },
  'personality': {
    id: 'personality',
    icon: User,
    title: '性格测试',
    description: '深度分析性格特质，了解真实自我',
    color: 'from-green-500 to-emerald-500',
    category: 'quick'
  },
  'compatibility': {
    id: 'compatibility',
    icon: Heart,
    title: '配对打分',
    description: '测试两人缘分指数，分析感情匹配度',
    color: 'from-pink-500 to-rose-500',
    category: 'relationship'
  },
  'numerology': {
    id: 'numerology',
    icon: Target,
    title: '数字命理',
    description: '通过数字能量揭示命运密码',
    color: 'from-indigo-500 to-blue-500',
    category: 'modern'
  },
  'lifestory': {
    id: 'lifestory',
    icon: BookOpen,
    title: '命格小故事',
    description: '生成专属命运故事，趣味了解人生轨迹',
    color: 'from-teal-500 to-cyan-500',
    category: 'quick'
  }
};

const ModernFortuneInterface: React.FC<ModernFortuneInterfaceProps> = ({ 
  selectedMethodId, 
  onBack 
}) => {
  const { t, i18n } = useTranslation();
  const { profile, isProfileComplete, updateProfile } = useProfile();
  const [step, setStep] = useState<'input' | 'processing' | 'result'>('input');
  const [question, setQuestion] = useState('');
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [result, setResult] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [isUsingAI, setIsUsingAI] = useState(true);
  const [apiError, setApiError] = useState<string>('');
  const [showPlainLanguage, setShowPlainLanguage] = useState(false);
  const [plainLanguageResult, setPlainLanguageResult] = useState<string>('');
  const [isGeneratingPlainLanguage, setIsGeneratingPlainLanguage] = useState(false);
  const [drawnLottery, setDrawnLottery] = useState<{number: string, poem: string, meaning: string, interpretation: string} | null>(null);
  const [drawnJiaobei, setDrawnJiaobei] = useState<{result: string, meaning: string} | null>(null);
  const [consultationType, setConsultationType] = useState<string>('');
  const navigate = useNavigate();
  const dateLocale = i18n.language.startsWith('ja') ? 'ja-JP' : (i18n.language.startsWith('en') ? 'en-US' : 'zh-CN');
  const selectedMethod = fortuneMethods[selectedMethodId];
  const displayMethodTitle = selectedMethod ? (t(`home.methods.${selectedMethodId}.title`) || selectedMethod.title) : '';

  const drawJiaobei = () => {
    const results = [
      t('modern.jiaobei.results.sheng'),
      t('modern.jiaobei.results.xiao'),
      t('modern.jiaobei.results.yin')
    ];
    const meanings: Record<string, string> = {
      [t('modern.jiaobei.results.sheng')]: t('modern.jiaobei.meanings.sheng'),
      [t('modern.jiaobei.results.xiao')]: t('modern.jiaobei.meanings.xiao'),
      [t('modern.jiaobei.results.yin')]: t('modern.jiaobei.meanings.yin')
    };
    const randomResult = results[Math.floor(Math.random() * results.length)];
    setDrawnJiaobei({result: randomResult, meaning: meanings[randomResult]});
  };

  // Clean markdown formatting from text
  const cleanMarkdownText = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove **bold**
      .replace(/\*(.*?)\*/g, '$1')     // Remove *italic*
      .replace(/#{1,6}\s*/g, '')       // Remove ### headers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove [text](link)
      .replace(/`([^`]+)`/g, '$1')     // Remove `code`
      .replace(/^\s*[-*+]\s+/gm, '• ') // Convert list markers to bullets
      .replace(/^\s*\d+\.\s+/gm, '')  // Remove numbered list markers
      .replace(/\n{3,}/g, '\n\n')     // Reduce multiple newlines
      .trim();
  };

  // Format text for better display
  const formatDisplayText = (text: string): string => {
    const cleaned = cleanMarkdownText(text);
    return cleaned
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n\n');
  };
  
  // Session-specific input fields (not stored in profile)
  const [sessionData, setSessionData] = useState({
    occupation: '',
    hobbies: '',
    selfDescription: ''
  });

  // Compatibility data for relationship analysis
  const [compatibilityData, setCompatibilityData] = useState({
    person1: {
      name: '',
      age: '',
      birthDate: '',
      birthTime: '',
      gender: '',
      birthPlace: '',
      personality: '',
      hobbies: ''
    },
    person2: {
      name: '',
      age: '',
      birthDate: '',
      birthTime: '',
      gender: '',
      birthPlace: '',
      personality: '',
      hobbies: ''
    },
    relationshipType: '',
    duration: ''
  });

  const handleSessionDataChange = (field: string, value: string) => {
    setSessionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCompatibilityDataChange = (person: 'person1' | 'person2', field: string, value: string) => {
    setCompatibilityData(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        [field]: value
      }
    }));
  };

  const handleCompatibilityRelationChange = (field: string, value: string) => {
    setCompatibilityData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Tarot cards data
  const tarotCards = t('modern.cards.names', { returnObjects: true }) as Record<string, string>;
  const tarotMeanings = t('modern.cards.meanings', { returnObjects: true }) as Record<string, string>;

  if (!selectedMethod) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p>{t('modern.notFound')}</p>
          <button 
            onClick={onBack}
            className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg"
          >
            {t('common.back')}
          </button>
        </div>
      </div>
    );
  }

  const IconComponent = selectedMethod.icon;

  // Lottery (观音求签) data - 100 traditional oracle signs
  const lotteryData: Record<string, {poem: string, meaning: string, interpretation: string}> = {
    '1': { poem: '锤凿玉成器，功名得遂心。如今时运至，只怕不专心。', meaning: '上上签', interpretation: '此签暗示经过努力雕琢，必能成就大器。当前时运亨通，只要专心致志，功名利禄皆可得。' },
    '2': { poem: '鲸鱼未变化，不可妄求谋。若是逢雷雨，头角始昂头。', meaning: '中平签', interpretation: '时机未到，不宜急进。需等待合适的机会，如遇贵人相助或环境改变，方能展现才华。' },
    '3': { poem: '临风冒雨去，恰似采花蜂。得甜须有毒，暗里有人攻。', meaning: '下下签', interpretation: '表面看似有利可图，实则暗藏危险。需谨慎行事，防范小人暗算。' },
    '4': { poem: '饮水须思源，才能保安然。切莫贪心过，福禄自然全。', meaning: '中吉签', interpretation: '提醒要知恩图报，保持谦逊。过度贪婪会带来祸患，知足常乐才能保持平安。' },
    '5': { poem: '门第光辉大，簪缨继世长。若问前程事，更上一层楼。', meaning: '上吉签', interpretation: '家运昌盛，前程似锦。事业发展顺利，有望更进一步。' },
    '6': { poem: '何事古今情不定，纷纷禾黍总无凭。伤心者倍伤心切，天意茫茫莫认真。', meaning: '下签', interpretation: '感情容易有变数，不宜过度投入。需保持理性，顺其自然。' },
    '7': { poem: '一夜春风花满树，万紫千红映日红。莫疑花事无多日，恰值花开二度春。', meaning: '上签', interpretation: '好运连连，如春风得意。即使有挫折也能重新开始，前景光明。' },
    '8': { poem: '水晶之数定无移，莫听傍人说是非。一着仙机君记取，纷纷闲事莫多疑。', meaning: '中签', interpretation: '命运已定，不要受他人言论影响。保持初心，专注自己的道路。' },
    '9': { poem: '宝剑出匣耀光明，在匣全然不见形。今得贵人携出现，有威有势众人钦。', meaning: '上上签', interpretation: '得遇贵人提携，才华得以展现。将获得权威地位，受人敬重。' },
    '10': { poem: '投身富贵等闲来，宝贵荣华莫疑猜。万事开头皆有意，行藏总在遇时开。', meaning: '上吉签', interpretation: '富贵将至，不必怀疑。万事开头虽难，但适时而动必有收获。' },
    '11': { poem: '东西南北皆亨通，出入营谋大吉昌。福德正神明庇佑，时来终遇主人翁。', meaning: '大吉签', interpretation: '四方皆通，营谋大吉。有神明庇佑，终将遇到贵人相助。' },
    '12': { poem: '君尔何须问圣意，自己心里有明灯。若能明得灯中意，前途通达见光明。', meaning: '中上签', interpretation: '答案在你心中，保持内心的明智。按照本心行事，前途光明。' },
    '13': { poem: '破屋又遭连夜雨，行船又遇打头风。眼前目下多不顺，且待云开见日红。', meaning: '下签', interpretation: '诸事不顺，如雪上加霜。需要耐心等待，云开雾散后必见光明。' },
    '14': { poem: '五湖四海任君游，发迹声名遍九州。改换门第新气象，秋来禾稻稻粱秋。', meaning: '上签', interpretation: '自由发展空间广阔，声名远播。将有新的发展机会，秋季特别有收获。' },
    '15': { poem: '当春久雨喜开晴，玉兔金鸟渐渐明。旧事消散新事遂，看看一跃过龙门。', meaning: '上吉签', interpretation: '困境即将结束，好运来临。旧的烦恼消散，新的机会出现，有跃龙门之象。' },
    '16': { poem: '官事消散吉又吉，小人从此永无侵。病者遇之得恢复，入宅搬移尽称心。', meaning: '大吉签', interpretation: '官司纠纷消除，小人远离。疾病康复，搬迁吉利，诸事如意。' },
    '17': { poem: '过河拆桥不为功，鸟尽弓藏亦不忠。独立桥头烟雨里，行人咫尺见无踪。', meaning: '下下签', interpretation: '恩将仇报，不义行为。孤立无援时才知道朋友的重要，需反省自己的行为。' },
    '18': { poem: '杨柳垂金线，花开富贵春。所求皆如意，福德胜千金。', meaning: '上上签', interpretation: '如花开富贵，春风得意。所求皆能如愿，福德深厚如千金。' },
    '19': { poem: '急水滩头放船难，险中求得保平安。若问前程归底事，且向平水立脚看。', meaning: '中下签', interpretation: '处境险峻，需小心谨慎。暂时求稳为主，等待时机再求发展。' },
    '20': { poem: '当风门户正兴隆，金玉堆藏库府充。若问前程归底事，十分满足得成功。', meaning: '上吉签', interpretation: '家业兴隆，财富充足。前程大好，必能十分满足地获得成功。' },
    '21': { poem: '秋月圆时是几时，月圆花好事难齐。一朝风雨花零落，月缺花残两处悲。', meaning: '中下签', interpretation: '好事难以齐全，需要珍惜当下。世事变迁无常，要有心理准备应对变化。' },
    '22': { poem: '心内事事总周全，前程快乐色怡然。那知平地风波起，一炬无明把慧燃。', meaning: '中平签', interpretation: '表面顺利，内心却需保持警觉。平静中可能暗藏风波，需要智慧应对。' },
    '23': { poem: '欲就新功恐不成，用心祈神得天真。三思而后行必吉，莫被他人意不诚。', meaning: '中吉签', interpretation: '新计划需要三思而后行。诚心祈求神明庇佑，但要防范他人不诚之意。' },
    '24': { poem: '一人单床有梦魂，思君不见泪如麻。若能会面重开聚，胜似黄金不用挂。', meaning: '中平签', interpretation: '思念之情深切，期待重聚。情感方面需要耐心等待，珍惜感情比财富更重要。' },
    '25': { poem: '过了忧病又忧病，过了春来又夏至。出入求谋少失财，亦贪不得更多儿。', meaning: '中下签', interpretation: '忧虑不断，但需要知足常乐。求财有小得，但不宜贪心，适可而止为宜。' },
    '26': { poem: '天边鸿雁送书来，久病逢医病自除。从此门庭多吉庆，婚姻财利总相宜。', meaning: '上吉签', interpretation: '好消息即将到来，疾病康复。家庭和睦，婚姻幸福，财运亨通，诸事顺遂。' },
    '27': { poem: '一箭射来一字歌，九州行遍叫娑婆。飞禽走兽皆逃散，唯有林猿挂树窝。', meaning: '中平签', interpretation: '虽有威力但需适度，不可过于张扬。保持谦逊，避免四处树敌。' },
    '28': { poem: '一点原神在太虚，莫向聪明认故居。抛卸荣华归去后，世人还有记存无。', meaning: '中上签', interpretation: '追求精神境界胜过物质享受。放下虚荣，回归本真，才能获得内心的平静。' },
    '29': { poem: '年来丰熟米粮高，大小齐欢乐陶陶。谢天谢地逢大有，少灾少病人安乐。', meaning: '上上签', interpretation: '五谷丰登，家庭和睦。平安健康，少灾少病，是人生最大的福分。' },
    '30': { poem: '劝君切莫向前跡，前有深潭万丈深。三思而后求安稳，莫使身心不定心。', meaning: '下签', interpretation: '前路危险，不宜冒进。需要深思熟虑，求稳为上，保持内心安定。' },
    '31': { poem: '一朝无事忽遭官，也是门衰坏运中。改旧从新君记取，谨密切莫逞英雄。', meaning: '中下签', interpretation: '可能遭遇官非或纠纷。需要改过自新，保持低调，不可逞强好胜。' },
    '32': { poem: '楼台深处雾朦胧，春景休囚对暮空。终日思君君不见，一风吹断碧梧桐。', meaning: '中平签', interpretation: '期待中的事情暂时看不清楚。需要耐心等待，保持信心，终有拨云见日时。' },
    '33': { poem: '玉出昆山石最良，雕琢成器始为珍。如今句得其时用，价值连城不用贫。', meaning: '上上签', interpretation: '经过雕琢的璞玉终成器。努力和坚持会得到回报，价值得到认可。' },
    '34': { poem: '红轮西坠兔东升，月里嫦娥风貌新。虽有彩云遮玉兔，不如深院待诗人。', meaning: '中上签', interpretation: '美好的事物即将到来。虽有暂时的阻碍，但终究会有圆满的结果。' },
    '35': { poem: '船泊汀洲人不闻，鱼龙出没水云深。王侯公相皆虚假，何不回头悟道心。', meaning: '中平签', interpretation: '名利皆虚幻，不如修身养性。回归内心，追求精神上的升华更为重要。' },
    '36': { poem: '一朝华盖拜重臣，久被迟疑事不成。此去有人相救护，谨防是非口舌争。', meaning: '中吉签', interpretation: '有望获得重要职位或机会。虽有贵人相助，但需防范口舌是非。' },
    '37': { poem: '忽然一夜雨兼风，桃李花满地红。幸有园丁来保护，不然狼藉受空空。', meaning: '中吉签', interpretation: '虽遇风雨摧残，但有人保护支持。危机中有转机，需要感恩帮助者。' },
    '38': { poem: '青天白云冷更清，只恐是非口舌争。闲事莫管能招祸，只要安心守己身。', meaning: '中平签', interpretation: '保持清醒头脑，不要多管闲事。专注自己的事情，避免卷入是非争端。' },
    '39': { poem: '金鳞深水日初红，变化时来志气雄。从此鱼龙新别路，通天水阔自朝宗。', meaning: '上上签', interpretation: '时机已到，可以展现雄心壮志。如鱼跃龙门，前程广阔无限。' },
    '40': { poem: '镜月当空出现中，但虽光彩未圆通。石榴火就防虚度，何事逢年不济丰。', meaning: '中平签', interpretation: '虽有光彩但尚未圆满。需要防止虚度光阴，把握当下才能获得丰收。' },
    '41': { poem: '须有根基方可成，如无根基且停行。莫听他人头白语，损失前功枉费心。', meaning: '中下签', interpretation: '做事需要坚实基础。不要轻信他人言语，坚持到底才不会前功尽弃。' },
    '42': { poem: '我曾许愿在先时，岂料新来愿未施。到底有神暗庇佑，今朝果然天从人愿。', meaning: '上吉签', interpretation: '许下的愿望虽然延迟，但终会实现。神明暗中庇佑，愿望成真指日可待。' },
    '43': { poem: '一株枯木再逢春，自有佳人步月新。琴瑟重调和美好，福来那怕不成名。', meaning: '上签', interpretation: '枯木逢春，重获生机。感情生活将有美好变化，幸福胜过名利。' },
    '44': { poem: '红叶知时自又青，暮云霭霭见天晴。平居本分修身行，自然祸患不能生。', meaning: '中上签', interpretation: '顺应自然规律，保持本分。修身养性，祸患自然远离，心境平和。' },
    '45': { poem: '一生行善唯济贫，处世为人要小心。切莫贪非内招祸，祸来临头悔恨深。', meaning: '中吉签', interpretation: '行善积德是正道。为人处世要谨慎，不可贪非分之财，以免招祸。' },
    '46': { poem: '一朝得遇龙虎榜，多年窘迫日昭苏。春来枯木重生叶，恰似莲花出污泥。', meaning: '上上签', interpretation: '困顿多年终得志。如枯木逢春、莲花出污泥，苦尽甘来，前程似锦。' },
    '47': { poem: '逢敌须防口舌争，免使旁人说不平。今者省心宜自守，秋来音信见分明。', meaning: '中下签', interpretation: '需防范口舌争端，保持沉默为上。耐心等待，秋季会有明确的消息。' },
    '48': { poem: '锦上添花色艳红，好事如今渐渐浓。秋菊傲霜君记取，晚来那怕冷清风。', meaning: '上吉签', interpretation: '好事连连，如锦上添花。要学习秋菊傲霜的品格，不怕晚来的挑战。' },
    '49': { poem: '光华夜来满院明，一间绝却有无名。若还更问前程事，须过三旬见太平。', meaning: '中上签', interpretation: '前路光明，但仍需低调。询问前程的话，需要一个月后才会见到太平。' },
    '50': { poem: '朝朝役役恰如蜂，飞来飞去不停行。到底谁收蜂密去，一生辛苦总成空。', meaning: '下签', interpretation: '忙碌如蜜蜂，但收获被他人取得。需要反思工作方式，避免无意义的辛劳。' },
  };

  // Draw lottery function
  const drawLottery = () => {
    const lotteryNumbers = Object.keys(lotteryData);
    const randomNumber = lotteryNumbers[Math.floor(Math.random() * lotteryNumbers.length)];
    const selectedLottery = lotteryData[randomNumber];
    
    setDrawnLottery({
      number: randomNumber,
      poem: selectedLottery.poem,
      meaning: selectedLottery.meaning,
      interpretation: selectedLottery.interpretation
    });
  };

  // Generate lottery-specific fortune result based on drawn lottery and question
  const generateLotteryFallback = (drawnLottery: {number: string, poem: string, meaning: string, interpretation: string}, question: string, method: string) => {
    const lotteryNumber = drawnLottery.number;
    const poems = (t('modern.lottery.poems', { returnObjects: true }) as Record<string, string>) || {};
    const meaningsMap = (t('modern.lottery.meanings', { returnObjects: true }) as Record<string, string>) || {};
    const poem = poems[lotteryNumber] || drawnLottery.poem;
    const meaning = meaningsMap[lotteryNumber] || drawnLottery.meaning;
    const interpretation = drawnLottery.interpretation;

    const qLower = question.toLowerCase();
    let contextualAdvice = t('modern.lottery.advice.generic');
    if (qLower.includes('love') || qLower.includes('恋') || qLower.includes('感情')) contextualAdvice = t('modern.lottery.advice.love');
    else if (qLower.includes('work') || qLower.includes('career') || qLower.includes('事业') || qLower.includes('工作')) contextualAdvice = t('modern.lottery.advice.career');
    else if (qLower.includes('wealth') || qLower.includes('money') || qLower.includes('财') || qLower.includes('金')) contextualAdvice = t('modern.lottery.advice.wealth');
    else if (qLower.includes('health') || qLower.includes('身体') || qLower.includes('病')) contextualAdvice = t('modern.lottery.advice.health');
    else if (qLower.includes('study') || qLower.includes('学业') || qLower.includes('考试')) contextualAdvice = t('modern.lottery.advice.study');

    return `🙏 ${t('modern.lottery.fallbackTitle', { number: lotteryNumber })}

${t('modern.lottery.fallbackIntro', { question, meaning })}

📜 ${t('modern.lottery.poemTitle')}
"${poem}"

🔰 ${t('modern.lottery.meaningTitle')}
${interpretation}

✨ ${t('modern.lottery.adviceTitle')}
${contextualAdvice}

🌟 ${t('modern.lottery.actionsTitle')}
1. ${t('modern.lottery.actions.1')}
2. ${t('modern.lottery.actions.2')}
3. ${t('modern.lottery.actions.3')}
4. ${t('modern.lottery.actions.4')}

🎯 ${t('modern.lottery.timingTitle')}
${t('modern.lottery.timingHint')}

🌙 ${t('modern.lottery.blessingTitle')}
${t('modern.lottery.blessingHint')}`;
  };

  // Generate tarot-specific fortune result based on selected cards and question
  const generateTarotFallback = (selectedCards: string[], question: string, method: string) => {
    const interpretations = selectedCards.map(card => {
      const name = (tarotCards && tarotCards[card]) || card;
      const meaning = (tarotMeanings && tarotMeanings[card]) || t('modern.tarot.meaningDefault');
      return `🃏 **${name}**: ${meaning}`;
    }).join('\n\n');

    const qLower = question.toLowerCase();
    let contextualAdvice = t('modern.tarot.advice.generic');
    if (qLower.includes('love') || qLower.includes('恋') || qLower.includes('感情')) contextualAdvice = t('modern.tarot.advice.love');
    else if (qLower.includes('work') || qLower.includes('career') || qLower.includes('事业') || qLower.includes('工作')) contextualAdvice = t('modern.tarot.advice.career');
    else if (qLower.includes('wealth') || qLower.includes('money') || qLower.includes('财') || qLower.includes('金')) contextualAdvice = t('modern.tarot.advice.wealth');
    else if (qLower.includes('health') || qLower.includes('身体') || qLower.includes('病')) contextualAdvice = t('modern.tarot.advice.health');

    return `${t('modern.tarot.fallbackIntro', { question })}\n\n🔮 **${t('modern.tarot.listTitle')}**\n\n${interpretations}\n\n✨ **${t('modern.tarot.summaryTitle')}**\n\n${t('modern.tarot.summaryText', { count: selectedCards.length })} ${contextualAdvice}\n\n🌟 **${t('modern.tarot.actionsTitle')}**\n\n1. ${t('modern.tarot.actions.1')}\n2. ${t('modern.tarot.actions.2')}\n3. ${t('modern.tarot.actions.3')}\n4. ${t('modern.tarot.actions.4')}\n\n🎯 **${t('modern.tarot.reminderTitle')}**\n\n${t('modern.tarot.reminderText')}`;
  };

  // Generate contextual fortune result based on question and method
  const generateFortuneResult = (question: string, method: string) => {
    const lowercaseQuestion = question.toLowerCase();
    let contextualInsight = '';
    let specificAdvice = '';
    
    // Health-related questions
    if (lowercaseQuestion.includes('健康') || lowercaseQuestion.includes('身体') || lowercaseQuestion.includes('病')) {
      contextualInsight = '您的身体能量正在缓慢恢复，需要更多关注和照料。';
      specificAdvice = '建议加强锻炼，保持规律作息，多吃清淡食物。适当的放松和冥想也会有所帮助。';
    }
    // Love and relationship questions
    else if (lowercaseQuestion.includes('感情') || lowercaseQuestion.includes('爱情') || lowercaseQuestion.includes('对象') || lowercaseQuestion.includes('恋爱')) {
      contextualInsight = '您的感情生活即将迎来新的转机，有人正在关注着您。';
      specificAdvice = '保持开放的心态，勇敢表达自己的情感。真诚和耐心是获得美好感情的关键。';
    }
    // Work and career questions  
    else if (lowercaseQuestion.includes('工作') || lowercaseQuestion.includes('事业') || lowercaseQuestion.includes('职业') || lowercaseQuestion.includes('升职')) {
      contextualInsight = '您的事业运势正在上升，新的机会即将到来。';
      specificAdvice = '加强专业技能学习，主动承担更多责任。与同事和上级保持良好沟通。';
    }
    // Money and wealth questions
    else if (lowercaseQuestion.includes('财运') || lowercaseQuestion.includes('金钱') || lowercaseQuestion.includes('财富') || lowercaseQuestion.includes('投资')) {
      contextualInsight = '您的财运在逐渐好转，但需要谨慎管理。';
      specificAdvice = '制定合理的理财计划，避免盲目投资。开源节流，积累财富需要时间和耐心。';
    }
    // Study and learning questions
    else if (lowercaseQuestion.includes('学业') || lowercaseQuestion.includes('考试') || lowercaseQuestion.includes('学习')) {
      contextualInsight = '您的学习能力正在提升，坚持下去将有收获。';
      specificAdvice = '制定科学的学习计划，保持专注和耐心。适当的休息有助于提高学习效率。';
    }
    // Generic advice for other questions
    else {
      contextualInsight = '您正处在人生的一个重要转折点，周围的能量正在发生微妙的变化。';
      specificAdvice = '保持内心的平静与专注，相信自己的直觉。在即将到来的机会面前，勇敢地迈出第一步。';
    }

    return `根据您的问题“${question}”，${method}为您揭示以下洞察：

🌟 当前状况：
${contextualInsight}过去的努力即将迎来收获的时刻。

✨ 核心指引：
${specificAdvice}

🔮 未来展望：
未来3个月内，您将遇到一个重要的机遇。这个机遇可能来自意想不到的方向，请保持开放的心态。

📎 行动建议：
1. 加强与身边重要人士的沟通
2. 关注新出现的学习和成长机会
3. 保持积极乐观的心态
4. 适当的休息和放松同样重要

🌙 特别提醒：
本周三和周五是您的幸运日，适合做重要决定或开始新的计划。

愿星辰指引您的道路，祝您好运！`;
  };

  // Generate numerology-specific fortune result based on profile and question
  const generateNumerologyFallback = (profileData: any, question: string, method: string) => {
    // Calculate life path number from birth date
    let lifePathNumber = 1;
    if (profileData.birthDate) {
      const dateStr = profileData.birthDate.replace(/[^0-9]/g, '');
      let sum = 0;
      for (let digit of dateStr) {
        sum += parseInt(digit);
      }
      while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
        sum = sum.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
      }
      lifePathNumber = sum;
    }
    
    // Calculate name number from name
    let nameNumber = 1;
    if (profileData.name) {
      const nameValue = profileData.name.split('').reduce((sum, char) => {
        const code = char.charCodeAt(0);
        return sum + (code % 9 || 9);
      }, 0);
      nameNumber = nameValue % 9 || 9;
    }
    
    // Number meanings
    const numberMeanings: Record<number, string> = {
      1: '领导者、独立、创新',
      2: '合作、平衡、敏感',
      3: '创造、表达、乐观',
      4: '稳定、实用、勤奋',
      5: '自由、冒险、变化',
      6: '关爱、责任、和谐',
      7: '智慧、分析、神秘',
      8: '成功、权力、物质',
      9: '人道、慈悲、完成',
      11: '直觉、灵性、启发',
      22: '大师建造者、实现梦想',
      33: '大师教师、无私奉献'
    };
    
    const lifePathMeaning = numberMeanings[lifePathNumber] || t('modern.numerology.meaningDefault');
    const nameMeaning = numberMeanings[nameNumber] || t('modern.numerology.energyDefault');
    
    // Generate contextual advice based on the question
    let contextualAdvice = t('modern.numerology.advice.generic');
    const lowercaseQuestion = question.toLowerCase();
    
    if (lowercaseQuestion.includes('love') || lowercaseQuestion.includes('恋') || lowercaseQuestion.includes('感情')) {
      contextualAdvice = t('modern.numerology.advice.love', { life: lifePathNumber, mode: lifePathNumber <= 5 ? t('modern.numerology.mode.express') : t('modern.numerology.mode.wait') });
    } else if (lowercaseQuestion.includes('work') || lowercaseQuestion.includes('career') || lowercaseQuestion.includes('事业') || lowercaseQuestion.includes('工作')) {
      contextualAdvice = t('modern.numerology.advice.career', { life: lifePathNumber, trait: lifePathMeaning });
    } else if (lowercaseQuestion.includes('财') || lowercaseQuestion.includes('金') || lowercaseQuestion.includes('wealth') || lowercaseQuestion.includes('money')) {
      contextualAdvice = t('modern.numerology.advice.wealth', { strategy: lifePathNumber % 2 === 0 ? t('modern.numerology.strategy.steady') : t('modern.numerology.strategy.innovate') });
    }
    
    return `🔢 ${t('modern.numerology.title')}

${t('modern.numerology.intro', { question })}

📊 ${t('modern.numerology.coreTitle')}
• ${t('modern.numerology.lifePathLabel')}: ${lifePathNumber} (${lifePathMeaning})
• ${t('modern.numerology.nameLabel')}: ${nameNumber} (${nameMeaning})

🌟 ${t('modern.numerology.energyTitle')}
${contextualAdvice}

✨ ${t('modern.numerology.guidanceTitle')}
1. ${t('modern.numerology.guidance.1')}
2. ${t('modern.numerology.guidance.2')}
3. ${t('modern.numerology.guidance.3')}
4. ${t('modern.numerology.guidance.4')}

🌙 ${t('modern.numerology.blessingTitle')}
${t('modern.numerology.blessingText')}`;
  };
  
  // Generate life story-specific fortune result based on profile and question
  const generateLifestoryFallback = (profileData: any, question: string, method: string) => {
    // Generate story elements based on profile
    const name = profileData.name || '有缘人';
    const birthPlace = profileData.birthPlace || '一个美丽的地方';
    const occupation = profileData.occupation || '追梦者';
    
    // Story themes based on question
    let storyTheme = '';
    let storyMoral = '';
    let futureVision = '';
    
    const lowercaseQuestion = question.toLowerCase();
    
    if (lowercaseQuestion.includes('感情') || lowercaseQuestion.includes('爱情')) {
      storyTheme = '爱情传说';
      storyMoral = '真爱需要耐心等待和勇敢追求';
      futureVision = '一段美好的姻缘正在向您走来，请保持开放的心态';
    } else if (lowercaseQuestion.includes('工作') || lowercaseQuestion.includes('事业')) {
      storyTheme = '成功之路';
      storyMoral = '成功来自于坚持不懈的努力和智慧的选择';
      futureVision = '您的事业将迎来重要转机，新的机遇正在酝酿';
    } else if (lowercaseQuestion.includes('财运') || lowercaseQuestion.includes('金钱')) {
      storyTheme = '财富密码';
      storyMoral = '真正的财富来自于智慧和德行的积累';
      futureVision = '通过正当途径，您的财富将稳步增长';
    } else {
      storyTheme = '人生传奇';
      storyMoral = '每个人都有自己独特的人生使命和价值';
      futureVision = '您的人生将充满精彩的转折和美好的收获';
    }
    
    return `📖 ${t('modern.lifestory.title')}

${t('modern.lifestory.intro', { question })}

🌟 ${t('modern.lifestory.chapterTitle', { theme: storyTheme })}

${t('modern.lifestory.body', { name, birthPlace, occupation })}

📚 ${t('modern.lifestory.moralTitle')}
${storyMoral}

🔮 ${t('modern.lifestory.insightTitle')}
1. ${t('modern.lifestory.insight.1')}
2. ${t('modern.lifestory.insight.2')}
3. ${t('modern.lifestory.insight.3')}
4. ${t('modern.lifestory.insight.4')}

🌈 ${t('modern.lifestory.futureTitle')}
${futureVision}

✨ ${t('modern.lifestory.messageTitle')}
${t('modern.lifestory.messageText')}

📝 ${t('modern.lifestory.nextTitle')}
${t('modern.lifestory.nextText')}`;
  };

  // Generate plain language interpretation
  const generatePlainLanguageInterpretation = (originalResult: string, question: string, method: string) => {
    const lowercaseQuestion = question.toLowerCase();
    let simpleAdvice = '';
    let keyPoints = [];
    let actionSteps = [];
    
    // Analyze question type and provide simple advice
    if (lowercaseQuestion.includes('love') || lowercaseQuestion.includes('恋') || lowercaseQuestion.includes('感情')) {
      simpleAdvice = t('modern.plain.advice.love');
      keyPoints = [t('modern.plain.points.love.1'), t('modern.plain.points.love.2'), t('modern.plain.points.love.3')];
      actionSteps = [t('modern.plain.actions.love.1'), t('modern.plain.actions.love.2'), t('modern.plain.actions.love.3')];
    } else if (lowercaseQuestion.includes('work') || lowercaseQuestion.includes('career') || lowercaseQuestion.includes('事业') || lowercaseQuestion.includes('工作')) {
      simpleAdvice = t('modern.plain.advice.career');
      keyPoints = [t('modern.plain.points.career.1'), t('modern.plain.points.career.2'), t('modern.plain.points.career.3')];
      actionSteps = [t('modern.plain.actions.career.1'), t('modern.plain.actions.career.2'), t('modern.plain.actions.career.3')];
    } else if (lowercaseQuestion.includes('health') || lowercaseQuestion.includes('身体') || lowercaseQuestion.includes('病')) {
      simpleAdvice = t('modern.plain.advice.health');
      keyPoints = [t('modern.plain.points.health.1'), t('modern.plain.points.health.2'), t('modern.plain.points.health.3')];
      actionSteps = [t('modern.plain.actions.health.1'), t('modern.plain.actions.health.2'), t('modern.plain.actions.health.3')];
    } else if (lowercaseQuestion.includes('wealth') || lowercaseQuestion.includes('money') || lowercaseQuestion.includes('财') || lowercaseQuestion.includes('金')) {
      simpleAdvice = t('modern.plain.advice.wealth');
      keyPoints = [t('modern.plain.points.wealth.1'), t('modern.plain.points.wealth.2'), t('modern.plain.points.wealth.3')];
      actionSteps = [t('modern.plain.actions.wealth.1'), t('modern.plain.actions.wealth.2'), t('modern.plain.actions.wealth.3')];
    } else {
      simpleAdvice = t('modern.plain.advice.generic');
      keyPoints = [t('modern.plain.points.generic.1'), t('modern.plain.points.generic.2'), t('modern.plain.points.generic.3')];
      actionSteps = [t('modern.plain.actions.generic.1'), t('modern.plain.actions.generic.2'), t('modern.plain.actions.generic.3')];
    }

    return `🔍 ${t('modern.plain.title', { method })}

💡 ${t('modern.plain.summaryTitle')}
${simpleAdvice}

📝 ${t('modern.plain.pointsTitle')}
${keyPoints.map((point, index) => `${index + 1}. ${point}`).join('\n')}

🎯 ${t('modern.plain.actionsTitle')}
${actionSteps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

⏰ ${t('modern.plain.timingTitle')}
${t('modern.plain.timingText')}

💪 ${t('modern.plain.successTitle')}
${t('modern.plain.successText')}

🌟 ${t('modern.plain.luckTitle')}
${t('modern.plain.luckText')}`;
  };

  // Generate personality-specific fallback result based on user profile and session data
  const generatePersonalityFallback = (profileData: any, question: string, method: string) => {
    const name = profileData?.name || '朋友';
    const age = profileData?.age || '';
    const occupation = profileData?.occupation || '';
    const hobbies = profileData?.hobbies || '';
    const selfDescription = profileData?.selfDescription || '';
    
    const personalityTypes = t('modern.personality.types', { returnObjects: true }) as string[];
    const strengths = t('modern.personality.strengths', { returnObjects: true }) as string[];
    const suggestions = t('modern.personality.suggestions', { returnObjects: true }) as string[];
    
    // Use question + name for consistent results
    const combinedInput = question + name;
    const nameHash = combinedInput.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const personalityType = personalityTypes[nameHash % personalityTypes.length];
    const strength = strengths[nameHash % strengths.length];
    const suggestion = suggestions[nameHash % suggestions.length];
    
    // Generate contextual analysis based on provided information
    let personalInfo = '';
    if (occupation && hobbies) {
      personalInfo = t('modern.personality.personal.occupation', { occupation }) + '，' + t('modern.personality.personal.hobbies', { hobbies }) + '，';
    } else if (occupation) {
      personalInfo = t('modern.personality.personal.occupation', { occupation }) + '，';
    } else if (hobbies) {
      personalInfo = t('modern.personality.personal.hobbies', { hobbies }) + '，';
    }
    
    let selfAnalysis = '';
    if (selfDescription) {
      selfAnalysis = t('modern.personality.personal.selfDescription', { selfDescription });
    }
    
    return `🧠 **${t('modern.personality.section.coreTitle')}**
${t('modern.personality.core', { name, question, type: personalityType, age })}

💪 **${t('modern.personality.section.advantagesTitle')}**
${t('modern.personality.advantages', { strength })}${personalInfo}${t('modern.personality.advantagesSuffix')}

🌱 **${t('modern.personality.section.growthTitle')}**
${t('modern.personality.growth', { suggestion })} ${selfAnalysis} ${t('modern.personality.growthSuffix')}

🤝 **${t('modern.personality.section.relationsTitle')}**
${t('modern.personality.relations')}

💼 **${t('modern.personality.section.careerTitle')}**
${occupation ? t('modern.personality.careerOccupation', { occupation }) + ' ' : ''}${t('modern.personality.careerAdvice')}

🎯 **${t('modern.personality.section.lifeTitle')}**
${t('modern.personality.lifeAdvice', { hobbies })}

💡 **${t('modern.personality.section.reminderTitle')}**
${t('modern.personality.reminder')}`;
  };

  // Print function
  const handlePrint = () => {
    const printContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="text-align: center; color: #4A5568;">${t('modern.resultTitle', { method: displayMethodTitle })}</h1>
        <div style="margin: 20px 0; padding: 15px; background-color: #F7FAFC; border-left: 4px solid #4299E1;">
          <h3 style="color: #2D3748; margin-bottom: 10px;">您的问题：</h3>
          <p style="color: #4A5568;">${question}</p>
        </div>
        <div style="margin: 20px 0; padding: 15px; background-color: #F7FAFC; border-left: 4px solid #9F7AEA;">
          <h3 style="color: #2D3748; margin-bottom: 10px;">${t('modern.reading')}：</h3>
          <div style="color: #4A5568; white-space: pre-line; line-height: 1.6;">${formatDisplayText(result)}</div>
        </div>
        ${showPlainLanguage ? `
        <div style="margin: 20px 0; padding: 15px; background-color: #F0FFF4; border-left: 4px solid #48BB78;">
          <h3 style="color: #2D3748; margin-bottom: 10px;">${t('modern.plain.label')}：</h3>
          <div style="color: #4A5568; white-space: pre-line; line-height: 1.6;">${formatDisplayText(plainLanguageResult || generatePlainLanguageInterpretation(result, question, displayMethodTitle))}</div>
        </div>
        ` : ''}
        <div style="margin-top: 30px; text-align: center; color: #A0AEC0; font-size: 14px;">
          <p>${t('modern.generatedAt')}：${new Date().toLocaleString(dateLocale)}</p>

        </div>
      </div>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${t('modern.resultTitle', { method: displayMethodTitle })}</title>
          <meta charset="utf-8">
        </head>
        <body>
          ${printContent}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Export to PDF function with Chinese support
  const handleExportPDF = async () => {
    try {
      // Create a temporary div with the content for better Chinese rendering
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '800px';
      tempDiv.style.padding = '40px';
      tempDiv.style.fontFamily = 'Arial, "Microsoft YaHei", "\u5fae\u8f6f\u96c5\u9ed1", sans-serif';
      tempDiv.style.fontSize = '14px';
      tempDiv.style.lineHeight = '1.6';
      tempDiv.style.color = '#333';
      tempDiv.style.backgroundColor = 'white';
      
      const plainLanguageText = showPlainLanguage && plainLanguageResult ? 
        `\n\n大白话解读：\n${plainLanguageResult}` : '';
      
      tempDiv.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: Arial, 'Microsoft YaHei', '\u5fae\u8f6f\u96c5\u9ed1', sans-serif;">
        <h1 style="text-align: center; color: #4A5568; margin-bottom: 10px; font-size: 24px;">${t('modern.resultTitle', { method: displayMethodTitle })}</h1>
          <p style="text-align: center; color: #666; margin-bottom: 30px; font-size: 12px;">${t('modern.generatedAt')}：${new Date().toLocaleString(dateLocale)}</p>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #F7FAFC; border-left: 4px solid #4299E1;">
            <h3 style="color: #2D3748; margin-bottom: 10px; font-size: 16px;">${t('modern.yourQuestion')}：</h3>
            <p style="color: #4A5568; margin: 0; white-space: pre-wrap;">${question}</p>
          </div>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #F7FAFC; border-left: 4px solid #9F7AEA;">
            <h3 style="color: #2D3748; margin-bottom: 10px; font-size: 16px;">${t('modern.reading')}：</h3>
            <div style="color: #4A5568; white-space: pre-wrap; line-height: 1.6;">${formatDisplayText(result)}</div>
          </div>
          
          ${showPlainLanguage && plainLanguageResult ? `
          <div style="margin: 20px 0; padding: 15px; background-color: #F0FFF4; border-left: 4px solid #48BB78;">
            <h3 style="color: #2D3748; margin-bottom: 10px; font-size: 16px;">${t('modern.plain.label')}：</h3>
            <div style="color: #4A5568; white-space: pre-wrap; line-height: 1.6;">${formatDisplayText(plainLanguageResult)}</div>
          </div>
          ` : ''}
          

        </div>
      `;
      
      document.body.appendChild(tempDiv);
      
      // Convert to canvas with high quality
      const canvas = await html2canvas(tempDiv, {
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      document.body.removeChild(tempDiv);
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      // Add image to PDF
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add new pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Save the PDF
      const fileName = `${displayMethodTitle}_${new Date().toISOString().slice(0, 10)}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      // Fallback to simple text-based PDF
      try {
        const pdf = new jsPDF();
        
        pdf.setFont('helvetica');
        pdf.setFontSize(20);
        pdf.text(`${displayMethodTitle} Result`, 20, 30);
        
        pdf.setFontSize(12);
        pdf.text(`${t('modern.generatedAt')}: ${new Date().toLocaleString(dateLocale)}`, 20, 50);
        
        pdf.setFontSize(14);
        pdf.text(`${t('modern.yourQuestion')}:`, 20, 70);
        
        pdf.setFontSize(12);
        const questionLines = pdf.splitTextToSize(question, 170);
        pdf.text(questionLines, 20, 85);
        
        let currentY = 85 + (questionLines.length * 7) + 10;
        pdf.setFontSize(14);
        pdf.text(`${t('modern.reading')}:`, 20, currentY);
        
        currentY += 15;
        pdf.setFontSize(10);
        const resultLines = pdf.splitTextToSize(result, 170);
        
        resultLines.forEach((line: string) => {
          if (currentY > 260) {
            pdf.addPage();
            currentY = 30;
          }
          pdf.text(line, 20, currentY);
          currentY += 6;
        });
        
        const fileName = `${displayMethodTitle}_Result_${new Date().toISOString().slice(0, 10)}.pdf`;
        pdf.save(fileName);
        
      } catch (fallbackError) {
        console.error('Fallback PDF generation also failed:', fallbackError);
        // Ultimate fallback to text file
        const pdfContent = `${t('modern.resultTitle', { method: displayMethodTitle })}\n\n${t('modern.yourQuestion')}：${question}\n\n${t('modern.reading')}：\n${result}${showPlainLanguage ? '\n\n' + t('modern.plain.label') + '：\n' + (plainLanguageResult || generatePlainLanguageInterpretation(result, question, displayMethodTitle)) : ''}\n\n${t('modern.generatedAt')}：${new Date().toLocaleString(dateLocale)}`;
        
        const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${displayMethodTitle}_${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }
  };

  // Generate plain language interpretation through LLM or fallback
  const generatePlainLanguageAnalysis = async (originalResult: string, question: string, method: string) => {
    try {
      if (llmService.isConfigured()) {
        console.log('🔍 Generating plain language interpretation via LLM...');
        
        const plainLanguagePrompt = `${t('modern.plain.simplifiedIntro')}

${t('modern.plain.originalLabel')}
${originalResult}

${t('modern.plain.questionLabel')}
${question}

${t('modern.plain.methodLabel')}
${method}

${t('modern.plain.keyPointsIntro')}`;
        
        const response = await llmService.callAPI(plainLanguagePrompt, t('modern.plain.title', { method }), {});
        return response.reading;
      } else {
        console.log('⚠️ LLM not configured, using local plain language generation');
        return generatePlainLanguageInterpretation(originalResult, question, method);
      }
    } catch (error) {
      console.warn('❌ LLM plain language generation failed, using fallback:', error);
      return generatePlainLanguageInterpretation(originalResult, question, method);
    }
  };

  const handleStartDivination = async () => {
    if (!question.trim()) return;
    if (selectedMethodId === 'tarot' && selectedCards.length === 0) return;
    if (selectedMethodId === 'lottery' && !drawnLottery) return;
    if (selectedMethodId === 'lottery' && !consultationType) return;
    if (selectedMethodId === 'tarot' && !consultationType) return;
    if (selectedMethodId === 'astrology' && !consultationType) return;
    if (selectedMethodId === 'jiaobei' && !consultationType) return;
    if (selectedMethodId === 'numerology' && !consultationType) return;
    if (selectedMethodId === 'ziwei' && !consultationType) return;
    if (selectedMethodId === 'bazi' && !consultationType) return;
    
    setIsProcessing(true);
    setStep('processing');
    setApiError('');
    
    // Add some delay to show the processing animation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      console.log('Starting divination process...');
      console.log('LLM Service configured:', llmService.isConfigured());
      
      // Prepare data for API call
      const apiData = {
        question,
        method: displayMethodTitle,
        profile,
        cards: selectedMethodId === 'tarot' ? selectedCards : undefined,
        lottery: selectedMethodId === 'lottery' ? drawnLottery : undefined
      };
      
      // Try to get AI-powered response
      try {
        console.log('Attempting to call LLM API...');
        setIsUsingAI(true);
        
        // For tarot, include selected cards in the prompt
        let enhancedQuestion = question;
        if (selectedMethodId === 'tarot' && selectedCards.length > 0) {
          enhancedQuestion = `我抽取了以下塔罗牌：${selectedCards.join('、')}。问题：${question}`;
        } else if (selectedMethodId === 'lottery' && drawnLottery) {
          const typeLabels = {
            love: t('modern.types.love'),
            career: t('modern.types.career'),
            wealth: t('modern.types.wealth'),
            health: t('modern.types.health'),
            study: t('modern.types.study'),
            general: t('modern.types.general')
          } as Record<string, string>;
          const lotteryPoems = (t('modern.lottery.poems', { returnObjects: true }) as Record<string, string>) || {};
          const lotteryMeanings = (t('modern.lottery.meanings', { returnObjects: true }) as Record<string, string>) || {};
          const poemText = lotteryPoems[drawnLottery.number] || drawnLottery.poem;
          const meaningText = lotteryMeanings[drawnLottery.number] || drawnLottery.meaning;
          enhancedQuestion = `${t('modern.askPrefix', { type: typeLabels[consultationType] || consultationType })} ${t('modern.lotteryPicked', { number: drawnLottery.number, poem: poemText, meaning: meaningText })} ${t('modern.askSuffix', { question })}`;
        } else if (selectedMethodId === 'bazi' && consultationType) {
          const typeLabels = {
            love: t('modern.types.love'),
            career: t('modern.types.career'),
            wealth: t('modern.types.wealth'),
            health: t('modern.types.health'),
            study: t('modern.types.study'),
            general: t('modern.types.general')
          } as Record<string, string>;
          enhancedQuestion = `${t('modern.askPrefix', { type: typeLabels[consultationType] || consultationType })} ${t('modern.askOnly', { question })}`;
        }
        
        if (selectedMethodId === 'tarot' && consultationType) {
          const typeLabels = {
            love: t('modern.types.love'),
            career: t('modern.types.career'),
            wealth: t('modern.types.wealth'),
            health: t('modern.types.health'),
            study: t('modern.types.study'),
            comprehensive: t('modern.types.comprehensive')
          } as Record<string, string>;
          enhancedQuestion = `${t('modern.askViaTarot', { type: typeLabels[consultationType] || consultationType, question })}`;
        }
        
        if (selectedMethodId === 'astrology' && consultationType) {
          const typeLabels = {
            love: t('modern.types.love'),
            career: t('modern.types.career'),
            wealth: t('modern.types.wealth'),
            health: t('modern.types.health'),
            study: t('modern.types.study'),
            comprehensive: t('modern.types.comprehensive')
          } as Record<string, string>;
          enhancedQuestion = `${t('modern.askViaAstrology', { type: typeLabels[consultationType] || consultationType, question })}`;
        }
        
        if (selectedMethodId === 'jiaobei' && consultationType) {
          const typeLabels = {
            love: t('modern.types.love'),
            career: t('modern.types.career'),
            wealth: t('modern.types.wealth'),
            health: t('modern.types.health'),
            study: t('modern.types.study'),
            comprehensive: t('modern.types.comprehensive')
          } as Record<string, string>;
          enhancedQuestion = `${t('modern.askViaJiaobei', { type: typeLabels[consultationType] || consultationType, question })}`;
        }
        
        if (selectedMethodId === 'numerology' && consultationType) {
          const typeLabels = {
            love: t('modern.types.love'),
            career: t('modern.types.career'),
            wealth: t('modern.types.wealth'),
            health: t('modern.types.health'),
            study: t('modern.types.study'),
            comprehensive: t('modern.types.comprehensive')
          } as Record<string, string>;
          enhancedQuestion = `${t('modern.askViaNumerology', { type: typeLabels[consultationType] || consultationType, question })}`;
        }
        
        if (selectedMethodId === 'ziwei' && consultationType) {
          const typeLabels = {
            love: t('modern.types.love'),
            career: t('modern.types.career'),
            wealth: t('modern.types.wealth'),
            health: t('modern.types.health'),
            study: t('modern.types.study'),
            comprehensive: t('modern.types.comprehensive')
          } as Record<string, string>;
          enhancedQuestion = `${t('modern.askViaZiwei', { type: typeLabels[consultationType] || consultationType, question })}`;
        }
        
        const response = await llmService.callAPI(
          enhancedQuestion, 
          selectedMethod.title, 
          selectedMethodId === 'personality' ? {
            ...profile,
            // Add session data for personality tests
            occupation: sessionData.occupation || profile.occupation,
            hobbies: sessionData.hobbies || profile.hobbies,
            selfDescription: sessionData.selfDescription || profile.selfDescription
          } : profile
        );
        console.log('LLM API success! Response length:', response.reading.length);
        setResult(response.reading);
        setStep('result');
      } catch (apiError: any) {
        console.warn('LLM API failed, using fallback:', apiError.message);
        setApiError(`AI服务连接失败: ${apiError.message}`);
        setIsUsingAI(false);
        
        // Use enhanced fallback - include session data for personality tests and tarot cards or lottery if available
        let fallbackResult;
        if (selectedMethodId === 'personality') {
          // For personality tests, use session data in fallback
          const enhancedProfile = {
            ...profile,
            occupation: sessionData.occupation || profile.occupation,
            hobbies: sessionData.hobbies || profile.hobbies, 
            selfDescription: sessionData.selfDescription || profile.selfDescription
          };
          fallbackResult = generatePersonalityFallback(enhancedProfile, question, selectedMethod.title);
        } else if (selectedMethodId === 'numerology') {
          fallbackResult = generateNumerologyFallback(profile, question, selectedMethod.title);
        } else if (selectedMethodId === 'lifestory') {
          fallbackResult = generateLifestoryFallback(profile, question, selectedMethod.title);
        } else if (selectedMethodId === 'tarot' && selectedCards.length > 0) {
          fallbackResult = generateTarotFallback(selectedCards, question, selectedMethod.title);
        } else if (selectedMethodId === 'lottery' && drawnLottery) {
          fallbackResult = generateLotteryFallback(drawnLottery, question, selectedMethod.title);
        } else {
          fallbackResult = generateFortuneResult(question, selectedMethod.title);
        }
        setResult(fallbackResult);
        setStep('result');
      }
      
    } catch (error: any) {
      console.error('Critical divination error:', error);
      setApiError(error.message || '占卜处理失败，请稍后重试');
      
      // Still provide a result
      let fallbackResult;
      if (selectedMethodId === 'personality') {
        // For personality tests, use session data in fallback
        const enhancedProfile = {
          ...profile,
          occupation: sessionData.occupation || profile.occupation,
          hobbies: sessionData.hobbies || profile.hobbies,
          selfDescription: sessionData.selfDescription || profile.selfDescription
        };
        fallbackResult = generatePersonalityFallback(enhancedProfile, question, selectedMethod.title);
      } else if (selectedMethodId === 'numerology') {
        fallbackResult = generateNumerologyFallback(profile, question, selectedMethod.title);
      } else if (selectedMethodId === 'lifestory') {
        fallbackResult = generateLifestoryFallback(profile, question, selectedMethod.title);
      } else if (selectedMethodId === 'tarot' && selectedCards.length > 0) {
        fallbackResult = generateTarotFallback(selectedCards, question, selectedMethod.title);
      } else if (selectedMethodId === 'lottery' && drawnLottery) {
        fallbackResult = generateLotteryFallback(drawnLottery, question, selectedMethod.title);
      } else {
        fallbackResult = generateFortuneResult(question, selectedMethod.title);
      }
      setResult(fallbackResult);
      setIsUsingAI(false);
      setStep('result');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderInput = () => (
    <div className="max-w-2xl mx-auto">
      {/* Method Header */}
      <div className="text-center mb-8">
        <div className={`w-20 h-20 mx-auto mb-4 rounded-xl bg-gradient-to-r ${selectedMethod.color} p-5 shadow-2xl`}>
          <IconComponent className="w-full h-full text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">{displayMethodTitle}</h2>
        <p className="text-purple-200 text-lg">{selectedMethod.description}</p>
      </div>

      {/* Profile Information */}
      {(isProfileComplete || profile.name) && (
        <div className="mb-8 p-6 bg-purple-800/30 rounded-xl border border-purple-400/30">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-purple-300 mr-2" />
            <h3 className="text-lg font-semibold text_white">{t('modern.input.profile.title')}</h3>
            {!isProfileComplete && (
              <span className="ml-2 text-xs bg-yellow-500 text-black px-2 py-1 rounded">{t('modern.input.profile.incomplete')}</span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-purple-200">
              <span className="text-yellow-400 mr-2">{t('modern.input.profile.name')}:</span>
              {profile.name || t('modern.common.unknown')}
            </div>
            <div className="flex items-center text-purple-200">
              <span className="text-yellow-400 mr-2">{t('modern.input.profile.birthDate')}:</span>
              {profile.birthDate || t('modern.common.unknown')}
            </div>
            <div className="flex items-center text-purple-200">
              <span className="text-yellow-400 mr-2">{t('modern.input.profile.birthTime')}:</span>
              {profile.birthTime || t('modern.common.unknown')}
            </div>
            <div className="flex items-center text-purple-200">
              <span className="text-yellow-400 mr-2">{t('modern.input.profile.birthPlace')}:</span>
              {profile.birthPlace || t('modern.common.unknown')}
            </div>
            <div className="flex items-center text-purple-200">
              <span className="text-yellow-400 mr-2">{t('modern.input.profile.gender')}:</span>
              {profile.gender === 'male' ? t('profile.ft.male') : profile.gender === 'female' ? t('profile.ft.female') : t('modern.common.unknown')}
            </div>
          </div>
          {!isProfileComplete && (
            <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-400/30 rounded-lg">
              <p className="text-yellow-200 text-sm">💡 {t('modern.input.profile.tip')}</p>
            </div>
          )}
        </div>
      )}

      {/* Consultation Type Selection - Only for bazi method */}
      {selectedMethodId === 'bazi' && (
        <div className="mb-8 p-6 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-xl border border-yellow-400/30">
          <div className="flex items-center mb-4">
            <Crown className="w-5 h-5 text-yellow-300 mr-2" />
            <h3 className="text-lg font-semibold text-white">{t('modern.bazi.type.title')}</h3>
            <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-200 px-2 py-1 rounded">{t('modern.common.required')}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { value: 'love', label: t('modern.types.love'), icon: '💕', desc: t('modern.bazi.typeDesc.love') },
              { value: 'career', label: t('modern.types.career'), icon: '💼', desc: t('modern.bazi.typeDesc.career') },
              { value: 'wealth', label: t('modern.types.wealth'), icon: '💰', desc: t('modern.bazi.typeDesc.wealth') },
              { value: 'health', label: t('modern.types.health'), icon: '🏥', desc: t('modern.bazi.typeDesc.health') },
              { value: 'study', label: t('modern.types.study'), icon: '📚', desc: t('modern.bazi.typeDesc.study') },
              { value: 'general', label: t('modern.types.general'), icon: '✨', desc: t('modern.bazi.typeDesc.general') }
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => setConsultationType(type.value)}
                className={`p-4 text-left rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  consultationType === type.value
                    ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300 shadow-lg shadow-yellow-400/30'
                    : 'bg-yellow-800/30 border-yellow-600/50 text-yellow-200 hover:border-yellow-400 hover:bg-yellow-700/30'
                }`}
              >
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">{type.icon}</span>
                  <span className="font-semibold">{type.label}</span>
                </div>
                <p className="text-sm opacity-80">{type.desc}</p>
              </button>
            ))}
          </div>
          
          {!consultationType && (
            <div className="mt-4 text-center text-yellow-400 text-sm bg-yellow-900/20 rounded-lg p-3 border border-yellow-400/30">⚠️ {t('modern.bazi.type.warning')}</div>
          )}
        </div>
      )}

      {/* Session-specific Information */}
      {selectedMethodId === 'personality' && (
        <div className="mb-8 p-6 bg-gradient-to-r from-emerald-900/30 to-teal-900/30 rounded-xl border border-emerald-400/30">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-emerald-300 mr-2" />
            <h3 className="text-lg font-semibold text_white">{t('modern.personality.session.title')}</h3>
            <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-200 px-2 py-1 rounded">{t('modern.common.optional')}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-emerald-200 mb-2">{t('modern.personality.session.occupationLabel')}</label>
              <input
                type="text"
                value={sessionData.occupation}
                onChange={(e) => handleSessionDataChange('occupation', e.target.value)}
                placeholder={t('modern.personality.session.occupationPlaceholder')}
                className="w-full p-3 bg-emerald-800/30 border border-emerald-600/50 rounded-lg text-white placeholder-emerald-400 focus:border-emerald-400 focus:outline-none transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-emerald-200 mb-2">{t('modern.personality.session.hobbiesLabel')}</label>
              <input
                type="text"
                value={sessionData.hobbies}
                onChange={(e) => handleSessionDataChange('hobbies', e.target.value)}
                placeholder={t('modern.personality.session.hobbiesPlaceholder')}
                className="w-full p-3 bg-emerald-800/30 border border-emerald-600/50 rounded-lg text-white placeholder-emerald-400 focus:border-emerald-400 focus:outline-none transition-colors"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text_sm font-medium text-emerald-200 mb-2">{t('modern.personality.session.selfLabel')}</label>
              <textarea
                value={sessionData.selfDescription}
                onChange={(e) => handleSessionDataChange('selfDescription', e.target.value)}
                placeholder={t('modern.personality.session.selfPlaceholder')}
                rows={3}
                className="w-full p-3 bg-emerald-800/30 border border-emerald-600/50 rounded-lg text-white placeholder-emerald-400 focus:border-emerald-400 focus:outline-none resize-none transition-colors"
              />
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-emerald-900/20 border border-emerald-400/30 rounded-lg">
            <p className="text-emerald-200 text-sm flex items_center">
              <Lightbulb className="w-4 h-4 mr-2" />
              {t('modern.personality.session.note')}
            </p>
          </div>
        </div>
      )}

      {/* Compatibility Form - Only for compatibility method */}
      {selectedMethodId === 'compatibility' && (
        <div className="mb-8 space-y-6">
          {/* Person 1 Information */}
          <div className="p-6 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-xl border border-purple-400/30">
            <div className="flex items-center mb-4">
              <User className="w-5 h-5 text-purple-300 mr-2" />
              <h3 className="text-lg font-semibold text-white">👤 己方信息</h3>
              <span className="ml-2 text-xs bg-purple-500/20 text-purple-200 px-2 py-1 rounded">
                必填
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  姓名 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={compatibilityData.person1.name}
                  onChange={(e) => handleCompatibilityDataChange('person1', 'name', e.target.value)}
                  placeholder={t('modern.form.namePlaceholder')}
                  className="w-full p-3 bg-purple-800/30 border border-purple-600/50 rounded-lg text-white placeholder-purple-400 focus:border-purple-400 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  年龄
                </label>
                <input
                  type="number"
                  value={compatibilityData.person1.age}
                  onChange={(e) => handleCompatibilityDataChange('person1', 'age', e.target.value)}
                  placeholder={t('modern.form.agePlaceholder')}
                  className="w-full p-3 bg-purple-800/30 border border-purple-600/50 rounded-lg text-white placeholder-purple-400 focus:border-purple-400 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  出生日期 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={compatibilityData.person1.birthDate}
                  onChange={(e) => handleCompatibilityDataChange('person1', 'birthDate', e.target.value)}
                  placeholder="如：1990-01-01"
                  className="w-full p-3 bg-purple-800/30 border border-purple-600/50 rounded-lg text-white placeholder-purple-400 focus:border-purple-400 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  出生时辰 <span className="text-red-400">*</span>
                </label>
                <select
                  value={compatibilityData.person1.birthTime}
                  onChange={(e) => handleCompatibilityDataChange('person1', 'birthTime', e.target.value)}
                  className="w-full p-3 bg-purple-800/30 border border-purple-600/50 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
                >
                  <option value="">{t('modern.form.timeSelect')}</option>
                  <option value="子时">子时 (23:00-01:00)</option>
                  <option value="丑时">丑时 (01:00-03:00)</option>
                  <option value="寅时">寅时 (03:00-05:00)</option>
                  <option value="卯时">卯时 (05:00-07:00)</option>
                  <option value="辰时">辰时 (07:00-09:00)</option>
                  <option value="巳时">巳时 (09:00-11:00)</option>
                  <option value="午时">午时 (11:00-13:00)</option>
                  <option value="未时">未时 (13:00-15:00)</option>
                  <option value="申时">申时 (15:00-17:00)</option>
                  <option value="酉时">酉时 (17:00-19:00)</option>
                  <option value="戌时">戌时 (19:00-21:00)</option>
                  <option value="亥时">亥时 (21:00-23:00)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  性别 <span className="text-red-400">*</span>
                </label>
                <select
                  value={compatibilityData.person1.gender}
                  onChange={(e) => handleCompatibilityDataChange('person1', 'gender', e.target.value)}
                  className="w-full p-3 bg-purple-800/30 border border-purple-600/50 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
                >
                  <option value="">{t('modern.form.genderSelect')}</option>
                  <option value="男">男</option>
                  <option value="女">女</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  出生地
                </label>
                <input
                  type="text"
                  value={compatibilityData.person1.birthPlace}
                  onChange={(e) => handleCompatibilityDataChange('person1', 'birthPlace', e.target.value)}
                  placeholder={t('modern.form.birthPlacePlaceholder')}
                  className="w-full p-3 bg-purple-800/30 border border-purple-600/50 rounded-lg text-white placeholder-purple-400 focus:border-purple-400 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  性格特点
                </label>
                <input
                  type="text"
                  value={compatibilityData.person1.personality}
                  onChange={(e) => handleCompatibilityDataChange('person1', 'personality', e.target.value)}
                  placeholder="请描述您的性格特点"
                  className="w-full p-3 bg-purple-800/30 border border-purple-600/50 rounded-lg text-white placeholder-purple-400 focus:border-purple-400 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  兴趣爱好
                </label>
                <input
                  type="text"
                  value={compatibilityData.person1.hobbies}
                  onChange={(e) => handleCompatibilityDataChange('person1', 'hobbies', e.target.value)}
                  placeholder={t('modern.form.hobbiesPlaceholder')}
                  className="w-full p-3 bg-purple-800/30 border border-purple-600/50 rounded-lg text-white placeholder-purple-400 focus:border-purple-400 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Person 2 Information */}
          <div className="p-6 bg-gradient-to-r from-pink-900/30 to-rose-900/30 rounded-xl border border-pink-400/30">
            <div className="flex items-center mb-4">
              <Heart className="w-5 h-5 text-pink-300 mr-2" />
              <h3 className="text-lg font-semibold text-white">💕 对方信息</h3>
              <span className="ml-2 text-xs bg-pink-500/20 text-pink-200 px-2 py-1 rounded">{t('modern.common.required')}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-pink-200 mb-2">
                  姓名 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={compatibilityData.person2.name}
                  onChange={(e) => handleCompatibilityDataChange('person2', 'name', e.target.value)}
                  placeholder={t('modern.form.partnerNamePlaceholder')}
                  className="w-full p-3 bg-pink-800/30 border border-pink-600/50 rounded-lg text-white placeholder-pink-400 focus:border-pink-400 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-pink-200 mb-2">
                  年龄
                </label>
                <input
                  type="number"
                  value={compatibilityData.person2.age}
                  onChange={(e) => handleCompatibilityDataChange('person2', 'age', e.target.value)}
                  placeholder={t('modern.form.partnerAgePlaceholder')}
                  className="w-full p-3 bg-pink-800/30 border border-pink-600/50 rounded-lg text-white placeholder-pink-400 focus:border-pink-400 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-pink-200 mb-2">
                  出生日期 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={compatibilityData.person2.birthDate}
                  onChange={(e) => handleCompatibilityDataChange('person2', 'birthDate', e.target.value)}
                  placeholder="如：1992-05-15"
                  className="w-full p-3 bg-pink-800/30 border border-pink-600/50 rounded-lg text-white placeholder-pink-400 focus:border-pink-400 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-pink-200 mb-2">
                  出生时辰 <span className="text-red-400">*</span>
                </label>
                <select
                  value={compatibilityData.person2.birthTime}
                  onChange={(e) => handleCompatibilityDataChange('person2', 'birthTime', e.target.value)}
                  className="w-full p-3 bg-pink-800/30 border border-pink-600/50 rounded-lg text-white focus:border-pink-400 focus:outline-none transition-colors"
                >
                  <option value="">{t('modern.form.timeSelect')}</option>
                  <option value="子时">子时 (23:00-01:00)</option>
                  <option value="丑时">丑时 (01:00-03:00)</option>
                  <option value="寅时">寅时 (03:00-05:00)</option>
                  <option value="卯时">卯时 (05:00-07:00)</option>
                  <option value="辰时">辰时 (07:00-09:00)</option>
                  <option value="巳时">巳时 (09:00-11:00)</option>
                  <option value="午时">午时 (11:00-13:00)</option>
                  <option value="未时">未时 (13:00-15:00)</option>
                  <option value="申时">申时 (15:00-17:00)</option>
                  <option value="酉时">酉时 (17:00-19:00)</option>
                  <option value="戌时">戌时 (19:00-21:00)</option>
                  <option value="亥时">亥时 (21:00-23:00)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-pink-200 mb-2">
                  性别 <span className="text-red-400">*</span>
                </label>
                <select
                  value={compatibilityData.person2.gender}
                  onChange={(e) => handleCompatibilityDataChange('person2', 'gender', e.target.value)}
                  className="w-full p-3 bg-pink-800/30 border border-pink-600/50 rounded-lg text-white focus:border-pink-400 focus:outline-none transition-colors"
                >
                  <option value="">{t('modern.form.genderSelect')}</option>
                  <option value="男">男</option>
                  <option value="女">女</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-pink-200 mb-2">
                  出生地
                </label>
                <input
                  type="text"
                  value={compatibilityData.person2.birthPlace}
                  onChange={(e) => handleCompatibilityDataChange('person2', 'birthPlace', e.target.value)}
                  placeholder={t('modern.form.birthPlacePlaceholder')}
                  className="w-full p-3 bg-pink-800/30 border border-pink-600/50 rounded-lg text-white placeholder-pink-400 focus:border-pink-400 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-pink-200 mb-2">
                  性格特点
                </label>
                <input
                  type="text"
                  value={compatibilityData.person2.personality}
                  onChange={(e) => handleCompatibilityDataChange('person2', 'personality', e.target.value)}
                  placeholder="请描述对方的性格特点"
                  className="w-full p-3 bg-pink-800/30 border border-pink-600/50 rounded-lg text-white placeholder-pink-400 focus:border-pink-400 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-pink-200 mb-2">
                  兴趣爱好
                </label>
                <input
                  type="text"
                  value={compatibilityData.person2.hobbies}
                  onChange={(e) => handleCompatibilityDataChange('person2', 'hobbies', e.target.value)}
                  placeholder={t('modern.form.partnerHobbiesPlaceholder')}
                  className="w-full p-3 bg-pink-800/30 border border-pink-600/50 rounded-lg text-white placeholder-pink-400 focus:border-pink-400 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Relationship Information */}
          <div className="p-6 bg-gradient-to-r from-indigo-900/30 to-blue-900/30 rounded-xl border border-indigo-400/30">
            <div className="flex items-center mb-4">
              <Heart className="w-5 h-5 text-indigo-300 mr-2" />
              <h3 className="text-lg font-semibold text-white">💞 关系信息</h3>
              <span className="ml-2 text-xs bg-indigo-500/20 text-indigo-200 px-2 py-1 rounded">
                必填
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-2">
                  关系类型 <span className="text-red-400">*</span>
                </label>
                <select
                  value={compatibilityData.relationshipType}
                  onChange={(e) => handleCompatibilityRelationChange('relationshipType', e.target.value)}
                  className="w-full p-3 bg-indigo-800/30 border border-indigo-600/50 rounded-lg text-white focus:border-indigo-400 focus:outline-none transition-colors"
                >
                  <option value="">{t('modern.form.relationSelect')}</option>
                  <option value="恋人">恋人</option>
                  <option value="夫妻">夫妻</option>
                  <option value="朋友">朋友</option>
                  <option value="同事">同事</option>
                  <option value="暧昧对象">暧昧对象</option>
                  <option value="相亲对象">相亲对象</option>
                  <option value="其他">其他</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-2">
                  相识时间
                </label>
                <input
                  type="text"
                  value={compatibilityData.duration}
                  onChange={(e) => handleCompatibilityRelationChange('duration', e.target.value)}
                  placeholder="如：3个月、2年等"
                  className="w-full p-3 bg-indigo-800/30 border border-indigo-600/50 rounded-lg text-white placeholder-indigo-400 focus:border-indigo-400 focus:outline-none transition-colors"
                />
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-indigo-900/20 border border-indigo-400/30 rounded-lg">
              <p className="text-indigo-200 text-sm flex items-center">
                <Lightbulb className="w-4 h-4 mr-2" />
                八字配对分析将基于双方的出生信息进行专业命理匹配度计算
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Profile Completion Reminder */}
      {!profile.name && !profile.birthDate && (
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-xl border border-blue-400/30">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-blue-300 mr-2" />
            <h3 className="text-lg font-semibold text_white">{t('modern.form.enhanceTitle')}</h3>
          </div>
          <p className="text-blue-200 text-sm mb-4">
            {t('modern.form.enhanceDesc')}
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition-all duration-300 flex items-center space-x-2"
          >
            <User className="w-4 h-4" />
            <span>完善个人资料</span>
          </button>
        </div>
      )}

      {/* Detailed Information for Lifestory */}
      {selectedMethodId === 'lifestory' && (
        <div className="mb-8">
          <div className="p-6 bg-gradient-to-r from-teal-900/30 to-cyan-900/30 rounded-xl border border-teal-400/30">
            <div className="flex items-center mb-6">
              <BookOpen className="w-5 h-5 text-teal-300 mr-2" />
              <h3 className="text-lg font-semibold text-white">📖 详细信息</h3>
              <span className="ml-2 text-xs bg-teal-500/20 text-teal-200 px-2 py-1 rounded">
                用于生成个性化故事
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-teal-200 mb-2">
                  职业 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={profile.occupation || ''}
                  onChange={(e) => {
                     updateProfile({ occupation: e.target.value });
                   }}
                  placeholder={t('modern.form.occupationPlaceholder')}
                  className="w-full p-3 bg-teal-800/30 border border-teal-600/50 rounded-lg text-white placeholder-teal-400 focus:border-teal-400 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-teal-200 mb-2">
                  性格特点 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={profile.personality || ''}
                  onChange={(e) => {
                     updateProfile({ personality: e.target.value });
                   }}
                  placeholder="请描述您的性格特点，如：开朗、内向、乐观等"
                  className="w-full p-3 bg-teal-800/30 border border-teal-600/50 rounded-lg text-white placeholder-teal-400 focus:border-teal-400 focus:outline-none transition-colors"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-teal-200 mb-2">
                  梦想目标 <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={profile.dreams || ''}
                  onChange={(e) => {
                     updateProfile({ dreams: e.target.value });
                   }}
                  placeholder="请描述您的梦想和目标，如：成为优秀的设计师、环游世界、拥有幸福的家庭等"
                  className="w-full h-24 p-3 bg-teal-800/30 border border-teal-600/50 rounded-lg text-white placeholder-teal-400 focus:border-teal-400 focus:outline-none resize-none transition-colors"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-teal-200 mb-2">
                  人生经历 <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={profile.lifeExperience || ''}
                  onChange={(e) => {
                     updateProfile({ lifeExperience: e.target.value });
                   }}
                  placeholder="请简单描述一些重要的人生经历，如：求学经历、工作变化、重要的人生转折点等"
                  className="w-full h-32 p-3 bg-teal-800/30 border border-teal-600/50 rounded-lg text-white placeholder-teal-400 focus:border-teal-400 focus:outline-none resize-none transition-colors"
                />
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-teal-900/20 border border-teal-400/30 rounded-lg">
              <p className="text-teal-200 text-sm flex items-center">
                <Lightbulb className="w-4 h-4 mr-2" />
                {t('modern.form.storyHint')}
              </p>
            </div>
          </div>
        </div>
      )}



      {/* Astrology Birth Information */}
      {selectedMethodId === 'astrology' && (
        <div className="mb-8">
          <div className="p-6 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-xl border border-blue-400/30">
            <div className="flex items-center mb-6">
              <Star className="w-5 h-5 text-blue-300 mr-2" />
              <h3 className="text-lg font-semibold text-white">🌟 出生信息</h3>
              <span className="ml-2 text-xs bg-blue-500/20 text-blue-200 px-2 py-1 rounded">
                必填
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  出生日期 <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={profile?.birthDate || ''}
                  onChange={(e) => updateProfile({ birthDate: e.target.value })}
                  className="w-full p-3 bg-blue-800/30 border border-blue-600/50 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  出生时间 <span className="text-red-400">*</span>
                </label>
                <input
                  type="time"
                  value={profile?.birthTime || ''}
                  onChange={(e) => updateProfile({ birthTime: e.target.value })}
                  className="w-full p-3 bg-blue-800/30 border border-blue-600/50 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  出生地点 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={profile?.birthPlace || ''}
                  onChange={(e) => updateProfile({ birthPlace: e.target.value })}
                  placeholder={t('modern.form.birthCityPlaceholder')}
                  className="w-full p-3 bg-blue-800/30 border border-blue-600/50 rounded-lg text-white placeholder-blue-400 focus:border-blue-400 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  性别 <span className="text-red-400">*</span>
                </label>
                <select
                  value={profile?.gender || ''}
                  onChange={(e) => updateProfile({ gender: e.target.value })}
                  className="w-full p-3 bg-blue-800/30 border border-blue-600/50 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-colors"
                >
                  <option value="">{t('modern.form.genderSelect')}</option>
                  <option value="男">男</option>
                  <option value="女">女</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-400/30 rounded-lg">
              <p className="text-blue-200 text-sm flex items-center">
                <Lightbulb className="w-4 h-4 mr-2" />
                准确的出生信息是星盘分析的基础，请确保信息正确
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Consultation Type Selection for Astrology */}
      {selectedMethodId === 'astrology' && (
        <div className="mb-8">
          <label className="block text-lg font-semibold text-white mb-4">
            <Star className="w-5 h-5 inline mr-2" />
            {t('modern.bazi.type.title', { defaultValue: '相談タイプ' })} <span className="text-red-400">*</span>
          </label>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { id: 'love', icon: '💕', label: '感情运势', desc: '爱情、婚姻、人际关系' },
              { id: 'career', icon: '💼', label: '事业发展', desc: '工作、升职、创业机会' },
              { id: 'wealth', icon: '💰', label: '财富运势', desc: '投资、理财、收入状况' },
              { id: 'health', icon: '🏥', label: '健康状况', desc: '身体、心理、养生建议' },
              { id: 'study', icon: '📚', label: '学业考试', desc: '学习、考试、进修发展' },
              { id: 'comprehensive', icon: '🔮', label: '综合运势', desc: '整体运势、未来趋势' }
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setConsultationType(type.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  consultationType === type.id
                    ? 'border-blue-400 bg-blue-900/50 shadow-lg shadow-blue-500/20'
                    : 'border-blue-600/30 bg-blue-900/20 hover:border-blue-500/50 hover:bg-blue-900/30'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{type.icon}</span>
                  <div>
                    <div className="font-semibold text-white">{type.label}</div>
                    <div className="text-sm text-blue-300">{type.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {!consultationType && (
            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-400/30 rounded-lg">
              <p className="text-blue-300 text-sm text-center flex items-center justify-center">
                <Star className="w-4 h-4 mr-2" />
                {t('modern.validation.selectType', { defaultValue: '相談タイプを選択してください' })}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Consultation Type Selection for Jiaobei */}
      {selectedMethodId === 'jiaobei' && (
        <div className="mb-8">
          <label className="block text-lg font-semibold text-white mb-4">
            <Gem className="w-5 h-5 inline mr-2" />
            {t('modern.bazi.type.title', { defaultValue: '相談タイプ' })} <span className="text-red-400">*</span>
          </label>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { id: 'love', icon: '💕', label: '感情运势', desc: '爱情、婚姻、人际关系' },
              { id: 'career', icon: '💼', label: '事业发展', desc: '工作、升职、创业机会' },
              { id: 'wealth', icon: '💰', label: '财富运势', desc: '投资、理财、收入状况' },
              { id: 'health', icon: '🏥', label: '健康状况', desc: '身体、心理、养生建议' },
              { id: 'study', icon: '📚', label: '学业考试', desc: '学习、考试、进修发展' },
              { id: 'comprehensive', icon: '🔮', label: '综合运势', desc: '整体运势、未来趋势' }
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setConsultationType(type.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  consultationType === type.id
                    ? 'border-amber-400 bg-amber-900/50 shadow-lg shadow-amber-500/20'
                    : 'border-amber-600/30 bg-amber-900/20 hover:border-amber-500/50 hover:bg-amber-900/30'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{type.icon}</span>
                  <div>
                    <div className="font-semibold text-white">{type.label}</div>
                    <div className="text-sm text-amber-300">{type.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {!consultationType && (
            <div className="mt-4 p-3 bg-amber-900/20 border border-amber-400/30 rounded-lg">
              <p className="text-amber-300 text-sm text-center flex items-center justify-center">
                <Gem className="w-4 h-4 mr-2" />
                {t('modern.validation.selectType', { defaultValue: '相談タイプを選択してください' })}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Consultation Type Selection for Numerology */}
      {selectedMethodId === 'numerology' && (
        <div className="mb-8">
          <label className="block text-lg font-semibold text-white mb-4">
            <Hash className="w-5 h-5 inline mr-2" />
            {t('modern.bazi.type.title', { defaultValue: '相談タイプ' })} <span className="text-red-400">*</span>
          </label>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { id: 'love', icon: '💕', label: '感情运势', desc: '爱情、婚姻、人际关系' },
              { id: 'career', icon: '💼', label: '事业发展', desc: '工作、升职、创业机会' },
              { id: 'wealth', icon: '💰', label: '财富运势', desc: '投资、理财、收入状况' },
              { id: 'health', icon: '🏥', label: '健康状况', desc: '身体、心理、养生建议' },
              { id: 'study', icon: '📚', label: '学业考试', desc: '学习、考试、进修发展' },
              { id: 'comprehensive', icon: '🔮', label: '综合运势', desc: '整体运势、未来趋势' }
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setConsultationType(type.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  consultationType === type.id
                    ? 'border-green-400 bg-green-900/50 shadow-lg shadow-green-500/20'
                    : 'border-green-600/30 bg-green-900/20 hover:border-green-500/50 hover:bg-green-900/30'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{type.icon}</span>
                  <div>
                    <div className="font-semibold text-white">{type.label}</div>
                    <div className="text-sm text-green-300">{type.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {!consultationType && (
            <div className="mt-4 p-3 bg-green-900/20 border border-green-400/30 rounded-lg">
              <p className="text-green-300 text-sm text-center flex items-center justify-center">
                <Hash className="w-4 h-4 mr-2" />
                {t('modern.validation.selectType', { defaultValue: '相談タイプを選択してください' })}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Consultation Type Selection for Ziwei */}
      {selectedMethodId === 'ziwei' && (
        <div className="mb-8">
          <label className="block text-lg font-semibold text-white mb-4">
            <Star className="w-5 h-5 inline mr-2" />
            {t('modern.bazi.type.title', { defaultValue: '相談タイプ' })} <span className="text-red-400">*</span>
          </label>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { id: 'love', icon: '💕', label: '感情运势', desc: '爱情、婚姻、人际关系' },
              { id: 'career', icon: '💼', label: '事业发展', desc: '工作、升职、创业机会' },
              { id: 'wealth', icon: '💰', label: '财富运势', desc: '投资、理财、收入状况' },
              { id: 'health', icon: '🏥', label: '健康状况', desc: '身体、心理、养生建议' },
              { id: 'study', icon: '📚', label: '学业考试', desc: '学习、考试、进修发展' },
              { id: 'comprehensive', icon: '🔮', label: '综合运势', desc: '整体运势、未来趋势' }
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setConsultationType(type.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  consultationType === type.id
                    ? 'border-purple-400 bg-purple-900/50 shadow-lg shadow-purple-500/20'
                    : 'border-purple-600/30 bg-purple-900/20 hover:border-purple-500/50 hover:bg-purple-900/30'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{type.icon}</span>
                  <div>
                    <div className="font-semibold text-white">{type.label}</div>
                    <div className="text-sm text-purple-300">{type.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {!consultationType && (
            <div className="mt-4 p-3 bg-purple-900/20 border border-purple-400/30 rounded-lg">
              <p className="text-purple-300 text-sm text-center flex items-center justify-center">
                <Star className="w-4 h-4 mr-2" />
                {t('modern.validation.selectType')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Question Input */}
      <div className="mb-8">
        <label className="block text-lg font-semibold text-white mb-4">
          <Wand2 className="w-5 h-5 inline mr-2" />
          {t('modern.form.questionTitle', { defaultValue: 'ご質問' })}
        </label>
        <div className="relative">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={t('modern.form.questionPlaceholder', { defaultValue: '質問を記述（健康、恋愛、仕事、財運、学業、または詳細な状況など）' })}
            className="w-full h-32 p-4 bg-purple-900/50 border border-purple-400/30 rounded-xl text-white placeholder-purple-400 focus:border-yellow-400 focus:outline-none resize-none"
          />
          <div className="absolute bottom-3 right-3 text-purple-400 text-sm">
            {question.length}/500
          </div>
        </div>
        
        {/* Enhanced validation messages */}
        {!question.trim() && (
          <div className="mt-3 p-3 bg-blue-900/20 border border-blue-400/30 rounded-lg">
            <p className="text-blue-300 text-sm flex items-center">
              <Wand2 className="w-4 h-4 mr-2" />
              {t('modern.form.questionExamples', { defaultValue: '例："健康"、"恋愛"、"仕事"' })}
            </p>
          </div>
        )}
        
        {question.trim() && question.length < 2 && (
          <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-400/30 rounded-lg">
            <p className="text-yellow-300 text-sm flex items-center">
              <span className="mr-2">⚠️</span>
              {t('modern.validation.tooShort')}
            </p>
          </div>
        )}
      </div>

      {/* Consultation Type Selection for Tarot */}
      {selectedMethodId === 'tarot' && (
        <div className="mb-8">
          <label className="block text-lg font-semibold text-white mb-4">
            <Heart className="w-5 h-5 inline mr-2" />
            {t('modern.bazi.type.title', { defaultValue: '相談タイプ' })} <span className="text-red-400">*</span>
          </label>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { id: 'love', icon: '💕', label: '感情运势', desc: '爱情、婚姻、人际关系' },
              { id: 'career', icon: '💼', label: '事业发展', desc: '工作、升职、创业机会' },
              { id: 'wealth', icon: '💰', label: '财富运势', desc: '投资、理财、收入状况' },
              { id: 'health', icon: '🏥', label: '健康状况', desc: '身体、心理、养生建议' },
              { id: 'study', icon: '📚', label: '学业考试', desc: '学习、考试、进修发展' },
              { id: 'comprehensive', icon: '🔮', label: '综合运势', desc: '整体运势、未来趋势' }
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setConsultationType(type.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  consultationType === type.id
                    ? 'border-purple-400 bg-purple-900/50 shadow-lg shadow-purple-500/20'
                    : 'border-purple-600/30 bg-purple-900/20 hover:border-purple-500/50 hover:bg-purple-900/30'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{type.icon}</span>
                  <div>
                    <div className="font-semibold text-white">{type.label}</div>
                    <div className="text-sm text-purple-300">{type.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {!consultationType && (
            <div className="mt-4 p-3 bg-purple-900/20 border border-purple-400/30 rounded-lg">
              <p className="text-purple-300 text-sm text-center flex items-center justify-center">
                <Heart className="w-4 h-4 mr-2" />
                {t('modern.validation.selectType', { defaultValue: '相談タイプを選択してください' })}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tarot Card Selection - Only show for tarot method */}
      {selectedMethodId === 'tarot' && (
        <div className="mb-8">
          <label className="block text-lg font-semibold text-white mb-4">
            <Star className="w-5 h-5 inline mr-2" />
            {t('modern.validation.selectCards', { defaultValue: '少なくとも1枚のタロットを選択してください' })} <span className="text-red-400">*</span>
            <span className="text-sm text-purple-300 ml-2">（1〜10枚まで選択可能）</span>
          </label>
          
          <div className="mb-4">
            <div className="text-center text-purple-300 text-sm mb-4">
              {t('modern.cards.selectedLabel', { defaultValue: '選択枚数' })}: {selectedCards.length} {selectedCards.length > 0 && `：${selectedCards.join('、')}`}
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Object.entries(tarotCards).map(([key, name]) => {
              const isSelected = selectedCards.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => {
                    if (isSelected) {
                      // Remove card
                      setSelectedCards(selectedCards.filter(card => card !== key));
                    } else if (selectedCards.length < 10) {
                      // Add card (max 10)
                      setSelectedCards([...selectedCards, key]);
                    }
                  }}
                  className={`p-3 text-sm rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    isSelected
                      ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300 shadow-lg shadow-yellow-400/30'
                      : 'bg-purple-800/50 border-purple-600 text-purple-200 hover:border-purple-400 hover:bg-purple-700/50'
                  } ${selectedCards.length >= 10 && !isSelected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  disabled={selectedCards.length >= 10 && !isSelected}
                >
                  <div className="text-center">
                    <Star className={`w-4 h-4 mx-auto mb-1 ${isSelected ? 'text-yellow-400' : 'text-purple-400'}`} />
                    <span className="font-medium">{name}</span>
                  </div>
                </button>
              );
            })}
          </div>
          
          {selectedCards.length === 0 && (
            <div className="mt-4 text-center text-yellow-400 text-sm bg-yellow-900/20 rounded-lg p-3 border border-yellow-400/30">
              ⚠️ 请至少选择1张塔罗牌来进行占卜
            </div>
          )}
          
          {selectedCards.length >= 10 && (
            <div className="mt-4 text-center text-blue-300 text-sm bg-blue-900/20 rounded-lg p-3 border border-blue-400/30">
              ℹ️ 已达到最大选择数量（10张）
            </div>
          )}
        </div>
      )}

      {/* Consultation Type Selection for Lottery */}
      {selectedMethodId === 'lottery' && (
        <div className="mb-8">
          <div className="p-6 bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-xl border border-orange-400/30">
            <div className="flex items-center mb-6">
              <Sun className="w-5 h-5 text-orange-300 mr-2" />
              <h3 className="text-lg font-semibold text-white">🙏 咨询类型</h3>
              <span className="ml-2 text-xs bg-orange-500/20 text-orange-200 px-2 py-1 rounded">
                必选
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <button
                onClick={() => setConsultationType('love')}
                className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  consultationType === 'love'
                    ? 'border-pink-400 bg-pink-900/40 shadow-lg shadow-pink-500/20'
                    : 'border-orange-400/30 bg-orange-800/20 hover:border-orange-400/50'
                }`}
              >
                <div className="text-center">
                  <Heart className="w-8 h-8 mx-auto mb-2 text-pink-400" />
                  <div className="text-white font-semibold">感情运势</div>
                  <div className="text-orange-200 text-xs mt-1">爱情、婚姻、人际关系</div>
                </div>
              </button>
              
              <button
                onClick={() => setConsultationType('career')}
                className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  consultationType === 'career'
                    ? 'border-blue-400 bg-blue-900/40 shadow-lg shadow-blue-500/20'
                    : 'border-orange-400/30 bg-orange-800/20 hover:border-orange-400/50'
                }`}
              >
                <div className="text-center">
                  <Briefcase className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                  <div className="text-white font-semibold">事业发展</div>
                  <div className="text-orange-200 text-xs mt-1">工作、升职、创业</div>
                </div>
              </button>
              
              <button
                onClick={() => setConsultationType('wealth')}
                className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  consultationType === 'wealth'
                    ? 'border-yellow-400 bg-yellow-900/40 shadow-lg shadow-yellow-500/20'
                    : 'border-orange-400/30 bg-orange-800/20 hover:border-orange-400/50'
                }`}
              >
                <div className="text-center">
                  <DollarSign className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                  <div className="text-white font-semibold">财富运程</div>
                  <div className="text-orange-200 text-xs mt-1">财运、投资、收入</div>
                </div>
              </button>
              
              <button
                onClick={() => setConsultationType('health')}
                className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  consultationType === 'health'
                    ? 'border-green-400 bg-green-900/40 shadow-lg shadow-green-500/20'
                    : 'border-orange-400/30 bg-orange-800/20 hover:border-orange-400/50'
                }`}
              >
                <div className="text-center">
                  <Activity className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <div className="text-white font-semibold">健康状况</div>
                  <div className="text-orange-200 text-xs mt-1">身体、疾病、养生</div>
                </div>
              </button>
              
              <button
                onClick={() => setConsultationType('study')}
                className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  consultationType === 'study'
                    ? 'border-indigo-400 bg-indigo-900/40 shadow-lg shadow-indigo-500/20'
                    : 'border-orange-400/30 bg-orange-800/20 hover:border-orange-400/50'
                }`}
              >
                <div className="text-center">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 text-indigo-400" />
                  <div className="text-white font-semibold">学业考试</div>
                  <div className="text-orange-200 text-xs mt-1">学习、考试、深造</div>
                </div>
              </button>
              
              <button
                onClick={() => setConsultationType('general')}
                className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  consultationType === 'general'
                    ? 'border-purple-400 bg-purple-900/40 shadow-lg shadow-purple-500/20'
                    : 'border-orange-400/30 bg-orange-800/20 hover:border-orange-400/50'
                }`}
              >
                <div className="text-center">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <div className="text-white font-semibold">综合运势</div>
                  <div className="text-orange-200 text-xs mt-1">整体运程、人生指导</div>
                </div>
              </button>
            </div>
            
            {!consultationType && (
              <div className="mt-4 text-center text-orange-300 text-sm bg-orange-900/20 rounded-lg p-3 border border-orange-400/30">
                ⚠️ 请选择一个咨询类型，观音菩萨将为您提供更精准的指引
              </div>
            )}
          </div>
        </div>
      )}

      {/* 观音求签 - Oracle Drawing */}
      {selectedMethodId === 'lottery' && consultationType && (
        <div className="mb-8">
          <label className="block text-lg font-semibold text-white mb-4">
            <Sun className="w-5 h-5 inline mr-2" />
            观音求签 <span className="text-red-400">*</span>
          </label>
          
          {!drawnLottery ? (
            <div className="text-center">
              <p className="text-purple-200 mb-6 text-lg">
                🙏 请先虔心祈祷，再轻点下方按钮抽签
              </p>
              <button
                onClick={drawLottery}
                className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-xl font-bold text-white text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 mx-auto shadow-2xl"
              >
                <Sun className="w-6 h-6" />
                <span>🙏 请观音赐签</span>
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-orange-900/60 to-red-900/60 rounded-xl border border-orange-400/30 p-6">
              <div className="text-center mb-4">
                <h4 className="text-xl font-bold text-orange-300 mb-2">
                  🎯 第{drawnLottery.number}签 · {drawnLottery.meaning}
                </h4>
              </div>
              
              <div className="space-y-4">
                <div className="bg-orange-800/30 rounded-lg p-4">
                  <h5 className="text-orange-300 font-semibold mb-2">📜 签文：</h5>
                  <p className="text-orange-100 text-lg leading-relaxed font-medium">
                    {drawnLottery.poem}
                  </p>
                </div>
                
                <div className="bg-orange-800/30 rounded-lg p-4">
                  <h5 className="text-orange-300 font-semibold mb-2">🔰 解读：</h5>
                  <p className="text-orange-100 leading-relaxed">
                    {drawnLottery.interpretation}
                  </p>
                </div>
              </div>
              
              <div className="text-center mt-6">
                <button
                  onClick={() => setDrawnLottery(null)}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-105"
                >
                  🔄 重新抽签
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedMethodId === 'jiaobei' && (
        <div className="mb-8">
          <label className="block text-lg font-semibold text-white mb-4">
            <Moon className="w-5 h-5 inline mr-2" />
            掷筊问卜 <span className="text-red-400">*</span>
          </label>
          
          {!drawnJiaobei ? (
            <div className="text-center">
              <p className="text-purple-200 mb-6 text-lg">
                🙏 请先虔心祈祷，再轻点下方按钮掷筊
              </p>
              <button
                onClick={drawJiaobei}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl font-bold text-white text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 mx-auto shadow-2xl"
              >
                <Moon className="w-6 h-6" />
                <span>🙏 掷筊问卜</span>
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-blue-900/60 to-indigo-900/60 rounded-xl border border-blue-400/30 p-6">
              <div className="text-center mb-4">
                <h4 className="text-xl font-bold text-blue-300 mb-2">
                  🎲 {t('modern.jiaobei.resultLabel')}：{drawnJiaobei.result}
                </h4>
              </div>
              
              <div className="space-y-4">
                <div className="bg-blue-800/30 rounded-lg p-4">
          <h5 className="text-blue-300 font-semibold mb-2">{t('modern.jiaobei.meaningTitle')}</h5>
                  <p className="text-blue-100 leading-relaxed">
                    {drawnJiaobei.meaning}
                  </p>
                </div>
              </div>
              
              <div className="text-center mt-6">
                <button
                  onClick={() => setDrawnJiaobei(null)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-105"
                >
                  🔄 {t('modern.jiaobei.redraw')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* API Status Info */}
      <div className="mb-6 p-4 bg-indigo-800/30 rounded-xl border border-indigo-400/30">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            {llmService.isConfigured() ? (
              <>
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-green-400">{t('modern.aiConfigured')}</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400">智能模板模式</span>
              </>
            )}
          </div>
          <div className="text-indigo-300 text-xs">
            {llmService.isConfigured() 
              ? t('modern.devUsingRealAI') 
              : '配置 .env 文件启用AI - 查看 LLM_SETUP.md'
            }
          </div>
        </div>
        {!llmService.isConfigured() && (
          <div className="mt-2 text-xs text-blue-300 bg-blue-900/20 rounded p-2">
            {t('modern.templateTip')}
          </div>
        )}
        {llmService.isConfigured() && (
          <div className="mt-2 text-xs text-green-300 bg-green-900/20 rounded p-2">
            ✅ 开发模式：直接调用AI API，跳过服务器端代理
          </div>
        )}
      </div>

      {/* Start Button */}
      <div className="text-center">
        <button
          onClick={handleStartDivination}
          disabled={!question.trim() || question.length < 2 || (selectedMethodId === 'tarot' && selectedCards.length === 0) || (selectedMethodId === 'lottery' && (!drawnLottery || !consultationType)) || (selectedMethodId === 'tarot' && !consultationType) || (selectedMethodId === 'astrology' && (!consultationType || !profile?.birthDate || !profile?.birthTime || !profile?.birthPlace || !profile?.gender)) || (selectedMethodId === 'jiaobei' && !consultationType) || (selectedMethodId === 'numerology' && !consultationType) || (selectedMethodId === 'ziwei' && !consultationType) || (selectedMethodId === 'bazi' && !consultationType)}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-bold text-white text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
        >
          <Sparkles className="w-6 h-6" />
          <span>{t('modern.startMethod', { method: displayMethodTitle })}</span>
          <ChevronRight className="w-5 h-5" />
        </button>
        
        {/* Comprehensive validation messages */}
        <div className="mt-4">
          {!question.trim() && (
            <div className="text-center">
              <p className="text-purple-300 text-sm">{t('modern.inputHint', { method: displayMethodTitle })}</p>
            </div>
          )}
          
          {question.trim() && question.length < 2 && (
            <div className="bg-yellow-900/20 border border-yellow-400/30 rounded-lg p-3">
              <p className="text-yellow-300 text-sm text-center flex items-center justify-center">
                <span className="mr-2">⚠️</span>
                {t('modern.validation.tooShort')}
              </p>
            </div>
          )}
          
          {selectedMethodId === 'tarot' && question.trim() && question.length >= 2 && selectedCards.length === 0 && (
            <div className="bg-yellow-900/20 border border-yellow-400/30 rounded-lg p-3">
              <p className="text-yellow-300 text-sm text-center flex items-center justify-center">
                <Star className="w-4 h-4 mr-2" />
                {t('modern.validation.selectCards')}
              </p>
            </div>
          )}
          
          {selectedMethodId === 'lottery' && question.trim() && question.length >= 2 && !drawnLottery && (
            <div className="bg-orange-900/20 border border-orange-400/30 rounded-lg p-3">
              <p className="text-orange-300 text-sm text-center flex items-center justify-center">
                <Sun className="w-4 h-4 mr-2" />
                请先抽取观音灵签
              </p>
            </div>
          )}
          
          {selectedMethodId === 'lottery' && question.trim() && question.length >= 2 && drawnLottery && !consultationType && (
            <div className="bg-orange-900/20 border border-orange-400/30 rounded-lg p-3">
              <p className="text-orange-300 text-sm text-center flex items-center justify-center">
                <Sun className="w-4 h-4 mr-2" />
                {t('modern.validation.selectType')}
              </p>
            </div>
          )}
          
          {selectedMethodId === 'tarot' && question.trim() && question.length >= 2 && selectedCards.length === 0 && (
            <div className="bg-purple-900/20 border border-purple-400/30 rounded-lg p-3">
              <p className="text-purple-300 text-sm text-center flex items-center justify-center">
                <Star className="w-4 h-4 mr-2" />
                请先选择塔罗牌
              </p>
            </div>
          )}
          
          {selectedMethodId === 'tarot' && question.trim() && question.length >= 2 && selectedCards.length > 0 && !consultationType && (
            <div className="bg-purple-900/20 border border-purple-400/30 rounded-lg p-3">
              <p className="text-purple-300 text-sm text-center flex items-center justify-center">
                <Heart className="w-4 h-4 mr-2" />
                {t('modern.validation.selectType')}
              </p>
            </div>
          )}
          
          {selectedMethodId === 'astrology' && question.trim() && question.length >= 2 && (!profile?.birthDate || !profile?.birthTime || !profile?.birthPlace || !profile?.gender) && (
            <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-3">
              <p className="text-blue-300 text-sm text-center flex items-center justify-center">
                <Star className="w-4 h-4 mr-2" />
                请填写完整的出生信息
              </p>
            </div>
          )}
          
          {selectedMethodId === 'astrology' && question.trim() && question.length >= 2 && profile?.birthDate && profile?.birthTime && profile?.birthPlace && profile?.gender && !consultationType && (
            <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-3">
              <p className="text-blue-300 text-sm text-center flex items-center justify-center">
                <Star className="w-4 h-4 mr-2" />
                {t('modern.validation.selectType')}
              </p>
            </div>
          )}
          
          {selectedMethodId === 'jiaobei' && question.trim() && question.length >= 2 && !consultationType && (
            <div className="bg-amber-900/20 border border-amber-400/30 rounded-lg p-3">
              <p className="text-amber-300 text-sm text-center flex items-center justify-center">
                <Gem className="w-4 h-4 mr-2" />
                {t('modern.validation.selectType')}
              </p>
            </div>
          )}
          
          {selectedMethodId === 'numerology' && question.trim() && question.length >= 2 && !consultationType && (
            <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-3">
              <p className="text-green-300 text-sm text-center flex items-center justify-center">
                <Hash className="w-4 h-4 mr-2" />
                {t('modern.validation.selectType')}
              </p>
            </div>
          )}
          
          {selectedMethodId === 'ziwei' && question.trim() && question.length >= 2 && !consultationType && (
            <div className="bg-purple-900/20 border border-purple-400/30 rounded-lg p-3">
              <p className="text-purple-300 text-sm text-center flex items-center justify-center">
                <Star className="w-4 h-4 mr-2" />
                {t('modern.validation.selectType')}
              </p>
            </div>
          )}
          
          {selectedMethodId === 'bazi' && question.trim() && question.length >= 2 && !consultationType && (
            <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-3">
              <p className="text-blue-300 text-sm text-center flex items-center justify-center">
                <Star className="w-4 h-4 mr-2" />
                {t('modern.validation.selectType', { defaultValue: '相談タイプを選択してください' })}
              </p>
            </div>
          )}
          
          {question.trim() && question.length >= 2 && 
           (selectedMethodId !== 'tarot' || (selectedCards.length > 0 && consultationType)) &&
           (selectedMethodId !== 'lottery' || (drawnLottery && consultationType)) &&
           (selectedMethodId !== 'astrology' || (consultationType && profile?.birthDate && profile?.birthTime && profile?.birthPlace && profile?.gender)) &&
           (selectedMethodId !== 'jiaobei' || consultationType) &&
           (selectedMethodId !== 'numerology' || consultationType) &&
           (selectedMethodId !== 'ziwei' || consultationType) &&
           (selectedMethodId !== 'bazi' || consultationType) && (
            <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-3">
              <p className="text-green-300 text-sm text-center flex items-center justify-center">
                <span className="mr-2">✅</span>
                {t('modern.ready', { method: displayMethodTitle })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="max-w-xl mx-auto text-center">
      <div className={`w-24 h-24 mx-auto mb-6 rounded-xl bg-gradient-to-r ${selectedMethod.color} p-6 shadow-2xl animate-bounce`}>
        <IconComponent className="w-full h-full text-white" />
      </div>
      
      <div className="mb-6">
        <div className="relative mb-4">
          <div className="w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-yellow-400/30"></div>
            <div className="absolute inset-0 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin"></div>
            <Loader2 className="w-8 h-8 absolute top-4 left-4 text-yellow-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{t('modern.processing')}</h2>
        <p className="text-purple-200">{t('modern.processing')}</p>
      </div>

      <div className="space-y-3 text-purple-300 text-sm">
        <div className="flex items-center justify-center opacity-100 transition-all duration-500">
          <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3 animate-pulse"></div>
          <Eye className="w-4 h-4 mr-2" />
          <span>解读星象运势...</span>
        </div>
        <div className="flex items-center justify-center opacity-80 transition-all duration-500 delay-1000">
          <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse"></div>
          <Target className="w-4 h-4 mr-2" />
          <span>{t('modern.step.analyzing')}</span>
        </div>
        <div className="flex items-center justify-center opacity-60 transition-all duration-500 delay-2000">
          <div className="w-2 h-2 bg-pink-400 rounded-full mr-3 animate-pulse"></div>
          <Sparkles className="w-4 h-4 mr-2" />
          <span>{t('modern.step.generating')}</span>
        </div>
      </div>
    </div>
  );


const renderResult = () => (
    <div className="max-w-3xl mx-auto">
      {/* Result Header */}
      <div className="text-center mb-8">
        <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${selectedMethod.color} p-4 shadow-xl`}>
          <IconComponent className="w-full h-full text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{t('modern.resultTitle', { method: displayMethodTitle })}</h2>
        <div className="flex items-center justify-center text-purple-300 text-sm space-x-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{new Date().toLocaleString('zh-CN')}</span>
          </div>
          <div className="flex items-center">
            {isUsingAI ? (
              <>
                <Wifi className="w-4 h-4 mr-1 text-green-400" />
                <span className="text-green-400">{t('modern.aiAnalysis')}</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 mr-1 text-yellow-400" />
                <span className="text-yellow-400">离线模式</span>
              </>
            )}
          </div>
        </div>
        {apiError && (
          <div className="mt-2 text-sm text-yellow-300 bg-yellow-900/20 border border-yellow-400/30 rounded-lg p-2">
            <span>⚠️ {apiError}</span>
          </div>
        )}
      </div>

      {/* Your Question */}
      <div className="mb-6 p-4 bg-purple-800/30 rounded-xl border border-purple-400/30">
        <h3 className="text-lg font-semibold text-yellow-400 mb-2">{t('modern.yourQuestion')}</h3>
        <p className="text-purple-200">{question}</p>
      </div>

      {/* Result Content */}
      <div className="mb-8 p-6 bg-gradient-to-br from-purple-900/60 to-indigo-900/60 rounded-xl border border-purple-400/30 animate-scale-in">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2" />
          {t('modern.reading')}
        </h3>
        <div className="text-purple-100 leading-relaxed whitespace-pre-line animate-fade-in">
          {formatDisplayText(result)}
        </div>
      </div>

      {/* Plain Language Interpretation */}
      {showPlainLanguage && (
        <div className="mb-8 p-6 bg-gradient-to-br from-green-900/60 to-emerald-900/60 rounded-xl border border-green-400/30 animate-scale-in">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2" />
            大白话解读
            {llmService.isConfigured() && (
              <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded">
                AI分析
              </span>
            )}
          </h3>
          <div className="text-green-100 leading-relaxed whitespace-pre-line animate-fade-in">
            {isGeneratingPlainLanguage ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t('modern.plain.generating')}</span>
              </div>
            ) : (
              formatDisplayText(plainLanguageResult || t('modern.plain.clickToGenerate'))
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center animate-stagger">
        <button
          onClick={() => {
            setStep('input');
            setQuestion('');
            setResult('');
            setApiError('');
            setIsUsingAI(true);
            setShowPlainLanguage(false);
            setPlainLanguageResult('');
            setIsGeneratingPlainLanguage(false);
          }}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-white transition-all duration-300 flex items-center space-x-2 hover:scale-105 hover:shadow-lg"
        >
          <Shuffle className="w-5 h-5" />
          <span>{t('modern.retry')}</span>
        </button>

        
        <button
          onClick={async () => {
            if (!showPlainLanguage) {
              // Generate plain language interpretation when toggling on
              setIsGeneratingPlainLanguage(true);
              try {
                const plainResult = await generatePlainLanguageAnalysis(result, question, displayMethodTitle);
                setPlainLanguageResult(plainResult);
                setShowPlainLanguage(true);
              } catch (error) {
                console.error('Failed to generate plain language interpretation:', error);
                // Fallback to local generation
                setPlainLanguageResult(generatePlainLanguageInterpretation(result, question, displayMethodTitle));
                setShowPlainLanguage(true);
              } finally {
                setIsGeneratingPlainLanguage(false);
              }
            } else {
              // Simply toggle off
              setShowPlainLanguage(false);
            }
          }}
          disabled={isGeneratingPlainLanguage}
          className={`px-6 py-3 ${showPlainLanguage ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} ${isGeneratingPlainLanguage ? 'opacity-50 cursor-not-allowed' : ''} rounded-lg font-semibold text-white transition-all duration-300 flex items-center space-x-2 hover:scale-105 hover:shadow-lg`}
        >
          {isGeneratingPlainLanguage ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Lightbulb className="w-5 h-5" />
          )}
          <span>
            {isGeneratingPlainLanguage ? t('modern.generating') : (showPlainLanguage ? t('modern.plain.hide') : t('modern.plain.show'))}
          </span>
        </button>
        
        <button
          onClick={() => {
            const text = `${t('modern.resultTitle', { method: displayMethodTitle })}\n\n${t('modern.yourQuestion')}：${question}\n\n${t('modern.reading')}：\n${formatDisplayText(result)}${showPlainLanguage ? '\n\n' + t('modern.plain.label') + '：\n' + formatDisplayText(plainLanguageResult || generatePlainLanguageInterpretation(result, question, displayMethodTitle)) : ''}\n\n${t('modern.generatedAt')}：${new Date().toLocaleString(dateLocale)}`;
            navigator.clipboard.writeText(text);
            setShowCopySuccess(true);
            setTimeout(() => setShowCopySuccess(false), 2000);
          }}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-white transition-all duration-300 flex items-center space-x-2 hover:scale-105 hover:shadow-lg relative"
        >
          <Download className="w-5 h-5" />
          <span>{showCopySuccess ? t('common.copied') : t('common.copy')}</span>
          {showCopySuccess && (
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
          )}
        </button>
        
        <button
          onClick={handleExportPDF}
          className="px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold text-white transition-all duration-300 flex items-center space-x-2 hover:scale-105 hover:shadow-lg"
        >
          <FileText className="w-5 h-5" />
          <span>导出PDF</span>
        </button>
        
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold text-white transition-all duration-300 flex items-center space-x-2 hover:scale-105 hover:shadow-lg"
        >
          <Printer className="w-5 h-5" />
          <span>打印</span>
        </button>
        
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `${t('modern.resultTitle', { method: displayMethodTitle })}`,
                text: formatDisplayText(result).slice(0, 100) + '...'
              });
            }
          }}
          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 rounded-lg font-semibold text-white transition-all duration-300 flex items-center space-x-2 hover:scale-105 hover:shadow-lg"
        >
          <Share2 className="w-5 h-5" />
          <span>{t('common.share')}</span>
        </button>
      </div>


    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-purple-900/80 backdrop-blur-sm border-b border-purple-400/30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-800/50 hover:bg-purple-700/50 rounded-lg transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('common.back')}</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />

          </div>

          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="animate-slide-up">
          {step === 'input' && renderInput()}
          {step === 'processing' && renderProcessing()}
          {step === 'result' && renderResult()}
        </div>
      </div>
    </div>
  );
};

export default ModernFortuneInterface;
