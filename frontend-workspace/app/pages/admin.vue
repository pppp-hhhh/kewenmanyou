<script setup lang="ts">
import { STYLE_OPTIONS, type StyleType } from '~/types/api'

type Tab = 'lessons' | 'works'
const activeTab = ref<Tab>('lessons')

// ================= 课文管理 =================
interface Lesson {
  id: number
  title: string
  content: string
  status?: string
  created_at?: string
}

const lessons = ref<Lesson[]>([])
const lessonsLoading = ref(false)
const lessonTitle = ref('')
const lessonContent = ref('')
const lessonEditing = ref<number | null>(null)
const lessonLoading = ref(false)
const lessonMessage = ref('')

const fetchLessons = async () => {
  lessonsLoading.value = true
  try {
    lessons.value = await $fetch<Lesson[]>('/api/lessons')
  } catch (e) {
    console.error('获取课文失败', e)
  } finally {
    lessonsLoading.value = false
  }
}

const addLesson = async () => {
  if (!lessonTitle.value.trim() || !lessonContent.value.trim()) {
    lessonMessage.value = '请填写标题和内容'
    return
  }
  lessonLoading.value = true
  lessonMessage.value = ''
  try {
    await $fetch('/api/lessons', {
      method: 'POST',
      body: { title: lessonTitle.value, content: lessonContent.value },
    })
    lessonMessage.value = '添加成功'
    lessonTitle.value = ''
    lessonContent.value = ''
    await fetchLessons()
  } catch (e: any) {
    lessonMessage.value = '添加失败'
  } finally {
    lessonLoading.value = false
  }
}

const editLesson = (lesson: Lesson) => {
  lessonEditing.value = lesson.id
  lessonTitle.value = lesson.title
  lessonContent.value = lesson.content
}

const cancelEditLesson = () => {
  lessonEditing.value = null
  lessonTitle.value = ''
  lessonContent.value = ''
}

const saveLesson = async (lesson: Lesson) => {
  try {
    await $fetch('/api/lessons/' + lesson.id, {
      method: 'PUT',
      body: { title: lessonTitle.value, content: lessonContent.value },
    })
    lessonMessage.value = '更新成功'
    cancelEditLesson()
    await fetchLessons()
  } catch (e: any) {
    lessonMessage.value = '更新失败'
  }
}

const deleteLesson = async (id: number) => {
  if (!confirm('确定要删除这篇课文吗？')) return
  try {
    await $fetch('/api/lessons/' + id, { method: 'DELETE' })
    lessonMessage.value = '删除成功'
    await fetchLessons()
  } catch (e: any) {
    lessonMessage.value = '删除失败'
  }
}

// ================= 作品管理 =================
interface Work {
  id: number
  title: string
  content?: string  // 课文内容/描述
  style: string
  scenes: any[]
  images: any[]
  is_public?: boolean
  created_at?: string
}

const works = ref<Work[]>([])
const worksLoading = ref(false)
const workTitle = ref('')
const workContent = ref('')  // 课文内容/描述
const workStyle = ref<StyleType>('彩色插画')
const scenes = ref([{ description_cn: '', prompt_en: '' }])
const imageUrls = ref([''])
const workPublic = ref(true)
const workEditing = ref<number | null>(null)
const workLoading = ref(false)
const workMessage = ref('')

const fetchWorks = async () => {
  worksLoading.value = true
  try {
    works.value = await $fetch<Work[]>('/api/works')
  } catch (e) {
    console.error('获取作品失败', e)
  } finally {
    worksLoading.value = false
  }
}

const resetWorkForm = () => {
  workTitle.value = ''
  workContent.value = ''
  workStyle.value = '彩色插画'
  scenes.value = [{ description_cn: '', prompt_en: '' }]
  imageUrls.value = ['']
  workPublic.value = true
}

const addScene = () => scenes.value.push({ description_cn: '', prompt_en: '' })
const removeScene = (i: number) => { if (scenes.value.length > 1) scenes.value.splice(i, 1) }
const addImage = () => imageUrls.value.push('')
const removeImage = (i: number) => { if (imageUrls.value.length > 1) imageUrls.value.splice(i, 1) }

const addWork = async () => {
  if (!workTitle.value.trim()) {
    workMessage.value = '请填写标题'
    return
  }
  const validScenes = scenes.value.filter(s => s.description_cn.trim())
  const validImages = imageUrls.value.filter(url => url.trim())
  workLoading.value = true
  workMessage.value = ''
  try {
    await $fetch('/api/works', {
      method: 'POST',
      body: {
        custom_title: workTitle.value,
        custom_content: workContent.value,
        scenes: validScenes,
        images: validImages,
        style: workStyle.value,
        is_public: workPublic.value,
      },
    })
    workMessage.value = '添加成功'
    resetWorkForm()
    await fetchWorks()
  } catch (e: any) {
    workMessage.value = '添加失败'
  } finally {
    workLoading.value = false
  }
}

