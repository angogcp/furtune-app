// 心理测试相关数据和算法

import { getMBTICompatibility } from './mbtiData';
import { zodiacSigns, calculateCompatibility } from './astrologyData';
import { calculateLifeNumber } from './numerologyData';

// 配对测试接口
export interface CompatibilityTest {
  person1: {
    name: string;
    birthDate: string;
    mbtiType?: string;
    zodiacSign?: string;
    lifeNumber?: number;
  };
  person2: {
    name: string;
    birthDate: string;
    mbtiType?: string;
    zodiacSign?: string;
    lifeNumber?: number;
  };
}

// 配对结果接口
export interface CompatibilityResult {
  overallScore: number;
  mbtiScore: number;
  astrologyScore: number;
  numerologyScore: number;
  strengths: string[];
  challenges: string[];
  advice: string[];
  relationship: {
    type: string;
    description: string;
    potential: string;
  };
}

// 生命故事模板
export interface LifeStoryTemplate {
  id: string;
  title: string;
  theme: string;
  ageRanges: {
    range: string;
    description: string;
    keywords: string[];
  }[];
  challenges: string[];
  opportunities: string[];
  advice: string[];
}

// 基于生命数字的故事模板
export const lifeStoryTemplates: { [key: number]: LifeStoryTemplate } = {
  1: {
    id: 'leader',
    title: '领导者的征程',
    theme: '独立自主，开拓创新',
    ageRanges: [
      {
        range: '0-20岁',
        description: '天生的领导潜质开始显现，喜欢独立思考和行动。',
        keywords: ['独立', '创新', '领导力']
      },
      {
        range: '21-40岁',
        description: '事业起步期，通过自己的努力和创新思维获得成功。',
        keywords: ['事业', '创业', '成就']
      },
      {
        range: '41-60岁',
        description: '成熟期，成为行业领袖，影响和启发他人。',
        keywords: ['领袖', '影响力', '智慧']
      },
      {
        range: '60岁以后',
        description: '传承期，将经验和智慧传授给下一代。',
        keywords: ['传承', '智慧', '导师']
      }
    ],
    challenges: ['过于独立可能导致孤立', '需要学会团队合作', '控制急躁的性格'],
    opportunities: ['创业机会', '领导职位', '创新项目'],
    advice: ['培养耐心', '学会倾听他人', '平衡工作与生活']
  },
  2: {
    id: 'cooperator',
    title: '合作者的和谐之路',
    theme: '合作共赢，和谐发展',
    ageRanges: [
      {
        range: '0-20岁',
        description: '天生具有合作精神，善于理解他人情感。',
        keywords: ['合作', '理解', '和谐']
      },
      {
        range: '21-40岁',
        description: '在团队中发挥重要作用，成为连接各方的桥梁。',
        keywords: ['团队', '桥梁', '协调']
      },
      {
        range: '41-60岁',
        description: '成为优秀的协调者和顾问，帮助他人解决问题。',
        keywords: ['顾问', '协调', '帮助']
      },
      {
        range: '60岁以后',
        description: '享受家庭和谐，成为家族的精神支柱。',
        keywords: ['家庭', '支柱', '和谐']
      }
    ],
    challenges: ['过于迁就他人', '缺乏主见', '容易受他人影响'],
    opportunities: ['团队合作项目', '咨询顾问', '人际关系工作'],
    advice: ['建立自信', '学会说不', '保持独立思考']
  },
  3: {
    id: 'creator',
    title: '创造者的艺术人生',
    theme: '创意无限，表达自我',
    ageRanges: [
      {
        range: '0-20岁',
        description: '充满创意和想象力，喜欢艺术和表达。',
        keywords: ['创意', '艺术', '表达']
      },
      {
        range: '21-40岁',
        description: '在创意领域找到自己的方向，开始职业发展。',
        keywords: ['职业', '创意', '发展']
      },
      {
        range: '41-60岁',
        description: '创意成熟期，作品获得认可和成功。',
        keywords: ['成熟', '认可', '成功']
      },
      {
        range: '60岁以后',
        description: '继续创作，成为艺术界的资深人士。',
        keywords: ['资深', '创作', '传承']
      }
    ],
    challenges: ['情绪波动大', '缺乏持续性', '过于理想化'],
    opportunities: ['艺术创作', '娱乐行业', '创意设计'],
    advice: ['保持专注', '管理情绪', '平衡理想与现实']
  },
  4: {
    id: 'builder',
    title: '建设者的稳固基石',
    theme: '踏实稳重，建设未来',
    ageRanges: [
      {
        range: '0-20岁',
        description: '从小就表现出踏实可靠的性格，做事有条理。',
        keywords: ['踏实', '可靠', '条理']
      },
      {
        range: '21-40岁',
        description: '通过努力工作建立稳固的事业基础。',
        keywords: ['努力', '基础', '稳固']
      },
      {
        range: '41-60岁',
        description: '成为行业的中坚力量，享受稳定的成功。',
        keywords: ['中坚', '稳定', '成功']
      },
      {
        range: '60岁以后',
        description: '享受辛勤工作的成果，成为家族的支柱。',
        keywords: ['成果', '支柱', '享受']
      }
    ],
    challenges: ['过于保守', '抗拒变化', '缺乏灵活性'],
    opportunities: ['管理职位', '建筑工程', '金融投资'],
    advice: ['保持开放心态', '适应变化', '培养创新思维']
  },
  5: {
    id: 'adventurer',
    title: '冒险家的自由之旅',
    theme: '自由探索，体验人生',
    ageRanges: [
      {
        range: '0-20岁',
        description: '充满好奇心，喜欢探索和冒险。',
        keywords: ['好奇', '探索', '冒险']
      },
      {
        range: '21-40岁',
        description: '通过旅行和体验丰富人生阅历。',
        keywords: ['旅行', '体验', '阅历']
      },
      {
        range: '41-60岁',
        description: '将丰富的经验转化为智慧和成就。',
        keywords: ['经验', '智慧', '成就']
      },
      {
        range: '60岁以后',
        description: '继续探索，成为人生导师。',
        keywords: ['探索', '导师', '分享']
      }
    ],
    challenges: ['缺乏持续性', '难以安定', '容易冲动'],
    opportunities: ['旅游业', '销售工作', '自由职业'],
    advice: ['培养耐心', '学会承诺', '平衡自由与责任']
  },
  6: {
    id: 'nurturer',
    title: '照顾者的爱心之路',
    theme: '关爱他人，服务社会',
    ageRanges: [
      {
        range: '0-20岁',
        description: '天生具有关爱他人的本能，喜欢帮助别人。',
        keywords: ['关爱', '帮助', '本能']
      },
      {
        range: '21-40岁',
        description: '在服务他人的工作中找到人生价值。',
        keywords: ['服务', '价值', '工作']
      },
      {
        range: '41-60岁',
        description: '成为社区或家庭的核心支持者。',
        keywords: ['核心', '支持', '社区']
      },
      {
        range: '60岁以后',
        description: '享受被爱和感激的晚年生活。',
        keywords: ['被爱', '感激', '晚年']
      }
    ],
    challenges: ['过度付出', '忽视自己', '容易疲惫'],
    opportunities: ['教育工作', '医疗护理', '社会服务'],
    advice: ['学会自我关爱', '设定界限', '平衡给予与接受']
  },
  7: {
    id: 'seeker',
    title: '求知者的智慧之旅',
    theme: '追求真理，探索奥秘',
    ageRanges: [
      {
        range: '0-20岁',
        description: '对知识和真理有强烈的渴望，喜欢思考。',
        keywords: ['知识', '真理', '思考']
      },
      {
        range: '21-40岁',
        description: '通过学习和研究深入探索感兴趣的领域。',
        keywords: ['学习', '研究', '探索']
      },
      {
        range: '41-60岁',
        description: '成为某个领域的专家或学者。',
        keywords: ['专家', '学者', '领域']
      },
      {
        range: '60岁以后',
        description: '分享智慧，成为精神导师。',
        keywords: ['智慧', '导师', '精神']
      }
    ],
    challenges: ['过于内向', '脱离现实', '社交困难'],
    opportunities: ['研究工作', '学术职业', '咨询顾问'],
    advice: ['保持社交联系', '关注实际应用', '分享知识']
  },
  8: {
    id: 'achiever',
    title: '成就者的权力之路',
    theme: '追求成功，掌控命运',
    ageRanges: [
      {
        range: '0-20岁',
        description: '展现出强烈的成功欲望和领导潜质。',
        keywords: ['成功', '欲望', '领导']
      },
      {
        range: '21-40岁',
        description: '通过努力和决心在事业上取得重大成就。',
        keywords: ['努力', '决心', '成就']
      },
      {
        range: '41-60岁',
        description: '达到事业巅峰，拥有影响力和财富。',
        keywords: ['巅峰', '影响力', '财富']
      },
      {
        range: '60岁以后',
        description: '回馈社会，成为慈善家或导师。',
        keywords: ['回馈', '慈善', '导师']
      }
    ],
    challenges: ['过于追求权力', '忽视人际关系', '工作狂倾向'],
    opportunities: ['企业管理', '投资理财', '政治职业'],
    advice: ['平衡工作与生活', '重视人际关系', '学会放权']
  },
  9: {
    id: 'humanitarian',
    title: '人道主义者的博爱之路',
    theme: '服务人类，传播爱心',
    ageRanges: [
      {
        range: '0-20岁',
        description: '对人类和世界充满同情心和理想主义。',
        keywords: ['同情', '理想', '世界']
      },
      {
        range: '21-40岁',
        description: '投身于改善世界的事业中。',
        keywords: ['改善', '事业', '投身']
      },
      {
        range: '41-60岁',
        description: '成为人道主义领域的重要人物。',
        keywords: ['人道主义', '重要', '领域']
      },
      {
        range: '60岁以后',
        description: '继续为人类福祉贡献力量。',
        keywords: ['福祉', '贡献', '力量']
      }
    ],
    challenges: ['过于理想化', '容易失望', '忽视个人需求'],
    opportunities: ['慈善工作', '国际组织', '社会改革'],
    advice: ['保持现实感', '关注自我成长', '寻找志同道合的伙伴']
  }
};

