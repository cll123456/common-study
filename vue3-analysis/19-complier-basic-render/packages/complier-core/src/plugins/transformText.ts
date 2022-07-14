import { NodeTypes } from "../ast"

export const transformText = (node) => {
  return () => {
    if (node.type === NodeTypes.ELEMENT) {
      const children = node.children
      let currentContainer
      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        if (isText(child)) {
          // 判断下一个节点是不是text
          for (let j = i + 1; j < children.length; j++) {
            const next = children[j]
            if (isText(next)) {
              if (!currentContainer) {
                currentContainer = children[i] = {
                  type: NodeTypes.COMPOUND_EXPRESSION,
                  children: [child]
                }
              }
              // 放入 +  放入next
              currentContainer.children.push(' + ', next);
  
              // 删除当前节点j
              children.splice(j, 1)
              j--
  
            } else {
              currentContainer = undefined
              break;
            }
          }
        }
      }
    }
  }
}



function isText(node) {
  return node.type === NodeTypes.TEXT || node.type === NodeTypes.INTERPOLATION
}
