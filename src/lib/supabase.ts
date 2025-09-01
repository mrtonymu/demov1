// Third-party Imports
import { createBrowserClient, createServerClient } from '@supabase/ssr'

// 创建浏览器专用客户端
export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// 创建服务端客户端（需要在服务端组件中使用）
export function createServerSupabaseClient(cookieStore: any) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: any) {
          try {
            cookiesToSet.forEach(({ name, value, options }: any) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // 在某些情况下（如静态生成）可能无法设置 cookie
          }
        },
      },
    }
  )
}

// 默认导出浏览器客户端
export function createClient() {
  return createBrowserSupabaseClient()
}