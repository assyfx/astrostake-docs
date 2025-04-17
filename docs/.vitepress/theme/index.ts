import DefaultTheme from 'vitepress/theme'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import './custom.css'
import './custom.js'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // Plugin tabs
    enhanceAppWithTabs(app)

    // Custom theme logic
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('vitepress-theme-appearance') || 'auto'
      document.documentElement.setAttribute('data-theme', savedTheme)
      console.log('Current theme:', savedTheme)
    }
  }
}
