/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { TEAS, EMOTIONS } from './data/teaData';
import { TeaProduct, EmotionOption, TeaMonster } from './types/tea';
import { MediaAsset, CustomThemeSettings } from './types/media';
import { 
  saveAssets, 
  fetchAssetsFromServer,
  saveSettings, 
  saveImageToServer,
  DEFAULT_ASSETS, 
  DEFAULT_SETTINGS,
  DEFAULT_TEXTS,
  DEFAULT_EMOTION_NFC_CHIPS,
  LOCKED_MONSTER_NAMES
} from './utils/mediaStorage';
import { generateTeaMonster } from './data/monsterData';
import { HomeCoverView } from './components/HomeCoverView';
import { InteractiveTeaTable } from './components/InteractiveTeaTable';
import { TeaProcessView } from './components/TeaProcessView';
import { TeaWaitingScanView } from './components/TeaWaitingScanView';
import { SteamCondensationView } from './components/SteamCondensationView';
import { EmotionSelector } from './components/EmotionSelector';
import { MonsterReveal } from './components/MonsterReveal';
import { PrinterOutput } from './components/PrinterOutput';
import { MediaGalleryModal } from './components/MediaGalleryModal';
import { HamburgerMenu } from './components/HamburgerMenu';
import { sounds } from './utils/audio';
import { useNfcReader, NfcScanMode } from './utils/useNfcReader';
import { Radio, AlertTriangle, X } from 'lucide-react';

type Stage = 'home' | 'select' | 'process' | 'steam' | 'emotion' | 'reveal' | 'printer';

