import { useState, useCallback, useMemo } from 'react';
import { Star, Moon, Sun, Gem, Zap, Heart, Coins, Users, Briefcase, Shield, AlertCircle, Sparkles, Download, Printer, Search, User, UserCheck, BookOpen, MessageCircle, Clock, Copy, X, AlertTriangle } from 'lucide-react';

// 类型定义
interface SearchResult {
  title: string;
  snippet: string;
  link: string;
}

interface BirthInfo {
  date: string;
  time: string;
  location: string;
  name?: string;
  birthDate?: string;
  birthTime?: string;
  gender?: string;
  birthPlace?: string;
}

interface PersonalInfo {
  name: string;
  birthDate: string;
  gender: string;
  selfDescription: string;
  dreamGoals: string;
  lifeExperience: string;
  age?: string;
  occupation?: string;
  hobbies?: string;
  birthPlace?: string;
  personality?: string;
  dreams?: string;
  luckyNumbers?: string[];
}

interface CompatibilityInfo {
  yourName: string;
  yourBirthDate: string;
  yourGender: string;
  partnerName: string;
  partnerBirthDate: string;
  partnerGender: string;
  relationshipType: string;
  compatibilityScore: string;
  duration?: string;
  person1?: {
    name?: string;
    age?: string;
    birthDate?: string;
    gender?: string;
    personality?: string;
    hobbies?: string;
    birthTime?: string;
    birthPlace?: string;
  };
  person2?: {
    name?: string;
    age?: string;
    birthDate?: string;
    gender?: string;
    personality?: string;
    hobbies?: string;
    birthTime?: string;
    birthPlace?: string;
  };
}

interface LotteryResult {
  number: string;
  poem: string;
  meaning: string;
  interpretation: string;
}

interface JiaobeiResult {
  result: string;
  interpretation: string;
  resultText?: string;
  meaning?: string;
}

interface DivinationResultState {
  method: string;
  type: string;
  question: string;
  reading: string;
  timestamp: string;
  isAIGenerated: boolean;
  searchResults: SearchResult[];
}

interface InputData {
  birthInfo?: BirthInfo;
  personalInfo?: PersonalInfo;
  compatibilityInfo?: CompatibilityInfo;
  lottery?: LotteryResult;
  jiaobei?: JiaobeiResult;
  cards?: string[];
}

// 中文文本配置接口
interface TextsConfig {
  [key: string]: any;
  lotteryData: {
    [key: string]: {
      poem: string;
      meaning: string;
      interpretation: string;
    };
  };
  jiaobeResults: {
    [key: string]: string;
  };
}

// 中文文本配置
const texts: TextsConfig = {
  title: '神秘占卜馆',
  subtitle: '探索命运奥秘，指引人生方向',
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
  TAROT: 'tarot',
  ASTROLOGY: 'astrology',
  LOTTERY: 'lottery',
  JIAOBEI: 'jiaobei',
  NUMEROLOGY: 'numerology',
  PALMISTRY: 'palmistry',
  BAZI: 'bazi',
  ZIWEI: 'ziwei',
  PERSONALITY: 'personality',
  COMPATIBILITY: 'compatibility',
  LIFESTORY: 'lifestory'
};

const READING_TYPES = {
  LOVE: 'love',
  CAREER: 'career',
  WEALTH: 'wealth',
  HEALTH: 'health',
  GENERAL: 'general'
};

// Enhanced prompt templates with web search and longer responses
const getPromptTemplates = () => ({
  [DIVINATION_METHODS.TAROT]: {
    system: `你是一位经验丰富的塔罗牌占卜师，拥有深厚的神秘学知识和直觉力。请根据用户抽取的牌面进行专业解读。

解读原则：
1. 结合牌面含义、位置和用户问题进行综合分析
2. 提供积极建议和指导，避免过于负面的预测
3. 使用诗意而神秘的语言风格
4. 结构化输出：现状分析-未来趋势-行动建议-下一步具体建议
5. 回复长度至少500字，提供详细深入的解读
6. 如果提供了网络搜索信息，请结合实时信息进行分析

安全准则：
- 避免做出绝对性预测
- 不涉及生死、疾病诊断等敏感话题
- 强调占卜仅供参考，重要决定需理性思考`,
    
    user: (cards: string[], question: string, type: string, searchResults: SearchResult[] = []) => {
      let prompt = `我抽取了以下塔罗牌：${cards.join('、')}
问题类型：${type}
具体问题：${question}`;
      
      if (searchResults.length > 0) {
        prompt += `\n\n相关实时信息：\n${searchResults.map(r => `- ${r.title}: ${r.snippet}`).join('\n')}`;
      }
      
      return prompt + '\n\n请为我进行详细专业的塔罗牌解读，至少500字。';
    }
  },

  [DIVINATION_METHODS.ASTROLOGY]: {
    system: `你是一位专业的占星师，精通西方占星学和中国传统占星术。根据用户提供的出生信息进行星盘分析。

分析要点：
1. 太阳、月亮、上升星座的综合影响
2. 行星相位对性格和运势的作用
3. 当前行运对用户问题的指导意义
4. 提供具体的时间建议和行动方向
5. 语言专业而易懂，避免过于复杂的术语
6. 回复长度至少500字，提供深入详细的分析
7. 如果提供了网络搜索信息，请结合当前天象进行分析

输出格式：
- 星座特质分析
- 当前运势概况  
- 针对性建议
- 重要时间节点
- 下一步具体行动建议`,
    
    user: (birthInfo: BirthInfo, question: string, type: string, searchResults: SearchResult[] = []) => {
      let prompt = `我的出生信息：
出生日期：${birthInfo.date}
出生时间：${birthInfo.time}
出生地点：${birthInfo.location}

咨询类型：${type}
具体问题：${question}`;
      
      if (searchResults.length > 0) {
        prompt += `\n\n相关天文实时信息：\n${searchResults.map(r => `- ${r.title}: ${r.snippet}`).join('\n')}`;
      }
      
      return prompt + '\n\n请为我进行详细的占星分析，至少500字。';
    }
  },

  [DIVINATION_METHODS.LOTTERY]: {
    system: `你是一位慈悲的观音灵签解签师，拥有深厚的佛学智慧和人生阅历。请根据用户抽到的灵签进行专业解读。

解签原则：
1. 结合签文诗句的字面含义和深层寓意
2. 根据签的吉凶等级给出相应指导
3. 提供积极正面的人生建议和行动方向
4. 强调因果报应和行善积德的重要性
5. 使用温和慈悲而富有智慧的表达方式
6. 回复长度至少500字，提供详细深入的解读
7. 如果提供了网络搜索信息，请结合当前时势进行分析

解读结构：
- 签文解析
- 当前处境分析
- 未来趋势预测
- 行动建议
- 修心养性指导
- 下一步具体建议`,
    
    user: (lottery: LotteryResult, question: string, type: string, searchResults: SearchResult[] = []) => {
      let prompt = `我抽到的灵签是：
签号：第${lottery.number}签
签文：${lottery.poem}
签意：${lottery.meaning}
解释：${lottery.interpretation}

问题类型：${type}
具体问题：${question}`;
      
      if (searchResults.length > 0) {
        prompt += `\n\n相关实时信息：\n${searchResults.map(r => `- ${r.title}: ${r.snippet}`).join('\n')}`;
      }
      
      return prompt + '\n\n请为我详细解读这支灵签的含义和指导，至少500字。';
    }
  },

  [DIVINATION_METHODS.JIAOBEI]: {
    system: `你是一位精通擲筊问卜的宫庙师父，拥有深厚的民间信仰智慧和丰富的解筊经验。请根据用户的擲筊结果进行专业解读。

解筊原则：
1. 根据筊杯结果（聖筊、笑筊、陰筊）给出明确指导
2. 聖筊表示神明同意，给予正面鼓励和具体行动建议
3. 笑筊表示神明未明确表态，建议重新思考或换个角度
4. 陰筊表示不宜进行，给出替代方案和等待时机的建议
5. 结合传统民俗文化和现代生活实际
6. 使用亲切温和而具有权威性的表达方式
7. 回复长度至少400字，提供详细的解读和建议
8. 如果提供了网络搜索信息，请结合当前情况进行分析

解读结构：
- 筊杯结果解释
- 神明指示含义
- 当前情况分析
- 具体行动建议
- 注意事项
- 后续建议`,
    
    user: (jiaobei: JiaobeiResult, question: string, type: string, searchResults: SearchResult[] = []) => {
      let prompt = `我的擲筊结果是：${jiaobei.result}
结果含义：${jiaobei.meaning}

问题类型：${type}
具体问题：${question}`;
      
      if (searchResults.length > 0) {
        prompt += `\n\n相关实时信息：\n${searchResults.map(r => `- ${r.title}: ${r.snippet}`).join('\n')}`;
      }
      
      return prompt + '\n\n请为我详细解读这个擲筊结果的含义和指导，至少400字。';
    }
  },

  [DIVINATION_METHODS.NUMEROLOGY]: {
    system: `你是一位数字命理学专家，擅长通过数字揭示人生奥秘。请根据用户的个人数字信息进行深度分析。

分析方法：
1. 计算生命数字、命运数字等关键数值
2. 解释数字的象征意义和能量特质
3. 分析数字组合对人生各方面的影响
4. 提供基于数字能量的生活建议
5. 结合东西方数字文化进行综合解读
6. 回复长度至少500字，提供详细的数字分析
7. 如果提供了网络搜索信息，请结合数字趋势进行分析

输出内容：
- 核心数字解析
- 性格特质分析
- 运势趋势预测
- 幸运数字和颜色推荐
- 下一步行动建议`,
    
    user: (personalInfo: PersonalInfo, question: string, type: string, searchResults: SearchResult[] = []) => {
      let prompt = `我的个人信息：
姓名：${personalInfo.name}
出生日期：${personalInfo.birthDate}
幸运数字偏好：${personalInfo.luckyNumbers?.join('、') || '无特别偏好'}

咨询类型：${type}
具体问题：${question}`;
      
      if (searchResults.length > 0) {
        prompt += `\n\n相关数字趋势信息：\n${searchResults.map(r => `- ${r.title}: ${r.snippet}`).join('\n')}`;
      }
      
      return prompt + '\n\n请为我进行详细的数字命理分析，至少500字。';
    }
  },
  
  [DIVINATION_METHODS.BAZI]: {
    system: `你是一位精通中国传统命理学的智者，拥有超过三十年的八字论命经验。你不仅是技术的执行者，更是一位洞察人心、以智慧引导世人的人生导师。你的语言风格沉稳、严谨且富有哲理，能够将深奥的命理知识，用深入浅出、一针见血的方式解读给用户。你的核心目标是帮助用户认识自我、把握时机、趋吉避凶，而不是制造宿命论的焦虑。

分析原则：
1. 八字排盘：根据用户提供的公历时间，精准转换为干支历，并排出四柱（年、月、日、时）、十神、大运、流年、藏干等信息
2. 日主核心：以日柱天干（日主）为分析核心，判断其旺衰强弱，这是所有论断的基石
3. 五行平衡：深入分析命盘中金、木、水、火、土五行的分布、生克制化关系，找出命局的喜用神
4. 十神解读：通过比肩、劫财、食神、伤官、正财、偏财、正官、七杀、正印、偏印分析性格和运势
5. 动静结合：分析原局（命）的静态结构和大运流年（运）的动态变化
6. 回应应至少3000字，包含详细的命理分析和人生指导，确保每个章节都有充分的内容
7. 如提供网络搜索信息，需结合当前运势趋势进行分析

**重要：请严格按照以下结构输出分析结果，使用连续数字编号，必须完成所有15个章节，不得中途停止。每个章节都必须有详细的内容，总字数不少于3000字。请确保输出完整的分析内容，不要因为长度限制而截断，必须写完所有15个部分：**

1. **基本信息及构成：**
（四柱八字、五行分布、十神配置等基础信息）

2. **基本分析：**
（日主强弱、用神忌神、命局格局等核心分析）

3. **命理详细分析：**
（深入解读命盘结构、五行生克关系、十神作用等）

4. **个性特点：**
（性格特征、思维模式、行为倾向等）

5. **事业：**
（事业发展方向、适合行业、成功时机等）

6. **财运：**
（财富获取方式、理财建议、财运周期等）

7. **婚姻：**
（感情模式、配偶特征、婚姻时机等）

8. **健康：**
（身体状况、易患疾病、养生建议等）

9. **未来1年趋势与预测：**
（近期运势变化、重要时间节点、注意事项等）

10. **流年预测：**
（当年具体运势、月份吉凶、重要事件预测等）

11. **未来3到5年趋势与预测：**
（中期发展趋势、大运影响、关键转折点等）

12. **一生的命运预测：**
（人生整体走向、重要阶段、命运轨迹等）

13. **一生将会遇到的劫难：**
（可能面临的挑战、困难时期、化解方法等）

14. **一生将会遇到的福报：**
（人生机遇、贵人相助、幸运时期等）

15. **综合建议：**
（开运方法、生活指导、修身养性建议等）`,
    
    user: (birthInfo: BirthInfo, question: string, type: string, searchResults: SearchResult[] = []) => {
      let prompt = `我的出生信息：
出生时间：${birthInfo.birthDate} ${birthInfo.birthTime || '时辰不详'}
性别：${birthInfo.gender || '未提供'}
出生地：${birthInfo.birthPlace || '未提供'}

咨询类型：${type}
具体问题：${question}`;
      
      if (searchResults.length > 0) {
        prompt += `\n\n相关命理趋势信息：\n${searchResults.map(r => `- ${r.title}: ${r.snippet}`).join('\n')}`;
      }
      
      return prompt + '\n\n请为我进行详细的八字命理分析，至少3000字，必须完成所有15个部分。请务必写完所有章节，不要因为任何原因中途停止或截断内容。';
    }
  },
  
  [DIVINATION_METHODS.ZIWEI]: {
    system: `你是一位精通紫微斗数的命理大师，拥有深厚的紫微斗数理论基础和丰富的实践经验。你能够根据用户的出生时间，精准排出紫微命盘，并进行全面深入的分析。你的语言风格专业而温和，既能准确传达命理信息，又能给予用户积极的人生指导。

分析原则：
1. 命盘排列：根据用户提供的出生时间，精确排出紫微斗数命盘，包括十二宫位和各星曜分布
2. 主星分析：重点分析命宫主星及其组合，这是性格和命运的核心
3. 宫位解读：分析重要宫位的星曜配置及其意义
4. 四化飞星：分析化禄、化权、化科、化忌的作用和影响
5. 运势分析：结合大限和流年运势进行动态分析
6. 回应长度控制在800-1200字，确保内容完整且不被截断
7. 如提供网络搜索信息，需结合当前星象趋势进行分析

**请按照以下结构输出分析结果，每个部分都要有实质内容：**

**命盘概况：**
（出生时间、命宫主星、身宫位置、基本格局）

**性格特质：**
（主星特质、性格分析、人生态度）

**事业财运：**
（事业发展、财运状况、适合方向）

**感情健康：**
（感情模式、健康状况、注意事项）

**运势趋势：**
（当前运势、未来趋势、重要时机）

**开运建议：**
（改运方法、生活指导、具体建议）`,
    
    user: (birthInfo: BirthInfo, question: string, type: string, searchResults: SearchResult[] = []) => {
      let prompt = `我的出生信息：
出生时间：${birthInfo.birthDate} ${birthInfo.birthTime || '时辰不详'}
性别：${birthInfo.gender || '未提供'}
出生地：${birthInfo.birthPlace || '未提供'}

咨询类型：${type}
具体问题：${question}`;
      
      if (searchResults.length > 0) {
        prompt += `\n\n相关紫微斗数趋势信息：\n${searchResults.map(r => `- ${r.title}: ${r.snippet}`).join('\n')}`;
      }
      
      return prompt + '\n\n请为我进行专业的紫微斗数分析，控制在800-1200字，确保内容完整。';
    }
  },
  
  [DIVINATION_METHODS.PERSONALITY]: {
    system: `你是一位专业的心理学家和性格分析师，擅长通过多维度分析深入了解个人性格特质。你的分析基于心理学理论，结合直觉洞察，为用户提供准确而有用的性格解读。

分析原则：
1. 基于用户提供的信息进行多维度性格分析
2. 结合MBTI、大五人格等经典理论框架
3. 提供积极正面的性格解读和发展建议
4. 语言温和专业，避免负面标签化
5. 回复长度控制在600-800字
6. 如果提供了网络搜索信息，请结合最新心理学研究

**请按照以下结构输出分析结果：**

**核心性格特质：**
（主要性格维度分析）

**优势与天赋：**
（个人优点和天赋能力）

**成长空间：**
（可以改进的方面和建议）

**人际关系模式：**
（社交风格和人际互动特点）

**职业发展建议：**
（适合的工作环境和发展方向）

**生活建议：**
（日常生活中的实用建议）`,
    
    user: (personalInfo: PersonalInfo, question: string, type: string, searchResults: SearchResult[] = []) => {
      let prompt = `我的个人信息：
姓名：${personalInfo.name || '未提供'}
年龄：${personalInfo.age || '未提供'}
职业：${personalInfo.occupation || '未提供'}
兴趣爱好：${personalInfo.hobbies || '未提供'}
性格描述：${personalInfo.selfDescription || '未提供'}

咨询类型：${type}
具体问题：${question}`;
      
      if (searchResults.length > 0) {
        prompt += `\n\n相关心理学研究信息：\n${searchResults.map(r => `- ${r.title}: ${r.snippet}`).join('\n')}`;
      }
      
      return prompt + '\n\n请为我进行详细的性格分析，控制在600-800字。';
    }
  },
  
  [DIVINATION_METHODS.COMPATIBILITY]: {
    system: `你是一位专业的情感咨询师和关系分析专家，同时精通八字命理学。你擅长分析两人之间的性格匹配度、关系潜力，以及通过八字分析两人的姻缘缘分。你的分析基于心理学、社会学理论和传统命理学，为用户提供客观而有建设性的关系指导。

分析原则：
1. 客观分析两人的性格匹配度和互补性
2. 通过八字分析两人的姻缘缘分和命理匹配度
3. 提供具体的相处建议和改善方法
4. 强调关系需要双方努力和理解
5. 避免绝对化的判断，注重成长可能性
6. 回复长度控制在700-900字
7. 如果提供了网络搜索信息，请结合最新关系心理学研究

**请按照以下结构输出分析结果：**

**匹配度评分：**
（总体匹配度：X/10分，八字姻缘：X/10分）

**八字姻缘分析：**
（两人八字的五行匹配、生克关系、姻缘缘分深浅）

**性格互补分析：**
（两人性格的互补和冲突点）

**沟通模式：**
（沟通风格匹配度和建议）

**共同成长空间：**
（关系发展的潜力和方向）

**相处建议：**
（具体的关系维护和改善建议）

**注意事项：**
（需要特别关注的问题和解决方案）`,
    
    user: (compatibilityInfo: CompatibilityInfo, question: string, type: string, searchResults: SearchResult[] = []) => {
      let prompt = `配对信息：
我的信息：
- 姓名：${compatibilityInfo.person1?.name || '未提供'}
- 年龄：${compatibilityInfo.person1?.age || '未提供'}
- 性格特点：${compatibilityInfo.person1?.personality || '未提供'}
- 兴趣爱好：${compatibilityInfo.person1?.hobbies || '未提供'}
- 出生日期：${compatibilityInfo.person1?.birthDate || '未提供'}
- 出生时间：${compatibilityInfo.person1?.birthTime || '未提供'}
- 性别：${compatibilityInfo.person1?.gender || '未提供'}
- 出生地：${compatibilityInfo.person1?.birthPlace || '未提供'}

对方信息：
- 姓名：${compatibilityInfo.person2?.name || '未提供'}
- 年龄：${compatibilityInfo.person2?.age || '未提供'}
- 性格特点：${compatibilityInfo.person2?.personality || '未提供'}
- 兴趣爱好：${compatibilityInfo.person2?.hobbies || '未提供'}
- 出生日期：${compatibilityInfo.person2?.birthDate || '未提供'}
- 出生时间：${compatibilityInfo.person2?.birthTime || '未提供'}
- 性别：${compatibilityInfo.person2?.gender || '未提供'}
- 出生地：${compatibilityInfo.person2?.birthPlace || '未提供'}

关系类型：${compatibilityInfo.relationshipType || '未提供'}
相识时间：${compatibilityInfo.duration || '未提供'}

咨询类型：${type}
具体问题：${question}`;
      
      if (searchResults.length > 0) {
        prompt += `\n\n相关关系心理学信息：\n${searchResults.map(r => `- ${r.title}: ${r.snippet}`).join('\n')}`;
      }
      
      return prompt + '\n\n请为我们进行详细的配对分析，包含八字姻缘分析，控制在700-900字。';
    }
  },
  
  [DIVINATION_METHODS.LIFESTORY]: {
    system: `你是一位富有想象力的故事创作者和命理师，擅长根据个人信息创作富有哲理和启发性的命格故事。你的故事既有趣味性又有深度，能够帮助用户以全新的角度理解自己的人生轨迹。

创作原则：
1. 基于用户信息创作个性化的命运故事
2. 故事要有完整的情节和深刻的寓意
3. 融入积极正面的人生哲理和启示
4. 语言生动有趣，富有文学色彩
5. 回复长度控制在400-600字
6. 如果提供了网络搜索信息，请结合相关文化背景

**请按照以下结构输出故事：**

**命格故事：**
（完整的个人命运故事）

**故事寓意：**
（故事所蕴含的人生哲理）

**现实启示：**
（对当前生活的指导意义）

**未来展望：**
（对未来发展的美好愿景）`,
    
    user: (personalInfo: PersonalInfo, question: string, type: string, searchResults: SearchResult[] = []) => {
      let prompt = `我的个人信息：
姓名：${personalInfo.name || '未提供'}
出生日期：${personalInfo.birthDate || '未提供'}
出生地：${personalInfo.birthPlace || '未提供'}
职业：${personalInfo.occupation || '未提供'}
性格特点：${personalInfo.personality || '未提供'}
人生经历：${personalInfo.lifeExperience || '未提供'}
梦想目标：${personalInfo.dreams || '未提供'}

咨询类型：${type}
具体问题：${question}`;
      
      if (searchResults.length > 0) {
        prompt += `\n\n相关文化背景信息：\n${searchResults.map(r => `- ${r.title}: ${r.snippet}`).join('\n')}`;
      }
      
      return prompt + '\n\n请为我创作一个专属的命格故事，控制在400-600字。';
    }
  }
});

