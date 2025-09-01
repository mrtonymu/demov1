'use client'

// React Imports
import { useState } from 'react'
import type { ReactNode } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// Next Intl Imports
import { useTranslations } from 'next-intl'

interface Column {
  id: string
  label: string
  align?: 'left' | 'center' | 'right'
  minWidth?: number
  format?: (value: any) => string | ReactNode
}

interface FilterOption {
  value: string
  label: string
}

interface Filter {
  id: string
  label: string
  type: 'select' | 'date' | 'text'
  options?: FilterOption[]
  placeholder?: string
}

interface DataTableProps {
  title: string
  data: any[]
  columns: Column[]
  filters?: Filter[]
  searchPlaceholder?: string
  onSearch?: (searchTerm: string) => void
  onFilter?: (filterId: string, value: string) => void
  onExport?: () => void
  showExport?: boolean
  actionButton?: ReactNode
  emptyMessage?: string
  loading?: boolean
}

const DataTable = ({
  title,
  data,
  columns,
  filters = [],
  searchPlaceholder,
  onSearch,
  onFilter,
  onExport,
  showExport = true,
  actionButton,
  emptyMessage,
  loading = false
}: DataTableProps) => {
  // Hooks
  const tCommon = useTranslations('common')
  
  // States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})

  // Handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setPage(0)
    onSearch?.(value)
  }

  const handleFilter = (filterId: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [filterId]: value }))
    setPage(0)
    onFilter?.(filterId, value)
  }

  // Calculate pagination
  const startIndex = page * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const paginatedData = data.slice(startIndex, endIndex)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={title}
            action={actionButton}
          />
          <CardContent>
            {/* 搜索和筛选区域 */}
            <Grid container spacing={4} sx={{ mb: 4 }}>
              {/* 搜索框 */}
              {searchPlaceholder && (
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className='ri-search-line' />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              )}
              
              {/* 筛选器 */}
              {filters.map((filter) => (
                <Grid item xs={12} sm={6} md={4} key={filter.id}>
                  {filter.type === 'select' ? (
                    <TextField
                      fullWidth
                      select
                      label={filter.label}
                      value={filterValues[filter.id] || ''}
                      onChange={(e) => handleFilter(filter.id, e.target.value)}
                      SelectProps={{ native: true }}
                    >
                      <option value=''>{tCommon('all')}</option>
                      {filter.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                  ) : filter.type === 'date' ? (
                    <TextField
                      fullWidth
                      type='date'
                      label={filter.label}
                      value={filterValues[filter.id] || ''}
                      onChange={(e) => handleFilter(filter.id, e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  ) : (
                    <TextField
                      fullWidth
                      placeholder={filter.placeholder}
                      value={filterValues[filter.id] || ''}
                      onChange={(e) => handleFilter(filter.id, e.target.value)}
                    />
                  )}
                </Grid>
              ))}
              
              {/* 导出按钮 */}
              {showExport && onExport && (
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    variant='outlined'
                    startIcon={<i className='ri-download-line' />}
                    onClick={onExport}
                    fullWidth
                  >
                    {tCommon('export')}
                  </Button>
                </Grid>
              )}
            </Grid>

            {/* 数据表格 */}
            <TableContainer component={Paper} variant='outlined'>
              <Table>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align || 'left'}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} align='center'>
                        <Typography variant='body2' color='textSecondary'>
                          {tCommon('loading')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} align='center'>
                        <Box py={4}>
                          <i className='ri-inbox-line' style={{ fontSize: '3rem', color: '#ccc' }} />
                          <Typography variant='h6' color='textSecondary' sx={{ mt: 2 }}>
                            {emptyMessage || tCommon('noData')}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((row, index) => (
                      <TableRow key={index} hover>
                        {columns.map((column) => (
                          <TableCell key={column.id} align={column.align || 'left'}>
                            {column.format ? column.format(row[column.id]) : row[column.id]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* 分页 */}
            {data.length > 0 && (
              <TablePagination
                component='div'
                count={data.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage={tCommon('rowsPerPage')}
                labelDisplayedRows={({ from, to, count }) => 
                  `${from}-${to} ${tCommon('of')} ${count !== -1 ? count : `${tCommon('moreThan')} ${to}`}`
                }
              />
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default DataTable