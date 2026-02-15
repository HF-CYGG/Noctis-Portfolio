<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { gsap } from 'gsap'

const props = defineProps<{
  loaded: boolean
}>()

const emit = defineEmits(['finished'])

const progress = ref(0)
const overlayRef = ref(null)
const textRef = ref(null)
const barRef = ref(null)
let interval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  // Simulate loading progress
  interval = setInterval(() => {
    progress.value += Math.floor(Math.random() * 5) + 1
    if (progress.value >= 100) {
      progress.value = 100
      if (interval) clearInterval(interval)
      // When loaded prop is true, start exit animation
      if (props.loaded) {
        startExitAnimation()
      }
    }
  }, 50)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})

// Watch for prop change in case loading finishes after simulation
watch(() => props.loaded, (newVal) => {
  if (newVal && progress.value >= 100) {
    startExitAnimation()
  }
})

function startExitAnimation() {
  const tl = gsap.timeline({
    onComplete: () => emit('finished')
  })

  tl.to(textRef.value, {
    opacity: 0,
    y: -20,
    duration: 0.5,
    ease: 'power2.in'
  })
  .to(barRef.value, {
    width: 0,
    opacity: 0,
    duration: 0.3
  }, "-=0.3")
  .to(overlayRef.value, {
    scaleY: 0,
    transformOrigin: 'top',
    duration: 0.8,
    ease: 'power4.inOut'
  })
}
</script>

<template>
  <div ref="overlayRef" class="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-white overflow-hidden">
    <!-- Matrix/Cyber background effect -->
    <div class="absolute inset-0 opacity-10 pointer-events-none">
       <div class="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]"></div>
    </div>

    <div ref="textRef" class="flex flex-col items-center relative z-20">
      <div class="relative mb-8">
        <h1 class="text-6xl md:text-8xl font-bold font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 glitch-text" data-text="NOCTIS">
          NOCTIS
        </h1>
        <div class="absolute -inset-1 bg-noctis-accent/20 blur-xl opacity-50 animate-pulse"></div>
      </div>
      
      <div class="w-80 h-2 bg-gray-900 rounded-none overflow-hidden border border-white/20 relative">
        <div ref="barRef" class="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-200 relative" :style="{ width: `${progress}%` }">
           <div class="absolute right-0 top-0 bottom-0 w-[2px] bg-white shadow-[0_0_10px_#fff]"></div>
        </div>
      </div>
      
      <div class="mt-4 flex justify-between w-80 text-xs font-mono text-noctis-accent/80">
        <span>SYSTEM_INIT</span>
        <span>{{ progress.toString().padStart(3, '0') }}%</span>
      </div>
      
      <div class="mt-8 text-[10px] font-mono text-gray-500 tracking-widest uppercase">
        <span class="animate-pulse">Loading Core Modules...</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glitch-text {
  position: relative;
}
.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;
}
.glitch-text::before {
  left: 2px;
  text-shadow: -1px 0 #00ffff;
  clip-path: inset(24% 0 29% 0);
  animation: glitch-anim-1 2.5s infinite linear alternate-reverse;
}
.glitch-text::after {
  left: -2px;
  text-shadow: -1px 0 #ff00ff;
  clip-path: inset(85% 0 13% 0);
  animation: glitch-anim-2 3s infinite linear alternate-reverse;
}

@keyframes glitch-anim-1 {
  0% { clip-path: inset(80% 0 2% 0); }
  20% { clip-path: inset(22% 0 45% 0); }
  40% { clip-path: inset(6% 0 74% 0); }
  60% { clip-path: inset(68% 0 11% 0); }
  80% { clip-path: inset(36% 0 49% 0); }
  100% { clip-path: inset(8% 0 86% 0); }
}

@keyframes glitch-anim-2 {
  0% { clip-path: inset(12% 0 54% 0); }
  20% { clip-path: inset(89% 0 6% 0); }
  40% { clip-path: inset(33% 0 25% 0); }
  60% { clip-path: inset(5% 0 69% 0); }
  80% { clip-path: inset(62% 0 31% 0); }
  100% { clip-path: inset(44% 0 14% 0); }
}
</style>
