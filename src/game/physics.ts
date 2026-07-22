import type { RunState, DiamondState } from '../types/game';
import { GRAVITY, THRUST_X, THRUST_Y, BOUNCE_DAMPING, DIAMOND_RADIUS } from './constants';

export const updatePhysics = (state: RunState, dt: number): number => {
  const { diamond } = state;
  const previousY = diamond.position.y;

  // Apply gravity to vertical velocity
  diamond.velocity.y += GRAVITY * dt;

  // Integrate velocity into position
  diamond.position.x += diamond.velocity.x * dt;
  diamond.position.y += diamond.velocity.y * dt;
  
  return previousY;
};

export const applyThrust = (diamond: DiamondState, side: 'left' | 'right') => {
  diamond.velocity.x = side === 'left' ? -THRUST_X : THRUST_X;
  diamond.velocity.y = -THRUST_Y;
};

export const handleWallCollision = (
  diamond: DiamondState, 
  playAreaLeft: number, 
  playAreaRight: number
) => {
  if (diamond.position.x < playAreaLeft + DIAMOND_RADIUS) {
    diamond.position.x = playAreaLeft + DIAMOND_RADIUS;
    diamond.velocity.x = -diamond.velocity.x * BOUNCE_DAMPING;
  }
  
  if (diamond.position.x > playAreaRight - DIAMOND_RADIUS) {
    diamond.position.x = playAreaRight - DIAMOND_RADIUS;
    diamond.velocity.x = -diamond.velocity.x * BOUNCE_DAMPING;
  }
};
