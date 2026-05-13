<script setup lang="ts">
import { STYLE_OPTIONS } from '~/types/api'
import { useWorkspaceStore } from '~/stores/workspace'

const store = useWorkspaceStore()
const { startPoll } = useTaskPoll()

// 暗色模式
const { isDark, toggle } = useDarkMode()

// 课文列表（从数据库获取）
const { data: lessons, refresh: refreshLessons } = await useFetch('/api/lessons', {
  default: () => [],
})

// 课文来源：选择课文 或 'custom'
const textSource = ref<'select' | 'custom'>('select')
const selectedLessonId = ref<number | null>(null)
const selectOpen = ref(false)

// 画风选择
const selectedStyle = ref<StyleType>('写实古风')

// 自定义课文内容
const customText = ref('')

// 分析课文
const analyzeText = async () => {
  const text = textSource.value === 'custom'
    ? customText.value
    : lessons.value?.find((l: any) => l.id === selectedLessonId.value)?.content || ''

  if (!text.trim()) {
    alert('请输入课文内容')
    return
  }

  store.setAnalyzing(true)
  store.setProgressMsg('AI 正在分析课文...')

  try {
    const result = await $fetch<{ scenes: { description_cn: string; prompt_en: string }[] }>('/api/analyze', {
      method: 'POST',
      body: {
        text,
        style: selectedStyle.value,
      },
    })
    store.setScenes(result.scenes)
    store.setProgressMsg(`分析完成！生成了 ${result.scenes.length} 个场景`)
  }
  catch (error) {
    console.error('分析失败:', error)
    store.setProgressMsg('分析失败，请重试')
  }
  finally {
    store.setAnalyzing(false)
  }
}

// 画风对应的提示词前缀
const stylePromptMap: Record<StyleType, string> = {
  '写实古风': 'realistic ancient Chinese style, traditional Chinese painting aesthetic, detailed, historical accuracy,',
  '水墨风格': 'Chinese ink painting style, wash painting, sumi-e, black and white, traditional brush strokes,',
  '彩色插画': 'colorful illustration, vibrant, modern cartoon style, anime, bright colors,'
}

// 开始生成
const generateImages = async () => {
  if (store.scenes.length === 0) {
    alert('请先生成场景')
    return
  }

  try {
    // 为每个场景的 prompt 加上画风前缀
    const promptsWithStyle = store.scenes.map(scene =>
      `${stylePromptMap[selectedStyle.value]} ${scene.prompt_en}`
    )

    const result = await $fetch<{ task_id: string }>('/api/generate', {
      method: 'POST',
      body: {
        prompts: promptsWithStyle,
        style: selectedStyle.value,
      },
    })
    startPoll(result.task_id)
  }
  catch (error) {
    console.error('提交生成任务失败:', error)
    store.setProgressMsg('提交生成任务失败')
  }
}

// 保存作品
const saveWork = async () => {
  if (!store.taskStatus?.images.length) {
    alert('没有可保存的图片')
    return
  }

  try {
    const result = await $fetch<{ work_id: number; message: string }>('/api/works', {
      method: 'POST',
      body: {
        custom_title: `课文漫画 - ${new Date().toLocaleDateString()}`,
        scenes: store.scenes,
        images: store.taskStatus.images.map((i: any) => i.url),
        style: selectedStyle.value,
        is_public: false,
      },
    })
    store.setProgressMsg(`作品已保存！ID: ${result.work_id}`)
    alert(`作品保存成功！ID: ${result.work_id}`)
  }
  catch (error) {
    console.error('保存失败:', error)
    store.setProgressMsg('保存失败，请重试')
  }
}

