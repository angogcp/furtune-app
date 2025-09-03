// 完整的星座占星数据

// 12星座详细数据
export interface ZodiacSign {
  id: string;
  name: string;
  englishName: string;
  dates: string;
  element: string;
  quality: string;
  rulingPlanet: string;
  symbol: string;
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  compatibility: string[];
  luckyNumbers: number[];
  luckyColors: string[];
  bodyParts: string[];
  keywords: string[];
}

export const zodiacSigns: ZodiacSign[] = [
  {
    id: 'aries',
    name: '白羊座',
    englishName: 'Aries',
    dates: '3/21-4/19',
    element: '火象',
    quality: '基本宫',
    rulingPlanet: '火星',
    symbol: '♈',
    traits: ['热情', '冲动', '领导力强', '勇敢', '直接'],
    strengths: ['勇敢无畏', '充满活力', '天生领导', '诚实直率', '乐观积极'],
    weaknesses: ['急躁冲动', '缺乏耐心', '自我中心', '容易愤怒', '不够细心'],
    compatibility: ['狮子座', '射手座', '双子座', '水瓶座'],
    luckyNumbers: [1, 8, 17],
    luckyColors: ['红色', '橙色'],
    bodyParts: ['头部', '大脑'],
    keywords: ['我是', '行动', '开始', '领导']
  },
  {
    id: 'taurus',
    name: '金牛座',
    englishName: 'Taurus',
    dates: '4/20-5/20',
    element: '土象',
    quality: '固定宫',
    rulingPlanet: '金星',
    symbol: '♉',
    traits: ['稳重', '固执', '追求安全感', '实用', '感官'],
    strengths: ['可靠稳定', '坚持不懈', '实用主义', '忠诚可信', '艺术天赋'],
    weaknesses: ['过于固执', '变化缓慢', '物质主义', '懒惰倾向', '占有欲强'],
    compatibility: ['处女座', '摩羯座', '巨蟹座', '双鱼座'],
    luckyNumbers: [2, 6, 9, 12, 24],
    luckyColors: ['绿色', '粉色'],
    bodyParts: ['颈部', '喉咙'],
    keywords: ['我拥有', '稳定', '价值', '感官']
  },
  {
    id: 'gemini',
    name: '双子座',
    englishName: 'Gemini',
    dates: '5/21-6/20',
    element: '风象',
    quality: '变动宫',
    rulingPlanet: '水星',
    symbol: '♊',
    traits: ['聪明', '善变', '沟通能力强', '好奇', '多才多艺'],
    strengths: ['机智聪明', '适应力强', '沟通天才', '学习能力强', '幽默风趣'],
    weaknesses: ['三心二意', '缺乏深度', '神经质', '不够专注', '表里不一'],
    compatibility: ['天秤座', '水瓶座', '白羊座', '狮子座'],
    luckyNumbers: [5, 7, 14, 23],
    luckyColors: ['黄色', '银色'],
    bodyParts: ['手臂', '肺部'],
    keywords: ['我思考', '沟通', '多样性', '好奇']
  },
  {
    id: 'cancer',
    name: '巨蟹座',
    englishName: 'Cancer',
    dates: '6/21-7/22',
    element: '水象',
    quality: '基本宫',
    rulingPlanet: '月亮',
    symbol: '♋',
    traits: ['敏感', '顾家', '情感丰富', '直觉强', '保护欲'],
    strengths: ['情感丰富', '直觉敏锐', '忠诚可靠', '富有同情心', '想象力强'],
    weaknesses: ['过于敏感', '情绪化', '缺乏安全感', '容易受伤', '过度保护'],
    compatibility: ['天蝎座', '双鱼座', '金牛座', '处女座'],
    luckyNumbers: [2, 7, 11, 16, 20, 25],
    luckyColors: ['白色', '银色', '海蓝色'],
    bodyParts: ['胸部', '胃部'],
    keywords: ['我感受', '情感', '家庭', '直觉']
  },
  {
    id: 'leo',
    name: '狮子座',
    englishName: 'Leo',
    dates: '7/23-8/22',
    element: '火象',
    quality: '固定宫',
    rulingPlanet: '太阳',
    symbol: '♌',
    traits: ['自信', '慷慨', '喜欢被关注', '戏剧性', '高贵'],
    strengths: ['自信大方', '慷慨大度', '创造力强', '领导才能', '忠诚可靠'],
    weaknesses: ['自负傲慢', '爱慕虚荣', '固执己见', '控制欲强', '缺乏耐心'],
    compatibility: ['白羊座', '射手座', '双子座', '天秤座'],
    luckyNumbers: [1, 3, 10, 19],
    luckyColors: ['金色', '橙色', '红色'],
    bodyParts: ['心脏', '背部'],
    keywords: ['我创造', '表现', '荣耀', '创意']
  },
  {
    id: 'virgo',
    name: '处女座',
    englishName: 'Virgo',
    dates: '8/23-9/22',
    element: '土象',
    quality: '变动宫',
    rulingPlanet: '水星',
    symbol: '♍',
    traits: ['完美主义', '细心', '实用', '分析能力强', '服务精神'],
    strengths: ['注重细节', '分析能力强', '实用主义', '勤奋努力', '可靠负责'],
    weaknesses: ['过于挑剔', '焦虑不安', '缺乏自信', '过度分析', '保守谨慎'],
    compatibility: ['金牛座', '摩羯座', '巨蟹座', '天蝎座'],
    luckyNumbers: [3, 27],
    luckyColors: ['深蓝色', '绿色'],
    bodyParts: ['腹部', '肠道'],
    keywords: ['我分析', '完美', '服务', '细节']
  },
  {
    id: 'libra',
    name: '天秤座',
    englishName: 'Libra',
    dates: '9/23-10/22',
    element: '风象',
    quality: '基本宫',
    rulingPlanet: '金星',
    symbol: '♎',
    traits: ['平衡', '和谐', '社交能力强', '优雅', '犹豫不决'],
    strengths: ['公正客观', '外交手腕', '艺术天赋', '优雅迷人', '合作精神'],
    weaknesses: ['犹豫不决', '避免冲突', '依赖他人', '表面化', '缺乏主见'],
    compatibility: ['双子座', '水瓶座', '狮子座', '射手座'],
    luckyNumbers: [4, 6, 13, 15, 24],
    luckyColors: ['蓝色', '绿色', '粉色'],
    bodyParts: ['腰部', '肾脏'],
    keywords: ['我平衡', '和谐', '关系', '美感']
  },
  {
    id: 'scorpio',
    name: '天蝎座',
    englishName: 'Scorpio',
    dates: '10/23-11/21',
    element: '水象',
    quality: '固定宫',
    rulingPlanet: '冥王星',
    symbol: '♏',
    traits: ['神秘', '强烈', '洞察力强', '复仇心', '变革'],
    strengths: ['洞察力强', '意志坚定', '忠诚可靠', '勇敢无畏', '直觉敏锐'],
    weaknesses: ['嫉妒心强', '报复心重', '控制欲强', '多疑猜忌', '极端倾向'],
    compatibility: ['巨蟹座', '双鱼座', '处女座', '摩羯座'],
    luckyNumbers: [8, 11, 18, 22],
    luckyColors: ['深红色', '黑色'],
    bodyParts: ['生殖器官', '骨盆'],
    keywords: ['我渴望', '转化', '深度', '力量']
  },
  {
    id: 'sagittarius',
    name: '射手座',
    englishName: 'Sagittarius',
    dates: '11/22-12/21',
    element: '火象',
    quality: '变动宫',
    rulingPlanet: '木星',
    symbol: '♐',
    traits: ['自由', '乐观', '哲学思考', '冒险', '直率'],
    strengths: ['乐观积极', '热爱自由', '哲学思维', '诚实直率', '冒险精神'],
    weaknesses: ['缺乏耐心', '过于直率', '不负责任', '夸大其词', '缺乏细节'],
    compatibility: ['白羊座', '狮子座', '天秤座', '水瓶座'],
    luckyNumbers: [3, 9, 15, 21, 33],
    luckyColors: ['紫色', '土耳其蓝'],
    bodyParts: ['大腿', '肝脏'],
    keywords: ['我理解', '探索', '自由', '智慧']
  },
  {
    id: 'capricorn',
    name: '摩羯座',
    englishName: 'Capricorn',
    dates: '12/22-1/19',
    element: '土象',
    quality: '基本宫',
    rulingPlanet: '土星',
    symbol: '♑',
    traits: ['务实', '有野心', '责任感强', '传统', '耐心'],
    strengths: ['责任心强', '目标明确', '坚持不懈', '实用主义', '组织能力强'],
    weaknesses: ['过于严肃', '悲观倾向', '固执保守', '缺乏幽默', '工作狂'],
    compatibility: ['金牛座', '处女座', '天蝎座', '双鱼座'],
    luckyNumbers: [6, 9, 26, 30],
    luckyColors: ['黑色', '棕色', '深绿色'],
    bodyParts: ['膝盖', '骨骼'],
    keywords: ['我使用', '成就', '结构', '权威']
  },
  {
    id: 'aquarius',
    name: '水瓶座',
    englishName: 'Aquarius',
    dates: '1/20-2/18',
    element: '风象',
    quality: '固定宫',
    rulingPlanet: '天王星',
    symbol: '♒',
    traits: ['独立', '创新', '人道主义', '叛逆', '理想主义'],
    strengths: ['独立自主', '创新思维', '人道主义', '友善开放', '理想主义'],
    weaknesses: ['情感疏离', '固执己见', '不切实际', '叛逆倾向', '缺乏耐心'],
    compatibility: ['双子座', '天秤座', '白羊座', '射手座'],
    luckyNumbers: [4, 7, 11, 22, 29],
    luckyColors: ['蓝色', '银色', '紫色'],
    bodyParts: ['小腿', '踝关节'],
    keywords: ['我知道', '革新', '友谊', '未来']
  },
  {
    id: 'pisces',
    name: '双鱼座',
    englishName: 'Pisces',
    dates: '2/19-3/20',
    element: '水象',
    quality: '变动宫',
    rulingPlanet: '海王星',
    symbol: '♓',
    traits: ['梦幻', '同情心强', '直觉敏锐', '艺术天赋', '逃避现实'],
    strengths: ['富有同情心', '直觉敏锐', '艺术天赋', '适应力强', '无私奉献'],
    weaknesses: ['过于敏感', '逃避现实', '缺乏方向', '容易受骗', '情绪化'],
    compatibility: ['巨蟹座', '天蝎座', '金牛座', '摩羯座'],
    luckyNumbers: [3, 9, 12, 15, 18, 24],
    luckyColors: ['海绿色', '薰衣草色'],
    bodyParts: ['脚部', '淋巴系统'],
    keywords: ['我相信', '直觉', '梦想', '灵性']
  }
];

