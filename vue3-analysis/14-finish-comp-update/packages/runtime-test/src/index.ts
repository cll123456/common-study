import { createRenderer } from 'runtime-core'

import { isOn } from "shared";

/**
 * 创建dom
 * @param type 
 * @returns 
 */
function createElement(type) {
  return document.createElement(type);

}

function patchProps(el, key, oldValue, newValue) {

  if (isOn(key)) {
    const invokers = el._vei || (el._vei = {});
    const existingInvoker = invokers[key];
    if (newValue && existingInvoker) {
      // patch
      // 直接修改函数的值即可
      existingInvoker.value = newValue;
    } else {
      const eventName = key.slice(2).toLowerCase();
      if (newValue) {
        const invoker = (invokers[key] = newValue);
        // 注册事件
        el.addEventListener(eventName, invoker);
      } else {
        el.removeEventListener(eventName, existingInvoker);
        invokers[key] = undefined;
      }
    }

    // el.addEventListener(key.slice(2).toLowerCase(), newValue)
  } else {
    // 新值没有，则移除
    if (newValue === null || newValue === undefined) {
      el.removeAttribute(key)
    } else if (key === 'key') {
      // key不需要绑定到dom中
    } else {
      el.setAttribute(key, newValue)
    }
  }
}


function insert(el, container, anchor) {
  container.insertBefore(el, anchor || null)
}

function setElementText(el, text) {
  el.textContent = text;
}

function remove(el) {
  // 拿到父级的节点
  const parent = el.parentNode
  if (parent) {
    parent.removeChild(el)
  }
}

const render: any = createRenderer({
  createElement,
  patchProps,
  insert,
  setElementText,
  remove
});

export function createApp(...args) {
  return render.createApp(...args);
}

export * from 'runtime-core'
