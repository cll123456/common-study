---
theme: qklhk-chocolate
---

# 引言
本次文章的内容需要基于上一个文章，如果没有看上一个的话，请看[手写vue3源码——reactive, effect ,scheduler, stop 等](https://juejin.cn/post/7106335959930634254),本次编写的所有源码均是单独的仓库，[详情请查看](https://github.com/cll123456/common-study/tree/master/vue3-analysis/6-finish-readonly-isReactive)



# readonly 

经过上一节的内容，咋们一起学习了，`reactive` 是怎么实现的，回顾下，**reactive 是返回了一个代理对象，通过proxy的第二个参数，传入 get, set, 当对象触发对象的get,set的时候，对依赖进行收集**

> 那么请思考，readonly需要怎么实现呢？

咋们先来分析下readonly的作用：**传入一个对象，对象只能get,不能set**，这个是不是比`reactive`简单许多哇，就是意味着，在`get`的时候也不用`trigger`啦，咋们还是从测试用例开始：


```ts
// 能被get
 test('readonly can get', () => {
    const origin = { a: 1 }
    const readonlyRes = readonly(origin)
    // get
    expect(readonlyRes.a).toBe(1)
  })
// 不能set
  test('readonly not to be set', () => {
    console.warn = jest.fn()
    const origin = { a: 1 }
    const readonlyRes = readonly(origin)
    readonlyRes.a = 2
    expect(console.warn).toBeCalled()
  })
```

根据上面的需求，咋们可以写出这样的代码：


```ts
export function readonly(obj){
    return new Proxy(obj, {
       get(target, key){
           return Reflect.get(target, key)
       },
       set(target,key, value){
           console.warn(`${key.toString()} 不能被set, 因为是readonly， ${target}`)
           return true
       }
    })
}
```

然后咋们可以运行下测试用例，会发现是ok的。

## 优化代码
有没有发现，咋们的`reactive`和`readonly`内部的代码结构基本上是相似的，那么咋们是不是可以对代码进行进一步的封装呢？

可以提取出一个公共的get方法`createGetter`


```ts
function createGetter(isReadonly = false) {
  return function (target, key, receiver) {
       const value = Reflect.get(target, key, receiver)
       // 非readonly的情况下，需要触发trigger来收集依赖
       if (!isReadonly) {
          // 依赖收集
          trigger(target, key)
          }
          return value
     }
}
```
其实代码还可以在优化，进一步封装，感兴趣的请[查看源码baseHandle](https://github.com/cll123456/common-study/blob/master/vue3-analysis/6-finish-readonly-isReactive/packages/reactivity/src/baseHandle.ts)

# isReactive 

`isReactive`相信好多同学也用过，**用于判断一个对象是否是 reactive的对象**

对于作用咋们可以写出这样的测试用例


```ts
test('测试传入的数据是否是reactive', () => {
    const origin = { num: 1 };
    const reactiveObj = reactive(origin);
    const reactiveData = isReactive(reactiveObj)

    // reactive true
    expect(reactiveData).toBe(true)

    // origin false
    const originData = isReactive(origin)
    expect(originData).toBe(false)
  })
```

接下来一起分析并实现这个功能

## 分析
1. 如果一个对象是响应式对象，**是不是意味着对象会返回一个proxy**，否则就是一个普通对象
2. 返回的是代理对象，那是不是意味了如果咋们在返回之前来访问对象的某个属性，就**意味着会触发proxy的get方法**
3. 那在get方法中知道访问一个**特殊的属性**，直接返回true,那么咋们是不是就可以在 `isReactive`方法中拿到返回结果

## 编码

```ts
// 先有一个函数 isReactive

/**
 * 判断一个数据是否是reactive数据
 * @param value 
 * @returns 
 */
export function isReactive(value) {
// !! 的意思是说，把结果转为Boolean，避免传入的内容不是一个reactive，就会自动转为false
  return !!value['__v_isReactive']
}

// 在createGetter 中加入一个判断

if(key === '__v_isReactive'){
    return true
}
```

测试用例就可以通过啦

# isReadonly 
实现了`isReactive`再来实现`isReadonly`是不是感觉很简单哇，这里就不进行分析啦，和上面`isReactive`的逻辑是一样的

测试用例：

```ts
test('测试传入的数据是否是readonly', () => {
    const origin = { num: 1 };
    const readonlyObj = readonly(origin);
    const readonlyData = isReadonly(readonlyObj)
    // readonly true
    expect(readonlyData).toBe(true)

    // origin false
    const originData = isReadonly(origin)
    expect(originData).toBe(false)
  })
```

实现内容如下：


```ts
export function isReadonly(value) {
  return !!value['__v_isReadonly']
}

// 在createGetter 中加入一个判断

else if(key === '__v_isReadonly'){
    return true
}
```
执行测试用例，发现是木有问题的，通过

# reactive， readonly嵌套对象转换
在做shallowReadonly之前，咋们先把reactive 和 readonly的如果是多层对象的话，也需要来进行响应式数据，怎么来做多层的数据呢？

来看测试用例：


```ts
test('测试嵌套的reactive数据', () => {
    const origin = {
      a: 1,
      nest: {
        b: 2,
        c: { a: 1 }
      }
    }

    const reactiveObj = reactive(origin)

    expect(isReactive(reactiveObj.nest)).toBe(true)

    expect(isReactive(reactiveObj.nest.c)).toBe(true)
  })
  
  test('测试嵌套的readonly数据', () => {
    const origin = {
      a: 1,
      nest: {
        b: 2,
        c: { a: 1 }
      }
    }

    const readonlyObj = readonly(origin)

    expect(isReadonly(readonlyObj.nest)).toBe(true)

    expect(isReadonly(readonlyObj.nest.c)).toBe(true)
  })
```

## 分析 
1. 如果想要让上面的测试用例通过，是不是需要把**nest的对象**再来返回一层代理即可哇
2. 在`createGetter`方法中，咋们来判断现在都到的数据是不是一个对象，如果是一个对象，则进行再一次的`readonly或者reactive`处理

测试用例：

```ts
test('测试shallowReadonly', () => {
    const origin = {
      a: 1,
      nest: {
        b: 2,
        c: { a: 1 }
      }
    }
    const shallowReadonlyObj = shallowReadonly(origin)

    expect(isReadonly(shallowReadonlyObj)).toBe(true)

    expect(isReadonly(shallowReadonlyObj.nest)).toBe(false)

  })
```
## 编码

```ts
//... 省略其他内容
if (isObj(value)) {
      return isReadonly ? readonly(value) : reactive(value)
 }
```

加上这个判断后，咋们的测试用例就ok了

# shallowReadonly

`shallowReadonly` 的作用是： **第一层是代理对象，内部不需要是代理对象**,这个是不是和上面的嵌套代理对象相反

## 分析
1. shallowReadonly 和readonly是不是也是有点相似，都是返回一个代理对象
2. 只是返回的代理对象只需要对第一层进行proxy,后面的就不需要了
3. 咋们是不是可以在createGetter在加上一个参数，来控制需不需要再一次进行代理



## 编码

```ts
/**
 * shallowReadonly
 * @param obj 
 * @returns 
 */
export function shallowReadonly(obj) {
  return new Proxy(obj, {
      get: createGetter(true,true),
      set(target,key, value){
           console.warn(`${key.toString()} 不能被set, 因为是readonly， ${target}`)
           return true
       } 
  })
}

// createGetter 增加参数 shallow
function createGetter(isReadonly = false, shallow = false) {
  return function (target, key, receiver) {
  // 省略其他逻辑
   const value = Reflect.get(target, key, receiver)
   if(shallow) return value
  }
} 
```

如此，则完成了这个测试用例
