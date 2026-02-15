<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import HeroSection from './Sections/HeroSection.vue'
import ProjectsSection from './Sections/ProjectsSection.vue'
import TechStackSection from './Sections/TechStackSection.vue'
import ContactSection from './Sections/ContactSection.vue'

const logoRef = ref<HTMLElement | null>(null)
const navRef = ref<HTMLElement | null>(null)
const mainRef = ref<HTMLElement | null>(null)

// Method to start entrance animations
const playEntrance = () => {
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
    tl.from(navRef.value.children, {
      y: -20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out'
    }, 0.2)
  }

  // Animate main content sections
   if (mainRef.value) {
     tl.to(mainRef.value, {
       y: 0,
       opacity: 1,
       duration: 1,
       ease: 'power3.out'
     }, 0.4)
   }
 }

 defineExpose({ playEntrance })
</script>

<template>
  <div class="relative w-full text-white">
    <header class="fixed top-0 left-0 w-full p-6 z-50 mix-blend-difference flex justify-between items-center">
      <div id="dest-logo" ref="logoRef" class="text-xl font-bold font-mono tracking-tighter opacity-0">NOCTIS</div>
      <nav ref="navRef" class="hidden md:flex gap-6 text-sm font-medium tracking-wide">
        <a href="#projects" class="hover:text-gray-300 transition-colors">PROJECTS</a>
        <a href="#tech-stack" class="hover:text-gray-300 transition-colors">TECH</a>
        <a href="#contact" class="hover:text-gray-300 transition-colors">CONTACT</a>
      </nav>
    </header>

    <main ref="mainRef" class="opacity-0 translate-y-8">
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
