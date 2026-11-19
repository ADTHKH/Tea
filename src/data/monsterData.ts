import { EmotionId, TeaMonster, TeaProduct, EmotionOption } from '../types/tea';

// Base traits mapping for the 6 official teas
const MONSTER_SPECIES_NAMES: Record<string, Record<EmotionId, { name: string; title: string; creatureType: string; element: '清露' | '熾木' | '嵐霧' | '春泉' | '沉香' | '靈火' }>> = {
  // 1. 木柵鐵觀音
  'muzha-tieguanyin': {
    calm: { name: '炭息玄龜 (Tan Xi)', title: '伏在龍眼木炭火中入定的百年壽仙', creatureType: '玄武炭石龜', element: '沉香' },
    warm: { name: '焙香憨火獅 (Han Shi)', title: '肚子咕嚕咕嚕像焙籠的小暖獅', creatureType: '炭火紅鬃獅', element: '靈火' },
    joy: { name: '果酸小栗鼠 (Guo Shu)', title: '私藏了整座貓空弱果酸蜜果的精靈', creatureType: '栗毛飛鼠靈', element: '熾木' },
    nostalgic: { name: '觀音老靈貓 (Lao Mao)', title: '眼神看穿所有沉浮的貓空隱士', creatureType: '太極花面貓', element: '沉香' },
    vibrant: { name: '鐵骨穿山甲 (Tie Gu)', title: '身披重焙鐵甲、勇往直前的守護者', creatureType: '金甲靈穿山獸', element: '沉香' },
    grounded: { name: '盤石太公 (Pan Shi)', title: '如指南宮石階般沉穩不動的磐石神', creatureType: '岩石巨靈翁', element: '沉香' }
  },

  // 2. 文山包種茶
  'wenshan-baozhong': {
    calm: { name: '幽蘭青蛇 (You Lan)', title: '隱身在文山竹林間的清雅君子', creatureType: '翠竹青龍靈', element: '春泉' },
    warm: { name: '茶湯水獺 (Shui Ta)', title: '最愛用肚皮溫熱包種茶杯的懶懶獺', creatureType: '溪澗靈獺', element: '清露' },
    joy: { name: '青芒蜂鳥 (Qing Mang)', title: '在梔子花與野薑花間旋轉的飛行精靈', creatureType: '翠羽微型鳥', element: '春泉' },
    nostalgic: { name: '煙雨水靈 (Yan Yu)', title: '坪林濛濛細雨中凝結的水滴娃娃', creatureType: '青雨凝晶精靈', element: '嵐霧' },
    vibrant: { name: '春芽跳跳狸 (Tiao Tiao)', title: '剛採下的鮮嫩茶青化身的小活寶', creatureType: '嫩芽松鼠獸', element: '春泉' },
    grounded: { name: '石碇青蛙 (Qing Wa)', title: '坐在翡翠水庫岩盤上的定力大師', creatureType: '碧玉蓮葉蛙', element: '沉香' }
  },
  'wenshan-pouchong': {
    calm: { name: '幽蘭青蛇 (You Lan)', title: '隱身在文山竹林間的清雅君子', creatureType: '翠竹青龍靈', element: '春泉' },
    warm: { name: '茶湯水獺 (Shui Ta)', title: '最愛用肚皮溫熱茶杯的懶懶獺', creatureType: '溪澗靈獺', element: '清露' },
    joy: { name: '青芒蜂鳥 (Qing Mang)', title: '在白色梔子花間旋轉的飛行精靈', creatureType: '翠羽微型鳥', element: '春泉' },
    nostalgic: { name: '煙雨水靈 (Yan Yu)', title: '坪林濛濛細雨中凝結的水滴娃娃', creatureType: '青雨凝晶精靈', element: '嵐霧' },
    vibrant: { name: '春芽跳跳狸 (Tiao Tiao)', title: '剛採下的鮮嫩茶青化身的小活寶', creatureType: '嫩芽松鼠獸', element: '春泉' },
    grounded: { name: '石碇青蛙 (Qing Wa)', title: '坐在翡翠水庫岩盤上的定力大師', creatureType: '碧玉蓮葉蛙', element: '沉香' }
  },

  // 3. 鐵觀音紅茶
  'tieguanyin-black': {
    calm: { name: '赤玉玄龜 (Chi Yu)', title: '在灩紅茶湯深處靜臥的水仙靈', creatureType: '紅晶靈龜', element: '清露' },
    warm: { name: '蜜韻焦糖狸 (Jiao Tang)', title: '尾巴散發濃醇蜜果甜香的暖心貓', creatureType: '赤焰蜜狸', element: '靈火' },
    joy: { name: '金圈焰雀 (Yan Que)', title: '沿著茶杯金黃光圈跳躍的歡樂鳥', creatureType: '火羽跳跳雀', element: '熾木' },
    nostalgic: { name: '赤火狐仙 (Chi Hu)', title: '在百年木炭堆邊講古的長尾狐', creatureType: '九曲仙狐', element: '沉香' },
    vibrant: { name: '日昇朱雀 (Zhu Que)', title: '從紅艷茶湯中破曉而出的晨光鳥', creatureType: '赤羽神鳥', element: '靈火' },
    grounded: { name: '紅土古樹翁 (Shu Weng)', title: '融合鐵骨與紅茶底蘊的長青樹仙', creatureType: '老根巨靈木', element: '熾木' }
  },

  // 4. 台灣高山烏龍茶
  'taiwan-gaoshan-oolong': {
    calm: { name: '雲岫靈鹿 (Yun Xiu)', title: '高山霧海的深呼吸使者', creatureType: '雲角仙鹿獸', element: '嵐霧' },
    warm: { name: '暖嵐茸兔 (Nuan Lan)', title: '抱著茶茶石的暖心毛球', creatureType: '蓬鬆雪耳兔', element: '清露' },
    joy: { name: '甘泉躍雀 (Yue Que)', title: '在冷泉山風中唱歌的跳跳鳥', creatureType: '金翎靈雀', element: '春泉' },
    nostalgic: { name: '松風孤鶴 (Song Feng)', title: '見證高山百年歲月的沉思者', creatureType: '雲翼仙鶴', element: '沉香' },
    vibrant: { name: '翠巔雲豹 (Cui Dian)', title: '奔馳在玉山鞍部的晨光守護者', creatureType: '高山靈豹', element: '春泉' },
    grounded: { name: '嶺石憨熊 (Ling Shi)', title: '如青苔巨岩般安詳入定的山神', creatureType: '苔原巨石熊', element: '沉香' }
  },
  'alishan-oolong': {
    calm: { name: '雲岫靈鹿 (Yun Xiu)', title: '高山霧海的深呼吸使者', creatureType: '雲角仙鹿獸', element: '嵐霧' },
    warm: { name: '暖嵐茸兔 (Nuan Lan)', title: '抱著茶茶石的暖心毛球', creatureType: '蓬鬆雪耳兔', element: '清露' },
    joy: { name: '甘泉躍雀 (Yue Que)', title: '在冷泉山風中唱歌的跳跳鳥', creatureType: '金翎靈雀', element: '春泉' },
    nostalgic: { name: '松風孤鶴 (Song Feng)', title: '見證高山百年歲月的沉思者', creatureType: '雲翼仙鶴', element: '沉香' },
    vibrant: { name: '翠巔雲豹 (Cui Dian)', title: '奔馳在玉山鞍部的晨光守護者', creatureType: '高山靈豹', element: '春泉' },
    grounded: { name: '嶺石憨熊 (Ling Shi)', title: '如青苔巨岩般安詳入定的山神', creatureType: '苔原巨石熊', element: '沉香' }
  },

  // 5. 金萱烏龍茶
  'jinxuan-oolong': {
    calm: { name: '白乳天鵝 (Tian E)', title: '滑行於清澈金黃茶湯上的優雅仙羽', creatureType: '金羽靈天鵝', element: '清露' },
    warm: { name: '奶香棉花羊 (Mian Hua)', title: '全身蓬鬆自帶天然牛奶甜味的溫暖羊', creatureType: '絨雲金角羊', element: '春泉' },
    joy: { name: '桂花飛天鼠 (Gui Hua)', title: '在金萱花香枝頭歡快彈跳的小松鼠', creatureType: '糖香靈飛鼠', element: '春泉' },
    nostalgic: { name: '金萱仙蝶 (Xian Die)', title: '記錄四十載培育傳奇的金色歲月蝶', creatureType: '金絲幻影蝶', element: '沉香' },
    vibrant: { name: '晨曦跳躍羚 (Tiao Ling)', title: '踏著滿山茶園露珠的朝氣小羚羊', creatureType: '靈光小金羚', element: '春泉' },
    grounded: { name: '茶園黃牛仙 (Niu Xian)', title: '默默耕耘守護台茶12號的忠厚神獸', creatureType: '大地金牛靈', element: '沉香' }
  },

  // 6. 台灣四季春
  'taiwan-sijichun': {
    calm: { name: '四季青竹精 (Qing Zhu)', title: '生長於八卦山台地的長青隱士', creatureType: '翠玉竹精靈', element: '春泉' },
    warm: { name: '暖春花絨兔 (Hua Rong)', title: '收集了一整季百合野花香的小毛兔', creatureType: '野花暖耳兔', element: '清露' },
    joy: { name: '野趣百合蜂 (Bai He)', title: '在奔放花香中快樂飛舞的釀蜜先鋒', creatureType: '晶翼彩斑蜂', element: '春泉' },
    nostalgic: { name: '常春老樹仙 (Chang Chun)', title: '四季長青、看盡歲月輪轉的茶鄉老樹', creatureType: '千歲長青靈', element: '沉香' },
    vibrant: { name: '驚蟄青雷豹 (Lei Bao)', title: '生命力極度旺盛的四季春原野疾走豹', creatureType: '青霆迅影豹', element: '春泉' },
    grounded: { name: '名間石敢當 (Shi Gan)', title: '守護紅土台地的沉穩大地石靈', creatureType: '八卦巨石將', element: '沉香' }
  }
};

