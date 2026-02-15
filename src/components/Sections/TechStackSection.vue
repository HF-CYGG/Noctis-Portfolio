<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../../data/projects'

gsap.registerPlugin(ScrollTrigger)

let ctx: gsap.Context | null = null

// 用于存储当前悬停的技术项相关的项目
const relatedProjects = ref<string[]>([])
// 悬停元素的位置，用于定位提示框
const tooltipPosition = ref({ x: 0, y: 0 })
const showTooltip = ref(false)

// 技术栈映射关系，将技术名称映射到项目标签
const techMap: Record<string, string[]> = {
  'Android (Kotlin)': ['Android', 'Kotlin'],
  'TypeScript/JS': ['JavaScript', 'TypeScript', 'JS'],
  'Vue 3': ['Vue', 'Vue 3'],
  'Python': ['Python'],
  'Java': ['Java'],
  'Rust (探索中)': ['Rust'],
  'Go (探索中)': ['Go'],
  'Docker': ['Docker'],
  'Linux': ['Linux'],
  'Git': ['Git']
}

// 处理鼠标进入事件
const handleMouseEnter = (event: MouseEvent, techName: string) => {
  const tags = techMap[techName] || []
  if (tags.length === 0) return

  // 查找包含相关标签的项目
  const matching = projects
    .filter(p => p.tags.some(t => tags.some(tag => t.toLowerCase().includes(tag.toLowerCase()))))
    .map(p => p.title)

  if (matching.length > 0) {
    relatedProjects.value = matching
    const target = event.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    
    // 设置提示框位置在元素上方居中
    tooltipPosition.value = {
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    }
    showTooltip.value = true
  }
}

