<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const props = defineProps<{
  repoUrl: string
}>()

interface CommitInfo {
  message: string
  authorName: string
  authorAvatar: string
  date: string
  sha: string
  htmlUrl: string
}

interface CachedData {
  timestamp: number
  data: {
    latestCommit: CommitInfo
    commitActivity: number[]
    totalCommits: number | string
  }
}

const loading = ref(true)
const error = ref(false)
const latestCommit = ref<CommitInfo | null>(null)
const commitActivity = ref<number[]>([])
const totalCommits = ref<number | string>('-')

const CACHE_PREFIX = 'noctis_gh_stats_'
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

const getRepoPath = (url: string) => {
  try {
    const urlObj = new URL(url)
    return urlObj.pathname.replace(/^\//, '').replace(/\/$/, '')
  } catch (e) {
    return ''
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 1) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 30) return `${diffDays} days ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

const sparklinePath = computed(() => {
  if (commitActivity.value.length === 0) return ''
  
  const data = commitActivity.value
  const width = 100
  const height = 30
  const max = Math.max(...data, 1) // 防止除以零
  const step = width / Math.max(data.length - 1, 1)
  
  // 构建路径
  let path = `M 0 ${height - ((data[0] || 0) / max) * height}`
  
  for (let i = 1; i < data.length; i++) {
    const x = i * step
    const y = height - ((data[i] || 0) / max) * height
    path += ` L ${x} ${y}`
  }
  
  return path
})

const loadFromCache = (repoPath: string): boolean => {
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + repoPath)
    if (!cached) return false
    
    const parsed: CachedData = JSON.parse(cached)
    if (Date.now() - parsed.timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_PREFIX + repoPath)
      return false
    }
    
    latestCommit.value = parsed.data.latestCommit
    commitActivity.value = parsed.data.commitActivity
    totalCommits.value = parsed.data.totalCommits
    return true
  } catch (e) {
    return false
  }
}

const saveToCache = (repoPath: string) => {
  if (!latestCommit.value) return
  
  const cacheData: CachedData = {
    timestamp: Date.now(),
    data: {
      latestCommit: latestCommit.value,
      commitActivity: commitActivity.value,
      totalCommits: totalCommits.value
    }
  }
  localStorage.setItem(CACHE_PREFIX + repoPath, JSON.stringify(cacheData))
}

onMounted(async () => {
  const repoPath = getRepoPath(props.repoUrl)
  if (!repoPath) {
    error.value = true
    loading.value = false
    return
  }

  // 尝试读取缓存
  if (loadFromCache(repoPath)) {
    loading.value = false
    // 可以在后台更新缓存，但为了避免速率限制，这里仅使用缓存
    return
  }

  try {
    // 1. 获取最新提交
    const commitRes = await fetch(`https://api.github.com/repos/${repoPath}/commits?per_page=1`)
    
    // 专门处理速率限制
    if (commitRes.status === 403 || commitRes.status === 429) {
      console.warn('GitHub API Rate Limit Exceeded')
      throw new Error('Rate Limit')
    }
    
    if (!commitRes.ok) throw new Error('Failed to fetch commits')
    
    const commitData = await commitRes.json()
    if (commitData.length > 0) {
      const c = commitData[0]
      latestCommit.value = {
        message: c.commit.message,
        authorName: c.commit.author.name,
        authorAvatar: c.author ? c.author.avatar_url : `https://ui-avatars.com/api/?name=${c.commit.author.name}`,
        date: c.commit.author.date,
        sha: c.sha.substring(0, 7),
        htmlUrl: c.html_url
      }
      
      // 尝试从 Link header 获取提交总数
      const linkHeader = commitRes.headers.get('Link')
      if (linkHeader) {
        const match = linkHeader.match(/&page=(\d+)>; rel="last"/)
        if (match && match[1]) {
          totalCommits.value = parseInt(match[1])
        }
      }
    }

    // 2. 获取参与度统计
    const statsRes = await fetch(`https://api.github.com/repos/${repoPath}/stats/participation`)
    if (statsRes.ok) {
      const statsData = await statsRes.json()
      // 使用最近 12 周的数据
      if (statsData.all) {
        commitActivity.value = statsData.all.slice(-12)
      }
    }

    saveToCache(repoPath)

  } catch (e) {
    console.error('GitHub API Error:', e)
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>

<template>
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
        <svg viewBox="0 0 100 30" preserveAspectRatio="none" class="w-full h-full overflow-visible">
          <path 
            :d="sparklinePath" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            class="text-noctis-accent"
            vector-effect="non-scaling-stroke"
          />
          <!-- Gradient fill area (optional) -->
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
  
  <!-- Loading State -->
  <div v-else-if="loading" class="mt-6 pt-4 border-t border-white/10 w-full animate-pulse">
    <div class="flex items-center gap-2 mb-2">
      <div class="w-5 h-5 rounded-full bg-white/10"></div>
      <div class="h-3 w-20 bg-white/10 rounded"></div>
    </div>
    <div class="h-3 w-full bg-white/10 rounded mb-2"></div>
    <div class="h-8 w-full bg-white/5 rounded"></div>
  </div>
</template>