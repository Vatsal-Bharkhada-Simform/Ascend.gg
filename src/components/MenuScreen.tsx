import React from 'react';
import { useMetaStore } from '../store/metaStore';
import { Play, ShoppingBag, Volume2, VolumeX, Keyboard, Touchpad } from 'lucide-react';

interface Props {
  onPlay: () => void;
  onShop: () => void;
}

export const MenuScreen: React.FC<Props> = ({ onPlay, onShop }) => {
  const { bestScore, controlMode, setControlMode } = useMetaStore();
  const [muted, setMuted] = React.useState(false);

  const toggleControlMode = () => {
    setControlMode(controlMode === 'keyboard' ? 'touch' : 'keyboard');
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white text-gray-900">
      <div className="flex flex-col items-center space-y-8">
        <h1 className="text-6xl font-black tracking-tighter">ASCEND</h1>
        
        <div className="text-lg font-medium text-gray-500">
          BEST SCORE <span className="text-gray-900 font-bold ml-2">{bestScore}</span>
        </div>

        <div className="flex flex-col space-y-4 w-64">
          <button
            onClick={onPlay}
            className="flex items-center justify-center w-full py-4 bg-gray-900 text-white rounded-2xl text-xl font-bold hover:bg-gray-800 transition-colors active:scale-95"
          >
            <Play className="w-6 h-6 mr-2 fill-current" />
            PLAY
          </button>
          
          <button
            onClick={onShop}
            className="flex items-center justify-center w-full py-4 bg-gray-100 text-gray-900 rounded-2xl text-xl font-bold hover:bg-gray-200 transition-colors active:scale-95"
          >
            <ShoppingBag className="w-6 h-6 mr-2" />
            SHOP
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 flex flex-col space-y-4">
        <button
          onClick={toggleControlMode}
          className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center"
          title={`Switch to ${controlMode === 'keyboard' ? 'Touch' : 'Keyboard'} Controls`}
        >
          {controlMode === 'keyboard' ? (
            <Keyboard className="w-6 h-6" />
          ) : (
            <Touchpad className="w-6 h-6" />
          )}
        </button>

        <button
          onClick={() => setMuted(!muted)}
          className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        >
          {muted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
};