// 行星数据
export interface Planet {
  id: string;
  name: string;
  symbol: string;
  meaning: string;
  influence: string[];
  keywords: string[];
  cycle: string;
}

export const planets: Planet[] = [
  {
    id: 'sun',
    name: '太阳',
    symbol: '☉',
    meaning: '自我、意识、生命力',
    influence: ['个性', '自我表达', '创造力', '领导力', '父亲'],
    keywords: ['自我', '意志', '活力', '权威', '创造'],
    cycle: '1年'
  },
  {
    id: 'moon',
    name: '月亮',
    symbol: '☽',
    meaning: '情感、直觉、潜意识',
    influence: ['情感', '直觉', '习惯', '家庭', '母亲'],
    keywords: ['情感', '直觉', '滋养', '保护', '记忆'],
    cycle: '28天'
  },
  {
    id: 'mercury',
    name: '水星',
    symbol: '☿',
    meaning: '沟通、思维、学习',
    influence: ['沟通', '思维', '学习', '交通', '商业'],
    keywords: ['沟通', '智慧', '学习', '适应', '交流'],
    cycle: '88天'
  },
  {
    id: 'venus',
    name: '金星',
    symbol: '♀',
    meaning: '爱情、美感、价值观',
    influence: ['爱情', '美感', '艺术', '金钱', '关系'],
    keywords: ['爱情', '美丽', '和谐', '价值', '享受'],
    cycle: '225天'
  },
  {
    id: 'mars',
    name: '火星',
    symbol: '♂',
    meaning: '行动、欲望、冲突',
    influence: ['行动', '欲望', '竞争', '冲突', '性'],
    keywords: ['行动', '勇气', '冲动', '竞争', '激情'],
    cycle: '2年'
  },
  {
    id: 'jupiter',
    name: '木星',
    symbol: '♃',
    meaning: '扩展、智慧、幸运',
    influence: ['扩展', '智慧', '哲学', '宗教', '幸运'],
    keywords: ['扩展', '智慧', '乐观', '成长', '机会'],
    cycle: '12年'
  },
  {
    id: 'saturn',
    name: '土星',
    symbol: '♄',
    meaning: '限制、责任、结构',
    influence: ['限制', '责任', '纪律', '结构', '时间'],
    keywords: ['责任', '限制', '纪律', '成熟', '结构'],
    cycle: '29年'
  },
  {
    id: 'uranus',
    name: '天王星',
    symbol: '♅',
    meaning: '革新、独立、突变',
    influence: ['革新', '独立', '科技', '突变', '自由'],
    keywords: ['革新', '独立', '突破', '原创', '未来'],
    cycle: '84年'
  },
  {
    id: 'neptune',
    name: '海王星',
    symbol: '♆',
    meaning: '梦想、直觉、幻象',
    influence: ['梦想', '直觉', '艺术', '灵性', '迷惑'],
    keywords: ['梦想', '直觉', '灵感', '同情', '幻象'],
    cycle: '165年'
  },
  {
    id: 'pluto',
    name: '冥王星',
    symbol: '♇',
    meaning: '转化、重生、深层力量',
    influence: ['转化', '重生', '深层心理', '权力', '死亡'],
    keywords: ['转化', '重生', '深度', '力量', '极端'],
    cycle: '248年'
  }
];

