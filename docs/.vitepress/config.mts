import { defineConfig } from 'vitepress'
import { pagefindPlugin } from 'vitepress-plugin-pagefind'

// https://vitepress.dev/reference/site-config

export default defineConfig({
  title: "John' Blog",
  description: "技术博客/AI实验室/后端工程",

  base: '/',

  vite: {
    plugins: [
      pagefindPlugin()
    ]
  },

  themeConfig: {

    // https://vitepress.dev/reference/default-theme-config

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
      { text: '后端工程', link: '/backend/redis' },
      { text: 'AI 实验室', link: '/ai/comfyui' },
      { text: 'GitHub', link: 'https://github.com/DaveIW2034' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples'},
          { text: 'Runtime API Examples', link: '/api-examples'},
          
        ]
      },
      {
        text: '后端工程',
        items: [
          { text: 'Redis 实战', link: '/backend/redis'},
          { text: 'Python Logging', link: '/backend/logging'},
          { text: 'FastAPI TraceID', link: '/backend/middleware'},
          { text: 'PeeWee Postgresql 探活', link: '/backend/keep-alive'},
        ]
      },
      {
          text: 'AI 实验室',
          items: [
            { text: 'ComfyUI 实践', link: '/ai/comfyui'}
          ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/DaveIW2034' }
    ],

    search: {
      provider: 'local'
    },
    
  }
})
