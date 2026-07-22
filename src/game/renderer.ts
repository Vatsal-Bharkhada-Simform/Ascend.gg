import type { RunState } from '../types/game';
import { DIAMOND_COLOR, DIAMOND_RADIUS, GATE_HEIGHT, DEATH_JITTER_INTENSITY, AVAILABLE_SKINS, AVAILABLE_THEMES } from './constants';
import { clearCanvas } from '../utils/canvas';

export const renderGame = (
  ctx: CanvasRenderingContext2D,
  state: RunState,
  width: number,
  height: number,
  dpr: number,
  playAreaLeft: number,
  playAreaRight: number,
  equippedSkinId: string,
  equippedThemeId: string
) => {
  const theme = AVAILABLE_THEMES.find(t => t.id === equippedThemeId) || AVAILABLE_THEMES[0];
  
  // Clear the screen
  clearCanvas(ctx, width, height, theme.backgroundColor);

  const { diamond, gates, cameraY, deathTime } = state;

  ctx.save();
  
  if (deathTime !== undefined) {
    const intensity = DEATH_JITTER_INTENSITY;
    // A quick hack for random jitter
    ctx.translate((Math.random() - 0.5) * intensity * dpr, (Math.random() - 0.5) * intensity * dpr);
  }
  
  // Draw Out-of-Bounds Areas
  ctx.fillStyle = theme.outOfBoundsColor;
  if (playAreaLeft > 0) {
    ctx.fillRect(0, 0, playAreaLeft * dpr, height);
  }
  if (playAreaRight * dpr < width) {
    ctx.fillRect(playAreaRight * dpr, 0, width - (playAreaRight * dpr), height);
  }

  // Draw Gates
  gates.forEach(gate => {
    // Only draw if on screen
    if (gate.y > cameraY - height && gate.y < cameraY + height) {
      ctx.fillStyle = theme.gateColors[gate.colorIndex % theme.gateColors.length];
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

      ctx.fillStyle = theme.gateColors[hazard.colorIndex % theme.gateColors.length];
      ctx.fillRect(screenX, screenY, screenS, screenS);
    }
  });

  // Transform world coordinates to screen coordinates
  const screenX = diamond.position.x * dpr;
  const screenY = (diamond.position.y - cameraY) * dpr;
  const radius = DIAMOND_RADIUS * dpr;

  // Draw the diamond
  ctx.save();
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

  // Determine diamond color and glow based on equipped skin
  const skin = AVAILABLE_SKINS.find(s => s.id === equippedSkinId) || AVAILABLE_SKINS[0];
  ctx.fillStyle = skin.color || DIAMOND_COLOR;
  
  if (skin.glow) {
    ctx.shadowBlur = 20 * dpr;
    ctx.shadowColor = skin.color || DIAMOND_COLOR;
  }
  
  ctx.fill();

  ctx.restore(); // restores the translation and the shadow
  ctx.restore(); // restores the death jitter translation
};
