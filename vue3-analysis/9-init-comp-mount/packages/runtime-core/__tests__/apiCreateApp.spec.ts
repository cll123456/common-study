import { h } from "../src";
import { createApp } from "../src/apiCreateApp";

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
})
