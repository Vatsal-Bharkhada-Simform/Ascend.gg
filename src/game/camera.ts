import type { RunState } from '../types/game';
import { FOLLOW_MARGIN } from './constants';

export const updateCamera = (state: RunState) => {
  // Camera moves upwards (negative Y direction) to follow the diamond
  // We only ever scroll up, never down.
  const targetCameraY = state.diamond.position.y - FOLLOW_MARGIN;
  
  if (targetCameraY < state.cameraY) {
    state.cameraY = targetCameraY;
  }
};
