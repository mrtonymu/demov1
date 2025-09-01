import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { createServerSupabaseClient } from '@/lib/supabase'
import { guardWrite } from '@/lib/guardWrite'
import type { RepaymentTxn, PaginatedResponse } from '@/types/cr3dify'

// 禁用缓存，确保动态渲染
export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * GET /api/repayments - 查询还款记录
 * 支持参数：loan_id、from、to、page、pageSize、limit
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerSupabaseClient(cookieStore)
    
    const { searchParams } = new URL(request.url)
    const loan_id = searchParams.get('loan_id') || ''
    const from = searchParams.get('from') || ''
    const to = searchParams.get('to') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : null
    
    // 构建查询（包含贷款和客户信息）
    let queryBuilder = supabase
      .from('repayment_txn')
      .select(`
        *,
        loan:loans(
          id,
          principal,
          principal_balance,
          interest_balance,
          client:clients(
            id,
            full_name,
            ic_number,
            phone
          )
        )
      `, limit ? undefined : { count: 'exact' })
    
    // 贷款筛选
    if (loan_id) {
      queryBuilder = queryBuilder.eq('loan_id', loan_id)
    }
    
    // 日期范围筛选
    if (from) {
      queryBuilder = queryBuilder.gte('created_at', from)
    }
    if (to) {
      queryBuilder = queryBuilder.lte('created_at', to)
    }
    
    // 排序：最新创建的在前
    queryBuilder = queryBuilder.order('created_at', { ascending: false })

    // 分页或限制数量
    if (limit) {
      queryBuilder = queryBuilder.limit(limit)
    } else {
      const fromIndex = (page - 1) * pageSize
      const toIndex = fromIndex + pageSize - 1
      queryBuilder = queryBuilder.range(fromIndex, toIndex)
    }
    
    const { data, error, count } = await queryBuilder
    
    if (error) {
      console.error('查询还款记录失败:', error)

      return NextResponse.json(
        { error: '查询还款记录失败' },
        { status: 500 }
      )
    }
    
    // 如果是限制查询，直接返回数据
    if (limit) {
      return NextResponse.json({ data: data || [] })
    }

    const response: PaginatedResponse<RepaymentTxn> = {
      data: data || [],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize)
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('还款查询 API 错误:', error)

    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/repayments - 创建还款记录
 * 实现先息后本的分配逻辑
 */
export async function POST(request: NextRequest) {
  try {
    // 检查写入权限
    const writeGuard = guardWrite()
    if (writeGuard) return writeGuard

    const cookieStore = await cookies()
    const supabase = createServerSupabaseClient(cookieStore)
    
    const body = await request.json()
    const { loan_id, amount_in } = body
    
    // 基本验证
    if (!loan_id || !amount_in) {
      return NextResponse.json(
        { error: '贷款ID和还款金额为必填项' },
        { status: 400 }
      )
    }
    
    if (amount_in <= 0) {
      return NextResponse.json(
        { error: '还款金额必须大于0' },
        { status: 400 }
      )
    }
    
    // 获取贷款信息
    const { data: loan, error: loanError } = await supabase
      .from('loans')
      .select('*')
      .eq('id', loan_id)
      .single()
    
    if (loanError || !loan) {
      return NextResponse.json(
        { error: '贷款不存在' },
        { status: 404 }
      )
    }
    
    if (loan.status === 'settled') {
      return NextResponse.json(
        { error: '贷款已结清，无法继续还款' },
        { status: 400 }
      )
    }
    
    // 计算分配金额（先息后本）
    let remainingAmount = amount_in
    let allocInterest = 0
    let allocPrincipal = 0
    
    // 先分配利息
    if (loan.interest_balance > 0 && remainingAmount > 0) {
      allocInterest = Math.min(remainingAmount, loan.interest_balance)
      remainingAmount -= allocInterest
    }
    
    // 再分配本金
    if (loan.principal_balance > 0 && remainingAmount > 0) {
      allocPrincipal = Math.min(remainingAmount, loan.principal_balance)
      remainingAmount -= allocPrincipal
    }
    
    // 计算新的余额
    const newInterestBalance = loan.interest_balance - allocInterest
    const newPrincipalBalance = loan.principal_balance - allocPrincipal
    
    // 判断还款类型和贷款状态
    let repaymentKind = 'regular'
    let newLoanStatus = loan.status
    
    if (newInterestBalance === 0 && newPrincipalBalance === 0) {
      // 完全结清
      repaymentKind = 'settlement'
      newLoanStatus = 'settled'
      
      // 处理押金抵扣（仅在结清时且策略为 offset_last）
      if (loan.deposit_policy === 'offset_last' && loan.deposit_amount > 0) {
        // 押金抵扣逻辑已在前端计算，这里记录即可
      }
    } else if (amount_in < (loan.interest_balance + loan.principal_balance)) {
      repaymentKind = 'partial'
    }
    
    // 开始事务
    const { data: repaymentData, error: repaymentError } = await supabase
      .from('repayment_txn')
      .insert({
        loan_id,
        amount_in,
        alloc_interest: allocInterest,
        alloc_principal: allocPrincipal,
        kind: repaymentKind
      })
      .select(`
        *,
        loan:loans(
          id,
          client:clients(
            id,
            full_name
          )
        )
      `)
      .single()
    
    if (repaymentError) {
      console.error('创建还款记录失败:', repaymentError)

      return NextResponse.json(
        { error: '创建还款记录失败' },
        { status: 500 }
      )
    }
    
    // 更新贷款余额和状态
    const { error: updateError } = await supabase
      .from('loans')
      .update({
        principal_balance: newPrincipalBalance,
        interest_balance: newInterestBalance,
        status: newLoanStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', loan_id)
    
    if (updateError) {
      console.error('更新贷款余额失败:', updateError)

      return NextResponse.json(
        { error: '更新贷款余额失败' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: repaymentData,
      allocation: {
        interest: allocInterest,
        principal: allocPrincipal,
        remaining: remainingAmount
      },
      newBalances: {
        principal: newPrincipalBalance,
        interest: newInterestBalance
      },
      loanStatus: newLoanStatus
    })
  } catch (error) {
    console.error('创建还款 API 错误:', error)

    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}