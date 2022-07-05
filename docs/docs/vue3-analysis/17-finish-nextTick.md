---
theme: qklhk-chocolate
---

# 引言
<<往期回顾>>

1.  [vue3源码分析——实现组件通信provide,inject](https://juejin.cn/post/7111682377507667999 "https://juejin.cn/post/7111682377507667999")
1.  [vue3源码分析——实现createRenderer，增加runtime-test](https://juejin.cn/post/7112349410528329758 "https://juejin.cn/post/7112349410528329758")
1.  [vue3源码分析——实现element属性更新，child更新](https://juejin.cn/post/7114203851770560525 "https://juejin.cn/post/7114203851770560525")
1.  [vue3源码分析——手写diff算法](https://juejin.cn/post/7114966648309678110 "https://juejin.cn/post/7114966648309678110")
5.[ vue3源码分析——实现组件更新](https://juejin.cn/post/7115326422675587102)

vue是怎么更新UI，是同步还是异步呢？🤔🤔🤔，本期就来实现下vue3异步更新UI，并且实现`nextTick`这个api,所有的代码实现代码，请查看[仓库](https://github.com/cll123456/common-study/tree/master/vue3-analysis/17-finish-nextTick)

# 正文

## 假设同步

如果vue3是同步来更新UI界面，会发生什么呢？请思考下面的列子：



```ts
 test('存在的问题, vue更新ui界面是异步的', () => {
    let clickMethod;
    const app = createApp({
      name: 'App',
      setup() {
        const count = ref(0)
        clickMethod = () => {
          for (let i = 0; i < 100; i++) {
            count.value++
          }
        }
        return {
          count,
        }
      },
      render() {
        return h('div', {}, this.count)
      }
    })
    const appDoc = document.querySelector('#app')
    app.mount(appDoc)
    expect(appDoc?.innerHTML).toBe('<div>0</div>')

    clickMethod()
    expect(appDoc?.innerHTML).toBe('<div>100div>')
  })
```

在上面的测试用例当中，对外抛出一个方法，方法内有一个**循环**，执行响应式数据`count`变化**100次**。在这个测试用例本身是可以通过的，但是打`debugger`就会发现，更新流程走了`100`次，并且`dom`操作也是走了`100`次。这样的结果肯定是不满意的，更新走**100次**没有问题，但是**dom操作**了100次，那肯定就有点浪费性能了😶‍🌫️😶‍🌫️😶‍🌫️。

> attention!!!
>
> 看到这里的同志，可以思考下，怎么做优化?

# 优化性能
上面说到了，`100`次更新`dom`浪费性能，这里就来解决下。在解决之前，需要理解一个概念，**js的事件循环（Event Loop）**

 ## js事件循环
 
 
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ed6b5ef120046fab18debb54219611b~tplv-k3u1fbpfcp-watermark.image?)
来一张网上经典的图，意思是说**所有的js任务会区分同步任务还是异步任务，同步任务直接放入主进程直接执行调用，但是异步任务是需要等带所有的同步任务完成后，才来逐个执行异步任务。**,然而异步任务也分为**宏任务（macrotask）** 和 **微任务(microtask)** ,他们都有独立的任务队列。

- 宏任务主要包含：`<script>`( 整体代码)、`setTimeout`、`setInterval`、`I/O`、`UI 交互事件`、`setImmediate(Node.js 环境)`等\
- 微任务主要包含：`Promise`、`MutaionObserver`、`process.nextTick(Node.js 环境)`等


>这里又有一个争议的点，宏任务和微任务哪个先执行的问题？

请看下面的两个列子：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13fda752edb74c499d912743440f1de5~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7deb8c246385491699c9d892d79e98a0~tplv-k3u1fbpfcp-watermark.image?)
>不服的battle请举例😉😉😉

这里在给一张图，不清楚的可以看下

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df9456adfd1c4d34805851bf0efe18d9~tplv-k3u1fbpfcp-watermark.image?)


详情请[查看 重温js—— 事件循环](https://juejin.cn/post/7003306748157100046)

## 优化代码

还记得**effect的第二个参数options么？里面可以传递一个scheduler函数，如果存在scheduler的话，那么在run的时候就会执行这个函数**,那么优化入口就找到了，就是在更新中使用effect的地方，也就是`setupRenderEffect（）`

### 思路

**在effect里面传入第二个参数，scheduler函数里面需要维护一个队列，方便保存当前的effect的runner函数，然后把runner函数放入微任务中进行执行就ok了**。

当然，在放入微任务之前，维护的队列中需要判断runner是否重复，重复只添加一次，然后取除队列中的第一项放入微队列中执行


### 编码
通过上面的思路，可以写出下面的代码
```ts
// 定义一个队列
const queue = []；

export function queueJob(job){
    // 不存在队列中，则放入 
     if(!queue.includes(job)){
         queue.push(job)
     }
     
     // 放入微队列中执行
     Promise.reslove.then(() => {
         let jobFn
         // 取出队列中的第一个effect进行执行
         while(jobFn = queue.shift()){
            jobFn && jobFn()
         }
     })
}
```

> 是不是很简单哇，有了这个之后，那么vue3在更新视图就会放入微队列当中了

其中放入微队列并执行的代码就是实现**nextTick的核心**。

# 实现nextTick

在vue3源码中就是使用`Promise`的方式来实现`nextTick()`的，那么在需要使用nextTick的地方，直接使用`Promise.resolve.then()` 也可以实现nextTick的功能哦！

### 分析

`nextTick`的功能是：**获取页面更新之后的数据**

UI界面是在微任务中来进行更新的,那么我在需要写逻辑的地方**再来一个微任务是不是一定就排在更新之后的任务后面了**呢？答案是肯定的。那么你可以写出这样的代码



```ts
 let clickMethod;
    const app = createApp({
      name: 'App',
      setup() {
        const count = ref(0)
        clickMethod = () => {
          for (let i = 0; i < 100; i++) {
            count.value++
          }
        }
        return {
          count,
        }
      },
      render() {
        return h('div', {}, this.count)
      }
    })
    const appDoc = document.querySelector('#app')
    app.mount(appDoc)
    expect(appDoc?.innerHTML).toBe('<div>0</div>')

    clickMethod()
    expect(appDoc?.innerHTML).not.toBe('<div>100</div>')
    
    // 需要放入微任务当中,代替了nextTick方法
    Promise.resolve().then(() => {
      expect(appDoc?.innerHTML).toBe('<div>100</div>')
    })
```

### 编码
有了上面的基础，需要实现nextTick是不是很简单哇！ 


```ts
// 定义一个队列
const queue = []；

export function queueJob(job){
    // 不存在队列中，则放入 
     if(!queue.includes(job)){
         queue.push(job)
     }
     
     // 放入微队列中执行
    nextTick(() => {
         let jobFn
         // 取出队列中的第一个effect进行执行
         while(jobFn = queue.shift()){
            jobFn && jobFn()
         }
    })
}

export function nextTick(fn){
  return fn ? Promise.reslove.then(fn) : Promise.reslove()
}
```
> 此处代码为最容易理解的状态，需要看优化好的代码，请[查看](https://github.com/cll123456/common-study/tree/master/vue3-analysis/17-finish-nextTick)

# 总结
本期主要实现了`nextTick()`，通过`nextTick`看到了`vue`更新`dom`的方式是异步的。并且在这种方式的基础之上，需要使用到**js的事件循环**，在事件循环中**微任务比宏任务的优先级更高**。所以**nextTick使用的是微任务方式来更新dom** 。 看似不到20行的代码，里面却包含着这么多知识点，只能说大佬就是大佬，灵活运用👍👍👍

我正在参与掘金技术社区创作者签约计划招募活动，[点击链接报名投稿](https://juejin.cn/post/7112770927082864653 "https://juejin.cn/post/7112770927082864653")
