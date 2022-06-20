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
  normalizeObjectSlots(children, (instance.slots = {}));

}


const normalizeSlotValue = (value) => {
  // 把 function 返回的值转换成 array ，这样 slot 就可以支持多个元素了
  return Array.isArray(value) ? value : [value];
};


const normalizeObjectSlots = (rawSlots, slots) => {
  for (const key in rawSlots) {
    const value = rawSlots[key];
    if (isFunction(value)) {
      // 把这个函数给到slots 对象上存起来
      // 后续在 renderSlots 中调用
      // TODO 这里没有对 value 做 normalize，
      // 默认 slots 返回的就是一个 vnode 对象
      slots[key] = (props) => normalizeSlotValue(value(props));
    } else {
      slots[key] = normalizeSlotValue(value);
    }
  }
};
