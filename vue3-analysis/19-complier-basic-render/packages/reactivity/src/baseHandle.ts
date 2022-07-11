import { extend, isObj } from "shared"
import { track, trigger } from "./effect"
import { reactive, readonly } from "./reactive"

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)
/**
 * 响应式对象枚举
 */
export const enum ReactiveFlags {
  /**
   * reactive数据
   */
  IS_REACTIVE = "__v_isReactive",
  /**
   * readonly数据
   */
  IS_READONLY = "__v_isReadonly",
}

function createGetter(isReadonly = false, shallow = false) {
  return function (target, key, receiver) {
    const value = Reflect.get(target, key, receiver)
    // 是reactive数据
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    }
    // 是readonly数据
    else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }
    // shallow readonly
    if (shallow) {
      return value
    }

    if (isObj(value)) {
      return isReadonly ? readonly(value) : reactive(value)
    }

    if (!isReadonly) {
      // 依赖收集
      track(target, key)
    }
    return value
  }
}

function createSetter() {
  return function (target, key, value, receiver) {
    const res = Reflect.set(target, key, value, receiver)
    // 触发依赖
    trigger(target, key)
    return res
  }
}

/**
 * 可变的handles
 */
export const mutableHandlers = {
  get,
  set,
}

/**
 * readonly handlers
 */
export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value, receiver) {
    console.warn(`${key.toString()} 不能被set, 因为是readonly， ${target}`)
    return true
  }
}


/**
 * shallow readonly handlers
 */
export const shallowReadonlyHandles = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
})
