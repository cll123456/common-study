import { effect } from "reactivity"
import { ShapeFlags } from "shared"
import { createAppAPI } from "./apiCreateApp"
import { createComponentInstance, setupComponent } from "./component"
import { Fragment, Text } from "./vnode"

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProps: hostPatchProps,
    insert: hostInsert,
    setElementText: hostSetElementText
  } = options

  /**
   * render函数
   * @param vnode 
   * @param container 
   */
  function render(vnode, container) {
    // 调用patch
    patch(null, vnode, container, null)
  }


  function patch(n1, n2, container, parentComponent) {
    const { type } = n2
    switch (type) {
      case Fragment:
        // 处理slot中的fragment节点
        processFragment(n2, container, parentComponent)
        break;
      case Text:
        processTextComponent(n2, container)
        break;
      default:
        // 判断是处理组件，还是处理元素
        if (n2.shapeflag & ShapeFlags.STATE_COMPONENT) {
          // 处理组件
          processComponent(n1, n2, container, parentComponent)
        } else if (n2.shapeflag & ShapeFlags.ELEMENT) {
          // 处理元素
          processElement(n1, n2, container, parentComponent)
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
    effect(() => {
      if (!instance.isMounted) {
        // 获取到vnode的子组件,传入proxy进去
        const { proxy } = instance
        const subtree = instance.render.call(proxy)
        instance.subtree = subtree

        // 遍历children
        patch(null, subtree, container, instance)

        // 赋值vnode.el,上面执行render的时候，vnode.el是null
        vnode.el = subtree.el

        // 渲染完成
        instance.isMounted = true
      } else {
        // 更新操作
        // 获取到vnode的子组件,传入proxy进去
        const { proxy } = instance
        const preSubtree = instance.subtree
        const nextSubtree = instance.render.call(proxy)
        // 遍历children
        patch(preSubtree, nextSubtree, container, instance)
        instance.subtree = nextSubtree
      }

    })

  }

  function processElement(n1, n2, container: any, parentComponent) {
    // 判断是挂载还是更新
    if (n1) {
      // 拿到新旧属性
      const oldProps = n1.props
      const newProps = n2.props
      const el = (n2.el = n1.el)
      // 更新属性
      patchProps(el, oldProps, newProps)

    } else {
      // 挂载
      mountElement(n2, container, parentComponent)
    }
  }

  function patchProps(el, oldProps, newProps) {
    if (oldProps === newProps) {
      return
    }

    for (let key in newProps) {
      if (key in oldProps) {
        // 需要进行更新操作
        hostPatchProps(el, key, oldProps[key], newProps[key])
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
  function mountElement(vnode: any, container: any, parentComponent) {
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
      mountChildren(children, el, parentComponent)
    } else if (vnode.shapeflag & ShapeFlags.TEXT_CHILDREN) {
      // 自定义插入文本
      hostSetElementText(el, String(children))
    }
    // 挂载元素
    hostInsert(el, container)
  }


  function mountChildren(children, container, parentComponent) {
    children.forEach((child) => {
      patch(null, child, container, parentComponent)
    })
  }

  return {
    createApp: createAppAPI(render)
  }
}
