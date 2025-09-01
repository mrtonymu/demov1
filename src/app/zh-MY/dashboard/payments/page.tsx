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

const PaymentsPage = () => {
  // Hooks
  const t = useTranslations('payments')
  const tCommon = useTranslations('common')
  const { formatCurrency, formatDate } = useFormatters()

  // 模拟还款数据
  const paymentData = [
    {
      id: 'PAY001',
      loanId: 'LN001',
      customerName: '张三',
      amount: 6250,
      dueDate: '2024-03-15',
      paidDate: '2024-03-14',
      status: 'paid',
      paymentMethod: 'bank_transfer'
    },
    {
      id: 'PAY002',
      loanId: 'LN001',
      customerName: '张三',
      amount: 6250,
      dueDate: '2024-04-15',
      paidDate: null,
      status: 'pending',
      paymentMethod: null
    },
    {
      id: 'PAY003',
      loanId: 'LN002',
      customerName: '李四',
      amount: 7000,
      dueDate: '2024-03-10',
      paidDate: null,
      status: 'overdue',
      paymentMethod: null
    },
    {
      id: 'PAY004',
      loanId: 'LN003',
      customerName: '王五',
      amount: 5800,
      dueDate: '2024-03-20',
      paidDate: '2024-03-18',
      status: 'paid',
      paymentMethod: 'online_banking'
    }
  ]

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
          stats='1,234'
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
          stats={formatCurrency(245000)}
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
          stats='23'
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
          stats={formatCurrency(156000)}
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
                          {payment.loanId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2'>
                          {payment.customerName}
                        </Typography>
                      </TableCell>
                      <TableCell align='right'>
                        <Typography variant='body2' fontWeight={500}>
                          {formatCurrency(payment.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2'>
                          {formatDate(payment.dueDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2'>
                          {payment.paidDate ? formatDate(payment.paidDate) : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2'>
                          {getPaymentMethodText(payment.paymentMethod)}
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