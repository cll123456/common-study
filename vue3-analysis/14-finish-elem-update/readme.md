---
theme: qklhk-chocolate
---

# 引言
<<往期回顾>>

1.  [vue3源码分析——实现组件通信provide,inject](https://juejin.cn/post/7111682377507667999 "https://juejin.cn/post/7111682377507667999")
2. [vue3源码分析——实现createRenderer，增加runtime-test](https://juejin.cn/post/7112349410528329758)

本期来实现， **vue3更新流程，更新元素的props,以及更新元素的child**，所有的[源码请查看](https://github.com/cll123456/common-study/tree/master/vue3-analysis/14-finish-comp-update)

# 正文
> 上期文章增加了`runtime-test`的测试子包，接下来的所有代码都会基于该库来进行测试,vue3是怎么做到element的更新呢，更新的流程是咋样的呢？请看下面流程图


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97e1fa7c44b44346b43b3ab9dcc6c620~tplv-k3u1fbpfcp-watermark.image?)

## 分析

在上面流程图中，如果在`setup`中有一个对象`obj`,并且赋值为` ref({a:1})`，然后通过某种方式重新赋值为**2**，就会触发更新流程；

1. 在**set操作中，都会进行trigger**;
2. `trigger` 后则是执行对于的**run方法**;
3. 最后是这个`run`是通过`effect`来进行收集 

> attention！！！🎉🎉🎉
>
>  effect 来收集的run函数是在哪里收集，收集的是啥呢？


effect收集依赖肯定是在`mountElement`里面，但是具体在哪里呢？在`mountElement`中，里面有三个函数

- `createComponentInstance`:创建实例
- `setupComponent`: 设置组件的状态,设置render函数
- `setupRenderEffect`: 对组件**render**函数进行依赖收集

看到上面三个函数，想必大家都知道是在哪个函数进行effect了吧！😊😊😊

## 编码流程

```ts
// 改造setupRenderEffect函数之前，需要在实例上加点东西，判断是否完成挂载，如果完成挂载则是更新操作，还有则需要拿到当前的组件的children tree

export function createComponentInstance(vnode, parent) {
  const instance = {
   ...其他属性
    // 是否挂载
    isMounted: false,
    // 当前的组件树
    subtree: {}
  }
}

 function setupRenderEffect(instance: any, vnode: any, container: any) {
 //  添加effect函数
    effect(() => {
      if (!instance.isMounted) {
        // 获取到vnode的子组件,传入proxy进去
        const { proxy } = instance
        const subtree = instance.render.call(proxy)
        instance.subtree = subtree

        // 遍历children
        patch(null, subtree, container, instance)

        // 赋值vnode.el,上面执行render的时候，vnode.el是null
        vnode.el = subtree.el

        // 渲染完成
        instance.isMounted = true
      } else {
        // 更新操作
        // 获取到vnode的子组件,传入proxy进去
        const { proxy } = instance
        const preSubtree = instance.subtree
        const nextSubtree = instance.render.call(proxy)
        // 遍历children
        patch(preSubtree, nextSubtree, container, instance)
        instance.subtree = nextSubtree
      }
    })
  }

```

> 上面就是关键的更新元素的步骤，接下来从`TDD`的开发模式，来实现**element属性的更新和element元素的更新**

# 属性更新

属性更新，毫无疑问的是，元素中的属性进行更新，新增，修改和删除等！


## 测试用例

```ts
test('test update props', () => {
    const app = createApp({
      name: 'App',
      setup() {
        const props = ref({
          foo: 'foo',
          bar: 'bar',
          baz: 'baz'
        })

        const changeFoo = () => {
          props.value.foo = 'foo1'
        }

        const changeBarToUndefined = () => {
          props.value.bar = undefined
        }

        const deleteBaz = () => {
          props.value = {
            foo: 'foo',
            bar: 'bar'
          }
        }
        return {
          props,
          deleteBaz,
          changeFoo,
          changeBarToUndefined,
        }
      },
      render() {
        return h('div', { class: 'container', ...this.props }, [h('button', { onClick: this.changeFoo, id: 'changeFoo' }, 'changeFoo'), h('button', { onClick: this.changeBarToUndefined, id: 'changeBarToUndefined' }, 'changeBarToUndefined'), h('button', { onClick: this.deleteBaz, id: 'deleteBaz' }, 'deleteBaz')])
      }
    })

    const appDoc = document.querySelector('#app')
    app.mount(appDoc)
    // 默认挂载
    expect(appDoc?.innerHTML).toBe('<div class="container" foo="foo" bar="bar" baz="baz">省略button</div>')

    // 删除属性
    const deleteBtn = appDoc?.querySelector('#deleteBaz') as HTMLElement;
    deleteBtn?.click();
    expect(appDoc?.innerHTML).toBe('<div class="container" foo="foo" bar="bar">省略button</div>')

    // 更新属性
    const changeFooBtn = appDoc?.querySelector('#changeFoo') as HTMLElement;
    changeFooBtn?.click();
    expect(appDoc?.innerHTML).toBe('<div class="container" foo="foo1" bar="bar">省略button</div>')

    // 属性置undefined
    const changeBarToUndefinedBtn = appDoc?.querySelector('#changeBarToUndefined') as HTMLElement;
    changeBarToUndefinedBtn?.click();
    expect(appDoc?.innerHTML).toBe('<div class="container" foo="foo1">省略button</div>')
  })
```

## 分析
通过上面的需求，分析以下内容：

- 删除属性

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07721ffff2f44b878ff43a161f4e86e8~tplv-k3u1fbpfcp-watermark.image?)

- 更新属性

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/374faa98600d4ae0a6f0e06b5e534d98~tplv-k3u1fbpfcp-watermark.image?)

