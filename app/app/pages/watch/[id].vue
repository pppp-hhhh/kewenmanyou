<script setup lang="ts">
import type { Work } from '~/types/api'

const route = useRoute()
const workId = Number(route.params.id as string)

const { fetchWork } = useWorks()

const work = ref<Work | null>(null)
const isLoading = ref(true)
const activeScene = ref(0)

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
    month: 'long',
    day: 'numeric',
  })
}

// 下载单个图片
const downloadImage = (url: string, index: number) => {
  const link = document.createElement('a')
  link.href = url
  link.download = `${work.value?.title || 'work'}_${index + 1}.png`
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 导出全部图片
const exportAll = async () => {
  if (!work.value?.images) return

  for (let i = 0; i < (work.value?.images?.length || 0); i++) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const url = work.value?.images?.[i]
    if (url) downloadImage(url, i)
  }
}

onMounted(async () => {
  work.value = await fetchWork(workId)
  isLoading.value = false
})
</script>

<template>
  <div class="min-h-[calc(100vh-8rem)] bg-gray-50 dark:bg-neutral-900 transition-colors">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="animate-pulse space-y-6">
        <div class="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-1/3" />
        <div class="grid lg:grid-cols-2 gap-8">
          <div class="aspect-square bg-gray-200 dark:bg-neutral-700 rounded-2xl" />
          <div class="space-y-4">
            <div class="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-full" />
            <div class="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-2/3" />
          </div>
        </div>
      </div>
    </div>

    <!-- 作品不存在 -->
    <div v-else-if="!work" class="flex flex-col items-center justify-center py-16">
      <div class="text-6xl mb-4">😢</div>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">作品不存在</h3>
      <p class="text-gray-500 dark:text-neutral-400 mb-6">该作品可能已被删除或无法访问</p>
      <NuxtLink
        to="/gallery"
        class="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold
               hover:bg-primary-700 transition-colors"
      >
        返回展示广场
      </NuxtLink>
    </div>

    <!-- 作品内容 -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 顶部导航 -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/gallery"
            class="flex items-center gap-2 text-gray-600 dark:text-neutral-300 hover:text-primary-600
                   dark:hover:text-primary-400 transition-colors"
          >
            <span class="text-xl">←</span>
            <span>返回</span>
          </NuxtLink>
          <div class="h-6 w-px bg-gray-200 dark:bg-neutral-700" />
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ work.title }}
          </h1>
        </div>
        <span
          :class="['px-3 py-1 rounded-full text-sm font-medium', styleColors[work.style] || 'bg-gray-100 text-gray-600']"
        >
          {{ work.style }}
        </span>
      </div>

      <!-- 主要内容 -->
      <div class="grid lg:grid-cols-2 gap-8">
        <!-- 左侧：图片网格 -->
        <div class="space-y-4">
          <!-- 主图 -->
          <div
            v-if="work.images && work.images.length > 0"
            class="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700"
          >
            <img
              :src="work.images[activeScene]"
              :alt="`场景 ${activeScene + 1}`"
              class="w-full h-full object-contain"
            >
          </div>

          <!-- 缩略图列表 -->
          <div v-if="work.images && work.images.length > 1" class="flex gap-2 overflow-x-auto pb-2">
            <button
              v-for="(img, index) in work.images"
              :key="index"
              :class="[
                'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors',
                activeScene === index
                  ? 'border-primary-500'
                  : 'border-transparent opacity-60 hover:opacity-100'
              ]"
              @click="activeScene = index"
            >
              <img :src="img" :alt="`场景 ${index + 1}`" class="w-full h-full object-cover">
            </button>
          </div>

          <!-- 下载按钮 -->
          <div class="flex gap-3">
            <button
              v-if="work.images && work.images.length === 1"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white
                     rounded-xl font-semibold hover:bg-primary-700 transition-colors"
              @click="work.images?.[0] && downloadImage(work.images[0], 0)"
            >
              <span>⬇️</span>
              <span>下载图片</span>
            </button>
            <button
              v-else-if="work.images && work.images.length > 1"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white
                     rounded-xl font-semibold hover:bg-primary-700 transition-colors"
              @click="exportAll"
            >
              <span>⬇️</span>
              <span>导出全部 ({{ work.images.length }}张)</span>
            </button>
          </div>
        </div>

        <!-- 右侧：场景描述 -->
        <div class="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-700 p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">场景列表</h2>

          <div class="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div
              v-for="(scene, index) in work.scenes"
              :key="index"
              :class="[
                'p-4 rounded-xl cursor-pointer transition-all',
                activeScene === index
                  ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                  : 'bg-gray-50 dark:bg-neutral-700/50 hover:bg-gray-100 dark:hover:bg-neutral-700'
              ]"
              @click="activeScene = index"
            >
              <div class="flex items-start gap-3">
                <span
                  :class="[
                    'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                    activeScene === index
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-neutral-600 text-gray-600 dark:text-neutral-300'
                  ]"
                >
                  {{ index + 1 }}
                </span>
                <div class="flex-1 min-w-0">
                  <p class="text-gray-900 dark:text-white font-medium mb-1">
                    {{ scene.description_cn }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-neutral-400 truncate">
                    {{ scene.prompt_en }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 元信息 -->
          <div class="mt-6 pt-4 border-t border-gray-100 dark:border-neutral-700">
            <div class="flex items-center justify-between text-sm text-gray-500 dark:text-neutral-400">
              <span>共 {{ work.scenes?.length || 0 }} 个场景</span>
              <span>{{ formatDate(work.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
