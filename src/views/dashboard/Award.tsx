// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Next Intl Imports
import { useTranslations } from 'next-intl'

// Utils Imports
import { useFormatters } from '@/utils/formatters'

const Award = () => {
  const t = useTranslations('dashboard.award')
  const { formatCurrency, formatPercentage } = useFormatters()

  return (
    <Card>
      <CardContent className='flex flex-col gap-2 relative items-start'>
        <div>
          <Typography variant='h5'>{t('congratulations')}</Typography>
          <Typography>{t('bestSeller')}</Typography>
        </div>
        <div>
          <Typography variant='h4' color='primary'>
            {formatCurrency(42800)}
          </Typography>
          <Typography>{formatPercentage(78)} {t('ofTarget')} 🚀</Typography>
        </div>
        <Button size='small' variant='contained'>
          {t('viewSales')}
        </Button>
        <img
          src='/images/pages/trophy.png'
          alt='trophy image'
          height={102}
          className='absolute inline-end-7 bottom-6'
        />
      </CardContent>
    </Card>
  )
}

export default Award
