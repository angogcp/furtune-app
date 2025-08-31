// 完整的78张塔罗牌数据
export interface TarotCard {
  id: string;
  name: string;
  meaning: string;
  reversedMeaning: string;
  category: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  number?: number;
  keywords: string[];
  description: string;
  element?: string;
  zodiac?: string;
  planet?: string;
}

// 22张大阿卡纳
export const majorArcana: TarotCard[] = [
  {
    id: 'fool',
    name: '愚者',
    meaning: '新的开始、冒险精神、纯真、自发性',
    reversedMeaning: '鲁莽、缺乏方向、愚蠢的决定',
    category: 'major',
    keywords: ['新开始', '冒险', '纯真', '自由'],
    description: '愚者代表着人生旅程的开始，象征着纯真的心灵和无限的可能性。',
    element: '风',
    planet: '天王星'
  },
  {
    id: 'magician',
    name: '魔术师',
    meaning: '创造力、意志力、技能、专注',
    reversedMeaning: '操控、欺骗、缺乏技能',
    category: 'major',
    keywords: ['创造', '意志', '技能', '专注'],
    description: '魔术师拥有将想法转化为现实的能力，代表着创造力和意志力的完美结合。',
    element: '风',
    planet: '水星'
  },
  {
    id: 'high_priestess',
    name: '女教皇',
    meaning: '直觉、神秘、内在智慧、潜意识',
    reversedMeaning: '缺乏直觉、表面化、忽视内心声音',
    category: 'major',
    keywords: ['直觉', '神秘', '智慧', '潜意识'],
    description: '女教皇是智慧和直觉的守护者，她连接着意识与潜意识的桥梁。',
    element: '水',
    planet: '月亮'
  },
  {
    id: 'empress',
    name: '皇后',
    meaning: '丰饶、母性、创造、自然',
    reversedMeaning: '依赖、缺乏成长、创造力受阻',
    category: 'major',
    keywords: ['丰饶', '母性', '创造', '自然'],
    description: '皇后象征着大地母亲的力量，代表着生命的创造和滋养。',
    element: '土',
    planet: '金星'
  },
  {
    id: 'emperor',
    name: '皇帝',
    meaning: '权威、稳定、领导力、结构',
    reversedMeaning: '专制、缺乏纪律、滥用权力',
    category: 'major',
    keywords: ['权威', '稳定', '领导', '结构'],
    description: '皇帝代表着世俗的权威和秩序，是稳定和领导力的象征。',
    element: '火',
    zodiac: '白羊座'
  },
  {
    id: 'hierophant',
    name: '教皇',
    meaning: '传统、精神指导、学习、宗教',
    reversedMeaning: '反叛、非传统、个人信仰',
    category: 'major',
    keywords: ['传统', '指导', '学习', '宗教'],
    description: '教皇是精神导师，代表着传统智慧和宗教教导的传承。',
    element: '土',
    zodiac: '金牛座'
  },
  {
    id: 'lovers',
    name: '恋人',
    meaning: '爱情、选择、和谐、关系',
    reversedMeaning: '不和谐、错误选择、关系问题',
    category: 'major',
    keywords: ['爱情', '选择', '和谐', '关系'],
    description: '恋人牌代表着爱情和重要的人生选择，象征着心灵的结合。',
    element: '风',
    zodiac: '双子座'
  },
  {
    id: 'chariot',
    name: '战车',
    meaning: '胜利、意志力、控制、决心',
    reversedMeaning: '缺乏控制、失败、方向不明',
    category: 'major',
    keywords: ['胜利', '意志', '控制', '决心'],
    description: '战车象征着通过意志力和决心获得的胜利，代表着前进的动力。',
    element: '水',
    zodiac: '巨蟹座'
  },
  {
    id: 'strength',
    name: '力量',
    meaning: '勇气、耐心、内在力量、温柔',
    reversedMeaning: '软弱、缺乏勇气、滥用力量',
    category: 'major',
    keywords: ['勇气', '耐心', '力量', '温柔'],
    description: '力量牌展现的不是蛮力，而是内在的勇气和温柔的坚持。',
    element: '火',
    zodiac: '狮子座'
  },
  {
    id: 'hermit',
    name: '隐者',
    meaning: '内省、寻找、智慧、指引',
    reversedMeaning: '孤立、拒绝帮助、迷失方向',
    category: 'major',
    keywords: ['内省', '寻找', '智慧', '指引'],
    description: '隐者手持明灯，在黑暗中寻找真理，代表着内在的智慧和指引。',
    element: '土',
    zodiac: '处女座'
  },
  {
    id: 'wheel_of_fortune',
    name: '命运之轮',
    meaning: '变化、机遇、命运转折、循环',
    reversedMeaning: '厄运、缺乏控制、恶性循环',
    category: 'major',
    keywords: ['变化', '机遇', '命运', '循环'],
    description: '命运之轮永不停息地转动，提醒我们生命中的变化和机遇。',
    element: '火',
    planet: '木星'
  },
  {
    id: 'justice',
    name: '正义',
    meaning: '公平、平衡、因果报应、真相',
    reversedMeaning: '不公、偏见、逃避责任',
    category: 'major',
    keywords: ['公平', '平衡', '因果', '真相'],
    description: '正义女神手持天平和宝剑，象征着公正的判断和平衡。',
    element: '风',
    zodiac: '天秤座'
  },
  {
    id: 'hanged_man',
    name: '倒吊人',
    meaning: '牺牲、等待、换个角度、顿悟',
    reversedMeaning: '无谓牺牲、拖延、抗拒改变',
    category: 'major',
    keywords: ['牺牲', '等待', '角度', '顿悟'],
    description: '倒吊人以不同的视角看世界，通过牺牲获得更深的理解。',
    element: '水',
    planet: '海王星'
  },
  {
    id: 'death',
    name: '死神',
    meaning: '结束、转变、重生、释放',
    reversedMeaning: '抗拒改变、停滞、恐惧',
    category: 'major',
    keywords: ['结束', '转变', '重生', '释放'],
    description: '死神并非真正的死亡，而是旧事物的结束和新生命的开始。',
    element: '水',
    zodiac: '天蝎座'
  },
  {
    id: 'temperance',
    name: '节制',
    meaning: '平衡、调和、耐心、中庸',
    reversedMeaning: '不平衡、过度、缺乏耐心',
    category: 'major',
    keywords: ['平衡', '调和', '耐心', '中庸'],
    description: '节制天使在两个杯子间倒水，象征着生命中的平衡与和谐。',
    element: '火',
    zodiac: '射手座'
  },
  {
    id: 'devil',
    name: '恶魔',
    meaning: '诱惑、束缚、物欲、依赖',
    reversedMeaning: '解脱、觉醒、打破束缚',
    category: 'major',
    keywords: ['诱惑', '束缚', '物欲', '依赖'],
    description: '恶魔代表着内心的阴暗面和物质的诱惑，提醒我们要警惕束缚。',
    element: '土',
    zodiac: '摩羯座'
  },
  {
    id: 'tower',
    name: '塔',
    meaning: '突变、破坏、启示、解放',
    reversedMeaning: '逃避变化、内在动荡、延迟的灾难',
    category: 'major',
    keywords: ['突变', '破坏', '启示', '解放'],
    description: '高塔被闪电击中，象征着突然的变化和旧结构的崩塌。',
    element: '火',
    planet: '火星'
  },
  {
    id: 'star',
    name: '星星',
    meaning: '希望、灵感、指引、治愈',
    reversedMeaning: '失望、缺乏信心、迷失方向',
    category: 'major',
    keywords: ['希望', '灵感', '指引', '治愈'],
    description: '星星在黑夜中闪耀，为迷失的人们带来希望和指引。',
    element: '风',
    zodiac: '水瓶座'
  },
  {
    id: 'moon',
    name: '月亮',
    meaning: '幻象、潜意识、不确定、直觉',
    reversedMeaning: '恐惧消散、真相显现、克服幻象',
    category: 'major',
    keywords: ['幻象', '潜意识', '不确定', '直觉'],
    description: '月亮照亮了夜晚的道路，但也带来了幻象和不确定性。',
    element: '水',
    zodiac: '双鱼座'
  },
  {
    id: 'sun',
    name: '太阳',
    meaning: '成功、快乐、活力、启蒙',
    reversedMeaning: '过度自信、延迟的成功、缺乏活力',
    category: 'major',
    keywords: ['成功', '快乐', '活力', '启蒙'],
    description: '太阳带来光明和温暖，象征着成功、快乐和生命的活力。',
    element: '火',
    planet: '太阳'
  },
  {
    id: 'judgement',
    name: '审判',
    meaning: '觉醒、重生、宽恕、召唤',
    reversedMeaning: '自我怀疑、逃避责任、缺乏宽恕',
    category: 'major',
    keywords: ['觉醒', '重生', '宽恕', '召唤'],
    description: '天使的号角声唤醒沉睡的灵魂，象征着精神的觉醒和重生。',
    element: '火',
    planet: '冥王星'
  },
  {
    id: 'world',
    name: '世界',
    meaning: '完成、成就、圆满、整合',
    reversedMeaning: '未完成、缺乏成就感、延迟',
    category: 'major',
    keywords: ['完成', '成就', '圆满', '整合'],
    description: '世界牌代表着旅程的完成和目标的达成，是圆满的象征。',
    element: '土',
    planet: '土星'
  }
];

