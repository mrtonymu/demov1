'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'

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
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

// Next Intl Imports
import { useTranslations } from 'next-intl'

// Utils
import { useFormatters } from '@/utils/formatters'
// API utilities (currently using mock data)

// Types
import type { LoanApplication } from '@/types/cr3dify'

// Components
import CardStatVertical from '@components/card-statistics/Vertical'
import { useLoansRealtime } from '@/hooks/useRealtime'

const ApprovalsPage = () => {
  // Hooks
  const t = useTranslations('approvals')
  const tCommon = useTranslations('common')
  const { formatCurrency, formatDate } = useFormatters()

  // State
  const [applications, setApplications] = useState<LoanApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [assignedFilter, setAssignedFilter] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch applications data
  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // 模拟API调用
      const mockData: LoanApplication[] = [
        {
           id: 'APP001',
           client_id: 'C001',
           client_name: '张三',
           client_email: 'zhang@example.com',
           loan_amount: 50000,
           loan_purpose: '个人消费',
           interest_rate: 12.5,
           term: 12,
           status: 'pending_review',
           submitted_at: '2024-01-15T10:00:00Z',
           current_step: 1,
           assigned_to: '审核员A',
           documents: ['身份证', '收入证明', '银行流水'],
           created_at: '2024-01-15T10:00:00Z'
         },
         {
           id: 'APP002',
           client_id: 'C002',
           client_name: '李四',
           client_email: 'li@example.com',
           loan_amount: 30000,
           loan_purpose: '生意周转',
           interest_rate: 15.0,
           term: 6,
           status: 'pending_approval',
           submitted_at: '2024-01-16T14:30:00Z',
           current_step: 2,
           assigned_to: '审核员B',
           documents: ['身份证', '营业执照'],
           created_at: '2024-01-16T14:30:00Z'
         },
         {
           id: 'APP003',
           client_id: 'C003',
           client_name: '王五',
           client_email: 'wang@example.com',
           loan_amount: 75000,
           loan_purpose: '房屋装修',
           interest_rate: 10.0,
           term: 24,
           status: 'approved',
           submitted_at: '2024-01-14T09:15:00Z',
           current_step: 4,
           assigned_to: '审核员C',
           documents: ['身份证', '房产证', '装修合同'],
           created_at: '2024-01-14T09:15:00Z'
         }
      ]
      
      setApplications(mockData)
    } catch (error) {
      console.error('Error fetching applications:', error)
      setError('获取数据失败')
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial data fetch
  useEffect(() => {
    fetchApplications()
  }, [])

  // Realtime updates
  useLoansRealtime({
    onUpdate: fetchApplications
  })



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

  // 计算统计数据
  const computedStats = useMemo(() => {
    const total = applications.length
    const pendingReview = applications.filter(app => app.status === 'pending_review').length
    const approved = applications.filter(app => app.status === 'approved').length
    const avgProcessingTime = 2.5 // 模拟平均处理时间（天）
    
    return { total, pendingReview, approved, avgProcessingTime }
  }, [applications])

  // 筛选申请数据
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
       const matchesSearch = !searchQuery || 
         app.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         app.id.toLowerCase().includes(searchQuery.toLowerCase())
       
       const matchesStatus = statusFilter === 'all' || app.status === statusFilter
       const matchesAssigned = assignedFilter === 'all' || app.assigned_to === assignedFilter
       
       return matchesSearch && matchesStatus && matchesAssigned
     })
  }, [applications, searchQuery, statusFilter, assignedFilter])

  // 处理审批操作
  const handleApprovalAction = async (applicationId: string, action: 'approve' | 'reject') => {
    try {
      setProcessing(true)
      setError(null)
      
      const newStatus = action === 'approve' ? 'approved' : 'rejected'
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 更新本地状态
       setApplications(prev => prev.map(app => 
         app.id === applicationId 
           ? { ...app, status: newStatus, current_step: action === 'approve' ? 4 : 0 }
           : app
       ))
      
      setDialogOpen(false)
      setSelectedApplication(null)
    } catch (error) {
      console.error('Approval action error:', error)
      setError('操作失败')
    } finally {
      setProcessing(false)
    }
  }

  // 处理查看申请
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
          stats={computedStats.total.toString()}
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
          stats={computedStats.pendingReview.toString()}
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
          stats={computedStats.approved.toString()}
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
          stats={computedStats.avgProcessingTime.toString()}
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
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
                  value={assignedFilter}
                  onChange={(e) => setAssignedFilter(e.target.value)}
                  SelectProps={{ native: true }}
                >
                  <option value=''>{tCommon('all')}</option>
                  <option value='系统管理员'>系统管理员</option>
                  <option value='李经理'>李经理</option>
                  <option value='王专员'>王专员</option>
                  <option value='张主管'>张主管</option>
                </TextField>
              </Grid>
            </Grid>

            {/* 错误提示 */}
            {error && (
              <Alert severity='error' sx={{ mb: 4 }}>
                {error}
              </Alert>
            )}

            {/* 加载状态 */}
            {loading && (
              <Box display='flex' justifyContent='center' sx={{ mb: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {/* 申请列表 */}
            <Grid container spacing={4}>
              {filteredApplications.map((application) => (
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
                              <Button 
                                size='small' 
                                variant='contained'
                                disabled={processing}
                              >
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
                  <Button 
                    color='error' 
                    variant='outlined'
                    disabled={processing}
                    onClick={() => handleApprovalAction(selectedApplication.id, 'reject')}
                  >
                    {processing ? <CircularProgress size={20} /> : t('reject')}
                  </Button>
                  <Button 
                    color='success' 
                    variant='contained'
                    disabled={processing}
                    onClick={() => handleApprovalAction(selectedApplication.id, 'approve')}
                  >
                    {processing ? <CircularProgress size={20} /> : t('approve')}
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