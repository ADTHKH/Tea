import React, { useEffect, useState, useCallback, useRef } from 'react';
import { EMOTIONS } from '../data/teaData';
import { EmotionOption, TeaProduct } from '../types/tea';
import { CheckCircle2 } from './icons';
import { sounds } from '../utils/audio';

interface Props {
  tea: TeaProduct;
  onSelectEmotion: (emotion: EmotionOption) => void;
  customImages?: Record<string, string>;
  customTexts?: Record<string, string>;
  buttonSize?: number;
  buttonSizes?: Record<string, number>;
  nfcTriggeredEmotionId?: string | null;
  onOpenGallery?: () => void;
  isBlocked?: boolean;
}

export const EmotionSelector: React.FC<Props> = ({ 
  tea, 
  onSelectEmotion,
  customImages = {},
  customTexts = {},
  buttonSize = 150,
  buttonSizes = {},
  nfcTriggeredEmotionId = null,
  isBlocked = false,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [nfcTriggeredIdx, setNfcTriggeredIdx] = useState<number | null>(null);
  const confirmTimeoutRef = useRef<number | null>(null);

  const handleConfirm = useCallback((index: number) => {
    sounds.playConfirmChime();
    setNfcTriggeredIdx(index);
    setSelectedIndex(index);

    if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current);

    confirmTimeoutRef.current = window.setTimeout(() => {
      const emotion = EMOTIONS[index];
      if (emotion) {
        onSelectEmotion(emotion);
      }
    }, 700);
  }, [onSelectEmotion]);

  // Reflect central NFC scan trigger visually
  useEffect(() => {
    if (nfcTriggeredEmotionId) {
      const idx = EMOTIONS.findIndex((e) => e.id === nfcTriggeredEmotionId);
      if (idx !== -1) {
        setNfcTriggeredIdx(idx);
        setSelectedIndex(idx);
      }
    }
  }, [nfcTriggeredEmotionId]);

  useEffect(() => {
    return () => {
      if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current);
    };
  }, []);

  // Keyboard accessibility: 1-6 keys for 6 emotions, space or enter to select
  // Safeguarded against rapid bursts from USB NFC readers scanning 10-digit chip UIDs
  useEffect(() => {
    let lastKeyTime = 0;
    let lastAlnumAt = 0;
    let pendingDigitTimer: number | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isBlocked) return;
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      const now = performance.now();
      const isScannerSpeed = now - lastKeyTime < 120;
      lastKeyTime = now;

      if (pendingDigitTimer) {
        clearTimeout(pendingDigitTimer);
        pendingDigitTimer = null;
      }

      if (e.key.length === 1 && e.key !== ' ' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        lastAlnumAt = Date.now();
      }

      if (isScannerSpeed) {
        return;
      }

      if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        // Wait 180ms to confirm it's a single human key press and not part of an NFC UID
        pendingDigitTimer = window.setTimeout(() => {
          handleConfirm(idx);
        }, 180);
      } else if (e.key === ' ' || e.key === 'Enter') {
        if (e.key === 'Enter' && Date.now() - lastAlnumAt < 600) {
          return;
        }
        if (selectedIndex !== null) {
          handleConfirm(selectedIndex);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (pendingDigitTimer) clearTimeout(pendingDigitTimer);
    };
  }, [selectedIndex, handleConfirm, isBlocked]);

  // Bubble animation classes to stagger floating gently
  const bubbleAnimateClasses = [
    'animate-bubble-1',
    'animate-bubble-2',
    'animate-bubble-3',
    'animate-bubble-4',
    'animate-bubble-5',
    'animate-bubble-6'
  ];

  // Artistic organic scatter layout offsets: creates an exhibition art constellation
  const SCATTER_LAYOUT = [
    { offsetClass: 'sm:-translate-y-8 sm:-translate-x-4 rotate-[-2deg]', zIndex: 12 },
    { offsetClass: 'sm:translate-y-12 sm:translate-x-2 rotate-[2.5deg]', zIndex: 10 },
    { offsetClass: 'sm:-translate-y-16 sm:-translate-x-1 rotate-[-1.5deg]', zIndex: 14 },
    { offsetClass: 'sm:translate-y-14 sm:-translate-x-3 rotate-[2deg]', zIndex: 11 },
    { offsetClass: 'sm:-translate-y-10 sm:translate-x-5 rotate-[-3deg]', zIndex: 13 },
    { offsetClass: 'sm:translate-y-8 sm:translate-x-2 rotate-[1deg]', zIndex: 10 },
  ];

  return (
    <div className="relative z-20 space-y-4 sm:space-y-6 max-w-6xl mx-auto flex flex-col justify-center my-auto px-2">
      {/* Title Header */}
      <div className="relative flex flex-col items-center text-center">
        {/* Main Prompt Title */}
        <h2 className="font-serif-tc text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-wide text-stone-900 max-w-5xl leading-snug md:whitespace-nowrap">
          {customTexts['prompt-title'] ? (
            customTexts['prompt-title'].replace('{tea}', tea.name)
          ) : (
            <>感受這杯 <span className="underline decoration-emerald-500/40 underline-offset-4">{tea.name}</span> 的香氣，現在的它帶給你什麼感覺？</>
          )}
        </h2>
      </div>

      {/* 6 Emotion Floating Buttons: Pure Designed Button Graphic, Clickable without Drag */}
      <div className="relative w-full py-6 sm:py-14 flex flex-wrap items-center justify-center gap-6 sm:gap-10 lg:gap-14 min-h-[380px]">
        {EMOTIONS.map((emotion, idx) => {
          // Priority 1: User uploaded custom emotion button image (emotion-btn-{id})
          // Priority 2: Fallback to monster illustration only if user hasn't uploaded button
          const customBtn = customImages[`emotion-btn-${emotion.id}`];
          const displayBtnImg = customBtn || customImages[`emotion-${emotion.id}`] || `/images/小怪獸${idx + 1}.jpg`;

          // Individual size per button (defaults to global buttonSize or 150px)
          const thisSize = Math.max(70, Math.min(280, buttonSizes[emotion.id] || buttonSizes[`emotion-${emotion.id}`] || buttonSize || 150));

          const isTriggered = nfcTriggeredIdx === idx;
          const isHovered = selectedIndex === idx;
          const bubbleAnim = bubbleAnimateClasses[idx % bubbleAnimateClasses.length];
          const scatter = SCATTER_LAYOUT[idx % SCATTER_LAYOUT.length];

          const emotionLabel = customTexts[`emotion-${emotion.id}-label`] || emotion.label;

          return (
            <div 
              key={emotion.id}
              className={`flex flex-col items-center justify-center ${bubbleAnim} ${scatter.offsetClass} transition-all duration-500 hover:z-30`}
              style={{
                zIndex: isTriggered ? 40 : scatter.zIndex,
                animationPlayState: isTriggered ? 'paused' : 'running'
              }}
            >
              {/* Floating Emotion Button: Pure Designed Button Graphic without outer frame */}
              <button
                type="button"
                onClick={() => {
                  if (isBlocked) return;
                  sounds.playKeyTick();
                  handleConfirm(idx);
                }}
                onMouseEnter={() => {
                  setSelectedIndex(idx);
                  sounds.playKeyTick();
                }}
                className={`group relative transition-all duration-300 flex items-center justify-center select-none bg-transparent border-0 outline-none p-0 cursor-pointer ${
                  isTriggered 
                    ? 'scale-115 filter drop-shadow-[0_12px_24px_rgba(16,185,129,0.5)]' 
                    : isHovered 
                    ? 'scale-110 filter drop-shadow-[0_8px_18px_rgba(0,0,0,0.18)]' 
                    : 'hover:scale-105 filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.1)]'
                }`}
                style={{
                  width: `${thisSize}px`,
                  height: `${thisSize}px`
                }}
                title={`點選 / NFC 感應：${emotionLabel}`}
              >
                {/* Free-floating emotion button graphic (No circular bubble frame and NO text blocks per user request) */}
                <img 
                  src={displayBtnImg} 
                  alt={emotionLabel} 
                  draggable={false}
                  className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-300" 
                />

                {/* Active / Triggered NFC Checkmark badge */}
                {isTriggered && (
                  <div className="absolute top-0 right-0 bg-emerald-600 text-white p-1 rounded-full shadow-lg ring-2 ring-white animate-bounce pointer-events-none">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
