import React, { useEffect } from 'react';
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
  const { bestScore, equippedThemeId, controlMode } = useMetaStore();
  
  const activeTheme = AVAILABLE_THEMES.find(t => t.id === equippedThemeId) || AVAILABLE_THEMES[0];
  const isNewBest = score > 0 && score >= bestScore;

  const handleHome = () => { initAudio(); playClick(); onHome(); };
  const handleRetry = () => { initAudio(); playClick(); onRetry(); };
  const handleShop = () => { initAudio(); playClick(); onShop(); };

  // Keyboard navigation — R or Enter retries, always active
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R' || e.key === 'Enter') handleRetry();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 flex flex-col px-6 sm:px-8"
    >
      {/* Small muted label — "GAME OVER" is not the headline, the score is */}
      <motion.div
        className="pt-12"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.35, ease: 'easeOut' }}
      >
        <p className="text-sm font-black tracking-widest" style={{ opacity: 0.4 }}>
          GAME OVER
        </p>
      </motion.div>

      {/* Score — the dominant element, drops in with spring overshoot */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -48, scale: 0.75 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
          className="text-center"
        >
          <div className="text-8xl sm:text-9xl font-black leading-none tabular-nums">{score}</div>
          <div className="text-xs font-black tracking-widest mt-3" style={{ opacity: 0.35 }}>
            YOUR SCORE
          </div>
        </motion.div>
      </div>

      {/* Stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
      >
        <div className="w-full h-px mb-5" style={{ backgroundColor: activeTheme.foregroundColor }} />
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs font-black tracking-widest" style={{ opacity: 0.45 }}>BEST</span>
          <span className="text-xl font-black tabular-nums">{Math.max(score, bestScore)}</span>
        </div>
        <div className="w-full h-px mb-6" style={{ backgroundColor: activeTheme.foregroundColor }} />
      </motion.div>

      {/* Action buttons */}
      <motion.div
        className="flex flex-col gap-3 pb-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4, ease: 'easeOut' }}
      >
        {/* Primary — RETRY */}
        <motion.button
          onClick={handleRetry}
          className="flex items-center justify-center w-full py-5 rounded-xl text-xl font-black tracking-wide"
          style={{ backgroundColor: activeTheme.accentColor, color: activeTheme.backgroundColor }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <RotateCcw className="w-5 h-5 mr-3" />
          RETRY
          {controlMode === 'keyboard' && (
            <kbd
              className="ml-3 px-1.5 py-0.5 text-xs font-black rounded"
              style={{ backgroundColor: activeTheme.backgroundColor, opacity: 0.35, color: activeTheme.textColor }}
            >
              R
            </kbd>
          )}
        </motion.button>

        {/* Secondary row */}
        <div className="flex gap-3">
          <motion.button
            onClick={handleHome}
            className="flex-1 flex items-center justify-center py-4 rounded-xl font-black text-sm tracking-widest"
            style={{ backgroundColor: activeTheme.foregroundColor, color: activeTheme.textColor }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Home className="w-4 h-4 mr-2" />
            HOME
          </motion.button>
          <motion.button
            onClick={handleShop}
            className="flex-1 flex items-center justify-center py-4 rounded-xl font-black text-sm tracking-widest"
            style={{ backgroundColor: activeTheme.foregroundColor, color: activeTheme.textColor }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            LOADOUT
          </motion.button>
        </div>

        {/* NEW BEST stamp — spring pop-in, below buttons */}
        {isNewBest && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.65 }}
            className="flex items-center gap-2 pt-1"
          >
            <span
              className="text-sm font-black tracking-widest"
              style={{ color: activeTheme.accentColor }}
            >
              ★ NEW BEST
            </span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};
