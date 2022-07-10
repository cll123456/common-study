---
theme: qklhk-chocolate
---
# 引言

<<往期回顾>>

1.  [手写vue3源码——创建项目](https://juejin.cn/post/7104559841967865863 "https://juejin.cn/post/7104559841967865863")
1.  [手写vue3源码——reactive, effect ,scheduler, stop](https://juejin.cn/post/7106335959930634254 "https://juejin.cn/post/7106335959930634254")
1.  [手写vue3源码——readonly, isReactive,isReadonly, shallowReadonly](https://juejin.cn/post/7106689205069152263 "https://juejin.cn/post/7106689205069152263")
4. [手写vue3源码——ref, computed](https://juejin.cn/post/7107231786895147015)

本期咋们就先放一放源码，咋们如何打包monorepo应用，主要是源码看累了🤣🤣🤣，打包工具也是一门必须课，所有的[源码请查看](https://github.com/cll123456/common-study/tree/master/vue3-analysis/8-finish-build)

# 效果
为了提供大家的学习兴趣，咋们先来看看效果，准备发车，请系好安全带🚗🚗🚗

![2022-06-12-17-01-37.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/76597410da724935aeb581ffb1bfc1bd~tplv-k3u1fbpfcp-watermark.image?)

## cjs 结果预览

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ecd7ac2b7b42476cb4c9a392ec3ed086~tplv-k3u1fbpfcp-watermark.image?)

## esm 结果预览

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd8a87f117fa4708a5142e43a26b8421~tplv-k3u1fbpfcp-watermark.image?)

## 声明文件预览

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c008742b3ed4b3fb9278561f92dbc34~tplv-k3u1fbpfcp-watermark.image?)

# 正文

`vue3`使用的是`rollup`来打包的，咋们也用`rollup`来打包咋们的应用，有不了解`rollup`的请[查看官网](https://rollupjs.org/guide/en/)，monorepo是多个单体仓库合并得到的，那么咋们就先来**打包单个仓库**，然后再来想办法怎么**一键打包全部**


## 打包shared
在我项目中，shared仓库是相当与`utils`函数的集合，用于对外导出一些工具函数,那么咋们可以在本目录下的`package.json`中安装`rollup`。
正当我就想在**shared目录下面安装rollup插件的时候**，我大脑给了个慢着的问号？



![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9e478d871d04c34b3a0a687cbce48a2~tplv-k3u1fbpfcp-watermark.image?)

**monorepo 是不是可以在跟下面安装依赖，然后子包都可以共享**，基于这一特征。我毫不犹豫在根目录下面敲下了下面的命令：


```ts
pnpm add rollup -w -D
```

有了rollup,咋们是不是需要在打包的目录下面来搞个配置文件`rollup.config.js`，里面咋们写上**入口，出口,打包的格式**等


```ts
// 由于咋们需要打包成cjs, ems的格式，对外导出一个函数吧

[
  {
    input: './src/index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'esm',
    },
  },
  {
    input: './src/index.ts',
    output: {
      file: 'dist/index.cjs.js',
      format: 'cjs',
    },
  }
 ]
```

然后在本目录下的package.json中加入打包的命令：


```ts
 "build": "rollup -c"
```
nice, 到这了就完了，咋们试一下，结果：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a30283e2939a45bdb441e65678490009~tplv-k3u1fbpfcp-watermark.image?)

> 分析错误可以发现，咋们是用了ts的语法，rollup无法转换ts的语法，需要使用插件了。😉😉😉

那么rollup转换ts的插件也是有好多种，这里咋们用一个最快的那种，`esbuild`, `rollup-plugin-esbuild`

```ts
pnpm add esbuild rollup-plugin-esbuild -w -D
```
关于`rollup-plugin-esbuild`这个插件，官方的介绍是说：
> [esbuild](https://github.com/evanw/esbuild) is by far one of the fastest TS/ESNext to ES6 compilers and minifier, this plugin replaces `rollup-plugin-typescript2`, `@rollup/plugin-typescript` and `rollup-plugin-terser` for you. 意思是说，这个插件是目前来说转换ts/esnext到es6是最快的编译和压缩，这个插件可以代替 `rollup-plugin-typescript2`, `@rollup/plugin-typescript` and `rollup-plugin-terser`的集合

但是如果咋们需要打包非常低版本的代码，那就请查看[rollup 实战第三节 打包生产](https://juejin.cn/post/6988747504791584799)打包低版本的代码.

言归正传，那么咋们把插件用上，在配置文件上加上插件


```ts
//... 省略其他
plugins: [
      esbuild({
        target: 'node14',
      }),
    ]
```

再来一次🤩🤩🤩

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/398e557194134320b182065cea132110~tplv-k3u1fbpfcp-watermark.image?)

通过结果，咋们可以看到已经打包成功了！🎉🎉🎉

但是咋们是有ts的，肯定还需要生成咋们代码的类型吧，那就使用 `rollup-plugin-dts`这个来生成

```js
pnpm add rollup-plugin-dts -w -D
```

> `rollup-plugin-dts`详情请[查看](https://www.npmjs.com/package/rollup-plugin-dts)


```ts
// 在数组后面在加上一项，
{
    input: './src/index.ts',
    output: {
      file: 'dist/index.dts',
      format: 'esm',
    },
    plugins: [
      dts(),
    ],
  },
```

然后就可以ok啦，咋们单个项目就完成了

# 打包多个
既然单个是这么写，那么其他的咋们是不是也可以写配置文件呢？对的，没错，可以在对应的单体项目下面写上`rollup.config.js`来对他们进行打包的配置

然后咋们在跟目录下面的package.json中加入一行命令：

```ts
"build": "pnpm -r --filter=./packages/** run build"
```
咋们来拆分下命令
1. `pnpm -r` 等同于 `pnpm --recursive`，意思是说**在工作区的每个项目中运行命令，不包括根项目**，[详情查看](https://pnpm.io/zh/cli/recursive)
2. ` --filter=./packages/**`意思是说，过滤其他文件和文件夹，**只使用packages下面的所有文件夹**
3. `run build` 是 pnpm -r run build的后缀，执行package.json中的build指令,详情[请查看](https://pnpm.io/zh/filtering)

合起来的意思是说，**依次执行packages里面所有文件夹的package.json的build命令**


# 优化
通过上面的方式咋们就可以打包成功了，但是这里咋们还可以进行优化下，每一次打包dist结果都需要手动删除，咋们可以使用 `rimraf` 这个库来帮我们自动删除


```ts
pnpm add rimraf -d -W
```

然后在每一个子包中修改build的命令


```ts
"build": "rimraf dist && rollup -c"
```

# 对比vue3打包
这里可能有的人会说，vue3仓库都不是这么玩的，的确，vue3仓库的打包流程如下：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/01be0711ba5449a59ab69037b3462a54~tplv-k3u1fbpfcp-watermark.image?)

有兴趣的可以取看源码哈，这里给出流程图，想要使用这种方式的就自己实现哈！🎃🎃🎃
