import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 减弱动画偏好组合式函数
 * 检测用户是否开启了"减弱动态效果"偏好
 */
export function useReducedMotion() {
  const prefersReducedMotion = ref(false)
  let mediaQuery: MediaQueryList | null = null

  const updatePreference = (e: MediaQueryListEvent | MediaQueryList) => {
    prefersReducedMotion.value = e.matches
  }

  onMounted(() => {
    mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    updatePreference(mediaQuery)
    mediaQuery.addEventListener('change', updatePreference)
  })

  onUnmounted(() => {
    if (mediaQuery) {
      mediaQuery.removeEventListener('change', updatePreference)
    }
  })

  return prefersReducedMotion
}
