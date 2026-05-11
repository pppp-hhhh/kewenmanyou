<script setup lang="ts">
const { isDark, toggle } = useDarkMode()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
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
              class="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
              active-class="text-primary-600 dark:text-primary-400"
            >
              工作台
            </NuxtLink>
            <NuxtLink
              to="/gallery"
              class="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
              active-class="text-primary-600 dark:text-primary-400"
            >
              展示广场
            </NuxtLink>

            <!-- 夜间模式切换 -->
            <button
              class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              :title="isDark ? '切换日间模式' : '切换夜间模式'"
              @click="toggle"
            >
              <span class="text-lg">{{ isDark ? '☀️' : '🌙' }}</span>
            </button>

            <!-- TODO: 用户管理（待开发） -->
            <div class="flex items-center gap-3 border-l border-gray-200 dark:border-gray-600 pl-3">
              <NuxtLink
                to="/login"
                class="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                登录
              </NuxtLink>
              <NuxtLink
                to="/register"
                class="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
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
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto transition-colors">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p class="text-center text-gray-500 dark:text-gray-400 text-sm">
          课文漫游 — AI 辅助学习工具
        </p>
      </div>
    </footer>
  </div>
</template>
