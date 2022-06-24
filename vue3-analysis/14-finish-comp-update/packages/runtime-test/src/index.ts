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

function patchProps(el, key, value) {

  if (isOn(key)) {
    // 注册事件
    el.addEventListener(key.slice(2).toLowerCase(), value)
  }
  el.setAttribute(key, value)
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
