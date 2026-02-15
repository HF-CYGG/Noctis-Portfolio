<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { OrbitControls, Stars } from '@tresjs/cientos'
import ParticleSphere from './ParticleSphere.vue'

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
  <OrbitControls :enable-zoom="false" :enable-pan="false" :auto-rotate="true" :auto-rotate-speed="0.5" />
  <Stars :radius="100" :depth="50" :count="5000" :size="0.1" :size-attenuation="true" />
  
  <Suspense>
    <ParticleSphere />
  </Suspense>
  
  <TresAmbientLight :intensity="1" />
  <TresDirectionalLight :position="[10, 10, 10]" :intensity="1" />
</template>
