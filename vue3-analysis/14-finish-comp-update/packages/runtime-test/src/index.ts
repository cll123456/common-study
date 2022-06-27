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
    // 注册事件
    el.addEventListener(key.slice(2).toLowerCase(), newValue)
  } else {
    // 新值没有，则移除
    if (newValue === null || newValue === undefined) {
      el.removeAttribute(key)
    } else {
      el.setAttribute(key, newValue)
    }
  }
}


function insert(el, container) {
  container.append(el)
}

function setElementText(el, text) {
  el.textContent = text;
}

const render: any = createRenderer({
  createElement,
  patchProps,
  insert,
  setElementText
});

export function createApp(...args) {
  return render.createApp(...args);
}

export * from 'runtime-core'