// 处理鼠标离开事件
const handleMouseLeave = () => {
  showTooltip.value = false
  relatedProjects.value = []
}

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from(".tech-item", {
      y: 50,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      scrollTrigger: {
        trigger: "#tech-stack",
        start: "top center",
        end: "bottom bottom",
        toggleActions: "play none none reverse"
      }
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <section id="tech-stack" class="min-h-screen flex flex-col justify-center items-center text-white p-4 sm:p-8 relative z-10">
    <h2 class="text-4xl md:text-6xl font-bold mb-16 tracking-tight text-center">核心技术栈</h2>
    
    <!-- Tooltip -->
    <div 
      v-show="showTooltip"
      class="fixed z-50 px-3 py-2 bg-noctis-accent/90 text-black font-bold text-sm rounded shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full transition-opacity duration-200"
      :style="{ left: `${tooltipPosition.x}px`, top: `${tooltipPosition.y}px` }"
    >
      <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 bg-noctis-accent/90 rotate-45"></div>
      {{ relatedProjects.join(', ') }}
    </div>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-4xl w-full">
      <!-- Frontend/Mobile -->
      <div class="tech-category space-y-4">
        <h3 class="text-sm font-mono text-noctis-accent uppercase tracking-wider mb-6">前端与移动端</h3>
        <div 
          class="tech-item flex items-center gap-3 p-3 border border-white/10 bg-white/5 rounded-lg backdrop-blur-sm hover:border-noctis-accent/50 hover:bg-white/10 transition-colors cursor-default"
          @mouseenter="handleMouseEnter($event, 'Android (Kotlin)')"
          @mouseleave="handleMouseLeave"
        >
          <span class="font-bold">Android (Kotlin)</span>
        </div>
        <div 
          class="tech-item flex items-center gap-3 p-3 border border-white/10 bg-white/5 rounded-lg backdrop-blur-sm hover:border-noctis-accent/50 hover:bg-white/10 transition-colors cursor-default"
          @mouseenter="handleMouseEnter($event, 'TypeScript/JS')"
          @mouseleave="handleMouseLeave"
        >
          <span class="font-bold">TypeScript/JS</span>
        </div>
        <div 
          class="tech-item flex items-center gap-3 p-3 border border-white/10 bg-white/5 rounded-lg backdrop-blur-sm hover:border-noctis-accent/50 hover:bg-white/10 transition-colors cursor-default"
          @mouseenter="handleMouseEnter($event, 'Vue 3')"
          @mouseleave="handleMouseLeave"
        >
          <span class="font-bold">Vue 3</span>
        </div>
      </div>
      
      <!-- Backend -->
      <div class="tech-category space-y-4">
        <h3 class="text-sm font-mono text-noctis-accent uppercase tracking-wider mb-6">后端开发</h3>
        <div 
          class="tech-item flex items-center gap-3 p-3 border border-white/10 bg-white/5 rounded-lg backdrop-blur-sm hover:border-noctis-accent/50 hover:bg-white/10 transition-colors cursor-default"
          @mouseenter="handleMouseEnter($event, 'Python')"
          @mouseleave="handleMouseLeave"
        >
          <span class="font-bold">Python</span>
        </div>
        <div 
          class="tech-item flex items-center gap-3 p-3 border border-white/10 bg-white/5 rounded-lg backdrop-blur-sm hover:border-noctis-accent/50 hover:bg-white/10 transition-colors cursor-default"
          @mouseenter="handleMouseEnter($event, 'Java')"
          @mouseleave="handleMouseLeave"
        >
          <span class="font-bold">Java</span>
        </div>
        <div 
          class="tech-item flex items-center gap-3 p-3 border border-white/10 bg-white/5 rounded-lg backdrop-blur-sm hover:border-noctis-accent/50 hover:bg-white/10 transition-colors cursor-default"
          @mouseenter="handleMouseEnter($event, 'Rust (探索中)')"
          @mouseleave="handleMouseLeave"
        >
          <span class="font-bold">Rust (探索中)</span>
        </div>
        <div 
          class="tech-item flex items-center gap-3 p-3 border border-white/10 bg-white/5 rounded-lg backdrop-blur-sm hover:border-noctis-accent/50 hover:bg-white/10 transition-colors cursor-default"
          @mouseenter="handleMouseEnter($event, 'Go (探索中)')"
          @mouseleave="handleMouseLeave"
        >
          <span class="font-bold">Go (探索中)</span>
        </div>
      </div>

      <!-- Infrastructure -->
      <div class="tech-category space-y-4">
        <h3 class="text-sm font-mono text-noctis-accent uppercase tracking-wider mb-6">基础设施与工具</h3>
        <div 
          class="tech-item flex items-center gap-3 p-3 border border-white/10 bg-white/5 rounded-lg backdrop-blur-sm hover:border-noctis-accent/50 hover:bg-white/10 transition-colors cursor-default"
          @mouseenter="handleMouseEnter($event, 'Docker')"
          @mouseleave="handleMouseLeave"
        >
          <span class="font-bold">Docker</span>
        </div>
        <div 
          class="tech-item flex items-center gap-3 p-3 border border-white/10 bg-white/5 rounded-lg backdrop-blur-sm hover:border-noctis-accent/50 hover:bg-white/10 transition-colors cursor-default"
          @mouseenter="handleMouseEnter($event, 'Linux')"
          @mouseleave="handleMouseLeave"
        >
          <span class="font-bold">Linux</span>
        </div>
        <div 
          class="tech-item flex items-center gap-3 p-3 border border-white/10 bg-white/5 rounded-lg backdrop-blur-sm hover:border-noctis-accent/50 hover:bg-white/10 transition-colors cursor-default"
          @mouseenter="handleMouseEnter($event, 'Git')"
          @mouseleave="handleMouseLeave"
        >
          <span class="font-bold">Git</span>
        </div>
      </div>

      <!-- Stats / About -->
      <div class="tech-category space-y-4">
        <h3 class="text-sm font-mono text-noctis-accent uppercase tracking-wider mb-6">关于我</h3>
        <div class="tech-item flex items-center gap-3 p-3 border border-white/10 bg-white/5 rounded-lg backdrop-blur-sm">
          <span class="font-bold">Furry 爱好者 ✨</span>
        </div>
        <div class="tech-item flex items-center gap-3 p-3 border border-white/10 bg-white/5 rounded-lg backdrop-blur-sm">
          <span class="font-bold">Web 全栈</span>
        </div>
        <div class="tech-item flex items-center gap-3 p-3 border border-white/10 bg-white/5 rounded-lg backdrop-blur-sm">
          <span class="font-bold">Android 开发</span>
        </div>
      </div>
    </div>
  </section>
</template>
