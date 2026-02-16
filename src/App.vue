<script setup lang="ts">
import { ref, onMounted, nextTick, onErrorCaptured, defineAsyncComponent } from 'vue'
import OverlayInterface from './components/OverlayInterface.vue'
import LoadingScreen from './components/UI/LoadingScreen.vue'
import Lenis from 'lenis'
import { usePerformance } from './composables/usePerformance'

// 1. 按需异步加载 3D 核心组件
// 只有在满足 3D 渲染条件时才会请求 Tres 相关 chunk
const TresCanvas = defineAsyncComponent(() => 
  import('@tresjs/core').then(m => m.TresCanvas)
)
const TheExperience = defineAsyncComponent(() => import('./components/TheExperience.vue'))

const { shouldEnable3D } = usePerformance()
const isAppLoaded = ref(false)
const showLoading = ref(true)
const isEntranceTriggered = ref(false)
const overlayRef = ref<InstanceType<typeof OverlayInterface> | null>(null)
const has3DError = ref(false) // 3D 渲染错误状态
const shouldLoad3D = ref(false) // 控制 3D 何时开始加载

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
    // 页面不可见时暂停 Lenis 计算，节省资源
    if (!document.hidden) {
      lenis.raf(time)
    }
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
  
  // Set loaded to true immediately as we don't have heavy assets yet
  // The LoadingScreen will handle the minimum display time
  isAppLoaded.value = true

  // 2. 延迟加载 3D 资源
  // 优先保证 UI 主线程流畅，使用 requestIdleCallback 在空闲时加载 3D
  // 如果浏览器不支持 requestIdleCallback，则降级为 2秒后加载
  if (shouldEnable3D.value) {
    const idleCallback = (window as any).requestIdleCallback || ((cb: Function) => setTimeout(cb, 2000))
    idleCallback(() => {
      shouldLoad3D.value = true
    })
  }
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
    <!-- 只有在不报错、且应该加载 3D 时才渲染 Canvas -->
    <div class="canvas-layer" v-if="!has3DError && shouldLoad3D">
      <Suspense>
        <template #default>
           <TresCanvas clear-color="#050505" window-size>
              <TheExperience :is-ready="isEntranceTriggered" />
           </TresCanvas>
        </template>
        <template #fallback>
          <!-- 3D 加载时的占位，虽然看不见但保持结构 -->
          <div class="w-full h-full bg-black/0"></div>
        </template>
      </Suspense>
    </div>

    <!-- 3D 降级/错误/未加载时的静态背景 -->
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
