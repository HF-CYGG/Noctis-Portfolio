import { ref, onMounted, computed } from 'vue'

/**
 * 性能等级枚举
 * L0: 高性能桌面端 (完整 3D + 动效)
 * L1: 移动端/中端设备 (减少粒子/降低渲染)
 * L2: 低性能/偏好减弱动画 (关闭 3D/静态展示)
 */
export type PerformanceTier = 'L0' | 'L1' | 'L2'

const performanceTier = ref<PerformanceTier>('L0')
const isMobile = ref(false)
const prefersReducedMotion = ref(false)

// 单例模式，避免重复监听
let isInitialized = false

export function usePerformance() {
  const init = () => {
    if (isInitialized) return
    
    // 1. 检测减弱动画偏好
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.value = motionQuery.matches
    motionQuery.addEventListener('change', (e) => {
      prefersReducedMotion.value = e.matches
      updateTier()
    })

    // 2. 检测移动端
    const checkMobile = () => {
      isMobile.value = window.innerWidth < 768
      updateTier()
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // 3. 硬件并发数检测 (简单的性能指标)
    // @ts-ignore
    const concurrency = navigator.hardwareConcurrency || 4
    // @ts-ignore
    const memory = navigator.deviceMemory || 4

    // 初始评级
    updateTier(concurrency, memory)
    
    isInitialized = true
  }

  const updateTier = (concurrency = 4, memory = 4) => {
    // 强制降级条件
    if (prefersReducedMotion.value) {
      performanceTier.value = 'L2'
      return
    }

    // 移动端默认 L1
    if (isMobile.value) {
      // 如果设备很强，也可以 L1+ (暂时统一 L1)
      performanceTier.value = 'L1'
      return
    }

    // 低端桌面设备降级
    if (concurrency < 4 || memory < 4) {
      performanceTier.value = 'L1'
      return
    }

    // 默认 L0
    performanceTier.value = 'L0'
  }

  onMounted(() => {
    init()
  })

  return {
    tier: computed(() => performanceTier.value),
    isMobile: computed(() => isMobile.value),
    prefersReducedMotion: computed(() => prefersReducedMotion.value),
    
    // 辅助判断
    shouldEnable3D: computed(() => performanceTier.value !== 'L2'),
    particleCount: computed(() => {
      switch (performanceTier.value) {
        case 'L0': return 4000
        case 'L1': return 1500
        case 'L2': return 0
        default: return 1500
      }
    })
  }
}
