import React from 'react';
import { useMetaStore } from '../store/metaStore';
import { ChevronLeft, Check, Lock } from 'lucide-react';
import { AVAILABLE_SKINS } from '../game/constants';

interface Props {
  onBack: () => void;
}

export const ShopScreen: React.FC<Props> = ({ onBack }) => {
  const { coins, unlockedSkinIds, equippedSkinId, equipSkin, unlockSkin } = useMetaStore();

  return (
    <div className="absolute inset-0 flex flex-col bg-white text-gray-900">
      <div className="flex items-center justify-between p-6">
        <button
          onClick={onBack}
          className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-xl font-black">SHOP</div>
        <div className="flex items-center font-bold text-amber-500 bg-amber-50 px-4 py-2 rounded-full">
          <span className="mr-1">{coins}</span>
          <span>C</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pt-0 space-y-4">
        {AVAILABLE_SKINS.map((skin) => {
          const isUnlocked = unlockedSkinIds.includes(skin.id);
          const isEquipped = equippedSkinId === skin.id;
          const canAfford = coins >= skin.cost;

          return (
            <div
              key={skin.id}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                isEquipped ? 'border-gray-900 bg-gray-50' : 'border-gray-100 bg-white'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className="w-12 h-12 rounded-lg transform rotate-45"
                  style={{ backgroundColor: skin.color }}
                />
                <div>
                  <div className="font-bold text-lg">{skin.name}</div>
                  {!isUnlocked && (
                    <div className="text-amber-500 font-semibold text-sm">
                      {skin.cost} C
                    </div>
                  )}
                </div>
              </div>

              {isEquipped ? (
                <div className="flex items-center text-gray-900 font-bold bg-gray-200 px-4 py-2 rounded-full text-sm">
                  <Check className="w-4 h-4 mr-1" /> EQUIPPED
                </div>
              ) : isUnlocked ? (
                <button
                  onClick={() => equipSkin(skin.id)}
                  className="bg-gray-900 text-white px-6 py-2 rounded-full font-bold text-sm active:scale-95 transition-transform"
                >
                  EQUIP
                </button>
              ) : (
                <button
                  onClick={() => canAfford && unlockSkin(skin.id, skin.cost)}
                  disabled={!canAfford}
                  className={`flex items-center px-6 py-2 rounded-full font-bold text-sm transition-transform ${
                    canAfford
                      ? 'bg-amber-500 text-white active:scale-95'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {!canAfford && <Lock className="w-4 h-4 mr-1" />}
                  UNLOCK
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
