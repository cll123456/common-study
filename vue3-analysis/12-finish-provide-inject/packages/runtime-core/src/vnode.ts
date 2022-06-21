import { isObj, ShapeFlags } from "shared"

/**
 * Fragment 节点，用于处理slots
 */
export const Fragment = Symbol("Fragment")

/**
 * 文本节点用于处理文本
 */
export const Text = Symbol("Text")

/**
 * 创建vnode
 * @param type 
 * @param props 
 * @param children 
 * @returns 
 */
export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props: props || {},
    children: children || [],
    // 当前组件的真实dom
    el: null,
    // 判断vnode的类型
    shapeflag: getShapeFlag(type),
  }

  // 判断children的类型
  if (Array.isArray(children)) {
    vnode.shapeflag |= ShapeFlags.ARRAY_CHILDREN
  } else if (children && typeof String(children) === 'string') {
    vnode.shapeflag |= ShapeFlags.TEXT_CHILDREN
  }
  // 判断插槽的属性
  if (typeof children === "object") {
    // 暂时主要是为了标识出 slots_children 这个类型来
    // 暂时我们只有 element 类型和 component 类型的组件
    // 所以我们这里除了 element ，那么只要是 component 的话，那么children 肯定就是 slots 了
    if (vnode.shapeflag & ShapeFlags.ELEMENT) {
      // 如果是 element 类型的话，那么 children 肯定不是 slots
    } else {
      // 这里就必然是 component 了,
      vnode.shapeflag |= ShapeFlags.SLOT_CHILDREN;
    }
  }
  return vnode
}


function getShapeFlag(type) {
  // 用于判断组件的类型,对象是组件，否则是元素组件
  return isObj(type) ? ShapeFlags.STATE_COMPONENT : ShapeFlags.ELEMENT
}


/**
 * 
 * @param text 创建一个文本节点
 * @returns 
 */
export function createTextVNode(text) {
  return createVNode(Text, null, text)
}
