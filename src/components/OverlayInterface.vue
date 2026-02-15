<script setup lang="ts">
import HeroSection from './Sections/HeroSection.vue'
import ProjectsSection from './Sections/ProjectsSection.vue'
import TechStackSection from './Sections/TechStackSection.vue'
import ContactSection from './Sections/ContactSection.vue'
</script>

<template>
  <div class="relative w-full text-white">
    <header class="fixed top-0 left-0 w-full p-6 z-50 mix-blend-difference flex justify-between items-center">
      <div class="text-xl font-bold tracking-tighter">NOCTIS</div>
      <nav class="hidden md:flex gap-6 text-sm font-medium tracking-wide">
        <a href="#projects" class="hover:text-gray-300 transition-colors">PROJECTS</a>
        <a href="#tech-stack" class="hover:text-gray-300 transition-colors">TECH</a>
        <a href="#contact" class="hover:text-gray-300 transition-colors">CONTACT</a>
      </nav>
    </header>

    <main>
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
