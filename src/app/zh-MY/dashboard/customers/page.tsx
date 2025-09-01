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
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState<{
    full_name: string
    phone: string
    ic_number: string
    email: string
    address: string
    status: 'normal' | 'settled' | 'negotiating' | 'bad_debt'
  }>({
    full_name: '',
    phone: '',
    ic_number: '',
    email: '',
    address: '',
    status: 'normal'
  })
  const [submitting, setSubmitting] = useState(false)

  const [stats, setStats] = useState({
    total: 0,
    normal: 0,
    newThisMonth: 0,
    badDebt: 0
  })

  // Fetch customers data with pagination and search
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const queryString = buildQueryParams({
        page: page.toString(),
        size: pageSize.toString(),
        q: searchTerm,
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
      const normal = result.data?.filter((c: Client) => c.status === 'normal').length || 0
      const badDebt = result.data?.filter((c: Client) => c.status === 'bad_debt').length || 0
      const thisMonth = new Date().getMonth()
      const thisYear = new Date().getFullYear()

      const newThisMonth = result.data?.filter((c: Client) => {
        const createdDate = new Date(c.created_at)
        return createdDate.getMonth() === thisMonth && createdDate.getFullYear() === thisYear
      }).length || 0

      setStats({ total: totalCount, normal, newThisMonth, badDebt })
    } catch (error) {
      console.error('Error fetching customers:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch customers')
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, searchTerm, statusFilter])

  // Setup realtime subscription
  useRealtime('clients', () => {
    fetchCustomers()
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

      const body = editingClient 
        ? { id: editingClient.id, ...formData }
        : formData

      const result = editingClient 
        ? await apiPut('/api/clients', body)
        : await apiPost('/api/clients', body)

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
        status: 'normal'
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
      const result = await apiDelete('/api/clients', { id: client.id })

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
  const handleStatusChange = async (client: Client, newStatus: 'normal' | 'settled' | 'negotiating' | 'bad_debt') => {
    try {
      const result = await apiPut('/api/clients', { id: client.id, status: newStatus })

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
      normal: { label: t('normal'), color: 'success' as const },
      settled: { label: t('settled'), color: 'info' as const },
      negotiating: { label: t('negotiating'), color: 'warning' as const },
      bad_debt: { label: t('badDebt'), color: 'error' as const }
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
  const columns = [
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
      align: 'center' as const,
      format: (value: any, row: Client) => (
        <div className='flex gap-2'>
          <IconButton size='small' onClick={() => handleEdit(row)}>
            <i className='ri-edit-line' />
          </IconButton>
          <IconButton size='small' onClick={() => handleDelete(row)} color='error'>
            <i className='ri-delete-bin-line' />
          </IconButton>
          <IconButton size='small' onClick={() => handleStatusChange(row, 'negotiating')}>
            <i className='ri-message-circle-line' />
          </IconButton>
        </div>
      )
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
        { value: 'pending', label: t('pending') },
        { value: 'inactive', label: t('inactive') }
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
            stats={loading ? '...' : stats.normal.toString()}
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
            stats={loading ? '...' : stats.badDebt.toString()}
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
             status: 'normal'
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
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'normal' | 'settled' | 'negotiating' | 'bad_debt' })}
              margin='normal'
            >
              <MenuItem value='normal'>{t('normal')}</MenuItem>
              <MenuItem value='settled'>{t('settled')}</MenuItem>
              <MenuItem value='negotiating'>{t('negotiating')}</MenuItem>
              <MenuItem value='bad_debt'>{t('badDebt')}</MenuItem>
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
                 status: 'normal'
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