<script setup lang="ts">
const props = defineProps<{ black: number, white: number }>();

const pegs = computed(() => [
  ...Array(props.black).fill('black'),
  ...Array(props.white).fill('white'),
  ...Array(5 - props.black - props.white).fill('empty'),
]);
</script>

<template>
  <div class="grid grid-cols-3 gap-0.5 w-10">
    <div
      v-for="(peg, i) in pegs"
      :key="i"
      class="w-2.5 h-2.5 rounded-full"
      :class="{
        'bg-gray-900 ring-1 ring-white': peg === 'black',
        'bg-white':                      peg === 'white',
        'bg-gray-700':                   peg === 'empty',
      }"
    />
  </div>
</template>