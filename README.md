# Project Noctis - 沉浸式个人作品集官网

![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TresJS](https://img.shields.io/badge/TresJS-82DBC5?style=for-the-badge&logo=three.js&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)

> "Noctis" 意为夜。这是一个探索沉浸式网页体验的个人作品集项目，旨在通过 3D 视觉、流畅动画与极简设计，呈现技术与美学的融合。

## 🌐 在线预览

- GitHub Pages：`https://hf-cygg.github.io/Noctis-Portfolio/`

## ✨ 项目亮点

- **沉浸式 3D 体验**: 首屏采用 TresJS 构建的动态粒子球体，结合鼠标交互，打造独特的视觉记忆点。
- **流畅的滚动交互**: 集成 Lenis 平滑滚动与 GSAP ScrollTrigger，实现如丝般顺滑的页面过渡与视差滚动效果。
- **响应式设计**: 完美适配桌面端、iPad 与移动端设备，针对不同屏幕尺寸优化布局与交互逻辑。
- **GitHub 实时集成**: 项目卡片内置实时 GitHub 统计模块，动态展示提交热度（Sparkline）与最新动态。
- **极简暗黑美学**: 采用高质感的暗黑风格 UI，配合毛玻璃特效与精细的排版，突出内容层级。
- **渐进增强与自动降级**: 根据性能档位与系统“减少动态效果”偏好自动降低特效强度，保证可访问性与稳定性。

## 🛠️ 技术栈

### 核心框架
- **Vue 3**: 采用 Composition API 与 `<script setup>` 语法，保证代码的简洁与可维护性。
- **TypeScript**: 全面类型安全，提升开发体验与代码质量。
- **Vite**: 极速的开发服务器与构建工具。

### 视觉与动画
- **TresJS (Three.js for Vue)**: 声明式的 3D 场景构建，用于实现核心的粒子特效。
- **GSAP (GreenSock)**: 强大的动画库，负责复杂的滚动触发动画与时间轴编排。
- **Lenis**: 现代化的平滑滚动库，解决原生滚动的生硬感。
- **Tailwind CSS**: 实用优先的 CSS 框架，快速构建响应式布局。

### 工程质量与可观测性
- **ESLint + vue-tsc**: 代码规范与类型检查。
- **Web Vitals + Long Task 监控**: 采集 CLS / INP / LCP，并监控长任务与资源加载错误，便于线上回溯性能问题。

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm 或 pnpm

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 代码质量检查

```bash
npm run lint
npm run typecheck
```

### 构建生产版本

```bash
npm run build
```

### 本地预览构建

```bash
npm run preview
```

## ⚙️ 开发 / 部署差异说明（重要）

本项目部署在 GitHub Pages 的子路径（`/Noctis-Portfolio/`）下，因此生产构建需要设置 `base` 为该子路径；而开发环境必须使用根路径 `/` 才能正常加载入口脚本与静态资源。

- 开发环境（`npm run dev`）：访问 `http://localhost:5173/`（或被占用后的 5174/5175...）
- GitHub Pages：访问 `https://hf-cygg.github.io/Noctis-Portfolio/`

对应配置位于 `vite.config.ts`，已按 `mode` 自动切换开发/生产的 `base`。

## 📂 项目结构

```
src/
├── assets/          # 静态资源
├── components/      # 组件库
│   ├── Sections/    # 页面主要区块 (Hero, Projects, TechStack)
│   ├── UI/          # 通用 UI 组件
│   ├── OverlayInterface.vue  # 覆盖层 UI
│   ├── ParticleSphere.vue    # 3D 粒子球体组件
│   ├── ProjectStats.vue      # GitHub 统计组件
│   └── TheExperience.vue     # 3D 场景容器
├── composables/      # 组合式逻辑 (性能分级、埋点等)
├── data/            # 静态数据源 (Projects 等)
├── App.vue          # 根组件
├── main.ts          # 入口文件
└── style.css        # 全局样式
```

## 🧩 性能分级与降级策略（简述）

项目内置性能档位（`L0/L1/L2`）用于控制 3D 与动效强度：

- `L0`：桌面高性能设备，启用完整 3D 与动效
- `L1`：中端/移动端设备，降低粒子数量与动效强度
- `L2`：低性能或系统开启“减少动态效果”，关闭 3D，保留内容可读与交互

相关逻辑位于 `src/composables/usePerformance.ts`。

## 📦 部署

本项目配置了 GitHub Actions 工作流，支持自动部署至 GitHub Pages。

1. 确保仓库 Public 或拥有 GitHub Pro 权限。
2. 在仓库设置中开启 GitHub Pages，源选择 `gh-pages` 分支。
3. 推送代码至 `main` 分支，GitHub Actions 将自动构建并部署。

## 🧯 常见问题（FAQ）

### 1) 本地开发打开页面黑屏/资源 404？

优先确认访问的是根路径：

- ✅ `http://localhost:5173/`（或 5174/5175...）
- ❌ `http://localhost:5173/Noctis-Portfolio/`（这个路径是给 GitHub Pages 用的）

如果你刚改了 Vite 配置，建议重启开发服务器。

### 2) 在低端设备上卡顿怎么办？

项目会自动根据性能表现与系统偏好降级到 `L1/L2`。你也可以在系统中开启“减少动态效果（Reduce Motion）”，页面会自动关闭 3D 并保留完整内容。

## 📄 许可证

[MIT License](LICENSE) © 2026 Project Noctis