// 综合配对打分算法
export function calculateCompatibilityScore(test: CompatibilityTest): CompatibilityResult {
  let mbtiScore = 50;
  let astrologyScore = 50;
  let numerologyScore = 50;
  
  const strengths: string[] = [];
  const challenges: string[] = [];
  const advice: string[] = [];
  
  // MBTI兼容性计算
  if (test.person1.mbtiType && test.person2.mbtiType) {
    mbtiScore = getMBTICompatibility(test.person1.mbtiType, test.person2.mbtiType);
    
    if (mbtiScore >= 85) {
      strengths.push('性格类型高度互补，思维方式相得益彰');
    } else if (mbtiScore >= 70) {
      strengths.push('性格特质较为匹配，能够相互理解');
    } else {
      challenges.push('性格差异较大，需要更多沟通和理解');
    }
  }
  
  // 星座兼容性计算
  if (test.person1.zodiacSign && test.person2.zodiacSign) {
    const sign1 = zodiacSigns.find(s => s.name === test.person1.zodiacSign);
    const sign2 = zodiacSigns.find(s => s.name === test.person2.zodiacSign);
    
    if (sign1 && sign2) {
      astrologyScore = calculateCompatibility(sign1.id, sign2.id);
      
      if (astrologyScore >= 80) {
        strengths.push('星座能量和谐共振，天生的默契');
      } else if (astrologyScore >= 60) {
        strengths.push('星座特质相互吸引，有良好的化学反应');
      } else {
        challenges.push('星座能量存在冲突，需要学会包容差异');
      }
    }
  }
  
  // 数字命理兼容性计算
  if (test.person1.lifeNumber && test.person2.lifeNumber) {
    const diff = Math.abs(test.person1.lifeNumber - test.person2.lifeNumber);
    
    if (diff === 0) {
      numerologyScore = 95;
      strengths.push('生命数字相同，人生目标高度一致');
    } else if (diff <= 2) {
      numerologyScore = 80;
      strengths.push('生命数字相近，价值观念相似');
    } else if (diff <= 4) {
      numerologyScore = 65;
    } else {
      numerologyScore = 45;
      challenges.push('生命数字差异较大，人生追求不同');
    }
  }
  
  // 计算综合得分
  const overallScore = Math.round((mbtiScore + astrologyScore + numerologyScore) / 3);
  
  // 根据综合得分给出建议
  if (overallScore >= 85) {
    advice.push('你们是天作之合，珍惜这份缘分');
    advice.push('保持开放的沟通，共同成长');
    advice.push('在相似中寻找新鲜感，在差异中学习成长');
  } else if (overallScore >= 70) {
    advice.push('你们有很好的基础，需要用心经营');
    advice.push('多关注对方的需求和感受');
    advice.push('在冲突中寻找共同点，化解分歧');
  } else if (overallScore >= 55) {
    advice.push('你们需要更多的理解和包容');
    advice.push('学会欣赏彼此的不同之处');
    advice.push('通过共同的兴趣爱好增进感情');
  } else {
    advice.push('你们面临较大的挑战，需要双方共同努力');
    advice.push('重点关注沟通方式的改善');
    advice.push('寻求专业的情感咨询帮助');
  }
  
  // 确定关系类型
  let relationshipType = '';
  let relationshipDescription = '';
  let relationshipPotential = '';
  
  if (overallScore >= 85) {
    relationshipType = '灵魂伴侣';
    relationshipDescription = '你们在多个层面都高度匹配，是难得的灵魂伴侣。';
    relationshipPotential = '拥有建立深刻而持久关系的巨大潜力。';
  } else if (overallScore >= 70) {
    relationshipType = '理想伴侣';
    relationshipDescription = '你们有很好的匹配度，是理想的伴侣组合。';
    relationshipPotential = '通过努力经营，能够建立稳定幸福的关系。';
  } else if (overallScore >= 55) {
    relationshipType = '潜力伴侣';
    relationshipDescription = '你们有一定的匹配度，存在发展的可能性。';
    relationshipPotential = '需要双方的理解和努力，有机会发展成良好关系。';
  } else {
    relationshipType = '挑战伴侣';
    relationshipDescription = '你们的匹配度较低，关系发展面临挑战。';
    relationshipPotential = '需要克服较大的差异，建议慎重考虑。';
  }
  
  return {
    overallScore,
    mbtiScore,
    astrologyScore,
    numerologyScore,
    strengths,
    challenges,
    advice,
    relationship: {
      type: relationshipType,
      description: relationshipDescription,
      potential: relationshipPotential
    }
  };
}

