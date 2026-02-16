<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
// import { gsap } from 'gsap'
// import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProjectStats from '../ProjectStats.vue'
import { projects } from '../../data/projects'
import { usePerformance } from '../../composables/usePerformance'

// gsap.registerPlugin(ScrollTrigger)

const { trackInteraction } = usePerformance()
const sectionRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
// let mm: gsap.MatchMedia
let mm: any // 使用 any 规避类型检查，因为 gsap 是动态加载的

const isMobile = ref(false)
const activeCardIndex = ref<number | null>(null)

const toggleCard = (index: number) => {
  if (!isMobile.value) return
  if (activeCardIndex.value === index) {
    activeCardIndex.value = null
  } else {
    activeCardIndex.value = index
    const project = projects[index]
    if (project) {
      trackInteraction('project_card_expand', project.title)
    }
  }
}

const trackProjectLink = (type: string, title: string) => {
  trackInteraction(`project_link_${type}`, title)
}

onMounted(async () => {
  isMobile.value = window.innerWidth < 768
  
  // 横向滚动动画
  // 使用 gsap.context 确保动画和 ScrollTrigger 实例在组件卸载时能被正确清理
  // 这对于防止内存泄漏和路由切换时的动画错位至关重要
  const gsap = (await import('gsap')).gsap
  mm = gsap.matchMedia()

  // 仅在非移动端 (>= 768px) 且非 reduced-motion 启用复杂的横向滚动动画
  if (!isMobile.value && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    mm.add("(min-width: 768px)", async () => {
      // 动态导入 GSAP
      const gsap = (await import('gsap')).gsap
      const ScrollTrigger = (await import('gsap/ScrollTrigger')).ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)

      // 0. 获取元素并检查
      const container = containerRef.value
      const section = sectionRef.value
      
      if (!container || !section) return

      // 1. 容器横向滚动逻辑
      const horizontalTween = gsap.to(container, {
        x: () => -(container.scrollWidth - window.innerWidth + 200), // 计算滚动距离
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,     // 固定父容器
          scrub: 1,      // 平滑滚动效果 (1s 延迟)
          start: "top top",
          end: () => "+=" + container.scrollWidth, // 滚动长度等于容器内容宽度
          invalidateOnRefresh: true // 窗口调整大小时重新计算
        }
      })
      
      // 2. 卡片的视差与倾斜效果
      const cards = gsap.utils.toArray<HTMLElement>('.project-card')
      cards.forEach((card) => {
        gsap.to(card, {
          rotationY: 10,
          scrollTrigger: {
            trigger: card,
            start: "left center",
            end: "right center",
            scrub: true,
            containerAnimation: horizontalTween // 链接到横向滚动动画
          }
        })
      })
    })
  }
})

onUnmounted(() => {
  // 严格清理：撤销所有媒体查询相关的动画和 ScrollTrigger
  mm?.revert()
  // 额外清理：确保 ScrollTrigger 刷新，避免幽灵触发器
  ScrollTrigger.refresh()
})
</script>

