import type { DiamondState, Gate, Hazard } from '../types/game';
import { DIAMOND_RADIUS, GATE_HEIGHT } from './constants';

/**
 * Swept collision check to prevent tunneling through gates.
 * Returns true if the diamond hit the solid parts of the gate during this frame.
 */
export const checkGateCollision = (
  diamond: DiamondState,
  previousY: number,
  gate: Gate
): boolean => {
  // Determine the bounding box of the diamond's vertical movement this frame
  const topEdge = Math.min(previousY, diamond.position.y) - DIAMOND_RADIUS;
  const bottomEdge = Math.max(previousY, diamond.position.y) + DIAMOND_RADIUS;

  // The gate's vertical footprint
  const gateTop = gate.y;
  const gateBottom = gate.y + GATE_HEIGHT;

  // If the sweeping bounds don't overlap the gate's Y bounds, no collision
  if (bottomEdge < gateTop || topEdge > gateBottom) {
    return false;
  }

  // Diamond overlaps the gate's Y range. Now check if it's hitting the solid bars
  // (i.e. if it is NOT completely inside the gap).
  const leftEdge = diamond.position.x - DIAMOND_RADIUS;
  const rightEdge = diamond.position.x + DIAMOND_RADIUS;

  if (leftEdge < gate.gapStart || rightEdge > gate.gapEnd) {
    return true; // Hit a bar
  }

  return false;
};

/**
 * Checks if the diamond successfully cleared the gate on this frame.
 * Only returns true on the exact frame it crosses the gate.
 */
export const checkGateClear = (
  diamond: DiamondState,
  previousY: number,
  gate: Gate
): boolean => {
  if (gate.cleared) return false;

  // Since we climb "up" (decreasing Y in world coords), crossing the gate means
  // previousY was below (greater than) the gate, and current Y is above (less than).
  // Actually, wait, world Y grows positive downwards. So climbing UP means Y is decreasing.
  // We start at Y = large positive number, and move towards Y = 0 or negative.
  // Wait, let's look at gravity: diamond.velocity.y += GRAVITY * dt;
  // Gravity pulls DOWN (positive Y).
  // Thrust pushes UP (negative Y: -THRUST_Y).
  // So the player moves upwards into smaller/negative Y values.
  
  // Previous Y was below the gate, current Y is above the gate.
  const crossedUpwards = previousY >= gate.y && diamond.position.y < gate.y;
  
  if (crossedUpwards) {
    // Was the player inside the gap when crossing?
    const leftEdge = diamond.position.x - DIAMOND_RADIUS;
    const rightEdge = diamond.position.x + DIAMOND_RADIUS;
    
    if (leftEdge >= gate.gapStart && rightEdge <= gate.gapEnd) {
      return true;
    }
  }

  return false;
};

export const checkHazardCollision = (
  diamond: DiamondState,
  hazards: Hazard[]
): boolean => {
  // Simple AABB vs Circle check
  const dx = diamond.position.x;
  const dy = diamond.position.y;
  const r = DIAMOND_RADIUS;

  for (const hazard of hazards) {
    // Find the closest point on the hazard rectangle to the diamond center
    // Hazard (x,y) is top-left corner
    const closestX = Math.max(hazard.x, Math.min(dx, hazard.x + hazard.size));
    const closestY = Math.max(hazard.y, Math.min(dy, hazard.y + hazard.size));

    // Calculate distance from closest point to diamond center
    const distanceX = dx - closestX;
    const distanceY = dy - closestY;
    const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

    if (distanceSquared < r * r) {
      return true; // Collision
    }
  }

  return false;
};
