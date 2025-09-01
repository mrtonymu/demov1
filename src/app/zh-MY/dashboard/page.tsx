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
import Alert from '@mui/material/Alert'

// Utils Imports
import { useFormatters } from '@/utils/formatters'

// Hooks Imports
import { useRealtime } from '@/hooks/useRealtime'

// Component Imports
import CardStatVertical from '@components/card-statistics/Vertical'
import LoanStatusChart from '@views/dashboard/LoanStatusChart'
import CashflowTrendChart from '@views/dashboard/CashflowTrendChart'
import DueSoonList from '@views/dashboard/DueSoonList'
import TopOverdueList from '@views/dashboard/TopOverdueList'
import RecentRepaymentsTable from '@views/dashboard/RecentRepaymentsTable'

// Types
import type { DashboardMetrics } from '@/types/cr3dify'

const DashboardAnalytics = () => {
  // Hooks
  const t = useTranslations('dashboard')
  const { formatCurrency, formatNumber } = useFormatters()
  
  // State
  const [data, setData] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setError(null)
      const response = await fetch('/api/metrics', { cache: 'no-store' })

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard metrics')
      }

      const metricsData = await response.json()

      setData(metricsData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
      setLoading(false)
    }
  }

  // Setup Realtime subscriptions
  useRealtime('loans', fetchDashboardData)
  useRealtime('repayment_txn', fetchDashboardData)
  useRealtime('clients', fetchDashboardData)

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity="error">获取仪表板数据失败：{error}</Alert>
        </Grid>
      </Grid>
    )
  }

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
                backgroundColor: 'success.main'
              }}
            />
            <Typography variant='body2' color='text.secondary'>
              实时连接：已连接
            </Typography>
          </Box>
        </Box>
      </Grid>

      {/* 顶部 KPI 卡片 */}
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('activeBorrowers')}
          stats={formatNumber(data.loans.active)}
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
          stats={formatCurrency(data.loans.totalAmount)}
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
          stats={formatCurrency(data.repayments.last30Days.amount)}
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
          stats={formatNumber(data.loans.overdue)}
          avatarIcon='ri-alarm-warning-line'
          avatarColor='error'
          subtitle={t('kpi.vsLastMonth')}
          trendNumber='3%'
          trend='negative'
        />
      </Grid>

      {/* 贷款状态分布 */}
      <Grid item xs={12} md={6} lg={4}>
        <LoanStatusChart data={[
          { status: 'normal', count: data.loans.active, percentage: 0 },
          { status: 'settled', count: data.loans.completed, percentage: 0 },
          { status: 'negotiating', count: data.loans.overdue, percentage: 0 },
          { status: 'bad_debt', count: data.loans.defaulted, percentage: 0 }
        ]} />
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
                  {data.summary.collectionRate.toFixed(1)}%
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
                  {((data.loans.defaulted / data.loans.total) * 100).toFixed(1)}%
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
        <CashflowTrendChart data={[]} />
      </Grid>

      {/* 待处理提醒 */}
      <Grid item xs={12} md={6}>
        <DueSoonList data={[]} />
      </Grid>
      <Grid item xs={12} md={6}>
        <TopOverdueList data={[]} />
      </Grid>

      {/* 最近还款 */}
      <Grid item xs={12}>
        <RecentRepaymentsTable data={[]} />
      </Grid>
    </Grid>
  )
}

export default DashboardAnalytics
