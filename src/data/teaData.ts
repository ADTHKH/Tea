import { TeaProduct, EmotionOption } from '../types/tea';

export const TEAS: TeaProduct[] = [
  {
    id: 'muzha-tieguanyin',
    name: '木柵鐵觀音',
    englishName: 'Muzha Tieguanyin Oolong',
    category: '烏龍茶',
    origin: '台北市文山區木柵貓空茶區',
    altitude: '300 - 500 公尺',
    oxidation: 50,
    roastLevel: 80,
    soupColor: '琥珀澄紅，亮澤油潤',
    soupColorHex: '#B85B22',
    aromaNotes: ['純陽火韻', '弱果酸生津', '熟果陳香', '深邃炭焙'],
    flavorProfile: '入口滋味醇厚帶微弱生津果酸，炭焙香氣深邃，回甘綿長喉韻十足。',
    cupColorHex: '#7C3A21',
    sensorRfId: '0277537540',
    tagRfidNumber: 'NFC# 0277537540',
    nfcChipUid: '0277537540',
    description: '傳承安溪正欉古法，以布包緊密團揉並經龍眼木炭火反覆慢火細焙，淬鍊出特有的「觀音韻」與醇厚微酸的喉韻回甘。',
    processSteps: [
      {
        id: 1,
        title: '正欉手採茶青',
        subTitle: '開面一心二三葉',
        durationSec: 6.0,
        description: '於春秋適當成熟期採摘頂級正欉鐵觀音成熟茶青，葉質肥厚。',
        craftDetails: '保持葉片完好無傷，蓄積豐富多元的茶多酚與芳香化合物。',
        temperature: '24°C 晴晨',
        visualTag: '開面手採'
      },
      {
        id: 2,
        title: '日光萎凋與浪青',
        subTitle: '日照走水活化酵素',
        durationSec: 6.0,
        description: '置於竹篩經柔和日光萎凋，再入室內反覆攪拌靜置，促使綠葉紅鑲邊。',
        craftDetails: '控制水分由葉緣均勻發散，轉化生成獨特之熟果幽香。',
        temperature: '26°C 日照 / 22°C 室內',
        visualTag: '浪青生香'
      },
      {
        id: 3,
        title: '高溫炒青（殺青）',
        subTitle: '制止發酵鎖住韻味',
        durationSec: 6.0,
        description: '投入高溫滾筒鍋中殺青，精準抑制酵素氧化活性，去其生澀。',
        craftDetails: '葉質柔軟適中，為後續繁複布包重揉提供極佳延展性。',
        temperature: '260°C 滾筒',
        visualTag: '炒青鎖韻'
      },
      {
        id: 4,
        title: '布包團揉熱塑形',
        subTitle: '反覆布包緊結成球',
        durationSec: 6.0,
        description: '以白布巾包裹加熱茶坯，雙手與木機反覆加壓揉捻成緊結顆粒。',
        craftDetails: '使茶葉細胞破裂溢出茶汁，凝固於葉表，成就耐泡茶質。',
        temperature: '65°C 溫熱團揉',
        visualTag: '布包揉捻'
      },
      {
        id: 5,
        title: '龍眼炭火重烘焙',
        subTitle: '百年炭焙慢火生香',
        durationSec: 6.0,
        description: '使用無煙龍眼木炭慢火深層烘焙數十小時，焙火透心、化澀為甘。',
        craftDetails: '形成純陽之火韻與天然弱果酸生津，越陳越顯厚實芬芳。',
        temperature: '105°C 炭火慢焙',
        visualTag: '炭火淬煉'
      }
    ]
  },
  {
    id: 'wenshan-baozhong',
    name: '文山包種茶',
    englishName: 'Wenshan Baozhong Tea',
    category: '包種茶',
    origin: '新北市坪林、石碇、文山茶區',
    altitude: '400 - 600 公尺',
    oxidation: 15,
    roastLevel: 10,
    soupColor: '蜜黃碧綠，金黃透澈',
    soupColorHex: '#D4C948',
    aromaNotes: ['野薑花幽香', '梔子花芬芳', '清泉甘露', '雅緻花果香'],
    flavorProfile: '茶湯清雅甘醇，花香撲鼻如蘭，入口滑潤清甜、落喉甘潤生津。',
    cupColorHex: '#52796F',
    sensorRfId: '0277538052',
    tagRfidNumber: 'NFC# 0277538052',
    nfcChipUid: '0277538052',
    description: '素有「香、濃、醇、韻、美」五字美譽，為台灣最具代表性的輕發酵條型名茶。香氣清雅高昂，宛如走入初春山林花海。',
    processSteps: [
      {
        id: 1,
        title: '山嵐晨採',
        subTitle: '手採嫩梢一心二葉',
        durationSec: 6.0,
        description: '清晨薄霧散去之際，採摘文山翠綠嫩芽茶葉。',
        craftDetails: '輕採輕放避免折傷葉片，保持天然鮮活花香香氣基質。',
        temperature: '21°C 山風',
        visualTag: '翠綠嫩梢'
      },
      {
        id: 2,
        title: '輕度日光萎凋',
        subTitle: '短時溫柔微散水氣',
        durationSec: 6.0,
        description: '在晨光微曦中薄攤於竹蓆，使茶青適度失水軟化。',
        craftDetails: '激活花香芬芳酶系統，散發出清新高雅之花草清香。',
        temperature: '26°C 晨曦光芒',
        visualTag: '薄攤萎凋'
      },
      {
        id: 3,
        title: '室內靜置攪拌',
        subTitle: '輕手翻浪慢走水',
        durationSec: 6.0,
        description: '在恆溫室內進行數次輕手攪拌，使葉緣輕微摩擦走水。',
        craftDetails: '促成「綠葉白底紅點」的適度微發酵，凝聚撲鼻花香。',
        temperature: '22°C 靜置室',
        visualTag: '翻浪生花'
      },
      {
        id: 4,
        title: '高溫炒青護香',
        subTitle: '迅疾炒青定格花芬',
        durationSec: 6.0,
        description: '以精準高溫殺青鍋迅速炒青，完美封存最純淨的梔子花野薑花香。',
        craftDetails: '破壞氧化酶同時維持茶湯蜜綠鮮爽色澤。',
        temperature: '280°C 鍋炒',
        visualTag: '定格花香'
      },
      {
        id: 5,
        title: '解塊成條慢乾燥',
        subTitle: '保留自然自然條索',
        durationSec: 6.0,
        description: '輕度揉捻成自然微捲條形，隨即低溫慢火烘乾至極致香醇。',
        craftDetails: '條索緊結墨綠，沖泡時如葉脈隨水舒展，甘芳四溢。',
        temperature: '85°C 慢風乾',
        visualTag: '條索舒展'
      }
    ]
  },
  {
    id: 'tieguanyin-black',
    name: '鐵觀音紅茶',
    englishName: 'Tieguanyin Black Tea',
    category: '紅茶',
    origin: '台灣文山茶區 / 特色高山茶區',
    altitude: '400 - 700 公尺',
    oxidation: 90,
    roastLevel: 40,
    soupColor: '灩紅金圈，艷麗深邃',
    soupColorHex: '#9E2A2B',
    aromaNotes: ['熟成蜜糖香', '鐵觀音焙火底蘊', '荔枝熟果', '醇厚甘甜'],
    flavorProfile: '結合全發酵紅茶的甜潤蜜香與鐵觀音特有的醇厚焙火底蘊，圓融飽滿，蜜韻回味悠長。',
    cupColorHex: '#8B1E0F',
    sensorRfId: '0278427396',
    tagRfidNumber: 'NFC# 0278427396',
    nfcChipUid: '0278427396',
    description: '嚴選正欉鐵觀音品種之茶葉，創新融合全發酵紅茶工法與木炭溫焙工藝，賦予紅茶少有的重厚骨力與悠長喉韻。',
    processSteps: [
      {
        id: 1,
        title: '嚴選手採壯葉',
        subTitle: '正欉壯芽蘊含厚膠質',
        durationSec: 6.0,
        description: '精選含有豐富果膠質與多元酚類之正欉成熟茶葉。',
        craftDetails: '茶多酚含量充沛，奠定全發酵後深厚茶底與蜜果香源。',
        temperature: '23°C 晴朗',
        visualTag: '厚實壯芽'
      },
      {
        id: 2,
        title: '深層通風萎凋',
        subTitle: '長時失水轉化蜜香',
        durationSec: 6.0,
        description: '攤放於通風架上歷時14-18小時，水分均勻蒸散，葉身柔潤如綢。',
        craftDetails: '青草澀氣完全退除，轉化釋出誘人的熱帶熟果香氣。',
        temperature: '22°C 恆溫恆濕',
        visualTag: '長時萎凋'
      },
      {
        id: 3,
        title: '重度揉捻破壁',
        subTitle: '擠壓細胞釋放茶汁',
        durationSec: 6.0,
        description: '經高壓旋轉揉捻，充分揉破葉肉細胞，使茶汁均勻附著葉表。',
        craftDetails: '使兒茶素與空氣充分接觸，啟動極致酵素氧化發酵反應。',
        temperature: '25°C 揉捻機',
        visualTag: '破壁揉捻'
      },
      {
        id: 4,
        title: '完全氧化發酵',
        subTitle: '茶黃素與茶紅素轉化',
        durationSec: 6.0,
        description: '置於溫濕發酵室，茶葉色澤轉為烏潤紫紅，熟蜜糖香氣漫溢。',
        craftDetails: '造就茶湯艷麗明亮之琥珀紅光與金黃茶湯光圈。',
        temperature: '27°C 高濕發酵',
        visualTag: '艷紅發酵'
      },
      {
        id: 5,
        title: '鐵韻溫火細焙',
        subTitle: '引出深邃焙韻融蜜',
        durationSec: 6.0,
        description: '不同於一般紅茶，特別導入鐵觀音後段低溫焙火，使蜜香與火香交融。',
        craftDetails: '口感厚實不澀，滑順如絲，喉韻回甘綿密持久。',
        temperature: '90°C 細工慢焙',
        visualTag: '蜜焙融合'
      }
    ]
  },
  {
    id: 'taiwan-gaoshan-oolong',
    name: '台灣高山烏龍茶',
    englishName: 'Taiwan High Mountain Oolong',
    category: '烏龍茶',
    origin: '台灣千米以上高山茶區 (阿里山/杉林溪/梨山)',
    altitude: '1,200 - 1,800 公尺',
    oxidation: 20,
    roastLevel: 15,
    soupColor: '蜜綠透金，澄澈晶亮',
    soupColorHex: '#E2C25D',
    aromaNotes: ['高山冷泉氣', '清幽玉蘭花香', '冷磺山嵐芬芳', '甘露鮮甜'],
    flavorProfile: '高山冷冽山氣貫穿舌面，滋味甘滑鮮爽，回甘生津持久，冷香自喉底緩緩泛起。',
    cupColorHex: '#4D7C0F',
    sensorRfId: '0278425092',
    tagRfidNumber: 'NFC# 0278425092',
    nfcChipUid: '0278425092',
    description: '生長於終年雲霧繚繞之高山冷泉台地，日夜溫差懸殊，葉肉肥厚柔嫩，苦澀度極低，飽含高山純淨天然甘甜氣韻。',
    processSteps: [
      {
        id: 1,
        title: '晨霧雲嶺採摘',
        subTitle: '手採高海拔翠嫩茶芽',
        durationSec: 6.0,
        description: '晨霧未散時，茶農手工摘採一心二葉頂級嫩葉。',
        craftDetails: '高海拔紫外線催化高含量茶胺酸，鮮嫩無苦澀。',
        temperature: '18°C 晨嵐清冷',
        visualTag: '高山晨露'
      },
      {
        id: 2,
        title: '高山柔日萎凋',
        subTitle: '日光微暖適度走水',
        durationSec: 6.0,
        description: '攤放於麻布竹篩，藉由高山柔和陽光溫和蒸散茶葉水分。',
        craftDetails: '細胞活性適度喚醒，散發初春山林原野之清幽淡雅。',
        temperature: '24°C 高原陽光',
        visualTag: '竹篩日曬'
      },
      {
        id: 3,
        title: '室內浪青靜置',
        subTitle: '輕柔翻動綠葉微紅',
        durationSec: 6.0,
        description: '在冷涼室內由製茶師以手掌輕輕浪青翻動，讓葉緣摩擦走水。',
        craftDetails: '淬鍊出經典高山清芬與優雅花果清香。',
        temperature: '20°C 恆溫靜置',
        visualTag: '浪青調香'
      },
      {
        id: 4,
        title: '滾筒炒青鎖清鮮',
        subTitle: '制止發酵保留冷韻',
        durationSec: 6.0,
        description: '高溫炒青鍋精準高溫殺青，迅速固定茶葉中最靈活之冷山香氣。',
        craftDetails: '保留翠綠葉底與清透金黃茶湯色澤。',
        temperature: '280°C 高溫炒青',
        visualTag: '高溫殺青'
      },
      {
        id: 5,
        title: '反覆團揉緊結成球',
        subTitle: '結球緊緻鎖住鮮甜',
        durationSec: 6.0,
        description: '布巾包覆反覆滾動加壓塑形，製成圓潤半球形，再以低溫烘焙乾燥。',
        craftDetails: '形成極具耐泡度之顆粒，注水後徐徐舒展，喉韻生津。',
        temperature: '90°C 低溫慢乾',
        visualTag: '圓球緊結'
      }
    ]
  },
  {
    id: 'jinxuan-oolong',
    name: '金萱烏龍茶',
    englishName: 'Jinxuan Oolong Tea (No. 12)',
    category: '烏龍茶',
    origin: '嘉義阿里山 / 南投名間茶區 (台茶12號)',
    altitude: '800 - 1,200 公尺',
    oxidation: 25,
    roastLevel: 20,
    soupColor: '金黃透亮，清澈誘人',
    soupColorHex: '#E5C158',
    aromaNotes: ['天然奶糖香', '桂花芬芳', '蜜桃清甜', '柔潤果香'],
    flavorProfile: '茶湯圓滑順口，自帶渾然天成的淡雅牛奶香與桂花甜韻，香氣甜郁持久，落喉舒暢。',
    cupColorHex: '#C59B27',
    sensorRfId: '0278223364',
    tagRfidNumber: 'NFC# 0278223364',
    nfcChipUid: '0278223364',
    description: '由台灣茶改場父子歷經四十餘年育成之「台茶12號」，別名「金萱」。天然帶有獨一無二的牛奶清香與桂花蜜韻，風靡全世界。',
    processSteps: [
      {
        id: 1,
        title: '金萱鮮葉採收',
        subTitle: '手採肥嫩台茶12號',
        durationSec: 6.0,
        description: '挑選茶葉葉片圓潤肥厚、芽葉呈淺綠色的特選金萱茶樹採摘。',
        craftDetails: '茶葉內涵天然乳香前驅物，香氣飽滿。',
        temperature: '23°C 晨光',
        visualTag: '嫩採金萱'
      },
      {
        id: 2,
        title: '均勻日光萎凋',
        subTitle: '溫柔散失葉質水氣',
        durationSec: 6.0,
        description: '於戶外竹簾進行日光萎凋，促使內質水份均勻由葉脈導出。',
        craftDetails: '青澀味逐漸消失，轉化出若有似無的甜花香氣。',
        temperature: '26°C 柔和晴空',
        visualTag: '均勻萎凋'
      },
      {
        id: 3,
        title: '靜置發酵生奶香',
        subTitle: '適度氧化凝煉乳甜',
        durationSec: 6.0,
        description: '在通風室內靜置與輕浪青，控制氧化發酵程度在20-25%之間。',
        craftDetails: '激發台茶12號品種特有的天然清淡乳脂花芬。',
        temperature: '22°C 靜置',
        visualTag: '凝煉乳香'
      },
      {
        id: 4,
        title: '鍋爐炒青定甜韻',
        subTitle: '高溫殺青留存天然甘甜',
        durationSec: 6.0,
        description: '適時入鍋殺青，精準終止酵素作用，將奶香與花甜緊鎖於葉肉中。',
        craftDetails: '葉身柔軟富有彈性，適合精細成球。',
        temperature: '270°C 殺青',
        visualTag: '留存甜韻'
      },
      {
        id: 5,
        title: '熱揉成球低溫烘乾',
        subTitle: '緊緻顆粒鎖封蜜韻',
        durationSec: 6.0,
        description: '溫熱中布包揉捻成飽滿球形，再以文火慢焙乾燥至水份低於3%。',
        craftDetails: '茶湯金黃純淨，奶香與桂花香於沖泡時層層綻放。',
        temperature: '85°C 文火焙乾',
        visualTag: '奶香封存'
      }
    ]
  },
  {
    id: 'taiwan-sijichun',
    name: '台灣四季春',
    englishName: 'Taiwan Sijichun Oolong',
    category: '烏龍茶',
    origin: '南投名間鄉 / 彰化八卦山台地',
    altitude: '300 - 500 公尺',
    oxidation: 22,
    roastLevel: 20,
    soupColor: '亮麗鵝黃，澄澈金澄',
    soupColorHex: '#D8B44A',
    aromaNotes: ['野百合奔放花香', '鮮花野趣', '梔子芳香', '鮮爽生津'],
    flavorProfile: '香氣極具爆發力，前段野花香奔放，滋味清甘純厚、生津止渴、落喉回甘極為討喜。',
    cupColorHex: '#2A9D8F',
    sensorRfId: '0412807940',
    tagRfidNumber: 'NFC# 0412807940',
    nfcChipUid: '0412807940',
    description: '在台灣茶園中由茶農偶然發現之強健變異種，生命力無比旺盛，四季採摘皆有如初春般奔放的花香，故稱「四季春」。',
    processSteps: [
      {
        id: 1,
        title: '四季春青採摘',
        subTitle: '採收鮮綠飽滿嫩葉',
        durationSec: 6.0,
        description: '採摘生命力極強、萌芽整齊且香氣因子極高的四季春鮮葉。',
        craftDetails: '具備極高的芳香揮發醇類，為花香爆發打下基底。',
        temperature: '24°C 日光',
        visualTag: '翠綠鮮採'
      },
      {
        id: 2,
        title: '通透日光萎凋',
        subTitle: '迅速散水激發香芬',
        durationSec: 6.0,
        description: '經均勻日曬散失葉面水份，葉片呈現微微波浪柔軟狀。',
        craftDetails: '香氣開始釋放，原野野花香隱隱浮現。',
        temperature: '27°C 陽光透照',
        visualTag: '日曬散水'
      },
      {
        id: 3,
        title: '長時靜置透青',
        subTitle: '浪青喚醒花香爆發',
        durationSec: 6.0,
        description: '在發酵室內多次手感翻動攪拌，讓茶葉由青草氣轉化為撲鼻花香。',
        craftDetails: '促成野薑花、百合與梔子花之複合性花香躍出。',
        temperature: '22°C 涼爽室內',
        visualTag: '花香躍動'
      },
      {
        id: 4,
        title: '適度炒青固香',
        subTitle: '鎖住奔放花果滋味',
        durationSec: 6.0,
        description: '適時以高溫滾筒殺青，快速去其雜味，鎖定最飽滿的野花香。',
        craftDetails: '維持茶葉葉質青翠與滋味之甘鮮度。',
        temperature: '275°C 炒青機',
        visualTag: '高溫固香'
      },
      {
        id: 5,
        title: '布球團揉與輕烘',
        subTitle: '半球勻稱香氣長存',
        durationSec: 6.0,
        description: '揉捻機反覆團揉成勻稱半球狀，隨後以清香型低溫烘焙收乾。',
        craftDetails: '冷熱泡皆宜，入口花香四溢，甘甜順口。',
        temperature: '80°C 輕焙清香',
        visualTag: '清甜封罐'
      }
    ]
  }
];

