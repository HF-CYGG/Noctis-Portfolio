import { ref, onMounted } from 'vue'
import { getRepoPath } from '../lib/utils'
import type { CommitInfo, CachedData } from '../lib/types'

const CACHE_PREFIX = 'noctis_gh_stats_'
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

/**
 * GitHub 统计信息组合式函数
 * @param repoUrl GitHub 仓库 URL
 */
export function useGitHubStats(repoUrl: string) {
  const loading = ref(true)
  const error = ref(false)
  const latestCommit = ref<CommitInfo | null>(null)
  const commitActivity = ref<number[]>([])
  const totalCommits = ref<number | string>('-')

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

  const fetchStats = async () => {
    const repoPath = getRepoPath(repoUrl)
    if (!repoPath) {
      error.value = true
      loading.value = false
      return
    }

    // 尝试读取缓存
    if (loadFromCache(repoPath)) {
      loading.value = false
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
  }

  onMounted(fetchStats)

  return {
    loading,
    error,
    latestCommit,
    commitActivity,
    totalCommits
  }
}
