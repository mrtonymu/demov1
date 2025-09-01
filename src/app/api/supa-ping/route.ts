import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { createServerSupabaseClient } from '@/lib/supabase'

// 禁用缓存，确保动态渲染
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerSupabaseClient(cookieStore)

    // 尝试连接 Supabase 并查询 tenants 表
    const { data, error } = await supabase.from('tenants').select('id').limit(1)

    if (error) {
      return NextResponse.json({
        connected: false,
        error: error.message
      })
    }

    return NextResponse.json({
      connected: true,
      data
    })
  } catch (error) {
    return NextResponse.json({
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
