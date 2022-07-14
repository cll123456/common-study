import { isProxy, reactive, readonly } from "../src/reactive"

describe('test proxy', () => {

  test('测试一个对象是否是proxy', () => {
    const origin = { a: 1 }
    const reactiveObj = reactive(origin)
    const readonlyObj = readonly(origin)

    expect(isProxy(reactiveObj)).toBe(true)

    expect(isProxy(readonlyObj)).toBe(true)

    expect(isProxy(origin)).toBe(false)
  })
})
