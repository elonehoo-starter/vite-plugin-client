import { createApp, h, Suspense } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import 'uno.css'

const app = createApp(() => h(Suspense, {}, {
  default: () => h(App),
  fallback: 'Loading...',
}))

const router = createRouter({
  routes,
  history: createWebHashHistory(),
})

app.use(router)
app.mount('#app')
