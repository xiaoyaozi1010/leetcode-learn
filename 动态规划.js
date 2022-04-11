// 上次记录的不小心丢了，重新记录一份吧。
/**
 * 动态规划五部曲
 * 1. 确定dp数组(dp table)以及下标的含义 
 * 2. 确定递推公式
 * 3. dp数组如何初始化
 * 4. 确定遍历顺序
 * 5. 举例推导dp数组
 */

/**
 * 509. @斐波那契数列
 * 斐波那契数列是指，第1项是0，第二项是1，此后，后面的每一项都是前面两项的和，使用动态规划在O(n) 内可解决。
 */
function fib (n) {
    // 1. 状态定义，确定数组含义, dp[i] 表示到第 i 项的值；
    const dp = []; 
    // 2. 状态转移方程，确定地推公式。根据定义可知，dp[i] = dp[i - 1] + dp[i - 2];
    // 3. 初始化状态，根据定义可知，dp[0] = 0, dp[1] = 1; dp[2] = dp[1] + dp[0]; 前两项的和
    dp.push(0, 1);
    // 4. 确定遍历顺序，从第几位开始遍历，或者从哪个方向开始遍历。
    // for (let i = 2; i <= n; i++) {
    //     dp[i] = dp[i - 1] + dp[i - 2];
    // }
    // return dp[n];
    // 从数组dp上看，dp其实只使用了dp[i - 1] 和 dp[i - 2] 这两项，对于其他的项，用过一次之后就没再使用，占用了无意义的空间。
    // 所以可以将空间占用固定到常量，不需要根据n的值而变化
    let res = 0;
    for (let i = 2; i <= n; i++) {
        res = dp[0] + dp[1]
        dp[0] = dp[1];
        dp[1] = res;
    }
    return res;
}

/**
 * 70. @爬楼梯
 * 假设正在爬楼梯，要爬n个楼梯才会到达楼顶。每次可以爬 1 个或者 2 个台阶，在一个具有 n 个台阶的楼梯，有多少种方法才能爬到楼顶
 * 输入：2
 * 输出：2
 * 解释：有两种方法爬到楼顶
 *  1. 1 阶 + 1 阶
 *  2. 2 阶
 * 输入：3
 * 输出：3
 * 解释：有三种方法爬到楼顶
 *  1. 1阶 + 1阶 + 1阶
 *  2. 1阶 + 2阶
 *  3. 2阶 + 1阶
 * @思路
 * 到达第 i 个台阶有两种方式，从 i - 1 个台阶，爬 1 个台阶，和从 i - 2 个太接爬 2个台阶到达。所以决定爬到第 i 个台阶的方法数由到达前
 * 2 个台阶的的方法数决定，即 dp[i] = dp[i - 1] + dp[i - 2];
 */
function climbStairs(n) {
    if (n < 2) return n;
    // 1. 定义状态，确定dp含义，设定 dp[i] 表示到达第 i 个台阶的方法数
    const dp = [];
    // 2. 状态转移方程，推导递推方程，dp[i] = dp[i - 1] + dp[i - 2]
    // 3. 状态初始化，确定数组的初始化数据。到达第1个台阶有1种方法，到达第2个台阶有2种方法
    dp.push(1, 2);
    // 4. 确定遍历顺序
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n - 1];
    // 5. 验证方程
    // 1, 2, 3
}

/**
 * 746. @使用最小花费爬楼梯
 * 给你一个整数数组 cost ，其中 cost[i] 是从楼梯第 i 个台阶向上爬需要支付的费用。一旦你支付此费用，即可选择向上爬一个或者两个台阶。
 * 你可以选择从下标为 0 或下标为 1 的台阶开始爬楼梯。
 * 请你计算并返回达到楼梯顶部的最低花费。
 * 输入:cost = [10, 15, 20]
 * 输出:15
 * 解释:最低花费是从 cost[1] 开始，然后走两步即可到阶梯顶，一共花费 15 。
 * 
 * @思路
 * 同爬楼梯问题，需要知道到达第 i 个台阶的方法可以从第 i - 1 和第 i - 2 个台阶到达。从描述可以知道，到达顶部时，是不需要花费的，也就是
 * 说cost[cost.length - 1]的花费是0。
 * 到达第 i 个台阶的最小花费，取决于到达第 i - 1 和第 i - 2 个台阶的最小值，如果i不是最后一个的话，那么还要最小值还要加上第i个台阶的花费
 * 也可以认为是，从第i个出发，必须要交第i个的花费。所以递推公式应该是 dp[i] = dp[i] = Math.min(dp[i - 1], dp[i - 2]) + cost[i]
 * 最终，只需要到大第 cost.length - 1 个或第 cost.length - 2 个台阶即可，因为下一步就是楼顶了，不需要花费了。
 */
