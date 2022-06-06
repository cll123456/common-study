import { reactive } from "../src/reactive"

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
})
