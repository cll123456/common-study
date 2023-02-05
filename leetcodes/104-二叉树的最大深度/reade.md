# 104. 二叉树的最大深度



## 题目描述

给定一个二叉树，找出其最大深度。

二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。

**说明:** 叶子节点是指没有子节点的节点。

**示例：**
给定二叉树 `[3,9,20,null,null,15,7]`，

```
    3
   / \
  9  20
    /  \
   15   7
```

返回它的最大深度 3 。



## 解析

本题的要求是求解二叉树的最大深度，这个问题一看就是一颗二叉树的**广度优先遍历**的问题



## 编码(递归)

```ts
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


```

![image-20220902093846743](assets/image-20220902093846743.png)

## 拓展

用了递归，那能不能用迭代来做呢？当然可以的哦！



## 迭代解法

```ts
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
  let arr = [root];
  while(arr.length){
      const temp = []
      count ++;
      arr.forEach(a => {
          if(a && (a.left || a.right)){
              temp.push(a.left, a.right)
          }
      })
      arr = temp;
  }
  return count
};
// @lc code=end
```

![image-20220902094531536](assets/image-20220902094531536.png)