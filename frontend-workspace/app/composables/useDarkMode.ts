export function useDarkMode() {
  const isDark = useState('dark-mode', () => false)

  const apply = (dark: boolean) => {
    if (import.meta.server) return
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }

  const toggle = () => {
    isDark.value = !isDark.value
    apply(isDark.value)
  }

  // 客户端初始化：读取持久化偏好，无记录则跟随系统
  onMounted(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark' || stored === 'light') {
      isDark.value = stored === 'dark'
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    apply(isDark.value)
  })

  return { isDark, toggle }
}
