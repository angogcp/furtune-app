// MBTI性格测试数据

// MBTI性格类型接口
export interface MBTIType {
  id: string;
  name: string;
  code: string;
  description: string;
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  careers: string[];
  relationships: string;
  growth: string;
  famous: string[];
  percentage: number; // 人群占比
}

// MBTI测试题目接口
export interface MBTIQuestion {
  id: string;
  question: string;
  options: {
    text: string;
    dimension: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
    score: number;
  }[];
}

// 16种MBTI性格类型
export const mbtiTypes: MBTIType[] = [
  {
    id: 'intj',
    name: '建筑师',
    code: 'INTJ',
    description: '富有想象力和战略性的思想家，一切皆在计划之中。',
    traits: ['独立', '果断', '有远见', '理性'],
    strengths: ['战略思维', '独立工作', '长远规划', '高标准'],
    weaknesses: ['过于批判', '缺乏耐心', '社交困难', '完美主义'],
    careers: ['科学家', '工程师', '建筑师', '战略顾问', '研究员'],
    relationships: '需要深度的智力连接，重视伴侣的独立性和能力。',
    growth: '学会更好地表达情感，培养耐心，接受他人的不完美。',
    famous: ['埃隆·马斯克', '史蒂夫·乔布斯', '牛顿'],
    percentage: 2.1
  },
  {
    id: 'intp',
    name: '思想家',
    code: 'INTP',
    description: '具有创新精神的发明家，对知识有着不可抑制的渴望。',
    traits: ['逻辑', '客观', '好奇', '灵活'],
    strengths: ['分析能力', '创新思维', '适应性强', '客观公正'],
    weaknesses: ['拖延', '不切实际', '缺乏动力', '社交焦虑'],
    careers: ['哲学家', '科学家', '数学家', '程序员', '研究员'],
    relationships: '需要智力刺激和个人空间，重视思想的交流。',
    growth: '提高执行力，学会管理时间，培养人际交往技巧。',
    famous: ['爱因斯坦', '达尔文', '比尔·盖茨'],
    percentage: 3.3
  },
  {
    id: 'entj',
    name: '指挥官',
    code: 'ENTJ',
    description: '大胆、富有想象力、意志强烈的领导者，总能找到或创造解决方法。',
    traits: ['领导力', '果断', '高效', '自信'],
    strengths: ['战略规划', '领导能力', '高效执行', '目标导向'],
    weaknesses: ['不耐烦', '过于直接', '缺乏同理心', '工作狂'],
    careers: ['CEO', '企业家', '律师', '投资银行家', '政治家'],
    relationships: '寻求能够挑战自己的伴侣，重视成长和成就。',
    growth: '培养耐心和同理心，学会倾听他人意见。',
    famous: ['史蒂夫·乔布斯', '拿破仑', '撒切尔夫人'],
    percentage: 1.8
  },
  {
    id: 'entp',
    name: '辩论家',
    code: 'ENTP',
    description: '聪明好奇的思想家，不会拒绝任何智力上的挑战。',
    traits: ['创新', '灵活', '热情', '机智'],
    strengths: ['创意思维', '适应能力', '沟通技巧', '学习能力'],
    weaknesses: ['缺乏专注', '不切实际', '争论成性', '缺乏耐心'],
    careers: ['企业家', '发明家', '记者', '心理学家', '营销专家'],
    relationships: '需要智力刺激和新鲜感，重视思想的碰撞。',
    growth: '提高专注力，学会坚持完成项目，培养耐心。',
    famous: ['托马斯·爱迪生', '沃尔特·迪士尼', '马克·吐温'],
    percentage: 2.0
  },
  {
    id: 'infj',
    name: '提倡者',
    code: 'INFJ',
    description: '安静而神秘，同时鼓舞人心且不知疲倦的理想主义者。',
    traits: ['理想主义', '有洞察力', '果断', '有创造力'],
    strengths: ['深度洞察', '创意思维', '坚定信念', '利他主义'],
    weaknesses: ['过于敏感', '完美主义', '容易倦怠', '难以放松'],
    careers: ['心理咨询师', '作家', '艺术家', '社会工作者', '教师'],
    relationships: '寻求深度的情感连接，重视价值观的一致性。',
    growth: '学会设定界限，接受不完美，关注自我照顾。',
    famous: ['甘地', '马丁·路德·金', '柏拉图'],
    percentage: 1.5
  },
  {
    id: 'infp',
    name: '调停者',
    code: 'INFP',
    description: '诗意、善良、利他的人，总是热切地为美好事业而努力。',
    traits: ['理想主义', '忠诚', '适应性强', '好奇'],
    strengths: ['创造力', '开放心态', '灵活性', '激情'],
    weaknesses: ['过于理想化', '难以批评', '缺乏实用性', '情绪化'],
    careers: ['作家', '心理学家', '艺术家', '社会工作者', '记者'],
    relationships: '重视真实性和深度，需要理解和支持。',
    growth: '学会面对现实，提高实用技能，管理情绪。',
    famous: ['莎士比亚', '约翰·列侬', 'J.K.罗琳'],
    percentage: 4.4
  },
  {
    id: 'enfj',
    name: '主人公',
    code: 'ENFJ',
    description: '富有魅力、鼓舞人心的领导者，有能力让听众全神贯注。',
    traits: ['有魅力', '利他', '敏感', '天生的领导者'],
    strengths: ['领导能力', '沟通技巧', '利他精神', '激励他人'],
    weaknesses: ['过于理想化', '过度敏感', '缺乏客观性', '难以做决定'],
    careers: ['教师', '政治家', '心理咨询师', '人力资源', '社会工作者'],
    relationships: '重视和谐与成长，善于支持伴侣的发展。',
    growth: '学会说不，关注自己的需求，培养客观性。',
    famous: ['奥普拉·温弗瑞', '奥巴马', '马丁·路德·金'],
    percentage: 2.5
  },
  {
    id: 'enfp',
    name: '竞选者',
    code: 'ENFP',
    description: '热情、有创造力、社交能力强的自由精神，总能找到理由微笑。',
    traits: ['热情', '创造力', '社交', '感知力强'],
    strengths: ['人际关系', '创新思维', '适应能力', '激励他人'],
    weaknesses: ['缺乏专注', '过度乐观', '缺乏实用性', '情绪波动'],
    careers: ['记者', '心理学家', '演员', '企业家', '社会工作者'],
    relationships: '需要自由和刺激，重视情感连接和成长。',
    growth: '提高专注力，学会管理时间，培养实用技能。',
    famous: ['罗宾·威廉姆斯', '威尔·史密斯', '昆汀·塔伦蒂诺'],
    percentage: 8.1
  },
  {
    id: 'istj',
    name: '物流师',
    code: 'ISTJ',
    description: '实用、注重事实的可靠性，值得信赖。',
    traits: ['可靠', '实用', '注重事实', '负责任'],
    strengths: ['组织能力', '可靠性', '实用性', '坚持不懈'],
    weaknesses: ['抗拒变化', '过于严肃', '缺乏灵活性', '难以表达情感'],
    careers: ['会计师', '律师', '医生', '工程师', '管理员'],
    relationships: '重视稳定和传统，需要时间建立信任。',
    growth: '学会适应变化，表达情感，保持开放心态。',
    famous: ['华盛顿', '沃伦·巴菲特', '安吉拉·默克尔'],
    percentage: 11.6
  },
  {
    id: 'isfj',
    name: '守护者',
    code: 'ISFJ',
    description: '非常专注、温暖的守护者，时刻准备保护爱着的人们。',
    traits: ['支持性', '可靠', '耐心', '想象力丰富'],
    strengths: ['支持他人', '可靠性', '观察力', '实用技能'],
    weaknesses: ['过度利他', '低估自己', '抗拒变化', '难以说不'],
    careers: ['护士', '教师', '社会工作者', '心理咨询师', '医生'],
    relationships: '重视和谐与支持，善于照顾他人的需求。',
    growth: '学会关注自己，设定界限，接受赞美。',
    famous: ['特蕾莎修女', '罗莎·帕克斯', '凯特·米德尔顿'],
    percentage: 13.8
  },
  {
    id: 'estj',
    name: '总经理',
    code: 'ESTJ',
    description: '出色的管理者，在管理事物或人员方面无与伦比。',
    traits: ['组织能力强', '实用', '逻辑', '果断'],
    strengths: ['领导能力', '组织技能', '实用性', '可靠性'],
    weaknesses: ['不灵活', '难以放松', '表达情感困难', '过于批判'],
    careers: ['管理者', '法官', '教师', '银行家', '政府官员'],
    relationships: '重视传统和稳定，需要明确的期望。',
    growth: '培养灵活性，学会表达情感，接受他人观点。',
    famous: ['希拉里·克林顿', '约翰·洛克菲勒', '林登·约翰逊'],
    percentage: 8.7
  },
  {
    id: 'esfj',
    name: '执政官',
    code: 'ESFJ',
    description: '极有同情心、受欢迎、总是热心帮助他人。',
    traits: ['热心', '负责任', '合作', '实用'],
    strengths: ['人际关系', '实用技能', '忠诚', '利他精神'],
    weaknesses: ['过于利他', '需要认可', '抗拒批评', '缺乏创新'],
    careers: ['护士', '教师', '社会工作者', '人力资源', '销售'],
    relationships: '重视和谐与支持，善于维护人际关系。',
    growth: '学会关注自己，接受批评，培养独立性。',
    famous: ['泰勒·斯威夫特', '休·杰克曼', '惠特尼·休斯顿'],
    percentage: 12.3
  },
  {
    id: 'istp',
    name: '鉴赏家',
    code: 'ISTP',
    description: '大胆而实际的实验家，擅长使用各种工具。',
    traits: ['实用', '灵活', '好奇', '私人'],
    strengths: ['实用技能', '适应能力', '冷静', '独立'],
    weaknesses: ['难以表达情感', '容易厌倦', '冒险倾向', '缺乏长期规划'],
    careers: ['工程师', '机械师', '飞行员', '外科医生', '运动员'],
    relationships: '需要个人空间，重视行动胜过言语。',
    growth: '学会表达情感，制定长期计划，培养耐心。',
    famous: ['克林特·伊斯特伍德', '布鲁斯·李', '史蒂夫·乔布斯'],
    percentage: 5.4
  },
  {
    id: 'isfp',
    name: '探险家',
    code: 'ISFP',
    description: '灵活、迷人的艺术家，时刻准备探索新的可能性。',
    traits: ['艺术性', '好奇', '灵活', '敏感'],
    strengths: ['创造力', '开放心态', '激情', '忠诚'],
    weaknesses: ['过于敏感', '缺乏长期规划', '难以批评', '压力敏感'],
    careers: ['艺术家', '音乐家', '心理学家', '兽医', '厨师'],
    relationships: '重视真实性和美感，需要理解和支持。',
    growth: '提高自信，学会处理批评，制定目标。',
    famous: ['迈克尔·杰克逊', '莫扎特', '玛丽莲·梦露'],
    percentage: 8.8
  },
  {
    id: 'estp',
    name: '企业家',
    code: 'ESTP',
    description: '聪明、精力充沛、善于感知的人，真正享受生活在边缘的感觉。',
    traits: ['精力充沛', '实用', '灵活', '感知力强'],
    strengths: ['适应能力', '实用技能', '社交能力', '乐观'],
    weaknesses: ['冲动', '缺乏长期规划', '容易厌倦', '敏感'],
    careers: ['销售', '企业家', '运动员', '演员', '警察'],
    relationships: '需要刺激和自由，重视当下的体验。',
    growth: '学会长期规划，培养耐心，考虑他人感受。',
    famous: ['唐纳德·特朗普', '欧内斯特·海明威', '麦当娜'],
    percentage: 4.3
  },
  {
    id: 'esfp',
    name: '娱乐家',
    code: 'ESFP',
    description: '自发的、精力充沛、热情的人——生活在他们周围从不无聊。',
    traits: ['热情', '友好', '自发', '灵活'],
    strengths: ['人际关系', '实用技能', '乐观', '适应能力'],
    weaknesses: ['缺乏长期规划', '容易分心', '敏感', '冲突回避'],
    careers: ['演员', '音乐家', '销售', '教师', '社会工作者'],
    relationships: '重视乐趣和和谐，善于支持他人。',
    growth: '学会长期规划，处理冲突，培养专注力。',
    famous: ['埃尔顿·约翰', '玛丽莲·梦露', '威尔·史密斯'],
    percentage: 8.5
  }
];

