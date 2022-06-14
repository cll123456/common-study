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
    children: children || []
  }

  return vnode
}
