import { ref, onMounted } from 'vue'
import { getRepoPath } from '../lib/utils'
import type { CommitInfo, CachedData } from '../lib/types'

const CACHE_PREFIX = 'noctis_gh_stats_'
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

// 全局并发控制器
const MAX_CONCURRENT_REQUESTS = 2
let currentRequests = 0
const requestQueue: (() => void)[] = []

const processQueue = () => {
  if (currentRequests < MAX_CONCURRENT_REQUESTS && requestQueue.length > 0) {
    const next = requestQueue.shift()
    next?.()
  }
}

/**
 * GitHub 统计信息组合式函数
 * @param repoUrl GitHub 仓库 URL
 * @param immediate 是否立即加载（默认为 true，如果为 false 则需要手动调用 fetchStats）
 */
export function useGitHubStats(repoUrl: string, immediate = true) {
  const loading = ref(true)
  const error = ref(false)
  const latestCommit = ref<CommitInfo | null>(null)
  const commitActivity = ref<number[]>([])
  const totalCommits = ref<number | string>('-')
  const isLoaded = ref(false)

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
    } catch {
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

  const executeFetch = async (repoPath: string) => {
    try {
      currentRequests++
      
      // 1. 获取最新提交
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000) // 8秒超时
      
      try {
        const commitRes = await fetch(`https://api.github.com/repos/${repoPath}/commits?per_page=1`, {
          signal: controller.signal
        })
        
        // 专门处理速率限制
        if (commitRes.status === 403 || commitRes.status === 429) {
          console.warn(`GitHub API Rate Limit Exceeded for ${repoPath}`)
          throw new Error('Rate Limit')
        }
        
        if (!commitRes.ok) throw new Error('Failed to fetch commits')
        
        const commitData = await commitRes.json()
        if (Array.isArray(commitData) && commitData.length > 0) {
          const c = commitData[0]
          // 防御式解析，避免 undefined 错误
          if (c?.commit) {
            latestCommit.value = {
              message: c.commit.message || 'No message',
              authorName: c.commit.author?.name || 'Unknown',
              authorAvatar: c.author?.avatar_url || `https://ui-avatars.com/api/?name=${c.commit.author?.name || 'Unknown'}`,
              date: c.commit.author?.date || new Date().toISOString(),
              sha: c.sha ? c.sha.substring(0, 7) : '???????',
              htmlUrl: c.html_url || '#'
            }
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
        // 复用 controller 或者新建一个？通常复用即可，或者给第二个请求单独的超时
        const statsRes = await fetch(`https://api.github.com/repos/${repoPath}/stats/participation`, {
          signal: controller.signal
        })
        if (statsRes.ok) {
          const statsData = await statsRes.json()
          // 使用最近 12 周的数据
          if (statsData?.all && Array.isArray(statsData.all)) {
            commitActivity.value = statsData.all.slice(-12)
          }
        }
      } finally {
        clearTimeout(timeoutId)
      }

      saveToCache(repoPath)

    } catch (e) {
      console.error(`GitHub API Error (${repoPath}):`, e)
      error.value = true
      
      // 兜底策略：失败时尝试加载旧缓存（如果存在且已过期，也尝试使用）
      // 即使 API 挂了或者限流，只要本地有历史数据，就优先展示历史数据而不是报错
      try {
        const cached = localStorage.getItem(CACHE_PREFIX + repoPath)
        if (cached) {
          const parsed: CachedData = JSON.parse(cached)
          // 即使过期也使用
          latestCommit.value = parsed.data.latestCommit
          commitActivity.value = parsed.data.commitActivity
          totalCommits.value = parsed.data.totalCommits
          error.value = false // 有缓存就不算完全失败，隐藏错误提示
        }
      } catch {
        // 忽略解析错误
      }
      
    } finally {
      loading.value = false
      currentRequests--
      processQueue()
    }
  }

  const fetchStats = async () => {
    if (isLoaded.value) return // 避免重复加载
    isLoaded.value = true
    
    const repoPath = getRepoPath(repoUrl)
    if (!repoPath) {
      error.value = true
      loading.value = false
      return
    }

    // 尝试读取缓存 (有效缓存)
    if (loadFromCache(repoPath)) {
      loading.value = false
      return
    }

    // 加入请求队列
    if (currentRequests < MAX_CONCURRENT_REQUESTS) {
      executeFetch(repoPath)
    } else {
      requestQueue.push(() => executeFetch(repoPath))
    }
  }

  onMounted(() => {
    if (immediate) {
      fetchStats()
    }
  })

  return {
    loading,
    error,
    latestCommit,
    commitActivity,
    totalCommits,
    fetchStats // 暴露手动触发方法
  }
}
