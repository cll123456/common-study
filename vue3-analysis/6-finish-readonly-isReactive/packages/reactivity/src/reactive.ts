import { isObj } from 'share'
import { mutableHandlers, ReactiveFlags, readonlyHandlers, shallowReadonlyHandles } from "./baseHandle";


/**
 * reactive
 * @param obj 
 * @returns 
 */
export function reactive(obj) {
  return createReactiveObject(obj, mutableHandlers)
}

/**
 * readonly
 * @param obj 
 * @returns 
 */
export function readonly(obj) {
  return createReactiveObject(obj, readonlyHandlers)
}

/**
 * 创建响应式对象
 * @param obj 
 * @param baseHandles 
 * @returns 
 */
export function createReactiveObject(obj, baseHandles) {
  if (!isObj(obj)) return obj
  return new Proxy(obj, baseHandles)
}

/**
 * 判断一个数据是否是reactive数据
 * @param value 
 * @returns 
 */
export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY]
}

/**
 * shallowReadonly
 * @param obj 
 * @returns 
 */
export function shallowReadonly(obj) {
  return createReactiveObject(obj, shallowReadonlyHandles)
}
