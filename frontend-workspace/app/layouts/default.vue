<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2">
            <span class="text-2xl">📚</span>
            <span class="text-xl font-bold text-primary-600">课文漫游</span>
          </NuxtLink>

          <!-- Navigation -->
          <nav class="flex items-center gap-6">
            <NuxtLink
              to="/workspace"
              class="text-gray-600 hover:text-primary-600 transition-colors font-medium"
              active-class="text-primary-600"
            >
              工作台
            </NuxtLink>
            <NuxtLink
              to="/gallery"
              class="text-gray-600 hover:text-primary-600 transition-colors font-medium"
              active-class="text-primary-600"
            >
              展示广场
            </NuxtLink>

            <!-- TODO: 用户管理（待开发） -->
            <!-- 登录后显示用户头像/下拉菜单 -->
            <div class="flex items-center gap-3 border-l border-gray-200 pl-3">
              <NuxtLink
                to="/login"
                class="text-sm text-gray-600 hover:text-primary-600 transition-colors"
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
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p class="text-center text-gray-500 text-sm">
          课文漫游 — AI 辅助学习工具
        </p>
      </div>
    </footer>
  </div>
</template>