const editWork = (work: Work) => {
  workEditing.value = work.id
  workTitle.value = work.title
  workContent.value = work.content || ''
  workStyle.value = work.style as StyleType
  scenes.value = work.scenes && work.scenes.length ? work.scenes : [{ description_cn: '', prompt_en: '' }]
  imageUrls.value = work.images && work.images.length ? work.images : ['']
  workPublic.value = work.is_public ?? true
}

const cancelEditWork = () => {
  workEditing.value = null
  resetWorkForm()
}

const saveWork = async (work: Work) => {
  try {
    await $fetch('/api/works/' + work.id, {
      method: 'PUT',
      body: {
        title: workTitle.value,
        content: workContent.value,
        style: workStyle.value,
        scenes: scenes.value,
        images: imageUrls.value,
        is_public: workPublic.value,
      },
    })
    workMessage.value = '更新成功'
    cancelEditWork()
    await fetchWorks()
  } catch (e: any) {
    workMessage.value = '更新失败'
  }
}

const deleteWork = async (id: number) => {
  if (!confirm('确定要删除这个作品吗？')) return
  try {
    await $fetch('/api/works/' + id, { method: 'DELETE' })
    workMessage.value = '删除成功'
    await fetchWorks()
  } catch (e: any) {
    workMessage.value = '删除失败'
  }
}

onMounted(() => {
  fetchLessons()
  fetchWorks()
})
</script>

