import { useEffect, useRef, useCallback } from 'react';
import type { RunState } from '../types/game';
import { updatePhysics, applyThrust, handleWallCollision } from './physics';
import { renderGame } from './renderer';
import { resizeCanvas } from '../utils/canvas';
import { generateInitialGates, generateNextGate, resetGateGenerator } from './gateGenerator';
import { checkGateCollision, checkGateClear, checkHazardCollision } from './collision';
import { updateCamera } from './camera';
import { MAX_PLAY_WIDTH, COMBO_TIME_LIMIT, MAX_MULTIPLIER, DEATH_JITTER_DURATION } from './constants';

const FIXED_TIMESTEP = 1 / 120; // 120Hz physics update
const MAX_ACCUMULATOR = 0.1; // Prevent death spiral on long lags

export const useGameLoop = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  equippedSkinId: string,
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
    const initialChunks = generateInitialGates(5, playAreaLeft, playAreaRight, startY);
    stateRef.current.gates = initialChunks.map(c => c.gate);
    stateRef.current.hazards = initialChunks.flatMap(c => c.hazards);
    stateRef.current.cameraY = startY - logicalHeight / 2;
    // reset player to exactly center
    stateRef.current.diamond.position = { x: logicalWidth / 2, y: startY };
    stateRef.current.score = 0;
    stateRef.current.multiplier = 1;
    stateRef.current.comboTimer = 0;
    stateRef.current.deathTime = undefined;
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

    if (state.deathTime !== undefined) {
      if (time - state.deathTime > DEATH_JITTER_DURATION * 1000) {
        isGameOver.current = true;
        onGameOver(state.score);
        return;
      }
      // Skip physics update if dead, but allow render
    } else {
      // Fixed timestep physics update
      while (accumulatorRef.current >= FIXED_TIMESTEP) {
        // Combo Timer Logic
        if (state.comboTimer > 0) {
          state.comboTimer -= FIXED_TIMESTEP;
          if (state.comboTimer <= 0) {
            state.comboTimer = 0;
            state.multiplier = 1; // Reset multiplier on timeout
          }
        }

        const previousY = updatePhysics(state, FIXED_TIMESTEP);
        handleWallCollision(state.diamond, playAreaLeft, playAreaRight);

        // Check Hazard Collisions
        if (checkHazardCollision(state.diamond, state.hazards)) {
          state.deathTime = time;
          break;
        }

        // Check Gate Collisions
        for (const gate of state.gates) {
          if (checkGateCollision(state.diamond, previousY, gate)) {
            state.deathTime = time;
            break;
          }

          if (checkGateClear(state.diamond, previousY, gate)) {
            gate.cleared = true;
            
            // Apply multiplier to score before incrementing it (as requested)
            state.score += 1 * state.multiplier;
            
            // Increment multiplier and refill timer
            state.multiplier = Math.min(MAX_MULTIPLIER, state.multiplier + 1);
            state.comboTimer = COMBO_TIME_LIMIT;

            // Generate new gate above the highest one
            const highestGateY = Math.min(...state.gates.map(g => g.y));
            
            const newChunk = generateNextGate(highestGateY, highestGateY, playAreaLeft, playAreaRight, state.score);
            state.gates.push(newChunk.gate);
            state.hazards.push(...newChunk.hazards);
          }
        }
        
        if (state.deathTime !== undefined) break;

        // Cleanup old gates and hazards that are way below the camera
        state.gates = state.gates.filter(g => g.y < state.cameraY + logicalHeight + 500);
        state.hazards = state.hazards.filter(h => h.y < state.cameraY + logicalHeight + 500);

        accumulatorRef.current -= FIXED_TIMESTEP;
      }

      // Camera follow
      updateCamera(state);

      // Death by falling off screen
      if (state.diamond.position.y > state.cameraY + logicalHeight + 50) {
        state.deathTime = time;
      }
    }

    // Render using the interpolated/latest state
    const ctx = canvas.getContext('2d');
    if (ctx) {
      renderGame(ctx, state, width, height, dpr, playAreaLeft, playAreaRight, equippedSkinId);
    }

    // Update HUD overlay safely to avoid React re-renders every frame
    const scoreElement = document.getElementById('hud-score');
    if (scoreElement && scoreElement.textContent !== state.score.toString()) {
      scoreElement.textContent = state.score.toString();
    }
    
    const multiplierElement = document.getElementById('hud-multiplier');
    if (multiplierElement) {
      const text = `x${state.multiplier}`;
      if (multiplierElement.textContent !== text) {
        multiplierElement.textContent = text;
        // Make it bold and colored if > 1
        if (state.multiplier > 1) {
          multiplierElement.className = 'text-2xl font-bold text-amber-400 drop-shadow-md transition-all';
        } else {
          multiplierElement.className = 'text-xl font-bold text-gray-400 opacity-50 transition-all';
        }
      }
    }

    const timerElement = document.getElementById('hud-timer-bar');
    if (timerElement) {
      const percentage = (state.comboTimer / COMBO_TIME_LIMIT) * 100;
      timerElement.style.width = `${percentage}%`;
      // Change color based on urgency
      if (percentage < 25) {
        timerElement.style.backgroundColor = '#EF4444'; // Red
      } else if (percentage < 50) {
        timerElement.style.backgroundColor = '#F59E0B'; // Amber
      } else {
        timerElement.style.backgroundColor = '#10B981'; // Emerald
      }
    }

    requestRef.current = requestAnimationFrame(loop);
  }, [canvasRef, onGameOver, equippedSkinId]);

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