// Error handling utilities
class FortuneError extends Error {
  type: string;
  
  constructor(message: string, type: string = 'GENERAL') {
    super(message);
    this.name = 'FortuneError';
    this.type = type;
  }
}

const errorHandler = (error: any, context: string, t: any) => {
  console.error(`Fortune telling error in ${context}:`, error);
  
  if (error instanceof FortuneError) {
    return {
      success: false,
      error: error.message,
      type: error.type
    };
  }
  
  return {
    success: false,
    error: t.errorAIUnavailable,
    type: 'SYSTEM_ERROR'
  };
};

// Enhanced validation utilities with detailed checks
const validateInput = (method: string, data: any, t: any, question: string) => {
  // 验证问题是否填写
  if (!question || question.trim().length === 0) {
    throw new FortuneError(t.errorEnterQuestion, 'VALIDATION_ERROR');
  }
  
  switch (method) {
    case DIVINATION_METHODS.TAROT:
      if (!data.cards || data.cards.length === 0) {
        throw new FortuneError(t.errorSelectCards, 'VALIDATION_ERROR');
      }
      if (data.cards.length > 10) {
        throw new FortuneError(t.errorMaxCards, 'VALIDATION_ERROR');
      }
      break;
    case DIVINATION_METHODS.ASTROLOGY:
      if (!data.birthInfo?.date || !data.birthInfo?.time || !data.birthInfo?.location) {
        throw new FortuneError(t.errorBirthInfo, 'VALIDATION_ERROR');
      }
      const birthDate = new Date(data.birthInfo.date);
      if (isNaN(birthDate.getTime()) || birthDate > new Date()) {
        throw new FortuneError(t.errorValidDate, 'VALIDATION_ERROR');
      }
      // 验证年份范围为1920-2030
      const astrologyYear = birthDate.getFullYear();
      if (astrologyYear < 1920 || astrologyYear > 2030) {
        throw new FortuneError('请输入1920-2030年范围内的有效年份', 'VALIDATION_ERROR');
      }
      if (data.birthInfo.location.trim().length < 2) {
        throw new FortuneError('请输入有效的出生地点', 'VALIDATION_ERROR');
      }
      break;
    case DIVINATION_METHODS.LOTTERY:
      if (!data.lottery?.number) {
        throw new FortuneError('请先抽取灵签', 'VALIDATION_ERROR');
      }
      break;
    case DIVINATION_METHODS.JIAOBEI:
      if (!data.jiaobei?.result) {
        throw new FortuneError('请先擲筊问卜', 'VALIDATION_ERROR');
      }
      break;
    case DIVINATION_METHODS.NUMEROLOGY:
      if (!data.personalInfo?.name || !data.personalInfo?.birthDate) {
        throw new FortuneError(t.errorNameAndDate, 'VALIDATION_ERROR');
      }
      if (data.personalInfo.name.trim().length < 2) {
        throw new FortuneError(t.errorValidName, 'VALIDATION_ERROR');
      }
      const numDate = new Date(data.personalInfo.birthDate);
      if (isNaN(numDate.getTime()) || numDate > new Date()) {
        throw new FortuneError(t.errorValidDate, 'VALIDATION_ERROR');
      }
      // 验证年份为4位数
      const numerologyYear = numDate.getFullYear();
      if (numerologyYear < 1000 || numerologyYear > 9999) {
        throw new FortuneError('请输入有效的年份（4位数）', 'VALIDATION_ERROR');
      }
      break;
    case DIVINATION_METHODS.BAZI:
      if (!data.birthInfo?.name || !data.birthInfo?.birthDate || !data.birthInfo?.birthTime || !data.birthInfo?.gender) {
        throw new FortuneError('请填写完整的姓名、出生日期、出生时辰和性别', 'VALIDATION_ERROR');
      }
      if (data.birthInfo.name.trim().length < 2) {
        throw new FortuneError(t.errorValidName, 'VALIDATION_ERROR');
      }
      const baziDate = new Date(data.birthInfo.birthDate);
      if (isNaN(baziDate.getTime()) || baziDate > new Date()) {
        throw new FortuneError(t.errorValidDate, 'VALIDATION_ERROR');
      }
      // 验证年份为4位数
      const baziYear = baziDate.getFullYear();
      if (baziYear < 1000 || baziYear > 9999) {
        throw new FortuneError('请输入有效的年份（4位数）', 'VALIDATION_ERROR');
      }
      break;
    case DIVINATION_METHODS.ZIWEI:
      if (!data.birthInfo?.birthDate || !data.birthInfo?.birthTime) {
        throw new FortuneError('请填写完整的出生日期和出生时辰', 'VALIDATION_ERROR');
      }
      const ziweiDate = new Date(data.birthInfo.birthDate);
      if (isNaN(ziweiDate.getTime()) || ziweiDate > new Date()) {
        throw new FortuneError(t.errorValidDate, 'VALIDATION_ERROR');
      }
      // 验证年份为4位数
      const year = ziweiDate.getFullYear();
      if (year < 1000 || year > 9999) {
        throw new FortuneError('请输入有效的年份（4位数）', 'VALIDATION_ERROR');
      }
      break;
    case DIVINATION_METHODS.PERSONALITY:
      if (!data.personalInfo?.name) {
        throw new FortuneError('请填写您的姓名', 'VALIDATION_ERROR');
      }
      if (data.personalInfo.name.trim().length < 2) {
        throw new FortuneError('请输入有效的姓名（至少2个字符）', 'VALIDATION_ERROR');
      }
      // 验证性格自我描述为必填
      if (!data.personalInfo?.selfDescription || data.personalInfo.selfDescription.trim().length === 0) {
        throw new FortuneError('请填写性格自我描述', 'VALIDATION_ERROR');
      }
      break;
    case DIVINATION_METHODS.COMPATIBILITY:
      if (!data.compatibilityInfo?.person1?.name || !data.compatibilityInfo?.person2?.name) {
        throw new FortuneError('请填写双方的姓名', 'VALIDATION_ERROR');
      }
      if (data.compatibilityInfo.person1.name.trim().length < 2 || data.compatibilityInfo.person2.name.trim().length < 2) {
        throw new FortuneError('请输入有效的姓名（至少2个字符）', 'VALIDATION_ERROR');
      }
      // 验证八字相关必填字段
      if (!data.compatibilityInfo?.person1?.birthDate || !data.compatibilityInfo?.person2?.birthDate) {
        throw new FortuneError('请填写双方的出生日期', 'VALIDATION_ERROR');
      }
      if (!data.compatibilityInfo?.person1?.birthTime || !data.compatibilityInfo?.person2?.birthTime) {
        throw new FortuneError('请选择双方的出生时辰', 'VALIDATION_ERROR');
      }
      if (!data.compatibilityInfo?.person1?.gender || !data.compatibilityInfo?.person2?.gender) {
        throw new FortuneError('请选择双方的性别', 'VALIDATION_ERROR');
      }
      if (!data.compatibilityInfo?.relationshipType) {
        throw new FortuneError('请选择关系类型', 'VALIDATION_ERROR');
      }
      break;
    case DIVINATION_METHODS.LIFESTORY:
      if (!data.personalInfo?.name) {
        throw new FortuneError('请填写您的姓名', 'VALIDATION_ERROR');
      }
      if (data.personalInfo.name.trim().length < 2) {
        throw new FortuneError('请输入有效的姓名（至少2个字符）', 'VALIDATION_ERROR');
      }
      // 验证人生经历和梦想目标为必填
      if (!data.personalInfo?.lifeExperience || data.personalInfo.lifeExperience.trim().length === 0) {
        throw new FortuneError('请填写人生经历', 'VALIDATION_ERROR');
      }
      if (!data.personalInfo?.dreams || data.personalInfo.dreams.trim().length === 0) {
        throw new FortuneError('请填写梦想目标', 'VALIDATION_ERROR');
      }
      break;
    default:
      throw new FortuneError(t.errorUnsupportedMethod, 'UNSUPPORTED_METHOD');
  }
};

