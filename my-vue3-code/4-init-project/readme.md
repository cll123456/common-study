---
theme: qklhk-chocolate
---
# 引言
 在前面的文章中，分析了[vue3的响应式数据原理](https://juejin.cn/post/7102419584459898894/)、[vue组件初始化流程](https://juejin.cn/post/7103537295537979399)、[vue组件更新流程](https://juejin.cn/post/7104201092526948388)等文章，有人说学习源码的最好方式，就是把别人的思路理解到来，自己手动敲一遍。那咋们就来手动敲一敲，并且把整个过程记录下来，给有需要的有缘人😃😃😃

# 初始化项目
vue3源码采用的是[pnpm + monorepo](https://github.com/vuejs/core/blob/main/package.json)的方式来创建仓库的。那咋也学习下，用pnpm + monorepo的方式来创建一个自己的源码库


# init
使用 `pnpm init` 来初始化项目
然后改动下`package.json`的内容如下：

```js
// 包管理器使用pnpm
"packageManager": "pnpm@7.1.0", 
// 跟目录为private,不需要发布
 "private": true,
```

增加`pnpm-workspace.yaml` 来使项目是一个monorope的项目，并且里面增加内容如下：

```js
packages:
  - 'packages/*'
```

# packages
在根目录下面新增 `packages`, 然后在里面分别建立 `pkg1` 和 `pkg2`， pkg1 和 pkg2 是单独的两个包，用两个包来方便测试，分别给两个包进行 `init操作`生成对应的package.json文件

## 给主包安装依赖
vue3项目使用typescript语法， jest来进行测试，所以在workspace跟目录下安装主要的依赖


```js
// 安装ts 和对应的类型检查库
pnpm add typescript @types/node -w -D 

// 安装jest 和对应的类型库
pnpm add jest @types/jest -w -D
```

> **pnpm add xxxx -w -D** 的意思是使用pnpm 在workspace的跟目录下面安装依赖，不会安装到packages中，但是咋们在packages中也是可以使用的，这是由于**node解析文件的策略**，优先需要同级下面的node_modules,然后在向上找，找到就用，如果一直到磁盘最顶端都没有，那就直接error


## pkg1

在pkg1中,建立 `index.ts`, 并且向外导出一个函数，供其他模块使用

```js
/**
 * 测试模块1的方法add
 * @param a 
 * @param b 
 * @returns 
 */
export function add(a, b) {
  return a + b;
}

```

接下来把pkg1里面的`package.json` 修改成如下：

```js
"main": "index.ts",
```

## pkg2 
在pkg2中使用pkg1的**add函数**，需要在**pkg2**的`package.json`安装`pkg1`的依赖如下：

```js
"dependencies": {
    "pkg1": "workspace:pkg1@*"
  }
```

> 请思考🧐：**自己写了依赖**，咋们能使用成功么？

答案： 肯定是不行的，咋们还需要 在当前目录下面进行 `pnpm install` 把依赖给他安装进来

效果如下：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d3ed9ef07244587b1fc681b8c4ee1de~tplv-k3u1fbpfcp-watermark.image?)

安装好依赖了，咋们该使用了，就在当前建立一个**test文件夹**，然后使用 `jest`来进行测试吧

在 test 文件夹下面建立一个 `monorepo.spec.ts` 文件，方便进行测试


```js
import { add } from 'pkg1'

test('adds 1 + 2 to equal 3', () => {
  expect(add(1, 2)).toBe(3);
});

```

然后在在根目录的`package.json` 脚本命令

```js
"scripts": {
    "test": "jest"
  },
```

> 请思考🧐： 这里 在根目录下面直接 `pnpm run test` 能测试成功吗？ 如果不能请思考理由

结果肯定是有问题的：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a84af6c56205400bafc74b9bba2fcfad~tplv-k3u1fbpfcp-watermark.image?)


# 解决问题
> 在上面报错中，咋们会发现，**jest** 是不能直接运行 **ts**的。那就往这个方面去解决问题

遇到这种问题，那就该去官网里面找解决方法的时候了 [https://jestjs.io/zh-Hans/docs/getting-started](https://jestjs.io/zh-Hans/docs/getting-started)

在这里会发现有两种方案来进行解决:
1. 使用`babel`
2. 使用 `ts-jest`

## babel
```
pnpm install --save-dev @babel/preset-typescript  -w
```

你需要添加`@babel/preset-typescript`的预设到`babel.config.js`.

babel.config.js

```
module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    '@babel/preset-typescript',
  ],
};
```

不过，在配合使用TypeScript与Babel时，仍然有一些 [注意事项](https://babeljs.io/docs/en/babel-plugin-transform-typescript#caveats) 。 因为Babel对Typescrip的支持是纯编译形式（无类型校验），因此Jest在运行测试时不会对它们进行类型检查。 **如果需要类型校验**，可以改用[ts-jest](https://github.com/kulshekhar/ts-jest)，也可以单独运行TypeScript编译器 [tsc](https://www.typescriptlang.org/docs/handbook/compiler-options.html) （或作为构建过程的一部分）。

## ts-jest
咋们这里用了ts,并且需要类型检查，那就重点来说这种方式

1. 在根目录下面安装ts-jest

```js
pnpm add ts-jest -D -w
```
2. 在tsconfig.json 中添加如下类型：

```js
 "types": ["jest"]
```

3. 在当前目录中执行命令，创建对应的jest的配置文件

```js
npx ts-jest config:init
```
然后就会生成一个`jest.config.js`的文件

最好在进行`pnpm run test` 就可以成功啦！

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8cc6822cd0af45e1bccbc7aa22bb178e~tplv-k3u1fbpfcp-watermark.image?)

> [NO B B, SHOW ME CODE](https://github.com/cll123456/common-study/tree/master/my-vue3-code/4-init-project)
