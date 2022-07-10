---
theme: qklhk-chocolate
---

> 在[上一篇文章](https://juejin.cn/post/7102419584459898894)中，咋们介绍了vue3组件的初始化流程，接下来咋们来一起分析下vue3组件的更新流程是咋样的

先写一个组件，`App.js`, 然后咋们来执行更新的流程

```ts
import { h, ref } from "vue";

export default {
  name: 'App',
  setup() {
    const count = ref(0);
    // 把count赋值给window,然后在控制台中来改变数据，看看流程是咋样变化的
    window.count = count
    return {
      count
    };
  },
  render() {
    return h('div', { pId: '"helloWorld"' }, [
      h('p', {}, 'hello world'),
      h('p', {}, `count的值是： ${this.count}`),
    ])
  }
}

```

# mount
>[ mount阶段](https://juejin.cn/post/7102419584459898894)就是上篇文章，这里直接跳过，咋们来走更新流程

# update

还记得组件挂载阶段中的 `setupRenderEffect`么？ 在这里的时候会进行依赖收集，会在实例instance上挂载一个方法
``` ts
instance.update = effect(componentUpdateFn, {
      scheduler: () => {
        queueJob(instance.update);
      },
    });
 ```
 
 当数据发送变化的时候，就会触发 `componentUpdateFn`函数， 不清楚响应式系统的可以[查看这里](https://juejin.cn/post/7102419584459898894)
 
 整体的流程图如下：
 
 
![vue3组件更新流程.drawio.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1230e74c82af451c98eb00f44cac5456~tplv-k3u1fbpfcp-watermark.image?)
 
 1. 第一步肯定就是执行 `componentUpdateFn`,由于组件已经挂载完成，直接走更新操作
 

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de565540c439438bbc0218ba4cc0c77b~tplv-k3u1fbpfcp-watermark.image?)

2. 判断属性是否有变化，如果有变化的话需要更新属性，咋们这里没有属性发生变化，直接调用`normalizeVNode(instance.render.call(proxyToUse, proxyToUse))`获取children

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a353e55d080a48b8bbefb5715d4eb02c~tplv-k3u1fbpfcp-watermark.image?)

3. 触发 `beforeUpdated hook`
4. 传入参数，调用`patch`,后续的流程是根据咋代码的修改count内容来走的
5. 根据参数，进入path的的 `processElement`

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6bf4ead1b28c4b34b8b54cb6a91eadfb~tplv-k3u1fbpfcp-watermark.image?)

6. 更新流程，直接调用 `updateElement` 
7. 更新属性 
8. 更新children （diff算法）

## 属性更新

咋们来分析下 vue3 中属性变化的情况

### 第一种情况 属性增加

```ts
let oldProps = {a: 1}
let newProps = {a:1,b:2}
```

对于这种情况，咋们怎么才能找出属性的变化，是不是就是应该遍历 `newProps` 如果里面的`key `在 `oldProps` 中不存在，则标记为**新增的属性**
代码应该这么写：
```ts
for (const key in newProps) {
      const prevProp = oldProps[key];
      const nextProp = newProps[key];
      if (prevProp !== nextProp) {
        // 新增属性
      }
    }
```

### 第二种情况 属性减少
```ts
let oldProps = {a: 1, c: 4}
let newProps = {a:1}
```
对于这种情况，咋们要找出属性的变化，直接遍历 oldProps 既即可，和上面的方式是一样的

### 第三种情况 属性变化
```ts
let oldProps = {a: 2}
let newProps = {a:1}
```
对于这种情况，咋们是不是还需要一个 对比属性的函数来，循环遍历依次来对比属性的变化呢？针对上面的情况一和情况二，都可以用同一个方法来**新增，修改，删除属性**，`vue3` 只不过把处理的都映射给每一个dom了

