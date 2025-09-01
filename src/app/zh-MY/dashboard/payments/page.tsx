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
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

// Next Intl Imports
import { useTranslations } from 'next-intl'

// Utils Imports
import { useFormatters } from '@/utils/formatters'

// Component Imports
import CardStatVertical from '@components/card-statistics/Vertical'

// Hooks Imports
import { useRealtime } from '@/hooks/useRealtime'

// Types Imports
import type { RepaymentTxn } from '@/types/cr3dify'

const PaymentsPage = () => {
  // Hooks
  const t = useTranslations('payments')
  const tCommon = useTranslations('common')
  const { formatCurrency, formatDate } = useFormatters()

  // State
  const [paymentData, setPaymentData] = useState<RepaymentTxn[]>([])
  const [loading, setLoading] = useState(true)

  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    overdue: 0,
    totalAmount: 0,
    paidAmount: 0
  })

  // Realtime subscription
  useRealtime('repayment_txn', () => {
    fetchPayments()
  })

  // Fetch payments data
  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/repayments')
      if (!response.ok) throw new Error('Failed to fetch payments')
      
      const data = await response.json()

      setPaymentData(data)

      // Calculate stats
      const total = data.length
      const paid = data.filter((p: RepaymentTxn) => p.status === 'completed').length
      const pending = data.filter((p: RepaymentTxn) => p.status === 'pending').length
      const overdue = data.filter((p: RepaymentTxn) => p.status === 'overdue').length
      const totalAmount = data.reduce((sum: number, p: RepaymentTxn) => sum + p.amount, 0)
      const paidAmount = data
        .filter((p: RepaymentTxn) => p.status === 'completed')
        .reduce((sum: number, p: RepaymentTxn) => sum + p.amount, 0)

      setStats({ total, paid, pending, overdue, totalAmount, paidAmount })

      setLoading(false)
    } catch (error) {
      console.error('Error fetching payments:', error)
      setLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchPayments()
  }, [])



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success'
      case 'pending':
        return 'warning'
      case 'overdue':
        return 'error'
      case 'partial':
        return 'secondary'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return t('paid')
      case 'pending':
        return t('pending')
      case 'overdue':
        return t('overdue')
      case 'partial':
        return t('partial')
      default:
        return status
    }
  }

  const getPaymentMethodText = (method: string | null) => {
    if (!method) return '-'

    switch (method) {
      case 'bank_transfer':
        return t('bankTransfer')
      case 'online_banking':
        return t('onlineBanking')
      case 'cash':
        return t('cash')
      case 'cheque':
        return t('cheque')
      default:
        return method
    }
  }

  return (
    <Grid container spacing={6}>
      {/* 统计卡片 */}
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('totalPayments')}
          stats={loading ? '...' : stats.total.toString()}
          avatarIcon='ri-money-dollar-circle-line'
          avatarColor='primary'
          subtitle={t('allPayments')}
          trendNumber='15%'
          trend='positive'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('paidThisMonth')}
          stats={loading ? '...' : formatCurrency(stats.paidAmount)}
          avatarIcon='ri-check-line'
          avatarColor='success'
          subtitle={t('monthlyCollection')}
          trendNumber='8%'
          trend='positive'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('overduePayments')}
          stats={loading ? '...' : stats.overdue.toString()}
          avatarIcon='ri-alarm-warning-line'
          avatarColor='error'
          subtitle={t('requiresAttention')}
          trendNumber='12%'
          trend='negative'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('pendingPayments')}
          stats={loading ? '...' : stats.pending.toString()}
          avatarIcon='ri-time-line'
          avatarColor='warning'
          subtitle={t('dueThisMonth')}
          trendNumber='5%'
          trend='positive'
        />
      </Grid>

      {/* 还款管理表格 */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={t('paymentManagement')}
            action={
              <Button
                variant='contained'
                startIcon={<i className='ri-add-line' />}
              >
                {t('recordPayment')}
              </Button>
            }
          />
          <CardContent>
            {/* 搜索和筛选 */}
            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  placeholder={t('searchPayments')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className='ri-search-line' />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  select
                  label={t('status')}
                  SelectProps={{ native: true }}
                >
                  <option value=''>{tCommon('all')}</option>
                  <option value='paid'>{t('paid')}</option>
                  <option value='pending'>{t('pending')}</option>
                  <option value='overdue'>{t('overdue')}</option>
                  <option value='partial'>{t('partial')}</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type='date'
                  label={t('dateRange')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant='outlined'
                  startIcon={<i className='ri-download-line' />}
                  fullWidth
                >
                  {tCommon('export')}
                </Button>
              </Grid>
            </Grid>

            {/* 还款表格 */}
            <TableContainer component={Paper} variant='outlined'>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('paymentId')}</TableCell>
                    <TableCell>{t('loanId')}</TableCell>
                    <TableCell>{t('customer')}</TableCell>
                    <TableCell align='right'>{t('amount')}</TableCell>
                    <TableCell>{t('dueDate')}</TableCell>
                    <TableCell>{t('paidDate')}</TableCell>
                    <TableCell>{t('paymentMethod')}</TableCell>
                    <TableCell>{t('status')}</TableCell>
                    <TableCell align='center'>{tCommon('actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentData.map((payment) => (
                    <TableRow key={payment.id} hover>
                      <TableCell>
                        <Typography variant='body2' color='primary' fontWeight={500}>
                          {payment.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2'>
                          {payment.loan_id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2'>
                          {payment.loan?.client?.full_name || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell align='right'>
                        <Typography variant='body2' fontWeight={500}>
                          {formatCurrency(payment.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2'>
                          {formatDate(payment.due_date)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2'>
                          {payment.paid_date ? formatDate(payment.paid_date) : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2'>
                          {getPaymentMethodText(payment.payment_method)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(payment.status)}
                          color={getStatusColor(payment.status) as any}
                          size='small'
                        />
                      </TableCell>
                      <TableCell align='center'>
                        <Box display='flex' gap={1} justifyContent='center'>
                          <Button size='small' variant='outlined'>
                            {tCommon('view')}
                          </Button>
                          {payment.status === 'pending' || payment.status === 'overdue' ? (
                            <Button size='small' variant='contained' color='success'>
                              {t('markPaid')}
                            </Button>
                          ) : null}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default PaymentsPage