import { createVNode } from './vnode'

export function createAppAPI(render) {
  return function createApp(rootComponent) {
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
}
