import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

const app = createApp(App)

// 全局错误捕获 (v2.0 可观测性)
app.config.errorHandler = (err, instance, info) => {
  console.error('[Global Error Handler]:', err)
  console.error('Instance:', instance)
  console.error('Info:', info)
  
  // 未来可接入 Sentry 或其他日志服务
}

app.mount('#app')
