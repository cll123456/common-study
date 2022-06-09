import { hasChanged, isObj } from "share";
import { trackEffect, tracking, triggerEffect } from "./effect";
import { reactive } from "./reactive";

class Ref {
  private _val: any;
  // 收集的ref依赖
  private deps

  // 原始值
  private _rawVal: any;
  // ref标识
  public _v__is_ref = true

  constructor(value) {
    // 判断value是否是对象,对象直接调用reactive
    this._val = isObj(value) ? reactive(value) : value
    this._rawVal = value
    this.deps = new Set()
  }

  get value() {
    // 进行依赖收集
    if (tracking()) {
      trackEffect(this.deps)
    }
    return this._val
  }

  set value(val) {
    // 数据没有发生改变，不需要重新trigger
    if (!hasChanged(val, this._rawVal)) return
    this._rawVal = val;
    this._val = isObj(val) ? reactive(val) : val
    triggerEffect(this.deps)
  }
}

/**
 * 把数据变成一个ref
 * @param val 
 * @returns 
 */
export function ref(val) {
  return new Ref(val)
}

/**
 * 判断传入的数据是否是ref
 * @param val 
 * @returns 
 */
export function isRef(val) {
  return !!val._v__is_ref
}

/**
 * 把ref数据变成origin数据
 * @param val 
 * @returns 
 */
export function unRef(val) {
  return isRef(val) ? val.value : val
}

/**
 * 
 * @param obj 
 * @returns 
 */
export function proxyRefs(obj) {
  return new Proxy(obj, {
    get(target, key) {
      const val = Reflect.get(target, key)
      return isRef(val) ? val.value : val
    },
    set(target, key, val) {
      // set -> target[key] is ref && val not is ref 
      if (isRef(target[key]) && !isRef(val)) {
        return target[key].value = val
      } else {
        return Reflect.set(target, key, val)
      }
    }
  })
}
