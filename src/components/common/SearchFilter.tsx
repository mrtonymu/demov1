'use client'

// React Imports
import { useState } from 'react'
import type { ReactNode } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Box from '@mui/material/Box'

// Next Intl Imports
import { useTranslations } from 'next-intl'

interface FilterOption {
  value: string
  label: string
}

interface Filter {
  id: string
  label: string
  type: 'select' | 'date' | 'text' | 'daterange'
  options?: FilterOption[]
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

interface SearchFilterProps {
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  filters?: Filter[]
  onExport?: () => void
  showExport?: boolean
  additionalActions?: ReactNode
  spacing?: number
}

const SearchFilter = ({
  searchPlaceholder,
  searchValue = '',
  onSearchChange,
  filters = [],
  onExport,
  showExport = true,
  additionalActions,
  spacing = 4
}: SearchFilterProps) => {
  // Hooks
  const tCommon = useTranslations('common')
  
  // States
  const [localSearchValue, setLocalSearchValue] = useState(searchValue)

  // Handlers
  const handleSearchChange = (value: string) => {
    setLocalSearchValue(value)
    onSearchChange?.(value)
  }

  const handleFilterChange = (filter: Filter, value: string) => {
    filter.onChange?.(value)
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={spacing}>
        {/* 搜索框 */}
        {searchPlaceholder && (
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder={searchPlaceholder}
              value={localSearchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
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
                value={filter.value || ''}
                onChange={(e) => handleFilterChange(filter, e.target.value)}
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
                value={filter.value || ''}
                onChange={(e) => handleFilterChange(filter, e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            ) : filter.type === 'daterange' ? (
              <TextField
                fullWidth
                type='date'
                label={filter.label}
                value={filter.value || ''}
                onChange={(e) => handleFilterChange(filter, e.target.value)}
                InputLabelProps={{ shrink: true }}
                helperText={tCommon('selectDateRange')}
              />
            ) : (
              <TextField
                fullWidth
                placeholder={filter.placeholder}
                value={filter.value || ''}
                onChange={(e) => handleFilterChange(filter, e.target.value)}
                label={filter.label}
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
        
        {/* 额外操作按钮 */}
        {additionalActions && (
          <Grid item xs={12} sm={6} md={4}>
            {additionalActions}
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default SearchFilter