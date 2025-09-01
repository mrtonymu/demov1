'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'

// Next Intl Imports
import { useTranslations } from 'next-intl'

// Component Imports
import CardStatVertical from '@components/card-statistics/Vertical'
import DataTable from '@components/common/DataTable'
import PageHeader from '@components/common/PageHeader'

// Utils Imports
import { useFormatters } from '@/utils/formatters'

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

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    newThisMonth: 0,
    pending: 0
  })

  // Fetch customers data
  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/clients')

      if (!response.ok) {
        throw new Error('Failed to fetch clients')
      }

      const data = await response.json()

      setCustomerData(data)

      // Calculate stats
      const total = data.length
      const active = data.filter((c: Client) => c.status === 'active').length
      const pending = data.filter((c: Client) => c.status === 'pending').length
      const thisMonth = new Date().getMonth()
      const thisYear = new Date().getFullYear()

      const newThisMonth = data.filter((c: Client) => {
        const createdDate = new Date(c.created_at)

        return createdDate.getMonth() === thisMonth && createdDate.getFullYear() === thisYear
      }).length

      setStats({ total, active, newThisMonth, pending })
      setLoading(false)
    } catch (error) {
      console.error('Error fetching customers:', error)
      setLoading(false)

      return
    }
  }

  // Setup realtime subscription
  useRealtime({
    tables: ['clients'],
    onUpdate: () => {
      fetchCustomers()
    }
  })

  // Initial data fetch
  useEffect(() => {
    fetchCustomers()
  }, [])

  // 状态渲染函数
  const renderStatus = (status: string) => {
    const statusConfig = {
      active: { label: t('active'), color: 'success' as const },
      pending: { label: t('pending'), color: 'warning' as const },
      inactive: { label: t('inactive'), color: 'default' as const }
    }

    const config = statusConfig[status as keyof typeof statusConfig]


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
      format: () => (
        <Button
          variant='outlined'
          size='small'
          startIcon={<i className='ri-edit-line' />}
        >
          {tCommon('edit')}
        </Button>
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
            onClick={() => console.log('添加客户')}
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
            title={t('activeCustomers')}
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
            title={t('pendingApproval')}
            stats={loading ? '...' : stats.pending.toString()}
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
        </Grid>
      </Grid>
    </>
  )
}

export default CustomersPage