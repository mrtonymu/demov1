import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { createServerSupabaseClient } from '@/lib/supabase'
import { guardWrite } from '@/lib/guardWrite'

// 禁用缓存，确保动态渲染
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface RouteParams {
  params: {
    id: string
  }
}

/**
 * PATCH /api/loans/[id] - 更新贷款信息
 * 仅允许更新状态和余额相关字段
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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

    const { id } = params
    const body = await request.json()
    const { status, principal_balance, interest_balance } = body
    
    // 检查贷款是否存在（在当前租户下）
    const { data: existingLoan } = await supabase
      .from('loans')
      .select('id, status')
      .eq('id', id)
      .eq('tenant_id', user.id)
      .single()
    
    if (!existingLoan) {
      return NextResponse.json(
        { error: '贷款不存在' },
        { status: 404 }
      )
    }
    
    // 构建更新数据
    const updateData: any = {
      updated_at: new Date().toISOString()
    }
    
    if (status !== undefined) {

      // 验证状态值
      const validStatuses = ['normal', 'settled', 'negotiating', 'bad_debt']
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: '无效的贷款状态' },
          { status: 400 }
        )
      }
      updateData.status = status
    }

    if (principal_balance !== undefined) {
      if (principal_balance < 0) {
        return NextResponse.json(
          { error: '本金余额不能为负数' },
          { status: 400 }
        )
      }
      updateData.principal_balance = principal_balance
    }

    if (interest_balance !== undefined) {
      if (interest_balance < 0) {
        return NextResponse.json(
          { error: '利息余额不能为负数' },
          { status: 400 }
        )
      }
      updateData.interest_balance = interest_balance
    }

    // 更新贷款信息（添加租户隔离）
    const { data, error } = await supabase
      .from('loans')
      .update(updateData)
      .eq('id', id)
      .eq('tenant_id', user.id)
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
      console.error('更新贷款失败:', error)

      return NextResponse.json(
        { error: '更新贷款失败' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('更新贷款 API 错误:', error)

    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}