export default function App() {
  const [selectedTea, setSelectedTea] = useState<TeaProduct>(TEAS[0]);
  const [currentStage, setCurrentStage] = useState<Stage>('home');
  const [hasScannedTea, setHasScannedTea] = useState<boolean>(false);
  const [nfcToast, setNfcToast] = useState<{ message: string; teaName: string } | null>(null);
  const [isProcessFading, setIsProcessFading] = useState<boolean>(false);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionOption | null>(null);
  const [monster, setMonster] = useState<TeaMonster | null>(null);
  const [wrongChipModal, setWrongChipModal] = useState<{
    isOpen: boolean;
    scannedUid: string;
  } | null>(null);

  // Media assets and custom settings
  const [assets, setAssets] = useState<MediaAsset[]>(DEFAULT_ASSETS);
  const [settings, setSettings] = useState<CustomThemeSettings>(DEFAULT_SETTINGS);
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [isNfcModalOpen, setIsNfcModalOpen] = useState<boolean>(false);
  const [galleryInitialTab, setGalleryInitialTab] = useState<'slots' | 'upload' | 'settings' | 'text'>('slots');
  const [nfcTriggeredEmotionId, setNfcTriggeredEmotionId] = useState<string | null>(null);
  const processChartInputRef = useRef<HTMLInputElement | null>(null);
  const wrongChipTimerRef = useRef<number | null>(null);
  const emotionNfcTimerRef = useRef<number | null>(null);

  // Load server-persisted settings & asset library on mount (authoritative from disk; never resurrects stale localStorage items)
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((serverSettings) => {
        if (serverSettings && typeof serverSettings === 'object') {
          setSettings((prev) => {
            const nextTexts = {
              ...DEFAULT_TEXTS,
              ...(serverSettings.customTexts || {})
            };
            Object.entries(LOCKED_MONSTER_NAMES).forEach(([emotionId, lockedName]) => {
              nextTexts[`monster-${emotionId}-name`] = lockedName;
            });
            const nextImages = {
              ...DEFAULT_SETTINGS.customImages,
              ...(serverSettings.customImages || {})
            };
            const nextEmotionChips = {
              ...DEFAULT_EMOTION_NFC_CHIPS,
              ...(serverSettings.emotionNfcChips || {})
            };
            const nextSettings: CustomThemeSettings = {
              ...prev,
              ...serverSettings,
              customImages: nextImages,
              customTexts: nextTexts,
              emotionNfcChips: nextEmotionChips
            };
            return nextSettings;
          });
        }
      })
      .catch(() => {
        // Fallback to frozen defaults if API is not running
      });

    fetchAssetsFromServer().then((serverAssets) => {
      if (Array.isArray(serverAssets)) {
        setAssets(serverAssets);
      }
    });
  }, []);

  // Sync assets and settings to backend
  const handleUpdateAssets = (newAssets: MediaAsset[], deletedUrl?: string) => {
    setAssets(newAssets);
    saveAssets(newAssets, deletedUrl);
  };

  const handleUpdateSettings = (newSettings: CustomThemeSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleUpdateCustomImage = (key: string, url: string) => {
    const newSettings = {
      ...settings,
      customImages: {
        ...settings.customImages,
        [key]: url
      }
    };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Upload flowchart directly from Hamburger Menu action
  const handleProcessChartUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64Data = ev.target?.result as string;
      if (!base64Data) return;

      const isGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');
      const targetKey = isGif
        ? `process-gif-${selectedTea.id}`
        : `process-chart-${selectedTea.id}`;
      const result = await saveImageToServer(file.name, base64Data, targetKey);
      const finalUrl = result.url || base64Data;
      const nextImages: Record<string, string> = {
        ...settings.customImages,
        [targetKey]: finalUrl
      };
      if (!isGif) {
        delete nextImages[`process-gif-${selectedTea.id}`];
      }
      handleUpdateSettings({
        ...settings,
        customImages: nextImages
      });
      if (result.asset) {
        const nextAssets = [result.asset, ...assets.filter((a) => a.url !== finalUrl)];
        handleUpdateAssets(nextAssets);
      }
      sounds.playConfirmChime();
      setNfcToast({
        message: isGif ? '認識茶 GIF 動圖上傳成功！' : '流程海報上傳成功！已存入 images 資料夾',
        teaName: selectedTea.name
      });
      setTimeout(() => setNfcToast(null), 3500);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleResetDefaults = () => {
    // Preserve uploaded images in storage, customTexts, customImages, and emotion NFC chip mappings
    const uploadedAssets = assets.filter((a) => a.url && a.url.startsWith('/images/'));
    const seen = new Set(uploadedAssets.map((a) => a.url));
    const mergedAssets = [
      ...uploadedAssets,
      ...DEFAULT_ASSETS.filter((a) => !a.url || !seen.has(a.url))
    ];
    setAssets(mergedAssets);
    saveAssets(mergedAssets);
    const preservedSettings: CustomThemeSettings = {
      ...DEFAULT_SETTINGS,
      customImages: settings.customImages,
      customTexts: settings.customTexts,
      emotionNfcChips: settings.emotionNfcChips || { ...DEFAULT_EMOTION_NFC_CHIPS }
    };
    setSettings(preservedSettings);
    saveSettings(preservedSettings);
  };

  // When a tea is selected manually or via UI card click
  const handleSelectTea = (tea: TeaProduct) => {
    setSelectedTea(tea);
    setHasScannedTea(true);
    setSelectedEmotion(null);
    setMonster(null);
    setIsProcessFading(false);
    setCurrentStage('process');
  };

  // NFC Reader Hardware & Web NFC listener for Tea Chips (only active in home / select / process / NFC modal)
  const handleNfcScanTea = (tea: TeaProduct, chipUid: string) => {
    if (!isNfcModalOpen && currentStage !== 'home' && currentStage !== 'select' && currentStage !== 'process') {
      if (currentStage === 'emotion') {
        handleInvalidScan(chipUid);
      }
      return;
    }
    setIsNfcModalOpen(false);
    setSelectedTea(tea);
    setHasScannedTea(true);
    setSelectedEmotion(null);
    setMonster(null);
    setIsProcessFading(false);
    setCurrentStage('process');
  };

  // NFC Reader listener for Emotion Chips (only active in emotion stage)
  const handleNfcScanEmotion = (emotion: EmotionOption, _chipUid: string) => {
    if (currentStage !== 'emotion' || isGalleryOpen || isNfcModalOpen) {
      return;
    }
    if (emotionNfcTimerRef.current) {
      clearTimeout(emotionNfcTimerRef.current);
    }
    setNfcTriggeredEmotionId(emotion.id);

    emotionNfcTimerRef.current = window.setTimeout(() => {
      setNfcTriggeredEmotionId(null);
      handleEmotionSelected(emotion);
      emotionNfcTimerRef.current = null;
    }, 700);
  };

  // Unrecognized chip or wrong-stage chip handler: pop up 「您放錯了！請重放一次！」 modal
  // Auto-dismisses after 1 second per user request without needing manual close button
  const handleInvalidScan = (scannedUid: string) => {
    sounds.playWrongCup();
    if (wrongChipTimerRef.current) {
      clearTimeout(wrongChipTimerRef.current);
    }
    setWrongChipModal({
      isOpen: true,
      scannedUid
    });
    wrongChipTimerRef.current = window.setTimeout(() => {
      setWrongChipModal(null);
      wrongChipTimerRef.current = null;
    }, 1000);
  };

  // Strict stage-gated NFC rules:
  // - Backend gallery open: 'none' (do not intercept typing/testing)
  // - Tea recognition stages (home, select, process, or NFC modal): 'tea' -> reads 6 tea chips, alerts on emotion/unknown chips
  // - Emotion selection stage (emotion): 'emotion' -> reads 6 emotion chips, alerts on tea/unknown chips
  // - Transition / Reveal / Printer stages (steam, reveal, printer): 'none' -> completely DO NOT read NFC chips
  const nfcMode: NfcScanMode = isGalleryOpen
    ? 'none'
    : (isNfcModalOpen || currentStage === 'home' || currentStage === 'select' || currentStage === 'process')
    ? 'tea'
    : currentStage === 'emotion'
    ? 'emotion'
    : 'none';

  useNfcReader({
    mode: nfcMode,
    onScanTea: handleNfcScanTea,
    onScanEmotion: handleNfcScanEmotion,
    onInvalidScan: handleInvalidScan,
    emotionChipMap: settings.emotionNfcChips
  });

  // Step 1 -> Step 2 transition: Process finished after 30 seconds
  const handleProcessComplete = () => {
    setIsProcessFading(true);
    setTimeout(() => {
      setIsProcessFading(false);
      setCurrentStage('steam');
    }, 600);
  };

  // Steam condensation completed -> Proceed to Emotion Question
  const handleSteamComplete = () => {
    sounds.playWaterDrop();
    setCurrentStage('emotion');
  };

  // Quick skip directly to emotion question (callable from HamburgerMenu)
  const handleSkipToEmotion = () => {
    sounds.playWaterDrop();
    setIsProcessFading(false);
    setCurrentStage('emotion');
  };

  // Step 2 -> Step 3: Emotion selected via Arrow keys + Space confirmation
  const handleEmotionSelected = (emotion: EmotionOption) => {
    setSelectedEmotion(emotion);
    const newMonster = generateTeaMonster(selectedTea, emotion);
    const lockedName = LOCKED_MONSTER_NAMES[emotion.id];
    if (lockedName) {
      newMonster.name = lockedName;
    }
    if (settings.customTexts) {
      const customSkill = settings.customTexts[`monster-${emotion.id}-skill`];
      const customFortune = settings.customTexts[`monster-${emotion.id}-fortune`];
      const customPersonality = settings.customTexts[`monster-${emotion.id}-personality`];
      if (!lockedName && settings.customTexts[`monster-${emotion.id}-name`]) {
        newMonster.name = settings.customTexts[`monster-${emotion.id}-name`];
      }
      if (customSkill) newMonster.specialSkill = customSkill;
      if (customFortune) newMonster.teaFortune = customFortune;
      if (customPersonality) newMonster.personality = customPersonality;
    }
    setMonster(newMonster);
    setCurrentStage('reveal');
  };

  // Step 3 -> Step 4: Transmission completed, proceed to printer
  const handleProceedToPrinter = () => {
    setCurrentStage('printer');
  };

  // Restart / Reset flow for next visitor
  const handleReset = () => {
    setSelectedEmotion(null);
    setMonster(null);
    setIsProcessFading(false);
    setCurrentStage('home');
  };

  // Background image resolution: full-bleed background for emotion or steam stage
  const stageBgImage = 
    currentStage === 'emotion' && settings.customImages['bg-emotion'] 
      ? settings.customImages['bg-emotion'] 
      : currentStage === 'steam' && (settings.customImages['bg-steam'] || settings.customImages['bg-main'])
      ? (settings.customImages['bg-steam'] || settings.customImages['bg-main'])
      : settings.customImages['bg-main'];

  return (
    <div 
      className="print-container min-h-screen max-h-screen text-stone-800 flex flex-col selection:bg-emerald-200 selection:text-emerald-950 transition-colors overflow-y-auto lg:overflow-hidden relative"
      style={{
        backgroundColor: settings.backgroundColor || '#F9FAF9',
        backgroundImage: stageBgImage ? `linear-gradient(rgba(249, 250, 249, 0.94), rgba(249, 250, 249, 0.97)), url(${stageBgImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Global NFC Floating Notification Banner */}
      {nfcToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-bounce">
          <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-emerald-700/95 text-white backdrop-blur-md border border-emerald-400/50 shadow-2xl">
            <Radio className="w-4 h-4 text-emerald-300 animate-pulse shrink-0" />
            <span className="font-serif-tc text-xs sm:text-sm font-bold tracking-wide">
              {nfcToast.message} · {nfcToast.teaName}
            </span>
          </div>
        </div>
      )}

      {/* Hidden File Input for Direct GIF / Flowchart Upload */}
      <input
        ref={processChartInputRef}
        type="file"
        accept="image/gif,image/*"
        onChange={handleProcessChartUpload}
        className="hidden"
      />

      {/* Right-click Control Menu (Hidden from screen surface, activated via right-click or touchscreen long-press) */}
      <HamburgerMenu
        onOpenGallery={(tab) => {
          setGalleryInitialTab(tab || 'slots');
          setIsGalleryOpen(true);
        }}
        onOpenNfcSelect={() => setIsNfcModalOpen(true)}
        onSkipToEmotion={handleSkipToEmotion}
        onReset={handleReset}
        onGoHome={() => setCurrentStage('home')}
        onGoToSelect={() => setIsNfcModalOpen(true)}
        onUploadProcessChart={() => processChartInputRef.current?.click()}
        onSkipProcess={handleProcessComplete}
        currentStage={currentStage}
      />

      {/* Main Exhibition Interactive Canvas - Scaled properly for Fullscreen and Windowed mode */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 flex flex-col justify-center space-y-4">
        {/* Stage 0: Homepage / Exhibition Cover (Borderless, Space/Click transitions to tea process display) */}
        {currentStage === 'home' && (
          <HomeCoverView
            onStart={() => {
              setSelectedTea(selectedTea || TEAS[0]);
              setCurrentStage('process');
            }}
            customCoverImage={settings.customImages['home-cover']}
            customTexts={settings.customTexts}
            isBlocked={Boolean(wrongChipModal?.isOpen) || isGalleryOpen || isNfcModalOpen}
          />
        )}

        {/* Stage 0.5: NFC Standby & Tea Selection Interface ("選擇不同茶的介面")
            User scans NFC card or selects tea here -> then transitions to that tea's introduction card!
        */}
        {currentStage === 'select' && (
          <TeaWaitingScanView
            onSelectTea={handleSelectTea}
            onBackToHome={() => setCurrentStage('home')}
            onInvalidScan={handleInvalidScan}
            customImages={settings.customImages}
            customTexts={settings.customTexts}
          />
        )}

        {/* Dynamic Flow Viewport */}
        <div className="flex-1 flex flex-col justify-center relative my-auto">
          {/* Stage 1: Tea Making Process & Tea Variety Introduction - The Large Infographic Display ("一大片圖") */}
          {currentStage === 'process' && (
            <TeaProcessView
              tea={selectedTea}
              onComplete={handleProcessComplete}
              onBackToSelect={() => setCurrentStage('select')}
              isFadingOut={isProcessFading}
              totalDurationSeconds={settings.processDurationSeconds || 30}
              customImages={settings.customImages}
              onUpdateCustomImage={handleUpdateCustomImage}
            />
          )}

          {/* Stage 2: Steam Condensation Transition Cinematic */}
          {currentStage === 'steam' && (
            <div className="animate-fade-in my-auto">
              <SteamCondensationView
                tea={selectedTea}
                onAnimationComplete={handleSteamComplete}
                customCupImage={settings.customImages['cup-center']}
                customCupSize={settings.teaCupSize}
                customBgImage={settings.customImages['bg-steam'] || settings.customImages['bg-main']}
                customTexts={settings.customTexts}
              />
            </div>
          )}

          {/* Stage 3: Six Emotion selection with NFC sensing & pure button graphics */}
          {currentStage === 'emotion' && (
            <div className="animate-fade-in my-auto">
              <EmotionSelector
                tea={selectedTea}
                onSelectEmotion={handleEmotionSelected}
                customImages={settings.customImages}
                customTexts={settings.customTexts}
                buttonSize={settings.emotionButtonSize}
                buttonSizes={settings.emotionButtonSizes}
                nfcTriggeredEmotionId={nfcTriggeredEmotionId}
                isBlocked={Boolean(wrongChipModal?.isOpen) || isGalleryOpen || isNfcModalOpen}
              />
            </div>
          )}

          {/* Stage 4: Monster Reveal & Automated Transmission to Printer */}
          {currentStage === 'reveal' && selectedEmotion && monster && (
            <div className="animate-fade-in my-auto">
              <MonsterReveal
                tea={selectedTea}
                emotion={selectedEmotion}
                monster={monster}
                onProceedToPrint={handleProceedToPrinter}
                customImages={settings.customImages}
                customTexts={settings.customTexts}
              />
            </div>
          )}

          {/* Stage 5: Printer Output & Souvenir Ticket */}
          {currentStage === 'printer' && selectedEmotion && monster && (
            <div className="animate-fade-in my-auto">
              <PrinterOutput
                tea={selectedTea}
                emotion={selectedEmotion}
                monster={monster}
                onRestart={handleReset}
                customImages={settings.customImages}
                customTexts={settings.customTexts}
              />
            </div>
          )}
        </div>
      </main>

      {/* NFC Standby & Tea Selection Interface - Modal Dialog from Right-Click Control Menu */}
      {isNfcModalOpen && (
        <div 
          onClick={() => setIsNfcModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-5 sm:p-7 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-stone-200"
          >
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-200">
              <span className="font-serif-tc text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-700" />
                NFC 茶款晶片感應與手動選茶測試
              </span>
              <button
                onClick={() => setIsNfcModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <TeaWaitingScanView
              onSelectTea={(tea) => {
                handleSelectTea(tea);
                setIsNfcModalOpen(false);
              }}
              onBackToHome={() => {
                setCurrentStage('home');
                setIsNfcModalOpen(false);
              }}
              onInvalidScan={handleInvalidScan}
              customImages={settings.customImages}
              customTexts={settings.customTexts}
            />
          </div>
        </div>
      )}

      {/* Wrong Chip / Unrecognized NFC Modal: 「您放錯了！」 (1秒後自動消失，僅保留文字提醒，無手動關閉按鈕與NFC代碼列表) */}
      {wrongChipModal?.isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in pointer-events-none"
        >
          <div 
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border-2 border-rose-200 text-center relative animate-scale-up pointer-events-auto"
          >
            {/* Warning Icon */}
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-4 shadow-sm animate-bounce">
              <AlertTriangle className="w-8 h-8" />
            </div>

            {/* Main Alert Title */}
            <h3 className="font-serif-tc text-2xl sm:text-3xl font-extrabold text-stone-900 mb-2">
              {settings.customTexts?.['wrong-chip-title'] || '您放錯了！請重放一次！'}
            </h3>

            {/* Alert Description */}
            <p className="font-serif-tc text-stone-600 text-xs sm:text-sm leading-relaxed">
              {settings.customTexts?.['wrong-chip-desc'] || '感應到的茶品晶片不屬於當前操作步驟，或非本展覽之專屬茶品晶片。請重新確認並放置專屬茶杯晶片。'}
            </p>
          </div>
        </div>
      )}

      {/* Backend Media Asset & Text Management Modal */}
      <MediaGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        assets={assets}
        settings={settings}
        onUpdateAssets={handleUpdateAssets}
        onUpdateSettings={handleUpdateSettings}
        onResetDefaults={handleResetDefaults}
        initialTab={galleryInitialTab}
      />
    </div>
  );
}
