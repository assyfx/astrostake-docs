// docs/.vitepress/config.ts
import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'

export default defineConfig({
  title: 'AstroStake Docs',
  description: 'Fast, simple, and reliable node setup with guides and automation tools.',
  appearance: 'dark',
  cleanUrls: true,

  // i18n setup
  locales: {
    root: {
      label: 'English',
      lang: 'en'
    },
    id: {
      label: 'Bahasa Indonesia',
      lang: 'id',
      link: '/id/'
    }
  },

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
    // --- NAVBAR: manual fallback language switcher ---
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'EN / ID',
        items: [
          { text: 'English',          link: '/'   },
          { text: 'Bahasa Indonesia', link: '/id/' }
        ]
      }
    ],

    // --- SIDEBAR tetap di sini, per path ---
    sidebar: {
      '/': [
        { text: 'Drosera',
          collapsible: true,
          items: [
            { text: 'Installation', link: '/drosera/' }
          ]
        },
        {
          text: '0G Labs',
          collapsible: true,
          items: [
            { text: 'Overview',     link: '/0g-labs/' },
            { text: 'Validator',    link: '/0g-labs/validator' },
            { 
              text: 'Storage Node', 
              collapsible: true,
              items: [
                { text: 'Install',   link: '/0g-labs/storage-node' },
                { text: 'Snapshot',  link: '/0g-labs/snapshot' }
              ]
            },
            { text: 'DA Node',     link: '/0g-labs/0gda-node' },
            { text: 'DA Client',   link: '/0g-labs/0gda-client' }
          ]
        }
      ],
      '/id/': [
        { text: 'Drosera',
          collapsible: true,
          items: [
            { text: 'Instalasi', link: '/id/drosera/'}
          ]
        },
        {
          text: '0G Labs',
          collapsible: true,
          items: [
            { text: 'Ikhtisar',     link: '/id/0g-labs/' },
            { text: 'Validator',    link: '/id/0g-labs/validator' },
            { 
              text: 'Storage Node', 
              collapsible: true,
              items: [
                { text: 'Instalasi', link: '/id/0g-labs/storage-node' },
                { text: 'Snapshot',  link: '/id/0g-labs/snapshot' }
              ]
            },
            { text: 'Node DA',      link: '/id/0g-labs/0gda-node' },
            { text: 'Klien DA',     link: '/id/0g-labs/0gda-client' }
          ]
        }
      ]
    },

    search: {
      provider: 'local'
    }
  }
})
