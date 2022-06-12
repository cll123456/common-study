import { isFunction } from "share"
import { EffectReactive, trackEffect, tracking, triggerEffect, } from "./effect"

class ComputedRefImpl {
  private getter: any
  private readonly setter: any
  private _value: any
  // 是否可以执行
  private _dirty = true
  // 收集getter的依赖
  private deps;

  private effect

  constructor(getter, setter) {
    this.getter = getter
    this.setter = setter
    this.deps = new Set()

    this.effect = new EffectReactive(this.getter, () => {
      if (!this._dirty) {
        this._dirty = true
        triggerEffect(this.deps)
      }
    })
  }

  get value() {
    // 收集依赖
    if (tracking()) {
      trackEffect(this.deps)
    }
    // 用于缓存执行结果
    if (this._dirty) {
      this._dirty = false
      this._value = this.effect.run()
    }
    return this._value
  }

  set value(val) {
    this.setter(val)
  }
}

/**
 * 计算属性
 * @param getterOrOptions 
 * @returns 
 */
export function computed(getterOrOptions) {
  let getter
  let setter
  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  return new ComputedRefImpl(getter, setter)
}
