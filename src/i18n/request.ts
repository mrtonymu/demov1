import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // 强制使用 zh-MY 语言
  const locale = 'zh-MY';

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});