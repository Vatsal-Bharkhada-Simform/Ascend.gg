import React, { useRef, useEffect, useState } from 'react';
import { useGameLoop } from '../game/useGameLoop';
import { useMetaStore } from '../store/metaStore';
import { AVAILABLE_THEMES, MAX_PLAY_WIDTH } from '../game/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Pointer } from 'lucide-react';

interface Props {
  onGameOver: (score: number) => void;
}

// Half-width of one out-of-bounds flanking zone (symmetric on both sides).
// Returns 0 on mobile where the play area fills the whole screen.
function computeOobZoneWidth(): number {
  return Math.max(0, (window.innerWidth - MAX_PLAY_WIDTH) / 2);
}

export const GameCanvas: React.FC<Props> = ({ onGameOver: _onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { controlMode, equippedSkinId, equippedThemeId } = useMetaStore();
  const activeTheme = AVAILABLE_THEMES.find(t => t.id === equippedThemeId) || AVAILABLE_THEMES[0];
  
  const { handleInput, isIdle } = useGameLoop(canvasRef, equippedSkinId, equippedThemeId, _onGameOver);

  // Single metric: width of one OOB zone. Both panels derive their position from this.
  const [oobZoneWidth, setOobZoneWidth] = useState<number>(computeOobZoneWidth);

  useEffect(() => {
    const onResize = () => setOobZoneWidth(computeOobZoneWidth());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isDesktop = oobZoneWidth > 0;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Disable touch controls if in keyboard mode
    if (controlMode === 'keyboard') return;

    // Determine left or right side based on screen width
    const width = window.innerWidth;
    if (e.clientX < width / 2) {
      handleInput('left');
    } else {
      handleInput('right');
    }
  };

  useEffect(() => {
    if (controlMode !== 'keyboard') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key.toLowerCase() === 'f' || e.key === 'ArrowLeft') {
        handleInput('left');
      } else if (e.key.toLowerCase() === 'j' || e.key === 'ArrowRight') {
        handleInput('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [controlMode, handleInput]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={`absolute inset-0 ${controlMode === 'touch' ? 'cursor-pointer' : ''}`}
      onPointerDown={handlePointerDown}
    >
      {/* 
        Score HUD panel
        Desktop: right OOB zone  → left edge is (oobZoneWidth + MAX_PLAY_WIDTH), width = oobZoneWidth
        Mobile:  top-right corner
      */}
      <div
        className="absolute pointer-events-none z-10 flex flex-col items-start justify-start"
        style={
          isDesktop
            ? { top: 32, left: oobZoneWidth + MAX_PLAY_WIDTH, width: oobZoneWidth }
            : { top: 32, right: 16 }
        }
      >
        <div
          id="hud-score"
          className="text-5xl font-black drop-shadow-sm tabular-nums px-8"
          style={{ color: activeTheme.textColor }}
        >
          0
        </div>
      </div>

      {/* 
        Multiplier + combo timer panel
        Desktop: left OOB zone  → left: 0, width = oobZoneWidth
        Mobile:  top-center
      */}
      <div
        className="absolute pointer-events-none z-10 flex flex-col items-end justify-start gap-1 px-8"
        style={
          isDesktop
            ? { top: 32, left: 0, width: oobZoneWidth }
            : { top: 32, left: '50%', transform: 'translateX(-50%)' }
        }
      >
        <div
          id="hud-multiplier"
          className="text-xl font-bold opacity-50 transition-all"
          style={{ color: activeTheme.textColor }}
        >
          x1
        </div>
        <div
          className="w-16 h-1.5 rounded-full overflow-hidden shadow-inner"
          style={{ backgroundColor: activeTheme.foregroundColor }}
        >
          <div
            id="hud-timer-bar"
            className="h-full bg-emerald-500 rounded-full transition-all duration-[16ms] ease-linear"
            style={{ width: '0%' }}
          />
        </div>
      </div>

      <AnimatePresence>
        {isIdle && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            {/* Left Side Instruction */}
            <div className="absolute right-1/2 mr-12 flex flex-col items-center animate-pulse">
              <svg width="60" height="80" viewBox="0 0 60 80" className="mb-4 stroke-current opacity-60 drop-shadow-md" style={{ color: activeTheme.textColor }}>
                <path d="M 50 80 Q 40 20 10 10 M 25 10 L 10 10 L 10 25" fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {controlMode === 'keyboard' ? (
                <div className="w-12 h-12 flex items-center justify-center border-4 rounded-xl text-2xl font-black drop-shadow-md" style={{ borderColor: activeTheme.textColor, color: activeTheme.textColor, backgroundColor: activeTheme.backgroundColor }}>F</div>
              ) : (
                <Pointer className="w-10 h-10 opacity-80 drop-shadow-md" style={{ color: activeTheme.textColor }} />
              )}
            </div>

            {/* Right Side Instruction */}
            <div className="absolute left-1/2 ml-12 flex flex-col items-center animate-pulse">
              <svg width="60" height="80" viewBox="0 0 60 80" className="mb-4 stroke-current opacity-60 drop-shadow-md" style={{ color: activeTheme.textColor }}>
                <path d="M 10 80 Q 20 20 50 10 M 35 10 L 50 10 L 50 25" fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {controlMode === 'keyboard' ? (
                <div className="w-12 h-12 flex items-center justify-center border-4 rounded-xl text-2xl font-black drop-shadow-md" style={{ borderColor: activeTheme.textColor, color: activeTheme.textColor, backgroundColor: activeTheme.backgroundColor }}>J</div>
              ) : (
                <Pointer className="w-10 h-10 opacity-80 drop-shadow-md" style={{ color: activeTheme.textColor }} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <canvas
        ref={canvasRef}
        className="block w-full h-full touch-none"
      />
    </motion.div>
  );
};
