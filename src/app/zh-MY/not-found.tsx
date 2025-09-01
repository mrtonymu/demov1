'use client'

// React Imports
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

// 使用Remix Icon图标系统

const NotFoundPage = () => {
  // Hooks
  const router = useRouter()
  const t = useTranslations('notFound')

  const handleGoHome = () => {
    router.push('/zh-MY/dashboard')
  }

  const handleGoBack = () => {
    router.back()
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
            {/* 404图标 */}
            <Box mb={4}>
              <i 
                className='ri-search-off-line'
                style={{ 
                  fontSize: 120, 
                  color: 'var(--mui-palette-primary-main)',
                  opacity: 0.7
                }} 
              />
            </Box>

            {/* 404标题 */}
            <Typography 
              variant='h1' 
              component='h1' 
              sx={{ 
                fontSize: { xs: '4rem', md: '6rem' },
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 2
              }}
            >
              404
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

            {/* 可能的原因 */}
            <Box mb={4}>
              <Typography variant='h6' gutterBottom>
                {t('possibleReasons')}
              </Typography>
              <Box component='ul' sx={{ textAlign: 'left', maxWidth: 400, mx: 'auto' }}>
                <Typography component='li' variant='body2' color='text.secondary'>
                  页面链接已过期或被移除
                </Typography>
                <Typography component='li' variant='body2' color='text.secondary'>
                  您输入的网址有误
                </Typography>
                <Typography component='li' variant='body2' color='text.secondary'>
                  您没有访问此页面的权限
                </Typography>
                <Typography component='li' variant='body2' color='text.secondary'>
                  服务器临时维护中
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
                startIcon={<i className='ri-home-line' />}
                onClick={handleGoHome}
                sx={{ minWidth: 140 }}
              >
                {t('goHome')}
              </Button>
              
              <Button
                variant='outlined'
                size='large'
                startIcon={<i className='ri-arrow-left-line' />}
                onClick={handleGoBack}
                sx={{ minWidth: 140 }}
              >
                {t('goBack')}
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

export default NotFoundPage