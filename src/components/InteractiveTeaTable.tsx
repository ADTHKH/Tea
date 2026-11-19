import React from 'react';
import { TEAS } from '../data/teaData';
import { TeaProduct } from '../types/tea';
import { sounds } from '../utils/audio';
import { Radio, Sparkles, CheckCircle2 } from './icons';

interface Props {
  currentTea: TeaProduct;
  onSelectTea: (tea: TeaProduct) => void;
  onBackToScan?: () => void;
  disabled?: boolean;
  hasScanned?: boolean;
  customImages?: Record<string, string>;
  customTexts?: Record<string, string>;
}

export const InteractiveTeaTable: React.FC<Props> = ({ 
  currentTea, 
  onSelectTea, 
  onBackToScan,
  disabled,
  hasScanned = true,
  customImages = {},
  customTexts = {}
}) => {
  const step1Desc = customTexts['step1_desc'] || '將茶葉感應卡或茶杯放置於 NFC 感應區，感應即切換茶品';

  return (
    <div className="bg-white/95 border border-stone-200/90 rounded-2xl p-2.5 sm:p-3.5 shadow-xs backdrop-blur-md transition-all shrink-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 mb-2 border-b border-stone-100 pb-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          <span className="text-[11px] tracking-wider uppercase text-emerald-800 font-bold font-mono flex items-center gap-1">
            <Radio className="w-3 h-3 text-emerald-600" />
            NFC 讀卡感應茶席
          </span>
          <span className="text-stone-300 text-xs hidden sm:inline">|</span>
          <span className="text-stone-600 text-[11px]">
            {hasScanned ? (
              <>
                已感應茶款：
                <span className="font-serif-tc font-bold text-emerald-950 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mr-1.5">
                  {currentTea.name}
                </span>
                <span className="font-mono text-stone-500 text-[10px]">
                  (晶片碼: {currentTea.nfcChipUid || currentTea.sensorRfId})
                </span>
              </>
            ) : (
              <span className="text-amber-700 font-medium animate-pulse">
                請將茶杯放置於 NFC 讀卡機感應，或點選下方茶品
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onBackToScan && (
            <button
              onClick={onBackToScan}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 shadow-2xs hover:scale-102"
              title="回到 NFC 感應待機介面更換茶品"
            >
              <Radio className="w-3 h-3 text-emerald-600" />
              <span>更換茶品 (NFC感應待機)</span>
            </button>
          )}
          <div className="text-[11px] text-stone-500 font-normal truncate hidden md:inline">
            {step1Desc}
          </div>
        </div>
      </div>

      {/* Tea Cup Carousel / Grid in White Theme */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {TEAS.map((tea) => {
          const isSelected = hasScanned && tea.id === currentTea.id;
          const customTeaImg = customImages[`tea-${tea.id}`];
          const chipCode = tea.nfcChipUid || tea.sensorRfId;

          return (
            <button
              key={tea.id}
              disabled={disabled}
              onClick={() => {
                sounds.playCupPlace();
                onSelectTea(tea);
              }}
              className={`group relative text-left p-2 rounded-xl border transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-50/90 border-emerald-600 shadow-xs ring-2 ring-emerald-500/20 translate-y-[-1px]'
                  : 'bg-white border-stone-200 hover:border-emerald-300 hover:bg-stone-50 shadow-2xs'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {/* Ceramic Tea Cup Icon / Custom Photo Visual */}
              <div className="flex items-center justify-between mb-1.5">
                {customTeaImg ? (
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-emerald-300 shadow-2xs bg-white flex items-center justify-center">
                    <img src={customTeaImg} alt={tea.name} className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center border shadow-2xs transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: tea.soupColorHex + '18',
                      borderColor: tea.soupColorHex
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full shadow-inner"
                      style={{ backgroundColor: tea.soupColorHex }}
                    />
                  </div>
                )}
                
                <span className="text-[9px] font-mono font-semibold text-stone-400 group-hover:text-emerald-700">
                  {chipCode}
                </span>
              </div>

              <div className={`font-serif-tc text-xs font-bold tracking-tight truncate transition-colors ${
                isSelected ? 'text-emerald-950 font-black' : 'text-stone-800'
              }`}>
                {tea.name}
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5 truncate">
                {tea.category} · {tea.altitude.split(' ')[0]}
              </div>

              {isSelected && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-600 rounded-full ring-2 ring-white shadow-xs flex items-center justify-center">
                  <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
