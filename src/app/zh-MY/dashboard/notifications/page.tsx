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
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import Divider from '@mui/material/Divider'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'

// Next Intl Imports
import { useTranslations } from 'next-intl'

// Utils Imports
import { useFormatters } from '@/utils/formatters'

// Component Imports
import CardStatVertical from '@components/card-statistics/Vertical'

const NotificationsPage = () => {
  // Hooks
  const t = useTranslations('notifications')
  const tCommon = useTranslations('common')
  const { formatDate } = useFormatters()

  // State
  const [filter, setFilter] = useState('all')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [pushNotifications, setPushNotifications] = useState(true)

  // 模拟通知数据
  const notificationData = [
    {
      id: 'NOT001',
      type: 'loan_approved',
      title: '贷款申请已批准',
      message: '客户张三的贷款申请（APP001）已获得批准，金额：¥150,000',
      timestamp: '2024-03-15T10:30:00',
      read: false,
      priority: 'high',
      category: 'approval'
    },
    {
      id: 'NOT002',
      type: 'payment_overdue',
      title: '逾期还款提醒',
      message: '客户李四的还款已逾期3天，请及时跟进处理',
      timestamp: '2024-03-15T09:15:00',
      read: false,
      priority: 'urgent',
      category: 'payment'
    },
    {
      id: 'NOT003',
      type: 'new_application',
      title: '新贷款申请',
      message: '收到新的贷款申请（APP005），申请人：王五，金额：¥80,000',
      timestamp: '2024-03-15T08:45:00',
      read: true,
      priority: 'medium',
      category: 'application'
    },
    {
      id: 'NOT004',
      type: 'system_maintenance',
      title: '系统维护通知',
      message: '系统将于今晚22:00-24:00进行维护，期间可能影响部分功能',
      timestamp: '2024-03-14T16:00:00',
      read: true,
      priority: 'low',
      category: 'system'
    },
    {
      id: 'NOT005',
      type: 'document_uploaded',
      title: '文档已上传',
      message: '客户赵六已上传补充材料，请及时审核',
      timestamp: '2024-03-14T14:20:00',
      read: false,
      priority: 'medium',
      category: 'document'
    }
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'loan_approved':
        return 'ri-check-line'
      case 'payment_overdue':
        return 'ri-alarm-warning-line'
      case 'new_application':
        return 'ri-file-add-line'
      case 'system_maintenance':
        return 'ri-settings-line'
      case 'document_uploaded':
        return 'ri-upload-line'
      default:
        return 'ri-notification-line'
    }
  }

  const getNotificationColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'error'
      case 'high':
        return 'warning'
      case 'medium':
        return 'info'
      case 'low':
        return 'default'
      default:
        return 'default'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return t('urgent')
      case 'high':
        return t('high')
      case 'medium':
        return t('medium')
      case 'low':
        return t('low')
      default:
        return priority
    }
  }

  const filteredNotifications = notificationData.filter(notification => {
    if (filter === 'all') {
      return true
    }

    if (filter === 'unread') {
      return !notification.read
    }

    if (filter === 'read') {
      return notification.read
    }

    return notification.category === filter
  })

  const unreadCount = notificationData.filter(n => !n.read).length

  const urgentCount = notificationData.filter(n => n.priority === 'urgent').length

  const todayCount = notificationData.filter(n => {
    const today = new Date().toDateString()

    return new Date(n.timestamp).toDateString() === today
  }).length

  const handleMarkAsRead = (id: string) => {
    // 实际应用中这里会调用API
    console.log('Mark as read:', id)
  }

  const handleMarkAllAsRead = () => {
    // 实际应用中这里会调用API
    console.log('Mark all as read')
  }

  return (
    <Grid container spacing={6}>
      {/* 统计卡片 */}
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('totalNotifications')}
          stats={notificationData.length.toString()}
          avatarIcon='ri-notification-line'
          avatarColor='primary'
          subtitle={t('allNotifications')}
          trendNumber='5%'
          trend='positive'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('unreadNotifications')}
          stats={unreadCount.toString()}
          avatarIcon='ri-notification-badge-line'
          avatarColor='warning'
          subtitle={t('needAttention')}
          trendNumber='12%'
          trend='negative'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('urgentNotifications')}
          stats={urgentCount.toString()}
          avatarIcon='ri-alarm-warning-line'
          avatarColor='error'
          subtitle={t('highPriority')}
          trendNumber='3%'
          trend='positive'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('todayNotifications')}
          stats={todayCount.toString()}
          avatarIcon='ri-calendar-line'
          avatarColor='info'
          subtitle={t('today')}
          trendNumber='8%'
          trend='positive'
        />
      </Grid>

      {/* 通知设置 */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title={t('notificationSettings')} />
          <CardContent>
            <Box display='flex' flexDirection='column' gap={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                  />
                }
                label={t('emailNotifications')}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={smsNotifications}
                    onChange={(e) => setSmsNotifications(e.target.checked)}
                  />
                }
                label={t('smsNotifications')}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={pushNotifications}
                    onChange={(e) => setPushNotifications(e.target.checked)}
                  />
                }
                label={t('pushNotifications')}
              />
            </Box>
            <Box mt={3}>
              <Button variant='contained' fullWidth>
                {tCommon('save')}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* 通知列表 */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardHeader
            title={t('notifications')}
            action={
              <Box display='flex' gap={2}>
                <Button
                  variant='outlined'
                  size='small'
                  onClick={handleMarkAllAsRead}
                >
                  {t('markAllAsRead')}
                </Button>
                <Button
                  variant='outlined'
                  startIcon={<i className='ri-filter-line' />}
                  size='small'
                >
                  {tCommon('filter')}
                </Button>
              </Box>
            }
          />
          <CardContent>
            {/* 筛选器 */}
            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  placeholder={t('searchNotifications')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className='ri-search-line' />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label={t('filter')}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  SelectProps={{ native: true }}
                >
                  <option value='all'>{tCommon('all')}</option>
                  <option value='unread'>{t('unread')}</option>
                  <option value='read'>{t('read')}</option>
                  <option value='approval'>{t('approval')}</option>
                  <option value='payment'>{t('payment')}</option>
                  <option value='application'>{t('application')}</option>
                  <option value='system'>{t('system')}</option>
                  <option value='document'>{t('document')}</option>
                </TextField>
              </Grid>
            </Grid>

            {/* 通知列表 */}
            <List>
              {filteredNotifications.map((notification, index) => (
                <Box key={notification.id}>
                  <ListItem
                    sx={{
                      backgroundColor: notification.read ? 'transparent' : 'action.hover',
                      borderRadius: 1,
                      mb: 1
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        variant='dot'
                        color={getNotificationColor(notification.priority) as any}
                        invisible={notification.read}
                      >
                        <Avatar
                          sx={{
                            backgroundColor: `${getNotificationColor(notification.priority)}.light`,
                            color: `${getNotificationColor(notification.priority)}.main`
                          }}
                        >
                          <i className={getNotificationIcon(notification.type)} />
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display='flex' alignItems='center' gap={1}>
                          <Typography
                            variant='subtitle2'
                            fontWeight={notification.read ? 400 : 600}
                          >
                            {notification.title}
                          </Typography>
                          <Chip
                            label={getPriorityText(notification.priority)}
                            size='small'
                            color={getNotificationColor(notification.priority) as any}
                            variant='outlined'
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography
                            variant='body2'
                            color='text.secondary'
                            sx={{ mb: 0.5 }}
                          >
                            {notification.message}
                          </Typography>
                          <Typography variant='caption' color='text.disabled'>
                            {formatDate(notification.timestamp)}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box display='flex' gap={1}>
                        {!notification.read && (
                          <IconButton
                            size='small'
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <i className='ri-check-line' />
                          </IconButton>
                        )}
                        <IconButton size='small'>
                          <i className='ri-more-2-line' />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < filteredNotifications.length - 1 && <Divider />}
                </Box>
              ))}
            </List>

            {filteredNotifications.length === 0 && (
              <Box textAlign='center' py={4}>
                <Typography variant='body2' color='text.secondary'>
                  {t('noNotifications')}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default NotificationsPage