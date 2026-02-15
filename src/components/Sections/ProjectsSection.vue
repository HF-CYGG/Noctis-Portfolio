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
  // Horizontal scroll animation
  const container = containerRef.value
  const section = sectionRef.value
  
  if (!container || !section) return

  mm = gsap.matchMedia()

  mm.add("(min-width: 768px)", () => {
    const horizontalTween = gsap.to(container, {
      x: () => -(container.scrollWidth - window.innerWidth + 100),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 1,
        start: "top top",
        end: () => "+=" + container.scrollWidth,
        invalidateOnRefresh: true
      }
    })
    
    // 卡片的视差/倾斜效果
    const cards = gsap.utils.toArray<HTMLElement>('.project-card')
    cards.forEach((card) => {
      gsap.to(card, {
        rotationY: 10,
        scrollTrigger: {
          trigger: card,
          start: "left center",
          end: "right center",
          scrub: true,
          containerAnimation: horizontalTween
        }
      })
    })
  })
})

onUnmounted(() => {
  mm?.revert()
})
</script>

<template>
  <section ref="sectionRef" id="projects" class="min-h-screen flex flex-col justify-center overflow-hidden py-20 relative">
    <div class="container mx-auto px-4 md:px-8 mb-8 md:absolute md:top-20 md:left-20 z-20">
      <h2 class="text-4xl md:text-6xl font-bold mb-2">THE FORGE</h2>
      <p class="text-gray-400">精选项目展示</p>
    </div>
    
    <div ref="containerRef" class="flex flex-col md:flex-row gap-8 px-4 md:pl-[30vw] w-full md:w-max">
      <a 
        v-for="(project, index) in projects" 
        :key="index"
        :href="project.link"
        target="_blank"
        class="project-card group relative w-full md:w-[450px] min-h-[450px] md:h-[550px] p-8 border border-white/10 rounded-xl bg-black/40 backdrop-blur-xl hover:bg-white/5 transition-all duration-500 flex flex-col justify-between overflow-hidden"
      >
        <!-- Hover Glow Effect -->
        <div class="absolute inset-0 bg-gradient-to-br from-noctis-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        <div class="absolute -top-1/2 -right-1/2 w-full h-full bg-noctis-accent/5 blur-[100px] rounded-full group-hover:translate-x-[-20%] group-hover:translate-y-[20%] transition-transform duration-1000 ease-out pointer-events-none"></div>

        <!-- Content -->
        <div class="relative z-10 h-full flex flex-col">
          <div>
            <div class="flex justify-between items-start mb-4">
              <span class="font-mono text-xs text-noctis-accent/80 tracking-widest uppercase">0{{ index + 1 }}</span>
              <div class="w-2 h-2 rounded-full bg-white/20 group-hover:bg-noctis-accent transition-colors"></div>
            </div>
            
            <h3 class="text-3xl font-bold mb-4 group-hover:text-noctis-accent transition-colors">{{ project.title }}</h3>
            
            <div class="mb-4 space-y-2">
              <div class="flex items-center gap-2 text-xs text-gray-400">
                <span class="px-2 py-0.5 border border-white/10 rounded-full bg-white/5">{{ project.role }}</span>
              </div>
              <p class="text-gray-300 leading-relaxed text-sm border-l-2 border-noctis-accent/30 pl-3">
                {{ project.desc }}
              </p>
              <div class="flex items-start gap-2 text-xs text-gray-500 mt-2">
                <svg class="w-4 h-4 text-noctis-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>{{ project.result }}</span>
              </div>
            </div>
          </div>
          
          <div class="mt-auto">
             <div class="flex flex-wrap gap-2 mb-8">
               <span v-for="tag in project.tags" :key="tag" class="text-xs font-mono px-2 py-1 border border-white/10 rounded text-gray-400 group-hover:border-white/30 transition-colors">
                 {{ tag }}
               </span>
             </div>
             
             <div class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider group/link">
               查看项目 
               <svg class="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
               </svg>
             </div>
             
             <!-- GitHub Stats -->
             <ProjectStats :repo-url="project.link" />
          </div>
        </div>
      </a>
    </div>
  </section>
</template>

<style scoped>
.project-card {
  /* 3D tilt base */
  transform-style: preserve-3d;
  perspective: 1000px;
}
</style>
