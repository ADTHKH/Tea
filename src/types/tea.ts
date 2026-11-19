export interface TeaProcessStep {
  id: number;
  title: string;
  subTitle: string;
  durationSec: number;
  description: string;
  craftDetails: string;
  temperature?: string;
  visualTag: string;
}

export interface TeaProduct {
  id: string;
  name: string;
  englishName: string;
  category: '烏龍茶' | '紅茶' | '包種茶' | '綠茶' | '白毫烏龍';
  origin: string;
  altitude: string;
  oxidation: number; // percentage 0 - 100
  roastLevel: number; // percentage 0 - 100
  soupColor: string;
  soupColorHex: string;
  aromaNotes: string[];
  flavorProfile: string;
  cupColorHex: string;
  sensorRfId: string;
  tagRfidNumber: string;
  nfcChipUid?: string;
  description: string;
  processSteps: TeaProcessStep[];
}

export type EmotionId = 
  | 'calm'
  | 'warm'
  | 'joy'
  | 'nostalgic'
  | 'vibrant'
  | 'grounded';

export interface EmotionOption {
  id: EmotionId;
  keyNumber: number;
  label: string;
  subLabel: string;
  description: string;
  iconName: string;
  colorTheme: {
    badge: string;
    glow: string;
    border: string;
    bg: string;
    accent: string;
  };
}

export interface TeaMonster {
  id: string;
  name: string;
  title: string;
  teaId: string;
  teaName: string;
  emotionId: EmotionId;
  emotionLabel: string;
  creatureType: string;
  personality: string;
  story: string;
  rarity: 'SSR 靈品' | 'SR 逸品' | 'R 佳品';
  primaryColor: string;
  secondaryColor: string;
  element: '清露' | '熾木' | '嵐霧' | '春泉' | '沉香' | '靈火';
  specialSkill: string;
  teaFortune: string;
  powerStats: {
    aroma: number;
    sweetness: number;
    calmness: number;
    energy: number;
  };
}

export interface PrintTicket {
  ticketNumber: string;
  timestamp: string;
  exhibitionName: string;
  tea: TeaProduct;
  emotion: EmotionOption;
  monster: TeaMonster;
}
