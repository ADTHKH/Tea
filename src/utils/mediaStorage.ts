import { MediaAsset, CustomThemeSettings } from '../types/media';

const STORAGE_KEY_ASSETS = 'tea_kiosk_media_assets_v2';
const STORAGE_KEY_SETTINGS = 'tea_kiosk_theme_settings_v2';

// Frozen spirit illustrations for the 6 emotions (matched to uploaded transparent PNGs & print labels)
export const DEFAULT_EMOTION_IMAGES: Record<string, string> = {
  'emotion-calm': '/images/小怪獸5_1795067397539.png',
  'emotion-warm': '/images/小怪獸2_1795067389767.png',
  'emotion-joy': '/images/小怪獸1_1795067386396.png',
  'emotion-nostalgic': '/images/小怪獸4_1795067394897.png',
  'emotion-vibrant': '/images/小怪獸3_1795067392232.png',
  'emotion-grounded': '/images/小怪獸6_1795067399904.png',
};

// Frozen slot bindings for cover, cup, tea GIFs, tea charts, print labels, and monsters
export const DEFAULT_CUSTOM_IMAGES: Record<string, string> = {
  'home-cover': '/images/首頁.jpg',
  'cup-center': '/images/熱茶杯1.png',
  'process-gif-muzha-tieguanyin': '/images/木柵鐵觀音_1795066600118.gif',
  'process-gif-wenshan-baozhong': '/images/文山包種茶_1795066609236.gif',
  'process-gif-tieguanyin-black': '/images/鐵觀音紅茶_1795066636780.gif',
  'process-gif-taiwan-gaoshan-oolong': '/images/台灣高山烏龍茶_1795066657663.gif',
  'process-gif-jinxuan-oolong': '/images/金萱烏龍茶_1795066669452.gif',
  'process-gif-taiwan-sijichun': '/images/台灣四季春_1795066683515.gif',
  'process-chart-muzha-tieguanyin': '/images/01木柵鐵觀音.jpg',
  'process-chart-wenshan-baozhong': '/images/02文山包種茶.jpg',
  'process-chart-tieguanyin-black': '/images/03鐵觀音紅茶.jpg',
  'process-chart-taiwan-sijichun': '/images/04台灣四季春.jpg',
  'process-chart-taiwan-gaoshan-oolong': '/images/05台灣高山烏龍茶.jpg',
  'process-chart-jinxuan-oolong': '/images/06金萱烏龍茶.jpg',
  'print-label-calm': '/images/放鬆.jpg',
  'print-label-warm': '/images/愉悅.jpg',
  'print-label-joy': '/images/探索.jpg',
  'print-label-nostalgic': '/images/溫柔.jpg',
  'print-label-vibrant': '/images/沉浸.jpg',
  'print-label-grounded': '/images/心動.jpg',
  ...DEFAULT_EMOTION_IMAGES,
};

export const DEFAULT_BUTTON_SIZES: Record<string, number> = {
  'calm': 150,
  'warm': 150,
  'joy': 150,
  'nostalgic': 150,
  'vibrant': 150,
  'grounded': 150,
};

// Default 6 Emotion NFC chip UIDs (only read in emotion stage, aligned to slots 1-6)
export const DEFAULT_EMOTION_NFC_CHIPS: Record<string, string> = {
  'calm': '0278424324',      // 放鬆
  'warm': '0278416644',      // 愉悅
  'joy': '0278432260',       // 探索
  'nostalgic': '0277388036', // 溫柔
  'vibrant': '0278337540',   // 沉浸
  'grounded': '0277542148',  // 心動
};

// Locked official monster names (synced across reveal, print labels, and backend editor)
export const LOCKED_MONSTER_NAMES: Record<string, string> = {
  'calm': '放鬆 Relaxed',
  'warm': '溫暖 Comforting',
  'joy': '探索 Curious',
  'nostalgic': '沉思 Reflective',
  'vibrant': '活力 Vibrant',
  'grounded': '踏實 Grounded',
};

