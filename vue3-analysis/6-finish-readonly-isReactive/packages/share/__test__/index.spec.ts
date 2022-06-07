import { extend } from ".."

describe('test share', () => {
  test('test extend', () => {
    const obj = { a: 1 }, obj1 = { b: 2 }
    const res = extend(obj, obj1)
    expect(res).toEqual({ a: 1, b: 2 })
  })
})
