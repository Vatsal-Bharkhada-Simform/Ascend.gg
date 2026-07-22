import type { RunState } from '../types/game';
import { FOLLOW_MARGIN_PCT } from './constants';

export const updateCamera = (state: RunState, viewportHeight: number, isMobile: boolean) => {
  // Camera moves upwards (negative Y direction) to follow the diamond
  // We only ever scroll up, never down.
  const marginPct = isMobile ? FOLLOW_MARGIN_PCT.MOBILE : FOLLOW_MARGIN_PCT.DESKTOP;
  const targetCameraY = state.diamond.position.y - (viewportHeight * marginPct);
  
  if (targetCameraY < state.cameraY) {
    state.cameraY = targetCameraY;
  }
};
