import React, { useEffect, useState } from 'react';
import { TeaMonster, TeaProduct, EmotionOption } from '../types/tea';
import { TeaMonsterAvatar } from './TeaMonsterAvatar';
import { Printer, Sparkles, Send, CheckCircle2, Image as ImageIcon } from './icons';
import { sounds } from '../utils/audio';
import { DEFAULT_EMOTION_IMAGES, DEFAULT_TEXTS } from '../utils/mediaStorage';

interface Props {
  tea: TeaProduct;
  emotion: EmotionOption;
  monster: TeaMonster;
  onProceedToPrint: () => void;
  customImages?: Record<string, string>;
  customTexts?: Record<string, string>;
}

export const MonsterReveal: React.FC<Props> = ({ 
  tea, 
  emotion, 
  monster, 
  onProceedToPrint,
  customImages = {},
  customTexts = {}
}) => {
  const [transmissionProgress, setTransmissionProgress] = useState<number>(0);
  const [transmissionStatus, setTransmissionStatus] = useState<'transmitting' | 'ready'>('transmitting');

  const monsterImage = customImages[`emotion-${emotion.id}`] || DEFAULT_EMOTION_IMAGES[`emotion-${emotion.id}`];

  // Custom text overrides for monster attributes based on emotion (name is locked)
  const monsterName = DEFAULT_TEXTS[`monster-${emotion.id}-name`] || monster.name;
  const monsterTitle = customTexts[`monster-${emotion.id}-title`] || monster.title;
  const monsterPersonality = customTexts[`monster-${emotion.id}-personality`] || monster.personality;
  const monsterStory = customTexts[`monster-${emotion.id}-story`] || monster.story;
  const monsterSkill = customTexts[`monster-${emotion.id}-skill`] || monster.specialSkill;
  const monsterFortune = customTexts[`monster-${emotion.id}-fortune`] || monster.teaFortune;

  const revealTitle = customTexts['reveal-title'] || customTexts['reveal_title'] || '感官共鳴凝華 · 獲得專屬茶靈小怪獸';
  const revealCongrats = (customTexts['reveal-congrats'] || customTexts['reveal_congrats'] || '恭喜喚醒「{monsterName}」！').replace('{monsterName}', monsterName);

  const displayMonster = {
    ...monster,
    name: monsterName,
    title: monsterTitle,
    personality: monsterPersonality,
    story: monsterStory,
    specialSkill: monsterSkill,
    teaFortune: monsterFortune
  };

  useEffect(() => {
    sounds.playSteamAwaken();
    
    const interval = setInterval(() => {
      setTransmissionProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTransmissionStatus('ready');
          sounds.playPrinterFeed();
          setTimeout(() => {
            onProceedToPrint();
          }, 1200);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onProceedToPrint]);

  return (
    <div className="relative max-w-4xl mx-auto space-y-3 sm:space-y-4 animate-fade-in w-full max-h-[85vh] flex flex-col justify-center overflow-hidden my-auto">
      {/* Top Banner: Success Revelation */}
      <div className="text-center space-y-1 shrink-0">
        <h2 className="font-serif-tc text-2xl sm:text-4xl font-black text-stone-900 tracking-wide">
          {revealCongrats}
        </h2>
      </div>

      {/* Main Monster Showcase Card in White Theme */}
      <div className="bg-white border border-stone-200 rounded-3xl p-4 sm:p-6 backdrop-blur-xl shadow-xl relative overflow-hidden text-stone-800">
        {/* Subtle Ambient Radial Wash */}
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-20 pointer-events-none blur-3xl"
          style={{ backgroundColor: monster.primaryColor }}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center">
          {/* Left: Monster Avatar (Clean transparent cutout, no border per user request) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-2">
            <div className="relative mb-1">
              <TeaMonsterAvatar monster={displayMonster} size="md" animate={true} customImageUrl={monsterImage} />
            </div>
          </div>

          {/* Right: Character Stats & Automated Dispatch */}
          <div className="md:col-span-7 space-y-4">
            <div className="space-y-1.5">
              <div className="text-xs font-mono text-emerald-800 font-semibold flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-100/70 border border-emerald-300">
                  茶湯感應：{tea.name}
                </span>
                <span className="text-stone-400">×</span>
                <span className="px-2.5 py-0.5 rounded-md bg-amber-100/70 border border-amber-300 text-amber-900">
                  心境：{emotion.label}
                </span>
              </div>
              <h3 className="font-serif-tc text-3xl sm:text-4xl font-black text-stone-900 tracking-wide">
                {displayMonster.name}
              </h3>
            </div>

            {/* Transmission to Printer Machine */}
            <div className="pt-1">
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-2.5 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-stone-700 font-medium flex items-center gap-1.5 text-[11px]">
                    {transmissionStatus === 'transmitting' ? (
                      <>
                        <Send className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                        自動傳送小怪獸至實體列印機中...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        傳送完成！列印機出紙中...
                      </>
                    )}
                  </span>
                  <span className="font-mono text-emerald-700 font-bold text-xs">
                    {transmissionProgress}%
                  </span>
                </div>

                <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-150"
                    style={{ width: `${transmissionProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex justify-end">
          <button
            onClick={onProceedToPrint}
            className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            查看實體列印小卡
          </button>
        </div>
      </div>
    </div>
  );
};