// MBTI测试题目（简化版，实际应该有更多题目）
export const mbtiQuestions: MBTIQuestion[] = [
  {
    id: 'q1',
    question: '在聚会中，你更倾向于：',
    options: [
      { text: '与很多人交谈，成为焦点', dimension: 'E', score: 2 },
      { text: '与少数几个人深入交谈', dimension: 'I', score: 2 }
    ]
  },
  {
    id: 'q2',
    question: '当学习新事物时，你更喜欢：',
    options: [
      { text: '从具体的例子和事实开始', dimension: 'S', score: 2 },
      { text: '从理论和概念开始', dimension: 'N', score: 2 }
    ]
  },
  {
    id: 'q3',
    question: '做决定时，你更依赖：',
    options: [
      { text: '逻辑分析和客观事实', dimension: 'T', score: 2 },
      { text: '个人价值观和他人感受', dimension: 'F', score: 2 }
    ]
  },
  {
    id: 'q4',
    question: '你更喜欢：',
    options: [
      { text: '制定详细计划并按计划执行', dimension: 'J', score: 2 },
      { text: '保持灵活性，随机应变', dimension: 'P', score: 2 }
    ]
  },
  {
    id: 'q5',
    question: '工作时，你更喜欢：',
    options: [
      { text: '在团队中协作', dimension: 'E', score: 1 },
      { text: '独立工作', dimension: 'I', score: 1 }
    ]
  },
  {
    id: 'q6',
    question: '你更关注：',
    options: [
      { text: '现实和当下的情况', dimension: 'S', score: 1 },
      { text: '未来的可能性和潜力', dimension: 'N', score: 1 }
    ]
  },
  {
    id: 'q7',
    question: '批评他人时，你更倾向于：',
    options: [
      { text: '直接指出问题所在', dimension: 'T', score: 1 },
      { text: '考虑对方的感受，委婉表达', dimension: 'F', score: 1 }
    ]
  },
  {
    id: 'q8',
    question: '面对截止日期，你通常：',
    options: [
      { text: '提前完成，避免最后时刻的压力', dimension: 'J', score: 1 },
      { text: '在压力下工作得更好，经常拖到最后', dimension: 'P', score: 1 }
    ]
  },
  {
    id: 'q9',
    question: '休息时，你更愿意：',
    options: [
      { text: '外出社交，参加活动', dimension: 'E', score: 1 },
      { text: '在家放松，享受安静时光', dimension: 'I', score: 1 }
    ]
  },
  {
    id: 'q10',
    question: '解决问题时，你更依赖：',
    options: [
      { text: '过往经验和已验证的方法', dimension: 'S', score: 1 },
      { text: '创新思维和新的可能性', dimension: 'N', score: 1 }
    ]
  }
];

