import { h } from "../src";
import { createApp } from "runtime-test";

describe('apiCreateApp', () => {
  let appElement: Element;

  beforeEach(() => {
    appElement = document.createElement('div');
    appElement.id = 'app';
    document.body.appendChild(appElement);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('测试createApp,是否正确挂载', () => {
    const app = createApp({
      render() {
        return h('div', {}, '123');
      }
    });
    const appDoc = document.querySelector('#app')
    app.mount(appDoc);
    expect(document.body.innerHTML).toBe('<div id="app"><div>123</div></div>');
  })

  test('测试属性是否存在', () => {
    const app = createApp({
      render() {
        return h('div', { class: 'container' }, '123');
      }
    });
    const appDoc = document.querySelector('#app')
    app.mount(appDoc);
    expect(document.body.innerHTML).toBe('<div id="app"><div class="container">123</div></div>');
  })

  test('实现代理对象，通过this来访问', () => {
    const app = createApp({
      render() {
        return h('div', { class: 'container' }, this.name);
      },
      setup() {
        return {
          name: '123'
        }
      }
    });
    const appDoc = document.querySelector('#app')
    app.mount(appDoc);
    expect(document.body.innerHTML).toBe('<div id="app"><div class="container">123</div></div>');
  })

  test('实现this.$el', () => {
    let that;
    const app = createApp({
      render() {
        that = this;
        return h('div', { class: 'container', id: 'container' }, '123');
      }
    });
    const appDoc = document.querySelector('#app')
    app.mount(appDoc);

    expect(document.body.innerHTML).toBe('<div id="app"><div class="container" id="container">123</div></div>');

    const elDom = document.querySelector('#container')
    // el就是当前组件的真实dom
    expect(that.$el).toBe(elDom);
  })

})
