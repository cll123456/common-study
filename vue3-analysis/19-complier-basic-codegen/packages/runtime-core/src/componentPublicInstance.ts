import { isOwn } from "shared"

const publicPropertiesMap = {
  // 返回当前组件的el
  $el: (instance) => instance.vnode.el,
  // 返回当前组件的slots
  $slots: (instance) => instance.slots,
  // 返回当前组件的props
  $props: (instance) => instance.props
}

export const publicInstanceHandles = {
  get({ _: instance }, key) {
    // 判断key是否在组件的setupState上
    if (isOwn(instance.setupState, key)) {
      return instance.setupState[key]
    } else if (isOwn(instance.props, key)) {
      // 在组件的属性上
      return instance.props[key]
    }
    if (key in publicPropertiesMap) {
      return publicPropertiesMap[key](instance)
    }
  }
}