// 宫位系统
export interface House {
  id: number;
  name: string;
  meaning: string;
  keywords: string[];
  lifeArea: string;
}

export const houses: House[] = [
  {
    id: 1,
    name: '第一宫（命宫）',
    meaning: '自我、外貌、第一印象',
    keywords: ['自我', '外貌', '个性', '开始', '身体'],
    lifeArea: '个人身份'
  },
  {
    id: 2,
    name: '第二宫（财帛宫）',
    meaning: '金钱、价值观、物质资源',
    keywords: ['金钱', '价值观', '资源', '才能', '安全感'],
    lifeArea: '物质财富'
  },
  {
    id: 3,
    name: '第三宫（兄弟宫）',
    meaning: '沟通、学习、兄弟姐妹',
    keywords: ['沟通', '学习', '兄弟', '短途旅行', '思维'],
    lifeArea: '沟通学习'
  },
  {
    id: 4,
    name: '第四宫（田宅宫）',
    meaning: '家庭、根基、内心世界',
    keywords: ['家庭', '根基', '母亲', '房产', '内心'],
    lifeArea: '家庭根基'
  },
  {
    id: 5,
    name: '第五宫（子女宫）',
    meaning: '创造、娱乐、恋爱、子女',
    keywords: ['创造', '娱乐', '恋爱', '子女', '投机'],
    lifeArea: '创造表达'
  },
  {
    id: 6,
    name: '第六宫（奴仆宫）',
    meaning: '工作、健康、服务、日常',
    keywords: ['工作', '健康', '服务', '日常', '宠物'],
    lifeArea: '工作健康'
  },
  {
    id: 7,
    name: '第七宫（夫妻宫）',
    meaning: '伙伴关系、婚姻、合作',
    keywords: ['伙伴', '婚姻', '合作', '敌人', '法律'],
    lifeArea: '伙伴关系'
  },
  {
    id: 8,
    name: '第八宫（疾厄宫）',
    meaning: '转化、共同资源、神秘学',
    keywords: ['转化', '共同资源', '性', '死亡', '神秘'],
    lifeArea: '转化重生'
  },
  {
    id: 9,
    name: '第九宫（迁移宫）',
    meaning: '哲学、高等教育、远行',
    keywords: ['哲学', '高等教育', '远行', '宗教', '法律'],
    lifeArea: '智慧探索'
  },
  {
    id: 10,
    name: '第十宫（官禄宫）',
    meaning: '事业、声誉、社会地位',
    keywords: ['事业', '声誉', '地位', '父亲', '权威'],
    lifeArea: '事业成就'
  },
  {
    id: 11,
    name: '第十一宫（福德宫）',
    meaning: '朋友、团体、希望、理想',
    keywords: ['朋友', '团体', '希望', '理想', '社交'],
    lifeArea: '友谊理想'
  },
  {
    id: 12,
    name: '第十二宫（玄秘宫）',
    meaning: '潜意识、隐秘、灵性、牺牲',
    keywords: ['潜意识', '隐秘', '灵性', '牺牲', '业力'],
    lifeArea: '灵性超越'
  }
];

