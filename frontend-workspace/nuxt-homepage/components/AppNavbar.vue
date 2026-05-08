<template>
  <nav class="bg-white border-b-4 border-black p-4 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto flex justify-between items-center">
      <NuxtLink to="/" class="flex items-center space-x-2">
        <div class="bg-yellow-400 p-2 comic-border">
          <BookOpen class="w-6 h-6" />
        </div>
        <span class="text-2xl font-bold tracking-tighter italic">课文漫游</span>
      </NuxtLink>
      <div class="hidden md:flex space-x-8 font-bold">
        <NuxtLink to="/" class="hover:text-yellow-500 transition-colors">首页</NuxtLink>
        <NuxtLink to="/workbench" class="hover:text-yellow-500 transition-colors">工作台</NuxtLink>
        <a href="#" class="hover:text-yellow-500 transition-colors">课文库</a>
        <a href="#" class="hover:text-yellow-500 transition-colors">社区</a>
      </div>
      <div class="flex items-center space-x-4">
        <button class="font-bold hover:underline">登录</button>
        <NuxtLink to="/workbench" class="bg-black text-white px-6 py-2 comic-border hover:bg-yellow-400 hover:text-black transition-all">
          开始创作
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { BookOpen } from 'lucide-vue-next'
</script>
