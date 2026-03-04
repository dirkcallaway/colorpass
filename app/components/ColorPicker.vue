<script setup lang="ts">
import { COLORS, type ColorId } from '~/utils/colorpass';

const emit = defineEmits<{ pick: [id: ColorId] }>();
</script>

<template>
  <div class="flex gap-3 justify-center flex-wrap">
    <button
      v-for="color in COLORS"
      :key="color.id"
      class="w-12 h-12 rounded-full ring-2 ring-offset-2 ring-offset-gray-900 transition-transform hover:scale-110 active:scale-95"
      :class="[color.bg, color.ring]"
      :aria-label="color.label"
      @click="emit('pick', color.id)"
    />
  </div>
</template>