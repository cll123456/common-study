import { NodeTypes } from "../src/ast";
import { baseParse } from "../src/parse";

describe('compiler-core parse', () => {
  test('parse interpolation ---> {{message}}', () => {
    // 1. 看看是不是一个 {{ 开头的
    // 2. 是的话，那么就作为 插值来处理
    // 3. 获取内部 message 的内容即可
    const ast = baseParse(`{{message}}`);

    expect(ast).toStrictEqual({
      type: NodeTypes.ROOT,
      children: [{
        type: NodeTypes.INTERPOLATION,
        content: {
          type: NodeTypes.SIMPLE_EXPRESSION,
          content: 'message'
        },
      }]
    })
  })

  test('parse element ---> <div></div>', () => {
    const ast = baseParse(`<div></div>`);
    expect(ast).toStrictEqual({
      type: NodeTypes.ROOT,
      children: [{
        type: NodeTypes.ELEMENT,
        tag: 'div',
        children: []
      }]
    })
  })

  test('parse text ---> hi, vue3', () => {
    const ast = baseParse(`hi, vue3`);
    expect(ast).toStrictEqual({
      type: NodeTypes.ROOT,
      children: [{
        type: NodeTypes.TEXT,
        content: `hi, vue3`
      }]
    })
  })

  test('parse both ---> <div>hi, twinkle, {{message}}</div>', () => {
    const ast = baseParse(`<div>hi, twinkle, {{message}}</div>`);
    expect(ast).toStrictEqual({
      type: NodeTypes.ROOT,
      children: [{
        type: NodeTypes.ELEMENT,
        tag: 'div',
        children: [{
          type: NodeTypes.TEXT,
          content: `hi, twinkle, `
        }, {
          type: NodeTypes.INTERPOLATION,
          content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content: 'message'
          }
        }
        ]
      }]
    })
  })

  test('parse nest ---> <div>hi, <p>twinkle, </p>{{message}}<div>', () => {
    const ast = baseParse(`<div>hi, <p>twinkle, </p>{{message}}</div>`);
    expect(ast).toStrictEqual({
      type: NodeTypes.ROOT,
      children: [{
        type: NodeTypes.ELEMENT,
        tag: 'div',
        children: [{
          type: NodeTypes.TEXT,
          content: `hi, `
        }, {
          type: NodeTypes.ELEMENT,
          tag: 'p',
          children: [{
            type: NodeTypes.TEXT,
            content: `twinkle, `
          }]
        }, {
          type: NodeTypes.INTERPOLATION,
          content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content: 'message'
          }
        }]
      }]
    })
  })


  test('lose close tag  ---> <div><span></div>', () => {
    expect(() => {
      baseParse(`<div><span></div>`)
    }).toThrow('span缺少关闭标签')
  })

  test('lose open tag  ---> <span></span>', () => {
    expect(() => {
      baseParse(`<div></span></div>`)
    }).toThrow('span缺少开始标签')
  })

  test('lose close interpolation  ---> <div>{{message</div>', () => {
    expect(() => {
      baseParse(`<div>{{message</div>`)
    }).toThrow('没有找到插值的结束标签}}')
  })

  test('lose open interpolation  ---> <div>message}}</div>', () => {
    expect(() => {
      baseParse(`<div>message}}</div>`)
    }).toThrow('没有找到插值的开始标签{{')
  })

  test('lose interpolation  ---> <div>{{mes{{sage}}</div>', () => {
    expect(() => {
      baseParse(`<div>{{mes{{sage}}</div>`)
    }).toThrow('没有找到插值的结束标签}}')
  })

  test('lose interpolation  ---> <div>{{mes}}sage}}</div>', () => {
    expect(() => {
      baseParse(`<div>{{mes}}sage}}</div>`)
    }).toThrow('没有找到插值的开始标签{{')
  })
})
