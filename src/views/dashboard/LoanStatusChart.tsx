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

// Types
interface LoanStatusData {
  status: string
  count: number
}

interface Props {
  data: LoanStatusData[]
}

const LoanStatusChart = ({ data }: Props) => {
  // Hooks
  const theme = useTheme()
  const t = useTranslations('dashboard')

  // Calculate total and percentages
  const total = data.reduce((sum, item) => sum + item.count, 0)
  const chartData = data.map(item => item.count)
  const labels = data.map(item => t(`loanStatus.${item.status}`))

  const options: ApexOptions = {
    chart: {
      type: 'donut'
    },
    labels,
    colors: [
      theme.palette.success.main,
      theme.palette.info.main,
      theme.palette.warning.main,
      theme.palette.error.main
    ],
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              fontWeight: 600,
              color: theme.palette.text.primary
            },
            value: {
              show: true,
              fontSize: '16px',
              fontWeight: 600,
              color: theme.palette.text.primary,
              formatter: (val: string) => `${val}笔`
            },
            total: {
              show: true,
              showAlways: true,
              label: '总计',
              fontSize: '14px',
              fontWeight: 600,
              color: theme.palette.text.secondary,
              formatter: () => `${total}笔`
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: true,
      position: 'bottom',
      fontSize: '13px',
      fontWeight: 500,
      labels: {
        colors: theme.palette.text.primary
      },
      markers: {
        size: 8
      },
      itemMargin: {
        horizontal: 8,
        vertical: 4
      }
    },
    tooltip: {
      y: {
        formatter: (val: number) => {
          const percentage = ((val / total) * 100).toFixed(1)

          return `${val}笔 (${percentage}%)`
        }
      }
    },
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
          {t('statusDistribution')}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <ReactApexcharts
            type='donut'
            height={350}
            options={options}
            series={chartData}
          />
        </Box>
      </CardContent>
    </Card>
  )
}

export default LoanStatusChart