- 将属性设置为null,undefined

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98f3b251ce6a4d0b918ab1be5fa0ef58~tplv-k3u1fbpfcp-watermark.image?)

问题解决：
1. 在processElement中，存入老节点则需要进行更新操作
2. 更新分为三种情况

## 编码


```ts
 function processElement(n1, n2, container: any, parentComponent) {
    // 判断是挂载还是更新
    if (n1) {
      // 拿到新旧属性
      const oldProps = n1.props
      const newProps = n2.props
      // 可能新的点击没有el
      const el = (n2.el = n1.el)
      // 更新属性
      patchProps(el, oldProps, newProps)

    } else {
      // 挂载
      mountElement(n2, container, parentComponent)
    }
  }
  
  // 更新属性
 function patchProps(el, oldProps, newProps) {
 // 属性相同不进行更新
    if (oldProps === newProps) {
      return
    }
    // 遍历新的属性
    for (let key in newProps) {
    // 如果存在与旧属性中，说明属性发生变化，需要进行修改操作
      if (key in oldProps) {
        // 需要进行更新操作
        hostPatchProps(el, key, oldProps[key], newProps[key])
      }
    }

    // 新属性里面没有旧属性，则删除
    for (let key in oldProps) {
      if (key in newProps) {
        continue
      } else {
        hostPatchProps(el, key, oldProps[key], null)
      }
    }
  }
  
  // 对比新老节点
  function patchProps(el, key, oldValue, newValue) {
    // 新值没有，则移除
    if (newValue === null || newValue === undefined) {
      el.removeAttribute(key)
    } else {
    // 重新赋值
      el.setAttribute(key, newValue)
    }
}
```

> 完成上面的编码，对应的测试用例也是可以通过的

# 更新children

> children的更新里面包含diff算法哦！

在设计`h()`函数中，有三个属性，第一个是type,第二个是属性，第三个则是children，**children的类型有两种，一种是数组，另一种则是文本.** 那么针对这两种情况，都需要分情况讨论，则会存在4种情况:
- array ---> text
- text ---> array
- text ---> text
- array ---> array： 这里需要使用diff算法

由于测试用例比较占用文本，本个篇幅则省略测试用例，有需要的同学请查看[源码](https://github.com/cll123456/common-study/tree/master/vue3-analysis/14-finish-comp-update)获取

## 更新array---> text
老的节点是array,新节点是text,是不是需要把老的先删除，然后在给当前节点进行赋值哇！


```ts
// 在processElement 种更新属性下面，加入一个新的方法，更新children
 function patchChildren(oldVNodes, newVNodes, container, parentComponent) {
    // 总共有4种情况来更新children
    // 1. children从array变成text
    const oldChildren = oldVNodes.children
    const newChildren = newVNodes.children
    const oldShapeflag = oldVNodes.shapeflag
    const newShapeflag = newVNodes.shapeflag
    if(Array.isArray(oldChildren) && typeof newChildren === string){
     // 删除老节点
     oldChildren.forEach(child=> {
       const parent = child.parentNode;
       if(parent){
          parent.removeChild(child)
       }
     })
     // 添加文本节点
     container.textContent = newChildren
    }
}
```

## 更新 text ---> array
更新这个节点则是先把老的节点给删除，然后在挂载新的节点


```ts
// 接着上面的判断
else if(typeof oldChildren === 'string' && Array.isArray(newChildren)){
 // 删除老节点
  container.textContent = ''
  // 挂载新的节点’
  newChildren.forEach(child => {
     patch(null, child, container, parentComponent)
  })
}
```

## 更新 text ---> text
更新文本节点则更简单，直接判断赋值即可

```ts
// 接着上面的判断
else if(typeof oldChildren === 'string' && typeof newChildren === 'string' && oldChildren !== newChildren){
 // 重新赋值
  container.textContent = newChildren
}
```

> 上面这么写代码是不是有点小重复哇，这是为了方便大家的理解，优化好的代码已经在[github](https://github.com/cll123456/common-study/tree/master/vue3-analysis/14-finish-comp-update)等你了哦


## 更新 array  ---> array

> 本文篇幅有限，diff算法就留给下篇文章吧

# 总结
本文主要实现了vue3 element的更新，**更新主要是在mountElement种的setupRenderEffect中来收集整个render函数的依赖，当reder函数中的响应式数据发生变化，则调用当前的run函数来触发更新操作！** 然后还实现了vue3中的属性的更新，属性主要有三种情况： **两者都存在，执行修改；老的存在，新的不存在，执行删除；老的被设置成null或者undefined也需要执行删除。**，最后还实现了vue中更新children，主要是针对 text_children和array_child的两两相互更新，最后还差一个都是数组的没有实现，加油！👍👍👍
