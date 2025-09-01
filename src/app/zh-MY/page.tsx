import { redirect } from 'next/navigation'

export default function LocaleRootPage() {
  // 重定向到dashboard页面
  redirect('/dashboard')
}