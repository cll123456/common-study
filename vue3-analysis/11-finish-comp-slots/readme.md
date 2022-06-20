---
theme: qklhk-chocolate
---

**持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第11天，[点击查看](https://juejin.cn/post/7099702781094674468 "https://juejin.cn/post/7099702781094674468")**

# 引言

<<往期回顾>>

1.  [vue3源码分析——rollup打包monorepo](https://juejin.cn/post/7108325858489663495 "https://juejin.cn/post/7108325858489663495")
1.  [vue3源码分析——实现组件的挂载流程](https://juejin.cn/post/7109002484064419848 "https://juejin.cn/post/7109002484064419848")
2. [vue3源码分析——实现props,emit，事件处理等](https://juejin.cn/post/7110133885140221989)

本期来实现， **slot——插槽，分为普通插槽，具名插槽，作用域插槽**，所有的[源码请查看](https://github.com/cll123456/common-study/tree/master/vue3-analysis/11-finish-comp-slots)


# 正文

在 模板中使用插槽的方式如下：

```ts
<todo-button>
  Add todo
</todo-button>
```
在`template`中的内容最终会被`complie`成**render函数，render函数里面会调用h函数转化成vnode**，在vnode的使用方法如下：

```ts
render() {
    return h(TodoButton, {}, this.$slots.default)
  },
```

看完slots的基本用法，一起来实现个slots,方便自己理解slots的原理哦！😀😀😀

## 实现基本的用法
使用**slots的地方是this.$slots，并且调用的属性是default,那么$slots则是一个对象，对象里面有插槽的名称，如果使用者没有传递，则可以通过default来进行访问**。

### 测试用例
> attention！！！ 
> 由于测试的是dom,需要先写入html等，在这里需要先创建对应的节点


```ts
 let appElement: Element;
  beforeEach(() => {
    appElement = document.createElement('div');
    appElement.id = 'app';
    document.body.appendChild(appElement);
  })
  afterEach(() => {
    document.body.innerHTML = '';
  })
```

本案例的测试正式开始

```ts
 test('test basic slots', () => {
 // 子组件Foo
    const Foo = {
      name: 'Foo',
      render() {
        return h('div', { class: 'foo' }, [h('p', {}, this.count), renderSlots(this.$slots)]);
      }
    }

    const app = createApp({
      render() {
        return h('div', { class: 'container' }, [
          h(Foo, { count: 1 }, { default: h('div', { class: 'slot' }, 'slot1') }),
          h(Foo, { count: 2 }, { default: [h('p', { class: 'slot' }, 'slot2'), h('p', { class: 'slot' }, 'slot2')] }),
        ])
      }
    })

    const appDoc = document.querySelector('#app')
    app.mount(appDoc);
    // 测试挂载的内容是否正确
    const container = document.querySelector('.container') as HTMLElement;
     expect(container.innerHTML).toBe('<div class="foo"><p>1</p><div class="slot">slot1</div></div><div class="foo"><p>2</p><p class="slot">slot2</p><p class="slot">slot2</p></div>'
    )
  })
```

### 需求分析
通过上面的测试用例，可以分析以下内容：

1.  父组件使用子组件传入插槽的方式是在h的**第三个参数，并且传入的是一个对象，value的值可以是对象，或者是数组**
2. 子组件中使用插槽的时候，是**在this.$slots中获取的**    
3. 并且还实现了**一个renderSlot的方法，renderSlot是将this.$slots调用h转变为vnode**

问题解决：

1. 需要在绑定在this上面，那就在`setupStatefulComponent`函数代理中加入判断，传入的`$slots `;
2. 判断`$slot`是否在组件的代理中，然后代理需要把**slots绑定在instance上面**并且绑定值的时候需要把**传入的对象统一转成数组**;
3. `renderSlot`方法调用了`h函数`，把一个数据转成vnode


### 编码实现


```ts
// 需要把$slots绑定在this上面，那就需要在代理里面在加入一个判断即可
function setupStatefulComponent(instance: any) {
  // 代理组件的上下文
  instance.proxy = new Proxy({  }, {
      get(target,key){
       // 省略其他
       else if(key in instance.slots){
         return instance.slots[key]
       }
      }
  })
}

// 接下里在instance上面加上slots属性
export function setupComponent(instance) {
  // 获取props和children
  const { props, children } = instance.vnode

  // 处理props
  
  const slots = {}
  for (const key in children) {
      slots[key] = Array.isArray(children[key]) ? children[key] : [children[key]]
  }
  instance.slots = slots
  
  // ……省略其他
  }
  
  // 最后还需要使用renderSlot函数
  export function renderSlots(slots) {
    const slot = slots['default']
       if (slot) {
        return createVNode('div', {}, slot)
      }
}
```

通过上面的编码，测试用例就可以通过吗？
肯定是不行的，在`renderSlots`里面的第一个参数，传入了div,那么渲染出来的html内容肯定是都会多一层div包裹的。

那就来解决下。


```ts
 export function renderSlots(slots) {
    const slot = slots['default']
       if (slot) {
       // 传入一个Fragment节点，这个节点是不存在的，等patch的时候，会有问题
        return createVNode('Fragment', {}, slot)
      }
}


// 处理patch函数，处理type为Fragment的vnode
export function patch(vnode, container) {
  const { type } = vnode
  if(type === 'Fragment){
   // 拿到children
   vnode.children.forEach(e => {
      patch(e, container)
   })
  }
 }
```

这么处理后，测试用例即可完美通关啦

## 具名插槽

具名插槽就是，插槽除了可以有多个，并且除了default外，可以加入其他的名字，具体请看测试用例
### 测试用例


```ts
 test('测试具名插槽', () => {
    const Foo = {
      name: 'Foo',
      render() {
        return h('div', { class: 'foo' },
          [
            renderSlots(this.$slots, 'header'),
            h('div', { class: 'default' }, 'default'),
            renderSlots(this.$slots, 'footer')
          ]
        );
      }
    }

    const app = createApp({
      name: 'App',
      render() {
        return h('div', { class: 'container' }, [h(Foo, {}, {
          header: h('h1', {}, 'header'),
          footer: h('p', {}, 'footer')
        })])
      }
    })

    const appDoc = document.querySelector('#app')
    app.mount(appDoc);

    const container = document.querySelector('.container') as HTMLElement

    expect(container.innerHTML).toBe('<div class=\"foo\"><div><h1>header</h1></div><div class=\"default\">default</div><div><p>footer</p></div></div>')
  })
```

### 分析
通过上面测试用例，发现以下内容：

1. `renderSlot`传入第二个参数，然后可以获取对于的slots

问题解决

直接在renderSlot里面传入第二个参数即可

### 编码


```ts
  // 最后还需要使用renderSlot函数
  export function renderSlots(slots, name = 'default') {
    const slot = slots[name]
       if (slot) {
        return createVNode('div', {}, slot)
      }
}
```

> 这一步是不是比较简单，相对起前面来说，正所谓，前面考虑好了，后面就舒服，接下来实现作用域插槽


## 作用域插槽

作用域插槽是，**每个slot里面可以传入数据，数据只在当前的slot有效**，具体请看测试用例

### 测试用例

```ts
test('测试作用域插槽', () => {
    const Foo = {
      name: 'Foo',
      render() {
        return h('div', { class: 'foo' },
          [
            renderSlots(this.$slots, 'header', { children: 'foo' }),
            h('div', { class: 'default' }, 'default'),
            renderSlots(this.$slots, 'footer')
          ]
        );
      }
    }

    const app = createApp({
      name: 'App',
      render() {
        return h('div', { class: 'container' }, [h(Foo, {}, {
          header: ({ children }) => h('h1', {}, 'header ' + children),
          footer: h('p', {}, 'footer')
        })])
      }
    })

    const appDoc = document.querySelector('#app')
    app.mount(appDoc);

    const container = document.querySelector('.container') as HTMLElement

     expect(container.innerHTML).toBe('<div class=\"foo\"><h1>header foo</h1><div class=\"default\">default</div><p>footer</p></div>')

  })
```

### 需求分析

通过上面的测试用例，分析出以下内容：

1. 传入插槽的时候，传入一个函数，函数可以拿到子组件传过来的参数
2. `renderSlots`可以传入第三个参数props, 用于接收子组件往父组件传入的参数


问题解决：

1. 问题1: 只需要在传入插槽的时候进行一下判断，如果是函数的话，需要进行函数执行，并且传入参数
2. 问题2： 也是对传入的内容进行判断，函数做传入参数处理


### 编码


```ts
// 在renderSlot里面传入第三个参数

export function renderSlots(slots, name = 'default', props = {}) {
  const slot = slots[name];

  if (slot) {
    if (isFunction(slot)) {
      return createVNode('Fragment', {}, slot(props))
    }
    return createVNode('Fragment', {}, slot)
  }
}

// initSlot时候，需要进行函数判断

 const slots = {}
  // 遍历children
  for (const key in children) {
  // 判断传入的是否是函数，如果是函数的话，需要进行执行，并且传入参数
    if (isFunction(children[key])) {
      slots[key] = (props) => Array.isArray(children[key](props)) ? children[key](props) : [children[key](props)]
    } else {
      slots[key] = Array.isArray(children[key]) ? children[key] : [children[key]]
    }
  }

  instance.slots = slots
```

到此，整个测试用例就可以完美通过啦！😃😃😃
