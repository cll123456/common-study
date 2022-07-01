

# 引言
<<往期回顾>>

1.  [vue3源码分析——实现组件通信provide,inject](https://juejin.cn/post/7111682377507667999 "https://juejin.cn/post/7111682377507667999")
1.  [vue3源码分析——实现createRenderer，增加runtime-test](https://juejin.cn/post/7112349410528329758 "https://juejin.cn/post/7112349410528329758")
2. [ vue3源码分析——实现element属性更新，child更新](https://juejin.cn/post/7114203851770560525)

本期来实现，上一期中还差了children与children的对比😉😉😉 **vue3更新流程中的children与children的对比，也就是diff算法**，所有的[源码请查看](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcll123456%2Fcommon-study%2Ftree%2Fmaster%2Fvue3-analysis%2F14-finish-comp-update "https://github.com/cll123456/common-study/tree/master/vue3-analysis/14-finish-comp-update")




# 正文
> 在children于children的对比中，vue3采用的是**双端对比**的方式，使用3个指针来进行移动对比，那肯定就会有许多的情况，且听我慢慢道来👍👍👍！

## 先看个结果

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/513b9ea68b1e44d78fef81642c0ea82e~tplv-k3u1fbpfcp-watermark.image?)
> 通过上面的测试用例，可以看到是分了7种情况来的，在本篇文章，不采用编写测试用例，有兴趣的可以自己去github上面查看，这里主要使用图文加上代码，帮助大家更快的理解vue3中的diff算法


# 锁定对比的范围
既然采用的是双端对比，那么肯定是需要3个指针的，请看下图：



![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf6d1580df5d4552b5ddf94239354a34~tplv-k3u1fbpfcp-watermark.image?)
总共有3个指针
- i 代表的是起始指针默认是  0
- e1 代表的是old children的末尾指针， 默认是 oldChildren.length -1
- e2 代表的是new children的末尾指针， 默认是 newChildren.length -1

既然有了指针，那是否需要锁定范围呢！指针做对应的移动。移动的方式如下：
- 如果oldChildren和newChildren左边的节点都一样，那么就需要i往右边移动，直到不同位置停止.
- 如果oldChildren和newChildren右边的节点都一样，那么对应的e1和e2往左边移动，同样也是到不同位置停止。
根据上面的需求，我相信都能得出一个条件并且写出以下代码


```ts
export function patchKeyedChildren(oldChildren, newChildren){
    let i = 0;
    let e1 = oldChildren.length - 1;
    let e2 = newChildren.length - 1;
    
    // 当 i <= e1 && i<= e2的时候，需要左边移动
    while(i <= e1 && i <= e2){
      if(oldChildren[i] 等于 newChildren[i]){
        i++
      }else{
        break;
      }
    }
    
    // 同理，右边的指针往左边移动也是这样
      while(i <= e1 && i <= e2){
      if(oldChildren[e1] 等于 newChildren[e2]){
        el--;
        e2--;
      }else{
        break;
      }
    }
}
```
> 上面的代码是**伪代码**，主要是用于说明情况，双端对比，拿到不相同的部分，接下来根据不相同的部分来进行分情况讨论

# 分情况讨论
总共有7中情况，分别是：

1. 老的比新的**左边长**，在新的左边创删除的节点
2. 老的比新的**右边长**，在新的右边创删除的节点
3. 老的比新大**左边短**,在新的左边创建新的节点
4. 老的比新的**右边短**，在新的右边创建新的节点
5. 老的比新的**中间节点多**,删除多余的节点
6. 老的新的**中间节点一样多，位置发生变化**，需要移动位置
7. 老的新的**中间节点少**，创建新的节点

## 老的左右边长
> 这里包含了老的左边长和右边长，都是需要删除对应边界的节点

### 老节点左边长
会发现，**i不动， e1和 e2两个指针往左边移动**
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ced2e5370b1457e8c3927b1649d7374~tplv-k3u1fbpfcp-watermark.image?)


最终 `i = 0, e1 = 1, e2 = -1`,所以可以得出一个条件是 `i > e2 && i <= e1`

### 老节点右边长
可以发现，**e1,e2不动，i往右边移动**
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c883253ca494a31afc144cc48743652~tplv-k3u1fbpfcp-watermark.image?)
最终 `i = 3, e1 = 3, e2 = 2`,所以可以得出一个条件是 `i > e2 && i <= e1`

老的比新的两边长，就是说只要满足 `i > e2 && i <= e1`这个条件，那就需要执行删除操作

```ts
export function patchKeyedChildren(oldChildren, newChildren){
// ……省略上面的指针移动代码
  if (i >= e2 && i <= e1) {
     // 为啥需要while呢，因为可能两边出现多个多余的节点，需要循环删除
      while (i <= e1) {
       // 删除当前节点
        hostRemove(n1[i].el)
        i++
      }
    }
}
```

## 老的左右边短
> 这里包含了，老节点的左边和右边比新的节点是更短的，需要创建新的节点