// 56张小阿卡纳
// 权杖牌组（火元素）
export const wands: TarotCard[] = [
  {
    id: 'ace_of_wands',
    name: '权杖王牌',
    meaning: '新的开始、创造力、灵感、潜力',
    reversedMeaning: '缺乏方向、延迟的开始、创造力受阻',
    category: 'minor',
    suit: 'wands',
    number: 1,
    keywords: ['新开始', '创造', '灵感', '潜力'],
    description: '权杖王牌象征着新项目的开始和创造力的爆发。',
    element: '火'
  },
  {
    id: 'two_of_wands',
    name: '权杖二',
    meaning: '规划、个人力量、未来计划、进展',
    reversedMeaning: '缺乏规划、恐惧未知、个人目标不明',
    category: 'minor',
    suit: 'wands',
    number: 2,
    keywords: ['规划', '力量', '计划', '进展'],
    description: '权杖二代表着对未来的规划和个人力量的展现。',
    element: '火'
  },
  {
    id: 'three_of_wands',
    name: '权杖三',
    meaning: '扩展、远见、领导力、贸易',
    reversedMeaning: '缺乏远见、延迟、个人挫折',
    category: 'minor',
    suit: 'wands',
    number: 3,
    keywords: ['扩展', '远见', '领导', '贸易'],
    description: '权杖三象征着事业的扩展和远大的视野。',
    element: '火'
  },
  {
    id: 'four_of_wands',
    name: '权杖四',
    meaning: '庆祝、和谐、家庭、成就',
    reversedMeaning: '家庭不和、缺乏支持、不稳定',
    category: 'minor',
    suit: 'wands',
    number: 4,
    keywords: ['庆祝', '和谐', '家庭', '成就'],
    description: '权杖四代表着庆祝成功和家庭和谐。',
    element: '火'
  },
  {
    id: 'five_of_wands',
    name: '权杖五',
    meaning: '竞争、冲突、挑战、多样性',
    reversedMeaning: '避免冲突、内在冲突、缺乏多样性',
    category: 'minor',
    suit: 'wands',
    number: 5,
    keywords: ['竞争', '冲突', '挑战', '多样性'],
    description: '权杖五象征着竞争和挑战，需要找到合作的方式。',
    element: '火'
  },
  {
    id: 'six_of_wands',
    name: '权杖六',
    meaning: '胜利、公众认可、进步、自信',
    reversedMeaning: '私人成就、自我怀疑、缺乏认可',
    category: 'minor',
    suit: 'wands',
    number: 6,
    keywords: ['胜利', '认可', '进步', '自信'],
    description: '权杖六代表着公众的认可和胜利的喜悦。',
    element: '火'
  },
  {
    id: 'seven_of_wands',
    name: '权杖七',
    meaning: '防御、挑战、毅力、竞争',
    reversedMeaning: '屈服压力、缺乏信心、避免挑战',
    category: 'minor',
    suit: 'wands',
    number: 7,
    keywords: ['防御', '挑战', '毅力', '竞争'],
    description: '权杖七象征着面对挑战时的坚持和防御。',
    element: '火'
  },
  {
    id: 'eight_of_wands',
    name: '权杖八',
    meaning: '快速行动、进展、消息、旅行',
    reversedMeaning: '延迟、挫折、缺乏进展',
    category: 'minor',
    suit: 'wands',
    number: 8,
    keywords: ['快速', '行动', '进展', '消息'],
    description: '权杖八代表着快速的进展和积极的变化。',
    element: '火'
  },
  {
    id: 'nine_of_wands',
    name: '权杖九',
    meaning: '坚持、韧性、最后的努力、防备',
    reversedMeaning: '放弃、缺乏韧性、偏执',
    category: 'minor',
    suit: 'wands',
    number: 9,
    keywords: ['坚持', '韧性', '努力', '防备'],
    description: '权杖九象征着在困难中的坚持和最后的努力。',
    element: '火'
  },
  {
    id: 'ten_of_wands',
    name: '权杖十',
    meaning: '负担、责任、努力工作、成就',
    reversedMeaning: '释放负担、委派、寻求帮助',
    category: 'minor',
    suit: 'wands',
    number: 10,
    keywords: ['负担', '责任', '工作', '成就'],
    description: '权杖十代表着承担重责和努力工作的成果。',
    element: '火'
  },
  {
    id: 'page_of_wands',
    name: '权杖侍者',
    meaning: '热情、冒险、自由精神、消息',
    reversedMeaning: '缺乏方向、鲁莽、坏消息',
    category: 'minor',
    suit: 'wands',
    keywords: ['热情', '冒险', '自由', '消息'],
    description: '权杖侍者充满热情和冒险精神，带来新的机会。',
    element: '火'
  },
  {
    id: 'knight_of_wands',
    name: '权杖骑士',
    meaning: '行动、冲动、冒险、能量',
    reversedMeaning: '鲁莽、缺乏耐心、冲动行事',
    category: 'minor',
    suit: 'wands',
    keywords: ['行动', '冲动', '冒险', '能量'],
    description: '权杖骑士充满行动力，但需要控制冲动。',
    element: '火'
  },
  {
    id: 'queen_of_wands',
    name: '权杖皇后',
    meaning: '自信、独立、热情、决心',
    reversedMeaning: '自私、报复、缺乏自信',
    category: 'minor',
    suit: 'wands',
    keywords: ['自信', '独立', '热情', '决心'],
    description: '权杖皇后自信独立，以热情和决心领导他人。',
    element: '火'
  },
  {
    id: 'king_of_wands',
    name: '权杖国王',
    meaning: '领导力、愿景、企业家精神、荣誉',
    reversedMeaning: '专制、缺乏耐心、滥用权力',
    category: 'minor',
    suit: 'wands',
    keywords: ['领导', '愿景', '企业家', '荣誉'],
    description: '权杖国王是天生的领导者，具有远大的愿景。',
    element: '火'
  }
];

