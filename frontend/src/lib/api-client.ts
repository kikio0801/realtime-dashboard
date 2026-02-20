/**
 * API Client for communicating with FastAPI backend
 * Base URL is /api which will be proxied to http://127.0.0.1:8000/api by Vite
 */

const API_BASE_URL = '/api'

/**
 * Custom error class for API requests
 */
export class ApiError extends Error {
  constructor(public status: number, public detail: string) {
    super(detail)
    this.name = 'ApiError'
  }
}

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T | null> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        detail: 'An error occurred',
      }))
      throw new ApiError(response.status, errorData.detail || `HTTP ${response.status}`)
    }

    // Handle 204 No Content responses
    if (response.status === 204 || response.status === 205) {
      return null
    }

    return response.json()
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

/**
 * GET request
 */
export async function apiGet<T>(endpoint: string): Promise<T | null> {
  return apiFetch<T>(endpoint, { method: 'GET' })
}

/**
 * POST request
 */
export async function apiPost<T>(
  endpoint: string,
  data?: unknown
): Promise<T | null> {
  return apiFetch<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * PATCH request
 */
export async function apiPatch<T>(
  endpoint: string,
  data?: unknown
): Promise<T | null> {
  return apiFetch<T>(endpoint, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * DELETE request
 */
export async function apiDelete<T>(endpoint: string): Promise<T | null> {
  return apiFetch<T>(endpoint, { method: 'DELETE' })
}
