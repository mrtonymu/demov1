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
import Avatar from '@mui/material/Avatar'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'

// Next Intl Imports
import { useTranslations } from 'next-intl'

// Utils Imports
import { useFormatters } from '@/utils/formatters'

// Component Imports
import CardStatVertical from '@components/card-statistics/Vertical'

const ApprovalsPage = () => {
  // Hooks
  const t = useTranslations('approvals')
  const tCommon = useTranslations('common')
  const { formatCurrency, formatDate } = useFormatters()

  // State
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // 模拟申请数据
  const applicationData = [
    {
      id: 'APP001',
      customerName: '张三',
      customerEmail: 'zhangsan@example.com',
      loanAmount: 150000,
      loanPurpose: '房屋装修',
      interestRate: 5.5,
      term: 24,
      status: 'pending_review',
      submittedAt: '2024-03-15T09:30:00',
      currentStep: 1,
      assignedTo: '李经理',
      documents: ['身份证', '收入证明', '银行流水']
    },
    {
      id: 'APP002',
      customerName: '李四',
      customerEmail: 'lisi@example.com',
      loanAmount: 80000,
      loanPurpose: '创业资金',
      interestRate: 6.0,
      term: 12,
      status: 'pending_approval',
      submittedAt: '2024-03-14T14:20:00',
      currentStep: 2,
      assignedTo: '王专员',
      documents: ['营业执照', '财务报表', '担保文件']
    },
    {
      id: 'APP003',
      customerName: '王五',
      customerEmail: 'wangwu@example.com',
      loanAmount: 200000,
      loanPurpose: '设备采购',
      interestRate: 5.0,
      term: 36,
      status: 'approved',
      submittedAt: '2024-03-13T11:15:00',
      currentStep: 4,
      assignedTo: '张主管',
      documents: ['采购合同', '设备清单', '公司资质']
    },
    {
      id: 'APP004',
      customerName: '赵六',
      customerEmail: 'zhaoliu@example.com',
      loanAmount: 50000,
      loanPurpose: '教育支出',
      interestRate: 4.5,
      term: 18,
      status: 'rejected',
      submittedAt: '2024-03-12T16:45:00',
      currentStep: 2,
      assignedTo: '李经理',
      documents: ['学费通知', '收入证明']
    }
  ]

  const approvalSteps = [
    t('documentReview'),
    t('creditCheck'),
    t('riskAssessment'),
    t('finalApproval'),
    t('loanDisbursement')
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_review':
        return 'warning'
      case 'pending_approval':
        return 'primary'
      case 'approved':
        return 'success'
      case 'rejected':
        return 'error'
      case 'on_hold':
        return 'default'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_review':
        return t('pendingReview')
      case 'pending_approval':
        return t('pendingApproval')
      case 'approved':
        return t('approved')
      case 'rejected':
        return t('rejected')
      case 'on_hold':
        return t('onHold')
      default:
        return status
    }
  }

  const handleViewApplication = (application: any) => {
    setSelectedApplication(application)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedApplication(null)
  }

  return (
    <Grid container spacing={6}>
      {/* 统计卡片 */}
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('totalApplications')}
          stats='156'
          avatarIcon='ri-file-list-3-line'
          avatarColor='primary'
          subtitle={t('allApplications')}
          trendNumber='12%'
          trend='positive'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('pendingReview')}
          stats='23'
          avatarIcon='ri-time-line'
          avatarColor='warning'
          subtitle={t('awaitingReview')}
          trendNumber='5%'
          trend='positive'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('approvedToday')}
          stats='8'
          avatarIcon='ri-check-line'
          avatarColor='success'
          subtitle={t('todayApprovals')}
          trendNumber='15%'
          trend='positive'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('averageProcessingTime')}
          stats='3.2'
          avatarIcon='ri-timer-line'
          avatarColor='info'
          subtitle={t('days')}
          trendNumber='8%'
          trend='negative'
        />
      </Grid>

      {/* 申请管理表格 */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={t('loanApplications')}
            action={
              <Button
                variant='outlined'
                startIcon={<i className='ri-filter-line' />}
              >
                {tCommon('filter')}
              </Button>
            }
          />
          <CardContent>
            {/* 搜索和筛选 */}
            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  placeholder={t('searchApplications')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className='ri-search-line' />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  select
                  label={t('status')}
                  SelectProps={{ native: true }}
                >
                  <option value=''>{tCommon('all')}</option>
                  <option value='pending_review'>{t('pendingReview')}</option>
                  <option value='pending_approval'>{t('pendingApproval')}</option>
                  <option value='approved'>{t('approved')}</option>
                  <option value='rejected'>{t('rejected')}</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  select
                  label={t('assignedTo')}
                  SelectProps={{ native: true }}
                >
                  <option value=''>{tCommon('all')}</option>
                  <option value='李经理'>李经理</option>
                  <option value='王专员'>王专员</option>
                  <option value='张主管'>张主管</option>
                </TextField>
              </Grid>
            </Grid>

            {/* 申请列表 */}
            <Grid container spacing={4}>
              {applicationData.map((application) => (
                <Grid item xs={12} key={application.id}>
                  <Card variant='outlined'>
                    <CardContent>
                      <Grid container spacing={4} alignItems='center'>
                        <Grid item xs={12} sm={6} md={2}>
                          <Box display='flex' alignItems='center' gap={2}>
                            <Avatar sx={{ width: 40, height: 40 }}>
                              {application.customerName.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant='body2' fontWeight={500}>
                                {application.customerName}
                              </Typography>
                              <Typography variant='caption' color='text.secondary'>
                                {application.id}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <Typography variant='body2' color='text.secondary'>
                            {t('loanAmount')}
                          </Typography>
                          <Typography variant='h6'>
                            {formatCurrency(application.loanAmount)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <Typography variant='body2' color='text.secondary'>
                            {t('purpose')}
                          </Typography>
                          <Typography variant='body2'>
                            {application.loanPurpose}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <Typography variant='body2' color='text.secondary'>
                            {t('submittedAt')}
                          </Typography>
                          <Typography variant='body2'>
                            {formatDate(application.submittedAt)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <Typography variant='body2' color='text.secondary'>
                            {t('status')}
                          </Typography>
                          <Chip
                            label={getStatusText(application.status)}
                            color={getStatusColor(application.status) as any}
                            size='small'
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <Box display='flex' gap={1}>
                            <Button
                              size='small'
                              variant='outlined'
                              onClick={() => handleViewApplication(application)}
                            >
                              {tCommon('view')}
                            </Button>
                            {(application.status === 'pending_review' || application.status === 'pending_approval') && (
                              <Button size='small' variant='contained'>
                                {t('process')}
                              </Button>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* 申请详情对话框 */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth='md'
        fullWidth
      >
        {selectedApplication && (
          <>
            <DialogTitle>
              {t('applicationDetails')} - {selectedApplication.id}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <Typography variant='subtitle2' color='text.secondary'>
                    {t('customerName')}
                  </Typography>
                  <Typography variant='body1' sx={{ mb: 2 }}>
                    {selectedApplication.customerName}
                  </Typography>
                  
                  <Typography variant='subtitle2' color='text.secondary'>
                    {t('loanAmount')}
                  </Typography>
                  <Typography variant='body1' sx={{ mb: 2 }}>
                    {formatCurrency(selectedApplication.loanAmount)}
                  </Typography>
                  
                  <Typography variant='subtitle2' color='text.secondary'>
                    {t('interestRate')}
                  </Typography>
                  <Typography variant='body1' sx={{ mb: 2 }}>
                    {selectedApplication.interestRate}%
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant='subtitle2' color='text.secondary'>
                    {t('purpose')}
                  </Typography>
                  <Typography variant='body1' sx={{ mb: 2 }}>
                    {selectedApplication.loanPurpose}
                  </Typography>
                  
                  <Typography variant='subtitle2' color='text.secondary'>
                    {t('term')}
                  </Typography>
                  <Typography variant='body1' sx={{ mb: 2 }}>
                    {selectedApplication.term} {t('months')}
                  </Typography>
                  
                  <Typography variant='subtitle2' color='text.secondary'>
                    {t('assignedTo')}
                  </Typography>
                  <Typography variant='body1' sx={{ mb: 2 }}>
                    {selectedApplication.assignedTo}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant='h6' sx={{ mb: 2 }}>
                    {t('approvalProgress')}
                  </Typography>
                  <Stepper activeStep={selectedApplication.currentStep} alternativeLabel>
                    {approvalSteps.map((label, index) => (
                      <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant='h6' sx={{ mb: 2 }}>
                    {t('documents')}
                  </Typography>
                  <Box display='flex' gap={1} flexWrap='wrap'>
                    {selectedApplication.documents.map((doc: string, index: number) => (
                      <Chip key={index} label={doc} variant='outlined' />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>
                {tCommon('close')}
              </Button>
              {(selectedApplication.status === 'pending_review' || selectedApplication.status === 'pending_approval') && (
                <>
                  <Button color='error' variant='outlined'>
                    {t('reject')}
                  </Button>
                  <Button color='success' variant='contained'>
                    {t('approve')}
                  </Button>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Grid>
  )
}

export default ApprovalsPage