// 圣杯牌组（水元素）
export const cups: TarotCard[] = [
  {
    id: 'ace_of_cups',
    name: '圣杯王牌',
    meaning: '新的爱情、情感开始、直觉、精神觉醒',
    reversedMeaning: '情感封闭、缺乏爱、精神空虚',
    category: 'minor',
    suit: 'cups',
    number: 1,
    keywords: ['爱情', '情感', '直觉', '觉醒'],
    description: '圣杯王牌象征着新的情感开始和精神的觉醒。',
    element: '水'
  },
  {
    id: 'two_of_cups',
    name: '圣杯二',
    meaning: '伙伴关系、爱情、相互吸引、统一',
    reversedMeaning: '关系不平衡、缺乏和谐、分离',
    category: 'minor',
    suit: 'cups',
    number: 2,
    keywords: ['伙伴', '爱情', '吸引', '统一'],
    description: '圣杯二代表着深刻的情感连接和伙伴关系。',
    element: '水'
  },
  {
    id: 'three_of_cups',
    name: '圣杯三',
    meaning: '友谊、庆祝、创造力、社区',
    reversedMeaning: '孤立、缺乏创造力、社交问题',
    category: 'minor',
    suit: 'cups',
    number: 3,
    keywords: ['友谊', '庆祝', '创造', '社区'],
    description: '圣杯三象征着友谊的庆祝和创造性的合作。',
    element: '水'
  },
  {
    id: 'four_of_cups',
    name: '圣杯四',
    meaning: '冥想、沉思、重新评估、无聊',
    reversedMeaning: '动机、新机会、重新参与',
    category: 'minor',
    suit: 'cups',
    number: 4,
    keywords: ['冥想', '沉思', '评估', '无聊'],
    description: '圣杯四代表着内省和对现状的重新评估。',
    element: '水'
  },
  {
    id: 'five_of_cups',
    name: '圣杯五',
    meaning: '失望、悲伤、失去、遗憾',
    reversedMeaning: '接受、宽恕、从失去中恢复',
    category: 'minor',
    suit: 'cups',
    number: 5,
    keywords: ['失望', '悲伤', '失去', '遗憾'],
    description: '圣杯五象征着失望和悲伤，但也提醒希望仍在。',
    element: '水'
  },
  {
    id: 'six_of_cups',
    name: '圣杯六',
    meaning: '怀旧、童年、纯真、重聚',
    reversedMeaning: '活在过去、缺乏成长、失去纯真',
    category: 'minor',
    suit: 'cups',
    number: 6,
    keywords: ['怀旧', '童年', '纯真', '重聚'],
    description: '圣杯六代表着对过去美好时光的怀念。',
    element: '水'
  },
  {
    id: 'seven_of_cups',
    name: '圣杯七',
    meaning: '选择、幻想、愿望、困惑',
    reversedMeaning: '缺乏选择、现实、决心',
    category: 'minor',
    suit: 'cups',
    number: 7,
    keywords: ['选择', '幻想', '愿望', '困惑'],
    description: '圣杯七象征着面对多种选择时的困惑。',
    element: '水'
  },
  {
    id: 'eight_of_cups',
    name: '圣杯八',
    meaning: '放弃、寻找、精神追求、失望',
    reversedMeaning: '恐惧改变、避免、停滞',
    category: 'minor',
    suit: 'cups',
    number: 8,
    keywords: ['放弃', '寻找', '追求', '失望'],
    description: '圣杯八代表着放弃现状去寻找更深层的意义。',
    element: '水'
  },
  {
    id: 'nine_of_cups',
    name: '圣杯九',
    meaning: '满足、愿望成真、快乐、成功',
    reversedMeaning: '不满足、贪婪、物质主义',
    category: 'minor',
    suit: 'cups',
    number: 9,
    keywords: ['满足', '愿望', '快乐', '成功'],
    description: '圣杯九是愿望牌，象征着心愿的实现。',
    element: '水'
  },
  {
    id: 'ten_of_cups',
    name: '圣杯十',
    meaning: '家庭幸福、情感满足、和谐、快乐',
    reversedMeaning: '家庭不和、缺乏和谐、破碎的关系',
    category: 'minor',
    suit: 'cups',
    number: 10,
    keywords: ['家庭', '幸福', '满足', '和谐'],
    description: '圣杯十代表着家庭的幸福和情感的圆满。',
    element: '水'
  },
  {
    id: 'page_of_cups',
    name: '圣杯侍者',
    meaning: '创造性消息、直觉、艺术才能、敏感',
    reversedMeaning: '情感不成熟、创造力受阻、坏消息',
    category: 'minor',
    suit: 'cups',
    keywords: ['创造', '消息', '直觉', '艺术'],
    description: '圣杯侍者带来创造性的灵感和直觉的消息。',
    element: '水'
  },
  {
    id: 'knight_of_cups',
    name: '圣杯骑士',
    meaning: '浪漫、魅力、想象力、情感',
    reversedMeaning: '情绪化、不现实、缺乏目标',
    category: 'minor',
    suit: 'cups',
    keywords: ['浪漫', '魅力', '想象', '情感'],
    description: '圣杯骑士充满浪漫情怀和艺术气质。',
    element: '水'
  },
  {
    id: 'queen_of_cups',
    name: '圣杯皇后',
    meaning: '同情心、直觉、情感成熟、治愈',
    reversedMeaning: '情感依赖、缺乏界限、情绪不稳',
    category: 'minor',
    suit: 'cups',
    keywords: ['同情', '直觉', '成熟', '治愈'],
    description: '圣杯皇后具有深刻的同情心和治愈能力。',
    element: '水'
  },
  {
    id: 'king_of_cups',
    name: '圣杯国王',
    meaning: '情感平衡、同情心、外交、冷静',
    reversedMeaning: '情感操控、情绪不稳、缺乏同情',
    category: 'minor',
    suit: 'cups',
    keywords: ['平衡', '同情', '外交', '冷静'],
    description: '圣杯国王在情感上成熟稳重，善于外交。',
    element: '水'
  }
];

