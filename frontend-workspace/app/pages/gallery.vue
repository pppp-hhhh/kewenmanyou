<script setup lang="ts">
import type { Work } from '~/types/api'

const { fetchPublicWorks } = useWorks()

const works = ref<Work[]>([])
const isLoading = ref(true)

// 画风对应的颜色
const styleColors: Record<string, string> = {
  '写实古风': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  '水墨风格': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  '彩色插画': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
}

// 格式化时间
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// 获取封面图
const getThumbnail = (work: Work) => {
  if (work.thumbnail) return work.thumbnail
  if (work.images && work.images.length > 0) return work.images[0]
  return '/placeholder.png'
}

onMounted(async () => {
  works.value = await fetchPublicWorks()
  isLoading.value = false
})
</script>

<template>
  <div class="min-h-[calc(100vh-8rem)] bg-gray-50 dark:bg-neutral-900 transition-colors">
    <!-- 页面标题 -->
    <div class="bg-white dark:bg-neutral-800 border-b border-gray-100 dark:border-neutral-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">展示广场</h1>
        <p class="mt-2 text-gray-500 dark:text-neutral-400">发现并欣赏由 AI 生成的课文漫画作品</p>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="i in 8" :key="i" class="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-sm">
          <div class="aspect-[4/3] bg-gray-200 dark:bg-neutral-700 animate-pulse" />
          <div class="p-4 space-y-3">
            <div class="h-5 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse w-3/4" />
            <div class="h-4 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse w-1/2" />
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="works.length === 0" class="text-center py-16">
        <div class="text-6xl mb-4">📚</div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">暂无公开作品</h3>
        <p class="text-gray-500 dark:text-neutral-400 mb-6">成为第一个分享作品的人吧！</p>
        <NuxtLink
          to="/workspace"
          class="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold
                 hover:bg-primary-700 transition-colors"
        >
          去创作
        </NuxtLink>
      </div>

      <!-- 作品网格 -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <NuxtLink
          v-for="work in works"
          :key="work.id"
          :to="`/watch/${work.id}`"
          class="group bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-sm
                 border border-gray-100 dark:border-neutral-700
                 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-800
                 transition-all duration-200"
        >
          <!-- 封面图 -->
          <div class="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-neutral-700">
            <img
              :src="getThumbnail(work)"
              :alt="work.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            >
          </div>

          <!-- 信息 -->
          <div class="p-4">
            <h3 class="font-semibold text-gray-900 dark:text-white truncate mb-1">
              {{ work.title }}
            </h3>
            <!-- 课文描述 -->
            <p v-if="work.scenes && work.scenes.length > 0" class="text-xs text-gray-500 dark:text-neutral-400 mb-2 line-clamp-2">
              {{ work.scenes[0]?.description_cn || '' }}
            </p>
            <div class="flex items-center justify-between text-sm">
              <span
                :class="['px-2 py-0.5 rounded-full text-xs font-medium', styleColors[work.style] || 'bg-gray-100 text-gray-600']"
              >
                {{ work.style }}
              </span>
              <span class="text-gray-400 dark:text-neutral-500">
                {{ formatDate(work.created_at) }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
