import DefaultTheme from 'vitepress/theme'
// @ts-ignore
import './custom.css'


import { onMounted, watch, nextTick } from 'vue'

import { useRoute } from 'vitepress'

import mediumZoom from 'medium-zoom'


export default {
  extends: DefaultTheme,

  setup() {
    const route = useRoute()

    // 初始化图片灯箱
    const initZoom = () => {
      mediumZoom('.main img', {
        background: 'rgba(0,0,0,0.8)'
      })
    }

    // 加载 Giscus
    const loadGiscus = async () => {
      await nextTick()

      // 删除旧评论
      const old = document.querySelector('.giscus')

      if (old) {
        old.remove()
      }

      // 创建评论容器
      const comments = document.createElement('div')

      comments.className = 'giscus'

      // 创建 script
      const script = document.createElement('script')

      script.src = 'https://giscus.app/client.js'

      script.setAttribute(
        'data-repo',
        'DaveIW2034/DaveIW2034.github.io'
      )

      script.setAttribute(
        'data-repo-id',
        'R_kgDOSeVGnQ'
      )

      script.setAttribute(
        'data-category',
        'Announcements'
      )

      script.setAttribute(
        'data-category-id',
        'DIC_kwDOSeVGnc4C9Hj-'
      )

      script.setAttribute(
        'data-mapping',
        'pathname'
      )

      script.setAttribute(
        'data-strict',
        '0'
      )

      script.setAttribute(
        'data-reactions-enabled',
        '1'
      )

      script.setAttribute(
        'data-emit-metadata',
        '0'
      )

      script.setAttribute(
        'data-input-position',
        'bottom'
      )

      script.setAttribute(
        'data-theme',
        'preferred_color_scheme'
      )

      script.setAttribute(
        'data-lang',
        'zh-CN'
      )

      script.crossOrigin = 'anonymous'

      script.async = true

      comments.appendChild(script)

      // 挂载到页面底部
      const content = document.querySelector('.VPDoc')

      if (content) {
        content.appendChild(comments)
      }
    }

    onMounted(async () => {
      initZoom()

      loadGiscus()
    })

    watch(
      () => route.path,

      async () => {
        await nextTick()

        initZoom()

        loadGiscus()
      }
    )
  }
}