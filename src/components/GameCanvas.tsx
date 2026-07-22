import React, { useRef } from 'react';
import { useGameLoop } from '../game/useGameLoop';

interface Props {
  onGameOver: (score: number) => void;
}

export const GameCanvas: React.FC<Props> = ({ onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { handleInput } = useGameLoop(canvasRef, onGameOver);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Determine left or right side based on screen width
    const width = window.innerWidth;
    if (e.clientX < width / 2) {
      handleInput('left');
    } else {
      handleInput('right');
    }
  };

  return (
    <div 
      className="absolute inset-0 bg-white cursor-pointer"
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
