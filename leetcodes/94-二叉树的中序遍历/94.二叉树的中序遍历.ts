/*
 * @lc app=leetcode.cn id=94 lang=typescript
 *
 * [94] 二叉树的中序遍历
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

function inorderTraversal(root: TreeNode | null): number[] {
  if(!root) return []
  const res: number[] = []
  const _inorderTraversal = (root: TreeNode | null) => {
    if(!root) return
    _inorderTraversal(root.left)
    res.push(root.val)
    _inorderTraversal(root.right)
  }
  _inorderTraversal(root)
  return res
};
// @lc code=end