// 宝剑牌组（风元素）
export const swords: TarotCard[] = [
  {
    id: 'ace_of_swords',
    name: '宝剑王牌',
    meaning: '新想法、心智清晰、突破、真相',
    reversedMeaning: '困惑、缺乏清晰度、错误信息',
    category: 'minor',
    suit: 'swords',
    number: 1,
    keywords: ['想法', '清晰', '突破', '真相'],
    description: '宝剑王牌象征着新想法的诞生和心智的清晰。',
    element: '风'
  },
  {
    id: 'two_of_swords',
    name: '宝剑二',
    meaning: '困难决定、僵局、平衡、和平',
    reversedMeaning: '困惑、信息过载、犹豫不决',
    category: 'minor',
    suit: 'swords',
    number: 2,
    keywords: ['决定', '僵局', '平衡', '和平'],
    description: '宝剑二代表着面临困难决定时的平衡状态。',
    element: '风'
  },
  {
    id: 'three_of_swords',
    name: '宝剑三',
    meaning: '心碎、悲伤、背叛、分离',
    reversedMeaning: '治愈、宽恕、从痛苦中恢复',
    category: 'minor',
    suit: 'swords',
    number: 3,
    keywords: ['心碎', '悲伤', '背叛', '分离'],
    description: '宝剑三象征着心灵的创伤和情感的痛苦。',
    element: '风'
  },
  {
    id: 'four_of_swords',
    name: '宝剑四',
    meaning: '休息、冥想、恢复、和平',
    reversedMeaning: '不安、缺乏休息、精神疲惫',
    category: 'minor',
    suit: 'swords',
    number: 4,
    keywords: ['休息', '冥想', '恢复', '和平'],
    description: '宝剑四代表着休息和精神的恢复。',
    element: '风'
  },
  {
    id: 'five_of_swords',
    name: '宝剑五',
    meaning: '冲突、失败、背叛、自私',
    reversedMeaning: '和解、宽恕、从冲突中学习',
    category: 'minor',
    suit: 'swords',
    number: 5,
    keywords: ['冲突', '失败', '背叛', '自私'],
    description: '宝剑五象征着冲突和不光彩的胜利。',
    element: '风'
  },
  {
    id: 'six_of_swords',
    name: '宝剑六',
    meaning: '过渡、旅行、向前移动、恢复',
    reversedMeaning: '抗拒改变、无法前进、困在过去',
    category: 'minor',
    suit: 'swords',
    number: 6,
    keywords: ['过渡', '旅行', '移动', '恢复'],
    description: '宝剑六代表着从困难中走出，向更好的未来前进。',
    element: '风'
  },
  {
    id: 'seven_of_swords',
    name: '宝剑七',
    meaning: '欺骗、策略、逃避、独立行动',
    reversedMeaning: '坦诚、团队合作、寻求帮助',
    category: 'minor',
    suit: 'swords',
    number: 7,
    keywords: ['欺骗', '策略', '逃避', '独立'],
    description: '宝剑七象征着策略性的行动，但要小心欺骗。',
    element: '风'
  },
  {
    id: 'eight_of_swords',
    name: '宝剑八',
    meaning: '限制、陷阱、受害者心态、无力感',
    reversedMeaning: '自由、自我接受、新视角',
    category: 'minor',
    suit: 'swords',
    number: 8,
    keywords: ['限制', '陷阱', '受害者', '无力'],
    description: '宝剑八代表着自我限制和受害者心态。',
    element: '风'
  },
  {
    id: 'nine_of_swords',
    name: '宝剑九',
    meaning: '焦虑、噩梦、恐惧、绝望',
    reversedMeaning: '希望、治愈、面对恐惧',
    category: 'minor',
    suit: 'swords',
    number: 9,
    keywords: ['焦虑', '噩梦', '恐惧', '绝望'],
    description: '宝剑九象征着深度的焦虑和内心的恐惧。',
    element: '风'
  },
  {
    id: 'ten_of_swords',
    name: '宝剑十',
    meaning: '背叛、痛苦结束、失败、底线',
    reversedMeaning: '恢复、重生、从失败中学习',
    category: 'minor',
    suit: 'swords',
    number: 10,
    keywords: ['背叛', '结束', '失败', '底线'],
    description: '宝剑十代表着痛苦的结束和新开始的可能。',
    element: '风'
  },
  {
    id: 'page_of_swords',
    name: '宝剑侍者',
    meaning: '好奇心、警觉、新想法、监视',
    reversedMeaning: '缺乏计划、间谍活动、谎言',
    category: 'minor',
    suit: 'swords',
    keywords: ['好奇', '警觉', '想法', '监视'],
    description: '宝剑侍者充满好奇心，善于观察和学习。',
    element: '风'
  },
  {
    id: 'knight_of_swords',
    name: '宝剑骑士',
    meaning: '行动、冲动、勇敢、直接',
    reversedMeaning: '鲁莽、缺乏方向、冲动行事',
    category: 'minor',
    suit: 'swords',
    keywords: ['行动', '冲动', '勇敢', '直接'],
    description: '宝剑骑士行动迅速，但有时过于冲动。',
    element: '风'
  },
  {
    id: 'queen_of_swords',
    name: '宝剑皇后',
    meaning: '独立、直接沟通、清晰思维、诚实',
    reversedMeaning: '冷酷、报复、缺乏同情心',
    category: 'minor',
    suit: 'swords',
    keywords: ['独立', '沟通', '清晰', '诚实'],
    description: '宝剑皇后思维清晰，沟通直接而诚实。',
    element: '风'
  },
  {
    id: 'king_of_swords',
    name: '宝剑国王',
    meaning: '权威、理性、真相、清晰',
    reversedMeaning: '专制、缺乏同情、滥用权力',
    category: 'minor',
    suit: 'swords',
    keywords: ['权威', '理性', '真相', '清晰'],
    description: '宝剑国王是理性的权威，追求真相和正义。',
    element: '风'
  }
];

