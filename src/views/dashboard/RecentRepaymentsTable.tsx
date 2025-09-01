'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'

// Next Intl Imports
import { useTranslations } from 'next-intl'

// Utils Imports
import { useFormatters } from '@/utils/formatters'

// Types
interface RecentRepaymentsData {
  clientName: string
  amount: number
  time: string
  interestDeduction: number
  principalDeduction: number
}

interface Props {
  data: RecentRepaymentsData[]
}

const RecentRepaymentsTable = ({ data }: Props) => {
  // Hooks
  const t = useTranslations('dashboard')
  const { formatCurrency } = useFormatters()

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return `${month}月${day}日 ${hours}:${minutes}`
  }

  return (
    <Card>
      <CardContent>
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
          <Typography variant='h6'>
            {t('recentRepayments')}
          </Typography>
          <Button size='small' color='primary'>
            {t('viewAllRepayments')}
          </Button>
        </Box>
        
        {data.length === 0 ? (
          <Typography variant='body2' color='text.secondary' textAlign='center' py={4}>
            暂无还款记录
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('tables.clientName')}</TableCell>
                  <TableCell align='right'>{t('tables.amount')}</TableCell>
                  <TableCell>{t('tables.time')}</TableCell>
                  <TableCell align='right'>{t('tables.interestDeduction')}</TableCell>
                  <TableCell align='right'>{t('tables.principalDeduction')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Typography variant='subtitle2'>
                        {row.clientName}
                      </Typography>
                    </TableCell>
                    <TableCell align='right'>
                      <Typography variant='body2' fontWeight={500}>
                        {formatCurrency(row.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' color='text.secondary'>
                        {formatDateTime(row.time)}
                      </Typography>
                    </TableCell>
                    <TableCell align='right'>
                      <Chip
                        label={formatCurrency(row.interestDeduction)}
                        size='small'
                        color='info'
                        variant='outlined'
                      />
                    </TableCell>
                    <TableCell align='right'>
                      <Chip
                        label={formatCurrency(row.principalDeduction)}
                        size='small'
                        color='success'
                        variant='outlined'
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  )
}

export default RecentRepaymentsTable