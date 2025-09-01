//MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

// Next Intl Imports
import { useTranslations } from 'next-intl'

// Utils Imports
import { useFormatters } from '@/utils/formatters'

// Type Imports
import type { ThemeColor } from '@core/types'

// Components Imports
import OptionMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'

type DataType = {
  icon: string
  stats: string
  title: string
  color: ThemeColor
}



const Transactions = () => {
  // Hooks
  const t = useTranslations('dashboard.transactions')
  const { formatPercentage } = useFormatters()

  const data: DataType[] = [
    {
      stats: '245k',
      title: t('sales'),
      color: 'primary',
      icon: 'ri-pie-chart-2-line'
    },
    {
      stats: '12.5k',
      title: t('users'),
      color: 'success',
      icon: 'ri-group-line'
    },
    {
      stats: '1.54k',
      color: 'warning',
      title: t('products'),
      icon: 'ri-macbook-line'
    },
    {
      stats: '$88k',
      color: 'info',
      title: t('revenue'),
      icon: 'ri-money-dollar-circle-line'
    }
  ]

  return (
    <Card className='bs-full'>
      <CardHeader
        title={t('title')}
        action={<OptionMenu iconClassName='text-textPrimary' options={[t('refresh'), t('share'), t('update')]} />}
        subheader={
          <p className='mbs-3'>
            <span className='font-medium text-textPrimary'>{t('growth')} {formatPercentage(48.5)}</span>
            <span className='text-textSecondary'>{t('thisMonth')} 😎</span>
          </p>
        }
      />
      <CardContent className='!pbs-5'>
        <Grid container spacing={2}>
          {data.map((item, index) => (
            <Grid item xs={6} md={3} key={index}>
              <div className='flex items-center gap-3'>
                <CustomAvatar variant='rounded' color={item.color} className='shadow-xs'>
                  <i className={item.icon}></i>
                </CustomAvatar>
                <div>
                  <Typography>{item.title}</Typography>
                  <Typography variant='h5'>{item.stats}</Typography>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Transactions
