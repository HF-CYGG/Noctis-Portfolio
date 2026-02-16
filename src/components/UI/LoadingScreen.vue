<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { gsap } from 'gsap'

const props = defineProps<{
  loaded: boolean
}>()

const emit = defineEmits(['finished', 'trigger-entrance'])

const progress = ref(0)
const loadingText = ref('INITIALIZING SYSTEM...')
const hexCodes = ref<string[]>([])

// Generate random hex codes for decoration
for (let i = 0; i < 4; i++) {
  hexCodes.value.push(Math.random().toString(16).substring(2, 8).toUpperCase())
}

const overlayRef = ref<HTMLElement | null>(null)
const textContainerRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)
const barRef = ref<HTMLElement | null>(null)
const detailsRef = ref<HTMLElement | null>(null)
let interval: ReturnType<typeof setInterval> | null = null

const loadingMessages = [
  'LOADING CORE MODULES...',
  'ESTABLISHING CONNECTION...',
  'DECRYPTING ASSETS...',
  'SYNCING NEURAL INTERFACE...',
  'RENDERING ENVIRONMENT...',
  'READY TO LAUNCH'
]

onMounted(() => {
  // Simulate loading progress
  interval = setInterval(() => {
    progress.value += Math.floor(Math.random() * 5) + 3 // Much faster: 3-8% per tick (avg 5.5%)
    
    // Update loading text based on progress
    const index = Math.floor((progress.value / 100) * (loadingMessages.length - 1))
    loadingText.value = loadingMessages[Math.min(index, loadingMessages.length - 1)] || 'LOADING...'

    // Update hex codes randomly
    if (Math.random() > 0.7) {
       hexCodes.value[Math.floor(Math.random() * 4)] = Math.random().toString(16).substring(2, 8).toUpperCase()
    }

    if (progress.value >= 100) {
      progress.value = 100
      if (interval) clearInterval(interval)
      // When loaded prop is true, start exit animation
      if (props.loaded) {
        startExitAnimation()
      }
    }
  }, 20) // Faster interval: 20ms
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
  emit('trigger-entrance') // 提前触发 3D 入场动画
  
  const tl = gsap.timeline({
    onComplete: () => emit('finished')
  })

  // 1. Fade out details (bar, text)
  tl.to([barRef.value, detailsRef.value], {
    opacity: 0,
    duration: 0.3,
    ease: 'power2.out'
  })

  // 2. Animate "NOCTIS" to top-left
    if (textRef.value && textContainerRef.value) {
      // Get target position from OverlayInterface
      const destLogo = document.getElementById('dest-logo')
      let destRect: DOMRect | null = null
      
      if (destLogo) {
        destRect = destLogo.getBoundingClientRect()
      } else {
        // Fallback if not found
        destRect = new DOMRect(24, 24, 80, 24)
      }

      // Get current position
      const startRect = textRef.value.getBoundingClientRect()
      
      // Calculate scale and position differences
      const scaleX = destRect.width / startRect.width
      const scale = scaleX 

      // Reset textRef to occupy full container for easier transform origin calculation
      gsap.set(textRef.value, {
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
        className: 'text-6xl md:text-8xl font-bold font-mono tracking-tighter text-white', // Remove gradient/glitch
        transformOrigin: 'top left' // Critical for correct scaling from top-left corner
      })

      // We set the container to fixed, but we animate the text element inside it
      // IMPORTANT: Need to account for the new layout where textContainerRef might be centered differently
      // Let's force the container to the exact screen position it currently occupies
      gsap.set(textContainerRef.value, {
        position: 'fixed',
        left: startRect.left,
        top: startRect.top,
        width: startRect.width,
        height: startRect.height,
        zIndex: 101, // Ensure it's above the overlay
        margin: 0
      })

      // Calculate translation
      const x = destRect.left - startRect.left
      const y = destRect.top - startRect.top

      // Animate using transforms for best performance and pixel perfection
      tl.to(textRef.value, {
        x: x,
        y: y,
        scale: scale,
        color: '#ffffff',
        duration: 1.0,
        ease: 'power4.inOut',
        onComplete: () => {
           // Optional: Ensure perfect alignment at the end if needed, though GSAP is precise
        }
      }, 'move')
      
      // No need to animate container position anymore, just the inner text
    }

  // 3. Fade out overlay background simultaneously
  tl.to(overlayRef.value, {
    opacity: 0,
    duration: 0.8,
    ease: 'power2.inOut',
    delay: 0.2 // Start slightly after text starts moving
  }, 'move')
}
</script>

<template>
  <div ref="overlayRef" class="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-white overflow-hidden crt-effect">
    
    <!-- Background Layers -->
    <!-- 1. Matrix/Grid -->
    <div class="absolute inset-0 opacity-20 pointer-events-none z-0">
       <div class="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(0,255,255,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%]"></div>
    </div>
    
    <!-- 2. Vignette (Dark corners) -->
    <div class="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.8)_100%)]"></div>
    
    <!-- 3. Scanlines -->
    <div class="absolute inset-0 pointer-events-none z-10 scanlines opacity-10"></div>

    <!-- Main Content -->
    <div class="relative z-20 flex flex-col items-center w-full max-w-4xl px-4">
      
      <!-- Logo Container -->
      <div ref="textContainerRef" class="relative mb-16 flex flex-col items-center">
        <h1 ref="textRef" class="text-7xl md:text-9xl font-bold font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 glitch-text" data-text="NOCTIS">
          NOCTIS
        </h1>
        <div class="absolute -inset-4 bg-noctis-accent/10 blur-2xl opacity-60 animate-pulse-slow"></div>
      </div>
        
      <!-- HUD Loading Bar -->
      <div ref="detailsRef" class="flex flex-col items-center w-full max-w-lg">
        
        <!-- Top Decorations -->
        <div class="w-full flex justify-between items-end mb-2 text-[10px] font-mono text-noctis-accent/60">
           <div class="flex gap-2">
             <span v-for="(hex, i) in hexCodes" :key="i">0x{{ hex }}</span>
           </div>
           <span>SECURE_BOOT_V.2.0.4</span>
        </div>

        <!-- Progress Bar Container -->
        <div class="w-full h-4 bg-gray-900/50 border border-white/20 relative p-[2px] backdrop-blur-sm">
          <!-- Corner Accents -->
          <div class="absolute -top-[1px] -left-[1px] w-2 h-2 border-t border-l border-white/80"></div>
          <div class="absolute -top-[1px] -right-[1px] w-2 h-2 border-t border-r border-white/80"></div>
          <div class="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b border-l border-white/80"></div>
          <div class="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b border-r border-white/80"></div>
          
          <!-- Fill -->
          <div ref="barRef" class="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-200 relative overflow-hidden" :style="{ width: `${progress}%` }">
             <!-- Animated stripe pattern inside bar -->
             <div class="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.2)_25%,rgba(0,0,0,0.2)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.2)_75%,rgba(0,0,0,0.2))] bg-[length:10px_10px] animate-stripe-move"></div>
             <div class="absolute right-0 top-0 bottom-0 w-[2px] bg-white shadow-[0_0_10px_#fff]"></div>
          </div>
        </div>
        
        <!-- Bottom Info -->
        <div class="mt-3 flex justify-between w-full text-xs font-mono text-noctis-accent/80">
          <span class="animate-pulse">{{ loadingText }}</span>
          <span class="font-bold">{{ progress.toString().padStart(3, '0') }}%</span>
        </div>
        
        <!-- System Log (Decorative) -->
        <div class="mt-8 text-[9px] font-mono text-gray-600 w-full text-center tracking-[0.2em] opacity-50">
           :: SYSTEM INTEGRITY CHECK :: MEMORY OK :: NETWORK OK
        </div>
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
  60% { clip-path: inset(5% 0 38% 0); }
  80% { clip-path: inset(62% 0 17% 0); }
  100% { clip-path: inset(28% 0 66% 0); }
}

