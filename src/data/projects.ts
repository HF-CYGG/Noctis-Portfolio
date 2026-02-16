// 项目链接集合，用于展示 Repo/Demo/文档
export interface ProjectLinks {
  repo?: string
  demo?: string
  docs?: string
}

// 项目标准化结构，遵循“价值-职责-方案-结果-链接”的模板
export interface Project {
  title: string
  value: string
  responsibility: string
  approach: string[]
  impact: string
  tags: string[]
  links: ProjectLinks
}

export const projects: Project[] = [
  {
    title: 'EquipTrack',
    value: '让物资流转可追踪、可预警、可审计。',
    responsibility: '独立完成 Android 客户端与服务端架构、核心功能与部署。',
    approach: [
      'Kotlin + Room 设计离线缓存与同步机制，确保现场无网可用。',
      'Spring Boot 提供统一 REST API 与权限边界，保持业务一致性。',
      '关键流程补充状态流转与日志追踪，方便溯源与审计。'
    ],
    impact: '实现全流程数字化监控，减少信息滞后与追踪成本。',
    tags: ['Kotlin', 'Android', 'Java', 'Spring Boot'],
    links: {
      repo: 'https://github.com/HF-CYGG/EquipTrack'
    }
  },
  {
    title: 'Dawn-Course',
    value: '提供无广告、低打扰的课程管理体验。',
    responsibility: '负责 Android 客户端核心功能与交互体验。',
    approach: [
      '遵循 Material Design 规范，统一视觉层级与交互反馈。',
      'Room 本地数据库存储课程与时间表，支持快速查询。',
      '简化主流程操作路径，减少查课与编辑成本。'
    ],
    impact: '解决广告与复杂操作痛点，提升查课效率与使用体验。',
    tags: ['Android', 'Kotlin', 'Material Design', 'Room'],
    links: {
      repo: 'https://github.com/HF-CYGG/Dawn-Course'
    }
  },
  {
    title: 'InfraCount',
    value: '帮助商家实时汇聚 IoT 计数数据并形成可用洞察。',
    responsibility: '负责后端服务与数据统计链路设计。',
    approach: [
      'Python 服务接入设备上报数据，统一清洗与校验。',
      '按设备与时间维度做聚合统计，输出可视化接口。',
      '对异常数据做过滤与记录，保证统计可信。'
    ],
    impact: '解决数据离散无法实时聚合的问题，支撑业务决策。',
    tags: ['IoT', 'Server', 'Data Viz', 'Python'],
    links: {
      repo: 'https://github.com/HF-CYGG/InfraCount'
    }
  },
  {
    title: 'QQ Emote Deck',
    value: '提升 QQ 表情包整理与发送效率。',
    responsibility: '负责插件功能设计与实现。',
    approach: [
      '适配 QQNT 新架构，保持插件与客户端稳定协作。',
      '基于 Electron 构建管理 UI，优化整理流程。',
      '支持快速检索与分组管理，降低操作成本。'
    ],
    impact: '提升表情包整理与发送效率，优化日常使用体验。',
    tags: ['JavaScript', 'QQNT', 'Plugin', 'Electron'],
    links: {
      repo: 'https://github.com/HF-CYGG/qq-emote-deck'
    }
  }
]
