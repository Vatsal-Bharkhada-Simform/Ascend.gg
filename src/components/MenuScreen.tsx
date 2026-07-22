import React, { useEffect } from 'react';
import { useMetaStore } from '../store/metaStore';
import { Play, ShoppingBag, Volume2, VolumeX } from 'lucide-react';
import { AVAILABLE_THEMES } from '../game/constants';
import { motion } from 'framer-motion';
import { initAudio, playClick } from '../utils/audio';

interface Props {
  onPlay: () => void;
  onShop: () => void;
}

export const MenuScreen: React.FC<Props> = ({ onPlay, onShop }) => {
  const { bestScore, controlMode, setControlMode, equippedThemeId, muted, setMuted } = useMetaStore();

  const activeTheme = AVAILABLE_THEMES.find(t => t.id === equippedThemeId) || AVAILABLE_THEMES[0];

  const toggleControlMode = () => {
    playClick();
    setControlMode(controlMode === 'keyboard' ? 'touch' : 'keyboard');
  };

  const handlePlay = () => { initAudio(); playClick(); onPlay(); };
  const handleShop = () => { initAudio(); playClick(); onShop(); };
  const handleMute = () => { initAudio(); playClick(); setMuted(!muted); };

  // Keyboard navigation — always active regardless of controlMode
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handlePlay();
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
      {/* Title — upper third, left-aligned, owns the space */}
      <div className="pt-16">
        <h1 className="text-7xl sm:text-8xl font-black leading-none">
          ASCEND
        </h1>
        {/* Short accent rule beneath title */}
        <div
          className="mt-5 h-0.5 w-16"
          style={{ backgroundColor: activeTheme.accentColor }}
        />
      </div>

      {/* Push content to the bottom half */}
      <div className="flex-1" />

      {/* Meta strip — best score + control mode toggle */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
      >
        <div className="w-full h-px mb-4" style={{ backgroundColor: activeTheme.foregroundColor }} />
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black tracking-widest" style={{ opacity: 0.45 }}>BEST</span>
            <span className="text-2xl font-black tabular-nums">{bestScore}</span>
          </div>
          {/* Control mode as a text toggle button */}
          <motion.button
            onClick={toggleControlMode}
            className="text-xs font-black tracking-widest px-3 py-1.5 rounded-lg"
            style={{
              backgroundColor: activeTheme.foregroundColor,
              color: activeTheme.textColor,
              opacity: 0.8,
            }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            {controlMode.toUpperCase()}
          </motion.button>
        </div>
        <div className="w-full h-px mb-6" style={{ backgroundColor: activeTheme.foregroundColor }} />
      </motion.div>

      {/* Action buttons + mute */}
      <motion.div
        className="flex flex-col gap-3 pb-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.45, ease: 'easeOut' }}
      >
        <motion.button
          onClick={handlePlay}
          className="flex items-center justify-center w-full py-5 rounded-xl text-xl font-black tracking-wide"
          style={{ backgroundColor: activeTheme.accentColor, color: activeTheme.backgroundColor }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <Play className="w-5 h-5 mr-3 fill-current" />
          PLAY
          {controlMode === 'keyboard' && (
            <kbd
              className="ml-2 px-1.5 py-0.5 text-xs font-black rounded scale-90"
              style={{ backgroundColor: activeTheme.backgroundColor, opacity: 0.35, color: activeTheme.textColor }}
            >
              ENTER
            </kbd>
          )}
        </motion.button>

        <motion.button
          onClick={handleShop}
          className="flex items-center justify-center w-full py-5 rounded-xl text-xl font-black tracking-wide"
          style={{ backgroundColor: activeTheme.foregroundColor, color: activeTheme.textColor }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <ShoppingBag className="w-5 h-5 mr-3" />
          LOADOUT
        </motion.button>

        {/* Mute — tertiary action, left-aligned below buttons */}
        <motion.button
          onClick={handleMute}
          className="flex items-center gap-2 pt-1 self-start"
          style={{ color: activeTheme.textColor, opacity: 0.45 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span className="text-xs font-black tracking-widest">
            {muted ? 'MUTED' : 'SOUND ON'}
          </span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
