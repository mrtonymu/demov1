'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Next Intl Imports
import { useTranslations } from 'next-intl'

// Third-party Imports
import classnames from 'classnames'

// Utils Imports
import { useFormatters } from '@/utils/formatters'

// Type Imports
import type { ThemeColor } from '@core/types'

// Components Imports
import OptionMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'

type DataType = {
  avatarLabel: string
  avatarColor?: ThemeColor
  title: string
  subtitle: string
  sales: string
  trend: 'up' | 'down'
  trendPercentage: number
}

// Vars
const data: DataType[] = [
  {
    avatarLabel: 'US',
    avatarColor: 'success',
    title: '8,656,000',
    subtitle: 'unitedStates',
    sales: '894k',
    trend: 'up',
    trendPercentage: 25.8
  },
  {
    avatarLabel: 'UK',
    avatarColor: 'error',
    title: '2,415,000',
    subtitle: 'unitedKingdom',
    sales: '645k',
    trend: 'down',
    trendPercentage: 6.2
  },
  {
    avatarLabel: 'IN',
    avatarColor: 'warning',
    title: '865,000',
    subtitle: 'india',
    sales: '148k',
    trend: 'up',
    trendPercentage: 12.4
  },
  {
    avatarLabel: 'JA',
    avatarColor: 'secondary',
    title: '745,000',
    subtitle: 'japan',
    sales: '86k',
    trend: 'down',
    trendPercentage: 11.9
  },
  {
    avatarLabel: 'KO',
    avatarColor: 'error',
    title: '45,000',
    subtitle: 'korea',
    sales: '42k',
    trend: 'up',
    trendPercentage: 16.2
  }
]

const SalesByCountries = () => {
  // Hooks
  const t = useTranslations('countries')
  const { formatPercentage } = useFormatters()

  return (
    <Card>
      <CardHeader
        title={t('salesByCountries')}
        action={<OptionMenu iconClassName='text-textPrimary' options={['Last 28 Days', 'Last Month', 'Last Year']} />}
      />
      <CardContent className='flex flex-col gap-[0.875rem]'>
        {data.map((item, index) => (
          <div key={index} className='flex items-center gap-4'>
            <CustomAvatar skin='light' color={item.avatarColor}>
              {item.avatarLabel}
            </CustomAvatar>
            <div className='flex items-center justify-between is-full flex-wrap gap-x-4 gap-y-2'>
              <div className='flex flex-col gap-1'>
                <div className='flex items-center gap-1'>
                  <Typography color='text.primary' className='font-medium'>
                    {item.title}
                  </Typography>
                  <div className={'flex items-center gap-1'}>
                    <i
                      className={classnames(
                        item.trend === 'up' ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line',
                        item.trend === 'up' ? 'text-success' : 'text-error'
                      )}
                    ></i>
                    <Typography color={item.trend === 'up' ? 'success.main' : 'error.main'}>
                      {formatPercentage(item.trendPercentage)}
                  </Typography>
                </div>
              </div>
              <Typography>{t(item.subtitle)}</Typography>
              </div>
              <div className='flex flex-col gap-1'>
                <Typography color='text.primary' className='font-medium'>
                  {item.sales}
                </Typography>
                <Typography variant='body2' color='text.disabled'>
                  Sales
                </Typography>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default SalesByCountries