function minCostClimbingStairs(cost) {
    // 1. 定义状态，确定dp数组的含义，dp[i] 表示到达第 i 个台阶时的花费;
    const dp = [];
    const length = cost.length;
    // 2. 状态转移方程，确定地推公式，
    // 3. 状态初始化。从题目描述中，第1个台阶的费用是必须交的，不管从到哪里，dp[0] = cost[0]，第2个台阶的费用是dp[1] = cost[1];
    dp.push(cost[0], cost[1]);
    // 4. 确定遍历顺序
    for (let i = 2; i <= length; i++) {
        dp[i] = Math.min(dp[i - 1], dp[i - 2]) + cost[i];
    }
    return Math.min(dp[length - 1], dp[length - 2]);
}

/**
 * 路径问题。
 * 深搜、图论方法不讨论。
 */
/**
 * 62. @不同路径
 * 一个机器人位于一个 m x n 网格的左上⻆ (起始点在下图中标记为 “Start” )。
 * 机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下⻆(在下图中标记为 “Finish” )。
 * 总共有多少种路径可以走？
 * @思路
 * 矩形网格中任意一点 [i][j] 的到达方式有两种（题目中给定机器人只能向下和向右走，所以不存在绕路这种方式），从 i 的上方和左方到达。所以到达第
 * [i][j] 格的路径，取决于到达第 [i-1][j] 和 第 [i][j-1]格的路径。
 * 初始化问题：需要考虑在矩形边界除的点到达方式，如果[i][j]点在顶部，即i = 0，到达 [i][j] 只有一种方式，横着过去，如果 [i][j] 点在左侧，即
 * j = 0, 到达 [i][j] 也只要一种方式，竖着向下过去。
 * 循环方向问题：只需要考虑从左上角到目标点的路径，所以从小到大遍历即可，需要注意的事，从1开始循环，因为初始化时候已经将左上角点置为1了（一种
 * 方式）。
 */
function uniquePaths(m, n) {
    // 1. 定义状态，初始化dp数组。dp为二维数组，代表第i行第j列的格
    // 2. 状态转移方程。dp[i] = dp[i - 1][j] + dp[i][j - 1];
    // 3. 状态初始化，dp[0][j] = 1; dp[i][0] = 1;
    // 4. 确定遍历顺序, i、j分别从1开始遍历;
    const dp = new Array(m).fill(0).map(_ => new Array(n).fill(0));
    for (let i = 0; i < m; i++) {
        dp[i][0] = 1; // 顶部设置为1
    }
    for (let j = 0; j < n; j++) {
        dp[0][j] = 1; // 左边设置为1
    }
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }
    return dp[m - 1][n - 1];
}

/**
 * 63. @不同路径II
 * 一个机器人位于一个 m x n 网格的左上⻆ (起始点在下图中标记为“Start” )。
 * 机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下⻆(在下图中标记为“Finish”)。
 * 现在考虑网格中有障碍物。那么从左上⻆到右下⻆将会有多少条不同的路径? 网格中的障碍物和空位置分别用 1 和 0 来表示。
 * 输入:obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]
 * 输出:2
 * 3x3 网格的正中间有一个障碍物。 从左上⻆到右下⻆一共有 2 条不同的路径:
 *  1. 向右->向右->向下->向下
 *  2. 向下->向下->向右->向右
 * @思路
 * 根据62. 不同路径中的思路，对于设有障碍的方格，排除其走法即可。
 * 初始化问题：初始化时候需要注意，如果顶部和左部有障碍，那么到达障碍时，就不能往下走了。
 */
function uniquePathsWithObstacles(grids) {
    if (grids.length < 2) return 1;
    const m = grids.length;
    const n = grids[0].length;
    // 1. 定义状态，确定dp数组含义，dp[i][j] 表示达到[i][j]时的路径数
    const dp = new Array(m).fill(0).map(_ => new Array(n).fill(0));
    // 2. 确定状态转移方程，递推公式，与62相同，dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    // 3. 状态初始化, 需要注意顶部和左边的边界判断，有障碍不能设置为1
    for (let i = 0; i < m; i++) {
        if (grids[i][0] === 1) break;
        dp[i][0] = 1;
    }
    for (let j = 0; j < n; j++) {
        if (grids[0][j] === 1) break;
        dp[0][j] = 1;
    }
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (grids[i][j] === 1) continue;
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }
    return dp[m - 1][n - 1];
}