// 星币牌组（土元素）
export const pentacles: TarotCard[] = [
  {
    id: 'ace_of_pentacles',
    name: '星币王牌',
    meaning: '新机会、繁荣、物质开始、潜力',
    reversedMeaning: '失去机会、缺乏规划、贪婪',
    category: 'minor',
    suit: 'pentacles',
    number: 1,
    keywords: ['机会', '繁荣', '物质', '潜力'],
    description: '星币王牌象征着新的物质机会和繁荣的开始。',
    element: '土'
  },
  {
    id: 'two_of_pentacles',
    name: '星币二',
    meaning: '平衡、适应性、时间管理、灵活性',
    reversedMeaning: '失去平衡、过度承诺、混乱',
    category: 'minor',
    suit: 'pentacles',
    number: 2,
    keywords: ['平衡', '适应', '管理', '灵活'],
    description: '星币二代表着在多重责任中保持平衡。',
    element: '土'
  },
  {
    id: 'three_of_pentacles',
    name: '星币三',
    meaning: '团队合作、学习、实施、建设',
    reversedMeaning: '缺乏团队合作、技能不足、延迟',
    category: 'minor',
    suit: 'pentacles',
    number: 3,
    keywords: ['团队', '学习', '实施', '建设'],
    description: '星币三象征着通过团队合作实现目标。',
    element: '土'
  },
  {
    id: 'four_of_pentacles',
    name: '星币四',
    meaning: '安全、控制、节约、占有',
    reversedMeaning: '慷慨、分享、失去控制',
    category: 'minor',
    suit: 'pentacles',
    number: 4,
    keywords: ['安全', '控制', '节约', '占有'],
    description: '星币四代表着对安全和控制的需求。',
    element: '土'
  },
  {
    id: 'five_of_pentacles',
    name: '星币五',
    meaning: '贫困、孤立、担忧、困难',
    reversedMeaning: '恢复、改善、寻求帮助',
    category: 'minor',
    suit: 'pentacles',
    number: 5,
    keywords: ['贫困', '孤立', '担忧', '困难'],
    description: '星币五象征着物质上的困难和孤立感。',
    element: '土'
  },
  {
    id: 'six_of_pentacles',
    name: '星币六',
    meaning: '慷慨、分享、互惠、慈善',
    reversedMeaning: '自私、债务、不平等交换',
    category: 'minor',
    suit: 'pentacles',
    number: 6,
    keywords: ['慷慨', '分享', '互惠', '慈善'],
    description: '星币六代表着慷慨的给予和接受。',
    element: '土'
  },
  {
    id: 'seven_of_pentacles',
    name: '星币七',
    meaning: '投资、耐心、长期视野、评估',
    reversedMeaning: '缺乏耐心、短期思维、投资失败',
    category: 'minor',
    suit: 'pentacles',
    number: 7,
    keywords: ['投资', '耐心', '视野', '评估'],
    description: '星币七象征着对长期投资的耐心等待。',
    element: '土'
  },
  {
    id: 'eight_of_pentacles',
    name: '星币八',
    meaning: '技能发展、勤奋、专注、学徒',
    reversedMeaning: '缺乏专注、技能不足、完美主义',
    category: 'minor',
    suit: 'pentacles',
    number: 8,
    keywords: ['技能', '勤奋', '专注', '学徒'],
    description: '星币八代表着通过勤奋工作发展技能。',
    element: '土'
  },
  {
    id: 'nine_of_pentacles',
    name: '星币九',
    meaning: '独立、奢华、自给自足、成就',
    reversedMeaning: '过度工作、缺乏独立、物质主义',
    category: 'minor',
    suit: 'pentacles',
    number: 9,
    keywords: ['独立', '奢华', '自足', '成就'],
    description: '星币九象征着通过努力获得的独立和成就。',
    element: '土'
  },
  {
    id: 'ten_of_pentacles',
    name: '星币十',
    meaning: '财富、家族、传承、安全',
    reversedMeaning: '财务损失、家族问题、缺乏传承',
    category: 'minor',
    suit: 'pentacles',
    number: 10,
    keywords: ['财富', '家族', '传承', '安全'],
    description: '星币十代表着家族财富和长期的安全。',
    element: '土'
  },
  {
    id: 'page_of_pentacles',
    name: '星币侍者',
    meaning: '学习、新机会、实用性、计划',
    reversedMeaning: '缺乏进展、不切实际、拖延',
    category: 'minor',
    suit: 'pentacles',
    keywords: ['学习', '机会', '实用', '计划'],
    description: '星币侍者带来学习和新机会的消息。',
    element: '土'
  },
  {
    id: 'knight_of_pentacles',
    name: '星币骑士',
    meaning: '勤奋、可靠、耐心、保守',
    reversedMeaning: '懒惰、不可靠、停滞不前',
    category: 'minor',
    suit: 'pentacles',
    keywords: ['勤奋', '可靠', '耐心', '保守'],
    description: '星币骑士勤奋可靠，但有时过于保守。',
    element: '土'
  },
  {
    id: 'queen_of_pentacles',
    name: '星币皇后',
    meaning: '实用、慷慨、安全、母性',
    reversedMeaning: '自私、嫉妒、不信任',
    category: 'minor',
    suit: 'pentacles',
    keywords: ['实用', '慷慨', '安全', '母性'],
    description: '星币皇后实用慷慨，具有强烈的母性关怀。',
    element: '土'
  },
  {
    id: 'king_of_pentacles',
    name: '星币国王',
    meaning: '财务成功、领导力、安全、慷慨',
    reversedMeaning: '贪婪、物质主义、财务不稳',
    category: 'minor',
    suit: 'pentacles',
    keywords: ['成功', '领导', '安全', '慷慨'],
    description: '星币国王在财务上成功，是可靠的领导者。',
    element: '土'
  }
];

