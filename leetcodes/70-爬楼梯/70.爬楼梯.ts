/*
 * @lc app=leetcode.cn id=70 lang=typescript
 *
 * [70] 爬楼梯
 */

// @lc code=start
function climbStairs(n: number): number {
  // n =1 1
  // n =2 2
  // n =3 3
  // n =4 5
  if(n === 1 || n === 2) {
    return n;
  }
  let pre = 1;
  let next = 2;
  let cur = 3;
  for(let i = 2; i < n; i ++){
    cur = pre + next;
    pre = next;
    next = cur;
  }
  return cur
};
// @lc code=end