// 相位系统
export interface Aspect {
  id: string;
  name: string;
  angle: number;
  symbol: string;
  nature: 'harmonious' | 'challenging' | 'neutral';
  meaning: string;
  keywords: string[];
}

export const aspects: Aspect[] = [
  {
    id: 'conjunction',
    name: '合相',
    angle: 0,
    symbol: '☌',
    nature: 'neutral',
    meaning: '能量融合，强化影响',
    keywords: ['融合', '强化', '开始', '集中']
  },
  {
    id: 'sextile',
    name: '六分相',
    angle: 60,
    symbol: '⚹',
    nature: 'harmonious',
    meaning: '和谐机会，轻松发展',
    keywords: ['机会', '和谐', '才能', '合作']
  },
  {
    id: 'square',
    name: '四分相',
    symbol: '□',
    angle: 90,
    nature: 'challenging',
    meaning: '紧张冲突，需要行动',
    keywords: ['挑战', '冲突', '行动', '成长']
  },
  {
    id: 'trine',
    name: '三分相',
    angle: 120,
    symbol: '△',
    nature: 'harmonious',
    meaning: '流畅和谐，天赋才能',
    keywords: ['和谐', '天赋', '流畅', '幸运']
  },
  {
    id: 'opposition',
    name: '对分相',
    angle: 180,
    symbol: '☍',
    nature: 'challenging',
    meaning: '对立平衡，需要整合',
    keywords: ['对立', '平衡', '整合', '觉察']
  }
];

