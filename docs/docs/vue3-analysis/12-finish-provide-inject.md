---
theme: qklhk-chocolate
---

# 引言
<<往期回顾>>

1.  [vue3源码分析——rollup打包monorepo](https://juejin.cn/post/7108325858489663495 "https://juejin.cn/post/7108325858489663495")
1.  [vue3源码分析——实现组件的挂载流程](https://juejin.cn/post/7109002484064419848 "https://juejin.cn/post/7109002484064419848")
1.  [vue3源码分析——实现props,emit，事件处理等](https://juejin.cn/post/7110133885140221989 "https://juejin.cn/post/7110133885140221989")
4. [vue3源码分析——实现slots](https://juejin.cn/post/7111212195932799013)

本期来实现， **vue3组件通信的provide，inject**，所有的[源码请查看](https://github.com/cll123456/common-study/tree/master/vue3-analysis/12-finish-provide-inject)

# getCurrentInstance
> 在实现`provide/inject`之前，先来实现`getCurrentInstance`,由于在`provide/inject`中会使用到这个api,在开发的时候，这个api使用的频率也是挺频繁的。

getCurrentInstance 是获取当前组件的实列，并且只能在setup函数中使用

## 测试用例

```ts
test('test getCurrentInstance', () => {
    const Foo = {
      name: 'Foo',
      setup() {
      // 获取子组件的实列，并且期望是子组件的名称是Foo
        const instance = getCurrentInstance();
        expect(instance.type.name).toBe('Foo');
        return {
          count: 1
        }
      },
      render() {
        return h('div', {}, '122')
      }
    }

    const app = createApp({
      name: 'App',
      setup() {
      // 获取父组件的实例，期待父组件的名称是定义的App
        const instance = getCurrentInstance();
        expect(instance.type.name).toBe('App');
        return {
          count: 2
        }
      },
      render() {
        return h('div', { class: 'container' }, [h(Foo, {}, {})])
      }
    })
    // 挂载组件
    const appDoc = document.querySelector('#app')
    app.mount(appDoc);
  })
```

## 分析
在上面的测试拥立中，可以得到以下内容：

1. getCurrentInstance只能在setup函数中使用
2. 对外导出的api,获取的是当前组件的实列

问题解决：

对于上面两个问题，**只需要导出一个函数，并且在全局定义一个变量，在setup执行的时候，赋值全局变量即可拿到当前组件的实例，然后setup执行之后，清空即可**

## 编码

```ts
// setup执行是在setupStatefulComponent函数中执行的，来进行改造

// 定义全局的变量，存储当前实例
let currentInstance = null;
function setupStatefulComponent(instance: any) {
  // ……省略其他
  // 获取组件的setup
  const { setup } = Component;
  if (setup) {
      currentInstance = instance
      const setupResult = setup(shallowReadonly(instance.props), { emit: instance.emit })
      // 情况操作
       currentInstance = null
  }
  // ……省略其他
 }


// 对外导出函数，提供全局的api
export function getCurrentInstance() {
  return currentInstance
}
```
getCurrentInstance 有没有想到实现方式这么简单哇！😀😀😀

# provide/inject
> provide和inject需要配套使用才方便用于测试，这里就从功能分析，来逐步完成这两个api.

## 父子组件传值

父子组件传值可以使用`props/emit`来实现，还记得是怎么实现的么？[🙄🙄😶](https://juejin.cn/post/7110133885140221989)

### 测试用例

```ts
test('test provide basic use', () => {
    const Foo = {
      name: 'Foo',
      setup() {
      // 子组件接受数据
        const count = inject('count')
        const str = inject('str')
        return {
          count,
          str
        }
      },
      render() {
        return h('div', {}, this.str + this.count)
      }
    }

    const app = createApp({
      name: 'App',
      setup() {
      // 父组件提供数据，
        provide('count', 1);
        provide('str', 'str');
      },
      render() {
        return h('div', { class: 'container' }, [h(Foo, {})])
      }
    })

    const appDoc = document.querySelector('#app')
    app.mount(appDoc);
    const container = document.querySelector('.container') as HTMLElement;
    expect(container.innerHTML).toBe('<div>str1</div>')
  })
```
### 分析
从上面的测试用例中进行需求分析，
1. `provide api`是需要有**两个参数，一个key,另一个是value**, 有点类似与sessionStorage这种set值的方式
2. `inject api`则是只需要一个**key,来进行get**操作
3. `provide`存的数据，**存在哪里呢？**

问题解决：
问题1和问题2都很好解决，对外导出函数，传递对应的参数，只是数据存储在哪里的问题，经过仔细的思考，会发现，组件的数据是需要进行共享的，父组件存入的数据，里面的所有子组件和孙子组件都可以共享，那么**存储在实例上**，是不是一个不错的选择呢？
**inject 是获取父级组件的数据，那么在实列上还需要传入parent**

### 编码

```ts
由于需要在实例上存储provide,首先就在createInstance中的实例，在初始化就赋值

export function createComponentInstance(vnode, parent) {
  const instance = {
    // ……省略其他属性
    // 提供数据
    provides: {},
    parent,
  }
  return instance
}

// 有了实例，分别创建provide，inject函数

export function provide(key, val){
  // 将数据存在实例上，先进行获取
  const instance = getCurrentInstance();
  if(instance){
      instance.provides[key] = val
  }
}

export function inject(key){
 // 从实列上取值
 const instance = getCurrentInstance();
 if(instance){
     // 获取父级provides
     const provides = instance.parent?.provides;
     if(key in provides){
        return provides[key]
     }
     return null
 }
}
```
一个简单的prvide/inject就实现啦，接下来进行需求升级，爷孙组件数据传递

## 爷孙组件传值

无可厚非，就是孙子组件需要从爷爷组件中获取值，父组件不提供数据

### 测试用例

```ts
test('test provide exit grandfather', () => {
    const Child = {
      name: 'Foo',
      setup() {
      // 孙子组件也可以取值
        const count = inject('count')
        const str = inject('str')
        return {
          count,
          str
        }
      },
      render() {
        return h('div', {}, this.str + this.count)
      }
    }

    const Father = {
      name: 'Father',
      setup() {
      // 子组件可以取值
        const count = inject('count')
        return {
          count
        }
      },
      render() {
        return h('div', {}, [h('p', {}, this.count), h(Child, {})])
      }
    }

    const app = createApp({
      name: 'App',
      setup() {
       // 爷爷提供数据
        provide('count', 1);
        provide('str', 'str');
        return {}
      },
      render() {
        return h('div', { class: 'container' }, [h(Father, {})])
      }
    })

    const appDoc = document.querySelector('#app');
    app.mount(appDoc);
    const container = document.querySelector('.container') as HTMLElement;
    expect(container.innerHTML).toBe('<div><p>1</p><div>str1</div></div>')
  })
```
### 分析
上面的测试用例相对于父子组件的测试用例来说，增加了一个孙子组件。
1. **孙子（Child组件）** 和 **父亲（Foo组件）** 都可以获取 **爷爷（App组件)** 的值
2. 其他的没啥变化

问题解决：
想要让孙子组件获取爷爷组件的数据，那是否可以让**父组件Foo在初始化就获取他父组件App的provides**

### 编码

```ts
// 需要在组件初始化的时候，获取父组件的数据,修改下初始化的内容
export function createComponentInstance(vnode, parent) {
  const instance = {
    // ……省略其他属性
    // 存在则用，不存在还是空对象
    provides: parent ? parent.provides : {},
    parent,
  }
  return instance
}
```

是不是感觉非常简单哇，那接下来在升级下，`inject`获取`provide`的数据，需要就**近原则**来进行获取

## 就近原则获取数据

> 就近原则的意思是说，**如果父组件有就拿父组件的，父组件没有就那爷爷组件的，爷爷组件没有继续往上找，直到找到跟组件App上，如果还没有就为null**

### 测试用例

```ts
 test('get value by proximity principle(就近原则) ', () => {
 // 孙子组件来获取数据
  const GrandSon = {
      name: 'GrandSon',
      setup() {
        const count = inject('count')
        const str = inject('str')
        return {
          count,
          str
        }
      },
      render() {
        return h('div', {}, this.str + this.count)
      }
    }
    // 子组件提供count
    const Child = {
      name: 'Child',
      setup() {
        provide('count', 100)
      },
      render() {
        return h(GrandSon)
      }
    }
    // 父亲组件，不提供数据
    const Father = {
      name: 'Father',
      render() {
        return h(Child)
      }
    }
   // 跟组件app,提供，count，str
    const app = createApp({
      name: 'App',
      setup() {
        provide('count', 1);
        provide('str', 'str');
        return {}
      },
      render() {
        return h('div', { class: 'container' }, [h(Father, {})])
      }
    })
   // ……省略挂载
    const container = document.querySelector('.container') as HTMLElement;
    expect(container.innerHTML).toBe('<div>str100</div>')
  })
```
### 分析
在上面的测试用例中，存在4个组件，只有app组件和Child组件提供数据，其他只是嵌套，不提供数据。存在下面问题：
1. **inject怎么去查找provides的数据，一层一层的查找**

问题解决：
    怎么查找呢，**在inject里面递归？** NO😱😱😱,换一个角度，inject查找数据的时候，是不是有点像**原型链**的方式来进行查找呢？YES😆😆😆,那就是需要在provide里面来构建一条原型链。 
    
> 原型链,
 > 啥叫做原型链呢？[请查看](https://juejin.cn/post/7000331533353484296)
 
 ### 编码
 
```ts
// 只需要改造provide函数即可
export function provide(key, val) {
  // 数据需要存储在当前的实例上面
  const instance = getCurrentInstance();

  if (instance) {
    let { provides } = instance;
    // 正对多层组件，需要把当前组件的__proto__绑定到父级上面，形成原型链，可以访问到最顶层的数据
    const parentProvides = instance.parent && instance.parent.provide;
    // 只有父级的provides和当前的provides是相同的时候为第一次调用provide,后续调用就不需要绑定原型了
    if (parentProvides === provides) {
      provides = instance.providers = Object.create(parentProvides || {});
    }
    provides[key] = val;
  }
}
```

# 总结
本期主要完成了`getCurrentInstance,provide,inject`的实现，在`getCurrentInstance`中只是用了一个中间变量，而`provide`是把数据存在当前的`instance`当中，`provide`里面还用到了**原型链**的知识，通过原型的方式来查询key是否存在,不存在则往上查找