.scanlines {
  background: linear-gradient(
    to bottom,
    rgba(255,255,255,0),
    rgba(255,255,255,0) 50%,
    rgba(0,0,0,0.2) 50%,
    rgba(0,0,0,0.2)
  );
  background-size: 100% 4px;
  animation: scanline-move 10s linear infinite;
}

.crt-effect {
  animation: flicker 0.15s infinite;
}

@keyframes scanline-move {
  0% { background-position: 0 0; }
  100% { background-position: 0 100%; }
}

@keyframes stripe-move {
  0% { background-position: 0 0; }
  100% { background-position: 20px 0; }
}

.animate-stripe-move {
  animation: stripe-move 1s linear infinite;
}

@keyframes flicker {
  0% { opacity: 0.97; }
  5% { opacity: 0.95; }
  10% { opacity: 0.9; }
  15% { opacity: 0.95; }
  20% { opacity: 0.99; }
  25% { opacity: 0.95; }
  30% { opacity: 0.9; }
  35% { opacity: 0.96; }
  40% { opacity: 0.98; }
  45% { opacity: 0.95; }
  50% { opacity: 0.99; }
  55% { opacity: 0.93; }
  60% { opacity: 0.9; }
  65% { opacity: 0.96; }
  70% { opacity: 1; }
  75% { opacity: 0.97; }
  80% { opacity: 0.95; }
  85% { opacity: 0.92; }
  90% { opacity: 0.96; }
  95% { opacity: 1; }
  100% { opacity: 0.98; }
}

.animate-pulse-slow {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
