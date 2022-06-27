---
theme: qklhk-chocolate
---

# 引言

<<往期回顾>>


1.  [vue3源码分析——rollup打包monorepo](https://juejin.cn/post/7108325858489663495 "https://juejin.cn/post/7108325858489663495")
2. [vue3源码分析——实现组件的挂载流程](https://juejin.cn/post/7109002484064419848)

本期来实现，**setup里面使用props,父子组件通信props和emit等**，所有的[源码请查看](https://github.com/cll123456/common-study/tree/master/vue3-analysis/10-finish-comp-props)

> 本期的内容与上一期的代码具有联动性，所以需要明白本期的内容，最后是先看下上期的内容哦！😃😃😃

# 实现render中的this

在render函数中，**可以通过this,来访问setup返回的内容，还可以访问this.$el等**

## 测试用例
由于是测试dom,jest需要提前注入下面的内容，让document里面有app节点，下面测试用例类似在html中定义一个app节点哦
```ts

let appElement: Element;

  beforeEach(() => {
    appElement = document.createElement('div');
    appElement.id = 'app';
    document.body.appendChild(appElement);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  })
```
本功能的测试用例正式开始
```ts
test('实现代理对象，通过this来访问', () => {
   let that;
    const app = createApp({
      render() {
      // 在这里可以通过this来访问
        that = this;
        return h('div', { class: 'container' }, this.name);
      },
      setup() {
        return {
          name: '123'
        }
      }
    });
    const appDoc = document.querySelector('#app')
    app.mount(appDoc);
    // 绑定值后的html
    expect(document.body.innerHTML).toBe('<div id="app"><div class="container">123</div></div>');
    
     const elDom = document.querySelector('#container')
    // el就是当前组件的真实dom
    expect(that.$el).toBe(elDom);
  })
```

## 分析
上面的测试用例
1. **setup返回是对象的时候，绑定到render的this上面**
2. **$el则是获取的是当前组件的真实dom**

解决这两个需求:

1. 需要在**render调用的时候，改变当前函数的this指向**,但是需要思考的一个问题是：**this是啥，它既要存在setup,也要存在el，咋们是不是可以用一个proxy来绑定呢？在哪里创建呢** 可以在处理组件状态`setupStatefulComponent`来完成改操作
2. el则是在`mountElement`中挂载真实dom的时候，把当前的真实dom绑定在vnode当中

## 编码
针对上面的分析，需要在setupStatefulComponent中来创建proxy并且绑定到instance当中,并且setup的执行结果如果是对象，也已经存在instance中了，可以通过instance.setupState来进行获取

```ts
function setupStatefulComponent(instance: any) {
 instance.proxy = new Proxy({}, {
     get(target, key){
       // 判断当前的key是否存在于instance.setupState当中
       if(key in instance.setupState){
         return instance.setupState[key]
       }
     }
 })
 // ...省略其他
}
// 然后在setupRenderEffect调用render的时候，改变当前的this执行，执行为instance.proxy

function setupRenderEffect(instance: any, vnode: any, container: any) {
  // 获取到vnode的子组件,传入proxy进去
  const { proxy } = instance

  const subtree = instance.render.call(proxy)
  // ...省略其他
}
```
通过上面的操作，从render中this.xxx获取setup返回对象的内容就ok了，接下来处理el

需要在mountElement中，创建节点的时候，在vnode中绑定下，el，并且在`setupStatefulComponent` 中的代理对象中判断当前的key


```ts
// 代理对象进行修改
 instance.proxy = new Proxy({}, {
     get(target, key){
       // 判断当前的key是否存在于instance.setupState当中
       if(key in instance.setupState){
         return instance.setupState[key]
       }else if(key === '$el'){
           return instance.vnode.el
       }
     }
 })
 
 // mount中需要在vnode中绑定el
 
 function mountElement(vnode: any, container: any) {
  // 创建元素
  const el = document.createElement(vnode.type)
  // 设置vnode的el
  vnode.el = el
  
  //…… 省略其他
  }
```

看似没有问题吧，但是实际上是有问题的，请仔细思考一下，**mountElement是不是比setupStatefulComponent 后执行，setupStatefulComponent执行的时候，vnode.el不存在，后续mountelement的时候，vnode就会有值，那么上面的测试用例肯定是报错的，$el为null**

解决这个问题的关键，mountElement的加载顺序是 `render -> patch -> mountElement`，并且render函数返回的subtree是一个vnode,改vnode中上面是mount的时候，已经赋值好了el,所以在patch后执行下操作

```js

function setupRenderEffect(instance: any, vnode: any, container: any) {
  // 获取到vnode的子组件,传入proxy进去
  const { proxy } = instance

  const subtree = instance.render.call(proxy)
  
  patch(subtree, container)
 // 赋值vnode.el,上面执行render的时候，vnode.el是null
  vnode.el = subtree.el
}
```

> 至此，上面的测试用例就能ok通过啦！

# 实现on+Event注册事件
在vue中，可以使用`onEvent`来写事件，那么这个功能是怎么实现的呢，咋们一起来看看

## 测试用例

```ts
  test('测试on绑定事件', () => {
    let count = 0
    console.log = jest.fn()
    const app = createApp({
      render() {
        return h('div', {
          class: 'container',
          onClick() {
            console.log('click')
            count++
          },
          onFocus() {
            count--
            console.log(1)
          }
        }, '123');
      }
    });
    const appDoc = document.querySelector('#app')
    app.mount(appDoc);
    const container = document.querySelector('.container') as HTMLElement;
    
    // 调用click事件
    container.click();
    expect(console.log).toHaveBeenCalledTimes(1)

    // 调用focus事件
    container.focus();
    expect(count).toBe(0)
    expect(console.log).toHaveBeenCalledTimes(2)

  })
```

## 分析
在本功能的测试用例中，可以分析以下内容：

1. onEvent事件是在props中定义的
2. 事件的格式必须是 on + Event的格式

解决问题:

这个功能比较简单，在处理prop中做个判断， 属性是否满足 `/^on[A-Z]/i`这个格式，如果是这个格式，则进行事件注册，但是vue3会做事件缓存，这个是怎么做到？

缓存也好实现，在传入当前的el中增加一个属性` el._vei || (el._vei = {})` 存在这里，则直接使用，不能存在则创建并且存入缓存

## 编码

```ts
在mountElement中增加处理事件的逻辑

 const { props } = vnode
  for (let key in props) {
    // 判断key是否是on + 事件命，满足条件需要注册事件
    const isOn = (p: string) => p.match(/^on[A-Z]/i)
    if (isOn(key)) {
      // 注册事件
      el.addEventListener(key.slice(2).toLowerCase(), props[key])
    }
    // ... 其他逻辑
    el.setAttribute(key, props[key])
  }
```

事件处理就ok啦

# 父子组件通信——props

父子组件通信，在vue中是非常常见的，这里主要实现props与emit

## 测试用例


```ts
 test('测试组件传递props', () => {
    let tempProps;
    console.warn = jest.fn()
    const Foo = {
      name: 'Foo',
      render() {
        // 2. 组件render里面可以直接使用props里面的值
        return h('div', { class: 'foo' }, this.count);
      },
      setup(props) {
        // 1. 此处可以拿到props
        tempProps = props;

        // 3. readonly props
        props.count++
      }
    }

    const app = createApp({
      name: 'App',
      render() {
        return h('div', {
          class: 'container',
        }, [
          h(Foo, { count: 1 }),
          h('span', { class: 'span' }, '123')
        ]);
      }
    });
    const appDoc = document.querySelector('#app')
    app.mount(appDoc);
    // 验证功能1
    expect(tempProps.count).toBe(1)

    // 验证功能3，修改setup内部的props需要报错
    expect(console.warn).toBeCalled()
    expect(tempProps.count).toBe(1)

    // 验证功能2，在render中可以直接使用this来访问props里面的内部属性
    expect(document.body.innerHTML).toBe(`<div id="app"><div class="container"><div class="foo">1</div><span class="span">123</span></div></div>`)
  })
```

## 分析
根据上面的测试用例，分析props的以下内容：

1. 父组件传递的参数，可以给到子组件的setup的第一个参数里面
2. 在子组件的render函数中，可以使用this来访问props的值
3. 在子组件中修改props会报错，不允许修改

解决问题：

问题1： 想要在子组件的setup函数中第一个参数，**使用props,那么在setup函数调用的时候，把当前组件的props传入到setup函数中即可**
问题2： render中this想要问题，则在上面的那个代理中，在**加入一个判断，key是否在当前instance的props中**
问题3： 修改报错，那就是只能读，可以使用以前实现的**api shallowReadonly来包裹一下**既可

## 编码


```ts
1. 在setup函数调用的时候，传入instance.props之前，需要在实例上挂载props

export function setupComponent(instance) {
  // 获取props和children
  const { props } = instance.vnode

  // 处理props
  instance.props = props || {}
  
  // ……省略其他
 }
 
 //2. 在setup中进行调用时作为参数赋值
 function setupStatefulComponent(instance: any) {
   // ……省略其他
  // 获取组件的setup
  const { setup } = Component;

  if (setup) {
    // 执行setup，并且获取到setup的结果,把props使用shallowReadonly进行包裹，则是只读,不能修改
    const setupResult = setup(shallowReadonly(instance.props));

   // …… 省略其他
  }
}

// 3. 在propxy中在加入判断
 instance.proxy = new Proxy({}, {
     get(target, key){
       // 判断当前的key是否存在于instance.setupState当中
       if(key in instance.setupState){
         return instance.setupState[key]
       }else if(key in instance.props){
          return instance.props[key]
       }else if(key === '$el'){
           return instance.vnode.el
       }
     }
 })
```

做完之后，可以发现咋们的测试用例是运行没有毛病的😃😃😃

# 组件通信——emit
上面实现了props,那么emit也是少不了的，那么接下来就来实现下emit

## 测试用例

```ts
test('测试组件emit', () => {
    let count;
    const Foo = {
      name: 'Foo',
      render() {
        return h('div', { class: 'foo' }, this.count);
      },
      setup(props, { emit }) {
        // 1. setup对象的第二个参数里面，可以结构出emit，并且是一个函数

        // 2. emit 函数可以父组件传过来的事件
        emit('click')

        // 验证emit1，可以执行父组件的函数
        expect(count.value).toBe(2)

        // 3 emit 可以传递参数
        emit('clickNum', 5)
        // 验证emit传入参数
        expect(count.value).toBe(7)
        // 4 emit 可以使用—的模式
        emit('click-num', -5)
        expect(count.value).toBe(2)
      }
    }

    const app = createApp({
      name: 'App',
      render() {
        return h('div', {}, [
          h(Foo, { onClick: this.click, onClickNum: this.clickNum, count: this.count })
        ])
      },
      setup() {
        const click = () => {
          count.value++
        }
        count = ref(1)

        const clickNum = (num) => {
          count.value = Number(count.value) + Number(num)
        }
        return {
          click,
          clickNum,
          count
        }
      }
    })

    const appDoc = document.querySelector('#app')
    app.mount(appDoc);
    // 验证挂载
    expect(document.body.innerHTML).toBe(`<div id="app"><div><div class="foo">1</div></div></div>`)
  })
```

## 分析
根据上面的测试用例，可以分析出：
1. emit 的参数是在父组件的props里面，并且是以 on + Event的形式
1. emit 作为setup的第二个参数，并且可以结构出来使用
2. emit 函数里面是触发事件的，事件名称，事件名称可以是小写，或者是 xxx-xxx的形式
3. emit 函数的后续可以传入多个参数，作为父组件callback的参数

解决办法：
问题1： emit 是setup的第二个参数，**那么可以在setup函数调用的时候，传入第二个参数**
问题2： 关于emit的第一个参数，**可以做条件判断，把xxx-xxx的形式转成xxxXxx的形式，然后加入on，最后在props中取找，存在则调用，不存在则不调用**
问题3：emit的第二个参数，**则使用剩余参数即可**


## 编码


```ts
// 1. 在setup函数执行的时候，传入第二个参数
 const setupResult = setup(shallowReadonly(instance.props), { emit: instance.emit });

// 2. 在setup中传入第二个参数的时候，还需要在实例上添加emit属性哦

export function createComponentInstance(vnode) {
  const instance = {
    // ……其他属性
    // emit函数
    emit: () => { },
  }
  
  

  instance.emit = emit.bind(null, instance);
  
  function emit(instance, event, ...args) {
      const { props } = instance
      // 判断props里面是否有对应的事件，有的话执行，没有就不执行,处理emit的内容，详情请查看源码
      const key = handlerName(capitalize(camize(event)))
      const handler = props[key]
      handler && handler(...args)
  }

  
  return instance
}


```

到此就圆满成功啦！🎉🎉🎉
