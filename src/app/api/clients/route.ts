import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { createServerSupabaseClient } from '@/lib/supabase'
import { guardWrite } from '@/lib/guardWrite'
import type { Client, PaginatedResponse } from '@/types/cr3dify'

// 禁用缓存，确保动态渲染
export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * GET /api/clients - 查询客户列表
 * 支持参数：query（模糊搜索）、status（状态筛选）、page、pageSize
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerSupabaseClient(cookieStore)
    
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const status = searchParams.get('status') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    
    // 构建查询（添加租户隔离）
    let queryBuilder = supabase
      .from('clients')
      .select('*', { count: 'exact' })
      .eq('tenant_id', user.id)
    
    // 模糊搜索：姓名、手机、IC号码
    if (query) {
      queryBuilder = queryBuilder.or(
        `full_name.ilike.%${query}%,phone.ilike.%${query}%,ic_number.ilike.%${query}%`
      )
    }
    
    // 状态筛选
    if (status) {
      queryBuilder = queryBuilder.eq('status', status)
    }
    
    // 分页
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    queryBuilder = queryBuilder.range(from, to)
    
    // 排序：最新创建的在前
    queryBuilder = queryBuilder.order('created_at', { ascending: false })

    const { data, error, count } = await queryBuilder

    if (error) {
      console.error('查询客户列表失败:', error)

      return NextResponse.json(
        { error: '查询客户列表失败' },
        { status: 500 }
      )
    }
    
    const response: PaginatedResponse<Client> = {
      data: data || [],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize)
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('客户查询 API 错误:', error)

    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/clients - 创建新客户
 */
export async function POST(request: NextRequest) {
  try {
    // 检查写入权限
    const writeGuard = guardWrite()
    if (writeGuard) return writeGuard
    
    const cookieStore = cookies()
    const supabase = createServerSupabaseClient(cookieStore)
    
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { full_name, ic_number, phone, email, address, status = 'active' } = body
    
    // 基本验证
    if (!full_name || !ic_number || !phone) {
      return NextResponse.json(
        { error: '姓名、身份证号和手机号为必填项' },
        { status: 400 }
      )
    }

    // 检查身份证号是否已存在（在当前租户下）
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .eq('ic_number', ic_number)
      .eq('tenant_id', user.id)
      .single()
    
    if (existingClient) {
      return NextResponse.json(
        { error: '该身份证号已存在' },
        { status: 409 }
      )
    }
    
    // 创建客户（添加租户ID）
    const { data, error } = await supabase
      .from('clients')
      .insert({
        full_name,
        ic_number,
        phone,
        email: email || null,
        address: address || null,
        status,
        tenant_id: user.id
      })
      .select()
      .single()
    
    if (error) {
      console.error('创建客户失败:', error)

      return NextResponse.json(
        { error: '创建客户失败' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('创建客户 API 错误:', error)

    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}