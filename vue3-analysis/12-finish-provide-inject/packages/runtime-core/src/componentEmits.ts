import { camize, capitalize, handlerName } from "shared"

export function emit(instance, event, ...args) {
  const { props } = instance
  // 判断props里面是否有对应的事件，有的话执行，没有就不执行
  const key = handlerName(capitalize(camize(event)))
  const handler = props[key]

  handler && handler(...args)
}
