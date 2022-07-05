import { isReadonly, readonly, shallowReadonly } from "../src/reactive"

describe('readonly', () => {
  test('readonly can get', () => {
    const origin = { a: 1 }
    const readonlyRes = readonly(origin)
    // get
    expect(readonlyRes.a).toBe(1)
  })

  test('readonly not to be set', () => {
    console.warn = jest.fn()
    const origin = { a: 1 }
    const readonlyRes = readonly(origin)
    readonlyRes.a = 2
    expect(console.warn).toBeCalled()
  })

  test('测试传入的数据是否是readonly', () => {
    const origin = { num: 1 };
    const readonlyObj = readonly(origin);
    const readonlyData = isReadonly(readonlyObj)
    // readonly true
    expect(readonlyData).toBe(true)

    // origin false
    const originData = isReadonly(origin)
    expect(originData).toBe(false)
  })

  test('测试嵌套的readonly数据', () => {
    const origin = {
      a: 1,
      nest: {
        b: 2,
        c: { a: 1 }
      }
    }

    const readonlyObj = readonly(origin)

    expect(isReadonly(readonlyObj.nest)).toBe(true)

    expect(isReadonly(readonlyObj.nest.c)).toBe(true)
  })

  test('测试shallowReadonly', () => {
    const origin = {
      a: 1,
      nest: {
        b: 2,
        c: { a: 1 }
      }
    }
    const shallowReadonlyObj = shallowReadonly(origin)

    expect(isReadonly(shallowReadonlyObj)).toBe(true)

    expect(isReadonly(shallowReadonlyObj.nest)).toBe(false)

  })
})
