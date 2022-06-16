/**
 * 组件类型枚举，运用位运算来表示组件类型，
 * & 用来判断是否包含某个类型
 * | 用来合并类型
 */
export const enum ShapeFlags {
  /**
   * 元素，最后需要渲染的组件 0001 1
   */
  ELEMENT = 1,
  /**
   * 状态组件 0010 2
   */
  STATE_COMPONENT = 1 << 1,
  /**
   * 文本children 0100 8
   */
  TEXT_CHILDREN = 1 << 2,
  /**
   * 子组件 array children 1000 16
   */
  ARRAY_CHILDREN = 1 << 3,
}
