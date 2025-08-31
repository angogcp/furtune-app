// 数字命理完整数据系统

// 生命数字含义
export interface LifeNumber {
  number: number;
  name: string;
  meaning: string;
  personality: string[];
  strengths: string[];
  weaknesses: string[];
  career: string[];
  love: string[];
  health: string[];
  luckyColors: string[];
  luckyStones: string[];
  compatibleNumbers: number[];
  keywords: string[];
}

export const lifeNumbers: LifeNumber[] = [
  {
    number: 1,
    name: '领导者',
    meaning: '独立、创新、领导力',
    personality: ['独立自主', '创新思维', '天生领导', '目标明确', '意志坚强'],
    strengths: ['开拓精神', '决断力强', '自信勇敢', '创造力丰富', '执行力强'],
    weaknesses: ['过于自我', '缺乏耐心', '固执己见', '不善合作', '压力过大'],
    career: ['企业家', '领导者', '创业者', '发明家', '艺术家'],
    love: ['需要独立空间', '喜欢主导关系', '忠诚专一', '保护欲强', '需要理解支持'],
    health: ['注意心脏健康', '避免过度劳累', '保持规律作息', '适度运动', '管理压力'],
    luckyColors: ['红色', '橙色', '金色'],
    luckyStones: ['红宝石', '石榴石', '黄水晶'],
    compatibleNumbers: [3, 5, 6, 9],
    keywords: ['领导', '独立', '创新', '开拓', '自信']
  },
  {
    number: 2,
    name: '合作者',
    meaning: '合作、平衡、和谐',
    personality: ['善于合作', '追求和谐', '敏感细腻', '善解人意', '外交手腕'],
    strengths: ['团队精神', '协调能力', '耐心细致', '直觉敏锐', '善于倾听'],
    weaknesses: ['缺乏自信', '过于依赖', '优柔寡断', '情绪化', '避免冲突'],
    career: ['外交官', '咨询师', '教师', '护士', '艺术家'],
    love: ['重视感情', '需要安全感', '善于体贴', '容易受伤', '渴望稳定'],
    health: ['注意神经系统', '避免情绪波动', '保持心理平衡', '适度社交', '规律生活'],
    luckyColors: ['蓝色', '绿色', '银色'],
    luckyStones: ['月光石', '珍珠', '翡翠'],
    compatibleNumbers: [1, 4, 6, 8],
    keywords: ['合作', '和谐', '平衡', '敏感', '外交']
  },
  {
    number: 3,
    name: '创造者',
    meaning: '创造、表达、沟通',
    personality: ['创造力强', '表达能力佳', '乐观开朗', '社交活跃', '想象力丰富'],
    strengths: ['艺术天赋', '沟通能力', '幽默风趣', '适应力强', '灵感丰富'],
    weaknesses: ['三心二意', '缺乏专注', '情绪起伏', '不够实际', '容易分散'],
    career: ['艺术家', '作家', '演员', '设计师', '媒体工作者'],
    love: ['浪漫多情', '需要表达', '喜欢新鲜感', '善于沟通', '情感丰富'],
    health: ['注意呼吸系统', '保持情绪稳定', '适度运动', '充足睡眠', '营养均衡'],
    luckyColors: ['黄色', '橙色', '紫色'],
    luckyStones: ['黄水晶', '紫水晶', '琥珀'],
    compatibleNumbers: [1, 5, 6, 9],
    keywords: ['创造', '表达', '沟通', '艺术', '乐观']
  },
  {
    number: 4,
    name: '建设者',
    meaning: '稳定、实用、勤奋',
    personality: ['踏实稳重', '勤奋努力', '注重细节', '有条不紊', '责任心强'],
    strengths: ['组织能力', '执行力强', '可靠稳定', '逻辑思维', '持之以恒'],
    weaknesses: ['过于保守', '缺乏灵活', '固执刻板', '压力过大', '不善变通'],
    career: ['工程师', '建筑师', '会计师', '管理者', '技术专家'],
    love: ['忠诚可靠', '重视承诺', '需要安全感', '表达含蓄', '长久关系'],
    health: ['注意骨骼健康', '避免过度劳累', '保持运动习惯', '注意饮食', '放松身心'],
    luckyColors: ['绿色', '棕色', '土色'],
    luckyStones: ['绿松石', '玛瑙', '碧玉'],
    compatibleNumbers: [2, 6, 7, 8],
    keywords: ['稳定', '实用', '勤奋', '组织', '可靠']
  },
  {
    number: 5,
    name: '自由者',
    meaning: '自由、冒险、变化',
    personality: ['热爱自由', '喜欢冒险', '适应力强', '好奇心重', '多才多艺'],
    strengths: ['灵活变通', '学习能力强', '社交广泛', '勇于尝试', '思维敏捷'],
    weaknesses: ['缺乏耐心', '不够专注', '容易厌倦', '不负责任', '情绪多变'],
    career: ['旅行家', '销售员', '记者', '翻译', '自由职业者'],
    love: ['需要自由空间', '喜欢新鲜感', '魅力十足', '不喜束缚', '多元化感情'],
    health: ['注意神经系统', '避免过度刺激', '保持规律', '适度运动', '平衡生活'],
    luckyColors: ['蓝色', '银色', '白色'],
    luckyStones: ['蓝宝石', '水晶', '海蓝宝'],
    compatibleNumbers: [1, 3, 7, 9],
    keywords: ['自由', '冒险', '变化', '灵活', '多才']
  },
  {
    number: 6,
    name: '关爱者',
    meaning: '责任、关爱、服务',
    personality: ['富有爱心', '责任感强', '善于照顾', '追求和谐', '家庭观念重'],
    strengths: ['同情心强', '治愈能力', '艺术天赋', '忠诚可靠', '服务精神'],
    weaknesses: ['过度付出', '缺乏界限', '容易焦虑', '完美主义', '自我牺牲'],
    career: ['医生', '护士', '教师', '社工', '艺术家'],
    love: ['重视家庭', '深情专一', '善于照顾', '需要被需要', '长久关系'],
    health: ['注意心理健康', '避免过度操劳', '保持情绪平衡', '适度休息', '营养充足'],
    luckyColors: ['粉色', '绿色', '蓝色'],
    luckyStones: ['玫瑰石英', '绿松石', '珍珠'],
    compatibleNumbers: [1, 2, 3, 4, 8, 9],
    keywords: ['关爱', '责任', '服务', '和谐', '治愈']
  },
  {
    number: 7,
    name: '探索者',
    meaning: '智慧、直觉、灵性',
    personality: ['深度思考', '直觉敏锐', '追求真理', '独立思考', '神秘主义'],
    strengths: ['分析能力强', '直觉准确', '智慧深邃', '独立自主', '精神追求'],
    weaknesses: ['过于内向', '难以理解', '情感疏离', '完美主义', '孤独倾向'],
    career: ['研究员', '哲学家', '心理学家', '占星师', '作家'],
    love: ['需要精神共鸣', '深度交流', '忠诚专一', '理想主义', '精神恋爱'],
    health: ['注意精神健康', '避免过度思考', '保持社交', '适度运动', '冥想放松'],
    luckyColors: ['紫色', '深蓝色', '白色'],
    luckyStones: ['紫水晶', '蓝宝石', '月光石'],
    compatibleNumbers: [4, 5, 9],
    keywords: ['智慧', '直觉', '灵性', '探索', '深度']
  },
  {
    number: 8,
    name: '成就者',
    meaning: '成功、权力、物质',
    personality: ['雄心勃勃', '商业头脑', '组织能力强', '追求成功', '权威感强'],
    strengths: ['领导才能', '商业敏感', '组织能力', '目标导向', '执行力强'],
    weaknesses: ['过于功利', '工作狂', '忽视感情', '压力过大', '控制欲强'],
    career: ['企业家', '银行家', '律师', '政治家', '高管'],
    love: ['事业优先', '需要理解', '忠诚可靠', '保护欲强', '物质保障'],
    health: ['注意心血管', '避免过度劳累', '管理压力', '规律作息', '适度放松'],
    luckyColors: ['黑色', '深蓝色', '金色'],
    luckyStones: ['黑曜石', '蓝宝石', '黄水晶'],
    compatibleNumbers: [2, 4, 6],
    keywords: ['成功', '权力', '物质', '组织', '成就']
  },
  {
    number: 9,
    name: '完成者',
    meaning: '完成、奉献、普世',
    personality: ['博爱精神', '理想主义', '艺术天赋', '同情心强', '追求完美'],
    strengths: ['包容性强', '艺术天赋', '直觉敏锐', '理想主义', '奉献精神'],
    weaknesses: ['过于理想', '情绪化', '缺乏实际', '容易受伤', '完美主义'],
    career: ['艺术家', '慈善家', '教师', '治疗师', '人道主义者'],
    love: ['博爱精神', '理想主义', '深情专一', '需要理解', '精神交流'],
    health: ['注意情绪健康', '避免过度付出', '保持平衡', '适度运动', '精神寄托'],
    luckyColors: ['金色', '紫色', '白色'],
    luckyStones: ['黄水晶', '紫水晶', '钻石'],
    compatibleNumbers: [1, 3, 5, 6, 7],
    keywords: ['完成', '奉献', '博爱', '理想', '艺术']
  },
  // 主数字 11
  {
    number: 11,
    name: '直觉大师',
    meaning: '拥有强大的直觉力和精神洞察力，是天生的精神导师和启发者',
    personality: ['直觉敏锐', '精神层次高', '富有灵感', '理想主义', '敏感细腻'],
    strengths: ['超强直觉', '精神领导力', '创造灵感', '洞察人心', '艺术天赋'],
    weaknesses: ['过于敏感', '情绪波动', '不切实际', '神经紧张', '完美主义'],
    career: ['心理咨询师', '艺术家', '作家', '精神导师', '治疗师', '占卜师'],
    love: ['需要精神共鸣', '情感深刻', '理想化爱情', '需要理解', '灵魂伴侣'],
    health: ['注意神经系统', '避免过度刺激', '冥想放松', '规律作息', '情绪管理'],
    luckyColors: ['白色', '银色', '淡蓝色', '紫色'],
    luckyStones: ['月光石', '紫水晶', '白水晶', '拉长石'],
    compatibleNumbers: [2, 6, 9, 22],
    keywords: ['直觉', '灵性', '启发', '理想', '洞察']
  },
  // 主数字 22
  {
    number: 22,
    name: '建筑大师',
    meaning: '将理想转化为现实的能力，是物质与精神世界的桥梁建造者',
    personality: ['实用理想主义', '组织能力强', '有远见', '务实', '领导才能'],
    strengths: ['实现理想', '组织管理', '建设能力', '远见卓识', '影响力'],
    weaknesses: ['压力过大', '期望过高', '固执己见', '工作狂', '忽视细节'],
    career: ['建筑师', '工程师', '企业家', '政治家', '项目经理', '城市规划师'],
    love: ['需要支持理解', '事业为重', '稳定关系', '共同目标', '长期承诺'],
    health: ['注意心血管', '避免过劳', '定期体检', '压力管理', '平衡工作'],
    luckyColors: ['深蓝色', '棕色', '金色', '绿色'],
    luckyStones: ['蓝宝石', '虎眼石', '黄水晶', '绿松石'],
    compatibleNumbers: [4, 6, 8, 11],
    keywords: ['建设', '实现', '组织', '远见', '影响']
  },
  // 主数字 33
  {
    number: 33,
    name: '慈悲导师',
    meaning: '具有无条件的爱和奉献精神，是人类的精神导师和治愈者',
    personality: ['慈悲为怀', '无私奉献', '治愈能力', '精神导师', '博爱精神'],
    strengths: ['治愈他人', '精神指导', '无私奉献', '慈悲心肠', '智慧深邃'],
    weaknesses: ['自我牺牲', '承担过多', '情感负担', '忽视自己', '理想化'],
    career: ['治疗师', '教师', '慈善工作', '精神导师', '医生', '社会工作者'],
    love: ['无条件的爱', '奉献精神', '治愈伴侣', '精神连接', '深度关怀'],
    health: ['情绪平衡', '避免过度付出', '自我关爱', '定期休息', '精神滋养'],
    luckyColors: ['金色', '白色', '粉色', '淡绿色'],
    luckyStones: ['钻石', '粉晶', '绿幽灵', '白玉'],
    compatibleNumbers: [6, 9, 11, 22],
    keywords: ['慈悲', '治愈', '奉献', '导师', '博爱']
  }
];

