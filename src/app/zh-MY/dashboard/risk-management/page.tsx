'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Slider from '@mui/material/Slider'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

// Next Intl Imports
import { useTranslations } from 'next-intl'

// Utils Imports
import { useFormatters } from '@/utils/formatters'

// Component Imports
import CardStatVertical from '@components/card-statistics/Vertical'

const RiskManagementPage = () => {
  // Hooks
  const t = useTranslations('riskManagement')
  const tCommon = useTranslations('common')
  const { formatCurrency, formatPercentage } = useFormatters()

  // State
  const [riskThreshold, setRiskThreshold] = useState(75)
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d')

  // 模拟风险数据
  const riskMetrics = {
    overallRiskScore: 68,
    creditRisk: 72,
    liquidityRisk: 45,
    operationalRisk: 58,
    marketRisk: 63
  }

  const riskAlerts = [
    {
      id: 'RISK001',
      type: 'high_risk_customer',
      severity: 'high',
      title: '高风险客户预警',
      description: '客户张三的信用评分下降至450分，建议立即审查',
      timestamp: '2024-03-15T10:30:00',
      status: 'active'
    },
    {
      id: 'RISK002',
      type: 'concentration_risk',
      severity: 'medium',
      title: '集中度风险',
      description: '房地产行业贷款占比达到35%，超过风险阈值',
      timestamp: '2024-03-15T09:15:00',
      status: 'active'
    },
    {
      id: 'RISK003',
      type: 'liquidity_risk',
      severity: 'low',
      title: '流动性风险提醒',
      description: '短期资金缺口预计在下周达到峰值',
      timestamp: '2024-03-14T16:20:00',
      status: 'resolved'
    }
  ]

  const portfolioRisk = [
    {
      category: '个人贷款',
      exposure: 15000000,
      riskScore: 65,
      defaultRate: 2.3,
      provision: 345000
    },
    {
      category: '企业贷款',
      exposure: 25000000,
      riskScore: 72,
      defaultRate: 3.1,
      provision: 775000
    },
    {
      category: '房屋抵押',
      exposure: 35000000,
      riskScore: 58,
      defaultRate: 1.8,
      provision: 630000
    },
    {
      category: '汽车贷款',
      exposure: 8000000,
      riskScore: 61,
      defaultRate: 2.5,
      provision: 200000
    }
  ]

  const getRiskColor = (score: number) => {
    if (score >= 80) {
      return 'error'
    }

    if (score >= 60) {
      return 'warning'
    }

    if (score >= 40) {
      return 'info'
    }

    return 'success'
  }

  const getRiskLevel = (score: number) => {
    if (score >= 80) {
      return t('highRisk')
    }

    if (score >= 60) {
      return t('mediumRisk')
    }

    if (score >= 40) {
      return t('lowRisk')
    }

    return t('veryLowRisk')
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'error'
      case 'medium':
        return 'warning'
      case 'low':
        return 'info'
      default:
        return 'default'
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high':
        return t('highSeverity')
      case 'medium':
        return t('mediumSeverity')
      case 'low':
        return t('lowSeverity')
      default:
        return severity
    }
  }

  return (
    <Grid container spacing={6}>
      {/* 风险指标卡片 */}
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('overallRiskScore')}
          stats={riskMetrics.overallRiskScore.toString()}
          avatarIcon='ri-shield-line'
          avatarColor={getRiskColor(riskMetrics.overallRiskScore)}
          subtitle={getRiskLevel(riskMetrics.overallRiskScore)}
          trendNumber='5%'
          trend='negative'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('creditRisk')}
          stats={riskMetrics.creditRisk.toString()}
          avatarIcon='ri-user-line'
          avatarColor={getRiskColor(riskMetrics.creditRisk)}
          subtitle={getRiskLevel(riskMetrics.creditRisk)}
          trendNumber='3%'
          trend='positive'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('liquidityRisk')}
          stats={riskMetrics.liquidityRisk.toString()}
          avatarIcon='ri-water-line'
          avatarColor={getRiskColor(riskMetrics.liquidityRisk)}
          subtitle={getRiskLevel(riskMetrics.liquidityRisk)}
          trendNumber='8%'
          trend='negative'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('operationalRisk')}
          stats={riskMetrics.operationalRisk.toString()}
          avatarIcon='ri-settings-line'
          avatarColor={getRiskColor(riskMetrics.operationalRisk)}
          subtitle={getRiskLevel(riskMetrics.operationalRisk)}
          trendNumber='2%'
          trend='positive'
        />
      </Grid>

      {/* 风险预警 */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader
            title={t('riskAlerts')}
            action={
              <Button
                variant='outlined'
                startIcon={<i className='ri-settings-line' />}
                size='small'
              >
                {t('configure')}
              </Button>
            }
          />
          <CardContent>
            <Box display='flex' flexDirection='column' gap={2}>
              {riskAlerts.map((alert) => (
                <Alert
                  key={alert.id}
                  severity={getSeverityColor(alert.severity) as any}
                  variant='outlined'
                >
                  <AlertTitle>
                    <Box display='flex' justifyContent='space-between' alignItems='center'>
                      <Typography variant='subtitle2'>
                        {alert.title}
                      </Typography>
                      <Chip
                        label={getSeverityText(alert.severity)}
                        size='small'
                        color={getSeverityColor(alert.severity) as any}
                        variant='filled'
                      />
                    </Box>
                  </AlertTitle>
                  <Typography variant='body2'>
                    {alert.description}
                  </Typography>
                </Alert>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* 风险设置 */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title={t('riskSettings')} />
          <CardContent>
            <Box display='flex' flexDirection='column' gap={4}>
              <Box>
                <Typography variant='subtitle2' sx={{ mb: 2 }}>
                  {t('riskThreshold')}
                </Typography>
                <Slider
                  value={riskThreshold}
                  onChange={(_, value) => setRiskThreshold(value as number)}
                  min={0}
                  max={100}
                  marks={[
                    { value: 0, label: '0' },
                    { value: 25, label: '25' },
                    { value: 50, label: '50' },
                    { value: 75, label: '75' },
                    { value: 100, label: '100' }
                  ]}
                  valueLabelDisplay='on'
                />
              </Box>
              
              <FormControl fullWidth>
                <InputLabel>{t('timeframe')}</InputLabel>
                <Select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  label={t('timeframe')}
                >
                  <MenuItem value='7d'>{t('7days')}</MenuItem>
                  <MenuItem value='30d'>{t('30days')}</MenuItem>
                  <MenuItem value='90d'>{t('90days')}</MenuItem>
                  <MenuItem value='1y'>{t('1year')}</MenuItem>
                </Select>
              </FormControl>
              
              <Button variant='contained' fullWidth>
                {tCommon('save')}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* 投资组合风险分析 */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={t('portfolioRiskAnalysis')}
            action={
              <Box display='flex' gap={2}>
                <TextField
                  size='small'
                  placeholder={t('searchCategory')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className='ri-search-line' />
                      </InputAdornment>
                    )
                  }}
                />
                <Button
                  variant='outlined'
                  startIcon={<i className='ri-download-line' />}
                  size='small'
                >
                  {tCommon('export')}
                </Button>
              </Box>
            }
          />
          <CardContent>
            <TableContainer component={Paper} variant='outlined'>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('category')}</TableCell>
                    <TableCell align='right'>{t('exposure')}</TableCell>
                    <TableCell align='center'>{t('riskScore')}</TableCell>
                    <TableCell align='right'>{t('defaultRate')}</TableCell>
                    <TableCell align='right'>{t('provision')}</TableCell>
                    <TableCell align='center'>{t('riskLevel')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {portfolioRisk.map((item) => (
                    <TableRow key={item.category}>
                      <TableCell component='th' scope='row'>
                        <Typography variant='body2' fontWeight={500}>
                          {item.category}
                        </Typography>
                      </TableCell>
                      <TableCell align='right'>
                        <Typography variant='body2'>
                          {formatCurrency(item.exposure)}
                        </Typography>
                      </TableCell>
                      <TableCell align='center'>
                        <Box display='flex' alignItems='center' gap={1}>
                          <LinearProgress
                            variant='determinate'
                            value={item.riskScore}
                            color={getRiskColor(item.riskScore) as any}
                            sx={{ width: 60, height: 6, borderRadius: 3 }}
                          />
                          <Typography variant='body2'>
                            {item.riskScore}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align='right'>
                        <Typography variant='body2'>
                          {formatPercentage(item.defaultRate / 100)}
                        </Typography>
                      </TableCell>
                      <TableCell align='right'>
                        <Typography variant='body2'>
                          {formatCurrency(item.provision)}
                        </Typography>
                      </TableCell>
                      <TableCell align='center'>
                        <Chip
                          label={getRiskLevel(item.riskScore)}
                          color={getRiskColor(item.riskScore) as any}
                          size='small'
                          variant='outlined'
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default RiskManagementPage