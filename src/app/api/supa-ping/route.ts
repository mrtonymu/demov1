import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createClient()
    
    // 尝试连接 Supabase 并查询 tenants 表
    const { data, error } = await supabase
      .from('tenants')
      .select('id')
      .limit(1)
    
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