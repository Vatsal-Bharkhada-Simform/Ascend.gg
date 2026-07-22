import React, { useState } from 'react';
import { useMetaStore } from '../store/metaStore';
import { ChevronLeft, Check, Lock } from 'lucide-react';
import { AVAILABLE_SKINS, AVAILABLE_THEMES } from '../game/constants';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { initAudio, playClick } from '../utils/audio';

interface Props {
  onBack: () => void;
}

// Card stagger — custom prop carries the list index for delay
const cardVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' as const },
  }),
  exit: { opacity: 0, x: 24, transition: { duration: 0.15 } },
};

// Horizontal slide for tab content
const tabContentVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 260 : -260,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.28, ease: 'easeOut' as const },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -260 : 260,
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' as const },
  }),
};

export const ShopScreen: React.FC<Props> = ({ onBack }) => {
  const {
    coins,
    unlockedSkinIds, equippedSkinId, equipSkin, unlockSkin,
    unlockedThemeIds, equippedThemeId, equipTheme, unlockTheme,
  } = useMetaStore();

  const [activeTab, setActiveTab] = useState<'skins' | 'themes'>('skins');
  // +1 = moving right (skins → themes), -1 = moving left (themes → skins)
  const [slideDirection, setSlideDirection] = useState(1);

  const activeTheme = AVAILABLE_THEMES.find(t => t.id === equippedThemeId) || AVAILABLE_THEMES[0];

  const handleBack = () => {
    initAudio();
    playClick();
    onBack();
  };

  const handleTabChange = (tab: 'skins' | 'themes') => {
    if (tab === activeTab) return;
    initAudio();
    playClick();
    setSlideDirection(tab === 'themes' ? 1 : -1);
    setActiveTab(tab);
  };

  const renderSkins = () => (
    <div className="space-y-4 p-6 pt-0 max-w-lg mx-auto w-full">
      {AVAILABLE_SKINS.map((skin, i) => {
        const isUnlocked = unlockedSkinIds.includes(skin.id);
        const isEquipped = equippedSkinId === skin.id;
        const canAfford = coins >= skin.cost;

        const handleSkinAction = () => {
          initAudio();
          playClick();
          if (isUnlocked) {
            equipSkin(skin.id);
          } else if (canAfford) {
            unlockSkin(skin.id, skin.cost);
          }
        };

        return (
          <motion.div
            key={skin.id}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-between p-4 rounded-2xl border-2 transition-colors"
            style={{
              borderColor: isEquipped ? activeTheme.accentColor : activeTheme.foregroundColor,
              backgroundColor: isEquipped ? activeTheme.foregroundColor : 'transparent',
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-4">
              <div
                className="w-12 h-12 rounded-lg transform rotate-45"
                style={{ backgroundColor: skin.color, boxShadow: skin.glow ? `0 0 15px ${skin.color}` : 'none' }}
              />
              <div>
                <div className="font-bold text-lg">{skin.name}</div>
                {!isUnlocked && (
                  <div className="font-semibold text-sm" style={{ color: activeTheme.accentColor }}>
                    {skin.cost} C
                  </div>
                )}
              </div>
            </div>

            {isEquipped ? (
              <div
                className="flex items-center font-bold px-4 py-2 rounded-full text-sm"
                style={{ backgroundColor: activeTheme.accentColor, color: activeTheme.backgroundColor }}
              >
                <Check className="w-4 h-4 mr-1" /> EQUIPPED
              </div>
            ) : isUnlocked ? (
              <motion.button
                onClick={handleSkinAction}
                className="px-6 py-2 rounded-full font-bold text-sm"
                style={{ backgroundColor: activeTheme.textColor, color: activeTheme.backgroundColor }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                EQUIP
              </motion.button>
            ) : (
              <motion.button
                onClick={handleSkinAction}
                disabled={!canAfford}
                className="flex items-center px-6 py-2 rounded-full font-bold text-sm"
                style={{
                  backgroundColor: canAfford ? activeTheme.accentColor : activeTheme.foregroundColor,
                  color: canAfford ? activeTheme.backgroundColor : activeTheme.textColor,
                  opacity: canAfford ? 1 : 0.5,
                  cursor: canAfford ? 'pointer' : 'not-allowed',
                }}
                whileTap={canAfford ? { scale: 0.92 } : {}}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                {!canAfford && <Lock className="w-4 h-4 mr-1" />}
                UNLOCK
              </motion.button>
            )}
          </motion.div>
        );
      })}
    </div>
  );

  const renderThemes = () => (
    <div className="space-y-4 p-6 pt-0 max-w-lg mx-auto w-full">
      {AVAILABLE_THEMES.map((theme, i) => {
        const isUnlocked = unlockedThemeIds.includes(theme.id);
        const isEquipped = equippedThemeId === theme.id;
        const canAfford = coins >= theme.cost;

        const handleThemeAction = () => {
          initAudio();
          playClick();
          if (isUnlocked) {
            equipTheme(theme.id);
          } else if (canAfford) {
            unlockTheme(theme.id, theme.cost);
          }
        };

        return (
          <motion.div
            key={theme.id}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-between p-4 rounded-2xl border-2 transition-colors"
            style={{
              borderColor: isEquipped ? activeTheme.accentColor : activeTheme.foregroundColor,
              backgroundColor: isEquipped ? activeTheme.foregroundColor : 'transparent',
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-4">
              <div
                className="w-12 h-12 rounded-lg border-2 flex overflow-hidden"
                style={{ backgroundColor: theme.backgroundColor, borderColor: activeTheme.textColor }}
              >
                {theme.gateColors.slice(0, 3).map((c, idx) => (
                  <div key={idx} className="flex-1 h-full" style={{ backgroundColor: c, opacity: 0.8 }} />
                ))}
              </div>
              <div>
                <div className="font-bold text-lg">{theme.name}</div>
                {!isUnlocked && (
                  <div className="font-semibold text-sm" style={{ color: activeTheme.accentColor }}>
                    {theme.cost} C
                  </div>
                )}
              </div>
            </div>

            {isEquipped ? (
              <div
                className="flex items-center font-bold px-4 py-2 rounded-full text-sm"
                style={{ backgroundColor: activeTheme.accentColor, color: activeTheme.backgroundColor }}
              >
                <Check className="w-4 h-4 mr-1" /> EQUIPPED
              </div>
            ) : isUnlocked ? (
              <motion.button
                onClick={handleThemeAction}
                className="px-6 py-2 rounded-full font-bold text-sm"
                style={{ backgroundColor: activeTheme.textColor, color: activeTheme.backgroundColor }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                EQUIP
              </motion.button>
            ) : (
              <motion.button
                onClick={handleThemeAction}
                disabled={!canAfford}
                className="flex items-center px-6 py-2 rounded-full font-bold text-sm"
                style={{
                  backgroundColor: canAfford ? activeTheme.accentColor : activeTheme.foregroundColor,
                  color: canAfford ? activeTheme.backgroundColor : activeTheme.textColor,
                  opacity: canAfford ? 1 : 0.5,
                  cursor: canAfford ? 'pointer' : 'not-allowed',
                }}
                whileTap={canAfford ? { scale: 0.92 } : {}}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                {!canAfford && <Lock className="w-4 h-4 mr-1" />}
                UNLOCK
              </motion.button>
            )}
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 flex flex-col overflow-hidden"
    >
      {/* Header row — each element animates independently */}
      <div className="relative flex items-center justify-between p-6 pb-4 shrink-0">
        <motion.button
          onClick={handleBack}
          className="p-2 -ml-2 rounded-full flex items-center justify-center"
          style={{ backgroundColor: activeTheme.foregroundColor, color: activeTheme.textColor }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>

        <motion.div
          className="absolute left-1/2 -translate-x-1/2 text-xl font-black"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.05 }}
        >
          SHOP
        </motion.div>

        <motion.div
          className="flex items-center font-bold px-4 py-2 rounded-full"
          style={{ color: activeTheme.accentColor, backgroundColor: activeTheme.foregroundColor }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.1 }}
        >
          <span className="mr-1">{coins}</span>
          <span>C</span>
        </motion.div>
      </div>

      {/* Tab switcher with sliding layoutId indicator */}
      <motion.div
        className="flex px-6 mb-4 max-w-lg mx-auto w-full shrink-0"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut', delay: 0.15 }}
      >
        <div className="flex p-1 rounded-xl w-full" style={{ backgroundColor: activeTheme.foregroundColor }}>
          {(['skins', 'themes'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className="relative flex-1 py-2 text-sm font-bold rounded-lg"
              style={{ color: activeTheme.textColor }}
            >
              {/* Sliding pill behind active tab */}
              {activeTab === tab && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute inset-0 rounded-lg shadow-sm"
                  style={{ backgroundColor: activeTheme.backgroundColor }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span
                className="relative z-10 transition-opacity duration-150"
                style={{ opacity: activeTab === tab ? 1 : 0.6 }}
              >
                {tab.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab content — horizontal slide on switch */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence custom={slideDirection} mode="wait">
          <motion.div
            key={activeTab}
            custom={slideDirection}
            variants={tabContentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 overflow-y-auto"
          >
            {activeTab === 'skins' ? renderSkins() : renderThemes()}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
