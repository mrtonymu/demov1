'use client'

// React Imports
import { useState, useEffect, useCallback, useMemo } from 'react'

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
import { apiGet } from '@/utils/api'

// Hooks Imports
import { useRealtime } from '@/hooks/useRealtime'

// Component Imports
import CardStatVertical from '@components/card-statistics/Vertical'

// Types
import type { Loan } from '@/types/database'

const LoansPage = () => {
  // Hooks
  const t = useTranslations('loans')
  const tCommon = useTranslations('common')
  const { formatCurrency } = useFormatters()

  // States
  const [loanData, setLoanData] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')



  // Fetch loans data
  const fetchLoans = useCallback(async () => {
    try {
      setLoading(true)
      const result = await apiGet('/api/loans')
      
      if (result.ok) {
        setLoanData(result.data || [])
      } else {
        console.error('Error fetching loans:', result.error)
      }
    } catch (error) {
      console.error('Error fetching loans:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Calculate stats
  const computedStats = useMemo(() => {
    const total = loanData.length
    const active = loanData.filter((l: Loan) => l.status === 'normal').length
    const pending = loanData.filter((l: Loan) => l.status === 'negotiating').length
    const overdue = loanData.filter((l: Loan) => l.status === 'bad_debt').length

    const totalAmount = loanData.reduce((sum: number, l: Loan) => sum + l.principal_amount, 0)
    const activeAmount = loanData
      .filter((l: Loan) => l.status === 'normal')
      .reduce((sum: number, l: Loan) => sum + (l.outstanding_balance || 0), 0)
    const outstanding = loanData.reduce((sum: number, l: Loan) => sum + (l.outstanding_balance || 0), 0)

    return { total, active, pending, overdue, totalAmount, activeAmount, outstanding }
  }, [loanData])

  // Filter loans based on search and status
  const filteredLoans = useMemo(() => {
    return loanData.filter(loan => {
      const matchesSearch = !searchQuery || 
        loan.client?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.id.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = !statusFilter || loan.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [loanData, searchQuery, statusFilter])

  // Handle new loan
  const handleNewLoan = () => {
    // TODO: Open new loan dialog
    console.log('New loan clicked')
  }

  // Handle view loan
  const handleViewLoan = (loan: Loan) => {
    // TODO: Open loan details dialog
    console.log('View loan:', loan.id)
  }

  // Handle edit loan
  const handleEditLoan = (loan: Loan) => {
    // TODO: Open edit loan dialog
    console.log('Edit loan:', loan.id)
  }

  // Setup realtime subscription
  useRealtime('loans', () => {
    fetchLoans()
  })

  // Initial data fetch
  useEffect(() => {
    fetchLoans()
  }, [fetchLoans])

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
          stats={loading ? '...' : computedStats.total.toString()}
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
          stats={loading ? '...' : computedStats.active.toString()}
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
          stats={loading ? '...' : computedStats.pending.toString()}
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
          stats={loading ? '...' : formatCurrency(computedStats.outstanding)}
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
                onClick={handleNewLoan}
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  SelectProps={{ native: true }}
                >
                  <option value=''>{tCommon('all')}</option>
                  <option value='normal'>{t('normal')}</option>
                  <option value='settled'>{t('settled')}</option>
                  <option value='negotiating'>{t('negotiating')}</option>
                  <option value='bad_debt'>{t('badDebt')}</option>
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
              {filteredLoans.map((loan) => (
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
                            <Button 
                              size='small' 
                              variant='outlined'
                              onClick={() => handleViewLoan(loan)}
                            >
                              {tCommon('view')}
                            </Button>
                            <Button 
                              size='small' 
                              variant='contained'
                              onClick={() => handleEditLoan(loan)}
                            >
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