import { effect } from "../src/effect";
import { reactive } from "../src/reactive";

// 最终实现的目标
describe('core', () => {
  test('响应式数据测试', () => {
    const origin = reactive({ num: 1 })
    let newVal;
    effect(() => {
      newVal = origin.num
    })
    expect(newVal).toBe(1)

    // update
    origin.num = 2
    expect(newVal).toBe(2)
  })
})
