import { ref, onMounted, computed } from 'vue'
import { onLCP, onINP, onCLS } from 'web-vitals'

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

// 5. Web Vitals 采集 (仅在生产环境或显式开启时上报)
  const reportWebVitals = () => {
    // 这里可以替换为你的真实上报接口 (Google Analytics / Sentry / 自研埋点)
    const sendToAnalytics = (metric: any) => {
      // 仅在开发环境打印，生产环境请替换为 navigator.sendBeacon
      if (import.meta.env.DEV) {
        console.log('[Web Vitals]', metric.name, metric.value, metric)
      }
    }
  
    onCLS(sendToAnalytics)
    onINP(sendToAnalytics)
    onLCP(sendToAnalytics)
  }

  // 6. Long Task 监控
  // 监控超过 200ms 的长任务，帮助定位主线程阻塞
  const monitorLongTasks = () => {
    if (!('PerformanceObserver' in window)) return

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // 仅在开发环境打印，生产环境可上报采样
          if (import.meta.env.DEV && entry.duration > 200) {
            console.warn('[Long Task]', Math.round(entry.duration), 'ms', entry)
          }
        }
      })
      
      observer.observe({ type: 'longtask', buffered: true })
    } catch (e) {
      console.warn('Long Task Observer failed:', e)
    }
  }

  // 7. 资源加载错误监控
  // 全局监听 error 事件，捕获 img/script/link 加载失败
  const monitorResourceErrors = () => {
    window.addEventListener('error', (event) => {
      // 过滤 JS 运行时错误，只处理资源加载错误
      // 资源错误 event.target 是 HTML 元素，且 event instanceof Event (不是 ErrorEvent)
      const target = event.target as HTMLElement
      if (target && (target.tagName === 'IMG' || target.tagName === 'SCRIPT' || target.tagName === 'LINK')) {
        const url = (target as any).src || (target as any).href
        console.error('[Resource Error]', target.tagName, url)
        
        // 可以在这里上报资源失败
        // navigator.sendBeacon(...)
      }
    }, true) // 必须使用捕获阶段 (capture: true) 才能捕获资源错误
  }

  export function usePerformance() {
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

    const init = () => {
      if (isInitialized) return
      
      // ... (省略前面的初始化代码)

      // 3. 硬件并发数检测 (简单的性能指标)
      const concurrency = navigator.hardwareConcurrency || 4
      const memory = (navigator as any).deviceMemory || 4

      // 初始评级
      updateTier(concurrency, memory)
      
      // 启动 Web Vitals 监控
      reportWebVitals()
      
      // 启动 Long Task 监控
      monitorLongTasks()
      
      // 启动资源错误监控
      monitorResourceErrors()
  
      isInitialized = true
    }



  // 4. 性能监控 (FPS 监测)
  // 如果连续检测到低帧率，自动降级
  const monitorPerformance = () => {
    // 避免重复监控
    if (performanceTier.value === 'L2') return

    let frameCount = 0
    let lastTime = performance.now()
    let lowFpsCount = 0
    const CHECK_INTERVAL = 1000 // 1秒检查一次
    let rafId: number | null = null
    
    const checkFps = () => {
      // 页面不可见时暂停监控，节省电量
      if (document.hidden) {
        // 使用 setTimeout 而不是 rAF 轮询，避免在后台消耗资源
        setTimeout(() => {
             requestAnimationFrame(checkFps)
        }, 1000)
        return
      }

      // 如果已经是最低等级，不再监测
      if (performanceTier.value === 'L2') {
         if (rafId) cancelAnimationFrame(rafId)
         return
      }

      const now = performance.now()
      frameCount++
      
      if (now - lastTime >= CHECK_INTERVAL) {
        const fps = Math.round((frameCount * 1000) / (now - lastTime))
        
        // 如果 FPS 低于 30，计数增加
        if (fps < 30) {
          lowFpsCount++
        } else {
          // 恢复正常则重置计数 (避免偶尔卡顿导致误判)
          lowFpsCount = Math.max(0, lowFpsCount - 1)
        }
        
        // 连续 3 次检测到低帧率，触发降级
        if (lowFpsCount >= 3) {
          console.warn('Low FPS detected, downgrading performance tier...')
          if (performanceTier.value === 'L0') {
            performanceTier.value = 'L1'
          } else if (performanceTier.value === 'L1') {
            performanceTier.value = 'L2'
          }
          lowFpsCount = 0 // 重置计数，避免连续降级太快
        }
        
        frameCount = 0
        lastTime = now
      }
      
      rafId = requestAnimationFrame(checkFps)
    }
    
    rafId = requestAnimationFrame(checkFps)
  }

  onMounted(() => {
    // 仅在初始化时启动监控，避免多组件调用导致的多重循环
    if (!isInitialized) {
      init()
      monitorPerformance()
    }
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
    }),
    
    // 交互埋点方法
    trackInteraction: (action: string, label?: string) => {
      if (import.meta.env.DEV) {
        console.log('[Interaction]', action, label)
      }
      // 可以在这里扩展真实上报逻辑
      // navigator.sendBeacon('/analytics', JSON.stringify({ action, label, tier: performanceTier.value }))
    }
  }
}
