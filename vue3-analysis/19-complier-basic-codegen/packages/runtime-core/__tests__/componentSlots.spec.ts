import { createApp, renderSlots, createTextVNode, h } from "runtime-test"

describe('componentSlots', () => {
  let appElement: Element;
  beforeEach(() => {
    appElement = document.createElement('div');
    appElement.id = 'app';
    document.body.appendChild(appElement);
  })
  afterEach(() => {
    document.body.innerHTML = '';
  })

  test('test basic slots', () => {
    const Foo = {
      name: 'Foo',
      render() {
        return h('div', { class: 'foo' }, [h('p', {}, this.count), renderSlots(this.$slots)]);
      }
    }

    const app = createApp({
      render() {
        return h('div', { class: 'container' }, [
          h(Foo, { count: 1 }, { default: h('div', { class: 'slot' }, 'slot1') }),
          h(Foo, { count: 2 }, { default: [h('p', { class: 'slot' }, 'slot2'), h('p', { class: 'slot' }, 'slot2')] }),
        ])
      }
    })

    const appDoc = document.querySelector('#app')
    app.mount(appDoc);
    const container = document.querySelector('.container') as HTMLElement;
    Promise.resolve().then(() => {
      expect(container.innerHTML).toBe('<div class="foo"><p>1</p><div class="slot">slot1</div></div><div class="foo"><p>2</p><p class="slot">slot2</p><p class="slot">slot2</p></div>'
      )
    })
  })

  test('测试具名插槽', () => {
    const Foo = {
      name: 'Foo',
      render() {
        return h('div', { class: 'foo' },
          [
            renderSlots(this.$slots, 'header'),
            h('div', { class: 'default' }, 'default'),
            renderSlots(this.$slots, 'footer')
          ]
        );
      }
    }

    const app = createApp({
      name: 'App',
      render() {
        return h('div', { class: 'container' }, [h(Foo, {}, {
          header: h('h1', {}, 'header'),
          footer: h('p', {}, 'footer')
        })])
      }
    })

    const appDoc = document.querySelector('#app')
    app.mount(appDoc);

    const container = document.querySelector('.container') as HTMLElement
    Promise.resolve().then(() => {
      expect(container.innerHTML).toBe('<div class=\"foo\"><h1>header</h1><div class=\"default\">default</div><p>footer</p></div>')
    })
  })

  test('测试作用域插槽', () => {
    const Foo = {
      name: 'Foo',
      render() {
        return h('div', { class: 'foo' },
          [
            renderSlots(this.$slots, 'header', { children: 'foo' }),
            h('div', { class: 'default' }, 'default'),
            renderSlots(this.$slots, 'footer')
          ]
        );
      }
    }

    const app = createApp({
      name: 'App',
      render() {
        return h('div', { class: 'container' }, [h(Foo, {}, {
          header: ({ children }) => h('h1', {}, 'header ' + children),
          footer: h('p', {}, 'footer')
        })])
      }
    })

    const appDoc = document.querySelector('#app')
    app.mount(appDoc);

    const container = document.querySelector('.container') as HTMLElement
    Promise.resolve().then(() => {
      expect(container.innerHTML).toBe('<div class=\"foo\"><h1>header foo</h1><div class=\"default\">default</div><p>footer</p></div>')
    })

  })


  test('测试文本节点', () => {
    const Foo = {
      name: 'Foo',
      render() {
        return h('div', { class: 'foo' },
          [
            renderSlots(this.$slots, 'header', { children: 'foo' }),
            h('div', { class: 'default' }, 'default'),
            createTextVNode('footer')
          ]
        );
      }
    }

    const app = createApp({
      name: 'App',
      render() {
        return h('div', { class: 'container' }, [h(Foo, {}, {
          header: ({ children }) => h('h1', {}, 'header ' + children),
        })])
      }
    })

    const appDoc = document.querySelector('#app')
    app.mount(appDoc);

    const container = document.querySelector('.container') as HTMLElement
    Promise.resolve().then(() => {
      expect(container.innerHTML).toBe('<div class=\"foo\"><h1>header foo</h1><div class=\"default\">default</div>footer</div>')
    })

  })

})
