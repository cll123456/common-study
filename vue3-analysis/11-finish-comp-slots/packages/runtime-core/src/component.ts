import { proxyRefs, shallowReadonly } from "reactivity"
import { isFunction, isObj } from "shared"
import { emit } from "./componentEmits"
import { initProps } from "./componentProps"
import { publicInstanceHandles } from "./componentPublicInstance"
import { initSlots } from "./componentSlots"

/**
 * 创建组件的实例
 * @param vnode 
 */
export function createComponentInstance(vnode) {
  const instance = {
    vnode,
    props: {},
    type: vnode.type,
    // setup函数返回的对象结果
    setupState: {},
    // 组件上下文
    ctx: {},
    // 组件代理对象
    proxy: null,
    // emit函数
    emit: () => { },
    // 插槽
    slots: {}
  }

  instance.emit = emit.bind(null, instance);

  return instance
}


export function setupComponent(instance) {
  // 获取props和children
  const { props, children } = instance.vnode

  // 处理props
  initProps(instance, props)

  // 处理slots
  initSlots(instance, children)

  // 处理setup
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  // 代理组件的上下文
  instance.proxy = new Proxy({ _: instance }, publicInstanceHandles)

  const Component = instance.type;
  // 获取组件的setup
  const { setup } = Component;

  if (setup) {
    // 执行setup，并且获取到setup的结果
    const setupResult = setup(shallowReadonly(instance.props), { emit: instance.emit });

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