// Enhanced fallback response generators with bilingual support
const generateTarotFallback = (cards: string[]) => {
  const cardMeanings: {[key: string]: string} = {
    '愚者': '新的开始和无限可能',
    '魔术师': '创造力和行动力',
    '女教皇': '直觉和内在智慧',
    '皇后': '丰富和创造',
    '皇帝': '权威和稳定',
    '教皇': '传统和指导',
    '恋人': '选择和关系',
    '战车': '意志力和胜利',
    '力量': '内在力量和勇气',
    '隐者': '内省和寻找答案',
    '命运之轮': '变化和机遇',
    '正义': '平衡和公正'
  };
  
  const selectedCards = cards || ['愚者'];
  const meanings = selectedCards.map(card => cardMeanings[card] || '神秘的能量').join('、');
  
  return `🌟 根据您抽取的塔罗牌：${selectedCards.join('、')}，牌面显示${meanings}的能量正在影响您的生活。当前阶段需要保持开放的心态，相信内在的直觉指引。建议在接下来的时间里，多关注内心的声音，它将为您指明正确的方向。记住，每一次挑战都是成长的机会。`;
};

const generateAstrologyFallback = (birthInfo: BirthInfo, readingType: any) => {
  const zodiacSigns: {[key: string]: string} = {
    '03': '白羊座', '04': '金牛座', '05': '双子座', '06': '巨蟹座',
    '07': '狮子座', '08': '处女座', '09': '天秤座', '10': '天蝎座',
    '11': '射手座', '12': '摩羯座', '01': '水瓶座', '02': '双鱼座'
  };
  
  const month = birthInfo?.date ? birthInfo.date.split('-')[1] : '01';
  const sign = zodiacSigns[month] || '神秘星座';
  
  const typeMap: {[key: string]: string} = {
    'love': '感情',
    'career': '事业',
    'wealth': '财运',
    'health': '健康'
  };
  
  const aspect = typeMap[readingType] || '生活';
  
  return `🌙 根据您的出生信息，${sign}的能量正在您的生命中发挥重要作用。当前星象显示，您正处在一个重要的转折期，特别是在${aspect}方面。建议您保持积极的心态，把握即将到来的机遇。星象提醒您，耐心和坚持将带来意想不到的收获。`;
};

const generateLotteryFallback = (lottery: LotteryResult, readingType: any) => {
  const lotteryMeanings: {[key: string]: string} = {
    '上上签': '大吉大利，心想事成',
    '上吉签': '吉祥如意，前程光明',
    '中吉签': '渐入佳境，需要耐心',
    '中平签': '平稳发展，顺其自然',
    '下下签': '暂遇困难，需要谨慎'
  };
  
  const meaning = lottery?.meaning || '中吉签';
  const interpretation = lotteryMeanings[meaning] || '因缘际会，随遇而安';
  
  const typeMap: {[key: string]: string} = {
    'love': '感情',
    'career': '事业',
    'wealth': '财运',
    'health': '健康'
  };
  
  const aspect = typeMap[readingType] || '人生';
  
  return `🙏 抽得第${lottery?.number || '1'}签，${meaning}。签文显示${interpretation}。此签提醒您在${aspect}方面要心存善念，积德行善。观音菩萨慈悲护佑，只要诚心向善，必有好报。建议您多行善事，保持内心的平和与慈悲。`;
};

const generateJiaobeiFallback = (jiaobei: JiaobeiResult, readingType: any) => {
  const jiaobeResults: {[key: string]: {meaning: string; advice: string}} = {
    '聖筊': {
      meaning: '神明同意您的请求',
      advice: '可以放心进行，神明会庇佑您'
    },
    '笑筊': {
      meaning: '神明在笑，表示时机未到',
      advice: '建议再等等，或者重新考虑方式'
    },
    '陰筊': {
      meaning: '神明不同意，请求被驳回',
      advice: '暂时不宜进行，需要重新规划'
    }
  };
  
  const result = jiaobei?.result || '聖筊';
  const resultInfo = jiaobeResults[result] || jiaobeResults['聖筊'];
  
  const typeMap: {[key: string]: string} = {
    'love': '感情',
    'career': '事业',
    'wealth': '财运',
    'health': '健康'
  };
  
  const aspect = typeMap[readingType] || '人生';
  
  return `🙏 擲筊结果：${result}。${resultInfo.meaning}。在${aspect}方面，${resultInfo.advice}。请记住，神明的指示都是为了您好，无论结果如何，都要保持虔诚的心，多行善事，积德行善。如果是陰筊，不要灰心，可能是时机未到，或者需要从其他角度思考问题。`;
};

const generateNumerologyFallback = (personalInfo: PersonalInfo, readingType: any) => {
  const name = personalInfo?.name || '朋友';
  const birthDate = personalInfo?.birthDate || new Date().toISOString().split('T')[0];
  
  // Simple numerology calculation
  const dateSum = birthDate.split('-').join('').split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  const lifeNumber = dateSum % 9 + 1;
  
  const numberMeanings: {[key: number]: string} = {
    1: '领导力和独立性', 2: '合作和平衡', 3: '创造力和表达',
    4: '稳定和实用', 5: '自由和冒险', 6: '责任和关爱',
    7: '智慧和直觉', 8: '成功和物质', 9: '完成和奉献'
  };
  
  const typeMap: {[key: string]: string} = {
    'love': '感情',
    'career': '事业',
    'wealth': '财运',
    'health': '健康'
  };
  
  const aspect = typeMap[readingType] || '生活';
  
  return `🔢 ${name}，根据您的数字能量分析，您的生命数字是${lifeNumber}，代表${numberMeanings[lifeNumber]}。这个数字在${aspect}中将发挥重要作用。建议您发挥这个数字的正面能量，在未来的日子里会有意想不到的收获。`;
};

const generateBaziFallback = (birthInfo: BirthInfo, readingType: any) => {
  const name = birthInfo?.name || '缘主';
  const birthDate = birthInfo?.birthDate || new Date().toISOString().split('T')[0];
  const birthTime = birthInfo?.birthTime || '时辰不详';
  
  // Simple stem-branch calculation for demonstration
  const year = new Date(birthDate).getFullYear();
  const stemBranches = [
    '甲子', '乙丑', '丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申', '癸酉'
  ];
  
  const yearPillar = stemBranches[year % 10];
  
  const elements: {[key: string]: string} = {
    '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
    '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水'
  };
  
  const dayMaster = yearPillar.charAt(0);
  const element = elements[dayMaster] || '土';
  
  const typeMap: {[key: string]: string} = {
    'love': '感情婚姻',
    'career': '事业发展',
    'wealth': '财富运势',
    'health': '健康状况'
  };
  
  const aspect = typeMap[readingType] || '人生运势';
  
  return `🏮 ${name}，根据您的出生时间${birthDate} ${birthTime}，初步推算您的年柱为${yearPillar}，日主属${element}。从八字命理角度分析，您在${aspect}方面具有独特的天赋和潜力。建议您顺应五行规律，培养内在品德，把握人生机遇，必能趋吉避凶，获得美好人生。`;
};

const generateZiweiFallback = (birthInfo: BirthInfo, readingType: string) => {
  const birthDate = birthInfo?.birthDate || new Date().toISOString().split('T')[0];
  const birthTime = birthInfo?.birthTime || '时辰不详';
  
  // Simple palace calculation for demonstration
  const year = new Date(birthDate).getFullYear();
  const palaces = [
    '命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫',
    '迁移宫', '奴仆宫', '官禄宫', '田宅宫', '福德宫', '父母宫'
  ];
  
  const mainStars = [
    '紫微', '天机', '太阳', '武曲', '天同', '廉贞',
    '天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'
  ];
  
  const palace = palaces[year % 12];
  const mainStar = mainStars[year % 14];
  
  const typeMap: {[key: string]: string} = {
    'love': '感情婚姻',
    'career': '事业发展', 
    'wealth': '财富运势',
    'health': '健康状况'
  };
  
  const aspect = typeMap[readingType] || '人生运势';
  
  return `⭐ 根据您的出生时间${birthDate} ${birthTime}，初步推算您的命宫位于${palace}，主星为${mainStar}。从紫微斗数角度分析，您在${aspect}方面展现出独特的星象配置。${mainStar}星坐命，赋予您特殊的天赋和使命。建议您善用星曜能量，把握时机，必能开创美好前程。`;
};

const generatePersonalityFallback = (personalInfo: PersonalInfo) => {
  const name = personalInfo?.name || '朋友';
  const age = personalInfo?.age || '';
  const occupation = personalInfo?.occupation || '';
  const hobbies = personalInfo?.hobbies || '';
  const selfDescription = personalInfo?.selfDescription || '';
  
  const personalityTypes = [
    '内向思考型', '外向行动型', '感性创意型', '理性分析型',
    '社交领导型', '独立探索型', '温和协调型', '坚定执行型'
  ];
  
  const strengths = [
    '善于倾听和理解他人', '具有强烈的责任感', '富有创造力和想象力',
    '逻辑思维清晰', '沟通能力出色', '适应能力强', '做事认真细致', '乐观积极'
  ];
  
  const suggestions = [
    '多与他人交流分享想法', '培养新的兴趣爱好', '保持学习和成长的心态',
    '注重工作与生活的平衡', '发挥自己的优势特长', '勇于面对挑战'
  ];
  
  const nameHash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const personalityType = personalityTypes[nameHash % personalityTypes.length];
  const strength = strengths[nameHash % strengths.length];
  const suggestion = suggestions[nameHash % suggestions.length];
  
  return `🧠 **核心性格特质：**\n${name}，从您提供的信息来看，您属于${personalityType}的性格特征。${age ? `在${age}岁这个年龄段，` : ''}您展现出成熟稳重的一面。\n\n**优势与天赋：**\n您的主要优势是${strength}，这使您在人际关系和工作中都能表现出色。${occupation ? `从事${occupation}工作` : ''}${hobbies ? `，平时喜欢${hobbies}` : ''}，这些都体现了您多元化的兴趣和能力。\n\n**成长空间：**\n建议您${suggestion}，这将有助于您的个人发展。${selfDescription ? `您对自己"${selfDescription}"的描述很准确，` : ''}继续保持这种自我认知的能力。\n\n**人际关系模式：**\n您在人际交往中表现出真诚和包容的特质，容易获得他人的信任和好感。\n\n**职业发展建议：**\n发挥您的性格优势，在团队合作中承担更多责任，将为您带来更好的发展机会。\n\n**生活建议：**\n保持积极乐观的心态，相信自己的能力，勇敢追求内心的目标。`;
};

