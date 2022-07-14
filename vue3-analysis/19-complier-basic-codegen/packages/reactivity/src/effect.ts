import { extend } from 'shared'


// 当前执行的effect
let activeEffect = void 0;
// 是否需要进行依赖收集
let shouldTrack = false;

export class EffectReactive {
  fn: Function;
  // 保存正则执行的effect,用于清除
  deps = []
  // 防止在同一时间调用多次stop
  active = true;
  // stop 回调函数
  public onStop: Function;

  constructor(fn, public scheduler?) {
    this.fn = fn
    this.scheduler = scheduler
  }

  run() {
    // 调用stop后不需要收集依赖
    if (!this.active) {
      activeEffect = this;
      return this.fn()
    }

    // 收集依赖
    shouldTrack = true;
    activeEffect = this;

    const result = this.fn();

    // 执行fn后停止收集依赖
    shouldTrack = false;

    return result

  }

  /**
   * 停止响应
   */
  stop() {
    if (this.active) {

      cleanEffect(this);
      if (this.onStop) {
        this.onStop()
      }
      /**
       * 防止在同一个activeEffect 中重复调用stop
       */
      this.active = false
    }
  }
}
/**
 * 清空当前收集的effect
 * @param effect 
 */
function cleanEffect(effect) {
  effect.deps.forEach(effectSet => {
    effectSet.delete(effect)
  })
  effect.deps.length = 0
}

/**
 * 创建一个effect
 * @param fn 
 */
export function effect(fn, options: any = {}) {
  const _effect = new EffectReactive(fn, options.scheduler)
  // 可能还有其他参数需要合并
  // _effect.onStop = options.onStop
  extend(_effect, options)
  _effect.run()
  const runner = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}


const targetMap = new WeakMap();

/**
 * 收集依赖
 * @param target 
 * @param key 
 */
export function track(target, key) {
  if (!tracking()) return

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  // 获取key
  let deps = depsMap.get(key);
  if (!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }
  trackEffect(deps)
}

/**
 * 收集effect
 * @param deps 
 * @returns 
 */
export function trackEffect(deps) {
  // 存在的话，不需要反复收集
  if (deps.has(activeEffect)) return
  // 收集依赖
  deps.add(activeEffect)
  activeEffect.deps.push(deps)
}

/**
 * 是否正在进行依赖收集
 * @returns 
 */
export function tracking() {
  return shouldTrack && activeEffect
}

/**
 * 依赖触发
 * @param target 
 * @param key 
 * @returns 
 */
export function trigger(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    return
  }
  let deps = depsMap.get(key);
  if (!deps) {
    return
  }
  // 触发依赖
  triggerEffect(deps)
}
/**
 * 遍历触发依赖
 * @param deps 
 */
export function triggerEffect(deps) {
  deps.forEach(effect => {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  })
}

/**
 * 停止响应式更新
 * @param runner 
 */
export function stop(runner) {
  runner.effect.stop()
}


