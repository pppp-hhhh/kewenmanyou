<script setup lang="ts">
// 访问根路径时重定向到工作台
navigateTo('/workspace')
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">
        课文漫游 - AI 漫画生成器
      </h1>
      <p class="text-gray-500 mb-4">正在跳转至工作台...</p>
      <NuxtLink to="/workspace" class="text-indigo-600 hover:underline">
        点击这里跳转
      </NuxtLink>
    </div>
  </div>
</template>
