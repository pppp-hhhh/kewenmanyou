<script setup lang="ts">
import { STYLE_OPTIONS } from '~/types/api'
import { useWorkspaceStore } from '~/stores/workspace'

const store = useWorkspaceStore()
const { startPoll } = useTaskPoll()

// 课文列表（从 API 获取）
const { data: texts } = await useFetch('/api/texts', {
  default: () => [],
})

// 课文来源：内置课文 ID 或 'custom'
const textSource = ref<'select' | 'custom'>('select')
const selectedTextId = ref<number | null>(null)

// 画风选择
const selectedStyle = ref<StyleType>('写实古风')

// 自定义课文内容
const customText = ref('')

// 分析课文
const analyzeText = async () => {
  const text = textSource.value === 'custom'
    ? customText.value
    : texts.value?.find((t: any) => t.id === selectedTextId.value)?.content || ''

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
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-indigo-600">
          课文漫游 - 工作台
        </h1>
        <div class="text-sm text-gray-500">
          AI 漫画生成器
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="max-w-7xl mx-auto px-4 py-6">
      <div class="flex gap-6 h-[calc(100vh-180px)]">
        <!-- 左侧 -->
        <div class="w-1/2 space-y-4 overflow-y-auto">
          <!-- 课文来源 -->
          <section class="bg-white rounded-lg shadow p-4">
            <h2 class="text-base font-semibold mb-2">
              课文来源
            </h2>

            <div class="flex gap-4 mb-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="textSource"
                  type="radio"
                  value="select"
                  class="text-indigo-600"
                >
                <span>选择内置课文</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="textSource"
                  type="radio"
                  value="custom"
                  class="text-indigo-600"
                >
                <span>自定义文本</span>
              </label>
            </div>

            <div v-if="textSource === 'select'" class="mb-4">
              <select
                v-model="selectedTextId"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option :value="null" disabled>
                  请选择课文
                </option>
                <option v-for="text in texts" :key="text.id" :value="text.id">
                  {{ text.title }} - {{ text.author }}
                </option>
              </select>
            </div>

            <div v-else>
              <textarea
                v-model="customText"
                rows="6"
                placeholder="请输入课文内容..."
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </section>

          <!-- 画风选择 -->
          <section class="bg-white rounded-lg shadow p-6">
            <h2 class="text-base font-semibold mb-2">
              画风选择
            </h2>
            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="style in STYLE_OPTIONS"
                :key="style"
                :class="[
                  'px-4 py-3 rounded-lg border-2 transition-all',
                  selectedStyle === style
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-gray-300',
                ]"
                @click="selectedStyle = style"
              >
                {{ style }}
              </button>
            </div>
          </section>

          <!-- AI 分析 -->
          <section class="bg-white rounded-lg shadow p-6">
            <h2 class="text-base font-semibold mb-2">
              AI 分析
            </h2>
            <button
              :disabled="store.isAnalyzing || (!selectedTextId && !customText.trim())"
              class="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium
                     hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors flex items-center justify-center gap-2"
              @click="analyzeText"
            >
              <span v-if="store.isAnalyzing">分析中...</span>
              <span v-else>AI 分析课文</span>
            </button>
          </section>

          <!-- 场景编辑 -->
          <section class="bg-white rounded-lg shadow p-4">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-base font-semibold">
                场景编辑
              </h2>
              <span class="text-sm text-gray-500">{{ store.scenes.length }} 个场景</span>
            </div>

            <div v-if="store.scenes.length === 0" class="text-center py-4 text-gray-400 text-sm">
              暂无场景，请先分析课文
            </div>

            <div v-else class="space-y-2">
              <div
                v-for="(scene, index) in store.scenes"
                :key="index"
                class="p-4 border rounded-lg"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-500">场景 {{ index + 1 }}</span>
                  <div class="flex gap-1">
                    <button
                      class="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                      :disabled="index === 0"
                      title="上移"
                      @click="store.moveSceneUp(index)"
                    >
                      ↑
                    </button>
                    <button
                      class="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                      :disabled="index === store.scenes.length - 1"
                      title="下移"
                      @click="store.moveSceneDown(index)"
                    >
                      ↓
                    </button>
                    <button
                      class="p-1 hover:bg-red-50 text-red-500 rounded"
                      title="删除"
                      @click="store.removeScene(index)"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <textarea
                  v-model="scene.description_cn"
                  rows="2"
                  class="w-full px-2 py-1 text-sm border rounded mb-2"
                  placeholder="场景描述（中文）"
                  @blur="store.updateScene(index, { description_cn: scene.description_cn })"
                />
              </div>
            </div>

            <button
              v-if="store.scenes.length > 0"
              :disabled="store.isGenerating"
              class="w-full mt-4 px-6 py-3 bg-green-600 text-white rounded-lg font-medium
                     hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
              @click="generateImages"
            >
              {{ store.isGenerating ? '生成中...' : '开始生成' }}
            </button>
          </section>

          <!-- 进度提示 -->
          <section v-if="store.progressMsg" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-blue-700 text-center">
              {{ store.progressMsg }}
            </p>
          </section>
        </div>

        <!-- 右侧预览 -->
        <div class="w-1/2 flex flex-col">
          <section class="bg-white rounded-lg shadow flex-1 flex flex-col min-h-0">
            <div class="flex items-center justify-between px-4 py-3 border-b flex-shrink-0">
              <h2 class="text-base font-semibold">
                图片预览
              </h2>
              <span v-if="store.taskStatus" class="text-sm text-gray-500">
                {{ store.taskStatus.completed }}/{{ store.taskStatus.total }}
              </span>
            </div>

            <!-- 无场景占位 -->
            <div v-if="store.scenes.length === 0" class="flex-1 overflow-y-auto">
              <div
                v-for="i in 6"
                :key="i"
                class="border-b last:border-b-0"
              >
                <div class="relative w-full bg-gray-100" style="padding-bottom: 100%;">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-gray-400 text-sm">场景 {{ i }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 单张 -->
            <div v-else-if="store.scenes.length === 1" class="flex-1 overflow-y-auto">
              <div class="relative w-full h-full flex items-center justify-center">
                <img
                  v-if="store.taskStatus?.images[0]"
                  :src="store.taskStatus.images[0].url"
                  :alt="store.scenes[0].description_cn"
                  class="max-w-full max-h-full object-contain"
                  loading="lazy"
                >
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center"
                >
                  <span class="text-gray-400">生成中...</span>
                </div>
                <div class="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  AI生成
                </div>
              </div>
            </div>

            <!-- 多张 -->
            <div v-else class="flex-1 overflow-y-auto">
              <div
                v-for="(scene, index) in store.scenes"
                :key="index"
                class="border-b last:border-b-0"
              >
                <div class="relative w-full" style="padding-bottom: 100%;">
                  <img
                    v-if="store.taskStatus?.images[index]"
                    :src="store.taskStatus.images[index].url"
                    :alt="scene.description_cn"
                    class="absolute inset-0 w-full h-full object-contain"
                    loading="lazy"
                  >
                  <div
                    v-else
                    class="absolute inset-0 flex items-center justify-center bg-gray-100"
                  >
                    <span class="text-gray-400">生成中...</span>
                  </div>
                  <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                    <p class="text-white text-xs">{{ scene.description_cn }}</p>
                  </div>
                  <div class="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    AI生成
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 保存 -->
          <section v-if="store.isGeneratingComplete" class="bg-green-50 border border-green-200 rounded-lg p-4">
            <button
              class="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium
                     hover:bg-green-700 transition-colors"
              @click="saveWork"
            >
              保存作品
            </button>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>
