import { createPinia } from 'pinia'

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = createPinia()
  nuxtApp.vueApp.use(pinia)

  // 初始化 auth store
  const authStore = useAuthStore(pinia)
  authStore.initialize()

  return {
    provide: {
      pinia,
    },
  }
})