// 幸运元素推荐系统
export interface LuckyElements {
  colors: string[];
  stones: string[];
  numbers: number[];
  directions: string[];
  times: string[];
  flowers: string[];
  metals: string[];
  foods: string[];
}

// 根据生命数字获取详细幸运元素
export function getLuckyElements(lifeNumber: number): LuckyElements {
  const baseInfo = getLifeNumberInfo(lifeNumber);
  if (!baseInfo) {
    return {
      colors: ['白色'],
      stones: ['水晶'],
      numbers: [1],
      directions: ['东方'],
      times: ['上午'],
      flowers: ['白玫瑰'],
      metals: ['银'],
      foods: ['清淡食物']
    };
  }

  const elementMap: { [key: number]: LuckyElements } = {
    1: {
      colors: ['红色', '橙色', '金色', '黄色'],
      stones: ['红宝石', '石榴石', '黄水晶', '琥珀'],
      numbers: [1, 10, 19, 28],
      directions: ['东方', '南方'],
      times: ['日出时分', '正午'],
      flowers: ['向日葵', '红玫瑰', '郁金香'],
      metals: ['金', '铜'],
      foods: ['辛辣食物', '坚果', '柑橘类']
    },
    2: {
      colors: ['银色', '白色', '淡蓝色', '粉色'],
      stones: ['月光石', '珍珠', '蛋白石', '粉晶'],
      numbers: [2, 11, 20, 29],
      directions: ['西方', '北方'],
      times: ['黄昏', '夜晚'],
      flowers: ['百合', '茉莉', '白玫瑰'],
      metals: ['银', '白金'],
      foods: ['乳制品', '海鲜', '温和食物']
    },
    3: {
      colors: ['黄色', '橙色', '紫色', '粉色'],
      stones: ['黄水晶', '紫水晶', '托帕石', '粉晶'],
      numbers: [3, 12, 21, 30],
      directions: ['东南方', '西南方'],
      times: ['上午', '傍晚'],
      flowers: ['雏菊', '康乃馨', '紫罗兰'],
      metals: ['金', '铜'],
      foods: ['水果', '甜食', '色彩丰富的食物']
    },
    4: {
      colors: ['绿色', '棕色', '深蓝色', '灰色'],
      stones: ['翡翠', '虎眼石', '蓝宝石', '玛瑙'],
      numbers: [4, 13, 22, 31],
      directions: ['北方', '东北方'],
      times: ['清晨', '深夜'],
      flowers: ['常青藤', '仙人掌', '松树'],
      metals: ['铁', '钢'],
      foods: ['根茎类', '谷物', '绿色蔬菜']
    },
    5: {
      colors: ['蓝色', '银色', '白色', '彩虹色'],
      stones: ['蓝宝石', '水晶', '海蓝宝', '彩虹石'],
      numbers: [5, 14, 23, 32],
      directions: ['所有方向'],
      times: ['变化的时间'],
      flowers: ['薰衣草', '迷迭香', '野花'],
      metals: ['水银', '合金'],
      foods: ['多样化食物', '异国料理', '新鲜食材']
    },
    6: {
      colors: ['粉色', '绿色', '蓝色', '白色'],
      stones: ['粉晶', '绿松石', '蓝宝石', '珍珠'],
      numbers: [6, 15, 24, 33],
      directions: ['西南方', '东南方'],
      times: ['家庭时光', '温馨时刻'],
      flowers: ['玫瑰', '牡丹', '康乃馨'],
      metals: ['铜', '银'],
      foods: ['家常菜', '营养食品', '温暖食物']
    },
    7: {
      colors: ['紫色', '深蓝色', '银色', '白色'],
      stones: ['紫水晶', '拉长石', '月光石', '萤石'],
      numbers: [7, 16, 25, 34],
      directions: ['西北方', '东北方'],
      times: ['冥想时刻', '静谧时光'],
      flowers: ['紫罗兰', '薰衣草', '白莲'],
      metals: ['银', '白金'],
      foods: ['清淡食物', '有机食品', '纯净水']
    },
    8: {
      colors: ['黑色', '深蓝色', '金色', '棕色'],
      stones: ['黑曜石', '蓝宝石', '黄水晶', '虎眼石'],
      numbers: [8, 17, 26, 35],
      directions: ['西方', '西北方'],
      times: ['商务时间', '权威时刻'],
      flowers: ['兰花', '菊花', '松柏'],
      metals: ['金', '铂金'],
      foods: ['高蛋白食物', '精致料理', '补品']
    },
    9: {
      colors: ['红色', '金色', '橙色', '紫色'],
      stones: ['红宝石', '石榴石', '黄水晶', '紫水晶'],
      numbers: [9, 18, 27, 36],
      directions: ['南方', '西南方'],
      times: ['日落', '温暖时光'],
      flowers: ['红玫瑰', '向日葵', '菊花'],
      metals: ['金', '铜'],
      foods: ['温热食物', '香料食品', '红色食物']
    },
    11: {
      colors: ['白色', '银色', '淡蓝色', '紫色'],
      stones: ['月光石', '紫水晶', '白水晶', '拉长石'],
      numbers: [11, 29, 38, 47],
      directions: ['东方', '上方'],
      times: ['直觉时刻', '灵感时光'],
      flowers: ['白莲', '茉莉', '紫罗兰'],
      metals: ['银', '白金'],
      foods: ['纯净食物', '素食', '清淡饮食']
    },
    22: {
      colors: ['深蓝色', '棕色', '金色', '绿色'],
      stones: ['蓝宝石', '虎眼石', '黄水晶', '绿松石'],
      numbers: [22, 40, 49, 58],
      directions: ['北方', '东北方'],
      times: ['建设时光', '规划时刻'],
      flowers: ['橡树', '松树', '竹子'],
      metals: ['钢', '铁'],
      foods: ['营养丰富', '能量食品', '坚果']
    },
    33: {
      colors: ['金色', '白色', '粉色', '淡绿色'],
      stones: ['钻石', '粉晶', '绿幽灵', '白玉'],
      numbers: [33, 51, 60, 69],
      directions: ['中心', '四面八方'],
      times: ['奉献时刻', '治愈时光'],
      flowers: ['白玫瑰', '粉牡丹', '绿萝'],
      metals: ['金', '白金'],
      foods: ['治愈食品', '天然食材', '爱心料理']
    }
  };

  return elementMap[lifeNumber] || elementMap[1];
}

