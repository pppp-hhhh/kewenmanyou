<template>
  <div class="max-w-6xl mx-auto">
    <div class="flex items-center gap-4 mb-6">
      <NuxtLink to="/admin" class="text-gray-500 hover:text-gray-700 dark:text-gray-400">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">用户管理</h1>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <svg class="animate-spin h-8 w-8 mx-auto text-indigo-600" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
      <p class="text-gray-500 mt-4">加载中...</p>
    </div>

    <!-- Empty -->
    <div v-else-if="users.length === 0" class="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
      <p class="text-gray-500">暂无用户</p>
    </div>

    <!-- Users Table -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">用户</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">邮箱</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">显示名称</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">角色</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">注册时间</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="user in users" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                  <span class="text-indigo-600 dark:text-indigo-400 font-medium">
                    {{ user.email?.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ user.display_name || '未设置' }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ user.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ user.display_name || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="{
                  'bg-purple-100 text-purple-600': user.role === 'admin',
                  'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400': user.role === 'user' || !user.role
                }"
                class="text-xs px-2 py-1 rounded"
              >
                {{ user.role === 'admin' ? '管理员' : '普通用户' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ new Date(user.created_at).toLocaleDateString('zh-CN') }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
              <template v-if="user.role !== 'admin'">
                <button
                  @click="handleSetAdmin(user.id)"
                  :disabled="processingId === user.id"
                  class="text-purple-600 hover:text-purple-700 disabled:text-purple-400"
                >
                  {{ processingId === user.id ? '设置中...' : '设为管理员' }}
                </button>
              </template>
              <template v-else>
                <span class="text-gray-400 text-sm">当前管理员</span>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin'
})

const authStore = useAuthStore()
const users = ref<any[]>([])
const loading = ref(true)
const processingId = ref<string | null>(null)

onMounted(async () => {
  await fetchUsers()
})

const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/admin/users', {
      headers: {
        Authorization: authStore.getAuthHeader()
      }
    })
    users.value = response as any[]
  } catch (error) {
    console.error('Failed to fetch users:', error)
  } finally {
    loading.value = false
  }
}

const handleSetAdmin = async (id: string) => {
  if (!confirm('确定要将此用户设为管理员吗？')) return

  processingId.value = id
  try {
    await $fetch(`/api/admin/users/${id}/role`, {
      method: 'PUT',
      headers: {
        Authorization: authStore.getAuthHeader()
      },
      body: {
        role: 'admin'
      }
    })
    await fetchUsers()
  } catch (error) {
    console.error('Failed to set admin:', error)
  } finally {
    processingId.value = null
  }
}
</script>
