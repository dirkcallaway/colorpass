export const COLORS = [
  {
    id: 'red',
    label: 'Red',
    bg: 'bg-red-500',
    ring: 'ring-red-400' },
  {
    id: 'orange',
    label: 'Orange',
    bg: 'bg-orange-500',
    ring: 'ring-orange-400',
  },
  {
    id: 'yellow',
    label: 'Yellow',
    bg: 'bg-yellow-400',
    ring: 'ring-yellow-300',
  },
  {
    id:'green',
    label: 'Green',
    bg: 'bg-green-500',
    ring: 'ring-green-400' },
  {
    id: 'blue',
    label: 'Blue',
    bg: 'bg-blue-500',
    ring: 'ring-blue-400' },
  {
    id: 'purple',
    label: 'Purple',
    bg: 'bg-purple-500',
    ring: 'ring-purple-400',
  },
] as const;

export type ColorId = (typeof COLORS)[number]['id'];

export interface Feedback {
  black: number; // correct color, correct position
  white: number; // correct color, wrong position
}

export function checkGuess(secret: ColorId[], guess: ColorId[]): Feedback {
  let black = 0;
  let white = 0;
  const secretLeft = [...secret] as (ColorId | null)[];
  const guessLeft = [...guess] as (ColorId | null)[];

  // Pass 1: exact matches (black pegs)
  for (let i = 0; i < 5; i++) {
    if (guessLeft[i] === secretLeft[i]) {
      black++;
      secretLeft[i] = null;
      guessLeft[i] = null;
    }
  }

  // Pass 2: color only matches (white pegs)
  for (let i = 0; i < 5; i++) {
    if (guessLeft[i] === null) continue;
    const j = secretLeft.indexOf(guessLeft[i] as ColorId);
    if (j !== -1) {
      white++;
      secretLeft[j] = null;
    }
  }

  return { black, white };
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const EPOCH = new Date('2026-01-01');

export function getDailyCode(): {
  code: ColorId[];
  puzzleNumber: number;
  dateKey: string;
} {
  const today = new Date();
  const dateKey = today.toISOString().slice(0, 10); // "YYYY-MM-DD"
  const seed = Number(dateKey.replace(/-/g, '')); //20260303
  const rand = mulberry32(seed);
  const code = Array.from(
    { length: 5 },
    () => COLORS[Math.floor(rand() * COLORS.length)]?.id,
  ) as ColorId[];
  const puzzleNumber =
    Math.floor((today.getTime() - EPOCH.getTime()) / 86400000) + 1;
  return { code, puzzleNumber, dateKey };
}
