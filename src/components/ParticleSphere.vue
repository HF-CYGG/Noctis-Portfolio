<script setup lang="ts">
import { shallowRef, onMounted, onUnmounted, watch } from 'vue'
import { useLoop } from '@tresjs/core'
import { BufferGeometry, Float32BufferAttribute, PointsMaterial, AdditiveBlending, Points } from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePerformance } from '../composables/usePerformance'

gsap.registerPlugin(ScrollTrigger)

const pointsRef = shallowRef<Points | null>(null)
// 使用 shallowRef 管理 Three.js 对象，确保正确响应和销毁
const geometryRef = shallowRef<BufferGeometry | null>(null)
const materialRef = shallowRef<PointsMaterial | null>(null)

const { particleCount, shouldEnable3D } = usePerformance()

let ctx: gsap.Context | null = null

// 动画循环相关变量
let pointerX = 0
let pointerY = 0
let smoothX = 0
let smoothY = 0
let velocityX = 0
let velocityY = 0

const { onBeforeRender } = useLoop()

const handlePointerMove = (e: PointerEvent) => {
  const nextX = (e.clientX / window.innerWidth) * 2 - 1
  const nextY = -(e.clientY / window.innerHeight) * 2 + 1
  velocityX = nextX - pointerX
  velocityY = nextY - pointerY
  pointerX = nextX
  pointerY = nextY
}

const handlePointerDown = () => {
  if (!pointsRef.value || !materialRef.value) return
  
  gsap.to(pointsRef.value.scale, {
    x: 1.2,
    y: 1.2,
    z: 1.2,
    duration: 0.18,
    yoyo: true,
    repeat: 1,
    ease: 'power2.out'
  })
  
  gsap.to(materialRef.value, {
    opacity: 1,
    duration: 0.18,
    yoyo: true,
    repeat: 1,
    ease: 'power2.out'
  })
}

// 初始化几何体和材质
const initResources = () => {
  // 性能预算：如果不需要 3D，直接跳过初始化
  if (!shouldEnable3D.value) return

  const count = particleCount.value
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const r = 1.5 // 半径
    const theta = 2 * Math.PI * Math.random()
    const phi = Math.acos(2 * Math.random() - 1)
    
    const x = r * Math.sin(phi) * Math.cos(theta)
    const y = r * Math.sin(phi) * Math.sin(theta)
    const z = r * Math.cos(phi)

    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z

    // 赛博朋克配色
    const mix = Math.random()
    if (mix < 0.3) {
      // 青色
      colors[i * 3] = 0.0
      colors[i * 3 + 1] = 0.95
      colors[i * 3 + 2] = 1.0
    } else if (mix < 0.6) {
      // 紫色
      colors[i * 3] = 0.7
      colors[i * 3 + 1] = 0.07
      colors[i * 3 + 2] = 1.0
    } else {
      // 白色/淡蓝色用于闪烁
      colors[i * 3] = 0.8
      colors[i * 3 + 1] = 0.9
      colors[i * 3 + 2] = 1.0
    }
  }

  const geo = new BufferGeometry()
  geo.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geo.setAttribute('color', new Float32BufferAttribute(colors, 3))
  geometryRef.value = geo

  const baseSize = 0.015
  const baseOpacity = 0.8

  const mat = new PointsMaterial({
    size: baseSize,
    vertexColors: true,
    blending: AdditiveBlending,
    transparent: true,
    opacity: baseOpacity,
    sizeAttenuation: true
  })
  materialRef.value = mat
}

// 初始化动画
const initAnimations = () => {
  if (!pointsRef.value || !materialRef.value) return
  
  // 清理旧的 context
  if (ctx) ctx.revert()
  
  ctx = gsap.context(() => {
    // 滚动交互
    gsap.to(pointsRef.value!.position, {
      y: 2,
      z: -5,
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      }
    })

    gsap.to(pointsRef.value!.scale, {
      x: 0.5, 
      y: 0.5,
      z: 0.5,
      scrollTrigger: {
        trigger: '#hero',
        start: 'center top',
        end: 'bottom top',
        scrub: 1,
      }
    })

    gsap.to(materialRef.value!, {
      opacity: 0,
      scrollTrigger: {
        trigger: '#hero',
        start: 'center center',
        end: 'bottom top',
        scrub: 1,
      }
    })
  })
}

onBeforeRender(({ elapsed }) => {
  if (pointsRef.value && materialRef.value) {
    smoothX += (pointerX - smoothX) * 0.08
    smoothY += (pointerY - smoothY) * 0.08
    velocityX *= 0.88
    velocityY *= 0.88
    const speed = Math.min(1, Math.hypot(velocityX, velocityY) * 6)
    
    // 基础旋转
    pointsRef.value.rotation.y = elapsed * 0.05
    pointsRef.value.rotation.z = elapsed * 0.02
    
    // 鼠标交互
    const targetX = smoothY * 0.7
    const targetY = smoothX * 0.7
    
    pointsRef.value.rotation.x += (targetX - pointsRef.value.rotation.x) * 0.05
    pointsRef.value.rotation.y += (targetY - pointsRef.value.rotation.y) * 0.05
    pointsRef.value.position.x = smoothX * 0.35
    pointsRef.value.position.y = smoothY * 0.25
    
    // 脉冲效果
    const baseSize = 0.015
    const baseOpacity = 0.8
    const scale = 1 + Math.sin(elapsed * 0.6) * 0.05 + speed * 0.08
    pointsRef.value.scale.set(scale, scale, scale)
    materialRef.value.size = baseSize + speed * 0.02
    materialRef.value.opacity = Math.min(1, baseOpacity + speed * 0.2)
  }
})

onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  initResources()
  
  if (!prefersReducedMotion) {
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerdown', handlePointerDown)
  }

  // 使用 watch 等待 DOM 元素挂载，替代 setTimeout
  watch(pointsRef, (newVal) => {
    if (newVal) {
      // 即使是 reduced motion，也可能需要初始化 ScrollTrigger，或者跳过动画
      // 这里我们假设 reduced motion 用户只需要静态展示或简化动画
      if (!prefersReducedMotion) {
        initAnimations()
      }
    }
  }, { immediate: true })
})

onUnmounted(() => {
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerdown', handlePointerDown)
  
  ctx?.revert()
  
  // 显式清理资源
  if (geometryRef.value) {
    geometryRef.value.dispose()
    geometryRef.value = null
  }
  if (materialRef.value) {
    materialRef.value.dispose()
    materialRef.value = null
  }
})
</script>

<template>
  <TresPoints
    v-if="shouldEnable3D && geometryRef && materialRef"
    ref="pointsRef"
    :geometry="geometryRef"
    :material="materialRef"
    @pointer-move="handlePointerMove"
    @pointer-down="handlePointerDown"
  />
</template>