// Default customizable text dictionary across the interactive exhibition
export const DEFAULT_TEXTS: Record<string, string> = {
  // Tea selection standby prompt
  'scan-prompt-title': '請將茶杯放置於 NFC 讀卡機感應',
  'scan-prompt-subtitle': '系統掃描到不同茶晶片後，將自動展開該茶款的風土特色、風味筆記與專屬製茶工藝介紹卡片。',

  // Wrong chip alert modal texts
  'wrong-chip-title': '您放錯了！請重放一次！',
  'wrong-chip-desc': '感應到的茶品晶片不屬於當前步驟，或感應到非本展覽之專屬茶品晶片。請重新確認並放置正確的專屬晶片。',
  'wrong-chip-btn': '我知道了，重新放置',

  // Emotion selection prompt
  'prompt-title': '感受這杯茶湯的香氣，現在的它帶給你什麼感覺？',
  'prompt-badge': '感官共鳴 · 選擇心境選項',

  // 6 Emotion options
  'emotion-calm-label': '沉靜安適',
  'emotion-calm-sub': 'Calm & Serene',
  'emotion-calm-desc': '像走入深山竹林，雜思隨微風散去，呼吸變得清澈緩慢。',

  'emotion-warm-label': '溫暖撫慰',
  'emotion-warm-sub': 'Warm & Comforting',
  'emotion-warm-desc': '像冬天裡捧著一杯熱茶，胸口升起踏實又被溫柔擁抱的暖意。',

  'emotion-joy-label': '歡愉明朗',
  'emotion-joy-sub': 'Joyful & Uplifting',
  'emotion-joy-desc': '果香與蜜糖在舌尖跳躍，心中突然冒出好多驚喜的新點子！',

  'emotion-nostalgic-label': '悠遠沉思',
  'emotion-nostalgic-sub': 'Reflective & Poetic',
  'emotion-nostalgic-desc': '深邃的喉韻喚起某段溫柔的回憶，在時光的長河中與自己對話。',

  'emotion-vibrant-label': '煥然活力',
  'emotion-vibrant-sub': 'Vibrant & Awakened',
  'emotion-vibrant-desc': '草木清芬貫穿百骸，睡意全消，渾身注滿源源不絕的飽滿能量。',

  'emotion-grounded-label': '踏實平穩',
  'emotion-grounded-sub': 'Grounded & Anchored',
  'emotion-grounded-desc': '沉厚穩重的焙火香氣如大地磐石，讓人感到無比安心與笃定。',

  // Steam condensation transition
  'steam-badge': '製茶工藝淬鍊完成 · 香氣凝華中',
  'steam-title-gathering': '茶香升騰，氣韻流轉...',
  'steam-title-condensing': '茶湯蒸氣凝結，百草香氣漸化靈形...',
  'steam-title-crystallizing': '心境與茶氣共鳴，即將揭開感官之問...',
  'steam-desc': '熱水沖注之間，山風與雲霧在杯盞中重新甦醒。靜心深嗅，感受茶湯蒸氣為您帶來的當下悸動。',

  // Commemorative ticket
  'ticket-title': '茶靈絮語 · 展覽紀念茶籤',
  'ticket-subtitle': 'COMMEMORATIVE THERMAL TICKET',
  'ticket-prompt': '掃碼將茶靈小怪獸存入手機',
  'ticket-footer': 'TEA SPIRIT EXHIBITION · 祝茶安',

  // Monster reveal banner
  'reveal-title': '感官共鳴凝華 · 獲得專屬茶靈小怪獸',
  'reveal-congrats': '恭喜喚醒「{monsterName}」！',

  // 6 Emotion Monsters Custom Texts (Name, Title, Personality, Skill, Fortune, Story)
  'monster-calm-name': '放鬆 Relaxed',
  'monster-calm-title': '高山霧海的深呼吸使者',
  'monster-calm-personality': '心境沉靜安適，如沐高山竹林微風，氣息清冷悠揚。',
  'monster-calm-skill': '【心如止水】：展開五米安神茶界，瞬間撫平所有焦慮雜念。',
  'monster-calm-fortune': '「浮雲吹作雪，世味煮成茶。今日宜慢下腳步，靜坐聽風。」',
  'monster-calm-story': '吸納了清冷山嵐與高山純露，在心境轉化為沉靜安適的剎那，茶湯蒸氣凝華結靈。',

  'monster-warm-name': '溫暖 Comforting',
  'monster-warm-title': '抱著茶茶石的暖心毛球',
  'monster-warm-personality': '胸口升起踏實暖意，宛如捧著一杯初沸溫潤好茶。',
  'monster-warm-skill': '【恆溫焙香】：散發38.5度的胸口暖流，撫慰疲憊身心。',
  'monster-warm-fortune': '「人間煙火氣，最撫凡人心。今日會有意料之外的溫柔相遇。」',
  'monster-warm-story': '吸納了焙火暖意與溫潤蜜香，在心境轉化為溫暖撫慰的剎那，茶湯蒸氣凝華結靈。',

  'monster-joy-name': '探索 Curious',
  'monster-joy-title': '在冷泉山風中唱歌的跳跳鳥',
  'monster-joy-personality': '果香在舌尖躍動，神清氣爽，心中冒出許多驚喜靈感。',
  'monster-joy-skill': '【回甘火花】：隨機彈出三顆蜜糖靈感泡泡，觸碰即激發奇想！',
  'monster-joy-fortune': '「回甘如蜜，好事將近。用微笑接住今天撲面而來的小幸運。」',
  'monster-joy-story': '吸納了山泉甘甜與鮮活果韻，在心境轉化為歡愉明朗的剎那，茶湯蒸氣凝華結靈。',

  'monster-nostalgic-name': '沉思 Reflective',
  'monster-nostalgic-title': '見證百年茶席的沉思者',
  'monster-nostalgic-personality': '深邃喉韻喚起某段溫柔時光，與內心深處的自己對話。',
  'monster-nostalgic-skill': '【時光倒影】：在茶湯倒影中映照出記憶中最珍貴溫暖的笑臉。',
  'monster-nostalgic-fortune': '「山中何事？松花釀酒，春水煎茶。走過的時光都化作了喉底甘醇。」',
  'monster-nostalgic-story': '吸納了百年木質陳香與歲月底蘊，在心境轉化為悠遠沉思的剎那，茶湯蒸氣凝華結靈。',

  'monster-vibrant-name': '活力 Vibrant',
  'monster-vibrant-title': '奔馳在山巔的晨光守護者',
  'monster-vibrant-personality': '草木清芬貫穿百骸，睡意全消，渾身注滿飽滿活力。',
  'monster-vibrant-skill': '【生津湧泉】：瞬間注入75%草木鮮氧，思緒神采飛揚，活力滿格！',
  'monster-vibrant-fortune': '「精神百倍，神采飛揚！帶著茶葉的昂揚綠意，把想做的事做成。」',
  'monster-vibrant-story': '吸納了晨曦破曉與初生嫩芽的朝氣，在心境轉化為煥然活力的剎那，茶湯蒸氣凝華結靈。',

  'monster-grounded-name': '踏實 Grounded',
  'monster-grounded-title': '如青苔巨岩般安詳入定的山神',
  'monster-grounded-personality': '沉厚穩重的焙火香氣如大地磐石，讓人感到篤定踏實。',
  'monster-grounded-skill': '【如磐石定】：生出深植地心之根，任憑外界喧囂，心志巋然不動。',
  'monster-grounded-fortune': '「深根固柢，泰然處之。踏實走好每一步，時間自會給予答案。」',
  'monster-grounded-story': '吸納了岩骨炭火之氣與大地深沉，在心境轉化為踏實平穩的剎那，茶湯蒸氣凝華結靈。',
};

