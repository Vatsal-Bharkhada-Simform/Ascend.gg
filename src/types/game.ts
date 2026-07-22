export interface Vector2 {
  x: number;
  y: number;
}

export interface DiamondState {
  position: Vector2;
  velocity: Vector2;
}

export interface Gate {
  id: number;
  y: number;
  gapStart: number;
  gapEnd: number;
  cleared: boolean;
  colorIndex: number;
}

export interface Hazard {
  id: number;
  x: number;
  y: number;
  size: number;
  colorIndex: number;
}

export interface Particle {
  position: Vector2;
  velocity: Vector2;
  color: string;
  life: number; // 1 to 0
  size: number;
}

export interface RunState {
  diamond: DiamondState;
  gates: Gate[];
  hazards: Hazard[];
  particles: Particle[];
  cameraY: number;
  score: number;
  multiplier: number;
  comboTimer: number; // 0 to 1
  deathTime?: number;
}

export interface Skin {
  id: string;
  name: string;
  cost: number;
  colorway?: string; // left for backwards compatibility if needed
  color?: string; // standardizing with constants
  glow?: boolean;
}

export interface Theme {
  id: string;
  name: string;
  cost: number;
  backgroundColor: string;
  outOfBoundsColor: string;
  gateColors: string[];
  foregroundColor: string;
  accentColor: string;
  textColor: string;
}

export interface SaveData {
  bestScore: number;
  coins: number;
  unlockedSkinIds: string[];
  equippedSkinId: string;
  unlockedThemeIds: string[];
  equippedThemeId: string;
  controlMode: 'touch' | 'keyboard';
  muted: boolean;
}
