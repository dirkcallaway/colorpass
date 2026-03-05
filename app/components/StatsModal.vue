<script setup lang="ts">
import {
  Dialog, DialogPanel, DialogTitle,
  TransitionRoot, TransitionChild
} from '@headlessui/vue'
import { useClipboard } from '@vueuse/core'
import type { GameStats } from '~/composables/useGameState'

const props = defineProps<{
  open: boolean
  stats: GameStats
  status: 'playing' | 'won' | 'lost'
  buildShareText: () => string
  puzzleNumber: number
}>();

const emit = defineEmits<{ close: [] }>();

const { copy, copied } = useClipboard();

async function share() {
  const text = props.buildShareText();
  if (navigator.share) {
    await navigator.share({ text });
  } else {
    copy(text);
  }
}

const winPercentage = computed(() =>
  props.stats.gamesPlayed === 0 ? 0
  : Math.round((props.stats.gamesWon / props.stats.gamesPlayed) * 100)
);

const maxBar = computed(() => Math.max(...props.stats.guessDistribution, 1))

// Countdown to midnight
const timeUntilNext = ref('')
function updateCountdown() {
  const now = new Date()
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0)
  const diff = midnight.getTime() - now.getTime()
  const h = Math.floor(diff / 3600000).toString().padStart(2, '0')
  const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0')
  const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0')
  timeUntilNext.value = `${h}:${m}:${s}`
}

let timer: ReturnType<typeof setInterval>
onMounted(() => { updateCountdown(); timer = setInterval(updateCountdown, 1000) })
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <TransitionRoot :show="open" as="template">
    <Dialog @close="emit('close')" class="relative z-50">
      <div class="fixed inset-0 bg-black/60" aria-hidden="true" />
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <TransitionChild
          as="template"
          enter="ease-out duration-200" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100"
          leave="ease-in duration-150" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95"
        >
          <DialogPanel class="bg-gray-800 rounded-xl p-6 max-w-sm w-full text-white shadow-xl">
            <DialogTitle class="text-xl font-bold mb-5 text-center tracking-wide">Statistics</DialogTitle>

            <!-- Stat boxes -->
            <div class="grid grid-cols-4 gap-2 text-center mb-6">
              <div v-for="stat in [
                { label: 'Played',   value: stats.gamesPlayed },
                { label: 'Win %',    value: winPercentage },
                { label: 'Streak',   value: stats.currentStreak },
                { label: 'Best',     value: stats.maxStreak },
              ]" :key="stat.label">
                <div class="text-3xl font-bold">{{ stat.value }}</div>
                <div class="text-xs text-gray-400 mt-1">{{ stat.label }}</div>
              </div>
            </div>

            <!-- Guess distribution -->
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Guess Distribution</p>
            <div class="space-y-1 mb-6">
              <div
                v-for="(count, i) in stats.guessDistribution"
                :key="i"
                class="flex items-center gap-2 text-sm"
              >
                <span class="w-3 text-right text-gray-400">{{ i + 1 }}</span>
                <div
                  class="bg-indigo-600 rounded text-right pr-2 text-xs font-bold min-w-[1.5rem] h-5 flex items-center justify-end transition-all"
                  :style="{ width: `${Math.max((count / maxBar) * 100, 8)}%` }"
                >
                  {{ count }}
                </div>
              </div>
            </div>

            <!-- Next puzzle countdown -->
            <div v-if="status !== 'playing'" class="text-center mb-5">
              <p class="text-xs text-gray-400 uppercase tracking-widest">Next puzzle in</p>
              <p class="text-2xl font-mono font-bold">{{ timeUntilNext }}</p>
            </div>

            <!-- Share button -->
            <button
              v-if="status !== 'playing'"
              @click="share"
              class="w-full bg-green-600 hover:bg-green-500 rounded-lg py-2 font-semibold transition flex items-center justify-center gap-2"
            >
              <span>{{ copied ? 'Copied!' : 'Share Results' }}</span>
            </button>

            <button
              @click="emit('close')"
              class="mt-3 w-full text-sm text-gray-400 hover:text-white transition"
            >
              Close
            </button>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
