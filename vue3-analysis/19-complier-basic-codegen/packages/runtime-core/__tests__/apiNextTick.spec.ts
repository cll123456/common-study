import { ref } from "reactivity"
import { createApp, h, nextTick, getCurrentInstance } from "runtime-test"

describe('test apiNextTick', () => {
  let appElement

  beforeEach(() => {
    appElement = document.createElement('div')
    appElement.id = 'app'
    document.body.appendChild(appElement)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })
  test('存在的问题, vue更新ui界面是异步的', () => {
    let clickMethod;
    const app = createApp({
      name: 'App',
      setup() {
        const count = ref(0)
        clickMethod = () => {
          for (let i = 0; i < 100; i++) {
            count.value++
          }
        }
        return {
          count,
        }
      },
      render() {
        return h('div', {}, this.count)
      }
    })
    const appDoc = document.querySelector('#app')
    app.mount(appDoc)
    expect(appDoc?.innerHTML).toBe('<div>0</div>')

    clickMethod()
    expect(appDoc?.innerHTML).not.toBe('<div>100</div>')
    // 需要放入微任务当中
    Promise.resolve().then(() => {
      expect(appDoc?.innerHTML).toBe('<div>100</div>')
    })
  })

  test('nextTick use', () => {
    let clickMethod;
    const app = createApp({
      name: 'App',
      setup() {

        const instance = getCurrentInstance()
        const count = ref(0)
        clickMethod = () => {
          for (let i = 0; i < 100; i++) {
            count.value++
          }
          expect(count.value).toBe(100)
          expect(instance.vnode.el.innerHTML).toBe('0')
          // console.log(instance.vnode.el.innerHTML)
          nextTick(() => {
            // console.log(instance.vnode.el.innerHTML)
            expect(instance.vnode.el.innerHTML).toBe('100')
          })
        }
        return {
          count,
        }
      },
      render() {
        return h('div', {}, this.count)
      }
    })
    const appDoc = document.querySelector('#app')
    app.mount(appDoc)
    expect(appDoc?.innerHTML).toBe('<div>0</div>')

    clickMethod()
    // 需要放入微任务当中
    nextTick(() => {
      expect(appDoc?.innerHTML).toBe('<div>100</div>')
    })
  })
})
