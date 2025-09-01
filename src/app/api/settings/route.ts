import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { createServerSupabaseClient } from '@/lib/supabase'
import { guardWrite } from '@/lib/guardWrite'

// 禁用缓存，确保动态渲染
export const dynamic = 'force-dynamic'
export const revalidate = 0

// 系统配置接口
interface SystemSettings {
  // 公司信息
  company_name: string
  company_address: string
  phone_number: string
  email_address: string
  business_registration: string
  
  // 贷款设置
  minimum_loan_amount: number
  maximum_loan_amount: number
  default_interest_rate: number
  maximum_loan_term: number
  late_fee_percentage: number
  
  // 通知设置
  email_notifications: boolean
  sms_notifications: boolean
  payment_reminders: boolean
  overdue_alerts: boolean
  system_updates: boolean
  marketing_emails: boolean
  
  // 安全设置
  two_factor_auth: boolean
  session_timeout: boolean
  session_timeout_minutes: number
  
  // 系统状态
  write_enabled: boolean
  demo_mode: boolean
  
  updated_at?: string
  tenant_id?: string
}

/**
 * GET /api/settings - 获取系统配置
 */
export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerSupabaseClient(cookieStore)
    
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // 从数据库获取配置
    const { data: settings, error } = await supabase
      .from('system_settings')
      .select('*')
      .eq('tenant_id', user.id)
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('获取系统配置失败:', error)
      return NextResponse.json(
        { error: '获取系统配置失败' },
        { status: 500 }
      )
    }
    
    // 如果没有配置记录，返回默认配置
    const defaultSettings: SystemSettings = {
      company_name: 'CR3DIFY',
      company_address: 'Kuala Lumpur, Malaysia',
      phone_number: '+60 3-1234 5678',
      email_address: 'info@cr3dify.com',
      business_registration: '123456789-A',
      minimum_loan_amount: 5000,
      maximum_loan_amount: 500000,
      default_interest_rate: 5.5,
      maximum_loan_term: 60,
      late_fee_percentage: 2.0,
      email_notifications: true,
      sms_notifications: true,
      payment_reminders: true,
      overdue_alerts: false,
      system_updates: true,
      marketing_emails: false,
      two_factor_auth: true,
      session_timeout: true,
      session_timeout_minutes: 30,
      write_enabled: process.env.ENABLE_WRITE === '1',
      demo_mode: process.env.DEMO_MODE === 'true'
    }
    
    const finalSettings = settings || defaultSettings
    
    // 添加系统状态信息
    finalSettings.write_enabled = process.env.ENABLE_WRITE === '1'
    finalSettings.demo_mode = process.env.DEMO_MODE === 'true'

    return NextResponse.json({
      ok: true,
      data: finalSettings
    })
  } catch (error) {
    console.error('获取系统配置失败:', error)
    return NextResponse.json(
      { error: '获取系统配置失败' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/settings - 更新系统配置
 */
export async function PUT(request: NextRequest) {
  try {
    // 检查写入权限
    const writeGuard = guardWrite()
    if (writeGuard) return writeGuard
    
    const cookieStore = await cookies()
    const supabase = createServerSupabaseClient(cookieStore)
    
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const settings: Partial<SystemSettings> = body
    
    // 添加租户ID和更新时间
    const updateData = {
      ...settings,
      tenant_id: user.id,
      updated_at: new Date().toISOString()
    }
    
    // 删除只读字段
    delete updateData.write_enabled
    delete updateData.demo_mode
    
    // 使用 upsert 操作（如果不存在则插入，存在则更新）
    const { data, error } = await supabase
      .from('system_settings')
      .upsert(updateData, {
        onConflict: 'tenant_id'
      })
      .select()
      .single()
    
    if (error) {
      console.error('更新系统配置失败:', error)
      return NextResponse.json(
        { error: '更新系统配置失败' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      data,
      message: '系统配置已更新'
    })
  } catch (error) {
    console.error('更新系统配置失败:', error)
    return NextResponse.json(
      { error: '更新系统配置失败' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/settings/actions - 执行系统维护操作
 */
export async function POST(request: NextRequest) {
  try {
    // 检查写入权限
    const writeGuard = guardWrite()
    if (writeGuard) return writeGuard
    
    const cookieStore = await cookies()
    const supabase = createServerSupabaseClient(cookieStore)
    
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { action } = await request.json()
    
    switch (action) {
      case 'backup_database':
        // 模拟数据库备份
        await new Promise(resolve => setTimeout(resolve, 2000))

        return NextResponse.json({
          ok: true,
          message: '数据库备份已完成'
        })
        
      case 'export_data':
        // 模拟数据导出
        await new Promise(resolve => setTimeout(resolve, 1500))

        return NextResponse.json({
          ok: true,
          message: '数据导出已完成，请检查下载文件夹'
        })
        
      case 'clear_cache':
        // 模拟缓存清理
        await new Promise(resolve => setTimeout(resolve, 1000))

        return NextResponse.json({
          ok: true,
          message: '系统缓存已清理'
        })
        
      case 'reset_system':
        // 模拟系统重置（仅在演示模式下允许）
        if (process.env.DEMO_MODE !== 'true') {
          return NextResponse.json(
            { error: '系统重置功能仅在演示模式下可用' },
            { status: 403 }
          )
        }
        await new Promise(resolve => setTimeout(resolve, 3000))

        return NextResponse.json({
          ok: true,
          message: '系统已重置为初始状态'
        })
        
      default:

        return NextResponse.json(
          { error: '未知的操作类型' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('执行系统操作失败:', error)
    return NextResponse.json(
      { error: '执行系统操作失败' },
      { status: 500 }
    )
  }
}