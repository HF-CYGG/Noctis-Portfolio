<script setup lang="ts">
import HeroSection from './Sections/HeroSection.vue'
import ProjectsSection from './Sections/ProjectsSection.vue'
import TechStackSection from './Sections/TechStackSection.vue'
</script>

<template>
  <div class="overlay-container">
    <HeroSection id="hero" />
    <ProjectsSection id="projects" />
    <TechStackSection id="tech-stack" />
    <!-- Footer placeholder -->
    <footer id="contact" class="min-h-[50vh] py-12 flex flex-col items-center justify-center text-white/50 relative z-10">
      <div class="mb-8 flex flex-col sm:flex-row gap-4 sm:gap-8 items-center">
        <a href="mailto:yyh1677696627@gmail.com" class="hover:text-noctis-accent transition-colors">邮箱</a>
        <a href="https://github.com/HF-CYGG" target="_blank" class="hover:text-noctis-accent transition-colors">GitHub</a>
        <a href="http://47.105.33.203/" target="_blank" class="hover:text-noctis-accent transition-colors">博客</a>
      </div>
      <div class="mb-12 flex flex-col gap-4 items-center w-full px-4">
        <img src="https://github-readme-streak-stats.herokuapp.com/?user=HF-CYGG&theme=transparent&hide_border=true&date_format=M%20j%5B%2C%20Y%5D" alt="GitHub Streak" class="opacity-80 hover:opacity-100 transition-opacity max-w-full w-auto sm:max-w-[400px]" />
        <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=HF-CYGG&layout=compact&theme=transparent&hide_border=true&title_color=888&text_color=555" alt="Top Langs" class="opacity-80 hover:opacity-100 transition-opacity max-w-full w-auto sm:max-w-[400px]" />
      </div>
      <p class="text-center px-4">© 2026 Night Cats (HF-CYGG). 保留所有权利。</p>
    </footer>
  </div>
</template>

<style scoped>
.overlay-container {
  width: 100%;
  /* Ensure content is scrollable */
}
</style>
