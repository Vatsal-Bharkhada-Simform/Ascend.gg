import { useEffect, useRef, useCallback } from 'react';
import type { RunState } from '../types/game';
import { updatePhysics, applyThrust, handleWallCollision } from './physics';
import { renderGame } from './renderer';
import { resizeCanvas } from '../utils/canvas';

const FIXED_TIMESTEP = 1 / 120; // 120Hz physics update
const MAX_ACCUMULATOR = 0.1; // Prevent death spiral on long lags

export const useGameLoop = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onGameOver: (score: number) => void
) => {
  // Mutable game state held in a ref to avoid re-renders
  const stateRef = useRef<RunState>({
    diamond: {
      position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      velocity: { x: 0, y: 0 }
    },
    gates: [],
    hazards: [],
    cameraY: 0,
    score: 0,
    multiplier: 1,
    comboTimer: 0
  });

  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const accumulatorRef = useRef<number>(0);

  const loop = useCallback((time: number) => {
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = time;
    }
    
    // Time delta in seconds
    let dt = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;

    // Cap dt to avoid massive spikes (e.g. tab backgrounded)
    if (dt > MAX_ACCUMULATOR) dt = MAX_ACCUMULATOR;

    accumulatorRef.current += dt;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = resizeCanvas(canvas);
    const dpr = window.devicePixelRatio || 1;
    
    // Un-scaled width/height for physics (logical coords)
    const logicalWidth = width / dpr;
    const logicalHeight = height / dpr;

    const state = stateRef.current;

    // Fixed timestep physics update
    while (accumulatorRef.current >= FIXED_TIMESTEP) {
      updatePhysics(state, FIXED_TIMESTEP);
      handleWallCollision(state.diamond, logicalWidth);
      accumulatorRef.current -= FIXED_TIMESTEP;
    }

    // Render using the interpolated/latest state
    const ctx = canvas.getContext('2d');
    if (ctx) {
      renderGame(ctx, state, width, height, dpr);
    }

    // Check bounds for Phase 1 - if you fall off screen, reset for testing
    // In Phase 2 we will trigger onGameOver
    if (state.diamond.position.y - state.cameraY > logicalHeight + 100) {
      // Temporary restart for Phase 1 testing
      state.diamond.position = { x: logicalWidth / 2, y: logicalHeight / 2 };
      state.diamond.velocity = { x: 0, y: 0 };
    }

    requestRef.current = requestAnimationFrame(loop);
  }, [canvasRef, onGameOver]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestRef.current);
  }, [loop]);

  const handleInput = useCallback((side: 'left' | 'right') => {
    applyThrust(stateRef.current.diamond, side);
  }, []);

  return { handleInput };
};
