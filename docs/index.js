const fs = require('fs');
const path = require('path');

const resolve = (dirname) => path.resolve(__dirname, dirname);

/**
 * 是否存在目录
 * @param {*} docsPath 
 * @returns 
 */
const isExitFirDir = (docsPath) => fs.existsSync(docsPath)


// 读取指定目录下面的文件，来读取下一级的readme.md文件，然后将它移动到对应目录的下面，当作是docs的一个文件夹

/**
 * 自动生成slidebar.json文件
 * @param {*} dirName 目录名称
 * @param {*} index 索引
 * @param {*} title 一级标题
 */
const autoGenrateSlidebarJson = (dirName, index, title, fileName = 'readme.md') => {
  // let dirName = 'vue3-analysis'

  // 拼接源码的路径
  const originPath = resolve(`./../${dirName}`)

  const dirFiles = fs.readdirSync(originPath)

  // 构建docs 目录的路径
  const docsPath = resolve(`./docs/${dirName}`)

  if (!isExitFirDir(docsPath)) {
    // 创建目录
    fs.mkdirSync(docsPath)
  }

  const sidebarItems = []

  dirFiles.forEach(file => {
    if (file === 'readme.md') {
      // 将文件移动到docs目录下面
      fs.copyFileSync(`${originPath}/${file}`, `${docsPath}/index.md`)
      sidebarItems.push({ text: '介绍', link: `/${dirName}/index.md` })
    } else {
      // 将文件下面的readme.md文件移入到docs目录下面
      const readmePath = `${originPath}/${file}/${fileName}`
      if (fs.existsSync(readmePath)) {
        // 建立目录
        const subDirName = resolve(`./docs/${dirName}/${file}`)
        if (!isExitFirDir(subDirName)) {
          // 创建目录
          fs.mkdirSync(subDirName)
        }
        fs.copyFileSync(readmePath, `${docsPath}/${file}/${file}.md`)
        sidebarItems.push({ text: file, link: `/${dirName}/${file}/${file}.md` })

        // 找到file目录下面的所有.md后缀的文件，存在需要全部copy
        const fileList = fs.readdirSync(`${originPath}/${file}`)
        fileList.forEach(subFile => {
          if (subFile.endsWith('.md')) {
            fs.copyFileSync(`${originPath}/${file}/${subFile}`, `${docsPath}/${file}/${subFile}`)
          }
        })

        // 判断是否存在静态资源文件asserts
        const assertsPath = `${originPath}/${file}/asserts`
        if (fs.existsSync(assertsPath)) {
          // 建立目录
          const subDirName = resolve(`./docs/${dirName}/${file}/asserts`)
          if (!isExitFirDir(subDirName)) {
            // 创建目录
            fs.mkdirSync(subDirName)
          }
          // 把里面的所有文件文件夹都copy到docs目录下面
          copyAllFiles(assertsPath, `${docsPath}/${file}/asserts`)

        }
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


  // 在slidebar.json写入sidebarItems
  const slideBarJson = require('./docs/slidebar.json')
  slideBarJson[index].items = sidebarItems
  slideBarJson[index].collapsible = true;
  slideBarJson[index].title = title
  fs.writeFileSync(resolve(`./docs/slidebar.json`), JSON.stringify(slideBarJson))
}




(() => {
  // 自动生成slidebar.json
  autoGenrateSlidebarJson('vue3-analysis', 0, 'vue3源码分析')
  autoGenrateSlidebarJson('packages-study', 1, '源码阅读', 'index.md')

})()


// node 递归拷贝所有的文件和文件夹
function copyAllFiles(dirPath, targetPath) {
  // 判断dirPath是文件还是文件夹
  const stats = fs.statSync(dirPath)
  if (stats.isFile()) {
    // 判断targetPath的上一级是不是文件夹
    const targetDirPathArr = targetPath.split('/')
    const targetDirPath = targetDirPathArr.slice(0, targetDirPathArr.length - 1).join('/')
    if (!isExitFirDir(targetDirPath)) {
      // 创建目录
      fs.mkdirSync(targetDirPath)
    }
    // 直接copy到targetPath目录下面
    fs.copyFileSync(dirPath, targetPath)
    return
  } else if (stats.isDirectory()) {
    // 读取所有的文件
    const files = fs.readdirSync(dirPath)
    files.forEach(file => {
      copyAllFiles(`${dirPath}/${file}`, `${targetPath}/${file}`)
    })
  } else {
    console.log(`${dirPath}不是文件也不是文件夹`)
  }
}
