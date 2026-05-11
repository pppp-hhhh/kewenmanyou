<script setup lang="ts">
const features = [
  {
    icon: '🤖',
    title: 'AI 智能分析',
    desc: 'DeepSeek 大模型自动分析课文，智能拆分为多个漫画场景，精准捕捉文章脉络与情感',
  },
  {
    icon: '🎨',
    title: '多画风生成',
    desc: '支持写实古风、水墨风格、彩色插画三种画风，ComfyUI + SD 模型实时生成精美漫画',
  },
  {
    icon: '📖',
    title: '作品展示广场',
    desc: '将生成的漫画作品保存并分享至展示广场，与其他学习者一起交流与欣赏',
  },
]

const steps = [
  {
    step: '01',
    title: '选择课文',
    desc: '从内置课文库中选择一篇课文，或输入自定义文本内容',
  },
  {
    step: '02',
    title: 'AI 分析生成',
    desc: '选择喜欢的画风，AI 自动分析课文并生成对应漫画图片',
  },
  {
    step: '03',
    title: '保存与分享',
    desc: '编辑调整场景，保存作品并分享至展示广场',
  },
]
</script>

<template>
  <div class="h-[calc(100vh-7.25rem)] overflow-y-scroll snap-y snap-mandatory scroll-smooth">
    <!-- Page 1: Hero -->
    <section class="h-full snap-start flex flex-col items-center justify-center relative
                    bg-gradient-to-b from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900
                    transition-colors px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight transition-colors">
          课文
          <span class="text-primary-600 dark:text-primary-400">漫游</span>
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-4 max-w-2xl mx-auto leading-relaxed transition-colors">
          将语文课文转化为生动漫画，让学习更有趣
        </p>
        <p class="text-base text-gray-400 dark:text-gray-500 mb-10 max-w-xl mx-auto transition-colors">
          基于 DeepSeek 大模型与 ComfyUI 图像生成技术，为每一篇课文创作独一无二的视觉故事
        </p>

        <div class="flex justify-center gap-4">
          <NuxtLink
            to="/workspace"
            class="px-8 py-3.5 bg-primary-600 text-white rounded-xl font-semibold text-lg
                   hover:bg-primary-700 shadow-lg shadow-primary-600/25 transition-all
                   hover:-translate-y-0.5"
          >
            开始创作
          </NuxtLink>
          <NuxtLink
            to="/gallery"
            class="px-8 py-3.5 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400
                   border-2 border-primary-600 dark:border-primary-400 rounded-xl
                   font-semibold text-lg hover:bg-primary-50 dark:hover:bg-gray-700 transition-all hover:-translate-y-0.5"
          >
            浏览作品
          </NuxtLink>
        </div>
      </div>

      <!-- 滚动提示 -->
      <div class="absolute bottom-8 inset-x-0 mx-auto w-fit flex flex-col items-center gap-1
                  text-gray-400 dark:text-gray-500 animate-bounce">
        <span class="text-sm">向下滚动</span>
        <span class="text-lg">↓</span>
      </div>
    </section>

    <!-- Page 2: 功能特点 -->
    <section class="h-full snap-start flex flex-col items-center justify-center px-4">
      <div class="max-w-5xl mx-auto w-full">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">核心功能</h2>
          <p class="text-gray-500 dark:text-gray-400 transition-colors">一站式课文漫画创作体验</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div
            v-for="feat in features"
            :key="feat.title"
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700
                   p-8 text-center hover:shadow-md transition-shadow"
          >
            <div class="text-4xl mb-4">{{ feat.icon }}</div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 transition-colors">{{ feat.title }}</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed transition-colors">{{ feat.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Page 3: 使用流程 -->
    <section class="min-h-full snap-start flex flex-col items-center justify-center px-4
                    bg-white dark:bg-gray-800 transition-colors">
      <div class="max-w-5xl mx-auto w-full">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">如何使用</h2>
          <p class="text-gray-500 dark:text-gray-400 transition-colors">三步完成课文到漫画的转化</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div
            v-for="(item, index) in steps"
            :key="item.step"
            class="relative text-center"
          >
            <div
              v-if="index < steps.length - 1"
              class="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gray-200 dark:bg-gray-600 transition-colors"
            />

            <div class="relative z-10 w-16 h-16 mx-auto mb-4 bg-primary-600 text-white
                        rounded-full flex items-center justify-center text-xl font-bold
                        shadow-lg shadow-primary-600/25">
              {{ item.step }}
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors">{{ item.title }}</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed transition-colors">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Page 4: 底部 CTA -->
    <section class="h-full snap-start flex flex-col items-center justify-center px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">开始你的创作之旅</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-8 max-w-lg mx-auto transition-colors">
          选择一篇课文，让 AI 为你绘制独一无二的漫画故事
        </p>
        <NuxtLink
          to="/workspace"
          class="inline-block px-10 py-4 bg-primary-600 text-white rounded-xl font-semibold text-lg
                 hover:bg-primary-700 shadow-lg shadow-primary-600/25 transition-all
                 hover:-translate-y-0.5"
        >
          立即开始
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
