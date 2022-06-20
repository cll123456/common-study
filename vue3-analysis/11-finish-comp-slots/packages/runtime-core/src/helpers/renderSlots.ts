import { isFunction } from "shared";
import { createVNode } from "../vnode";

export function renderSlots(slots, name = 'default', props = {}) {
  const slot = slots[name];

  if (slot) {
    if (isFunction(slot)) {
      return createVNode('div', {}, slot(props))
    }
    return createVNode('div', {}, slot)
  }
}
