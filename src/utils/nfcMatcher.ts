import { TEAS, EMOTIONS } from '../data/teaData';
import { TeaProduct, EmotionOption, EmotionId } from '../types/tea';

// The exact 6 Tea NFC Chip mappings specified by user:
// 1. 木柵鐵觀音 -> 0277537540 (muzha-tieguanyin)
// 2. 文山包種茶 -> 0277538052 (wenshan-baozhong)
// 3. 鐵觀音紅茶 -> 0278427396 (tieguanyin-black)
// 4. 台灣高山烏龍茶 -> 0278425092 (taiwan-gaoshan-oolong)
// 5. 金萱烏龍茶 -> 0278223364 (jinxuan-oolong)
// 6. 台灣四季春 -> 0412807940 (taiwan-sijichun)

export const OFFICIAL_NFC_CHIPS = [
  '0277537540',
  '0277538052',
  '0278427396',
  '0278425092',
  '0278223364',
  '0412807940'
];

export const NFC_CHIP_MAP: Record<string, string> = {
  // 1. 木柵鐵觀音
  '0277537540': 'muzha-tieguanyin',
  '277537540': 'muzha-tieguanyin',
  '108ac304': 'muzha-tieguanyin',
  '04c38a10': 'muzha-tieguanyin',
  '木柵鐵觀音': 'muzha-tieguanyin',
  '鐵觀音': 'muzha-tieguanyin',

  // 2. 文山包種茶
  '0277538052': 'wenshan-baozhong',
  '277538052': 'wenshan-baozhong',
  '108ac504': 'wenshan-baozhong',
  '04c58a10': 'wenshan-baozhong',
  '文山包種茶': 'wenshan-baozhong',
  '文山包種': 'wenshan-baozhong',

  // 3. 鐵觀音紅茶
  '0278427396': 'tieguanyin-black',
  '278427396': 'tieguanyin-black',
  '10985704': 'tieguanyin-black',
  '04579810': 'tieguanyin-black',
  '鐵觀音紅茶': 'tieguanyin-black',

  // 4. 台灣高山烏龍茶
  '0278425092': 'taiwan-gaoshan-oolong',
  '278425092': 'taiwan-gaoshan-oolong',
  '10984e04': 'taiwan-gaoshan-oolong',
  '044e9810': 'taiwan-gaoshan-oolong',
  '台灣高山烏龍茶': 'taiwan-gaoshan-oolong',
  '高山烏龍茶': 'taiwan-gaoshan-oolong',
  '高山烏龍': 'taiwan-gaoshan-oolong',

  // 5. 金萱烏龍茶
  '0278223364': 'jinxuan-oolong',
  '278223364': 'jinxuan-oolong',
  '10953a04': 'jinxuan-oolong',
  '043a9510': 'jinxuan-oolong',
  '金萱烏龍茶': 'jinxuan-oolong',
  '金萱烏龍': 'jinxuan-oolong',
  '金萱': 'jinxuan-oolong',

  // 6. 台灣四季春
  '0412807940': 'taiwan-sijichun',
  '412807940': 'taiwan-sijichun',
  '189af304': 'taiwan-sijichun',
  '04f39a18': 'taiwan-sijichun',
  '台灣四季春': 'taiwan-sijichun',
  '四季春': 'taiwan-sijichun',
};

// The exact 6 Emotion NFC Chip mappings aligned to slots 1-6 & uploaded print labels:
// 1. 放鬆 -> 0278424324 (calm)
// 2. 愉悅 -> 0278416644 (warm)
// 3. 探索 -> 0278432260 (joy)
// 4. 溫柔 -> 0277388036 (nostalgic)
// 5. 沉浸 -> 0278337540 (vibrant)
// 6. 心動 -> 0277542148 (grounded)
export const OFFICIAL_EMOTION_NFC_MAP: Record<string, EmotionId> = {
  '0278424324': 'calm',
  '278424324': 'calm',
  '放鬆': 'calm',

  '0278416644': 'warm',
  '278416644': 'warm',
  '愉悅': 'warm',

  '0278432260': 'joy',
  '278432260': 'joy',
  '探索': 'joy',

  '0277388036': 'nostalgic',
  '277388036': 'nostalgic',
  '溫柔': 'nostalgic',

  '0278337540': 'vibrant',
  '278337540': 'vibrant',
  '沉浸': 'vibrant',

  '0277542148': 'grounded',
  '277542148': 'grounded',
  '心動': 'grounded',
};

