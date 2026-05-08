<template>
  <div class="bg-yellow-50 text-gray-900 min-h-screen flex flex-col">
    <AppNavbar />

    <!-- Hero Section -->
    <header class="max-w-7xl mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center flex-1">
      <div class="md:w-1/2 mb-12 md:mb-0">
        <h1 class="text-5xl md:text-7xl font-black mb-6 leading-tight max-w-3xl">
          让语文课文 <span class="gradient-text">变身精美漫画</span>
        </h1>
        <p class="text-xl text-gray-700 mb-8 max-w-md">
          利用 AI 技术将晦涩的文字转化为生动的漫画场景，为中小学生打造沉浸式的学习体验。
        </p>
        <div class="flex flex-col sm:space-y-0 sm:flex-row space-y-4 sm:space-x-4">
          <NuxtLink to="/workbench" class="bg-yellow-400 text-black text-center px-8 py-4 text-xl font-bold comic-border hover:translate-y-[-2px] transition-transform">
            立即体验
          </NuxtLink>
          <button class="bg-white text-black px-8 py-4 text-xl font-bold comic-border hover:translate-y-[-2px] transition-transform flex items-center justify-center">
            <Play class="mr-2" /> 观看演示
          </button>
        </div>
      </div>
      <div class="md:w-1/2 relative">
        <div class="bg-white p-4 comic-border rotate-2">
          <img src="https://images.unsplash.com/photo-1578632738908-4521c626df46?auto=format&fit=crop&q=80&w=800" alt="Comic Preview" class="w-full h-auto grayscale-0 hover:grayscale transition-all duration-500">
          <div class="absolute -bottom-6 -left-6 bg-blue-400 p-4 comic-border -rotate-3 hidden md:block">
            <p class="font-bold text-white italic">"哇！原来《背影》可以这样看！"</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Features -->
    <section class="bg-white border-y-4 border-black py-20">
      <div class="max-w-7xl mx-auto px-4 text-center mb-16">
        <h2 class="text-4xl font-black mb-4 underline decoration-yellow-400 decoration-8">为什么选择课文漫游？</h2>
        <p class="text-gray-600 max-w-2xl mx-auto">打破传统死记硬背，通过视觉化叙事提升学习兴趣与理解深度。</p>
      </div>
      <div class="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        <div class="bg-pink-100 p-8 comic-border comic-card transition-all">
          <div class="bg-white w-12 h-12 flex items-center justify-center mb-6 comic-border">
            <Sparkles class="text-pink-500" />
          </div>
          <h3 class="text-2xl font-bold mb-4">AI 智能生成</h3>
          <p class="text-gray-700">自动提取课文关键情节，一键生成分镜脚本与精美漫画形象。</p>
        </div>
        <div class="bg-blue-100 p-8 comic-border comic-card transition-all">
          <div class="bg-white w-12 h-12 flex items-center justify-center mb-6 comic-border">
            <Users class="text-blue-500" />
          </div>
          <h3 class="text-2xl font-bold mb-4">名师解读接入</h3>
          <p class="text-gray-700">深度融合中小学主流教材，配合专家解析，学习更透彻。</p>
        </div>
        <div class="bg-green-100 p-8 comic-border comic-card transition-all">
          <div class="bg-white w-12 h-12 flex items-center justify-center mb-6 comic-border">
            <Edit3 class="text-green-500" />
          </div>
          <h3 class="text-2xl font-bold mb-4">自主创作空间</h3>
          <p class="text-gray-700">支持学生在线修改对白与分镜，培养创造力与叙事表达能力。</p>
        </div>
      </div>
    </section>

    <!-- Sample Showcase -->
    <section class="max-w-7xl mx-auto px-4 py-20">
      <div class="flex justify-between items-end mb-12">
        <div>
          <h2 class="text-4xl font-black mb-2 italic">热门作品</h2>
          <p class="text-gray-600">看看其他同学和老师创作的精彩漫画</p>
        </div>
        <button class="font-bold underline text-lg">查看更多</button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="(sample, index) in samples" :key="index" class="group cursor-pointer">
          <div :class="['bg-white p-3 comic-border transition-colors', sample.hoverBg]">
            <img :src="sample.image" :alt="sample.title" class="w-full aspect-[3/4] object-cover mb-4">
            <h4 class="font-bold text-xl mb-1">{{ sample.title }}</h4>
            <p class="text-sm text-gray-500">{{ sample.author }} · {{ sample.grade }}</p>
          </div>
        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<script setup>
import { Play, Sparkles, Users, Edit3 } from 'lucide-vue-next'

const samples = [
  {
    title: '《背影》',
    author: '朱自清',
    grade: '初中语文',
    image: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&q=80&w=400',
    hoverBg: 'group-hover:bg-yellow-50'
  },
  {
    title: '《桃花源记》',
    author: '陶渊明',
    grade: '初中语文',
    image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?auto=format&fit=crop&q=80&w=400',
    hoverBg: 'group-hover:bg-blue-50'
  },
  {
    title: '《三峡》',
    author: '郦道元',
    grade: '初中语文',
    image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=400',
    hoverBg: 'group-hover:bg-pink-50'
  },
  {
    title: '《荷塘月色》',
    author: '朱自清',
    grade: '高中语文',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400',
    hoverBg: 'group-hover:bg-green-50'
  }
]
</script>
