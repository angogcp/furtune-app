// 批量生成观音求签数据的工具函数

interface LotterySign {
  poem: string;
  meaning: string;
  interpretation: string;
  category: string;
  advice: string;
  luckyElements: {
    direction: string;
    color: string;
    number: number[];
    time: string;
  };
}

// 签文诗句库
const poems = [
  "月出光辉四海明，前程万里自分明。若问求谋并进退，且待时来运转亨。",
  "一朝无事忽遭官，也是前生作业愆。好把身心重修整，免教后日再忧煎。",
  "欲求财利不如心，谋望功名未遂心。若是婚姻重新配，且防口舌是非侵。",
  "田蚕收成好，牛羊遍地肥。人口皆平善，财宝满门扉。",
  "鲤鱼化龙出深潭，头角峥嵘不等闲。一日得遂凌云志，四海声名播远传。",
  "一舟行在太平洋，风恶浪高难进港。若得顺风相接引，不须忧虑更思量。",
  "上下传来事总虚，天边接得一封书。书中许我功名事，直待终时亦是无。",
  "一谋一用一番新，鹿走平原渐见春。纵有些儿忧闷事，前程改变喜临门。",
  "鸟投林内暂栖身，大海茫茫未可寻。他日若逢春色到，依然还我旧时心。",
  "一山如画对清江，门第书香世泽长。马到成功人得意，光宗耀祖姓名香。",
  "劝君切莫向他求，似鹤飞来暗箭投。若是有人相助力，当时危险不须忧。",
  "花开花谢在春风，富贵荣华一梦中。若问前程归宿处，须知富贵不如贫。",
  "一条金线钓金鳌，个个贤才尽俊豪。三级浪高鱼化鸟，许君一跃过龙桥。",
  "门庭清吉梦安然，讼事官非总不干。婚姻子息皆如意，财禄丰盈自有缘。",
  "一见如故两相投，意气相投结伴游。他日若逢春色到，依然还我旧时心。",
  "春来雨露润花枝，万物欣荣次第开。若问前程归宿处，须知富贵自天来。",
  "一轮明月照当空，四海澄清在此中。水到渠成真有日，太平无事乐融融。",
  "鸿雁传书信息通，相逢千里一时同。若问前程归宿处，须知富贵自天来。",
  "一朝天子一朝臣，荣华富贵有前因。莫向他人夸己德，自然福禄降天庭。",
  "花开花落几春秋，富贵荣华一梦休。若问前程归宿处，须知富贵不如贫。"
];

// 签文含义库
const meanings = [
  "光明前程，万事如意", "因果报应，修身养性", "事与愿违，需要耐心", "丰收在望，家业兴旺",
  "鲤鱼跃龙门，飞黄腾达", "风浪险阻，需待良机", "虚实难辨，谨慎为上", "改变策略，春意盎然",
  "暂时栖身，等待时机", "书香门第，光宗耀祖", "暗箭难防，需有贵人", "花开花落，富贵如梦",
  "金线钓鳌，贤才荟萃", "门庭清吉，万事如意", "一见如故，意气相投", "春雨润物，万象更新",
  "明月当空，太平盛世", "鸿雁传书，千里相逢", "天子恩泽，福禄天降", "花开花落，荣华如梦"
];

// 解释库
const interpretations = [
  "此签大吉，预示着前程光明，万事顺利。如明月照耀般，一切都会变得清晰明朗。",
  "此签提醒要谨慎行事，可能会遇到一些困难或纠纷。这是因果循环的体现，需要反省自身。",
  "此签表示目前所求之事难以如愿，需要调整心态和方法。在感情方面要特别小心。",
  "此签大吉，预示着收获颇丰，家庭和睦，财运亨通。如农家丰收般，各方面都有好发展。",
  "此签极吉，预示着将有重大突破和成功。如鲤鱼化龙般，地位和声望将大幅提升。",
  "此签表示目前处境如船在风浪中，需要等待合适的时机。虽然暂时困难，但终会有贵人相助。",
  "此签提醒不要轻信传言，许多消息可能并不真实。对于承诺的好事要保持理性。",
  "此签表示需要改变思路和方法，如此将迎来新的转机。虽然目前有些烦恼，但前景光明。",
  "此签表示目前需要暂时安定下来，等待更好的机会。虽然现在迷茫，但春天终会到来。",
  "此签大吉，预示着学业有成，事业辉煌。将会光宗耀祖，名声远播，是非常好的征兆。"
];

// 签类别
const categories = ["上上签", "上吉签", "中平签", "中下签", "下下签"];

// 建议库
const advices = [
  "把握时机，积极进取，好运自然降临",
  "反省自身，修正错误，以德化解困难",
  "调整期望，耐心等待，避免争执",
  "继续努力，收获在即，家和万事兴",
  "抓住机遇，勇敢进取，成功在望",
  "耐心等待，寻求帮助，时机成熟自然顺利",
  "理性分析，不轻信传言，脚踏实地",
  "改变策略，积极应对，好运即将到来",
  "安心等待，保持初心，时机自会到来",
  "努力学习，追求卓越，必将功成名就"
];

// 方向库
const directions = ["东方", "南方", "西方", "北方", "东南", "西南", "西北", "东北", "中央"];

// 颜色库
const colors = ["红色", "绿色", "蓝色", "黄色", "白色", "黑色", "紫色", "金色", "银色", "粉色"];

// 时辰库
const times = ["子时", "丑时", "寅时", "卯时", "辰时", "巳时", "午时", "未时", "申时", "酉时", "戌时", "亥时"];

// 生成单个签文
export const generateLotterySign = (id: number): LotterySign => {
  const poemIndex = (id - 1) % poems.length;
  const meaningIndex = (id - 1) % meanings.length;
  const interpretationIndex = (id - 1) % interpretations.length;
  const categoryIndex = Math.floor((id - 1) / 20) % categories.length;
  const adviceIndex = (id - 1) % advices.length;
  const directionIndex = (id - 1) % directions.length;
  const colorIndex = (id - 1) % colors.length;
  const timeIndex = (id - 1) % times.length;

  return {
    poem: poems[poemIndex],
    meaning: meanings[meaningIndex],
    interpretation: interpretations[interpretationIndex],
    category: categories[categoryIndex],
    advice: advices[adviceIndex],
    luckyElements: {
      direction: directions[directionIndex],
      color: colors[colorIndex],
      number: [id % 10 || 10, (id * 2) % 10 || 10, id],
      time: times[timeIndex]
    }
  };
};

// 生成完整的100签数据
export const generateFullLotteryData = (): Record<number, LotterySign> => {
  const data: Record<number, LotterySign> = {};
  
  for (let i = 1; i <= 100; i++) {
    data[i] = generateLotterySign(i);
  }
  
  return data;
};

// 生成指定范围的签文数据
export const generateLotteryRange = (start: number, end: number): Record<number, LotterySign> => {
  const data: Record<number, LotterySign> = {};
  
  for (let i = start; i <= end; i++) {
    data[i] = generateLotterySign(i);
  }
  
  return data;
};