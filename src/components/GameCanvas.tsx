import React, { useRef, useEffect } from 'react';
import { useGameLoop } from '../game/useGameLoop';
import { useMetaStore } from '../store/metaStore';

interface Props {
  onGameOver: (score: number) => void;
}

export const GameCanvas: React.FC<Props> = ({ onGameOver: _onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { handleInput } = useGameLoop(canvasRef, _onGameOver);
  const { controlMode } = useMetaStore();

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
      className={`absolute inset-0 bg-white ${controlMode === 'touch' ? 'cursor-pointer' : ''}`}
      onPointerDown={handlePointerDown}
    >
      {/* HUD overlay */}
      <div className="absolute top-12 left-0 right-0 flex justify-center z-10 pointer-events-none">
        <div className="text-4xl font-black text-gray-900 drop-shadow-md">0</div>
      </div>
      
      <canvas
        ref={canvasRef}
        className="block w-full h-full touch-none"
      />
    </div>
  );
};
