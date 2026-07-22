import { 
  MAX_SCORE, 
  MIN_OBSTACLES_PER_GATE, 
  MAX_OBSTACLES_PER_GATE,
  BASE_GAP_WIDTH,
  MIN_GAP_WIDTH
} from './constants';

export const getDifficultyParams = (score: number) => {
  const cappedScore = Math.min(score, MAX_SCORE);
  const difficultyRatio = cappedScore / MAX_SCORE;

  // Gap width shrinks from BASE_GAP_WIDTH down to MIN_GAP_WIDTH
  const gapWidth = BASE_GAP_WIDTH - (BASE_GAP_WIDTH - MIN_GAP_WIDTH) * difficultyRatio;
  
  // Hazard count increases as score goes up, but we want a chance for no hazards early on
  // Let's say at score 0, chance of 1 hazard is low. At score 100, we get max hazards.
  // We'll calculate a base count and add randomness in the generator.
  const hazardCount = MIN_OBSTACLES_PER_GATE + Math.round((MAX_OBSTACLES_PER_GATE - MIN_OBSTACLES_PER_GATE) * difficultyRatio);

  return {
    gapWidth,
    hazardCount
  };
};
