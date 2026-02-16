<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProjectStats from '../ProjectStats.vue'
import { projects } from '../../data/projects'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
let mm: gsap.MatchMedia

onMounted(() => {
  // 横向滚动动画
  // 使用 gsap.context 确保动画和 ScrollTrigger 实例在组件卸载时能被正确清理
  // 这对于防止内存泄漏和路由切换时的动画错位至关重要
  mm = gsap.matchMedia()

  // 仅在非移动端 (>= 768px) 启用复杂的横向滚动动画
  mm.add("(min-width: 768px)", () => {
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
})

onUnmounted(() => {
  // 严格清理：撤销所有媒体查询相关的动画和 ScrollTrigger
  mm?.revert()
  // 额外清理：确保 ScrollTrigger 刷新，避免幽灵触发器
  ScrollTrigger.refresh()
})
</script>

<template>
  <section ref="sectionRef" id="projects" class="min-h-screen flex flex-col justify-center overflow-hidden py-20 relative">
    <div class="container mx-auto px-4 md:px-8 mb-8 md:absolute md:top-20 md:left-20 z-20">
      <h2 class="text-4xl md:text-6xl font-bold mb-2">THE FORGE</h2>
      <p class="text-gray-400">精选项目展示</p>
    </div>
    
    <div ref="containerRef" class="flex flex-col md:flex-row gap-8 px-4 md:pl-[30vw] md:pr-[10vw] w-full md:w-max">
      <div 
        v-for="(project, index) in projects" 
        :key="index"
        class="project-card group relative w-full md:w-[500px] min-h-[500px] h-auto p-8 border border-white/10 rounded-xl bg-black/40 backdrop-blur-xl hover:bg-white/5 transition-all duration-500 flex flex-col justify-between overflow-hidden"
      >
        <!-- 悬浮发光效果 -->
        <div class="absolute inset-0 bg-gradient-to-br from-noctis-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        <div class="absolute -top-1/2 -right-1/2 w-full h-full bg-noctis-accent/5 blur-[100px] rounded-full group-hover:translate-x-[-20%] group-hover:translate-y-[20%] transition-transform duration-1000 ease-out pointer-events-none"></div>

        <!-- 内容区域 -->
        <div class="relative z-10 h-full flex flex-col">
          <div>
            <div class="flex justify-between items-start mb-4">
              <span class="font-mono text-xs text-noctis-accent/80 tracking-widest uppercase">0{{ index + 1 }}</span>
              <div class="w-2 h-2 rounded-full bg-white/20 group-hover:bg-noctis-accent transition-colors"></div>
            </div>
            
            <h3 class="text-3xl font-bold mb-4 group-hover:text-noctis-accent transition-colors">{{ project.title }}</h3>
            
            <!-- 项目内容模板：价值 / 职责 / 方案 / 结果 -->
            <div class="mb-6 space-y-4 text-sm">
              <div>
                <p class="text-xs text-noctis-accent/70 font-mono mb-1 tracking-wider uppercase">/// Core Value</p>
                <p class="text-gray-300 leading-relaxed">{{ project.value }}</p>
              </div>
              <div>
                <p class="text-xs text-noctis-accent/70 font-mono mb-1 tracking-wider uppercase">/// Role & Scope</p>
                <p class="text-gray-300 leading-relaxed">{{ project.responsibility }}</p>
              </div>
              <div>
                <p class="text-xs text-noctis-accent/70 font-mono mb-1 tracking-wider uppercase">/// Tech Stack & Decisions</p>
                <ul class="list-none space-y-1 text-gray-300">
                  <li v-for="(item, idx) in project.approach" :key="idx" class="relative pl-3 before:content-['>'] before:absolute before:left-0 before:text-noctis-accent/50 before:text-xs">
                    {{ item }}
                  </li>
                </ul>
              </div>
              <div>
                <p class="text-xs text-noctis-accent/70 font-mono mb-1 tracking-wider uppercase">/// Impact</p>
                <p class="text-gray-300 leading-relaxed">{{ project.impact }}</p>
              </div>
            </div>
          </div>
          
          <div class="mt-auto">
             <!-- 技术标签 -->
             <div class="flex flex-wrap gap-2 mb-4">
               <span v-for="tag in project.tags" :key="tag" class="text-xs font-mono px-2 py-1 border border-white/10 rounded text-gray-400 group-hover:border-white/30 transition-colors">
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
               >
                 Repo
               </a>
               <a
                 v-if="project.links.demo"
                 :href="project.links.demo"
                 target="_blank"
                 class="px-2 py-1 border border-white/10 rounded text-gray-300 hover:text-white hover:border-white/30 transition-colors"
               >
                 Demo
               </a>
               <a
                 v-if="project.links.docs"
                 :href="project.links.docs"
                 target="_blank"
                 class="px-2 py-1 border border-white/10 rounded text-gray-300 hover:text-white hover:border-white/30 transition-colors"
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
