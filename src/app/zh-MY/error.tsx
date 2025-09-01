'use client'

// React Imports
import { useEffect } from 'react'

// Next.js Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

// Next Intl Imports
import { useTranslations } from 'next-intl'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  // Hooks
  const router = useRouter()
  const t = useTranslations('error')

  useEffect(() => {
    // 记录错误到控制台
    console.error('Application error:', error)
  }, [error])

  const handleGoHome = () => {
    router.push('/zh-MY/dashboard')
  }

  const handleRetry = () => {
    reset()
  }

  return (
    <Container maxWidth='md'>
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        minHeight='100vh'
        textAlign='center'
        py={4}
      >
        <Card sx={{ maxWidth: 600, width: '100%' }}>
          <CardContent sx={{ p: 6 }}>
            {/* 错误图标 */}
            <Box mb={4}>
              <i 
                className='ri-error-warning-line'
                style={{ 
                  fontSize: 120, 
                  color: 'var(--mui-palette-error-main)',
                  opacity: 0.7
                }} 
              />
            </Box>

            {/* 500标题 */}
            <Typography 
              variant='h1' 
              component='h1' 
              sx={{ 
                fontSize: { xs: '4rem', md: '6rem' },
                fontWeight: 'bold',
                color: 'error.main',
                mb: 2
              }}
            >
              500
            </Typography>

            {/* 错误信息 */}
            <Typography variant='h4' component='h2' gutterBottom>
              {t('title')}
            </Typography>
            
            <Typography 
              variant='body1' 
              color='text.secondary' 
              sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}
            >
              {t('description')}
            </Typography>

            {/* 错误详情 */}
            {process.env.NODE_ENV === 'development' && (
              <Box mb={4}>
                <Typography variant='h6' gutterBottom color='error.main'>
                  错误详情（开发模式）
                </Typography>
                <Box 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'grey.100', 
                    borderRadius: 1, 
                    textAlign: 'left',
                    maxHeight: 200,
                    overflow: 'auto'
                  }}
                >
                  <Typography variant='body2' component='pre' sx={{ fontSize: '0.75rem' }}>
                    {error.message}
                    {error.digest && `\n\nDigest: ${error.digest}`}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* 可能的解决方案 */}
            <Box mb={4}>
              <Typography variant='h6' gutterBottom>
                {t('possibleSolutions')}
              </Typography>
              <Box component='ul' sx={{ textAlign: 'left', maxWidth: 400, mx: 'auto' }}>
                <Typography component='li' variant='body2' color='text.secondary'>
                  刷新页面重试
                </Typography>
                <Typography component='li' variant='body2' color='text.secondary'>
                  检查网络连接
                </Typography>
                <Typography component='li' variant='body2' color='text.secondary'>
                  清除浏览器缓存
                </Typography>
                <Typography component='li' variant='body2' color='text.secondary'>
                  稍后再试
                </Typography>
              </Box>
            </Box>

            {/* 操作按钮 */}
            <Box 
              display='flex' 
              gap={2} 
              justifyContent='center'
              flexWrap='wrap'
            >
              <Button
                variant='contained'
                size='large'
                startIcon={<i className='ri-refresh-line' />}
                onClick={handleRetry}
                sx={{ minWidth: 140 }}
              >
                {t('retry')}
              </Button>
              
              <Button
                variant='outlined'
                size='large'
                startIcon={<i className='ri-home-line' />}
                onClick={handleGoHome}
                sx={{ minWidth: 140 }}
              >
                {t('goHome')}
              </Button>
            </Box>

            {/* 帮助信息 */}
            <Box mt={4}>
              <Typography variant='body2' color='text.secondary'>
                {t('helpText')}
              </Typography>
              <Typography variant='body2' color='primary.main' sx={{ mt: 1 }}>
                support@cr3dify.com
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}

export default ErrorPage