import { computed } from "../src/computed"
import { effect } from "../src/effect"
import { reactive } from "../src/reactive"
import { ref } from "../src/ref"

describe('test computed', () => {

  test('测试computed函数结果', () => {
    const a = computed(() => 1)
    expect(a.value).toBe(1)
  })

  it('computed的结果有缓存并且不会被执行', () => {

    const value = reactive({})
    const getter = jest.fn(() => value.foo)
    const cValue = computed(getter)

    // lazy
    expect(getter).not.toHaveBeenCalled()

    expect(cValue.value).toBe(undefined)
    expect(getter).toHaveBeenCalledTimes(1)

    // should not compute again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(1)

    // should not compute until needed
    value.foo = 1
    expect(getter).toHaveBeenCalledTimes(1)

    // now it should compute
    expect(cValue.value).toBe(1)
    expect(getter).toHaveBeenCalledTimes(2)

    // // should not compute again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(2)
  })


  // 链式调用
  it('should work when chained', () => {

    const value = reactive({ foo: 0 })
    const c1 = computed(() => value.foo)
    const c2 = computed(() => c1.value + 1)

    expect(c2.value).toBe(1)
    expect(c1.value).toBe(0)
    value.foo++

    expect(c2.value).toBe(2)
    expect(c1.value).toBe(1)
  })



  test('触发响应式 w/ setter', () => {
    const n = ref(1)
    const plusOne = computed({
      get: () => n.value + 1,
      set: val => {
        n.value = val - 1
      }
    })

    let dummy
    effect(() => {
      dummy = n.value
    })
    expect(dummy).toBe(1)

    plusOne.value = 0
    expect(dummy).toBe(-1)
  })

})
