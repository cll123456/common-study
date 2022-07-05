/**
  * 判断属性是否发生变化
  * @param n1 
  * @param n2 
  * @returns 
  */
export function shouldUpdateComponent(n1, n2) {
  // 判断props是否发生变化，变化了需要更新
  const { props: prevProps } = n1;
  const { props: nextProps } = n2;

  for (let key in nextProps) {
    if (nextProps[key] !== prevProps[key]) {
      return true
    }
  }
  return false
}
