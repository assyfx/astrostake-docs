import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'

export default defineConfig({
  title: 'AstroStake Docs',
  description: 'Fast, simple, and reliable node setup with guides and automation tools.',
  appearance: 'dark',
  cleanUrls: true,

  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin)
    }
  },

  head: [
    // Favicon
    [
      'link',
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
    ],

    // Google Analytics Script
    [
      'script',
      {
        async: true,
        src: 'https://www.googletagmanager.com/gtag/js?id=G-RH9S9HCJ4X'
      }
    ],
    [
      'script',
      {},
      `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-RH9S9HCJ4X', {
          cookie_flags: 'SameSite=None;Secure',
          cookie_domain: 'astrostake.xyz'
        });
      `
    ]
  ],
  themeConfig: {
    nav: [{ text: 'Home', link: '/' }],
    sidebar: [
      {
        text: 'OG Labs',
        link: '/0g-labs/',
        collapsible: true,
        items: [
          { text: 'Overview', link: '/0g-labs/' },
          { text: 'Validator', link: '/0g-labs/validator' },
          {
            text: 'Storage Node',
            collapsible: true,
            items: [
              { text: 'Install', link: '/0g-labs/storage-node' },
              { text: 'Snapshot', link: '/0g-labs/snapshot' }
            ]
          },
          { text: 'DA Node', link: '/0g-labs/0gda-node' },
          { text: 'DA Client', link: '/0g-labs/0gda-client' }
        ]
      },
      {
        text: 'VANA',
        collapsible: true,
        items: [
          {
            text: 'DLP Validator'
          }
        ]
      }
    ],
    search: {
      provider: 'local'
    }
  }
})
