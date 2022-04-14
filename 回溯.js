/**
 * 77. 给定两个整数 n 和 k，返回 1 ... n 中所有可能的 k 个数的组合。
 * 示例:
 * 输入: n = 4, k = 2 输出:
 * [
 *  [2,4], [3,4], [2,3], [1,2], [1,3], [1,4],
 * ]
 */
/**
 * 
 * @思路
 * 给定 n 和 k，遍历出所有满足 n 以内的 k 个数的组合。因为 k 的数目不确定长度，所以不适合 for 循环嵌套。所以使用递归操作。
 * 先找到 1 个数的所有组合，然后递归调用自身，递归一次，给每个 1 个数的组合加 1 个递归调用到的数，构成组合。
 * 深度优先遍历：
 *  1. 首先指定第一层的起点，由题意决定是[1, n]，所以起点是 1 开始循环，直到 n，作为横向遍历（广度遍历）的开始；
 *  2. 从[1, n]的每一个值作为起点，递归进入 [1,2], [1,3] 逐层深入递归，直到到达节点最后一层，即 k 为止，停止递归，将单次递归结果
 *     放入结果中。
 *  3. 单次结果这里利用了队列，从题目结果中可以看出，要求的结果是二维数组（队列），所以要考虑到单次结果队列存在入队和出队的情况。每次
 *     循环完一轮后，需要将单次结果队列清理一遍，以保证不会污染最终结果。
 *  4. 递归结束后，返回结果。
 */
function combine(n, k) {
    if (k <= 0) {
        return [n];
    }
    const res = []; // 存放所有结果
    const path = []; // 存放单次结果
    const bt = (start, n, k) => {
        if (path.length === k) {
            res.push(path.slice());
            return;
        }
        for (let i = start; i <= n; i++) {
            path.push(i);
            bt(i + 1, n, k);
            path.pop();
        }
    }
    bt(1, n, k);
    return res;
}
/**
 * @剪枝优化
 * 从一个实例出发。如: n = 4, k = 4;
 * 表现上来看，从 4 个数字中取出 4 个组合成一个集合，那么值可以有一种取法，就是全拿出来，也就是：[1,2,3,4]。
 * 所以对递归方法内的循环展开讨论：
 * 1. 当 start = 1 时，后续的 i <= n(4) 可以满足要求长度为 k（4）的结果，[1,2,3,4];
 * 2. 当 start = 2 时，从 2 开始进入递归，那么结果无论如何只能是 3 位的数组，即 [2,3,4]，是不满足题目要求的数组；
 * 3. 当 start = 3 时，从 3 开始进入递归，结果是 [3,4];
 * 同理，对于开始位置 start，如果剩余的数字长度不满足结果要求（4） 时，那么继续循环下去已经没有意义了。
 * 上述理论推 start 的限制：
 * 1. 对于 start 来说，已经被选中了的数为 path.length;
 * 2. 还需要选择的数为：k - path.length;
 * 3. 在 n 的范围内，start 的取值范围需要在 n - (k - path.length) + 1，也就是 start 要小于 n - (k - path.length) + 1;
 * 4. 只有在这个范围内的深度探索，才是有效的。
 */
function combine2(n, k) {
    if (k <= 0) return [];
    const res = []; // 存放全局结果
    const path = []; // 存放当前深度查询的结果
    const bt = (start, n, k) => {
        if (path.length === k) {
            res.push(path.slice());
            return;
        }
        for (let i = start; i < n - (k - path.length) + 1; i++) {
            path.push(i);
            bt(i + 1, n, k);
            path.pop();
        }
    }
    bt(1, n, k);
    return res;
}

/**
 * 216. 组合总数 III
 * 找出所有相加之和为 n 的 k 个数的组合。组合中只允许包含 1-9 的正整数，并且每种组合中不存在重复的数字。
 * @思路
 * 组合中只允许包含 1-9 的正整数，也就是原始集合中只包含 1-9，可以重复从 1-9 中拿数字出来，放入结果集中。
 * k 个数的组合，表示子集合中只有 k 个数。与第 77 题中，[1, n] 的集合中获取所有 k 个数的组合类似。
 * 那么 k 可以当做是集合的深度，也就是需要递归 k 层。1-9 可以认为是集合的广度（宽度），这个宽度需要一个 for 循环
 * 来横向遍历。单次拿出一个 i，从 i 出发，深入到第 k 层进行递归。
 */
