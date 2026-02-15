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
  const tl = gsap.timeline({ delay: 2.5 }) // Wait for loader
  
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
  <section id="hero" class="min-h-screen flex flex-col justify-center items-center text-white p-8 relative z-10">
    <h1 ref="titleRef" class="text-7xl md:text-9xl font-bold mb-6 font-mono tracking-tighter mix-blend-difference">
      YeMiao CATS
    </h1>
    <p ref="subtitleRef" class="text-xl md:text-2xl text-gray-400 font-light max-w-2xl text-center mb-12 mix-blend-difference">
      代码如诗，<span class="text-noctis-accent">诉说着我们的历程</span>。
    </p>
    
    <div ref="ctaRef" class="flex gap-4">
      <a href="#projects" class="px-8 py-3 bg-white text-black font-bold hover:bg-noctis-accent transition-colors rounded-sm">
        项目展示
      </a>
      <a href="https://github.com/HF-CYGG" target="_blank" class="px-8 py-3 border border-white/20 hover:border-white transition-colors rounded-sm backdrop-blur-sm">
        GITHUB
      </a>
      <a href="http://47.105.33.203/" target="_blank" class="px-8 py-3 border border-white/20 hover:border-white transition-colors rounded-sm backdrop-blur-sm">
        个人博客
      </a>
    </div>
    
    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
      </svg>
    </div>
  </section>
</template>
