export interface Project {
  title: string
  desc: string
  tags: string[]
  link: string
}

export const projects: Project[] = [
  {
    title: 'EquipTrack',
    desc: '基于 Kotlin 的全栈物资追踪与管理系统，包含 Android 客户端与服务端，实现高效物资流转监控。',
    tags: ['Kotlin', 'Android', 'Java'],
    link: 'https://github.com/HF-CYGG/EquipTrack'
  },
  {
    title: 'Dawn-Course',
    desc: '遵循 Material Design 设计规范的 Android 课程表应用，极简风格，专注于课程管理体验。',
    tags: ['Android', 'Kotlin', 'Material Design'],
    link: 'https://github.com/HF-CYGG/Dawn-Course'
  },
  {
    title: 'InfraCount',
    desc: '针对淘宝商家硬件定制的 IoT 计数器后端系统，提供实时数据统计与可视化分析。',
    tags: ['IoT', 'Server', 'Data Viz'],
    link: 'https://github.com/HF-CYGG/InfraCount'
  },
  {
    title: 'QQ Emote Deck',
    desc: '基于 QQNT 新架构开发的表情包管理插件，优化表情包整理与发送体验。',
    tags: ['JavaScript', 'QQNT', 'Plugin'],
    link: 'https://github.com/HF-CYGG/qq-emote-deck'
  }
]