// 导出长图
const exportWork = async () => {
  if (!store.taskStatus?.images.length) {
    alert('没有可导出的图片')
    return
  }

  store.setProgressMsg('正在生成导出文件...')

  try {
    // 先保存作品获取 work_id
    const result = await $fetch<{ work_id: number; message: string }>('/api/works', {
      method: 'POST',
      body: {
        custom_title: `课文漫画 - ${new Date().toLocaleDateString()}`,
        scenes: store.scenes,
        images: store.taskStatus.images.map((i: any) => i.url),
        style: selectedStyle.value,
        is_public: false,
      },
    })

    // 通过前端代理下载
    const response = await fetch(`/api/works/${result.work_id}/export`)
    const blob = await response.blob()

    // 创建下载链接
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `课文漫画_${result.work_id}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    store.setProgressMsg('导出成功！')
  }
  catch (error) {
    console.error('导出失败:', error)
    store.setProgressMsg('导出失败，请重试')
  }
}
</script>

<template>
  <div class="py-6 bg-gray-100 dark:bg-neutral-900">
    <!-- 主内容区 -->
    <main class="max-w-7xl mx-auto px-4">
      <div class="flex gap-6 h-[calc(100vh-180px)]">
        <!-- 左侧 -->
        <div class="w-1/2 space-y-4 overflow-y-auto scrollbar-none">
          <!-- 课文来源 -->
          <section class="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-indigo-50 dark:border-neutral-700 transition-colors">
            <h2 class="text-base font-semibold mb-3 text-indigo-900 dark:text-neutral-200 transition-colors">
              课文来源
            </h2>

            <div class="flex bg-neutral-200 dark:bg-neutral-700 p-1 rounded-xl mb-4">
              <label class="flex-1 cursor-pointer">
                <input
                  v-model="textSource"
                  type="radio"
                  value="select"
                  class="sr-only"
                >
                <div
                  class="py-2 px-4 rounded-lg text-center text-sm font-medium transition-all duration-200"
                  :class="textSource === 'select' ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-sm' : 'text-gray-500 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400'"
                >
                  选择内置课文
                </div>
              </label>
              <label class="flex-1 cursor-pointer">
                <input
                  v-model="textSource"
                  type="radio"
                  value="custom"
                  class="sr-only"
                >
                <div
                  class="py-2 px-4 rounded-lg text-center text-sm font-medium transition-all duration-200"
                  :class="textSource === 'custom' ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-sm' : 'text-gray-500 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400'"
                >
                  自定义文本
                </div>
              </label>
            </div>

            <div v-if="textSource === 'select'" class="mb-4 relative">
              <!-- Custom Select Trigger -->
              <button
                type="button"
                class="w-full px-4 py-2.5 bg-white dark:bg-neutral-700 border border-indigo-100 dark:border-neutral-600 rounded-xl text-left text-gray-700 dark:text-neutral-200
                       flex items-center justify-between gap-2
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400
                       hover:border-indigo-300 dark:hover:border-neutral-500 hover:shadow-md transition-all duration-200"
                @click="selectOpen = !selectOpen"
                @blur="selectOpen = false"
              >
                <span :class="selectedLessonId ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-neutral-500'">
                  {{ selectedLessonId ? (lessons?.find((l: any) => l.id === selectedLessonId)?.title || '请选择课文') : '请选择课文' }}
                </span>
                <!-- Custom Chevron -->
                <svg class="w-4 h-4 text-indigo-400 flex-shrink-0 transition-transform duration-200" :class="{ 'rotate-180': selectOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Custom Dropdown -->
              <Transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div
                  v-if="selectOpen"
                  class="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-sm dark:bg-gray-800 border border-indigo-100 dark:border-gray-600 rounded-xl shadow-xl shadow-indigo-200/30 overflow-hidden"
                >
                  <div class="max-h-60 overflow-y-auto">
                    <button
                      v-for="lesson in lessons"
                      :key="lesson.id"
                      type="button"
                      class="w-full px-4 py-2.5 text-left text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 dark:hover:bg-gray-700 transition-all duration-150"
                      :class="{ 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 dark:from-indigo-900/30 dark:to-purple-900/30 dark:text-indigo-300': selectedLessonId === lesson.id }"
                      @mousedown.prevent="selectedLessonId = lesson.id; selectOpen = false"
                    >
                      <span class="font-medium">{{ lesson.title }}</span>
                    </button>
                  </div>
                </div>
              </Transition>
            </div>

            <div v-else>
              <textarea
                v-model="customText"
                rows="6"
                placeholder="请输入课文内容..."
                class="w-full px-4 py-3 border border-indigo-100 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 bg-white dark:bg-neutral-700 dark:text-neutral-100 dark:placeholder-neutral-500 transition-all duration-200"
              />
            </div>
          </section>

          <!-- 画风选择 -->
          <section class="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-indigo-50 dark:border-neutral-700 transition-colors">
            <h2 class="text-base font-semibold mb-3 text-indigo-900 dark:text-neutral-200 transition-colors">
              画风选择
            </h2>
            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="style in STYLE_OPTIONS"
                :key="style"
                :class="[
                  'px-4 py-3 rounded-xl border-2 transition-all duration-200',
                  selectedStyle === style
                    ? 'border-indigo-500 bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50'
                    : 'border-indigo-100 dark:border-neutral-600 hover:border-indigo-300 dark:hover:border-neutral-500 hover:shadow-md bg-white dark:bg-neutral-700 dark:text-neutral-200',
                ]"
                @click="selectedStyle = style"
              >
                {{ style }}
              </button>
            </div>
          </section>

          <!-- AI 分析 -->
          <section class="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-indigo-50 dark:border-neutral-700 transition-colors">
            <h2 class="text-base font-semibold mb-3 text-indigo-900 dark:text-neutral-200 transition-colors">
              AI 分析
            </h2>
            <button
              :disabled="store.isAnalyzing || (!selectedLessonId && !customText.trim())"
              class="w-full px-6 py-3 text-white font-medium rounded-xl shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/50
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 flex items-center justify-center gap-2
                     hover:shadow-xl hover:shadow-indigo-300/50 hover:-translate-y-0.5
                     active:translate-y-0"
              style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);"
              @click="analyzeText"
            >
              <svg v-if="store.isAnalyzing" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <span v-if="store.isAnalyzing">分析中...</span>
              <span v-else>✨ AI 分析课文</span>
            </button>
          </section>

          <!-- 场景编辑 -->
          <section class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-indigo-100/30 p-5 border border-indigo-50 dark:border-gray-700 transition-colors">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-base font-semibold text-indigo-900 dark:text-indigo-300 transition-colors">
                场景编辑
              </h2>
              <span class="text-sm text-indigo-600 dark:text-indigo-400 font-medium px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">{{ store.scenes.length }} 个场景</span>
            </div>

            <div v-if="store.scenes.length === 0" class="text-center py-8 text-gray-400 dark:text-neutral-500 text-sm">
              <p class="mb-1">暂无场景</p>
              <p class="text-xs">请先选择课文并点击 AI 分析</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="(scene, index) in store.scenes"
                :key="index"
                class="p-4 border border-indigo-100 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-700"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-indigo-700 dark:text-indigo-400">场景 {{ index + 1 }}</span>
                  <div class="flex gap-1">
                    <button
                      class="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg disabled:opacity-30 transition-colors"
                      :disabled="index === 0"
                      title="上移"
                      @click="store.moveSceneUp(index)"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/></svg>
                    </button>
                    <button
                      class="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg disabled:opacity-30 transition-colors"
                      :disabled="index === store.scenes.length - 1"
                      title="下移"
                      @click="store.moveSceneDown(index)"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    </button>
                    <button
                      class="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="删除"
                      @click="store.removeScene(index)"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </div>
                </div>
                <textarea
                  v-model="scene.description_cn"
                  rows="2"
                  class="w-full px-3 py-2 text-sm border border-indigo-100 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all"
                  placeholder="场景描述（中文）"
                  @blur="store.updateScene(index, { description_cn: scene.description_cn })"
                />
              </div>
            </div>

            <button
              v-if="store.scenes.length > 0"
              :disabled="store.isGenerating"
              class="w-full mt-4 px-6 py-3 text-white font-medium rounded-xl shadow-lg
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 flex items-center justify-center gap-2
                     hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);"
              @click="generateImages"
            >
              <span v-if="store.isGenerating">生成中...</span>
              <span v-else>🎨 开始生成</span>
            </button>
          </section>

          <!-- 进度提示 -->
          <section v-if="store.progressMsg" class="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 mt-4">
            <p class="text-indigo-700 dark:text-indigo-300 text-center font-medium">
              {{ store.progressMsg }}
            </p>
          </section>
        </div>

        <!-- 右侧预览 -->
        <div class="w-1/2 flex flex-col">
          <section class="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg shadow-indigo-100/30 flex-1 flex flex-col min-h-0 border border-indigo-50 dark:border-neutral-700 transition-colors">
            <div class="flex items-center justify-between px-5 py-4 border-b border-indigo-50 dark:border-neutral-700 flex-shrink-0">
              <h2 class="text-base font-semibold text-indigo-900 dark:text-neutral-200 transition-colors">
                图片预览
              </h2>
              <span v-if="store.taskStatus" class="text-sm text-indigo-600 dark:text-indigo-400 font-medium px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
                {{ store.taskStatus.completed }}/{{ store.taskStatus.total }}
              </span>
            </div>

            <!-- 空状态 -->
            <div v-if="store.scenes.length === 0" class="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div class="w-20 h-20 mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <span class="text-3xl">🎨</span>
              </div>
              <p class="text-gray-500 dark:text-neutral-400 font-medium mb-1">暂无预览</p>
              <p class="text-gray-400 dark:text-neutral-500 text-sm">选择课文并分析后将在这里显示</p>
            </div>

            <!-- 单张 -->
            <div v-if="store.scenes.length === 1" class="flex-1 overflow-y-auto">
              <div class="relative w-full h-full flex items-center justify-center">
                <!-- 生成成功 -->
                <img
                  v-if="store.taskStatus?.images[0]?.status === 'completed'"
                  :src="store.taskStatus.images[0].url"
                  :alt="store.scenes[0].description_cn"
                  class="max-w-full max-h-full object-contain"
                  loading="lazy"
                >
                <!-- 正在生成 -->
                <div
                  v-else-if="store.taskStatus?.images[0]?.status === 'processing'"
                  class="absolute inset-0 flex flex-col items-center justify-center bg-indigo-50 dark:bg-neutral-700"
                >
                  <div class="w-8 h-8 border-2 border-indigo-300 border-t-indigo-500 rounded-full animate-spin mb-2"></div>
                  <span class="text-indigo-400 text-sm">生成中...</span>
                </div>
                <!-- 生成失败 -->
                <div
                  v-else-if="store.taskStatus?.images[0]?.status === 'failed'"
                  class="absolute inset-0 flex flex-col items-center justify-center bg-red-50 dark:bg-neutral-700"
                >
                  <span class="text-red-400 text-sm">生成失败</span>
                </div>
                <!-- 等待生成 -->
                <div
                  v-else
                  class="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-neutral-700"
                >
                  <span class="text-gray-400 text-sm">等待生成</span>
                </div>
                <div class="absolute bottom-4 right-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs px-2 py-1 rounded-lg shadow">
                  AI
                </div>
              </div>
            </div>

            <!-- 多张 -->
            <div v-if="store.scenes.length > 1" class="flex-1 overflow-y-auto">
              <div
                v-for="(scene, index) in store.displayedScenes"
                :key="index"
                class="border-b border-indigo-50 dark:border-neutral-700 last:border-b-0"
              >
                <div class="relative w-full" style="padding-bottom: 100%;">
                  <!-- 生成成功：显示图片 -->
                  <img
                    v-if="store.taskStatus?.images[index]?.status === 'completed'"
                    :src="store.taskStatus.images[index].url"
                    :alt="scene.description_cn"
                    class="absolute inset-0 w-full h-full object-contain"
                    loading="lazy"
                  >
                  <!-- 正在生成中 -->
                  <div
                    v-else-if="store.taskStatus?.images[index]?.status === 'processing'"
                    class="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-indigo-900/20"
                  >
                    <div class="w-8 h-8 border-2 border-indigo-300 border-t-indigo-500 rounded-full animate-spin mb-2"></div>
                    <span class="text-indigo-400 text-sm">生成中...</span>
                  </div>
                  <!-- 生成失败 -->
                  <div
                    v-else-if="store.taskStatus?.images[index]?.status === 'failed'"
                    class="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-800 dark:to-red-900/20"
                  >
                    <span class="text-red-400 text-sm">生成失败</span>
                  </div>
                  <!-- 等待生成（占位） -->
                  <div
                    v-else
                    class="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900/20"
                  >
                    <span class="text-gray-400 text-sm">等待生成</span>
                  </div>
                  <div class="absolute top-2 right-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs px-2 py-1 rounded-lg shadow">
                    AI
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 保存 & 导出 -->
          <section v-if="store.isGeneratingComplete" class="mt-4 space-y-2">
            <button
              class="w-full px-6 py-3 text-white font-medium rounded-xl shadow-lg shadow-green-200/50 dark:shadow-green-900/50
                     hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);"
              @click="saveWork"
            >
              💾 保存作品
            </button>
            <button
              class="w-full px-6 py-3 text-white font-medium rounded-xl shadow-lg shadow-purple-200/50 dark:shadow-purple-900/50
                     hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              style="background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);"
              @click="exportWork"
            >
              📥 导出长图
            </button>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>