<template>
  <div class="py-6 bg-gray-100 dark:bg-neutral-900">
    <main class="max-w-7xl mx-auto px-4">
      <div class="flex gap-6 h-[calc(100vh-180px)]">
        <!-- 左侧导航 -->
        <div class="w-48 flex-shrink-0">
          <section class="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-indigo-50 dark:border-neutral-700 h-full">
            <h2 class="text-base font-semibold mb-4 text-indigo-900 dark:text-neutral-200">管理后台</h2>
            <nav class="space-y-2">
              <button
                @click="activeTab = 'lessons'"
                class="w-full px-4 py-2.5 rounded-xl text-left text-sm font-medium transition-all duration-200"
                :class="activeTab === 'lessons'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/50'
                  : 'text-gray-600 dark:text-neutral-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-400'"
              >
                📚 课文管理
              </button>
              <button
                @click="activeTab = 'works'"
                class="w-full px-4 py-2.5 rounded-xl text-left text-sm font-medium transition-all duration-200"
                :class="activeTab === 'works'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/50'
                  : 'text-gray-600 dark:text-neutral-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-400'"
              >
                🎨 作品管理
              </button>
            </nav>
            <div class="mt-6 pt-4 border-t border-indigo-50 dark:border-neutral-700 space-y-2">
              <NuxtLink
                to="/gallery"
                class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-gray-600 dark:text-neutral-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-400 transition-all duration-200"
              >
                🏠 展示广场
              </NuxtLink>
              <NuxtLink
                to="/workspace"
                class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-gray-600 dark:text-neutral-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-400 transition-all duration-200"
              >
                ⚙️ 工作台
              </NuxtLink>
            </div>
          </section>
        </div>

        <!-- 右侧内容 -->
        <div class="flex-1 overflow-y-auto space-y-6">
          <!-- 课文管理 -->
          <template v-if="activeTab === 'lessons'">
            <!-- 表单 -->
            <section class="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-indigo-50 dark:border-neutral-700">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-base font-semibold text-indigo-900 dark:text-neutral-200">
                  {{ lessonEditing ? '✏️ 编辑课文' : '➕ 添加课文' }}
                </h3>
                <span v-if="lessonMessage" :class="lessonMessage.includes('成功') ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'" class="text-sm font-medium">
                  {{ lessonMessage }}
                </span>
              </div>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm text-gray-600 dark:text-neutral-400 mb-2">标题</label>
                  <input
                    v-model="lessonTitle"
                    type="text"
                    placeholder="输入课文标题"
                    class="w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-900 border border-indigo-100 dark:border-neutral-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label class="block text-sm text-gray-600 dark:text-neutral-400 mb-2">内容</label>
                  <textarea
                    v-model="lessonContent"
                    rows="3"
                    placeholder="输入课文内容"
                    class="w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-900 border border-indigo-100 dark:border-neutral-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none transition-all"
                  />
                </div>
                <div class="flex gap-3">
                  <button
                    v-if="lessonEditing"
                    @click="cancelEditLesson"
                    class="px-5 py-2.5 border border-indigo-100 dark:border-neutral-600 text-gray-600 dark:text-neutral-400 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all text-sm font-medium"
                  >
                    取消
                  </button>
                  <button
                    @click="lessonEditing ? saveLesson(lessons.find(l => l.id === lessonEditing) || lessons[0]) : addLesson()"
                    :disabled="lessonLoading"
                    class="px-5 py-2.5 rounded-xl font-medium text-white transition-all text-sm disabled:opacity-50"
                    style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);"
                  >
                    {{ lessonLoading ? '处理中...' : lessonEditing ? '保存' : '添加' }}
                  </button>
                </div>
              </div>
            </section>

            <!-- 列表 -->
            <section class="bg-white dark:bg-neutral-800 rounded-2xl border border-indigo-50 dark:border-neutral-700 overflow-hidden">
              <div class="px-5 py-4 border-b border-indigo-50 dark:border-neutral-700 flex justify-between items-center">
                <span class="font-semibold text-indigo-900 dark:text-white">课文列表</span>
                <span class="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{{ lessons.length }} 篇</span>
              </div>
              <div v-if="lessonsLoading" class="p-12 text-center text-gray-400 dark:text-neutral-500">加载中...</div>
              <div v-else-if="lessons.length === 0" class="p-12 text-center text-gray-400 dark:text-neutral-500">暂无课文</div>
              <div v-else class="divide-y divide-indigo-50 dark:divide-neutral-700">
                <div
                  v-for="lesson in lessons"
                  :key="lesson.id"
                  class="px-5 py-4 flex justify-between items-center hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
                >
                  <div class="flex-1 min-w-0">
                    <div class="text-gray-900 dark:text-white text-sm font-medium truncate">{{ lesson.title }}</div>
                    <div class="text-xs text-gray-500 dark:text-neutral-500 mt-1 truncate">{{ lesson.content }}</div>
                  </div>
                  <div class="flex gap-2 ml-4">
                    <button @click="editLesson(lesson)" class="px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">编辑</button>
                    <button @click="deleteLesson(lesson.id)" class="px-3 py-1.5 text-xs font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">删除</button>
                  </div>
                </div>
              </div>
            </section>
          </template>

          <!-- 作品管理 -->
          <template v-if="activeTab === 'works'">
            <!-- 列表头部 -->
            <div class="bg-white dark:bg-neutral-800 rounded-2xl border border-indigo-50 dark:border-neutral-700 mb-4">
              <div class="px-6 py-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="font-semibold text-indigo-900 dark:text-white">作品列表</span>
                  <span class="text-xs text-indigo-600 dark:text-indigo-400 font-medium px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">{{ works.length }} 个</span>
                </div>
                <NuxtLink
                  to="/add-work"
                  class="px-4 py-2 rounded-xl font-medium text-white transition-all text-sm"
                  style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);"
                >
                  + 添加作品
                </NuxtLink>
              </div>
            </div>

            <!-- 列表内容 -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-if="worksLoading" class="col-span-full text-center text-gray-400 dark:text-neutral-500 py-8">加载中...</div>
              <div v-else-if="works.length === 0" class="col-span-full text-center text-gray-400 dark:text-neutral-500 py-8">暂无作品</div>
              <div
                v-else
                v-for="work in works"
                :key="work.id"
                class="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-gray-100 dark:border-neutral-700 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md transition-all"
              >
                <div class="flex items-start gap-3">
                  <div v-if="work.images && work.images.length" class="w-16 h-16 rounded-lg bg-gray-100 dark:bg-neutral-700 overflow-hidden flex-shrink-0">
                    <img :src="work.images[0]" class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="w-16 h-16 rounded-lg bg-gray-100 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
                    <span class="text-xl">🖼️</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-gray-900 dark:text-white truncate">{{ work.title || '无标题' }}</h4>
                    <p v-if="work.content" class="text-xs text-gray-500 dark:text-neutral-400 mt-1 line-clamp-2">{{ work.content }}</p>
                    <div class="flex items-center gap-2 mt-2">
                      <span class="text-xs px-2 py-0.5 rounded-full" :class="{
                        'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400': work.style === '写实古风',
                        'bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-neutral-300': work.style === '水墨风格',
                        'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400': work.style === '彩色插画',
                      }">{{ work.style === '写实古风' ? '古风' : work.style === '水墨风格' ? '水墨' : '彩色' }}</span>
                      <span class="text-xs px-2 py-0.5 rounded-full" :class="work.is_public ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-neutral-700 dark:text-neutral-500'">
                        {{ work.is_public ? '已发布' : '草稿' }}
                      </span>
                    </div>
                  </div>
                </div>
                <!-- 操作按钮 -->
                <div class="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-neutral-700">
                  <button @click="deleteWork(work.id)" class="flex-1 px-3 py-1.5 text-xs font-medium text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors">删除</button>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </main>
  </div>
</template>
