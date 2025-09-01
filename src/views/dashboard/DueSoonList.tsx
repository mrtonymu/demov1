'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'

// Next Intl Imports
import { useTranslations } from 'next-intl'

// Utils Imports
import { useFormatters } from '@/utils/formatters'

// Types
interface DueSoonData {
  clientName: string
  dueDate: string
  remainingPrincipal: number
}

interface Props {
  data: DueSoonData[]
}

const DueSoonList = ({ data }: Props) => {
  // Hooks
  const t = useTranslations('dashboard')
  const { formatCurrency } = useFormatters()

  // Calculate days until due
  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)

    return `${date.getMonth() + 1}月${date.getDate()}日`
  }

  return (
    <Card>
      <CardContent>
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
          <Typography variant='h6'>
            {t('dueSoon')}
          </Typography>
          <Button size='small' color='primary'>
            {t('viewAllLoans')}
          </Button>
        </Box>
        
        {data.length === 0 ? (
          <Typography variant='body2' color='text.secondary' textAlign='center' py={4}>
            暂无即将到期的贷款
          </Typography>
        ) : (
          <List disablePadding>
            {data.map((item, index) => {
              const daysLeft = getDaysUntilDue(item.dueDate)
              const isUrgent = daysLeft <= 3
              
              return (
                <ListItem
                  key={index}
                  divider={index < data.length - 1}
                  sx={{ px: 0 }}
                >
                  <ListItemText
                    primary={
                      <Box display='flex' justifyContent='space-between' alignItems='center'>
                        <Typography variant='subtitle2'>
                          {item.clientName}
                        </Typography>
                        <Chip
                          label={`${daysLeft}天后`}
                          size='small'
                          color={isUrgent ? 'error' : 'warning'}
                          variant='outlined'
                        />
                      </Box>
                    }
                    secondary={
                      <Box display='flex' justifyContent='space-between' mt={1}>
                        <Typography variant='body2' color='text.secondary'>
                          {t('tables.dueDate')}: {formatDate(item.dueDate)}
                        </Typography>
                        <Typography variant='body2' fontWeight={500}>
                          {formatCurrency(item.remainingPrincipal)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              )
            })}
          </List>
        )}
      </CardContent>
    </Card>
  )
}

export default DueSoonList