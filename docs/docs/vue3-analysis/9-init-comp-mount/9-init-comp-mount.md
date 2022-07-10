

# 引言
<<往期回顾>>

1.  [手写vue3源码——创建项目](https://juejin.cn/post/7104559841967865863 "https://juejin.cn/post/7104559841967865863")
1.  [手写vue3源码——reactive, effect ,scheduler, stop](https://juejin.cn/post/7106335959930634254 "https://juejin.cn/post/7106335959930634254")
1.  [手写vue3源码——readonly, isReactive,isReadonly, shallowReadonly](https://juejin.cn/post/7106689205069152263 "https://juejin.cn/post/7106689205069152263")
1.  [手写vue3源码——ref, computed](https://juejin.cn/post/7107231786895147015 "https://juejin.cn/post/7107231786895147015")
5. [vue3源码分析——rollup打包monorepo](https://juejin.cn/post/7108325858489663495)

接下来一起学习下，runtime-core里面的方法，本期主要实现的内容是，**通过createApp方法，到mount最后把咋们的dom给挂载成功!**，所有的[源码请查看](https://github.com/cll123456/common-study/tree/master/vue3-analysis/9-init-comp-mount)

# 效果

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1df6d2a8f9564b78912863b8f42d82d9~tplv-k3u1fbpfcp-watermark.image?)

咋们需要使这个测试用例跑成功！,在图中可以发现，调用app传入了一个render函数，然后挂载，对比期望结果！

# 测试dom
思考再三，先把这一节先说了，**jest是怎么来测试dom的？**

`jest`默认的环境是`node`，在`jest.config.js`中可以看到

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8cb4405c0854896a81116b137e9a911~tplv-k3u1fbpfcp-watermark.image?)

**npm有在node中实现了浏览器环境的api的库**，[jsdom](https://www.npmjs.com/search?q=jsdom)、[happy-dom](https://www.npmjs.com/search?q=happy-dom) 等，咋们这里就使用比较轻的happy-dom，但是happy-dom里面与jest结合是一个子包——[@happy-dom/jest-environment](https://github.com/capricorn86/happy-dom/tree/master/packages/jest-environment),那就安装一下


```ts
pnpm add @happy-dom/jest-environment -w -D
```
由于我项目示例使用的是monorepo,所以只需要在runtime-core中进行以下操作即可：

 在`jest.config.js`中修改环境

```ts
 testEnvironment: '@happy-dom/jest-environment',
```

然后你就可以在当前子包中使用正确运行测试用例了。

## 小问题
1. **全局的package.json运行的时候报错**，内容是没有dom环境
2. **vscode 插件 jest自动运行失败**

针对第一个问题，在上一节[vue3源码分析——rollup打包monorepo](https://juejin.cn/post/7108325858489663495)中我们可以知道,在全局可以执行packages中的每一个脚本，同理，我们做以下操作：

```ts
// 在全局的package.json中的test修改成这句话
 "test": "pnpm -r --filter=./packages/** run test",
```
那么就可以执行啦！

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b1fcccc78f143b99b4cf4444caa92dc~tplv-k3u1fbpfcp-watermark.image?)

第二个问题，这个是vscode的插件问题，我们可以重jest插件的文档入手，可以发现jest执行的时候，可以自定义脚本,解决办法如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/292becc0f50e409f93c7400cf4b763bf~tplv-k3u1fbpfcp-watermark.image?)

> 意思是说，jest自动执行的时候，直接执行我们项目的test脚本，由于第一个问题的解决，第二个问题也是ok的哦！🎉🎊

# 正文

> 在正文之前，希望您先看过本系列文章的 [vue3 组件初始化流程](https://juejin.cn/post/7103537295537979399)，这里详细介绍了组件的初始化流程，这里主要是实现挂载

## 测试用例

```js
describe('apiCreateApp', () => {
// 定义一个跟节点
  let appElement: Element;
  // 开始之前创建dom元素
  beforeEach(() => {
    appElement = document.createElement('div');
    appElement.id = 'app';
    document.body.appendChild(appElement);
  });
// 执行完测试后，情况html内部的内容
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('测试createApp,是否正确挂载', () => {
  // 调用app方法，传入render函数
    const app = createApp({
      render() {
        return h('div', {}, '123');
      }
    });
    const appDoc = document.querySelector('#app')
    // 调用mount函数
    app.mount(appDoc);
    expect(document.body.innerHTML).toBe('<div id="app"><div>123</div></div>');
  })
})

```

## 流程图

![vue3组件挂载流程图.drawio.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74f36ca065054e24881d35d1db98fdc3~tplv-k3u1fbpfcp-watermark.image?)

1. 一开始需要`createApp`,那咋们就给一个，并且返回一个mount函数
```ts
function createApp(rootComponent) {
  const app = {
    _component: rootComponent,
    mount(container) {
      const vnode = createVNode(rootComponent);
      render(vnode, container);
    }
  };
  return app;
}
```
2. mount内部需要创建`vnode`的方法，咋们也给一个，并且把跟组件作为参数传入

```ts
function createVNode(type, props, children) {
 // 一开始咋们就是这么简单，vnode里面有一个type,props，children这几个关键的函数
  const vnode = {
    type,
    props: props || {},
    children: children || []
  };
  return vnode;
}
```

3. 需要render函数，咋们也来创建一个，**并且内容只调用了patch，咋把这两个一起创建**


```ts
function render(vnode, container) {
  patch(vnode, container);
}

function patch(vnode, container) {
// patch需要判断vnode的type,如果是对象，则是处理组件，如果是字符串div,p等，则是处理元素
  if (isObj(vnode.type)) {
    processComponent(null, vnode, container);
  } else if (String(vnode.type).length > 0) {
    processElement(null, vnode, container);
  }
}
```

4. 咋们先处理组件吧,创建一个`processComponent`函数

```ts
// n1 是老节点，n2则是新节点，container是挂载的容器
function processComponent(n1, n2, container) {
// 如果n1不存在，直接是挂载组件
  if (!n1) {
    mountComponent(n2, container);
  }
}
```

5. 创建`mountComponent`方法来挂载组件

```ts
function mountComponent(vnode, container) {
  // 创建组件实例
  const instance = createComponentInstance(vnode);
  // 处理组件，初始化setup,slot，props， render等在实例的挂载
  setupComponent(instance);
  // 执行render函数
  setupRenderEffect(instance, vnode, container);
}
```
6. 创建组件的实例createComponentInstance

```ts
// 是不是组件实例很简单，就只有一个vnode,props,
function createComponentInstance(vnode) {
  const instance = {
    vnode,
    props: {},
    type: vnode.type
  };
  return instance;
}
```
7. 处理组件的状态, 这个函数里面会比较多内容

```ts
function setupComponent(instance) {
  const { props } = instance;
  // 初始化props
  initProps(instance, props);
  // 处理组件的render函数
  setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
  const Component = instance.type;
  const { setup } = Component;
  // 是否存在setup
  if (setup) {
    const setupResult = setup();
    // 处理setup的结果
    handleSetupResult(instance, setupResult);
  }
  // 完成render在instance中
  finishComponentSetup(instance);
}

function handleSetupResult(instance, setupResult) {
// 函数作为instance的render函数
  if (isFunction(setupResult)) {
    instance.render = setupResult;
  } else if (isObj(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  }
  finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
  const Component = instance.type;
  // 如果没有的话，直接使用Component的render
  if (!instance.render) {
    instance.render = Component.render;
  }
}
```

8. 创建setupRenderEffect，执行实例的render函数


```ts
function setupRenderEffect(instance, vnode, container) {
  const subtree = instance.render();
  patch(subtree, container);
}
```

9. 处理完组件，接下来该处理元素了 `processElement`

```ts
// 这个方法和processComponent一样
function processElement(n1, n2, container) {
// 需要判断是更新还是挂载
  if (n1) ; else {
    mountElement(n2, container);
  }
}
```
10. 挂载元素 `mountElement`

```ts
function mountElement(vnode, container) {
// 创建根节点
  const el = document.createElement(vnode.type);
  const { props } = vnode;
  // 挂载属性
  for (let key in props) {
    el.setAttribute(key, props[key]);
  }
  const children = vnode.children;
  // 如果children是数组，继续patch
  if (Array.isArray(children)) {
    children.forEach((child) => {
      patch(child, el);
    });
  } else if (String(children).length > 0) {
    el.innerHTML = children;
  }
  // 把元素挂载到根节点
  container.appendChild(el);
}
```

> 恭喜，到这儿就完成本期的内容，重头看一下，**vue组件的挂载分为两种，处理组件和处理元素，最终回归到处理元素上面，最后实现节点的挂载**,该内容是经过非常多删减，只是为了实现一个基本挂载，还有许多的边界都没有完善，后续继续加油🐱‍👓🐱‍👓🐱‍👓
