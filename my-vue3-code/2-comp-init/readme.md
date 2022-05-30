---
theme: qklhk-chocolate
---
> 学习完成响应式系统后，咋们来看看`vue3`组件的初始化流程

既然是看vue组件的初始化流程，咋们先来创建基本的代码，跑跑流程
（在app.vue中写入以下内容，来跑流程）
```js
import { h, ref } from "vue";

export default {
  name: 'App',
  setup() {
    const count = ref(0);

    return {
      count
    };
  },
  render() {
    return h('div', { pId: '"helloWorld"' }, [
      h('p', {}, 'hello world'),
      h('p', {}, `count的值是： ${this.count}`),
    ])
  }
}

```
# createApp
咋们在一开始调用createApp会发生什么事情呢？看下图:
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17f16bbc84954be090554385ce31c3ad~tplv-k3u1fbpfcp-watermark.image?)

在createApp 主要会发生这些事情：

- 在外部调用`createApp` 的时候，在函数内部会调用`ensureRenderer()`这个函数
- 在`ensureRenderer` 这个函数中,判断renderer是否存在，不存在则创建，并且传入一系列的api去初始化
```ts
function ensureRenderer() {
  // 如果 renderer 有值的话，那么以后都不会初始化了
  return (
    renderer ||
    (renderer = createRenderer({
      // 创建dom节点,div,li,等
      createElement,
      // 创建文本节点
      createText,
      // 给文本节点设置文本  node.nodeValue = text
      setText,
      //给dom设置文本 el.textContent = text;
      setElementText,
      // 对比更新属性方法
      patchProp,
      // 节点插入方法 parent.insertBefore(child, anchor)
      insert,
      // 移除节点 parent.removeChild(child);
      remove,
      ...
    }))
  );
}
```
- 在 `createRenderer` 中会直接调用 `createAppAPI` 这个方法，并且返回一个对象`{createApp: createAppAPI(render)}` 
- 最后在 `createAppAPI` 中调用 `createApp` 方法并且拓展了一个mount方法

```ts
export function createAppAPI(render) {
  return function createApp(rootComponent) {
    const app = {
      _component: rootComponent,
      mount(rootContainer) {
        const vnode = createVNode(rootComponent);
        // 调用 createAPI 里面传入的render方法
        render(vnode, rootContainer);
      },
    };
    return app;
  };
}
```

> 请注意图中有好几处方法的名称都是 createApp, 每一处的createApp的作用是不一样的，这里不是递归调用哦！


具体流程如下图

![mount 流程图.drawio.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c79ae5b4567e4189bda1bf6c95ec8dcb~tplv-k3u1fbpfcp-watermark.image?)

> 上图是整个mount阶段和更新阶段都会经过流程了，**是不是感觉有一丢丢的小复杂😆😆😆**

接下来咋们就单重我们代码的执行角度来分析下mount流程
# mount 

咋们把所有的update的去掉，他就是mount阶段了。

1. 在上面` createApp `的阶段后,咋们就能获取到**rootCompontent**，rootComponent是整个`APP.js` 导出的一个对象,**rootContainer** 则是需要挂载的真实dom节点；

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60f8c3b5c14e4d2e9999f3336482be4d~tplv-k3u1fbpfcp-watermark.image?)

2. 调用`createVNode`创建虚拟节点；

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c891606e5d54b7296133d3e54c14816~tplv-k3u1fbpfcp-watermark.image?)

3. 拿到虚拟节点后，调用 `render(vnode)`；
4. 在`render`中直接调用`patch(null, vnode, container)`方法，并传入对应的参数；
5. 传入的 `APP.js` 是一个组件，走组件处理逻辑并传入对应的参数`processComponent(n1, n2, container, parentComponent)`；
6. 由于传入的参数`n1`为null,那么进入组件的mount逻辑并传入对应的参数`mountComponent(n2, container, parentComponent);`；

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc6e01e2507042959bbda50333f591cc~tplv-k3u1fbpfcp-watermark.image?)

7. 在 `mountComponent ` 中需要经过三层处理，把组件渲染为 `render函数`和对**render函数进行依赖收集**

- 7.1  创建组件的实例

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79c21f34010f41988260bfd2c5a9b19b~tplv-k3u1fbpfcp-watermark.image?)

- 7.2 初始化组件的内容，在初始化组件内容中，会对组件的props,slots 等绑定到`instance`当中


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6737b99855a34a1fa95db911c578caca~tplv-k3u1fbpfcp-watermark.image?)

- - 7.2.1  在`instance`上面绑定**props**
- - 7.2.2  在`instance`上面绑定**slots**
- - 7.2.3 调用`setupStatefulComponent`给`instance`上面绑定其他的内容，并且把组件转成**render函数**
- - - 7.2.3.1 由于咋们`App.js`中是传了 `setup函数`的，所以接下来走**setup的流程**,调用 `createSetupContext(instance)`对**setup设置上下文**

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28c7140c9a364063a1ed13172ea2e3b7~tplv-k3u1fbpfcp-watermark.image?)
- - - 7.2.3.2 ` setup && setup(shallowReadonly(instance.props), setupContext)` 传入参数执行**setup函数并且获得setup函数的执行结果**
- - - 7.2.3.3 调用`handleSetupResult(instance, setupResult)`根据 `setup`函数的返回结果来做对应的事情

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4411506bff644277bae8c06b90eecfe3~tplv-k3u1fbpfcp-watermark.image?)

