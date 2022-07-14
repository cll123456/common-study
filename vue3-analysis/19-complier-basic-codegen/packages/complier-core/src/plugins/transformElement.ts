import { NodeTypes } from "../ast"

export const transformElement = (node) => {
  return () => {
    if (node.type === NodeTypes.ELEMENT) {
      node.tag = `"${node.tag}"`
    }
  }
}