const SKILLS_MAP: Record<EmotionId, string> = {
  calm: '【心如止水】：展開直徑五米的安神茶界，瞬間撫平所有焦慮雜念。',
  warm: '【恆溫焙香】：散發38.5度的胸口暖流，宛如捧著一杯初沸好茶。',
  joy: '【回甘火花】：隨機彈出三顆蜜糖靈感泡泡，觸碰即激發全新想像！',
  nostalgic: '【時光倒影】：在茶湯倒影中映照出某段珍貴記憶中最溫暖的笑臉。',
  vibrant: '【生津湧泉】：瞬間注入75%的草木鮮氧，思緒神采飛揚，活力滿格！',
  grounded: '【如磐石定】：生出深植地心之根，任憑外界喧囂動盪，心志巋然不動。'
};

const FORTUNES_MAP: Record<EmotionId, string[]> = {
  calm: [
    '「浮雲吹作雪，世味煮成茶。今日宜慢下腳步，靜坐聽風。」',
    '「心若澄澈，無處不是青山。讓紛擾隨這口茶湯緩緩沉澱。」'
  ],
  warm: [
    '「人間煙火氣，最撫凡人心。今日會有意料之外的溫柔相遇。」',
    '「無論外面風雨多大，你的心裡永遠有一爐煮茶的炭火在溫暖著你。」'
  ],
  joy: [
    '「茶香生妙境，筆下有星辰。今日大膽嘗試那個剛萌芽的點子吧！」',
    '「回甘如蜜，好事將近。用微笑接住今天撲面而來的所有小幸運。」'
  ],
  nostalgic: [
    '「山中何事？松花釀酒，春水煎茶。那些走過的時光都化作了喉底甘醇。」',
    '「有些滋味需要時間沉澱才能懂得，願你溫柔對待自己的每一段過往。」'
  ],
  vibrant: [
    '「春風得意馬蹄疾，一日看盡長安花。今天是你破局前行的最佳時刻！」',
    '「精神百倍，神采飛揚！帶著茶葉的昂揚綠意，把想做的事做成。」'
  ],
  grounded: [
    '「深根固柢，泰然處之。踏實走好每一步，時間自會給你最好的答案。」',
    '「如岩茶般經得起千錘百鍊與慢火細烘，你的底蘊比想像中更加深厚。」'
  ]
};

