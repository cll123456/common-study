import { ShapeFlags, isOn } from "shared"
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
  if (vnode.shapeflag & ShapeFlags.STATE_COMPONENT) {
    // 处理组件
    processComponent(null, vnode, container)
  } else if (vnode.shapeflag & ShapeFlags.ELEMENT) {
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
  // 获取到vnode的子组件,传入proxy进去
  const { proxy } = instance

  const subtree = instance.render.call(proxy)

  // 遍历children
  patch(subtree, container)

  // 赋值vnode.el,上面执行render的时候，vnode.el是null
  vnode.el = subtree.el
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
  // 设置vnode的el
  vnode.el = el

  // 设置属性
  const { props } = vnode
  for (let key in props) {
    // 判断key是否是on + 事件命，满足条件需要注册事件

    if (isOn(key)) {
      // 注册事件
      el.addEventListener(key.slice(2).toLowerCase(), props[key])
    }
    el.setAttribute(key, props[key])
  }
  // 处理子元素
  const children = vnode.children

  if (vnode.shapeflag & ShapeFlags.ARRAY_CHILDREN) {
    // 数组
    mountChildren(children, el)
  } else if (vnode.shapeflag & ShapeFlags.TEXT_CHILDREN) {
    // 文本
    el.innerHTML = String(children)
  }
  // 挂载元素
  container.appendChild(el)
}


function mountChildren(children, container) {
  children.forEach((child) => {
    patch(child, container)
  })
}