// 姓名数字学
export interface NameNumerology {
  letter: string;
  number: number;
  meaning: string;
  energy: string;
}

// 字母对应数字表（毕达哥拉斯系统）
export const letterNumbers: Record<string, number> = {
  'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
  'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
  'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
};

// 中文姓名笔画数字对应
export const chineseStrokes: Record<string, number> = {
  '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9,
  '十': 10, '人': 2, '大': 3, '小': 3, '中': 4, '王': 4, '李': 7, '张': 11,
  '刘': 15, '陈': 16, '杨': 13, '赵': 14, '黄': 12, '周': 8, '吴': 7, '徐': 10,
  '孙': 10, '胡': 9, '朱': 6, '高': 10, '林': 8, '何': 7, '郭': 15, '马': 10,
  '罗': 19, '梁': 11, '宋': 7, '郑': 19, '谢': 17, '韩': 17, '唐': 10, '冯': 12,
  '于': 3, '董': 15, '萧': 18, '程': 12, '曹': 11, '袁': 10, '邓': 19, '许': 11,
  '傅': 12, '沈': 8, '曾': 12, '彭': 12, '吕': 7, '苏': 22, '卢': 16, '蒋': 17,
  '蔡': 17, '贾': 13, '丁': 2, '魏': 18, '薛': 19, '叶': 15, '阎': 16, '余': 7,
  '潘': 16, '杜': 7, '戴': 18, '夏': 10, '钟': 17, '汪': 8, '田': 5, '任': 6,
  '姜': 9, '范': 15, '方': 4, '石': 5, '姚': 9, '谭': 19, '廖': 14, '邹': 17,
  '熊': 14, '金': 8, '陆': 16, '郝': 14, '孔': 4, '白': 5, '崔': 11, '康': 11,
  '毛': 4, '邱': 12, '秦': 10, '江': 7, '史': 5, '顾': 21, '侯': 9, '邵': 12,
  '孟': 8, '龙': 16, '万': 15, '段': 9, '漕': 14, '钱': 16, '汤': 13, '尹': 4,
  '黎': 15, '易': 8, '常': 11, '武': 8, '乔': 12, '贺': 12, '赖': 16, '龚': 22,
  '文': 4, '庞': 19, '樊': 15, '兰': 23, '殷': 10, '施': 9, '陶': 16, '洪': 10,
  '翟': 14, '安': 6, '颜': 18, '倪': 10, '严': 20, '牛': 4, '温': 13, '芦': 22,
  '季': 8, '俞': 9, '章': 11, '鲁': 15, '葛': 15, '伍': 6, '韦': 9, '申': 5,
  '尤': 4, '毕': 11, '聂': 18, '丛': 18, '焦': 12, '向': 6, '柳': 9, '邢': 11,
  '路': 13, '岳': 17, '齐': 14, '沿': 9, '梅': 11, '莫': 13, '庄': 13, '辛': 7,
  '管': 14, '祝': 10, '左': 5, '涂': 10, '谷': 15, '祁': 10, '时': 10, '舒': 12,
  '耿': 10, '牟': 6, '卜': 2, '詹': 13, '关': 19, '苗': 11, '凌': 10,
  '费': 12, '纪': 9, '靳': 13, '盛': 12, '童': 12, '欧': 15, '甄': 14, '项': 12,
  '曲': 6, '成': 7, '游': 13, '阳': 17, '裴': 14, '席': 10, '卫': 15, '查': 9,
  '屈': 8, '鲍': 19, '位': 7, '覃': 12, '霍': 16, '翁': 10, '隋': 13, '植': 12,
  '甘': 5, '景': 12, '薄': 17, '单': 12, '包': 5, '司': 5, '柏': 9, '宁': 14,
  '柯': 9, '阮': 12, '桂': 10, '闵': 12, '欧阳': 32, '太史': 17, '端木': 18,
  '上官': 11, '司马': 15, '东方': 12, '独孤': 17, '南宫': 18, '万俟': 23,
  '闻人': 23, '夏侯': 19, '诸葛': 26, '尉迟': 19, '公羊': 16, '赫连': 26,
  '澹台': 26, '皇甫': 14, '宗政': 17, '濮阳': 21, '公冶': 14, '太叔': 7,
  '申屠': 10, '公孙': 13, '慕容': 19, '仲孙': 14, '钟离': 27, '长孙': 12,
  '宇文': 10, '司徒': 17, '鲜于': 26, '司空': 12, '闾丘': 18, '子车': 10,
  '亓官': 17, '司寇': 16, '巫马': 13, '公西': 10, '颛孙': 25, '壤驷': 25,
  '公良': 12, '漆雕': 18, '乐正': 20, '宰父': 13, '谷梁': 18, '拓跋': 18,
  '夹谷': 18, '轩辕': 19, '令狐': 13, '段干': 15, '百里': 18, '呼延': 15,
  '东郭': 18, '南门': 15, '羊舌': 12, '微生': 17, '公户': 8, '公玉': 9,
  '公仪': 9, '梁丘': 18, '公仲': 8, '公上': 7, '公门': 12, '公山': 7,
  '公坚': 12, '左丘': 10, '公伯': 9, '西门': 15, '公祖': 14, '第五': 16,
  '公乘': 15, '贯丘': 18, '公皙': 17, '南荣': 23, '东里': 15, '东宫': 11,
  '仲长': 12, '子书': 14, '子桑': 13, '即墨': 18, '达奚': 19, '褚师': 20
};

