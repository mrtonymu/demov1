// 统一的API调用工具函数

export interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: any
  headers?: Record<string, string>
  cache?: RequestCache
}

export interface ApiResponse<T = any> {
  ok: boolean
  data?: T
  error?: string
  message?: string
  total?: number
  page?: number
  pageSize?: number
  totalPages?: number
}

/**
 * 统一的API调用函数
 * 自动添加cache: 'no-store'和标准错误处理
 */
export async function apiCall<T = any>(
  url: string,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = 'GET',
    body,
    headers = {},
    cache = 'no-store'
  } = options

  try {
    const config: RequestInit = {
      method,
      cache,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    }

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body)
    }

    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    return {
      ok: true,
      ...data
    }
  } catch (error) {
    console.error(`API调用失败 [${method} ${url}]:`, error)
    
    return {
      ok: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}

/**
 * GET请求的便捷方法
 */
export function apiGet<T = any>(url: string, options?: Omit<ApiOptions, 'method'>) {
  return apiCall<T>(url, { ...options, method: 'GET' })
}

/**
 * POST请求的便捷方法
 */
export function apiPost<T = any>(url: string, body?: any, options?: Omit<ApiOptions, 'method' | 'body'>) {
  return apiCall<T>(url, { ...options, method: 'POST', body })
}

/**
 * PUT请求的便捷方法
 */
export function apiPut<T = any>(url: string, body?: any, options?: Omit<ApiOptions, 'method' | 'body'>) {
  return apiCall<T>(url, { ...options, method: 'PUT', body })
}

/**
 * PATCH请求的便捷方法
 */
export function apiPatch<T = any>(url: string, body?: any, options?: Omit<ApiOptions, 'method' | 'body'>) {
  return apiCall<T>(url, { ...options, method: 'PATCH', body })
}

/**
 * DELETE请求的便捷方法
 */
export function apiDelete<T = any>(url: string, options?: Omit<ApiOptions, 'method'>) {
  return apiCall<T>(url, { ...options, method: 'DELETE' })
}

/**
 * 构建查询参数
 */
export function buildQueryParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })
  
  const queryString = searchParams.toString()

  return queryString ? `?${queryString}` : ''
}

/**
 * 处理API错误的统一方法
 */
export function handleApiError(error: any, defaultMessage = '操作失败'): string {
  if (error?.response?.data?.error) {
    return error.response.data.error
  }
  
  if (error?.message) {
    return error.message
  }
  
  return defaultMessage
}