// MBTI结果计算函数
export function calculateMBTIResult(answers: { [questionId: string]: number }): {
  type: MBTIType;
  scores: { E: number; I: number; S: number; N: number; T: number; F: number; J: number; P: number };
  confidence: number;
} {
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  
  // 计算各维度得分
  Object.entries(answers).forEach(([questionId, optionIndex]) => {
    const question = mbtiQuestions.find(q => q.id === questionId);
    if (question && question.options[optionIndex]) {
      const option = question.options[optionIndex];
      scores[option.dimension] += option.score;
    }
  });
  
  // 确定性格类型
  const typeCode = 
    (scores.E > scores.I ? 'E' : 'I') +
    (scores.S > scores.N ? 'S' : 'N') +
    (scores.T > scores.F ? 'T' : 'F') +
    (scores.J > scores.P ? 'J' : 'P');
  
  const type = mbtiTypes.find(t => t.code === typeCode)!;
  
  // 计算置信度（基于各维度的差异程度）
  const confidence = Math.min(100, Math.round(
    ((Math.abs(scores.E - scores.I) + 
      Math.abs(scores.S - scores.N) + 
      Math.abs(scores.T - scores.F) + 
      Math.abs(scores.J - scores.P)) / 4) * 10
  ));
  
  return { type, scores, confidence };
}