// 计算生命数字（增强版）
export function calculateLifeNumber(birthDate: string): number {
  const date = new Date(birthDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // 将年月日相加
  let sum = year + month + day;
  
  // 保存原始总和用于主数字判断
  const originalSum = sum;
  
  // 数字根算法：不断相加直到得到单数或主数字
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    const digits = sum.toString().split('').map(Number);
    sum = digits.reduce((acc, digit) => acc + digit, 0);
  }
  
  // 检查是否为主数字（Master Numbers）
  if (originalSum === 11 || originalSum === 22 || originalSum === 33 || 
      originalSum === 44 || originalSum === 55) {
    return originalSum;
  }
  
  return sum;
}

// 计算表达数字（基于全名）
export function calculateExpressionNumber(fullName: string): number {
  const cleanName = fullName.toUpperCase().replace(/[^A-Z\u4e00-\u9fa5]/g, '');
  let sum = 0;
  
  for (const char of cleanName) {
    if (/[A-Z]/.test(char)) {
      sum += letterNumbers[char] || 0;
    } else if (/[\u4e00-\u9fa5]/.test(char)) {
      sum += chineseStrokes[char] || (char.charCodeAt(0) % 9 + 1);
    }
  }
  
  // 数字根算法
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    const digits = sum.toString().split('').map(Number);
    sum = digits.reduce((acc, digit) => acc + digit, 0);
  }
  
  return sum;
}

