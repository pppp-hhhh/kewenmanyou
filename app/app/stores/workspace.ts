import { defineStore } from 'pinia'
import type { Scene, TaskStatus, StyleType } from '~/types/api'

interface WorkspaceState {
  // 课文相关
  selectedTextId: number | null
  customText: string
  selectedStyle: StyleType

  // 场景相关
  scenes: Scene[]

  // 任务相关
  taskId: string | null
  taskStatus: TaskStatus | null

  // UI 状态
  isAnalyzing: boolean
  isGenerating: boolean
  progressMsg: string
}

export const useWorkspaceStore = defineStore('workspace', {
  state: (): WorkspaceState => ({
    selectedTextId: null,
    customText: '',
    selectedStyle: '写实古风',
    scenes: [],
    taskId: null,
    taskStatus: null,
    isAnalyzing: false,
    isGenerating: false,
    progressMsg: '',
  }),

  getters: {
    currentText: (state): string => {
      if (state.customText.trim()) {
        return state.customText
      }
      return ''
    },

    isGeneratingComplete: (state): boolean => {
      if (!state.taskStatus) return false
      return state.taskStatus.status === 'completed'
    },

    progressPercent: (state): number => {
      if (!state.taskStatus || state.taskStatus.total === 0) return 0
      return Math.round((state.taskStatus.completed / state.taskStatus.total) * 100)
    },

    currentGeneratingIndex: (state): number => {
      if (!state.taskStatus) return 0
      // 找到第一个没有生成的图片索引
      for (let i = 0; i < state.taskStatus.images.length; i++) {
        if (!state.taskStatus.images[i]?.url) return i
      }
      return state.taskStatus.completed
    },

    displayedScenes: (state): Scene[] => {
      if (!state.taskStatus || state.taskStatus.status !== 'completed') {
        // 生成未完成时，只显示到当前正在生成的那一张
        const currentIndex = state.taskStatus
          ? Math.min(state.taskStatus.completed, state.scenes.length - 1)
          : 0
        return state.scenes.slice(0, currentIndex + 1)
      }
      // 生成完成后，显示所有场景
      return state.scenes
    },
  },

  actions: {
    // 重置状态
    reset() {
      this.selectedTextId = null
      this.customText = ''
      this.selectedStyle = '写实古风'
      this.scenes = []
      this.taskId = null
      this.taskStatus = null
      this.isAnalyzing = false
      this.isGenerating = false
      this.progressMsg = ''
    },

    // 设置课文
    setText(textId: number | null, customText: string = '') {
      this.selectedTextId = textId
      this.customText = customText
      this.scenes = []
      this.taskId = null
      this.taskStatus = null
    },

    // 设置画风
    setStyle(style: StyleType) {
      this.selectedStyle = style
    },

    // 设置场景列表
    setScenes(scenes: Scene[]) {
      this.scenes = scenes
    },

    // 更新单个场景
    updateScene(index: number, scene: Partial<Scene>) {
      if (this.scenes[index]) {
        this.scenes[index] = { ...this.scenes[index], ...scene }
      }
    },

    // 添加场景
    addScene(scene: Scene) {
      this.scenes.push(scene)
    },

    // 删除场景
    removeScene(index: number) {
      this.scenes.splice(index, 1)
    },

    // 上移场景
    moveSceneUp(index: number) {
      if (index > 0) {
        const temp = this.scenes[index]!
        this.scenes[index] = this.scenes[index - 1]!
        this.scenes[index - 1] = temp
      }
    },

    // 下移场景
    moveSceneDown(index: number) {
      if (index < this.scenes.length - 1) {
        const temp = this.scenes[index]!
        this.scenes[index] = this.scenes[index + 1]!
        this.scenes[index + 1] = temp
      }
    },

    // 设置任务 ID
    setTaskId(taskId: string | null) {
      this.taskId = taskId
    },

    // 更新任务状态
    setTaskStatus(status: TaskStatus | null) {
      this.taskStatus = status
    },

    // 设置分析状态
    setAnalyzing(analyzing: boolean) {
      this.isAnalyzing = analyzing
    },

    // 设置生成状态
    setGenerating(generating: boolean) {
      this.isGenerating = generating
    },

    // 设置进度消息
    setProgressMsg(msg: string) {
      this.progressMsg = msg
    },
  },
})