export function generateTeaMonster(tea: TeaProduct, emotion: EmotionOption, customTexts?: Record<string, string>): TeaMonster {
  const teaConfig = MONSTER_SPECIES_NAMES[tea.id] || MONSTER_SPECIES_NAMES['muzha-tieguanyin'] || MONSTER_SPECIES_NAMES['taiwan-gaoshan-oolong'];
  const species = (teaConfig && teaConfig[emotion.id]) || {
    name: '茶靈祥獸',
    title: '茶香凝聚之神祕生靈',
    creatureType: '靈韻神獸',
    element: '春泉' as const
  };

  const customName = customTexts?.[`monster-${emotion.id}-name`];
  const customFortune = customTexts?.[`monster-${emotion.id}-fortune`];
  const customSkill = customTexts?.[`monster-${emotion.id}-skill`];
  const customPersonality = customTexts?.[`monster-${emotion.id}-personality`];

  const fortuneList = FORTUNES_MAP[emotion.id];
  const defaultFortune = fortuneList[Math.floor(Math.random() * fortuneList.length)];

  // Rarity determination
  const rarities: ('SSR 靈品' | 'SR 逸品' | 'SR 逸品' | 'R 佳品')[] = ['SSR 靈品', 'SR 逸品', 'SR 逸品', 'R 佳品'];
  const rarity = rarities[Math.floor(Math.random() * rarities.length)];

  // Calculate power stats based on tea & emotion
  const aromaBase = Math.round(50 + tea.oxidation * 0.3 + (emotion.id === 'joy' ? 20 : 10));
  const sweetnessBase = Math.round(45 + (100 - tea.roastLevel) * 0.2 + (emotion.id === 'warm' ? 25 : 12));
  const calmnessBase = Math.round(60 + tea.roastLevel * 0.25 + (emotion.id === 'calm' || emotion.id === 'grounded' ? 25 : 5));
  const energyBase = Math.round(40 + (100 - tea.oxidation) * 0.35 + (emotion.id === 'vibrant' ? 30 : 8));

  return {
    id: `MONSTER_${tea.id.toUpperCase()}_${emotion.id.toUpperCase()}`,
    name: customName || species.name,
    title: species.title,
    teaId: tea.id,
    teaName: tea.name,
    emotionId: emotion.id,
    emotionLabel: emotion.label,
    creatureType: species.creatureType,
    personality: customPersonality || emotion.description,
    story: `吸納了天地清芬與茶湯香氣，在心境轉化為「${emotion.label}」的剎那，茶湯蒸氣凝華化靈，伴隨悠揚茶香顯化真身。`,
    rarity,
    primaryColor: tea.soupColorHex,
    secondaryColor: emotion.colorTheme.accent,
    element: species.element,
    specialSkill: customSkill || SKILLS_MAP[emotion.id],
    teaFortune: customFortune || defaultFortune,
    powerStats: {
      aroma: Math.min(99, aromaBase),
      sweetness: Math.min(99, sweetnessBase),
      calmness: Math.min(99, calmnessBase),
      energy: Math.min(99, energyBase)
    }
  };
}
