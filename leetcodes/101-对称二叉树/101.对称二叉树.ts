/*
 * @lc app=leetcode.cn id=101 lang=typescript
 *
 * [101] 对称二叉树
 */

// @lc code=start
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

function isSymmetric(root: TreeNode | null): boolean {
  // if (!root) return true;
  //   const isMirror = (l, r) => {
  //       if (l == null && r == null) {
  //           return true;
  //       }
  //       if (l == null || r == null) {
  //           return false;
  //       }
  //       if (l.val !== r.val) {
  //           return false;
  //       }
  //       return isMirror(l.left, r.right) && isMirror(l.right, r.left)
  //   }
  //   return isMirror(root.left, root.right);

  const isMirror = (l, r) => {
    const queue = [l, r];
    while (queue.length) {
        const u = queue.shift();
        const v = queue.shift();
        if (!u && !v) continue;
        if ((!u || !v) || (u.val !== v.val)) return false;
        queue.push(u.left, v.right);
        queue.push(v.left, u.right);
    }
    return true;
}
return isMirror(root.left, root.right)
};
// @lc code=end

