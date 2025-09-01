'use client'

// React Imports
import { useEffect } from 'react'

// Next.js Imports
import { useRouter } from 'next/navigation'

/**
 * Dashboard重定向页面
 * 将 /dashboard 重定向到 /zh-MY/dashboard
 */
const DashboardRedirect = () => {
  const router = useRouter()

  useEffect(() => {
    // 重定向到带语言前缀的dashboard页面
    router.replace('/zh-MY/dashboard')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg">正在跳转到仪表板...</p>
      </div>
    </div>
  )
}

export default DashboardRedirect