

# 引言

往期回顾

1. [手写vue3源码——创建项目](https://juejin.cn/post/7104559841967865863)

2. [手写vue3源码——reactive, effect ,scheduler, stop ](https://juejin.cn/post/7106335959930634254)
3. [手写vue3源码——readonly, isReactive,isReadonly, shallowReadonly](https://juejin.cn/post/7106689205069152263)

本期主要实现的api有，**ref, isRef, unRef, proxyRefs, computed**，本次所有的[源码请查看](https://github.com/cll123456/common-study/tree/master/vue3-analysis/7-finish-ref-computed)
# ref 
在代码中，`ref`这个api也是用的很频繁的,所以今天咋们就一起来实现下

## 功能分析
> ref处理的数据有两种， **原始值类型**和**引用值类型**,不管是`get`原始值还是引用类型的值都需要使用`.value`的形式来获取，`set`的时候也是同用的需要使用`.value`来进行操作

**既然都需要使用 .value，是不是意味着，传入的数据都会被一个对象所包裹**，基于这个特点，咋们是否可以使用**class 里面有get, set 方法**呢？class 本身是一个实例对象，刚好里面的get,set 可以对属性进行**拦截存取行为**， [详情请查看es6阮一峰class](https://es6.ruanyifeng.com/#docs/class)


## ref处理普通值

处理普通值的时候，**ref在使用get的时候，需要使用 .value 来获取值**

### 测试用例
```ts
test('ref 处理普通值 get', () => {
    const aRef = ref(1)
    // ref 会有一个value属性
    expect(aRef.value).toBe(1)
    
    aRef.value = 2;
     expect(aRef.value).toBe(2)
  })
```
### 编码

```ts
/**
 * 把数据变成一个ref
 * @param val 
 * @returns 
 */
export function ref(val) {
  return new Ref(val)
}

class Ref{
  private _value: any;
  constructor(value) {
    this._value = value
  }
  
  get value(){
      return this._value
  }
  
  set value(val){
    this._value = val
  }
}
```
这样写的话，ref处理普通值的场景就ok了，上面的测试用例也是可以通过的

> 给ref进行一个包装，调用的 `.value` 其实是调用`Ref class` 的一个`get方法`，有没有发现ref的value是这么来的


## ref 处理对象
我们知道，ref也是可以处理对象的，处理对象的时候，调用的是 `reactive`方法来进行包装

> 这里为啥要调用reactive来包装对象呢？

**ref绑定的数据是双向数据绑定的**，需要对 **对象内部的属性进行劫持**，就是说对象里面的内容发生变化，要能够接收到通知，然后进行数据更新操作

### 测试用例
根据ref处理对象，咋们可以写出测试用例

```ts
test('ref 处理对象', () => {
    const aRef = ref({ a: 1, b: 2 })
    // ref 会有一个value属性
    expect(aRef.value.a).toBe(1)

    expect(isReactive(aRef.value)).toBe(true)
    // update
    aRef.value.b = 4;
    expect(aRef.value.b).toBe(4)
  })
```

### 编码
修改之前的代码，**在这里对于构造函数的数据做一个是否是对象的判断和set值的时候，也需要对set的值做判断**


```ts


  constructor(value) {
    // 判断value是否是对象,对象直接调用reactive
    this._value = isObj(value) ? reactive(value) : value
  }
  
  // 省略其他
  
   set value(val){
    this._value = isObj(val) ? reactive(val) : val
  }
```

这样的话，咋们的测试用例是可以通过的，完了么，no, ref也需要和reactive一样，**在get数据的时候进行track, 修改数据的时候进行 trigger**

## 处理 track 和 trigger
这里咋们先看vue给出的一个官方的测试用例，通过测试用例来分析功能

### 测试用例

```ts
test('ref 把数据变成响应式', () => {
    const a = ref(1);
    let dummy;
    let calls = 0;
    // 依赖收集
    effect(() => {
      calls++;
      dummy = a.value;
    });
    expect(calls).toBe(1);
    expect(dummy).toBe(1);
    // update
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
    // same value should not trigger
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
  })
```

### 分析
通过上面的测试用例，咋们可以分析出以下需求： 

1. a.value = 2时，后面的数据都进行的改变，说明这个是触发依赖，既然有触发依赖，那么咋们肯定是需要进行依赖收集的
2. 当再一次调用 a.value = 2时，会发现 calls 的值没有变化，说明在set中做了新值与旧值的控制


既然要进行依赖收集，那在我们`ref`中怎么来进行依赖收集呢？

1. 毫无疑问的是 —— 收集依赖肯定是在` get value `函数中进行的，而触发依赖是在 set 函数中进行，但是需要与effect进行联动，**就会用到effect里面的activeEffect 和 shouldTrack 等**，这里需要注意.

2. 控制新旧值的变化也是在set中完成的


### 编码

```ts
// 在 effect模块中咋们可以抽离出以下几个函数来空供我们ref模块使用

/**
 * 收集effect
 * @param deps 
 * @returns 
 */
export function trackEffect(deps) {
  // 存在的话，不需要反复收集
  if (deps.has(activeEffect)) return
  // 收集依赖
  deps.add(activeEffect)
  activeEffect.deps.push(deps)
}

/**
 * 是否可以进行依赖收集
 * @returns 
 */
export function tracking() {
// 可以进行track和activeEffect 有值
  return shouldTrack && activeEffect
}

/**
 * 遍历触发依赖
 * @param deps 
 */
export function triggerEffect(deps) {
  deps.forEach(effect => {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  })
}


// 来改造咋们的class
class Ref {
  private _value: any;
  // 收集的ref依赖
  private deps

  // 原始值，由于对象会被转成proxy,所以咋们需要保存一个原始的值，用于控制值是否改变
  private _rawVal: any;

  constructor(value) {
    // 判断value是否是对象,对象直接调用reactive
    this._value = isObj(value) ? reactive(value) : value
    this._rawVal = value
    this.deps = new Set()
  }

  get value() {
    // 进行依赖收集
    if (tracking()) {
      trackEffect(this.deps)
    }
    return this._val
  }

  set value(val) {
    // 数据没有发生改变，不需要重新trigger
    if (!hasChanged(val, this._rawVal)) return
    this._rawVal = val;
    this._value = isObj(val) ? reactive(val) : val
    triggerEffect(this.deps)
  }
}
```

> 通过这里咋们可以分析出，ref的响应式其实是通过包装了一层实例对象，**通过劫持实例对象的 get 和 set 方法来做到的**，而为啥需要使用value呢？因为get和set的是方法，value可以被咋们改成任何的名称

# isRef
`isRef`是用于**判断一个对象是否被 Ref 实例对象所包裹**

对于这个api，咋们怎么实现呢？有了`isReactive`和`isReadonly`的基础，我相信你不难想到，也是同样的配方，熟悉的味道。

## 测试用例

```ts
test('isRef', () => {
    const a = ref(1);
    expect(isRef(a)).toBe(true);

    const b = 1;
    expect(isRef(b)).toBe(false);

    const c = reactive({ a: 1 })
    expect(isRef(c)).toBe(false);
  })
```

## 编码

```ts
/**
 * 判断传入的数据是否是ref
 * @param val 
 * @returns 
 */
export function isRef(val) {
  return !!val._v__is_ref
}
// 接下来在我们的class中加一个_v__is_ref属性，并且设置为true即可

 public _v__is_ref = true
```

# unRef

`unRef`api是用于 **当你.value 用的太繁琐的时候，不知道你后面的值到底有没有 .value**，说白了就是说你不想写.value 就用这个api来进行包裹一下就行


```ts
/**
 * 把ref数据变成origin数据
 * @param val 
 * @returns 
 */
export function unRef(val) {
  return isRef(val) ? val.value : val
}
```

# proxyRefs

`proxyRefs`用的人估计不是很多，但是用了 setup的人都知道， setup返回的数据，**不管有没有.value 当你在模板中使用的时候，都可以省略.value**，setup返回的结果就调用了这个api


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98416ada8a644b73869c633b6e9bd134~tplv-k3u1fbpfcp-watermark.image?)

## 测试用例

```ts
 test('proxyRefs', () => {
    const user = {
      age: ref(10),
      name: "twinkle",
    };
    const proxyUser = proxyRefs(user);
    // 不改变原数据结构
    expect(user.age.value).toBe(10);
    expect(proxyUser.age).toBe(10);
    expect(proxyUser.name).toBe("twinkle");

    // set 赋值普通值
    proxyUser.age = 20;
    expect(proxyUser.age).toBe(20);
    expect(user.age.value).toBe(20);
    
    // set 赋值ref
    proxyUser.age = ref(10);
    expect(proxyUser.age).toBe(10);
    expect(user.age.value).toBe(10);
  })
```
## 分析

通过上面的测试用例，咋们可以分析出以下需求:

1. `proxyRefs`可以对数据进行get和set,并且还要做对应的处理
2. 在 get的时候，会自动的把.value给省略掉
3. 在set的时候，需要区分是普通值还是ref

实现功能
1. 对于需要劫持对象，肯定使用proxy来进行劫持
2. 在get数据的时候，判断获取的结果是ref还是普通的，ref的话，默认调用.value
3. 对于set的话，需要判断set的内容是不是ref,并且需要判断，set之前的值是啥类型
- - 如果set的内容是普通值，并且原来的值是ref的话，需要调用.value来赋值
- - 否则的话，直接替换即可

## 编码

```ts
/**
 * 
 * @param obj 
 * @returns 
 */
export function proxyRefs(obj) {
  return new Proxy(obj, {
    get(target, key) {
      const val = Reflect.get(target, key)
      // 返回的结果进行判断
      return isRef(val) ? val.value : val
    },
    set(target, key, val) {
      // set -> target[key] is ref && val not is ref 
      if (isRef(target[key]) && !isRef(val)) {
        return target[key].value = val
      } else {
        return Reflect.set(target, key, val)
      }
    }
  })
}
```

# computed
`computed`这个api大家基本上都会使用，**传入一个fn或者是自定义get，set， 返回一个对象，并且需要使用 .value 来调用里面的内容**，看到.value是不是感觉和ref是一样的结构😀😀😀，来一个class给它包装以下即可。

## 测试用例
先来简单测试用例,自己也可以动手敲一敲哦~~~✌✌✌

```ts
test('测试computed函数结果', () => {
    const a = computed(() => 1)
    expect(a.value).toBe(1)
  })
```

要实现上面内容是不是和ref是一样的，只不过传的内容不一样而已，这里就省略了哈，

来一个复杂一点点的测试用例

```ts
 it('computed', () => {
    const value = reactive({})
    const getter = jest.fn(() => value.foo)
    const cValue = computed(getter)

    // lazy
    expect(getter).not.toHaveBeenCalled()

    expect(cValue.value).toBe(undefined)
    expect(getter).toHaveBeenCalledTimes(1)

    // should not compute again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(1)

    // should not compute until needed
    value.foo = 1
    expect(getter).toHaveBeenCalledTimes(1)

    // now it should compute
    expect(cValue.value).toBe(1)
    expect(getter).toHaveBeenCalledTimes(2)

    // // should not compute again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(2)
  })
```

## 分析
根据上面的测试用例，咋们可以分析以下需求：

1. computed接收一个fn函数,并且一开始该函数不执行，最后函数返回一个对象 ，带有 .value
2. 第一次调用 .value fn会执行一次，等后续调用则不执行
3. 改变fn内响应式对象的值，fn还是不执行
4. 当调用 .value 时， fn则会执行

综上所述， **computed会对fn进行缓存，只有内容变化，且调用了computed的返回值的.value才会去执行fn**

对应的解决措施
1. 需要带有 .value 那咋就给他用 class来进行包裹一下，并且处理value方法的get和set
2. 这里需要控制fn的执行，需要对fn进行依赖收集和依赖触发，收集肯定是在get中进行收集，**触发的话咋们可以在 EffectReactive class 钩子函数的 scheduler 函数中进行触发**,对于scheduler 有不清楚的请查看 [手写vue3源码——reactive, effect ,scheduler, stop ](https://juejin.cn/post/7106335959930634254)
3. 数据没有变化的时候需要做缓存，那么可以使用flag来解决

## 编码

```ts
export function computed(fn) {
  return new ComputedRefImpl(fn)
}

class ComputedRefImpl{
  // 传入的fn
  private getter: any
  private readonly setter: any
  private _value: any
  // 是否可以执行
  private _dirty = true
  // 收集getter的依赖
  private deps;
  // 当前的effect
  private effect

  constructor(getter) {
    this.getter = getter
    this.deps = new Set()

    this.effect = new EffectReactive(this.getter, () => {
      if (!this._dirty) {
        this._dirty = true
        // 触发依赖
        triggerEffect(this.deps)
      }
    })
  }

  get value() {
    // 收集依赖
    if (tracking()) {
      trackEffect(this.deps)
    }
    // 用于缓存执行结果
    if (this._dirty) {
      this._dirty = false
      this._value = this.effect.run()
    }
    // 返回结果
    return this._value
  }
}
```

> 这里咋们会发现computed设计的非常巧妙，如下图


![computed流程图.drawio.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6efac73fcff42d98d7b650fc57d9ab3~tplv-k3u1fbpfcp-watermark.image?)

这里来分析一下：

1. 在初始化 `ComputedRefImpl` 的时候就完成， `deps, effect, getter`的初始化,但是对于EffectReactive而言的话，完成了 `fn, scheduler`的初始化
2. 当第一次调用 get value的时候判断当前的`activeEffect`是否存在，存在的话对收集依赖
3. 然后判断`get .value`是否第一次调用，第一次的话则进行`effect`中调用run方法，否则返回历史run方法值的结果，然后把dirty设置为false作为缓存fn执行的结果
4. 调用run方法的时候会把`activeEffect`赋值为`this`, 执行`fn`函数，最后反正`fn`函数的结果
5. 执行fn函数的通知，会对 `fn`内部使用到的响应式数据进行`track`
6. 等待fn内响应式数据发生变化，然后触发在fn函数内收集到的effect函数并且进行遍历执行
7. 在遍历的过程中需要判断`effect`中是否存在 `scheduler`函数，存在的话则执行该函数
8. 在`scheduler`函数中，会把`dirty`重置为`true`,标志着`computed`内容`fn`数据有变化，需要重新执行`fn`,并且会把在`get value`中收集到的依赖进行`trigger`
9. 等待 执行 `get value`，更新数据

## 彩蛋🎈🎈🎈
> computed 其实可以存入一个对象，对象中可以自己定义get,set，自己可以实现下，有兴趣的同学可以查看源码，源码中实现了get和set哦~~~