```ts
/**
 * 
 * @param el 更新的真实dom
 * @param key 属性的key
 * @param preValue 旧的值
 * @param nextValue 新的值
 */
function hostPatchProp(el, key, preValue, nextValue){
   // 传入的key,是不是事件处理函数
    if (isOn(key)) {
    // 添加事件处理函数的时候需要注意一下
    // 1. 添加的和删除的必须是一个函数，不然的话 删除不掉
    //    那么就需要把之前 add 的函数给存起来，后面删除的时候需要用到
    // 2. nextValue 有可能是匿名函数，当对比发现不一样的时候也可以通过缓存的机制来避免注册多次
    // 缓存所有的事件函数
    
    const invokers = el._vei || (el._vei = {});
    const existingInvoker = invokers[key];
    
    // 属性存在，直接修改
    if (nextValue && existingInvoker) {
      existingInvoker.value = nextValue;
    } else {
    // 属性不存在，进行新增或者删除事件
      const eventName = key.slice(2).toLowerCase();
      // 注册事件
      if (nextValue) {
        const invoker = (invokers[key] = nextValue);
        el.addEventListener(eventName, invoker);
      } else {
      // 移除事件
        el.removeEventListener(eventName, existingInvoker);
        invokers[key] = undefined;
      }
    }
  } else {
  // 新的值不存在，直接删除操作
    if (nextValue === null || nextValue === "") {
      el.removeAttribute(key);
    } else {
    
    // 反之存在则进行添加新的属性
      el.setAttribute(key, nextValue);
    }
  }
}
```

## 更新children
> 更新children,这里有一个条件，如果新的children和old children 则**触发diff 算法**，其实diff 算法也没有想象中的那么复杂，是一点点根据边界情况和性能优化写出来的，下面咋们就一起来写一个**简单版的diff算法**吧

在处理 children 更新的过程中，采用的是一种双端对比的模式，**这样就可以缩小对比的范围**

### 左侧对比
> 通过左侧对比获取起始位置


```js
/**
 * 是否相同
 * @param {*} n1 
 * @param {*} n2 
 * @returns 
 */
const isSame = (n1, n2) => {
  return n1.value === n2.value && n1.key === n2.key
}
// 咋们的新老节点分别为n1, n2
const n1 = [{ value: 'A', key: 'A' }, { value: 'B', key: 'B' }, { value: 'C', key: 'C' }]
const n2 = [{ value: 'A', key: 'A' }, { value: 'B', key: 'B' }, { value: 'E', key: 'E' }, { value: 'D', key: 'D' }]

// 从左侧开始查找，看看左侧有哪些是相同的，那么在更新的时候就可以跳过相同的节点，节约性能
const diff = (n1, n2) => {
// 为了方便演示，咋们就只操作 n1来完成diff的操作
  const copyN1 = JSON.parse(JSON.stringify(n1))
  let i = 0;
  let e1 = n1.length - 1
  let e2 = n2.length - 1
  // 确定起始的位置i
  while (i <= e1 && i <= e2) {
    if (isSame(n1[i], n2[i])) {
      i++
    } else {
      break
    }
  }
 }

```
 从上面的代码，咋们可以获取到**i的值**，起始位置就获取好了

### 右侧对比
> 通过右侧对比，获取结束位置，用来锁定中间有问题的部分


```ts
// 咋们的新老节点分别为n1, n2
const n1 = [{ value: 'A', key: 'A' }, { value: 'B', key: 'B' }, { value: 'C', key: 'C' }]
const n2 = [{ value: 'D', key: 'D' }, { value: 'E', key: 'E' }, { value: 'B', key: 'B' }, { value: 'C', key: 'C' }]

// 上面咋们知道了，左侧id的位置，那么接下来咋们来确定右侧的位置
while (i <= e1 && i <= e2) {
  if (isSame(n1[e1], n2[e2])) {
    e1--
    e2--
  } else {
    break
  }
}
```
这样咋们就确定了结束位置了，接下来就是判断边界条件了


###  新的比老的长———创建新的
> 在新的比老的长里面，分为两种情况，
>1. 新的**右边**比老的长
>2. 新的**左边**比老的长

#### 右边比老的长

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ce840f714f44e52b0dbbf3829ea9da8~tplv-k3u1fbpfcp-watermark.image?)

```js
// 咋们的新老节点分别为n1, n2
const n1 =  [{ value: 'A', key: 'A' }, { value: 'B', key: 'B' }]
const n2 =  [{ value: 'A', key: 'A' }, { value: 'B', key: 'B' }, { value: 'C', key: 'C' }]

// ... 获取i e1, e2

// 在本种情况种， i = 2, e1 = 1 , e2 = 2
// 当 i > e1 时候，并且 i <= e2 的时候，咋们就可以确定新节点的右侧比老节点长
if (i > e1 && i <= e2) {
    // 增加新的节点i
    copyN1.splice(i, 0, ...n2.slice(i))
  }

return copyN1
```

####  左边比老的长

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b476bd2d13a344d9bdc977c1de0ea32d~tplv-k3u1fbpfcp-watermark.image?)