// 星座配对兼容性矩阵
export const compatibilityMatrix: Record<string, Record<string, number>> = {
  aries: { aries: 70, taurus: 60, gemini: 85, cancer: 55, leo: 95, virgo: 65, libra: 80, scorpio: 75, sagittarius: 90, capricorn: 60, aquarius: 85, pisces: 70 },
  taurus: { aries: 60, taurus: 75, gemini: 65, cancer: 90, leo: 70, virgo: 95, libra: 80, scorpio: 85, sagittarius: 60, capricorn: 90, aquarius: 65, pisces: 85 },
  gemini: { aries: 85, taurus: 65, gemini: 80, cancer: 70, leo: 85, virgo: 75, libra: 95, scorpio: 70, sagittarius: 85, capricorn: 65, aquarius: 90, pisces: 75 },
  cancer: { aries: 55, taurus: 90, gemini: 70, cancer: 80, leo: 75, virgo: 85, libra: 75, scorpio: 95, sagittarius: 65, capricorn: 85, aquarius: 60, pisces: 90 },
  leo: { aries: 95, taurus: 70, gemini: 85, cancer: 75, leo: 80, virgo: 70, libra: 85, scorpio: 80, sagittarius: 95, capricorn: 65, aquarius: 85, pisces: 75 },
  virgo: { aries: 65, taurus: 95, gemini: 75, cancer: 85, leo: 70, virgo: 80, libra: 80, scorpio: 90, sagittarius: 70, capricorn: 95, aquarius: 70, pisces: 85 },
  libra: { aries: 80, taurus: 80, gemini: 95, cancer: 75, leo: 85, virgo: 80, libra: 85, scorpio: 75, sagittarius: 85, capricorn: 75, aquarius: 90, pisces: 80 },
  scorpio: { aries: 75, taurus: 85, gemini: 70, cancer: 95, leo: 80, virgo: 90, libra: 75, scorpio: 85, sagittarius: 70, capricorn: 85, aquarius: 75, pisces: 95 },
  sagittarius: { aries: 90, taurus: 60, gemini: 85, cancer: 65, leo: 95, virgo: 70, libra: 85, scorpio: 70, sagittarius: 85, capricorn: 70, aquarius: 90, pisces: 75 },
  capricorn: { aries: 60, taurus: 90, gemini: 65, cancer: 85, leo: 65, virgo: 95, libra: 75, scorpio: 85, sagittarius: 70, capricorn: 85, aquarius: 70, pisces: 85 },
  aquarius: { aries: 85, taurus: 65, gemini: 90, cancer: 60, leo: 85, virgo: 70, libra: 90, scorpio: 75, sagittarius: 90, capricorn: 70, aquarius: 85, pisces: 80 },
  pisces: { aries: 70, taurus: 85, gemini: 75, cancer: 90, leo: 75, virgo: 85, libra: 80, scorpio: 95, sagittarius: 75, capricorn: 85, aquarius: 80, pisces: 85 }
};