// 合并所有塔罗牌
export const allTarotCards: TarotCard[] = [
  ...majorArcana,
  ...wands,
  ...cups,
  ...swords,
  ...pentacles
];

// 塔罗牌阵布局
export interface TarotSpread {
  id: string;
  name: string;
  description: string;
  positions: {
    id: string;
    name: string;
    meaning: string;
    x: number;
    y: number;
  }[];
  cardCount: number;
}

export const tarotSpreads: TarotSpread[] = [
  {
    id: 'single_card',
    name: '单牌占卜',
    description: '最简单的占卜方式，适合日常指引',
    cardCount: 1,
    positions: [
      { id: 'main', name: '核心信息', meaning: '当前情况的核心信息和指引', x: 50, y: 50 }
    ]
  },
  {
    id: 'three_card',
    name: '三牌阵',
    description: '经典的过去-现在-未来布局',
    cardCount: 3,
    positions: [
      { id: 'past', name: '过去', meaning: '影响当前情况的过去因素', x: 20, y: 50 },
      { id: 'present', name: '现在', meaning: '当前的状况和挑战', x: 50, y: 50 },
      { id: 'future', name: '未来', meaning: '可能的发展方向', x: 80, y: 50 }
    ]
  },
  {
    id: 'cross_spread',
    name: '十字牌阵',
    description: '深入分析问题的各个方面',
    cardCount: 5,
    positions: [
      { id: 'situation', name: '当前情况', meaning: '问题的核心状况', x: 50, y: 50 },
      { id: 'challenge', name: '挑战', meaning: '需要面对的挑战', x: 50, y: 20 },
      { id: 'past', name: '过去影响', meaning: '来自过去的影响', x: 20, y: 50 },
      { id: 'future', name: '未来可能', meaning: '可能的未来发展', x: 80, y: 50 },
      { id: 'advice', name: '建议', meaning: '行动建议和指引', x: 50, y: 80 }
    ]
  },
  {
    id: 'celtic_cross',
    name: '凯尔特十字',
    description: '最经典的塔罗牌阵，提供全面深入的分析',
    cardCount: 10,
    positions: [
      { id: 'present', name: '现在', meaning: '当前的情况', x: 40, y: 50 },
      { id: 'challenge', name: '挑战', meaning: '横跨的挑战或机会', x: 40, y: 50 },
      { id: 'distant_past', name: '远因', meaning: '遥远过去的影响', x: 40, y: 80 },
      { id: 'recent_past', name: '近因', meaning: '最近过去的影响', x: 20, y: 50 },
      { id: 'possible_outcome', name: '可能结果', meaning: '可能的结果', x: 40, y: 20 },
      { id: 'near_future', name: '近期未来', meaning: '近期的发展', x: 60, y: 50 },
      { id: 'your_approach', name: '你的方法', meaning: '你的态度和方法', x: 80, y: 80 },
      { id: 'external_influences', name: '外在影响', meaning: '外在环境的影响', x: 80, y: 60 },
      { id: 'hopes_fears', name: '希望恐惧', meaning: '内心的希望和恐惧', x: 80, y: 40 },
      { id: 'final_outcome', name: '最终结果', meaning: '最终的结果', x: 80, y: 20 }
    ]
  }
];

// 导出默认的22张大阿卡纳（保持向后兼容）
export const tarotCards = majorArcana;