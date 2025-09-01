import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { createServerSupabaseClient } from '@/lib/supabase'
import type { DashboardMetrics } from '@/types/cr3dify'

// 获取仪表板指标数据
export async function GET() {
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

    // 并行获取各项指标
    const [clientsResult, loansResult, repaymentsResult] = await Promise.all([
      // 客户统计
      supabase
        .from('clients')
        .select('status', { count: 'exact' })
        .eq('tenant_id', user.id),
      
      // 贷款统计
      supabase
        .from('loans')
        .select('status, principal, principal_balance, interest_balance', { count: 'exact' })
        .eq('tenant_id', user.id),
      
      // 还款统计（最近30天）
      supabase
        .from('repayment_txn')
        .select('amount_in', { count: 'exact' })
        .eq('tenant_id', user.id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    ])

    // 检查错误
    if (clientsResult.error) {
      console.error('Error fetching clients metrics:', clientsResult.error)

      return NextResponse.json(
        { error: 'Failed to fetch clients metrics' },
        { status: 500 }
      )
    }

    if (loansResult.error) {
      console.error('Error fetching loans metrics:', loansResult.error)

      return NextResponse.json(
        { error: 'Failed to fetch loans metrics' },
        { status: 500 }
      )
    }

    if (repaymentsResult.error) {
      console.error('Error fetching repayments metrics:', repaymentsResult.error)

      return NextResponse.json(
        { error: 'Failed to fetch repayments metrics' },
        { status: 500 }
      )
    }

    // 处理客户统计
    const clients = clientsResult.data || []

    const clientMetrics = {
      total: clientsResult.count || 0,
      active: clients.filter(c => c.status === 'active').length,
      inactive: clients.filter(c => c.status === 'inactive').length,
      blacklisted: clients.filter(c => c.status === 'blacklisted').length
    }

    // 处理贷款统计
    const loans = loansResult.data || []

    const loanMetrics = {
      total: loansResult.count || 0,
      active: loans.filter(l => l.status === 'normal').length,
      completed: loans.filter(l => l.status === 'settled').length,
      overdue: loans.filter(l => l.status === 'negotiating').length,
      defaulted: loans.filter(l => l.status === 'bad_debt').length,
      totalAmount: loans.reduce((sum, l) => sum + (l.principal || 0), 0),
      outstandingPrincipal: loans.reduce((sum, l) => sum + (l.principal_balance || 0), 0),
      outstandingInterest: loans.reduce((sum, l) => sum + (l.interest_balance || 0), 0)
    }

    // 处理还款统计
    const repayments = repaymentsResult.data || []

    const repaymentMetrics = {
      totalCount: repaymentsResult.count || 0,
      totalAmount: repayments.reduce((sum, r) => sum + (r.amount_in || 0), 0),
      last30Days: {
        count: repayments.length,
        amount: repayments.reduce((sum, r) => sum + (r.amount_in || 0), 0)
      }
    }

    // 构建响应数据
    const metrics: DashboardMetrics = {
      clients: clientMetrics,
      loans: loanMetrics,
      repayments: repaymentMetrics,
      summary: {
        totalOutstanding: loanMetrics.outstandingPrincipal + loanMetrics.outstandingInterest,
        collectionRate: loanMetrics.totalAmount > 0 
          ? ((loanMetrics.totalAmount - loanMetrics.outstandingPrincipal) / loanMetrics.totalAmount) * 100
          : 0,
        activeLoansCount: loanMetrics.active,
        overdueLoansCount: loanMetrics.overdue
      }
    }

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}