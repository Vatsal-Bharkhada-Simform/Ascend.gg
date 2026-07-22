import type { Gate, Hazard } from '../types/game';
import { 
  BASE_GATE_SPACING, 
  DIAMOND_RADIUS, 
  HAZARD_SIZE,
  COLOR_CHANGE_INTERVAL,
  GATE_COLORS
} from './constants';
import { getDifficultyParams } from './difficulty';

let nextGateId = 1;
let nextHazardId = 1;

export const generateInitialGates = (
  count: number,
  playAreaLeft: number,
  playAreaRight: number,
  startY: number
): { gate: Gate; hazards: Hazard[] }[] => {
  const chunks: { gate: Gate; hazards: Hazard[] }[] = [];
  let currentY = startY - BASE_GATE_SPACING;

  for (let i = 0; i < count; i++) {
    // No hazards for the initial gates (score 0)
    chunks.push({ 
      gate: createRandomGate(currentY, playAreaLeft, playAreaRight, 0),
      hazards: [] 
    });
    currentY -= BASE_GATE_SPACING;
  }

  return chunks;
};

export const generateNextGate = (
  highestGateY: number,
  previousGateY: number,
  playAreaLeft: number,
  playAreaRight: number,
  currentScore: number
): { gate: Gate; hazards: Hazard[] } => {
  
  const gateY = highestGateY - BASE_GATE_SPACING;
  const gate = createRandomGate(gateY, playAreaLeft, playAreaRight, currentScore);
  
  const { hazardCount } = getDifficultyParams(currentScore);
  const hazards: Hazard[] = [];

  const colorIndex = Math.floor(currentScore / COLOR_CHANGE_INTERVAL) % GATE_COLORS.length;

  const minClearance = 3 * (DIAMOND_RADIUS * 2); // 3 diamond widths

  const playAreaWidth = playAreaRight - playAreaLeft;
  const marginH = playAreaWidth * 0.15;
  const minX = playAreaLeft + marginH;
  const maxX = playAreaRight - marginH - HAZARD_SIZE;

  // 15% vertical margin of the span between gates
  const marginV = BASE_GATE_SPACING * 0.15;
  // gateY is the new gate (higher up, smaller Y). previousGateY is the old gate (lower down, larger Y).
  const minY = gateY + marginV;
  const maxY = previousGateY - marginV - HAZARD_SIZE;

  let attempts = 0;
  
  while (hazards.length < hazardCount && attempts < 20) {
    attempts++;

    // Only try to place if there's actual vertical space
    if (maxY <= minY || maxX <= minX) break;

    const hx = minX + Math.random() * (maxX - minX);
    const hy = minY + Math.random() * (maxY - minY);

    // Check clearance against other hazards
    let hasClearance = true;
    for (const other of hazards) {
      const dx = other.x - hx;
      const dy = other.y - hy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minClearance) {
        hasClearance = false;
        break;
      }
    }

    if (hasClearance) {
      hazards.push({
        id: nextHazardId++,
        x: hx,
        y: hy,
        size: HAZARD_SIZE,
        colorIndex
      });
    }
  }

  return { gate, hazards };
};

const createRandomGate = (y: number, playAreaLeft: number, playAreaRight: number, score: number): Gate => {
  const { gapWidth } = getDifficultyParams(score);
  
  const playAreaWidth = playAreaRight - playAreaLeft;
  const maxGapStart = playAreaWidth - gapWidth;
  const gapStart = playAreaLeft + (Math.random() * maxGapStart);
  const gapEnd = gapStart + gapWidth;

  const colorIndex = Math.floor(score / COLOR_CHANGE_INTERVAL) % GATE_COLORS.length;

  return {
    id: nextGateId++,
    y,
    gapStart,
    gapEnd,
    cleared: false,
    colorIndex
  };
};

export const resetGateGenerator = () => {
  nextGateId = 1;
  nextHazardId = 1;
};