// AI命格小故事生成
export function generateLifeStory(birthDate: string, name: string): {
  title: string;
  story: string;
  lifeNumber: number;
  template: LifeStoryTemplate;
  personalizedElements: string[];
} {
  const lifeNumber = calculateLifeNumber(birthDate);
  const template = lifeStoryTemplates[lifeNumber];
  
  if (!template) {
    throw new Error('无法找到对应的生命故事模板');
  }
  
  // 个性化元素
  const personalizedElements = [
    `${name}的生命数字是${lifeNumber}`,
    `主题：${template.theme}`,
    `人生关键词：${template.ageRanges[0].keywords.join('、')}`
  ];
  
  // 生成个性化故事
  const story = `
${name}，你的生命数字是${lifeNumber}，这意味着你是一个「${template.title.replace(/的.*/, '')}」。

${template.theme}是你人生的主旋律。从你出生的那一刻起，宇宙就为你安排了一条独特的人生道路。

【人生四个阶段】

${template.ageRanges.map(range => 
  `🌟 ${range.range}：${range.description}
   关键词：${range.keywords.join('、')}`
).join('\n\n')}

【人生挑战】
${template.challenges.map(challenge => `• ${challenge}`).join('\n')}

【人生机遇】
${template.opportunities.map(opportunity => `• ${opportunity}`).join('\n')}

【人生建议】
${template.advice.map(advice => `💡 ${advice}`).join('\n')}

${name}，记住：每个人的人生都是独一无二的。这个故事只是为你提供一个参考框架，真正的人生需要你自己去书写。相信自己，勇敢地走向属于你的精彩人生！
  `.trim();
  
  return {
    title: `${name}的${template.title}`,
    story,
    lifeNumber,
    template,
    personalizedElements
  };
}

