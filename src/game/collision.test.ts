import { describe, it, expect } from 'vitest';
import { checkGateCollision, checkGateClear } from './collision';
import type { DiamondState, Gate } from '../types/game';
import { GATE_HEIGHT } from './constants';

describe('Collision Engine', () => {
  const gate: Gate = {
    id: 1,
    y: 100,
    gapStart: 200,
    gapEnd: 300,
    cleared: false
  };

  describe('checkGateCollision', () => {
    it('returns false if diamond is completely above or below the gate', () => {
      const diamond: DiamondState = {
        position: { x: 50, y: 50 },
        velocity: { x: 0, y: 0 }
      };
      
      // Moving from 40 to 50, both above gate (y=100)
      expect(checkGateCollision(diamond, 40, gate)).toBe(false);

      // Moving from 150 to 140, both below gate
      diamond.position.y = 140;
      expect(checkGateCollision(diamond, 150, gate)).toBe(false);
    });

    it('returns false if diamond passes perfectly through the gap', () => {
      const diamond: DiamondState = {
        position: { x: 250, y: 100 + GATE_HEIGHT / 2 },
        velocity: { x: 0, y: 0 }
      };

      // Gap is [200, 300], diamond x is 250 with radius 12.
      // So leftEdge=238, rightEdge=262, perfectly inside.
      expect(checkGateCollision(diamond, 90, gate)).toBe(false);
    });

    it('returns true if diamond clips the left bar', () => {
      const diamond: DiamondState = {
        position: { x: 200, y: 100 + GATE_HEIGHT / 2 }, // edge is exactly at gapStart
        velocity: { x: 0, y: 0 }
      };

      // x=200, radius=12 -> leftEdge=188. This is < gapStart (200), so it hits the bar.
      expect(checkGateCollision(diamond, 90, gate)).toBe(true);
    });

    it('returns true if diamond clips the right bar', () => {
      const diamond: DiamondState = {
        position: { x: 300, y: 100 + GATE_HEIGHT / 2 },
        velocity: { x: 0, y: 0 }
      };

      // rightEdge = 312 > gapEnd (300) -> hit!
      expect(checkGateCollision(diamond, 90, gate)).toBe(true);
    });
  });

  describe('checkGateClear', () => {
    it('returns true when crossing upwards through the gap', () => {
      const diamond: DiamondState = {
        position: { x: 250, y: 90 }, // now above the gate
        velocity: { x: 0, y: 0 }
      };

      // Previous was below the gate (y >= 100)
      expect(checkGateClear(diamond, 110, gate)).toBe(true);
    });

    it('returns false if already cleared', () => {
      const clearedGate = { ...gate, cleared: true };
      const diamond: DiamondState = {
        position: { x: 250, y: 90 },
        velocity: { x: 0, y: 0 }
      };
      
      expect(checkGateClear(diamond, 110, clearedGate)).toBe(false);
    });

    it('returns false if crossing downwards (falling)', () => {
      const diamond: DiamondState = {
        position: { x: 250, y: 110 }, // fell below
        velocity: { x: 0, y: 0 }
      };

      // previous was above
      expect(checkGateClear(diamond, 90, gate)).toBe(false);
    });
  });
});
