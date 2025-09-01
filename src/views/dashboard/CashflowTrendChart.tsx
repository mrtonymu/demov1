'use client'

// React Imports
import { useTheme } from '@mui/material/styles'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// Next Intl Imports
import { useTranslations } from 'next-intl'

// Third-party Imports
import type { ApexOptions } from 'apexcharts'

// Components Imports
import ReactApexcharts from '@/libs/ApexCharts'

// Utils Imports
import { useFormatters } from '@/utils/formatters'

// Types
interface CashflowData {
  month: string
  disbursed: number
  repaid: number
}

interface Props {
  data: CashflowData[]
}

const CashflowTrendChart = ({ data }: Props) => {
  // Hooks
  const theme = useTheme()
  const t = useTranslations('dashboard')
  const { formatCurrency } = useFormatters()

  // Prepare chart data
  const categories = data.map(item => {
    const date = new Date(item.month)

    return `${date.getFullYear()}年${date.getMonth() + 1}月`
  })

  const series = [
    {
      name: t('charts.disbursed'),
      data: data.map(item => item.disbursed),
      color: theme.palette.primary.main
    },
    {
      name: t('charts.repayments'),
      data: data.map(item => item.repaid),
      color: theme.palette.info.main
    }
  ]

  const options: ApexOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    stroke: {
      width: 3,
      curve: 'smooth'
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: theme.palette.text.secondary,
          fontSize: '12px'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.palette.text.secondary,
          fontSize: '12px'
        },
        formatter: (val: number) => formatCurrency(val)
      }
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false
        }
      }
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '13px',
      fontWeight: 500,
      labels: {
        colors: theme.palette.text.primary
      },
      markers: {
        size: 8
      },
      itemMargin: {
        horizontal: 16
      }
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number) => formatCurrency(val)
      }
    },
    colors: [theme.palette.primary.main, theme.palette.info.main],
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 300
          }
        }
      }
    ]
  }

  return (
    <Card>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          {t('cashflowTrend')}
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          {t('charts.last12Months')}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <ReactApexcharts
            type='line'
            height={350}
            options={options}
            series={series}
          />
        </Box>
      </CardContent>
    </Card>
  )
}

export default CashflowTrendChart