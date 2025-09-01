import { NextResponse } from 'next/server'

// 禁用缓存，确保动态渲染
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const writeEnabled = process.env.ENABLE_WRITE === '1'

    return NextResponse.json({
      status: 'ok',
      writeEnabled
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
