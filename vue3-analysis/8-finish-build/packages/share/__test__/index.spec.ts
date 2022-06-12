import { extend, hasChanged, isFunction } from "../src"

describe('test share', () => {
  test('test extend', () => {
    const obj = { a: 1 }, obj1 = { b: 2 }
    const res = extend(obj, obj1)
    expect(res).toEqual({ a: 1, b: 2 })
  })


  test('test hasChanged', () => {
    const obj = { a: 1 }, obj1 = { b: 2 }
    const res = hasChanged(obj, obj1)
    expect(res).toBe(true)
  })


  test('test val is func', () => {
    const val = () => { }
    expect(isFunction(val)).toBe(true)
  })
})
