<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchDailyQuote, type Quote } from '../../data/quotes'

const quote = ref<Quote | null>(null)

onMounted(async () => {
  quote.value = await fetchDailyQuote()
})
</script>

<template>
  <div class="daily-quote flex flex-col items-end text-right transition-opacity duration-1000" :class="{ 'opacity-0': !quote, 'opacity-100': quote }">
    <template v-if="quote">
      <p class="text-xs md:text-sm font-medium tracking-wide text-gray-300 italic hover:text-white transition-colors cursor-default max-w-[300px]">
        "{{ quote.content }}"
      </p>
      <p class="text-[10px] md:text-xs text-gray-500 font-mono mt-1">
        — {{ quote.author }}
      </p>
    </template>
  </div>
</template>

<style scoped>
/* Scoped styles if needed */
</style>