// 计算心灵数字（基于元音）
export function calculateSoulNumber(name: string): number {
  const vowels = 'AEIOU';
  const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '');
  let sum = 0;
  
  for (const letter of cleanName) {
    if (vowels.includes(letter)) {
      sum += letterNumbers[letter] || 0;
    }
  }
  
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    const digits = sum.toString().split('').map(Number);
    sum = digits.reduce((acc, digit) => acc + digit, 0);
  }
  
  return sum;
}

// 计算人格数字（基于辅音）
export function calculatePersonalityNumber(name: string): number {
  const vowels = 'AEIOU';
  const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '');
  let sum = 0;
  
  for (const letter of cleanName) {
    if (!vowels.includes(letter)) {
      sum += letterNumbers[letter] || 0;
    }
  }
  
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    const digits = sum.toString().split('').map(Number);
    sum = digits.reduce((acc, digit) => acc + digit, 0);
  }
  
  return sum;
}

// 计算姓名数字（英文）
export function calculateNameNumber(name: string): number {
  const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '');
  let sum = 0;
  
  for (const letter of cleanName) {
    sum += letterNumbers[letter] || 0;
  }
  
  // 数字根算法
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    const digits = sum.toString().split('').map(Number);
    sum = digits.reduce((acc, digit) => acc + digit, 0);
  }
  
  return sum;
}

