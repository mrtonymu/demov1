'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// Next Intl Imports
import { useTranslations } from 'next-intl'

// Third Party Imports
import type { ApexOptions } from 'apexcharts'

// Utils Imports
import { useFormatters } from '@/utils/formatters'

// Components Imports
import OptionsMenu from '@core/components/option-menu'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const WeeklyOverview = () => {
  // Hooks
  const theme = useTheme()
  const t = useTranslations('dashboard.weeklyOverview')
  const { formatPercentage } = useFormatters()

  // Vars
  const divider = 'var(--mui-palette-divider)'
  const disabled = 'var(--mui-palette-text-disabled)'

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 7,
        distributed: true,
        columnWidth: '40%'
      }
    },
    stroke: {
      width: 2,
      colors: ['var(--mui-palette-background-paper)']
    },
    legend: { show: false },
    grid: {
      xaxis: { lines: { show: false } },
      strokeDashArray: 7,
      padding: { left: -9, top: -20, bottom: 13 },
      borderColor: divider
    },
    dataLabels: { enabled: false },
    colors: [
      'var(--mui-palette-customColors-trackBg)',
      'var(--mui-palette-customColors-trackBg)',
      'var(--mui-palette-customColors-trackBg)',
      'var(--mui-palette-primary-main)',
      'var(--mui-palette-customColors-trackBg)',
      'var(--mui-palette-customColors-trackBg)'
    ],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      categories: [t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')],
      tickPlacement: 'on',
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      show: true,
      tickAmount: 4,
      labels: {
        offsetY: 2,
        offsetX: -17,
        style: { colors: disabled, fontSize: theme.typography.body2.fontSize as string },
        formatter: value => `${value > 999 ? `${(value / 1000).toFixed(0)}` : value}k`
      }
    }
  }

  return (
    <Card>
      <CardHeader
        title={t('title')}
        action={<OptionsMenu iconClassName='text-textPrimary' options={[t('refresh'), t('update'), t('delete')]} />}
      />
      <CardContent sx={{ '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 } }}>
        <AppReactApexCharts
          type='bar'
          height={206}
          width='100%'
          series={[{ name: t('sales'), data: [37, 57, 45, 75, 57, 40, 65] }]}
          options={options}
        />
        <div className='flex items-center mbe-4 gap-4'>
          <Typography variant='h4'>{formatPercentage(45)}</Typography>
          <Typography>{t('performance')}</Typography>
        </div>
        <Button fullWidth variant='contained'>
          {t('details')}
        </Button>
      </CardContent>
    </Card>
  )
}

export default WeeklyOverview
