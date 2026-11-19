import React, { useState, useEffect, useRef } from 'react';
import { TeaProduct } from '../types/tea';
import { Compass, Droplets, Flame, Sparkles, Check } from 'lucide-react';

interface Props {
  tea: TeaProduct;
  onComplete: () => void;
  onBackToSelect?: () => void;
  isBackgroundFaded?: boolean;
  isFadingOut?: boolean;
  totalDurationSeconds?: number;
  customImages?: Record<string, string>;
  onUpdateCustomImage?: (key: string, url: string) => void;
}

export const TeaProcessView: React.FC<Props> = ({ 
  tea, 
  onComplete, 
  isBackgroundFaded = false, 
  isFadingOut = false,
  totalDurationSeconds = 30, // 預設30秒
  customImages = {}
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(totalDurationSeconds);
  const timerRef = useRef<number | null>(null);

  const defaultTeaChart =
    tea.id === 'muzha-tieguanyin' ? '/images/01木柵鐵觀音.jpg' :
    tea.id === 'wenshan-baozhong' ? '/images/02文山包種茶.jpg' :
    tea.id === 'tieguanyin-black' ? '/images/03鐵觀音紅茶.jpg' :
    tea.id === 'taiwan-sijichun' ? '/images/04台灣四季春.jpg' :
    tea.id === 'taiwan-gaoshan-oolong' ? '/images/05台灣高山烏龍茶.jpg' :
    tea.id === 'jinxuan-oolong' ? '/images/06金萱烏龍茶.jpg' : null;

  // Check if a custom GIF or infographic has been uploaded for this specific tea or globally
  const customTeaChart = 
    customImages[`process-gif-${tea.id}`] ||
    customImages[`process-chart-${tea.id}`] || 
    customImages['process-gif-default'] ||
    customImages['process-chart-default'] || 
    defaultTeaChart;

  // Reset countdown whenever tea or duration changes
  useEffect(() => {
    setSecondsRemaining(totalDurationSeconds);
  }, [tea.id, totalDurationSeconds]);

  // Automatic countdown timer
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 0.2) {
          if (timerRef.current) clearInterval(timerRef.current);
          onComplete();
          return 0;
        }
        return Math.max(0, prev - 0.2);
      });
    }, 200);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [tea.id, onComplete, totalDurationSeconds]);

  const progressPercent = Math.min(
    100,
    ((totalDurationSeconds - secondsRemaining) / totalDurationSeconds) * 100
  );

  return (
    <div
      className={`transition-all duration-700 ease-in-out fixed inset-0 z-20 w-screen h-screen flex flex-col overflow-hidden bg-[#F9FAF9] ${
        isFadingOut
          ? 'opacity-0 scale-98 filter blur-md pointer-events-none'
          : isBackgroundFaded
          ? 'scale-95 opacity-20 filter blur-[2px] pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
    >
      {/* 
        Top Countdown Seconds Progress Bar:
        - Positioned cleanly above the poster image so it does not overlap/press down onto the image
        - Progress bar fill color automatically set to tea's soup color (tea.soupColorHex)
      */}
      <div className="w-full shrink-0 h-1.5 sm:h-2 bg-stone-200/50 overflow-hidden relative z-30">
        <div
          className="h-full transition-all duration-200 ease-linear shadow-xs"
          style={{
            width: `${progressPercent}%`,
            backgroundColor: tea.soupColorHex
          }}
        />
      </div>

      {/* 
        MAIN VIEWPORT: Borderless Full-Bleed Display ("滿版全螢幕模式，不要有黑邊")
      */}
      {customTeaChart ? (
        <div className="flex-1 w-full min-h-0 flex items-center justify-center overflow-hidden p-0 m-0">
          <img
            key={`${tea.id}-${customTeaChart}`}
            src={customTeaChart}
            alt={`${tea.name} 認識茶介紹圖`}
            className="w-full h-full object-cover select-none pointer-events-none"
          />
        </div>
      ) : (
          /* ========================================================================= */
          /* CASE 2: DEFAULT EXHIBITION POSTER INFOGRAPHIC - BORDERLESS FULL PRESENTATION*/
          /* ========================================================================= */
          <div className="relative w-full flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-between overflow-hidden min-h-[480px] sm:min-h-[540px]">
            {/* Background Ambient Glow */}
            <div
              className="absolute -right-24 -top-24 w-96 h-96 rounded-full opacity-25 pointer-events-none blur-3xl"
              style={{ backgroundColor: tea.soupColorHex }}
            />
            <div
              className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full opacity-20 pointer-events-none blur-3xl"
              style={{ backgroundColor: '#2E5A44' }}
            />

            {/* 1. Header Tea Identity Banner */}
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold tracking-wider font-mono shadow-2xs"
                    style={{
                      backgroundColor: tea.soupColorHex + '22',
                      color: '#243E2C'
                    }}
                  >
                    {tea.category}
                  </span>
                  <span className="text-stone-300 text-xs">·</span>
                  <span className="text-xs text-stone-600 font-mono flex items-center gap-1 bg-stone-100/80 px-2.5 py-0.5 rounded-full">
                    <Compass className="w-3.5 h-3.5 text-stone-500" />
                    {tea.origin}
                  </span>
                  <span className="text-stone-300 text-xs">·</span>
                  <span className="text-xs text-stone-600 font-mono bg-stone-100/80 px-2.5 py-0.5 rounded-full">
                    海拔 {tea.altitude}
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <h1 className="font-serif-tc text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-wide">
                    {tea.name}
                  </h1>
                  <span className="text-xs font-mono text-stone-400">
                    NFC UID: {tea.nfcChipUid || tea.sensorRfId}
                  </span>
                </div>
                <p className="font-serif-tc text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
                  {tea.description}
                </p>
              </div>

              {/* Soup Color Specimen Badge */}
              <div className="flex items-center gap-3 bg-stone-50/90 px-4 py-2 rounded-2xl shadow-xs">
                <div
                  className="w-7 h-7 rounded-full shadow-sm"
                  style={{ backgroundColor: tea.soupColorHex }}
                />
                <div className="text-left font-mono text-xs">
                  <div className="text-stone-400 text-[10px]">SOUP COLOR</div>
                  <div className="font-bold text-stone-800">{tea.soupColor}</div>
                </div>
              </div>
            </div>

            {/* 2. Craft Step Sequence Poster Grid */}
            <div className="relative z-10 py-4 sm:py-6">
              <div className="text-xs font-serif-tc text-stone-500 uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>核心製茶工藝淬鍊序列</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {tea.processSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 sm:p-4 rounded-2xl bg-stone-50/80 hover:bg-stone-50 transition-all shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                          STEP 0{idx + 1}
                        </span>
                        {idx === 0 && <Droplets className="w-3.5 h-3.5 text-teal-600" />}
                        {idx === 1 && <Flame className="w-3.5 h-3.5 text-amber-600" />}
                        {idx >= 2 && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <h4 className="font-serif-tc text-sm sm:text-base font-bold text-stone-900 mb-1">
                        {step.title}
                      </h4>
                      <p className="font-serif-tc text-xs text-stone-600 leading-relaxed line-clamp-3">
                        {step.description}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-stone-200/40 text-[10px] font-mono text-stone-400 flex justify-between">
                      <span>淬鍊時長</span>
                      <span className="font-bold text-stone-700">{step.durationSec}s</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Bottom Sensory Aroma Bar */}
            <div className="relative z-10 pt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-stone-500 font-mono">香氣風貌：</span>
              {tea.aromaNotes.map((note, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-serif-tc bg-emerald-50 text-emerald-800 shadow-2xs font-medium"
                >
                  #{note}
                </span>
              ))}
              <span className="text-stone-300 text-xs hidden sm:inline">|</span>
              <span className="text-xs text-stone-700 font-serif-tc font-medium">
                {tea.flavorProfile}
              </span>
            </div>
          </div>
        )}
    </div>
  );
};
