'use client'

// React Imports
import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

// Next Intl Imports
import { useTranslations } from 'next-intl'

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
import Divider from '@mui/material/Divider'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import Illustrations from '@components/Illustrations'
import Logo from '@components/layout/shared/Logo'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

// Utils Imports
import { createBrowserSupabaseClient } from '@/lib/supabase'

const Register = ({ mode }: { mode: Mode }) => {
  // Hooks
  const t = useTranslations('auth.register')
  
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)

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

    if (!agreedToTerms) {
       setError('请同意隐私政策和条款')
       setIsLoading(false)
       
       return
     }

    try {
      // 保存邮箱到 localStorage，用于重新发送验证邮件
      localStorage.setItem('pendingVerificationEmail', email)

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, full_name: fullName })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '注册失败')
      }

      // 注册成功
      setSuccessMessage('验证邮件已发送，请前往邮箱完成验证。')
      
      // 清空表单
      setFullName('')
      setEmail('')
      setPassword('')
      setAgreedToTerms(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : '注册失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] relative p-6'>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='p-6 sm:!p-12'>
          <Link href='/' className='flex justify-center items-start mbe-6'>
            <Logo />
          </Link>
          <Typography variant='h4'>{t('title')}</Typography>
          <div className='flex flex-col gap-5'>
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
            <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-5'>
              <TextField 
                autoFocus 
                fullWidth 
                label={t('fullName')} 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isLoading}
              />
              <TextField 
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
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    disabled={isLoading}
                  />
                }
                label={
                  <>
                    <span>{t('agreeToTerms').split('隐私政策和条款')[0]}</span>
                    <Link className='text-primary' href='/' onClick={e => e.preventDefault()}>
                      {t('privacyPolicy')}
                    </Link>
                  </>
                }
              />
              <Button 
                fullWidth 
                variant='contained' 
                type='submit'
                disabled={isLoading || !fullName || !email || !password || !agreedToTerms}
              >
                {isLoading ? t('submitting') : t('submit')}
              </Button>
              <div className='flex justify-center items-center flex-wrap gap-2'>
                <Typography>{t('toLogin').split('？')[0]}？</Typography>
                <Typography component={Link} href='/login' color='primary'>
                  {t('toLogin').split('？')[1]}
                </Typography>
              </div>
              <Divider className='gap-3'>Or</Divider>
              <div className='flex justify-center items-center gap-2'>
                <IconButton size='small' className='text-facebook'>
                  <i className='ri-facebook-fill' />
                </IconButton>
                <IconButton size='small' className='text-twitter'>
                  <i className='ri-twitter-fill' />
                </IconButton>
                <IconButton size='small' className='text-github'>
                  <i className='ri-github-fill' />
                </IconButton>
                <IconButton size='small' className='text-googlePlus'>
                  <i className='ri-google-fill' />
                </IconButton>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
      <Illustrations maskImg={{ src: authBackground }} />
    </div>
  )
}

export default Register