// Frozen media assets library matching data/customAssets.json & /images/
export const DEFAULT_ASSETS: MediaAsset[] = [
  { id: 'asset-1795067399905', name: '小怪獸6', category: 'general', targetKey: '', url: '/images/小怪獸6_1795067399904.png', uploadedAt: '2026/11/19', notes: '自動存入 images/小怪獸6_1795067399904.png' },
  { id: 'asset-1795067397540', name: '小怪獸5', category: 'general', targetKey: '', url: '/images/小怪獸5_1795067397539.png', uploadedAt: '2026/11/19', notes: '自動存入 images/小怪獸5_1795067397539.png' },
  { id: 'asset-1795067394898', name: '小怪獸4', category: 'general', targetKey: '', url: '/images/小怪獸4_1795067394897.png', uploadedAt: '2026/11/19', notes: '自動存入 images/小怪獸4_1795067394897.png' },
  { id: 'asset-1795067392233', name: '小怪獸3', category: 'general', targetKey: '', url: '/images/小怪獸3_1795067392232.png', uploadedAt: '2026/11/19', notes: '自動存入 images/小怪獸3_1795067392232.png' },
  { id: 'asset-1795067389768', name: '小怪獸2', category: 'general', targetKey: '', url: '/images/小怪獸2_1795067389767.png', uploadedAt: '2026/11/19', notes: '自動存入 images/小怪獸2_1795067389767.png' },
  { id: 'asset-1795067386397', name: '小怪獸1', category: 'general', targetKey: '', url: '/images/小怪獸1_1795067386396.png', uploadedAt: '2026/11/19', notes: '自動存入 images/小怪獸1_1795067386396.png' },
  { id: 'asset-1795066683529', name: '台灣四季春', category: 'general', targetKey: '', url: '/images/台灣四季春_1795066683515.gif', uploadedAt: '2026/11/19', notes: '自動存入 images/台灣四季春_1795066683515.gif' },
  { id: 'asset-1795066669466', name: '金萱烏龍茶', category: 'general', targetKey: '', url: '/images/金萱烏龍茶_1795066669452.gif', uploadedAt: '2026/11/19', notes: '自動存入 images/金萱烏龍茶_1795066669452.gif' },
  { id: 'asset-1795066657679', name: '台灣高山烏龍茶', category: 'general', targetKey: '', url: '/images/台灣高山烏龍茶_1795066657663.gif', uploadedAt: '2026/11/19', notes: '自動存入 images/台灣高山烏龍茶_1795066657663.gif' },
  { id: 'asset-1795066636796', name: '鐵觀音紅茶', category: 'general', targetKey: '', url: '/images/鐵觀音紅茶_1795066636780.gif', uploadedAt: '2026/11/19', notes: '自動存入 images/鐵觀音紅茶_1795066636780.gif' },
  { id: 'asset-1795066609251', name: '文山包種茶', category: 'general', targetKey: '', url: '/images/文山包種茶_1795066609236.gif', uploadedAt: '2026/11/19', notes: '自動存入 images/文山包種茶_1795066609236.gif' },
  { id: 'asset-1795066600140', name: '木柵鐵觀音', category: 'general', targetKey: '', url: '/images/木柵鐵觀音_1795066600118.gif', uploadedAt: '2026/11/19', notes: '自動存入 images/木柵鐵觀音_1795066600118.gif' },
  { id: 'disk-01%E6%9C%A8%E6%9F%B5%E9%90%B5%E8%A7%80%E9%9F%B3.jpg', name: '01木柵鐵觀音', category: 'general', targetKey: '', url: '/images/01木柵鐵觀音.jpg', uploadedAt: '2026/11/19', notes: 'images/01木柵鐵觀音.jpg' },
  { id: 'disk-02%E6%96%87%E5%B1%B1%E5%8C%85%E7%A8%AE%E8%8C%B6.jpg', name: '02文山包種茶', category: 'general', targetKey: '', url: '/images/02文山包種茶.jpg', uploadedAt: '2026/11/19', notes: 'images/02文山包種茶.jpg' },
  { id: 'disk-03%E9%90%B5%E8%A7%80%E9%9F%B3%E7%B4%85%E8%8C%B6.jpg', name: '03鐵觀音紅茶', category: 'general', targetKey: '', url: '/images/03鐵觀音紅茶.jpg', uploadedAt: '2026/11/19', notes: 'images/03鐵觀音紅茶.jpg' },
  { id: 'disk-04%E5%8F%B0%E7%81%A3%E5%9B%9B%E5%AD%A3%E6%98%A5.jpg', name: '04台灣四季春', category: 'general', targetKey: '', url: '/images/04台灣四季春.jpg', uploadedAt: '2026/11/19', notes: 'images/04台灣四季春.jpg' },
  { id: 'disk-05%E5%8F%B0%E7%81%A3%E9%AB%98%E5%B1%B1%E7%83%8F%E9%BE%8D%E8%8C%B6.jpg', name: '05台灣高山烏龍茶', category: 'general', targetKey: '', url: '/images/05台灣高山烏龍茶.jpg', uploadedAt: '2026/11/19', notes: 'images/05台灣高山烏龍茶.jpg' },
  { id: 'disk-06%E9%87%91%E8%90%B1%E7%83%8F%E9%BE%8D%E8%8C%B6.jpg', name: '06金萱烏龍茶', category: 'general', targetKey: '', url: '/images/06金萱烏龍茶.jpg', uploadedAt: '2026/11/19', notes: 'images/06金萱烏龍茶.jpg' },
  { id: 'disk-%E5%BF%83%E5%8B%95.jpg', name: '心動', category: 'general', targetKey: '', url: '/images/心動.jpg', uploadedAt: '2026/11/19', notes: 'images/心動.jpg' },
  { id: 'disk-%E6%84%89%E6%82%85.jpg', name: '愉悅', category: 'general', targetKey: '', url: '/images/愉悅.jpg', uploadedAt: '2026/11/19', notes: 'images/愉悅.jpg' },
  { id: 'disk-%E6%8E%A2%E7%B4%A2.jpg', name: '探索', category: 'general', targetKey: '', url: '/images/探索.jpg', uploadedAt: '2026/11/19', notes: 'images/探索.jpg' },
  { id: 'disk-%E6%94%BE%E9%AC%86.jpg', name: '放鬆', category: 'general', targetKey: '', url: '/images/放鬆.jpg', uploadedAt: '2026/11/19', notes: 'images/放鬆.jpg' },
  { id: 'disk-%E6%B2%89%E6%B5%B8.jpg', name: '沉浸', category: 'general', targetKey: '', url: '/images/沉浸.jpg', uploadedAt: '2026/11/19', notes: 'images/沉浸.jpg' },
  { id: 'disk-%E6%BA%AB%E6%9F%94.jpg', name: '溫柔', category: 'general', targetKey: '', url: '/images/溫柔.jpg', uploadedAt: '2026/11/19', notes: 'images/溫柔.jpg' },
  { id: 'disk-%E7%86%B1%E8%8C%B6%E6%9D%AF1.png', name: '熱茶杯1', category: 'general', targetKey: '', url: '/images/熱茶杯1.png', uploadedAt: '2026/11/19', notes: 'images/熱茶杯1.png' },
  { id: 'disk-%E9%A6%96%E9%A0%81.jpg', name: '首頁', category: 'general', targetKey: '', url: '/images/首頁.jpg', uploadedAt: '2026/11/19', notes: 'images/首頁.jpg' }
];

