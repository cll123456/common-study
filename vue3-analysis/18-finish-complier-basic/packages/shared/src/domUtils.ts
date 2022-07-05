import { isObj } from "./commonUtils";

/**
 * 判断是否是dom
 * @param selector 
 * @returns 
 */
export function isDom(selector) {
  if (isObj(selector) && selector.nodeType === 1 && typeof selector.nodeName === 'string') {
    return true;
  } else {
    return false;
  }
}