/**
 * 343. @正整数拆分
 * 给定一个正整数 n ，将其拆分为 k 个 正整数 的和（ k >= 2 ），并使这些整数的乘积最大化。
 * 返回 你可以获得的最大乘积。
 * 输入: n = 2
 * 输出：1
 * 解释：2 = 1 + 1, 1 × 1 = 1。
 * 输入：10
 * 输出：36
 * 解释：10 = 3 + 3 + 4, 3 × 3 × 4 = 36。
 * @思路
 * 给定一个正整数，不知道怎么拆，是拆成 2 个，还是 x(x > 2) 个？可以假设，分两步来分析：
 *  - 将数字 n 先拆成两个，第一个是 k(k取值不确定，需要从1开始遍历)，剩余的数字是 n - k。对于乘积来说，p = k * (n - k)；
 *  - 第二个数字 n - k 是否继续拆分？如果继续拆分的话，那么我们需要提前知道 n - k 这个数字拆分后的积，
 *  - 所以 n 的取值是，Math.max(k * (n - k), k * dp[n - k])
 * 所以满足动态规划的条件。
 */
function integerBreak(n) {
    // 1. 定义状态，定义动态规划数字 dp[i] 的含义。dp[i] 标识将 n 拆 i (成至少 2) 个整数的和后，他们的乘积。
    const dp = [0, 0, 1]; // 初始化
    // 2. 确定状态转移方程，根据思路中的结论，dp[i] = Math.max(j * (i - j), j * dp[i - j]);
    // 3. 状态初始化。0 和 1 都是不可再次拆分的整数，其中 0 不是正整数，所以初始化有 dp[0] = dp[1] = 0;
    // dp[2] = 1;
    // 4. 确定遍历顺序。由于涉及到 dp[i - j]，且 i, j 都是正整数，所以 i - j 小于 i，所以从小向大遍历。
    for (let i = 3; i <= n; i++) {
        // 当前这轮最大的
        let curMax = 0;
        for (let j = 1; j < i; j++) {
            curMax = Math.max(curMax, Math.max(j * (i - j), j * dp[i - j]));
        }
        dp[i] = curMax;
    }
    return dp[n];
}

/**
 * @背包问题：01背包
 * 所谓的 01 背包，就是给定的物品只有 1 个，只能选择或者不选择，即选择 0 个还是 1 个，所以称为 01背包。
*/
/**
 * 经典01背包。给定一个二维数组 nums，数组元素第一项代表物品重量，第二项代表物品价值，求，给定容量为 k 的背包，
 * 最大可以装价值多少的物品，返回总价值数。
 */
/**
 * @思路
 * 1. 暴力破解，回溯算法。不会
 * 2. 动态规划。
 *  - 1. 定义状态，定义dp数组含义。定义dp为二维数组 dp[i][j]，表示第 i 个物品放进背包容量为 j 的背包内时，背包的价值。
 *  - 2. 确定状态转移方程，从上面的状态定义中推论。对于第 i 个要放入容量为 j 的背包来说，可以选择放入 i 或者不放入 i，取放入 i 与不放入 i 的价值最大的即可。
 *      1> 如果不放 i，那么dp[i][j] = dp[i - 1][j];
 *      2> 同样是不放入 i，此时背包价值为：dp[i - 1][j - weight[i]]，那么放入 i 时，背包价值就是 dp[i - 1][j - weight[i]] + values[i];
 *  - 3. 初始化状态，从状态定义和转移方程可知，i 为 0 时，所有容量的背包价值是 values[0]; 背包容量 j 为 0 时，每个 i 都不能放入。
 *      所以初始化分两种
 *  - 4. 循环顺序，表面上无法看出是先循环物品还是先循环背包容量。先写着，让子弹飞一会儿。
 */
