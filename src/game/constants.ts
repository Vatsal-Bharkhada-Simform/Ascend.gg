// Physics & Math Constants
export const GRAVITY = 1650; // pixels per second squared
export const THRUST_X = 100; // instant horizontal velocity on tap
export const THRUST_Y = 600; // instant vertical velocity on tap
export const BOUNCE_DAMPING = 0.8; // retaining 80% horizontal speed on wall hit

// Game Bounds
export const DIAMOND_RADIUS = 16; // visual and collision radius
export const GATE_HEIGHT = 24;
export const HAZARD_SIZE = 24;
export const FOLLOW_MARGIN_PCT = {
  MOBILE: 0.4,
  DESKTOP: 0.5,
};
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
export const BASE_GATE_SPACING = {
  MOBILE: 400,
  DESKTOP: 500,
};

// Combo / Scoring
export const MAX_MULTIPLIER = 3;
export const COMBO_TIME_LIMIT = 2; // seconds to reach next gate before multiplier resets

// Colors & Visuals
export const BACKGROUND_COLOR = '#FFFFFF';
export const DIAMOND_COLOR = '#111827'; // slate-900 (dark minimalist)


export const COLOR_CHANGE_INTERVAL = 10; // Change color every 10 points

// Death Animation
export const DEATH_JITTER_DURATION = 0.8; // seconds
export const DEATH_JITTER_INTENSITY = 10; // pixels of shake

// Shop / Skins
export const AVAILABLE_SKINS = [
  { id: 'default', name: 'Classic', color: '#111827' }, // slate-900
  { id: 'neon', name: 'Neon Green', color: '#10B981' }, // emerald-500
  { id: 'crimson', name: 'Crimson', color: '#EF4444' }, // red-500
  { id: 'gold', name: 'Solid Gold', color: '#F59E0B', glow: true }, // amber-500
  { id: 'amethyst', name: 'Amethyst', color: '#8B5CF6' }, // violet-500
  { id: 'abyss', name: 'The Abyss', color: '#000000', glow: true }, // pure black
];

