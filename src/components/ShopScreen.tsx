import React, { useState } from 'react';
import { useMetaStore } from '../store/metaStore';
import { ChevronLeft, Check, Lock } from 'lucide-react';
import { AVAILABLE_SKINS, AVAILABLE_THEMES } from '../game/constants';
import { motion } from 'framer-motion';
import { initAudio, playClick } from '../utils/audio';

interface Props {
  onBack: () => void;
}

export const ShopScreen: React.FC<Props> = ({ onBack }) => {
  const {
    coins,
    unlockedSkinIds, equippedSkinId, equipSkin, unlockSkin,
    unlockedThemeIds, equippedThemeId, equipTheme, unlockTheme
  } = useMetaStore();

  const [activeTab, setActiveTab] = useState<'skins' | 'themes'>('skins');

  const activeTheme = AVAILABLE_THEMES.find(t => t.id === equippedThemeId) || AVAILABLE_THEMES[0];

  const handleBack = () => {
    initAudio();
    playClick();
    onBack();
  };

  const handleTabChange = (tab: 'skins' | 'themes') => {
    initAudio();
    playClick();
    setActiveTab(tab);
  };

  const renderSkins = () => (
    <div className="flex-1 overflow-y-auto p-6 pt-0 space-y-4 max-w-lg mx-auto w-full">
      {AVAILABLE_SKINS.map((skin) => {
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
          <div
            key={skin.id}
            className="flex items-center justify-between p-4 rounded-2xl border-2 transition-all"
            style={{
              borderColor: isEquipped ? activeTheme.accentColor : activeTheme.foregroundColor,
              backgroundColor: isEquipped ? activeTheme.foregroundColor : 'transparent'
            }}
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
              <button
                onClick={handleSkinAction}
                className="px-6 py-2 rounded-full font-bold text-sm active:scale-95 transition-transform"
                style={{ backgroundColor: activeTheme.textColor, color: activeTheme.backgroundColor }}
              >
                EQUIP
              </button>
            ) : (
              <button
                onClick={handleSkinAction}
                disabled={!canAfford}
                className="flex items-center px-6 py-2 rounded-full font-bold text-sm transition-transform"
                style={{
                  backgroundColor: canAfford ? activeTheme.accentColor : activeTheme.foregroundColor,
                  color: canAfford ? activeTheme.backgroundColor : activeTheme.textColor,
                  opacity: canAfford ? 1 : 0.5,
                  transform: canAfford ? 'scale(1)' : 'none',
                  cursor: canAfford ? 'pointer' : 'not-allowed'
                }}
              >
                {!canAfford && <Lock className="w-4 h-4 mr-1" />}
                UNLOCK
              </button>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderThemes = () => (
    <div className="flex-1 overflow-y-auto p-6 pt-0 space-y-4 max-w-lg mx-auto w-full">
      {AVAILABLE_THEMES.map((theme) => {
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
          <div
            key={theme.id}
            className="flex items-center justify-between p-4 rounded-2xl border-2 transition-all"
            style={{
              borderColor: isEquipped ? activeTheme.accentColor : activeTheme.foregroundColor,
              backgroundColor: isEquipped ? activeTheme.foregroundColor : 'transparent'
            }}
          >
            <div className="flex items-center space-x-4">
              <div
                className="w-12 h-12 rounded-lg border-2 flex overflow-hidden"
                style={{ backgroundColor: theme.backgroundColor, borderColor: activeTheme.textColor }}
              >
                {theme.gateColors.slice(0, 3).map((c, i) => (
                  <div key={i} className="flex-1 h-full" style={{ backgroundColor: c, opacity: 0.8 }} />
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
              <button
                onClick={handleThemeAction}
                className="px-6 py-2 rounded-full font-bold text-sm active:scale-95 transition-transform"
                style={{ backgroundColor: activeTheme.textColor, color: activeTheme.backgroundColor }}
              >
                EQUIP
              </button>
            ) : (
              <button
                onClick={handleThemeAction}
                disabled={!canAfford}
                className="flex items-center px-6 py-2 rounded-full font-bold text-sm transition-transform"
                style={{
                  backgroundColor: canAfford ? activeTheme.accentColor : activeTheme.foregroundColor,
                  color: canAfford ? activeTheme.backgroundColor : activeTheme.textColor,
                  opacity: canAfford ? 1 : 0.5,
                  transform: canAfford ? 'scale(1)' : 'none',
                  cursor: canAfford ? 'pointer' : 'not-allowed'
                }}
              >
                {!canAfford && <Lock className="w-4 h-4 mr-1" />}
                UNLOCK
              </button>
            )}
          </div>
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
      className="absolute inset-0 flex flex-col"
    >
      <div className="relative flex items-center justify-between p-6 pb-4">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 rounded-full transition-colors active:scale-95 justify-self-start"
          style={{ backgroundColor: activeTheme.foregroundColor, color: activeTheme.textColor }}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 text-xl font-black">SHOP</div>
        <div
          className="flex items-center font-bold px-4 py-2 rounded-full justify-self-end"
          style={{ color: activeTheme.accentColor, backgroundColor: activeTheme.foregroundColor }}
        >
          <span className="mr-1">{coins}</span>
          <span>C</span>
        </div>
      </div>

      <div className="flex px-6 mb-4 max-w-lg mx-auto w-full">
        <div className="flex p-1 rounded-xl w-full" style={{ backgroundColor: activeTheme.foregroundColor }}>
          <button
            onClick={() => handleTabChange('skins')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'skins' ? 'shadow-sm' : 'opacity-70'}`}
            style={{
              backgroundColor: activeTab === 'skins' ? activeTheme.backgroundColor : 'transparent',
              color: activeTheme.textColor
            }}
          >
            SKINS
          </button>
          <button
            onClick={() => handleTabChange('themes')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'themes' ? 'shadow-sm' : 'opacity-70'}`}
            style={{
              backgroundColor: activeTab === 'themes' ? activeTheme.backgroundColor : 'transparent',
              color: activeTheme.textColor
            }}
          >
            THEMES
          </button>
        </div>
      </div>

      {activeTab === 'skins' ? renderSkins() : renderThemes()}
    </motion.div>
  );
};
