const fs = require('fs');
const path = require('path');

const resolve = (dirname) => path.resolve(__dirname, dirname);


// 读取指定目录下面的文件，来读取下一级的readme.md文件，然后将它移动到对应目录的下面，当作是docs的一个文件夹

let dirName = 'vue3-analysis'

// 拼接源码的路径
const originPath = resolve(`./../${dirName}`)

const dirFiles = fs.readdirSync(originPath)

// 构建docs 目录的路径
const docsPath = resolve(`./docs/${dirName}`)

/**
 * 是否存在目录
 * @param {*} docsPath 
 * @returns 
 */
const isExitFirDir = (docsPath) => fs.existsSync(docsPath)

if (!isExitFirDir(docsPath)) {
  // 创建目录
  fs.mkdirSync(docsPath)
}
// 存在等待文件移入

// 找到源码的文件的readme.md文件
// console.log(dirFiles)

const sidebarItems = []

dirFiles.forEach(file => {
  if (file === 'readme.md') {
    // 将文件移动到docs目录下面
    fs.copyFileSync(`${originPath}/${file}`, `${docsPath}/index.md`)
    sidebarItems.push({ text: '介绍', link: `/${dirName}/index.md` })
  } else {
    // 将文件下面的readme.md文件移入到docs目录下面
    const readmePath = `${originPath}/${file}/readme.md`
    if (fs.existsSync(readmePath)) {
      fs.copyFileSync(readmePath, `${docsPath}/${file}.md`)
      sidebarItems.push({ text: file, link: `/${dirName}/${file}.md` })
    }
  }
})

// 对sidebar进行排序
sidebarItems.sort((a, b) => {
  // 拿到 9-init-comp-mount 进行排序
  const aText = a.text.split('-')[0]
  const bText = b.text.split('-')[0]
  return Number(aText) > Number(bText) ? 1 : -1
})

// console.log(sidebarItems)

// 在slidebar.json写入sidebarItems
const slideBarJson = require('./docs/slidebar.json')
slideBarJson[0].items = sidebarItems
// console.log(JSON.stringify(slideBarJson))
fs.writeFileSync(resolve(`./docs/slidebar.json`), JSON.stringify(slideBarJson))