// 计算中文姓名数字（基于笔画）
export function calculateChineseNameNumber(name: string): number {
  let sum = 0;
  
  for (const char of name) {
    // 如果字典中有该字，使用字典值，否则使用字符编码的简化计算
    if (chineseStrokes[char]) {
      sum += chineseStrokes[char];
    } else {
      // 简化计算：使用字符编码
      sum += char.charCodeAt(0) % 9 + 1;
    }
  }
  
  // 数字根算法
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    const digits = sum.toString().split('').map(Number);
    sum = digits.reduce((acc, digit) => acc + digit, 0);
  }
  
  return sum;
}

// 获取生命数字信息
export function getLifeNumberInfo(number: number): LifeNumber | null {
  return lifeNumbers.find(ln => ln.number === number) || null;
}

// 计算数字兼容性
export function calculateNumerologyCompatibility(number1: number, number2: number): number {
  const info1 = getLifeNumberInfo(number1);
  const info2 = getLifeNumberInfo(number2);
  
  if (!info1 || !info2) return 50;
  
  // 检查是否在兼容列表中
  const isCompatible1 = info1.compatibleNumbers.includes(number2);
  const isCompatible2 = info2.compatibleNumbers.includes(number1);
  
  if (isCompatible1 && isCompatible2) return 90;
  if (isCompatible1 || isCompatible2) return 75;
  
  // 基于数字特性计算兼容性
  const diff = Math.abs(number1 - number2);
  if (diff === 0) return 85; // 相同数字
  if (diff === 1 || diff === 8) return 70; // 相邻数字
  if (diff === 2 || diff === 7) return 65;
  if (diff === 3 || diff === 6) return 60;
  if (diff === 4 || diff === 5) return 55;
  
  return 50;
}

// 生成个人数字报告（增强版）
export function generatePersonalNumerologyReport(name: string, birthDate: string): string {
  const lifeNumber = calculateLifeNumber(birthDate);
  const expressionNumber = calculateExpressionNumber(name);
  const soulNumber = /^[a-zA-Z\s]+$/.test(name) ? calculateSoulNumber(name) : null;
  const personalityNumber = /^[a-zA-Z\s]+$/.test(name) ? calculatePersonalityNumber(name) : null;
  
  const lifeInfo = getLifeNumberInfo(lifeNumber);
  const expressionInfo = getLifeNumberInfo(expressionNumber);
  const luckyElements = getLuckyElements(lifeNumber);
  
  if (!lifeInfo || !expressionInfo) {
    return '无法生成数字报告，请检查输入信息。';
  }
  
  const compatibility = calculateNumerologyCompatibility(lifeNumber, expressionNumber);
  
  let report = `🔢 **个人数字命理完整报告**\n\n` +
    `👤 **基本信息**\n` +
    `姓名：${name}\n` +
    `出生日期：${birthDate}\n\n` +
    `🌟 **生命数字：${lifeNumber} - ${lifeInfo.name}**\n` +
    `核心含义：${lifeInfo.meaning}\n` +
    `性格特质：${lifeInfo.personality.join('、')}\n` +
    `天赋优势：${lifeInfo.strengths.join('、')}\n` +
    `需要注意：${lifeInfo.weaknesses.join('、')}\n\n` +
    `📝 **表达数字：${expressionNumber} - ${expressionInfo.name}**\n` +
    `表达能量：${expressionInfo.meaning}\n` +
    `外在表现：${expressionInfo.personality.slice(0, 3).join('、')}\n\n`;
  
  // 如果是英文名字，添加心灵数字和人格数字
  if (soulNumber && personalityNumber) {
    const soulInfo = getLifeNumberInfo(soulNumber);
    const personalityInfo = getLifeNumberInfo(personalityNumber);
    
    if (soulInfo && personalityInfo) {
      report += `💖 **心灵数字：${soulNumber} - ${soulInfo.name}**\n` +
        `内在渴望：${soulInfo.meaning}\n` +
        `心灵特质：${soulInfo.personality.slice(0, 3).join('、')}\n\n` +
        `🎭 **人格数字：${personalityNumber} - ${personalityInfo.name}**\n` +
        `外在印象：${personalityInfo.meaning}\n` +
        `他人眼中：${personalityInfo.personality.slice(0, 3).join('、')}\n\n`;
    }
  }
  
  report += `💫 **数字和谐度：${compatibility}%**\n` +
    `${compatibility >= 80 ? '您的姓名与生命数字非常和谐，能够很好地支持您的人生发展。' : 
      compatibility >= 60 ? '您的姓名与生命数字基本和谐，在某些方面可能需要平衡。' : 
      '您的姓名与生命数字存在一定冲突，建议在重要决策时多加考虑。'}\n\n` +
    `🎯 **事业发展**\n` +
    `适合领域：${lifeInfo.career.join('、')}\n` +
    `发展建议：发挥${lifeInfo.strengths[0]}的优势，注意平衡${lifeInfo.weaknesses[0]}的倾向\n\n` +
    `💕 **感情运势**\n` +
    `感情特点：${lifeInfo.love.join('、')}\n` +
    `兼容数字：${lifeInfo.compatibleNumbers.join('、')}\n\n` +
    `🏥 **健康提醒**\n` +
    `健康建议：${lifeInfo.health.join('、')}\n\n` +
    `🍀 **详细幸运元素**\n` +
    `幸运颜色：${luckyElements.colors.join('、')}\n` +
    `幸运宝石：${luckyElements.stones.join('、')}\n` +
    `幸运数字：${luckyElements.numbers.join('、')}\n` +
    `幸运方位：${luckyElements.directions.join('、')}\n` +
    `幸运时间：${luckyElements.times.join('、')}\n` +
    `幸运花卉：${luckyElements.flowers.join('、')}\n` +
    `幸运金属：${luckyElements.metals.join('、')}\n` +
    `幸运食物：${luckyElements.foods.join('、')}\n\n` +
    `✨ **核心关键词**\n` +
    `${lifeInfo.keywords.join('、')}\n\n` +
    `🌈 **个人成长建议**\n` +
    `根据您的数字组合，建议您在日常生活中多关注${lifeInfo.keywords[0]}和${expressionInfo.keywords[0]}的平衡。` +
    `通过发挥${lifeInfo.strengths[0]}的天赋，同时注意${lifeInfo.weaknesses[0]}的倾向，您将能够更好地实现人生目标。`;
  
  return report;
}

