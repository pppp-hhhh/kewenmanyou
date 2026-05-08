<!--
  首页 - 待实现
  参考: /gallery.vue 和 /workspace.vue 的组件风格

  TODO: 规划首页布局和内容
  - Hero section / 介绍区域
  - 功能特点展示
  - 入口按钮（工作台 / 展示广场）
-->
<template>
  <div class="py-12">
    <div class="max-w-4xl mx-auto px-4 text-center">
      <!-- Hero -->
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        课文漫游
      </h1>
      <p class="text-lg text-gray-600 mb-8">
        将语文课文转化为生动漫画，让学习更有趣
      </p>

      <!-- 入口 -->
      <div class="flex justify-center gap-4">
        <NuxtLink
          to="/workspace"
          class="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          开始创作
        </NuxtLink>
        <NuxtLink
          to="/gallery"
          class="px-6 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
        >
          浏览作品
        </NuxtLink>
      </div>

      <!-- TODO: 功能特点展示区域 -->

      <!-- TODO: 示例作品展示区域 -->
    </div>
  </div>
</template>
