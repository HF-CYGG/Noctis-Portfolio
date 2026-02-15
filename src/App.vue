<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TresCanvas } from '@tresjs/core'
import TheExperience from './components/TheExperience.vue'
import OverlayInterface from './components/OverlayInterface.vue'
import LoadingScreen from './components/UI/LoadingScreen.vue'
import Lenis from 'lenis'

const isAppLoaded = ref(false)
const showLoading = ref(true)

onMounted(() => {
  const lenis = new Lenis()
  function raf(time: number) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
  
  // Set loaded to true immediately as we don't have heavy assets yet
  // The LoadingScreen will handle the minimum display time
  isAppLoaded.value = true
})

function onLoadingFinished() {
  showLoading.value = false
}
</script>

<template>
  <LoadingScreen v-if="showLoading" :loaded="isAppLoaded" @finished="onLoadingFinished" />
  
  <div class="main-container">
    <!-- 层级 1: 3D 背景 (z-index: 0) -->
    <div class="canvas-layer">
      <TresCanvas clear-color="#050505" window-size>
        <Suspense>
          <TheExperience />
        </Suspense>
      </TresCanvas>
    </div>

    <!-- 层级 2: HTML 内容 (z-index: 10) -->
    <main class="content-layer">
      <OverlayInterface />
    </main>
  </div>
</template>

<style scoped>
.main-container {
  position: relative;
  width: 100vw;
  /* height is handled by content flow */
}

.canvas-layer {
  position: fixed;
  inset: 0;
  z-index: 0;
  height: 100vh;
  width: 100vw;
}

.content-layer {
  position: relative;
  z-index: 10;
  pointer-events: none; /* Pass through clicks to canvas where no content exists */
}

/* Re-enable pointer events for actual content */
:deep(.content-layer *) {
  pointer-events: auto;
}
</style>