function knapsackProblem(nums, k) {
    // 条件判断
    if (!nums || !nums.length || !k) return 0;
    // 拆值
    const weights = nums.map(g => g[0]);
    const values = nums.map(g => g[1]);
    const length = nums.length;
    // 定义数组函数
    const dp = new Array(nums.length).fill(0).map(_ => new Array(k).fill(0));
    // 初始化dp时填充了0，所以下面的可以不用初始化
    // for (let i = 0; i < length; i++) {
    //     dp[i][0] = 0;
    // }

    for (let j = weights[0]; j < k; j++) {
        dp[0][j] = values[0];
    }
    // 不知道该先循环谁，那就随便来个看看，物品从1开始循环，为0的话，在前面已经初始化过了，没必要循环0.
    for (let i = 1; i < nums.length; i++) {
        for (let j = 0; j <= k; j++) {
            // 条件是背包容量小于了物品重量，所以只能选择不放。
            if (j < weights[i]) {
                dp[i][j] = dp[i - 1][j];
            } else {
                // 否则可以放入，那么就要选择不放入和放入两种情况中的最大值。
                dp[i][j] = Math.max(dp[i - 1][j], dp[i - 1][j - weight[i]] + values[i])
            }
        }
    }
    return dp[length - 1][k]
}
/**
 * @背包问题循环空间优化1
 * 从递推方程上看，dp[i][j] = Math.max(dp[i - 1][j], dp[i - 1][j - weight[i]] + values[i])
 * dp[i][j] 取值只与 dp[i-1][j] 和 weight[i]、values[i] 有关系，那么进一步看，i 只与 i - 1 有关（j 和 j 有关是必然的，不需要考虑）。
 * 也就是说，对于二维数组 dp[i][j] 的第 i 行只与第 i - 1 行有关，那么对于第 i - 1 行之前的空间占用，属于浪费，可以被优化掉。优化方法是
 * 设置 dp 只是一个两行的二维数组，即只有 dp[0] 和 dp[1] 这两行。每次求得的 dp值存于 dp[1]，而上一次的值，从 dp[1] 中挪到 dp[0] 中，
 * 这也是滑动数组的实现思想。这样，只需要两行空间即可完成遍历。
 */
function knapsackProblem2(nums, k) {
    // 条件判断
    if (!nums || !nums.length || !k) return 0;
    // 拆值
    const weights = nums.map(g => g[0]);
    const values = nums.map(g => g[1]);
    const length = nums.length;
    // 初始化 dp 数组，2 行即可
    const dp = new Array(2).fill(0).map(_ => new Array(k).fill(0));
    // 背包空间是 k，只有 1 个物品(values[0])时的 dp 取值
    // 因为如果 j < weights[0] 的话，dp[0][j] 的价值肯定是 0，当 j >= weight[0] 时，才能将 values[0] 放入背包。所以这里 j 初
    // 始化时直接以 weight[0] 开始，算是个窍门。
    for (let j = weights[0]; j < k; i++) {
        dp[0][j] = values[0];
    }
    // 循环商品，拿到一个商品尝试能否放入容量为 j 的背包中。
    for (let i = 1; i < nums.length - 1; i++) {
        for (let j = 0; j <= k; j++) {
            // 背包空间放不下当前的物品体积
            if (j < weights[i]) {
                dp[1][j] = dp[0][j];
            } else {
                const temp = dp[1][j];
                dp[1][j] = Math.max(dp[0][j], dp[0][j - weight[i]] + values[i]);
                dp[0][j] = temp;
            }
        }
    }
    return dp[1][k];
}
/**
 * @背包问题循环空间优化2
 * 上一步优化中，利用了第一位数组的滚动算法来解决多余空间占用的问题。二维数组占用实际上同样可以被压缩。使用两行二维数组的原因是用来承载
 * 每次计算出来的 i 和 i - 1 行的结果。那么有没有可能只利用以为数组，即  dp[0 - j] 的来存储当前的计算结果和上一步的计算结果？当我们
 * 当每次通过计算得出 f[i - 1][j] 时，可以将结果存放在另外一个数组 B 中，这个数组 B 也可以是 dp 数组，即:
 * B[j] = Math.max(dp[i - 1][j], dp[i - 1][j - weight[i]] + values[i])，涉及到 j 与 j - weight[i] 有一定的关系，所以 
 * j 肯定与 j - 1 有必然的联系，j 依赖于 j - 1 才能推导出来。对于 j 的循环，必然是要从大向小循环才行。不然的话，dp[j - 1] 会在本轮循环
 * 中被下一个覆盖掉。导致 dp[j] 的依赖变化，而得不到正确的结果.
 */