<template>
  <section ref="sectionRef" id="projects" class="min-h-screen flex flex-col justify-center md:justify-start overflow-hidden py-20 relative">
    <div class="container mx-auto px-4 md:px-8 mb-8 md:absolute md:top-20 md:left-20 z-20">
      <h2 class="text-4xl md:text-6xl font-bold mb-2">THE FORGE</h2>
      <p class="text-gray-400">精选项目展示</p>
    </div>
    
    <div ref="containerRef" class="relative z-10 flex flex-col md:flex-row gap-8 px-4 md:pl-[30vw] md:pr-[10vw] w-full md:w-max md:mt-40">
      <div 
        v-for="(project, index) in projects" 
        :key="index"
        class="project-card group relative w-full md:w-[500px] min-h-[500px] h-auto p-8 border border-white/10 rounded-xl bg-black/40 backdrop-blur-xl hover:bg-white/5 transition-all duration-500 flex flex-col justify-between overflow-hidden"
        :class="{ 'bg-white/5 border-white/30': activeCardIndex === index }"
        @click="toggleCard(index)"
      >
        <!-- 悬浮发光效果 (Hover or Active) -->
        <div 
          class="absolute inset-0 bg-gradient-to-br from-noctis-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          :class="{ 'opacity-100': activeCardIndex === index }"
        ></div>
        <div 
          class="absolute -top-1/2 -right-1/2 w-full h-full bg-noctis-accent/5 blur-[100px] rounded-full group-hover:translate-x-[-20%] group-hover:translate-y-[20%] transition-transform duration-1000 ease-out pointer-events-none"
          :class="{ 'translate-x-[-20%] translate-y-[20%]': activeCardIndex === index }"
        ></div>

        <!-- 内容区域 -->
        <div class="relative z-10 h-full flex flex-col">
          <div>
            <div class="flex justify-between items-start mb-4">
              <span class="font-mono text-xs text-noctis-accent/80 tracking-widest uppercase">0{{ index + 1 }}</span>
              <div 
                class="w-2 h-2 rounded-full bg-white/20 group-hover:bg-noctis-accent transition-colors"
                :class="{ 'bg-noctis-accent': activeCardIndex === index }"
              ></div>
            </div>
            
            <h3 
              class="text-3xl font-bold mb-4 group-hover:text-noctis-accent transition-colors"
              :class="{ 'text-noctis-accent': activeCardIndex === index }"
            >{{ project.title }}</h3>
            
            <!-- 项目内容模板：价值 / 职责 / 方案 / 结果 (产品化结构) -->
            <div class="mb-6 grid gap-4">
              <!-- Value -->
              <div class="relative pl-4 border-l-2 border-noctis-accent/30">
                <h4 class="text-[10px] font-bold text-noctis-accent uppercase tracking-widest mb-1">Core Value</h4>
                <p class="text-gray-300 text-sm leading-relaxed">{{ project.value }}</p>
              </div>
              
              <!-- Role & Impact Group -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="bg-white/5 rounded p-3 border border-white/5">
                  <h4 class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
                    Role
                  </h4>
                  <p class="text-gray-300 text-xs leading-relaxed">{{ project.responsibility }}</p>
                </div>
                <div class="bg-white/5 rounded p-3 border border-white/5">
                  <h4 class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>
                    Impact
                  </h4>
                  <p class="text-gray-300 text-xs leading-relaxed">{{ project.impact }}</p>
                </div>
              </div>

              <!-- Tech Stack Decisions -->
              <div>
                <h4 class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Tech Strategy</h4>
                <ul class="list-none space-y-1.5 text-gray-300">
                  <li v-for="(item, idx) in project.approach" :key="idx" class="relative pl-3 text-xs before:content-['>'] before:absolute before:left-0 before:text-noctis-accent/50 before:text-[10px]">
                    {{ item }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="mt-auto">
             <!-- 技术标签 -->
             <div class="flex flex-wrap gap-2 mb-4">
               <span v-for="tag in project.tags" :key="tag" class="text-[10px] font-mono px-2 py-1 border border-white/10 rounded text-gray-400 group-hover:border-white/30 transition-colors">
                 {{ tag }}
               </span>
             </div>
             
             <!-- 项目链接 -->
             <div class="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2">
               <a
                 v-if="project.links.repo"
                 :href="project.links.repo"
                 target="_blank"
                 class="px-2 py-1 border border-white/10 rounded text-gray-300 hover:text-white hover:border-white/30 transition-colors"
                 @click="trackProjectLink('repo', project.title)"
               >
                 Repo
               </a>
               <a
                 v-if="project.links.demo"
                 :href="project.links.demo"
                 target="_blank"
                 class="px-2 py-1 border border-white/10 rounded text-gray-300 hover:text-white hover:border-white/30 transition-colors"
                 @click="trackProjectLink('demo', project.title)"
               >
                 Demo
               </a>
               <a
                 v-if="project.links.docs"
                 :href="project.links.docs"
                 target="_blank"
                 class="px-2 py-1 border border-white/10 rounded text-gray-300 hover:text-white hover:border-white/30 transition-colors"
                 @click="trackProjectLink('docs', project.title)"
               >
                 文档
               </a>
             </div>
             
             <!-- GitHub 统计卡片 -->
             <ProjectStats v-if="project.links.repo" :repo-url="project.links.repo" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.project-card {
  /* 3D 倾斜基础 */
  transform-style: preserve-3d;
  perspective: 1000px;
}
</style>
