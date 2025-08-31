interface OfflineData {
  wishes: any[]
  fortunes: any[]
  userProfile: any
  lastSync: number
}

class OfflineManager {
  private storageKey = 'fortune-app-offline-data'
  private syncQueue: any[] = []

  // 获取离线数据
  getOfflineData(): OfflineData {
    try {
      const data = localStorage.getItem(this.storageKey)
      return data ? JSON.parse(data) : {
        wishes: [],
        fortunes: [],
        userProfile: null,
        lastSync: 0
      }
    } catch (error) {
      console.error('Failed to get offline data:', error)
      return {
        wishes: [],
        fortunes: [],
        userProfile: null,
        lastSync: 0
      }
    }
  }

  // 保存离线数据
  saveOfflineData(data: Partial<OfflineData>): void {
    try {
      const currentData = this.getOfflineData()
      const updatedData = {
        ...currentData,
        ...data,
        lastSync: Date.now()
      }
      localStorage.setItem(this.storageKey, JSON.stringify(updatedData))
    } catch (error) {
      console.error('Failed to save offline data:', error)
    }
  }

  // 添加离线许愿
  addOfflineWish(wish: any): void {
    const data = this.getOfflineData()
    const newWish = {
      ...wish,
      id: `offline-${Date.now()}`,
      isOffline: true,
      createdAt: new Date().toISOString()
    }
    data.wishes.push(newWish)
    this.saveOfflineData(data)
    this.addToSyncQueue('wish', newWish)
  }

  // 获取离线许愿
  getOfflineWishes(): any[] {
    return this.getOfflineData().wishes
  }

  // 缓存运势数据
  cacheFortune(fortune: any): void {
    const data = this.getOfflineData()
    const existingIndex = data.fortunes.findIndex(f => f.date === fortune.date)
    
    if (existingIndex >= 0) {
      data.fortunes[existingIndex] = fortune
    } else {
      data.fortunes.push(fortune)
      // 只保留最近30天的运势
      if (data.fortunes.length > 30) {
        data.fortunes = data.fortunes.slice(-30)
      }
    }
    
    this.saveOfflineData(data)
  }

  // 获取缓存的运势
  getCachedFortunes(): any[] {
    return this.getOfflineData().fortunes
  }

  // 获取今日运势（如果有缓存）
  getTodayFortune(): any | null {
    const today = new Date().toISOString().split('T')[0]
    const fortunes = this.getCachedFortunes()
    return fortunes.find(f => f.date === today) || null
  }

  // 添加到同步队列
  private addToSyncQueue(type: string, data: any): void {
    this.syncQueue.push({
      type,
      data,
      timestamp: Date.now()
    })
    this.saveSyncQueue()
  }

  // 保存同步队列
  private saveSyncQueue(): void {
    try {
      localStorage.setItem('fortune-app-sync-queue', JSON.stringify(this.syncQueue))
    } catch (error) {
      console.error('Failed to save sync queue:', error)
    }
  }

  // 加载同步队列
  private loadSyncQueue(): void {
    try {
      const queue = localStorage.getItem('fortune-app-sync-queue')
      this.syncQueue = queue ? JSON.parse(queue) : []
    } catch (error) {
      console.error('Failed to load sync queue:', error)
      this.syncQueue = []
    }
  }

  // 同步离线数据到服务器
  async syncToServer(supabase: any): Promise<void> {
    this.loadSyncQueue()
    
    if (this.syncQueue.length === 0) {
      return
    }

    const successfulSyncs: number[] = []

    for (let i = 0; i < this.syncQueue.length; i++) {
      const item = this.syncQueue[i]
      
      try {
        switch (item.type) {
          case 'wish':
            await this.syncWish(supabase, item.data)
            successfulSyncs.push(i)
            break
          // 可以添加更多同步类型
        }
      } catch (error) {
        console.error(`Failed to sync ${item.type}:`, error)
        // 继续处理其他项目
      }
    }

    // 移除已成功同步的项目
    this.syncQueue = this.syncQueue.filter((_, index) => !successfulSyncs.includes(index))
    this.saveSyncQueue()
  }

  // 同步许愿到服务器
  private async syncWish(supabase: any, wish: any): Promise<void> {
    const { isOffline, id, ...wishData } = wish
    const { error } = await supabase
      .from('wishes')
      .insert([wishData])
    
    if (error) {
      throw error
    }

    // 从离线数据中移除已同步的许愿
    const data = this.getOfflineData()
    data.wishes = data.wishes.filter(w => w.id !== id)
    this.saveOfflineData(data)
  }

  // 清理过期的离线数据
  cleanupExpiredData(): void {
    const data = this.getOfflineData()
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
    
    // 清理过期的运势数据
    data.fortunes = data.fortunes.filter(f => {
      const fortuneDate = new Date(f.date).getTime()
      return fortuneDate > thirtyDaysAgo
    })
    
    // 清理过期的许愿（超过7天未同步）
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
    data.wishes = data.wishes.filter(w => {
      const wishDate = new Date(w.createdAt).getTime()
      return wishDate > sevenDaysAgo
    })
    
    this.saveOfflineData(data)
  }

  // 检查是否有待同步的数据
  hasPendingSync(): boolean {
    this.loadSyncQueue()
    return this.syncQueue.length > 0 || this.getOfflineWishes().length > 0
  }

  // 获取离线数据统计
  getOfflineStats(): { wishes: number; fortunes: number; lastSync: Date | null } {
    const data = this.getOfflineData()
    return {
      wishes: data.wishes.length,
      fortunes: data.fortunes.length,
      lastSync: data.lastSync ? new Date(data.lastSync) : null
    }
  }
}

// 创建单例实例
export const offlineManager = new OfflineManager()

// React Hook
export function useOfflineManager() {
  return offlineManager
}