import React from 'react';

interface Props {
  stepId: number;
  teaCategory?: string;
  className?: string;
}

export const TeaCraftIllustration: React.FC<Props> = ({ stepId, teaCategory = '烏龍茶', className = '' }) => {
  // Step 1: 晨曦採摘 / 採茶 (Tea Picking in Mountain Morning)
  if (stepId === 1) {
    return (
      <svg viewBox="0 0 400 260" className={`w-full h-full ${className}`}>
        <defs>
          <linearGradient id="skyGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C7E8DE" />
            <stop offset="60%" stopColor="#E2F1E8" />
            <stop offset="100%" stopColor="#F5FAF5" />
          </linearGradient>
          <linearGradient id="mountainGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7E9F82" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#46654C" />
          </linearGradient>
          <linearGradient id="leafGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#84CC16" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
          <radialGradient id="sunGlow1" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Morning Sky */}
        <rect width="400" height="260" rx="16" fill="url(#skyGrad1)" />

        {/* Morning Sun */}
        <circle cx="90" cy="70" r="45" fill="url(#sunGlow1)" />
        <circle cx="90" cy="70" r="18" fill="#FDE047" opacity="0.85" />

        {/* Distant Mountain Ridges */}
        <path d="M 0 140 Q 90 90 200 130 T 400 110 L 400 260 L 0 260 Z" fill="#99BA9E" opacity="0.6" />
        <path d="M 0 160 Q 120 115 250 155 T 400 145 L 400 260 L 0 260 Z" fill="url(#mountainGrad1)" />

        {/* Terraced Tea Hills (茶梯田) */}
        <path d="M -20 200 Q 110 170 230 195 T 420 185 L 420 260 L -20 260 Z" fill="#3D5A42" />
        <path d="M -20 225 Q 140 205 280 220 T 420 215 L 420 260 L -20 260 Z" fill="#2E4733" />

        {/* Bamboo Tea Basket (茶簍) on Ground */}
        <g transform="translate(65, 170)">
          <ellipse cx="25" cy="52" rx="28" ry="8" fill="#1C2E20" opacity="0.3" />
          <path d="M 2 20 Q 25 55 48 20 L 44 48 Q 25 58 6 48 Z" fill="#D4A373" stroke="#8C5C35" strokeWidth="2" />
          <ellipse cx="25" cy="20" rx="23" ry="9" fill="#E9C46A" stroke="#8C5C35" strokeWidth="1.5" />
          {/* Fresh leaves in basket */}
          <ellipse cx="22" cy="18" rx="8" ry="4" fill="#4ADE80" transform="rotate(-15 22 18)" />
          <ellipse cx="28" cy="19" rx="7" ry="3.5" fill="#22C55E" transform="rotate(25 28 19)" />
          <ellipse cx="25" cy="15" rx="6" ry="3" fill="#86EFAC" />
        </g>

        {/* Foreground Hero: Two Leaves and a Bud (一心二葉) & Hands-picking Art */}
        <g transform="translate(230, 85)">
          {/* Soft aura glow behind shoot */}
          <circle cx="65" cy="70" r="55" fill="#FFFFFF" opacity="0.4" />
          <circle cx="65" cy="70" r="42" fill="#BBF7D0" opacity="0.5" />

          {/* Stem */}
          <path d="M 65 145 Q 64 100 65 60" stroke="#4D7C0F" strokeWidth="5" strokeLinecap="round" />

          {/* Left Leaf */}
          <path
            d="M 65 95 C 30 90, 10 70, 15 50 C 35 48, 60 70, 65 95 Z"
            fill="url(#leafGrad1)"
            stroke="#166534"
            strokeWidth="1.5"
          />
          {/* Leaf vein */}
          <path d="M 62 90 Q 38 72 20 54" stroke="#86EFAC" strokeWidth="1.2" strokeLinecap="round" />

          {/* Right Leaf */}
          <path
            d="M 65 85 C 100 78, 120 58, 115 38 C 95 38, 70 60, 65 85 Z"
            fill="url(#leafGrad1)"
            stroke="#166534"
            strokeWidth="1.5"
          />
          <path d="M 68 80 Q 92 62 110 42" stroke="#86EFAC" strokeWidth="1.2" strokeLinecap="round" />

          {/* Tender Bud (一心頂芽) */}
          <path
            d="M 65 60 C 58 40, 60 20, 65 10 C 70 20, 72 40, 65 60 Z"
            fill="#A3E635"
            stroke="#4D7C0F"
            strokeWidth="1.5"
          />
          <path d="M 65 55 L 65 18" stroke="#D9F99D" strokeWidth="1.2" />

          {/* Morning Dew Drops (清晨露珠) */}
          <circle cx="35" cy="58" r="3.5" fill="#FFFFFF" opacity="0.9" />
          <circle cx="34" cy="57" r="1.5" fill="#E0F2FE" />
          <circle cx="95" cy="46" r="3" fill="#FFFFFF" opacity="0.9" />
          <circle cx="65" cy="22" r="2.5" fill="#FFFFFF" opacity="0.9" />
        </g>

        {/* Visual Badge Overlay */}
        <g transform="translate(18, 18)">
          <rect width="100" height="24" rx="12" fill="#14532D" opacity="0.85" />
          <text x="50" y="16" fill="#F0FDF4" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            ✦ 手採一心二葉
          </text>
        </g>
      </svg>
    );
  }

  // Step 2: 日光萎凋 / 走水 (Solar Withering on Bamboo Trays)
  if (stepId === 2) {
    return (
      <svg viewBox="0 0 400 260" className={`w-full h-full ${className}`}>
        <defs>
          <linearGradient id="warmSunGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="60%" stopColor="#FEF3C7" />
            <stop offset="100%" stopColor="#EDE9FE" />
          </linearGradient>
          <pattern id="bambooWeave" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 0 8 L 16 8 M 8 0 L 8 16" stroke="#D4A373" strokeWidth="1.2" opacity="0.6" />
            <path d="M 0 0 L 16 16 M 16 0 L 0 16" stroke="#C48E59" strokeWidth="0.8" opacity="0.4" />
          </pattern>
        </defs>

        {/* Sunny Yard Background */}
        <rect width="400" height="260" rx="16" fill="url(#warmSunGrad)" />

        {/* Warm Sunlight Beams */}
        <g opacity="0.35">
          <polygon points="40,0 90,0 210,260 140,260" fill="#FDE68A" />
          <polygon points="150,0 210,0 350,260 270,260" fill="#FDE68A" />
        </g>

        {/* Giant Bamboo Weave Tray (圓形大竹篩) */}
        <g transform="translate(200, 140)">
          {/* Drop shadow of tray */}
          <ellipse cx="0" cy="45" rx="170" ry="50" fill="#78350F" opacity="0.25" />

          {/* Outer Bamboo Rim */}
          <ellipse cx="0" cy="30" rx="165" ry="58" fill="#B45309" />
          <ellipse cx="0" cy="26" rx="162" ry="56" fill="#D97706" />

          {/* Woven Bamboo Surface */}
          <ellipse cx="0" cy="24" rx="156" ry="52" fill="#FDE68A" />
          <ellipse cx="0" cy="24" rx="156" ry="52" fill="url(#bambooWeave)" />

          {/* Fresh Green Leaves undergoing withering & softening */}
          {[
            { x: -110, y: 15, rot: 15, color: '#4ADE80' },
            { x: -80, y: 35, rot: -25, color: '#22C55E' },
            { x: -90, y: -5, rot: 40, color: '#65A30D' },
            { x: -40, y: 10, rot: -10, color: '#16A34A' },
            { x: -20, y: 35, rot: 30, color: '#84CC16' },
            { x: -50, y: -15, rot: -45, color: '#4ADE80' },
            { x: 10, y: 5, rot: 20, color: '#65A30D' },
            { x: 25, y: 30, rot: -15, color: '#22C55E' },
            { x: 60, y: 15, rot: 55, color: '#15803D' },
            { x: 75, y: -10, rot: -30, color: '#84CC16' },
            { x: 95, y: 25, rot: 10, color: '#4ADE80' },
            { x: 110, y: 5, rot: -40, color: '#65A30D' },
            { x: -5, y: -12, rot: 12, color: '#22C55E' },
            { x: 45, y: -8, rot: -20, color: '#4ADE80' }
          ].map((leaf, i) => (
            <path
              key={i}
              d="M -16 0 C -8 -9, 8 -9, 16 0 C 8 9, -8 9, -16 0 Z"
              fill={leaf.color}
              stroke="#14532D"
              strokeWidth="0.8"
              transform={`translate(${leaf.x}, ${leaf.y}) rotate(${leaf.rot}) scale(1.4)`}
            />
          ))}

          {/* Water vapor evaporating into air (水分消散動態線) */}
          <g stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" fill="none">
            <path d="M -70 -10 Q -65 -35 -75 -60" />
            <path d="M -10 -20 Q -5 -50 -20 -80" />
            <path d="M 50 -15 Q 60 -45 45 -75" />
            <path d="M 100 -5 Q 110 -35 95 -65" />
          </g>
        </g>

        {/* Visual Badge */}
        <g transform="translate(18, 18)">
          <rect width="120" height="24" rx="12" fill="#B45309" opacity="0.9" />
          <text x="60" y="16" fill="#FFFBEB" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            ✦ 均勻走水 · 葉質轉柔
          </text>
        </g>
      </svg>
    );
  }

  // Step 3: 浪青與發酵 (Tossing Leaves & Fermentation - Green leaves with Red Edges)
  if (stepId === 3) {
    return (
      <svg viewBox="0 0 400 260" className={`w-full h-full ${className}`}>
        <defs>
          <linearGradient id="fermentBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E2922" />
            <stop offset="100%" stopColor="#0F1712" />
          </linearGradient>
          <linearGradient id="leafFermentGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#B91C1C" />
            <stop offset="15%" stopColor="#EA580C" />
            <stop offset="35%" stopColor="#65A30D" />
            <stop offset="65%" stopColor="#22C55E" />
            <stop offset="85%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>
        </defs>

        {/* Atmospheric Fermentation Room */}
        <rect width="400" height="260" rx="16" fill="url(#fermentBg)" />

        {/* Motion Tossing Arc Lines (浪青翻動氣流軌跡) */}
        <g stroke="#FDE047" strokeWidth="2" strokeDasharray="6 6" fill="none" opacity="0.6">
          <path d="M 60 210 Q 200 40 340 180" />
          <path d="M 90 220 Q 200 80 320 200" />
        </g>

        {/* Centered Spotlight Leaf with Famous "綠葉紅鑲邊" (Green with Red Margins) */}
        <g transform="translate(200, 125)">
          {/* Aroma waves emanating */}
          <circle cx="0" cy="0" r="85" fill="#EF4444" opacity="0.15" />
          <circle cx="0" cy="0" r="60" fill="#F59E0B" opacity="0.2" />

          {/* Giant Detailed Tea Leaf */}
          <g transform="scale(2.4) rotate(-15)">
            {/* Red serrated margin (氧化紅邊) */}
            <path
              d="M -45 0 C -25 -22, 25 -22, 45 0 C 25 22, -25 22, -45 0 Z"
              fill="url(#leafFermentGrad)"
              stroke="#991B1B"
              strokeWidth="1.5"
            />
            {/* Center green vein core */}
            <path d="M -42 0 L 42 0" stroke="#FDE047" strokeWidth="1.5" />
            <path d="M -20 0 L -8 -10 M 0 0 L 12 -10 M 20 0 L 32 -8" stroke="#DCFCE7" strokeWidth="0.9" />
            <path d="M -20 0 L -8 10 M 0 0 L 12 10 M 20 0 L 32 8" stroke="#DCFCE7" strokeWidth="0.9" />
          </g>

          {/* Floating Leaves being Tossed in air */}
          {[
            { x: -120, y: -40, rot: -35, scale: 1.2 },
            { x: 120, y: -30, rot: 45, scale: 1.1 },
            { x: -90, y: 60, rot: 20, scale: 0.9 },
            { x: 100, y: 70, rot: -25, scale: 1.0 },
            { x: 0, y: -75, rot: 5, scale: 1.3 }
          ].map((l, idx) => (
            <path
              key={idx}
              d="M -20 0 C -10 -12, 10 -12, 20 0 C 10 12, -10 12, -20 0 Z"
              fill="url(#leafFermentGrad)"
              stroke="#B91C1C"
              strokeWidth="1"
              transform={`translate(${l.x}, ${l.y}) rotate(${l.rot}) scale(${l.scale})`}
            />
          ))}

          {/* Floral Aroma Sparkles (花果香凝聚) */}
          <circle cx="-50" cy="-60" r="3" fill="#FDE047" />
          <circle cx="60" cy="-55" r="4" fill="#F87171" />
          <circle cx="80" cy="30" r="3" fill="#FDE047" />
          <circle cx="-70" cy="40" r="3.5" fill="#FBBF24" />
        </g>

        {/* Visual Badge */}
        <g transform="translate(18, 18)">
          <rect width="130" height="24" rx="12" fill="#991B1B" opacity="0.9" />
          <text x="65" y="16" fill="#FEF2F2" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            ✦ 攪拌氧化 · 綠葉紅鑲邊
          </text>
        </g>
      </svg>
    );
  }

  // Step 4: 高溫殺青 / 炒青 (Fixation / Pan-firing in Hot Wok)
  if (stepId === 4) {
    return (
      <svg viewBox="0 0 400 260" className={`w-full h-full ${className}`}>
        <defs>
          <linearGradient id="wokFireGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#450A0A" />
            <stop offset="50%" stopColor="#7F1D1D" />
            <stop offset="100%" stopColor="#1C1917" />
          </linearGradient>
          <radialGradient id="panHeat" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#F97316" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#B91C1C" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Fire Roasting Ambiance */}
        <rect width="400" height="260" rx="16" fill="url(#wokFireGrad)" />

        {/* High Heat Glow in background */}
        <circle cx="200" cy="145" r="110" fill="url(#panHeat)" />

        {/* Cast Iron Pan/Drum (炒青大鐵鍋) */}
        <g transform="translate(200, 145)">
          {/* Iron Wok Rim */}
          <ellipse cx="0" cy="20" rx="155" ry="55" fill="#1C1917" stroke="#57534E" strokeWidth="4" />
          <ellipse cx="0" cy="15" rx="145" ry="48" fill="#292524" />

          {/* Sizzling Pan Base */}
          <ellipse cx="0" cy="22" rx="110" ry="32" fill="#78350F" opacity="0.7" />

          {/* Green tea leaves dancing in hot wok (高溫翻炒葉片) */}
          {[
            { x: -70, y: 15, rot: -20, col: '#84CC16' },
            { x: -40, y: 30, rot: 40, col: '#4ADE80' },
            { x: -10, y: 10, rot: -10, col: '#65A30D' },
            { x: 30, y: 25, rot: 35, col: '#84CC16' },
            { x: 65, y: 12, rot: -30, col: '#4ADE80' },
            { x: 0, y: 32, rot: 15, col: '#65A30D' },
            { x: -50, y: -5, rot: 60, col: '#A3E635' },
            { x: 40, y: -2, rot: -50, col: '#84CC16' }
          ].map((item, i) => (
            <path
              key={i}
              d="M -14 0 C -7 -8, 7 -8, 14 0 C 7 8, -7 8, -14 0 Z"
              fill={item.col}
              stroke="#365314"
              strokeWidth="1"
              transform={`translate(${item.x}, ${item.y}) rotate(${item.rot}) scale(1.3)`}
            />
          ))}

          {/* High Heat Steam Plumes & Sparks (陣陣熱氣與香氣迸發) */}
          <g fill="none" stroke="#FEF3C7" strokeWidth="2.5" strokeLinecap="round" opacity="0.8">
            <path d="M -45 -10 Q -55 -45 -35 -80" />
            <path d="M 0 -15 Q 15 -55 -5 -90" />
            <path d="M 50 -10 Q 35 -50 55 -85" />
          </g>

          {/* Tiny glowing embers / aroma burst */}
          <circle cx="-25" cy="-45" r="2.5" fill="#FDE047" />
          <circle cx="35" cy="-55" r="2" fill="#F97316" />
          <circle cx="10" cy="-70" r="3" fill="#FDE047" />
        </g>

        {/* Visual Badge */}
        <g transform="translate(18, 18)">
          <rect width="135" height="24" rx="12" fill="#C2410C" opacity="0.95" />
          <text x="67" y="16" fill="#FFF7ED" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            ✦ 高溫 280°C 鎖鮮去青
          </text>
        </g>
      </svg>
    );
  }

  // Step 5: 揉捻、成形與慢火乾燥 (Rolling & Shaping into tightly curled spheres or strips)
  return (
    <svg viewBox="0 0 400 260" className={`w-full h-full ${className}`}>
      <defs>
        <linearGradient id="dryBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2E2419" />
          <stop offset="100%" stopColor="#18130E" />
        </linearGradient>
        <radialGradient id="amberGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D97706" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Roasting Charcoal Glow Background */}
      <rect width="400" height="260" rx="16" fill="url(#dryBg)" />

      {/* Gentle Charcoal Warmth */}
      <circle cx="200" cy="130" r="100" fill="url(#amberGlow)" />

      {/* Centerpiece: Cloth Ball Shaping (布巾團揉) & Finished Tea Pearls (緊結球形/索狀) */}
      <g transform="translate(200, 130)">
        {/* Shadow */}
        <ellipse cx="0" cy="55" rx="90" ry="22" fill="#000000" opacity="0.4" />

        {/* Traditional White Linen Wrap for Ball-rolling (團揉布球) */}
        <g transform="translate(-50, 0)">
          <circle cx="0" cy="15" r="42" fill="#E7E5E4" stroke="#A8A29E" strokeWidth="2" />
          {/* Twisted knot on top */}
          <path d="M -12 -24 C -8 -36, 8 -36, 12 -24 C 6 -18, -6 -18, -12 -24 Z" fill="#D6D3D1" stroke="#78716C" strokeWidth="1.5" />
          {/* Wrinkle lines */}
          <path d="M -25 5 Q 0 20 25 5" stroke="#A8A29E" strokeWidth="1.2" fill="none" />
          <path d="M -28 25 Q 0 40 28 25" stroke="#A8A29E" strokeWidth="1.2" fill="none" />
        </g>

        {/* Finished Tight Tea Pearls (緊結墨綠半球形茶乾) */}
        <g transform="translate(60, 10)">
          {/* Scattered tightly rolled tea spheres */}
          {[
            { x: 0, y: 15, r: 16, col: '#1E3A2F' },
            { x: 28, y: 22, r: 13, col: '#142E25' },
            { x: -24, y: 26, r: 14, col: '#234638' },
            { x: 12, y: 38, r: 15, col: '#173329' },
            { x: -10, y: 44, r: 12, col: '#0F261E' },
            { x: 34, y: 40, r: 11, col: '#224436' }
          ].map((pearl, idx) => (
            <g key={idx} transform={`translate(${pearl.x}, ${pearl.y})`}>
              <circle cx="0" cy="0" r={pearl.r} fill={pearl.col} stroke="#4ADE80" strokeWidth="0.8" />
              {/* Tight curl texture on tea leaf sphere */}
              <path
                d="M -6 -4 Q 0 -8 6 -4 Q 8 2 4 6 Q -2 8 -6 4 Z"
                fill="none"
                stroke="#86EFAC"
                strokeWidth="1.2"
                opacity="0.75"
              />
            </g>
          ))}
        </g>

        {/* Gentle Dry Heat Waves */}
        <g stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.65" fill="none">
          <path d="M -20 -40 Q -10 -65 -25 -85" />
          <path d="M 30 -35 Q 45 -60 25 -80" />
        </g>
      </g>

      {/* Visual Badge */}
      <g transform="translate(18, 18)">
        <rect width="130" height="24" rx="12" fill="#D97706" opacity="0.95" />
        <text x="65" y="16" fill="#FFFBEB" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
          ✦ 團揉成球 · 慢烘鎖香
        </text>
      </g>
    </svg>
  );
};
