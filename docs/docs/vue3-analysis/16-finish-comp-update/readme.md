---
theme: qklhk-chocolate
---

# 引言

<<往期回顾>>

1.  [vue3源码分析——实现组件通信provide,inject](https://juejin.cn/post/7111682377507667999 "https://juejin.cn/post/7111682377507667999")
1.  [vue3源码分析——实现createRenderer，增加runtime-test](https://juejin.cn/post/7112349410528329758 "https://juejin.cn/post/7112349410528329758")
1.  [vue3源码分析——实现element属性更新，child更新](https://juejin.cn/post/7114203851770560525 "https://juejin.cn/post/7114203851770560525")
4. [vue3源码分析——手写diff算法](https://juejin.cn/post/7114966648309678110)

前面的两期主要是实现`element的更新`,`vue`的更新除了`element`的更新外,还有`component`的更新哦,本期就带大家一起来看看,本期所有的[源码请查看](https://github.com/cll123456/common-study/tree/master/vue3-analysis/16-finish-comp-update)

# 正文
vue3在更新element的时候,除了需要**分情况讨论更新children外,还需要来看vue3的属性**有没有变化;那么同样的道理,对于**组件的更新,也是需要来更新属性,插槽**等

## 流程

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea4d6010dd2d4846b8e6f71deae72b08~tplv-k3u1fbpfcp-watermark.image?)

> 看到这个流程,是不是感觉比**element的更新**简单许多(❁´◡`❁)

## 测试用例
根据上面的流程图,可以写出这样的测试用例

```ts
 test('test comp update by Child', () => {
    let click
    const Child = {
      name: 'Child',
      setup(props, { emit }) {
        click = () => {
          emit('click')
        }
        return {
          click
        }
      },
      render() {
        return h('div', {}, this.$props.a)
      }
    }
    const app = createApp({
      name: 'App',
      setup() {
        const a = ref(1);
        const changeA = () => {
          a.value++
        }
        return {
          a,
          changeA
        }
      },
      render() {
        return h('div', { class: 'container' }, [h('p', {}, this.a), h(Child, { a: this.a, onClick: this.changeA })])
      }
    })
    const appDoc = document.querySelector('#app')
    app.mount(appDoc)
    // 默认开始挂载严重
    const containerDom = document.querySelector('.container')
    expect(containerDom?.innerHTML).toBe('<p>1</p><div>1</div>')
    // 调用click
    click()
    expect(containerDom?.innerHTML).toBe('<p>2</p><div>2</div>')
```
## 分析

根据上面的流程图,可以分析出下面的需求

1. `updateComponent`里面需要实现啥;
2. `updatePreRender`函数里面又是需要做啥;
3. 怎么调用`render`函数呢?

问题解决:
### updateComponent
`updateComponent`方法的调用肯定是在`processComponent`中的`旧vnode`存在的时候来调用,里面需要进行新老节点的对比,判断是否需要进行更新.更新则调用`updateComponentPreRender`去更新vnode的props,slots等.这里会还需要把**新vnode**给保存在实例当中方便后续的使用,最后还需要在**当前的vnode当中保存当前组件的实例**,方便后续交换新老vnode的时候调用.

### updatePreRender 
这个函数就是只要处理更新的逻辑即可

### 调用render
`render`的调用是在 `setupRenderEffect`中调用的,是不是可以重复利用下这个功能呢? 当然可以,**effect函数是默认返回一个runner的,可以手动调用runner来执行effect里面的方法**. 那么可以在当前的实例当中保存一个`update`方法,用于需要调用`render`的时候来进行调用即可.

## 编码

```ts
// 在创建vnode当中,添加component属性
export function createVNode(type, props?, children?) {
  const vnode = {
    ...省略其他属性
    // 当前组件的实例
    component: null,
  }  
}
// 在instance中添加 next属性和update方法,方便后续使用

export function createComponentInstance(vnode, parent) {
  const instance = {
    // ... 省略其他属性 
    // 更新后组件的vnode
    next: null,
    // 当前组件的更新函数，调用后，自动执行render函数
    update: null,
  }
  vnode.component = instance
}

// 绑定insance.update,在setupRenderEffect中调用effect的时候绑定

// 实现updateComponent,并且在processComponent满足n1的时候来进行调用
function updateComponent(n1, n2) {
    // 更新组件
    const instance = (n2.component = n1.component)
    // 判断是否需要更新
    if (需要更新(n1, n2)) {
      instance.next = n2;
      instance.update();
    } else {
    // 不需要更新则赋值
      n2.el = n1.el;
      instance.vnode = n2
    }
 } 
 
 // 在setupRenderEffect中对更新部分进行改造,存在next的时候来调用updateComponentPreRender
 
  function updateComponentPreRender(instance, nextVNode) {
  // 把当前实例赋值给更新的vnode
    nextVNode.component = instance;
    // 更新当前实例的vode
    instance.vnode = nextVNode
    // 置空newVnode
    instance.next = null;
    // 更新属性
    instance.props = nextVNode.props;
    // 更新插槽
    instance.slots = nextVNode.slots;
  }
 
```

# 总结
本期主要实现了vue3的组件更新,在组件更新中,主要的流程是 `updateComponent--> updateComponentPreRender --> render`, 在这三个函数中交换新老vnode的属性,给把当前的vnode给更新掉即可
