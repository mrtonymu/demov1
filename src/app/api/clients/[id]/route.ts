import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { createServerSupabaseClient } from '@/lib/supabase'
import { guardWrite } from '@/lib/guardWrite'

// 禁用缓存，确保动态渲染
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface RouteParams {
  params: {
    id: string
  }
}

/**
 * PATCH /api/clients/[id] - 更新客户信息
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // 检查写入权限
    const writeGuard = await guardWrite()
    if (writeGuard) return writeGuard
    
    const cookieStore = await cookies()
    const supabase = createServerSupabaseClient(cookieStore)
    
    const { id } = params
    const body = await request.json()
    const { full_name, ic_number, phone, email, address, status } = body
    
    // 基本验证
    if (!full_name || !ic_number || !phone) {
      return NextResponse.json(
        { error: '姓名、身份证号和手机号为必填项' },
        { status: 400 }
      )
    }
    
    // 检查客户是否存在
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .eq('id', id)
      .single()
    
    if (!existingClient) {
      return NextResponse.json(
        { error: '客户不存在' },
        { status: 404 }
      )
    }
    
    // 检查身份证号是否与其他客户冲突
    const { data: conflictClient } = await supabase
      .from('clients')
      .select('id')
      .eq('ic_number', ic_number)
      .neq('id', id)
      .single()
    
    if (conflictClient) {
      return NextResponse.json(
        { error: '该身份证号已被其他客户使用' },
        { status: 409 }
      )
    }
    
    // 更新客户信息
    const { data, error } = await supabase
      .from('clients')
      .update({
        full_name,
        ic_number,
        phone,
        email: email || null,
        address: address || null,
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('更新客户失败:', error)

      return NextResponse.json(
        { error: '更新客户失败' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('更新客户 API 错误:', error)

    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/clients/[id] - 删除客户
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // 检查写入权限
    const writeGuard = await guardWrite()
    if (writeGuard) return writeGuard
    
    const cookieStore = await cookies()
    const supabase = createServerSupabaseClient(cookieStore)
    
    const { id } = params
    
    // 检查客户是否存在
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .eq('id', id)
      .single()
    
    if (!existingClient) {
      return NextResponse.json(
        { error: '客户不存在' },
        { status: 404 }
      )
    }
    
    // 检查是否有关联的贷款记录
    const { data: loans } = await supabase
      .from('loans')
      .select('id')
      .eq('client_id', id)
      .limit(1)
    
    if (loans && loans.length > 0) {
      return NextResponse.json(
        { error: '该客户存在贷款记录，无法删除' },
        { status: 409 }
      )
    }
    
    // 删除客户
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('删除客户失败:', error)

      return NextResponse.json(
        { error: '删除客户失败' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: '客户删除成功' })
  } catch (error) {
    console.error('删除客户 API 错误:', error)

    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}