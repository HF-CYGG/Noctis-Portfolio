<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'

const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLDivElement | null>(null)
let pointerHandler: ((e: PointerEvent) => void) | null = null
let ctaClickHandler: ((e: MouseEvent) => void) | null = null
let ctaButtons: HTMLAnchorElement[] = []

onMounted(() => {
  // Simple entrance animation
  // No delay needed as OverlayInterface controls main visibility
  const tl = gsap.timeline()
  
  tl.from(titleRef.value, {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  })
  .from(subtitleRef.value, {
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out'
  }, "-=0.5")
  .from(ctaRef.value, {
    y: 20,
    opacity: 0,
    duration: 0.5,
    ease: 'back.out(1.7)'
  }, "-=0.3")

  const title = titleRef.value
  const subtitle = subtitleRef.value
  const cta = ctaRef.value

  if (!title || !subtitle || !cta) return

  const titleX = gsap.quickTo(title, 'x', { duration: 0.6, ease: 'power3.out' })
  const titleY = gsap.quickTo(title, 'y', { duration: 0.6, ease: 'power3.out' })
  const titleRX = gsap.quickTo(title, 'rotationX', { duration: 0.6, ease: 'power3.out' })
  const titleRY = gsap.quickTo(title, 'rotationY', { duration: 0.6, ease: 'power3.out' })
  const subtitleX = gsap.quickTo(subtitle, 'x', { duration: 0.8, ease: 'power3.out' })
  const subtitleY = gsap.quickTo(subtitle, 'y', { duration: 0.8, ease: 'power3.out' })
  const ctaX = gsap.quickTo(cta, 'x', { duration: 0.9, ease: 'power3.out' })
  const ctaY = gsap.quickTo(cta, 'y', { duration: 0.9, ease: 'power3.out' })

  pointerHandler = (e: PointerEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2
    const y = (e.clientY / window.innerHeight - 0.5) * 2
    titleX(x * 24)
    titleY(y * 16)
    titleRX(-y * 6)
    titleRY(x * 8)
    subtitleX(x * 12)
    subtitleY(y * 8)
    ctaX(x * 8)
    ctaY(y * 6)
  }

  window.addEventListener('pointermove', pointerHandler)

  ctaButtons = Array.from(cta.querySelectorAll('a')) as HTMLAnchorElement[]
  ctaClickHandler = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLAnchorElement | null
    if (!target) return
    const href = target.getAttribute('href')
    if (!href) return
    e.preventDefault()

    const tl = gsap.timeline()
    tl.to(target, {
      scale: 0.94,
      duration: 0.08,
      ease: 'power2.out'
    }).to(target, {
      scale: 1.02,
      boxShadow: '0 0 24px rgba(0,243,255,0.35)',
      duration: 0.18,
      ease: 'power2.out'
    }).to(target, {
      scale: 1,
      boxShadow: '0 0 0 rgba(0,0,0,0)',
      duration: 0.2,
      ease: 'power2.out'
    }, '>-0.05')

    if (href.startsWith('#')) {
      const el = document.querySelector(href)
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 160)
      }
      return
    }
    setTimeout(() => {
      window.open(href, '_blank', 'noopener,noreferrer')
    }, 200)
  }

  ctaButtons.forEach((btn) => btn.addEventListener('click', ctaClickHandler as EventListener))
})

onUnmounted(() => {
  if (pointerHandler) {
    window.removeEventListener('pointermove', pointerHandler)
  }
  if (ctaClickHandler) {
    ctaButtons.forEach((btn) => btn.removeEventListener('click', ctaClickHandler as EventListener))
  }
})
</script>

<template>
  <section id="hero" class="min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-24 pt-32 pb-12 relative z-10">
    <div ref="titleRef" class="mb-4">
      <h1 class="text-6xl sm:text-8xl md:text-9xl font-bold tracking-tighter leading-none text-white mix-blend-difference">
        HELLO<br>WORLD
      </h1>
    </div>
    
    <div ref="subtitleRef" class="mb-12 max-w-2xl">
      <p class="text-xl sm:text-2xl text-gray-300 font-light tracking-wide leading-relaxed">
        我是 <span class="text-noctis-accent font-medium">HF-CYGG</span>，一名全栈开发者。
        <br class="hidden sm:block" />
        擅长构建沉浸式 Web 体验与高效后端系统。
      </p>
    </div>
    
    <div ref="ctaRef" class="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8">
      <a 
        href="#projects" 
        class="group relative px-8 py-3 bg-white text-black font-bold tracking-wider overflow-hidden transition-transform hover:scale-105"
      >
        <span class="relative z-10 flex items-center gap-2">
          查看项目
          <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
        </span>
        <div class="absolute inset-0 bg-noctis-accent transform translate-y-full transition-transform duration-300 group-hover:translate-y-0"></div>
      </a>
      
      <a 
        href="#contact" 
        class="group relative px-8 py-3 border border-white/30 text-white font-bold tracking-wider overflow-hidden transition-colors hover:border-white"
      >
        <span class="relative z-10">联系我</span>
        <div class="absolute inset-0 bg-white transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0"></div>
        <span class="absolute inset-0 flex items-center justify-center text-black font-bold opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-20">联系我</span>
      </a>
    </div>
    
    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
      </svg>
    </div>
  </section>
</template>