// 高级姓名分析
export interface NameAnalysis {
  totalStrokes: number;
  personalityNumber: number; // 人格数
  destinyNumber: number; // 天格数
  earthNumber: number; // 地格数
  externalNumber: number; // 外格数
  overallFortune: string;
  careerLuck: string;
  wealthLuck: string;
  loveLuck: string;
  healthLuck: string;
  luckyElements: {
    colors: string[];
    directions: string[];
    numbers: number[];
    stones: string[];
    metals: string[];
  };
}

// 计算高级姓名分析
export function calculateAdvancedNameAnalysis(surname: string, givenName: string): NameAnalysis {
  // 计算各部分笔画
  const surnameStrokes = surname.split('').reduce((sum, char) => sum + (chineseStrokes[char] || char.charCodeAt(0) % 9 + 1), 0);
  const givenNameStrokes = givenName.split('').reduce((sum, char) => sum + (chineseStrokes[char] || char.charCodeAt(0) % 9 + 1), 0);
  const totalStrokes = surnameStrokes + givenNameStrokes;
  
  // 五格计算
  const destinyNumber = surnameStrokes; // 天格
  const personalityNumber = surnameStrokes + (givenName.length > 0 ? (chineseStrokes[givenName[0]] || givenName.charCodeAt(0) % 9 + 1) : 0); // 人格
  const earthNumber = givenNameStrokes; // 地格
  const externalNumber = totalStrokes - personalityNumber; // 外格
  
  // 运势分析
  const fortuneScores = {
    overall: (personalityNumber + destinyNumber + earthNumber) % 100,
    career: (personalityNumber * 2 + destinyNumber) % 100,
    wealth: (earthNumber * 2 + externalNumber) % 100,
    love: (personalityNumber + earthNumber + externalNumber) % 100,
    health: (destinyNumber + earthNumber) % 100
  };
  
  const getFortuneLevel = (score: number): string => {
    if (score >= 80) return '极佳';
    if (score >= 70) return '很好';
    if (score >= 60) return '良好';
    if (score >= 50) return '一般';
    return '需要注意';
  };
  
  // 幸运元素计算
  const elementIndex = personalityNumber % 5;
  const elementSystems = [
    { // 金
      colors: ['白色', '银色', '金色'],
      directions: ['西方', '西北'],
      numbers: [4, 9],
      stones: ['白水晶', '银饰', '钻石'],
      metals: ['金', '银', '铂金']
    },
    { // 木
      colors: ['绿色', '青色', '蓝绿色'],
      directions: ['东方', '东南'],
      numbers: [3, 8],
      stones: ['翡翠', '绿松石', '孔雀石'],
      metals: ['铜', '青铜']
    },
    { // 水
      colors: ['黑色', '深蓝色', '灰色'],
      directions: ['北方'],
      numbers: [1, 6],
      stones: ['黑曜石', '蓝宝石', '海蓝宝'],
      metals: ['铁', '钢']
    },
    { // 火
      colors: ['红色', '橙色', '紫色'],
      directions: ['南方'],
      numbers: [2, 7],
      stones: ['红宝石', '石榴石', '红玛瑙'],
      metals: ['铜', '黄铜']
    },
    { // 土
      colors: ['黄色', '棕色', '土色'],
      directions: ['中央', '西南', '东北'],
      numbers: [5, 0],
      stones: ['黄水晶', '琥珀', '玛瑙'],
      metals: ['黄金', '铅']
    }
  ];
  
  return {
    totalStrokes,
    personalityNumber,
    destinyNumber,
    earthNumber,
    externalNumber,
    overallFortune: getFortuneLevel(fortuneScores.overall),
    careerLuck: getFortuneLevel(fortuneScores.career),
    wealthLuck: getFortuneLevel(fortuneScores.wealth),
    loveLuck: getFortuneLevel(fortuneScores.love),
    healthLuck: getFortuneLevel(fortuneScores.health),
    luckyElements: elementSystems[elementIndex]
  };
}

