'use client'

// React Imports
import { useState, useEffect, useCallback } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'

// Next Intl Imports
import { useTranslations } from 'next-intl'

// Component Imports
import CardStatVertical from '@components/card-statistics/Vertical'
import DataTable from '@components/common/DataTable'
import PageHeader from '@components/common/PageHeader'

// Utils Imports
import { useFormatters } from '@/utils/formatters'
import { apiGet, apiPost, apiPut, apiDelete, buildQueryParams } from '@/utils/api'

// Hooks Imports
import { useRealtime } from '@/hooks/useRealtime'

// Types
import type { Client } from '@/types/cr3dify'

const CustomersPage = () => {
  // Hooks
  const t = useTranslations('customers')
  const tCommon = useTranslations('common')
  const { } = useFormatters()
  
  // States
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [customerData, setCustomerData] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page] = useState(1)
  const [pageSize] = useState(10)
  const [, setTotal] = useState(0)

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState<{
    full_name: string
    phone: string
    ic_number: string
    email: string
    address: string
    status: 'active' | 'inactive' | 'suspended'
  }>({
    full_name: '',
    phone: '',
    ic_number: '',
    email: '',
    address: '',
    status: 'active'
  })

  const [submitting, setSubmitting] = useState(false)

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    newThisMonth: 0,
    suspended: 0
  })

  // Fetch customers data with pagination and search
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const queryString = buildQueryParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        query: searchTerm,
        status: statusFilter
      })

      const result = await apiGet(`/api/clients${queryString}`)
      
      if (!result.ok) {
        throw new Error(result.error || 'Failed to fetch clients')
      }

      setCustomerData(result.data || [])
      setTotal(result.total || 0)

      // Calculate stats
      const totalCount = result.total || 0
      const active = result.data?.filter((c: Client) => c.status === 'active').length || 0
      const suspended = result.data?.filter((c: Client) => c.status === 'suspended').length || 0
      const thisMonth = new Date().getMonth()
      const thisYear = new Date().getFullYear()

      const newThisMonth = result.data?.filter((c: Client) => {
        const createdDate = new Date(c.created_at)
        return createdDate.getMonth() === thisMonth && createdDate.getFullYear() === thisYear
      }).length || 0

      setStats({ total: totalCount, active, newThisMonth, suspended })
      } catch (error) {
        console.error('Error fetching customers:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch customers')
      } finally {
        setLoading(false)
      }
    }, [searchTerm, statusFilter])

  // Setup realtime subscription
  useRealtime({
    table: 'clients',
    onUpdate: () => fetchCustomers()
  })

  // Initial data fetch
  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.full_name || !formData.phone || !formData.ic_number) {
      setError('Please fill in all required fields')

      return
    }

    try {
      setSubmitting(true)
      setError(null)

      const result = editingClient 
        ? await apiPut(`/api/clients/${editingClient.id}`, formData)
        : await apiPost('/api/clients', formData)

      if (!result.ok) {
        throw new Error(result.error || 'Operation failed')
      }

      setDialogOpen(false)
      setEditingClient(null)
      setFormData({
        full_name: '',
        phone: '',
        ic_number: '',
        email: '',
        address: '',
        status: 'active'
      })
      fetchCustomers()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle delete
  const handleDelete = async (client: Client) => {
    if (!confirm('Are you sure you want to delete this client?')) {
      return
    }

    try {
      const result = await apiDelete(`/api/clients/${client.id}`)

      if (!result.ok) {
        throw new Error(result.error || 'Delete failed')
      }

      fetchCustomers()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Delete failed')
    }
  }

  // Handle edit
  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setFormData({
      full_name: client.full_name || '',
      phone: client.phone || '',
      ic_number: client.ic_number || '',
      email: client.email || '',
      address: client.address || '',
      status: client.status
    })
    setDialogOpen(true)
  }

  // Handle status change
  const handleStatusChange = async (client: Client, newStatus: 'active' | 'inactive' | 'suspended') => {
    try {
      const result = await apiPut(`/api/clients/${client.id}`, { status: newStatus })

      if (!result.ok) {
        throw new Error(result.error || 'Status update failed')
      }

      fetchCustomers()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Status update failed')
    }
  }

  // 状态渲染函数
  const renderStatus = (status: string) => {
    const statusConfig = {
      active: { label: t('active'), color: 'success' as const },
      inactive: { label: t('inactive'), color: 'default' as const },
      suspended: { label: t('suspended'), color: 'error' as const }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || 
      { label: status, color: 'default' as const }

    return (
      <Chip
        label={config.label}
        color={config.color}
        variant='filled'
        size='small'
      />
    )
  }

  // 表格列配置
  const columns: Array<{
    id: string
    label: string
    minWidth?: number
    align?: 'left' | 'center' | 'right'
    format?: (value: any, row?: Client) => React.ReactNode
  }> = [
    {
      id: 'full_name',
      label: t('name'),
      minWidth: 130
    },
    {
      id: 'email',
      label: t('email'),
      minWidth: 200
    },
    {
      id: 'phone',
      label: t('phone'),
      minWidth: 150
    },
    {
      id: 'status',
      label: t('status'),
      minWidth: 120,
      format: (value: string) => renderStatus(value)
    },
    {
      id: 'created_at',
      label: t('joinDate'),
      minWidth: 130,
      format: (value: string) => new Date(value).toLocaleDateString('zh-MY')
    },
    {
      id: 'actions',
      label: tCommon('actions'),
      minWidth: 120,
      align: 'center',
      format: (value: any, row?: Client) => row ? (
        <div className='flex gap-2'>
          <IconButton size='small' onClick={() => handleEdit(row)}>
            <i className='ri-edit-line' />
          </IconButton>
          <IconButton size='small' onClick={() => handleDelete(row)} color='error'>
            <i className='ri-delete-bin-line' />
          </IconButton>
          <IconButton size='small' onClick={() => handleStatusChange(row, 'suspended')}>
            <i className='ri-message-circle-line' />
          </IconButton>
        </div>
      ) : null
    }
  ]

  // 筛选器配置
  const filters = [
    {
      id: 'status',
      label: t('status'),
      type: 'select' as const,
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: 'active', label: t('active') },
        { value: 'inactive', label: t('inactive') },
        { value: 'suspended', label: t('suspended') }
      ]
    }
  ]

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  // 处理导出
  const handleExport = () => {
    console.log('导出客户数据')
  }

  // 过滤数据
  const filteredData = customerData.filter(customer => {
    const matchesSearch = !searchTerm || 
      customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm)
    
    const matchesStatus = !statusFilter || customer.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <>
      {/* 页面头部 */}
      <PageHeader
        title={t('customerManagement')}
        subtitle={t('customerManagementDesc')}
        breadcrumbs={[
          { label: tCommon('dashboard'), href: '/zh-MY/dashboard' },
          { label: t('customerManagement') }
        ]}
        actions={
          <Button
            variant='contained'
            startIcon={<i className='ri-add-line' />}
            onClick={() => setDialogOpen(true)}
          >
            {t('addCustomer')}
          </Button>
        }
      />

      <Grid container spacing={6}>
        {/* 统计卡片 */}
        <Grid item xs={12} sm={6} md={3}>
          <CardStatVertical
            title={t('totalCustomers')}
            stats={loading ? '...' : stats.total.toString()}
            avatarIcon='ri-group-line'
            avatarColor='primary'
            subtitle={t('allCustomers')}
            trendNumber='8%'
            trend='positive'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CardStatVertical
            title={t('normalCustomers')}
            stats={loading ? '...' : stats.active.toString()}
            avatarIcon='ri-user-line'
            avatarColor='success'
            subtitle={t('currentlyActive')}
            trendNumber='12%'
            trend='positive'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CardStatVertical
            title={t('newThisMonth')}
            stats={loading ? '...' : stats.newThisMonth.toString()}
            avatarIcon='ri-user-add-line'
            avatarColor='info'
            subtitle={t('monthlyGrowth')}
            trendNumber='15%'
            trend='positive'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CardStatVertical
            title={t('badDebtCustomers')}
            stats={loading ? '...' : stats.suspended.toString()}
            avatarIcon='ri-time-line'
            avatarColor='warning'
            subtitle={t('awaitingApproval')}
            trendNumber='5%'
            trend='negative'
          />
        </Grid>

        {/* 客户数据表格 */}
        <Grid item xs={12}>
          <DataTable
            title={t('customerList')}
            data={filteredData}
            columns={columns}
            onSearch={handleSearch}
            filters={filters}
            onExport={handleExport}
            searchPlaceholder={t('searchCustomers')}
            emptyMessage={t('noCustomersFound')}
            loading={loading}
          />
        
        {/* Add/Edit Client Dialog */}
         <Dialog open={dialogOpen} onClose={() => {
           setDialogOpen(false)
           setEditingClient(null)
           setError(null)
           setFormData({
             full_name: '',
             phone: '',
             ic_number: '',
             email: '',
             address: '',
             status: 'active'
           })
         }} maxWidth='sm' fullWidth>
          <DialogTitle>
            {editingClient ? t('editClient') : t('addClient')}
          </DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity='error' sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              fullWidth
              label={t('fullName')}
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              margin='normal'
              required
            />
            <TextField
              fullWidth
              label={t('phone')}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              margin='normal'
              required
            />
            <TextField
              fullWidth
              label={t('icNumber')}
              value={formData.ic_number}
              onChange={(e) => setFormData({ ...formData, ic_number: e.target.value })}
              margin='normal'
              required
            />
            <TextField
              fullWidth
              label={t('email')}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              margin='normal'
              type='email'
            />
            <TextField
              fullWidth
              label={t('address')}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              margin='normal'
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              select
              label={t('status')}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'suspended' })}
              margin='normal'
            >
              <MenuItem value='active'>{t('active')}</MenuItem>
              <MenuItem value='inactive'>{t('inactive')}</MenuItem>
              <MenuItem value='suspended'>{t('suspended')}</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
               setDialogOpen(false)
               setEditingClient(null)
               setError(null)
               setFormData({
                 full_name: '',
                 phone: '',
                 ic_number: '',
                 email: '',
                 address: '',
                 status: 'active'
               })
             }}>
               {tCommon('cancel')}
             </Button>
            <Button 
              onClick={handleSubmit} 
              variant='contained' 
              disabled={submitting}
            >
              {submitting ? <CircularProgress size={20} /> : (editingClient ? tCommon('update') : tCommon('create'))}
            </Button>
          </DialogActions>
        </Dialog>
        </Grid>
      </Grid>
    </>
  )
}

export default CustomersPage