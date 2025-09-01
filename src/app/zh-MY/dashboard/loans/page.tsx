'use client'

// React Imports
import { useState, useEffect } from 'react'

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

// Hooks Imports
import { useRealtime } from '@/hooks/useRealtime'

// Component Imports
import CardStatVertical from '@components/card-statistics/Vertical'

// Types
import type { Loan } from '@/types/cr3dify'

const LoansPage = () => {
  // Hooks
  const t = useTranslations('loans')
  const tCommon = useTranslations('common')
  const { formatCurrency } = useFormatters()

  // States
  const [loanData, setLoanData] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    overdue: 0,
    totalAmount: 0,
    activeAmount: 0,
    outstanding: 0
  })

  // Fetch loans data
  const fetchLoans = async () => {
    try {
      const response = await fetch('/api/loans')

      if (!response.ok) {
        throw new Error('Failed to fetch loans')
      }

      const data = await response.json()
      setLoanData(data)

        // Calculate stats
        const total = data.length
        const active = data.filter((l: Loan) => l.status === 'normal').length
        const pending = data.filter((l: Loan) => l.status === 'negotiating').length
        const overdue = data.filter((l: Loan) => l.status === 'bad_debt').length
        const totalAmount = data.reduce((sum: number, l: Loan) => sum + l.principal_amount, 0)
        const activeAmount = data
          .filter((l: Loan) => l.status === 'normal')
          .reduce((sum: number, l: Loan) => sum + l.outstanding_balance, 0)

        const outstanding = data.reduce((sum: number, l: Loan) => sum + (l.outstanding_balance || 0), 0)

        setStats({ total, active, pending, overdue, totalAmount, activeAmount, outstanding })

        setLoading(false)
    } catch (error) {
      console.error('Error fetching loans:', error)
      setLoading(false)

      return
    }
  }

  // Setup realtime subscription
  useRealtime('loan', () => {
    fetchLoans()
  })

  // Initial data fetch
  useEffect(() => {
    fetchLoans()
  }, [])

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
          stats={loading ? '...' : stats.total.toString()}
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
          stats={loading ? '...' : stats.active.toString()}
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
          stats={loading ? '...' : stats.pending.toString()}
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
          stats={loading ? '...' : formatCurrency(stats.outstanding)}
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
                            {loan.client?.full_name || 'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <Typography variant='body2' color='text.secondary'>
                            {t('amount')}
                          </Typography>
                          <Typography variant='h6'>
                            {formatCurrency(loan.principal_amount)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <Typography variant='body2' color='text.secondary'>
                            {t('interestRate')}
                          </Typography>
                          <Typography variant='h6'>
                            {loan.interest_rate}%
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <Typography variant='body2' color='text.secondary'>
                            {t('remainingBalance')}
                          </Typography>
                          <Typography variant='h6'>
                            {formatCurrency(loan.outstanding_balance)}
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