// 生成今日数字运势
export function generateDailyNumerologyFortune(lifeNumber: number): string {
  const info = getLifeNumberInfo(lifeNumber);
  if (!info) return '无法生成运势信息';
  
  const today = new Date();
  const dayNumber = today.getDate();
  const monthNumber = today.getMonth() + 1;
  const yearNumber = today.getFullYear();
  
  // 更精确的能量计算
  let energyNumber = (lifeNumber + dayNumber + monthNumber + (yearNumber % 9)) % 9;
  if (energyNumber === 0) energyNumber = 9;
  
  const energyLevels = ['低迷', '平静', '稳定', '上升', '活跃', '旺盛', '高涨', '巅峰', '爆发'];
  const energyLevel = energyLevels[energyNumber - 1];
  
  const aspects = ['感情运', '事业运', '财运', '健康运', '学习运', '人际运', '创意运'];
  const favorableAspect = aspects[energyNumber % aspects.length];
  
  // 时段运势
  const timeSlots: { [key: string]: number } = {
    morning: (energyNumber + 1) % 9 + 1,
    afternoon: (energyNumber + 3) % 9 + 1,
    evening: (energyNumber + 5) % 9 + 1
  };
  
  const bestTime = Object.entries(timeSlots).reduce((a, b) => timeSlots[a[0]] > timeSlots[b[0]] ? a : b)[0];
  const timeNames: { [key: string]: string } = { morning: '上午', afternoon: '下午', evening: '晚上' };
  
  // 生成个性化建议
  const personalizedAdvice = [
    `今日能量数字${energyNumber}与您的生命数字${lifeNumber}形成${energyNumber > lifeNumber ? '激励' : '稳定'}的组合`,
    `${timeNames[bestTime]}是您今日的黄金时段，重要事务安排在此时进行`,
    `佩戴${info.luckyColors[energyNumber % info.luckyColors.length]}色饰品能增强运势`,
    `${info.luckyStones[energyNumber % info.luckyStones.length]}是今日的护身石`,
    `发挥您${info.strengths[0]}的天赋，会在${favorableAspect}方面获得突破`
  ];
  
  const selectedAdvice = personalizedAdvice.sort(() => Math.random() - 0.5).slice(0, 3);
  
  return `🌟 今日数字能量：${energyLevel}（${energyNumber}/9）\n` +
    `🎯 重点运势：${favorableAspect}\n` +
    `⏰ 最佳时段：${timeNames[bestTime]}\n\n` +
    `💡 个性化建议：\n• ${selectedAdvice.join('\n• ')}\n\n` +
    `🔮 今日格言：${info.keywords[Math.floor(Math.random() * info.keywords.length)]}是您的力量源泉，保持${info.personality[0]}的心态，让数字的智慧指引您的每一步。`;
}

// 生成幸运元素推荐
export function generateLuckyElementsRecommendation(lifeNumber: number, nameAnalysis?: NameAnalysis): string {
  const info = getLifeNumberInfo(lifeNumber);
  if (!info) return '无法生成推荐';
  
  let recommendation = `🍀 **专属幸运元素推荐**\n\n`;
  
  // 基础幸运元素
  recommendation += `🎨 **幸运色彩**\n${info.luckyColors.map(color => `• ${color}：增强个人魅力和运势`).join('\n')}\n\n`;
  
  recommendation += `💎 **幸运宝石**\n${info.luckyStones.map(stone => `• ${stone}：提升能量场和保护力`).join('\n')}\n\n`;
  
  // 如果有姓名分析，添加五行元素
  if (nameAnalysis) {
    recommendation += `🌟 **五行幸运元素**（基于姓名分析）\n`;
    recommendation += `• 幸运色彩：${nameAnalysis.luckyElements.colors.join('、')}\n`;
    recommendation += `• 幸运方位：${nameAnalysis.luckyElements.directions.join('、')}\n`;
    recommendation += `• 幸运数字：${nameAnalysis.luckyElements.numbers.join('、')}\n`;
    recommendation += `• 幸运金属：${nameAnalysis.luckyElements.metals.join('、')}\n\n`;
  }
  
  // 兼容数字
  recommendation += `🔢 **兼容数字**\n生命数字${lifeNumber}与数字${info.compatibleNumbers.join('、')}最为和谐\n\n`;
  
  // 应用建议
  recommendation += `📋 **应用建议**\n`;
  recommendation += `• 居家装饰：选择${info.luckyColors[0]}色系的装饰品\n`;
  recommendation += `• 服饰搭配：重要场合穿戴${info.luckyColors[1] || info.luckyColors[0]}色服装\n`;
  recommendation += `• 随身物品：携带${info.luckyStones[0]}饰品或摆件\n`;
  recommendation += `• 数字选择：在电话号码、车牌等选择包含${info.compatibleNumbers[0]}的组合`;
  
  return recommendation;
}