// 根据出生日期获取星座
export function getZodiacSign(birthDate: string): ZodiacSign | null {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // 星座日期判断逻辑
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return zodiacSigns.find(s => s.id === 'aries') || null;
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return zodiacSigns.find(s => s.id === 'taurus') || null;
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return zodiacSigns.find(s => s.id === 'gemini') || null;
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return zodiacSigns.find(s => s.id === 'cancer') || null;
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return zodiacSigns.find(s => s.id === 'leo') || null;
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return zodiacSigns.find(s => s.id === 'virgo') || null;
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return zodiacSigns.find(s => s.id === 'libra') || null;
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return zodiacSigns.find(s => s.id === 'scorpio') || null;
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return zodiacSigns.find(s => s.id === 'sagittarius') || null;
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return zodiacSigns.find(s => s.id === 'capricorn') || null;
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return zodiacSigns.find(s => s.id === 'aquarius') || null;
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return zodiacSigns.find(s => s.id === 'pisces') || null;
  
  return null;
}

// 计算星座配对得分
export function calculateCompatibility(sign1: string, sign2: string): number {
  return compatibilityMatrix[sign1]?.[sign2] || 50;
}

// 生成每日运势
export function generateDailyHoroscope(sign: ZodiacSign): string {
  const aspects = ['有利', '一般', '需注意'];
  const areas = ['爱情', '事业', '财运', '健康', '学习'];
  
  const randomAspect = () => aspects[Math.floor(Math.random() * aspects.length)];
  const randomArea = () => areas[Math.floor(Math.random() * areas.length)];
  
  return `🌟 ${sign.name}今日运势\n\n` +
    `整体运势：${randomAspect()}\n` +
    `重点关注：${randomArea()}运势表现突出\n` +
    `幸运数字：${sign.luckyNumbers[Math.floor(Math.random() * sign.luckyNumbers.length)]}\n` +
    `幸运颜色：${sign.luckyColors[Math.floor(Math.random() * sign.luckyColors.length)]}\n\n` +
    `今日建议：发挥${sign.strengths[0]}的优势，注意避免${sign.weaknesses[0]}的倾向。`;
}

// 计算上升星座（简化版本，基于出生时间）
export function calculateAscendant(birthDate: string, birthTime: string, _birthPlace: string): ZodiacSign {
  // 简化的上升星座计算，实际应该基于精确的天文计算
  const time = new Date(`${birthDate}T${birthTime}`);
  const hour = time.getHours();
  
  // 根据出生时间粗略估算上升星座
  const ascendantIndex = Math.floor((hour * 2) % 12);
  return zodiacSigns[ascendantIndex];
}

