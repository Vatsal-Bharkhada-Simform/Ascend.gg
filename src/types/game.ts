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
}

export interface Hazard {
  id: number;
  x: number;
  y: number;
  size: number;
  colorIndex: number;
}

export interface RunState {
  diamond: DiamondState;
  gates: Gate[];
  hazards: Hazard[];
  cameraY: number;
  score: number;
  multiplier: number;
  comboTimer: number;
}

export interface Skin {
  id: string;
  name: string;
  cost: number;
  colorway: string;
}

export interface SaveData {
  bestScore: number;
  coins: number;
  unlockedSkinIds: string[];
  equippedSkinId: string;
  controlMode: 'touch' | 'keyboard';
}
