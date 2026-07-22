import type { RunState } from '../types/game';
import { BACKGROUND_COLOR, DIAMOND_COLOR, DIAMOND_RADIUS } from './constants';
import { clearCanvas } from '../utils/canvas';

export const renderGame = (
  ctx: CanvasRenderingContext2D,
  state: RunState,
  width: number,
  height: number,
  dpr: number
) => {
  // Clear the screen
  clearCanvas(ctx, width, height, BACKGROUND_COLOR);

  const { diamond } = state;

  ctx.save();
  
  // The camera follows the player upwards. 
  // For Phase 1, we will just lock the camera to the player's initial position or keep it static.
  // We'll implement actual camera follow in Phase 2.
  // For now, let's just draw relative to the cameraY.
  
  // Transform world coordinates to screen coordinates
  // world Y grows positive downwards.
  const screenX = diamond.position.x * dpr;
  const screenY = (diamond.position.y - state.cameraY) * dpr;
  const radius = DIAMOND_RADIUS * dpr;

  // Draw the diamond
  ctx.translate(screenX, screenY);
  
  // Add a slight rotation based on horizontal velocity for flair
  const rotation = (diamond.velocity.x / 1000) * Math.PI;
  ctx.rotate(rotation);

  ctx.beginPath();
  ctx.moveTo(0, -radius);
  ctx.lineTo(radius, 0);
  ctx.lineTo(0, radius);
  ctx.lineTo(-radius, 0);
  ctx.closePath();

  ctx.fillStyle = DIAMOND_COLOR;
  ctx.fill();

  ctx.restore();
};
