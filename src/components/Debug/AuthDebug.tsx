import React, { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

interface DebugInfo {
  isConfigured: boolean
  session: any
  userTableExists: boolean
  error: string | null
}

export default function AuthDebug() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    isConfigured: false,
    session: null,
    userTableExists: false,
    error: null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function runDebug() {
      try {
        console.log('=== Auth Debug Started ===')
        
        // Check configuration
        const configured = isSupabaseConfigured
        console.log('Supabase configured:', configured)
        
        if (!configured) {
          setDebugInfo({
            isConfigured: false,
            session: null,
            userTableExists: false,
            error: 'Supabase not configured'
          })
          setLoading(false)
          return
        }

        // Check session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        console.log('Session:', session)
        console.log('Session error:', sessionError)

        // Test users table
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('count')
          .limit(1)
        
        console.log('Users table test:', { data: usersData, error: usersError })

        setDebugInfo({
          isConfigured: configured,
          session: session,
          userTableExists: !usersError,
          error: sessionError?.message || usersError?.message || null
        })
        
        console.log('=== Auth Debug Completed ===')
      } catch (error) {
        console.error('Debug error:', error)
        setDebugInfo(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Unknown error'
        }))
      } finally {
        setLoading(false)
      }
    }

    runDebug()
  }, [])

  if (loading) {
    return (
      <div className="p-4 bg-blue-900/50 rounded-lg border border-blue-400/30">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">调试信息加载中...</h3>
      </div>
    )
  }

  return (
    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-400/30 text-white">
      <h3 className="text-lg font-semibold text-yellow-300 mb-4">认证调试信息</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Supabase 配置:</span>
          <span className={debugInfo.isConfigured ? 'text-green-400' : 'text-red-400'}>
            {debugInfo.isConfigured ? '✓ 已配置' : '✗ 未配置'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>用户表存在:</span>
          <span className={debugInfo.userTableExists ? 'text-green-400' : 'text-red-400'}>
            {debugInfo.userTableExists ? '✓ 存在' : '✗ 不存在'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>当前会话:</span>
          <span className={debugInfo.session ? 'text-green-400' : 'text-gray-400'}>
            {debugInfo.session ? '✓ 已登录' : '- 未登录'}
          </span>
        </div>
        
        {debugInfo.error && (
          <div className="mt-3 p-2 bg-red-900/50 border border-red-400/30 rounded">
            <span className="text-red-300">错误: {debugInfo.error}</span>
          </div>
        )}
        
        {debugInfo.session && (
          <div className="mt-3 p-2 bg-green-900/50 border border-green-400/30 rounded">
            <div className="text-green-300 text-xs">
              <div>用户ID: {debugInfo.session.user?.id}</div>
              <div>邮箱: {debugInfo.session.user?.email}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}