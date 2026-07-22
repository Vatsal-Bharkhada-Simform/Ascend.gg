// Physics & Math Constants
export const GRAVITY = 1500; // pixels per second squared
export const THRUST_X = 400; // instant horizontal velocity on tap
export const THRUST_Y = 600; // instant vertical velocity on tap
export const BOUNCE_DAMPING = 0.8; // retaining 80% horizontal speed on wall hit

// Game Bounds
export const DIAMOND_RADIUS = 12; // visual and collision radius
export const GATE_HEIGHT = 16;
export const HAZARD_SIZE = 16;
export const FOLLOW_MARGIN = 300; // how far from top the camera follows the player
export const BASE_GAP_WIDTH = 120; // initial gap width
export const MIN_GAP_WIDTH = 60; // smallest possible gap
export const MAX_SCORE = 100; // point where difficulty caps out

// Generation Rules
export const MIN_OBSTACLES_PER_GATE = 1;
export const MAX_OBSTACLES_PER_GATE = 3;
export const MIN_GAP_RATIO = 0.15; // minimum percentage of screen width for a gap
export const MAX_GAP_RATIO = 0.35; // maximum percentage of screen width for a gap
export const BASE_GATE_SPACING = 400;

// Colors & Visuals
export const BACKGROUND_COLOR = '#FFFFFF';
export const DIAMOND_COLOR = '#111827'; // slate-900 (dark minimalist)

// We cycle through these colors based on score intervals
export const GATE_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#EC4899', // Pink
];
export const COLOR_CHANGE_INTERVAL = 10; // Change color every 10 points
