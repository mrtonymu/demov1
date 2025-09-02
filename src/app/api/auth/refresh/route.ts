import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { createServerClient } from '@supabase/ssr'

/**
 * POST /api/auth/refresh - 刷新会话状态，确保 cookie 同步
 * 用于在客户端认证状态变化时触发服务端 cookie 同步
 */
export async function POST() {
  try {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
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
              // 在某些情况下可能无法设置 cookie
            }
          },
        },
      }
    )
    
    // 触发内部 cookie 同步
    const { data } = await supabase.auth.getUser()
    
    return NextResponse.json({ ok: true, user: data.user })
  } catch (error) {
    console.error('Auth refresh error:', error)

    return NextResponse.json(
      { ok: false, error: 'Failed to refresh auth state' },
      { status: 500 }
    )
  }
}