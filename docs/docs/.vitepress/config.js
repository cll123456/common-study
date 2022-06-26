const slideBarJson = require('./../slidebar.json')


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
  lastUpdatedText: 'Updated Date', // 更新时间
  themeConfig: {
    // 顶部导航
    nav: [
      { text: 'vue3源码分析', link: '/vue3-analysis/', activeMatch: '/vue3-analysis/' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/cll123456/common-study' },
    ],
    // 顶部导航
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Twinkle & common-study Contributors'
    },
    sidebar: slideBarJson

  }

};