// 心理健康评估问题
export interface MentalHealthQuestion {
  id: string;
  question: string;
  category: 'stress' | 'anxiety' | 'depression' | 'self_esteem' | 'relationships';
  options: {
    text: string;
    score: number;
  }[];
}

export const mentalHealthQuestions: MentalHealthQuestion[] = [
  {
    id: 'stress1',
    question: '最近一个月，你感到压力的频率如何？',
    category: 'stress',
    options: [
      { text: '几乎没有', score: 1 },
      { text: '偶尔', score: 2 },
      { text: '经常', score: 3 },
      { text: '几乎每天', score: 4 }
    ]
  },
  {
    id: 'anxiety1',
    question: '你是否经常感到紧张或焦虑？',
    category: 'anxiety',
    options: [
      { text: '从不', score: 1 },
      { text: '很少', score: 2 },
      { text: '有时', score: 3 },
      { text: '经常', score: 4 }
    ]
  },
  {
    id: 'depression1',
    question: '你是否经常感到沮丧或情绪低落？',
    category: 'depression',
    options: [
      { text: '从不', score: 1 },
      { text: '很少', score: 2 },
      { text: '有时', score: 3 },
      { text: '经常', score: 4 }
    ]
  },
  {
    id: 'self_esteem1',
    question: '你对自己的整体评价如何？',
    category: 'self_esteem',
    options: [
      { text: '非常满意', score: 4 },
      { text: '比较满意', score: 3 },
      { text: '一般', score: 2 },
      { text: '不太满意', score: 1 }
    ]
  },
  {
    id: 'relationships1',
    question: '你与他人的关系质量如何？',
    category: 'relationships',
    options: [
      { text: '非常好', score: 4 },
      { text: '比较好', score: 3 },
      { text: '一般', score: 2 },
      { text: '不太好', score: 1 }
    ]
  }
];

