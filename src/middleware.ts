import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // 支持的语言列表，只包含 zh-MY
  locales: ['zh-MY'],
  
  // 默认语言
  defaultLocale: 'zh-MY',
  
  // 禁用语言检测，强制使用 zh-MY
  localeDetection: false,
  
  // 始终显示语言前缀，确保正确的语言环境
  localePrefix: 'always'
});

export const config = {
  // 匹配所有路径，除了API路由、静态文件等
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};