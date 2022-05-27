/**
 * 实现简易版的vue3响应式系统
 */

/**
 * 判断是否是对象
 * @param {*} obj 
 * @returns 
 */
const isObj = obj => typeof obj === 'object' && obj !== null && !Array.isArray(obj)


// 当前的effect
let activeEffect;

/**
 * 对依赖进行收集
 * @param {*} fn 
 */
const effect = (fn) => {

  const run = () => {
    activeEffect = fn;
    fn();
    activeEffect = undefined
  }

  run()

  return run
}

// 全局的weakMap
const targetMap = new WeakMap();

/**
 * track操作
 */
const track = (target, key, receiver) => {
  let depsMap = targetMap.get(target);
  // 判断全局的weakMap是否存在
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap);
  }
  // 判断depsMap中是否包含key
  let depsSet = depsMap.get(key);
  if (!depsSet) {
    depsSet = new Set();
    depsMap.set(key, depsSet);
  }
  // 判断depsSet中是否包含当前的effect
  if (activeEffect) {
    depsSet.add(activeEffect);
  }
}

/**
 * 触发trigger,执行effect
 * @param {*} target 
 * @param {*} key 
 * @param {*} receiver 
 */
const trigger = (target, key, receiver) => {
  // 从targetMap中获取对应的depsMap
  const depsMap = targetMap.get(target);
  if (!depsMap) return
  const depsSet = depsMap.get(key);
  if (!depsSet) return
  // 循环执行effect
  depsSet.forEach(effect => effect());
}


/**
 * 把对象变成一个proxy
 * @param {*} target 
 * @returns 
 */
const reactive = (target) => {
  if (!isObj(obj)) {
    return obj;
  }
  return new Proxy(target, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver);
      // track 操作
      track(target, key, receiver);
      // 如果对象里面还是对象，需要再次返回代理进行响应式
      if (isObj(target[key])) {
        return reactive(res);
      }

      return res;
    },
    set(target, key, val, receiver) {
      const res = Reflect.set(target, key, val, receiver);
      // trigger 操作
      trigger(target, key, receiver);
      return res
    }
  })
}


// 测试一下

const obj = {
  num: 1,
  address: {
    pro: '江苏省',
    city: '南京市',
  }
}

const proxyObj = reactive(obj)
effect(() => {
  console.log(proxyObj.num, proxyObj.address.pro, proxyObj.address.city)
  document.querySelector('#test').innerHTML = `
  <p>当前num的值是：${proxyObj.num}</p>
  <p>当前address.pro的值是：${proxyObj.address.pro}</p>
  <p>当前address.city的值是：${proxyObj.address.city}</p>
  `
})
proxyObj.num = 1
window.obj = proxyObj

