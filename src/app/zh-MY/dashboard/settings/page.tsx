'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'

// Next Intl Imports
import { useTranslations } from 'next-intl'

// Utils Imports
import { apiGet, apiPut, apiPost } from '@/utils/api'
import type { SystemSettings } from '@/types/cr3dify'

const SettingsPage = () => {
  // Hooks
  const t = useTranslations('settings')
  const tCommon = useTranslations('common')
  
  // State
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  // 获取系统配置
  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await apiGet<SystemSettings>('/api/settings')
      
      if (response.ok && response.data) {
        setSettings(response.data)
      } else {
        setMessage({ type: 'error', text: response.error || '获取配置失败' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '获取配置失败' })
    } finally {
      setLoading(false)
    }
  }
  
  // 保存系统配置
  const handleSave = async () => {
    if (!settings) return
    
    try {
      setSaving(true)
      const response = await apiPut('/api/settings', settings)
      
      if (response.ok) {
        setMessage({ type: 'success', text: '配置已保存' })
      } else {
        setMessage({ type: 'error', text: response.error || '保存失败' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '保存失败' })
    } finally {
      setSaving(false)
    }
  }
  
  // 执行系统维护操作
  const handleSystemAction = async (action: string) => {
    try {
      setProcessing(action)
      const response = await apiPost('/api/settings/actions', { action })
      
      if (response.ok) {
        setMessage({ type: 'success', text: response.message || '操作完成' })
      } else {
        setMessage({ type: 'error', text: response.error || '操作失败' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '操作失败' })
    } finally {
      setProcessing(null)
    }
  }
  
  // 更新配置字段
  const updateSetting = (field: keyof SystemSettings, value: any) => {
    if (!settings) return
    setSettings({ ...settings, [field]: value })
  }
  
  // 初始化
  useEffect(() => {
    fetchSettings()
  }, [])
  
  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='400px'>
        <CircularProgress />
      </Box>
    )
  }
  
  if (!settings) {
    return (
      <Alert severity='error'>
        无法加载系统配置
      </Alert>
    )
  }

  return (
    <Grid container spacing={6}>
      {/* 系统设置 */}
      <Grid item xs={12}>
        <Typography variant='h4' sx={{ mb: 4 }}>
          {t('systemSettings')}
        </Typography>
      </Grid>

      {/* 公司信息 */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title={t('companyInformation')} />
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('companyName')}
                  value={settings.company_name}
                  onChange={(e) => updateSetting('company_name', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('companyAddress')}
                  multiline
                  rows={3}
                  value={settings.company_address}
                  onChange={(e) => updateSetting('company_address', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('phoneNumber')}
                  value={settings.phone_number}
                  onChange={(e) => updateSetting('phone_number', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('emailAddress')}
                  value={settings.email_address}
                  onChange={(e) => updateSetting('email_address', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('businessRegistration')}
                  value={settings.business_registration}
                  onChange={(e) => updateSetting('business_registration', e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* 贷款设置 */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title={t('loanSettings')} />
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('minimumLoanAmount')}
                  type='number'
                  value={settings.minimum_loan_amount}
                  onChange={(e) => updateSetting('minimum_loan_amount', Number(e.target.value))}
                  InputProps={{
                    startAdornment: 'RM '
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('maximumLoanAmount')}
                  type='number'
                  value={settings.maximum_loan_amount}
                  onChange={(e) => updateSetting('maximum_loan_amount', Number(e.target.value))}
                  InputProps={{
                    startAdornment: 'RM '
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('defaultInterestRate')}
                  type='number'
                  value={settings.default_interest_rate}
                  onChange={(e) => updateSetting('default_interest_rate', Number(e.target.value))}
                  InputProps={{
                    endAdornment: '%'
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('maximumLoanTerm')}
                  type='number'
                  value={settings.maximum_loan_term}
                  onChange={(e) => updateSetting('maximum_loan_term', Number(e.target.value))}
                  InputProps={{
                    endAdornment: t('months')
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('lateFeePercentage')}
                  type='number'
                  value={settings.late_fee_percentage}
                  onChange={(e) => updateSetting('late_fee_percentage', Number(e.target.value))}
                  InputProps={{
                    endAdornment: '%'
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* 通知设置 */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title={t('notificationSettings')} />
          <CardContent>
            <Box display='flex' flexDirection='column' gap={2}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={settings.email_notifications}
                    onChange={(e) => updateSetting('email_notifications', e.target.checked)}
                  />
                }
                label={t('emailNotifications')}
              />
              <FormControlLabel
                control={
                  <Switch 
                    checked={settings.sms_notifications}
                    onChange={(e) => updateSetting('sms_notifications', e.target.checked)}
                  />
                }
                label={t('smsNotifications')}
              />
              <FormControlLabel
                control={
                  <Switch 
                    checked={settings.payment_reminders}
                    onChange={(e) => updateSetting('payment_reminders', e.target.checked)}
                  />
                }
                label={t('paymentReminders')}
              />
              <FormControlLabel
                control={
                  <Switch 
                    checked={settings.overdue_alerts}
                    onChange={(e) => updateSetting('overdue_alerts', e.target.checked)}
                  />
                }
                label={t('overdueAlerts')}
              />
              <FormControlLabel
                control={
                  <Switch 
                    checked={settings.system_updates}
                    onChange={(e) => updateSetting('system_updates', e.target.checked)}
                  />
                }
                label={t('systemUpdates')}
              />
              <FormControlLabel
                control={
                  <Switch 
                    checked={settings.marketing_emails}
                    onChange={(e) => updateSetting('marketing_emails', e.target.checked)}
                  />
                }
                label={t('marketingEmails')}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* 安全设置 */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title={t('securitySettings')} />
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={settings.two_factor_auth}
                      onChange={(e) => updateSetting('two_factor_auth', e.target.checked)}
                    />
                  }
                  label={t('twoFactorAuth')}
                />
                <Typography variant='caption' display='block' color='text.secondary'>
                  {t('twoFactorAuthDescription')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={settings.session_timeout}
                      onChange={(e) => updateSetting('session_timeout', e.target.checked)}
                    />
                  }
                  label={t('sessionTimeout')}
                />
                <Typography variant='caption' display='block' color='text.secondary'>
                  {t('sessionTimeoutDescription')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('sessionTimeoutMinutes')}
                  type='number'
                  value={settings.session_timeout_minutes}
                  onChange={(e) => updateSetting('session_timeout_minutes', Number(e.target.value))}
                  InputProps={{
                    endAdornment: t('minutes')
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant='outlined' color='warning'>
                  {t('changePassword')}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* 系统维护 */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title={t('systemMaintenance')} />
          <CardContent>
            <Alert severity='info' sx={{ mb: 4 }}>
              {t('maintenanceWarning')}
            </Alert>
            
            {/* 写入保护状态提示 */}
            {!settings.write_enabled && (
              <Alert severity='warning' sx={{ mb: 4 }}>
                写入功能已禁用，当前为演示模式
              </Alert>
            )}
            
            {settings.demo_mode && (
              <Alert severity='info' sx={{ mb: 4 }}>
                当前运行在演示模式下
              </Alert>
            )}
            
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant='outlined'
                  startIcon={processing === 'backup_database' ? <CircularProgress size={16} /> : <i className='ri-database-2-line' />}
                  fullWidth
                  disabled={processing !== null}
                  onClick={() => handleSystemAction('backup_database')}
                >
                  {t('backupDatabase')}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant='outlined'
                  startIcon={processing === 'export_data' ? <CircularProgress size={16} /> : <i className='ri-download-line' />}
                  fullWidth
                  disabled={processing !== null}
                  onClick={() => handleSystemAction('export_data')}
                >
                  {t('exportData')}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant='outlined'
                  startIcon={processing === 'clear_cache' ? <CircularProgress size={16} /> : <i className='ri-refresh-line' />}
                  fullWidth
                  disabled={processing !== null}
                  onClick={() => handleSystemAction('clear_cache')}
                >
                  {t('clearCache')}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant='outlined'
                  color='error'
                  startIcon={processing === 'reset_system' ? <CircularProgress size={16} /> : <i className='ri-delete-bin-line' />}
                  fullWidth
                  disabled={processing !== null || !settings.demo_mode}
                  onClick={() => handleSystemAction('reset_system')}
                >
                  {t('resetSystem')}
                </Button>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Box display='flex' justifyContent='flex-end' gap={2}>
              <Button 
                variant='outlined'
                onClick={() => fetchSettings()}
                disabled={saving || processing !== null}
              >
                {tCommon('cancel')}
              </Button>
              <Button 
                variant='contained'
                onClick={handleSave}
                disabled={saving || processing !== null || !settings.write_enabled}
                startIcon={saving ? <CircularProgress size={16} /> : undefined}
              >
                {saving ? '保存中...' : tCommon('save')}
              </Button>
            </Box>
            
            {/* 消息提示 */}
            <Snackbar
              open={message !== null}
              autoHideDuration={6000}
              onClose={() => setMessage(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Alert 
                onClose={() => setMessage(null)} 
                severity={message?.type || 'info'}
                sx={{ width: '100%' }}
              >
                {message?.text}
              </Alert>
            </Snackbar>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default SettingsPage