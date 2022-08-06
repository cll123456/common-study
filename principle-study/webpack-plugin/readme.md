# webpack plugins 原理
> webpack的插件是用于增强webpack本身的功能而存在的一个模块

## 特征

- 是一个独立的模块
- 模块对外暴露的是一个`js`函数
- 函数的原型上`（prototype）`上有`complier`对象的`apply`方法
- `apply`方法上可以拿到当前的`complier`对象
- `在complier`对象中可以拿到`webpack`挂载的`hooks`,在钩子的回调中可以拿到当前的`complieration`对象,如果如果当前插件的操作是异步的话，还可以拿到一个`callback`回调


如果手动实现一个`webpack`插件的话，可以是下面的这个样子:
```ts
class PluginName {
  // webpack执行的时候，会在原型上放入一个apply方法，里面的complier是webpack的compiler对象
  apply(compiler) {、
    // 通过complier拿到hooks里面的插件
    compiler.hooks.compile.tap('PluginName', compilation => {
      // do something
    });
  }
}

export default PluginName;
```


