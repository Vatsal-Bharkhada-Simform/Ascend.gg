import React, { useRef, useEffect } from 'react';

interface Props {
  onGameOver: (score: number) => void;
}

export const GameCanvas: React.FC<Props> = ({ onGameOver: _onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // We will implement the game loop and rendering here in Phase 1 & 2
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Placeholder clear
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  return (
    <div className="absolute inset-0 bg-white">
      {/* HUD overlay will go here */}
      <div className="absolute top-12 left-0 right-0 flex justify-center z-10 pointer-events-none">
        <div className="text-4xl font-black text-gray-900">0</div>
      </div>
      
      <canvas
        ref={canvasRef}
        className="block w-full h-full touch-none"
      />
    </div>
  );
};
