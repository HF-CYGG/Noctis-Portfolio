/**
 * GitHub 仓库提交信息接口
 */
export interface CommitInfo {
  message: string
  authorName: string
  authorAvatar: string
  date: string
  sha: string
  htmlUrl: string
}

/**
 * 缓存数据结构接口
 */
export interface CachedData {
  timestamp: number
  data: {
    latestCommit: CommitInfo
    commitActivity: number[]
    totalCommits: number | string
  }
}
