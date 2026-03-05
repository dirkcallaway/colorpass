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

  const guesses        = ref<GuessRecord[]>([]);
  const currentGuess   = ref<(ColorId | null)[]>(Array(CODE_LENGTH).fill(null));
  const status         = ref<'playing' | 'won' | 'lost'>('playing');
  const stats          = ref<GameStats>(defaultStats());
  const hintsRemaining = ref(3);
  const hintedSlots    = ref<Record<number, ColorId>>({});
  const hintsUsed      = ref(0);


  const STATE_KEY = `colorpass-state-${dateKey}`;
  const STATS_KEY = `colorpass-stats`;

  function loadState() {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        guesses.value        = saved.guesses ?? [];
        currentGuess.value   = Array(CODE_LENGTH).fill(null);
        status.value         = saved.status ?? 'playing';
        hintsRemaining.value = saved.hintsRemaining ?? 3;
        hintedSlots.value    = saved.hintedSlots ?? {};
        hintsUsed.value      = saved.hintsUsed ?? 0;

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

  function removeColor(index: number) {
    if (status.value !== 'playing') return;
    currentGuess.value[index] = null;
  }

  const canSubmit = computed(() =>
    status.value === 'playing' &&
    currentGuess.value.every(guess => guess !== null)
  )

  function submitGuess() {
    if (!canSubmit.value) return;
    const colors = currentGuess.value as ColorId[];
    const feedback = checkGuess(code, colors);
    guesses.value.push({ colors, feedback });
    currentGuess.value = Array(CODE_LENGTH).fill(null);

    if (feedback.black === CODE_LENGTH) {
      status.value = 'won';
      updateStats(true);
    } else if (guesses.value.length >= MAX_GUESSES) {
      status.value = 'lost';
      updateStats(false);
    }

    saveState();
  }

  function updateStats(won: boolean) {
    const s = stats.value;
    s.gamesPlayed++;
    if (won) {
      s.gamesWon++;
      s.currentStreak++;
      s.maxStreak = Math.max(s.maxStreak, s.currentStreak);
      s.guessDistribution[guesses.value.length - 1]!++;
    } else {
      s.currentStreak = 0;
    }
    saveStats();
  }

  function buildShareText(): string {
    const result = status.value === 'won'
      ? `${guesses.value.length}/${MAX_GUESSES}${hintsUsed.value > 0 ? ' 💡' : ''}`
      : `X/${MAX_GUESSES}`

    const rows = guesses.value.map(guess =>
      [
        ...Array(guess.feedback.black).fill('⬛'),
        ...Array(guess.feedback.white).fill('⬜'),
      ].join('')
    )
    return `ColorPass #${puzzleNumber} ${result}\n\n${rows.join('\n')}`
  };

  function useHint() {
    if (hintsRemaining.value === 0 || status.value !== 'playing') return;

    const allPositions = [0, 1, 2, 3, 4];
    const unhinted = allPositions.filter(i => !(i in hintedSlots.value));
    if (unhinted.length === 0) return;

    // Priority 1: first empty slot in currentGuess that hasn't been hinted
    const emptyUnhinted = unhinted.filter(i => currentGuess.value[i] === null);
    // Priority 2: positions player has never gotten correct in any past guess
    const neverCorrect = unhinted.filter(i =>
      !guesses.value.some(g => g.colors[i] === code[i])
    );

    const candidate =
      emptyUnhinted[0] ??
      neverCorrect[0] ??
      unhinted[Math.floor(Math.random() * unhinted.length)]!

    hintedSlots.value = { ...hintedSlots.value, [candidate]: code[candidate]! };
    hintsRemaining.value--;
    hintsUsed.value++;
    saveState();
  }


  onMounted(loadState);

  return {
    guesses,
    currentGuess,
    status,
    stats,
    puzzleNumber,
    secretCode: code,
    addColor,
    removeColor,
    canSubmit,
    submitGuess,
    buildShareText,
    MAX_GUESSES,
    CODE_LENGTH,
    hintsRemaining,
    hintedSlots,
    hintsUsed,
    useHint
  }
}