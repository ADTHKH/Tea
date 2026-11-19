import React, { useState } from 'react';
import { TeaMonster } from '../types/tea';

interface Props {
  monster: TeaMonster;
  size?: 'sm' | 'md' | 'lg' | 'receipt';
  animate?: boolean;
  customImageUrl?: string;
}

export const TeaMonsterAvatar: React.FC<Props> = ({ 
  monster, 
  size = 'md', 
  animate = true,
  customImageUrl
}) => {
  const [imgLoadError, setImgLoadError] = useState<boolean>(false);
  const pixelSize = size === 'sm' ? 120 : size === 'md' ? 220 : size === 'lg' ? 320 : 160;
  const isMonoReceipt = size === 'receipt';

  // If a custom image exists and didn't error, render the uploaded monster spirit image without borders
  if (customImageUrl && !imgLoadError) {
    if (isMonoReceipt) {
      return (
        <div 
          className="relative flex items-center justify-center select-none"
          style={{ width: pixelSize, height: pixelSize }}
        >
          <img
            src={customImageUrl}
            alt={monster.name}
            onError={() => setImgLoadError(true)}
            className="w-full h-full object-contain filter contrast-125 select-none pointer-events-none"
          />
        </div>
      );
    }

    return (
      <div 
        className="relative flex items-center justify-center group select-none"
        style={{ width: pixelSize, height: pixelSize }}
      >
        {/* Soft Ambient Glow behind transparent cutout monster */}
        <div 
          className="absolute inset-4 rounded-full blur-3xl opacity-45 transition-opacity group-hover:opacity-75 pointer-events-none"
          style={{ backgroundColor: monster.secondaryColor }}
        />

        {/* Pure Transparent Monster Graphic without card or border */}
        <img
          src={customImageUrl}
          alt={monster.name}
          onError={() => setImgLoadError(true)}
          className={`w-full h-full object-contain filter drop-shadow-[0_16px_28px_rgba(0,0,0,0.18)] transition-transform duration-500 select-none ${
            animate ? 'hover:scale-108 animate-bubble-1' : ''
          }`}
        />
      </div>
    );
  }

  // Extract visual cues
  const { element, creatureType, teaId } = monster;
  const primaryColor = isMonoReceipt ? '#1c1917' : monster.primaryColor;
  const accentColor = isMonoReceipt ? '#44403c' : monster.secondaryColor;
  const bodyFill = isMonoReceipt ? '#ffffff' : '#232921';
  const strokeColor = isMonoReceipt ? '#1c1917' : '#EAE6DF';

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: pixelSize, height: pixelSize }}>
      <svg
        viewBox="0 0 200 200"
        width={pixelSize}
        height={pixelSize}
        className={`${animate ? 'transition-transform duration-700 ease-out hover:scale-105' : ''}`}
      >
        <defs>
          <radialGradient id={`glow-${monster.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accentColor} stopOpacity={isMonoReceipt ? '0' : '0.4'} />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
          </radialGradient>
          
          <linearGradient id={`bodyGrad-${monster.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isMonoReceipt ? '#fafaf9' : '#334139'} />
            <stop offset="100%" stopColor={isMonoReceipt ? '#e7e5e4' : '#1C2720'} />
          </linearGradient>

          <filter id={`softShadow-${monster.id}`} x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity={isMonoReceipt ? '0.1' : '0.2'} />
          </filter>
        </defs>

        {/* Ambient Steam Aura */}
        {!isMonoReceipt && (
          <circle
            cx="100"
            cy="100"
            r="88"
            fill={`url(#glow-${monster.id})`}
            className={animate ? 'animate-pulse duration-1000' : ''}
          />
        )}

        {/* Shadow base on ground */}
        <ellipse cx="100" cy="172" rx="55" ry="12" fill={isMonoReceipt ? '#d6d3d1' : 'rgba(0,0,0,0.12)'} />

        {/* Dynamic features based on Creature Type */}
        {creatureType.includes('鹿') && (
          <g stroke={accentColor} strokeWidth="4" strokeLinecap="round" fill="none">
            <path d="M70 60 Q 55 30 45 35 M58 45 Q 40 40 42 50" />
            <path d="M130 60 Q 145 30 155 35 M142 45 Q 160 40 158 50" />
          </g>
        )}

        {creatureType.includes('兔') && (
          <g fill={bodyFill} stroke={strokeColor} strokeWidth="3">
            <ellipse cx="75" cy="50" rx="14" ry="38" transform="rotate(-15 75 50)" />
            <ellipse cx="125" cy="50" rx="14" ry="38" transform="rotate(15 125 50)" />
            <ellipse cx="75" cy="52" rx="6" ry="24" fill={accentColor} opacity="0.8" transform="rotate(-15 75 52)" />
            <ellipse cx="125" cy="52" rx="6" ry="24" fill={accentColor} opacity="0.8" transform="rotate(15 125 52)" />
          </g>
        )}

        {creatureType.includes('鳥') || creatureType.includes('雀') || creatureType.includes('鶴') ? (
          <g fill={accentColor} stroke={strokeColor} strokeWidth="2.5">
            {/* Crown feathers */}
            <path d="M100 60 Q 95 30 90 36 Q 100 48 100 60" />
            <path d="M100 60 Q 100 24 105 28 Q 102 46 100 60" />
            <path d="M100 60 Q 108 32 114 38 Q 104 50 100 60" />
          </g>
        ) : null}

        {creatureType.includes('狐') || creatureType.includes('貓') || creatureType.includes('狸') ? (
          <g fill={bodyFill} stroke={strokeColor} strokeWidth="3">
            <polygon points="60,75 50,40 85,62" />
            <polygon points="140,75 150,40 115,62" />
            <polygon points="63,70 56,48 80,63" fill={accentColor} />
            <polygon points="137,70 144,48 120,63" fill={accentColor} />
          </g>
        ) : null}

        {creatureType.includes('獅') && (
          <g fill={primaryColor} opacity="0.85">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => (
              <circle
                key={i}
                cx={100 + Math.cos((ang * Math.PI) / 180) * 58}
                cy={110 + Math.sin((ang * Math.PI) / 180) * 52}
                r="18"
              />
            ))}
          </g>
        )}

        {/* Main Body (plump spirit body) */}
        <path
          d="M 55 115 C 50 78, 150 78, 145 115 C 148 152, 130 168, 100 168 C 70 168, 52 152, 55 115 Z"
          fill={`url(#bodyGrad-${monster.id})`}
          stroke={strokeColor}
          strokeWidth="3.5"
          filter={`url(#softShadow-${monster.id})`}
        />

        {/* Belly plate / Tea bowl emblem */}
        <path
          d="M 72 120 C 72 105, 128 105, 128 120 C 128 145, 72 145, 72 120 Z"
          fill={isMonoReceipt ? '#f5f5f4' : '#1b2219'}
          stroke={accentColor}
          strokeWidth="2"
          strokeDasharray={element === '清露' ? '4 2' : 'none'}
        />

        {/* Element Crest on Belly */}
        <g transform="translate(90, 116) scale(0.6)">
          {element === '清露' && (
            <path d="M16 2 C 16 2, 2 20, 2 28 A 14 14 0 0 0 30 28 C 30 20, 16 2, 16 2 Z" fill={accentColor} />
          )}
          {element === '靈火' && (
            <path d="M16 0 C 22 10, 28 16, 26 26 C 24 32, 18 34, 16 34 C 14 34, 8 32, 6 26 C 4 16, 12 12, 14 8 C 15 5, 16 0, 16 0 Z" fill={accentColor} />
          )}
          {element === '春泉' && (
            <path d="M4 18 Q 16 8 28 18 M4 26 Q 16 16 28 26" stroke={accentColor} strokeWidth="4" fill="none" strokeLinecap="round" />
          )}
          {element === '嵐霧' && (
            <path d="M4 14 Q 10 10 16 14 T 28 14 M6 22 Q 12 18 18 22 T 26 22" stroke={accentColor} strokeWidth="3" fill="none" strokeLinecap="round" />
          )}
          {element === '熾木' && (
            <path d="M16 4 L 16 32 M16 14 L 8 8 M16 20 L 24 14" stroke={accentColor} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          )}
          {element === '沉香' && (
            <circle cx="16" cy="18" r="10" stroke={accentColor} strokeWidth="3" fill="none" />
          )}
        </g>

        {/* Tea Leaves on Head / Ears */}
        <g fill={accentColor} stroke={strokeColor} strokeWidth="1.5">
          <path d="M100 75 C 90 60, 95 48, 100 45 C 105 48, 110 60, 100 75 Z" />
          <path d="M100 45 L 100 75" stroke={strokeColor} strokeWidth="1" />
          {/* Side leaf */}
          <path d="M102 58 C 114 52, 120 56, 122 62 C 114 66, 106 63, 102 58 Z" />
        </g>

        {/* Cute Big Eyes */}
        <g>
          {/* Left eye */}
          <ellipse cx="80" cy="100" rx="8" ry="10" fill={strokeColor} />
          <circle cx="82" cy="98" r="3.5" fill="#ffffff" />
          <circle cx="78" cy="103" r="1.5" fill="#ffffff" />

          {/* Right eye */}
          <ellipse cx="120" cy="100" rx="8" ry="10" fill={strokeColor} />
          <circle cx="122" cy="98" r="3.5" fill="#ffffff" />
          <circle cx="118" cy="103" r="1.5" fill="#ffffff" />

          {/* Cheeks */}
          <ellipse cx="68" cy="108" rx="7" ry="4" fill={accentColor} opacity={isMonoReceipt ? '0.2' : '0.6'} />
          <ellipse cx="132" cy="108" rx="7" ry="4" fill={accentColor} opacity={isMonoReceipt ? '0.2' : '0.6'} />

          {/* Mouth */}
          <path
            d="M 94 107 Q 100 113 106 107"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* Cute Hands / Paws */}
        <g fill={bodyFill} stroke={strokeColor} strokeWidth="2.5">
          <ellipse cx="66" cy="126" rx="9" ry="8" transform="rotate(-15 66 126)" />
          <ellipse cx="134" cy="126" rx="9" ry="8" transform="rotate(15 134 126)" />
        </g>

        {/* Floating Steam Clouds around creature */}
        <g stroke={strokeColor} strokeWidth="1.5" fill="none" opacity={isMonoReceipt ? '0.4' : '0.7'}>
          <path d="M 38 90 Q 44 80 50 88 T 58 84" />
          <path d="M 145 84 Q 152 74 160 82 T 166 80" />
        </g>
      </svg>
    </div>
  );
};
