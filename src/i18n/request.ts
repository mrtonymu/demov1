import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // 强制使用 zh-MY 语言
  const locale = 'zh-MY';
  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
    onError: (error) => {
      // 记录，但不要中断渲染
      console.warn('[i18n]', error);
    },
    getMessageFallback: ({ key }) => key // 缺失时显示 key，避免报错
  };
});