### 老的比新的左边短
**i不动，e1，e2往左边移动**


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/02ed58cb075f432ea1d1a1f8469a90d8~tplv-k3u1fbpfcp-watermark.image?)
最终 `i = 0, e1 = -1, e2 = 0`,所以可以得出一个条件是 `i > e1 && i <= e2`

### 老的比新的右边短
**e1,e2不动，i往右边移动**


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e5de7d792c504184ae3f848694042066~tplv-k3u1fbpfcp-watermark.image?)
最终 `i = 3, e1 = 2, e2 = 3`,所以可以得出一个条件是 `i > e1 && i <= e2`

老的比新的两边短，就是说只要满足 `i > e1 && i <= e2`这个条件，那就需要执行新增节点的操作


```ts
export function patchKeyedChildren(oldChildren, newChildren){
// ……省略上面的代码
else  if (i > e1 && i <= e2) {
      //     a b   i = 0 e1 = -1 e2 = 0
      // d c a b  需要找到a的位置
      const nextPos = e2 + 1;
      const anchor = nextPos < l2 ? n2[nextPos].el : null
     // 同理，需要循环增加节点
      while (i <= e2) {
       // 插入节点
       patch(null, n2[i], container, parentComponent, anchor)
        i++
      }
    }
}
```
> 看到这里，恭喜你👍👍👍，vue3 diff的双端对比就已经结束了，接下来锁定了一个中间范围，来判断中间范围的内容，删除，移动位置，新增

## 中间节点老的比新的多

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7dc3e6a253d64cfb9be11b25785af60b~tplv-k3u1fbpfcp-watermark.image?)

通过上面代码的执行，最终 `i = 2, e1 =2， e2 = 2`，但是这个不可以作为条件哦！思路需要转个弯🦮🦮🦮

通过**i 和 e1**可以锁定，老节点中间部分，**i 和 e2**可以锁定新节点的范围;
遍历老的节点,判断老的节点在新节点中是否存在,可以使用双重for循环,但是比较费时间,可以把新节点的内容给缓存起来,那么可以通过空间来换取时间


```js
export function patchKeyedChildren(oldChildren, newChildren){
// ……省略上面的代码
else{
    // 中间对比
      const s1 = i;
      const s2 = i;
      // a b c d   i = 2 e1 = 2 e2 = 1
      // a b d
      // 条件  删除c

      // 判断旧节点是否在新节点里面，在的话保留，不在则删除
      const newIndexToOldIndexMap = new Map()
        // 把新节点的key装入map
      for (let j = s2; j <= e2; j++) {
        newIndexToOldIndexMap.set(newChildren[j].key, j)
      }
      // 然后遍历老的节点,判断是否在新的节点里面
       for (let i = s1; i <= e1; i++) {
        let newIndex;
        if (n1[i].key !== null) {
          newIndex = newIndexToOldIndexMap.get(n1[i].key)
        } else {
          // key 不存在，需要遍历新节点，看能不能找到这个节点
          for (let j = s2; j <= e2; j++) {
            if (isSameVNode(oldChildren[i], newChildren[j])) {
              newIndex = j
              break;
            }
          }
        }
        if (newIndex === undefined) {
          // 删除节点
          hostRemove(n1[i].el)
       }
  }
}
```

> 通过上面可以发现,**如果在中间对比的时候不写key,将会再来一次for循环,那就比较费性能了!!!**

## 中间对比,节点都存在,需要移动节点


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dbe89b25f89946c6a07018fee7264576~tplv-k3u1fbpfcp-watermark.image?)
通过上面代码的执行，最终 `i = 2, e1 =4， e2 = 4`，
在上面的图中,会发现新老节点中只有**E的节点移动了,其他的节点都不动**,那么怎么找出 [C,D,E]和[E,C,D]中的最长连续的节点呢?

遇到这个,肯定需要使用 **最长递增子序列的算法**啦,通过这个可以得出最长节点的连续范围.

但是最长递增子序列中需要一个数组,这个数组需要记录老节点与新节点的位置关系


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a0a12f4528694e4bafffc6d96a09bf7b~tplv-k3u1fbpfcp-watermark.image?)\

> 通过上图,可以看到,先定义一个数组,长度是对比之后的长度,然后默认**赋值为0**,然后遍历老节点,用老节点的i来表示数组的结果,newIndex表示数据的下标,这样就能展示出新老节点的映射关系了


接下来实现一下这部分的功能,由于这一部分的内容与整体有关,我把整个diff的逻辑都放出来,全部已经写好注释了😉😉😉