```js
// 咋们的新老节点分别为n1, n2
const n1 =  [{ value: 'A', key: 'A' }, { value: 'B', key: 'B' }]
const n2 =  [ { value: 'C', key: 'C' },{ value: 'A', key: 'A' }, { value: 'B', key: 'B' }]

// ... 省略其他逻辑

// 在这种情况下， i = 0, e1 = -1, e2 = 0， 所以条件还是 i > e1 && i <= e2,
// 但是上面的 copyN1.splice(i, 0, ...n2.slice(i)) 这个方法是否适合这里呢，显然不适合


 if (i > e1 && i <= e2) {
    while (i <= e2) {
      // 增加新的节点i,这里与dom操作是不一样的，在dom种没有插入指定位置的api,
      copyN1.splice(i, 0, n2[i])
      i++
    }
  }
```
###  新的比老的短———删除老的

> 在新的比老的短里面，分为两种情况，
>1. 新的**右边**比老的短
>2. 新的**左边**比老的短

####  新的**右边**比老的短

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62d8ccff40db4ac896bb4b886cc5342a~tplv-k3u1fbpfcp-watermark.image?)


```js
// 咋们的新老节点分别为n1, n2
const n1 =  [{ value: 'A', key: 'A' }, { value: 'B', key: 'B' }， { value: 'C', key: 'C' }]
const n2 =  [{ value: 'A', key: 'A' }, { value: 'B', key: 'B' }]

// ... 省略其他逻辑

// 在这种情况种，咋们的 i = 2, e1 = 2 , e2 = 1 所以满足新节点比老节点短的条件是 i <= e1 && i > e2

else if (i <= e1 && i > e2) {
    // 新的节点比老的节点短,进行删除老的节点
    while (i <= e1) {
      copyN1.splice(i, 1)
      i++
    }
  }
```

#### 新的**左边**比老的短


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a266286ef8f74fdf8216777f41f332b6~tplv-k3u1fbpfcp-watermark.image?)

```js
// 咋们的新老节点分别为n1, n2
const n1 =  [{ value: 'C', key: 'C' },{ value: 'A', key: 'A' }, { value: 'B', key: 'B' }]
const n2 =  [{ value: 'A', key: 'A' }, { value: 'B', key: 'B' }]

// ... 省略其他逻辑

// 在这种情况种，咋们的 i = 2, e1 = 2 , e2 = 1 所以满足新节点比老节点短的条件是 i <= e1 && i > e2, 这里会发现和我们右侧的是一样的

else if (i <= e1 && i > e2) {
    // 新的节点比老的节点短,进行删除老的节点
    while (i <= e1) {
      copyN1.splice(i, 1)
      i++
    }
  }
```
### 中间对比
通过上面的左右对比，咋们就可以得出一个新的区域对于**n2的范围在 【i，e2】** 而**n1的范围是【i, e1】**
在中间对比的时候咋们有一种很直接的方法—— **直接双重for循环来暴力破解**😀😀😀，但是这么做肯定是有点费性能的，`vue3`肯定不是这么做的，人家在里面用了个 **最长递增子序列**算法来查找尽可能多的节点是不用变化的.
不熟悉最长递增子序列算法请参考[这里](https://juejin.cn/post/7095988939319672862#heading-5)

> 在比较中间部分的时候，又会有以下几种情况：
> 1. 剩余部分的节点都存在于老的和新的，只是顺序发生变化
> 2. 剩余部分只存在于新的，需要增加节点
> 3. 剩余部分只存在于老的，需要删除节点

#### 中间部分只存在于老的————删除

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/135c73138d284520bd96893e141574e5~tplv-k3u1fbpfcp-watermark.image?)


