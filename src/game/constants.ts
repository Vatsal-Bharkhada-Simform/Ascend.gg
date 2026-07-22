// Physics & Math Constants
export const GRAVITY = 1700; // pixels per second squared
export const THRUST_X = 120; // instant horizontal velocity on tap
export const THRUST_Y = 600; // instant vertical velocity on tap
export const BOUNCE_DAMPING = 0.8; // retaining 80% horizontal speed on wall hit

// Game Bounds
export const DIAMOND_RADIUS = 12; // visual and collision radius
export const GATE_HEIGHT = 24;
export const HAZARD_SIZE = 24;
export const FOLLOW_MARGIN = 400; // how far from top the camera follows the player
export const BASE_GAP_WIDTH = 120; // initial gap width
export const MIN_GAP_WIDTH = 60; // smallest possible gap
export const MAX_SCORE = 100; // point where difficulty caps out

// Play Area Bounds for PC
export const MAX_PLAY_WIDTH = 500;
export const OUT_OF_BOUNDS_COLOR = '#F3F4F6'; // Tailwind gray-100

// Generation Rules
export const MIN_OBSTACLES_PER_GATE = 2;
export const MAX_OBSTACLES_PER_GATE = 5;
export const MIN_GAP_RATIO = 0.2; // minimum percentage of screen width for a gap
export const MAX_GAP_RATIO = 0.35; // maximum percentage of screen width for a gap
export const BASE_GATE_SPACING = 500;

// Combo / Scoring
export const MAX_MULTIPLIER = 3;
export const COMBO_TIME_LIMIT = 2; // seconds to reach next gate before multiplier resets

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

// Death Animation
export const DEATH_JITTER_DURATION = 0.8; // seconds
export const DEATH_JITTER_INTENSITY = 10; // pixels of shake

// Shop / Skins
export const AVAILABLE_SKINS = [
  { id: 'default', name: 'Classic', cost: 0, color: '#111827' }, // slate-900
  { id: 'neon', name: 'Neon Green', cost: 50, color: '#10B981' }, // emerald-500
  { id: 'crimson', name: 'Crimson', cost: 150, color: '#EF4444' }, // red-500
  { id: 'gold', name: 'Solid Gold', cost: 300, color: '#F59E0B', glow: true }, // amber-500
  { id: 'amethyst', name: 'Amethyst', cost: 600, color: '#8B5CF6' }, // violet-500
  { id: 'abyss', name: 'The Abyss', cost: 1000, color: '#000000', glow: true }, // pure black
];

// Shop / Themes
export const AVAILABLE_THEMES = [
  {
    id: 'default',
    name: 'Classic Light',
    cost: 0,
    backgroundColor: '#FFFFFF',
    outOfBoundsColor: '#F3F4F6', // gray-100
    gateColors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'],
    foregroundColor: '#F9FAFB', // gray-50
    accentColor: '#F59E0B', // amber-500
    textColor: '#111827', // gray-900
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    cost: 200,
    backgroundColor: '#222222', // gray-800
    outOfBoundsColor: '#111111', // gray-900
    gateColors: ['#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA', '#F472B6'],
    foregroundColor: '#333333', // slightly lighter than bg
    accentColor: '#FBBF24', // amber-400
    textColor: '#F3F4F6', // gray-100
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    cost: 500,
    backgroundColor: '#0F172A', // slate-900
    outOfBoundsColor: '#020617', // slate-950
    gateColors: ['#06B6D4', '#22C55E', '#EAB308', '#F43F5E', '#D946EF', '#14B8A6'],
    foregroundColor: '#1E293B', // slate-800
    accentColor: '#F43F5E', // rose-500
    textColor: '#E2E8F0', // slate-200
  },
];
