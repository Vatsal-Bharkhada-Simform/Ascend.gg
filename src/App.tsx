import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MenuScreen } from './components/MenuScreen';
import { GameCanvas } from './components/GameCanvas';
import { GameOverScreen } from './components/GameOverScreen';
import { ShopScreen } from './components/ShopScreen';
import { useMetaStore } from './store/metaStore';
import { AVAILABLE_THEMES } from './game/constants';
import { setMuted } from './utils/audio';

type Screen = 'menu' | 'game' | 'gameOver' | 'shop';

function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [lastScore, setLastScore] = useState(0);
  const { setBestScore, addCoins, equippedThemeId, muted } = useMetaStore();

  const activeTheme = AVAILABLE_THEMES.find(t => t.id === equippedThemeId) || AVAILABLE_THEMES[0];

  useEffect(() => {
    setMuted(muted);
  }, [muted]);

  const handleGameOver = (score: number) => {
    setLastScore(score);
    setBestScore(score);
    // Simple coin logic: 1 coin per 10 points for now
    if (score > 0) {
      addCoins(Math.floor(score / 10));
    }
    setScreen('gameOver');
  };

  return (
    <div 
      className="fixed inset-0 w-full h-full overflow-hidden select-none touch-none transition-colors duration-300"
      style={{ backgroundColor: activeTheme.backgroundColor, color: activeTheme.textColor }}
    >
      <AnimatePresence mode="wait">
        {screen === 'menu' && (
          <MenuScreen 
            key="menu"
            onPlay={() => setScreen('game')} 
            onShop={() => setScreen('shop')} 
          />
        )}
        
        {screen === 'game' && (
          <GameCanvas 
            key="game"
            onGameOver={handleGameOver} 
          />
        )}
        
        {screen === 'gameOver' && (
          <GameOverScreen
            key="gameOver"
            score={lastScore}
            coinsEarned={Math.floor(lastScore / 10)}
            onRetry={() => setScreen('game')}
            onHome={() => setScreen('menu')}
            onShop={() => setScreen('shop')}
          />
        )}
        
        {screen === 'shop' && (
          <ShopScreen 
            key="shop"
            onBack={() => setScreen('menu')} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
