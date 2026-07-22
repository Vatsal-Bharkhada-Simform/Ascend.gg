import { describe, it, expect } from 'vitest';
import { handleWallCollision } from './physics';
import { BOUNCE_DAMPING, DIAMOND_RADIUS } from './constants';
import type { DiamondState } from '../types/game';

describe('Physics Engine', () => {
  const playAreaLeft = 50;
  const playAreaRight = 450;

  it('bounces off the left wall correctly', () => {
    const diamond: DiamondState = {
      position: { x: playAreaLeft + DIAMOND_RADIUS - 5, y: 100 }, // Overlaps left wall by 5px
      velocity: { x: -100, y: 0 } // Moving left
    };

    handleWallCollision(diamond, playAreaLeft, playAreaRight);

    // Should clamp position to radius from left boundary
    expect(diamond.position.x).toBe(playAreaLeft + DIAMOND_RADIUS);
    // Should reverse and damp velocity
    expect(diamond.velocity.x).toBe(100 * BOUNCE_DAMPING);
  });

  it('bounces off the right wall correctly', () => {
    const diamond: DiamondState = {
      position: { x: playAreaRight - DIAMOND_RADIUS + 5, y: 100 }, // Overlaps right wall by 5px
      velocity: { x: 100, y: 0 } // Moving right
    };

    handleWallCollision(diamond, playAreaLeft, playAreaRight);

    // Should clamp position to right edge - radius
    expect(diamond.position.x).toBe(playAreaRight - DIAMOND_RADIUS);
    // Should reverse and damp velocity
    expect(diamond.velocity.x).toBe(-100 * BOUNCE_DAMPING);
  });

  it('does nothing if not hitting a wall', () => {
    const diamond: DiamondState = {
      position: { x: 250, y: 100 },
      velocity: { x: 100, y: 0 }
    };

    handleWallCollision(diamond, playAreaLeft, playAreaRight);

    expect(diamond.position.x).toBe(250);
    expect(diamond.velocity.x).toBe(100);
  });
});
