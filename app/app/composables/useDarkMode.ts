export function useDarkMode() {
  // 使用 useCookie 来确保 SSR 和客户端同步
  const themeCookie = useCookie('theme', {
    default: () => 'light',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  })

  const isDark = computed({
    get: () => themeCookie.value === 'dark',
    set: (val: boolean) => {
      themeCookie.value = val ? 'dark' : 'light'
    }
  })

  const apply = (dark: boolean) => {
    if (import.meta.server) return
    document.documentElement.classList.toggle('dark', dark)
  }

  const toggle = () => {
    isDark.value = !isDark.value
    apply(isDark.value)
  }

  // 客户端初始化
  onMounted(() => {
    // 确保客户端状态与 cookie 一致
    apply(isDark.value)
  })

  // 监听 isDark 变化
  watch(isDark, (dark) => {
    apply(dark)
  }, { immediate: true })

  return { isDark, toggle }
}
