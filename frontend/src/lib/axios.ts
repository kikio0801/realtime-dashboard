'use client'

import axios, { type AxiosError, type AxiosRequestConfig } from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

import { createClient } from '@/lib/supabase/client'

// Request interceptor - 인증 토큰 추가 (Supabase 세션 연동)
api.interceptors.request.use(
  async (config) => {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - 에러 처리
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // 401 Unauthorized 시 Supabase 세션 초기화 및 로그인 이동
    if (error.response?.status === 401) {
      const supabase = createClient()
      await supabase.auth.signOut()
      window.location.href = '/join'
    }
    return Promise.reject(error)
  }
)

// Generic fetcher for TanStack Query
export async function fetcher<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.get<T>(url, config)
  return response.data
}

// Generic mutation helpers
export async function post<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.post<T>(url, data, config)
  return response.data
}

export async function put<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.put<T>(url, data, config)
  return response.data
}

export async function patch<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.patch<T>(url, data, config)
  return response.data
}

export async function del<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.delete<T>(url, config)
  return response.data
}
