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
