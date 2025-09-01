'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import { useRouter, useSearchParams } from 'next/navigation'

// Next Intl Imports
import { useTranslations } from 'next-intl'

// Lib Imports
import { createBrowserSupabaseClient } from '@/lib/supabase'

interface AuthCallbackState {
  status: 'loading' | 'success' | 'error'
  message: string
  errorCode?: string
}

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('auth.callback')
  
  const [state, setState] = useState<AuthCallbackState>({
    status: 'loading',
    message: t('verifying')
  })

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = createBrowserSupabaseClient()

      try {
        // 检查 URL 参数中的 code（邮箱验证）
        const code = searchParams.get('code')
        const errorCode = searchParams.get('error_code')

        // 处理错误情况
        if (errorCode) {
          if (errorCode === 'otp_expired') {
            setState({
              status: 'error',
              message: t('linkExpired'),
              errorCode: 'otp_expired'
            })
          } else {
            setState({
              status: 'error',
              message: t('linkInvalid'),
              errorCode
            })
          }
          
          return
        }

        // 处理 code 参数（邮箱验证回调）
        
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          
          if (error) {
            setState({
              status: 'error',
              message: t('verificationFailed'),
              errorCode: error.message
            })
            
            return
          }
        } else {
          // 检查 hash 中的 access_token（社交登录回调）
          const hash = window.location.hash.substring(1)
          const params = new URLSearchParams(hash)
          const accessToken = params.get('access_token')
          const refreshToken = params.get('refresh_token')

          if (accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            })
            
            if (error) {
              setState({
                status: 'error',
                message: '登录失败，请重试。',
                errorCode: error.message
              })
              
              return
            }
          } else {
            setState({
              status: 'error',
              message: '无效的回调参数。'
            })
            
            return
          }
        }

        // 验证成功

        setState({
          status: 'success',
          message: '邮箱验证成功，正在完成登录…'
        })

        // 处理窗口关闭或重定向
        
        if (window.opener) {
          // 如果是弹窗打开的，发送消息给父窗口
          window.opener.postMessage({ type: 'auth:verified' }, '*')
          
          try {
            window.close()
          } catch {
            // 如果关闭失败，1.5秒后重定向
            setTimeout(() => {
              window.location.replace('/zh-MY/login?verified=1')
            }, 1500)
          }
        } else {
          // 1.5秒后重定向到登录页
          setTimeout(() => {
            router.replace('/zh-MY/login?verified=1')
          }, 1500)
        }
      } catch (error) {
        
        setState({
          status: 'error',
          message: '处理回调时发生错误。',
          errorCode: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    handleAuthCallback()
  }, [router, searchParams, t])

  const handleResendEmail = async () => {
    // 这里需要获取用户邮箱，可以从 localStorage 或其他地方获取
    const email = localStorage.getItem('pendingVerificationEmail')
    
    if (!email) {
      alert('无法获取邮箱地址，请返回注册页面重新操作。')
      
      return
    }

    const supabase = createBrowserSupabaseClient()
    const origin = window.location.origin
    const emailRedirectTo = `${origin}/auth/callback`

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo }
      })

      if (error) {
        alert('发送失败：' + error.message)
      } else {
        alert('验证邮件已重新发送，请检查您的邮箱。')
      }
    } catch (error) {
      alert('发送失败，请稍后重试。')
    }
  }

  const handleBackToLogin = () => {
    router.replace('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            邮箱验证
          </h2>
          
          {state.status === 'loading' && (
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-gray-600">{state.message}</p>
            </div>
          )}

          {state.status === 'success' && (
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-full h-8 w-8 bg-green-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-green-600">{state.message}</p>
            </div>
          )}

          {state.status === 'error' && (
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-full h-8 w-8 bg-red-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-red-600 mb-4">{state.message}</p>
              
              <div className="space-y-2">
                {state.errorCode === 'otp_expired' && (
                  <button
                    onClick={handleResendEmail}
                    className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
                  >
                    重新发送验证邮件
                  </button>
                )}
                <button
                  onClick={handleBackToLogin}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                >
                  返回登录
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}