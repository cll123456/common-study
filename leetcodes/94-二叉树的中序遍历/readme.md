# 94.二叉树的中序遍历

## 题目描述

给定一个二叉树的根节点 root ，返回 它的 中序 遍历 。

示例 1：

```ts
输入：root = [1,null,2,3]
输出：[1,3,2]
```


示例 2：

```ts
输入：root = []
输出：[]
```

示例 3：

```ts
输入：root = [1]
输出：[1]
```

## 解题思路

看到这个二叉树的中序遍历，一看就可以使用递归的方式。递归很简单，

```ts
function inorderTraversal(root){
    if(root.left) inorderTraversal(root.left);
    console.log('中序遍历'， root.value)
    if(root.right) inorderTraversal(root.right)
}
```



## 解题



```ts

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
```



但是递归是会有会损耗性能哦。有没有不需要递归的方式呢？当然有，来看看迭代