import { baseParse } from "../src"
import { NodeTypes } from "../src/ast"
import { transform } from "../src/transform"

describe('test transform', () => {

  // 通过transform函数，可以往ast里面注入插件，然后改变ast的内容
  test.only('transform', () => {
    const ast = baseParse('<div>hi twinkle, {{message}}</div>')
    const transformText = (node) => {
      if (node.type === NodeTypes.TEXT) {
        // 把文本节点的文本内容替换成 hi marry
        node.content = 'hi marry'
      }
    }
    // 需要经过transfrom,把 hi twinkle --> hi marry
    transform(ast, {
      nodeTransforms: [transformText]
    })
    expect(ast.children[0].children[0].content).toBe('hi marry')
  })
})
