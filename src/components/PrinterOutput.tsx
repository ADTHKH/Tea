import React, { useEffect, useState, useRef } from 'react';
import { TeaProduct, EmotionOption, TeaMonster } from '../types/tea';
import { TeaMonsterAvatar } from './TeaMonsterAvatar';
import { Printer, RotateCcw, CheckCircle2, Send } from 'lucide-react';
import { sounds } from '../utils/audio';
import { DEFAULT_EMOTION_IMAGES, DEFAULT_TEXTS } from '../utils/mediaStorage';
import { printImage } from '../utils/receiptPrinter';

interface Props {
  tea: TeaProduct;
  emotion: EmotionOption;
  monster: TeaMonster;
  onRestart: () => void;
  customImages?: Record<string, string>;
  customTexts?: Record<string, string>;
}

export const PrinterOutput: React.FC<Props> = ({ 
  tea, 
  emotion, 
  monster, 
  onRestart,
  customImages = {},
  customTexts = {}
}) => {
  const [ticketId] = useState<string>(() => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `TEA-2026-${rand}`;
  });
  const [currentTime] = useState<string>(() => {
    const d = new Date();
    return d.toLocaleString('zh-TW', { hour12: false });
  });

  const [printFinished, setPrintFinished] = useState<boolean>(false);
  const [transmissionStatus, setTransmissionStatus] = useState<'transmitting' | 'printed' | 'failed'>('transmitting');
  const [countdown, setCountdown] = useState<number>(30); // 30秒後自動回到首頁
  const printTriggeredRef = useRef<boolean>(false);

  // Get the monster image from the emotion slot uploaded by user or default
  const monsterImage = customImages[`emotion-${emotion.id}`] || DEFAULT_EMOTION_IMAGES[`emotion-${emotion.id}`];

  // Custom pre-made print label image uploaded by user (per tea+emotion, per emotion, or global default)
  const customLabelImage =
    customImages[`print-label-${tea.id}-${emotion.id}`] ||
    customImages[`print-label-${emotion.id}`] ||
    customImages['print-label-default'] ||
    null;

  // Monster custom text overrides based on emotion (name is locked)
  const monsterName = DEFAULT_TEXTS[`monster-${emotion.id}-name`] || monster.name;
  const monsterTitle = customTexts[`monster-${emotion.id}-title`] || monster.title;
  const monsterFortune = customTexts[`monster-${emotion.id}-fortune`] || monster.teaFortune;
  const monsterSkill = customTexts[`monster-${emotion.id}-skill`] || monster.specialSkill;
  const monsterPersonality = customTexts[`monster-${emotion.id}-personality`] || monster.personality;

  const displayMonster = {
    ...monster,
    name: monsterName,
    title: monsterTitle,
    personality: monsterPersonality,
    teaFortune: monsterFortune,
    specialSkill: monsterSkill
  };

  useEffect(() => {
    sounds.playPrinterFeed();

    // 1. 直接用 USB 收據機印出標籤圖（沒有標籤圖就印小怪獸），不跳列印視窗
    if (!printTriggeredRef.current) {
      printTriggeredRef.current = true;
      handlePrint();
    }

    // 2. 30 seconds countdown to automatically return to home/first step
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          onRestart();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, [onRestart]);

  function handlePrint() {
    setTransmissionStatus('transmitting');
    printImage(customLabelImage || monsterImage)
      .then(() => {
        setTransmissionStatus('printed');
        setPrintFinished(true);
      })
      .catch((err) => {
        console.error('[收據機]', err);
        setTransmissionStatus('failed');
      });
  }

  const handleManualPrint = () => {
    sounds.playPrinterFeed();
    handlePrint();
  };

  const progressPercent = Math.max(0, Math.min(100, (countdown / 30) * 100));

  return (
    <div className="relative max-w-lg mx-auto w-full space-y-2.5 animate-fade-in flex flex-col justify-center max-h-[88vh] overflow-y-auto lg:overflow-hidden my-auto py-1 print:max-h-none print:overflow-visible print:max-w-none print:py-0 print:space-y-0">
      {/* Compact Top Status & Countdown Unified Bar */}
      <div className="bg-white/95 border border-stone-200 rounded-2xl px-3.5 py-2 shadow-xs flex items-center justify-between gap-2 shrink-0 print:hidden">
        <div className="flex items-center gap-2">
          {transmissionStatus === 'transmitting' ? (
            <span className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
              <Send className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>正傳輸標籤列印...</span>
            </span>
          ) : transmissionStatus === 'failed' ? (
            <span className="text-xs text-rose-700 font-bold">收據機沒有回應，請工作人員檢查電源與 USB</span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>「{displayMonster.name}」出紙完成</span>
            </span>
          )}
        </div>
      </div>

      {/* Printer Machine Enclosure Simulator in Compact Style */}
      <div className="bg-stone-100 border border-stone-300 rounded-2xl p-2.5 sm:p-3 shadow-md relative overflow-hidden shrink-0 print:bg-transparent print:border-0 print:shadow-none print:p-0 print:overflow-visible">
        {/* Printer Output Dispenser Slot */}
        <div className="w-full bg-stone-300 h-2 rounded-full border border-stone-400 mb-1.5 shadow-inner relative flex items-center justify-center print:hidden">
          <div className="w-2/3 h-0.5 bg-stone-400 rounded-full" />
        </div>

        {/* Physical Paper Ejection Simulation */}
        <div className="relative transition-all duration-700">
          {customLabelImage ? (
            /* User-uploaded pre-made Print Label Graphic (zero left/right white borders) */
            <div className="w-fit max-w-full mx-auto rounded-xl shadow-xl overflow-hidden animate-print-feed relative print:shadow-none print:rounded-none print:w-full print:m-0">
              <img
                src={customLabelImage}
                alt={`${displayMonster.name} 列印標籤`}
                className="block w-auto max-w-full h-auto max-h-[64vh] select-none pointer-events-none print:max-h-none print:w-full"
              />
            </div>
          ) : (
            <div className="bg-[#FCFCFA] text-stone-900 px-4 py-3 sm:px-5 sm:py-3.5 rounded-lg shadow-xl border border-stone-300 mx-auto max-w-sm animate-print-feed relative print:shadow-none print:border-0 print:max-w-none print:w-full">
              {/* Paper jagged receipt edge styling on top */}
              <div className="absolute -top-1.5 left-0 right-0 h-1.5 bg-[#FCFCFA] flex justify-between overflow-hidden print:hidden">
                {Array.from({ length: 22 }).map((_, i) => (
                  <div key={i} className="w-2.5 h-2.5 bg-stone-100 rotate-45 transform origin-bottom-left -mt-1" />
                ))}
              </div>

            {/* Receipt Header: Ticket Title + Date & Time */}
            <div className="text-center border-b border-dashed border-stone-300 pb-1.5 mb-1.5 space-y-0.5">
              <h2 className="font-serif-tc text-xs sm:text-sm font-black text-stone-900 tracking-wider">
                {customTexts['ticket-title'] || '茶靈絮語 · 展覽紀念茶籤'}
              </h2>
              {customTexts['ticket-subtitle'] && (
                <div className="text-[8px] font-mono text-stone-500 tracking-widest uppercase">
                  {customTexts['ticket-subtitle']}
                </div>
              )}
              <div className="text-[10px] sm:text-[11px] font-mono text-stone-600 tracking-wider">
                {currentTime} · NO. {ticketId}
              </div>
            </div>

            {/* Monster Spirit Image - Bound to Emotion Material Image Uploaded by User (Pure transparent cutout, no border) */}
            <div className="flex flex-col items-center justify-center py-1 border-b border-dashed border-stone-300 pb-1.5">
              <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center my-0.5">
                {monsterImage ? (
                  <img
                    src={monsterImage}
                    alt={displayMonster.name}
                    className="w-full h-full object-contain filter contrast-125 select-none pointer-events-none"
                  />
                ) : (
                  <TeaMonsterAvatar 
                    monster={displayMonster} 
                    size="receipt" 
                    animate={false} 
                  />
                )}
              </div>
              
              <h3 className="font-serif-tc text-base sm:text-lg font-black mt-1 text-stone-900 tracking-wider">
                {displayMonster.name}
              </h3>
            </div>

            {/* Tea & Sensory Record (NO ORIGIN per user request: "產地可以不用標上") */}
            <div className="py-1.5 border-b border-dashed border-stone-300 space-y-0.5 text-[10px] sm:text-[11px] font-serif-tc">
              <div className="flex justify-between items-center">
                <span className="text-stone-500 font-mono text-[9px] sm:text-[10px]">感應茶款：</span>
                <span className="font-bold text-stone-900">{tea.name} ({tea.category})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500 font-mono text-[9px] sm:text-[10px]">心境共鳴：</span>
                <span className="font-bold text-emerald-900 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  {emotion.label}（{emotion.subLabel}）
                </span>
              </div>
            </div>

            {/* Personality, Fortune & Lore message */}
            <div className="py-1.5 border-b border-dashed border-stone-300 space-y-1">
              <p className="text-[10px] font-serif-tc leading-snug text-stone-700 bg-stone-50 p-1.5 rounded border border-stone-200">
                <span className="font-bold text-stone-900 block mb-0.5 text-[9px]">個性特質：</span>
                {displayMonster.personality}
              </p>
              <p className="text-[10px] font-serif-tc leading-snug text-stone-800 bg-stone-50 p-1.5 rounded border border-stone-200">
                <span className="font-bold text-amber-900 block mb-0.5 text-[9px]">今日茶籤：</span>
                {displayMonster.teaFortune}
              </p>
              <p className="text-[9px] text-stone-600 font-serif-tc truncate">
                專屬能力：{displayMonster.specialSkill}
              </p>
            </div>

            {/* Receipt Footer - Clean Minimalist Ticket Tail (QR code removed per user request) */}
            <div className="pt-2 text-center">
              <div className="text-[9px] font-mono text-stone-400 tracking-wider uppercase">
                {customTexts['ticket-footer'] || 'TEA SPIRIT EXHIBITION · 祝茶安'}
              </div>
            </div>

            {/* Paper jagged receipt edge styling on bottom */}
            <div className="absolute -bottom-1.5 left-0 right-0 h-1.5 bg-[#FCFCFA] flex justify-between overflow-hidden print:hidden">
              {Array.from({ length: 22 }).map((_, i) => (
                <div key={i} className="w-2.5 h-2.5 bg-stone-100 rotate-45 transform origin-top-left mt-0.5" />
              ))}
            </div>
            </div>
          )}
        </div>
      </div>

      {/* Manual Actions Bottom Bar (Compact) */}
      <div className="flex items-center justify-center gap-2.5 shrink-0 pt-0.5 print:hidden">
        <button
          onClick={handleManualPrint}
          className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>手動補印票券</span>
        </button>

        <button
          onClick={onRestart}
          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>下一位遊客 ({countdown}s)</span>
        </button>
      </div>
    </div>
  );
};
