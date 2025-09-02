'use client'

import { useEffect } from 'react'

import { createBrowserSupabaseClient } from '@/lib/supabase'
import type { ChildrenType } from '@core/types'

type Props = ChildrenType

const AuthProvider = ({ children }: Props) => {
  useEffect(() => {
    const supabase = createBrowserSupabaseClient()
    
    // 监听认证状态变化，触发服务端 cookie 同步
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async () => {
      // 当认证状态发生变化时，调用刷新接口同步 cookie
      try {
        await fetch('/api/auth/refresh', { 
          method: 'POST', 
          credentials: 'include' 
        })
      } catch (error) {
        console.error('Failed to refresh auth state:', error)
      }
    })
    
    return () => subscription.unsubscribe()
  }, [])

  return <>{children}</>
}

export default AuthProvider