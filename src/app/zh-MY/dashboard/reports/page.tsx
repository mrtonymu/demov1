'use client'

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

// Next Intl Imports
import { useTranslations } from 'next-intl'

// Utils Imports
import { useFormatters } from '@/utils/formatters'

// Component Imports
import CardStatVertical from '@components/card-statistics/Vertical'

const ReportsPage = () => {
  // Hooks
  const t = useTranslations('reports')
  const { formatCurrency, formatNumber, formatPercentage } = useFormatters()

  // 模拟报告数据
  const monthlyData = {
    totalLoansIssued: 45,
    totalAmountIssued: 2250000,
    totalPaymentsReceived: 1850000,
    defaultRate: 2.5,
    averageLoanAmount: 50000,
    portfolioGrowth: 15.8
  }

  const portfolioBreakdown = [
    { category: t('personalLoans'), amount: 1200000, percentage: 48 },
    { category: t('businessLoans'), amount: 800000, percentage: 32 },
    { category: t('mortgageLoans'), amount: 500000, percentage: 20 }
  ]

  const riskAnalysis = [
    { riskLevel: t('lowRisk'), count: 156, percentage: 65 },
    { riskLevel: t('mediumRisk'), count: 68, percentage: 28 },
    { riskLevel: t('highRisk'), count: 16, percentage: 7 }
  ]

  return (
    <Grid container spacing={6}>
      {/* 关键指标 */}
      <Grid item xs={12}>
        <Typography variant='h4' sx={{ mb: 4 }}>
          {t('monthlyReport')}
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('loansIssued')}
          stats={formatNumber(monthlyData.totalLoansIssued)}
          avatarIcon='ri-file-add-line'
          avatarColor='primary'
          subtitle={t('thisMonth')}
          trendNumber='12%'
          trend='positive'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('amountIssued')}
          stats={formatCurrency(monthlyData.totalAmountIssued)}
          avatarIcon='ri-money-dollar-circle-line'
          avatarColor='success'
          subtitle={t('totalDisbursed')}
          trendNumber='8%'
          trend='positive'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('paymentsReceived')}
          stats={formatCurrency(monthlyData.totalPaymentsReceived)}
          avatarIcon='ri-check-line'
          avatarColor='info'
          subtitle={t('collections')}
          trendNumber='15%'
          trend='positive'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('defaultRate')}
          stats={formatPercentage(monthlyData.defaultRate / 100)}
          avatarIcon='ri-alarm-warning-line'
          avatarColor='error'
          subtitle={t('riskIndicator')}
          trendNumber='0.5%'
          trend='negative'
        />
      </Grid>

      {/* 投资组合分析 */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title={t('portfolioBreakdown')} />
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
                  {item.percentage}% {t('ofPortfolio')}
                </Typography>
                {index < portfolioBreakdown.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* 风险分析 */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title={t('riskAnalysis')} />
          <CardContent>
            {riskAnalysis.map((item, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Box display='flex' justifyContent='space-between' alignItems='center' sx={{ mb: 1 }}>
                  <Typography variant='body2'>{item.riskLevel}</Typography>
                  <Typography variant='body2' fontWeight={500}>
                    {formatNumber(item.count)} {t('loans')}
                  </Typography>
                </Box>
                <LinearProgress
                  variant='determinate'
                  value={item.percentage}
                  color={index === 0 ? 'success' : index === 1 ? 'warning' : 'error'}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant='caption' color='text.secondary'>
                  {item.percentage}% {t('ofTotal')}
                </Typography>
                {index < riskAnalysis.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* 报告生成 */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title={t('generateReports')} />
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  select
                  label={t('reportType')}
                  SelectProps={{ native: true }}
                >
                  <option value='monthly'>{t('monthlyReport')}</option>
                  <option value='quarterly'>{t('quarterlyReport')}</option>
                  <option value='annual'>{t('annualReport')}</option>
                  <option value='custom'>{t('customReport')}</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type='date'
                  label={t('startDate')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type='date'
                  label={t('endDate')}
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
                  {t('generateReport')}
                </Button>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* 快速报告 */}
            <Typography variant='h6' sx={{ mb: 3 }}>
              {t('quickReports')}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant='outlined'
                  startIcon={<i className='ri-file-text-line' />}
                  fullWidth
                >
                  {t('loanSummary')}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant='outlined'
                  startIcon={<i className='ri-money-dollar-circle-line' />}
                  fullWidth
                >
                  {t('paymentReport')}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant='outlined'
                  startIcon={<i className='ri-user-line' />}
                  fullWidth
                >
                  {t('customerReport')}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant='outlined'
                  startIcon={<i className='ri-alarm-warning-line' />}
                  fullWidth
                >
                  {t('riskReport')}
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