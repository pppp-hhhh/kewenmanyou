<template>
  <footer class="bg-black text-white py-12">
    <div class="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
      <div class="col-span-2">
        <div class="flex items-center space-x-2 mb-6">
          <div class="bg-yellow-400 p-2 text-black">
            <BookOpen class="w-6 h-6" />
          </div>
          <span class="text-2xl font-bold tracking-tighter italic">课文漫游</span>
        </div>
        <p class="text-gray-400 max-w-md">致力于通过 AI 与漫画艺术，重塑传统语文教学，让每一个孩子都能在快乐中领悟文字之美。</p>
      </div>
      <div>
        <h5 class="font-bold text-lg mb-4">快速链接</h5>
        <ul class="space-y-2 text-gray-400">
          <li><a href="#" class="hover:text-white">产品功能</a></li>
          <li><a href="#" class="hover:text-white">教学案例</a></li>
          <li><a href="#" class="hover:text-white">价格方案</a></li>
          <li><a href="#" class="hover:text-white">帮助中心</a></li>
        </ul>
      </div>
      <div>
        <h5 class="font-bold text-lg mb-4">关注我们</h5>
        <div class="flex space-x-4">
          <a href="#" class="bg-gray-800 p-2 rounded hover:bg-yellow-400 hover:text-black transition-colors">
            <Github />
          </a>
          <a href="#" class="bg-gray-800 p-2 rounded hover:bg-yellow-400 hover:text-black transition-colors">
            <Twitter />
          </a>
          <a href="#" class="bg-gray-800 p-2 rounded hover:bg-yellow-400 hover:text-black transition-colors">
            <Mail />
          </a>
        </div>
      </div>
    </div>
    <div class="max-w-7xl mx-auto px-4 border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
      &copy; 2026 课文漫游 (Text Wanderer) 版权所有.
    </div>
  </footer>
</template>

<script setup>
import { BookOpen, Github, Twitter, Mail } from 'lucide-vue-next'
</script>
