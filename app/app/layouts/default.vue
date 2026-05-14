<script setup lang="ts">
const { isDark, toggle } = useDarkMode()
const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-neutral-900">
    <!-- Header -->
    <header class="bg-white dark:bg-neutral-800 shadow-sm border-b border-indigo-100/50 dark:border-neutral-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2.5">
            <div class="bg-primary-600 rounded-lg p-1.5">
              <img src="/logo3.png" alt="logo" class="h-7 w-auto">
            </div>
            <span class="text-xl font-bold text-primary-600 dark:text-primary-400">课文漫游</span>
          </NuxtLink>

          <!-- Navigation -->
          <nav class="flex items-center gap-6">
            <NuxtLink
              to="/workspace"
              class="text-gray-600 dark:text-neutral-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
              active-class="!text-indigo-600 dark:!text-indigo-400"
            >
              工作台
            </NuxtLink>
            <NuxtLink
              to="/gallery"
              class="text-gray-600 dark:text-neutral-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
              active-class="!text-indigo-600 dark:!text-indigo-400"
            >
              展示广场
            </NuxtLink>

            <!-- 夜间模式切换 -->
            <button
              class="p-2 rounded-lg text-gray-500 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
              :title="isDark ? '切换日间模式' : '切换夜间模式'"
              @click="toggle"
            >
              <span class="text-lg">{{ isDark ? '☀️' : '🌙' }}</span>
            </button>

            <!-- 登录后用户菜单 -->
            <div v-if="authStore.isAuthenticated" class="flex items-center gap-3 border-l border-indigo-100 dark:border-neutral-700 pl-3">
              <NuxtLink
                to="/my-works"
                class="text-sm text-gray-500 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                我的作品
              </NuxtLink>
              <NuxtLink
                v-if="authStore.isAdmin"
                to="/admin"
                class="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
              >
                管理
              </NuxtLink>
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-500 dark:text-neutral-300">
                  {{ authStore.user?.email }}
                </span>
                <button
                  @click="handleLogout"
                  class="text-sm text-gray-500 hover:text-red-600 transition-colors"
                >
                  退出
                </button>
              </div>
            </div>

            <!-- 未登录 -->
            <div v-else class="flex items-center gap-3 border-l border-indigo-100 dark:border-neutral-700 pl-3">
              <NuxtLink
                to="/login"
                class="text-sm text-gray-500 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                登录
              </NuxtLink>
              <NuxtLink
                to="/register"
                class="px-4 py-1.5 text-sm text-white rounded-lg font-medium shadow-md shadow-indigo-200/50 dark:shadow-indigo-900/50 hover:shadow-lg hover:shadow-indigo-300/50 dark:hover:shadow-indigo-800/50 transition-all"
                style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);"
              >
                注册
              </NuxtLink>
            </div>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white dark:bg-neutral-800 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p class="text-center text-gray-500 dark:text-neutral-400 text-sm">
          课文漫游 — AI 辅助学习工具
        </p>
      </div>
    </footer>
  </div>
</template>
