import DefaultTheme from 'vitepress/theme'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import './custom.css'
import './custom.js' // ⬅️ pastikan ini diimpor
import './components/NavLanguageSwitcher.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    enhanceAppWithTabs(app)

    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('vitepress-theme-appearance') || 'auto'
      document.documentElement.setAttribute('data-theme', savedTheme)

      // Fungsi ganti bahasa secara global
      window.switchLanguage = function (lang) {
        const path = window.location.pathname
        if (lang === 'id') {
          if (!path.startsWith('/id/')) {
            const newPath = '/id' + path
            window.location.pathname = newPath
          }
        } else {
          if (path.startsWith('/id/')) {
            const newPath = path.replace(/^\/id/, '')
            window.location.pathname = newPath
          }
        }
      }
    }
  }
}
