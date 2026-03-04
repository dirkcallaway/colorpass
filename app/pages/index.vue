<script setup lang="ts">
import confetti from 'canvas-confetti';
import { COLORS } from '~/utils/colorpass';

const {
  guesses, currentGuess, status, stats,
  puzzleNumber, secretCode,
  canSubmit, addColor, removeColor, submitGuess, buildShareText,
  MAX_GUESSES, hintsRemaining, hintedSlots, useHint
} = useGameState();

const showHelp  = ref(false);
const showStats = ref(false);

// Auto-show stats modal shortly after game ends
watch(status, (val) => {
  if (val === 'won') {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    })
  }
  if (val !== 'playing') {
    setTimeout(() => showStats.value = true, 1200)
  }
});

onMounted(() => {
  const hasPlayed = localStorage.getItem('colorpass-stats');
  if (!hasPlayed) showHelp.value = true;
});
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col">

    <!-- Header -->
    <header class="flex items-center justify-between px-4 py-3 border-b border-gray-700 max-w-md mx-auto w-full">
      <button
        @click="showHelp = true"
        class="w-8 h-8 rounded-full border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 flex items-center justify-center font-bold transition"
      >
        ?
      </button>
      <div class="text-center">
        <h1 class="text-xl font-bold tracking-widest uppercase">ColorPass</h1>
        <p class="text-xs text-gray-500">#{{ puzzleNumber }}</p>
      </div>
      <button
        @click="showStats = true"
        class="w-8 h-8 rounded-full border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 flex items-center justify-center transition text-base"
      >
        &#x1F4CA;
      </button>
    </header>

    <!-- Game -->
    <main class="flex-1 flex flex-col items-center justify-between py-6 px-4">
      <div class="flex-1 flex items-center">
        <GameBoard
          :guesses="guesses"
          :current-guess="currentGuess"
          :status="status"
          :max-guesses="MAX_GUESSES"
          :hinted-slots="hintedSlots"
          @remove-color="removeColor"
        />
      </div>

      <template v-if="status === 'playing'">
        <div class="flex flex-col items-center gap-4 w-full">
          <ColorPicker @pick="addColor" />
          <div class="flex items-center gap-2">
            <button
              :disabled="hintsRemaining === 0"
              class="px-4 py-2 rounded-full text-sm font-semibold border border-yellow-500 text-yellow-400 disabled:opacity-30 hover:bg-yellow-500/20 transition"
              @click="useHint"
            >
              💡 Hint ({{ hintsRemaining }})
            </button>
          </div>
          <button
            :disabled="!canSubmit"
            class="px-10 py-2 rounded-full font-bold bg-indigo-600 disabled:opacity-30 hover:bg-indigo-500 active:scale-95 transition"
            @click="submitGuess"
          >
            Submit
          </button>
        </div>
      </template>

      <div v-else class="text-center space-y-2">
        <p v-if="status === 'won'" class="text-green-400 font-bold text-lg">You cracked it!</p>
        <div v-else class="flex flex-col items-center gap-2">
          <p class="text-red-400 font-bold text-lg">The code was:</p>
          <div class="flex gap-2">
            <div
              v-for="colorId in secretCode"
              :key="colorId"
              class="w-10 h-10 rounded-full border-2 border-gray-600"
              :class="COLORS.find(c => c.id === colorId)?.bg"
            />
          </div>
        </div>
        <button @click="showStats = true" class="text-sm text-gray-400 underline hover:text-white">
          See stats
        </button>
      </div>
    </main>


    <HelpModal :open="showHelp" @close="showHelp = false" />
    <StatsModal
      :open="showStats"
      :stats="stats"
      :status="status"
      :build-share-text="buildShareText"
      :puzzle-number="puzzleNumber"
      @close="showStats = false"
    />
  </div>
</template>
