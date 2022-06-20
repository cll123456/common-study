import { isFunction } from "shared"

/**
 * 初始化slots
 * @param instance 
 * @param children 
 */
export function initSlots(instance, children) {
  // 传入的children是一个array
  // if()
  // 传入的children 是一个对象
  const slots = {}
  // 遍历children
  for (const key in children) {
    if (isFunction(children[key])) {
      slots[key] = (props) => Array.isArray(children[key](props)) ? children[key](props) : [children[key](props)]
    } else {
      slots[key] = Array.isArray(children[key]) ? children[key] : [children[key]]
    }
  }

  instance.slots = slots

}
