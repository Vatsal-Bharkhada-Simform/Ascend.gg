import React from 'react';
import { useMetaStore } from '../store/metaStore';
import { Play, ShoppingBag, Volume2, VolumeX, Keyboard, Touchpad } from 'lucide-react';
import { AVAILABLE_THEMES } from '../game/constants';

interface Props {
  onPlay: () => void;
  onShop: () => void;
}

export const MenuScreen: React.FC<Props> = ({ onPlay, onShop }) => {
  const { bestScore, controlMode, setControlMode, equippedThemeId } = useMetaStore();
  const [muted, setMuted] = React.useState(false);

  const activeTheme = AVAILABLE_THEMES.find(t => t.id === equippedThemeId) || AVAILABLE_THEMES[0];

  const toggleControlMode = () => {
    setControlMode(controlMode === 'keyboard' ? 'touch' : 'keyboard');
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-8">
        <h1 className="text-6xl font-black tracking-tighter">ASCEND</h1>
        
        <div className="text-lg font-medium" style={{ opacity: 0.7 }}>
          BEST SCORE <span className="font-bold ml-2" style={{ opacity: 1 }}>{bestScore}</span>
        </div>

        <div className="flex flex-col space-y-4 w-64">
          <button
            onClick={onPlay}
            className="flex items-center justify-center w-full py-4 rounded-2xl text-xl font-bold transition-colors active:scale-95"
            style={{ backgroundColor: activeTheme.accentColor, color: activeTheme.backgroundColor }}
          >
            <Play className="w-6 h-6 mr-2 fill-current" />
            PLAY
          </button>
          
          <button
            onClick={onShop}
            className="flex items-center justify-center w-full py-4 rounded-2xl text-xl font-bold transition-colors active:scale-95"
            style={{ backgroundColor: activeTheme.foregroundColor, color: activeTheme.textColor }}
          >
            <ShoppingBag className="w-6 h-6 mr-2" />
            SHOP
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 flex flex-col space-y-4">
        <button
          onClick={toggleControlMode}
          className="p-3 rounded-full transition-colors flex items-center justify-center"
          title={`Switch to ${controlMode === 'keyboard' ? 'Touch' : 'Keyboard'} Controls`}
          style={{ backgroundColor: activeTheme.foregroundColor, color: activeTheme.textColor }}
        >
          {controlMode === 'keyboard' ? (
            <Keyboard className="w-6 h-6" />
          ) : (
            <Touchpad className="w-6 h-6" />
          )}
        </button>

        <button
          onClick={() => setMuted(!muted)}
          className="p-3 rounded-full transition-colors"
          style={{ backgroundColor: activeTheme.foregroundColor, color: activeTheme.textColor }}
        >
          {muted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
};
