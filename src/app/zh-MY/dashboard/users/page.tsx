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
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

// Next Intl Imports
import { useTranslations } from 'next-intl'

// Utils Imports
import { useFormatters } from '@/utils/formatters'

// Component Imports
import CardStatVertical from '@components/card-statistics/Vertical'

const UsersPage = () => {
  // Hooks
  const t = useTranslations('users')
  const tCommon = useTranslations('common')
  const { formatDate } = useFormatters()

  // State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // 模拟用户数据
  const userData = [
    {
      id: 'USR001',
      name: '管理员',
      email: 'admin@cr3dify.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-03-15T10:30:00',
      createdAt: '2024-01-01T00:00:00',
      avatar: null
    },
    {
      id: 'USR002',
      name: '李经理',
      email: 'manager@cr3dify.com',
      role: 'manager',
      status: 'active',
      lastLogin: '2024-03-14T16:45:00',
      createdAt: '2024-01-15T00:00:00',
      avatar: null
    },
    {
      id: 'USR003',
      name: '王专员',
      email: 'officer@cr3dify.com',
      role: 'officer',
      status: 'inactive',
      lastLogin: '2024-03-10T09:15:00',
      createdAt: '2024-02-01T00:00:00',
      avatar: null
    },
    {
      id: 'USR004',
      name: '张助理',
      email: 'assistant@cr3dify.com',
      role: 'assistant',
      status: 'pending',
      lastLogin: null,
      createdAt: '2024-03-01T00:00:00',
      avatar: null
    }
  ]

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return t('admin')
      case 'manager':
        return t('manager')
      case 'officer':
        return t('officer')
      case 'assistant':
        return t('assistant')
      default:
        return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error'
      case 'manager':
        return 'primary'
      case 'officer':
        return 'success'
      case 'assistant':
        return 'secondary'
      default:
        return 'default'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'inactive':
        return 'default'
      case 'pending':
        return 'warning'
      case 'suspended':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return t('active')
      case 'inactive':
        return t('inactive')
      case 'pending':
        return t('pending')
      case 'suspended':
        return t('suspended')
      default:
        return status
    }
  }

  return (
    <Grid container spacing={6}>
      {/* 统计卡片 */}
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('totalUsers')}
          stats='24'
          avatarIcon='ri-user-line'
          avatarColor='primary'
          subtitle={t('systemUsers')}
          trendNumber='8%'
          trend='positive'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('activeUsers')}
          stats='18'
          avatarIcon='ri-user-check-line'
          avatarColor='success'
          subtitle={t('currentlyActive')}
          trendNumber='12%'
          trend='positive'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('pendingUsers')}
          stats='3'
          avatarIcon='ri-user-add-line'
          avatarColor='warning'
          subtitle={t('awaitingApproval')}
          trendNumber='2'
          trend='positive'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          title={t('adminUsers')}
          stats='3'
          avatarIcon='ri-admin-line'
          avatarColor='error'
          subtitle={t('systemAdmins')}
          trendNumber='0'
        />
      </Grid>

      {/* 用户管理表格 */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={t('userManagement')}
            action={
              <Button
                variant='contained'
                startIcon={<i className='ri-user-add-line' />}
              >
                {t('addUser')}
              </Button>
            }
          />
          <CardContent>
            {/* 搜索和筛选 */}
            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  placeholder={t('searchUsers')}
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
                  label={t('role')}
                  SelectProps={{ native: true }}
                >
                  <option value=''>{tCommon('all')}</option>
                  <option value='admin'>{t('admin')}</option>
                  <option value='manager'>{t('manager')}</option>
                  <option value='officer'>{t('officer')}</option>
                  <option value='assistant'>{t('assistant')}</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  select
                  label={t('status')}
                  SelectProps={{ native: true }}
                >
                  <option value=''>{tCommon('all')}</option>
                  <option value='active'>{t('active')}</option>
                  <option value='inactive'>{t('inactive')}</option>
                  <option value='pending'>{t('pending')}</option>
                  <option value='suspended'>{t('suspended')}</option>
                </TextField>
              </Grid>
            </Grid>

            {/* 用户表格 */}
            <TableContainer component={Paper} variant='outlined'>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('user')}</TableCell>
                    <TableCell>{t('email')}</TableCell>
                    <TableCell>{t('role')}</TableCell>
                    <TableCell>{t('status')}</TableCell>
                    <TableCell>{t('lastLogin')}</TableCell>
                    <TableCell>{t('createdAt')}</TableCell>
                    <TableCell align='center'>{tCommon('actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userData.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box display='flex' alignItems='center' gap={2}>
                          <Avatar sx={{ width: 40, height: 40 }}>
                            {user.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant='body2' fontWeight={500}>
                              {user.name}
                            </Typography>
                            <Typography variant='caption' color='text.secondary'>
                              {user.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2'>
                          {user.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getRoleText(user.role)}
                          color={getRoleColor(user.role) as any}
                          size='small'
                          variant='outlined'
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(user.status)}
                          color={getStatusColor(user.status) as any}
                          size='small'
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2'>
                          {user.lastLogin ? formatDate(user.lastLogin) : t('neverLoggedIn')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2'>
                          {formatDate(user.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell align='center'>
                        <IconButton
                          size='small'
                          onClick={handleMenuClick}
                        >
                          <i className='ri-more-2-line' />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* 操作菜单 */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>
                <i className='ri-eye-line' style={{ marginRight: 8 }} />
                {tCommon('view')}
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <i className='ri-edit-line' style={{ marginRight: 8 }} />
                {tCommon('edit')}
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <i className='ri-key-line' style={{ marginRight: 8 }} />
                {t('resetPassword')}
              </MenuItem>
              <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
                <i className='ri-delete-bin-line' style={{ marginRight: 8 }} />
                {tCommon('delete')}
              </MenuItem>
            </Menu>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default UsersPage