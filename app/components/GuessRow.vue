<script setup lang="ts">
import { COLORS, type ColorId, type Feedback } from '~/utils/colorpass';

const props = defineProps<{
  colors: (ColorId | null)[];
  feedback?: Feedback;
  isActive?: boolean;
  hintedSlots?: Record<number, ColorId>;
}>();

const emit = defineEmits<{ remove: [index: number ] }>();

function colorBg(id: ColorId | null) {
  if (!id) return 'bg-gray-700';
  return COLORS.find(c => c.id === id)?.bg ?? 'bg-gray-700';
}

function hintRing(index: number): string {
  const hintColor = props.hintedSlots?.[index]
  if (!hintColor) return ''
  return COLORS.find(c => c.id === hintColor)?.ring ?? ''
}
</script>

<template>
  <div class="flex items-center gap-3">
    <div class="w-10" />
    <div class="flex gap-2">
      <button
        v-for="(color, i) in colors"
        :key="i"
        class="w-10 h-10 rounded-full border-2 transition-all"
        :class="[
          colorBg(color),
          isActive && color ? 'border-white cursor-pointer hover:scale-110' : 'border-gray-600 cursor-default',
          hintRing(i) ? `ring-4 ring-offset-2 ring-offset-gray-900 ${hintRing(i)}` : ''
        ]"
        @click="isActive && color ? emit('remove', i) : undefined"
      />
    </div>

    <FeedbackPegs
      v-if="feedback"
      :black="feedback.black"
      :white="feedback.white"
    />
    <div v-else class="w-10" />
  </div>
</template>