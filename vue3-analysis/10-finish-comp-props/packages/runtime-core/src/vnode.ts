import { isObj, ShapeFlags } from "shared"

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
  return vnode
}


function getShapeFlag(type) {
  // 用于判断组件的类型,对象是组件，否则是元素组件
  return isObj(type) ? ShapeFlags.STATE_COMPONENT : ShapeFlags.ELEMENT
}