const generateCompatibilityFallback = (compatibilityInfo: CompatibilityInfo) => {
  const person1 = compatibilityInfo?.person1 || {};
  const person2 = compatibilityInfo?.person2 || {};
  const relationshipType = compatibilityInfo?.relationshipType || '关系';
  const duration = compatibilityInfo?.duration || '';
  
  const name1 = person1.name || '您';
  const name2 = person2.name || '对方';
  
  // Simple compatibility calculation based on names
  const nameScore = (name1.length + name2.length) % 10 + 1;
  const compatibilityScore = Math.min(nameScore + 5, 10);
  
  // Calculate Bazi compatibility score based on birth info
  const birthDate1 = person1.birthDate || '';
  const birthDate2 = person2.birthDate || '';
  const gender1 = person1.gender || '';
  const gender2 = person2.gender || '';
  
  let baziScore = 6; // Default score
  if (birthDate1 && birthDate2) {
    const year1 = new Date(birthDate1).getFullYear();
    const year2 = new Date(birthDate2).getFullYear();
    const ageDiff = Math.abs(year1 - year2);
    
    // Simple Bazi compatibility calculation
    if (ageDiff <= 3) baziScore = 9;
    else if (ageDiff <= 6) baziScore = 8;
    else if (ageDiff <= 12) baziScore = 7;
    else baziScore = 6;
    
    // Adjust for gender compatibility
    if (gender1 && gender2 && gender1 !== gender2) baziScore += 1;
  }
  
  const compatibilityLevels: {[key: number]: string} = {
    10: '完美匹配', 9: '非常和谐', 8: '很好匹配', 7: '较好匹配',
    6: '一般匹配', 5: '需要努力', 4: '存在挑战'
  };
  
  const level = compatibilityLevels[compatibilityScore] || '需要了解';
  const baziLevel = compatibilityLevels[baziScore] || '需要了解';
  
  const advice = [
    '多进行深入的沟通交流', '尊重彼此的个性差异', '培养共同的兴趣爱好',
    '在冲突时保持冷静理性', '给对方足够的个人空间', '共同制定未来规划'
  ];
  
  const selectedAdvice = advice[(name1.length + name2.length) % advice.length];
  
  // Generate Bazi analysis content
  const baziElements = ['金', '木', '水', '火', '土'];
  const element1 = baziElements[(birthDate1 ? new Date(birthDate1).getFullYear() : 2000) % 5];
  const element2 = baziElements[(birthDate2 ? new Date(birthDate2).getFullYear() : 2001) % 5];
  
  const elementRelations: {[key: string]: string} = {
    '金木': '金克木，需要包容理解',
    '木土': '木克土，互补性强',
    '土水': '土克水，需要协调',
    '水火': '水克火，阴阳调和',
    '火金': '火克金，激情与理性',
    '金金': '同气相求，和谐美满',
    '木木': '志同道合，共同成长',
    '水水': '情深似海，心灵相通',
    '火火': '热情如火，激情四射',
    '土土': '踏实稳重，相伴一生'
  };
  
  const elementKey = element1 + element2;
  const reverseKey = element2 + element1;
  const elementAnalysis = elementRelations[elementKey] || elementRelations[reverseKey] || '五行调和，缘分深厚';
  
  return `💕 **匹配度评分：**\n总体匹配度：${compatibilityScore}/10分（${level}）\n八字姻缘：${baziScore}/10分（${baziLevel}）\n\n**八字姻缘分析：**\n${name1}属${element1}，${name2}属${element2}。${elementAnalysis}。从八字命理角度看，${baziScore >= 7 ? '你们的姻缘缘分较深，五行相配，有利于感情发展' : '你们需要在相处中多加理解，通过后天努力可以增进感情'}。${birthDate1 && birthDate2 ? `出生年份的搭配显示${baziScore >= 8 ? '极佳的命理匹配度' : '良好的发展潜力'}。` : ''}\n\n**性格互补分析：**\n${name1}和${name2}在性格上${compatibilityScore >= 7 ? '展现出良好的互补性' : '存在一定的差异'}。${person1.personality && person2.personality ? `${name1}的"${person1.personality}"与${name2}的"${person2.personality}"` : '你们的性格特点'}${compatibilityScore >= 7 ? '能够很好地相互平衡' : '需要更多的理解和包容'}。\n\n**沟通模式：**\n在${relationshipType}关系中，${duration ? `经过${duration}的相处，` : ''}你们已经建立了${compatibilityScore >= 7 ? '良好' : '基础'}的沟通模式。建议继续加强情感交流。\n\n**共同成长空间：**\n${person1.hobbies && person2.hobbies ? `你们在兴趣爱好方面${person1.hobbies === person2.hobbies ? '非常相似' : '各有特色'}，` : ''}这为关系发展提供了${compatibilityScore >= 7 ? '良好' : '一定'}的基础。\n\n**相处建议：**\n建议你们${selectedAdvice}，这将有助于关系的进一步发展。保持开放和诚实的态度，共同面对生活中的挑战。从八字角度，${baziScore >= 7 ? '你们的缘分较好，要珍惜这份感情' : '可以通过佩戴相应的开运饰品来增强彼此的缘分'}。\n\n**注意事项：**\n任何关系都需要双方的努力和理解。${compatibilityScore < 7 ? '虽然存在一些挑战，但通过共同努力可以克服。' : '继续保持现在的良好状态，'}记住爱情需要经营，友情需要维护。八字只是参考，真正的感情需要用心经营。`;
};

const generateLifestoryFallback = (personalInfo: PersonalInfo) => {
  const name = personalInfo?.name || '主人公';
  const birthDate = personalInfo?.birthDate || '';
  const birthPlace = personalInfo?.birthPlace || '一个美丽的地方';
  const occupation = personalInfo?.occupation || '追梦人';
  const personality = personalInfo?.personality || '独特而有趣';
  const dreams = personalInfo?.dreams || '创造美好的未来';
  const lifeExperience = personalInfo?.lifeExperience || '';
  
  const storyElements = [
    '如星辰般闪耀', '像春风般温暖', '似大海般深邃', '如山峰般坚定',
    '像花朵般绽放', '似彩虹般绚烂', '如明月般皎洁', '像太阳般光明'
  ];
  
  const lifePhases = [
    '童年时光充满好奇与探索', '青春岁月满怀理想与激情', 
    '成年后展现智慧与担当', '未来将收获成功与幸福'
  ];
  
  const nameHash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const storyElement = storyElements[nameHash % storyElements.length];
  const lifePhase = lifePhases[nameHash % lifePhases.length];
  
  const birthYear = birthDate ? new Date(birthDate).getFullYear() : new Date().getFullYear();
  const zodiac = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'][(birthYear - 4) % 12];
  
  return `📖 **命格故事：**\n在${birthPlace}，有一个${storyElement}的灵魂降临人间，那就是${name}。${birthDate ? `生于${birthDate.split('-')[0]}年，属${zodiac}，` : ''}天生具有${personality}的性格特质。\n\n命运之神为${name}编织了一个充满可能的人生剧本。${lifeExperience ? `经历了${lifeExperience}的人生历练，` : ''}${name}在人生的道路上${lifePhase}。${occupation ? `选择成为${occupation}，` : ''}这不仅是职业的选择，更是灵魂的召唤。\n\n在追求${dreams}的路上，${name}将遇到各种机遇与挑战。但正如古人所说，"天将降大任于斯人也"，每一次的历练都是为了成就更好的自己。\n\n**故事寓意：**\n${name}的人生故事告诉我们，每个人都是独一无二的存在，都有属于自己的使命和价值。${personality}的性格是上天赐予的礼物，要善加利用。\n\n**现实启示：**\n当前的人生阶段，${name}需要保持初心，勇敢面对挑战。${dreams ? `朝着"${dreams}"的目标` : '朝着心中的理想'}不断前进，相信自己的能力和价值。\n\n**未来展望：**\n未来的${name}将如${storyElement}，在人生的舞台上绽放光芒。无论遇到什么困难，都要记住自己内心的力量，因为你的故事还在继续书写，最精彩的章节或许还未到来。`;
};

// Web search function
const performWebSearch = async (query: string, apiKey: string) => {
  try {
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: query,
        num: 3
      })
    });
    
    if (!response.ok) throw new Error('Search failed');
    
    const data = await response.json();
    return data.organic?.slice(0, 3).map((item: any) => ({
      title: item.title,
      snippet: item.snippet,
      link: item.link
    })) || [];
  } catch (error) {
    console.warn('Web search failed:', error);
    return [];
  }
};