function combinationSum3(n, k) {
    // 确定要用到的空间
    const result = []; // 存储最终结果
    const path = []; // 存储当前路径下的结果
    // n 是广度，k 是深度，sum 是当前路径下累加的和，需要判断累加的 sum 是否与目标值（n） 相等
    const bt = (start, n, k, sum) => {
        // 深度已经到最后一层了，需要出结果了。
        if (path.length === k) {
            // sum 累加到目标值时，推入结果
            if (sum === n) {
                result.push(path);
            }
            // 不符合结果直接返回，没有操作
            return;
        }
        for (let i = 1; i <= 9; i++) {
            path.push(i);
            sum += i;
            bt(i + 1, n, k);
            // 这一步才叫回溯哦，当前层操作完后，需要把痕迹清理掉
            path.pop(i);
            sum -= i;
        }
    }
    // 开始造孽
    bt(1, n, k, 0);
    return result;
}

/**
 * 105. 从二叉树的前序遍历结果和中序遍历结果重建二叉树。
 * 给定两个整数数组 preorder 和 inorder ，其中 preorder 是二叉树的先序遍历， inorder 是同一棵树的中序遍历，请构造二叉树并返回其根节点。
 * 
 *     3
    /    \
   9      20
         /  \
        15   7
 * 
 * 输入: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
 * 输出: [3,9,20,null,null,15,7]
 * 已经给出了前序遍历的结果，对应前序遍历的特点，前序遍历结果的第一项肯定是根节点root。在中序遍历中，可以根据 root 的位置将中序结果分割为[[左子树中序遍历结果], root, [右子树中序遍历结果]]。
 * 进而同样可以根据前序遍历结果和左子树长度、右子树长度定位到前序遍历结果中的[root, [左子树前序遍历结果], [右子树前序遍历结果]]。由这两个结果可以递归的构建出左子树和右子树，最终将根节点拼入
 * 即可还原出原二叉树。
 * 这里涉及到要用递归来构建原始二叉树。
**/

// 节点定义.
class TreeNode {
    constructor(val, left, right) {
        this.val = val;
        this.left = left === undefined ? null : left;
        this.right = right === undefined ? null : right;
    }
}

function buildTree(preOrder, inOrder) {
    let inOrderIndexMap = {};
    inOrder.forEach((v, k) => {
        inOrderIndexMap[v] = k;
    });
    // 需要递归构建子树, 参数：前序遍历结果，中序遍历结果，子树前序左边界，子树前序有边界，子树中序左边界，子树中序有边界
    const buildSubTree = (preOrder, inOrder, preOrderLeft, preOrderRight, inOrderLeft, inOrderRight) => {
        // 边界条件，依赖于前序循环结果找到左子树开始位置和结束位置，也就是 preOrderLeft 会逐渐右移, 所以当 起点大于了终点，表示节点为空了
        if (preOrderLeft > preOrderRight) {
            return null;
        }
        // 先获取子树根节点在前序循环中的位置，默认就是前序结果的第一个
        const preOrderRootIndex = preOrderLeft;
        // 获取根节点在中序循环中的位置
        const inOrderRootIndex = inOrderIndexMap[preOrder[preOrderRootIndex]];
        // 获取左子树的长度
        const leftSubTreeSize = inOrderRootIndex - inOrderLeft;
        // 创建根节点
        const root = new TreeNode(preOrder[preOrderRootIndex]);
        // 构建左子树。参数计算说明：
        // preOrder: 前序结果，inOrder: 中序结果；
        // preOrderLeft + 1: 根节点在前序节点中的位置右移一位; preOrderLeft + leftSubTreeSize: 前序结果中左子树的有边界（起点 + 长度）; 
        // inOrderLeft: 中序结果中左子树的起点; inOrderRootIndex - 1: 中序结果左子树有边界（根节点的前一位）；
        const leftSubTree = buildSubTree(preOrder, inOrder, preOrderLeft + 1, preOrderLeft + leftSubTreeSize, inOrderLeft, inOrderRootIndex - 1);
        // 构建右子树。参数计算说明：
        // preOrder: 前序结果，inOrder: 中序结果；
        // preOrderLeft + leftSubTreeSize + 1: 右子树左边界起点，根节点位置 + 左子树长度 + 1，由公式 [根, 左子树, 右子树] 得来;
        // preOrderRight: 右子树终点位置，这里为传入值，即结尾;
        // inOrderRootIndex + 1: 中序右子树起点位置，从 [左子树, 根, 右子树] 得来；
        // 
        const rightSubTree = buildSubTree(preOrder, inOrder, preOrderLeft + leftSubTreeSize + 1, preOrderRight, inOrderRootIndex + 1, inOrderRight);
        // 合并左子树、右子树
        root.left = leftSubTree;
        root.right = rightSubTree;
        // 返回根节点（子树或者完整树）
        return root;
    };
    // 不论前序还是中序，二叉树的总节点个数是一样的，取谁都行
    const size = preOrder.length;
    // 把当前数当成一个子树开始构建：
    // 参数：前序结果，后序结果，前序起点，前序终点，中序起点，中序终点
    return buildSubTree(preOrder, inOrder, 0, size - 1, 0, size - 1);
}

