export interface Project {
  title: string
  desc: string
  role: string
  result: string
  tags: string[]
  link: string
}

export const projects: Project[] = [
  {
    title: 'EquipTrack',
    desc: '基于 Kotlin 的全栈物资追踪与管理系统，包含 Android 客户端与服务端。',
    role: '独立全栈开发',
    result: '解决了传统物资管理中信息滞后与追踪困难的问题，实现全流程数字化监控',
    tags: ['Kotlin', 'Android', 'Java', 'Spring Boot'],
    link: 'https://github.com/HF-CYGG/EquipTrack'
  },
  {
    title: 'Dawn-Course',
    desc: '遵循 Material Design 设计规范的 Android 课程表应用，极简风格。',
    role: 'Android 开发',
    result: '解决了现有课程表应用广告繁多与操作复杂的痛点，提供纯净高效的查课体验',
    tags: ['Android', 'Kotlin', 'Material Design', 'Room'],
    link: 'https://github.com/HF-CYGG/Dawn-Course'
  },
  {
    title: 'InfraCount',
    desc: '针对淘宝商家硬件定制的 IoT 计数器后端系统，提供实时数据统计。',
    role: '后端开发',
    result: '解决了硬件设备数据离散无法实时聚合的问题，为商家提供可视化的决策依据',
    tags: ['IoT', 'Server', 'Data Viz', 'Python'],
    link: 'https://github.com/HF-CYGG/InfraCount'
  },
  {
    title: 'QQ Emote Deck',
    desc: '基于 QQNT 新架构开发的表情包管理插件，优化表情包整理体验。',
    role: '插件开发',
    result: '解决了 QQ 原生表情包管理功能单一的问题，提升了表情包整理与发送的效率',
    tags: ['JavaScript', 'QQNT', 'Plugin', 'Electron'],
    link: 'https://github.com/HF-CYGG/qq-emote-deck'
  }
]
