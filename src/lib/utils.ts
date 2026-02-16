/**
 * 从 GitHub URL 解析仓库路径
 * @param url GitHub 仓库完整 URL
 * @returns 仓库路径 (username/repo) 或空字符串
 */
export const getRepoPath = (url: string): string => {
  try {
    const urlObj = new URL(url)
    return urlObj.pathname.replace(/^\//, '').replace(/\/$/, '')
  } catch {
    return ''
  }
}

/**
 * 格式化相对时间
 * @param dateString 日期字符串
 * @returns 相对时间描述 (Today, Yesterday, X days ago, etc.)
 */
export const formatRelativeDate = (dateString: string): string => {
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

/**
 * 生成 Sparkline SVG 路径
 * @param data 数值数组
 * @param width SVG 宽度
 * @param height SVG 高度
 * @returns SVG Path 字符串
 */
export const generateSparklinePath = (data: number[], width: number = 100, height: number = 30): string => {
  if (data.length === 0) return ''
  
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
}
