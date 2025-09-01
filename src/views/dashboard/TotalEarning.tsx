// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import LinearProgress from '@mui/material/LinearProgress'

import Typography from '@mui/material/Typography'

// Next Intl Imports
import { useTranslations } from 'next-intl'

// Utils Imports
import { useFormatters } from '@/utils/formatters'

// Type Imports
import type { ThemeColor } from '@core/types'

// Components Imports
import OptionMenu from '@core/components/option-menu'

type DataType = {
  title: string
  imgSrc: string
  amount: string
  progress: number
  subtitle: string
  color?: ThemeColor
}

// Vars
const data: DataType[] = [
  {
    progress: 75,
    title: 'Zipcar',
    amount: '$24,895.65',
    subtitle: 'Vuejs, React & HTML',
    imgSrc: '/images/cards/zipcar.png'
  },
  {
    progress: 50,
    color: 'info',
    title: 'Bitbank',
    amount: '$8,650.20',
    subtitle: 'Sketch, Figma & XD',
    imgSrc: '/images/cards/bitbank.png'
  },
  {
    progress: 20,
    title: 'Aviato',
    color: 'secondary',
    amount: '$1,245.80',
    subtitle: 'HTML & Angular',
    imgSrc: '/images/cards/aviato.png'
  }
]

const TotalEarning = () => {
  // Hooks
  const t = useTranslations('dashboard.totalEarning')
  const { formatCurrency, formatPercentage } = useFormatters()

  return (
    <Card>
      <CardHeader
        title={t('title')}
        action={<OptionMenu iconClassName='text-textPrimary' options={[t('last28Days'), t('lastMonth'), t('lastYear')]} />}
      ></CardHeader>
      <CardContent className='flex flex-col gap-11 md:mbs-2.5'>
        <div>
          <div className='flex items-center'>
            <Typography variant='h3'>{formatCurrency(24895)}</Typography>
            <i className='ri-arrow-up-s-line align-bottom text-success'></i>
            <Typography component='span' color='success.main'>
              {formatPercentage(10)}
            </Typography>
          </div>
          <Typography>{t('comparison')}</Typography>
        </div>
        <div className='flex flex-col gap-6'>
          {data.map((item, index) => (
            <div key={index} className='flex items-center gap-3'>
              <Avatar src={item.imgSrc} variant='rounded' className='bg-actionHover' />
              <div className='flex justify-between items-center is-full flex-wrap gap-x-4 gap-y-2'>
                <div className='flex flex-col gap-0.5'>
                  <Typography color='text.primary' className='font-medium'>
                    {item.title}
                  </Typography>
                  <Typography>{item.subtitle}</Typography>
                </div>
                <div className='flex flex-col gap-2 items-center'>
                  <Typography color='text.primary' className='font-medium'>
                    {formatCurrency(parseFloat(item.amount.replace('$', '').replace(',', '')))}
                  </Typography>
                  <LinearProgress
                    variant='determinate'
                    value={item.progress}
                    className='is-20 bs-1'
                    color={item.color}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default TotalEarning
