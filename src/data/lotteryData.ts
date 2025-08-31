// 观音灵签100签完整数据

export interface LotterySign {
  poem: string;
  meaning: string;
  interpretation: string;
  category: '上上签' | '上吉签' | '中吉签' | '中平签' | '中下签' | '下签' | '下下签';
  advice: string;
  luckyElements: {
    direction: string;
    color: string;
    number: number[];
    time: string;
  };
}

export const lotteryData: Record<string, LotterySign> = {
  '1': {
    poem: '锤凿玉成器，功名得遂心。如今时运至，只怕不专心。',
    meaning: '上上签',
    interpretation: '此签暗示经过努力雕琢，必能成就大器。当前时运亨通，只要专心致志，功名利禄皆可得。建议您保持专注，不要三心二意，成功就在眼前。',
    category: '上上签',
    advice: '专心致志，把握时机，切勿分心',
    luckyElements: {
      direction: '东南',
      color: '金色',
      number: [1, 8, 9],
      time: '午时'
    }
  },
  '2': {
    poem: '鲸鱼未变化，不可妄求谋。若是逢雷雨，头角始昂头。',
    meaning: '中平签',
    interpretation: '时机未到，不宜急进。需等待合适的机会，如遇贵人相助或环境改变，方能展现才华。建议您耐心等待，积蓄力量，时机成熟时必能一飞冲天。',
    category: '中平签',
    advice: '耐心等待，积蓄力量，静候时机',
    luckyElements: {
      direction: '北方',
      color: '蓝色',
      number: [2, 6, 7],
      time: '子时'
    }
  },
  '3': {
    poem: '临风冒雨去，恰似采花蜂。得甜须有毒，暗里有人攻。',
    meaning: '下下签',
    interpretation: '表面看似有利可图，实则暗藏危险。需谨慎行事，防范小人暗算。建议您提高警惕，不要被表面的甜头迷惑，小心身边的陷阱。',
    category: '下下签',
    advice: '提高警惕，谨慎行事，防范小人',
    luckyElements: {
      direction: '西方',
      color: '白色',
      number: [3, 4, 5],
      time: '酉时'
    }
  },
  '4': {
    poem: '千里求师访道，早晚必定成功。劝君且守静，待时运亨通。',
    meaning: '中吉签',
    interpretation: '求学问道的路虽远，但终有所成。目前宜静待时机，不可急躁。建议您继续学习提升，保持谦逊的心态，成功会在适当的时候到来。',
    category: '中吉签',
    advice: '持续学习，保持谦逊，静待时机',
    luckyElements: {
      direction: '东方',
      color: '绿色',
      number: [4, 8, 12],
      time: '卯时'
    }
  },
  '5': {
    poem: '一锹挖出土，两锹不见泥。直待三锹下，好土才能得。',
    meaning: '中平签',
    interpretation: '做事需要坚持，不能半途而废。只有持续努力，才能获得真正的成果。建议您不要因为暂时的困难而放弃，坚持到底必有收获。',
    category: '中平签',
    advice: '坚持不懈，持续努力，不可半途而废',
    luckyElements: {
      direction: '中央',
      color: '黄色',
      number: [5, 10, 15],
      time: '辰时'
    }
  },
  '6': {
    poem: '何须着意问前程，前路光明正可行。若得贵人相指引，前途万里任纵横。',
    meaning: '上吉签',
    interpretation: '前程光明，无需过分担忧。有贵人相助，前路顺畅。建议您保持积极心态，勇敢前行，必能成就一番事业。',
    category: '上吉签',
    advice: '保持积极，勇敢前行，善待贵人',
    luckyElements: {
      direction: '南方',
      color: '红色',
      number: [6, 9, 18],
      time: '午时'
    }
  },
  '7': {
    poem: '月被云遮暗，花遭雨打残。若得东风力，依旧绿满山。',
    meaning: '中平签',
    interpretation: '目前虽有困难阻碍，但只是暂时的。如能得到助力，必能重现生机。建议您不要灰心，坚持下去，转机即将到来。',
    category: '中平签',
    advice: '不要灰心，坚持下去，等待转机',
    luckyElements: {
      direction: '东方',
      color: '绿色',
      number: [7, 14, 21],
      time: '卯时'
    }
  },
  '8': {
    poem: '一朝无事忽遭官，也是前生作业愆。改过自新修善果，灾消福至保平安。',
    meaning: '中平签',
    interpretation: '可能遇到意外的麻烦或官司，这是因果报应。需要反省自己，改过自新，多行善事，才能化解灾难，获得平安。',
    category: '中平签',
    advice: '反省自新，多行善事，化解灾难',
    luckyElements: {
      direction: '西北',
      color: '白色',
      number: [8, 16, 24],
      time: '戌时'
    }
  },
  '9': {
    poem: '望渡无舟事不谐，求谋做事总迟疑。若要事成须改过，更宜守旧莫胡为。',
    meaning: '中平签',
    interpretation: '做事犹豫不决，难以成功。需要改变做事方式，保持稳重，不可轻举妄动。建议您下定决心，果断行动。',
    category: '中平签',
    advice: '下定决心，果断行动，保持稳重',
    luckyElements: {
      direction: '北方',
      color: '黑色',
      number: [9, 18, 27],
      time: '子时'
    }
  },
  '10': {
    poem: '石中藏美玉，只待有缘人。一朝逢识者，方知价值深。',
    meaning: '上吉签',
    interpretation: '您如美玉藏于石中，只等待有眼光的人发现。一旦遇到识货的人，您的价值就会被认可。建议您耐心等待，机会即将到来。',
    category: '上吉签',
    advice: '耐心等待，展现才华，把握机会',
    luckyElements: {
      direction: '东南',
      color: '紫色',
      number: [10, 20, 30],
      time: '巳时'
    }
  },
  '11': {
    poem: '欲求财利不如意，只恐小人暗算计。若得贵人来指点，云开见日喜相随。',
    meaning: '中平签',
    interpretation: '求财不顺，需防小人暗算。但如能得到贵人指点，困难将会解决，好运随之而来。建议您谨慎理财，广结善缘。',
    category: '中平签',
    advice: '谨慎理财，防范小人，广结善缘',
    luckyElements: {
      direction: '西南',
      color: '黄色',
      number: [11, 22, 33],
      time: '未时'
    }
  },
  '12': {
    poem: '鸟投林中宿，能避暴风雨。天明依旧好，何必苦忧疑。',
    meaning: '中吉签',
    interpretation: '如鸟归林，能够避开风雨。暂时的困难会过去，天明后一切都会好转。建议您保持信心，不必过分忧虑。',
    category: '中吉签',
    advice: '保持信心，不必忧虑，困难会过去',
    luckyElements: {
      direction: '南方',
      color: '橙色',
      number: [12, 24, 36],
      time: '午时'
    }
  },
  '13': {
    poem: '君今百事且随缘，水到渠成听自然。莫向天边寻月兔，须知物在近身边。',
    meaning: '中平签',
    interpretation: '凡事要顺其自然，不可强求。机会就在身边，不必舍近求远。建议您把握当下，珍惜眼前的机会。',
    category: '中平签',
    advice: '顺其自然，把握当下，珍惜眼前',
    luckyElements: {
      direction: '中央',
      color: '土黄',
      number: [13, 26, 39],
      time: '辰时'
    }
  },
  '14': {
    poem: '一见桃花逐水流，几回失意几回愁。若逢好友相提拔，渐渐云开见日头。',
    meaning: '中平签',
    interpretation: '如桃花随水流，经历多次失意。但如能遇到好友相助，困境将会改善，前景光明。建议您珍惜友谊，互相扶持。',
    category: '中平签',
    advice: '珍惜友谊，互相扶持，等待转机',
    luckyElements: {
      direction: '东方',
      color: '粉色',
      number: [14, 28, 42],
      time: '卯时'
    }
  },
  '15': {
    poem: '苦尽甘来日，花开富贵时。若得东风力，枯木亦逢春。',
    meaning: '上吉签',
    interpretation: '苦难即将结束，好运即将到来。如枯木逢春，将迎来新的生机。建议您坚持下去，美好的日子就在前方。',
    category: '上吉签',
    advice: '坚持到底，美好即将到来',
    luckyElements: {
      direction: '东方',
      color: '绿色',
      number: [15, 30, 45],
      time: '卯时'
    }
  },
  '16': {
    poem: '红日当空照，花开满树香。若得贵人助，何愁不吉昌。',
    meaning: '上上签',
    interpretation: '如红日当空，花开满树，一片繁荣景象。有贵人相助，前程无忧。建议您积极进取，把握良机。',
    category: '上上签',
    advice: '积极进取，把握良机，感恩贵人',
    luckyElements: {
      direction: '南方',
      color: '红色',
      number: [16, 32, 48],
      time: '午时'
    }
  },
  '17': {
    poem: '莫听闲言与是非，晨昏只好念阿弥。若将狂心都摄住，不愁无处不相宜。',
    meaning: '中平签',
    interpretation: '不要听信闲言碎语，要专心修身养性。控制浮躁的心情，保持内心平静，自然处处顺心。建议您修身养性，远离是非。',
    category: '中平签',
    advice: '修身养性，远离是非，保持内心平静',
    luckyElements: {
      direction: '西方',
      color: '白色',
      number: [17, 34, 51],
      time: '酉时'
    }
  },
  '18': {
    poem: '金鳞岂是池中物，一遇风云便化龙。九霄云路终有日，雷声风雨助神通。',
    meaning: '上上签',
    interpretation: '如金鳞化龙，一旦时机成熟，必能飞黄腾达。建议您积极准备，等待机会到来时一飞冲天。',
    category: '上上签',
    advice: '积极准备，把握机会，一飞冲天',
    luckyElements: {
      direction: '东方',
      color: '金色',
      number: [18, 36, 54],
      time: '辰时'
    }
  },
  '19': {
    poem: '急水滩头放钓钩，鱼儿不上水空流。莫怪钓竿无钓处，只因鱼不遇钩头。',
    meaning: '中平签',
    interpretation: '时机不对，努力白费。需要耐心等待合适的时机，不可急于求成。建议您调整策略，等待更好的机会。',
    category: '中平签',
    advice: '调整策略，耐心等待，不可急躁',
    luckyElements: {
      direction: '北方',
      color: '蓝色',
      number: [19, 38, 57],
      time: '子时'
    }
  },
  '20': {
    poem: '当春久雨不晴时，花落花开总不知。若得云开见日出，自然万物尽光辉。',
    meaning: '中吉签',
    interpretation: '虽然目前阴霾不散，但终将云开见日。坚持下去，光明就在前方。建议您保持信心，困难即将过去。',
    category: '中吉签',
    advice: '保持信心，坚持下去，光明在前',
    luckyElements: {
      direction: '东方',
      color: '黄色',
      number: [20, 40, 60],
      time: '卯时'
    }
  },
  '21': {
    poem: '一朝无事忽遭官，也是前生作业愆。好把身心重修整，免教后日再忧煎。',
    meaning: '中平签',
    interpretation: '此签提醒要谨慎行事，可能会遇到一些困难或纠纷。这是因果循环的体现，需要反省自身，修正行为。',
    category: '中平签',
    advice: '反省自身，修正错误，以德化解困难',
    luckyElements: {
      direction: '西方',
      color: '白色',
      number: [6, 9, 21],
      time: '酉时'
    }
  },
  '22': {
    poem: '欲求财利不如心，谋望功名未遂心。若是婚姻重新配，且防口舌是非侵。',
    meaning: '中平签',
    interpretation: '此签表示目前所求之事难以如愿，需要调整心态和方法。在感情方面要特别小心，避免口舌是非。',
    category: '中平签',
    advice: '调整期望，耐心等待，避免争执',
    luckyElements: {
      direction: '北方',
      color: '蓝色',
      number: [2, 7, 22],
      time: '子时'
    }
  },
  '23': {
    poem: '田蚕收成好，牛羊遍地肥。人口皆平善，财宝满门扉。',
    meaning: '上吉签',
    interpretation: '此签大吉，预示着收获颇丰，家庭和睦，财运亨通。如农家丰收般，各方面都有好的发展。',
    category: '上吉签',
    advice: '继续努力，收获在即，家和万事兴',
    luckyElements: {
      direction: '中央',
      color: '金色',
      number: [5, 8, 23],
      time: '辰时'
    }
  },
  '24': {
    poem: '鲤鱼化龙出深潭，头角峥嵘不等闲。一日得遂凌云志，四海声名播远传。',
    meaning: '上上签',
    interpretation: '此签极吉，预示着将有重大突破和成功。如鲤鱼化龙般，地位和声望将大幅提升。',
    category: '上上签',
    advice: '抓住机遇，勇敢进取，成功在望',
    luckyElements: {
      direction: '东方',
      color: '金色',
      number: [1, 9, 24],
      time: '辰时'
    }
  },
  '25': {
    poem: '一舟行在太平洋，风恶浪高难进港。若得顺风相接引，不须忧虑更思量。',
    meaning: '中平签',
    interpretation: '此签表示目前处境如船在风浪中，需要等待合适的时机。虽然暂时困难，但终会有贵人相助。',
    category: '中平签',
    advice: '耐心等待，寻求帮助，时机成熟自然顺利',
    luckyElements: {
      direction: '北方',
      color: '蓝色',
      number: [3, 6, 25],
      time: '子时'
    }
  },
  '26': {
    poem: '上下传来事总虚，天边接得一封书。书中许我功名事，直待终时亦是无。',
    meaning: '虚实难辨，谨慎为上',
    interpretation: '此签提醒不要轻信传言，许多消息可能并不真实。对于承诺的好事要保持理性，不可过分期待。',
    category: '中平签',
    advice: '理性分析，不轻信传言，脚踏实地',
    luckyElements: {
      direction: '西北',
      color: '灰色',
      number: [4, 7, 26],
      time: '戌时'
    }
  },
  '27': {
    poem: '一谋一用一番新，鹿走平原渐见春。纵有些儿忧闷事，前程改变喜临门。',
    meaning: '改变策略，春意盎然',
    interpretation: '此签表示需要改变思路和方法，如此将迎来新的转机。虽然目前有些烦恼，但前景光明。',
    category: '上吉签',
    advice: '改变策略，积极应对，好运即将到来',
    luckyElements: {
      direction: '东南',
      color: '绿色',
      number: [2, 7, 27],
      time: '卯时'
    }
  },
  '28': {
    poem: '鸟投林内暂栖身，大海茫茫未可寻。他日若逢春色到，依然还我旧时心。',
    meaning: '暂时栖身，等待时机',
    interpretation: '此签表示目前需要暂时安定下来，等待更好的机会。虽然现在迷茫，但春天终会到来。',
    category: '中平签',
    advice: '安心等待，保持初心，时机自会到来',
    luckyElements: {
      direction: '南方',
      color: '绿色',
      number: [3, 8, 28],
      time: '午时'
    }
  },
  '29': {
    poem: '一山如画对清江，门第书香世泽长。马到成功人得意，光宗耀祖姓名香。',
    meaning: '书香门第，光宗耀祖',
    interpretation: '此签大吉，预示着学业有成，事业辉煌。将会光宗耀祖，名声远播，是非常好的征兆。',
    category: '上上签',
    advice: '努力学习，追求卓越，必将功成名就',
    luckyElements: {
      direction: '东方',
      color: '红色',
      number: [1, 9, 29],
      time: '卯时'
    }
  },
  '30': {
    poem: '劝君切莫向他求，似鹤飞来暗箭投。若是有人相助力，当时危险不须忧。',
    meaning: '暗箭难防，需有贵人',
    interpretation: '此签警告要小心暗中的陷害，不要轻易求助于人。但如果有真正的贵人相助，危险可以化解。',
    category: '中平签',
    advice: '谨慎行事，识别真假，寻求可靠帮助',
    luckyElements: {
      direction: '西方',
      color: '白色',
      number: [6, 10, 30],
      time: '酉时'
    }
  },
  '31': {
    poem: '一朝云雾散，万里见青天。宜向南方去，功名在目前。',
    meaning: '云开见日，前程光明',
    interpretation: '此签表示困难即将过去，前程一片光明。建议向南方发展，功名利禄指日可待。',
    category: '上吉签',
    advice: '把握时机，向南发展，前程似锦',
    luckyElements: {
      direction: '南方',
      color: '红色',
      number: [3, 8, 31],
      time: '午时'
    }
  },
  '32': {
    poem: '门前喜鹊噪，报君好消息。财利自天来，何须更忧虑。',
    meaning: '喜鹊报喜，财运亨通',
    interpretation: '此签大吉，预示着好消息即将到来，财运亨通。无需过分担忧，好运自然降临。',
    category: '上上签',
    advice: '保持乐观，好运即来，财源广进',
    luckyElements: {
      direction: '东方',
      color: '金色',
      number: [2, 8, 32],
      time: '卯时'
    }
  },
  '33': {
    poem: '花开花落自有时，莫怨春光去太迟。若得东风相助力，满园春色属君知。',
    meaning: '时来运转，春风得意',
    interpretation: '此签表示要顺应自然规律，不要急躁。有贵人相助时，必能春风得意，事业有成。',
    category: '中吉签',
    advice: '顺应时势，等待贵人，春风得意',
    luckyElements: {
      direction: '东方',
      color: '绿色',
      number: [3, 9, 33],
      time: '卯时'
    }
  },
  '34': {
    poem: '求谋望事不如心，恰似行舟遇逆风。若得贵人来指引，何愁不到岸边停。',
    meaning: '逆风行舟，需要指引',
    interpretation: '此签表示目前遇到阻力，如逆风行舟。但若有贵人指引，必能顺利到达目的地。',
    category: '中平签',
    advice: '寻求指引，耐心等待，终会成功',
    luckyElements: {
      direction: '北方',
      color: '蓝色',
      number: [4, 7, 34],
      time: '子时'
    }
  },
  '35': {
    poem: '一轮明月照当空，万里无云四海通。若问前程何处好，东南西北总相宜。',
    meaning: '明月当空，四海皆通',
    interpretation: '此签大吉，如明月当空，前程一片光明。无论往哪个方向发展都很顺利。',
    category: '上上签',
    advice: '前程光明，四方皆宜，大展宏图',
    luckyElements: {
      direction: '中央',
      color: '银色',
      number: [5, 9, 35],
      time: '子时'
    }
  },
  '36': {
    poem: '千里姻缘一线牵，相逢何必曾相识。若是有缘终会合，无缘对面不相逢。',
    meaning: '千里姻缘，有缘相会',
    interpretation: '此签多用于感情方面，表示有缘千里来相会。如果是真正的缘分，终会相聚。',
    category: '中吉签',
    advice: '相信缘分，顺其自然，有缘必聚',
    luckyElements: {
      direction: '西南',
      color: '粉色',
      number: [6, 9, 36],
      time: '未时'
    }
  },
  '37': {
    poem: '一帆风顺过江东，贵人相助显神通。若问前程何处好，金榜题名在其中。',
    meaning: '一帆风顺，金榜题名',
    interpretation: '此签大吉，预示着一帆风顺，有贵人相助。特别利于考试和求名，金榜题名指日可待。',
    category: '上上签',
    advice: '努力进取，贵人相助，金榜题名',
    luckyElements: {
      direction: '东方',
      color: '金色',
      number: [3, 7, 37],
      time: '卯时'
    }
  },
  '38': {
    poem: '水中捞月费工夫，虽然用尽也无功。若要求财并望事，恰似竹篮打水空。',
    meaning: '水中捞月，徒劳无功',
    interpretation: '此签提醒不要做无用功，目前所求之事如水中捞月。建议调整方向，寻找更实际的目标。',
    category: '下签',
    advice: '调整目标，脚踏实地，避免空想',
    luckyElements: {
      direction: '北方',
      color: '黑色',
      number: [3, 8, 38],
      time: '子时'
    }
  },
  '39': {
    poem: '北海龙王降甘露，旱苗得雨尽回春。若问前程何处好，更上一层楼更新。',
    meaning: '甘露降临，旱苗回春',
    interpretation: '此签表示久旱逢甘露，困境即将结束。前程更上一层楼，事业将有新的突破。',
    category: '上吉签',
    advice: '困境将过，更上层楼，事业突破',
    luckyElements: {
      direction: '北方',
      color: '蓝色',
      number: [3, 9, 39],
      time: '子时'
    }
  },
  '40': {
    poem: '一枝独秀在园中，花开正值春风时。若得园丁勤浇灌，他日必定结硕果。',
    meaning: '一枝独秀，精心培育',
    interpretation: '此签表示你有独特的才能，如一枝独秀。需要精心培育和努力，必能结出硕果。',
    category: '中吉签',
    advice: '发挥特长，精心培育，必有收获',
    luckyElements: {
      direction: '南方',
      color: '红色',
      number: [4, 8, 40],
      time: '午时'
    }
  },
  '41': {
    poem: '船到江心补漏迟，抱薪救火费心机。若不回头思改过，必然进退两难时。',
    meaning: '船到江心，补漏已迟',
    interpretation: '此签警示事到临头才想补救已经太迟。需要及时回头反思，否则将陷入进退两难的境地。',
    category: '下签',
    advice: '及时反思，改过自新，避免拖延',
    luckyElements: {
      direction: '西方',
      color: '白色',
      number: [4, 1, 41],
      time: '酉时'
    }
  },
  '42': {
    poem: '杨柳青青正及时，白花红叶满园枝。若问前程何处好，不须改变旧根基。',
    meaning: '杨柳青青，根基稳固',
    interpretation: '此签表示时机正好，基础稳固。不需要大的改变，在现有基础上发展即可获得成功。',
    category: '中吉签',
    advice: '把握时机，稳固根基，不必改变',
    luckyElements: {
      direction: '东方',
      color: '绿色',
      number: [4, 2, 42],
      time: '卯时'
    }
  },
  '43': {
    poem: '一朝无事忽遭官，也是前生种祸根。药医不死病，佛度有缘人。',
    meaning: '无事遭官，前因后果',
    interpretation: '此签提醒可能会遇到意外的麻烦或官司。这都是前因后果，需要以平常心对待，佛度有缘人。',
    category: '中下签',
    advice: '平常心对待，因果循环，积德行善',
    luckyElements: {
      direction: '中央',
      color: '黄色',
      number: [4, 3, 43],
      time: '辰时'
    }
  },
  '44': {
    poem: '汝是人中最吉人，误投罗网遇灾迍。不须忧虑宜守旧，自有贵人到门庭。',
    meaning: '吉人天相，贵人相助',
    interpretation: '此签表示你本是吉人，虽然暂时遇到困难，但不必忧虑。守住本分，自有贵人相助。',
    category: '中吉签',
    advice: '吉人天相，守旧待时，贵人相助',
    luckyElements: {
      direction: '南方',
      color: '紫色',
      number: [4, 4, 44],
      time: '午时'
    }
  },
  '45': {
    poem: '一鸟投林百鸟随，云中仙鹤舞巍巍。若问前程何处好，千秋万载福无亏。',
    meaning: '一鸟投林，百鸟随从',
    interpretation: '此签大吉，表示你将成为众人的领袖，如仙鹤般高贵。前程远大，福泽绵长。',
    category: '上上签',
    advice: '领袖风范，前程远大，福泽绵长',
    luckyElements: {
      direction: '西北',
      color: '白色',
      number: [4, 5, 45],
      time: '戌时'
    }
  },
  '46': {
    poem: '君子小人不同群，出入交游要谨慎。好事近身君莫问，恶事远身君莫寻。',
    meaning: '君子小人，谨慎交游',
    interpretation: '此签提醒要谨慎选择朋友，君子小人不可同群。好事自然近身，恶事要远离。',
    category: '中平签',
    advice: '谨慎交友，远离小人，亲近君子',
    luckyElements: {
      direction: '东南',
      color: '青色',
      number: [4, 6, 46],
      time: '巳时'
    }
  },
  '47': {
    poem: '与君万里若比邻，不用愁来不用忧。中心正直神明佑，财禄丰盈不用求。',
    meaning: '万里比邻，神明庇佑',
    interpretation: '此签大吉，表示即使相距万里也如比邻。心正神明佑，财禄自然来，不用忧愁。',
    category: '上吉签',
    advice: '心正神佑，财禄自来，不用忧愁',
    luckyElements: {
      direction: '中央',
      color: '金色',
      number: [4, 7, 47],
      time: '午时'
    }
  },
  '48': {
    poem: '登山涉水正艰难，举足提心不自安。莫听闲言并冷语，紫袍金带到君前。',
    meaning: '登山涉水，终得荣华',
    interpretation: '此签表示虽然过程艰难，但不要听信闲言冷语。坚持下去，最终会获得荣华富贵。',
    category: '中吉签',
    advice: '坚持不懈，不听闲言，终得荣华',
    luckyElements: {
      direction: '西南',
      color: '紫色',
      number: [4, 8, 48],
      time: '申时'
    }
  },
  '49': {
    poem: '彼此居心不相同，口是心非意不通。须防人口舌是非，免致灾殃在其中。',
    meaning: '居心不同，防范是非',
    interpretation: '此签提醒要防范小人，彼此居心不同，口是心非。要小心口舌是非，避免灾殃。',
    category: '下签',
    advice: '防范小人，谨言慎行，避免是非',
    luckyElements: {
      direction: '北方',
      color: '黑色',
      number: [4, 9, 49],
      time: '子时'
    }
  },
  '50': {
    poem: '一朵鲜花镜中开，看来极好取应难。劝君莫恋镜中花，若是恋时空费心。',
    meaning: '镜花水月，空费心机',
    interpretation: '此签提醒不要追求虚幻的东西，如镜中花水中月。看似美好但难以得到，会空费心机。',
    category: '下签',
    advice: '不恋虚幻，脚踏实地，避免空想',
    luckyElements: {
      direction: '西方',
      color: '白色',
      number: [5, 0, 50],
      time: '酉时'
    }
  },
  '51': {
    poem: '君今庚甲未亨通，且向江头作钓翁。玉兔重生应发迹，万人头上逞英雄。',
    meaning: '暂时不通，终成英雄',
    interpretation: '此签表示目前运势不佳，需要耐心等待。如钓翁般静待时机，玉兔重生时必能发迹成功。',
    category: '中吉签',
    advice: '耐心等待，静待时机，终成英雄',
    luckyElements: {
      direction: '东方',
      color: '银色',
      number: [5, 1, 51],
      time: '卯时'
    }
  },
  '52': {
    poem: '一舟行货好招财，积少成多自此来。常把他人比自己，管须日后得荣华。',
    meaning: '积少成多，日后荣华',
    interpretation: '此签表示要像商船载货一样积少成多。常与他人比较学习，日后必能获得荣华富贵。',
    category: '中吉签',
    advice: '积少成多，学习他人，日后荣华',
    luckyElements: {
      direction: '南方',
      color: '金色',
      number: [5, 2, 52],
      time: '午时'
    }
  },
  '53': {
    poem: '艰难险阻路蹊跷，夜静更深渡奈桥。若得贵人来指引，当时得过此关隘。',
    meaning: '艰难险阻，贵人指引',
    interpretation: '此签表示前路艰险，如夜渡奈何桥。但若有贵人指引，必能渡过难关。',
    category: '中平签',
    advice: '寻求贵人，接受指引，渡过难关',
    luckyElements: {
      direction: '北方',
      color: '黑色',
      number: [5, 3, 53],
      time: '子时'
    }
  },
  '54': {
    poem: '万人丛里逞英豪，便欲飞腾霄汉高。争奈承流风未便，青灯黄卷且勤劳。',
    meaning: '英豪之志，勤劳为先',
    interpretation: '此签表示有英豪之志，想要飞腾高远。但时机未到，需要继续勤劳学习，青灯黄卷苦读。',
    category: '中平签',
    advice: '英豪之志，勤劳学习，等待时机',
    luckyElements: {
      direction: '中央',
      color: '黄色',
      number: [5, 4, 54],
      time: '辰时'
    }
  },
  '55': {
    poem: '勤耕力作莫蹉跎，衣食随时安分过。纵使经商收倍利，不如逐步置田禾。',
    meaning: '勤耕力作，安分守己',
    interpretation: '此签劝人勤劳耕作，不要蹉跎岁月。安分过日，即使经商有利，也不如踏实种田。',
    category: '中平签',
    advice: '勤劳耕作，安分守己，踏实为本',
    luckyElements: {
      direction: '东南',
      color: '绿色',
      number: [5, 5, 55],
      time: '巳时'
    }
  },
  '56': {
    poem: '心下了然犹未决，神前卜卦问前程。大抵此事无大害，秋冬渐渐见光明。',
    meaning: '心中未决，渐见光明',
    interpretation: '此签表示心中虽然明白但还未决定。神前求卦问前程，此事无大害，秋冬时节会渐见光明。',
    category: '中吉签',
    advice: '心中明了，耐心等待，秋冬光明',
    luckyElements: {
      direction: '西北',
      color: '白色',
      number: [5, 6, 56],
      time: '戌时'
    }
  },
  '57': {
    poem: '游鱼却在碧波池，撞着渔翁下钓丝。能得几时自在乐，不如收拾入深溪。',
    meaning: '游鱼遇钓，不如深藏',
    interpretation: '此签以游鱼比喻，在浅池容易被钓，不如到深溪中自在。提醒要远离危险，寻找安全之地。',
    category: '中下签',
    advice: '远离危险，寻找安全，深藏不露',
    luckyElements: {
      direction: '北方',
      color: '蓝色',
      number: [5, 7, 57],
      time: '子时'
    }
  },
  '58': {
    poem: '直上高楼去避身，四边绕处是荆榛。天宽地阔无人识，始信明月照古今。',
    meaning: '高楼避身，明月照今',
    interpretation: '此签表示要登高避险，虽然四周荆棘密布，但天宽地阔，明月照古今，终会找到出路。',
    category: '中吉签',
    advice: '登高避险，天宽地阔，终有出路',
    luckyElements: {
      direction: '上方',
      color: '银色',
      number: [5, 8, 58],
      time: '子时'
    }
  },
  '59': {
    poem: '门庭清吉梦安然，讼事官非总不干。婚姻子息皆如意，财禄丰盈自有缘。',
    meaning: '门庭清吉，诸事如意',
    interpretation: '此签大吉，门庭清净吉祥，梦境安然。官司是非不沾身，婚姻子息皆如意，财禄丰盈有缘分。',
    category: '上吉签',
    advice: '门庭清吉，诸事如意，财禄有缘',
    luckyElements: {
      direction: '中央',
      color: '金色',
      number: [5, 9, 59],
      time: '午时'
    }
  },
  '60': {
    poem: '心中事务正纷纷，水远山遥路不分。凡事且宜守旧日，到头终久得安身。',
    meaning: '事务纷纷，守旧安身',
    interpretation: '此签表示心中事务繁多，前路不明。凡事宜守旧不变，到头来终能安身立命。',
    category: '中平签',
    advice: '事务繁多，守旧为宜，终得安身',
    luckyElements: {
      direction: '西方',
      color: '白色',
      number: [6, 0, 60],
      time: '酉时'
    }
  },
  '61': {
    poem: '一条金线钓金鳌，个个贤才尽俊豪。三十年来无一事，如今方得贵人招。',
    meaning: '金线钓鳌，贵人相招',
    interpretation: '此签大吉，如金线钓金鳌，个个都是贤才俊豪。三十年来无大事，如今终得贵人相招。',
    category: '上上签',
    advice: '贤才俊豪，贵人相招，大展宏图',
    luckyElements: {
      direction: '东方',
      color: '金色',
      number: [6, 1, 61],
      time: '卯时'
    }
  },
  '62': {
    poem: '一般器用与人同，巧妙君须用意攻。若得贵人相指引，何愁不遇至公卿。',
    meaning: '器用相同，巧妙用心',
    interpretation: '此签表示虽然器用与人相同，但要巧妙用心。若得贵人指引，何愁不能位至公卿。',
    category: '中吉签',
    advice: '巧妙用心，贵人指引，位至公卿',
    luckyElements: {
      direction: '南方',
      color: '紫色',
      number: [6, 2, 62],
      time: '午时'
    }
  },
  '63': {
    poem: '曩时败北且图南，筋力虽衰尚一堪。欲识生前君大数，前三三与后三三。',
    meaning: '败北图南，前后三三',
    interpretation: '此签表示曾经败北，现在图谋向南发展。虽然筋力衰弱但尚能一战，生前大数在前三三与后三三。',
    category: '中平签',
    advice: '败北图南，尚能一战，把握时机',
    luckyElements: {
      direction: '南方',
      color: '红色',
      number: [6, 3, 63],
      time: '午时'
    }
  },
  '64': {
    poem: '朔风凛凛正穷冬，多羡门庭有庆丰。更入新春人事变，满园花柳尽欣荣。',
    meaning: '穷冬过后，春暖花开',
    interpretation: '此签表示虽然现在如穷冬朔风凛凛，但门庭有庆丰。进入新春人事变化，满园花柳欣欣向荣。',
    category: '上吉签',
    advice: '穷冬将过，春暖花开，欣欣向荣',
    luckyElements: {
      direction: '东方',
      color: '绿色',
      number: [6, 4, 64],
      time: '卯时'
    }
  },
  '65': {
    poem: '朝朝役役恰如蜂，飞来飞去西复东。春暖花开能采蜜，何须辛苦觅芳丛。',
    meaning: '役役如蜂，春暖采蜜',
    interpretation: '此签以蜜蜂比喻，朝朝役役飞来飞去。春暖花开时能采到蜜，何须辛苦寻觅芳丛。',
    category: '中吉签',
    advice: '勤劳如蜂，春暖采蜜，不须辛苦',
    luckyElements: {
      direction: '东南',
      color: '黄色',
      number: [6, 5, 65],
      time: '巳时'
    }
  },
  '66': {
    poem: '路险山高不易行，前程渺渺正难明。如今且守分安命，待得天晴事自成。',
    meaning: '路险山高，守分待晴',
    interpretation: '此签表示前路险阻，山高路难行，前程渺茫难明。现在且守本分安命，待得天晴事自成。',
    category: '中下签',
    advice: '路险难行，守分安命，待得天晴',
    luckyElements: {
      direction: '西北',
      color: '灰色',
      number: [6, 6, 66],
      time: '戌时'
    }
  },
  '67': {
    poem: '木有根荄水有源，君恩深处更无言。当时黄菊开金蕊，可卜当年百事全。',
    meaning: '木有根源，君恩深厚',
    interpretation: '此签表示如木有根水有源，君恩深厚无以言表。当时黄菊开金蕊，可卜当年百事俱全。',
    category: '上吉签',
    advice: '根深源远，君恩深厚，百事俱全',
    luckyElements: {
      direction: '中央',
      color: '金色',
      number: [6, 7, 67],
      time: '辰时'
    }
  },
  '68': {
    poem: '南贩珍珠北贩盐，年来几倍货财添。劝君止此求田舍，心欲多时何日厌。',
    meaning: '南北贩卖，货财倍添',
    interpretation: '此签表示南贩珍珠北贩盐，年来货财增加几倍。劝君适可而止求田置舍，心欲太多何日能满足。',
    category: '中吉签',
    advice: '货财倍添，适可而止，知足常乐',
    luckyElements: {
      direction: '南北',
      color: '白色',
      number: [6, 8, 68],
      time: '午时'
    }
  },
  '69': {
    poem: '金鸡报晓时运来，大地阳春暖气回。百花齐放香千里，万紫千红总是春。',
    meaning: '金鸡报晓，春暖花开',
    interpretation: '此签大吉，金鸡报晓时运来，大地回春暖气回。百花齐放香千里，万紫千红总是春。',
    category: '上上签',
    advice: '时运来临，春暖花开，万紫千红',
    luckyElements: {
      direction: '东方',
      color: '彩色',
      number: [6, 9, 69],
      time: '卯时'
    }
  },
  '70': {
    poem: '门衰户冷冷如冰，积善之家庆有余。若是有人行好事，子孙必定挂金鱼。',
    meaning: '门衰户冷，积善有余',
    interpretation: '此签表示虽然门衰户冷如冰，但积善之家必有余庆。若有人行好事，子孙必定富贵如挂金鱼。',
    category: '中吉签',
    advice: '门衰户冷，积善行德，子孙富贵',
    luckyElements: {
      direction: '中央',
      color: '金色',
      number: [7, 0, 70],
      time: '午时'
    }
  },
  '71': {
    poem: '好将心事细思量，天意从来不可量。莫向险中求富贵，安然无事度时光。',
    meaning: '细思心事，安然度日',
    interpretation: '此签劝人要仔细思量心事，天意从来不可测量。不要在险境中求富贵，安然无事度过时光最好。',
    category: '中平签',
    advice: '细思心事，不求险富，安然度日',
    luckyElements: {
      direction: '中央',
      color: '白色',
      number: [7, 1, 71],
      time: '午时'
    }
  },
  '72': {
    poem: '河渠傍路有高低，可叹长途日暮西。纵有荣华能几日，不如安分度朝夕。',
    meaning: '河渠高低，安分度日',
    interpretation: '此签以河渠傍路有高低比喻人生起伏。长途日暮西下，纵有荣华能几日，不如安分度过朝夕。',
    category: '中下签',
    advice: '人生起伏，安分度日，知足常乐',
    luckyElements: {
      direction: '西方',
      color: '橙色',
      number: [7, 2, 72],
      time: '酉时'
    }
  },
  '73': {
    poem: '忙忙碌碌苦追求，何日功名遂所谋。若使有人提拔你，当时得意便无忧。',
    meaning: '忙碌追求，得人提拔',
    interpretation: '此签表示忙忙碌碌苦苦追求，不知何日功名能遂所谋。若有人提拔你，当时得意便无忧。',
    category: '中吉签',
    advice: '忙碌追求，寻求提拔，得意无忧',
    luckyElements: {
      direction: '南方',
      color: '红色',
      number: [7, 3, 73],
      time: '午时'
    }
  },
  '74': {
    poem: '春来雨水太连绵，入夏晴干雨又愆。节气不调难稼穑，直须到秋始得全。',
    meaning: '节气不调，秋始得全',
    interpretation: '此签以天气比喻运势，春雨连绵，夏旱秋涝，节气不调难以耕种。直到秋天才能收获完全。',
    category: '中平签',
    advice: '节气不调，耐心等待，秋始得全',
    luckyElements: {
      direction: '西方',
      color: '金色',
      number: [7, 4, 74],
      time: '酉时'
    }
  },
  '75': {
    poem: '生前结得好缘因，一笑相逢情自亲。相当人事天公共，何须愁虑苦劳心。',
    meaning: '结得好缘，一笑相逢',
    interpretation: '此签表示生前结得好缘分，一笑相逢情自亲。相当的人事天公共见，何须愁虑苦劳心。',
    category: '上吉签',
    advice: '结得好缘，情自相亲，何须愁虑',
    luckyElements: {
      direction: '东南',
      color: '粉色',
      number: [7, 5, 75],
      time: '巳时'
    }
  },
  '76': {
    poem: '三千里外远行人，久客他乡未得归。岁月蹉跎人渐老，音书断绝雁空飞。',
    meaning: '远行未归，音书断绝',
    interpretation: '此签表示三千里外的远行人，久客他乡未能归来。岁月蹉跎人渐老，音书断绝只见雁空飞。',
    category: '下签',
    advice: '远行未归，思念故乡，音书断绝',
    luckyElements: {
      direction: '北方',
      color: '灰色',
      number: [7, 6, 76],
      time: '子时'
    }
  },
  '77': {
    poem: '木兰花谢又花开，开时还似去时栽。可惜园中无好景，一年一度一花来。',
    meaning: '花谢花开，一年一度',
    interpretation: '此签以木兰花比喻，花谢了又开，开时还像去时栽种的一样。可惜园中无好景，一年一度一花来。',
    category: '中平签',
    advice: '花谢花开，循环往复，一年一度',
    luckyElements: {
      direction: '东方',
      color: '白色',
      number: [7, 7, 77],
      time: '卯时'
    }
  },
  '78': {
    poem: '家道兴隆百事宜，庄田禾稼倍收成。蚕桑满箔人安乐，财禄丰盈事事成。',
    meaning: '家道兴隆，百事皆宜',
    interpretation: '此签大吉，家道兴隆百事宜，庄田禾稼倍收成。蚕桑满箔人安乐，财禄丰盈事事成。',
    category: '上上签',
    advice: '家道兴隆，百事皆宜，财禄丰盈',
    luckyElements: {
      direction: '中央',
      color: '金色',
      number: [7, 8, 78],
      time: '午时'
    }
  },
  '79': {
    poem: '久病逢医不用忧，从今以后便安康。云开月出光明现，宛如重日照辉煌。',
    meaning: '久病逢医，云开月现',
    interpretation: '此签表示久病逢医不用忧，从今以后便安康。云开月出光明现，宛如重日照辉煌。',
    category: '上吉签',
    advice: '久病逢医，从此安康，光明辉煌',
    luckyElements: {
      direction: '东方',
      color: '金色',
      number: [7, 9, 79],
      time: '卯时'
    }
  },
  '80': {
    poem: '一朵梅花天地春，和风消息遍传闻。异香扑鼻知多少，恰似仙山处处闻。',
    meaning: '梅花天地，异香扑鼻',
    interpretation: '此签大吉，一朵梅花带来天地春意，和风消息遍传闻。异香扑鼻知多少，恰似仙山处处闻。',
    category: '上上签',
    advice: '梅花报春，异香扑鼻，仙山处处',
    luckyElements: {
      direction: '东方',
      color: '白色',
      number: [8, 0, 80],
      time: '卯时'
    }
  },
  '81': {
    poem: '石中藏玉有谁知，良工巧匠能雕琢。凿开顽石方成器，一举成名天下知。',
    meaning: '石中藏玉，良工雕琢',
    interpretation: '此签表示石中藏玉有谁知，需要良工巧匠能雕琢。凿开顽石方成器，一举成名天下知。',
    category: '上吉签',
    advice: '石中藏玉，良工雕琢，一举成名',
    luckyElements: {
      direction: '中央',
      color: '白色',
      number: [8, 1, 81],
      time: '辰时'
    }
  },
  '82': {
    poem: '早岁青春谩读书，年来白发叹功疏。若不回心求佛道，世间何处有安居。',
    meaning: '早岁读书，回心求道',
    interpretation: '此签表示早岁青春虽然读书，年来白发叹功疏。若不回心求佛道，世间何处有安居。',
    category: '中下签',
    advice: '早岁读书，回心求道，寻求安居',
    luckyElements: {
      direction: '西方',
      color: '白色',
      number: [8, 2, 82],
      time: '酉时'
    }
  },
  '83': {
    poem: '一纸官书火急催，扁舟速下浪如雷。虽然目下多惊险，保汝平安去复回。',
    meaning: '官书火急，平安往返',
    interpretation: '此签表示一纸官书火急催促，扁舟速下浪如雷。虽然目下多惊险，保你平安去复回。',
    category: '中吉签',
    advice: '官书火急，虽有惊险，平安往返',
    luckyElements: {
      direction: '南方',
      color: '红色',
      number: [8, 3, 83],
      time: '午时'
    }
  },
  '84': {
    poem: '一春风雨正潇潇，千里行人去路遥。移花接木皆非旧，纵有功名不足豪。',
    meaning: '风雨潇潇，移花接木',
    interpretation: '此签表示一春风雨正潇潇，千里行人去路遥。移花接木皆非旧，纵有功名不足豪。',
    category: '中下签',
    advice: '风雨潇潇，路途遥远，功名不足',
    luckyElements: {
      direction: '北方',
      color: '黑色',
      number: [8, 4, 84],
      time: '子时'
    }
  },
  '85': {
    poem: '一锭黄金两锭银，库中积蓄有千金。只因守者非其主，到底成空费尽心。',
    meaning: '黄金白银，守非其主',
    interpretation: '此签表示一锭黄金两锭银，库中积蓄有千金。只因守者非其主，到底成空费尽心。',
    category: '下签',
    advice: '黄金白银，守非其主，终成空费',
    luckyElements: {
      direction: '西方',
      color: '金色',
      number: [8, 5, 85],
      time: '酉时'
    }
  },
  '86': {
    poem: '一舟行货好招财，积少成多自此来。常把他人比自己，管须日后得荣华。',
    meaning: '一舟招财，积少成多',
    interpretation: '此签表示一舟行货好招财，积少成多自此来。常把他人比自己，管须日后得荣华。',
    category: '中吉签',
    advice: '一舟招财，积少成多，日后荣华',
    luckyElements: {
      direction: '东南',
      color: '蓝色',
      number: [8, 6, 86],
      time: '巳时'
    }
  },
  '87': {
    poem: '一马当先去路遥，任君驰骋显英豪。前程远大无人阻，富贵荣华乐逍遥。',
    meaning: '一马当先，前程远大',
    interpretation: '此签大吉，一马当先去路遥，任君驰骋显英豪。前程远大无人阻，富贵荣华乐逍遥。',
    category: '上上签',
    advice: '一马当先，前程远大，富贵荣华',
    luckyElements: {
      direction: '南方',
      color: '红色',
      number: [8, 7, 87],
      time: '午时'
    }
  },
  '88': {
    poem: '从前作事总徒然，今日方知学道难。苦海无边回头岸，早悟兰因续夙缘。',
    meaning: '从前徒然，回头是岸',
    interpretation: '此签表示从前作事总徒然，今日方知学道难。苦海无边回头岸，早悟兰因续夙缘。',
    category: '中吉签',
    advice: '从前徒然，回头是岸，续夙缘分',
    luckyElements: {
      direction: '西方',
      color: '白色',
      number: [8, 8, 88],
      time: '酉时'
    }
  },
  '89': {
    poem: '樵夫砍柴上高山，路险崎岖行步难。今日得樵归去晚，家中父母望儿还。',
    meaning: '樵夫砍柴，父母望归',
    interpretation: '此签表示樵夫砍柴上高山，路险崎岖行步难。今日得樵归去晚，家中父母望儿还。',
    category: '中平签',
    advice: '樵夫砍柴，路险难行，父母望归',
    luckyElements: {
      direction: '北方',
      color: '绿色',
      number: [8, 9, 89],
      time: '子时'
    }
  },
  '90': {
    poem: '崆峒城里事如麻，无事如君有几家。劝汝不须频问卜，登山涉水觅仙槎。',
    meaning: '事如乱麻，觅仙求道',
    interpretation: '此签表示崆峒城里事如麻，无事如君有几家。劝你不须频问卜，登山涉水觅仙槎。',
    category: '中下签',
    advice: '事如乱麻，不须问卜，觅仙求道',
    luckyElements: {
      direction: '西北',
      color: '灰色',
      number: [9, 0, 90],
      time: '戌时'
    }
  },
  '91': {
    poem: '佛说淘沙始见金，只缘君子未专心。荣华总是三更梦，富贵还同九月霜。',
    meaning: '淘沙见金，荣华如梦',
    interpretation: '此签表示佛说淘沙始见金，只缘君子未专心。荣华总是三更梦，富贵还同九月霜。',
    category: '中下签',
    advice: '淘沙见金，专心致志，荣华如梦',
    luckyElements: {
      direction: '西方',
      color: '金色',
      number: [9, 1, 91],
      time: '酉时'
    }
  },
  '92': {
    poem: '今年禾稼颇收成，耕种须知不可轻。秋实既成当爱惜，粒粒皆从血汗生。',
    meaning: '禾稼收成，粒粒血汗',
    interpretation: '此签表示今年禾稼颇收成，耕种须知不可轻。秋实既成当爱惜，粒粒皆从血汗生。',
    category: '中吉签',
    advice: '禾稼收成，珍惜成果，粒粒血汗',
    luckyElements: {
      direction: '东南',
      color: '金色',
      number: [9, 2, 92],
      time: '巳时'
    }
  },
  '93': {
    poem: '春夏秋冬四季宜，荣华富贵有何疑。宅舍安宁多吉庆，妻儿老少尽欢怡。',
    meaning: '四季皆宜，荣华富贵',
    interpretation: '此签大吉，春夏秋冬四季宜，荣华富贵有何疑。宅舍安宁多吉庆，妻儿老少尽欢怡。',
    category: '上上签',
    advice: '四季皆宜，荣华富贵，家庭和睦',
    luckyElements: {
      direction: '中央',
      color: '金色',
      number: [9, 3, 93],
      time: '午时'
    }
  },
  '94': {
    poem: '忽然一日起风雷，不比从前事事乖。若得贵人来指引，前程万里正恢恢。',
    meaning: '风雷突起，贵人指引',
    interpretation: '此签表示忽然一日起风雷，不比从前事事乖。若得贵人来指引，前程万里正恢恢。',
    category: '上吉签',
    advice: '风雷突起，贵人指引，前程万里',
    luckyElements: {
      direction: '东方',
      color: '蓝色',
      number: [9, 4, 94],
      time: '卯时'
    }
  },
  '95': {
    poem: '君是山中一朵花，若逢春色倍光华。堪羡枝头结成果，收成全在晚秋时。',
    meaning: '山中之花，晚秋结果',
    interpretation: '此签表示君是山中一朵花，若逢春色倍光华。堪羡枝头结成果，收成全在晚秋时。',
    category: '中吉签',
    advice: '山中之花，春色光华，晚秋结果',
    luckyElements: {
      direction: '西方',
      color: '红色',
      number: [9, 5, 95],
      time: '酉时'
    }
  },
  '96': {
    poem: '婚姻子息莫嫌迟，但把精神仗佛持。四十年前须报应，功圆行满有何疑。',
    meaning: '婚姻子息，功圆行满',
    interpretation: '此签表示婚姻子息莫嫌迟，但把精神仗佛持。四十年前须报应，功圆行满有何疑。',
    category: '上吉签',
    advice: '婚姻子息，仗佛精神，功圆行满',
    luckyElements: {
      direction: '中央',
      color: '金色',
      number: [9, 6, 96],
      time: '午时'
    }
  },
  '97': {
    poem: '五湖四海任君游，发达荣华不用愁。若问前程何日至，秋来定得一枝秋。',
    meaning: '五湖四海，秋来得志',
    interpretation: '此签大吉，五湖四海任君游，发达荣华不用愁。若问前程何日至，秋来定得一枝秋。',
    category: '上上签',
    advice: '五湖四海，发达荣华，秋来得志',
    luckyElements: {
      direction: '四方',
      color: '金色',
      number: [9, 7, 97],
      time: '酉时'
    }
  },
  '98': {
    poem: '一见如故两相投，月下花前倍绸缪。恰似鸳鸯水上戏，双双飞向凤凰楼。',
    meaning: '一见如故，鸳鸯戏水',
    interpretation: '此签大吉，一见如故两相投，月下花前倍绸缪。恰似鸳鸯水上戏，双双飞向凤凰楼。',
    category: '上上签',
    advice: '一见如故，两相投缘，双双飞翔',
    luckyElements: {
      direction: '南方',
      color: '红色',
      number: [9, 8, 98],
      time: '午时'
    }
  },
  '99': {
    poem: '一片明珠掌上安，纵横四海任君看。若问前程何日至，更须待过十三关。',
    meaning: '明珠在掌，过十三关',
    interpretation: '此签表示一片明珠掌上安，纵横四海任君看。若问前程何日至，更须待过十三关。',
    category: '中吉签',
    advice: '明珠在掌，纵横四海，过十三关',
    luckyElements: {
      direction: '中央',
      color: '白色',
      number: [9, 9, 99],
      time: '午时'
    }
  },
  '100': {
    poem: '一朝无事忽遭官，也是前生种祸根。药医不死病，佛度有缘人。',
    meaning: '圆满功德，佛度有缘',
    interpretation: '此签为第一百签，代表圆满。虽然可能遇到困难，但这都是前因后果。药医不死病，佛度有缘人，一切都是最好的安排。',
    category: '上吉签',
    advice: '圆满功德，佛度有缘，一切安排',
    luckyElements: {
      direction: '中央',
      color: '金色',
      number: [1, 0, 0, 100],
      time: '午时'
    }
  }
};