// 计算月亮星座（简化版本）
export function calculateMoonSign(birthDate: string): ZodiacSign {
  // 简化的月亮星座计算
  const date = new Date(birthDate);
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const moonIndex = Math.floor((dayOfYear * 12 / 365) % 12);
  return zodiacSigns[moonIndex];
}

// 增强的天体位置计算
export function calculatePlanetaryPositions(birthDate: string, birthTime: string): any[] {
  const date = new Date(`${birthDate}T${birthTime}`);
  const daysSinceEpoch = Math.floor((date.getTime() - new Date('2000-01-01').getTime()) / (1000 * 60 * 60 * 24));
  
  return planets.map((planet, _index) => {
    // 基于行星周期的简化计算
    const cycleInDays = {
      'sun': 365.25,
      'moon': 27.3,
      'mercury': 88,
      'venus': 225,
      'mars': 687,
      'jupiter': 4333,
      'saturn': 10759,
      'uranus': 30687,
      'neptune': 60190,
      'pluto': 90560
    };
    
    const cycle = cycleInDays[planet.id as keyof typeof cycleInDays] || 365;
    const position = (daysSinceEpoch / cycle * 360) % 360;
    const signIndex = Math.floor(position / 30);
    const degree = Math.floor(position % 30);
    const houseIndex = Math.floor((position + (date.getHours() * 15)) / 30) % 12;
    
    return {
      ...planet,
      sign: zodiacSigns[signIndex],
      house: houses[houseIndex],
      degree: degree,
      position: Math.floor(position)
    };
  });
}

// 增强的相位计算
export function calculateDetailedAspects(planetaryPositions: any[]): any[] {
  const detailedAspects = [];
  
  for (let i = 0; i < planetaryPositions.length; i++) {
    for (let j = i + 1; j < planetaryPositions.length; j++) {
      const planet1 = planetaryPositions[i];
      const planet2 = planetaryPositions[j];
      const angleDiff = Math.abs(planet1.position - planet2.position);
      const normalizedAngle = Math.min(angleDiff, 360 - angleDiff);
      
      // 检查是否形成重要相位（容许度±8度）
      for (const aspect of aspects) {
        if (Math.abs(normalizedAngle - aspect.angle) <= 8) {
          detailedAspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            aspect: aspect,
            exactness: 8 - Math.abs(normalizedAngle - aspect.angle),
            strength: aspect.nature === 'harmonious' ? 'positive' : aspect.nature === 'challenging' ? 'tension' : 'neutral'
          });
          break;
        }
      }
    }
  }
  
  return detailedAspects.sort((a, b) => b.exactness - a.exactness).slice(0, 6);
}

// 生成完整的星盘分析
export function generateBirthChart(birthDate: string, birthTime: string, birthPlace: string) {
  const sunSign = getZodiacSign(birthDate);
  const moonSign = calculateMoonSign(birthDate);
  const ascendant = calculateAscendant(birthDate, birthTime, birthPlace);
  
  if (!sunSign) return null;
  
  // 计算精确的行星位置
  const activePlanets = calculatePlanetaryPositions(birthDate, birthTime);
  
  // 计算详细相位
  const currentAspects = calculateDetailedAspects(activePlanets);
  
  // 计算宫位强度
  const houseStrengths = houses.map(house => {
    const planetsInHouse = activePlanets.filter(planet => planet.house && planet.house.id === house.id);
    return {
      ...house,
      planetCount: planetsInHouse.length,
      planets: planetsInHouse.map(p => p.name),
      strength: planetsInHouse.length > 0 ? 'active' : 'passive'
    };
  });
  
  // 计算元素分布
  const elementDistribution = {
    '火象': activePlanets.filter(p => p.sign && p.sign.element === '火象').length,
    '土象': activePlanets.filter(p => p.sign && p.sign.element === '土象').length,
    '风象': activePlanets.filter(p => p.sign && p.sign.element === '风象').length,
    '水象': activePlanets.filter(p => p.sign && p.sign.element === '水象').length
  };
  
  // 计算性质分布
  const qualityDistribution = {
    '基本宫': activePlanets.filter(p => p.sign && p.sign.quality === '基本宫').length,
    '固定宫': activePlanets.filter(p => p.sign && p.sign.quality === '固定宫').length,
    '变动宫': activePlanets.filter(p => p.sign && p.sign.quality === '变动宫').length
  };
  
  return {
    sunSign,
    moonSign,
    ascendant,
    activePlanets,
    currentAspects,
    houseStrengths,
    elementDistribution,
    qualityDistribution,
    dominantElement: Object.keys(elementDistribution).reduce((a, b) => 
      elementDistribution[a as keyof typeof elementDistribution] > elementDistribution[b as keyof typeof elementDistribution] ? a : b
    ),
    dominantQuality: Object.keys(qualityDistribution).reduce((a, b) => 
      qualityDistribution[a as keyof typeof qualityDistribution] > qualityDistribution[b as keyof typeof qualityDistribution] ? a : b
    )
  };
}

