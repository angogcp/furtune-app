import { useAuth } from '../contexts/AuthContext'
import type { BirthInfo } from '../types'

/**
 * Hook to get user's personal information for fortune telling
 * Returns formatted birth information that can be used in divination
 */
export function usePersonalInfo() {
  const { userProfile } = useAuth()

  const getPersonalInfo = (): BirthInfo | null => {
    if (!userProfile?.date_of_birth) {
      return null
    }

    try {
      const birthDate = new Date(userProfile.date_of_birth)
      const timeString = userProfile.time_of_birth || '12:00'
      const [hours, minutes] = timeString.split(':').map(Number)

      return {
        year: birthDate.getFullYear(),
        month: birthDate.getMonth() + 1,
        day: birthDate.getDate(),
        hour: hours || 12,
        minute: minutes || 0,
        time: timeString,
        place: userProfile.place_of_birth || '',
        gender: userProfile.gender || 'male'
      }
    } catch (error) {
      console.error('Error parsing birth information:', error)
      return null
    }
  }

  const getPersonalInfoText = (): string => {
    if (!userProfile) {
      return '未设置个人信息'
    }

    const parts = []
    
    if (userProfile.full_name) {
      parts.push(`姓名：${userProfile.full_name}`)
    }
    
    if (userProfile.date_of_birth) {
      parts.push(`出生日期：${userProfile.date_of_birth}`)
    }
    
    if (userProfile.time_of_birth) {
      parts.push(`出生时间：${userProfile.time_of_birth}`)
    }
    
    if (userProfile.place_of_birth) {
      parts.push(`出生地点：${userProfile.place_of_birth}`)
    }
    
    if (userProfile.gender) {
      parts.push(`性别：${userProfile.gender === 'male' ? '男' : '女'}`)
    }

    return parts.length > 0 ? parts.join('，') : '未设置个人信息'
  }

  const hasCompleteInfo = (): boolean => {
    return !!(
      userProfile?.full_name &&
      userProfile?.date_of_birth &&
      userProfile?.time_of_birth &&
      userProfile?.place_of_birth &&
      userProfile?.gender
    )
  }

  const getMissingFields = (): string[] => {
    const missing = []
    
    if (!userProfile?.full_name) missing.push('姓名')
    if (!userProfile?.date_of_birth) missing.push('出生日期')
    if (!userProfile?.time_of_birth) missing.push('出生时间')
    if (!userProfile?.place_of_birth) missing.push('出生地点')
    if (!userProfile?.gender) missing.push('性别')
    
    return missing
  }

  return {
    personalInfo: getPersonalInfo(),
    personalInfoText: getPersonalInfoText(),
    hasCompleteInfo: hasCompleteInfo(),
    missingFields: getMissingFields(),
    userProfile
  }
}