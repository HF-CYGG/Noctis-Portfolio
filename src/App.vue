<script setup lang="ts">
import { ref, onMounted, nextTick, onErrorCaptured } from 'vue'
import { TresCanvas } from '@tresjs/core'
import TheExperience from './components/TheExperience.vue'
import OverlayInterface from './components/OverlayInterface.vue'
import LoadingScreen from './components/UI/LoadingScreen.vue'
import Lenis from 'lenis'

const isAppLoaded = ref(false)
const showLoading = ref(true)
const isEntranceTriggered = ref(false)
const overlayRef = ref<InstanceType<typeof OverlayInterface> | null>(null)
const has3DError = ref(false) // 3D 渲染错误状态

// 全局错误捕获，防止 3D 崩溃导致白屏
function on3DError(err: unknown) {
  console.error('Critical 3D Error:', err)
  has3DError.value = true
  // 即使 3D 挂了，也要保证内容层可交互
  // 如果还在加载中，强制结束加载
  if (showLoading.value) {
    showLoading.value = false
    nextTick(() => {
      overlayRef.value?.playEntrance()
    })
  }
}

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

onErrorCaptured((err) => {
  on3DError(err)
  return false // 阻止错误向上传播
})

function onEntranceTriggered() {
  isEntranceTriggered.value = true
}

function onLoadingFinished() {
  showLoading.value = false
  // Trigger entrance animation after loading screen is removed
  nextTick(() => {
    overlayRef.value?.playEntrance()
  })
}
</script>

<template>
  <LoadingScreen 
    v-if="showLoading" 
    :loaded="isAppLoaded" 
    @trigger-entrance="onEntranceTriggered"
    @finished="onLoadingFinished" 
  />
  
  <div class="main-container">
    <!-- 层级 1: 3D 背景 (z-index: 0) -->
    <div class="canvas-layer" v-if="!has3DError">
      <TresCanvas clear-color="#050505" window-size>
        <Suspense>
          <template #default>
             <TheExperience :is-ready="isEntranceTriggered" />
          </template>
          <template #fallback>
            <!-- 3D 加载时的占位，虽然看不见但保持结构 -->
            <mesh></mesh>
          </template>
        </Suspense>
      </TresCanvas>
    </div>

    <!-- 3D 降级/错误时的静态背景 -->
    <div v-else class="canvas-layer static-bg"></div>

    <!-- 层级 2: HTML 内容 (z-index: 10) -->
    <main class="content-layer">
      <OverlayInterface ref="overlayRef" />
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
