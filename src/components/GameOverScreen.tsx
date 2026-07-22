import React from 'react';
import { useMetaStore } from '../store/metaStore';
import { RotateCcw, Home, ShoppingBag } from 'lucide-react';

interface Props {
  score: number;
  onRetry: () => void;
  onHome: () => void;
  onShop: () => void;
}

export const GameOverScreen: React.FC<Props> = ({ score, onRetry, onHome, onShop }) => {
  const { bestScore } = useMetaStore();
  
  const isNewBest = score > 0 && score >= bestScore;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white text-gray-900">
      <div className="flex flex-col items-center space-y-10 w-full max-w-xs">
        <div className="text-center">
          <h2 className="text-4xl font-black tracking-tight mb-2">GAME OVER</h2>
          {isNewBest && (
            <div className="text-emerald-500 font-bold tracking-widest text-sm animate-pulse">
              NEW BEST!
            </div>
          )}
        </div>

        <div className="flex flex-col items-center">
          <div className="text-8xl font-black tracking-tighter">{score}</div>
          <div className="text-gray-500 font-medium mt-2">
            BEST: {Math.max(score, bestScore)}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full pt-4">
          <button
            onClick={onHome}
            className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors active:scale-95 text-gray-600"
          >
            <Home className="w-8 h-8 mb-2" />
            <span className="text-xs font-bold">HOME</span>
          </button>
          
          <button
            onClick={onRetry}
            className="flex flex-col items-center justify-center p-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-colors active:scale-95 shadow-xl shadow-gray-900/20"
          >
            <RotateCcw className="w-8 h-8 mb-2" />
            <span className="text-xs font-bold">RETRY</span>
          </button>

          <button
            onClick={onShop}
            className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors active:scale-95 text-gray-600"
          >
            <ShoppingBag className="w-8 h-8 mb-2" />
            <span className="text-xs font-bold">SHOP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
