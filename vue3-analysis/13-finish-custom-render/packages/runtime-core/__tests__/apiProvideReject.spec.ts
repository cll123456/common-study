import { createApp, h } from "../src";
import { inject, provide } from "../src/apiProvide";

describe('apiProvideReject', () => {
  let appElement: Element;
  beforeEach(() => {
    appElement = document.createElement('div');
    appElement.id = 'app';
    document.body.appendChild(appElement);
  })
  afterEach(() => {
    document.body.innerHTML = '';
  })

  test('test provide basic use', () => {
    const Foo = {
      name: 'Foo',
      setup() {
        const count = inject('count')
        const str = inject('str')
        return {
          count,
          str
        }
      },
      render() {
        return h('div', {}, this.str + this.count)
      }
    }

    const app = createApp({
      name: 'App',
      setup() {
        provide('count', 1);
        provide('str', 'str');
      },
      render() {
        return h('div', { class: 'container' }, [h(Foo, {})])
      }
    })

    const appDoc = document.querySelector('#app')
    app.mount(appDoc);

    const container = document.querySelector('.container') as HTMLElement;

    expect(container.innerHTML).toBe('<div>str1</div>')
  })

  test('test provide exit grandfather', () => {
    const Child = {
      name: 'Foo',
      setup() {
        const count = inject('count')
        const str = inject('str')
        return {
          count,
          str
        }
      },
      render() {
        return h('div', {}, this.str + this.count)
      }
    }

    const Father = {
      name: 'Father',
      setup() {
        const count = inject('count')
        return {
          count
        }
      },
      render() {
        return h('div', {}, [h('p', {}, this.count), h(Child, {})])
      }
    }

    const app = createApp({
      name: 'App',
      setup() {
        provide('count', 1);
        provide('str', 'str');
        return {}
      },
      render() {
        return h('div', { class: 'container' }, [h(Father, {})])
      }
    })

    const appDoc = document.querySelector('#app');
    app.mount(appDoc);

    const container = document.querySelector('.container') as HTMLElement;

    expect(container.innerHTML).toBe('<div><p>1</p><div>str1</div></div>')
  })


  test('get value by proximity principle(就近原则) ', () => {
    const Child = {
      name: 'Foo',
      setup() {
        const count = inject('count')
        const str = inject('str')
        return {
          count,
          str
        }
      },
      render() {
        return h('div', {}, this.str + this.count)
      }
    }

    const Father = {
      name: 'Father',
      setup() {
        const count = inject('count')
        provide('count', 10);
        return {
          count
        }
      },
      render() {
        return h('div', {}, [h('p', {}, this.count), h(Child, {})])
      }
    }

    const app = createApp({
      name: 'App',
      setup() {
        provide('count', 1);
        provide('str', 'str');
        return {}
      },
      render() {
        return h('div', { class: 'container' }, [h(Father, {})])
      }
    })

    const appDoc = document.querySelector('#app');
    app.mount(appDoc);

    const container = document.querySelector('.container') as HTMLElement;
    expect(container.innerHTML).toBe('<div><p>1</p><div>str10</div></div>')
  })


  test('get value by top parent(如果上级没有，往上级查询，直到最顶层没有返回undefined) ', () => {

    const GrandSon = {
      name: 'GrandSon',
      setup() {
        const count = inject('count')
        const str = inject('str')
        return {
          count,
          str
        }
      },
      render() {
        return h('div', {}, this.str + this.count)
      }
    }
    const Child = {
      name: 'Child',
      setup() {
        provide('count', 100)
      },
      render() {
        return h(GrandSon)
      }
    }

    const Father = {
      name: 'Father',
      render() {
        return h(Child)
      }
    }

    const app = createApp({
      name: 'App',
      setup() {
        provide('count', 1);
        provide('str', 'str');
        return {}
      },
      render() {
        return h('div', { class: 'container' }, [h(Father, {})])
      }
    })

    const appDoc = document.querySelector('#app');
    app.mount(appDoc);

    const container = document.querySelector('.container') as HTMLElement;
    expect(container.innerHTML).toBe('<div>str100</div>')
  })

  test('inject can get second params', () => {
    const Child = {
      name: 'Foo',
      setup() {
        const count = inject('count')
        const str = inject('str', 'str')
        const funcVal = inject('funcVal', () => 'funcVal')
        return {
          count,
          str,
          funcVal
        }
      },
      render() {
        return h('div', {}, this.str + this.count + this.funcVal)
      }
    }
    const app = createApp({
      name: 'App',
      setup() {
        provide('count', 'value');
      },
      render() {
        return h('div', { class: 'container' }, [h(Child, {})])
      }
    })

    const appDoc = document.querySelector('#app');
    app.mount(appDoc);
    const container = document.querySelector('.container') as HTMLElement;

    expect(container.innerHTML).toBe('<div>strvaluefuncVal</div>')

  })
})
