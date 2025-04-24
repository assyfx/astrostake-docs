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
    socialLinks: [
      { icon: 'twitter', link: 'https://x.com/AstroStake' },
      { icon: 'discord', link: 'https://discord.com/users/248382810631438337' },
      {
        icon: {
          svg: '<svg role=\"img\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><title>Telegram</title><path d=\"M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM17.6 7.5L15.8 16.6C15.6 17.5 15.1 17.7 14.4 17.3L11.6 15.3L10.2 16.6C10 16.8 9.9 16.9 9.5 16.9L9.7 14.1L14.9 9.4C15.2 9.1 14.8 9 14.4 9.3L8.4 13.6L5.7 12.7C4.9 12.4 4.9 11.9 5.8 11.5L16.7 7.2C17.3 7 17.8 7.3 17.6 7.5Z\"/></svg>'
        },
        link: 'https://t.me/astrostake',
        ariaLabel: 'Telegram'
      },
      {
        icon: {
          svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z"/></svg>`
        },
        link: 'mailto:contact@astrostake.xyz',
        ariaLabel: 'Email'
      }            
    ],
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
                { text: 'Install v2',   link: '/0g-labs/storage-node' },
                { text: 'Snapshot v2',  link: '/0g-labs/snapshot' },
                { text: 'Install v3', link: '/0g-labs/storage-node-v3-chain' }, 
                { text: 'Update v3', link: '/0g-labs/storage-node-v3-update' }
              ]
            },
            { text: 'DA Node',     link: '/0g-labs/0gda-node' },
            { text: 'DA Client',   link: '/0g-labs/0gda-client' }
          ]
        },
        { text: 'VANA',
          collapsible: true,
          items: [
            { text: 'DLP Validator', link: '/vana/'}
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
        },
        { text: 'VANA',
          collapsible: true,
          items: [
            { text: 'DLP Validator', link: '/id/vana/'}
          ]
        }
      ]
    },

    search: {
      provider: 'local'
    }
  }
})
