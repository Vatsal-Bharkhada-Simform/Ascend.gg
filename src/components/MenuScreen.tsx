import React from 'react';
import { useMetaStore } from '../store/metaStore';
import { Play, ShoppingBag, Volume2, VolumeX, Keyboard, Touchpad } from 'lucide-react';
import { AVAILABLE_THEMES } from '../game/constants';
import { motion, type Variants } from 'framer-motion';
import { initAudio, playClick } from '../utils/audio';

interface Props {
  onPlay: () => void;
  onShop: () => void;
}

// Stagger container: children animate in one by one
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

// Each direct child slides up and fades in
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

// Bottom-right utility buttons slide in from right
const sideContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.45 },
  },
};

const sideItemVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export const MenuScreen: React.FC<Props> = ({ onPlay, onShop }) => {
  const { bestScore, controlMode, setControlMode, equippedThemeId, muted, setMuted } = useMetaStore();

  const activeTheme = AVAILABLE_THEMES.find(t => t.id === equippedThemeId) || AVAILABLE_THEMES[0];

  const toggleControlMode = () => {
    playClick();
    setControlMode(controlMode === 'keyboard' ? 'touch' : 'keyboard');
  };

  const handlePlay = () => {
    initAudio();
    playClick();
    onPlay();
  };

  const handleShop = () => {
    initAudio();
    playClick();
    onShop();
  };

  const handleMute = () => {
    initAudio();
    playClick();
    setMuted(!muted);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 flex flex-col items-center justify-center"
    >
      {/* Main content column with stagger */}
      <motion.div
        className="flex flex-col items-center space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title: stagger wrapper + inner idle pulse */}
        <motion.div variants={itemVariants}>
          <motion.h1
            className="text-6xl font-black tracking-tight"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            ASCEND
          </motion.h1>
        </motion.div>

        {/* Best score */}
        <motion.div
          className="text-lg font-medium"
          style={{ opacity: 0.7 }}
          variants={itemVariants}
        >
          BEST SCORE <span className="font-bold ml-2" style={{ opacity: 1 }}>{bestScore}</span>
        </motion.div>

        {/* Button group */}
        <motion.div
          className="flex flex-col space-y-4 w-64"
          variants={itemVariants}
        >
          <motion.button
            onClick={handlePlay}
            className="flex items-center justify-center w-full py-4 rounded-2xl text-xl font-bold"
            style={{ backgroundColor: activeTheme.accentColor, color: activeTheme.backgroundColor }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Play className="w-6 h-6 mr-2 fill-current" />
            PLAY
          </motion.button>

          <motion.button
            onClick={handleShop}
            className="flex items-center justify-center w-full py-4 rounded-2xl text-xl font-bold"
            style={{ backgroundColor: activeTheme.foregroundColor, color: activeTheme.textColor }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <ShoppingBag className="w-6 h-6 mr-2" />
            SHOP
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Bottom-right utility buttons — slide in from right */}
      <motion.div
        className="absolute bottom-8 right-8 flex flex-col space-y-4"
        variants={sideContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.button
          onClick={toggleControlMode}
          className="p-3 rounded-full flex items-center justify-center"
          title={`Switch to ${controlMode === 'keyboard' ? 'Touch' : 'Keyboard'} Controls`}
          style={{ backgroundColor: activeTheme.foregroundColor, color: activeTheme.textColor }}
          variants={sideItemVariants}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          {controlMode === 'keyboard' ? (
            <Keyboard className="w-6 h-6" />
          ) : (
            <Touchpad className="w-6 h-6" />
          )}
        </motion.button>

        <motion.button
          onClick={handleMute}
          className="p-3 rounded-full"
          style={{ backgroundColor: activeTheme.foregroundColor, color: activeTheme.textColor }}
          variants={sideItemVariants}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          {muted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