// 生成星座兼容性详细分析
export function generateDetailedCompatibility(sign1: ZodiacSign, sign2: ZodiacSign) {
  const baseScore = calculateCompatibility(sign1.id, sign2.id);
  
  // 元素兼容性
  const elementCompatibility = {
    '火象': { '火象': 85, '土象': 65, '风象': 90, '水象': 55 },
    '土象': { '火象': 65, '土象': 80, '风象': 60, '水象': 85 },
    '风象': { '火象': 90, '土象': 60, '风象': 85, '水象': 70 },
    '水象': { '火象': 55, '土象': 85, '风象': 70, '水象': 90 }
  };
  
  const elementScore = elementCompatibility[sign1.element as keyof typeof elementCompatibility][sign2.element as keyof typeof elementCompatibility[keyof typeof elementCompatibility]];
  
  // 性质兼容性
  const qualityCompatibility = {
    '基本宫': { '基本宫': 70, '固定宫': 60, '变动宫': 85 },
    '固定宫': { '基本宫': 60, '固定宫': 75, '变动宫': 80 },
    '变动宫': { '基本宫': 85, '固定宫': 80, '变动宫': 70 }
  };
  
  const qualityScore = qualityCompatibility[sign1.quality as keyof typeof qualityCompatibility][sign2.quality as keyof typeof qualityCompatibility[keyof typeof qualityCompatibility]];
  
  // 综合评分
  const finalScore = Math.round((baseScore + elementScore + qualityScore) / 3);
  
  return {
    overallScore: finalScore,
    elementScore,
    qualityScore,
    strengths: getCompatibilityStrengths(sign1, sign2),
    challenges: getCompatibilityChallenges(sign1, sign2),
    advice: getCompatibilityAdvice(sign1, sign2)
  };
}

// 获取兼容性优势
function getCompatibilityStrengths(sign1: ZodiacSign, sign2: ZodiacSign): string[] {
  const commonTraits = sign1.strengths.filter(trait => sign2.strengths.includes(trait));
  const complementaryTraits = [];
  
  if (sign1.element === '火象' && sign2.element === '风象') {
    complementaryTraits.push('激情与智慧的完美结合');
  }
  if (sign1.element === '土象' && sign2.element === '水象') {
    complementaryTraits.push('稳定与感性的和谐统一');
  }
  
  return [...commonTraits.slice(0, 2), ...complementaryTraits];
}

// 获取兼容性挑战
function getCompatibilityChallenges(sign1: ZodiacSign, sign2: ZodiacSign): string[] {
  const conflictingTraits = [];
  
  if (sign1.element === '火象' && sign2.element === '水象') {
    conflictingTraits.push('火与水的天然对立需要平衡');
  }
  if (sign1.element === '土象' && sign2.element === '风象') {
    conflictingTraits.push('实用主义与理想主义的差异');
  }
  
  return conflictingTraits;
}

// 获取兼容性建议
function getCompatibilityAdvice(sign1: ZodiacSign, sign2: ZodiacSign): string[] {
  const advice = [];
  
  advice.push(`${sign1.name}应该欣赏${sign2.name}的${sign2.strengths[0]}`);
  advice.push(`${sign2.name}可以学习${sign1.name}的${sign1.strengths[0]}`);
  advice.push('保持开放的沟通，尊重彼此的差异');
  
  return advice;
}