function knapsackProblem3(nums, k) {
    if (!nums || !nums.length || !k) return 0;
    // 拆值
    const weights = nums.map(g => g[0]);
    const values = nums.map(g => g[1]);
    const length = nums.length;
    // 初始化第 0 个物品和背包空间是 0 的最大价值是 0；
    const dp = new Array(k).fill(0);
    for (let i = 1; i < nums.length; i++) {
        for (let j = k; j >= 0; j--) {
            dp[j] = Math.max(dp[j], dp[j - weights[i]] + values[i]);
        }
    }
    return dp[k]
}

/**
 * 416. @分割等和子集
 * 给定一个只包含正整数的非空数组。是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。
 * 输入: [1, 5, 11, 5]
 * 输出: true
 * 解释: 数组可以分割成 [1, 5, 5] 和 [11].
 * @思路
 * 需要使两个子数组的和相等，那么只需要找到其中一个子数组的和为整个数组和的一半即可。target = sum / 2;
 * 1. target  = sum / 2;
 * 2. 找任意个元素的和为 target，好比从 nums 中寻找 n 个元素放入容量为 target 的背包内；
 * 3. 转化为01背包问题。
 * @动态规划
 */
function canPartition(nums) {
    // 1. 定义状态，dp[i] 表示，集合和为i，可以凑成的子集合总和为dp[i]。i代表背包容量，dp[i] 为背包价值
    // 2. 状态转移方程，与背包问题类似，dp[j] = Math.max(dp[j], dp[j - nums[i]] + nums[i]);
    // 3. 初始化状态：dp[0] = 0; 其余项初始化为0
    // 4. 确定遍历顺序。与简化版背包问题相同，j需要从大大小循环，否则会覆盖i的值。
    if (!nums || nums.length < 2) return false;
    const sum = nums.reduce((all, n) => all + n, 0);
    if (sum % 2 === 1) return false; // 和为奇数不可分两份相同大小的。
    const target = sum / 2;
    const length = nums.length;
    const dp = new Array(target + 1).fill(0);
    for (let i = 0; i < length; i++) {
        for (let j = target; j >= nums[i]; j--) {
            dp[j] = Math.max(dp[j], dp[j - nums[i]] + nums[i]);
        }
    }
    return dp[target] === target;
}

/**
 * 1049. 最后一块石头的重量2
 * 有一堆石头，每块石头的重量都是正整数。
 * 每一回合，从中选出任意两块石头，然后将它们一起粉碎。假设石头的重量分别为 x 和 y，且 x <= y。 那么粉碎的可能结果如下:
 * 如果 x == y，那么两块石头都会被完全粉碎;
 * 如果 x != y，那么重量为 x 的石头将会完全粉碎，而重量为 y 的石头新重量为 y-x。 最后，最多只会剩下一块石头。返回此石头最小的可能重量。如果没有石头剩下，就返回 0。
 * 示例:
 * 输入:[2,7,4,1,8,1]
 * 输出:1
 * 解释:
 * 组合 2 和 4，得到 2，所以数组转化为 [2,7,1,8,1]，
 * 组合 7 和 8，得到 1，所以数组转化为 [2,1,1,1]，
 * 组合 2 和 1，得到 1，所以数组转化为 [1,1,1]，
 * 组合 1 和 1，得到 0，所以数组转化为 [1]，这就是最优值。
 * 提示：
 * 1 <= stones.length <= 30;
 * 1 <= stones[i] <= 1000;
 */
/**
 * @思路 因为有两块石头相撞后的逻辑，那么尽可能安排两堆重量一样的石头互相来撞，最终得到的差值应该也是最小的。所以问题可以转化为将一堆重量各有差
 * 别的石头，分成两堆总重差不多石头。首先要知道石头的全部重量，分成两份每份重 sum / 2。然后从石头堆里挑石头，尽可能装满 sum / 2 的重量。所以
 * 又回到了背包问题，从一堆石头中挑石头，装满 sum / 2 的背包。与 416 分割等和子集相同。
 */
function lastStoneWeightII(nums) {
    if (!nums || !nums.length) return 0;
    const sum = nums.reduce((all, n) => all + n, 0);
    const target = Math.floor(sum / 2);
    const dp = new Array(target + 1).fill(0);
    for (let i = 0; i < nums.length; i++) {
        for (let j = target; j < nums[i]; j--) {
            dp[j] = Math.max(dp[j], dp[j - nums[i]] + nums[i]);
        }
    }
    return sum - dp[target] - dp[target];
}

