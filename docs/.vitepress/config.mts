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
          { text: 'PeeWee Postgresql 探活', link: '/backend/keep-live'},
          { text: '服务注册与发现', link: '/backend/registry'},
          { text: 'RabbitMQ AIO实践', link: '/backend/aio-pika'},
          { text: 'InfluxDB 快速入门与核心概念', link: '/backend/influx-db-py'},

        ]
      },
      {
          text: 'AI 实验室',
          items: [
            { text: 'ComfyUI 实践', link: '/ai/comfyui'},
            { text: 'Codex 实用命令', link: '/ai/codex'},
            { text: 'Codex Worktree结合', link: '/ai/worktree'},
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
