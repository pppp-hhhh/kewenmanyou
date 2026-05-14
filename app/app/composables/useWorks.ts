import type { Work } from '~/types/api'

export function useWorks() {
  const fetchPublicWorks = async (): Promise<Work[]> => {
    try {
      const works = await $fetch<Work[]>('/api/works/public')
      return works || []
    }
    catch (error) {
      console.error('获取公开作品失败:', error)
      return []
    }
  }

  const fetchWork = async (workId: number): Promise<Work | null> => {
    try {
      const work = await $fetch<Work>(`/api/works/${workId}`)
      return work
    }
    catch (error) {
      console.error('获取作品详情失败:', error)
      return null
    }
  }

  return {
    fetchPublicWorks,
    fetchWork,
  }
}
