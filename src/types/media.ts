export interface MediaAsset {
  id: string;
  name: string;
  category: 'background' | 'tea' | 'step' | 'chart' | 'gif' | 'label' | 'emotion' | 'monster' | 'cup' | 'general';
  targetKey: string; // e.g. 'bg-main', 'cup-center', 'process-chart-default', 'process-chart-muzha-tieguanyin', etc.
  url: string; // base64 or object URL or remote URL
  uploadedAt: string;
  notes?: string;
}

export interface CustomThemeSettings {
  processDurationSeconds: number; // default 30
  backgroundColor: string; // default '#F8F9FA'
  cardBackgroundColor: string; // default '#FFFFFF'
  primaryAccentColor: string; // default '#2E5A44'
  emotionButtonSize?: number; // default 150px (range 90~240px)
  emotionButtonSizes?: Record<string, number>; // individual size per emotion ID (e.g. calm, warm, etc.)
  emotionPositions?: Record<string, { x: number; y: number }>; // manual mouse-dragged coordinates {x, y}
  teaCupSize?: number; // custom cup size in steam transition (range 100~450px, default 210)
  processChartFit?: 'contain' | 'cover'; // how to scale the tea process diagram
  customImages: Record<string, string>; // targetKey -> dataURL
  customTexts: Record<string, string>; // textKey -> customized text string
  emotionNfcChips?: Record<string, string>; // emotionId -> NFC chip UID
}

