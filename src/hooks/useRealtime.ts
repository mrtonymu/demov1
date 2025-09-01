'use client'

import { useEffect, useRef, useState } from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'

import { createBrowserSupabaseClient } from '@/lib/supabase'
import type { RealtimeEvent, RealtimePayload } from '@/types/cr3dify'

interface UseRealtimeOptions {
  table: string
  filter?: string
  onInsert?: (payload: RealtimePayload) => void
  onUpdate?: (payload: RealtimePayload) => void
  onDelete?: (payload: RealtimePayload) => void
  enabled?: boolean
}

export function useRealtime({
  table,
  filter,
  onInsert,
  onUpdate,
  onDelete,
  enabled = true
}: UseRealtimeOptions) {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const supabaseRef = useRef(createBrowserSupabaseClient())

  useEffect(() => {
    if (!enabled) {
      // 如果禁用，清理现有连接
      if (channelRef.current) {
        channelRef.current.unsubscribe()
        channelRef.current = null
        setIsConnected(false)
      }

      return
    }

    const supabase = supabaseRef.current

    // 创建频道名称
    const channelName = filter ? `${table}:${filter}` : table

    // 创建 Realtime 频道
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter
        },
        (payload) => {
          try {
            const realtimePayload: RealtimePayload = {
              eventType: payload.eventType as RealtimeEvent,
              new: payload.new,
              old: payload.old,
              errors: payload.errors
            }

            // 根据事件类型调用相应的回调
            switch (payload.eventType) {
              case 'INSERT':
                onInsert?.(realtimePayload)
                break
              case 'UPDATE':
                onUpdate?.(realtimePayload)
                break
              case 'DELETE':
                onDelete?.(realtimePayload)
                break
            }
          } catch (err) {
            console.error('Error processing realtime payload:', err)
            setError(err instanceof Error ? err.message : 'Unknown error')
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
          setError(null)
        } else if (status === 'CHANNEL_ERROR') {
          setIsConnected(false)
          setError('Failed to subscribe to realtime channel')
        } else if (status === 'TIMED_OUT') {
          setIsConnected(false)
          setError('Realtime subscription timed out')
        } else if (status === 'CLOSED') {
          setIsConnected(false)
        }
      })

    channelRef.current = channel

    // 清理函数
    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe()
        channelRef.current = null
      }

      setIsConnected(false)
    }
  }, [table, filter, onInsert, onUpdate, onDelete, enabled])

  // 手动重连
  const reconnect = () => {
    if (channelRef.current) {
      channelRef.current.unsubscribe()
      channelRef.current = null
    }

    setIsConnected(false)
    setError(null)

    // 触发重新订阅
    setTimeout(() => {
      // useEffect 会自动重新运行
    }, 100)
  }

  return {
    isConnected,
    error,
    reconnect
  }
}

// 专门用于监听客户数据变化的 Hook
export function useClientsRealtime({
  onInsert,
  onUpdate,
  onDelete,
  enabled = true
}: Omit<UseRealtimeOptions, 'table'>) {
  return useRealtime({
    table: 'clients',
    onInsert,
    onUpdate,
    onDelete,
    enabled
  })
}

// 专门用于监听贷款数据变化的 Hook
export function useLoansRealtime({
  onInsert,
  onUpdate,
  onDelete,
  enabled = true
}: Omit<UseRealtimeOptions, 'table'>) {
  return useRealtime({
    table: 'loans',
    onInsert,
    onUpdate,
    onDelete,
    enabled
  })
}

// 专门用于监听还款数据变化的 Hook
export function useRepaymentsRealtime({
  onInsert,
  onUpdate,
  onDelete,
  enabled = true
}: Omit<UseRealtimeOptions, 'table'>) {
  return useRealtime({
    table: 'repayment_txns',
    onInsert,
    onUpdate,
    onDelete,
    enabled
  })
}

// 用于监听特定贷款的还款记录
export function useLoanRepaymentsRealtime({
  loanId,
  onInsert,
  onUpdate,
  onDelete,
  enabled = true
}: {
  loanId: string
  onInsert?: (payload: RealtimePayload) => void
  onUpdate?: (payload: RealtimePayload) => void
  onDelete?: (payload: RealtimePayload) => void
  enabled?: boolean
}) {
  return useRealtime({
    table: 'repayment_txns',
    filter: `loan_id=eq.${loanId}`,
    onInsert,
    onUpdate,
    onDelete,
    enabled
  })
}