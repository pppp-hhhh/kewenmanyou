// 管理员中间件 - 保护只有管理员才能访问的路由
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // 等待 auth 初始化完成
  if (authStore.isLoading) {
    return
  }

  // 未登录，重定向到登录页
  if (!authStore.isAuthenticated) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }

  // 不是管理员，重定向到首页
  if (!authStore.isAdmin) {
    return navigateTo('/')
  }
})
