import { NodeTypes } from "./ast";

/**
 * 插值左边
 */
const START_INTERPOLATION = "{{"
/**
 * 插值右边
 */
const END_INTERPOLATION = "}}"

/**
 * 基础解析
 * @param content 
 * @returns 
 */
export function baseParse(content) {
  // 构建上下文
  const context = createParserContext(content);
  // 创建跟节点
  const children = parseChildren(context, [])
  return createRoot(children)

}

/**
 * 创建上下文
 * @param content 
 * @returns 
 */
function createParserContext(content: any) {
  return {
    source: content
  }
}

function createRoot(children) {
  return {
    type: NodeTypes.ROOT,
    children
  }
}

/**
 * 解析children
 * @param context 
 * @returns 
 */
function parseChildren(context: { source: any; }, ancestors) {
  let nodes = [];
  while (!isEnd(context, ancestors)) {
    let node;
    const s = context.source
    if (s.startsWith(START_INTERPOLATION) || s.startsWith(END_INTERPOLATION)) {
      node = parseInterpolation(context)
    } else if (s.startsWith('<')) {
      if ((/<[a-z]*>/i).test(s)) {
        // 检验是否是<div>开头的，如果是，则解析elemtent
        node = parseElement(context, ancestors)
      } else if (s[1] === '/') {
        // 如果是</div>，说明没有开始标签
        const endIndex = s.indexOf('>')
        const tag = s.slice(2, endIndex)
        throw new Error(`${tag}缺少开始标签`)
      }
    } else {
      // 解析文本
      node = parseText(context)
    }

    if (node) {
      nodes.push(node)
    }
  }
  return nodes
}



/**
 * 解析插值
 * @param context 
 * @returns 
 */
function parseInterpolation(context: { source: any; }) {
  // {{message}} 获取里面的message
  if (!context.source.startsWith(START_INTERPOLATION)) {
    throw new Error('没有找到插值的开始标签{{')
  }
  // 先删除 {{
  advanceBy(context, START_INTERPOLATION.length)
  // 找到 }}的位置
  // 看看里面是否存在{{mess{{age}}
  const leftInterpolationIndex = context.source.indexOf(START_INTERPOLATION)
  const end = context.source.indexOf(END_INTERPOLATION)
  if ((leftInterpolationIndex > 0 && leftInterpolationIndex < end) || end === -1) {
    throw new Error('没有找到插值的结束标签}}')
  }
  // 获取里面的内容
  const rowContent = context.source.slice(0, end)
  const content = rowContent.trim()
  // 删除}}
  advanceBy(context, end + END_INTERPOLATION.length)
  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: content
    },
  }
}

/**
 * 推进
 * @param context 
 * @param length 
 */
function advanceBy(context: { source: any; }, length) {
  context.source = context.source.slice(length)
}

function parseElement(context: { source: any; }, ancestors): any {

  // <div></div>
  // 拿到tag
  const element = parseTag(context)
  ancestors.push(element.tag)
  const children = parseChildren(context, ancestors)
  // 判断是否存在闭合标签
  if (startsWithEndTagOpen(context.source, element.tag)) {
    // 删除闭合标签
    parseTag(context)
    // 闭合标签删除了，去掉ancestors数组的最后一个元素
    ancestors.pop()
  } else {
    throw new Error(`${element.tag}缺少关闭标签`)
  }
  // 赋值children
  element.children = children
  return element
}


function parseTag(context) {
  // <div></div>
  // 拿到tag
  const match = /<\/?([a-z]*)>/i.exec(context.source)
  if (match && match.length > 1) {
    const tag = match[1]
    // 删除<div>
    advanceBy(context, match[0].length)

    return {
      type: NodeTypes.ELEMENT,
      tag,
      children: []
    }
  }

}

function parseText(context: { source: any; }): any {
  const s = context.source
  const sTrim = s.trim()
  let index = sTrim.length
  // 分隔符数组
  const separators = [START_INTERPOLATION, END_INTERPOLATION, '<',];
  // 遍历分隔符数组
  for (let i = 0; i < separators.length; i++) {
    const separator = separators[i]
    const indexOf = s.indexOf(separator)
    // 判断里面是否包含特殊符号，获取最近的分隔符
    if (indexOf > -1 && indexOf < index) {
      index = indexOf
    }
  }
  const content = sTrim.slice(0, index)
  advanceBy(context, index)
  return {
    type: NodeTypes.TEXT,
    content: content,
  }
}


function isEnd(context, ancestors) {
  const s = context.source
  // 1. 判断是否是结束标签
  if (s.startsWith('</')) {
    for (let i = ancestors.length - 1; i >= 0; i--) {
      const tag = ancestors[i]
      // 如果是和tag一样，则是结束标签
      if (startsWithEndTagOpen(s, tag)) {
        return true
      }
    }
  }
  // 2. contex.source的长度为0
  return !s.length
}

function startsWithEndTagOpen(source: string, tag: string) {
  // 1. 头部 是不是以  </ 开头的
  // 2. 看看是不是和 tag 一样
  return (
    source.startsWith("</") &&
    source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase()
  );
}
