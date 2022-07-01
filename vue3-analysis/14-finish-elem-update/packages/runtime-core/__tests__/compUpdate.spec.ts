import { createApp, h } from "runtime-test";
import { ref } from 'reactivity'

describe('compUpdate', () => {
  let appElement: Element
  beforeEach(() => {
    appElement = document.createElement('div');
    appElement.id = 'app'
    document.body.appendChild(appElement)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  test('test update process', () => {
    const app = createApp({
      setup() {
        const count = ref(1)

        const clickCount = () => {
          count.value++;
        }
        return {
          count,
          clickCount
        }
      },
      render() {
        return h('div', { class: 'container' }, [h('p', {}, this.count), h('button', { id: 'myBtn', onClick: this.clickCount }, 'button')])
      }
    })
    const appDoc = document.querySelector('#app')
    app.mount(appDoc)

    const containerDom = document.querySelector('.container')
    // 初步挂载
    const containerHtml = containerDom?.innerHTML;
    expect(containerHtml).toBe('<p>1</p><button id="myBtn">button</button>')


    // const btnDom = containerDom?.querySelector('#myBtn') as HTMLElement;

    // btnDom?.click();
    // 更新children在后面
    // expect(containerDom?.innerHTML).toBe('<p>2</p><button id="myBtn">button</button>')
  })

  test('test update props', () => {
    const app = createApp({
      name: 'App',
      setup() {
        const props = ref({
          foo: 'foo',
          bar: 'bar',
          baz: 'baz'
        })

        const changeFoo = () => {
          props.value.foo = 'foo1'
        }

        const changeBarToUndefined = () => {
          props.value.bar = undefined
        }

        const deleteBaz = () => {
          props.value = {
            foo: 'foo',
            bar: 'bar'
          }
        }
        return {
          props,
          deleteBaz,
          changeFoo,
          changeBarToUndefined,
        }
      },
      render() {
        return h('div', { class: 'container', ...this.props }, [h('button', { onClick: this.changeFoo, id: 'changeFoo' }, 'changeFoo'), h('button', { onClick: this.changeBarToUndefined, id: 'changeBarToUndefined' }, 'changeBarToUndefined'), h('button', { onClick: this.deleteBaz, id: 'deleteBaz' }, 'deleteBaz')])
      }
    })

    const appDoc = document.querySelector('#app')
    app.mount(appDoc)
    // 默认挂载
    expect(appDoc?.innerHTML).toBe('<div class="container" foo="foo" bar="bar" baz="baz"><button id="changeFoo">changeFoo</button><button id="changeBarToUndefined">changeBarToUndefined</button><button id="deleteBaz">deleteBaz</button></div>')

    // 删除属性
    const deleteBtn = appDoc?.querySelector('#deleteBaz') as HTMLElement;
    deleteBtn?.click();
    expect(appDoc?.innerHTML).toBe('<div class="container" foo="foo" bar="bar"><button id="changeFoo">changeFoo</button><button id="changeBarToUndefined">changeBarToUndefined</button><button id="deleteBaz">deleteBaz</button></div>')

    // 更新属性
    const changeFooBtn = appDoc?.querySelector('#changeFoo') as HTMLElement;
    changeFooBtn?.click();
    expect(appDoc?.innerHTML).toBe('<div class="container" foo="foo1" bar="bar"><button id="changeFoo">changeFoo</button><button id="changeBarToUndefined">changeBarToUndefined</button><button id="deleteBaz">deleteBaz</button></div>')

    // 属性置undefined
    const changeBarToUndefinedBtn = appDoc?.querySelector('#changeBarToUndefined') as HTMLElement;
    changeBarToUndefinedBtn?.click();
    expect(appDoc?.innerHTML).toBe('<div class="container" foo="foo1"><button id="changeFoo">changeFoo</button><button id="changeBarToUndefined">changeBarToUndefined</button><button id="deleteBaz">deleteBaz</button></div>')
  })

  test('test update children array -> text', () => {
    let temp;
    const app = createApp({
      setup() {
        const flag = ref(true)

        temp = flag

        return {
          flag
        }
      },
      render() {
        return h('div', { class: 'container' }, this.flag ? [h('p', {}, '1'), h('p', {}, '2')] : 'newText')
      }
    })
    const appDoc = document.querySelector('#app')
    app.mount(appDoc)

    const containerDom = document.querySelector('.container')
    // 初步挂载
    const containerHtml = containerDom?.innerHTML;
    expect(containerHtml).toBe('<p>1</p><p>2</p>')

    // 更新children,将数组改成文本
    temp.value = false
    expect(containerDom?.innerHTML).toBe('newText')
  })

  test('test update children text -> text', () => {
    let temp;
    const app = createApp({
      setup() {
        const flag = ref(true)

        temp = flag

        return {
          flag
        }
      },
      render() {
        return h('div', { class: 'container' }, this.flag ? 'oldText' : 'newText')
      }
    })
    const appDoc = document.querySelector('#app')
    app.mount(appDoc)

    const containerDom = document.querySelector('.container')
    // 初步挂载
    const containerHtml = containerDom?.innerHTML;
    expect(containerHtml).toBe('oldText')

    // 更新children,将数组改成文本
    temp.value = false
    expect(containerDom?.innerHTML).toBe('newText')
  })

  test('test update children text -> array', () => {
    let temp;
    const app = createApp({
      setup() {
        const flag = ref(true)

        temp = flag

        return {
          flag
        }
      },
      render() {
        return h('div', { class: 'container' }, this.flag ? 'oldText' : [h('p', {}, '1'), h('p', {}, '2')])
      }
    })
    const appDoc = document.querySelector('#app')
    app.mount(appDoc)

    const containerDom = document.querySelector('.container')
    // 初步挂载
    const containerHtml = containerDom?.innerHTML;
    expect(containerHtml).toBe('oldText')

    // 更新children,将数组改成array
    temp.value = false
    expect(containerDom?.innerHTML).toBe('<p>1</p><p>2</p>')
  })

  test('test update children array -> array old > new left', () => {
    // 数组对比，新的比老的左侧短，删除老的
    const oldVNodes = [h('p', { key: 'A' }, 'A'), h('p', { key: 'B' }, 'B'), h('p', { key: 'C' }, 'C')]
    const newNodes = [h('p', { key: 'B' }, 'B'), h('p', { key: 'C' }, 'C')]
    // a b c   i = 0 e1 = 0 e2 = -1
    //  b c
    // 要求 i > e2 && i <= e1
    let temp;
    const app = createApp({
      setup() {
        const flag = ref(true)

        temp = flag

        return {
          flag
        }
      },
      render() {
        return h('div', { class: 'container' }, this.flag ? oldVNodes : newNodes)
      }
    })
    const appDoc = document.querySelector('#app')
    app.mount(appDoc)
    const containerDom = document.querySelector('.container')
    expect(containerDom?.innerHTML).toBe('<p>A</p><p>B</p><p>C</p>')

    // 改变属性
    temp.value = false

    expect(containerDom?.innerHTML).toBe('<p>B</p><p>C</p>')
  })

  test('test update children array -> array old > new right', () => {
    // 数组对比，新的比老的左侧短，删除老的
    const oldVNodes = [h('p', { key: 'A' }, 'A'), h('p', { key: 'B' }, 'B'), h('p', { key: 'C' }, 'C')]
    const newNodes = [h('p', { key: 'A' }, 'A'), h('p', { key: 'B' }, 'B')]
    // a b c   i = 2 e1 = 2 e2 = 1
    // a b  
    // 要求 i > e2 && i <= e1
    let temp;
    const app = createApp({
      setup() {
        const flag = ref(true)

        temp = flag

        return {
          flag
        }
      },
      render() {
        return h('div', { class: 'container' }, this.flag ? oldVNodes : newNodes)
      }
    })
    const appDoc = document.querySelector('#app')
    app.mount(appDoc)
    const containerDom = document.querySelector('.container')
    expect(containerDom?.innerHTML).toBe('<p>A</p><p>B</p><p>C</p>')

    // 改变属性
    temp.value = false

    expect(containerDom?.innerHTML).toBe('<p>A</p><p>B</p>')
  })

  test('test update children array -> array old < new right', () => {
    const oldVNodes = [h('p', { key: 'A' }, 'A'), h('p', { key: 'B' }, 'B')]
    const newVNodes = [h('p', { key: 'A' }, 'A'), h('p', { key: 'B' }, 'B'), h('p', { key: 'C' }, 'C')]

    // a b   i = 2 e1 = 1 e2 = 2
    // a b c
    // 条件 i > e1 && i <= e2
    let temp;
    const app = createApp({
      setup() {
        const flag = ref(true)

        temp = flag

        return {
          flag
        }
      },
      render() {
        return h('div', { class: 'container' }, this.flag ? oldVNodes : newVNodes)
      }
    })

    const appDoc = document.querySelector('#app')
    app.mount(appDoc)
    const containerDom = document.querySelector('.container')
    expect(containerDom?.innerHTML).toBe('<p>A</p><p>B</p>')

    // 改变属性
    temp.value = false
    expect(containerDom?.innerHTML).toBe('<p>A</p><p>B</p><p>C</p>')

  })

  test('test update children array -> array old < new left', () => {
    const oldVNodes = [h('p', { key: 'A' }, 'A'), h('p', { key: 'B' }, 'B')]
    const newNodes = [h('p', { key: 'C' }, 'C'), h('p', { key: 'A' }, 'A'), h('p', { key: 'B' }, 'B')]
    //    a b   i = 0 e1 = -1 e2 = 0
    // d c a b
    // 条件 i > e1 && i <= e2
    let temp;
    const app = createApp({
      setup() {
        const flag = ref(true)
        temp = flag
        return {
          flag
        }
      },
      render() {
        return h('div', { class: 'container' }, this.flag ? oldVNodes : newNodes)
      }
    })

    const appDoc = document.querySelector('#app')
    app.mount(appDoc)
    const containerDom = document.querySelector('.container')
    expect(containerDom?.innerHTML).toBe('<p>A</p><p>B</p>')

    // 改变属性
    temp.value = false
    expect(containerDom?.innerHTML).toBe('<p>C</p><p>A</p><p>B</p>')
  })

  test('test update children array -> array middle compare old > new remove', () => {
    const oldVNodes = [h('p', { key: 'A' }, 'A'), h('p', { key: 'B' }, 'B'), h('p', { key: 'C' }, 'C'), h('p', { key: 'D' }, 'D')]
    const newNodes = [h('p', { key: 'A' }, 'A'), h('p', { key: 'B' }, 'B'), h('p', { key: 'D' }, 'D')]
    // a b c d   i = 2 e1 = 2 e2 = 1
    // a b d
    // 条件 i <= e1 && i > e2
    let temp;
    const app = createApp({
      setup() {
        const flag = ref(true)
        temp = flag
        return {
          flag
        }
      },
      render() {
        return h('div', { class: 'container' }, this.flag ? oldVNodes : newNodes)
      }
    })

    const appDoc = document.querySelector('#app')
    app.mount(appDoc)
    const containerDom = document.querySelector('.container')
    expect(containerDom?.innerHTML).toBe('<p>A</p><p>B</p><p>C</p><p>D</p>')

    // 改变属性
    temp.value = false
    expect(containerDom?.innerHTML).toBe('<p>A</p><p>B</p><p>D</p>')
  })

  test('test update children array -> array middle compare move node', () => {
    const oldVNodes = [h('p', { key: 'A' }, 'A'), h('p', { key: 'B' }, 'B'), h('p', { key: 'C' }, 'C'), h('p', { key: 'D' }, 'D'), h('p', { key: 'E' }, 'E')]
    const newVNodes = [h('p', { key: 'A' }, 'A'), h('p', { key: 'D' }, 'D'), h('p', { key: 'B' }, 'B'), h('p', { key: 'C' }, 'C'), h('p', { key: 'E' }, 'E')]

    // a b c d e   i = 1 e1 = 3 e2 = 3
    // a d b c e

    let temp;
    const app = createApp({
      setup() {
        const flag = ref(true)
        temp = flag
        return {
          flag
        }
      },
      render() {
        return h('div', { class: 'container' }, this.flag ? oldVNodes : newVNodes)
      }
    })

    const appDoc = document.querySelector('#app')
    app.mount(appDoc)
    const containerDom = document.querySelector('.container')
    expect(containerDom?.innerHTML).toBe('<p>A</p><p>B</p><p>C</p><p>D</p><p>E</p>')

    // 改变属性
    temp.value = false
    expect(containerDom?.innerHTML).toBe('<p>A</p><p>D</p><p>B</p><p>C</p><p>E</p>')
  })

  test('test update children array -> array middle compare increase node', () => {
    const oldVNodes = [h('p', { key: 'A' }, 'A'), h('p', { key: 'C' }, 'C'), h('p', { key: 'D' }, 'D'), h('p', { key: 'E' }, 'E')]
    const newVNodes = [h('p', { key: 'A' }, 'A'), h('p', { key: 'B' }, 'B'), h('p', { key: 'C' }, 'C'), h('p', { key: 'D' }, 'D'), h('p', { key: 'E' }, 'E')]
    let temp;
    const app = createApp({
      setup() {
        const flag = ref(true)
        temp = flag
        return {
          flag
        }

      },
      render() {
        return h('div', { class: 'container' }, this.flag ? oldVNodes : newVNodes)
      }
    })

    const appDoc = document.querySelector('#app')
    app.mount(appDoc)
    const containerDom = document.querySelector('.container')
    expect(containerDom?.innerHTML).toBe('<p>A</p><p>C</p><p>D</p><p>E</p>')

    // 改变属性
    temp.value = false
    expect(containerDom?.innerHTML).toBe('<p>A</p><p>B</p><p>C</p><p>D</p><p>E</p>')
  })

  test('综合测试', () => {
    const oldVNodes = [h('p', { key: 'A', props: 'old-text' }, 'A'), h('p', { key: 'B' }, 'B'), h('p', { key: 'C' }, 'C'), h('p', { key: 'D' }, 'D'), h('p', { key: 'E' }, 'E'), h('p', { key: 'F' }, 'F')]
    const newVNodes = [h('p', { key: 'A' }, 'A'), h('p', { key: 'D' }, 'D'), h('p', { key: 'G' }, 'G'), h('p', { key: 'B', props: 'new-text' }, 'B'), h('p', { key: 'C' }, 'C'), h('p', { key: 'E' }, 'E')]
    let temp
    const app = createApp({
      setup() {
        const flag = ref(true)
        temp = flag
        return {
          flag
        }
      },
      render() {
        return h('div', { class: 'container' }, this.flag ? oldVNodes : newVNodes)
      }
    })

    const appDoc = document.querySelector('#app')
    app.mount(appDoc)

    const containerDom = document.querySelector('.container')
    expect(containerDom?.innerHTML).toBe('<p props="old-text">A</p><p>B</p><p>C</p><p>D</p><p>E</p><p>F</p>')

    // 改变属性
    temp.value = false
    expect(containerDom?.innerHTML).toBe('<p>A</p><p>D</p><p>G</p><p props="new-text">B</p><p>C</p><p>E</p>')
  })

})