export const EMOTIONS: EmotionOption[] = [
  {
    id: 'calm',
    keyNumber: 1,
    label: '沉靜安適',
    subLabel: 'Calm & Serene',
    description: '像走入深山竹林，雜思隨微風散去，呼吸變得清澈緩慢。',
    iconName: 'Wind',
    colorTheme: {
      badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50',
      glow: 'shadow-emerald-500/30',
      border: 'border-emerald-500/80',
      bg: 'bg-gradient-to-b from-emerald-950/40 to-slate-950/80',
      accent: '#10b981'
    }
  },
  {
    id: 'warm',
    keyNumber: 2,
    label: '溫暖撫慰',
    subLabel: 'Warm & Comforting',
    description: '像冬天裡捧著一杯熱茶，胸口升起踏實又被溫柔擁抱的暖意。',
    iconName: 'Flame',
    colorTheme: {
      badge: 'bg-amber-950/80 text-amber-300 border-amber-700/50',
      glow: 'shadow-amber-500/30',
      border: 'border-amber-500/80',
      bg: 'bg-gradient-to-b from-amber-950/40 to-slate-950/80',
      accent: '#f59e0b'
    }
  },
  {
    id: 'joy',
    keyNumber: 3,
    label: '歡愉明朗',
    subLabel: 'Joyful & Uplifting',
    description: '果香與蜜糖在舌尖跳躍，心中突然冒出好多驚喜的新點子！',
    iconName: 'Sparkles',
    colorTheme: {
      badge: 'bg-yellow-950/80 text-yellow-300 border-yellow-700/50',
      glow: 'shadow-yellow-500/30',
      border: 'border-yellow-400/80',
      bg: 'bg-gradient-to-b from-yellow-950/40 to-slate-950/80',
      accent: '#eab308'
    }
  },
  {
    id: 'nostalgic',
    keyNumber: 4,
    label: '悠遠沉思',
    subLabel: 'Reflective & Poetic',
    description: '深邃的喉韻喚起某段溫柔的回憶，在時光的長河中與自己對話。',
    iconName: 'Moon',
    colorTheme: {
      badge: 'bg-indigo-950/80 text-indigo-300 border-indigo-700/50',
      glow: 'shadow-indigo-500/30',
      border: 'border-indigo-500/80',
      bg: 'bg-gradient-to-b from-indigo-950/40 to-slate-950/80',
      accent: '#6366f1'
    }
  },
  {
    id: 'vibrant',
    keyNumber: 5,
    label: '煥然活力',
    subLabel: 'Vibrant & Awakened',
    description: '草木清芬貫穿百骸，睡意全消，渾身注滿源源不絕的飽滿能量。',
    iconName: 'Zap',
    colorTheme: {
      badge: 'bg-lime-950/80 text-lime-300 border-lime-700/50',
      glow: 'shadow-lime-500/30',
      border: 'border-lime-400/80',
      bg: 'bg-gradient-to-b from-lime-950/40 to-slate-950/80',
      accent: '#84cc16'
    }
  },
  {
    id: 'grounded',
    keyNumber: 6,
    label: '踏實平穩',
    subLabel: 'Grounded & Anchored',
    description: '沉厚穩重的焙火香氣如大地磐石，讓人感到無比安心與笃定。',
    iconName: 'Shield',
    colorTheme: {
      badge: 'bg-stone-900/90 text-stone-300 border-stone-600/50',
      glow: 'shadow-stone-500/30',
      border: 'border-stone-400/80',
      bg: 'bg-gradient-to-b from-stone-900/60 to-slate-950/80',
      accent: '#a8a29e'
    }
  }
];
