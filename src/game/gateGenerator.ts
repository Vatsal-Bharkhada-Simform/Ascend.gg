import type { Gate } from '../types/game';
import { BASE_GATE_SPACING, MIN_GAP_WIDTH, BASE_GAP_WIDTH } from './constants';

// We need a simple ID generator since gates don't have natural UUIDs
let nextGateId = 1;

/**
 * Generates the first few gates at the start of a run.
 */
export const generateInitialGates = (
  count: number,
  playAreaLeft: number,
  playAreaRight: number,
  startY: number
): Gate[] => {
  const gates: Gate[] = [];
  let currentY = startY - BASE_GATE_SPACING;

  for (let i = 0; i < count; i++) {
    gates.push(createRandomGate(currentY, playAreaLeft, playAreaRight, 0));
    currentY -= BASE_GATE_SPACING;
  }

  return gates;
};

/**
 * Generates the next gate above the current highest gate.
 */
export const generateNextGate = (
  highestGateY: number,
  playAreaLeft: number,
  playAreaRight: number,
  currentScore: number
): Gate => {
  return createRandomGate(highestGateY - BASE_GATE_SPACING, playAreaLeft, playAreaRight, currentScore);
};

const createRandomGate = (y: number, playAreaLeft: number, playAreaRight: number, score: number): Gate => {
  // Gap width scaling (simplified for Phase 2)
  const gapWidth = Math.max(MIN_GAP_WIDTH, BASE_GAP_WIDTH - score);
  
  // Ensure the gap is fully within the play area bounds
  const playAreaWidth = playAreaRight - playAreaLeft;
  const maxGapStart = playAreaWidth - gapWidth;
  const gapStart = playAreaLeft + (Math.random() * maxGapStart);
  const gapEnd = gapStart + gapWidth;

  return {
    id: nextGateId++,
    y,
    gapStart,
    gapEnd,
    cleared: false,
  };
};

export const resetGateGenerator = () => {
  nextGateId = 1;
};
