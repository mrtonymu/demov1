'use client'

// React Imports
import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

// Next Intl Imports
// import { useTranslations } from 'next-intl'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'

// import Divider from '@mui/material/Divider'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import Illustrations from '@components/Illustrations'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

// Utils Imports
import { createBrowserSupabaseClient } from '@/lib/supabase'

const Login = ({ mode }: { mode: Mode }) => {
  // Hooks
  // const t = useTranslations('auth.login')
  // 临时硬编码中文文本
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'title': '登录',
      'subtitle': '请登录您的账户',
      'email': '电邮',
      'password': '密码',
      'submit': '登录',
      'submitting': '登录中...',
      'rememberMe': '记住我',
      'forgotPassword': '忘记密码？',
      'toRegister': '没有账号？去注册'
    }

     return translations[key] || key
   }
  
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Vars
  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'

  // Hooks
  const router = useRouter()
  const searchParams = useSearchParams()
  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const supabase = createBrowserSupabaseClient()

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  // 检查用户是否已登录，如果已登录则重定向到dashboard
   useEffect(() => {
     const checkUser = async () => {
       const { data: { user } } = await supabase.auth.getUser()
       
       if (user) {
         router.replace('/')
       }
     }
     
     checkUser()
   }, [router, supabase])

  // 检查是否有验证成功的参数
   useEffect(() => {
     const verified = searchParams.get('verified')
     
     if (verified === '1') {
       setSuccessMessage('邮箱验证成功，现在可以登录了！')
     }
   }, [searchParams])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '登录失败')
      }

      // 登录成功，重定向到dashboard
      router.replace('/')
    } catch (error) {
      setError(error instanceof Error ? error.message : '登录失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] relative p-6'>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='p-6 sm:!p-12'>
          <Link href='/' className='flex justify-center items-center mbe-6'>
            <Logo />
          </Link>
          <div className='flex flex-col gap-5'>
            <div>
              <Typography variant='h4'>{t('title')}</Typography>
              <Typography className='mbs-1'>{t('subtitle')}</Typography>
              {error && (
                <Typography color='error' className='mbs-2'>
                  {error}
                </Typography>
              )}
              {successMessage && (
                <Typography color='success.main' className='mbs-2'>
                  {successMessage}
                </Typography>
              )}
            </div>
            <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-5'>
              <TextField 
                autoFocus 
                fullWidth 
                label={t('email')} 
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <TextField
                fullWidth
                label={t('password')}
                id='outlined-adornment-password'
                type={isPasswordShown ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        size='small'
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={e => e.preventDefault()}
                        disabled={isLoading}
                      >
                        <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
                <FormControlLabel control={<Checkbox />} label={t('rememberMe')} disabled={isLoading} />
                <Typography className='text-end' color='primary' component={Link} href='/forgot-password'>
                  {t('forgotPassword')}
                </Typography>
              </div>
              <Button fullWidth variant='contained' type='submit' disabled={isLoading || !email || !password}>
                {isLoading ? t('submitting') : t('submit')}
              </Button>
              <div className='flex justify-center items-center flex-wrap gap-2'>
                <Typography>{t('toRegister').split('？')[0]}？</Typography>
                <Typography component={Link} href='/register' color='primary'>
                  {t('toRegister').split('？')[1]}
                </Typography>
              </div>

            </form>
          </div>
        </CardContent>
      </Card>
      <Illustrations maskImg={{ src: authBackground }} />
    </div>
  )
}

export default Login
