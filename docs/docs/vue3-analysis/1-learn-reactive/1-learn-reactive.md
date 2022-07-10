

> 请仔细阅读下面代码，思考vue3是如何做响应式数据的?
```js
let temp
// reactive 是使对象变成一个代理
 const counter = reactive({ num: 0 });
 // effect主要职责是开启依赖收集，等待get的调用完成正常的依赖存储
 effect(() => (temp = counter.num));
 // 触发更新
  counter.num = 1;
```

> 在这里是不是有的人要说，咋们在日常开发中，直接在 `vue` 模板上里面写一个`ref` 自动帮我们进行了**开启**依赖收集,当我们调用get的时候去存储依赖。*事出反常必有妖*

在vue源码中的`renderer.ts` 中有这么这么个代码片段

```js
 const mountComponent: MountComponentFn = (
    initialVNode,
    container,
    anchor,
    parentComponent,
    parentSuspense,
    isSVG,
    optimized
  ) => {
  // ...省略其他
  
  // 这里会调用一个方法setupRenderEffect
  setupRenderEffect(
      instance,
      initialVNode,
      container,
      anchor,
      parentSuspense,
      isSVG,
      optimized
    )
  }
  
  const setupRenderEffect: SetupRenderEffectFn = (
    instance,
    initialVNode,
    container,
    anchor,
    parentSuspense,
    isSVG,
    optimized
  ) => {
   const componentUpdateFn = () => {
   // 省略组件更新逻辑
   }
   
    // 这一段话的意思是创建一个 ReactiveEffect 来保存每一个独立的proxy,
    // 和effect的效果是一样的
    const effect = new ReactiveEffect(
      componentUpdateFn,
      () => queueJob(instance.update),
      instance.scope // track it in component's effect scope
    )
  }
```
> 总结下，咋们在`模板`中使用 `ref`,`reactive`等是vue本身在渲染的时候就会把整个组件放入ReactiveEffect中进行依赖收集，对外抛出一个`run`方法，run方法用于决定是否需要进行依赖收集哦,对于`ref`处理普通数据准备另开篇幅


# reactive

reactive 是用于把对象变成一个代理对象，proxy


