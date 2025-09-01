import { redirect } from 'next/navigation'

const LoginRedirect = () => {
  redirect('/login?from=zh-MY')
}

export default LoginRedirect