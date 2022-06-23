import { ShapeFlags } from "shared"
import { createAppAPI } from "./apiCreateApp"
import { createComponentInstance, setupComponent } from "./component"
import { Fragment, Text } from "./vnode"

export function createRenderer(options) {
  const {
    createElement,
    patchProps,
    insert,
    setElementText
  } = options

  /**
   * render函数
   * @param vnode 
   * @param container 
   */
  function render(vnode, container) {
    // 调用patch
    patch(vnode, container, null)
  }


  function patch(vnode, container, parentComponent) {
    const { type } = vnode
    switch (type) {
      case Fragment:
        // 处理slot中的fragment节点
        processFragment(vnode, container, parentComponent)
        break;
      case Text:
        processTextComponent(vnode, container)
        break;
      default:
        // 判断是处理组件，还是处理元素
        if (vnode.shapeflag & ShapeFlags.STATE_COMPONENT) {
          // 处理组件
          processComponent(null, vnode, container, parentComponent)
        } else if (vnode.shapeflag & ShapeFlags.ELEMENT) {
          // 处理元素
          processElement(null, vnode, container, parentComponent)
        }
        break
    }

  }

  function processFragment(vnode: any, container: any, parentComponent) {
    // 处理slot的元素，只需拿到他的children即可
    mountChildren(vnode.children, container, parentComponent)
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

  function processComponent(n1, n2, container, parentComponent) {
    if (!n1) {
      // 挂载组件
      mountComponent(n2, container, parentComponent)
    } else {
      // 更新组件
    }
  }


  function mountComponent(vnode, container, parentComponent) {
    // 创建组件实例
    const instance = createComponentInstance(vnode, parentComponent)

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
    patch(subtree, container, instance)

    // 赋值vnode.el,上面执行render的时候，vnode.el是null
    vnode.el = subtree.el
  }

  function processElement(n1, n2, container: any, parentComponent) {
    // 判断是挂载还是更新
    if (n1) {
      // 更新
    } else {
      // 挂载
      mountElement(n2, container, parentComponent)
    }
  }

  function mountElement(vnode: any, container: any, parentComponent) {
    // 创建元素
    // 自定义创建元素，
    const el = createElement(vnode.type)
    // 设置vnode的el
    vnode.el = el

    // 设置属性
    const { props } = vnode

    for (let key in props) {
      patchProps(el, key, props[key])
      // 判断key是否是on + 事件命，满足条件需要注册事件

    }
    // 处理子元素
    const children = vnode.children

    if (vnode.shapeflag & ShapeFlags.ARRAY_CHILDREN) {
      // 数组
      mountChildren(children, el, parentComponent)
    } else if (vnode.shapeflag & ShapeFlags.TEXT_CHILDREN) {
      // 文本
      // el.innerHTML = String(children)
      // 自定义插入文本
      setElementText(el, String(children))
    }
    // 挂载元素
    container.appendChild(el)
    insert(el, container)
  }


  function mountChildren(children, container, parentComponent) {
    children.forEach((child) => {
      patch(child, container, parentComponent)
    })
  }

  return {
    createApp: createAppAPI(render)
  }
}
