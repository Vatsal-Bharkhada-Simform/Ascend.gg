import React, { useRef, useEffect } from 'react';
import { useGameLoop } from '../game/useGameLoop';
import { useMetaStore } from '../store/metaStore';
import { AVAILABLE_THEMES } from '../game/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Pointer } from 'lucide-react';

interface Props {
  onGameOver: (score: number) => void;
}

export const GameCanvas: React.FC<Props> = ({ onGameOver: _onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { controlMode, equippedSkinId, equippedThemeId } = useMetaStore();
  const activeTheme = AVAILABLE_THEMES.find(t => t.id === equippedThemeId) || AVAILABLE_THEMES[0];
  
  const { handleInput, isIdle } = useGameLoop(canvasRef, equippedSkinId, equippedThemeId, _onGameOver);

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
      {/* HUD overlay */}
      <div className="absolute top-8 left-0 right-0 flex flex-col items-center pointer-events-none z-10">
        <div id="hud-score" className="text-6xl font-black drop-shadow-sm">0</div>
        
        <div className="flex flex-col items-center gap-1">
          <div id="hud-multiplier" className="text-xl font-bold opacity-50 transition-all">x1</div>
          <div 
            className="w-24 h-2 rounded-full overflow-hidden shadow-inner"
            style={{ backgroundColor: activeTheme.foregroundColor }}
          >
            <div 
              id="hud-timer-bar" 
              className="h-full bg-emerald-500 rounded-full transition-all duration-[16ms] ease-linear"
              style={{ width: '0%' }}
            ></div>
          </div>
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
