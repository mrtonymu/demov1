'use client'

// React Imports
import { useEffect, useState, useCallback } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

// Utils Imports
import { useFormatters } from '@/utils/formatters'
import { apiGet, buildQueryParams } from '@/utils/api'

// Component Imports
import CardStatVertical from '@components/card-statistics/Vertical'
import PageHeader from '@components/common/PageHeader'

// Types
import type { Client } from '@/types/cr3dify'

const BlacklistPage = () => {
  // Hooks
  const { formatCurrency, formatDate } = useFormatters()
  
  // States
  const [searchTerm, setSearchTerm] = useState('')
  const [blacklistData, setBlacklistData] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [total, setTotal] = useState(0)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  const [stats, setStats] = useState({
    totalBadDebt: 0,
    totalAmount: 0,
    recentlyAdded: 0,
    recoveryRate: 0
  })

  // Fetch blacklist data with pagination and search
  const fetchBlacklistData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const queryString = buildQueryParams({
        page: (page + 1).toString(),
        pageSize: rowsPerPage.toString(),
        q: searchTerm,
        status: 'bad_debt' // 只查询坏账客户
      })

      const result = await apiGet<{
        data: Client[]
        total: number
        page: number
        pageSize: number
      }>(`/api/clients?${queryString}`, {
        cache: 'no-store'
      })

      if (result.ok && result.data) {
        setBlacklistData(result.data.data || [])
        setTotal(result.data.total || 0)

        // 计算统计数据
        const badDebtClients = result.data.data || []
        setStats({
          totalBadDebt: badDebtClients.length,
          totalAmount: 0, // TODO: 从贷款数据计算
          recentlyAdded: badDebtClients.filter(client => {
            const createdDate = new Date(client.created_at)
            const thirtyDaysAgo = new Date()
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
            return createdDate > thirtyDaysAgo
          }).length,
          recoveryRate: 15.2 // TODO: 从实际数据计算
        })
      } else {
        throw new Error(result.error || 'Failed to fetch blacklist data')
      }

      setLoading(false)
    } catch (error) {
      console.error('Error fetching blacklist data:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
      setLoading(false)
    }
  }, [page, rowsPerPage, searchTerm])

  // Initial data fetch
  useEffect(() => {
    fetchBlacklistData()
  }, [fetchBlacklistData])

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setPage(0) // 重置到第一页
  }

  // 处理分页
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // 处理菜单
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, client: Client) => {
    setAnchorEl(event.currentTarget)
    setSelectedClient(client)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedClient(null)
  }

  // 处理导出
  const handleExport = () => {
    console.log('导出黑名单数据')
  }

  // 处理移除黑名单
  const handleRemoveFromBlacklist = () => {
    console.log('移除黑名单:', selectedClient)
    handleMenuClose()
  }

  if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity="error">获取黑名单数据失败：{error}</Alert>
        </Grid>
      </Grid>
    )
  }

  return (
    <>
      {/* 页面头部 */}
      <PageHeader
        title="客户黑名单"
        subtitle="管理坏账客户和风险客户"
        breadcrumbs={[
          { label: '仪表板', href: '/zh-MY/dashboard' },
          { label: '客户黑名单' }
        ]}
        actions={
          <Button
            variant='outlined'
            startIcon={<i className='ri-download-line' />}
            onClick={handleExport}
          >
            导出黑名单
          </Button>
        }
      />

      <Grid container spacing={6}>
        {/* 统计卡片 */}
        <Grid item xs={12} sm={6} md={3}>
          <CardStatVertical
            title="黑名单总数"
            stats={loading ? '...' : stats.totalBadDebt.toString()}
            avatarIcon='ri-user-forbid-line'
            avatarColor='error'
            subtitle="坏账客户总数"
            trendNumber='3%'
            trend='negative'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CardStatVertical
            title="涉及金额"
            stats={loading ? '...' : formatCurrency(stats.totalAmount)}
            avatarIcon='ri-money-dollar-circle-line'
            avatarColor='warning'
            subtitle="坏账总金额"
            trendNumber='5%'
            trend='negative'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CardStatVertical
            title="本月新增"
            stats={loading ? '...' : stats.recentlyAdded.toString()}
            avatarIcon='ri-user-unfollow-line'
            avatarColor='info'
            subtitle="新增黑名单客户"
            trendNumber='2'
            trend='negative'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CardStatVertical
            title="回收率"
            stats={loading ? '...' : `${stats.recoveryRate}%`}
            avatarIcon='ri-refresh-line'
            avatarColor='success'
            subtitle="坏账回收比例"
            trendNumber='1.2%'
            trend='positive'
          />
        </Grid>

        {/* 黑名单数据表格 */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="黑名单客户列表"
              action={
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    size='small'
                    placeholder="搜索客户..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className='ri-search-line' />
                        </InputAdornment>
                      )
                    }}
                    sx={{ width: 250 }}
                  />
                </Box>
              }
            />
            <CardContent sx={{ p: 0 }}>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <TableContainer component={Paper} elevation={0}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>客户信息</TableCell>
                          <TableCell>联系方式</TableCell>
                          <TableCell>身份证号</TableCell>
                          <TableCell>状态</TableCell>
                          <TableCell>加入时间</TableCell>
                          <TableCell align='center'>操作</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {blacklistData.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} align='center' sx={{ py: 8 }}>
                              <Typography variant='body2' color='text.secondary'>
                                暂无黑名单客户
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          blacklistData.map((client) => (
                            <TableRow key={client.id} hover>
                              <TableCell>
                                <Box>
                                  <Typography variant='body2' fontWeight={500}>
                                    {client.full_name}
                                  </Typography>
                                  <Typography variant='caption' color='text.secondary'>
                                    ID: {client.id.slice(0, 8)}...
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box>
                                  <Typography variant='body2'>{client.phone}</Typography>
                                  {client.email && (
                                    <Typography variant='caption' color='text.secondary'>
                                      {client.email}
                                    </Typography>
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography variant='body2' fontFamily='monospace'>
                                  {client.ic_number}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label="坏账"
                                  color='error'
                                  size='small'
                                  variant='outlined'
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant='body2'>
                                  {formatDate(client.created_at)}
                                </Typography>
                              </TableCell>
                              <TableCell align='center'>
                                <IconButton
                                  size='small'
                                  onClick={(e) => handleMenuClick(e, client)}
                                >
                                  <i className='ri-more-2-line' />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* 分页 */}
                  <TablePagination
                    component='div'
                    count={total}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    labelRowsPerPage="每页行数："
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} 共 ${count} 条`}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 操作菜单 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <i className='ri-eye-line' style={{ marginRight: 8 }} />
          查看详情
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <i className='ri-file-list-line' style={{ marginRight: 8 }} />
          查看贷款记录
        </MenuItem>
        <MenuItem onClick={handleRemoveFromBlacklist} sx={{ color: 'success.main' }}>
          <i className='ri-user-follow-line' style={{ marginRight: 8 }} />
          移出黑名单
        </MenuItem>
      </Menu>
    </>
  )
}

export default BlacklistPage