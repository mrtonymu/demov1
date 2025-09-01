import { NextResponse } from 'next/server'

/**
 * 写入保护守卫函数
 * 检查 ENABLE_WRITE 环境变量，如果为 0 则返回 403 错误
 */
export function guardWrite() {
  const writeEnabled = process.env.ENABLE_WRITE === '1'
  
  if (!writeEnabled) {
    return NextResponse.json(
      {
        error: '写入功能已禁用，当前为演示模式',
        writeEnabled: false
      },
      { status: 403 }
    )
  }
  
  return null // 允许写入
}

/**
 * 检查写入权限状态
 */
export function isWriteEnabled(): boolean {
  return process.env.ENABLE_WRITE === '1'
}