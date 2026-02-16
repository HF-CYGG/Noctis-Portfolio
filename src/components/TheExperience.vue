<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import { usePerformance } from '../composables/usePerformance'

// 异步加载 Tres 组件，确保它们不进入主包
// 这里使用 defineAsyncComponent 配合 import() 语法
const OrbitControls = defineAsyncComponent(() => 
  import('@tresjs/cientos').then(m => m.OrbitControls)
)
const Stars = defineAsyncComponent(() => 
  import('@tresjs/cientos').then(m => m.Stars)
)

// 异步加载 3D 核心组件，避免阻塞首屏 JS
const ParticleSphere = defineAsyncComponent(() => import('./ParticleSphere.vue'))

defineProps<{
  isReady: boolean
}>()

const { shouldEnable3D, particleCount } = usePerformance()

const cameraPosition = ref<[number, number, number]>([0, 0, 5])

const updateCamera = () => {
  const width = window.innerWidth
  if (width < 768) {
    cameraPosition.value = [0, 0, 7]
  } else {
    cameraPosition.value = [0, 0, 5]
  }
}

onMounted(() => {
  updateCamera()
  window.addEventListener('resize', updateCamera)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateCamera)
})
</script>

<template>
  <TresPerspectiveCamera :position="cameraPosition" :fov="45" />
  
  <template v-if="shouldEnable3D">
    <OrbitControls :enable-zoom="false" :enable-pan="false" :auto-rotate="true" :auto-rotate-speed="0.5" />
    <Stars :radius="100" :depth="50" :count="particleCount > 2000 ? 5000 : 2000" :size="0.1" :size-attenuation="true" />
    
    <Suspense>
      <ParticleSphere :start-animation="isReady" />
    </Suspense>
  </template>
  
  <TresAmbientLight :intensity="1" />
  <TresDirectionalLight :position="[10, 10, 10]" :intensity="1" />
</template>
