import { isString } from "shared"
import { NodeTypes } from "./ast"
import { CREATE_ELEMENT_BLOCK, helperNameMap, OPEN_BLOCK, TO_DISPLAY_STRING } from "./runtimeHelpers"

export function codegen(root) {
  const context = createCodegenNode(root)
  const { push, newLine } = context
  // import { toDisplayString as _toDisplayString } from "vue"
  genFunctionPreamble(context)
  // 放入 export function 
  push('export function ')

  genFuncNameAndParams(context)
  newLine()
  // 放入 return和root的content
  push(`return `)
  genNode(root.createCodegenNode, context)
  newLine()
  push('}')
  return {
    code: context.code
  }
}
/**
 * 处理import导入的函数
 * @param context 
 */
function genFunctionPreamble(context) {
  const { push, newLine } = context
  const vueBinging = 'vue'
  const helperFuncs = context.root.helpers
  if (helperFuncs.length) {
    const helperFuncStr = helperFuncs.map(p => `${p} : _${p}`).join(', ')
    push(`import { ${helperFuncStr} } from "${vueBinging}"`)
    newLine()
  }
}

/**
 * 处理节点
 * @param root 
 * @param context 
 */
function genNode(node, context) {
  const type = node.type
  switch (type) {
    case NodeTypes.TEXT:
      genTextNode(node, context)
      break;
    case NodeTypes.INTERPOLATION:
      genInterpolation(node, context)
      break;
    case NodeTypes.SIMPLE_EXPRESSION:
      genExpression(node, context)
      break;
    case NodeTypes.ELEMENT:
      genElement(node, context)
      break
    case NodeTypes.COMPOUND_EXPRESSION:
      genCompoundExpression(node, context)
  }

}

/**
 * 创建上下文
 * @param root 
 * @returns 
 */
function createCodegenNode(root: any) {
  const context = {
    code: '',
    root: root,
    push(code: string) {
      context.code += code
    },
    newLine() {
      context.code += '\n'
    },
    helper(key) {
      return `_${helperNameMap[key]}`
    }
  }
  return context
}

/**
 * 生成函数名和参数
 * @param context 
 */
function genFuncNameAndParams(context: { code: string; root: any; push(code: string): void; newLine(): void }) {
  const { push } = context
  const paramArr = ['_ctx', '_cache']
  const paramStr = paramArr.join(', ')
  const functionName = 'render'
  push(`${functionName} (${paramStr}) {`)
}

function genTextNode(node, context: any) {
  const { push } = context
  push(`"${node.content}"`)
}

function genInterpolation(node: any, context: any) {
  const { push, helper } = context;
  const toDisplayStringName = helper(TO_DISPLAY_STRING)
  push(`${toDisplayStringName}(`)
  genNode(node.content, context)
  push(')')
}



function genExpression(node: any, context: any) {
  const { push } = context
  push(node.content)
}


function genElement(node, context) {
  const { push, helper } = context
  const { tag, props, children } = node
  const openBlockName = helper(OPEN_BLOCK)
  const createElementBlockName = helper(CREATE_ELEMENT_BLOCK)
  push(`(${openBlockName}(), ${createElementBlockName}(`)
  if (children.length) {
    const argsNode = genNullableArgs([tag, props, children])
    genNodeList(argsNode, context)
  } else {
    push(`${tag}`)
  }
  push(`))`)
}


function genNullableArgs(args) {
  let length = args.length
  // 找到局部为不为null，然后把不存在的直接变成null
  while (length--) {
    if (args[length] != null) break
  }

  return args.slice(0, length + 1).map(arg => arg || `null`)
}

function genNodeList(argsNode: any, context: any) {
  const { push } = context
  for (let i = 0; i < argsNode.length; i++) {
    const node = argsNode[i]
    if (isString(node)) {
      push(`${node}`)
    } else if (Array.isArray(node)) {
      genNodeList(node, context)
    } else {
      genNode(node, context)
    }

    // 加上， 
    if (i < argsNode.length - 1) {
      push(', ')
    }
  }
}

function genCompoundExpression(node: any, context: any) {
  const { push } = context
  const { children } = node
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (isString(child)) {
      push(child)
    } else {
      genNode(child, context)
    }
  }
}
