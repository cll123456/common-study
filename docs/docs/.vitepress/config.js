const slideBarJson = require('./../slidebar.json')

/**
 * @type {import('vitepress').UserConfig}
 */
module.exports = {
  title: "common-study Doc", // 顶部左侧标题
  base: "", // 项目的根路径
  head: [
    // 设置 描述 和 关键词
    [
      "meta",
      { name: "keywords", content: "common-study 一起学习 面试 面试经历 面经 vue3源码分析" },
    ],
    [
      "meta",
      {
        name: "description",
        content:
          "此文档主要用于common-study 一起学习面试面试经历面经 vue3源码分析",
      },
    ],
  ],
  // 项目的根路径
  base: "/common-study/",
  // 语言
  lang: 'zh-CN',

  markdown: {
    theme: 'vitesse-light',
    lineNumbers: true
  },
  themeConfig: {
    // 顶部导航
    nav: [
      { text: 'vue3源码分析', link: '/vue3-analysis/', activeMatch: '/vue3-analysis/' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/cll123456/common-study' },
    ],
    // 编辑链接
    editLink: {
      pattern: 'https://github.com/cll123456/common-study/edit/master/docs/docs/:path',
      text: '前往GitHub编辑此页',
    },
    // 顶部导航
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Twinkle & common-study Contributors'
    },
    // 上次编辑的日期
    lastUpdatedText: '上次更新',
    // 侧边栏
    sidebar: slideBarJson

  }

};
