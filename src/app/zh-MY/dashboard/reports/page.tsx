'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import LinearProgress from '@mui/material/LinearProgress'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'



// Utils Imports
import { useFormatters } from '@/utils/formatters'
import { apiGet } from '@/utils/api'

// Component Imports
import CardStatVertical from '@components/card-statistics/Vertical'
import LoanStatusChart from '@views/dashboard/LoanStatusChart'
import CashflowTrendChart from '@views/dashboard/CashflowTrendChart'

// Types
import type { DashboardMetrics } from '@/types/cr3dify'

const ReportsPage = () => {
  // Hooks
  const { formatCurrency, formatNumber, formatPercentage } = useFormatters()
  
  // State
  const [data, setData] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reportType, setReportType] = useState('monthly')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Fetch dashboard data
  const fetchReportsData = async () => {
    try {
      setError(null)
      const result = await apiGet<DashboardMetrics>('/api/metrics')

      if (result.ok && result.data) {
        setData(result.data)
      } else {
        throw new Error(result.error || 'Failed to fetch reports data')
      }

      setLoading(false)
    } catch (error) {
      console.error('Error fetching reports data:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
      setLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchReportsData()
  }, [])

  // Calculate derived metrics
  const monthlyData = data ? {
    totalLoansIssued: data.loans.total,
    totalAmountIssued: data.loans.totalAmount,
    totalPaymentsReceived: data.repayments.last30Days.amount,
    defaultRate: data.loans.total > 0 ? (data.loans.defaulted / data.loans.total) * 100 : 0,
    averageLoanAmount: data.loans.total > 0 ? data.loans.totalAmount / data.loans.total : 0,
    portfolioGrowth: 15.8 // TODO: Calculate from historical data
  } : null

  const portfolioBreakdown = data ? [
    { category: '正常贷款', amount: data.loans.outstandingPrincipal, percentage: 60 },
    { category: '逾期贷款', amount: data.loans.outstandingInterest, percentage: 25 },
    { category: '已结清贷款', amount: data.loans.totalAmount - data.loans.outstandingPrincipal, percentage: 15 }
  ] : []

  const riskAnalysis = data ? [
    { riskLevel: '低风险 (正常)', count: data.loans.active, percentage: data.loans.total > 0 ? Math.round((data.loans.active / data.loans.total) * 100) : 0 },
    { riskLevel: '中风险 (协商中)', count: data.loans.overdue, percentage: data.loans.total > 0 ? Math.round((data.loans.overdue / data.loans.total) * 100) : 0 },
    { riskLevel: '高风险 (坏账)', count: data.loans.defaulted, percentage: data.loans.total > 0 ? Math.round((data.loans.defaulted / data.loans.total) * 100) : 0 }
  ] : []

  if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity="error">获取报告数据失败：{error}</Alert>
        </Grid>
      </Grid>
    )
  }

  if (loading || !data || !monthlyData) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container spacing={6}>
      {/* 关键指标 */}
      <Grid item xs={12}>
        <Typography variant='h4' sx={{ mb: 4 }}>
          数据报告
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title='贷款总数'
          stats={formatNumber(monthlyData.totalLoansIssued)}
          avatarIcon='ri-file-add-line'
          avatarColor='primary'
          subtitle='累计发放贷款'
          trendNumber='12%'
          trend='positive'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title='放款总额'
          stats={formatCurrency(monthlyData.totalAmountIssued)}
          avatarIcon='ri-money-dollar-circle-line'
          avatarColor='success'
          subtitle='累计放款金额'
          trendNumber='8%'
          trend='positive'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title='回款总额'
          stats={formatCurrency(monthlyData.totalPaymentsReceived)}
          avatarIcon='ri-check-line'
          avatarColor='info'
          subtitle='近30天回款'
          trendNumber='15%'
          trend='positive'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title='坏账率'
          stats={formatPercentage(monthlyData.defaultRate / 100)}
          avatarIcon='ri-alarm-warning-line'
          avatarColor='error'
          subtitle='风险指标'
          trendNumber='0.5%'
          trend='negative'
        />
      </Grid>

      {/* 贷款状态分布图表 */}
      <Grid item xs={12} md={6} lg={4}>
        <LoanStatusChart data={[
          { status: 'normal', count: data.loans.active },
          { status: 'settled', count: data.loans.completed },
          { status: 'negotiating', count: data.loans.overdue },
          { status: 'bad_debt', count: data.loans.defaulted }
        ]} />
      </Grid>

      {/* 投资组合分析 */}
      <Grid item xs={12} md={6} lg={4}>
        <Card>
          <CardHeader title='投资组合分析' />
          <CardContent>
            {portfolioBreakdown.map((item, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Box display='flex' justifyContent='space-between' alignItems='center' sx={{ mb: 1 }}>
                  <Typography variant='body2'>{item.category}</Typography>
                  <Typography variant='body2' fontWeight={500}>
                    {formatCurrency(item.amount)}
                  </Typography>
                </Box>
                <LinearProgress
                  variant='determinate'
                  value={item.percentage}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant='caption' color='text.secondary'>
                  {item.percentage}% 占比
                </Typography>
                {index < portfolioBreakdown.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* 风险分析 */}
      <Grid item xs={12} md={6} lg={4}>
        <Card>
          <CardHeader title='风险分析' />
          <CardContent>
            {riskAnalysis.map((item, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Box display='flex' justifyContent='space-between' alignItems='center' sx={{ mb: 1 }}>
                  <Typography variant='body2'>{item.riskLevel}</Typography>
                  <Typography variant='body2' fontWeight={500}>
                    {formatNumber(item.count)} 笔
                  </Typography>
                </Box>
                <LinearProgress
                  variant='determinate'
                  value={item.percentage}
                  color={index === 0 ? 'success' : index === 1 ? 'warning' : 'error'}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant='caption' color='text.secondary'>
                  {item.percentage}% 占比
                </Typography>
                {index < riskAnalysis.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* 现金流趋势图表 */}
      <Grid item xs={12}>
        <CashflowTrendChart data={[]} />
      </Grid>

      {/* 报告生成 */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='生成报告' />
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  select
                  label='报告类型'
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  SelectProps={{ native: true }}
                >
                  <option value='monthly'>月度报告</option>
                  <option value='quarterly'>季度报告</option>
                  <option value='annual'>年度报告</option>
                  <option value='custom'>自定义报告</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type='date'
                  label='开始日期'
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type='date'
                  label='结束日期'
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant='contained'
                  startIcon={<i className='ri-download-line' />}
                  fullWidth
                  sx={{ height: '56px' }}
                >
                  生成报告
                </Button>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* 快速报告 */}
            <Typography variant='h6' sx={{ mb: 3 }}>
              快速报告
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant='outlined'
                  startIcon={<i className='ri-file-text-line' />}
                  fullWidth
                >
                  贷款汇总
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant='outlined'
                  startIcon={<i className='ri-money-dollar-circle-line' />}
                  fullWidth
                >
                  还款报告
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant='outlined'
                  startIcon={<i className='ri-user-line' />}
                  fullWidth
                >
                  客户报告
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant='outlined'
                  startIcon={<i className='ri-alarm-warning-line' />}
                  fullWidth
                >
                  风险报告
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ReportsPage