<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 移除同步引入的 gsap
// import { gsap } from 'gsap'
// import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroSection from './Sections/HeroSection.vue'
import ProjectsSection from './Sections/ProjectsSection.vue'
import TechStackSection from './Sections/TechStackSection.vue'
import ContactSection from './Sections/ContactSection.vue'
import DailyQuote from './UI/DailyQuote.vue'

// gsap.registerPlugin(ScrollTrigger)

const logoRef = ref<HTMLElement | null>(null)
const navRef = ref<HTMLElement | null>(null)
const mainRef = ref<HTMLElement | null>(null)
const quoteRef = ref<HTMLElement | null>(null)

// 动态加载 GSAP
const loadGsap = async () => {
  const gsap = (await import('gsap')).gsap
  const ScrollTrigger = (await import('gsap/ScrollTrigger')).ScrollTrigger
  gsap.registerPlugin(ScrollTrigger)
  return { gsap, ScrollTrigger }
}

onMounted(async () => {
  const { gsap } = await loadGsap()
  
  // Set initial state for main content
  if (mainRef.value) {
    gsap.set(mainRef.value, {
      opacity: 0,
      y: 30
    })
  }

  // Set initial state for nav links to prevent flash
  if (navRef.value) {
    gsap.set(navRef.value.children, {
      opacity: 0,
      y: -20
    })
  }
})

// Method to start entrance animations
const playEntrance = async () => {
  const { gsap, ScrollTrigger } = await loadGsap()
  const tl = gsap.timeline()
  
  // Fade in logo (instant or very fast to match loader exit)
  if (logoRef.value) {
    tl.to(logoRef.value, {
      opacity: 1,
      duration: 0.1, // Almost instant to prevent flicker after loader text vanishes
      ease: 'power2.out'
    }, 0)
  }

  // Animate nav links
  if (navRef.value) {
    tl.to(navRef.value.children, {
      y: 0,
      opacity: 1,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out'
    }, 0.2)
  }

  // Animate quote
  if (quoteRef.value) {
    tl.fromTo(quoteRef.value, 
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
      0.4
    )
  }

  // Animate main content sections
  if (mainRef.value) {
    tl.to(mainRef.value, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      onComplete: () => {
        if (mainRef.value) {
          gsap.set(mainRef.value, { clearProps: 'transform' })
        }
        ScrollTrigger.refresh()
      }
    }, 0.4)
  }
}

defineExpose({ playEntrance })
</script>

<template>
  <div class="relative w-full text-white">
    <header class="fixed top-0 left-0 w-full p-6 z-50 mix-blend-difference flex justify-between items-center">
      <div id="dest-logo" ref="logoRef" class="text-xl font-bold font-mono tracking-tighter opacity-0">NOCTIS</div>
      
      <div class="flex items-center gap-8">
        <nav ref="navRef" class="hidden md:flex gap-6 text-sm font-medium tracking-wide">
          <a href="#projects" class="hover:text-gray-300 transition-colors">PROJECTS</a>
          <a href="#tech-stack" class="hover:text-gray-300 transition-colors">TECH</a>
          <a href="#contact" class="hover:text-gray-300 transition-colors">CONTACT</a>
        </nav>
        
        <div ref="quoteRef" class="hidden sm:block opacity-0">
           <DailyQuote />
        </div>
      </div>
    </header>

    <main ref="mainRef">
      <HeroSection />
      <ProjectsSection />
      <TechStackSection />
      <ContactSection />
    </main>
  </div>
</template>

<style scoped>
.overlay-container {
  width: 100%;
  /* Ensure content is scrollable */
}
</style>
