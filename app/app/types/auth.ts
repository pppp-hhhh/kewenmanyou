// Auth 类型定义

export interface User {
  id: string
  email: string
  role?: 'user' | 'admin'
  display_name?: string
  avatar_url?: string
  created_at?: string
}

export interface AuthSession {
  access_token: string
  refresh_token: string
  expires_in: number
  expires_at: number
  token_type: string
  user: User
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
}
