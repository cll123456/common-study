import { createApp, h, getCurrentInstance } from './../src'
describe('apiGetCurrentInstance', () => {
  let appElement: Element;
  beforeEach(() => {
    appElement = document.createElement('div');
    appElement.id = 'app';
    document.body.appendChild(appElement);
  })

  afterEach(() => {
    document.body.innerHTML = '';
  })

  test('test getCurrentInstance', () => {
    const Foo = {
      name: 'Foo',
      setup() {
        const instance = getCurrentInstance();
        expect(instance.type.name).toBe('Foo');
        return {
          count: 1
        }
      },
      render() {
        return h('div', {}, this.count)
      }
    }

    const app = createApp({
      name: 'App',
      setup() {
        const instance = getCurrentInstance();
        expect(instance.type.name).toBe('App');
        return {
          count: 2
        }
      },
      render() {
        return h('div', { class: 'container' }, [h(Foo)])
      }
    })

    const appDoc = document.querySelector('#app')
    app.mount(appDoc);

    const container = document.querySelector('.container') as HTMLElement
    Promise.resolve().then(() => {
      expect(container.innerHTML).toBe('<div>1</div>')
    })
  })
})
