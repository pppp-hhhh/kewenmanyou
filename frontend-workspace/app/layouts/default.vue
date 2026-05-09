<template>
  <div class="min-h-screen flex flex-col" style="background: linear-gradient(135deg, #f8f7ff 0%, #f0f4ff 50%, #fafbff 100%);">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-md shadow-sm border-b border-indigo-100/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2">
            <span class="text-2xl">📚</span>
            <span class="text-xl font-bold" style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">课文漫游</span>
          </NuxtLink>

          <!-- Navigation -->
          <nav class="flex items-center gap-6">
            <NuxtLink
              to="/workspace"
              class="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
              active-class="!text-indigo-600"
            >
              工作台
            </NuxtLink>
            <NuxtLink
              to="/gallery"
              class="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
              active-class="!text-indigo-600"
            >
              展示广场
            </NuxtLink>

            <!-- 用户管理（待开发） -->
            <div class="flex items-center gap-3 border-l border-indigo-100 pl-3">
              <NuxtLink
                to="/login"
                class="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
              >
                登录
              </NuxtLink>
              <NuxtLink
                to="/register"
                class="px-4 py-1.5 text-sm text-white rounded-lg font-medium shadow-md shadow-indigo-200/50 hover:shadow-lg hover:shadow-indigo-300/50 transition-all"
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
    <footer class="bg-white/60 backdrop-blur-sm mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p class="text-center text-gray-500 text-sm">
          课文漫游 — AI 辅助学习工具
        </p>
      </div>
    </footer>
  </div>
</template>