- - - 7.2.3.4 由于咋们的的setup返回的结果是一个object，所以给当前组件的**instance.setupState= proxyRef(setupResult)**， `proxyRefs` 的作用就是把 `setupResult` 对象做一层代理,方便用户直接访问 ref 类型的值

- - 7.2.4 咋们的`APP.js`到目前位置都还没有**render函数**，调用 `finishComponentSetup(instance);` 完成组件的setup操作，给实例赋值 render函数

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50753972798242cb942700814bd4a757~tplv-k3u1fbpfcp-watermark.image?)
- - - 7.2.4.1 由于咋们组件是传了**render函数**的，**所以直接把组件的render函数赋值给instance**

> 在这里咋们可以看到，**组件的render函数的优先级是高于template的**，只有组件里面没有写render函数，还会去编译模板里面的内容，并且放到组件中作为render函数

- - 7.2.5 上面`7.2.4 `主要就是为了给组件实例赋值好render函数，有了render函数，那么就需要来进行依赖收集啦!!! 调用 `setupRenderEffect(instance, initialVNode, container)` 来进行依赖收集
- - - 7.2.5.1  effect方法还记得吧😄😁😃[有不明白的请看这里](https://juejin.cn/post/7102419584459898894), 给实例赋值上一个update方法，方便后续的依赖trigger，在effect当中，会默认执行一次 `fn`；

```ts
instance.update = effect(componentUpdateFn, {
      scheduler: () => {
        // 把 effect 推到微任务的时候在执行
        // queueJob(effect);
        queueJob(instance.update);
      },
    });
```
- - - 7.2.5.2 调用 `componentUpdateFn` 来挂载组件

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c6c01bd6fe3425484b4bb1b248717ac~tplv-k3u1fbpfcp-watermark.image?)

- - - 7.2.5.3 调用`instance.subTree = normalizeVNode(instance.render.call(proxyToUse, proxyToUse)))` 获取子组件

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cac9585ba1654e83befb9a77b2ec97a6~tplv-k3u1fbpfcp-watermark.image?)

- - - 7.2.5.4 触发 `beforeMount hook`
- - - 7.2.5.5  调用 `patch(null, subTree, container, null, instance)` 方法来处理子组件

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c98476970c134dc09350f316dab182e2~tplv-k3u1fbpfcp-watermark.image?)
- - - 7.2.5.6 调用`processElement(n1, n2, container, anchor, parentComponent);` 来处理元素

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa52859395874a6b9af0ef99ab82e64b~tplv-k3u1fbpfcp-watermark.image?)
- - - 7.2.5.7 由于 **n1是空**，调用 `mountElement(n2, container, anchor)` 来挂载元素

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bcabfbd1cf224104aba9f63a21dcf71a~tplv-k3u1fbpfcp-watermark.image?)
- - - 7.2.5.8 调用 `hostCreateElement(vnode.type);`来创建真实的dom

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4b36f9084ea448696533810125c87ec~tplv-k3u1fbpfcp-watermark.image?)

- - - 7.2.5.9 根据**shapeFlag**来判断，由于咋们是有子组件的，调用` mountChildren(vnode.children, el)`则进入到挂载子组件

- - -7.2.5.10 依次传入参数，调用patch方法来patch子组件
- - - 7.2.5.11 重复 `7.2.5.7` 操作来传教子组件的真实dom

- - - 7.2.5.12 如果存在属性的话，遍历props，调用 `hostPatchProp(el, key, null, nextVal);`来给dom绑定值

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28d17ba380224cd1921a0f4a54535519~tplv-k3u1fbpfcp-watermark.image?)

- - - 7.2.5.13 执行 `beforemounted 钩子`
- - - 7.2.5.14 执行 `beforeEnter 钩子`
- - - 7.2.5.15 调用 ` hostInsert(el, container, anchor);` 插入真实节点,完成dom的渲染

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6cbad5138d647918496989b491581b7~tplv-k3u1fbpfcp-watermark.image?)

- - - 7.2.5.16 触发 mounted操作，完成组件的挂载
> 到了这一步，咋们就可以知道vue组件的挂载顺序是 **父 before mounted -> before mounted ->子 mounted -> 父mounted**类型与koa中间件执行的洋葱模型

- - - 7.2.5.17 执行 `mounted 钩子`
- - - 7.2.5.18 执行 `Entered 钩子`

> 不知不觉就到深夜了，这就是组件初始化的全部流程，有了init的流程后，在后续的更新其实就是差一个 vue diff 算法啦😃😃😃

源代码地址： 