![image.png](https://img-blog.csdnimg.cn/img_convert/a6243291627d8f539b6f1502351a41cf.png)
```ts
function createReactiveObject(
  target: Target,
  baseHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<Target, any>) {
  // 核心就是 proxy
  // 目的是可以侦听到用户 get 或者 set 的动作

  // 如果命中的话就直接返回就好了
  // 使用缓存做的优化点
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }

  const proxy = new Proxy(target, baseHandlers);

  // 把创建好的 proxy 给存起来，
  proxyMap.set(target, proxy);
  return proxy;
}
```

# effect
effect 函数的作用是用于开启收集依赖，返回`run`函数

![image.png](https://img-blog.csdnimg.cn/img_convert/4f0c8bafb5aa921f2939c20ebbbec50e.png)
```ts
export function effect<T = any>(
  fn: () => T,
  options?: ReactiveEffectOptions
): ReactiveEffectRunner {
  const _effect = new ReactiveEffect(fn);

  // 合并选项
  extend(_effect, options);
  // 进来时候就对开启执行run开启依赖收集
  _effect.run();

  // 把 _effect.run 这个方法返回
  // 让用户可以自行选择调用的时机（调用 fn）
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

// 在ReactiveEffect run函数的内容是开启允许依赖收集
export class ReactiveEffect {
  active = true;
  deps = [];
  public onStop?: () => void;
  constructor(public fn, public scheduler?) {
    console.log("创建 ReactiveEffect 对象");
  }

  run() {
    // 运行 run 的时候，可以控制 要不要执行后续收集依赖的一步
    // 目前来看的话，只要执行了 fn 那么就默认执行了收集依赖
    // 这里就需要控制了

    // 是不是收集依赖的变量

    // 执行 fn  但是不收集依赖 
    if (!this.active) {
      return this.fn();
    }

    // 执行 fn  收集依赖
    // 可以开始收集依赖了
    shouldTrack = true;

    // 执行的时候给全局的 activeEffect 赋值
    // 利用全局属性来获取当前的 effect
    activeEffect = this as any;
    // 执行用户传入的 fn
    const result = this.fn();
    // 重置
    shouldTrack = false;
    activeEffect = undefined;

    return result;
   }
}

```
# baseHandlers
baseHandlers 是用于处理proxy里面的get和set的，当proxy调用get和set的时候就会去触发对应的函数

get操作的流程如下：



![image.png](https://img-blog.csdnimg.cn/img_convert/312c22b69f06803e4ecb6baeee540a32.png)
set 操作的流程如下：

![image.png](https://img-blog.csdnimg.cn/img_convert/67f8f23ef7ab66d5cd5ccee25f72392f.png)
```ts
export const mutableHandlers: ProxyHandler<object> = {
  get:(isReadonly = false, shallow = false) {
  return function get(target, key, receiver) {
   // 获取对target的key的值
    const res = Reflect.get(target, key, receiver);

    // 问题：为什么是 readonly 的时候不做依赖收集呢
    // readonly 的话，是不可以被 set 的， 那不可以被 set 就意味着不会触发 trigger
    // 所有就没有收集依赖的必要了
    if (!isReadonly) {
      // 在触发 get 的时候进行依赖收集
      track(target, "get", key);
    }

      // 把内部所有的是 object 的值都用 reactive 包裹，变成响应式对象
      // 如果说这个 res 值是一个对象的话，那么我们需要把获取到的 res 也转换成 reactive
    if (isObject(res)) {
      
      // res 等于 target[key]
      return isReadonly ? readonly(res) : reactive(res);
    }
    return res;
  };
},
// set值的时候触发
  set:(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver);

    // 在触发 set 的时候进行触发依赖
    trigger(target, "set", key);

    return result;
  };,
};
```

## track
在get的时候，通知进行依赖收集,


在进行依赖收集的时候，缓存传入的对象：

![image.png](https://img-blog.csdnimg.cn/img_convert/97141f54a6a7a0ef62cc6d62c2350946.png)

这里在缓存依赖的步骤是： 
- 第一步： 当运行`counter.num` 的时候会触发`proxy`的`get`方法
- 第二步： 全局有一个`targetMap`是一个`weakMap` 来记录`couter这个对象`是否存在，并且`weakMap的key`是 **couter**这个对象，存在则使用，不存在则创建,`counter`的`value`又是一个`Map`,里面记录着`counter里面的key`和`counter对象的key`是一一对应的
- 第三步： 在`map`中判断`key是 num`的是否存在，存在则使用，不存在则创建一个`Set`来保存当前的`ReactiveEffect` 对象，`ReactiveEffect `对象含有run方法等待trigger触发

```ts
export function track(target, type, key) {
  if (!isTracking()) {
    return;
  }
  // 1. 先基于 target 找到对应的 dep
  // 如果是第一次的话，那么就需要初始化
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    // 初始化 depsMap 的逻辑
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);

  if (!dep) {
    dep = createDep();

    depsMap.set(key, dep);
  }

 if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
    (activeEffect as any).deps.push(dep);
  }
}
```

## trigger
当对于track来说，trigger需要做的事情就会简单许多

```ts
export function trigger(target, type, key) {

  const depsMap = targetMap.get(target);

  if (!depsMap) return;

  // 暂时只实现了 GET 类型
  // get 类型只需要取出来就可以
  const dep = depsMap.get(key);

  // 省略其他逻辑
  
  // 触发run函数
  for (const effect of dep) {
    if (effect.scheduler) {
      // scheduler 可以让用户自己选择调用的时机
      // 这样就可以灵活的控制调用了
      // 在 runtime-core 中，就是使用了 scheduler 实现了在 next ticker 中调用的逻辑
      effect.scheduler();
    } else {
    // 触发函数
      effect.run();
    }
  }
}
```


# 自己实现
说了那么多，不如自己来实现一遍简单的响应式系统


![在这里插入图片描述](https://img-blog.csdnimg.cn/c575a30bc46b4cdf82b5deb1eeca807b.gif#pic_center)


> [源码地址 ](https://github.com/cll123456/my-study/blob/master/my-vue3-code/learn-reactive/my-reactive-sys.js)

