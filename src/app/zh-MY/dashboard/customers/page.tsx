'use client'

// React Imports
import { useState } from 'react'

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

const CustomersPage = () => {
  // Hooks
  const t = useTranslations('customers')
  const tCommon = useTranslations('common')
  const { formatCurrency } = useFormatters()
  
  // States
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // 模拟客户数据
  const customerData = [
    {
      id: 1,
      name: '张三',
      email: 'zhangsan@example.com',
      phone: '+60123456789',
      status: 'active',
      joinDate: '2024-01-15',
      totalLoans: 2,
      totalAmount: 150000
    },
    {
      id: 2,
      name: '李四',
      email: 'lisi@example.com',
      phone: '+60198765432',
      status: 'pending',
      joinDate: '2024-02-20',
      totalLoans: 1,
      totalAmount: 80000
    },
    {
      id: 3,
      name: '王五',
      email: 'wangwu@example.com',
      phone: '+60187654321',
      status: 'inactive',
      joinDate: '2023-12-10',
      totalLoans: 0,
      totalAmount: 0
    }
  ]

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
      id: 'name',
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
      id: 'joinDate',
      label: t('joinDate'),
      minWidth: 130
    },
    {
      id: 'totalLoans',
      label: t('totalLoans'),
      minWidth: 120,
      align: 'center' as const
    },
    {
      id: 'totalAmount',
      label: t('totalAmount'),
      minWidth: 150,
      align: 'right' as const,
      format: (value: number) => formatCurrency(value)
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
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    
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
            stats='1,234'
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
            stats='987'
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
            stats='45'
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
            stats='12'
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