// Shop / Themes
export const AVAILABLE_THEMES = [
  {
    id: 'default',
    name: 'Classic Light',
    backgroundColor: '#FFFFFF',
    outOfBoundsColor: '#F3F4F6',
    gateColors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'],
    foregroundColor: '#F9FAFB',
    accentColor: '#F59E0B',
    textColor: '#111827',
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    backgroundColor: '#222222',
    outOfBoundsColor: '#111111',
    gateColors: ['#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA', '#F472B6'],
    foregroundColor: '#333333',
    accentColor: '#FBBF24',
    textColor: '#F3F4F6',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    backgroundColor: '#0F172A',
    outOfBoundsColor: '#020617',
    gateColors: ['#06B6D4', '#22C55E', '#EAB308', '#F43F5E', '#D946EF', '#14B8A6'],
    foregroundColor: '#1E293B',
    accentColor: '#F43F5E',
    textColor: '#E2E8F0',
  },
  {
    id: 'sakura',
    name: 'Sakura Bloom',
    backgroundColor: '#FFF1F2',
    outOfBoundsColor: '#FFE4E6',
    gateColors: ['#FB7185', '#F472B6', '#C084FC', '#FDA4AF', '#F9A8D4', '#E879F9'],
    foregroundColor: '#FFE4E6',
    accentColor: '#FB7185',
    textColor: '#881337',
  },
  {
    id: 'forest',
    name: 'Deep Forest',
    backgroundColor: '#0C1F17',
    outOfBoundsColor: '#071410',
    gateColors: ['#4ADE80', '#A3E635', '#FACC15', '#22D3EE', '#84CC16', '#2DD4BF'],
    foregroundColor: '#14301F',
    accentColor: '#A3E635',
    textColor: '#D1FAE5',
  },
  {
    id: 'desert',
    name: 'Desert Dune',
    backgroundColor: '#FEF3C7',
    outOfBoundsColor: '#FDE68A',
    gateColors: ['#EA580C', '#B45309', '#DC2626', '#65A30D', '#0891B2', '#9333EA'],
    foregroundColor: '#FDE68A',
    accentColor: '#EA580C',
    textColor: '#78350F',
  },
  {
    id: 'ocean',
    name: 'Ocean Depths',
    backgroundColor: '#082F49',
    outOfBoundsColor: '#041D30',
    gateColors: ['#38BDF8', '#2DD4BF', '#818CF8', '#67E8F9', '#4ADE80', '#A78BFA'],
    foregroundColor: '#0C4A6E',
    accentColor: '#38BDF8',
    textColor: '#E0F2FE',
  },
  {
    id: 'sunset',
    name: 'Sunset Blvd',
    backgroundColor: '#1E1B2E',
    outOfBoundsColor: '#141225',
    gateColors: ['#FB923C', '#F472B6', '#FBBF24', '#F87171', '#E879F9', '#FCA5A5'],
    foregroundColor: '#2D2A45',
    accentColor: '#FB923C',
    textColor: '#FEF3C7',
  },
  {
    id: 'mono',
    name: 'Monochrome',
    backgroundColor: '#FAFAFA',
    outOfBoundsColor: '#E5E5E5',
    gateColors: ['#171717', '#404040', '#525252', '#737373', '#A3A3A3', '#D4D4D4'],
    foregroundColor: '#E5E5E5',
    accentColor: '#171717',
    textColor: '#171717',
  },
  {
    id: 'candy',
    name: 'Candy Pop',
    backgroundColor: '#FDF4FF',
    outOfBoundsColor: '#FAE8FF',
    gateColors: ['#F97316', '#22D3EE', '#A855F7', '#FACC15', '#F43F5E', '#4ADE80'],
    foregroundColor: '#FAE8FF',
    accentColor: '#A855F7',
    textColor: '#701A75',
  },
  {
    id: 'terminal',
    name: 'Terminal Green',
    backgroundColor: '#000000',
    outOfBoundsColor: '#0A0A0A',
    gateColors: ['#22C55E', '#4ADE80', '#86EFAC', '#16A34A', '#15803D', '#166534'],
    foregroundColor: '#0D1F0D',
    accentColor: '#22C55E',
    textColor: '#4ADE80',
  },
  {
    id: 'pastel-mint',
    name: 'Mint Cream',
    backgroundColor: '#F0FDF9',
    outOfBoundsColor: '#D1FAE9',
    gateColors: ['#5EEAD4', '#A7F3D0', '#FDE68A', '#FCA5A5', '#C4B5FD', '#93C5FD'],
    foregroundColor: '#D1FAE9',
    accentColor: '#2DD4BF',
    textColor: '#134E4A',
  },
  {
    id: 'pastel-lavender',
    name: 'Lavender Fields',
    backgroundColor: '#F5F3FF',
    outOfBoundsColor: '#EDE9FE',
    gateColors: ['#C4B5FD', '#A5B4FC', '#F9A8D4', '#FDE68A', '#93C5FD', '#6EE7B7'],
    foregroundColor: '#EDE9FE',
    accentColor: '#A78BFA',
    textColor: '#4C1D95',
  },
  {
    id: 'pastel-peach',
    name: 'Peach Sorbet',
    backgroundColor: '#FFF7ED',
    outOfBoundsColor: '#FFEDD5',
    gateColors: ['#FDBA74', '#FCA5A5', '#FDE68A', '#BEF264', '#93C5FD', '#F9A8D4'],
    foregroundColor: '#FFEDD5',
    accentColor: '#FB923C',
    textColor: '#7C2D12',
  },
  {
    id: 'pastel-sky',
    name: 'Baby Blue',
    backgroundColor: '#F0F9FF',
    outOfBoundsColor: '#E0F2FE',
    gateColors: ['#7DD3FC', '#BAE6FD', '#FBCFE8', '#FDE68A', '#C7D2FE', '#A7F3D0'],
    foregroundColor: '#E0F2FE',
    accentColor: '#38BDF8',
    textColor: '#0C4A6E',
  },
  {
    id: 'coral-reef',
    name: 'Coral Reef',
    backgroundColor: '#FFF5F2',
    outOfBoundsColor: '#FFE4DE',
    gateColors: ['#FF7F6B', '#FF9F87', '#38BDF8', '#FBBF24', '#2DD4BF', '#F472B6'],
    foregroundColor: '#FFE4DE',
    accentColor: '#FF7F6B',
    textColor: '#7C2D12',
  },
  {
    id: 'dark-midnight',
    name: 'Midnight Blue',
    backgroundColor: '#0B1120',
    outOfBoundsColor: '#050810',
    gateColors: ['#3B82F6', '#60A5FA', '#818CF8', '#38BDF8', '#6366F1', '#0EA5E9'],
    foregroundColor: '#111827',
    accentColor: '#3B82F6',
    textColor: '#DBEAFE',
  },
  {
    id: 'dark-crimson',
    name: 'Crimson Void',
    backgroundColor: '#1A0A0A',
    outOfBoundsColor: '#0D0404',
    gateColors: ['#EF4444', '#F87171', '#FB923C', '#FBBF24', '#F43F5E', '#DC2626'],
    foregroundColor: '#2A1010',
    accentColor: '#EF4444',
    textColor: '#FEE2E2',
  },
  {
    id: 'dark-obsidian',
    name: 'Obsidian',
    backgroundColor: '#18181B',
    outOfBoundsColor: '#0A0A0B',
    gateColors: ['#71717A', '#A1A1AA', '#D4D4D8', '#FAFAFA', '#52525B', '#E4E4E7'],
    foregroundColor: '#27272A',
    accentColor: '#D4D4D8',
    textColor: '#F4F4F5',
  },
  {
    id: 'dark-plum',
    name: 'Royal Plum',
    backgroundColor: '#1E1030',
    outOfBoundsColor: '#100819',
    gateColors: ['#C084FC', '#E879F9', '#818CF8', '#F472B6', '#A78BFA', '#D946EF'],
    foregroundColor: '#2E1A47',
    accentColor: '#C084FC',
    textColor: '#F3E8FF',
  },
  {
    id: 'dark-amber',
    name: 'Amber Ember',
    backgroundColor: '#1C1410',
    outOfBoundsColor: '#0E0A08',
    gateColors: ['#F59E0B', '#FBBF24', '#F97316', '#EF4444', '#EAB308', '#D97706'],
    foregroundColor: '#2B2116',
    accentColor: '#F59E0B',
    textColor: '#FEF3C7',
  },
];
