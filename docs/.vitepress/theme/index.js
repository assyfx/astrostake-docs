import DefaultTheme from 'vitepress/theme'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import './custom.css'
import './custom.js'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    enhanceAppWithTabs(app)

    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('vitepress-theme-appearance') || 'auto'
      document.documentElement.setAttribute('data-theme', savedTheme)

    }
  }
}
