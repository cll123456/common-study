import { effect } from "../src/effect"
import { reactive } from "../src/reactive"
import { isRef, proxyRefs, ref, unRef } from "../src/ref"

describe('ref', () => {
  test('ref 处理普通值 get', () => {
    const aRef = ref(1)
    // ref 会有一个value属性
    expect(aRef.value).toBe(1)
  })

  test('ref 把数据变成响应式', () => {
    const a = ref(1);
    let dummy;
    let calls = 0;
    effect(() => {
      calls++;
      dummy = a.value;
    });
    expect(calls).toBe(1);
    expect(dummy).toBe(1);
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
    // same value should not trigger
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
  })

  test('ref传入对象', () => {
    const a = ref({
      count: 1,
    });
    let dummy;
    effect(() => {
      dummy = a.value.count;
    });
    expect(dummy).toBe(1);
    a.value.count = 2;
    expect(dummy).toBe(2);
  })

  test('isRef', () => {
    const a = ref(1);
    expect(isRef(a)).toBe(true);

    const b = 1;
    expect(isRef(b)).toBe(false);

    const c = reactive({ a: 1 })
    expect(isRef(c)).toBe(false);
  })


  test('unRef', () => {
    const a = ref(1);

    expect(unRef(a)).toBe(1);

    const b = 1
    expect(unRef(b)).toBe(1);
  })

  test('proxyRefs', () => {
    const user = {
      age: ref(10),
      name: "twinkle",
    };
    const proxyUser = proxyRefs(user);
    expect(user.age.value).toBe(10);
    expect(proxyUser.age).toBe(10);
    expect(proxyUser.name).toBe("twinkle");

    proxyUser.age = 20;
    expect(proxyUser.age).toBe(20);
    expect(user.age.value).toBe(20);

    proxyUser.age = ref(10);
    expect(proxyUser.age).toBe(10);
    expect(user.age.value).toBe(10);
  })
})
