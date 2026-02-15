<script setup lang="ts">
import { OrbitControls, Stars } from '@tresjs/cientos'
import ParticleSphere from './ParticleSphere.vue'
</script>

<template>
  <TresPerspectiveCamera :position="[0, 0, 5]" :fov="45" />
  <OrbitControls :enable-zoom="false" :enable-pan="false" :auto-rotate="true" :auto-rotate-speed="0.5" />
  <Stars :radius="100" :depth="50" :count="5000" :size="0.1" :size-attenuation="true" />
  
  <Suspense>
    <ParticleSphere />
  </Suspense>
  
  <TresAmbientLight :intensity="1" />
  <TresDirectionalLight :position="[10, 10, 10]" :intensity="1" />
</template>