// 性格类型兼容性矩阵
export const mbtiCompatibility: { [key: string]: { [key: string]: number } } = {
  'INTJ': { 'ENFP': 95, 'ENTP': 90, 'INFJ': 85, 'INFP': 80 },
  'INTP': { 'ENFJ': 95, 'ENTJ': 90, 'INFJ': 85, 'ENFP': 80 },
  'ENTJ': { 'INFP': 95, 'INTP': 90, 'ENFP': 85, 'INTJ': 80 },
  'ENTP': { 'INFJ': 95, 'INTJ': 90, 'ENFJ': 85, 'ISFJ': 80 },
  'INFJ': { 'ENTP': 95, 'ENFP': 90, 'INTJ': 85, 'INTP': 80 },
  'INFP': { 'ENTJ': 95, 'ENFJ': 90, 'INTJ': 85, 'ENTP': 80 },
  'ENFJ': { 'INFP': 95, 'INTP': 90, 'ISFP': 85, 'ENTP': 80 },
  'ENFP': { 'INTJ': 95, 'INFJ': 90, 'ENTJ': 85, 'INTP': 80 },
  'ISTJ': { 'ESFP': 90, 'ESTP': 85, 'ISFP': 80, 'ENFP': 75 },
  'ISFJ': { 'ESTP': 90, 'ESFP': 85, 'ENTP': 80, 'ENFP': 75 },
  'ESTJ': { 'ISFP': 90, 'ISTP': 85, 'INTP': 80, 'ENFP': 75 },
  'ESFJ': { 'ISFP': 90, 'ISTP': 85, 'INFP': 80, 'ENTP': 75 },
  'ISTP': { 'ESFJ': 90, 'ESTJ': 85, 'ENFJ': 80, 'ESFP': 75 },
  'ISFP': { 'ENFJ': 90, 'ESTJ': 85, 'ESFJ': 80, 'ENTJ': 75 },
  'ESTP': { 'ISFJ': 90, 'ISTJ': 85, 'INFJ': 80, 'ISFP': 75 },
  'ESFP': { 'ISTJ': 90, 'ISFJ': 85, 'INFJ': 80, 'INTJ': 75 }
};

// 获取性格类型兼容性
export function getMBTICompatibility(type1: string, type2: string): number {
  return mbtiCompatibility[type1]?.[type2] || 
         mbtiCompatibility[type2]?.[type1] || 
         50; // 默认兼容性
}