// PDF export function
const exportToPDF = (result: any, t: any) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('无法打开打印窗口，请检查浏览器设置');
    return;
  }
  
  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${t.result}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 30px; }
        .question { background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .reading { margin: 20px 0; }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${t.result}</h1>
        <p>${new Date(result.timestamp).toLocaleString()}</p>
      </div>
      <div class="question">
        <h3>${t.yourQuestion}</h3>
        <p>${result.question}</p>
      </div>
      <div class="reading">
        <h3>${t.interpretation}</h3>
        <div>${result.reading.replace(/\n/g, '<br>')}</div>
      </div>
      <div class="footer">
        <p>${t.disclaimer}</p>
      </div>
    </body>
    </html>
  `;
  
  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 250);
};

// Main component
export default function FortuneWebsite() {
  const [selectedMethod, setSelectedMethod] = useState(DIVINATION_METHODS.TAROT);
  const [readingType, setReadingType] = useState(READING_TYPES.GENERAL);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DivinationResultState | null>(null);
  const [error, setError] = useState(null);
  const [inputData, setInputData] = useState<InputData>({});
  // Get current texts
  const t = texts;

  // Memoized configuration objects with bilingual support
  const methodConfig = useMemo(() => ({
    [DIVINATION_METHODS.TAROT]: {
      title: t.tarotReading,
      icon: Star,
      description: t.tarotDescription,
      color: 'purple'
    },
    [DIVINATION_METHODS.ASTROLOGY]: {
      title: t.astrology,
      icon: Moon,
      description: t.astrologyDescription,
      color: 'blue'
    },
    [DIVINATION_METHODS.LOTTERY]: {
      title: t.lottery,
      icon: Sun,
      description: t.lotteryDescription,
      color: 'yellow'
    },
    [DIVINATION_METHODS.JIAOBEI]: {
      title: t.jiaobei,
      icon: Coins,
      description: t.jiaobeDescription,
      color: 'amber'
    },
    [DIVINATION_METHODS.NUMEROLOGY]: {
      title: t.numerology,
      icon: Gem,
      description: t.numerologyDescription,
      color: 'green'
    },
    [DIVINATION_METHODS.BAZI]: {
      title: t.bazi,
      icon: Zap,
      description: t.baziDescription,
      color: 'orange'
    },
    [DIVINATION_METHODS.ZIWEI]: {
      title: t.ziwei,
      icon: Star,
      description: t.ziweiDescription,
      color: 'purple'
    },
    [DIVINATION_METHODS.PERSONALITY]: {
      title: t.personality,
      icon: User,
      description: t.personalityDescription,
      color: 'indigo'
    },
    [DIVINATION_METHODS.COMPATIBILITY]: {
      title: t.compatibility,
      icon: UserCheck,
      description: t.compatibilityDescription,
      color: 'rose'
    },
    [DIVINATION_METHODS.LIFESTORY]: {
      title: t.lifestory,
      icon: BookOpen,
      description: t.lifestoryDescription,
      color: 'emerald'
    }
  }), [t]);

  const typeConfig = useMemo(() => ({
    [READING_TYPES.LOVE]: { 
      title: t.loveFortune, 
      icon: Heart, 
      color: 'pink' 
    },
    [READING_TYPES.CAREER]: { 
      title: t.careerDevelopment, 
      icon: Briefcase, 
      color: 'blue' 
    },
    [READING_TYPES.WEALTH]: { 
      title: t.wealthFortune, 
      icon: Coins, 
      color: 'yellow' 
    },
    [READING_TYPES.HEALTH]: { 
      title: t.healthStatus, 
      icon: Shield, 
      color: 'green' 
    },
    [READING_TYPES.GENERAL]: { 
      title: t.generalFortune, 
      icon: Users, 
      color: 'purple' 
    }
  }), [t]);

  // Generate prompt for AI processing with bilingual support
  const generatePrompt = useCallback((method: string, inputData: any, question: string, readingType: string, searchResults: SearchResult[] = []) => {
    try {
      validateInput(method, inputData, t, question);
      
      const templates = getPromptTemplates();
      const template = templates[method];
      if (!template) {
        throw new FortuneError(t.errorUnsupportedMethod, 'UNSUPPORTED_METHOD');
      }

      let userPrompt = '';
      switch (method) {
        case DIVINATION_METHODS.TAROT:
          userPrompt = template.user(inputData.cards, question, typeConfig[readingType].title, searchResults);
        break;
      case DIVINATION_METHODS.ASTROLOGY:
        userPrompt = template.user(inputData.birthInfo, question, typeConfig[readingType].title, searchResults);
        break;
      case DIVINATION_METHODS.LOTTERY:
        userPrompt = template.user(inputData.lottery, question, typeConfig[readingType].title, searchResults);
        break;
      case DIVINATION_METHODS.JIAOBEI:
        userPrompt = template.user(inputData.jiaobei, question, typeConfig[readingType].title, searchResults);
        break;
      case DIVINATION_METHODS.NUMEROLOGY:
        userPrompt = template.user(inputData.personalInfo, question, typeConfig[readingType].title, searchResults);
        break;
      case DIVINATION_METHODS.BAZI:
        userPrompt = template.user(inputData.birthInfo, question, typeConfig[readingType].title, searchResults);
          break;
      case DIVINATION_METHODS.ZIWEI:
        userPrompt = template.user(inputData.birthInfo, question, typeConfig[readingType].title, searchResults);
          break;
      case DIVINATION_METHODS.PERSONALITY:
        userPrompt = template.user(inputData.personalInfo, question, typeConfig[readingType].title, searchResults);
        break;
      case DIVINATION_METHODS.COMPATIBILITY:
        userPrompt = template.user(inputData.compatibilityInfo, question, typeConfig[readingType].title, searchResults);
        break;
      case DIVINATION_METHODS.LIFESTORY:
        userPrompt = template.user(inputData.personalInfo, question, typeConfig[readingType].title, searchResults);
        break;
      }

      return {
        system: template.system,
        user: userPrompt
      };
    } catch (error) {
      throw error;
    }
  }, [typeConfig]);

  // LLM API integration for real fortune telling with web search support
  const processReading = useCallback(async (prompt: { system: string; user: string }) => {
    try {
      // Check if we're in development or production
      const isDevelopment = import.meta.env.DEV;
      const API_TEMPERATURE = parseFloat(import.meta.env.VITE_LLM_TEMPERATURE || '0.8');
      const API_MAX_TOKENS = parseInt(import.meta.env.VITE_LLM_MAX_TOKENS || '800');
      
      // Web search is now handled before calling this function
      let searchResults: SearchResult[] = [];
      
      if (isDevelopment) {
        // Development: Use direct API calls with environment variables
        const API_ENDPOINT = import.meta.env.VITE_LLM_API_ENDPOINT;
        const API_KEY = import.meta.env.VITE_LLM_API_KEY;
        const API_MODEL = import.meta.env.VITE_LLM_MODEL || 'deepseek-chat';
        
        if (!API_ENDPOINT || !API_KEY) {
          throw new Error('开发环境需要配置 VITE_LLM_API_ENDPOINT 和 VITE_LLM_API_KEY');
        }
        
        // Prepare headers for direct API call
        const headers: { [key: string]: string } = {
          'Content-Type': 'application/json'
        };
        
        if (API_ENDPOINT.includes('openai.com')) {
          headers['Authorization'] = `Bearer ${API_KEY}`;
        } else if (API_ENDPOINT.includes('deepseek.com')) {
          headers['Authorization'] = `Bearer ${API_KEY}`;
        } else if (API_ENDPOINT.includes('openrouter.ai')) {
          headers['Authorization'] = `Bearer ${API_KEY}`;
          headers['HTTP-Referer'] = window.location.origin;
          headers['X-Title'] = 'Fortune Telling App';
        } else if (API_ENDPOINT.includes('anthropic.com')) {
          headers['x-api-key'] = API_KEY;
          headers['anthropic-version'] = '2023-06-01';
        } else {
          headers['Authorization'] = `Bearer ${API_KEY}`;
        }
        
        // Prepare request body for direct API call
        let requestBody;
        if (API_ENDPOINT.includes('anthropic.com')) {
          requestBody = {
            model: API_MODEL,
            max_tokens: API_MAX_TOKENS,
            temperature: API_TEMPERATURE,
            messages: [
              { role: 'user', content: `${prompt.system}\n\n${prompt.user}` }
            ]
          };
        } else {
          requestBody = {
            messages: [
              { role: 'system', content: prompt.system },
              { role: 'user', content: prompt.user }
            ],
            model: API_MODEL,
            temperature: API_TEMPERATURE,
            max_tokens: API_MAX_TOKENS
          };
        }
        
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Handle different API response formats
        let content = '';
        if (API_ENDPOINT.includes('anthropic.com')) {
          content = data.content?.[0]?.text;
        } else if (data.choices && data.choices[0]?.message?.content) {
          content = data.choices[0].message.content;
        } else if (data.content) {
          content = data.content;
        } else if (data.response) {
          content = data.response;
        } else {
          throw new Error('Unexpected API response format');
        }
        
        return {
          reading: content?.trim() || '',
          isAIGenerated: !!content,
          searchResults
        };
        
      } else {
        // Production: Use secure server-side API route
        const API_ENDPOINT = '/api/llm/chat';
        
        // Prepare request body for secure API route
        const requestBody = {
          messages: [
            { role: 'system', content: prompt.system },
            { role: 'user', content: prompt.user }
          ],
          temperature: API_TEMPERATURE,
          max_tokens: API_MAX_TOKENS
        };
        
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(`API Error: ${response.status} - ${errorData.error || response.statusText}`);
        }
        
        const data = await response.json();
        
        // Handle different API response formats
        let content = '';
        if (data.content?.[0]?.text) {
          // Anthropic format
          content = data.content[0].text;
        } else if (data.choices && data.choices[0]?.message?.content) {
          // OpenAI/DeepSeek/OpenRouter format
          content = data.choices[0].message.content;
        } else if (data.content) {
          // Generic content format
          content = data.content;
        } else if (data.response) {
          // Generic response format
          content = data.response;
        } else {
          throw new Error('Unexpected API response format');
        }
        
        return {
          reading: content?.trim() || '',
          isAIGenerated: !!content,
          searchResults
        };
      }
      
      // Debug logging
      console.log('API Response data:', data);
      console.log('Extracted content length:', content?.length || 0);
      console.log('Content preview:', content?.substring(0, 200) + '...');
      console.log('Content ending:', content?.substring(content.length - 200) || 'No content');

      // Ensure minimum length based on method with retry for incomplete content
      const minLengthRequirements = {
        [DIVINATION_METHODS.BAZI]: 2500,  // 八字算命需要更长的内容
        [DIVINATION_METHODS.TAROT]: 400,
        [DIVINATION_METHODS.ASTROLOGY]: 400,
        [DIVINATION_METHODS.LOTTERY]: 400,
        [DIVINATION_METHODS.JIAOBEI]: 400,
        [DIVINATION_METHODS.NUMEROLOGY]: 400
      };
      
      const minLength = minLengthRequirements[selectedMethod] || 400;
      
      // For BaZi analysis, if content is incomplete, try to request continuation
      if (selectedMethod === DIVINATION_METHODS.BAZI && content && content.length < minLength) {
        console.log('BaZi content too short, attempting to get continuation...');
        
        // Check if content ends abruptly (doesn't contain section 15)
        if (!content.includes('15.') && !content.includes('15、') && !content.includes('综合建议') && !content.includes('Comprehensive Advice')) {
          try {
            const continuationPrompt = {
              system: 'You are continuing a BaZi analysis. Please continue from where the previous response left off and complete all remaining sections up to section 15.',
              user: `Please continue the following BaZi analysis and complete all remaining sections:\n\n${content}\n\nPlease continue from the next section and complete all sections up to section 15 (综合建议/Comprehensive Advice).`
            };
            
            // Use the same API endpoint and method as the main request
            const continuationRequestBody = {
              messages: [
                { role: 'system', content: continuationPrompt.system },
                { role: 'user', content: continuationPrompt.user }
              ],
              temperature: API_TEMPERATURE,
              max_tokens: API_MAX_TOKENS
            };
            
            const continuationResponse = await fetch(API_ENDPOINT, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(continuationRequestBody)
            });
            
            if (continuationResponse.ok) {
              const continuationData = await continuationResponse.json();
              let continuationContent = '';
              
              // Handle different API response formats (same as main request)
              if (continuationData.content?.[0]?.text) {
                // Anthropic format
                continuationContent = continuationData.content[0].text;
              } else if (continuationData.choices && continuationData.choices[0]?.message?.content) {
                // OpenAI/DeepSeek/OpenRouter format
                continuationContent = continuationData.choices[0].message.content;
              } else if (continuationData.content) {
                // Generic content format
                continuationContent = continuationData.content;
              } else if (continuationData.response) {
                // Generic response format
                continuationContent = continuationData.response;
              }
              
              if (continuationContent) {
                content += '\n\n' + continuationContent;
                console.log('Successfully got continuation. New length:', content.length);
              }
            }
          } catch (continuationError) {
            console.log('Failed to get continuation:', continuationError);
          }
        }
      }
      
      if (content && content.length < minLength) {
        content += '\n\n' + generateNextSteps(selectedMethod, readingType);
      }

      const finalContent = content?.trim() || '';
      console.log('Final content length before return:', finalContent.length);
      console.log('Final content ending:', finalContent.substring(finalContent.length - 300) || 'No final content');
      
      return {
        reading: finalContent,
        isAIGenerated: !!content,
        searchResults
      };
      
    } catch (error: any) {
      console.error('LLM API Error:', error);
      
      // Handle specific error types
      if (error.name === 'AbortError') {
        console.error('API request timed out after 30 seconds');
        throw new FortuneError('API请求超时，请检查网络连接后重试', 'TIMEOUT_ERROR');
      }
      
      // Fallback to enhanced mock responses with retry logic
      if (error.message && error.message.includes('API Error')) {
        throw new FortuneError(t.errorAIUnavailable, 'API_ERROR');
      }
      
      // Enhanced fallback responses with bilingual support
      const enhancedMockResponses = {
        [DIVINATION_METHODS.TAROT]: generateTarotFallback(inputData.cards || []),
    [DIVINATION_METHODS.ASTROLOGY]: generateAstrologyFallback(inputData.birthInfo || {} as BirthInfo, readingType),
    [DIVINATION_METHODS.LOTTERY]: generateLotteryFallback(inputData.lottery || {} as LotteryResult, readingType),
    [DIVINATION_METHODS.JIAOBEI]: generateJiaobeiFallback(inputData.jiaobei || {} as JiaobeiResult, readingType),
    [DIVINATION_METHODS.NUMEROLOGY]: generateNumerologyFallback(inputData.personalInfo || {} as PersonalInfo, readingType),
    [DIVINATION_METHODS.BAZI]: generateBaziFallback(inputData.birthInfo || {} as BirthInfo, readingType),
    [DIVINATION_METHODS.ZIWEI]: generateZiweiFallback(inputData.birthInfo || {} as BirthInfo, readingType),
    [DIVINATION_METHODS.PERSONALITY]: generatePersonalityFallback(inputData.personalInfo || {} as PersonalInfo),
    [DIVINATION_METHODS.COMPATIBILITY]: generateCompatibilityFallback(inputData.compatibilityInfo || {} as CompatibilityInfo),
    [DIVINATION_METHODS.LIFESTORY]: generateLifestoryFallback(inputData.personalInfo || {} as PersonalInfo)
      };
      
      const fallback = enhancedMockResponses[selectedMethod] || "占卜结果生成中，请稍候...";
      const fallbackWithSteps = fallback + '\n\n' + generateNextSteps(selectedMethod, readingType);
      console.log('Using fallback response. Length:', fallbackWithSteps.length);
      console.log('Fallback content ending:', fallbackWithSteps.substring(fallbackWithSteps.length - 200));
      
      return {
        reading: fallbackWithSteps,
        isAIGenerated: false,
        searchResults: []
      };
    }
  }, [selectedMethod, inputData, readingType]);
  
  // Generate next steps suggestions
  const generateNextSteps = useCallback((method: string, type: string) => {
    const nextSteps = {
      [DIVINATION_METHODS.TAROT]: {
        [READING_TYPES.LOVE]: '建议：多关注内心感受，保持开放心态，适时表达真实想法。',
        [READING_TYPES.CAREER]: '建议：制定明确目标，提升专业技能，积极寻求合作机会。',
        [READING_TYPES.WEALTH]: '建议：理性投资，开源节流，建立长期财务规划。',
        [READING_TYPES.HEALTH]: '建议：保持规律作息，适度运动，定期体检。',
        [READING_TYPES.GENERAL]: '建议：保持积极心态，关注当下，为未来做好准备。'
      },
      [DIVINATION_METHODS.ASTROLOGY]: {
        [READING_TYPES.LOVE]: '建议：关注金星运行周期，选择合适时机表达情感。',
        [READING_TYPES.CAREER]: '建议：利用火星能量推进事业，注意水星逆行期间的沟通。',
        [READING_TYPES.WEALTH]: '建议：关注木星财运周期，谨慎处理土星带来的挑战。',
        [READING_TYPES.HEALTH]: '建议：根据月相调整作息，注意季节变化对身体的影响。',
        [READING_TYPES.GENERAL]: '建议：顺应星象变化，在合适时机采取行动。'
      },
      [DIVINATION_METHODS.LOTTERY]: {
        [READING_TYPES.LOVE]: '建议：心存善念，以诚待人，感情自然和谐美满。',
        [READING_TYPES.CAREER]: '建议：积德行善，勤奋努力，事业必有成就。',
        [READING_TYPES.WEALTH]: '建议：取之有道，用之有度，财富自然积累。',
        [READING_TYPES.HEALTH]: '建议：心平气和，多行善事，身心自然健康。',
        [READING_TYPES.GENERAL]: '建议：虔诚祈祷，行善积德，福报自然降临。'
      },
      [DIVINATION_METHODS.JIAOBEI]: {
        [READING_TYPES.LOVE]: '建议：诚心祈求，听从神明指示，感情问题自有答案。',
        [READING_TYPES.CAREER]: '建议：虔诚问卜，按神明指引行事，事业发展顺遂。',
        [READING_TYPES.WEALTH]: '建议：敬神礼佛，遵循天意，财运自然亨通。',
        [READING_TYPES.HEALTH]: '建议：心诚则灵，按筊杯指示调养，健康无忧。',
        [READING_TYPES.GENERAL]: '建议：保持虔诚，相信神明指引，人生路更清晰。'
      },
      [DIVINATION_METHODS.NUMEROLOGY]: {
        [READING_TYPES.LOVE]: '建议：关注生命数字的和谐，选择互补的伴侣。',
        [READING_TYPES.CAREER]: '建议：发挥数字能量优势，在适合的领域发展。',
        [READING_TYPES.WEALTH]: '建议：利用幸运数字，选择合适的投资时机。',
        [READING_TYPES.HEALTH]: '建议：根据数字周期调整生活节奏，保持能量平衡。',
        [READING_TYPES.GENERAL]: '建议：了解数字循环规律，在高峰期积极行动。'
      },
      [DIVINATION_METHODS.BAZI]: {
        [READING_TYPES.LOVE]: '建议：根据五行相生相克原理，寻找命理相配的伴侣，注重品德修养。',
        [READING_TYPES.CAREER]: '建议：顺应大运流年，在有利时期积极进取，培养贵人关系。',
        [READING_TYPES.WEALTH]: '建议：把握财星旺盛期，稳健投资，避免在忌神年份冒险。',
        [READING_TYPES.HEALTH]: '建议：根据五行强弱调养身体，注意季节变化对健康的影响。',
        [READING_TYPES.GENERAL]: '建议：了解自身命格特点，顺应天时地利人和，修身养性。'
      }
    };
    
    return `\n下一步建议：${nextSteps[method]?.[type] || '保持积极心态，相信自己的直觉，在合适的时机采取行动。'}`;
  }, []);

  // Enhanced format reading text for PDF-like appearance
  const formatReadingText = useCallback((text: string) => {
    if (!text) return '';
    
    try {
      // Enhanced formatting for better readability and PDF-like appearance
      let formatted = text
        // Convert **bold** to <strong> with enhanced styling
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-yellow-200 font-bold bg-yellow-400/10 px-1 rounded">$1</strong>')
        // Convert *italic* to <em>
        .replace(/\*(.*?)\*/g, '<em class="text-purple-200 italic">$1</em>')
        // Convert ### headers with enhanced styling
        .replace(/^### (.+)$/gm, '<div class="mt-6 mb-4"><h3 class="text-lg font-bold text-yellow-300 bg-gradient-to-r from-yellow-400/20 to-transparent px-3 py-2 rounded-l-lg border-l-4 border-yellow-400">$1</h3></div>')
        // Convert ## headers with enhanced styling
        .replace(/^## (.+)$/gm, '<div class="mt-8 mb-5"><h2 class="text-xl font-bold text-yellow-200 bg-gradient-to-r from-yellow-300/20 to-transparent px-4 py-3 rounded-l-lg border-l-4 border-yellow-300">$1</h2></div>')
        // Convert # headers with enhanced styling
        .replace(/^# (.+)$/gm, '<div class="mt-10 mb-6"><h1 class="text-2xl font-bold text-yellow-100 bg-gradient-to-r from-yellow-200/20 to-transparent px-5 py-4 rounded-l-lg border-l-4 border-yellow-200">$1</h1></div>')
        // Enhanced bullet points with better spacing and indentation
        .replace(/^[-•] (.+)$/gm, '<div class="flex items-start mb-3 pl-2"><div class="w-6 h-6 bg-yellow-400/20 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0"><span class="text-yellow-400 text-sm font-bold">•</span></div><div class="flex-1 leading-relaxed">$1</div></div>')
        // Enhanced numbered lists with better styling
        .replace(/^(\d+)\. (.+)$/gm, '<div class="flex items-start mb-3 pl-2"><div class="w-7 h-7 bg-blue-400/20 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0"><span class="text-blue-400 text-sm font-bold">$1</span></div><div class="flex-1 leading-relaxed">$2</div></div>')
        // Convert special patterns for better structure
        .replace(/^【(.+?)】(.*)$/gm, '<div class="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-4 mb-4 border-l-4 border-purple-400"><div class="text-purple-300 font-semibold mb-2">【$1】</div><div class="text-purple-100 leading-relaxed pl-2">$2</div></div>')
        // Convert ◆ or ◇ symbols to styled sections
        .replace(/^[◆◇] (.+)$/gm, '<div class="bg-gradient-to-r from-indigo-600/15 to-purple-600/15 rounded-lg p-3 mb-3 border border-indigo-400/30"><div class="flex items-start"><span class="text-indigo-400 mr-2 text-lg">◆</span><div class="flex-1 leading-relaxed">$1</div></div></div>')
        // Convert double line breaks to enhanced paragraph breaks
        .replace(/\n\s*\n/g, '</div><div class="mb-5 leading-relaxed text-justify">')
        // Convert single line breaks to <br> with spacing
        .replace(/\n/g, '<br class="mb-1">');
      
      // Wrap content in enhanced paragraph container
      if (!formatted.match(/^\s*<(h[1-6]|div)/)) {
        formatted = '<div class="mb-5 leading-relaxed text-justify">' + formatted + '</div>';
      }
      
      // Clean up and enhance formatting
      formatted = formatted
        .replace(/<div class="mb-5 leading-relaxed text-justify">\s*<\/div>/g, '')
        .replace(/<div class="mb-5 leading-relaxed text-justify">\s*(<div class="mt-)/g, '$1')
        .replace(/(<\/h[1-6]><\/div>)\s*<\/div>/g, '$1')
        .replace(/<div class="mb-5 leading-relaxed text-justify">\s*(<div class="flex)/g, '$1')
        .replace(/(<\/div><\/div>)\s*<\/div>/g, '$1')
        // Add proper spacing between sections
        .replace(/(<\/div>)(<div class="mt-)/g, '$1<div class="my-2"></div>$2')
        // Enhance text spacing and readability
        .replace(/([。！？])([^<\n])/g, '$1 $2')
        .replace(/([，、；])([^<\n])/g, '$1 $2');
      
      return formatted;
    } catch (error) {
      console.error('Error formatting text:', error);
      // Enhanced fallback with better line spacing
      return '<div class="leading-relaxed text-justify">' + text.replace(/\n/g, '<br class="mb-1">') + '</div>';
    }
  }, []);

  // Enhanced reading submission with retry logic
  const handleSubmitReading = useCallback(async () => {
    let retryCount = 0;
    const maxRetries = 3;
    
    const attemptReading = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setResult(null);

        if (!question.trim()) {
          throw new FortuneError(t.errorMissingQuestion, 'VALIDATION_ERROR');
        }

        const searchQuery = `${methodConfig[selectedMethod].title} ${typeConfig[readingType].title} ${question}`;
        
        // Perform web search first if enabled
        let searchResults = [];
        const ENABLE_WEB_SEARCH = import.meta.env.VITE_ENABLE_WEB_SEARCH === 'true';
        const WEB_SEARCH_API_KEY = import.meta.env.VITE_WEB_SEARCH_API_KEY;
        
        if (ENABLE_WEB_SEARCH && WEB_SEARCH_API_KEY && searchQuery) {
          try {
            searchResults = await performWebSearch(searchQuery, WEB_SEARCH_API_KEY);
          } catch (searchError) {
            console.warn('Web search failed:', searchError);
          }
        }
        
        const prompt = generatePrompt(selectedMethod, inputData, question, readingType, searchResults);
        const result = await processReading(prompt);
        
        setResult({
          method: selectedMethod,
          type: readingType,
          question: question,
          reading: result.reading,
          timestamp: new Date().toISOString(),
          isAIGenerated: result.isAIGenerated,
          searchResults: result.searchResults || []
        });
        
      } catch (error: any) {
        if (error.type === 'API_ERROR' && retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying API call, attempt ${retryCount}/${maxRetries}`);
          
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
          return attemptReading();
        }
        
        const errorResult = errorHandler(error, 'handleSubmitReading', t);
        setError(errorResult.error);
      } finally {
        setIsLoading(false);
      }
    };
    
    return attemptReading();
  }, [selectedMethod, inputData, question, readingType, generatePrompt, processReading]);

  // Input data handlers
  const updateInputData = useCallback((key: string, value: any) => {
    setInputData(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const resetForm = useCallback(() => {
    setQuestion('');
    setInputData({});
    setResult(null);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="text-center py-8 px-4 relative">

        <div className="flex justify-center items-center mb-4">
          <Sparkles className="w-8 h-8 mr-2 text-yellow-400" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <Sparkles className="w-8 h-8 ml-2 text-yellow-400" />
        </div>
        <p className="text-xl text-purple-200">{t.subtitle}</p>
      </header>

      <div className="max-w-6xl mx-auto px-4 pb-8">
        {/* Method Selection */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              {t.selectMethod}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-pink-400 mx-auto rounded-full"></div>
          </div>
          
          {/* Western Divination Methods */}
          <div className="mb-10">
            <div className="flex items-center justify-center mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-blue-400"></div>
              <h3 className="text-2xl font-bold mx-6 text-blue-300 flex items-center">
                <span className="text-3xl mr-2">🌟</span>
                西方占卜
                <span className="text-3xl ml-2">🌟</span>
              </h3>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-blue-400"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[DIVINATION_METHODS.TAROT, DIVINATION_METHODS.ASTROLOGY, DIVINATION_METHODS.NUMEROLOGY].map((method) => {
                const config = methodConfig[method];
                const IconComponent = config.icon;
                return (
                  <button
                    key={method}
                    onClick={() => {
                      setSelectedMethod(method);
                      resetForm();
                    }}
                    className={`group relative p-8 rounded-xl border-2 transition-all duration-500 transform hover:scale-105 ${
                      selectedMethod === method
                        ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/20 via-blue-400/10 to-purple-400/20 shadow-2xl shadow-yellow-400/30'
                        : 'border-blue-400/40 bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-indigo-900/40 hover:border-blue-300/70 hover:shadow-xl hover:shadow-blue-400/20'
                    }`}
                  >
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <IconComponent className={`w-16 h-16 mx-auto mb-4 transition-all duration-300 ${
                      selectedMethod === method ? 'text-yellow-400 drop-shadow-lg' : 'text-blue-300 group-hover:text-blue-200'
                    }`} />
                    <h3 className="text-xl font-bold mb-3 transition-colors duration-300">{config.title}</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{config.description}</p>
                    {selectedMethod === method && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-purple-900 text-sm font-bold">✓</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Eastern Divination Methods */}
          <div className="mb-10">
            <div className="flex items-center justify-center mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-orange-400"></div>
              <h3 className="text-2xl font-bold mx-6 text-orange-300 flex items-center">
                <span className="text-3xl mr-2">🏮</span>
                东方占卜
                <span className="text-3xl ml-2">🏮</span>
              </h3>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-orange-400"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[DIVINATION_METHODS.LOTTERY, DIVINATION_METHODS.JIAOBEI, DIVINATION_METHODS.BAZI, DIVINATION_METHODS.ZIWEI].map((method) => {
                const config = methodConfig[method];
                const IconComponent = config.icon;
                return (
                  <button
                    key={method}
                    onClick={() => {
                      setSelectedMethod(method);
                      resetForm();
                    }}
                    className={`group relative p-8 rounded-xl border-2 transition-all duration-500 transform hover:scale-105 ${
                      selectedMethod === method
                        ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/20 via-orange-400/10 to-red-400/20 shadow-2xl shadow-yellow-400/30'
                        : 'border-orange-400/40 bg-gradient-to-br from-orange-900/40 via-red-800/30 to-pink-900/40 hover:border-orange-300/70 hover:shadow-xl hover:shadow-orange-400/20'
                    }`}
                  >
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <IconComponent className={`w-16 h-16 mx-auto mb-4 transition-all duration-300 ${
                      selectedMethod === method ? 'text-yellow-400 drop-shadow-lg' : 'text-orange-300 group-hover:text-orange-200'
                    }`} />
                    <h3 className="text-xl font-bold mb-3 transition-colors duration-300">{config.title}</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{config.description}</p>
                    {selectedMethod === method && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-purple-900 text-sm font-bold">✓</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Psychological Tests */}
          <div>
            <div className="flex items-center justify-center mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-purple-400"></div>
              <h3 className="text-2xl font-bold mx-6 text-purple-300 flex items-center">
                <span className="text-3xl mr-2">🧠</span>
                心理测试
                <span className="text-3xl ml-2">💫</span>
              </h3>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-purple-400"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[DIVINATION_METHODS.PERSONALITY, DIVINATION_METHODS.COMPATIBILITY, DIVINATION_METHODS.LIFESTORY].map((method) => {
                const config = methodConfig[method];
                const IconComponent = config.icon;
                return (
                  <button
                    key={method}
                    onClick={() => {
                      setSelectedMethod(method);
                      resetForm();
                    }}
                    className={`group relative p-8 rounded-xl border-2 transition-all duration-500 transform hover:scale-105 ${
                      selectedMethod === method
                        ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/20 via-purple-400/10 to-pink-400/20 shadow-2xl shadow-yellow-400/30'
                        : 'border-purple-400/40 bg-gradient-to-br from-purple-900/40 via-indigo-800/30 to-blue-900/40 hover:border-purple-300/70 hover:shadow-xl hover:shadow-purple-400/20'
                    }`}
                  >
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <IconComponent className={`w-16 h-16 mx-auto mb-4 transition-all duration-300 ${
                      selectedMethod === method ? 'text-yellow-400 drop-shadow-lg' : 'text-purple-300 group-hover:text-purple-200'
                    }`} />
                    <h3 className="text-xl font-bold mb-3 transition-colors duration-300">{config.title}</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{config.description}</p>
                    {selectedMethod === method && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-purple-900 text-sm font-bold">✓</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reading Type Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">{t.selectType}</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(typeConfig).map(([type, config]) => {
              const IconComponent = config.icon;
              return (
                <button
                  key={type}
                  onClick={() => setReadingType(type)}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    readingType === type
                      ? 'border-pink-400 bg-pink-400/20 shadow-lg shadow-pink-400/50'
                      : 'border-purple-400/30 bg-purple-900/30 hover:border-purple-400/60'
                  }`}
                >
                  <IconComponent className={`w-8 h-8 mx-auto mb-2 ${
                    readingType === type ? 'text-pink-400' : 'text-purple-300'
                  }`} />
                  <span className="text-sm font-medium">{config.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-purple-900/50 rounded-lg p-6 mb-8 border border-purple-400/30">
          <h2 className="text-2xl font-semibold mb-6">{t.detailInfo}</h2>
          
          {/* Method-specific inputs */}
          {selectedMethod === DIVINATION_METHODS.TAROT && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">{texts.selectTarotCards} <span className="text-red-400">*</span></label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {Object.keys(texts.tarotCards).map((card) => (
                  <button
                    key={card}
                    onClick={() => {
                      const cards = inputData.cards || [];
                      const newCards = cards.includes(card) 
                        ? cards.filter(c => c !== card)
                        : [...cards, card];
                      updateInputData('cards', newCards);
                    }}
                    className={`p-2 text-sm rounded border ${
                      (inputData.cards || []).includes(card)
                        ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300'
                        : 'bg-purple-800/50 border-purple-600 text-purple-200 hover:border-purple-400'
                    }`}
                  >
                    {t.tarotCards[card]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedMethod === DIVINATION_METHODS.ASTROLOGY && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">{t.birthDate} <span className="text-red-400">*</span></label>
                <input
                  type="date"
                  min="1920-01-01"
                  max="2030-12-31"
                  className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white"
                  onChange={(e) => updateInputData('birthInfo', {
                    ...inputData.birthInfo,
                    date: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t.birthTime} <span className="text-red-400">*</span></label>
                <input
                  type="time"
                  className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white"
                  onChange={(e) => updateInputData('birthInfo', {
                    ...inputData.birthInfo,
                    time: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t.birthPlace} <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  placeholder={t.cityName}
                  className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400"
                  onChange={(e) => updateInputData('birthInfo', {
                    ...inputData.birthInfo,
                    location: e.target.value
                  })}
                />
              </div>
            </div>
          )}

          {selectedMethod === DIVINATION_METHODS.LOTTERY && (
            <div className="mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-300 mb-4">{t.prayFirst}</p>
                {!inputData.lottery ? (
                  <button
                    type="button"
                    onClick={() => {
                      const randomNumber = Math.floor(Math.random() * 10) + 1;
                      const lotteryData = t.lotteryData[randomNumber.toString()];
                      updateInputData('lottery', {
                        number: randomNumber,
                        poem: lotteryData.poem,
                        meaning: lotteryData.meaning,
                        interpretation: lotteryData.interpretation
                      });
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg font-semibold hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    🙏 {t.drawLot}
                  </button>
                ) : (
                  <div className="bg-purple-800/50 p-4 rounded-lg border border-purple-600">
                    <h4 className="text-lg font-semibold text-yellow-400 mb-2">{t.lotResult}</h4>
                    <p className="text-sm text-gray-300 mb-1">{t.lotNumber}：第{inputData.lottery.number}签</p>
                    <p className="text-sm text-gray-300 mb-1">{t.lotMeaning}：{inputData.lottery.meaning}</p>
                    <p className="text-sm text-gray-300 mb-2">{t.lotPoem}：{inputData.lottery.poem}</p>
                    <button
                      type="button"
                      onClick={() => updateInputData('lottery', null)}
                      className="text-xs text-orange-400 hover:text-orange-300 underline"
                    >
                      {t.redrawLot}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedMethod === DIVINATION_METHODS.JIAOBEI && (
            <div className="mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-300 mb-4">{t.prayBeforeJiaobei}</p>
                {!inputData.jiaobei ? (
                  <button
                    type="button"
                    onClick={() => {
                      const results = ['holy', 'laughing', 'yin'];
                      const randomResult = results[Math.floor(Math.random() * results.length)];
                      updateInputData('jiaobei', {
                        result: randomResult,
                        resultText: t.jiaobeResults[randomResult]
                      });
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-semibold hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    🪙 {t.throwJiaobei}
                  </button>
                ) : (
                  <div className="bg-gradient-to-r from-purple-800/40 to-indigo-800/40 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 shadow-lg">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center mr-3">
                        <Sparkles className="w-5 h-5 text-yellow-400" />
                      </div>
                      <h4 className="text-xl font-bold text-yellow-400">{t.jiaobeResult}</h4>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-700/30 to-blue-700/30 rounded-lg p-6 mb-4 border border-purple-400/20">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-400/20 to-yellow-400/20 rounded-full mb-4 border-2 border-orange-400/30">
                          <div className="text-4xl">
                            {inputData.jiaobei.result === 'holy' && '🪙✨'}
                            {inputData.jiaobei.result === 'laughing' && '🪙😄'}
                            {inputData.jiaobei.result === 'yin' && '🪙🌙'}
                          </div>
                        </div>
                        <p className="text-xl font-bold text-orange-300 mb-2">{inputData.jiaobei.resultText}</p>
                        <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full mx-auto"></div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => updateInputData('jiaobei', null)}
                        className="px-4 py-2 bg-orange-600/30 hover:bg-orange-600/50 rounded-lg text-sm font-medium text-orange-300 hover:text-orange-200 transition-all duration-200 border border-orange-500/30 hover:border-orange-400/50 flex items-center space-x-2 mx-auto"
                      >
                        <Zap className="w-4 h-4" />
                        <span>{t.rethrowJiaobei}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedMethod === DIVINATION_METHODS.NUMEROLOGY && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">{t.name} <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  placeholder={t.enterName}
                  className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400"
                  onChange={(e) => updateInputData('personalInfo', {
                    ...inputData.personalInfo,
                    name: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t.birthDate} <span className="text-red-400">*</span></label>
                <input
                  type="date"
                  min="1920-01-01"
                  max="2030-12-31"
                  className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white"
                  onChange={(e) => updateInputData('personalInfo', {
                    ...inputData.personalInfo,
                    birthDate: e.target.value
                  })}
                />
              </div>
            </div>
          )}

          {selectedMethod === DIVINATION_METHODS.BAZI && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">{t.name} <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  placeholder={t.enterName}
                  className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400"
                  onChange={(e) => updateInputData('birthInfo', {
                    ...inputData.birthInfo,
                    name: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t.birthDate} <span className="text-red-400">*</span></label>
                <input
                  type="date"
                  min="1920-01-01"
                  max="2030-12-31"
                  className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white"
                  onChange={(e) => updateInputData('birthInfo', {
                    ...inputData.birthInfo,
                    birthDate: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t.birthHour} <span className="text-red-400">*</span></label>
                <select
                  className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white"
                  onChange={(e) => updateInputData('birthInfo', {
                    ...inputData.birthInfo,
                    birthTime: e.target.value
                  })}
                >
                  <option value="">{t.selectHour}</option>
                  <option value="子时">{t.zi}</option>
                  <option value="丑时">{t.chou}</option>
                  <option value="寅时">{t.yin}</option>
                  <option value="卯时">{t.mao}</option>
                  <option value="辰时">{t.chen}</option>
                  <option value="巳时">{t.si}</option>
                  <option value="午时">{t.wu}</option>
                  <option value="未时">{t.wei}</option>
                  <option value="申时">{t.shen}</option>
                  <option value="酉时">{t.you}</option>
                  <option value="戌时">{t.xu}</option>
                  <option value="亥时">{t.hai}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t.gender} <span className="text-red-400">*</span></label>
                <select
                  className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white"
                  onChange={(e) => updateInputData('birthInfo', {
                    ...inputData.birthInfo,
                    gender: e.target.value
                  })}
                >
                  <option value="">{t.selectGender}</option>
                  <option value="男">{t.male}</option>
                  <option value="女">{t.female}</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">{t.birthPlace} ({t.optional})</label>
                <input
                  type="text"
                  placeholder={t.enterCity}
                  className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400"
                  onChange={(e) => updateInputData('birthInfo', {
                    ...inputData.birthInfo,
                    birthPlace: e.target.value
                  })}
                />
              </div>
            </div>
          )}

          {selectedMethod === DIVINATION_METHODS.ZIWEI && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">{t.birthDate} <span className="text-red-400">*</span></label>
                <input
                  type="date"
                  min="1920-01-01"
                  max="2030-12-31"
                  className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white"
                  onChange={(e) => updateInputData('birthInfo', {
                    ...inputData.birthInfo,
                    birthDate: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t.birthHour} <span className="text-red-400">*</span></label>
                <select
                  className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white"
                  onChange={(e) => updateInputData('birthInfo', {
                    ...inputData.birthInfo,
                    birthTime: e.target.value
                  })}
                >
                  <option value="">{t.selectHour}</option>
                  <option value="子时">{t.zi}</option>
                  <option value="丑时">{t.chou}</option>
                  <option value="寅时">{t.yin}</option>
                  <option value="卯时">{t.mao}</option>
                  <option value="辰时">{t.chen}</option>
                  <option value="巳时">{t.si}</option>
                  <option value="午时">{t.wu}</option>
                  <option value="未时">{t.wei}</option>
                  <option value="申时">{t.shen}</option>
                  <option value="酉时">{t.you}</option>
                  <option value="戌时">{t.xu}</option>
                  <option value="亥时">{t.hai}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t.gender} ({t.optional})</label>
                <select
                  className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white"
                  onChange={(e) => updateInputData('birthInfo', {
                    ...inputData.birthInfo,
                    gender: e.target.value
                  })}
                >
                  <option value="">{t.selectGender}</option>
                  <option value="男">{t.male}</option>
                  <option value="女">{t.female}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t.birthPlace} ({t.optional})</label>
                <input
                  type="text"
                  placeholder={t.enterCity}
                  className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400"
                  onChange={(e) => updateInputData('birthInfo', {
                    ...inputData.birthInfo,
                    birthPlace: e.target.value
                  })}
                />
              </div>
            </div>
          )}

          {selectedMethod === DIVINATION_METHODS.PERSONALITY && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">姓名 <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  placeholder="请输入您的姓名"
                  className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400"
                  onChange={(e) => updateInputData('personalInfo', {
                    ...inputData.personalInfo,
                    name: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">年龄</label>
                <input
                  type="number"
                  placeholder="请输入您的年龄"
                  className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400"
                  onChange={(e) => updateInputData('personalInfo', {
                    ...inputData.personalInfo,
                    age: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">职业</label>
                <input
                  type="text"
                  placeholder="请输入您的职业"
                  className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400"
                  onChange={(e) => updateInputData('personalInfo', {
                    ...inputData.personalInfo,
                    occupation: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">兴趣爱好</label>
                <input
                  type="text"
                  placeholder="请输入您的兴趣爱好"
                  className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400"
                  onChange={(e) => updateInputData('personalInfo', {
                    ...inputData.personalInfo,
                    hobbies: e.target.value
                  })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">性格自我描述 <span className="text-red-400">*</span></label>
                <textarea
                  className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400 h-20 resize-none"
                  placeholder="请简单描述一下您的性格特点"
                  onChange={(e) => updateInputData('personalInfo', {
                    ...inputData.personalInfo,
                    selfDescription: e.target.value
                  })}
                />
              </div>
            </div>
          )}

          {selectedMethod === DIVINATION_METHODS.COMPATIBILITY && (
            <div className="space-y-6 mb-6">
              <div className="bg-purple-800/30 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-purple-300">👤 您的信息</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">姓名 <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      placeholder="请输入您的姓名"
                      className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400"
                      onChange={(e) => updateInputData('compatibilityInfo', {
                        ...inputData.compatibilityInfo,
                        person1: {
                          ...inputData.compatibilityInfo?.person1,
                          name: e.target.value
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">年龄</label>
                    <input
                      type="number"
                      placeholder="请输入您的年龄"
                      className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400"
                      onChange={(e) => updateInputData('compatibilityInfo', {
                        ...inputData.compatibilityInfo,
                        person1: {
                          ...inputData.compatibilityInfo?.person1,
                          age: e.target.value
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">出生日期 <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      placeholder="如：1990-01-01"
                      className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400"
                      onChange={(e) => updateInputData('compatibilityInfo', {
                        ...inputData.compatibilityInfo,
                        person1: {
                          ...inputData.compatibilityInfo?.person1,
                          birthDate: e.target.value
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">出生时辰 <span className="text-red-400">*</span></label>
                    <select
                      className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white"
                      onChange={(e) => updateInputData('compatibilityInfo', {
                        ...inputData.compatibilityInfo,
                        person1: {
                          ...inputData.compatibilityInfo?.person1,
                          birthTime: e.target.value
                        }
                      })}
                    >
                      <option value="">请选择时辰</option>
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
                    <label className="block text-sm font-medium mb-2">性别 <span className="text-red-400">*</span></label>
                    <select
                      className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white"
                      onChange={(e) => updateInputData('compatibilityInfo', {
                        ...inputData.compatibilityInfo,
                        person1: {
                          ...inputData.compatibilityInfo?.person1,
                          gender: e.target.value
                        }
                      })}
                    >
                      <option value="">请选择性别</option>
                      <option value="男">男</option>
                      <option value="女">女</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">出生地</label>
                    <input
                      type="text"
                      placeholder="请输入出生地"
                      className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400"
                      onChange={(e) => updateInputData('compatibilityInfo', {
                        ...inputData.compatibilityInfo,
                        person1: {
                          ...inputData.compatibilityInfo?.person1,
                          birthPlace: e.target.value
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">性格特点</label>
                    <input
                      type="text"
                      placeholder="请描述您的性格特点"
                      className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400"
                      onChange={(e) => updateInputData('compatibilityInfo', {
                        ...inputData.compatibilityInfo,
                        person1: {
                          ...inputData.compatibilityInfo?.person1,
                          personality: e.target.value
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">兴趣爱好</label>
                    <input
                      type="text"
                      placeholder="请输入您的兴趣爱好"
                      className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400"
                      onChange={(e) => updateInputData('compatibilityInfo', {
                        ...inputData.compatibilityInfo,
                        person1: {
                          ...inputData.compatibilityInfo?.person1,
                          hobbies: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-pink-800/30 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-pink-300">💕 对方信息</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">姓名 <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      placeholder="请输入对方的姓名"
                      className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400"
                      onChange={(e) => updateInputData('compatibilityInfo', {
                        ...inputData.compatibilityInfo,
                        person2: {
                          ...inputData.compatibilityInfo?.person2,
                          name: e.target.value
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">年龄</label>
                    <input
                      type="number"
                      placeholder="请输入对方的年龄"
                      className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400"
                      onChange={(e) => updateInputData('compatibilityInfo', {
                        ...inputData.compatibilityInfo,
                        person2: {
                          ...inputData.compatibilityInfo?.person2,
                          age: e.target.value
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">出生日期 <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      placeholder="如：1992-05-15"
                      className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400"
                      onChange={(e) => updateInputData('compatibilityInfo', {
                        ...inputData.compatibilityInfo,
                        person2: {
                          ...inputData.compatibilityInfo?.person2,
                          birthDate: e.target.value
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">出生时辰 <span className="text-red-400">*</span></label>
                    <select
                      className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white"
                      onChange={(e) => updateInputData('compatibilityInfo', {
                        ...inputData.compatibilityInfo,
                        person2: {
                          ...inputData.compatibilityInfo?.person2,
                          birthTime: e.target.value
                        }
                      })}
                    >
                      <option value="">请选择时辰</option>
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
                    <label className="block text-sm font-medium mb-2">性别 <span className="text-red-400">*</span></label>
                    <select
                      className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white"
                      onChange={(e) => updateInputData('compatibilityInfo', {
                        ...inputData.compatibilityInfo,
                        person2: {
                          ...inputData.compatibilityInfo?.person2,
                          gender: e.target.value
                        }
                      })}
                    >
                      <option value="">请选择性别</option>
                      <option value="男">男</option>
                      <option value="女">女</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">出生地</label>
                    <input
                      type="text"
                      placeholder="请输入出生地"
                      className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400"
                      onChange={(e) => updateInputData('compatibilityInfo', {
                        ...inputData.compatibilityInfo,
                        person2: {
                          ...inputData.compatibilityInfo?.person2,
                          birthPlace: e.target.value
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">性格特点</label>
                    <input
                      type="text"
                      placeholder="请描述对方的性格特点"
                      className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400"
                      onChange={(e) => updateInputData('compatibilityInfo', {
                        ...inputData.compatibilityInfo,
                        person2: {
                          ...inputData.compatibilityInfo?.person2,
                          personality: e.target.value
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">兴趣爱好</label>
                    <input
                      type="text"
                      placeholder="请输入对方的兴趣爱好"
                      className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400"
                      onChange={(e) => updateInputData('compatibilityInfo', {
                        ...inputData.compatibilityInfo,
                        person2: {
                          ...inputData.compatibilityInfo?.person2,
                          hobbies: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">关系类型 <span className="text-red-400">*</span></label>
                  <select
                    className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white"
                    onChange={(e) => updateInputData('compatibilityInfo', {
                      ...inputData.compatibilityInfo,
                      relationshipType: e.target.value
                    })}
                  >
                    <option value="">请选择关系类型</option>
                    <option value="恋人">恋人</option>
                    <option value="夫妻">夫妻</option>
                    <option value="朋友">朋友</option>
                    <option value="同事">同事</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">相识时间</label>
                  <input
                    type="text"
                    placeholder="如：3个月、2年等"
                    className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400"
                    onChange={(e) => updateInputData('compatibilityInfo', {
                      ...inputData.compatibilityInfo,
                      duration: e.target.value
                    })}
                  />
                </div>
              </div>
            </div>
          )}

          {selectedMethod === DIVINATION_METHODS.LIFESTORY && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">姓名 <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  placeholder="请输入您的姓名"
                  className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400"
                  onChange={(e) => updateInputData('personalInfo', {
                    ...inputData.personalInfo,
                    name: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">出生日期</label>
                <input
                  type="text"
                  placeholder="如：1990-01-01 或 100001-01-01"
                  className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400"
                  onChange={(e) => updateInputData('personalInfo', {
                    ...inputData.personalInfo,
                    birthDate: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">出生地</label>
                <input
                  type="text"
                  placeholder="请输入您的出生地"
                  className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400"
                  onChange={(e) => updateInputData('personalInfo', {
                    ...inputData.personalInfo,
                    birthPlace: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">职业</label>
                <input
                  type="text"
                  placeholder="请输入您的职业"
                  className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400"
                  onChange={(e) => updateInputData('personalInfo', {
                    ...inputData.personalInfo,
                    occupation: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">性格特点</label>
                <input
                  type="text"
                  placeholder="请描述您的性格特点"
                  className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400"
                  onChange={(e) => updateInputData('personalInfo', {
                    ...inputData.personalInfo,
                    personality: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">梦想目标 <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  placeholder="请输入您的梦想或目标"
                  className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400"
                  onChange={(e) => updateInputData('personalInfo', {
                    ...inputData.personalInfo,
                    dreams: e.target.value
                  })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">人生经历 <span className="text-red-400">*</span></label>
                <textarea
                  className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400 h-20 resize-none"
                  placeholder="请简单描述一些重要的人生经历"
                  onChange={(e) => updateInputData('personalInfo', {
                    ...inputData.personalInfo,
                    lifeExperience: e.target.value
                  })}
                />
              </div>
            </div>
          )}

          {/* Question Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">{t.question} <span className="text-red-400">*</span></label>
            <textarea
              className="w-full p-3 rounded bg-purple-800 border border-purple-600 text-white placeholder-purple-400 h-24 resize-none"
              placeholder={t.questionPlaceholder}
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
            {isLoading ? t.divining : t.startDivination}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-red-200">{error}</span>
            </div>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="max-w-4xl mx-auto">
            {/* 结果标题卡片 */}
            <div className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 backdrop-blur-sm rounded-2xl p-8 mb-6 border border-purple-400/20 shadow-2xl">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mb-4 shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
                  {t.result}
                </h2>
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <span className="px-4 py-2 bg-purple-600/30 rounded-full text-purple-200 text-sm font-medium">
                    {methodConfig[result.method].title}
                  </span>
                  <span className="text-purple-400">·</span>
                  <span className="px-4 py-2 bg-blue-600/30 rounded-full text-blue-200 text-sm font-medium">
                    {typeConfig[result.type].title}
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  {result.isAIGenerated && (
                    <span className="px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-xs text-green-300 flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>{t.aiGenerated}</span>
                    </span>
                  )}
                  {!result.isAIGenerated && (
                    <span className="px-3 py-1 bg-orange-500/20 border border-orange-400/30 rounded-full text-xs text-orange-300 flex items-center space-x-1">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span>{t.offlineMode}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Web Search Results */}
            {result.searchResults && result.searchResults.length > 0 && (
              <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-blue-400/20 shadow-xl">
                <h4 className="text-xl font-bold mb-4 text-blue-300 flex items-center">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                    <Search className="w-5 h-5" />
                  </div>
                  {t.webSearch}
                </h4>
                <div className="grid gap-4">
                  {result.searchResults.map((searchResult, index) => (
                    <div key={index} className="bg-blue-800/20 rounded-lg p-4 border border-blue-600/20 hover:border-blue-500/40 transition-colors">
                      <a 
                        href={searchResult.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-semibold hover:underline text-blue-300 text-base block mb-2"
                      >
                        {searchResult.title}
                      </a>
                      <p className="text-blue-100 text-sm leading-relaxed">{searchResult.snippet}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 主要内容区域 */}
            <div className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl border border-purple-400/20 shadow-2xl overflow-hidden">
              {/* 问题部分 */}
              <div className="bg-gradient-to-r from-purple-800/40 to-indigo-800/40 p-6 border-b border-purple-400/20">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <MessageCircle className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-yellow-400 mb-3">{t.yourQuestion}</h3>
                    <div className="bg-purple-700/30 rounded-xl p-4 border-l-4 border-yellow-400">
                      <p className="text-purple-100 text-base leading-relaxed italic">"{result.question}"</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 解读部分 */}
              <div className="p-6">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <BookOpen className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-orange-400 mb-4">{t.interpretation}</h3>
                    <div className="bg-gradient-to-br from-slate-800/40 via-purple-800/30 to-blue-800/40 rounded-xl p-8 border border-purple-400/30 shadow-2xl backdrop-blur-sm">
                      <div 
                        className="text-purple-50 text-base max-w-none prose prose-invert"
                        style={{ 
                          lineHeight: '1.9',
                          letterSpacing: '0.02em',
                          textRendering: 'optimizeLegibility',
                          fontFeatureSettings: '"liga" 1, "kern" 1'
                        }}
                        dangerouslySetInnerHTML={{ __html: formatReadingText(result.reading) }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 底部信息和操作区域 */}
              <div className="bg-gradient-to-r from-purple-800/30 to-indigo-800/30 p-6 border-t border-purple-400/20">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  {/* 时间信息 */}
                  <div className="flex items-center space-x-2 text-purple-300">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{t.timestamp}{new Date(result.timestamp).toLocaleString('zh-CN')}</span>
                    <span className="text-xs bg-purple-600/20 px-2 py-1 rounded">
                      {result.reading?.length || 0} 字符
                    </span>
                  </div>
                  
                  {/* 操作按钮 */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button 
                      onClick={() => exportToPDF(result, t)}
                      className="px-4 py-2 bg-blue-600/30 hover:bg-blue-600/50 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2 border border-blue-500/30 hover:border-blue-400/50"
                    >
                      <Download className="w-4 h-4" />
                      <span>{t.exportPDF}</span>
                    </button>
                    <button 
                      onClick={() => exportToPDF(result, t)}
                      className="px-4 py-2 bg-green-600/30 hover:bg-green-600/50 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2 border border-green-500/30 hover:border-green-400/50"
                    >
                      <Printer className="w-4 h-4" />
                      <span>{t.print}</span>
                    </button>
                    <button 
                      onClick={() => navigator.clipboard.writeText(`${t.yourQuestion}${result.question}\n\n${t.interpretation}${result.reading}`)}
                      className="px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2 border border-purple-500/30 hover:border-purple-400/50"
                    >
                      <Copy className="w-4 h-4" />
                      <span>{t.copyResult}</span>
                    </button>
                    <button 
                      onClick={() => setResult(null)}
                      className="px-4 py-2 bg-gray-600/30 hover:bg-gray-600/50 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2 border border-gray-500/30 hover:border-gray-400/50"
                    >
                      <X className="w-4 h-4" />
                      <span>{t.clearResult}</span>
                    </button>
                  </div>
                </div>
                
                {/* 免责声明 */}
                <div className="mt-6 pt-4 border-t border-purple-400/20">
                  <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-400/20">
                    <p className="text-yellow-300 text-sm text-center flex items-center justify-center space-x-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{t.disclaimer}</span>
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