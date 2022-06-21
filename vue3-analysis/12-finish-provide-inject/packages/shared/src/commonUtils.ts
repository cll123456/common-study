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

/**
 * 判断属性是否在对象上
 * @param val 
 * @param key 
 * @returns 
 */
export const isOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key)

/**
 * 判断字符串是否以 on + 大小字母开头
 * @param p 
 * @returns 
 */
export const isOn = (p: string) => p.match(/^on[A-Z]/i)


/**
 * 讲字符串首字母大写
 * @param str 
 * @returns 
 */
export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)
/**
 * 从event里面可以拿到当前emit触发的事件类型
 * @param str 
 * @returns 
 */
export const handlerName = (str) => str ? 'on' + str : ''

/**
 * 将xxx-event转换成xxxEvent
 * @param str 
 * @returns 
 */
export const camize = (str) => str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
