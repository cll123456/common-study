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


    const btnDom = containerDom?.querySelector('#myBtn') as HTMLElement;

    btnDom?.click();
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

})
