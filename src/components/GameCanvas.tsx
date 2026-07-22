import React, { useRef, useEffect } from 'react';
import { useGameLoop } from '../game/useGameLoop';
import { useMetaStore } from '../store/metaStore';
import { AVAILABLE_THEMES } from '../game/constants';

interface Props {
  onGameOver: (score: number) => void;
}

export const GameCanvas: React.FC<Props> = ({ onGameOver: _onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { controlMode, equippedSkinId, equippedThemeId } = useMetaStore();
  const activeTheme = AVAILABLE_THEMES.find(t => t.id === equippedThemeId) || AVAILABLE_THEMES[0];
  
  const { handleInput } = useGameLoop(canvasRef, equippedSkinId, equippedThemeId, _onGameOver);

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
    <div 
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
      
      <canvas
        ref={canvasRef}
        className="block w-full h-full touch-none"
      />
    </div>
  );
};