```js
 function patchKeyChildren(n1, n2, container, parentComponent, anchor) {

    // 采用双端对比法
    const l2 = n2.length
    const l1 = n1.length
    let i = 0;
    let e1 = l1 - 1;
    let e2 = l2 - 1;

    const isSameVNode = (vnode1, vnode2) => {
      return vnode1.type === vnode2.type && vnode1.key === vnode2.key
    }

    // 获取左侧的位置
    while (i <= e1 && i <= e2) {
      if (isSameVNode(n1[i], n2[i])) {
        // 对比对应的子节点
        patch(n1[i], n2[i], container, parentComponent, anchor)
      } else {
        break;
      }
      i++
    }
    // 获取右侧是位置
    while (i <= e1 && i <= e2) {
      if (isSameVNode(n1[e1], n2[e2])) {
        patch(n1[e1], n2[e2], container, parentComponent, anchor)
      } else {
        break;
      }
      e1--;
      e2--;
    }

    // 新的比老的短，删除老的
    if (i >= e2 && i <= e1) {
      while (i <= e1) {
        hostRemove(n1[i].el)
        i++
      }
    }

    // 新的比老的长，挂载新的
    else if (i > e1 && i <= e2) {
      // 往左侧添加 
      //    a b   i = 0 e1 = -1 e2 = 0
      // d c a b  需要找到a的位置
      const nextPos = e2 + 1;
      const anchor = nextPos < l2 ? n2[nextPos].el : null
      while (i <= e2) {
        patch(null, n2[i], container, parentComponent, anchor)
        i++
      }
    }
    else {
      // 中间对比
      const s1 = i;
      const s2 = i;
      // a b c d   i = 2 e1 = 2 e2 = 1
      // a b d
      // 条件  删除c

      // 判断旧节点是否在新节点里面，在的话保留，不在则删除
      const newIndexToOldIndexMap = new Map()
      // 增加一个优化点,如果旧节点的数量和新节点的数量已经一致，那么其余旧节点直接删除
      const toBePatched = e2 - s1 + 1;
      let patched = 0;

      // 将老节点和新节点做映射 b c d --> c d b
      const oldIndexToNewIndexMap = new Array(toBePatched).fill(0)
      // 判断是否需要移动节点，不需要移动则不需要调用获取最长递增子序列
      let moved = false;
      let maxIndexSoFar = 0;

      // 把新节点的key装入map
      for (let j = s2; j <= e2; j++) {
        newIndexToOldIndexMap.set(n2[j].key, j)
      }

      for (let i = s1; i <= e1; i++) {
        // 新节点已经满足前面对比的老节点，需要删除其余的老节点
        if (patched >= toBePatched) {
          hostRemove(n1[i].el)
          continue;
        }
        let newIndex;
        if (n1[i].key !== null) {
          newIndex = newIndexToOldIndexMap.get(n1[i].key)
        } else {
          // key 不存在，需要遍历新节点，看能不能找到这个节点
          for (let j = s2; j <= e2; j++) {
            if (isSameVNode(n1[i], n2[j])) {
              newIndex = j
              break;
            }
          }
        }
        if (newIndex === undefined) {
          // 删除节点
          hostRemove(n1[i].el)
        } else {
          // 更新映射关系
          oldIndexToNewIndexMap[newIndex - s1] = i + 1
          // 判断是否需要移动节点
          if (newIndex > maxIndexSoFar) {
            maxIndexSoFar = newIndex;
          } else {
            moved = true
          }
          // 存在的话，进行下一次的patch
          patch(n1[i], n2[newIndex], container, parentComponent, anchor)
          patched++
        }
      }

      // 获取最长递增序列  获取的是最长递增子序列的索引下标数组
      const longestIncreasingSubsequence = moved ? getLongestIncreasingSubsequence(oldIndexToNewIndexMap) : []
      // 遍历，判断当前的下标是否存在于最长递增序列中，存在则不需要移动，不存在需要移动

      // 使用游标j
      let j = longestIncreasingSubsequence.length - 1;
      for (let i = toBePatched - 1; i >= 0; i--) {
        // 计算下一个节点
        const curIndex = i + s2;
        const anchor = curIndex + 1 < l2 ? n2[curIndex + 1].el : null;
        if (oldIndexToNewIndexMap[i] === 0) {
          // 新增节点
          patch(null, n2[i + s2], container, parentComponent, anchor)
        }
        else if (moved) {
          if (j < 0 || i !== longestIncreasingSubsequence[j]) {

            // 移动节点
            hostInsert(n2[curIndex].el, container, anchor)
          } else {
            // 命中目标节点，不需要移动
            j--;
          }
        }
      }
    }
  }
```

## 中间节点新增
对于这个功能,如果看懂了上面代码的话,是非常简单的,只需要判断`oldIndexToNewIndexMap[i]`是否为0,为0则代表,老节点中没有,新节点有,需要新增节点哦!

# 总结

本期主要实现了vue3的diff算法,主要分为7个部分:
1. 老的比新的**左边长**，在新的左边创删除的节点
2. 老的比新的**右边长**，在新的右边创删除的节点
3. 老的比新大**左边短**,在新的左边创建新的节点
4. 老的比新的**右边短**，在新的右边创建新的节点
5. 老的比新的**中间节点多**,删除多余的节点
6. 老的新的**中间节点一样多，位置发生变化**，需要移动位置
7. 老的新的**中间节点少**，创建新的节点
只有在中间节点一样多的时候,才会使用最长递增子序列,来判断哪些是需要移动的,只能说vue3的设计太厉害和灵活了,加油!!!
