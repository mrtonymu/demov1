'use client'

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

// Next Intl Imports
import { useTranslations } from 'next-intl'

const SettingsPage = () => {
  // Hooks
  const t = useTranslations('settings')
  const tCommon = useTranslations('common')

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
                  defaultValue='CR3DIFY'
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('companyAddress')}
                  multiline
                  rows={3}
                  defaultValue='Kuala Lumpur, Malaysia'
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('phoneNumber')}
                  defaultValue='+60 3-1234 5678'
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('emailAddress')}
                  defaultValue='info@cr3dify.com'
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('businessRegistration')}
                  defaultValue='123456789-A'
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
                  defaultValue='5000'
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
                  defaultValue='500000'
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
                  defaultValue='5.5'
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
                  defaultValue='60'
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
                  defaultValue='2.0'
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
                control={<Switch defaultChecked />}
                label={t('emailNotifications')}
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label={t('smsNotifications')}
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label={t('paymentReminders')}
              />
              <FormControlLabel
                control={<Switch />}
                label={t('overdueAlerts')}
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label={t('systemUpdates')}
              />
              <FormControlLabel
                control={<Switch />}
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
                  control={<Switch defaultChecked />}
                  label={t('twoFactorAuth')}
                />
                <Typography variant='caption' display='block' color='text.secondary'>
                  {t('twoFactorAuthDescription')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
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
                  defaultValue='30'
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
            
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant='outlined'
                  startIcon={<i className='ri-database-2-line' />}
                  fullWidth
                >
                  {t('backupDatabase')}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant='outlined'
                  startIcon={<i className='ri-download-line' />}
                  fullWidth
                >
                  {t('exportData')}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant='outlined'
                  startIcon={<i className='ri-refresh-line' />}
                  fullWidth
                >
                  {t('clearCache')}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant='outlined'
                  color='error'
                  startIcon={<i className='ri-delete-bin-line' />}
                  fullWidth
                >
                  {t('resetSystem')}
                </Button>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Box display='flex' justifyContent='flex-end' gap={2}>
              <Button variant='outlined'>
                {tCommon('cancel')}
              </Button>
              <Button variant='contained'>
                {tCommon('save')}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default SettingsPage