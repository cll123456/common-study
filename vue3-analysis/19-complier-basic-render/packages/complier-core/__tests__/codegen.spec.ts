import { baseParse, codegen } from "../src"
import { transform } from "../src/transform"
import { transformInterpolation } from '../src/plugins/transformInterpolation'
import { transformElement } from '../src/plugins/transformElement'
import { transformText } from '../src/plugins/transformText'

describe('test codegen', () => {

  test('code gen str ---> hi', () => {
    const ast = baseParse('hi')
    transform(ast)
    const codeObj = codegen(ast)

    expect(codeObj.code).toMatchSnapshot()
  })

  test('code gen interpolation  ---> {{message}}', () => {
    const ast = baseParse('{{message}}')
    transform(ast, {
      nodeTransforms: [transformInterpolation]
    })
    const codeObj = codegen(ast)
    expect(codeObj.code).toMatchSnapshot()
  })

  test('code gen element  ---> <div></div>', () => {
    const ast = baseParse('<div></div>')
    transform(ast, {
      nodeTransforms: [transformElement]
    })
    const codeObj = codegen(ast)
    expect(codeObj.code).toMatchSnapshot()
  })

  /**
     * const { openBlock: _openBlock, createElementBlock: _createElementBlock } = Vue

return function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", null, "hi twinkle,"))
}
     */
  test('code gen element and  str  ---> <div>hi twinkle,</div>', () => {
    const ast = baseParse('<div>hi, twinkle,</div>')
    transform(ast, {
      nodeTransforms: [transformElement]
    })
    const codeObj = codegen(ast)
    expect(codeObj.code).toMatchSnapshot()
  })


  /**
   * 
   */
  test('code gen element and  interpolation  ---> <div>{{message}}</div>', () => {
    const ast = baseParse('<div>{{message}}</div>')
    transform(ast, {
      nodeTransforms: [transformElement, transformInterpolation]
    })
    const codeObj = codegen(ast)
    expect(codeObj.code).toMatchSnapshot()
  })


  test('code gen element, str and  interpolation  ---> <div>hi twinkle, {{message}}</div>', () => {
    const ast = baseParse('<div>hi, twinkle, {{message}}</div>')

    transform(ast, {
      nodeTransforms: [transformText, transformElement, transformInterpolation]
    })
    const codeObj = codegen(ast)
    expect(codeObj.code).toMatchSnapshot()
  })
})
