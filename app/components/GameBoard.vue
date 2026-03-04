<script setup lang="ts">
import type { GuessRecord } from '~/composables/useGameState';
import type { ColorId } from '~/utils/colorpass';

const props = defineProps<{
  guesses: GuessRecord[];
  currentGuess: (ColorId | null)[];
  status: 'playing' | 'won' | 'lost';
  maxGuesses: number;
  hintedSlots: Record<number, ColorId>;
}>();

const emit = defineEmits<{ removeColor: [index: number] }>();

const rows = computed(() => {
  const result: { colors: (ColorId | null)[], feedback: any, isActive: boolean, hintedSlots?: Record<number, ColorId> }[] = [];
  
  for (const guess of props.guesses) {
    result.push({ colors: guess.colors, feedback: guess.feedback, isActive: false });
  }

  if (props.status === 'playing') {
    result.push({ colors: props.currentGuess, feedback: undefined, isActive: true, hintedSlots: props.hintedSlots });
  }

  const remaining = props.maxGuesses - result.length;
  for (let i = 0; i < remaining; i++) {
    result.push({ colors: Array(5).fill(null), feedback: undefined, isActive: false });
  }

  return result;
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <GuessRow
      v-for="(row, i) in rows"
      :key="i"
      :colors="row.colors"
      :feedback="row.feedback"
      :is-active="row.isActive"
      :hinted-slots="row.hintedSlots"
      @remove="emit('removeColor', $event)"
    />
  </div>
</template>