export const DEFAULT_SETTINGS: CustomThemeSettings = {
  processDurationSeconds: 30, // 延長至30秒
  backgroundColor: '#F9FAF9',
  cardBackgroundColor: '#FFFFFF',
  primaryAccentColor: '#2D5B44',
  emotionButtonSize: 150, // 預設按鈕大小 150px
  emotionButtonSizes: { ...DEFAULT_BUTTON_SIZES },
  emotionPositions: {},
  teaCupSize: 360, // 預設茶杯大小 360px
  processChartFit: 'contain', // 流程大圖預設完整呈現
  customImages: { ...DEFAULT_CUSTOM_IMAGES },
  customTexts: { ...DEFAULT_TEXTS },
  emotionNfcChips: { ...DEFAULT_EMOTION_NFC_CHIPS }
};

export const getSavedAssets = (): MediaAsset[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ASSETS);
    if (!raw) return DEFAULT_ASSETS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ASSETS;
  } catch (err) {
    console.error('Error loading media assets from localStorage', err);
    return DEFAULT_ASSETS;
  }
};

export const saveAssets = (assets: MediaAsset[], deletedUrl?: string): void => {
  try {
    // Avoid exceeding 5MB localStorage quota if an offline base64 fallback exists
    const lightweightAssets = assets.filter(
      (a) => a && typeof a.url === 'string' && (!a.url.startsWith('data:') || a.url.length < 200000)
    );
    localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(lightweightAssets));
  } catch (err) {
    console.error('Error saving assets to localStorage', err);
  }

  // Always persist asset library to server disk (data/customAssets.json)
  fetch('/api/assets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assets, deletedUrl })
  }).catch((err) => {
    console.warn('[Storage] Could not persist assets to server disk:', err);
  });
};

