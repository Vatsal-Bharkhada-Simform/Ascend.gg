import { useState } from 'react';
import { MenuScreen } from './components/MenuScreen';
import { GameCanvas } from './components/GameCanvas';
import { GameOverScreen } from './components/GameOverScreen';
import { ShopScreen } from './components/ShopScreen';
import { useMetaStore } from './store/metaStore';

type Screen = 'menu' | 'game' | 'gameOver' | 'shop';

function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [lastScore, setLastScore] = useState(0);
  const { setBestScore, addCoins } = useMetaStore();

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
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-white select-none touch-none">
      {screen === 'menu' && (
        <MenuScreen 
          onPlay={() => setScreen('game')} 
          onShop={() => setScreen('shop')} 
        />
      )}
      
      {screen === 'game' && (
        <GameCanvas 
          onGameOver={handleGameOver} 
        />
      )}
      
      {screen === 'gameOver' && (
        <GameOverScreen
          score={lastScore}
          onRetry={() => setScreen('game')}
          onHome={() => setScreen('menu')}
          onShop={() => setScreen('shop')}
        />
      )}
      
      {screen === 'shop' && (
        <ShopScreen 
          onBack={() => setScreen('menu')} 
        />
      )}
    </div>
  );
}

export default App;
