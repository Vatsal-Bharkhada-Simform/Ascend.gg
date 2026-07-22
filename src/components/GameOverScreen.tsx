import React from 'react';
import { useMetaStore } from '../store/metaStore';
import { RotateCcw, Home, ShoppingBag } from 'lucide-react';
import { AVAILABLE_THEMES } from '../game/constants';
import { motion } from 'framer-motion';
import { playClick, initAudio } from '../utils/audio';

interface Props {
  score: number;
  onRetry: () => void;
  onHome: () => void;
  onShop: () => void;
}

export const GameOverScreen: React.FC<Props> = ({ score, onRetry, onHome, onShop }) => {
  const { bestScore, equippedThemeId } = useMetaStore();
  
  const activeTheme = AVAILABLE_THEMES.find(t => t.id === equippedThemeId) || AVAILABLE_THEMES[0];
  const isNewBest = score > 0 && score >= bestScore;

  const handleHome = () => {
    initAudio();
    playClick();
    onHome();
  };

  const handleRetry = () => {
    initAudio();
    playClick();
    onRetry();
  };

  const handleShop = () => {
    initAudio();
    playClick();
    onShop();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 flex flex-col items-center justify-center"
    >
      <div className="flex flex-col items-center space-y-10 w-full max-w-xs">
        <div className="text-center">
          <h2 className="text-4xl font-black tracking-tight mb-2">GAME OVER</h2>
          {isNewBest && (
            <div className="font-bold tracking-widest text-sm animate-pulse" style={{ color: activeTheme.accentColor }}>
              NEW BEST!
            </div>
          )}
        </div>

        <div className="flex flex-col items-center">
          <div className="text-8xl font-black tracking">{score}</div>
          <div className="font-medium mt-2" style={{ opacity: 0.7 }}>
            BEST: {Math.max(score, bestScore)}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full pt-4">
          <button
            onClick={handleHome}
            className="flex flex-col items-center justify-center p-4 rounded-2xl transition-colors active:scale-95"
            style={{ backgroundColor: activeTheme.foregroundColor, color: activeTheme.textColor }}
          >
            <Home className="w-8 h-8 mb-2" />
            <span className="text-xs font-bold">HOME</span>
          </button>
          
          <button
            onClick={handleRetry}
            className="flex flex-col items-center justify-center p-4 rounded-2xl transition-colors active:scale-95 shadow-xl shadow-black/20"
            style={{ backgroundColor: activeTheme.accentColor, color: activeTheme.backgroundColor }}
          >
            <RotateCcw className="w-8 h-8 mb-2" />
            <span className="text-xs font-bold">RETRY</span>
          </button>

          <button
            onClick={handleShop}
            className="flex flex-col items-center justify-center p-4 rounded-2xl transition-colors active:scale-95"
            style={{ backgroundColor: activeTheme.foregroundColor, color: activeTheme.textColor }}
          >
            <ShoppingBag className="w-8 h-8 mb-2" />
            <span className="text-xs font-bold">SHOP</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
