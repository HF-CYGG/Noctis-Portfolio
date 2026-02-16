<script setup lang="ts">
import { shallowRef, onMounted, onUnmounted, watch } from 'vue'
import { useLoop } from '@tresjs/core'
import { BufferGeometry, Float32BufferAttribute, PointsMaterial, AdditiveBlending, Points } from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePerformance } from '../composables/usePerformance'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps<{
  startAnimation: boolean
}>()

const pointsRef = shallowRef<Points | null>(null)
// 使用 shallowRef 管理 Three.js 对象，确保正确响应和销毁
const geometryRef = shallowRef<BufferGeometry | null>(null)
const materialRef = shallowRef<PointsMaterial | null>(null)

const { particleCount, shouldEnable3D } = usePerformance()

// 粒子汇聚动画相关数据
let targetPositions: Float32Array | null = null
let startPositions: Float32Array | null = null
let delays: Float32Array | null = null
let durations: Float32Array | null = null
let startTime = 0
let isConverged = false

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
  
  // 初始化动画数据
  targetPositions = new Float32Array(count * 3)
  startPositions = new Float32Array(count * 3)
  delays = new Float32Array(count)
  durations = new Float32Array(count)
  startTime = 0 // 重置计时器
  isConverged = false

  for (let i = 0; i < count; i++) {
    // 1. 计算目标位置（球体）
    const r = 1.5 // 半径
    const theta = 2 * Math.PI * Math.random()
    const phi = Math.acos(2 * Math.random() - 1)
    
    const targetX = r * Math.sin(phi) * Math.cos(theta)
    const targetY = r * Math.sin(phi) * Math.sin(theta)
    const targetZ = r * Math.cos(phi)

    // 存储目标位置
    targetPositions[i * 3] = targetX
    targetPositions[i * 3 + 1] = targetY
    targetPositions[i * 3 + 2] = targetZ

    // 2. 计算起始位置（随机扩散）
    // 范围是目标半径的 3-6 倍，制造从远处汇聚的效果
    const startR = r * (3 + Math.random() * 3)
    const startTheta = 2 * Math.PI * Math.random()
    const startPhi = Math.acos(2 * Math.random() - 1)

    startPositions[i * 3] = startR * Math.sin(startPhi) * Math.cos(startTheta)
    startPositions[i * 3 + 1] = startR * Math.sin(startPhi) * Math.sin(startTheta)
    startPositions[i * 3 + 2] = startR * Math.cos(startPhi)

    // 3. 设置初始位置为起始位置
    positions[i * 3] = startPositions[i * 3]!
    positions[i * 3 + 1] = startPositions[i * 3 + 1]!
    positions[i * 3 + 2] = startPositions[i * 3 + 2]!

    // 4. 设置动画参数
    // 延迟 0-1.5秒，持续 1-2秒
    delays[i] = Math.random() * 1.5
    durations[i] = 1.0 + Math.random() * 1.0

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
    // 汇聚动画逻辑
    if (props.startAnimation && !isConverged && targetPositions && startPositions && delays && durations && geometryRef.value && geometryRef.value.attributes.position) {
      if (startTime === 0) startTime = elapsed // 初始化开始时间

      const localTime = elapsed - startTime
      const positions = geometryRef.value.attributes.position.array as Float32Array
      const count = particleCount.value
      let allFinished = true

      // 缓存引用以通过类型检查
      const _delays = delays
      const _durations = durations
      const _startPositions = startPositions
      const _targetPositions = targetPositions

      for (let i = 0; i < count; i++) {
        const delay = _delays[i]!
        const duration = _durations[i]!
        
        if (localTime < delay) {
            // 还没开始，保持在起始位置
            allFinished = false
            continue
        }

        const progress = (localTime - delay) / duration
        
        if (progress < 1) {
            allFinished = false
            // easeOutCubic: 1 - (1-t)^3
            const t = 1 - Math.pow(1 - progress, 3)
            
            positions[i * 3] = _startPositions[i * 3]! + (_targetPositions[i * 3]! - _startPositions[i * 3]!) * t
            positions[i * 3 + 1] = _startPositions[i * 3 + 1]! + (_targetPositions[i * 3 + 1]! - _startPositions[i * 3 + 1]!) * t
            positions[i * 3 + 2] = _startPositions[i * 3 + 2]! + (_targetPositions[i * 3 + 2]! - _startPositions[i * 3 + 2]!) * t
        } else {
            // 动画完成，确保在目标位置
            positions[i * 3] = _targetPositions[i * 3]!
            positions[i * 3 + 1] = _targetPositions[i * 3 + 1]!
            positions[i * 3 + 2] = _targetPositions[i * 3 + 2]!
        }
      }

      geometryRef.value.attributes.position.needsUpdate = true

      if (allFinished) {
          isConverged = true
      }
    }

    smoothX += (pointerX - smoothX) * 0.08
    smoothY += (pointerY - smoothY) * 0.08
    velocityX *= 0.88
    velocityY *= 0.88
    const speed = Math.min(1, Math.hypot(velocityX, velocityY) * 6)
    
    // 基础旋转
    // 即使在等待汇聚时，也要让粒子缓慢旋转，增加活力
    pointsRef.value.rotation.y = elapsed * (props.startAnimation ? 0.05 : 0.02)
    pointsRef.value.rotation.z = elapsed * (props.startAnimation ? 0.02 : 0.01)
    
    // 鼠标交互 (仅在开始汇聚后启用，或始终启用但弱化)
    if (props.startAnimation) {
      const targetX = smoothY * 0.7
      const targetY = smoothX * 0.7
      
      pointsRef.value.rotation.x += (targetX - pointsRef.value.rotation.x) * 0.05
      pointsRef.value.rotation.y += (targetY - pointsRef.value.rotation.y) * 0.05
      pointsRef.value.position.x = smoothX * 0.35
      pointsRef.value.position.y = smoothY * 0.25
    }
    
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
  
  // Three.js 资源清理
  if (geometryRef.value) {
    geometryRef.value.dispose()
    geometryRef.value = null
  }
  
  if (materialRef.value) {
    materialRef.value.dispose()
    materialRef.value = null
  }
  
  // 数组清理
  targetPositions = null
  startPositions = null
  delays = null
  durations = null
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
