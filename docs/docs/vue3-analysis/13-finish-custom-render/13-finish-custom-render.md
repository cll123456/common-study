---
theme: qklhk-chocolate
---

# 引言
<<往期回顾>>

1.  [vue3源码分析——rollup打包monorepo](https://juejin.cn/post/7108325858489663495 "https://juejin.cn/post/7108325858489663495")
1.  [vue3源码分析——实现组件的挂载流程](https://juejin.cn/post/7109002484064419848 "https://juejin.cn/post/7109002484064419848")
1.  [vue3源码分析——实现props,emit，事件处理等](https://juejin.cn/post/7110133885140221989 "https://juejin.cn/post/7110133885140221989")
1.  [vue3源码分析——实现slots](https://juejin.cn/post/7111212195932799013 "https://juejin.cn/post/7111212195932799013")
5. [vue3源码分析——实现组件通信provide,inject](https://juejin.cn/post/7111682377507667999)

本期来实现， **vue3的自定义渲染器，增加runtime-test子包**，所有的[源码请查看](https://github.com/cll123456/common-study/tree/master/vue3-analysis/13-finish-custom-render)

# 正文
`createRenderer`的作用是： **实现vue3的runtime-core的核心，不只是仅仅的渲染到dom上，还可以渲染到canvas,webview等指定的平台**

>请思考🤔🤔🤔，createRenderer是怎么做到的呢？


# 设计createRenderer函数
createRenderer顾名思义就是创造一个`render`(可以直接导出一个render函数),现在咱们的是直接在`render.ts`中对外导`render函数`出提供给createApp中使用


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24cbd4e00c8b40e4862d449523ef55cd~tplv-k3u1fbpfcp-watermark.image?)

对于createApp而言，需要render函数，那么咱们可以通过函数的参数穿进来，那就变成这个样子的形式


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0cb034c687cf4350804a63cd3dfcbd22~tplv-k3u1fbpfcp-watermark.image?)

## 编码


```ts
// 通过上面的分析，先把createApp给改造一下,需要一个新的函数来包裹，并且传入render函数

export function createAppApi(render){
 return function createApp(rootComponent){
  // ……原有的逻辑不变
 }
}

// 在createAppApi里面需要render，那就在createRenderer里面调用并且给他，
// 返回一个新的createApp
export function createRenderer(){
     function render(vnode, container) {
        // 调用patch
        patch(vnode, container, null)
      }
 // ……省略其他所有的函数
 
 return {
  // 这样设计是不是对外导出了一个新的createAPP哇
  createApp: createAppApi(render)
 }
}
```


# 渲染平台

既然是自定义渲染平台，那肯定是需要修改元素的挂载逻辑，并且把需要挂载的平台给传入进来


## 分析

**目前代码里面默认是渲染到dom**，在mountElement里面使用了`document.createElement`, `dom.setAttribute`, `dom.innerHtml`等逻辑都是用来处理dom操作，其他的平台挂载元素的方式是不一样的，那么怎么解决这个问题呢？

需要解决这个问题，也是非常简单的，既然咱们不知道是挂载到哪里，那直接通过`createRenderer`里面传入进来就ok啦😄😄😄
目前用到的主要是四个地方涉及到dom操作，把这四个地方统统封装成函数，然后通过`createRenderer`里面作为options里面传入即可

## 编码

```ts
在createRenderer里面加入参数options,并且结构出四个函数

export function createRenderer(options) {
  const {
   // 创建元素
    createElement,
    // 绑定key
    patchProps,
    // 插入操作
    insert,
    // 设置文本
    setElementText
  } = options
  
  
    function mountElement(vnode: any, container: any, parentComponent) {
        const el = createElement(vnode.type)
    // 设置vnode的el
    vnode.el = el
    // 设置属性
    const { props } = vnode

    for (let key in props) {
      patchProps(el, key, props[key])
    }
    // 处理子元素
    const children = vnode.children
    if (vnode.shapeflag & ShapeFlags.ARRAY_CHILDREN) {
      // 数组
      mountChildren(children, el, parentComponent)
    } else if (vnode.shapeflag & ShapeFlags.TEXT_CHILDREN) {
      // 自定义插入文本
      setElementText(el, String(children))
    }
    // 挂载元素
    insert(el, container)
    }
  }
```
> 这么改造，目前`createRenderer`的功能实现了，但是会发现所有用的`createApp`的测试用例都不行了，**由于咱们没目前没有对外导出createApp**。

# runtime-test
从目前来说，本块的内容可以说是 `runtime-dom`,因为`runtime-test`对外提供的确实是dom环境的测试，方便用于`runtime-core`的测试

> 新建子包的过程不在这里描述哈，有兴趣的可以[查看](https://juejin.cn/post/7104559841967865863)

`runtime-test`需要的依赖是：


```ts
 "dependencies": {
    "shared":"workspace:shared@*",
    "runtime-core":"workspace:runtime-core@*"
  }
```

## 分析
`runtime-test`的作用是对外提供一个`createApp`函数，那就需要调用createRender来创建一个customRender，customRender里面有createApp函数。 调用createRender又需要传入一个options,options是我们当前对应平台的4个函数，分别是：

- createElement： 创建dom
- patchProps: 处理属性
- insert: 将某个元素插入到哪里
- setElementText： 设置文本

## 编码

```ts
function createElement(type) {
  return document.createElement(type);

}

function patchProps(el, key, value) {

  if (isOn(key)) {
    // 注册事件
    el.addEventListener(key.slice(2).toLowerCase(), value)
  }
  el.setAttribute(key, value)
}


function insert(el, container) {
  container.append(el)
}

function setElementText(el, text) {
  el.textContent = text;
}

const render: any = createRenderer({
  createElement,
  patchProps,
  insert,
  setElementText
});

// 对外导出createApp
export function createApp(...args) {
  return render.createApp(...args);
}
// 需要使用runtime-core里面的所有内容，因为里面有的变量是在闭包中进行使用的
export * from 'runtime-core'
```

>思考🤔🤗🤔： 处理完`runtime-test`就需要在`runtime-core`中进行引用，**直接在runtime-core中引用么？**

那肯定是不行的，`runtime-test`里面引用`runtime-core`,如果`runtime-core`在引用`runtime-test`的话，**那就是循环引用了**,𝒮ℴ, 𝒽ℴ𝓌 𝓉ℴ 𝓇ℯ𝓈ℴ𝓁𝓋ℯ 𝒾𝓉 ?

解决方式： 
**在上一级的package.json上加入runtime-test这个包，那么在runtime-core中就能引用啦！**😝😝😝

# 测试效果

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab00f45a05084bd88ae7424944279ac1~tplv-k3u1fbpfcp-watermark.image?)