export const fetchAssetsFromServer = async (): Promise<MediaAsset[] | null> => {
  try {
    const res = await fetch('/api/assets');
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data?.assets)) {
      return data.assets;
    }
  } catch (err) {
    console.warn('[Storage] Could not fetch assets from server:', err);
  }
  return null;
};

export const getSavedSettings = (): CustomThemeSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);

    // Merge custom images, ignoring stale external unsplash links or legacy removed paths
    const mergedImages = { ...DEFAULT_CUSTOM_IMAGES };
    if (parsed.customImages) {
      Object.entries(parsed.customImages).forEach(([k, v]) => {
        if (
          typeof v === 'string' &&
          !v.includes('unsplash.com') &&
          !/小怪獸[1-6]\.png$/.test(v) &&
          !/_179(497|503)/.test(v)
        ) {
          mergedImages[k] = v;
        }
      });
    }

    // Respect user's saved customTexts without forceful default overwrite on refresh,
    // while keeping locked monster names immutable.
    const mergedTexts = parsed.customTexts 
      ? { ...DEFAULT_TEXTS, ...parsed.customTexts }
      : { ...DEFAULT_TEXTS };

    Object.entries(LOCKED_MONSTER_NAMES).forEach(([emotionId, lockedName]) => {
      mergedTexts[`monster-${emotionId}-name`] = lockedName;
    });

    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      processDurationSeconds: parsed.processDurationSeconds || 30,
      emotionButtonSize: parsed.emotionButtonSize || 150,
      emotionButtonSizes: {
        ...DEFAULT_BUTTON_SIZES,
        ...(parsed.emotionButtonSizes || {})
      },
      emotionPositions: parsed.emotionPositions || {},
      teaCupSize: parsed.teaCupSize || 210,
      customImages: mergedImages,
      customTexts: mergedTexts,
      emotionNfcChips: {
        ...DEFAULT_EMOTION_NFC_CHIPS,
        ...(parsed.emotionNfcChips || {})
      }
    };
  } catch (err) {
    console.error('Error loading settings from localStorage', err);
    return DEFAULT_SETTINGS;
  }
};

