import { NodeTypes } from "./ast"
import { CREATE_ELEMENT_BLOCK, helperNameMap, OPEN_BLOCK, TO_DISPLAY_STRING } from "./runtimeHelpers"

export function transform(root, options = {}) {
  // 创建当前transform的上下文
  const context = createTransformContext(root, options)
  // 树的深度优先遍历
  traverseNode(root, context)
  // 生成node
  createRootCodegen(context.root)

  root.helpers.push(...context.helpers.keys())
}
/**
 * 树的深度优先遍历
 * @param context 
 */
function traverseNode(node, context) {
  // 执行插件
  const { nodeTransforms } = context
  // 当执行退出的时候来执行插件
  const exitFn = []
  if (nodeTransforms && nodeTransforms.length > 0) {
    // 遍历nodeTransforms
    for (let j = 0; j < nodeTransforms.length; j++) {
      const nodeTransform = nodeTransforms[j]
      // 调用nodeTransform
     const fn = nodeTransform(node)
     if(fn){
        exitFn.push(fn)
     }
    }
  }

  const type = node.type
  switch (type) {
    case NodeTypes.INTERPOLATION:
      // 把import { toDisplayString } from "vue"放入
      context.helper(helperNameMap[TO_DISPLAY_STRING])
      break;
    case NodeTypes.ROOT:
      traverseChildren(node.children, context)
      break;
    case NodeTypes.ELEMENT:
      context.helper(helperNameMap[CREATE_ELEMENT_BLOCK])
      context.helper(helperNameMap[OPEN_BLOCK])
      traverseChildren(node.children, context)
      break;
    default:
  }
  // 执行收集的插件
  let i = exitFn.length
  while (i--) {
    exitFn[i]()
  }

}

function traverseChildren(children, context) {
  // 存在children,优先遍历
  if (children) {
    for (let i = 0; i < children.length; i++) {
      traverseNode(children[i], context)
    }
  }
}




/**
 * 创建transform的上下文
 * @param root 
 */
function createTransformContext(root: any, options) {
  root.helpers = []
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || [],
    helpers: new Map(),
    helper(key) {
      context.helpers.set(key, true)
    }
  }

  return context
}

/**
 * 创建节点生成
 * @param root 
 */
function createRootCodegen(root: any) {
  root.createCodegenNode = root.children[0]
}

