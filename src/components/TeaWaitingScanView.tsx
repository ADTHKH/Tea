import React, { useState } from 'react';
import { TEAS } from '../data/teaData';
import { TeaProduct } from '../types/tea';
import { Radio, Cpu, Sparkles, ArrowLeft, CheckCircle2, Search } from 'lucide-react';
import { sounds } from '../utils/audio';
import { matchNfcToTea } from '../utils/nfcMatcher';

interface Props {
  onSelectTea: (tea: TeaProduct) => void;
  onBackToHome?: () => void;
  onInvalidScan?: (scannedUid: string) => void;
  customImages?: Record<string, string>;
  customTexts?: Record<string, string>;
  scannedNotice?: { message: string; teaName: string } | null;
}

export const TeaWaitingScanView: React.FC<Props> = ({
  onSelectTea,
  onBackToHome,
  onInvalidScan,
  customImages = {},
  customTexts = {},
  scannedNotice = null
}) => {
  const [testInput, setTestInput] = useState('');
  const [testError, setTestError] = useState<string | null>(null);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim()) return;
    const match = matchNfcToTea(testInput);
    if (match) {
      setTestError(null);
      setActiveCardId(match.tea.id);
      sounds.playCupPlace();
      setTimeout(() => {
        onSelectTea(match.tea);
      }, 400);
    } else {
      sounds.playWrongCup();
      if (onInvalidScan) {
        onInvalidScan(testInput.trim());
      } else {
        setTestError(`查無對應晶片碼「${testInput}」，請確認六位晶片碼。`);
        setTimeout(() => setTestError(null), 3500);
      }
    }
  };

  const handleCardClick = (tea: TeaProduct) => {
    setActiveCardId(tea.id);
    sounds.playCupPlace();
    setTimeout(() => {
      onSelectTea(tea);
    }, 350);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto py-4 sm:py-8 flex flex-col items-center justify-center text-center animate-fade-in my-auto">
      {/* Background Soft Aura */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none animate-float-mist" />

      {/* Top Breadcrumb & Status */}
      <div className="w-full flex items-center justify-between mb-4 px-2">
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 hover:bg-stone-100 text-stone-600 hover:text-stone-900 text-xs font-medium transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>返回封面</span>
          </button>
        )}
        <div className="ml-auto inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-mono tracking-wider shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          <Cpu className="w-3.5 h-3.5 text-emerald-700" />
          <span>USB NFC 讀卡機連線中 · 請感應茶款晶片</span>
        </div>
      </div>

      {/* NFC Pulsing Induction Ring */}
      <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center mb-6">
        {/* Concentric ripples simulating NFC induction field */}
        <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping opacity-25 pointer-events-none" />
        <div className="absolute inset-3 rounded-full border border-emerald-400/30 animate-pulse pointer-events-none" />
        <div className="absolute inset-7 rounded-full border border-dashed border-emerald-600/30 animate-steam-swirl pointer-events-none" />
        
        {/* Center Cup / Card Placement Area (Borderless per user request) */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-white/95 shadow-xl backdrop-blur-md flex flex-col items-center justify-center p-3 select-none">
          <div className="w-12 h-12 rounded-full bg-emerald-100/90 flex items-center justify-center text-emerald-800 mb-1.5 shadow-xs">
            <Radio className="w-6 h-6 animate-pulse text-emerald-700" />
          </div>
          <span className="font-serif-tc text-sm sm:text-base font-bold text-stone-900 tracking-wider">
            NFC 讀卡感應區
          </span>
          <span className="text-[10px] font-mono text-emerald-800 mt-0.5 font-bold uppercase tracking-wider">
            PLACE CUP / TAP NFC
          </span>
          <div className="mt-1 text-[10px] text-stone-400 font-sans">
            支援隨插即用讀卡機
          </div>
        </div>
      </div>

      {/* Scanned Notification Banner */}
      {scannedNotice && (
        <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-600 text-white shadow-lg animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span className="font-serif-tc font-bold text-sm tracking-wide">
            {scannedNotice.message} · {scannedNotice.teaName}
          </span>
        </div>
      )}

      {/* Prompts */}
      <div className="space-y-2 max-w-4xl mx-auto px-4 z-10 mb-6">
        <h2 className="font-serif-tc text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-wide whitespace-nowrap">
          {customTexts['scan-prompt-title'] || '請將茶杯放置於 NFC 讀卡機感應'}
        </h2>

        <p className="font-serif-tc text-stone-600 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
          {customTexts['scan-prompt-subtitle'] || '系統掃描到不同茶晶片後，將自動展開該茶款的風土特色、風味筆記與專屬製茶工藝介紹卡片。'}
        </p>
      </div>

      {/* Six Tea NFC Cards Grid (Borderless per user request) */}
      <div className="w-full px-2 sm:px-4 z-10 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[11px] font-mono text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>六款茶品 NFC 晶片碼對應 · 亦可直接點選</span>
          </div>
          <span className="text-[11px] text-stone-400">
            感應或點擊任一茶品即可展示介紹
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {TEAS.map((tea, idx) => {
            const isMatch = activeCardId === tea.id;
            const customImg = customImages[`tea-${tea.id}`];
            const chipCode = tea.nfcChipUid || tea.sensorRfId;

            return (
              <button
                key={tea.id}
                onClick={() => handleCardClick(tea)}
                className={`p-3 rounded-2xl transition-all text-left cursor-pointer group hover:-translate-y-0.5 relative overflow-hidden ${
                  isMatch
                    ? 'bg-emerald-50 shadow-md ring-2 ring-emerald-600/40 scale-102'
                    : 'bg-white/95 hover:bg-emerald-50/70 shadow-xs'
                }`}
              >
                {/* Top Tea Dot & Number */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    {customImg ? (
                      <div className="w-5 h-5 rounded-full overflow-hidden shadow-2xs bg-white">
                        <img src={customImg} alt={tea.name} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <span
                        className="w-3.5 h-3.5 rounded-full shadow-2xs"
                        style={{ backgroundColor: tea.soupColorHex }}
                      />
                    )}
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-stone-400 group-hover:text-emerald-700">
                    #{idx + 1}
                  </span>
                </div>

                {/* Tea Name */}
                <div className="font-serif-tc text-xs sm:text-sm font-bold text-stone-900 group-hover:text-emerald-950 truncate">
                  {tea.name}
                </div>

                {/* Category & Altitude */}
                <div className="text-[10px] text-stone-500 mt-0.5 truncate">
                  {tea.category} · {tea.origin.split('縣')[0]}
                </div>

                {/* Chip UID Badge */}
                <div className="mt-2 text-[10px] font-mono text-emerald-900 font-bold bg-emerald-50 group-hover:bg-emerald-100/90 px-1.5 py-0.5 rounded-lg truncate flex items-center justify-between">
                  <span className="truncate">{chipCode}</span>
                  <Radio className="w-2.5 h-2.5 text-emerald-600 shrink-0 ml-1" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual NFC Reader Code Test Bar (Subtle, for kiosk maintenance and testing) */}
      <div className="mt-2 w-full max-w-md px-4">
        <form onSubmit={handleManualSubmit} className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="掃描或手動輸入晶片碼 (如: 0277537540)..."
              className="w-full px-3 py-1.5 pl-8 rounded-xl bg-white/90 text-xs font-mono focus:outline-none focus:bg-white transition-all shadow-xs"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium transition-all shadow-2xs cursor-pointer shrink-0"
          >
            感應測試
          </button>
        </form>
        {testError && (
          <div className="mt-1.5 text-[11px] text-rose-600 font-medium">
            {testError}
          </div>
        )}
      </div>
    </div>
  );
};