export const saveImageToServer = async (
  filename: string,
  dataUrl: string,
  targetKey?: string,
  bindToSlot: boolean = true
): Promise<{ success: boolean; url: string; filename?: string; asset?: MediaAsset }> => {
  try {
    const res = await fetch('/api/save-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filename,
        dataUrl,
        targetKey,
        bindToSlot
      })
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        url: data.url || `/images/${data.filename}`,
        filename: data.filename,
        asset: data.asset
      };
    }
  } catch (err) {
    console.warn('[Storage] Server save image failed, falling back to local dataURL', err);
  }

  // Fallback to dataURL if offline or server route unavailable
  return {
    success: false,
    url: dataUrl,
    filename
  };
};

export const saveSettings = (
  settings: CustomThemeSettings,
  deletedImageKey?: string,
  deletedImageKeys?: string[]
): void => {
  try {
    const json = JSON.stringify({ settings, deletedImageKey, deletedImageKeys });
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (storageErr) {
      console.warn('[Storage] localStorage save skipped/quota reached:', storageErr);
    }
    // Asynchronously sync to server disk (data/customSettings.json)
    fetch('/api/save-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json,
      keepalive: json.length < 60000
    }).catch((err) => {
      console.warn('[Storage] Could not persist settings to server disk:', err);
    });
  } catch (err) {
    console.error('Error saving settings:', err);
  }
};
