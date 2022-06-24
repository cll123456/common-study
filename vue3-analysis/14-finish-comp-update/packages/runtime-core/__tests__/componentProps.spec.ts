import { ref } from "reactivity";
import { createApp, h } from "runtime-test"
describe('componentProps', () => {
  let appElement: Element;

  beforeEach(() => {
    appElement = document.createElement('div');
    appElement.id = 'app';
    document.body.appendChild(appElement);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  })

  test('测试on绑定事件', () => {
    let count = 0
    console.log = jest.fn()
    const app = createApp({
      render() {
        return h('div', {
          class: 'container',
          onClick() {
            console.log('click')
            count++
          },
          onFocus() {
            count--
            console.log(1)
          }
        }, '123');
      }
    });
    const appDoc = document.querySelector('#app')
    app.mount(appDoc);
    const container = document.querySelector('.container') as HTMLElement;
    container.click();
    expect(console.log).toHaveBeenCalledTimes(1)

    container.focus();
    expect(count).toBe(0)
    expect(console.log).toHaveBeenCalledTimes(2)

  })


  test('测试组件传递props', () => {
    let tempProps;
    console.warn = jest.fn()
    const Foo = {
      name: 'Foo',
      render() {
        // 2. 组件render里面可以直接使用props里面的值
        return h('div', { class: 'foo' }, this.count);
      },
      setup(props) {
        // 1. 此处可以拿到props
        tempProps = props;

        // 3. readonly props
        props.count++
      }
    }

    const app = createApp({
      name: 'App',
      render() {
        return h('div', {
          class: 'container',
        }, [
          h(Foo, { count: 1 }),
          h('span', { class: 'span' }, '123')
        ]);
      }
    });
    const appDoc = document.querySelector('#app')
    app.mount(appDoc);
    // 验证功能1
    expect(tempProps.count).toBe(1)

    // 验证功能3，修改setup内部的props需要报错
    expect(console.warn).toBeCalled()
    expect(tempProps.count).toBe(1)

    // 验证功能2，在render中可以直接使用this来访问props里面的内部属性
    expect(document.body.innerHTML).toBe(`<div id="app"><div class="container"><div class="foo">1</div><span class="span">123</span></div></div>`)
  })


  test('测试组件emit', () => {
    let count;
    const Foo = {
      name: 'Foo',
      render() {
        return h('div', { class: 'foo' }, this.count);
      },
      setup(props, { emit }) {
        // 1. setup对象的第二个参数里面，可以结构出emit，并且是一个函数

        // 2. emit 函数可以父组件传过来的事件
        emit('click')

        // 验证emit1，可以执行父组件的函数
        expect(count.value).toBe(2)

        // 3 emit 可以传递参数
        emit('clickNum', 5)
        // 验证emit传入参数
        expect(count.value).toBe(7)
        // 4 emit 可以使用—的模式
        emit('click-num', -5)
        expect(count.value).toBe(2)
      }
    }

    const app = createApp({
      name: 'App',
      render() {
        return h('div', {}, [
          h(Foo, { onClick: this.click, onClickNum: this.clickNum, count: this.count })
        ])
      },
      setup() {
        const click = () => {
          count.value++
        }
        count = ref(1)

        const clickNum = (num) => {
          count.value = Number(count.value) + Number(num)
        }
        return {
          click,
          clickNum,
          count
        }
      }
    })

    const appDoc = document.querySelector('#app')
    app.mount(appDoc);
    // 验证挂载
    expect(document.body.innerHTML).toBe(`<div id="app"><div><div class="foo">1</div></div></div>`)


  })
})
