---
theme: qklhk-chocolate
---

`reactive`, `effect` 大家都清除 ,但是对于`scheduler`, `stop`等方法是需要看源码咋们才能明白的😃😃😃，在上一节中，咋们用 **pnpm 搭建了一个和vue3一样的monorepo**，这一节中，就使用这个方式在里面填充`vue3`的源码吧！[本节的源码请查看](https://github.com/cll123456/common-study/tree/master/vue3-analysis/5-init-effect)

# 目标
本次目标主要是实现，**reactive，effect stop, onstop, scheduler** 等

为了方便大家的理解，这一次咋们就从 测试用例的角度，来写出源码，vue3的响应式相信大家都用过，那么用测试用例来描述则是这样的。


```ts
test('响应式数据测试', () => {
     // 创建一个响应式对象
    const origin = reactive({ num: 1 })
    let newVal;
    // 依赖收集
    effect(() => {
      newVal = origin.num
    })
    expect(newVal).toBe(1)

    // update 更新阶段
    origin.num = 2
    expect(newVal).toBe(2)
  })
```
> 在上面的测试用例中，有两个关键的函数`reactive`和`effect`,一个是创建响应式对象，另一个则是收集依赖，这个测试用例有点大，一次性实现不太方便，咋们可以把这任务拆分为更小的模块（**任务拆分**），分别写两个测试用例来测试`reactive`和`effect`

## reactive
看到`reactive` 想必都不陌生，传入一个对象，返回一个代理对象即可。那测试用例如下：


```ts
test('测试reactive', () => {
    let obj = { num: 1 }
    const proxyObj = reactive(obj)

    expect(obj).not.toBe(proxyObj)
    expect(proxyObj.num).toBe(1)

    // update set
    proxyObj.num = 2
    expect(obj.num).toBe(2)
  })
```
需求： 根据测试用例可以看出，调用`reactive`后，返回的**结果和原对象不是同一个**，并且**将代理对象数据发生改变后，原对象的数据也会相应改变**


```ts
export function reactive(obj) {
  if (!isObj(obj)) return obj;

  return new Proxy(obj, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver)
      // todo 依赖收集
      if (isObj(value)) {
        return reactive(value)
      }
      return value
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      // todo 触发依赖
      return result
    },
  })
}

```

根据上面代码，可以运行测试用例，发现是没有问题的**ヾ(≧▽≦*)o**,但是在这里还有两个**todo**没有实现，分别是**依赖收集**和**触发依赖**

## effect
effect函数可能有小伙伴不清除，这里解释下它的作用：**调用effect后，里面的函数会立马执行一次哦**,根据这个需要咋们写出以下测试用例：


```ts
test('effect是接受一个函数，当执行effect的时候，内部的函数会执行', () => {
    const fn = jest.fn();
    effect(fn)
    expect(fn).toBeCalledTimes(1)
  })
```

根据需要来实现下effect函数


```ts
export function effect(fn){
  fn()
}
```
上面的函数运行测试用例是没有问题的，但是咋们在深入一点，**effect的作用是在trigger的时候来收集当前的fn，并且对外提供一个run函数，我想啥时候调用就啥时候调用**，那么咋们是不是可以对fn进行包装一下。

```ts
class EffectReactive {
  fn: Function
   constructor(fn) {
    this.fn = fn
  }
  
  run(){
    this.fn()
  }
}

export function effect(fn){
  const _effect = new EffectReactive(fn)
  _effect.run()
}
```

对于effect的需要先到这儿，既然effect可以进行run函数了，接下来实现下`trigger` 和 `track`

## trigger 和 track
> 需求：
> 1. trigger是在get到时候进行依赖收集 
> 2. track 是在set的时候进行依赖触发，执行每一个fn

依赖收集收集的是fn, 那么在执行run的时候是不是可以来进行收集呢？，所以定义一个全局变量`activeEffect`，来保存，方便后续进行收集。
在class  EffectReactive 里面的run 加上：

```ts
activeEffect = this;
```
然后在来实现trigger和track

```ts
// 用于保存每一个target，提高效率
const targetMap = new WeakMap();

/**
 * 收集依赖 target（map） ---> key(map) ---> fn(set)
 * @param target 
 * @param key 
 */
export function trigger(target, key) {
 
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  // 获取key
  let deps = depsMap.get(key);
  if (!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }
  // 如果activeEffect不存在就不需要进行收集了
if (!activeEffect) return
  // 收集依赖
  deps.add(activeEffect)
}

/**
 * 依赖触发
 * @param target 
 * @param key 
 * @returns 
 */
export function track(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    return
  }
  let deps = depsMap.get(key);
  if (!deps) {
    return
  }
  // 依赖触发的时候进行变量每一个fn，进行执行，就可以完成响应式的数据更新
  deps.forEach(effect => {
   effect.run()
  })
}
```
> 到了这一步，就可以发现咋们一开始的那个测试用例就可以通过啦😄

## 返回`runner`
在effect函数中，咋们可以返回一个`runner`函数,runner可以进行手动调用，并且拿到**runner里面函数的结果**，测试用例如下：

```ts
test('effect 有返回值', () => {
    let num = 10;
    // effect有返回值
    const runner = effect(() => {
      num++;
      return 'num'
    })
    // effect 在一开始的时候会调用
    expect(num).toBe(11)

    // 执行runner，并且拿到返回值
    const r = runner()
    // effect内部也会执行
    expect(num).toBe(12)

    // 验证返回值
    expect(r).toBe('num')
  })
```
咋们来改造下代码，对于effect函数需要返回值，是不是直接在effect里面做这样的操作


```ts
return  _effect.run.bind(_effect)
```
> 注意： 在class EffectReactive 中存在this绑定，所以出处需要使用bind来绑定this


面试的话，一般到这里就结束了，但是咋们是手写源码，肯定还需要往下走😎🤞😎



##  scheduler
`scheduler`的意思是调度者，作用是 当`scheduler`存在的时候，**一开始scheduler不执行，当数据改变到时候，scheduler执行，run函数不执行，当手动调用scheduler里面的run函数的时候**,直接看测试用例

```ts
test('scheduler 调度器', () => {
    let dummy;
    let run;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    // should be called on first trigger
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    // // should not run yet
    expect(dummy).toBe(1);
    // // manually run
    run();
    // // should have run
    expect(dummy).toBe(2);
  })
```
根据需求来改造现有代码

在effect当中新增一个参数`options`，并且需要控制**run函数的执行**，run函数咋们是在track中进行执行的，所以咋们需要把`scheduler`传入到 EffectReactive 里面，给this进行绑定


```ts
// effect 函数
export function effect(fn, options: any = {}) {
  const _effect = new EffectReactive(fn, options.scheduler)
  ... 省略其他
  }
  
  // class EffectReactive 中做以下修改
  constructor(fn, public scheduler?) {
    this.fn = fn
    // 把scheduler 绑定在this当中，方便track中调用
    this.scheduler = scheduler
  }
  
  // track 函数做以下修改
  deps.forEach(effect => {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  })
```
> 这样的话，scheduler 的测试用例就能通过了， scheduler 的作用个人觉得可以用于 频繁修改数据，需要响应式，有点类似节流操作


##  stop
stop的作用是 **停止数据响应，只有手动触发run的函数，数据才能够完成响应**
，请查看测试用例

```ts
test("stop 停止响应", () => {
    let dummy;
    const obj = reactive({ prop: 1 });
    const runner = effect(() => {
      dummy = obj.prop;
    });
    obj.prop = 2;
    expect(dummy).toBe(2);
    stop(runner);

    obj.prop = 3

    expect(dummy).toBe(2);

    // stopped effect should still be manually callable
    runner();
    expect(dummy).toBe(3);
  });
```
看到stop是需要传入一个runner,这个runner是啥，就是咋们的effect函数的返回值，所以先改造下effect函数


```ts
  const runner = _effect.run.bind(_effect)
  return runner
```

还需要一个stop函数


```ts
/**
 * 停止响应式更新
 * @param runner 
 */
export function stop(runner) {
// 这里临时代码
  runner.stop()
}
```
> 这里请思考， **runner 是effect, 控制run 是在 class EffectActive中，所以咋们还需要来改造下effect函数，把effect绑定在runner上**

```ts
  const runner = _effect.run.bind(_effect)
  // 这样就可以在class EffectActive中 进行stop控制了
  runner.effect = _effect
  return runner
```
对于对外暴露的stop也需要做相应的变化


```ts
 runner.effect.stop()
```

接下来在class EffectActive中 实现stop函数，请分析下stop函数应该怎么实现？

1. 需要控制run函数的执行，是不是只需要把trigger中收集到的依赖进行清空哇,😄
2. trigger中只会收集依赖，咋们怎么进行反向收集呢？ 只需要在`class EffectActive`中用一个数组来接收，然后在trigger中来进行反向收集
3. 在`class EffectActive` 中来实现清空操作即可

修改代码

```ts
// 在class EffectActive 中增加以下代码
export class EffectReactive {
  fn: Function;
  // 保存正则执行的effect,用于清除
  deps = []
  // 省略构造函数和run方法
  
  stop(){
   effect.deps.forEach(effectSet => {
    effectSet.delete(effect)
  })
  effect.deps.length = 0
  }
 }
 
 // 在trigger中进行反向收集
 // 收集依赖
  deps.add(activeEffect)
  activeEffect.deps.push(deps)
  
```

> 这样的话就可以完成测试用例了😄

在这里还可以进行优化下stop的调用，就是说在同一个 `EffectActive`实例中只调用一次，解决办法则是在class 中加一个变量（active）**锁**即可,[详情查看](https://github.com/cll123456/common-study/blob/master/vue3-analysis/5-init-effect/packages/reactivity/src/effect.ts)

### 插曲
这里有一个问题，如果测试用例的 ` obj.prop = 3` 改成 `obj.prop++`,测试用例就会有问题啦🙄🙄🙄，分析下问题，`obj.prop = 3` 和 `obj.prop++`的区别是，**前者只触发set方法，而后者是先触发get方法，然后在触发set方法，触发了get方法是不是又会触发trigger来收集依赖哇**，所以 `obj.prop++` 在测试用例是会报错的哦！

那么如何解决呢？

咋们一起来分析下：

1. 咋们是不是需要在trigger中来控制是否需要依赖收集，这里是不是可以定义一个全局变量(shouldTrack)默认是false
2. 在 `class EffectActive` 中的run方法里面来控制变量，在run之前需要,run完之后就不需要了，如果是调用了stop后调用run就直接执行fn即可

改造源码

```ts
// 在track中加上一个控制条件
 if (!shouldTrack) return
 
 // 修改 class EffectActive 
 // 调用stop后不需要收集依赖
    if (!this.active) {
      activeEffect = this;
      return this.fn()
    }

    // 收集依赖
    shouldTrack = true;
    activeEffect = this;

    const result = this.fn();

    // 执行fn后停止收集依赖
    shouldTrack = false;

    return result
```

> 这样就可以通过测试用例了

## onStop
onStop 是一个stop后的回调函数，这个功能我把测试用例写出来，实现留个各位看官老爷


```js
test("events: onStop", () => {
    const onStop = jest.fn();
    const runner = effect(() => {}, {
      onStop,
    });

    stop(runner);
    expect(onStop).toHaveBeenCalled();
  });
```
# 结果

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03e6c1b0039741dc9db44f4abe5b5b9d~tplv-k3u1fbpfcp-watermark.image?)
所有测试都完成通过