/**
 * 106. 根据给定中序遍历结果和后序遍历结果，重建原二叉树。
 * 给定两个整数数组 inorder 和 postorder ，其中 inorder 是二叉树的中序遍历， postorder 是同一棵树的后序遍历，请你构造并返回这颗 二叉树.
 * 输入：inorder = [9,3,15,20,7], postorder = [9,15,7,20,3]
 * 输出：[3,9,20,null,null,15,7]
 */
/**
 * @思路
 * 对于二叉树遍历，分前序遍历、中序遍历、后序遍历三种形式。
 * 前序遍历顺序为：根节点 - 左子树 - 右子树，
 * 中序遍历顺序为：左子树 - 根节点 - 右子树，
 * 后序遍历顺序为：左子树 - 右子树 - 根节点，
 * 所以可以套第 105 题的解题思路。从后序遍历中后去根节点的位置，再映射到中序遍历结果中。从中序遍历结果中获得根节点位置，进而可以求得左子树长度
 * 和右子树长度，进而递归重建出原二叉树。
 */
function buildTree(inOrder, postOrder) {
    if (!inOrder || !postOrder || !inOrder.length || !postOrder.length) {
        return null;
    }
    const inOrderVal2IndexMap = new Map();
    const size = postOrder.length;
    // 创建一个中序遍历结果 v 到 k 的映射 map。map 的 key 是节点值，value 是节点所在中序结果的位置。
    inOrder.forEach((v, k) => {
        inOrderVal2IndexMap.set(v, k);
    });
    // 参数：中序结果，后序结果，中序子树左边界，中序子树有边界，后序子树左边界，后序子树右边界
    const buildSubTree = (inOrder, postOrder, inOrderLeft, inOrderRight, postOrderLeft, postOrderRight) => {
        if (postOrderLeft > postOrderRight) {
            return null;
        }
        // 先找到根节点位置，在后序结果的最后一位上：[左子树，右子树，根节点]
        const rootIndex = postOrderRight;
        // 获取中序结果中根节点所在位置，从而可以推出左子树的边界
        const inOrderRootIndex = inOrderVal2IndexMap.get(postOrder[rootIndex]);
        // 获取左子树的长度：中序结果根节点的位置减左边界 [左子树，根节点，右子树]
        const leftSubTreeSize = inOrderRootIndex - inOrderLeft;
        // 创建根节点并关联左子树右子树
        const root = new TreeNode(postOrder[rootIndex]);
        // 关联左子树，需要找到左子树在中序、后序节点中的左右边界
        root.left = buildSubTree(inOrder, postOrder, inOrderLeft, inOrderRootIndex - 1, postOrderLeft, postOrderLeft + leftSubTreeSize);
        root.right = buildSubTree(inOrder, postOrder, inOrderRootIndex + 1, postOrderLeft + subTreeSize + 1, postOrderRight);
        return root;
    }
    return buildSubTree(inOrder, postOrder, 0, size - 1, 0, size - 1);
}
