import { redirect } from 'next/navigation'

export default function RootPage() {
  // 重定向到中文dashboard页面
  redirect('/zh-MY/dashboard')
}