export const EMOTION_NFC_CHIP_NAMES: Record<EmotionId, string> = {
  calm: '放鬆',
  warm: '愉悅',
  joy: '探索',
  nostalgic: '溫柔',
  vibrant: '沉浸',
  grounded: '心動',
};

/**
 * Match a raw input string from USB NFC keyboard reader, Web NFC, or manual input to a TeaProduct.
 */
export function matchNfcToTea(rawInput: string): { tea: TeaProduct; matchedUid: string } | null {
  if (!rawInput) return null;

  // Clean input: remove colons, spaces, hyphens, and leading/trailing whitespace
  const clean = rawInput.trim().replace(/[:\s\-_]/g, '').toLowerCase();

  // 1. Direct dictionary lookup
  for (const [key, teaId] of Object.entries(NFC_CHIP_MAP)) {
    if (key.toLowerCase() === clean) {
      const found = TEAS.find((t) => t.id === teaId);
      if (found) return { tea: found, matchedUid: key };
    }
  }

  // 2. Substring matching (in case USB reader prepends or appends prefix/suffix characters)
  for (const [chipUid, teaId] of Object.entries(NFC_CHIP_MAP)) {
    if (clean.includes(chipUid.toLowerCase())) {
      const found = TEAS.find((t) => t.id === teaId);
      if (found) return { tea: found, matchedUid: chipUid };
    }
  }

  // 3. Fallback check against sensorRfId, tagRfidNumber, or nfcChipUid in TEAS
  for (const tea of TEAS) {
    if (tea.nfcChipUid && clean.includes(tea.nfcChipUid.toLowerCase())) {
      return { tea, matchedUid: tea.nfcChipUid };
    }
    if (tea.sensorRfId && clean.includes(tea.sensorRfId.toLowerCase())) {
      return { tea, matchedUid: tea.sensorRfId };
    }
    if (tea.name && clean.includes(tea.name.toLowerCase())) {
      return { tea, matchedUid: tea.nfcChipUid || tea.sensorRfId };
    }
  }

  return null;
}

/**
 * Match a raw input string from USB NFC keyboard reader or Web NFC to an EmotionOption.
 */
export function matchNfcToEmotion(
  rawInput: string,
  customEmotionChips?: Record<string, string>
): { emotion: EmotionOption; matchedUid: string } | null {
  if (!rawInput) return null;

  const clean = rawInput.trim().replace(/[:\s\-_]/g, '').toLowerCase();

  // 1. Check custom configured mapping (emotionId -> chipUid) first if provided
  if (customEmotionChips) {
    for (const [emotionId, uid] of Object.entries(customEmotionChips)) {
      if (!uid) continue;
      const cleanUid = uid.trim().replace(/[:\s\-_]/g, '').toLowerCase();
      const shortUid = cleanUid.replace(/^0+/, '');
      if (cleanUid && (clean === cleanUid || clean.includes(cleanUid) || (shortUid.length >= 7 && clean.includes(shortUid)))) {
        const found = EMOTIONS.find((em) => em.id === emotionId);
        if (found) return { emotion: found, matchedUid: uid.trim() };
      }
    }
  }

  // 2. Direct official dictionary lookup
  for (const [key, emotionId] of Object.entries(OFFICIAL_EMOTION_NFC_MAP)) {
    if (key.toLowerCase() === clean) {
      const found = EMOTIONS.find((em) => em.id === emotionId);
      if (found) return { emotion: found, matchedUid: key };
    }
  }

  // 3. Substring matching
  for (const [chipUid, emotionId] of Object.entries(OFFICIAL_EMOTION_NFC_MAP)) {
    if (clean.includes(chipUid.toLowerCase())) {
      const found = EMOTIONS.find((em) => em.id === emotionId);
      if (found) return { emotion: found, matchedUid: chipUid };
    }
  }

  return null;
}
