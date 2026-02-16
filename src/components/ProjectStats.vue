<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useGitHubStats } from '../composables/useGitHubStats'
import { formatRelativeDate, generateSparklinePath } from '../lib/utils'

const props = defineProps<{
  repoUrl: string
}>()

const rootEl = ref<HTMLElement | null>(null)
const isVisible = ref(false)

// 默认不加载，等待 IntersectionObserver 触发
const { loading, error, latestCommit, commitActivity, totalCommits, fetchStats } = useGitHubStats(props.repoUrl, false)

const sparklinePath = computed(() => generateSparklinePath(commitActivity.value))

const formatDate = (dateString: string) => formatRelativeDate(dateString)

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!rootEl.value) return
  
  observer = new IntersectionObserver((entries) => {
    if (entries[0] && entries[0].isIntersecting) {
      isVisible.value = true
      fetchStats()
      // 一旦触发，就停止观察
      observer?.disconnect()
    }
  }, {
    rootMargin: '100px', // 提前 100px 加载
    threshold: 0.1
  })
  
  observer.observe(rootEl.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div ref="rootEl" class="w-full">
    <div v-if="!loading && !error && latestCommit" class="mt-6 pt-4 border-t border-white/10 w-full">
      <!-- Header: Avatar, Author, Time -->
      <div class="flex items-center gap-2 mb-2">
        <img :src="latestCommit.authorAvatar" :alt="latestCommit.authorName" class="w-5 h-5 rounded-full border border-white/20">
        <div class="flex items-baseline gap-2 text-xs">
          <span class="font-bold text-gray-300">{{ latestCommit.authorName }}</span>
          <span class="text-gray-500">{{ formatDate(latestCommit.date) }}</span>
        </div>
        <a :href="latestCommit.htmlUrl" target="_blank" class="ml-auto font-mono text-[10px] text-noctis-accent/70 hover:text-noctis-accent bg-noctis-accent/5 px-1.5 py-0.5 rounded border border-noctis-accent/10 transition-colors">
          {{ latestCommit.sha }}
        </a>
      </div>
      
      <!-- Commit Message -->
      <div class="text-xs text-gray-400 line-clamp-2 mb-3 font-mono leading-relaxed group/commit">
        <a :href="latestCommit.htmlUrl" target="_blank" class="hover:text-gray-300 transition-colors">
          {{ latestCommit.message }}
        </a>
      </div>
      
      <!-- Footer: Sparkline & Count -->
      <div class="flex items-end justify-between gap-4 h-8">
        <!-- Sparkline -->
        <div class="flex-1 h-full flex items-end opacity-60 group-hover:opacity-100 transition-opacity">
          <!-- Only render SVG if we have activity data to save resources -->
          <svg v-if="commitActivity.length" viewBox="0 0 100 30" preserveAspectRatio="none" class="w-full h-full overflow-visible">
            <path 
              :d="sparklinePath" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              class="text-noctis-accent"
              vector-effect="non-scaling-stroke"
            />
            <path 
              :d="`${sparklinePath} L 100 30 L 0 30 Z`" 
              fill="currentColor" 
              class="text-noctis-accent/10"
              stroke="none"
            />
          </svg>
        </div>
        
        <!-- Commit Count -->
        <div class="flex items-center gap-1.5 text-xs text-gray-500 font-mono whitespace-nowrap">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-history"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12"/><path d="M3 3v9h9"/></svg>
          <span>{{ totalCommits }} Commits</span>
        </div>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="mt-6 pt-4 border-t border-white/10 w-full min-h-[110px] flex flex-col justify-center">
      <div class="flex items-center gap-2 text-xs text-red-400/80 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>Unable to load stats</span>
      </div>
      <div class="text-[10px] text-gray-500 font-mono">
        Rate limit exceeded or network error.
      </div>
    </div>
    
    <!-- Loading State (Show when loading OR when waiting for visibility) -->
    <div v-else-if="loading || !isVisible" class="mt-6 pt-4 border-t border-white/10 w-full animate-pulse min-h-[110px]">
      <div class="flex items-center gap-2 mb-2">
        <div class="w-5 h-5 rounded-full bg-white/10"></div>
        <div class="h-3 w-20 bg-white/10 rounded"></div>
      </div>
      <!-- Placeholder for commit message (2 lines approx) -->
      <div class="h-8 w-full bg-white/10 rounded mb-3"></div>
      <!-- Placeholder for footer -->
      <div class="h-8 w-full bg-white/5 rounded"></div>
    </div>
  </div>
</template>