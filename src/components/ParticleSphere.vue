<script setup lang="ts">
import { shallowRef, onMounted, onUnmounted } from 'vue'
import { useLoop } from '@tresjs/core'
import { BufferGeometry, Float32BufferAttribute, PointsMaterial, AdditiveBlending, Points } from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const pointsRef = shallowRef<Points | null>(null)

// Generate particles
const count = 4000
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for (let i = 0; i < count; i++) {
  const r = 1.5 // Radius
  const theta = 2 * Math.PI * Math.random()
  const phi = Math.acos(2 * Math.random() - 1)
  
  const x = r * Math.sin(phi) * Math.cos(theta)
  const y = r * Math.sin(phi) * Math.sin(theta)
  const z = r * Math.cos(phi)

  positions[i * 3] = x
  positions[i * 3 + 1] = y
  positions[i * 3 + 2] = z

  // Cyberpunk colors: Cyan (#00f3ff) to Purple (#bc13fe)
  // More vibrant mix
  const mix = Math.random()
  if (mix < 0.3) {
    // Cyan
    colors[i * 3] = 0.0
    colors[i * 3 + 1] = 0.95
    colors[i * 3 + 2] = 1.0
  } else if (mix < 0.6) {
    // Purple
    colors[i * 3] = 0.7
    colors[i * 3 + 1] = 0.07
    colors[i * 3 + 2] = 1.0
  } else {
    // White/Blueish for sparkles
    colors[i * 3] = 0.8
    colors[i * 3 + 1] = 0.9
    colors[i * 3 + 2] = 1.0
  }
}

const geometry = new BufferGeometry()
geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))

const baseSize = 0.015
const baseOpacity = 0.8

const material = new PointsMaterial({
  size: baseSize,
  vertexColors: true,
  blending: AdditiveBlending,
  transparent: true,
  opacity: baseOpacity,
  sizeAttenuation: true
})

const { onBeforeRender } = useLoop()

let pointerX = 0
let pointerY = 0
let smoothX = 0
let smoothY = 0
let velocityX = 0
let velocityY = 0

const handlePointerMove = (e: PointerEvent) => {
  const nextX = (e.clientX / window.innerWidth) * 2 - 1
  const nextY = -(e.clientY / window.innerHeight) * 2 + 1
  velocityX = nextX - pointerX
  velocityY = nextY - pointerY
  pointerX = nextX
  pointerY = nextY
}

const handlePointerDown = () => {
  if (!pointsRef.value) return
  gsap.to(pointsRef.value.scale, {
    x: 1.2,
    y: 1.2,
    z: 1.2,
    duration: 0.18,
    yoyo: true,
    repeat: 1,
    ease: 'power2.out'
  })
  gsap.to(material, {
    opacity: 1,
    duration: 0.18,
    yoyo: true,
    repeat: 1,
    ease: 'power2.out'
  })
}

onBeforeRender(({ elapsed }) => {
  if (pointsRef.value) {
    smoothX += (pointerX - smoothX) * 0.08
    smoothY += (pointerY - smoothY) * 0.08
    velocityX *= 0.88
    velocityY *= 0.88
    const speed = Math.min(1, Math.hypot(velocityX, velocityY) * 6)
    // Base rotation
    pointsRef.value.rotation.y = elapsed * 0.05
    pointsRef.value.rotation.z = elapsed * 0.02
    
    // Mouse interaction (smooth damping)
    // We add the mouse influence to the rotation
    const targetX = smoothY * 0.7
    const targetY = smoothX * 0.7
    
    pointsRef.value.rotation.x += (targetX - pointsRef.value.rotation.x) * 0.05
    pointsRef.value.rotation.y += (targetY - pointsRef.value.rotation.y) * 0.05
    pointsRef.value.position.x = smoothX * 0.35
    pointsRef.value.position.y = smoothY * 0.25
    
    // Pulse effect
    const scale = 1 + Math.sin(elapsed * 0.6) * 0.05 + speed * 0.08
    pointsRef.value.scale.set(scale, scale, scale)
    material.size = baseSize + speed * 0.02
    material.opacity = Math.min(1, baseOpacity + speed * 0.2)
  }
})

onMounted(() => {
  window.addEventListener('pointermove', handlePointerMove)
  window.addEventListener('pointerdown', handlePointerDown)

  // Wait for DOM
  setTimeout(() => {
    if (!pointsRef.value) return
    
    // Scroll interaction: Disperse/Scale down when scrolling to Projects
    // Move the sphere away
    gsap.to(pointsRef.value.position, {
      y: 2,
      z: -5,
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      }
    })

    gsap.to(pointsRef.value.scale, {
      x: 0.5, 
      y: 0.5,
      z: 0.5,
      opacity: 0,
      scrollTrigger: {
        trigger: '#hero',
        start: 'center top',
        end: 'bottom top',
        scrub: 1,
      }
    })

    gsap.to(pointsRef.value.material, {
      opacity: 0,
      scrollTrigger: {
        trigger: '#hero',
        start: 'center center',
        end: 'bottom top',
        scrub: 1,
      }
    })
  }, 100)
})

onUnmounted(() => {
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerdown', handlePointerDown)
})
</script>

<template>
  <TresPoints ref="pointsRef" :geometry="geometry" :material="material" />
</template>
