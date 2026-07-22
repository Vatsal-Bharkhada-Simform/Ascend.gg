import type { RunState } from '../types/game';
import { BACKGROUND_COLOR, OUT_OF_BOUNDS_COLOR, DIAMOND_COLOR, DIAMOND_RADIUS, GATE_COLORS, COLOR_CHANGE_INTERVAL, GATE_HEIGHT } from './constants';
import { clearCanvas } from '../utils/canvas';

export const renderGame = (
  ctx: CanvasRenderingContext2D,
  state: RunState,
  width: number,
  height: number,
  dpr: number,
  playAreaLeft: number,
  playAreaRight: number
) => {
  // Clear the screen
  clearCanvas(ctx, width, height, BACKGROUND_COLOR);

  const { diamond, gates, score, cameraY } = state;

  ctx.save();
  
  // Draw Out-of-Bounds Areas
  ctx.fillStyle = OUT_OF_BOUNDS_COLOR;
  if (playAreaLeft > 0) {
    ctx.fillRect(0, 0, playAreaLeft * dpr, height);
  }
  if (playAreaRight * dpr < width) {
    ctx.fillRect(playAreaRight * dpr, 0, width - (playAreaRight * dpr), height);
  }

  // Determine current gate color
  const colorIndex = Math.floor(score / COLOR_CHANGE_INTERVAL) % GATE_COLORS.length;
  const currentGateColor = GATE_COLORS[colorIndex];

  // Draw Gates
  ctx.fillStyle = currentGateColor;
  gates.forEach(gate => {
    // Only draw if on screen
    if (gate.y > cameraY - height && gate.y < cameraY + height) {
      const screenY = (gate.y - cameraY) * dpr;
      const screenH = GATE_HEIGHT * dpr;
      const gapStartX = gate.gapStart * dpr;
      const gapEndX = gate.gapEnd * dpr;
      const screenWidth = width; // already scaled by dpr

      // Draw left bar
      ctx.fillRect(0, screenY, gapStartX, screenH);
      // Draw right bar
      ctx.fillRect(gapEndX, screenY, screenWidth - gapEndX, screenH);
    }
  });

  // Draw Hazards
  state.hazards.forEach(hazard => {
    // Only draw if on screen
    if (hazard.y > cameraY - height && hazard.y < cameraY + height) {
      const screenX = hazard.x * dpr;
      const screenY = (hazard.y - cameraY) * dpr;
      const screenS = hazard.size * dpr;

      ctx.fillStyle = GATE_COLORS[hazard.colorIndex % GATE_COLORS.length];
      ctx.fillRect(screenX, screenY, screenS, screenS);
    }
  });

  // Transform world coordinates to screen coordinates
  const screenX = diamond.position.x * dpr;
  const screenY = (diamond.position.y - cameraY) * dpr;
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
