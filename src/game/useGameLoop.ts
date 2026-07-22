import { useEffect, useRef, useCallback } from 'react';
import type { RunState } from '../types/game';
import { updatePhysics, applyThrust, handleWallCollision } from './physics';
import { renderGame } from './renderer';
import { resizeCanvas } from '../utils/canvas';
import { generateInitialGates, generateNextGate, resetGateGenerator } from './gateGenerator';
import { checkGateCollision, checkGateClear } from './collision';
import { updateCamera } from './camera';
import { MAX_PLAY_WIDTH } from './constants';

const FIXED_TIMESTEP = 1 / 120; // 120Hz physics update
const MAX_ACCUMULATOR = 0.1; // Prevent death spiral on long lags

export const useGameLoop = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onGameOver: (score: number) => void
) => {
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
  const isGameOver = useRef<boolean>(false);

  // Initialize once
  useEffect(() => {
    resetGateGenerator();
    const logicalWidth = window.innerWidth;
    const logicalHeight = window.innerHeight;
    
    const playWidth = Math.min(logicalWidth, MAX_PLAY_WIDTH);
    const playAreaLeft = (logicalWidth - playWidth) / 2;
    const playAreaRight = playAreaLeft + playWidth;

    const startY = logicalHeight / 2;
    stateRef.current.gates = generateInitialGates(5, playAreaLeft, playAreaRight, startY);
    stateRef.current.cameraY = startY - logicalHeight / 2;
    // reset player to exactly center
    stateRef.current.diamond.position = { x: logicalWidth / 2, y: startY };
    isGameOver.current = false;
  }, []);

  const loop = useCallback((time: number) => {
    if (isGameOver.current) return;

    if (lastTimeRef.current === 0) {
      lastTimeRef.current = time;
    }
    
    let dt = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;

    if (dt > MAX_ACCUMULATOR) dt = MAX_ACCUMULATOR;
    accumulatorRef.current += dt;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = resizeCanvas(canvas);
    const dpr = window.devicePixelRatio || 1;
    
    const logicalWidth = width / dpr;
    const logicalHeight = height / dpr;

    const playWidth = Math.min(logicalWidth, MAX_PLAY_WIDTH);
    const playAreaLeft = (logicalWidth - playWidth) / 2;
    const playAreaRight = playAreaLeft + playWidth;

    const state = stateRef.current;

    // Fixed timestep physics update
    while (accumulatorRef.current >= FIXED_TIMESTEP) {
      const previousY = updatePhysics(state, FIXED_TIMESTEP);
      handleWallCollision(state.diamond, playAreaLeft, playAreaRight);

      // Check Gate Collisions
      for (const gate of state.gates) {
        if (checkGateCollision(state.diamond, previousY, gate)) {
          isGameOver.current = true;
          onGameOver(state.score);
          return;
        }

        if (checkGateClear(state.diamond, previousY, gate)) {
          gate.cleared = true;
          state.score += 1;

          // Generate new gate above the highest one
          const highestGateY = Math.min(...state.gates.map(g => g.y));
          state.gates.push(generateNextGate(highestGateY, playAreaLeft, playAreaRight, state.score));
        }
      }

      // Cleanup old gates that are way below the camera
      state.gates = state.gates.filter(g => g.y < state.cameraY + logicalHeight + 500);

      accumulatorRef.current -= FIXED_TIMESTEP;
    }

    // Camera follow
    updateCamera(state);

    // Death by falling off screen
    if (state.diamond.position.y > state.cameraY + logicalHeight + 50) {
      isGameOver.current = true;
      onGameOver(state.score);
      return;
    }

    // Render using the interpolated/latest state
    const ctx = canvas.getContext('2d');
    if (ctx) {
      renderGame(ctx, state, width, height, dpr, playAreaLeft, playAreaRight);
    }

    // Update HUD overlay score safely
    const scoreElement = canvas.parentElement?.querySelector('.drop-shadow-md');
    if (scoreElement && scoreElement.textContent !== state.score.toString()) {
      scoreElement.textContent = state.score.toString();
    }

    requestRef.current = requestAnimationFrame(loop);
  }, [canvasRef, onGameOver]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestRef.current);
  }, [loop]);

  const handleInput = useCallback((side: 'left' | 'right') => {
    if (isGameOver.current) return;
    applyThrust(stateRef.current.diamond, side);
  }, []);

  return { handleInput };
};
