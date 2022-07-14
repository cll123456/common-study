import { isFunction } from "shared";
import { getCurrentInstance } from "./component";

/**
 * 存入数据
 * @param key 
 * @param val 
 */
export function provide(key, val) {
  // 数据需要存储在当前的实例上面
  const instance = getCurrentInstance();

  if (instance) {
    let { provides } = instance;
    // 正对多层组件，需要把当前组件的__proto__绑定到父级上面，形成原型链，可以访问到最顶层的数据
    const parentProvides = instance.parent && instance.parent.provide;
    if (parentProvides === provides) {
      provides = instance.providers = Object.create(parentProvides || {});
    }


    provides[key] = val;
  }
}

/**
 * 取出数据
 * @param key 
 */
export function inject(key, defaultVal?) {
  // 从当前实例中的父级取出数据来
  const instance = getCurrentInstance();
  if (instance) {
    const provides = instance.parent.provides
    if (key in provides) {
      return provides[key]
    } else {
      // 判断第二个参数的类型
      if (isFunction(defaultVal)) {
        // 返回函数的结果
        return defaultVal(instance.provides);
      }
      return defaultVal
    }
  }

}
