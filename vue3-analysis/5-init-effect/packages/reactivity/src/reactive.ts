import { track, trigger } from "./effect";

function isObj(obj) {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj)
}

export function reactive(obj) {
  if (!isObj(obj)) return obj;

  return new Proxy(obj, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver)
      // 依赖收集
      trigger(target, key)

      if (isObj(value)) {
        return reactive(value)
      }
      return value
    },
    set(target, key, value, receiver) {

      const result = Reflect.set(target, key, value, receiver)
      // 触发依赖
      track(target, key)
      return result
    },
  })
}
