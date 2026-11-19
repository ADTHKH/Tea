import React, { useState, useRef, useEffect } from 'react';
import { MediaAsset, CustomThemeSettings } from '../types/media';
import { TEAS, EMOTIONS } from '../data/teaData';
import { DEFAULT_TEXTS, DEFAULT_EMOTION_NFC_CHIPS, saveImageToServer, saveSettings } from '../utils/mediaStorage';
import { EMOTION_NFC_CHIP_NAMES } from '../utils/nfcMatcher';
import { 
  Upload, Image as ImageIcon, Trash2, Check, RefreshCw, X, Sliders, Layers, 
  Eye, CheckCircle2, AlertCircle, FilePlus, Type, RotateCcw, Lock, Radio
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  assets: MediaAsset[];
  settings: CustomThemeSettings;
  onUpdateAssets: (newAssets: MediaAsset[], deletedUrl?: string) => void;
  onUpdateSettings: (newSettings: CustomThemeSettings) => void;
  onResetDefaults: () => void;
  initialTab?: 'slots' | 'upload' | 'settings' | 'text';
}

export const MediaGalleryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  assets,
  settings,
  onUpdateAssets,
  onUpdateSettings,
  onResetDefaults,
  initialTab = 'slots'
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'slots' | 'settings' | 'text'>(initialTab);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedSlotKey, setSelectedSlotKey] = useState<string>('bg-main');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const currentTexts = {
    ...DEFAULT_TEXTS,
    ...(settings.customTexts || {})
  };

  // Predefined interactive slot locations for easy mapping
  const BINDING_SLOTS = [
    // 認識茶介面 GIF 動圖 (6 Tea Varieties + Global GIF)
    { key: 'process-gif-muzha-tieguanyin', label: '木柵鐵觀音 · 認識茶動圖 (GIF)', category: '認識茶 GIF', desc: '感應到木柵鐵觀音時，認識茶介面全螢幕播放的上傳 GIF 動圖' },
    { key: 'process-gif-wenshan-baozhong', label: '文山包種茶 · 認識茶動圖 (GIF)', category: '認識茶 GIF', desc: '感應到文山包種茶時，認識茶介面全螢幕播放的上傳 GIF 動圖' },
    { key: 'process-gif-tieguanyin-black', label: '鐵觀音紅茶 · 認識茶動圖 (GIF)', category: '認識茶 GIF', desc: '感應到鐵觀音紅茶時，認識茶介面全螢幕播放的上傳 GIF 動圖' },
    { key: 'process-gif-taiwan-gaoshan-oolong', label: '台灣高山烏龍茶 · 認識茶動圖 (GIF)', category: '認識茶 GIF', desc: '感應到台灣高山烏龍茶時，認識茶介面全螢幕播放的上傳 GIF 動圖' },
    { key: 'process-gif-jinxuan-oolong', label: '金萱烏龍茶 · 認識茶動圖 (GIF)', category: '認識茶 GIF', desc: '感應到金萱烏龍茶時，認識茶介面全螢幕播放的上傳 GIF 動圖' },
    { key: 'process-gif-taiwan-sijichun', label: '台灣四季春 · 認識茶動圖 (GIF)', category: '認識茶 GIF', desc: '感應到台灣四季春時，認識茶介面全螢幕播放的上傳 GIF 動圖' },
    { key: 'process-gif-default', label: '全域通用認識茶動圖 (GIF)', category: '認識茶 GIF', desc: '未單獨指定各茶種 GIF 時，認識茶介面統一播放此 GIF 動圖' },

    // 最終列印標籤專屬製作圖 (Synced with 對應心境：【...】之茶靈小怪獸 + Locked Monster Names)
    ...EMOTIONS.map((emotion) => {
      const emotionLabel = currentTexts[`emotion-${emotion.id}-label`] || emotion.label;
      const lockedMonsterName = DEFAULT_TEXTS[`monster-${emotion.id}-name`] || emotionLabel;
      return {
        key: `print-label-${emotion.id}`,
        label: `對應心境：【${emotionLabel}】之茶靈小怪獸（${lockedMonsterName}）· 列印標籤圖`,
        category: '列印標籤',
        desc: `最後列印階段對應心境「${emotionLabel}」茶靈小怪獸（${lockedMonsterName}）顯示並輸出的專屬標籤完稿圖片`
      };
    }),
    { key: 'print-label-default', label: '全域通用列印標籤圖 (未單獨指定時套用)', category: '列印標籤', desc: '未個別指定心境標籤圖時，統一列印此製作好的標籤圖檔' },

    { key: 'home-cover', label: '展覽首頁封面主圖', category: '全域背景', desc: '進入選茶互動前最前面的全螢幕首頁圖檔，無外框滿版呈現' },
    { key: 'bg-main', label: '主介面全域背景圖', category: '全域背景', desc: '替換最底層展示場景或質感底圖' },
    { key: 'bg-process', label: '製茶流程卡片背景圖', category: '步驟流程', desc: '製茶工藝展示卡片內背景底圖' },
    { key: 'bg-steam', label: '蒸氣凝結過渡背景圖', category: '全域背景', desc: '茶湯蒸氣凝華動畫時的過渡場景背景' },
    { key: 'bg-emotion', label: '情緒提問專屬背景圖', category: '全域背景', desc: '情緒提問心境感應頁面之自訂背景圖' },
    { key: 'cup-center', label: '中間主茶杯圖 (去背茶杯)', category: '茶具素材', desc: '替換中央茶席與蒸氣凝結過渡時的茶杯圖片，去背無框' },

    // 6 Tea Varieties Custom Process Flowchart Infographics (一大片圖)
    { key: 'process-chart-muzha-tieguanyin', label: '木柵鐵觀音 · 製茶工藝流程大圖 (靜態/GIF)', category: '流程大圖', desc: '選茶感應到木柵鐵觀音時，展示的製茶流程海報圖檔（支援 GIF 與靜態圖）' },
    { key: 'process-chart-wenshan-baozhong', label: '文山包種茶 · 製茶工藝流程大圖 (靜態/GIF)', category: '流程大圖', desc: '選茶感應到文山包種茶時，展示的製茶流程海報圖檔（支援 GIF 與靜態圖）' },
    { key: 'process-chart-tieguanyin-black', label: '鐵觀音紅茶 · 製茶工藝流程大圖 (靜態/GIF)', category: '流程大圖', desc: '選茶感應到鐵觀音紅茶時，展示的製茶流程海報圖檔（支援 GIF 與靜態圖）' },
    { key: 'process-chart-taiwan-gaoshan-oolong', label: '台灣高山烏龍茶 · 製茶工藝流程大圖 (靜態/GIF)', category: '流程大圖', desc: '選茶感應到台灣高山烏龍茶時，展示的製茶流程海報圖檔（支援 GIF 與靜態圖）' },
    { key: 'process-chart-jinxuan-oolong', label: '金萱烏龍茶 · 製茶工藝流程大圖 (靜態/GIF)', category: '流程大圖', desc: '選茶感應到金萱烏龍茶時，展示的製茶流程海報圖檔（支援 GIF 與靜態圖）' },
    { key: 'process-chart-taiwan-sijichun', label: '台灣四季春 · 製茶工藝流程大圖 (靜態/GIF)', category: '流程大圖', desc: '選茶感應到台灣四季春時，展示的製茶流程海報圖檔（支援 GIF 與靜態圖）' },
    { key: 'process-chart-default', label: '全域通用製茶流程大圖 (未特別指定時套用)', category: '流程大圖', desc: '若某茶款尚未單獨上傳流程圖或 GIF 時，自動套用此通用大圖' },

    // 6 Tea Varieties Material Images
    { key: 'tea-muzha-tieguanyin', label: '木柵鐵觀音 · 特色素材圖', category: '茶種素材', desc: '木柵鐵觀音茶葉或茶湯特色展示圖' },
    { key: 'tea-wenshan-baozhong', label: '文山包種茶 · 特色素材圖', category: '茶種素材', desc: '文山包種茶茶葉或茶湯特色展示圖' },
    { key: 'tea-tieguanyin-black', label: '鐵觀音紅茶 · 特色素材圖', category: '茶種素材', desc: '鐵觀音紅茶茶葉或茶湯特色展示圖' },
    { key: 'tea-taiwan-gaoshan-oolong', label: '台灣高山烏龍茶 · 特色素材圖', category: '茶種素材', desc: '台灣高山烏龍茶茶葉或茶湯特色展示圖' },
    { key: 'tea-jinxuan-oolong', label: '金萱烏龍茶 · 特色素材圖', category: '茶種素材', desc: '金萱烏龍茶茶葉或茶湯特色展示圖' },
    { key: 'tea-taiwan-sijichun', label: '台灣四季春 · 特色素材圖', category: '茶種素材', desc: '台灣四季春茶葉或茶湯特色展示圖' },

    // Emotion button custom images
    { key: 'emotion-btn-calm', label: '【沉靜安適】情緒專屬按鈕圖 (去背按鈕)', category: '按鈕圖檔', desc: '情緒選單上的按鈕圖檔，無邊框、去背圖' },
    { key: 'emotion-btn-warm', label: '【溫暖撫慰】情緒專屬按鈕圖 (去背按鈕)', category: '按鈕圖檔', desc: '情緒選單上的按鈕圖檔，無邊框、去背圖' },
    { key: 'emotion-btn-joy', label: '【歡愉明朗】情緒專屬按鈕圖 (去背按鈕)', category: '按鈕圖檔', desc: '情緒選單上的按鈕圖檔，無邊框、去背圖' },
    { key: 'emotion-btn-nostalgic', label: '【悠遠沉思】情緒專屬按鈕圖 (去背按鈕)', category: '按鈕圖檔', desc: '情緒選單上的按鈕圖檔，無邊框、去背圖' },
    { key: 'emotion-btn-vibrant', label: '【煥然活力】情緒專屬按鈕圖 (去背按鈕)', category: '按鈕圖檔', desc: '情緒選單上的按鈕圖檔，無邊框、去背圖' },
    { key: 'emotion-btn-grounded', label: '【踏實平穩】情緒專屬按鈕圖 (去背按鈕)', category: '按鈕圖檔', desc: '情緒選單上的按鈕圖檔，無邊框、去背圖' },

    // Monster images
    { key: 'emotion-calm', label: '【沉靜安適】茶靈怪獸 (放鬆 Relaxed)', category: '茶靈小怪獸', desc: '出現在最終怪獸揭示與列印票券上' },
    { key: 'emotion-warm', label: '【溫暖撫慰】茶靈怪獸 (溫暖 Comforting)', category: '茶靈小怪獸', desc: '出現在最終怪獸揭示與列印票券上' },
    { key: 'emotion-joy', label: '【歡愉明朗】茶靈怪獸 (探索 Curious)', category: '茶靈小怪獸', desc: '出現在最終怪獸揭示與列印票券上' },
    { key: 'emotion-nostalgic', label: '【悠遠沉思】茶靈怪獸 (沉思 Reflective)', category: '茶靈小怪獸', desc: '出現在最終怪獸揭示與列印票券上' },
    { key: 'emotion-vibrant', label: '【煥然活力】茶靈怪獸 (活力 Vibrant)', category: '茶靈小怪獸', desc: '出現在最終怪獸揭示與列印票券上' },
    { key: 'emotion-grounded', label: '【踏實平穩】茶靈怪獸 (踏實 Grounded)', category: '茶靈小怪獸', desc: '出現在最終怪獸揭示與列印票券上' },
  ];

  const SLOT_CATEGORIES = [
    { id: 'all', label: '全部位置' },
    { id: '認識茶 GIF', label: '認識茶 GIF' },
    { id: '列印標籤', label: '列印標籤圖' },
    { id: '茶靈小怪獸', label: '茶靈小怪獸' },
    { id: '按鈕圖檔', label: '情緒按鈕圖' },
    { id: '全域背景', label: '背景與首頁' },
    { id: '茶具素材', label: '茶具素材' },
    { id: '流程大圖', label: '靜態流程圖' },
    { id: '茶種素材', label: '茶種素材' },
  ];

  const filteredSlots = filterCategory === 'all'
    ? BINDING_SLOTS
    : BINDING_SLOTS.filter((s) => s.category === filterCategory);

  // Handle local image file upload (saves to server images folder, persists to storage library, and optionally binds to slot)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, bindToSlot: boolean = true) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const isGifName = file.name.toLowerCase().endsWith('.gif');
    if (!file.type.startsWith('image/') && !isGifName) {
      alert('請上傳 GIF 動圖、JPG、PNG、WebP 或 SVG 格式圖片');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result as string;
      if (!base64Data) return;

      // Automatically save the image file into images/ & customAssets.json (and customSettings.json if bindToSlot)
      const serverResult = await saveImageToServer(file.name, base64Data, selectedSlotKey, bindToSlot);
      const finalUrl = serverResult.url || base64Data;

      const newAsset: MediaAsset = serverResult.asset || {
        id: 'asset-' + Date.now(),
        name: file.name.replace(/\.[^/.]+$/, ""),
        category: 'general',
        targetKey: bindToSlot ? selectedSlotKey : '',
        url: finalUrl,
        uploadedAt: new Date().toLocaleDateString('zh-TW'),
        notes: serverResult.filename ? `自動存入 images/${serverResult.filename}` : `${(file.size / 1024).toFixed(1)} KB`
      };

      const updatedAssets = [newAsset, ...assets.filter((a) => a.url !== finalUrl)];
      onUpdateAssets(updatedAssets);

      if (bindToSlot) {
        const updatedCustomImages = {
          ...settings.customImages,
          [selectedSlotKey]: finalUrl
        };
        const newSettings = {
          ...settings,
          customImages: updatedCustomImages
        };
        onUpdateSettings(newSettings);
        saveSettings(newSettings);
        setUploadSuccessMsg(`已成功上傳並永久存入儲存空間！已套用到「${BINDING_SLOTS.find(s => s.key === selectedSlotKey)?.label || selectedSlotKey}」`);
      } else {
        setUploadSuccessMsg(`已成功上傳並永久存入 images 儲存空間！可隨時點選「套用至選定位置」進行綁定`);
      }

      setTimeout(() => setUploadSuccessMsg(null), 4000);
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Bind an existing library asset to the target slot
  const handleBindAssetToSlot = (slotKey: string, imageUrl: string) => {
    const updatedCustomImages = {
      ...settings.customImages,
      [slotKey]: imageUrl
    };
    onUpdateSettings({
      ...settings,
      customImages: updatedCustomImages
    });
    setUploadSuccessMsg(`已套用圖片到「${BINDING_SLOTS.find(s => s.key === slotKey)?.label}」！`);
    setTimeout(() => setUploadSuccessMsg(null), 3000);
  };

  // Clear binding for a slot (keeps uploaded file safely inside asset storage)
  const handleClearSlotBinding = (slotKey: string) => {
    const updated = { ...settings.customImages };
    delete updated[slotKey];
    const nextSettings = {
      ...settings,
      customImages: updated
    };
    onUpdateSettings(nextSettings);
    saveSettings(nextSettings, slotKey);
  };

  // Delete asset from library explicitly
  const handleDeleteAsset = (id: string, url: string) => {
    const filtered = assets.filter(a => a.id !== id);
    onUpdateAssets(filtered, url);

    // Also remove from any slot that was using this exact image
    const updatedCustomImages = { ...settings.customImages };
    const removedKeys: string[] = [];
    Object.entries(updatedCustomImages).forEach(([k, v]) => {
      if (v === url) {
        delete updatedCustomImages[k];
        removedKeys.push(k);
      }
    });
    if (removedKeys.length > 0) {
      const nextSettings = { ...settings, customImages: updatedCustomImages };
      onUpdateSettings(nextSettings);
      saveSettings(nextSettings, undefined, removedKeys);
    }
  };

  const handleTextChange = (key: string, val: string) => {
    // Monster names are locked and must not be modified
    if (/^monster-.+-name$/.test(key)) return;
    const updatedTexts = {
      ...(settings.customTexts || DEFAULT_TEXTS),
      [key]: val
    };
    const newSettings = {
      ...settings,
      customTexts: updatedTexts
    };
    onUpdateSettings(newSettings);
    // Automatically save immediately to server backend (customSettings.json)
    saveSettings(newSettings);
  };

  // All text edits are automatically and permanently saved to backend customSettings.json

  const handleSaveAndClose = () => {
    saveSettings(settings);
    onClose();
  };

  const currentSlotObj = BINDING_SLOTS.find(s => s.key === selectedSlotKey);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden text-stone-800">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shadow-sm">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-tc text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
                素材與圖片後台管理庫
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  即時換圖中
                </span>
              </h2>
              <p className="text-xs text-stone-500">
                可隨時上傳正式素材更換初稿、自訂背景圖，以及調整展示倒數秒數
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success toast notification */}
        {uploadSuccessMsg && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs sm:text-sm font-medium flex items-center gap-2 animate-fade-in shadow-md">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{uploadSuccessMsg}</span>
          </div>
        )}

        {/* Modal Navigation Tabs */}
        <div className="px-6 pt-3 border-b border-stone-200 bg-white flex items-center gap-2">
          <button
            onClick={() => setActiveTab('slots')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'slots'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            介面位置換圖 (Slot Binding)
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'upload'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FilePlus className="w-4 h-4" />
            素材總庫 ({assets.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            展示秒數與白階參數
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'text'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Type className="w-4 h-4" />
            介面文字自訂 (Text Editor)
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-stone-50/50">
          
          {/* TAB 1: INTERFACE SLOTS BINDING */}
          {activeTab === 'slots' && (
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif-tc text-base font-bold text-stone-800">
                    目前選定的替換目標：
                    <span className="text-emerald-700 font-mono ml-1">
                      {currentSlotObj?.label}
                    </span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {currentSlotObj?.desc} · 點選下方按鈕直接上傳電腦中的正式素材，立即替換
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/gif,image/*"
                    onChange={(e) => handleFileUpload(e, true)}
                    className="hidden"
                    id="slot-direct-upload"
                  />
                  <label
                    htmlFor="slot-direct-upload"
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    上傳圖片 / GIF 並套用
                  </label>

                  {settings.customImages[selectedSlotKey] && (
                    <button
                      onClick={() => handleClearSlotBinding(selectedSlotKey)}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <RotateCcwIcon className="w-3.5 h-3.5" />
                      恢復預設
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-stone-700">
                <AlertCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-emerald-900 block">
                    認識茶 GIF 動圖與最終列印標籤圖設定說明：
                  </span>
                  <p className="text-stone-600 leading-relaxed">
                    可在下方切換「認識茶 GIF」上傳六款茶種或通用的滿版 GIF 動圖，並可切換至「列印標籤圖」上傳製作完成的標籤圖檔（上傳後將直接顯示並印出該標籤圖）。
                  </p>
                </div>
              </div>

              {/* Category Filter Bar */}
              <div className="flex flex-wrap gap-1.5 bg-white p-2 rounded-2xl border border-stone-200 shadow-2xs">
                {SLOT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilterCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                      filterCategory === cat.id
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Slot Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSlots.map((slot) => {
                  const isSelected = selectedSlotKey === slot.key;
                  const boundUrl = settings.customImages[slot.key];
                  const isContainPreview = slot.category === '列印標籤' || slot.category === '茶靈小怪獸' || slot.category === '按鈕圖檔' || slot.category === '茶具素材';

                  return (
                    <div
                      key={slot.key}
                      onClick={() => setSelectedSlotKey(slot.key)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md translate-y-[-1px]'
                          : 'border-stone-200 hover:border-emerald-300 hover:bg-stone-50/70 shadow-sm'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                            {slot.category}
                          </span>
                          {boundUrl ? (
                            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200">
                              <Check className="w-3 h-3" /> 已自訂換圖
                            </span>
                          ) : (
                            <span className="text-[11px] text-stone-400 font-mono">
                              使用預設圖
                            </span>
                          )}
                        </div>

                        <h4 className="font-serif-tc text-sm font-bold text-stone-900 line-clamp-1">
                          {slot.label}
                        </h4>
                        <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                          {slot.desc}
                        </p>
                      </div>

                      {/* Thumbnail Preview Area */}
                      <div className="mt-3 h-28 w-full rounded-xl bg-stone-100 border border-stone-200 overflow-hidden relative group">
                        {boundUrl ? (
                          <img
                            src={boundUrl}
                            alt={slot.label}
                            className={`w-full h-full transition-transform group-hover:scale-105 ${
                              slot.category === '列印標籤'
                                ? 'object-contain'
                                : isContainPreview
                                  ? 'object-contain p-1 bg-white'
                                  : 'object-cover'
                            }`}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 p-2 text-center">
                            <ImageIcon className="w-6 h-6 stroke-[1.5] mb-1 text-stone-300" />
                            <span className="text-[11px]">尚未上傳自訂圖片</span>
                            <span className="text-[10px] text-stone-400">點擊此處即可選擇並上傳</span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSlotKey(slot.key);
                              fileInputRef.current?.click();
                            }}
                            className="px-2.5 py-1 bg-white text-stone-800 text-xs rounded-lg font-medium shadow-md hover:bg-stone-100 cursor-pointer"
                          >
                            上傳替換
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD & GENERAL MEDIA ASSETS POOL */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              {/* Drag/Drop and File Picker Zone */}
              <div className="bg-white border-2 border-dashed border-stone-300 hover:border-emerald-500 rounded-2xl p-6 text-center transition-colors">
                <input
                  type="file"
                  accept="image/gif,image/*"
                  onChange={(e) => handleFileUpload(e, false)}
                  className="hidden"
                  id="pool-file-upload"
                />
                <label
                  htmlFor="pool-file-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 shadow-inner">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif-tc text-base font-bold text-stone-800 mb-1">
                    點擊選擇或拖放圖片 / GIF 到此處上傳
                  </h4>
                  <p className="text-xs text-stone-500 max-w-sm">
                    支援 GIF 動圖、JPG、PNG、WebP、SVG。上傳後的檔案會存入 images 資料夾，供隨時指派到認識茶 GIF、列印標籤或任何介面區塊。
                  </p>
                </label>
              </div>

              {/* Assets Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-tc text-base font-bold text-stone-800">
                    素材庫現有圖片 ({assets.length})
                  </h3>
                  <div className="text-xs text-stone-500">
                    點擊「套用至」可指定給目前所選的畫面區塊
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {assets.map((asset) => (
                    <div
                      key={asset.id}
                      className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
                    >
                      <div className="h-32 w-full bg-stone-100 relative overflow-hidden">
                        {asset.url ? (
                          <img
                            src={asset.url}
                            alt={asset.name}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
                            <ImageIcon className="w-6 h-6 text-stone-300" />
                            <span className="text-[10px] mt-1">尚未綁定圖檔</span>
                          </div>
                        )}
                        <button
                          onClick={() => handleDeleteAsset(asset.id, asset.url)}
                          className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-rose-50 text-rose-600 rounded-lg shadow opacity-0 group-hover:opacity-100 transition-opacity"
                          title="刪除此素材"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="p-3">
                        <h5 className="font-serif-tc text-xs font-bold text-stone-900 truncate">
                          {asset.name}
                        </h5>
                        <p className="text-[10px] text-stone-400 font-mono mt-0.5">
                          {asset.uploadedAt} · {asset.notes}
                        </p>

                        <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between">
                          <button
                            onClick={() => handleBindAssetToSlot(selectedSlotKey, asset.url)}
                            className="w-full py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            套用至選定位置
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SETTINGS & DURATION */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-6 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
              <div>
                <h3 className="font-serif-tc text-lg font-bold text-stone-900 mb-1">
                  展覽互動節奏與秒數設定
                </h3>
                <p className="text-xs text-stone-500">
                  依照現場觀展體驗微調秒數長短與色彩偏好
                </p>
              </div>

              {/* Duration Slider (Default 30s) */}
              <div className="space-y-3 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-stone-800 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-700" />
                    製茶流程展示時間 (秒)
                  </label>
                  <span className="font-mono text-base font-bold text-emerald-700 bg-white px-3 py-1 rounded-xl border border-stone-200 shadow-xs">
                    {settings.processDurationSeconds} 秒
                  </span>
                </div>
                
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={settings.processDurationSeconds}
                  onChange={(e) => {
                    const sec = parseInt(e.target.value, 10);
                    onUpdateSettings({
                      ...settings,
                      processDurationSeconds: sec
                    });
                  }}
                  className="w-full accent-emerald-700 cursor-pointer"
                />

                <div className="flex justify-between text-[11px] text-stone-400 font-mono">
                  <span>10 秒 (快速測試)</span>
                  <span className="text-emerald-700 font-semibold">30 秒 (標準展示設定)</span>
                  <span>60 秒 (深度導覽)</span>
                </div>
              </div>

              {/* Theme Tone Switcher: Pure Light / Warm Ceramic White */}
              <div className="space-y-3 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <label className="text-sm font-bold text-stone-800 block">
                  白色調背景風格選擇
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      onUpdateSettings({
                        ...settings,
                        backgroundColor: '#F9FAF9',
                        cardBackgroundColor: '#FFFFFF'
                      });
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 cursor-pointer ${
                      settings.backgroundColor === '#F9FAF9'
                        ? 'border-emerald-600 bg-white ring-2 ring-emerald-500/20'
                        : 'border-stone-200 bg-stone-100 text-stone-600'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-[#F9FAF9] border border-stone-300 shadow-inner" />
                    <div>
                      <div className="text-xs font-bold text-stone-800">清新茶霜白</div>
                      <div className="text-[10px] text-stone-400">乾淨簡約，高對比度</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onUpdateSettings({
                        ...settings,
                        backgroundColor: '#F7F6F2',
                        cardBackgroundColor: '#FFFFFF'
                      });
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 cursor-pointer ${
                      settings.backgroundColor === '#F7F6F2'
                        ? 'border-emerald-600 bg-white ring-2 ring-emerald-500/20'
                        : 'border-stone-200 bg-stone-100 text-stone-600'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-[#F7F6F2] border border-stone-300 shadow-inner" />
                    <div>
                      <div className="text-xs font-bold text-stone-800">白瓷暖米白</div>
                      <div className="text-[10px] text-stone-400">溫潤柔和，茶席質感</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Emotion Button Size Sliders: Individual adjustment per emotion button */}
              <div className="space-y-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-2.5">
                  <div>
                    <label className="text-sm font-bold text-stone-800 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-emerald-700" />
                      六款情緒按鈕個別大小手動調整
                    </label>
                    <p className="text-xs text-stone-500 mt-0.5">
                      可單獨設定每張小怪獸按鈕的呈現大小（70px ~ 260px，無圓框微浮動）
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const uniform = settings.emotionButtonSize || 150;
                      onUpdateSettings({
                        ...settings,
                        emotionButtonSizes: {
                          calm: uniform,
                          warm: uniform,
                          joy: uniform,
                          nostalgic: uniform,
                          vibrant: uniform,
                          grounded: uniform
                        }
                      });
                    }}
                    className="px-2.5 py-1 text-[11px] font-medium bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg border border-emerald-300 cursor-pointer transition-colors self-start sm:self-auto shrink-0"
                  >
                    統一套用 {settings.emotionButtonSize || 150}px
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {EMOTIONS.map((emotion, idx) => {
                    const currentSize = settings.emotionButtonSizes?.[emotion.id] || settings.emotionButtonSize || 150;
                    return (
                      <div key={emotion.id} className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900 font-serif-tc flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-600" />
                            {emotion.label}（小怪獸{idx + 1}.jpg）
                          </span>
                          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {currentSize} px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="70"
                          max="260"
                          step="5"
                          value={currentSize}
                          onChange={(e) => {
                            const newSize = parseInt(e.target.value, 10);
                            onUpdateSettings({
                              ...settings,
                              emotionButtonSizes: {
                                ...(settings.emotionButtonSizes || {}),
                                [emotion.id]: newSize
                              }
                            });
                          }}
                          className="w-full accent-emerald-700 cursor-pointer"
                        />
                        <div className="flex justify-between text-[9px] text-stone-400 font-mono">
                          <span>70px</span>
                          <span className="text-emerald-700">推薦 150px</span>
                          <span>260px</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tea Cup Size Slider in Steam Transition per user request */}
              <div className="space-y-3 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-bold text-stone-800 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-emerald-700" />
                      茶湯過渡畫面：茶杯大小手動調節 (Tea Cup Size)
                    </label>
                    <p className="text-xs text-stone-500 mt-0.5">
                      手動微調蒸氣凝結過渡畫面中去背茶杯的呈現尺寸（100px ~ 420px）
                    </p>
                  </div>
                  <span className="font-mono text-base font-bold text-emerald-700 bg-white px-3 py-1 rounded-xl border border-stone-200 shadow-2xs">
                    {settings.teaCupSize || 210} px
                  </span>
                </div>
                
                <input
                  type="range"
                  min="100"
                  max="420"
                  step="5"
                  value={settings.teaCupSize || 210}
                  onChange={(e) => {
                    const size = parseInt(e.target.value, 10);
                    onUpdateSettings({
                      ...settings,
                      teaCupSize: size
                    });
                  }}
                  className="w-full accent-emerald-700 cursor-pointer"
                />

                <div className="flex justify-between text-[11px] text-stone-400 font-mono">
                  <span>100px (小茶盞)</span>
                  <span className="text-emerald-700 font-semibold">210px (標準推薦)</span>
                  <span>420px (大特寫茶席)</span>
                </div>
              </div>

              {/* 6 Emotion NFC Chip Codes Configuration */}
              <div className="space-y-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-2.5">
                  <div>
                    <label className="text-sm font-bold text-stone-800 flex items-center gap-2">
                      <Radio className="w-4 h-4 text-emerald-700" />
                      選情緒介面：六款心境 NFC 晶片代碼綁定
                    </label>
                    <p className="text-xs text-stone-500 mt-0.5">
                      僅在「選情緒介面」讀取以下晶片；若在「認識茶種介面」感應到這些晶片將跳出錯誤提示視窗
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {EMOTIONS.map((emotion) => {
                    const chipLabel = EMOTION_NFC_CHIP_NAMES[emotion.id] || emotion.label;
                    const monsterName = DEFAULT_TEXTS[`monster-${emotion.id}-name`] || emotion.label;
                    const currentUid = settings.emotionNfcChips?.[emotion.id] ?? DEFAULT_EMOTION_NFC_CHIPS[emotion.id] ?? '';
                    return (
                      <div key={emotion.id} className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-stone-900 font-serif-tc">
                            {chipLabel}（{monsterName}）
                          </span>
                          <span className="text-[10px] font-mono text-stone-400">#{emotion.id}</span>
                        </div>
                        <input
                          type="text"
                          value={currentUid}
                          onChange={(e) => {
                            onUpdateSettings({
                              ...settings,
                              emotionNfcChips: {
                                ...(settings.emotionNfcChips || DEFAULT_EMOTION_NFC_CHIPS),
                                [emotion.id]: e.target.value.trim()
                              }
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs focus:bg-white focus:border-emerald-600"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reset All Settings Button */}
              <div className="pt-4 border-t border-stone-200 flex justify-between items-center">
                <button
                  onClick={onResetDefaults}
                  className="px-4 py-2 text-xs font-medium text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                >
                  重設全部設定與自訂圖
                </button>

                <button
                  onClick={handleSaveAndClose}
                  className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-medium rounded-xl shadow-sm cursor-pointer transition-all"
                >
                  儲存並返回展示
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: TEXT CUSTOMIZATION & EDITING */}
          {activeTab === 'text' && (
            <div className="max-w-3xl mx-auto space-y-6 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
                <div>
                  <h3 className="font-serif-tc text-lg font-bold text-stone-900 mb-1 flex items-center gap-2">
                    <Type className="w-5 h-5 text-emerald-700" />
                    自訂介面文字與文案
                  </h3>
                  <p className="text-xs text-stone-500">
                    可在此直接修改情緒提問、六大心境選項、蒸氣過渡與列印小卡上的所有文字
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                  <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-2xs font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    已啟用即時後台存檔 · 刷新永久保留
                  </span>
                </div>
              </div>

              {/* Section 1: Tea Standby Scan Title & Subtitle */}
              <div className="space-y-4 p-5 rounded-2xl bg-stone-50 border border-stone-200">
                <h4 className="font-serif-tc text-sm font-bold text-stone-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  1. 選茶感應介面大標題與說明文字
                </h4>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-medium text-stone-700 block mb-1">
                      選茶介面大標題 (滿版不折行)
                    </label>
                    <input
                      type="text"
                      value={currentTexts['scan-prompt-title'] || ''}
                      onChange={(e) => handleTextChange('scan-prompt-title', e.target.value)}
                      placeholder="請將茶杯放置於 NFC 讀卡機感應"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 focus:border-emerald-600 text-stone-800 text-sm font-serif-tc font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-stone-700 block mb-1">
                      選茶介面副標說明
                    </label>
                    <input
                      type="text"
                      value={currentTexts['scan-prompt-subtitle'] || ''}
                      onChange={(e) => handleTextChange('scan-prompt-subtitle', e.target.value)}
                      placeholder="系統掃描到不同茶晶片後，將自動展開該茶款的風土特色、風味筆記與專屬製茶工藝介紹卡片。"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 focus:border-emerald-600 text-stone-700 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Emotion Prompt Title */}
              <div className="space-y-4 p-5 rounded-2xl bg-stone-50 border border-stone-200">
                <h4 className="font-serif-tc text-sm font-bold text-stone-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  2. 選茶情緒提問主標題
                </h4>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-medium text-stone-700">
                        提問核心大標題 (支援 &#123;tea&#125; 代入茶種名稱)
                      </label>
                      <span className="text-[11px] font-mono text-stone-400">
                        留空則使用預設文案
                      </span>
                    </div>
                    <input
                      type="text"
                      value={currentTexts['prompt-title'] || ''}
                      onChange={(e) => handleTextChange('prompt-title', e.target.value)}
                      placeholder="感受這杯 {tea} 的香氣，現在的它帶給你什麼感覺？"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 focus:border-emerald-600 text-stone-800 text-sm font-serif-tc font-medium"
                    />
                    <p className="text-[11px] text-stone-500 mt-1">
                      ✦ 範例：<code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">感受這杯 &#123;tea&#125; 的香氣，現在的它帶給你什麼感覺？</code>，系統會自動將 &#123;tea&#125; 替換為當前感應的茶種名稱。
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3: Six Emotion Cards Pure Texts */}
              <div className="space-y-4 p-5 rounded-2xl bg-stone-50 border border-stone-200">
                <h4 className="font-serif-tc text-sm font-bold text-stone-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  3. 六大心境純文字選項 (名稱、英文副標、詩意敘述)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {EMOTIONS.map((emotion, i) => (
                    <div key={emotion.id} className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          選項 {i + 1} (#{emotion.id})
                        </span>
                      </div>

                      <div>
                        <label className="text-[11px] text-stone-500 font-medium block mb-1">
                          中文主要名稱
                        </label>
                        <input
                          type="text"
                          value={currentTexts[`emotion-${emotion.id}-label`] || emotion.label}
                          onChange={(e) => handleTextChange(`emotion-${emotion.id}-label`, e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-300 text-stone-900 font-serif-tc font-bold text-sm focus:bg-white focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-stone-500 font-medium block mb-1">
                          英文副標題
                        </label>
                        <input
                          type="text"
                          value={currentTexts[`emotion-${emotion.id}-sub`] || emotion.subLabel}
                          onChange={(e) => handleTextChange(`emotion-${emotion.id}-sub`, e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-300 text-stone-700 font-mono text-xs focus:bg-white focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-stone-500 font-medium block mb-1">
                          感官詩意敘述
                        </label>
                        <textarea
                          rows={2}
                          value={currentTexts[`emotion-${emotion.id}-desc`] || emotion.description}
                          onChange={(e) => handleTextChange(`emotion-${emotion.id}-desc`, e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-300 text-stone-700 font-serif-tc text-xs leading-relaxed focus:bg-white focus:border-emerald-600 resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section: Steam Condensation Transition Texts */}
              <div className="space-y-4 p-5 rounded-2xl bg-stone-50 border border-stone-200">
                <h4 className="font-serif-tc text-sm font-bold text-stone-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  4. 茶湯蒸氣凝結過渡動態文字
                </h4>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-medium text-stone-700 block mb-1">
                      凝結初期文案
                    </label>
                    <input
                      type="text"
                      value={currentTexts['steam-title-gathering'] || ''}
                      onChange={(e) => handleTextChange('steam-title-gathering', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 focus:border-emerald-600 text-stone-800 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-stone-700 block mb-1">
                      凝結成形文案
                    </label>
                    <input
                      type="text"
                      value={currentTexts['steam-title-condensing'] || ''}
                      onChange={(e) => handleTextChange('steam-title-condensing', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 focus:border-emerald-600 text-stone-800 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-stone-700 block mb-1">
                      過渡導覽說明短文
                    </label>
                    <textarea
                      rows={2}
                      value={currentTexts['steam-desc'] || ''}
                      onChange={(e) => handleTextChange('steam-desc', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 focus:border-emerald-600 text-stone-800 text-xs resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Ticket Texts */}
              <div className="space-y-4 p-5 rounded-2xl bg-stone-50 border border-stone-200">
                <h4 className="font-serif-tc text-sm font-bold text-stone-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  5. 列印標籤小卡抬頭、副標與底部祝詞
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-medium text-stone-700 block mb-1">
                      票券大標題
                    </label>
                    <input
                      type="text"
                      value={currentTexts['ticket-title'] || ''}
                      onChange={(e) => handleTextChange('ticket-title', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 focus:border-emerald-600 text-stone-800 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-stone-700 block mb-1">
                      票券副標題 (英文)
                    </label>
                    <input
                      type="text"
                      value={currentTexts['ticket-subtitle'] || ''}
                      onChange={(e) => handleTextChange('ticket-subtitle', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 focus:border-emerald-600 text-stone-800 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-medium text-stone-700 block mb-1">
                      票券最底部祝詞文案 (頁尾自訂)
                    </label>
                    <input
                      type="text"
                      value={currentTexts['ticket-footer'] || ''}
                      onChange={(e) => handleTextChange('ticket-footer', e.target.value)}
                      placeholder="TEA SPIRIT EXHIBITION · 祝茶安"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 focus:border-emerald-600 text-stone-800 text-xs font-mono"
                    />
                    <p className="text-[11px] text-stone-500 mt-1">
                      ✦ 預設為：<code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">TEA SPIRIT EXHIBITION · 祝茶安</code>，會印在紀念票券的鋸齒撕邊上方。
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 6: Monster Chinese Name & Text Blocks (Per User Request) */}
              <div className="space-y-4 p-5 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="font-serif-tc text-sm font-bold text-stone-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    6. 茶靈小怪獸專屬文案自訂（出現在獲得怪獸與印表機票券）
                  </h4>
                  <span className="text-[11px] text-emerald-800 font-mono font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    小怪獸名稱已鎖定
                  </span>
                </div>

                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
                  <span className="font-bold">✦ 提示：</span>
                  <span>6 款茶靈小怪獸名稱已鎖定定案不再更動，與「列印標籤圖」位置名稱完全同步；此處可自訂個性特質敘述、專屬技能與今日茶運籤！</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3">
                  <div>
                    <label className="font-medium text-stone-700 block mb-1">
                      獲得怪獸上方狀態徽章
                    </label>
                    <input
                      type="text"
                      value={currentTexts['reveal-title'] || ''}
                      onChange={(e) => handleTextChange('reveal-title', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 focus:border-emerald-600 text-stone-800 text-xs"
                      placeholder="例：感官共鳴凝華 · 獲得專屬茶靈小怪獸"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-stone-700 block mb-1">
                      喚醒祝賀主標 (可用 <span className="font-mono text-emerald-700">{'{monsterName}'}</span> 代入怪獸名稱)
                    </label>
                    <input
                      type="text"
                      value={currentTexts['reveal-congrats'] || ''}
                      onChange={(e) => handleTextChange('reveal-congrats', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 focus:border-emerald-600 text-stone-800 text-xs"
                      placeholder="例：恭喜喚醒「{monsterName}」！"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {EMOTIONS.map((emotion) => (
                    <div key={emotion.id} className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                        <span className="text-xs font-bold text-stone-900 font-serif-tc flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-600" />
                          對應心境：【{currentTexts[`emotion-${emotion.id}-label`] || emotion.label}】之茶靈小怪獸
                        </span>
                        <span className="text-[10px] font-mono text-stone-400">
                          #{emotion.id}
                        </span>
                      </div>

                      <div className="text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] text-stone-600 font-medium">
                            小怪獸名稱（已鎖定，不再更動）
                          </label>
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                            <Lock className="w-2.5 h-2.5" />
                            已鎖定
                          </span>
                        </div>
                        <input
                          type="text"
                          value={DEFAULT_TEXTS[`monster-${emotion.id}-name`] || ''}
                          readOnly
                          disabled
                          className="w-full px-3 py-1.5 rounded-lg bg-stone-100 border border-stone-200 text-stone-600 font-serif-tc font-bold text-sm cursor-not-allowed select-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="text-[11px] text-stone-600 font-medium block mb-1">
                            專屬技能文案
                          </label>
                          <textarea
                            rows={2}
                            value={currentTexts[`monster-${emotion.id}-skill`] || ''}
                            onChange={(e) => handleTextChange(`monster-${emotion.id}-skill`, e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-300 text-stone-800 font-serif-tc text-xs leading-relaxed focus:bg-white focus:border-emerald-600 resize-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-stone-600 font-medium block mb-1">
                            今日茶運御守籤詩（列印紀念票籤專屬）
                          </label>
                          <textarea
                            rows={2}
                            value={currentTexts[`monster-${emotion.id}-fortune`] || ''}
                            onChange={(e) => handleTextChange(`monster-${emotion.id}-fortune`, e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-300 text-stone-800 font-serif-tc text-xs leading-relaxed focus:bg-white focus:border-emerald-600 resize-none"
                          />
                        </div>
                      </div>

                      <div className="text-xs">
                        <label className="text-[11px] text-stone-600 font-medium block mb-1">
                          個性特質敘述
                        </label>
                        <textarea
                          rows={2}
                          value={currentTexts[`monster-${emotion.id}-personality`] || ''}
                          onChange={(e) => handleTextChange(`monster-${emotion.id}-personality`, e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-300 text-stone-800 font-serif-tc text-xs leading-relaxed focus:bg-white focus:border-emerald-600 resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 7: Wrong Chip Alert Modal Texts */}
              <div className="space-y-4 p-5 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="font-serif-tc text-sm font-bold text-stone-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-600" />
                    7. NFC 晶片感應錯誤提示視窗（您放錯了！請重放一次！）
                  </h4>
                  <span className="text-[11px] text-rose-800 font-mono font-medium bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    放錯晶片或非認識茶種階段感應時彈出
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 text-xs">
                  <div>
                    <label className="font-medium text-stone-700 block mb-1">
                      彈窗警告大標題
                    </label>
                    <input
                      type="text"
                      value={currentTexts['wrong-chip-title'] || ''}
                      onChange={(e) => handleTextChange('wrong-chip-title', e.target.value)}
                      placeholder="您放錯了！請重放一次！"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 focus:border-emerald-600 text-stone-800 text-xs font-bold font-serif-tc"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-medium text-stone-700 block mb-1">
                      彈窗說明提示短文
                    </label>
                    <textarea
                      rows={2}
                      value={currentTexts['wrong-chip-desc'] || ''}
                      onChange={(e) => handleTextChange('wrong-chip-desc', e.target.value)}
                      placeholder="感應到的茶品晶片不屬於當前步驟，或非本展覽之專屬茶品晶片。請重新確認並放置專屬茶杯晶片。"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 focus:border-emerald-600 text-stone-700 text-xs resize-none font-serif-tc"
                    />
                  </div>
                </div>
              </div>

              {/* Close / Return Button */}
              <div className="pt-4 border-t border-stone-200 flex justify-end">
                <button
                  onClick={handleSaveAndClose}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-medium rounded-xl shadow-sm cursor-pointer transition-all"
                >
                  儲存並返回展示
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Info */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div>
            已套用 <span className="font-bold text-emerald-800">{Object.keys(settings.customImages).length}</span> 張自訂圖片素材 · 秒數：<span className="font-mono font-bold text-emerald-800">{settings.processDurationSeconds}s</span>
          </div>
          <div>
            白調展示模式 (White Clean Aesthetic)
          </div>
        </div>

      </div>
    </div>
  );
};

function RotateCcwIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
    </svg>
  );
}
