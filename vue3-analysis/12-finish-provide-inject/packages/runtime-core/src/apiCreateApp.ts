import { render } from './render'
import { createVNode } from './vnode'
export function createApp(rootComponent,) {
  const app = {
    _component: rootComponent,
    mount(container) {
     
      // 创建vnode
      const vnode = createVNode(rootComponent)

      // 调用render
      render(vnode, container)
    }
  }
  return app
}
