# Project Noctis - 沉浸式个人作品集官网

![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TresJS](https://img.shields.io/badge/TresJS-82DBC5?style=for-the-badge&logo=three.js&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)

> "Noctis" 意为夜。这是一个探索沉浸式网页体验的个人作品集项目，旨在通过 3D 视觉、流畅动画与极简设计，呈现技术与美学的融合。

## ✨ 项目亮点

- **沉浸式 3D 体验**: 首屏采用 TresJS 构建的动态粒子球体，结合鼠标交互，打造独特的视觉记忆点。
- **流畅的滚动交互**: 集成 Lenis 平滑滚动与 GSAP ScrollTrigger，实现如丝般顺滑的页面过渡与视差滚动效果。
- **响应式设计**: 完美适配桌面端、iPad 与移动端设备，针对不同屏幕尺寸优化布局与交互逻辑。
- **GitHub 实时集成**: 项目卡片内置实时 GitHub 统计模块，动态展示提交热度（Sparkline）与最新动态。
- **极简暗黑美学**: 采用高质感的暗黑风格 UI，配合毛玻璃特效与精细的排版，突出内容层级。

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

### 构建生产版本

```bash
npm run build
```

### 本地预览构建

```bash
npm run preview
```

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
├── data/            # 静态数据源 (Projects 等)
├── App.vue          # 根组件
├── main.ts          # 入口文件
└── style.css        # 全局样式
```

## 📦 部署

本项目配置了 GitHub Actions 工作流，支持自动部署至 GitHub Pages。

1. 确保仓库 Public 或拥有 GitHub Pro 权限。
2. 在仓库设置中开启 GitHub Pages，源选择 `gh-pages` 分支。
3. 推送代码至 `main` 分支，GitHub Actions 将自动构建并部署。

## 📄 许可证

[MIT License](LICENSE) © 2026 Project Noctis
