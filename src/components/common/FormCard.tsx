'use client'

// React Imports
import type { ReactNode, FormEvent } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

// Next Intl Imports
import { useTranslations } from 'next-intl'

interface FormCardProps {
  title?: string
  subtitle?: string
  children: ReactNode
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void
  submitLabel?: string
  cancelLabel?: string
  onCancel?: () => void
  loading?: boolean
  disabled?: boolean
  showActions?: boolean
  additionalActions?: ReactNode
  error?: string
  success?: string
  variant?: 'outlined' | 'elevation'
  maxWidth?: number | string
}

const FormCard = ({
  title,
  subtitle,
  children,
  onSubmit,
  submitLabel,
  cancelLabel,
  onCancel,
  loading = false,
  disabled = false,
  showActions = true,
  additionalActions,
  error,
  success,
  variant = 'outlined',
  maxWidth
}: FormCardProps) => {
  // Hooks
  const tCommon = useTranslations('common')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!loading && !disabled) {
      onSubmit?.(event)
    }
  }

  return (
    <Box sx={{ maxWidth: maxWidth || '100%', mx: 'auto' }}>
      <Card variant={variant}>
        {/* 卡片头部 */}
        {(title || subtitle) && (
          <CardHeader
            title={title}
            subheader={subtitle}
            titleTypographyProps={{
              variant: 'h5',
              component: 'h2',
              fontWeight: 600
            }}
            subheaderTypographyProps={{
              variant: 'body2',
              color: 'text.secondary'
            }}
          />
        )}

        {/* 表单内容 */}
        <form onSubmit={handleSubmit}>
          <CardContent>
            {/* 错误提示 */}
            {error && (
              <Alert severity='error' sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* 成功提示 */}
            {success && (
              <Alert severity='success' sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            {/* 表单字段 */}
            {children}
          </CardContent>

          {/* 操作按钮 */}
          {showActions && (
            <>
              <Divider />
              <CardActions sx={{ p: 3, justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {/* 取消按钮 */}
                  {onCancel && (
                    <Button
                      variant='outlined'
                      onClick={onCancel}
                      disabled={loading}
                    >
                      {cancelLabel || tCommon('cancel')}
                    </Button>
                  )}
                  
                  {/* 额外操作按钮 */}
                  {additionalActions}
                </Box>

                {/* 提交按钮 */}
                <Button
                  type='submit'
                  variant='contained'
                  disabled={loading || disabled}
                  startIcon={
                    loading ? (
                      <CircularProgress size={16} color='inherit' />
                    ) : null
                  }
                >
                  {loading
                    ? tCommon('processing')
                    : submitLabel || tCommon('save')
                  }
                </Button>
              </CardActions>
            </>
          )}
        </form>
      </Card>
    </Box>
  )
}

export default FormCard