// API 类型定义

export interface Scene {
  description_cn: string
  prompt_en: string
}

export interface AnalyzeRequest {
  text: string
  style: string
}

export interface AnalyzeResponse {
  scenes: Scene[]
}

export interface GenerateRequest {
  prompts: string[]
  style: string
}

export interface GenerateResponse {
  task_id: string
}

export interface TaskImage {
  index: number
  url: string
}

export interface TaskStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed'
  total: number
  completed: number
  images: TaskImage[]
  error: string | null
}

export interface SaveWorkRequest {
  text_id?: number
  custom_title?: string
  custom_content?: string
  scenes: Scene[]
  images: string[]
  style: string
  is_public: boolean
}

export interface SaveWorkResponse {
  work_id: number
  message: string
}

export type StyleType = '写实古风' | '水墨风格' | '彩色插画'

export const STYLE_OPTIONS: StyleType[] = ['写实古风', '水墨风格', '彩色插画']