```js
// 咋们的新老节点分别为n1, n2
const n51 = [{ value: 'A', key: 'A' }, { value: 'B', key: 'B' }, { value: 'C', key: 'C' }, { value: 'D', key: 'D' }, { value: 'E', key: 'E' }]
const n52 = [{ value: 'A', key: 'A' },{ value: 'B', key: 'B' }, { value: 'C', key: 'C' }, { value: 'E', key: 'E' }]

// 在这里咋们可以看到，老节点中间是多了一个D节点，那咋们就需要把这个节点找出来

... 省略其其他逻辑
else {

    //处理中间节点
    let s1 = i, s2 = i;
    // 对新节点建立索引，给缓存起来，
    const keyToNewIndexMap = new Map();
    // 缓存新几点
    for (let i = s2; i <= e2; i++) {
      keyToNewIndexMap.set(n2[i].key, i)
    }
    // 需要处理新节点的数量
    const toBePatched = e2 - s2;

    // 遍历老节点，需要把老节点有的，而新节点没有的给删除
    for (let i = s1; i <= e1; i++) {

      let newIndex;
      // 存在key,从缓存中取出新节点的索引
      if (n1[i].key && n1[i].key == null) {
        newIndex = keyToNewIndexMap.get(n1[i].key)
      } else {
        // 不存在key,遍历新节点，看看能不能在新节点中找到老节点
        for (let j = s2; j <= e2; j++) {
          if (isSame(n1[i], n2[j])) {
            newIndex = j
            break
          }
        }
      }
      // 如果newIndex 不存在，则是老节点中有的，而新节点没有，删除
      if (newIndex === undefined) {
        copyN1.splice(i, 1)
      }
    }
```

在这里咋们可以看错，在v-for的时候，key的作用了吧😄😄😄，不写的话就会再来一遍循环，造成性能的浪费。

#### 中间部分的节点新节点有，老节点无————新增节点

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/77256d0d2322444b8b0266af775f6e90~tplv-k3u1fbpfcp-watermark.image?)


```js
// 咋们的新老节点分别为n1, n2
const n51 = [{ value: 'A', key: 'A' }, { value: 'B', key: 'B' }, { value: 'C', key: 'C' },  { value: 'E', key: 'E' }]
const n52 = [{ value: 'A', key: 'A' },{ value: 'B', key: 'B' }, { value: 'C', key: 'C' }, { value: 'D', key: 'D' },{ value: 'E', key: 'E' }]

// 省略其他逻辑
// 在这里咋们是知道D节点是新增的节点，为了让代码知道D节点是新增的节点，咋们需要做一个新老节点的映射

  // 对老节点建立索引映射， 初始化为 0 , 后面处理的时候 如果发现是 0 的话，那么就说明新值在老的里面不存在
    const newIndexToOldIndexMap = new Array(toBePatched).fill(0)
    
    在newIndex 存在的时候，来更新老节点的
 // 把老节点的索引记录下来， +1 的原因是怕，i 恰好为0
   newIndexToOldIndexMap[newIndex - s2] = i + 1
    
    // 遍历新节点，
    for (let i = s2; i <= toBePatched; i++) {
      // 如果新节点在老节点中不存在，则创建
      if (newIndexToOldIndexMap[i] === 0) {
       copyN1.splice(i + s2, 0, n2[i + s2])
      }
    }
```

#### 中间部分节点都存在，移动位置


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f122dcf807fd41dda0a4b0f16e823d9b~tplv-k3u1fbpfcp-watermark.image?)


