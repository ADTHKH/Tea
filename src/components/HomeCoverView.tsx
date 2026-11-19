import React, { useEffect, useRef } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { sounds } from '../utils/audio';

interface Props {
  onStart: () => void;
  customCoverImage?: string;
  customTexts?: Record<string, string>;
  isBlocked?: boolean;
}

export const HomeCoverView: React.FC<Props> = ({ 
  onStart, 
  customCoverImage,
  customTexts = {},
  isBlocked = false
}) => {
  const lastAlnumAtRef = useRef<number>(0);

  // Listen for Spacebar / manual Enter press to enter the tea selection stage
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isBlocked) return;
      if (e.key.length === 1 && e.key !== ' ' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        lastAlnumAtRef.current = Date.now();
        return;
      }
      if (e.code === 'Space' || e.key === ' ' || e.key === 'Enter') {
        // Ignore Enter that immediately follows NFC scanner keystrokes
        if (e.key === 'Enter' && Date.now() - lastAlnumAtRef.current < 600) {
          return;
        }
        e.preventDefault();
        sounds.playConfirmChime();
        onStart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart, isBlocked]);

  const handleStart = () => {
    if (isBlocked) return;
    sounds.playConfirmChime();
    onStart();
  };

  return (
    <div 
      onClick={handleStart}
      className="fixed inset-0 w-full h-full flex flex-col items-center justify-center cursor-pointer select-none bg-[#F9FAF9] overflow-hidden z-20 animate-fade-in"
    >
      {/* User's custom homepage screen image: Completely borderless, no frame, full bleed */}
      {customCoverImage ? (
        <div className="relative w-full h-full flex items-center justify-center p-0 m-0">
          <img 
            src={customCoverImage} 
            alt="展覽首頁封面" 
            className="w-full h-full object-contain select-none pointer-events-none"
          />
        </div>
      ) : (
        /* Fallback Default Exhibition Title Screen before user uploads their custom cover */
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto">
          {/* Subtle tea aroma background aura */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none animate-float-mist" />

          {/* Steam aura */}
          <div className="flex gap-2 h-10 items-end justify-center pointer-events-none mb-3">
            <span className="w-2 h-7 bg-gradient-to-t from-emerald-500/60 to-transparent rounded-full animate-steam-1" />
            <span className="w-2.5 h-10 bg-gradient-to-t from-amber-400/70 to-transparent rounded-full animate-steam-2" />
            <span className="w-2 h-8 bg-gradient-to-t from-teal-500/60 to-transparent rounded-full animate-steam-3" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono tracking-widest uppercase mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{customTexts['home-badge'] || '茶靈絮語 · 感官互動展覽'}</span>
          </div>

          <h1 className="font-serif-tc text-4xl sm:text-6xl font-black text-stone-900 tracking-wider mb-4 leading-tight">
            {customTexts['home-title'] || '茶靈絮語'}
          </h1>
          
          <p className="font-serif-tc text-stone-600 text-base sm:text-xl max-w-xl leading-relaxed mb-8">
            {customTexts['home-subtitle'] || '從一片茶葉的淬鍊旅程，到一杯茶湯的心境共鳴。在此喚醒守護您的專屬茶靈。'}
          </p>

          {/* Interactive Start Button */}
          <button
            onClick={handleStart}
            className="group px-8 py-3.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm sm:text-base flex items-center gap-3 shadow-lg shadow-emerald-700/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>開始體驗選茶</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      )}
    </div>
  );
};
