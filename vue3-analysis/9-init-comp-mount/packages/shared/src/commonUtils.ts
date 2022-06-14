/**
 * 合并方法
 */
export const extend = Object.assign;


/**
 * 是否是对象
 * @param obj 
 * @returns 
 */
export function isObj(obj) {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj)
}


/**
 * 是否发生改变
 * @param a 
 * @param b 
 * @returns 
 */
export function hasChanged(a, b) {
  return !Object.is(a, b)
}

/**
 * 判断是否是函数
 * @param val 
 * @returns 
 */
export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function'


