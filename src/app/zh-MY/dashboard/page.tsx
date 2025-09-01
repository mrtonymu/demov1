'use client'

// React Imports
import { useEffect, useState } from 'react'

// Third-party Imports
import { useTranslations } from 'next-intl'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// Supabase Imports
import { createClient } from '@/lib/supabase'

// Utils Imports
import { useFormatters } from '@/utils/formatters'

// Component Imports
import CardStatVertical from '@components/card-statistics/Vertical'
import LoanStatusChart from '@views/dashboard/LoanStatusChart'
import CashflowTrendChart from '@views/dashboard/CashflowTrendChart'
import DueSoonList from '@views/dashboard/DueSoonList'
import TopOverdueList from '@views/dashboard/TopOverdueList'
import RecentRepaymentsTable from '@views/dashboard/RecentRepaymentsTable'

// Types
interface DashboardData {
  activeBorrowers: number
  monthlyDisbursed: number
  monthlyRepaid: number
  overdueCount: number
  roi: number
  badDebtRate: number
  statusDistribution: Array<{ status: string; count: number }>
  cashflowTrend: Array<{ month: string; disbursed: number; repaid: number }>
  dueSoon: Array<{ clientName: string; dueDate: string; remainingPrincipal: number }>
  topOverdue: Array<{ clientName: string; overdueDays: number; balance: number }>
  recentRepayments: Array<{ clientName: string; amount: number; time: string; interestDeduction: number; principalDeduction: number }>
}

const DashboardAnalytics = () => {
  // Hooks
  const t = useTranslations('dashboard')
  const { formatCurrency, formatNumber } = useFormatters()
  
  // State
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [realtimeConnected, setRealtimeConnected] = useState(false)

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      // Mock data for development - replace with actual Supabase queries
      const mockData = {
        activeBorrowers: 156,
        monthlyDisbursed: 2450000,
        monthlyRepaid: 1890000,
        overdueCount: 23,
        roi: 0.125,
        badDebtRate: 0.034,
        statusDistribution: [
          { status: 'normal', count: 145 },
          { status: 'settled', count: 89 },
          { status: 'negotiating', count: 12 },
          { status: 'bad_debt', count: 8 }
        ],
        cashflowTrend: [
          { month: '2024-01', disbursed: 2100000, repaid: 1650000 },
          { month: '2024-02', disbursed: 2300000, repaid: 1780000 },
          { month: '2024-03', disbursed: 2450000, repaid: 1890000 }
        ],
        dueSoon: [
          { clientName: '张三', dueDate: '2024-03-15', remainingPrincipal: 45000 },
          { clientName: '李四', dueDate: '2024-03-16', remainingPrincipal: 32000 }
        ],
        topOverdue: [
          { clientName: '王五', overdueDays: 15, balance: 67000 },
          { clientName: '赵六', overdueDays: 8, balance: 23000 }
        ],
        recentRepayments: [
          { clientName: '钱七', amount: 15000, time: '2024-03-10 14:30', interestDeduction: 3000, principalDeduction: 12000 },
          { clientName: '孙八', amount: 8500, time: '2024-03-10 11:20', interestDeduction: 1500, principalDeduction: 7000 }
        ]
      }
      
      setData(mockData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setLoading(false)
    }
  }

  // Setup Realtime subscriptions
  useEffect(() => {
    const supabase = createClient()
    
    // Initial data fetch
    fetchDashboardData()
    
    // Subscribe to loans table changes
    const loansSubscription = supabase
      .channel('loans-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'loans'
        },
        (payload) => {
          console.log('Loans table changed:', payload)

          // Refresh dashboard data when loans change
          fetchDashboardData()
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setRealtimeConnected(true)
        } else {
          setRealtimeConnected(false)
        }
      })
    
    // Subscribe to repayment_txn table changes
    const repaymentsSubscription = supabase
      .channel('repayments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'repayment_txn'
        },
        (payload) => {
          console.log('Repayments table changed:', payload)

          // Refresh dashboard data when repayments change
          fetchDashboardData()
        }
      )
      .subscribe()
    
    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(loansSubscription)
      supabase.removeChannel(repaymentsSubscription)
    }
  }, [])

  if (loading || !data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography>加载中...</Typography>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container spacing={6}>
      {/* 系统状态提醒 */}
      <Grid item xs={12}>
        <Box display='flex' gap={2}>
          <Box display='flex' alignItems='center' gap={1}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: realtimeConnected ? 'success.main' : 'error.main'
              }}
            />
            <Typography variant='body2' color='text.secondary'>
              {t('realtimeConnected')}
            </Typography>
          </Box>
        </Box>
      </Grid>

      {/* 顶部 KPI 卡片 */}
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('activeBorrowers')}
          stats={formatNumber(data.activeBorrowers)}
          avatarIcon='ri-group-line'
          avatarColor='info'
          subtitle={t('kpi.vsLastMonth')}
          trendNumber='8%'
          trend='positive'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('monthlyDisbursed')}
          stats={formatCurrency(data.monthlyDisbursed)}
          avatarIcon='ri-money-dollar-circle-line'
          avatarColor='success'
          subtitle={t('kpi.vsLastMonth')}
          trendNumber='12%'
          trend='positive'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('monthlyRepaid')}
          stats={formatCurrency(data.monthlyRepaid)}
          avatarIcon='ri-refund-2-line'
          avatarColor='success'
          subtitle={t('kpi.vsLastMonth')}
          trendNumber='6%'
          trend='positive'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('overdueCount')}
          stats={formatNumber(data.overdueCount)}
          avatarIcon='ri-alarm-warning-line'
          avatarColor='error'
          subtitle={t('kpi.vsLastMonth')}
          trendNumber='3%'
          trend='negative'
        />
      </Grid>

      {/* 贷款状态分布 */}
      <Grid item xs={12} md={6} lg={4}>
        <LoanStatusChart data={data.statusDistribution} />
      </Grid>

      {/* ROI 和坏账率 */}
      <Grid item xs={12} md={6} lg={4}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  {t('roi')}
                </Typography>
                <Typography variant='h4' color='primary.main'>
                  {(data.roi * 100).toFixed(1)}%
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  本月累计 ROI
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  {t('badDebtRate')}
                </Typography>
                <Typography variant='h4' color='error.main'>
                  {(data.badDebtRate * 100).toFixed(1)}%
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  坏账率
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* 现金流趋势 */}
      <Grid item xs={12} lg={4}>
        <CashflowTrendChart data={data.cashflowTrend} />
      </Grid>

      {/* 待处理提醒 */}
      <Grid item xs={12} md={6}>
        <DueSoonList data={data.dueSoon} />
      </Grid>
      <Grid item xs={12} md={6}>
        <TopOverdueList data={data.topOverdue} />
      </Grid>

      {/* 最近还款 */}
      <Grid item xs={12}>
        <RecentRepaymentsTable data={data.recentRepayments} />
      </Grid>
    </Grid>
  )
}

export default DashboardAnalytics
