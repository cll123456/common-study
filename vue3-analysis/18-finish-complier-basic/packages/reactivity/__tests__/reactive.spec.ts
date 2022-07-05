import { isReactive, reactive } from "../src/reactive"

describe('reactive', () => {
  test('测试reactive', () => {
    let obj = { num: 1 }
    const proxyObj = reactive(obj)

    expect(obj).not.toBe(proxyObj)
    expect(proxyObj.num).toBe(1)

    // update set
    proxyObj.num = 2
    expect(obj.num).toBe(2)
  })

  test('测试传入的数据是否是reactive', () => {
    const origin = { num: 1 };
    const reactiveObj = reactive(origin);
    const reactiveData = isReactive(reactiveObj)

    // reactive true
    expect(reactiveData).toBe(true)

    // origin false
    const originData = isReactive(origin)
    expect(originData).toBe(false)
  })


  test('测试嵌套的reactive数据', () => {
    const origin = {
      a: 1,
      nest: {
        b: 2,
        c: { a: 1 }
      }
    }

    const reactiveObj = reactive(origin)

    expect(isReactive(reactiveObj.nest)).toBe(true)

    expect(isReactive(reactiveObj.nest.c)).toBe(true)
  })
})