// 心理健康评估结果
export interface MentalHealthResult {
  overallScore: number;
  categoryScores: {
    stress: number;
    anxiety: number;
    depression: number;
    self_esteem: number;
    relationships: number;
  };
  level: 'excellent' | 'good' | 'fair' | 'poor';
  recommendations: string[];
  resources: string[];
}

// 计算心理健康评估结果
export function calculateMentalHealthResult(answers: { [questionId: string]: number }): MentalHealthResult {
  const categoryScores = {
    stress: 0,
    anxiety: 0,
    depression: 0,
    self_esteem: 0,
    relationships: 0
  };
  
  const categoryCounts = {
    stress: 0,
    anxiety: 0,
    depression: 0,
    self_esteem: 0,
    relationships: 0
  };
  
  // 计算各类别得分
  Object.entries(answers).forEach(([questionId, score]) => {
    const question = mentalHealthQuestions.find(q => q.id === questionId);
    if (question) {
      categoryScores[question.category] += score;
      categoryCounts[question.category]++;
    }
  });
  
  // 计算平均分
  Object.keys(categoryScores).forEach(category => {
    const cat = category as keyof typeof categoryScores;
    if (categoryCounts[cat] > 0) {
      categoryScores[cat] = categoryScores[cat] / categoryCounts[cat];
    }
  });
  
  // 计算总分
  const overallScore = Object.values(categoryScores).reduce((sum, score) => sum + score, 0) / 5;
  
  // 确定等级
  let level: 'excellent' | 'good' | 'fair' | 'poor';
  if (overallScore >= 3.5) level = 'excellent';
  else if (overallScore >= 2.5) level = 'good';
  else if (overallScore >= 1.5) level = 'fair';
  else level = 'poor';
  
  // 生成建议
  const recommendations: string[] = [];
  const resources: string[] = [];
  
  if (categoryScores.stress >= 3) {
    recommendations.push('学习压力管理技巧，如深呼吸、冥想等');
    resources.push('压力管理应用程序');
  }
  
  if (categoryScores.anxiety >= 3) {
    recommendations.push('尝试放松技巧，考虑寻求专业帮助');
    resources.push('焦虑症自助指南');
  }
  
  if (categoryScores.depression >= 3) {
    recommendations.push('保持规律作息，增加社交活动');
    resources.push('心理健康热线');
  }
  
  if (categoryScores.self_esteem <= 2) {
    recommendations.push('培养自我肯定的习惯，记录每日成就');
    resources.push('自信心建设课程');
  }
  
  if (categoryScores.relationships <= 2) {
    recommendations.push('改善沟通技巧，主动维护人际关系');
    resources.push('人际关系改善指南');
  }
  
  if (level === 'excellent') {
    recommendations.push('继续保持良好的心理状态');
    recommendations.push('可以帮助他人改善心理健康');
  } else if (level === 'poor') {
    recommendations.push('建议寻求专业心理咨询师的帮助');
    resources.push('心理咨询预约平台');
  }
  
  return {
    overallScore,
    categoryScores,
    level,
    recommendations,
    resources
  };
}