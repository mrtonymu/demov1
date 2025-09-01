import { NextResponse } from 'next/server'

// 演示模式配置
interface DemoConfig {
  enabled: boolean
  maxClientsPerTenant: number
  maxLoansPerTenant: number
  maxRepaymentsPerDay: number
  allowedOperations: string[]
  timeWindow: {
    start: string // HH:mm 格式
    end: string   // HH:mm 格式
  }
  message: string
}

// 默认演示配置
const DEFAULT_DEMO_CONFIG: DemoConfig = {
  enabled: process.env.DEMO_MODE === 'true',
  maxClientsPerTenant: 50,
  maxLoansPerTenant: 100,
  maxRepaymentsPerDay: 20,
  allowedOperations: ['GET', 'POST'], // 允许的 HTTP 方法
  timeWindow: {
    start: '09:00',
    end: '18:00'
  },
  message: '演示模式下，部分功能受到限制以保护数据安全。'
}

// 获取演示配置
function getDemoConfig(): DemoConfig {
  return {
    ...DEFAULT_DEMO_CONFIG,
    enabled: process.env.DEMO_MODE === 'true',
    maxClientsPerTenant: parseInt(process.env.DEMO_MAX_CLIENTS || '50'),
    maxLoansPerTenant: parseInt(process.env.DEMO_MAX_LOANS || '100'),
    maxRepaymentsPerDay: parseInt(process.env.DEMO_MAX_REPAYMENTS_PER_DAY || '20'),
    message: process.env.DEMO_MESSAGE || DEFAULT_DEMO_CONFIG.message
  }
}

// 检查时间窗口
function isWithinTimeWindow(config: DemoConfig): boolean {
  if (!config.enabled) return true

  const now = new Date()
  const currentTime = now.toTimeString().slice(0, 5) // HH:mm 格式
  
  return currentTime >= config.timeWindow.start && currentTime <= config.timeWindow.end
}

// 检查操作是否被允许
function isOperationAllowed(method: string, config: DemoConfig): boolean {
  if (!config.enabled) return true

  return config.allowedOperations.includes(method)
}

// 演示模式保护中间件
export function demoProtection(method: string = 'POST') {
  const config = getDemoConfig()

  if (!config.enabled) {
    return null // 演示模式未启用
  }

  // 检查操作是否被允许
  if (!isOperationAllowed(method, config)) {
    return NextResponse.json(
      {
        error: 'Operation not allowed in demo mode',
        message: `${method} operations are restricted in demo mode`,
        demoMode: true
      },
      { status: 403 }
    )
  }

  // 检查时间窗口
  if (!isWithinTimeWindow(config)) {
    return NextResponse.json(
      {
        error: 'Outside allowed time window',
        message: `Demo operations are only allowed between ${config.timeWindow.start} and ${config.timeWindow.end}`,
        demoMode: true
      },
      { status: 403 }
    )
  }

  return null // 通过检查
}

// 检查资源限制
export async function checkResourceLimits(
  supabase: any,
  tenantId: string,
  resourceType: 'clients' | 'loans' | 'repayments'
): Promise<NextResponse | null> {
  const config = getDemoConfig()

  if (!config.enabled) {
    return null // 演示模式未启用
  }

  try {
    switch (resourceType) {
      case 'clients': {
        const { count } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', tenantId)

        if (count && count >= config.maxClientsPerTenant) {
          return NextResponse.json(
            {
              error: 'Resource limit exceeded',
              message: `Demo mode allows maximum ${config.maxClientsPerTenant} clients per tenant`,
              demoMode: true,
              limit: config.maxClientsPerTenant,
              current: count
            },
            { status: 403 }
          )
        }

        break
      }

      case 'loans': {
        const { count } = await supabase
          .from('loans')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', tenantId)

        if (count && count >= config.maxLoansPerTenant) {
          return NextResponse.json(
            {
              error: 'Resource limit exceeded',
              message: `Demo mode allows maximum ${config.maxLoansPerTenant} loans per tenant`,
              demoMode: true,
              limit: config.maxLoansPerTenant,
              current: count
            },
            { status: 403 }
          )
        }

        break
      }

      case 'repayments': {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)


        const { count } = await supabase
          .from('repayment_txns')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', tenantId)
          .gte('created_at', today.toISOString())
          .lt('created_at', tomorrow.toISOString())

        if (count && count >= config.maxRepaymentsPerDay) {
          return NextResponse.json(
            {
              error: 'Daily limit exceeded',
              message: `Demo mode allows maximum ${config.maxRepaymentsPerDay} repayments per day`,
              demoMode: true,
              limit: config.maxRepaymentsPerDay,
              current: count
            },
            { status: 403 }
          )
        }

        break
      }
    }

    return null // 通过检查
  } catch (error) {
    console.error('Error checking resource limits:', error)

    return NextResponse.json(
      {
        error: 'Failed to check resource limits',
        message: 'Unable to verify demo mode restrictions',
        demoMode: true
      },
      { status: 500 }
    )
  }
}

// 获取演示模式状态
export function getDemoStatus() {
  const config = getDemoConfig()

  return {
    enabled: config.enabled,
    message: config.message,
    limits: {
      maxClientsPerTenant: config.maxClientsPerTenant,
      maxLoansPerTenant: config.maxLoansPerTenant,
      maxRepaymentsPerDay: config.maxRepaymentsPerDay
    },
    allowedOperations: config.allowedOperations,
    timeWindow: config.timeWindow,
    currentTime: new Date().toTimeString().slice(0, 5),
    withinTimeWindow: isWithinTimeWindow(config)
  }
}

// 检查是否为演示模式
export function isDemoMode(): boolean {
  return getDemoConfig().enabled
}