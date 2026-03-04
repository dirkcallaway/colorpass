import { getDailyCode, checkGuess, type ColorId, type Feedback } from '~/utils/colorpass';

const CODE_LENGTH = 5;
const MAX_GUESSES = 8;

export interface GuessRecord {
  colors: ColorId[];
  feedback: Feedback;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[] // index 0-7 = guesses 1-8
}

const defaultStats = (): GameStats => ({
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: Array(MAX_GUESSES).fill(0)
});

export function useGameState() {
  const { code, puzzleNumber, dateKey } = getDailyCode();

  const guesses = ref<GuessRecord[]>([]);
  const currentGuess = ref<(ColorId | null)[]>(Array(CODE_LENGTH).fill(null));
  const status = ref<'playing' | 'won' | 'lost'>('playing');
  const stats = ref<GameStats>(defaultStats());

  const STATE_KEY = `colorpass-state-${dateKey}`;
  const STATS_KEY = `colorpass-stats`;

  function loadState() {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        guesses.value = saved.guesses ?? [];
        currentGuess.value = Array(CODE_LENGTH).fill(null);
        status.value = saved.status ?? 'playing';
      }
      const rawStats = localStorage.getItem(STATS_KEY);
      if (rawStats) stats.value = JSON.parse(rawStats);
    } catch (e) {
      console.error('Failed to load game state:', e);
    }
  }

  function saveState() {
    localStorage.setItem(STATE_KEY, JSON.stringify({
      guesses: guesses.value,
      status: status.value
    }));
  }

  function saveStats() {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats.value));
  }

  function addColor(colorId: ColorId) {
    if (status.value !== 'playing') return;
    const idx = currentGuess.value.indexOf(null);
    if (idx !== -1) currentGuess.value[idx] = colorId;
  }
}