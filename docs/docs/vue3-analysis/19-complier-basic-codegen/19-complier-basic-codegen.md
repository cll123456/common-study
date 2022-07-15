---
theme: qklhk-chocolate
---

# 引言

<<往期回顾>>

1.  [vue3源码分析——手写diff算法](https://juejin.cn/post/7114966648309678110 "https://juejin.cn/post/7114966648309678110")
1.  [vue3源码分析——实现组件更新](https://juejin.cn/post/7115326422675587102 "https://juejin.cn/post/7115326422675587102")
1.  [vue3源码分析——解密nextTick的实现](https://juejin.cn/post/7116446683277295623 "https://juejin.cn/post/7116446683277295623")
2.  [vue3源码分析——看看complier是怎么来解析](https://juejin.cn/post/7117477079184375845)



在上一期中，和大家分享了ast是如何生成的,本期就来实现`vue3`中的`ast`如何生成`render`函数前的代码(如下图)。所有的源码请查看[仓库](https://github.com/cll123456/common-study/tree/master/vue3-analysis/19-complier-basic-codegen)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/357d0deaccbf4c7f8d3dc367fc9c7f9a~tplv-k3u1fbpfcp-watermark.image?)

# 正文
要想实现`ast`转换成代码，直接来转可以吗？当然可以，但是从一定的代码设计的角度来说，ast是一颗树，**要想把树转成一个字符串，肯定涉及到每个节点的遍历和对每个节点的个性化操作**。那么，可以在中间加一层转换层（`transform`）来处理个性化节点的操作。流程如下：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf02965938aa4cbcaf9b2da205b4ae45~tplv-k3u1fbpfcp-watermark.image?)

- ast: 将输入的字符串转成`ast`语法树
- tranform: 在进行代码生成之前，对个性化节点的操作
- codegen: 生成对应的代码
- render: 把生成的代码转成`render`函数

> 明白各个节点的意义后，接下来来实现下`tranform`和`codegen`模块

# tranfrom
`tranform`是用来转换代码，并且处理个性化节点的操作,既然需要用来转换`ast`传入的节点，**那么需要递归来遍历每一个节点，然后才可以做个性化的操作。**
## 分析
在递归遍历树的时候，vue3采用的遍历方式是 **深度优先算法**来遍历树。但是还需要考虑一件事情是，如何来处理个性化节点的操作？

对于这个问题，是不是有点类似于参数不知道，需要使用者来传递哇！那么对于处理个性化操作的事情，就交个调用者传进来就好了，这里可以采用一种**插件模式**的方式来传入。意思是说，传入一个`options`，里面有我需要的插件，然后在`tranform`的过程中，一个一个来调用满足条件的插件执行。

## 测试用例
通过上面的需求，来写出测试用例，最后再来编码

```ts
test('test transform simple', () => {
    const ast = baseParse('hi twinkle');
    // 处理文本的插件
    const plugin = (node) => {
        if(node.type === '文本节点'){
            node.content = 'hello twinkle'
        }
     }
    transform(ast, {
       transforms： [plugin]
    })
})
```

## 编码

```ts
export function transform(root, options = {}){
  // 创建上下文
  const context = {
    root,
    // 存入个性化的插件
    transforms: options.transforms || []
  }
  
  // 遍历节点
  traverseNode(root, context)
}

// 遍历节点
function traverseNode(root, context){
  const children = root.children;
  
  // 处理插件
  const transforms = context.transforms
  for(let i = 0; i <transforms.length; i++){
  // 执行插件
    transforms[i]()
  }
  
  // 处理子节点
  traverseChildrenNode(children, context)
}

traverseChildrenNode(children, context){
    if(children.length){
       for(let i = 0; i< children.length; i++){
         // 处理节点
         traverseNode(children[i], context)
       }
    }
}
```

> 通过这两步，一个简单的`transform`就写好了，可以测试一下。发现测试用例是可以通过的


# codegen

有了`tranform`模块，在代码生成的所有个性化都可以放入该模块中，并且可以以插件的形式来进行转换。

## 分析
本次的目标是把 `<div>hi twinkle,` <code v-pre>{{message}}</code>`</div>`生成如下的代码：


```ts
import { toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", null, "Hello World, " + _toDisplayString(_ctx.message)))
}

```
在这个任务中，可以拆分为多个小任务，逐步来实现这个功能：
- 解析文本 `hi twinkle`
- 解析插值 <code v-pre>{{message}}</code>
- 解析element `<div></div>`
- 解析element + text `<div>hi twinkle</div>`
- 解析element + 插值`<div>`<code v-pre>{{message}}</code>`</div>`
- 解析三者联合 `<div>hi twinkle, `<code v-pre>{{message}}</code>`</div>`

有了目标，那就一步一步来做！

## 解析文本
这一块的目标就来解析文本，实现的内容如下：

```ts
// 输入 hi twinkle
// 输出 


export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return "hi twinkle"
}
```


### 分析
对外暴露一个函数，然后接受一个字符串` hi twinkle`,然后输出字符串。

在字符串第一行`export function render(_ctx, _cache, $props, $setup, $data, $options) {`中，动态的内容有`render`和后面的参数`_ctx, _cache, $props, $setup, $data, $options`。其余的都是静态的内容，第二行中动态的内容就只有 `hi twinkle`,其他的是静态的.

### 编码

```ts
export function generate(root){
  // 创建上下文
  const context = {
    root,
    code: '',
    // 添加
    push(str){
      context.code += str
    },
    // 换行
    newLine(){
      context.code += `\n`
    }
  }
  
  const {push, newLine} = context;
  // 增加export
  const funcName = 'render'
  push(`export function ${funcName}(`)
  // 处理参数
  const argArr = ['_ctx', '_cache', '$props', '$setup', '$data', '$options']
  const args = argArr.join(', ');
  push(`${args})`)
  // 换行
  newLine();
  
  // 处理第二行
  push('return ')
  // 处理内容
  genNode(root, context);
  newLine();
  
  // 第三行
  push('}')
  return context.code
}

genNode(node, context){
   // 由于这个node是ast穿过来的，所以需要进行一层一层的拿
    return node.children[0].content
  }
```

处理str类型是不是感觉很简单呀！😉😉😉


## 处理插值
处理插值会生成的内容比较多，如：

```ts
// 输入： {{message}}
// 输出
import { toDisplayString : _toDisplayString } from "vue"
export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return _toDisplayString(_ctx.message)
}
```
### 分析

#### 问题
1. 解析插值，会发现上面会导入一个辅助函数，其他的都是一样的。

2. 这一次的renturn内容和解析文本的内容是不一样的，这是两种节点，在`genNode`当中需要用到节点的类型来进行判断。但是当前的`genNode`直接返回的是文本节点的内容,所以此处需要分节点的类型讨论。
并且根据单一职责的要求`genNode`当中的`node`不应该是一个跟节点，而应该是一个`ast的node节点`
3. `return`结果的函数名称和导入的内容是一样的
4. `_ctx.message`怎么来实现

#### 解决方案
- 问题一： 导入的内容，从模块分析的角度来说，这个任务需要在`transform`中完成.如果把当前节点需要导入的内容绑定在`ast`的当中，那么在`codegen`的时候就要可以直接拿到来遍历即可。但是如何在transform当中进行root绑定呢，在`transform`当中处理处理node的时候来进行判断，如果是插值节点则进行传教需要导入的模块

- 问题二： 在传入`genNode`的`node`参数需要进行调整，直接使用`root.children[0]`,或者说可以把`root.children[0]`这个节点在ast中作为属性，然后在`codegen`中直接使用

- 问题三： 在`import`导入的时候，全局定义一下变量，或者是直接在`return`中直接使用字面量

- 问题四： `_ctx.message`中的message是从node.content.content中来，但是`_ctx`可以在`ast`处理的transform中的插件来进行处理

### 测试用例
```ts
test('code gen interpolation  ---> {{message}}', () => {
    const ast = baseParse('{{message}}')
    // 处理插值的插件
    const transformInterpolation = (node)=>{
       if(node.type === '插值'){
          node.content.content = '_ctx.' + node.content.content
       }
    }
    transform(ast, {
      nodeTransforms: [transformInterpolation]
    })
    const codeObj = codegen(ast)
    expect(codeObj.code).toMatchSnapshot()
  })

```

### 编码

#### transform模块
```ts
// 遍历节点
function traverseNode(root, context){
  const children = root.children;
  
  // 处理插件
  const transforms = context.transforms
  for(let i = 0; i <transforms.length; i++){
  // 执行插件
    transforms[i]()
  }
 
 // 判断节点的类型
 switch(root.type){
     case '插值':
     // 添加import导入的函数
     root.helpers.push('toDisplayString')
     break;
 }
  // 处理子节点
  traverseChildrenNode(children, context)
}
```

#### codegen模块
```ts
// import 导入是在最前面，所以需要优先处理这个
export function generate(root){
  // 省略创建上下文
  const {push, newLine} = context;
  // 处理import导入
  genFunctionPreamble(context)
  // ……省略其他
  
  // 处理内容，这里需要传入节点来进行节点的生成
  genNode(root.children[0], context);
 
  return context.code
}

// 导入前缀
function genFunctionPreamble(context){
  const {push, newLine} = context
  const helpers = context.root.helpers;
  // 判断是否存在import导入，不存在的话不需要添加
  if(helpers.length){
     const strs = helpers.map(p = > `${p} : _${p}`).join(', ')
     push(`import { ${strs} } from vue`)
     newLine()
  }
}

genNode(node, context){
  const {push} = context
  // 修改node来处理对应的功能
  switch(node.type){
      case '文本':
         push(`${node.content}`);
      break;
      case '插值':
         push(`_toDisplayString(`)
         // 重新调用,则node.type为简单表达式
         genNode(node.content, context)
         push(`)`)
      break;
      case '简单表达式':
         push(`${node.content}`)
      break;   
  }
}
```

经过上面的编码，测试用例能满足要求了。这里来总结一下**插值生成的流程**：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d787b6811f74391940c0a5016fbd1e5~tplv-k3u1fbpfcp-watermark.image?)

## 解析element
`element`处理的结果如下：

```ts
输入： <div></div>
输出：
import { openBlock : _openBlock, createElementBlock : _createElementBlock } from "vue"
export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div"))
}
```

### 分析
通过生成的结果来看，elemetn生成的内容和插值生成的内容是相似的，都含有`import`导入和return 结果中有函数
#### 问题
1.  `openBlock`, `createElement`函数从哪里来
2.  `"div"`如何生成

#### 解决方案
- `openBlock`, `createElement` 可以在`transform`模块中判断是`elemnt`节点中，添加到root.helpers中
- `"div"`也可以使用`transform`中的插件来实现，你想到了吗？😉😉😉


### 编码
#### 插件 transformInterpolation(元素)
  ```ts
  const transformInterpolation = (node) => {
     if(node.type === 'element'){
        node.tag = `"${node.tag}"`
     }
  }
  ```
#### transform
```ts
function traverseNode(root, context){
// ……省略其他
 // 判断节点的类型
 switch(root.type){
     case '插值':
         // 添加import导入的函数
         root.helpers.push('toDisplayString')
     break;
     case '元素':
        root.helpers.push('openBlock','createElementBlock')
      break  
 }
  // 处理子节点
  traverseChildrenNode(children, context)
}
```

#### codegen
```ts
genNode(node, context){
  // 省略其他
      case '简单表达式':
         push(`${node.content}`)
      break;  
      case 'element':
          push(`(_openBlock(), _createElementBlock(`)
          // 处理中间的内容
          push(`${node.tag}`)
          push(`))`)
      break
  }
}
```

> 分析问题，有了想法，实现起来就是快！👍👍👍

## 解析element+text

在上面中解析了`text,element, 插值`,接下来的就是element与另外两种的结合。先来实现与text的结合，牛刀小试😀😀😀


```ts
输入：<div>hi twinkle</div>
输出：
const { openBlock: _openBlock, createElementBlock: _createElementBlock } = Vue
return function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", null, "hi twinkle"))
}
```

### 分析

是不是感觉`解析element+text`和`解析element`很相似哇！对的，就是循序渐进哦！

#### 问题
1. 如何获取`null`
2. 如何获取`"hi twinkle"`

#### 解决方案
- 问题一：`null`是值的`elemnt`的`props`,可以直接从参数node中获取
- 问题二： `"hi twinkle"`是解析`elment`里面的`children`,需要调用`genNode`方法来生成.主要更改的代码则是`codegen`模块的处理`element case`

### 编码
```ts
genNode(node, context){
const {tag, props, children} = node
  // 省略其他
      case '简单表达式':
         push(`${node.content}`)
      break;  
      case 'element':
          push(`(_openBlock(), _createElementBlock(`)
          if(children.length){
            push(`${tag}, ${props || null}, `)
            genNode(children, context)
           }else{
             // 处理中间的内容
            push(`${tag}`)
           }
          push(`))`)
      break
  }
}
```

完成了前面的，后面的改起来就简单多了！

> 由于篇幅的原因，对于解析其他的情况，感兴趣的可以看源码哦！

# 总结

本期主要实现了如何将`ast生成代码`,在生成代码的过程，需要使用`transform`来转换代码，**里面可以使用插件系统来对某个节点的个性化操作**。在`codegen`模块中，创建上下文，来逐步增加对于的字符串。
