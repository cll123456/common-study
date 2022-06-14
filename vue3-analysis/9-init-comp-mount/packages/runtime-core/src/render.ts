import { isObj } from "shared"
import { createComponentInstance, setupComponent } from "./component"

/**
 * render函数
 * @param vnode 
 * @param container 
 */
export function render(vnode, container) {
  // 调用patch
  patch(vnode, container)
}


export function patch(vnode, container) {
  // 判断是处理组件，还是处理元素
  // todo 需要根据vnode的type判断
  if (isObj(vnode.type)) {
    // 处理组件
    processComponent(null, vnode, container)
  } else if (String(vnode.type).length > 0) {
    // 处理元素
    processElement(null, vnode, container)
  }
}

export function processComponent(n1, n2, container) {
  if (!n1) {
    // 挂载组件
    mountComponent(n2, container)
  } else {
    // 更新组件
  }
}


export function mountComponent(vnode, container) {
  // 创建组件实例
  const instance = createComponentInstance(vnode)

  // 设置组件的状态
  setupComponent(instance)

  // 对组件render函数进行依赖收集
  setupRenderEffect(instance, vnode, container);
}




function setupRenderEffect(instance: any, vnode: any, container: any) {
  // 获取到vnode的子组件
  const subtree = instance.render()

  // 遍历children
  patch(subtree, container)
}

function processElement(n1, n2, container: any) {
  // 判断是挂载还是更新
  if (n1) {
    // 更新
  } else {
    // 挂载
    mountElement(n2, container)
  }
}

function mountElement(vnode: any, container: any) {
  // 创建元素
  const el = document.createElement(vnode.type)

  // 设置属性
  const { props } = vnode
  for (let key in props) {
    el.setAttribute(key, props[key])
  }
  // 处理子元素
  const children = vnode.children

  if (Array.isArray(children)) {
    children.forEach((child) => {
      patch(child, el)
    })
  } else if (String(children).length > 0) {
    el.innerHTML = children
  }
  // 挂载元素
  container.appendChild(el)
}
