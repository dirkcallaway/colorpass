<script setup lang="ts">
import {
  Dialog, DialogPanel, DialogTitle,
  TransitionRoot, TransitionChild
} from '@headlessui/vue'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()
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
            <DialogTitle class="text-xl font-bold mb-4 text-center">How to Play</DialogTitle>

            <ul class="space-y-2 text-sm text-gray-300 list-disc list-inside">
              <li>Guess the secret 5-color code in 8 tries.</li>
              <li>Colors <strong class="text-white">can repeat</strong> in the code.</li>
              <li>After each guess you get feedback:</li>
            </ul>

            <div class="mt-4 space-y-3 text-sm">
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 rounded-full bg-gray-900 ring-2 ring-white flex-shrink-0" />
                <span><strong class="text-white">Black peg</strong> — right color, right position</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 rounded-full bg-white flex-shrink-0" />
                <span><strong class="text-white">White peg</strong> — right color, wrong position</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 rounded-full bg-gray-700 flex-shrink-0" />
                <span class="text-gray-400">Empty — color not in the code at all</span>
              </div>
            </div>

            <p class="mt-5 text-xs text-gray-500 text-center">A new puzzle every day!</p>

            <button
              @click="emit('close')"
              class="mt-5 w-full bg-indigo-600 hover:bg-indigo-500 rounded-lg py-2 font-semibold transition"
            >
              Let's Play
            </button>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
