'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

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
  debounceMs?: number // 防抖延迟时间，默认500ms
  batchUpdates?: boolean // 是否批量处理更新，默认true
}

export function useRealtime({
  table,
  filter,
  onInsert,
  onUpdate,
  onDelete,
  enabled = true,
  debounceMs = 500,
  batchUpdates = true
}: UseRealtimeOptions) {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const supabaseRef = useRef(createBrowserSupabaseClient())
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const pendingUpdatesRef = useRef<{
    inserts: RealtimePayload[]
    updates: RealtimePayload[]
    deletes: RealtimePayload[]
  }>({ inserts: [], updates: [], deletes: [] })

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

            if (batchUpdates) {
              // 批量处理模式：收集更新并防抖执行
              switch (payload.eventType) {
                case 'INSERT':
                  pendingUpdatesRef.current.inserts.push(realtimePayload)
                  break
                case 'UPDATE':
                  pendingUpdatesRef.current.updates.push(realtimePayload)
                  break
                case 'DELETE':
                  pendingUpdatesRef.current.deletes.push(realtimePayload)
                  break
              }

              // 清除之前的定时器
              if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current)
              }

              // 设置新的防抖定时器
              debounceTimerRef.current = setTimeout(() => {
                const pending = pendingUpdatesRef.current

                // 执行批量回调
                 if (pending.inserts.length > 0 && onInsert) {
                   pending.inserts.forEach(onInsert)
                 }

                 if (pending.updates.length > 0 && onUpdate) {
                   pending.updates.forEach(onUpdate)
                 }

                 if (pending.deletes.length > 0 && onDelete) {
                   pending.deletes.forEach(onDelete)
                 }

                 // 清空待处理队列
                 pendingUpdatesRef.current = { inserts: [], updates: [], deletes: [] }
               }, debounceMs)
            } else {
              // 立即处理模式：直接执行回调
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

      // 清理防抖定时器
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }

      // 清空待处理队列
      pendingUpdatesRef.current = { inserts: [], updates: [], deletes: [] }

      setIsConnected(false)
    }
  }, [table, filter, onInsert, onUpdate, onDelete, enabled, debounceMs, batchUpdates])

  // 手动重连
  const reconnect = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.unsubscribe()
      channelRef.current = null
    }

    // 清理防抖定时器和待处理队列
     if (debounceTimerRef.current) {
       clearTimeout(debounceTimerRef.current)
       debounceTimerRef.current = null
     }

     pendingUpdatesRef.current = { inserts: [], updates: [], deletes: [] }

     setIsConnected(false)
     setError(null)

    // 触发重新订阅
    setTimeout(() => {
      // useEffect 会自动重新运行
    }, 100)
  }, [])

  // 立即执行待处理的更新（用于手动刷新）
  const flushPendingUpdates = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }

    const pending = pendingUpdatesRef.current

     if (pending.inserts.length > 0 && onInsert) {
       pending.inserts.forEach(onInsert)
     }

     if (pending.updates.length > 0 && onUpdate) {
       pending.updates.forEach(onUpdate)
     }

     if (pending.deletes.length > 0 && onDelete) {
       pending.deletes.forEach(onDelete)
     }

     // 清空待处理队列
     pendingUpdatesRef.current = { inserts: [], updates: [], deletes: [] }
  }, [onInsert, onUpdate, onDelete])

  return {
    isConnected,
    error,
    reconnect,
    flushPendingUpdates,
    hasPendingUpdates: pendingUpdatesRef.current.inserts.length > 0 || 
                      pendingUpdatesRef.current.updates.length > 0 || 
                      pendingUpdatesRef.current.deletes.length > 0
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