import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { createServerSupabaseClient } from '@/lib/supabase'
import { guardWrite } from '@/lib/guardWrite'
import type { Loan, PaginatedResponse } from '@/types/cr3dify'

// 禁用缓存，确保动态渲染
export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * GET /api/loans - 查询贷款列表
 * 支持参数：status、client_id、from、to、page、pageSize
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
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
    const status = searchParams.get('status') || ''
    const client_id = searchParams.get('client_id') || ''
    const from = searchParams.get('from') || ''
    const to = searchParams.get('to') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const groupBy = searchParams.get('groupBy') || ''
    
    // 如果是按状态分组查询
    if (groupBy === 'status') {
      const { data, error } = await supabase
        .from('loans')
        .select('status')
        .eq('tenant_id', user.id)
      
      if (error) {
        console.error('查询贷款状态分布失败:', error)

        return NextResponse.json(
          { error: '查询贷款状态分布失败' },
          { status: 500 }
        )
      }
      
      // 统计各状态数量
      const statusCount = (data || []).reduce((acc: Record<string, number>, loan) => {
        acc[loan.status] = (acc[loan.status] || 0) + 1
        return acc
      }, {})
      
      const total = data?.length || 0
      const distribution = Object.entries(statusCount).map(([status, count]) => ({
        status,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0
      }))

      return NextResponse.json({ data: distribution })
    }

    // 构建查询（包含客户信息，添加租户隔离）
    let queryBuilder = supabase
      .from('loans')
      .select(`
        *,
        client:clients(
          id,
          full_name,
          ic_number,
          phone,
          email
        )
      `, { count: 'exact' })
      .eq('tenant_id', user.id)
    
    // 状态筛选
    if (status) {
      queryBuilder = queryBuilder.eq('status', status)
    }
    
    // 客户筛选
    if (client_id) {
      queryBuilder = queryBuilder.eq('client_id', client_id)
    }
    
    // 日期范围筛选
    if (from) {
      queryBuilder = queryBuilder.gte('created_at', from)
    }
    if (to) {
      queryBuilder = queryBuilder.lte('created_at', to)
    }
    
    // 分页
    const fromIndex = (page - 1) * pageSize
    const toIndex = fromIndex + pageSize - 1
    queryBuilder = queryBuilder.range(fromIndex, toIndex)
    
    // 排序：最新创建的在前
    queryBuilder = queryBuilder.order('created_at', { ascending: false })
    
    const { data, error, count } = await queryBuilder

    if (error) {
      console.error('查询贷款列表失败:', error)

      return NextResponse.json(
        { error: '查询贷款列表失败' },
        { status: 500 }
      )
    }
    
    const response: PaginatedResponse<Loan> = {
      data: data || [],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize)
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('贷款查询 API 错误:', error)

    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/loans - 创建新贷款
 */
export async function POST(request: NextRequest) {
  try {
    // 检查写入权限
    const writeGuard = await guardWrite()
    if (writeGuard) return writeGuard

    const cookieStore = await cookies()
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
    const {
      client_id,
      principal,
      disbursed,
      deposit_amount = 0,
      deposit_policy = 'none',
      deduct_interest = false,
      collect_deposit = false
    } = body
    
    // 基本验证
    if (!client_id || !principal || !disbursed) {
      return NextResponse.json(
        { error: '客户ID、本金和到手金额为必填项' },
        { status: 400 }
      )
    }
    
    if (principal <= 0 || disbursed <= 0) {
      return NextResponse.json(
        { error: '本金和到手金额必须大于0' },
        { status: 400 }
      )
    }
    
    // 检查客户是否存在（在当前租户下）
    const { data: client } = await supabase
      .from('clients')
      .select('id, status')
      .eq('id', client_id)
      .eq('tenant_id', user.id)
      .single()
    
    if (!client) {
      return NextResponse.json(
        { error: '客户不存在' },
        { status: 404 }
      )
    }
    
    if (client.status !== 'active') {
      return NextResponse.json(
        { error: '客户状态异常，无法创建贷款' },
        { status: 400 }
      )
    }
    
    // 计算初始余额
    const interestAmount = deduct_interest ? (principal - disbursed) : 0
    const actualDepositAmount = collect_deposit ? deposit_amount : 0
    
    // 创建贷款记录（添加租户ID）
    const { data, error } = await supabase
      .from('loans')
      .insert({
        client_id,
        principal,
        disbursed,
        principal_balance: principal,
        interest_balance: interestAmount,
        deposit_amount: actualDepositAmount,
        deposit_policy: collect_deposit ? deposit_policy : 'none',
        status: 'normal',
        tenant_id: user.id
      })
      .select(`
        *,
        client:clients(
          id,
          full_name,
          ic_number,
          phone
        )
      `)
      .single()
    
    if (error) {
      console.error('创建贷款失败:', error)

      return NextResponse.json(
        { error: '创建贷款失败' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('创建贷款 API 错误:', error)

    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}