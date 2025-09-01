'use client'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// Next Intl Imports
import { useTranslations } from 'next-intl'

// Utils Imports
import { useFormatters } from '@/utils/formatters'

// Component Imports
import CardStatVertical from '@components/card-statistics/Vertical'

const LoansPage = () => {
  // Hooks
  const t = useTranslations('loans')
  const tCommon = useTranslations('common')
  const { formatCurrency } = useFormatters()

  // 模拟贷款数据
  const loanData = [
    {
      id: 'LN001',
      customerName: '张三',
      amount: 150000,
      interestRate: 5.5,
      term: 24,
      status: 'active',
      startDate: '2024-01-15',
      nextPayment: '2024-03-15',
      remainingBalance: 125000
    },
    {
      id: 'LN002',
      customerName: '李四',
      amount: 80000,
      interestRate: 6.0,
      term: 12,
      status: 'pending',
      startDate: '2024-02-20',
      nextPayment: '2024-03-20',
      remainingBalance: 80000
    },
    {
      id: 'LN003',
      customerName: '王五',
      amount: 200000,
      interestRate: 5.0,
      term: 36,
      status: 'completed',
      startDate: '2023-01-10',
      nextPayment: '-',
      remainingBalance: 0
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'pending':
        return 'warning'
      case 'completed':
        return 'primary'
      case 'overdue':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return t('active')
      case 'pending':
        return t('pending')
      case 'completed':
        return t('completed')
      case 'overdue':
        return t('overdue')
      default:
        return status
    }
  }

  return (
    <Grid container spacing={6}>
      {/* 统计卡片 */}
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('totalLoans')}
          stats='456'
          avatarIcon='ri-file-list-3-line'
          avatarColor='primary'
          subtitle={t('allLoans')}
          trendNumber='8%'
          trend='positive'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('activeLoans')}
          stats='234'
          avatarIcon='ri-check-line'
          avatarColor='success'
          subtitle={t('currentlyActive')}
          trendNumber='12%'
          trend='positive'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('pendingApprovals')}
          stats='23'
          avatarIcon='ri-time-line'
          avatarColor='warning'
          subtitle={t('awaitingApproval')}
          trendNumber='5%'
          trend='negative'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('totalOutstanding')}
          stats={formatCurrency(2450000)}
          avatarIcon='ri-money-dollar-circle-line'
          avatarColor='info'
          subtitle={t('remainingBalance')}
          trendNumber='3%'
          trend='positive'
        />
      </Grid>

      {/* 贷款管理表格 */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={t('loanManagement')}
            action={
              <Button
                variant='contained'
                startIcon={<i className='ri-add-line' />}
              >
                {t('newLoan')}
              </Button>
            }
          />
          <CardContent>
            {/* 搜索和筛选 */}
            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  placeholder={t('searchLoans')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className='ri-search-line' />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  select
                  label={t('status')}
                  SelectProps={{ native: true }}
                >
                  <option value=''>{tCommon('all')}</option>
                  <option value='active'>{t('active')}</option>
                  <option value='pending'>{t('pending')}</option>
                  <option value='completed'>{t('completed')}</option>
                  <option value='overdue'>{t('overdue')}</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  variant='outlined'
                  startIcon={<i className='ri-filter-line' />}
                >
                  {tCommon('filter')}
                </Button>
              </Grid>
            </Grid>

            {/* 贷款列表 */}
            <Grid container spacing={4}>
              {loanData.map((loan) => (
                <Grid item xs={12} key={loan.id}>
                  <Card variant='outlined'>
                    <CardContent>
                      <Grid container spacing={4} alignItems='center'>
                        <Grid item xs={12} sm={6} md={2}>
                          <Typography variant='h6' color='primary'>
                            {loan.id}
                          </Typography>
                          <Typography variant='body2' color='text.secondary'>
                            {loan.customerName}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <Typography variant='body2' color='text.secondary'>
                            {t('amount')}
                          </Typography>
                          <Typography variant='h6'>
                            {formatCurrency(loan.amount)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <Typography variant='body2' color='text.secondary'>
                            {t('interestRate')}
                          </Typography>
                          <Typography variant='h6'>
                            {loan.interestRate}%
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <Typography variant='body2' color='text.secondary'>
                            {t('remainingBalance')}
                          </Typography>
                          <Typography variant='h6'>
                            {formatCurrency(loan.remainingBalance)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <Typography variant='body2' color='text.secondary'>
                            {t('status')}
                          </Typography>
                          <Chip
                            label={getStatusText(loan.status)}
                            color={getStatusColor(loan.status) as any}
                            size='small'
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <Box display='flex' gap={1}>
                            <Button size='small' variant='outlined'>
                              {tCommon('view')}
                            </Button>
                            <Button size='small' variant='contained'>
                              {tCommon('edit')}
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default LoansPage