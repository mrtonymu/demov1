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
import IconButton from '@mui/material/IconButton'

// Next Intl Imports
import { useTranslations } from 'next-intl'

// Utils Imports
import { useFormatters } from '@/utils/formatters'

// Types
interface TopOverdueData {
  clientName: string
  overdueDays: number
  balance: number
}

interface Props {
  data: TopOverdueData[]
}

const TopOverdueList = ({ data }: Props) => {
  // Hooks
  const t = useTranslations('dashboard')
  const { formatCurrency } = useFormatters()

  const getSeverityColor = (days: number) => {
    if (days >= 30) return 'error'
    if (days >= 15) return 'warning'
    
    return 'info'
  }

  return (
    <Card>
      <CardContent>
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
          <Typography variant='h6'>
            {t('topOverdue')}
          </Typography>
          <Button size='small' color='primary'>
            {t('viewAllLoans')}
          </Button>
        </Box>
        
        {data.length === 0 ? (
          <Typography variant='body2' color='text.secondary' textAlign='center' py={4}>
            暂无逾期贷款
          </Typography>
        ) : (
          <List disablePadding>
            {data.map((item, index) => {
              const severityColor = getSeverityColor(item.overdueDays)
              
              return (
                <ListItem
                  key={index}
                  divider={index < data.length - 1}
                  sx={{ px: 0 }}
                  secondaryAction={
                    <IconButton
                      edge='end'
                      size='small'
                      color='primary'
                      onClick={() => {
                        // Navigate to loan details
                        console.log('Navigate to loan details for:', item.clientName)
                      }}
                    >
                      <i className='ri-arrow-right-line' />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <Box display='flex' justifyContent='space-between' alignItems='center'>
                        <Typography variant='subtitle2'>
                          {item.clientName}
                        </Typography>
                        <Chip
                          label={`逾期${item.overdueDays}天`}
                          size='small'
                          color={severityColor}
                          variant='filled'
                        />
                      </Box>
                    }
                    secondary={
                      <Box display='flex' justifyContent='space-between' mt={1}>
                        <Typography variant='body2' color='text.secondary'>
                          {t('tables.balance')}
                        </Typography>
                        <Typography variant='body2' fontWeight={500} color='error.main'>
                          {formatCurrency(item.balance)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              )
            })}
          </List>
        )}
        
        {data.length > 0 && (
          <Box mt={2} textAlign='center'>
            <Button variant='outlined' size='small' color='primary'>
              {t('tables.followUp')}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default TopOverdueList