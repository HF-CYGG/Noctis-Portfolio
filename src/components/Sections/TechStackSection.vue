<script setup lang="ts">
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
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
</script>

<template>
  <section id="tech-stack" class="min-h-screen flex flex-col justify-center items-center text-white p-8 relative z-10">
    <h2 class="text-4xl md:text-6xl font-bold mb-16 tracking-tight">核心技术栈</h2>
    
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl w-full">
      <!-- Frontend/Mobile -->
      <div class="tech-category space-y-4">
        <h3 class="text-sm font-mono text-noctis-accent uppercase tracking-wider mb-6">前端与移动端</h3>
        <div class="tech-item flex items-center gap-3 p-3 border border-white/10 bg-white/5 rounded-lg backdrop-blur-sm">
          <span class="font-bold">Android (Kotlin)</span>
        </div>
        <div class="tech-item flex items-center gap-3 p-3 border border-white/10 bg-white/5 rounded-lg backdrop-blur-sm">
          <span class="font-bold">TypeScript/JS</span>
        </div>
        <div class="tech-item flex items-center gap-3 p-3 border border-white/10 bg-white/5 rounded-lg backdrop-blur-sm">
          <span class="font-bold">Vue 3</span>
        </div>
      </div>
      
      <!-- Backend -->
      <div class="tech-category space-y-4">
        <h3 class="text-sm font-mono text-noctis-accent uppercase tracking-wider mb-6">后端开发</h3>
        <div class="tech-item flex items-center gap-3 p-3 border border-white/10 bg-white/5 rounded-lg backdrop-blur-sm">
          <span class="font-bold">Python</span>
        </div>
        <div class="tech-item flex items-center gap-3 p-3 border border-white/10 bg-white/5 rounded-lg backdrop-blur-sm">
          <span class="font-bold">Java</span>
        </div>
        <div class="tech-item flex items-center gap-3 p-3 border border-white/10 bg-white/5 rounded-lg backdrop-blur-sm">
          <span class="font-bold">Rust (探索中)</span>
        </div>
        <div class="tech-item flex items-center gap-3 p-3 border border-white/10 bg-white/5 rounded-lg backdrop-blur-sm">
          <span class="font-bold">Go (探索中)</span>
        </div>
      </div>

      <!-- Infrastructure -->
      <div class="tech-category space-y-4">
        <h3 class="text-sm font-mono text-noctis-accent uppercase tracking-wider mb-6">基础设施与工具</h3>
        <div class="tech-item flex items-center gap-3 p-3 border border-white/10 bg-white/5 rounded-lg backdrop-blur-sm">
          <span class="font-bold">Docker</span>
        </div>
        <div class="tech-item flex items-center gap-3 p-3 border border-white/10 bg-white/5 rounded-lg backdrop-blur-sm">
          <span class="font-bold">Linux</span>
        </div>
        <div class="tech-item flex items-center gap-3 p-3 border border-white/10 bg-white/5 rounded-lg backdrop-blur-sm">
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
