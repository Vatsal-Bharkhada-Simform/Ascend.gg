import React, { useState, useEffect, useRef } from 'react';
import { useMetaStore } from '../store/metaStore';
import { ChevronLeft, Check } from 'lucide-react';
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
    equippedSkinId, equipSkin,
    equippedThemeId, equipTheme,
    controlMode,
  } = useMetaStore();

  const [activeTab, setActiveTab] = useState<'skins' | 'themes'>('skins');
  // +1 = moving right (skins → themes), -1 = moving left (themes → skins)
  const [slideDirection, setSlideDirection] = useState(1);
  // Keyboard arrow-nav: index of focused card (-1 = none)
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const activeTheme = AVAILABLE_THEMES.find(t => t.id === equippedThemeId) || AVAILABLE_THEMES[0];

  const activeList = activeTab === 'skins' ? AVAILABLE_SKINS : AVAILABLE_THEMES;
  const listLength = activeList.length;

  // Ref for the scrollable container so we can scroll focused item into view
  const scrollRef = useRef<HTMLDivElement>(null);

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
    setFocusedIndex(-1); // reset focus on tab switch
  };

  // Perform the equip/unlock action for the focused item
  const activateFocused = () => {
    if (focusedIndex < 0) return;
    initAudio();
    playClick();
    if (activeTab === 'skins') {
      const skin = AVAILABLE_SKINS[focusedIndex];
      if (skin) equipSkin(skin.id);
    } else {
      const theme = AVAILABLE_THEMES[focusedIndex];
      if (theme) equipTheme(theme.id);
    }
  };

  // Keyboard navigation — always active
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          handleBack();
          break;
        case '1':
          handleTabChange('skins');
          break;
        case '2':
          handleTabChange('themes');
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => Math.min(prev + 1, listLength - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          activateFocused();
          break;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, focusedIndex, listLength]);

  // Scroll focused card into view
  useEffect(() => {
    if (focusedIndex < 0 || !scrollRef.current) return;
    const cards = scrollRef.current.querySelectorAll('[data-card]');
    cards[focusedIndex]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [focusedIndex]);

  // Reset focus when tab changes
  useEffect(() => {
    setFocusedIndex(-1);
  }, [activeTab]);

  const renderSkins = () => (
    <div className="space-y-3 sm:space-y-4 p-4 sm:p-6 max-w-lg mx-auto w-full">
      {AVAILABLE_SKINS.map((skin, i) => {
        const isEquipped = equippedSkinId === skin.id;
        const isFocused = focusedIndex === i;

        const handleSkinAction = () => {
          initAudio();
          playClick();
          equipSkin(skin.id);
        };

        return (
          <motion.div
            key={skin.id}
            data-card
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            onClick={handleSkinAction}
            className="flex items-center justify-between p-3 sm:p-4 rounded-2xl border-2 transition-colors cursor-pointer"
            style={{
              borderColor: isFocused
                ? activeTheme.accentColor
                : isEquipped
                  ? activeTheme.accentColor
                  : activeTheme.foregroundColor,
              backgroundColor: isEquipped ? activeTheme.foregroundColor : 'transparent',
              outline: isFocused ? `2px solid ${activeTheme.accentColor}` : 'none',
              outlineOffset: '2px',
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg transform rotate-45"
                style={{ backgroundColor: skin.color, boxShadow: skin.glow ? `0 0 15px ${skin.color}` : 'none' }}
              />
              <div>
                <div className="font-bold text-lg">{skin.name}</div>
              </div>
            </div>

            {isEquipped && (
              <div
                className="flex items-center justify-center w-10 h-10 rounded-full"
                style={{ backgroundColor: activeTheme.accentColor, color: activeTheme.backgroundColor }}
              >
                <Check className="w-5 h-5" />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );

  const renderThemes = () => (
    <div className="space-y-3 sm:space-y-4 p-4 sm:p-6 max-w-lg mx-auto w-full">
      {AVAILABLE_THEMES.map((theme, i) => {
        const isEquipped = equippedThemeId === theme.id;
        const isFocused = focusedIndex === i;

        const handleThemeAction = () => {
          initAudio();
          playClick();
          equipTheme(theme.id);
        };

        return (
          <motion.div
            key={theme.id}
            data-card
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            onClick={handleThemeAction}
            className="flex items-center justify-between p-3 sm:p-4 rounded-2xl border-2 transition-colors cursor-pointer"
            style={{
              borderColor: isFocused
                ? activeTheme.accentColor
                : isEquipped
                  ? activeTheme.accentColor
                  : activeTheme.foregroundColor,
              backgroundColor: isEquipped ? activeTheme.foregroundColor : 'transparent',
              outline: isFocused ? `2px solid ${activeTheme.accentColor}` : 'none',
              outlineOffset: '2px',
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 flex overflow-hidden shrink-0"
                style={{ backgroundColor: theme.backgroundColor, borderColor: activeTheme.textColor }}
              >
                {theme.gateColors.slice(0, 3).map((c, idx) => (
                  <div key={idx} className="flex-1 h-full" style={{ backgroundColor: c, opacity: 0.8 }} />
                ))}
              </div>
              <div>
                <div className="font-bold text-lg">{theme.name}</div>
              </div>
            </div>

            {isEquipped && (
              <div
                className="flex items-center justify-center w-10 h-10 rounded-full shrink-0"
                style={{ backgroundColor: activeTheme.accentColor, color: activeTheme.backgroundColor }}
              >
                <Check className="w-5 h-5" />
              </div>
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
          {controlMode === 'keyboard' && (
            <kbd
              className="ml-1 px-1 py-0.5 text-xs font-black rounded"
              style={{ backgroundColor: activeTheme.backgroundColor, color: activeTheme.textColor, opacity: 0.4 }}
            >
              Esc
            </kbd>
          )}
        </motion.button>

        <motion.div
          className="absolute left-1/2 -translate-x-1/2 text-xl font-black"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.05 }}
        >
          LOADOUT
        </motion.div>
      </div>

      {/* Tab switcher — bare text labels with sliding accent underline */}
      <motion.div
        className="flex px-6 mb-1 max-w-lg mx-auto w-full shrink-0 border-b"
        style={{ borderColor: activeTheme.foregroundColor }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut', delay: 0.15 }}
      >
        {(['skins', 'themes'] as const).map((tab, tabIdx) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className="relative flex-1 py-3 text-sm font-black tracking-widest transition-opacity duration-150 flex items-center justify-center gap-2"
            style={{
              color: activeTheme.textColor,
              opacity: activeTab === tab ? 1 : 0.4,
            }}
          >
            {tab.toUpperCase()}
            {/* Key badge for tab switch */}
            {controlMode === 'keyboard' && (
              <kbd
                className="px-1 py-0.5 text-xs font-black rounded"
                style={{
                  backgroundColor: activeTheme.foregroundColor,
                  color: activeTheme.textColor,
                  opacity: activeTab === tab ? 0.6 : 0.35,
                }}
              >
                {tabIdx + 1}
              </kbd>
            )}
            {/* Accent underline slides between tabs */}
            {activeTab === tab && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: activeTheme.accentColor }}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        ))}
      </motion.div>

      {/* Keyboard nav hint — only shown when keyboard mode and no focus yet */}
      {controlMode === 'keyboard' && focusedIndex < 0 && (
        <div
          className="text-center text-xs font-black tracking-widest py-1 shrink-0"
          style={{ opacity: 0.3, color: activeTheme.textColor }}
        >
          ↑ ↓ TO SELECT · ↵ TO EQUIP
        </div>
      )}

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
            ref={scrollRef}
          >
            {activeTab === 'skins' ? renderSkins() : renderThemes()}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
