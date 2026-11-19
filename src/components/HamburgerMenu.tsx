import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Image as ImageIcon, Volume2, VolumeX, 
  FastForward, RotateCcw, Maximize, Minimize, Type, Sparkles, Home, Radio, Upload, Printer
} from './icons';
import { sounds } from '../utils/audio';
import { pairPrinter } from '../utils/receiptPrinter';

interface Props {
  onOpenGallery: (tab?: 'slots' | 'upload' | 'text' | 'settings') => void;
  onOpenNfcSelect?: () => void;
  onSkipToEmotion: () => void;
  onReset: () => void;
  onGoHome?: () => void;
  onGoToSelect?: () => void;
  onUploadProcessChart?: () => void;
  onSkipProcess?: () => void;
  currentStage: 'home' | 'select' | 'process' | 'steam' | 'emotion' | 'reveal' | 'printer';
}

export const HamburgerMenu: React.FC<Props> = ({
  onOpenGallery,
  onOpenNfcSelect,
  onSkipToEmotion,
  onReset,
  onGoHome,
  onGoToSelect,
  onUploadProcessChart,
  onSkipProcess,
  currentStage
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sounds.getIsMuted());
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const touchTimerRef = useRef<number | null>(null);

  const toggleMute = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Right-click global event listener to open menu at cursor location
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // Ignore if user right-clicks inside an input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      e.preventDefault();
      const menuWidth = 260;
      const menuHeight = 440;
      const x = Math.min(e.clientX, window.innerWidth - menuWidth - 16);
      const y = Math.min(e.clientY, window.innerHeight - menuHeight - 16);
      setPosition({ x: Math.max(16, x), y: Math.max(16, y) });
      setIsOpen(true);
    };

    // Touch screen long-press listener (for kiosk touchscreens without physical right mouse button)
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        touchTimerRef.current = window.setTimeout(() => {
          const menuWidth = 260;
          const menuHeight = 440;
          const x = Math.min(touch.clientX, window.innerWidth - menuWidth - 16);
          const y = Math.min(touch.clientY, window.innerHeight - menuHeight - 16);
          setPosition({ x: Math.max(16, x), y: Math.max(16, y) });
          setIsOpen(true);
        }, 700);
      }
    };

    const handleTouchEnd = () => {
      if (touchTimerRef.current) {
        clearTimeout(touchTimerRef.current);
        touchTimerRef.current = null;
      }
    };

    // Keyboard shortcut (Escape to close, or 'm' key for admin convenience)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchmove', handleTouchEnd);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchmove', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    };
  }, [isOpen]);

  // When closed, render nothing on screen per user instruction ("介面上就不需要留有漢堡選單的圖樣")
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      onClick={() => setIsOpen(false)}
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px] animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          top: position ? `${position.y}px` : '1.5rem',
          left: position ? `${position.x}px` : 'auto',
          right: position ? 'auto' : '1.5rem'
        }}
        className="fixed z-50 w-64 bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-2xl shadow-2xl p-2.5 text-stone-800 text-xs font-serif-tc animate-scale-up ring-1 ring-black/5"
      >
        {/* Header with Title and Close button */}
        <div className="px-2.5 py-1.5 border-b border-stone-100 flex items-center justify-between text-[11px] font-mono text-stone-500 mb-1">
          <span className="font-semibold text-stone-700">後台控制選單 · 右鍵喚醒</span>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-5 h-5 rounded-md hover:bg-stone-100 text-stone-400 hover:text-stone-700 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-1">
          {/* 1. NFC Tea Selection Standby / Test Modal */}
          <button
            onClick={() => {
              if (onOpenNfcSelect) {
                onOpenNfcSelect();
              } else if (onGoToSelect) {
                onGoToSelect();
              }
              setIsOpen(false);
            }}
            className="w-full px-3 py-2 rounded-xl hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 flex items-center gap-2.5 transition-colors cursor-pointer text-left font-medium"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs">NFC 感應選茶區</div>
              <div className="text-[10px] text-stone-400 font-mono">晶片讀取與手動選茶</div>
            </div>
          </button>

          {/* 2. Upload / Change flowchart infographic for current tea */}
          {currentStage === 'process' && (
            <button
              onClick={() => {
                if (onUploadProcessChart) {
                  onUploadProcessChart();
                } else {
                  onOpenGallery('slots');
                }
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 rounded-xl hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 flex items-center gap-2.5 transition-colors cursor-pointer text-left font-medium"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-emerald-800">更換此茶種認識茶 GIF / 圖</div>
                <div className="text-[10px] text-stone-400 font-mono">上傳新版 GIF 動圖或圖片</div>
              </div>
            </button>
          )}

          {/* 3. Slot Binding / Media Gallery */}
          <button
            onClick={() => {
              onOpenGallery('slots');
              setIsOpen(false);
            }}
            className="w-full px-3 py-2 rounded-xl hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 flex items-center gap-2.5 transition-colors cursor-pointer text-left font-medium"
          >
            <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
              <ImageIcon className="w-4 h-4 text-emerald-700" />
            </div>
            <span>後台圖庫設置 (換圖綁定)</span>
          </button>

          {/* 4. Upload Material Image Directly */}
          <button
            onClick={() => {
              onOpenGallery('upload');
              setIsOpen(false);
            }}
            className="w-full px-3 py-2 rounded-xl hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 flex items-center gap-2.5 transition-colors cursor-pointer text-left font-medium"
          >
            <div className="w-7 h-7 rounded-lg bg-stone-100 text-amber-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>上傳圖片素材</span>
          </button>

          {/* 5. Text Customization */}
          <button
            onClick={() => {
              onOpenGallery('text');
              setIsOpen(false);
            }}
            className="w-full px-3 py-2 rounded-xl hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 flex items-center gap-2.5 transition-colors cursor-pointer text-left font-medium"
          >
            <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
              <Type className="w-4 h-4" />
            </div>
            <span>手動更改介面文字</span>
          </button>

          {/* 6. Skip Step (Process or Steam) */}
          {(currentStage === 'process' || currentStage === 'steam') && (
            <button
              onClick={() => {
                if (currentStage === 'process' && onSkipProcess) {
                  onSkipProcess();
                } else {
                  onSkipToEmotion();
                }
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 rounded-xl hover:bg-stone-900 hover:text-white text-stone-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left font-medium"
            >
              <div className="w-7 h-7 rounded-lg bg-stone-800 text-emerald-300 flex items-center justify-center shrink-0">
                <FastForward className="w-4 h-4" />
              </div>
              <span>跳過此步進入下一步</span>
            </button>
          )}

          <div className="my-1 border-t border-stone-100" />

          {/* 7. Sound Toggle */}
          <button
            onClick={toggleMute}
            className="w-full px-3 py-1.5 rounded-xl hover:bg-stone-100 text-stone-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left text-xs"
          >
            <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center shrink-0">
              {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
            </div>
            <span>{isMuted ? '解除靜音' : '靜音'}</span>
          </button>

          {/* 8. Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="w-full px-3 py-1.5 rounded-xl hover:bg-stone-100 text-stone-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left text-xs"
          >
            <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center shrink-0">
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </div>
            <span>{isFullscreen ? '退出全螢幕' : '切換全螢幕模式'}</span>
          </button>

          {/* 連接 USB 收據機（樹莓派跑過設定腳本就不用按） */}
          <button
            onClick={() => {
              pairPrinter().catch((err) => alert(`收據機沒有連上：${err.message}`));
              setIsOpen(false);
            }}
            className="w-full px-3 py-1.5 rounded-xl hover:bg-stone-100 text-stone-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left text-xs"
          >
            <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center shrink-0">
              <Printer className="w-4 h-4" />
            </div>
            <span>連接收據機</span>
          </button>

          {/* 9. Return to Home Cover */}
          {onGoHome && currentStage !== 'home' && (
            <button
              onClick={() => {
                onGoHome();
                setIsOpen(false);
              }}
              className="w-full px-3 py-1.5 rounded-xl hover:bg-stone-100 text-stone-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left text-xs"
            >
              <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center shrink-0">
                <Home className="w-4 h-4" />
              </div>
              <span>返回首頁封面</span>
            </button>
          )}

          {/* 10. Reset Experience */}
          <button
            onClick={() => {
              onReset();
              setIsOpen(false);
            }}
            className="w-full px-3 py-1.5 rounded-xl hover:bg-rose-50 text-stone-600 hover:text-rose-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left text-xs"
          >
            <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-4 h-4" />
            </div>
            <span>重新開始茶席體驗</span>
          </button>
        </div>
      </div>
    </div>
  );
};
