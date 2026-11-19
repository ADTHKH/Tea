import React, { useEffect, useState, useRef } from 'react';
import { TeaProduct } from '../types/tea';
import { sounds } from '../utils/audio';
import { Sparkles } from 'lucide-react';

interface Props {
  tea: TeaProduct;
  onAnimationComplete: () => void;
  customCupImage?: string;
  customCupSize?: number;
  customBgImage?: string;
  customTexts?: Record<string, string>;
}

export const SteamCondensationView: React.FC<Props> = ({ 
  tea, 
  onAnimationComplete,
  customCupImage,
  customCupSize = 210,
  customBgImage,
  customTexts = {}
}) => {
  const [phase, setPhase] = useState<'gathering' | 'condensing' | 'crystallizing'>('gathering');
  const [progress, setProgress] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    sounds.playSteamAwaken();
    const bellTimer = setTimeout(() => {
      sounds.playSingingBowl();
    }, 1200);

    const dropTimer = setTimeout(() => {
      sounds.playWaterDrop();
    }, 2800);

    // Animation phase sequencer (~5 seconds cinematic steam condensation transition)
    const startTime = Date.now();
    const DURATION = 5000;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(100, Math.floor((elapsed / DURATION) * 100));
      setProgress(p);

      if (elapsed > 1600 && elapsed <= 3200) {
        setPhase('condensing');
      } else if (elapsed > 3200) {
        setPhase('crystallizing');
      }

      if (elapsed >= DURATION) {
        clearInterval(timer);
        onAnimationComplete();
      }
    }, 50);

    return () => {
      clearInterval(timer);
      clearTimeout(bellTimer);
      clearTimeout(dropTimer);
    };
  }, [onAnimationComplete]);

  // Canvas dynamic steam swirling particle simulation in white/light theme
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);

    interface Particle {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      life: number;
      maxLife: number;
      color: string;
      angle: number;
      angularSpeed: number;
    }

    const particles: Particle[] = [];
    // Bright, light, luminous and airy bubble palette (no grayish or murky dark tones)
    const particleColors = [
      '#FFFFFF', // Glistening white
      '#FEF08A', // Radiant sunlight gold
      '#FDE047', // Sparkling honey glow
      '#A7F3D0', // Luminous mint crystal
      '#6EE7B7', // Bright jade dew
      '#FDE68A'  // Warm champagne luminescence
    ];

    for (let i = 0; i < 65; i++) {
      particles.push({
        x: width / 2 + (Math.random() - 0.5) * 180,
        y: height * 0.65 + (Math.random() - 0.5) * 60,
        radius: Math.random() * 20 + 6,
        vx: (Math.random() - 0.5) * 0.7,
        vy: -Math.random() * 1.6 - 0.7,
        alpha: Math.random() * 0.45 + 0.25,
        life: 0,
        maxLife: Math.random() * 100 + 70,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.03
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.life++;
        p.y += p.vy;
        p.x += Math.sin(p.angle) * 1.2 + p.vx;
        p.angle += p.angularSpeed;

        const halfLife = p.maxLife / 2;
        const currentAlpha =
          p.life < halfLife
            ? (p.life / halfLife) * p.alpha
            : ((p.maxLife - p.life) / halfLife) * p.alpha;

        ctx.save();
        
        // 1. Radiant luminous soft aura
        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, p.radius * 0.1, p.x, p.y, p.radius);
        grad.addColorStop(0, p.color);
        grad.addColorStop(0.7, p.color);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.globalAlpha = Math.max(0, currentAlpha * 0.65);
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // 2. Glistening translucent bubble edge ring (pure crystal light, never murky)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.8, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = Math.max(0, currentAlpha * 0.8);
        ctx.stroke();

        // 3. Sparkling specular pearl highlight on upper-left of bubble
        ctx.beginPath();
        ctx.arc(
          p.x - p.radius * 0.28,
          p.y - p.radius * 0.28,
          Math.max(1, p.radius * 0.2),
          0,
          Math.PI * 2
        );
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.globalAlpha = Math.max(0, currentAlpha);
        ctx.fill();

        ctx.restore();

        // Respawn near cup mouth
        if (p.life >= p.maxLife || p.y < -30) {
          p.life = 0;
          p.x = width / 2 + (Math.random() - 0.5) * 140;
          p.y = height * 0.62 + (Math.random() - 0.5) * 30;
          p.alpha = Math.random() * 0.45 + 0.25;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [tea.soupColorHex]);

  const badgeText = customTexts['steam-badge'] || '製茶工藝淬鍊完成 · 香氣凝華中';
  const descText = customTexts['steam-desc'] || '熱水沖注之間，山風與雲霧在杯盞中重新甦醒。靜心深嗅，感受茶湯蒸氣為您帶來的當下悸動。';

  const getPhaseTitle = () => {
    if (phase === 'gathering') {
      return customTexts['steam-title-gathering'] || `「${tea.name}」茶香升騰，氣韻流轉...`;
    }
    if (phase === 'condensing') {
      return customTexts['steam-title-condensing'] || '茶湯蒸氣凝結，百草香氣漸化靈形...';
    }
    return customTexts['steam-title-crystallizing'] || '心境與茶氣共鳴，即將揭開感官之問...';
  };

  return (
    <div 
      className="relative min-h-[500px] lg:min-h-[560px] w-full flex flex-col items-center justify-center overflow-hidden bg-transparent p-6 animate-fade-in"
    >
      {/* Dynamic Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />


      {/* Main Center Cinematic: Ceramic Tea Bowl & Condensing Droplet Steam */}
      <div className="relative z-10 flex flex-col items-center max-w-2xl text-center space-y-6">
        
        {/* Floating Condensation Aura Visual */}
        <div className="relative w-60 h-60 sm:w-72 sm:h-72 flex items-center justify-center">
          {/* Concentric Water Droplet Ripples */}
          <div
            className="absolute w-44 h-44 rounded-full border border-emerald-300/40 animate-ping opacity-25 pointer-events-none"
          />
          <div
            className="absolute w-56 h-56 rounded-full border border-amber-300/30 animate-pulse pointer-events-none"
          />

          {/* Steaming Ceramic Tea Bowl / Custom Uploaded Cup Image */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Swirling Steam Tendrils (Luminous, airy gradients) */}
            <div className="relative h-24 w-40 flex items-end justify-center gap-3 mb-1 pointer-events-none">
              <span className="w-2 h-16 bg-gradient-to-t from-emerald-300/70 via-teal-200/40 to-transparent rounded-full animate-steam-1 blur-[1px]" />
              <span className="w-2.5 h-22 bg-gradient-to-t from-amber-300/80 via-yellow-200/50 to-transparent rounded-full animate-steam-2 blur-[1px]" />
              <span className="w-2 h-20 bg-gradient-to-t from-emerald-200/70 via-teal-100/40 to-transparent rounded-full animate-steam-3 blur-[1px]" />
            </div>

            {/* Glowing Condensing Essence Droplet in Mid-Air */}
            <div
              className={`absolute top-6 w-9 h-11 rounded-full transition-all duration-700 flex items-center justify-center shadow-xl ${
                phase === 'gathering'
                  ? 'scale-90 opacity-80 filter blur-[0.5px]'
                  : phase === 'condensing'
                  ? 'scale-125 opacity-100 ring-4 ring-emerald-400/40 shadow-emerald-400/50'
                  : 'scale-150 opacity-100 ring-8 ring-amber-400/50 shadow-amber-400/60'
              }`}
              style={{
                backgroundColor: tea.soupColorHex,
                boxShadow: `0 0 30px ${tea.soupColorHex}`
              }}
            >
              <Sparkles className="w-4 h-4 text-white animate-spin" style={{ animationDuration: '6s' }} />
            </div>

            {/* Middle Tea Cup: Custom Transparent Image or Elegant Ceramic Bowl SVG (Seamless, adjustable size) */}
            {customCupImage ? (
              <div 
                className="relative flex items-center justify-center transition-all duration-300"
                style={{
                  width: `${Math.max(90, Math.min(480, customCupSize || 210))}px`,
                  height: `${Math.round(Math.max(90, Math.min(480, customCupSize || 210)) * 0.46)}px`
                }}
              >
                {/* Tea soup subtle aroma glow rising from the cup surface */}
                <div 
                  className="absolute top-2 rounded-full blur-md opacity-50 pointer-events-none"
                  style={{
                    backgroundColor: tea.soupColorHex,
                    width: `${Math.round(Math.max(90, Math.min(480, customCupSize || 210)) * 0.6)}px`,
                    height: '24px'
                  }}
                />
                <img 
                  src={customCupImage} 
                  alt="茶席主杯" 
                  className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.16)] select-none pointer-events-none"
                />
              </div>
            ) : (
              <svg width="200" height="85" viewBox="0 0 200 85" className="drop-shadow-lg">
                <defs>
                  <linearGradient id="whiteCupGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#EDEAE3" />
                  </linearGradient>
                  <linearGradient id="whiteLiquidGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={tea.soupColorHex} stopOpacity="0.85" />
                    <stop offset="50%" stopColor="#FFF2B2" stopOpacity="0.95" />
                    <stop offset="100%" stopColor={tea.soupColorHex} stopOpacity="0.85" />
                  </linearGradient>
                </defs>

                {/* Bowl Outer Rim */}
                <ellipse cx="100" cy="20" rx="82" ry="14" fill="#F5F5F0" stroke="#8E9B89" strokeWidth="2.5" />
                
                {/* Tea Liquid Surface */}
                <ellipse cx="100" cy="22" rx="74" ry="11" fill="url(#whiteLiquidGrad)" />

                {/* Bowl Body in Pure Celadon White */}
                <path
                  d="M 18 20 C 20 70, 65 80, 100 80 C 135 80, 180 70, 182 20 Z"
                  fill="url(#whiteCupGrad)"
                  stroke="#7A8B75"
                  strokeWidth="3"
                />

                {/* Foot Ring */}
                <ellipse cx="100" cy="80" rx="34" ry="4" fill="#DFDDD5" stroke="#7A8B75" strokeWidth="2" />
              </svg>
            )}
          </div>
        </div>

        {/* Narrative Flowchart Text Transition (Badge removed per user request) */}
        <div className="space-y-2">
          <h2 className="font-serif-tc text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-wide transition-all">
            {getPhaseTitle()}
          </h2>

          <p className="text-stone-600 text-xs sm:text-sm font-serif-tc leading-relaxed max-w-lg mx-auto">
            {descText}
          </p>
        </div>

        {/* Bottom Progress Bar & Direct Skip Button with tea.soupColorHex */}
        <div className="w-full max-w-md pt-2 space-y-2">
          <div className="w-full bg-stone-200/60 h-2 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-100 ease-linear shadow-xs"
              style={{ 
                width: `${progress}%`,
                backgroundColor: tea.soupColorHex
              }}
            />
          </div>

          <div className="flex items-center justify-center text-[11px] text-stone-400 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: tea.soupColorHex }} />
              <span>凝華中 {progress}%</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
