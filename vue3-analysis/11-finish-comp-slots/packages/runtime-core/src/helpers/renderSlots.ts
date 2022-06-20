import { isFunction } from "shared";
import { createVNode, Fragment } from "../vnode";

export function renderSlots(slots, name = 'default', props = {}) {
  const slot = slots[name];

  if (slot) {
    if (isFunction(slot)) {
      return createVNode(Fragment, {}, slot(props))
    }
    return createVNode(Fragment, {}, slot)
  }
}
