// Next Intl Imports
import { useLocale } from 'next-intl'

// 货币格式化
export const formatCurrency = (amount: number, locale: string = 'zh-MY'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'MYR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

// 数字格式化
export const formatNumber = (number: number, locale: string = 'zh-MY'): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(number)
}

// 百分比格式化
export const formatPercentage = (number: number, locale: string = 'zh-MY'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
  }).format(number / 100)
}

// 日期格式化
export const formatDate = (date: Date | string, locale: string = 'zh-MY'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj)
}

// 日期时间格式化
export const formatDateTime = (date: Date | string, locale: string = 'zh-MY'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj)
}

// 时间格式化
export const formatTime = (date: Date | string, locale: string = 'zh-MY'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj)
}

// 相对时间格式化（如：2天前）
export const formatRelativeTime = (date: Date | string, locale: string = 'zh-MY'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
  
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  
  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second')
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute')
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour')
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day')
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month')
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year')
  }
}

// Hook for using formatters with current locale
export const useFormatters = () => {
  const locale = useLocale()
  
  return {
    formatCurrency: (amount: number) => formatCurrency(amount, locale),
    formatNumber: (number: number) => formatNumber(number, locale),
    formatPercentage: (number: number) => formatPercentage(number, locale),
    formatDate: (date: Date | string) => formatDate(date, locale),
    formatDateTime: (date: Date | string) => formatDateTime(date, locale),
    formatTime: (date: Date | string) => formatTime(date, locale),
    formatRelativeTime: (date: Date | string) => formatRelativeTime(date, locale)
  }
}