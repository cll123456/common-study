import { proxyRefs } from "reactivity"
import { isFunction, isObj } from "shared"
import { initProps } from "./componentProps"

/**
 * 创建组件的实例
 * @param vnode 
 */
export function createComponentInstance(vnode) {
  const instance = {
    vnode,
    props: {},
    type: vnode.type,
  }

  return instance
}


export function setupComponent(instance) {
  // 获取props和children
  const { props } = instance

  // 处理props
  initProps(instance, props)

  // 处理slots
  // initSlots(instance, children)

  // 处理setup
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type;
  // 获取组件的setup
  const { setup } = Component;

  if (setup) {
    // 执行setup，并且获取到setup的结果
    const setupResult = setup();

    // 处理setup的结果
    handleSetupResult(instance, setupResult);
  }

  finishComponentSetup(instance);
}


function handleSetupResult(instance: any, setupResult: any) {
  if (isFunction(setupResult)) {
    // 如果setup的结果是一个函数，那么就是render函数
    instance.render = setupResult;
  } else if (isObj(setupResult)) {
    // 设置setupState
    instance.setupState = proxyRefs(setupResult);
  }

  // 完成setup的设置
  finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
  // 获取到组件
  const Component = instance.type;
  // 判断实例是否是有render函数
  if (!instance.render) {
    instance.render = Component.render;
  }
}
