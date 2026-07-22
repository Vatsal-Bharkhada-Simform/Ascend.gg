import type { RunState, DiamondState } from '../types/game';
import { GRAVITY, THRUST_X, THRUST_Y, BOUNCE_DAMPING, DIAMOND_RADIUS } from './constants';

export const updatePhysics = (state: RunState, dt: number) => {
  const { diamond } = state;

  // Apply gravity to vertical velocity
  diamond.velocity.y += GRAVITY * dt;

  // Integrate velocity into position
  diamond.position.x += diamond.velocity.x * dt;
  diamond.position.y += diamond.velocity.y * dt;
};

export const applyThrust = (diamond: DiamondState, side: 'left' | 'right') => {
  diamond.velocity.x = side === 'left' ? -THRUST_X : THRUST_X;
  diamond.velocity.y = -THRUST_Y;
};

export const handleWallCollision = (diamond: DiamondState, canvasWidth: number) => {
  if (diamond.position.x < DIAMOND_RADIUS) {
    diamond.position.x = DIAMOND_RADIUS;
    diamond.velocity.x = -diamond.velocity.x * BOUNCE_DAMPING;
  }
  
  if (diamond.position.x > canvasWidth - DIAMOND_RADIUS) {
    diamond.position.x = canvasWidth - DIAMOND_RADIUS;
    diamond.velocity.x = -diamond.velocity.x * BOUNCE_DAMPING;
  }
};
