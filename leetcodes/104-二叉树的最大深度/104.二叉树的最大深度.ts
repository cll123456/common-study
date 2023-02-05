/*
 * @lc app=leetcode.cn id=104 lang=typescript
 *
 * [104] 二叉树的最大深度
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

function maxDepth(root: TreeNode | null): number {
  if(!root) return 0
  let count = 0;
  // 采用树的广度优先搜索来做
  const searchTree = (treeList: Array<TreeNode | null>) => {
    if(!treeList.length) return;
    count ++;
    const arr:Array<TreeNode> = []
    for(let i = 0; i < treeList.length; i ++){
      if(treeList[i] && (treeList[i].left || treeList[i].right)){
        arr.push(treeList[i].left, treeList[i].right)
      }
    }
    searchTree(arr)
  }

  searchTree([root])
  return count
};
// @lc code=end

