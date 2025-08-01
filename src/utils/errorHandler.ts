// Error handling utilities for Supabase and network errors

export interface ErrorInfo {
  message: string
  type: 'network' | 'auth' | 'database' | 'validation' | 'unknown'
  retryable: boolean
  userMessage: string
}

export function parseSupabaseError(error: any): ErrorInfo {
  const errorMessage = error?.message || error?.toString() || '未知错误'
  
  // Network errors
  if (errorMessage.includes('ERR_NETWORK_CHANGED') || 
      errorMessage.includes('network') ||
      errorMessage.includes('fetch') ||
      errorMessage.includes('Failed to fetch') ||
      error instanceof TypeError) {
    return {
      message: errorMessage,
      type: 'network',
      retryable: true,
      userMessage: '网络连接不稳定，请检查网络后重试'
    }
  }
  
  // Authentication errors
  if (errorMessage.includes('Invalid login credentials') ||
      errorMessage.includes('Email not confirmed') ||
      errorMessage.includes('User not found') ||
      errorMessage.includes('Invalid refresh token')) {
    return {
      message: errorMessage,
      type: 'auth',
      retryable: false,
      userMessage: getAuthErrorMessage(errorMessage)
    }
  }
  
  // Database errors
  if (error?.code === 'PGRST116' || 
      errorMessage.includes('relation') ||
      errorMessage.includes('does not exist')) {
    return {
      message: errorMessage,
      type: 'database',
      retryable: false,
      userMessage: '数据库配置错误，请联系管理员'
    }
  }
  
  // Validation errors
  if (errorMessage.includes('already exists') ||
      errorMessage.includes('duplicate') ||
      errorMessage.includes('constraint')) {
    return {
      message: errorMessage,
      type: 'validation',
      retryable: false,
      userMessage: getValidationErrorMessage(errorMessage)
    }
  }
  
  // Unknown errors
  return {
    message: errorMessage,
    type: 'unknown',
    retryable: true,
    userMessage: '操作失败，请重试'
  }
}

function getAuthErrorMessage(errorMessage: string): string {
  if (errorMessage.includes('Invalid login credentials')) {
    return '邮箱或密码错误，请检查后重试'
  }
  if (errorMessage.includes('Email not confirmed')) {
    return '请先验证邮箱后再登录'
  }
  if (errorMessage.includes('User not found')) {
    return '用户不存在，请先注册'
  }
  if (errorMessage.includes('Invalid refresh token')) {
    return '登录已过期，请重新登录'
  }
  return '认证失败，请重试'
}

function getValidationErrorMessage(errorMessage: string): string {
  if (errorMessage.includes('email') && errorMessage.includes('already exists')) {
    return '该邮箱已被注册，请使用其他邮箱或直接登录'
  }
  if (errorMessage.includes('username') && errorMessage.includes('already exists')) {
    return '用户名已存在，请选择其他用户名'
  }
  return '输入信息有误，请检查后重试'
}

// Retry utility with exponential backoff
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      const errorInfo = parseSupabaseError(error)
      
      // Don't retry non-retryable errors
      if (!errorInfo.retryable || attempt === maxRetries) {
        throw error
      }
      
      // Exponential backoff: 1s, 2s, 4s, 8s...
      const delay = baseDelay * Math.pow(2, attempt)
      console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`, error)
      
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError
}

// Network status checker
export async function checkNetworkConnection(): Promise<boolean> {
  if (!navigator.onLine) {
    return false
  }
  
  try {
    // Try to fetch a small resource to test actual connectivity
    await fetch('https://www.google.com/favicon.ico', {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache'
    })
    return true
  } catch {
    return false
  }
}

// Toast notification helper for errors
export function showErrorToast(error: any, customMessage?: string) {
  const errorInfo = parseSupabaseError(error)
  const message = customMessage || errorInfo.userMessage
  
  // You can integrate with your preferred toast library here
  console.error('Error:', errorInfo.message)
  console.log('User message:', message)
  
  // For now, we'll use a simple alert, but you can replace this with a proper toast
  if (typeof window !== 'undefined') {
    // Create a simple toast-like notification
    const toast = document.createElement('div')
    toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 max-w-sm'
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 bg-white rounded-full"></div>
        <span class="text-sm">${message}</span>
      </div>
    `
    
    document.body.appendChild(toast)
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, 5000)
  }
}