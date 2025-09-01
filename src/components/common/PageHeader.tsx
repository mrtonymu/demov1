'use client'

// React Imports
import type { ReactNode } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'



interface BreadcrumbItem {
  label: string
  href?: string
  active?: boolean
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: ReactNode
  status?: {
    label: string
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
    variant?: 'filled' | 'outlined'
  }
  icon?: ReactNode
  showDivider?: boolean
}

const PageHeader = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  status,
  icon,
  showDivider = true
}: PageHeaderProps) => {
  return (
    <Box sx={{ mb: 4 }}>
      {/* 面包屑导航 */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs sx={{ mb: 2 }}>
          {breadcrumbs.map((item, index) => (
            item.href && !item.active ? (
              <Link
                key={index}
                href={item.href}
                color='primary.main'
                underline='hover'
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                {item.label}
              </Link>
            ) : (
              <Typography
                key={index}
                color={item.active ? 'text.primary' : 'text.secondary'}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                {item.label}
              </Typography>
            )
          ))}
        </Breadcrumbs>
      )}

      {/* 页面标题区域 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 2,
          pb: showDivider ? 3 : 0,
          borderBottom: showDivider ? '1px solid' : 'none',
          borderColor: 'divider'
        }}
      >
        {/* 左侧标题信息 */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction='row' alignItems='center' spacing={2} sx={{ mb: 1 }}>
            {/* 图标 */}
            {icon && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {icon}
              </Box>
            )}
            
            {/* 标题 */}
            <Typography
              variant='h4'
              component='h1'
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                wordBreak: 'break-word'
              }}
            >
              {title}
            </Typography>
            
            {/* 状态标签 */}
            {status && (
              <Chip
                label={status.label}
                color={status.color || 'default'}
                variant={status.variant || 'filled'}
                size='small'
              />
            )}
          </Stack>
          
          {/* 副标题 */}
          {subtitle && (
            <Typography
              variant='body1'
              color='text.secondary'
              sx={{ wordBreak: 'break-word' }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* 右侧操作按钮 */}
        {actions && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexShrink: 0
            }}
          >
            {actions}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default PageHeader