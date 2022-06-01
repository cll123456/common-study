
// 情况一 老的节点比新的节点长—— 删除

// 1.1 左侧不同，右侧相同

/**
 * 是否相同
 * @param {*} n1 
 * @param {*} n2 
 * @returns 
 */
const isSame = (n1, n2) => {
  return n1.value === n2.value && n1.key === n2.key
}

/**
 * 获取最长子序列
 * @param {*} arr 
 * @returns 
 */
function getSequence(arr) {
  const p = arr.slice()
  const result = [0]
  let i, j, u, v, c
  const len = arr.length
  for (i = 0; i < len; i++) {
    const arrI = arr[i]
    if (arrI !== 0) {
      j = result[result.length - 1]
      if (arr[j] < arrI) {
        p[i] = j
        result.push(i)
        continue
      }
      u = 0
      v = result.length - 1
      while (u < v) {
        c = (u + v) >> 1
        if (arr[result[c]] < arrI) {
          u = c + 1
        } else {
          v = c
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1]
        }
        result[u] = i
      }
    }
  }
  u = result.length
  v = result[u - 1]
  while (u-- > 0) {
    result[u] = v
    v = p[v]
  }
  return result
}

console.log(getSequence([2, 1, 4, 3, 4, 6, 1, 8, 4]))

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

    debugger
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

          copyN1.splice(newIndexToOldIndexMap[i] - 1, 1)
          copyN1.splice(i + s2, 0, n2[i + s2])
        } else {
          j++
        }
      }
    }
  }




  return copyN1
}

// 情况1 新的比老的右侧长
const n1 = [{ value: 'A', key: 'A' }, { value: 'B', key: 'B' }]
const n2 = [{ value: 'C', key: 'C' }, { value: 'A', key: 'A' }, { value: 'B', key: 'B' }]

console.log('n1', n1, 'n2', n2, '新的比老的右侧长', diff(n1, n2))

// 情况2 新的比老的左侧长
const n11 = [{ value: 'A', key: 'A' }, { value: 'B', key: 'B' }]
const n22 = [{ value: 'D', key: 'D' }, { value: 'C', key: 'C' }, { value: 'A', key: 'A' }, { value: 'A', key: 'A' }, { value: 'B', key: 'B' }]

console.log('n11', n11, 'n22', n22, '新的比老的左侧长', diff(n11, n22))

// 情况三 新的比老的右侧短
const n31 = [{ value: 'A', key: 'A' }, { value: 'B', key: 'B' }, { value: 'C', key: 'C' }]
const n32 = [{ value: 'A', key: 'A' }, { value: 'B', key: 'B' }]

console.log('n31', n31, 'n32', n32, '新的比老的右侧短', diff(n31, n32))

// 情况四 新的比老的左侧短
const n41 = [{ value: 'C', key: 'C' }, { value: 'A', key: 'A' }, { value: 'B', key: 'B' }]
const n42 = [{ value: 'A', key: 'A' }, { value: 'B', key: 'B' }]
console.log('n41', n41, 'n42', n42, '新的比老的右侧短', diff(n41, n42))



// 情况五 中间节点老的多，新的少
const n51 = [{ value: 'A', key: 'A' }, { value: 'B', key: 'B' }, { value: 'C', key: 'C' }, { value: 'D', key: 'D' }, { value: 'E', key: 'E' }]
const n52 = [{ value: 'A', key: 'A' }, { value: 'B', key: 'B' }, { value: 'C', key: 'C' }, { value: 'E', key: 'E' }]
console.log('n51', n51, 'n52', n52, '中间节点老的多，新的少', diff(n51, n52))


// 情况六 中间节点老的少，新的多
const n61 = [{ value: 'A', key: 'A' }, { value: 'B', key: 'B' }, { value: 'C', key: 'C' }, { value: 'E', key: 'E' }]
const n62 = [{ value: 'A', key: 'A' }, { value: 'B', key: 'B' }, { value: 'C', key: 'C' }, { value: 'D', key: 'D' }, { value: 'E', key: 'E' }]
console.log('n61', n61, 'n62', n62, '中间节点老的少，新的多', diff(n61, n62))

// 情况七 新节点和老节点都存在，位置发生变化
const n71 = [{ value: 'A', key: 'A' }, { value: 'B', key: 'B' }, { value: 'C', key: 'C' }, { value: 'D', key: 'D' }, { value: 'E', key: 'E' }]
const n72 = [{ value: 'A', key: 'A' }, { value: 'C', key: 'C' }, { value: 'D', key: 'D' }, { value: 'B', key: 'B' }, { value: 'E', key: 'E' }]
console.log('n71', n71, 'n72', n72, '新节点和老节点都存在，位置发生变化', diff(n71, n72))


// test

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
