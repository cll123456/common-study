import { effect } from "reactivity"
import { ShapeFlags } from "shared"
import { createAppAPI } from "./apiCreateApp"
import { createComponentInstance, setupComponent } from "./component"
import { shouldUpdateComponent } from "./helpers/componentsUtils"
import { Fragment, Text } from "./vnode"

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProps: hostPatchProps,
    insert: hostInsert,
    setElementText: hostSetElementText,
    remove: hostRemove
  } = options

  /**
   * render函数
   * @param vnode 
   * @param container 
   */
  function render(vnode, container) {
    // 调用patch
    patch(null, vnode, container, null, null)
  }


  function patch(n1, n2, container, parentComponent, anchor) {
    const { type } = n2
    switch (type) {
      case Fragment:
        // 处理slot中的fragment节点
        processFragment(n2, container, parentComponent, anchor)
        break;
      case Text:
        processTextComponent(n2, container)
        break;
      default:
        // 判断是处理组件，还是处理元素
        if (n2.shapeflag & ShapeFlags.STATE_COMPONENT) {
          // 处理组件
          processComponent(n1, n2, container, parentComponent, anchor)
        } else if (n2.shapeflag & ShapeFlags.ELEMENT) {
          // 处理元素
          processElement(n1, n2, container, parentComponent, anchor)
        }
        break
    }

  }

  function processFragment(vnode: any, container: any, parentComponent, anchor) {
    // 处理slot的元素，只需拿到他的children即可
    mountChildren(vnode.children, container, parentComponent, anchor)
  }

  /**
   * 处理文本节点
   */
  function processTextComponent(vnode: any, container: any) {
    // 创建文本节点
    const el = document.createTextNode(vnode.children)
    // 设置vnode的el
    vnode.el = el
    // 挂载文本节点
    container.appendChild(el)
  }

  function processComponent(n1, n2, container, parentComponent, anchor) {
    if (!n1) {
      // 挂载组件
      mountComponent(n2, container, parentComponent, anchor)
    } else {
      // 更新组件
      updateComponent(n1, n2)
    }
  }
  /**
   * 更新组件
   * @param n1 vnode1
   * @param n2 vnode2
   */
  function updateComponent(n1, n2) {
    // 更新组件
    const instance = (n2.component = n1.component)
    // 判断是否需要更新
    if (shouldUpdateComponent(n1, n2)) {
      instance.next = n2;
      instance.update();
    } else {
      n2.el = n1.el;
      instance.vnode = n2
    }
    // 获取组件的props
    // const oldProps = instance.props
    // // 获取组件的props
    // const newProps = n2.props
    // // 判断组件的props是否发生变化
    // if (oldProps === newProps) {
    //   // 如果没有变化，直接返回
    //   return
    // }
    // // 设置组件的props
    // instance.props = newProps
    // // 更新组件
    // instance.update()
  }



  function mountComponent(vnode, container, parentComponent, anchor) {
    // 创建组件实例
    const instance = createComponentInstance(vnode, parentComponent)

    // 设置组件的状态
    setupComponent(instance)

    // 对组件render函数进行依赖收集
    setupRenderEffect(instance, vnode, container, anchor);
  }




  function setupRenderEffect(instance: any, vnode: any, container: any, anchor) {
    instance.update = effect(() => {
      if (!instance.isMounted) {
        // 获取到vnode的子组件,传入proxy进去
        const { proxy } = instance
        const subtree = instance.render.call(proxy)
        instance.subtree = subtree

        // 遍历children
        patch(null, subtree, container, instance, anchor)

        // 赋值vnode.el,上面执行render的时候，vnode.el是null
        vnode.el = subtree.el

        // 渲染完成
        instance.isMounted = true
      } else {
        // 更新操作

        const { next, vnode } = instance
        if (next) {
          // 需要则更新
          vnode.el = next.el
          updateComponentPreRender(instance, next)

        }
        // 获取到vnode的子组件,传入proxy进去
        const { proxy } = instance
        const preSubtree = instance.subtree
        const nextSubtree = instance.render.call(proxy)
        // 遍历children
        patch(preSubtree, nextSubtree, container, instance, anchor)
        instance.subtree = nextSubtree
      }
    })
  }

  function updateComponentPreRender(instance, nextVNode) {
    nextVNode.component = instance;
    instance.vnode = nextVNode
    instance.next = null;
    // 更新属性
    instance.props = nextVNode.props;
    // 更新插槽
    instance.slots = nextVNode.slots;
  }

  function processElement(n1, n2, container: any, parentComponent, anchor) {
    // 判断是挂载还是更新
    if (n1) {
      // 拿到新旧属性
      const oldProps = n1.props
      const newProps = n2.props
      const el = (n2.el = n1.el)
      // 更新属性
      patchProps(el, oldProps, newProps)

      // 更新children
      patchChildren(n1, n2, el, parentComponent, anchor)

    } else {
      // 挂载
      mountElement(n2, container, parentComponent, anchor)
    }
  }


  function patchProps(el, oldProps, newProps) {
    if (oldProps === newProps) {
      return
    }
    // 旧属性里面和新属性里面的key值不一样，那么就是新增的属性
    for (let key in newProps) {
      const prevProp = oldProps[key];
      const nextProp = newProps[key];
      if (prevProp !== nextProp) {
        // 对比属性结果
        // 需要交给 host 来更新 key
        hostPatchProps(el, key, prevProp, nextProp);
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

  function patchChildren(oldVNodes, newVNodes, container, parentComponent, anchor) {
    // 总共有4种情况来更新children
    // 1. children从array变成text
    const oldChildren = oldVNodes.children
    const newChildren = newVNodes.children
    const oldShapeflag = oldVNodes.shapeflag
    const newShapeflag = newVNodes.shapeflag

    if (newShapeflag & ShapeFlags.TEXT_CHILDREN) {
      if (oldShapeflag & ShapeFlags.TEXT_CHILDREN) {
        // 新的和老的都是文本
        if (oldChildren !== newChildren) {
          // 更新文本
          hostSetElementText(container, newChildren)
        }
      } else {
        // 新的是文本，老的是array
        // 1. 删除老的节点
        unmountChildren(oldChildren)
        // 2. 挂载新的文本节点
        hostSetElementText(container, newChildren)
      }
    } else {
      // 新的是array
      if (oldShapeflag & ShapeFlags.TEXT_CHILDREN) {
        // 老的是文本，新的是array
        // 1. 删除老的文本节点,设置为空
        hostSetElementText(container, '')
        // 挂在新的节点
        mountChildren(newChildren, container, parentComponent, anchor)
      } else {
        // 新的和老的都是array，使用diff算法
        patchKeyChildren(oldChildren, newChildren, container, parentComponent, anchor)
      }
    }
  }

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

  function unmountChildren(children) {
    children.forEach(child => {
      hostRemove(child.el)
    })
  }
  function mountElement(vnode: any, container: any, parentComponent, anchor) {
    // 创建元素
    // 自定义创建元素，
    const el = hostCreateElement(vnode.type)
    // 设置vnode的el
    vnode.el = el
    // 设置属性
    const { props } = vnode

    for (let key in props) {
      hostPatchProps(el, key, null, props[key])
    }
    // 处理子元素
    const children = vnode.children
    if (vnode.shapeflag & ShapeFlags.ARRAY_CHILDREN) {
      // 数组
      mountChildren(children, el, parentComponent, anchor)
    } else if (vnode.shapeflag & ShapeFlags.TEXT_CHILDREN) {
      // 自定义插入文本
      hostSetElementText(el, String(children))
    }
    // 挂载元素
    hostInsert(el, container, anchor)
  }
  /**
   * 获取最长递增子序列
   * @param arr 
   * @returns 
   */
  function getLongestIncreasingSubsequence(arr) {
    const p = arr.slice();
    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
      const arrI = arr[i];
      if (arrI !== 0) {
        j = result[result.length - 1];
        if (arr[j] < arrI) {
          p[i] = j;
          result.push(i);
          continue;
        }
        u = 0;
        v = result.length - 1;
        while (u < v) {
          c = (u + v) >> 1;
          if (arr[result[c]] < arrI) {
            u = c + 1;
          } else {
            v = c;
          }
        }
        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p[i] = result[u - 1];
          }
          result[u] = i;
        }
      }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
      result[u] = v;
      v = p[v];
    }
    return result;
  }
  function mountChildren(children, container, parentComponent, anchor) {
    children.forEach((child) => {
      patch(null, child, container, parentComponent, anchor)
    })
  }

  return {
    createApp: createAppAPI(render)
  }
}