```ts
// 咋们的新老节点分别为n1, n2
const n71 = [{ value: 'A', key: 'A' }, { value: 'B', key: 'B' }, { value: 'C', key: 'C' }, { value: 'D', key: 'D' }, { value: 'E', key: 'E' }]
const n72 = [{ value: 'A', key: 'A' }, { value: 'C', key: 'C' }, { value: 'D', key: 'D' }, , { value: 'B', key: 'B' }, { value: 'E', key: 'E' }]

// 在这种情况下，节点C和节点D的位置是没有变化的，之哟节点B是变化了的,所以咋们只要移动节点B
// 我们人知道需要移动节点B呢？ 
移动的条件： 如果从老节点的newIndex 一直都是升序的话，机不需要移动，反之则移动，使用最长子序列来规定最小的移动范围

const diff = (n1, n2) => {
  const copyN1 = JSON.parse(JSON.stringify(n1))
  let i = 0;
  let e1 = n1.length - 1
  let e2 = n2.length - 1
  // 确定起始的位置i
  while (i <= e1 && i <= e2) {
    if (isSame(n1[i], n2[i])) {
      i++
    } else {
      break
    }
  }

  // 确定结束位置
  while (i <= e1 && i <= e2) {
    if (isSame(n1[e1], n2[e2])) {
      e1--
      e2--
    } else {
      break
    }
  }

  // 条件一， 新节点比老节点长
  // 条件1.1 新节点的右侧比老节点长
  // 当 i > e1 时候，并且 i <= e2 的时候，咋们就可以确定新节点的右侧比老节点长

  if (i > e1 && i <= e2) {

    while (i <= e2) {
      // 增加新的节点i
      copyN1.splice(i, 0, n2[i])
      i++
    }
  } else if (i <= e1 && i > e2) {
    // 新的节点比老的节点短,进行删除老的节点
    while (i <= e1) {
      copyN1.splice(i, 1)
      i++
    }
  } else {

    //处理中间节点
    let s1 = i, s2 = i;
    // 对新节点建立索引，给缓存起来，
    const keyToNewIndexMap = new Map();
    // 是否需要移动
    let moved = false;
    // 最大新节点索引
    let maxNewIndexSoFar = 0;
    // 收集新节点的key
    for (let i = s2; i <= e2; i++) {
      keyToNewIndexMap.set(n2[i].key, i)
    }
    // 需要处理新节点的数量
    const toBePatched = e2 - s2 + 1;

    // 对老节点建立索引映射， 初始化为 0 , 后面处理的时候 如果发现是 0 的话，那么就说明新值在老的里面不存在
    const newIndexToOldIndexMap = new Array(toBePatched).fill(0)

    // 遍历老节点，需要把老节点有的，而新节点没有的给删除
    for (let i = s1; i <= e1; i++) {
      let newIndex;
      // 存在key,从缓存中取出新节点的索引
      if (n1[i].key && n1[i].key == null) {
        newIndex = keyToNewIndexMap.get(n1[i].key)
      } else {
        // 不存在key,遍历新节点，看看能不能在新节点中找到老节点
        for (let j = s2; j <= e2; j++) {
          if (isSame(n1[i], n2[j])) {
            newIndex = j
            break
          }
        }
      }
      // 如果newIndex 不存在，则是老节点中有的，而新节点没有，删除
      if (newIndex === undefined) {
        copyN1.splice(i, 1)
      } else {
        // 老节点在新节点中存在

        // 把老节点的索引记录下来， +1 的原因是怕，i 恰好为0
        newIndexToOldIndexMap[newIndex - s2] = i + 1

        // 新的 newIndex 如果一直是升序的话，那么就说明没有移动
        if (newIndex >= maxNewIndexSoFar) {
          maxNewIndexSoFar = newIndex
        } else {
          moved = true
        }
      }
    }

    // 利用最长递增子序列来优化移动逻辑
    // 因为元素是升序的话，那么这些元素就是不需要移动的
    // 而我们就可以通过最长递增子序列来获取到升序的列表
    // 在移动的时候我们去对比这个列表，如果对比上的话，就说明当前元素不需要移动
    const increasingNewIndexSequence = moved
      ? getSequence(newIndexToOldIndexMap)
      : [];


    //  increasingNewIndexSequence 返回的是最长递增子序列的索引 
    let j = 0;

    // 遍历新节点，
    for (let i = 0; i < toBePatched; i++) {
      // 如果新节点在老节点中不存在，则创建
      if (newIndexToOldIndexMap[i] === 0) {
        copyN1.splice(i + s2, 0, n2[i + s2])
      } else if (moved) {
        // 新老节点都存在，需要进行移动位置
        if (j > increasingNewIndexSequence.length - 1 || i !== increasingNewIndexSequence[j]) {
        // 先删掉节点，然后插入 即是移动
          copyN1.splice(newIndexToOldIndexMap[i] - 1, 1)
          copyN1.splice(i + s2, 0, n2[i + s2])
        } else {
          j++
        }
      }
    }
  }
```

自此，整个diff算法的核心就在这里了，文章里面采用的是diff数组，而vue里面是diff的是真实的dom

### 测试

```js

const oldNode = [
  { value: 'A', key: 'A' },
  { value: 'B', key: 'B' },
  { value: 'C', key: 'C' },
  { value: 'E', key: 'E' },
  { value: 'F', key: 'F' },
  { value: 'G', key: 'G' }]

const newNode = [
  { value: 'A', key: 'A' },
  { value: 'B', key: 'B' },
  { value: 'D', key: 'D' },
  { value: 'C', key: 'C' },
  { value: 'E', key: 'E' },
  { value: 'F', key: 'F' },
  { value: 'G', key: 'G' }]


console.log('oldNode', oldNode, 'newNode', newNode, '新节点和老节点都存在，位置发生变化', diff(oldNode, newNode))

```


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/77d41a05ea1549bb92096fe6ab63c69c~tplv-k3u1fbpfcp-watermark.image?)

> 更多详情，请查看[源码](https://github.com/cll123456/my-study/blob/master/my-vue3-code/3-comp-update/diff.js)
