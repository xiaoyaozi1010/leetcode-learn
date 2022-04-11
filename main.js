/**
 * 1. 两数相加，两个链表
 * @思路
 * 见注释
 */

function ListNode(val, next) {
	this.val = (val === undefined ? 0 : val)
	this.next = (next === undefined ? null : next)
}
var addTwoNumbers = function (l1, l2) {
	// 1. 因为要从右向左逐位相加，所以涉及到进位操作，个位 + 个位 > 10，需要进位操作
	// 所以要设置进位值
	// 2. l1 的节点和 l2的节点相加，将结果存于res中，res只单个节点，随着位数的相加，需要不停的移动到下一个位置上
	let carry = 0;
	let cur = null;
	let res = null;
	while (l1 || l2) {
		const v1 = l1 ? l1.val : 0;
		const v2 = l2 ? l2.val : 0;
		const sum = v1 + v2 + carry;
		if (!cur) {
			cur = new ListNode(sum % 10);
			res = cur; // 保存结果的开始节点，因为是链表，所以保存开始节点即可，后面的都会有的
		} else {
			cur.next = new ListNode(sum % 10);
			cur = cur.next;
		}
		// 取进位值，或者这里直接 carry = sum >= 10 ? 1 : 0; 因为题目描述中
		// 9 >= Node.val >= 0，所以sum不可能大于19的。
		carry = Math.floor(sum / 10);
		// 移动l1和l2
		if (l1) {
			l1 = l1.next;
		}
		if (l2) {
			l2 = l2.next;
		}
	}
	// 所有的循环结束后，需要看最后剩余的carry是不是还有没被处理的进位，如果有,
	// 那么需要拼接到最后以为的后面
	if (carry > 0) {
		cur.next = new ListNode(carry);
	}
	return res;
};

/**
 * 3. 无重复字符的最长子串
 * @思路
 * - 暴力枚举，固定第 i 个字符，之后逐个向后加 1 ，记录位置，复杂度是 O(n2)，最坏情况每个字符都要被遍历两边
 * - 滑动窗口。对于给定的字符串s: abcabcbb，尝试枚举分别以每个字符开头的最长子字符串：
 * 	- 以(a)bcabcbb开头,最长子字符串为(abc)abcbb;
 * 	- 以a(b)cabcbb开头,最长子字符串为a(bca)bcbb;
 * 	- 以ab(c)abcbb开头,最长子字符串为ab(cab)cbb;
 * 	- 以abc(a)bcbb开头,最长子字符串为abc(abc)bb;
 * 	- 以abca(b)cbb开头,最长子字符串为abca(bc)bb;
 *  - ...
 * 观察开头字符、最长子字符串的结尾。对于以k为开头，以rk结束的子字符串，随着k的向右移动，rk也是向右移动的。对于 k+1 ~ rk
 * 之间的字符，肯定是不会重复的，因为 k - rk 是不重复的，所以去掉 k ，也是不重复的，于是对于 k ~ rk 中间的字符，是没必要
 * 继续循环比较的。对于 k ~ rk 所组成的区间，可以认为是一个窗口，这个窗口在字符串中滑动并调整窗口的左右边界，直到找到最长的。
 * 边界条件：
 *  - 要判断字符是否重复，除了使用字符串原生的 s[i] 还可以使用性能更好的 Set() 来判断；
 *  - 右边界 right：边界是字符串的长度length，即 right < length;
 *  - 右边界字符：右边界所在字符一旦在窗口(window)里再次出现，即跳出内层循环，左边界加一；
 *  - 左边界每次向右移动一步，就要从窗口里把上一个左边界排除掉，window.delete(left - 1);
 *  - 左边界每移动一次，就记录一次当前遍历中出现的最大子字符串长度。
 */
function lengthOfLongestSubstring(s) {
	// 字符边界判断，减少计算；
	if (!s || !s.length) return 0;
	if (s.length < 2) return s.length;
	// 右边界初始值为0，题解中这里设置为 -1，有一定的误导性，其实设置为 0 更好理解。
	let right = 0;
	const length = s.length;
	let res = 0;
	// 滑动窗口里的内容
	const window = new Set();
	for (let left = 0; left < s.length; left++) {
		// 窗口左移，意味着要要将原原来左边界内的东西去掉
		if (left !== 0) {
			window.delete(s[left - 1]);
		}
		// 边界条件是 right 抵达字符串最右侧，并且窗口中不含有重复的内容
		while (right < length && !window.has(s[right])) {
			window.add(s[right]);
			right += 1;
		}
		// 每次循环拿到最大长度值的存起来
		res = Math.max(res, window.size);
	}
	return res;
}

// 88. 合并两个有序数组
// 给定两个递增数组，nums1，长度为m，nums2，长度为n，需要合并两个数组，合并之后的数组同样满足递增排序。
// 最终合并后的数组不应该返回，而是存在nums1中。所以nums数组的初始长度是m + n，其中前m个元素为要被合并的元素，后n个元素为0
// 采用双指针方法，从头比较两个元素。
/**
 * 优化解法是尾部双指针，由于nums1或者nums2的尾部是一串0，所以得到的值直接放在尾部即可
 **/
var merge = function(nums1, m, nums2, n) {
	let index1 = 0, index2 = 0; // nums1和nums2的初始索引
	const sorted = []; // 以0填充一个m+n长度的数组
	let cur ; // 当前要被放入sorted的元素
	while(index1 < m || index2 < n) { // nums1和nums2都要循环完成才行
		if (index1 === m) { // nums1 遍历完了
			cur = nums2[index2]; // index2++ 翻译成 nums2[index2]; index2 += 1;
			index2 += 1;
		} else if (index2 === n) { // nums2 遍历完了
			cur = nums1[index1]; // index1++ 同上
			index1 += 1;
		} else if (nums1[index1] < nums2[index2]) {
			cur = nums1[index1];
			index1 += 1;
		} else {
			cur = nums2[index2];
			index2 += 1;
		}
		sorted.push(cur); // 填入
	}
	// 按照题目要求，把结果放在nums1里
	for (let i = 0; i < m + n; i++) {
		nums1[i] = sorted[i];
	}
}
// 4. 最长回文子字符串
// 给你一个字符串 s，找到 s 中最长的回文子串
/**
 * 暴力解法，找到每一个以i为开始坐标，以j为结束坐标的子字符串判断是否为回文，如果是，就保存起始坐标和长度，
 * 最终判断选择长度最长的那个字符串返回即可。
 **/ 
 function longestPalindrome(s) {
	 if (!s || !s.length || s.length < 2) return s;
	 // 初始化maxLength 为1，单个字符也是回文，所以长度是1.
 	let begin = 0, maxLength = 1, length = s.length;
	// 转为数组，也可以选择不转
 	const arr = s.split('');
 	for (let i = 0; i < length - 1; i++) {
 		for (let j = i + 1; j < length; j++) {
 			if (isPalindromeArray(arr, i, j) && j - i + 1 > maxLength) {
 				maxLength = j - i + 1;
 				begin = i;
 			}
 		}
 	}
 	return s.substring(begin, maxLength + begin);
 }

 function isPalindromeArray(arr, start, end) {
 	if (!arr || !arr.length) return false;
 	while(start < end) {
 		if (arr[start] !== arr[end]) {
 			return false
 		}
 		start++;
 		end--;
 	}
 	return true;
 }
 /**
  * 方法2：中心扩散法
  * 循环数组，找到数组中除第0项和第 length - 1 项为中心的回文串，根据回文串的原理，以i为中心的回文串，存在 string[i - 1] === string[i + 1]，
  * 这里需要区分回文串的中心是一个元素（长度为奇数）还是两个元素（长度为偶数），存在(i, j)，string[i] = string[j]，string[i - 1] === string[j + 1]。
  * 比较奇数串与偶数串的长度，取大的即可，再根据当前中心位置索引计算起始位置即可。
 **/
function longestPalindrome(s) {
	/**
	 * 获取以start为中心的回文串
	 * start: 中心位置
	 * 是否偶数串，偶数串中心为1，奇数串中心为2
	**/
	function expandCenterLength(str, start, isOdd) {
		let left = start;
		let right = isOdd ? start : start + 1;
		const length = str.length;
		while(left <= right && left >= 0 && right < length) {
			if (str[left] === str[right]) {
				left -= 1;
				right += 1;
			} else {
				break;
			}
		}
		// 返回长度，不返回字符串的原因是：这个函数是在循环里运行，返回字符串需要切割字符串，对性能有影响
		return (right - left + 1) - 2; // 减 2 的原因是，循环退出的时候，left和right都各自变化了一次
	}
	if (!s || !s.length) return '';
	if (s.length < 2) {
		return s;
	}
	const length = s.length;
	let maxLength = 1;
	let begin = 0;
	for (let i = 0; i < length - 1; i++) {
		// 以 s[i] 为中心的奇数回文串
		const oddStrLength = expandCenterLength(s, i, true);
		const evenStrLength = expandCenterLength(s, i, false);
		const curMaxLength = Math.max(oddStrLength, evenStrLength);
		if (curMaxLength > maxLength) {
			maxLength = curMaxLength;
			// 奇数回文串
			if (maxLength % 2 === 1) {
				begin = i - (maxLength - 1) / 2;
			}
			// 偶数回文串
			else {
				begin = i - maxLength / 2 + 1;
			}
		}
	}
	console.log(begin, maxLength);
	return s.substring(begin, begin + maxLength);
}
/**
 * 动态规划。
 * 根据回文字符串具有从中间向两边扩散的特性，对于字符串s: 'abccba'，如果中间的字符串'cc'是回文，那么'bccb'肯定也是回文，因为字符串两边的值相等，
 * 定义状态：
 * 	- 定义一个数组，用来存放由字符串s的起始坐标i到结束坐标j组成的子字符串是否为回文，dp[i][i];
 *  - 单个字符串‘c’，肯定是回文（最小回文），所以dp[i][i]是回文，dp[i][i] = true;
 *  - 如果 dp[i-1][i+1]是回文的话，设置为true，否则为false
 * 状态转移：
 * 	- 对于任意的dp[i][j]所对应的字符串，是回文的条件是满足：dp[i][j] = dp[i-1][j+1] && s.subString(i, j).length > 2 && s[i] === s[j]；
 * 初始条件：
 * 	- 设置每个单字符的子串为true，for(let i = 0; i < s.length; i++) { dp[i][j] = true; }
 * 	- 对于每一个s[i...j]，应该满足 j > i && j - 1 - (i + 1) + 1 > 2，整理得：j - i > 3;
 * 输出：
 * 	- 记录最长的长度；
 * 	- 记录最长长度所在起始位置；
**/ 
function longestPalindrome(s) {
	// 边界判断
	if (!s || !s.length) return '';
	if (s.length < 2) return s;
	const length = s.length;
	let maxLength = 1;
	let begin = 0;
	const dp = new Array(s.length)
		.fill(0)
		.map((_, i) => new Array(s.length)
			.fill(false)
			.map((_, j) => j === i ? true : false));
	for (let j = 1; j < length; j++) {
		for (let i = 0; i < j; i++) {
			if (s[i] !== s[j]) {
				dp[i][j] = false;
			} else {
				// 上一层字符串长度如果小于2，那么直接为true，否则进入下一个判断
				if (j - 1 - (i + 1) + 1 < 2) {
					dp[i][j] = true;
				} else {
					dp[i][j] = dp[i + 1][j - 1];
				}
			}
			if (dp[i][j] && j - i + 1 > maxLength) {
				maxLength = j - i + 1;
				begin = i;
			}
		}
	}
	return s.substring(begin, begin + maxLength);
}
/**
 * 53. 最大子数组和
 * 给定一个数组，要求找具有最大和的连续子数组，
 * [-2, -1, 1, 3, -2, 4, 5, -3], 返回11，最长子数组是 [1, 3, -2, 4, 5]
**/
// 简单的动态规划，求解最大子数组和，可以认为最大子数组最后一位是nums[n], sum = f(0, n - 1) + nums[n]; 
// 以此类推，可以找到其中的第一个值，可以以nums[0]开始，那么就是 sum1 = max(nums[0], nums[0] + nums[1]);
// sum2 = max(sum1, sum1 + nums[2]);
// 所以这里以一个循环开始
var maxSubArray = function (nums) {
	// 动态规划
	// 可以认为最大子数组最后一位是nums[n]，那么该子数组之和是sum[n] = sum[n - 1] + nums[n];
	// 对于当前元素，可以选择加也可以选择不加，如果是负数，那么就不加，否则和将变小。所以每次都要取
	// 总和与上次和的最大值。
	// 1. 状态定义，定义dp[i]，表示以 nums[i] 结束的子数组的和；
	// 2. 状态转移：如果是子序列的话，dp[i] = Math.max(dp[i - 1] + nums[i], dp[i - 1])，
	// 连续子数组是指的当前数组中的子集，所以dp[i] = Math.max(dp[i - 1] + nums[i], nums[i]);
	// 如果nums[i]要大于dp[i - 1] + nums[i]，那么说明上一步计算出来的是负值，所以需要抛弃并以当前位置重新开始
	// 子数组。
	// 3. 初始化，dp[0] = nums[0]，dp[1] = Math.max(nums[0], nums[0] + nums[1]),可以看出dp[1]其实已经
	// 满足状态转移方程了，所以初始化dp[0]即可.
	// 4. 循环顺序，就一次循环
	if (!nums || !nums.length || nums.length < 2) return nums[0];
	const length = nums.length;
	const dp = [nums[0]];
	let sum = nums[0];
	for (let i = 1; i < length; i++) {
		dp[i] = Math.max(dp[i - 1] + nums[i], nums[i]);
		sum = Math.max(sum, dp[i])
	}
	return sum;
};
// 空间优化后
function maxSubArray(nums) {
	let prevSum = 0;
	let sum = nums[0];
	nums.forEach(n => {
		prevSum = Math.max(n, prevSum + n); // 上一个和、当前值 + 上一个值取最大的保留；
		sum = Math.max(prevSum, sum); // 上一个和总和取最大一个，保留（比如上一个和已经是10了，加了一个负值就小于10了，所以取上一个）
	});
	return sum;
}
/**
 * 300. 最长上升子序列的长度
 * 给定一个无序数组，找到其中最长严格递增子序列的长度。
 * 输入：[10,9,2,5,3,7,101,18]
 * 输出：4 // 最长子序列是[2,3,7,101]，长度是4
**/
/**
 * 动态规划。最长上升子序列的最后一项位置
 * 状态定义：定义dp[i]为以nums[i]为结尾的子数组长度。
 * 转移方程：遍历每个[0, i)的区间数组，变量为j，根据逻辑：
 * 	- nums[i] > nums[j]时，nums[i]可以接到[0, j]这个子数组之后，标记dp[j]的长度为n，那么此时子数组长度为dp[j] + 1;
 *  - nums[i] < nums[j]时，上升子数组不成立，跳过；
 *  - 递增i，循环找到每个子数组的最长上升序列长度，标记到dp数组中，最后找dp中最大的那个值即可。
 * 初试状态：设置dp数组的长度与nums长度相同，填充1，因为至少上升长度为1，[1,1,1,1,1]的最小上升序列长度是1
**/
function lengthOfLIS(nums) {
	let lengthStore = [0]; // lengthStore即为dp；
	const length = nums.length;
	let maxLength = 1; // 至少是1的长度；
	for (let i = 1; i < length; i++) { // 找出子数组，至少得2项，才有找的意义
		lengthStore[i] = 1;
		for (let j = 0; j < i; j++) { // 子数组就得从第0个开始找
			if (nums[i] > nums[j]) { // 属于上升
				// lengthStore[i]保存以当前位置为结尾的子数组的最长长度，lengthStore[j]也保存了，所以要和 +1 比
				lengthStore[i] = Math.max(lengthStore[i], lengthStore[j] + 1);
			}
		}
		maxLength = Math.max(lengthStore[i], maxLength);
	}
	return maxLength;
}
/**
 * 673. 最长上升子序列的个数，同上题，不同的是要找出可以组成最长上升子序列的所以集合的个数
 * [10,9,2,5,3,7,101,18]
 * 定义状态：
 * 	- 同样记录dp[i]为以nums[i]为结尾的子序列的长度；
 * 	- 用于记录nums[i]为结尾子序列的个数；
 * 转移方程：
 * 	-
 * 
**/
function numberOfLIS(nums) {
	const dp = [1], count = [1]; // 至少都有1个
	let maxLength = 1; // 同样至少有1个
	const length = nums.length; // 为了代码更好看些
	let result = 0; // 最终结果
	for (let i = 1; i < length; i++) {
		dp[i] = 1; // 初始化到i，最长上升子序列的长度至少是1
		count[i] = 1; // 初始化到i，最长上升子序列这个长度的至少有1个
		for (let j = 0; j < i; j++) {
			if (nums[i] > nums[j]) { // 满足上升条件
				// 这里不需要再存储子序列最长的长度，因为要求的不是最长上升子序列的长度，这里要存储子序列的长度
				if (dp[i] < dp[j] + 1) { // 到i这个位置，此时还没有找到最长的那个，所以只需要记录到这里的长度
					dp[i] = dp[j] + 1;
					count[i] = count[j]; // dp[i]<dp[j]+1，此时dp[i]需要被dp[j]更新，所以直接更新count[i]=count[j]?
				} else if (dp[i] === dp[j] + 1) { // 又找到一个同样长度的
					count[i] += count[j]; // 状态转移！！不是+1；
				}
			}
		}
		maxLength = Math.max(maxLength, dp[i]);
	}
	for (let n = 0; n < length; n++) {
		if (dp[n] === maxLength) {
			result += count[n];
		}
	}
	return result;
}
/**
 * 64. 最小路径和，给定一个矩阵，找出从矩阵最上角出发，到右下角的最小路径和
 * 1,  1,  3
 * 1,  5,  1,
 * 4,  2,  1,
 * 最短路径是 1，1，3，1，1。和是7。
 * 输入：[[1,1,3], [1,5,1], [4,2,1]]
 * 输出：7
 * 分析：动态规划
 * 状态定义：设定dp[i][j]矩阵，用于存储走到每一个节点(i, j)的最小路径和，最后返回右下角节点的数字即可
 * 状态转移方程：
 * 走到当前单元格（i, j）的最小路径和 = 从左边单元格(i - 1, j)与上边单元格(i, j - 1)走过来的最小路径中较小的 + 当前单元格的值grid[i][j]
 * 即：dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]
 * 对于每个grid[i][j]，可选的路径方式有以下几种：
 * 	- i = 0; j = 0; 即左上角，此时dp[i][j] = grid[i][j]，也就是dp[0][0] = grid[0][0];
 *  - i = 0; j > 0; 即顶部那一行，只能向右走，此时dp[i][j]只与左方元素的最小路径和有关，即dp[0][j] = dp[0][j-1] + grid[0][j];
 *  - i > 0; j = 0; 即左边那一行，只能向下走，此时dp[i][j]只与上方元素的最小路径和有关，即dp[i][0] = dp[i-1][0] + grid[i-1][0];
 *  - i > 0; j > 0; grid[i][j]不临边界，此时dp[i][j]的取值是上方和左方中最小的那个路径和加grid[i][j], 即dp[i][j] = min(dp[i][j-1], dp[i-1][j]) + grid[i][j];
 * 初始状态，dp[][] = 0;
 * 返回：dp[grid.length - 1][grid[0].length - 1]的值，即dp右下角保存的值接口
**/ 
function minPathSum(nums) {
	const dp = [];
	const m = nums.length;
	const n = nums[0].length;
	for (let i = 0; i < m; i++) {
		dp[i] = new Array(n).fill(0);
		for (let j = 0; j < n; j++) {
			if (i === 0 && j === 0) {
				dp[i][j] = nums[i][j];
			} else if (i === 0 && j > 0) {
				dp[i][j] = dp[i][j - 1] + nums[i][j];
			} else if (i > 0 && j === 0) {
				dp[i][j] = dp[i - 1][j] + nums[i][j];
			} else {
				dp[i][j] = Math.min(dp[i][j - 1], dp[i - 1][j]) + nums[i][j]
			}
		}
	}
	return dp[m - 1][n - 1];
}

/**
 * 打家劫舍。
 * 你是一个专业的小偷，计划偷窃沿街的房屋。
 * 每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。
 * 计算在怎么不触发警报的情况下，取得更多的财富。
 * 输入：[1,2,3,1]
 * 输出：4，因为最大路径是 1,3，合是4
 * 输入：[2,7,9,3,1]
 * 输出：12，【2，9，1】
 * 动态规划：
 * 状态定义：定义动态规划数组保存每间房间可偷取的最大财富，最终返回最后一间房屋时能偷取的最大财富。
 * 定义每个房间为止，前面所有房间的最大收益，dp[i]
 * 状态转移方程：
 * 	- 只有一间房屋时：[2]，最大财富是2，因为只有一个，dp[0]=nums[0]；// dp=[2]
 * 	- 只有两间房屋时：[2,7]，最大财富是7，也就是 dp[1]=max(nums[0], nums[1])；// dp=[2,7]
 * 	- 第三个房间[2,7,9]开始，需要分两种情况分析
 * 		1. 如果要偷第3间房，那么就不能偷第二间房，那么财富就是 nums[0]+nums[2], dp[2]=nums[0]+nums[2];
 * 		2. 如果不偷第3间房，那么财富就是dp[1]，就是钱2间房的财富，dp[2]=dp[1]。
 * 		3. 最大财富就是从1、2中选择最大的那个，dp[2]=max(dp[1], nums[0]+nums[2]); // dp=[2,7,11]
 * 	- 第四个[2,7,9,3]房间开始，同样分两种情况分析，
 * 		1. 如果偷第4个房间，那么就不能偷第3个房间，最大财富就是 dp[3]=dp[1]+nums[3];
 * 		2. 如果不偷第4个房间，那么最大财富就是前3个的最大财富，dp[3]=dp[2];
 * 		3. 所以最大财富就是，1、2中选择最大的那个，dp[3]=max(dp[1] + nums[3], dp[2]);
 * 	- 到第n个房间，同样分两种分析：
 * 		1. 如果偷第n个房间，那么就不能偷第n-1个，最大财富就是dp[n]=dp[n-2]+nums[n];
 * 		2. 如果不偷第n个房间，那么最大财富就是dp[n]=dp[n-1];
 * 		3. 所以最大财富就是1、2中最大的那个，dp[n]=max(dp[n-2]+nums[n], dp[n-1]);
 * 初始化状态：
 * 	- dp[0] = nums[0]
 *  - dp[1] = max(nums[0], nums[1]);
 * 返回：
 * 	dp[nums.length - 1];
**/ 
function rob(nums) {
	// 初始化动态数组
	const dp = [nums[0], Math.max(nums[0], nums[1])];
	const length = nums.length;
	for (let i = 2; i < length; i++) {
		dp[i] = Math.max(dp[i - 2] + nums[i], dp[i - 1]);
	}
	return dp[length - 1];
}

/**
 * 打家劫舍2
 * 同打家劫舍1，不同的地方是房间是首尾相连的环状分布，请问最多能够偷到多少财富
 * 输入: [1,2,3,1]
 * 输出：4, 只能偷1、3或2、4
 * 输入：[1,3,4,2,3]
 * 输出：5，偷了1，就不能偷5
 * 动态规划：
 * 状态设计：假设所有房间数为nums
 * 	- 同打家劫舍1
 * 状态转移方程：
 * 	- 与打家劫舍相同，不能选取相邻两家偷取，所以枚举截止到每个房间为止可以偷取的最大财富，对应每个房间来说，可以选择偷或者不偷，
 * 	  偷nums[i]的话，就不能偷nums[i-1]，不偷nums[i]的话，就可以偷nums[i-1]，财富就是dp[i]=max(nums[i]+dp[i-2], dp[i-1]);
 * 	- 不同的是，对于nums[0]和nums[nums.length-1]，也就是第一个房间和最后一个房间，如果偷了nums[0]，那么就不能偷nums[nums.length-1],
 * 	  如果不偷nums[0]，就可以偷nums[nums.length-1]。所以对于上述两种选择，偷nums[0]可以认为是对以nums[0]为开始，以nums[nums.length-2](减1是最后一位)
 *    为结束的房屋进行偷取，不偷nums[0]可以认为是对以nums[1]为开始，以nums[nums.length - 1]为结束的房间进行偷取。对两个数组取最大值即可。
 **/
 function rob2(nums) {
 	const length = nums.length;
 	if (!nums || !nums.length) return 0;
 	if (nums.length === 1) {
 		return nums[0]
 	}
 	if (nums.length === 2) {
 		return Math.max(nums[0], nums[1]);
 	}
 	// 选[0, length-2]还是[1, length-1];
 	return Math.max(robRange(0, length - 2, nums), robRange(1, length - 1, nums));
 }
 // 标准的打家劫舍1
 function robRange(start, end, nums) {
 	let first = nums[start];
 	let second = Math.max(nums[start], nums[start + 1]);
 	for (let i = start + 2; i <= end; i++) {
 		// first 和 second是动态的，滑动数组原理
 		let temp = second;
 		// 选当前的和不选当前的，选当前的就是num[i] + dp[i - 2](first)，不选当前的就是dp[i - 1]，就是second
 		second = Math.max(nums[i] + first, second);
 		first = temp; // first 进位到 second，second 进位到 dp[i]
 	}
 	return second;
 }


/**
 * 152. 乘积最大子数组
 * 给你一个整数数组 nums ，请你找出数组中乘积最大的非空连续子数组（该子数组中至少包含一个数字），并返回该子数组所对应的乘积。
 * 输入：[2,3,-2,4]
 * 输出：6
 * 动态规划
 * 状态定义：
 * 	- 定义dp数组，保存截止至每一项为结尾的子数组乘积，对于第dp[i]项的值，等于dp[i-1] * nums[i]，由于不确定数组每项的值是否大于0
 * 	  所以需要比较dp[i-1]和dp[i-1]*nums[i]谁更大一些，取最大的存到dp[i]中
 * 状态转移方程：以[2,3,-2,4]数组为例
 * 	- 假设子数组为[2], 那么乘积就是[2]；为了方便比较每一项的为结尾的数组乘积，将结果存在dp数组中
 *  - 假设子数组为[2,3]，那么乘积dp为[2,6]；
 * 	- 假设子数组为[2,3,-2]，那么乘积是[2,6,-12(上一个乘积(6) * 当前项的值(-2))]; 取最大值6
 * 	- 假设子数组为[2,3,-2,4]，那么乘积是[2,6,-12,-48(上一个乘积(-12) * 当前项的值(-4))]; 取最大值6
 * 	- 假设子数组为[2,3,-2,4,-3]，那么乘积是[2,6,-12,-48,144(上一个乘积(-48)*当前值(-3))]; 取最大值144
 * 	编写基本逻辑即可。
**/ 
function maxProduct(nums) {
	const length = nums.length;
	if (length === 0) {
		return 0;
	} else if (length === 1) {
		return nums[0]
	}
	let max = nums[0];
	const imax = [nums[0]]; // 保存最大的
	const imin = [nums[0]]; // 保存最小的
	for (let i = 1; i < length; i++) {
		imax[i] = Math.max(imax[i - 1] * nums[i], nums[i], imin[i - 1] * nums[i]);
		imin[i] = Math.min(imax[i - 1] * nums[i], nums[i], imin[i - 1] * nums[i]);
	}
	for (let i = 1; i < length; i++) {
		max = Math.max(max, imax[i]);
	}
	return max;
}

/**
 * 删除并获得点数
 * 给你一个整数数组 nums，可以对数组执行删除操作，每次删除一个元素nums[i]，你将获得值为nums[i]的点数，同时必须将原素组中值为
 * nums[i] + 1，和 nums[i] - 1的元素删除，没有的话不删除。如此操作，可以获得最大的点数是多少？
 * 输入：nums = [3,4,2]
 * 输出：6。因为删除元素4，获得4点，对应需要删除 4 - 1 = 3 的元素，和 4 + 1 = 5 的元素，此时nums剩余[2]，那么删除2，获得2点，总共获得6点
 * 输入：nums = [2,2,3,3,3,4]；
 * 输出：9。删除1个元素3，获得3点，同时需要删除所有的2和4，原数组剩余：[3,3]，每次删除3，得3点，总共 3+3+3 = 9点。
 * 动态规划：需要将原问题转化成为基本的动态规划基础题目。假设nums: [2,2,3,3,3,4]。
 * 
 **/ 


 /**
  * 5. 查找两个递增数组的中位数
  * 输入：[1,2,3],[4,5,6]
  * 输出：3.5 因为 [1,2,3,4,5,6] 的中位数是 (3+4)/2
  * 思路1：归并排序简化版
  * 	对于长度分别是m,n的两个数组A,B，中位数永远和 (m+n)/2有关，和前面的数没有关系，所以在归并A和B时，只归并前 (m+n)/2 + 1位置即可
  * 	那么，m + n 如果是偶数，中位数就是(m+n)/2 -1 和 (m+n)/2 位置的和除以2，否则就是(m+n)/2的值。
  * 解释：(m+n)/2 基本满足了中位数的位置了。
  **/
  function findMedianSortedArrays2(nums1, nums2) {
  	const m = nums1.length;
  	const n = nums2.length;
  	const mid = Math.floor((m + n) / 2); // 不管m+n是偶数还是奇数，mid都是正好的中位线位置
  	let start1 = 0, start2 = 0;
  	let prev = -1, next = -1; // 用于保存中位线的前一个、后一个
  	for (let i = 0; i <= mid; i++) {
  		// prev 赋值为 next，让next继续往下找，next 永远赋值为两数组比对元素时较小的那个
  		prev = next;
  		// start1 < m，表示start1不能超界，同理start2在递增的过程也不能超界
  		if (start1 < m && (start2 >= n || nums1[start1] < nums2[start2])) {
  			next = nums1[start1++];
  		} else {
  			next = nums2[start2++]
  		}
  	}
  	console.log(prev, next);
  	return (m + n) % 2 === 0 ? (prev + next) / 2.0 : next;
  }
  /**
  * 思路：分别找出两个数组合并后的中位线，两数组长度是偶数的，中位线两侧就是中位数的两个元素，否则穿过中位线的就是中位数。
  * 实际上中位线是一套虚拟的、位于合并之后的数组中的位置线，现在的问题是怎么去找到这条线在原来两数组中的位置。
  * 分割线需要满足以下三种条件：
  *   - 分割线左边的元素和要小于等于分割线右边的元素和（数组1、数组2合并排序后的数组满足的条件）；
  *   - 第一个数组nums1的分割线左边元素要小于第二个数组nums2分割线右边的元素;
  *   - 第一个数组nums1的分割线右边元素要大于第二个数组nums2分割线左边的元素；
  * 假设两个数组分别为A，B，长度为m, n。对于合并后数组S的中位线k的位置，分两种情况讨论：
  *   - m + n 是偶数，k = (m + n)/2，中位数 mid = S[((m + n)/2) - 1] + S[((m + n)/2) + 1]，即中位线左右两边元素的和除以2
  *   - m + n 是奇数，k = (m + n + 1)/2，此时 k 将位于 S[(m + n + 1)/2] 元素上，为了避免这种情况，需要将 k 右移或者左移一位，
  *     这里选择右移，那么中位线左边的元素就是中位数，k = ((m + n + 1)/2) + 1；
  * 判断 m + n 的奇偶性，会使逻辑变的更加复杂，需要对中位数的位置中 (m + n + 1)/2 和 (m + n)/2做相应的简化，javascipt中的算术运算中，
  * Math.floor((m + n + 1)/2) 和 Math.floor((m + n)/2)的值相等。
 **/ 
 function findMedianSortedArrays(nums1, nums2) {
 	// 现将短的数组放在nums1里，方便分割线的取得
 	if (nums1.length > nums2.length) {
 		// 交换位置
 		[nums2, nums1] = [nums1, nums2];
 	}
 }

/**
 * 归并排序
 * 给定无需数组，将其排序，要求时间复杂度lg(n)。
 * 思路：
 * 	- 归并排序的的思想是分治法。可以将给定的数组S，拆成两个独立的数组A、B，为了保证循环的最小量，从中间分是最合适的。
 * 	  之后同时循环A和B，取出A[0]、B[0]，如果A[0] < B[0]，A的系数自增，S[0] = A[0]，否则 S[0] = B[0]，B的系数自增。直到循环结束。
 *  - 使用递归的思想，对每一个可以继续细分的数组进行拆分，排序。
**/
function mergeSort(nums) {
	if (!nums || nums.length < 1) return 0;
	if (nums.length < 2) return nums;
	const mid = Math.floor(nums.length / 2); // 取中间索引
	const length = nums.length;
	// slice() 左开右闭
	const left = nums.slice(0, mid);
	const right = nums.slice(mid, length);
	return merge(mergeSort(left), mergeSort(right));
}
function merge(left, right) {
	const res = [];
	while(left.length || right.length) {
		// 左边到头
		if (!left.length) {
			res.push(right.shift());
		}
		// 右边到头
		else if (!right.length) {
			res.push(left.shift());
		}
		else if (left[0] <= right[0]) {
			res.push(left.shift());
		}
		else {
			res.push(right.shift())
		}
	}
	return res;
}

/**
 * 6. 字符串Z字行变换
 * 对于给定字符串s = 'PABCBDZQY'，对字符串每个字符做z字形排列，排列R行。举例 s 变化后的结果是，R = 3：
 * P     B     Y
 * A  C  D  Q
 * B     Z
 * 排列方向是，左上角出发，向下排列 R 行，向右上方排列到顶部，再向下排列。↓ ↗ ↓。
 * 返回从左到右，从上到下读取到的字符串。
 * 思路：
 * 	1. 构造二维数组的表格，按下标填充字符串，找到填充位置的规律。
 *  2. 最后返回二维数组的join字符串。
**/
function convert(s, cols) {
	if (!s || !s.length || s.length) return '';
	if (s.length <= cols) return s;
	const length = s.length;
	const arr = s.split('');
	// 计算当前的字符串可以填充的二维数组子项长度，每个cols * cols可填充的字数是 cols(边) + cols(边) + cols - 2(对角线)
	const t = 2 * cols - 2;
	const n = Math.floor(length / t) // matrix 的个数
	// 填满 n 个 matrix 后还剩的字符数
	const rl = length % t;
	// 剩下的 rl 个字符数如果大于两列 ，那么就申请cols列，否则: 小于等于1列，就申请1列，否则就申请1列 + 对角线上个数列；
	const rs = rl <= cols ? 1 : 1 + rl - cols;
	const matrix = new Array(cols).fill(0).map(() => new Array((cols - 1) * n + rs).fill(''));
	// 用文字填写二维矩阵，假设从(x,y)位置填写，初始x = 0; y = 0; 标识左上角;
	for (let i = 0, x = 0, y = 0; i < length; i++) {
		matrix[x][y] = s[i];
		if (i % t < cols - 1) {
			x += 1;
		} else {
			x -= 1;
			y += 1;
		}
	}
	return matrix.map(item => item.join('')).join('');
}
/**
 * 优化算法。用于存储矩阵的数组有大量的空间未被使用，所以需要对无用的空间进行清理。不需要直接创建矩阵不占用的空间。
**/ 
function convert(s, cols) {
	if (!s || !s.length) return '';
	if (s.length < cols || cols <= 1) return s;
	const length = s.length;
	const matrix = new Array(cols).fill('');
	const t = cols * 2 - 2;
	for (let i = 0; i < cols; i++) {
		matrix[i] = [];
	}
	for (let i = 0, x = 0; i < length; i++) {
		matrix[x].push(s[i]);
		if (i % t < cols - 1) {
			x += 1;
		} else {
			x -= 1;
		}
	}
	return matrix.map(item => item.join('')).join('');
}
/**
 * 7. 整数反转。
 * 给定一个32位有符号整数x，返回将x中的数字部分反转后的结果。仅限数学编程方法，不可以使用字符串转化。
 * 如果翻转后的值大于Math.pow(2, 31)或小于Math.pow(-2, -31)，返回0即可。
 * 输入：123
 * 返回：321
 * 输入：-928
 * 返回：-829
 * 思路：
 * 	- 限定了只能使用数学的方法编程解决，不能使用诸如 Number(nums.toString.reverse())的方法。通过数学
 * 	  计算，dig = x % 10; 得出 dig 是数字 x 的个位值，便可以得到数字 x 的尾部数字，之后 x = Math.floor(x / 10)
 *    可以将x再缩小10倍，继续 dig = x % 10, 依次类推，直到 x === 0 为止，最终将组合起来的数字返回。
**/ 
function reverse(num) {
	// 一位数的直接返回。
	if (num < 10 && num > -10) return num;
	let x = num;
	let res = 0;
	const MAX = Math.pow(2, 31) - 1;
	const MIN = Math.pow(-2, 31);
	while (x !== 0) {
		// 取到尾部数字
		const dig = x % 10;
		// 缩小10倍，取整，源数字抛掉尾部数字
		x = Math.trunc(x / 10);
		// 上一步缩小了10倍，反转后的要还原回10倍
		res = res * 10 + dig;
		// 早点判断超限返回0，避免无意义的计算下去
		if (res > MAX || res < MIN) {
			return 0;
		}
	}
	return res;
}
/**
 * 8. 字符串转换整数 (atoi)
 * 思路：
 *   - 按照规则要求，先过滤前导空格，再对前导的+-号做过滤。之后，遍历每一个数字，如果是数字，则赋值给结果res，再次遇到数字，res中
 *     已保存的数字就要向左挪一位，之后与新数字相加，再次碰到非数字，则退出循环，返回res即可。
 *   - 需要注意的是，需要分步骤清理，一个while循环中无法清除所有，导致后面的case +-12 无法输出0；
**/
var myAtoi = function(s) {
    if (!s || !s.length) return 0;
    const length = s.length;
    let i = 0;
    let res = 0;
    let sign = 1;
    const isNumber = (n) => /^[0-9]$/.test(n);
    const MAX = Math.pow(2, 31) - 1;
    const MIN = Math.pow(-2, 31);
    // 过滤前导空格
    while (i < length) {
        if (s[i] === ' ') {
            i += 1;
        } else {
            break;
        }
    }
    // 过滤前导的正负号
    if (s[i] === '+') {
        sign = 1;
        i += 1;
    } else if (s[i] === '-') {
        sign = -1;
        i += 1;
    }
    while(i < length) {
        if (isNumber(s[i])) {
            let total = res * 10 + Number(s[i]);
            res = sign > 0 ? Math.min(total, MAX) : Math.min(total, -MIN);
        } else {
            break;
        }
        i += 1;
    }
    return res * sign;
};

/**
 * 亚马逊coding题。给定每包货物按重量的排序数组，nums = [1,8,9,10,7]，如果nums[i] < nums[i + 1]，那么可以将第
 * i包货物和第i + 1包货物合并到一起，否则就不可以。最终要返回最大的一包货物重量是多少。
 * 原排列: [1,8,9,10,7]
 * 第一次合并：[1,8,19,7]，9 和 10合并，因为这个组合是最大的
 * 第二次合并：[1, 27, 7], 8 和 19 合并，因为这个组合是最大的
 * 第三次合并：[28, 7] 1 和 27 合并
 * 第四次合并：不能再合并了，因为 28 > 7;
 * 返回28
 * 举例2：[20, 8, 7, 5]
 * 第一次合并：不能合并，没有满足nums[i] < nums[i + 1]的组合。
 * 思路：可能是贪心算法。只想到了暴力解法，递归给定函数，构造临时获取最大子组合的函数，每次都返回最大和与下标。
 * 	判断边界是首个元素为最大时，中断递归，或者当前元素是个完全递减元素中断递归。
**/
function packageWeight(nums) {
	if (!nums || !nums.length) return 0;
	if (nums.length < 2) return nums[0];
	const [max, begin] = maxSubArray(nums);
	nums.splice(begin, 2, max);
	if (isDescendArray(nums)) {
		return max;
	}
	return packageWeight(nums);
}
function maxSubArray(nums) {
	let max = nums[0];
	let begin = 0;
	for (let i = 1; i < nums.length; i++) {
		if (nums[i] > nums[i - 1]) {
			let temp = nums[i] + nums[i - 1];
			if (temp > max) {
				begin = i - 1;
				max = temp;
			}
		}
	}
	return [max, begin];
}
function isDescendArray(arr) {
	let res = true;
	const copy = [...arr];
	let prev = copy.shift();
	while(copy.length && res) {
		let temp = copy.shift();
		if (prev <= temp) {
			res = false
		} else {
			prev = temp;
		}
	}
	return res;
}
/**
 * 亚马逊：子数组范围和
 * 给定一个整数数组nums，子数组的范围是子数组中最大元素和最小元素的差值。返回nums中所有子数组范围的和。
 * 输入：nums = [1,2,3]
 * 输出：4
 * 解释：nums 的 6个子数组如下：
 * [1] 范围 = 最大 - 最小 = 1 - 1 = 0;
 * [2] 范围 = 最大 - 最小 = 2 - 2 = 0;
 * [3] 范围 = 最大 - 最小 = 3 - 3 = 0；
 * [1,2] 范围 = 最大 - 最小 = 2 - 1 = 1；
 * [2,3] 范围 = 最大 - 最小 = 3 - 2 = 1;
 * [1,2,3] 范围 = 最大 - 最小 = 3 - 1 = 2；
 * 所有子数组范围和是：0 + 0 + 0 + 1 + 1 + 2 = 4;
 * 思路：
 * 	- 暴力法，遍历i，由 i 作为开始，j = i + 1; j++ 作为结尾，组成所有的子数组，在遍历的过程中，记录最大，最小值，得到范围和。
 *    最终将范围和合并。
 *    由 [i, ...j] 组成的数组，会涵盖每一个子数组，复杂度较高。但是不需要从子数组中查找最大最小值，在遍历的时候保存起来就好了。
**/
var subArrayRanges = function(nums) {
    if (!nums || !nums.length) return 0;
    // 遍历构造nums中所有可能存在的子数组，找到他们的范围和，相加。
    // 根据定义，单个元素的子数组，范围和是0，所以就没必要列举单个元素了。
    let res = 0;
    const length = nums.length;
    for (let i = 0; i < length; i++) {
        // max 不能用 Number.MIN_VALUE，因为 MIN_VALUE 是TMD正数
        let min = Number.MAX_VALUE;
        let max = -Number.MAX_VALUE;
        for (let j = i + 1; j < length; j++) {
            min = Math.min(nums[j], nums[i], min);
            max = Math.max(nums[j], nums[i], max);
            res += max - min;
        }
    }
    return res;
};

/**
 * 9. 回文数
 * 取余加，翻转数字。翻转一半即可，不需要翻转全部。
**/
function isPalindrome(x) {
	if (x < 10 && x >= 0) {
		return true;
	}
	if (!x || x < 0 || x % 10 === 0) return false;
	let reverse = 0;
	while (x > reverse) {
		let t = x % 10; // 个位
		reverse = reverse * 10 + t;
		x = Math.floor(x / 10);
	}
	// 需要分x是奇数还是偶数判断
	// 对于偶数来说，123321 ===> x: 123, reverse: 123;
	// 对于奇数来说，12321 ===> x: 12, reverse: 123; 需要对reverse去掉尾数
	return x === reverse || x === Math.floor(reverse / 10);
}

/**
 * 10. 正则表达式
 * 动态规划做
**/
var isMatch = function(s, p) {
    if (!s || !p) {
        return false;
    }
    const sLen = s.length, pLen = p.length;
    const dp = new Array(sLen + 1).fill(0).map(() => new Array(pLen + 1).fill(false));
    dp[0][0] = true; // 都为空的时候，匹配OK；
    for (let j = 1; j <= pLen; j++) {
        if (p[j - 1] === '*') {
            dp[0][j] = dp[0][j - 2];
        }
    }
    for (let i = 1; i <= sLen; i++) {
        for (let j = 1; j <= pLen; j++) {
            // 两个位置的字符相同，那么当前状态取决于上一个字符匹配到大状态
            if (s[i - 1] === p[j - 1] || p[j - 1] === '.') {
                dp[i][j] = dp[i - 1][j - 1];
            // 否则如果p的字符是 *，那么需要进一步判断*的前面是值与s[i - 1]是否匹配
            } else if (p[j - 1] === '*') {
                // 如果 * 前面的字符与s的字符相同，那么当前状态取决于s[i - 2]以上的字符
                if (p[j - 2] === s[i - 1] || p[j - 2] === '.') {
                    dp[i][j] = dp[i][j - 2] || dp[i - 1][j - 2] || dp[i - 1][j];
                } else {
                    dp[i][j] = dp[i][j - 2];
                }
            }
        }
    }
    return dp[sLen][pLen];
};

/**
 * 11. 盛最多水的容器
 * 给定一个长度是n的证书数组height，求以height数组元素大小为高度，可以组成一个容器，使得其能称最多的水。
 * 思路：
 * 	- 由元素的大小定为容器的高度，容器盛水的多少决定于容器的高度 h * 容器底部的宽度（直径），假设两个元素的nums[left], nums[right]
 *    组成了容器的两条边，那么盛水的多少决定于 Math.min(nums[left], nums[right]) * (right - left)，实际上就是面积的大小。
 * 	  所以问题变成了，原数组中，任意取两个元素出来，组成的面积最大
 * - 方法1：暴力解法，从索引 0 开始循环，两轮循环后，可以得到任意两个元素组成的面积大小，取最大的即可。时间复杂度是O(n2)，会导致用以超时。
 * - 方法2：优化为双指针，指针left和指针right，分别从数组的两边开始，如果nums[left] < nums[right]，那么右移left指针，否则左移right
 * 	 指针，因为，决定盛水多少的因素还有height的大小，height的高度也是一个重要的因素，假设取了小的那个值，即left固定，那么随着right的左移，
 *   盛的水只能是越来越少，得不到最大的值，所以要右移left，使得left尽可能增大。所以，时间复杂度降为O(n)，最坏情况是遍历一遍数组的长度。
**/ 
var maxArea = function(height) {
    if (!height || !height.length) return 0;
    let max = 0;
    const length = height.length;
    // 暴力，取面积最大的，时间复杂度n的平方，会超时。
    // for (let left = 0; left < length - 1; left++) {
    //     for (let right = length - 1; right > left; right--) {
    //         max = Math.max(max, (right - left) * Math.min(height[left], height[right]));
    //     }
    // }
    // return max;
    // 双指针方式
    let left = 0, right = length - 1;
    while (left < right) {
        max = Math.max(max, (right - left) * Math.min(height[left], height[right]));
        if (height[left] < height[right]) {
            left += 1;
        } else {
            right -= 1;
        }
    }
    return max;
};
/**
 * 12. 整数转罗马数字
 * 已知阿拉伯数字对罗马数字的关系，罗马数字包括7中特殊字符：I， V， X， L，C，D 和 M。其中：
 * 	I             1
 *	V             5
 *	X             10
 *	L             50
 *	C             100
 *	D             500
 *	M             1000
 * I 可以放在 V (5) 和 X (10) 的左边，来表示 4 和 9
 * X 可以放在 L (50) 和 C (100) 的左边，来表示 40 和 90
 * C 可以放在 D (500) 和 M (1000) 的左边，来表示 400 和 900
 * 给出一个证书，将其转换为罗马数字。1 <= num <= 3999。
 * 思路：
 *  - 罗马数字总是由最大的值和最小的值相累加。如549，罗马数字是：D(500)XL(40)IX(9)，所以需要将特殊的组合整理出来。
 * 	I和V的组合其实并没有完整的规律，其他数字的组合也是只有在9、4开始的有特殊规律，不借助字符串分割，是没有好的办法拿到规律的。
 *  一个个判断的话，代码上面会比较难看。所以需要借助映射关系，整理完整的特殊数字对字符的映射表。
 * 一、整理特殊数字和字符的映射二维数组：
 * [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
 * 之后遍历表，去除特殊的数字映射与num相减，如果 num 大于 当前的数字（可以认为是整数）的话，那么将整数拼入结果，直到条件不成立为止。
 * 当 num 小于等于0时，退出循环，得到结果。
**/ 
var intToRoman = function(num) {
    if (!num) return 0;
    // 简历特殊关系的映射
    const valueMap = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
    const roman = [];
    for ([value, mark] of valueMap) {
        while (num >= value) {
            roman.push(mark);
            num -= value;
        }
        if (num <= 0) {
            return roman.join('');
        }
    }
};
/**
 * 同样需要建立完整的映射表，不同的是，需要将所有可能用到的数组按千位、百位、十位、个位，分别列举出 1 ~ 9 所表示的字符。
 * 之后使用求磨、整除的方式，得到对应位置的数字，转换为特殊的字符。
**/ 
function intToRoman(num) {
    const thounds = ['', 'M', 'MM', 'MMM', 'MMMM'];
    const hunders = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM'];
    const tens = ['', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC'];
    const ones = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
    const t = Math.floor(num / 1000);
    const h = Math.floor(num / 100) % 10;
    const ten = Math.floor(num / 10) % 10;
    const o = num % 10;
    return [thounds[t], hunders[h], tens[ten], ones[o]].join('');
}
/**
 * 70. 爬楼梯。
 * 假设你正在爬楼梯。需要 n 阶你才能到达楼顶。每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？
 * 输入：n = 2
 * 输出：2
 * 解释：有两种方法可以爬到楼顶。
 * 1. 1 阶 + 1 阶
 * 2. 2 阶
 * 输入：n = 3;
 * 输出：3；
 * 1. 1 1 1；
 * 2. 1 2；
 * 3. 2 1；
 * 思路：
 * 	- 一开始是没有思路的。可以先列举出前几个数值的集几种走法看看。
 *  阶     走法数
 *  1 ----- 1
 *  2 ----- 2
 *  3 ----- 3
 *  4 ----- 5 = 1+1+1+1, 2+1+1, 1+1+2, 1+2+1, 2+2
 *  5 ----- 8 = 1+1+1+1, 2+1+1+1, 1+2+1+1, 1+1+2+1, 1+1+1+2, 2+2+1, 2+1+2, 1+2+2
 *  6 ----- 13 = 1+1+1+1+1+1, 2+1+1+1+1, 1+2+1+1+1, 1+1+2+1+1, 1+1+1+2+1, 1+1+1+1+2, 2+2+1+1, 2+1+2+1, 2+1+1+2,
 * 				 1+2+2+1, 1+2+1+2, 1+1+2+2, 2+2+2
 *  ...
 * 仔细观察走法数排成的梳理，[0, 1, 2, 3(2+1), 5(3+2),8(5+3), 13(8+5)]，出第1、2项外，后面的第n项值，等于第(n - 2) + (n - 1)
 * 所以对于最后一个台阶n，走法数等于第 n - 1 个与第 n - 2 个的和。
 * 从动态规划的角度上理解，到达第n个台阶，有两种走法，从第 n-1 个，走一步到达，或者从第 n-2 个台阶走两步到达，问题可以转换成，求到达第n-1
 * 和第n-2个台阶的方法数。所以第n个台阶的走法有 n - 1 + n - 2;
**/
function climbStairs(n) {
	if (n < 2) return n;
	const dp = [1,1]; // 为了保证从第2个台阶数等于第1个和第0个这个规律，构造这样的初始化数组
	for (let i = 2; i <= n; i++) {
		dp[i] = dp[i - 1] + dp[i - 2];
	}
	return dp[n];
}
/**
 * 上面的解法额外占用了dp的空间，这个空间是n平方，实际上这个空间是可以优化掉的，使用的方法是滑动数组
 * 原理是，对于n，求出n的值后，n - 1 和 n - 2的值就不会再占用，所以没必要存着了。
**/
function climbStairs(n) {
	if (n < 2) return n;
	let p = 0, q = 0, r = 1;
	for (let i = 1; i <= n; i++) {
		q = r;
		p = q;
		r = p + q;
	}
	return r;
}

/**
 * 13. 罗马数字转阿拉伯数字
 * 尝试将罗马数字转为阿拉伯数字。
 * 输入：'III'
 * 输出：3
 * 输入：'IV'
 * 输出：4
 * 输入：'LVIII'
 * 输出：58
 * 思路：
 * 	- 观察罗马数字的构成，其实每1个或两个构成一个单元，单元对应固定的数字，如 IV 对应 4，IX对应9
 *    CM对应900等。本着这个思路，构建一个包含1、2个单元的罗马数字单元与数字的映射关系表。对于像DC
 *    为600，LX为60这种，就不需要列入了，因为L为50，X为10，那么LX可以用L+X解决就可以了。
 *  - while循环罗马数字，遇到两位的，i += 2; 否则 i += 1;
**/
var romanToInt = function(s) {
    if (!s || !s.length) return 0;
    const map = {
        'M': 1000,
        'C': 100,
        'CD': 400,
        'D': 500,
        'CM': 900,
        'X': 10,
        'XL': 40,
        'L': 50,
        'XC': 90,
        'I': 1,
        'IV': 4,
        'V': 5,
        'IX': 9,
    };
    let res = 0;
    let i = 0;
    const length = s.length;
    while (i < length) {
        if (map[s[i]] && map[s[i] + s[i + 1]]) {
            res += map[s[i] + s[i + 1]];
            i += 2;
        } else {
            res += map[s[i]];
            i += 1;
        }
    }
    return res;
};
/**
 * 思路2：观察罗马数字，组合形式的特殊字符，XI和IX，X是10，I放在左边就是9，右边就是11，继续观察其他的组合，XL为40，LX为60，
 * 可以理解为，小数字放在大的整数（5、10、50、100）的左边，表示减，放在右边，表示加。用这个思路，只需要建立几种单个字符的映射
 * 关系就可以了。
**/
function romanToInt(s) {
	const map = {
		'I': 1,
		'V': 5,
		'X': 10,
		'L': 50,
		'C': 100,
		'D': 500,
		'M': 1000,
	};
	const length = s.length;
	const res = 0;
	for (let i = 0; i < length; i++) {
		// i 不是最后一位，最后一位就没有左右之分了，只能是左边了。
		// 左边的小，那么就右边减左边，如：IX = 9，就表示 X(10) - I(1) = IX(9); 所以和就需要把当前位置的减去。
		if (i < length - 1 && map[s[i]] < map[s[i + 1]]) {
			res -= map[s[i]];
		} else {
			res += map[s[i]];
		}
	}
	return res;
}

/**
 * 14. 最长公共前缀。
 * 编写一个函数来查找字符串数组中的最长公共前缀。如果不存在公共前缀，返回空字符串 ""。
 * 思路：
 * 	- 纵向比较，先找出最短的那个字符串 minStr, 拿出 minStr 的每i项，去和所有数组中的第i项比较，相同则保存，一但有不同，则退出所有循环
**/ 
var longestCommonPrefix = function(strs) {
    let index = 0;
    let minLen = strs[index].length;
    const len = strs.length;
    for (let i = 0; i < strs.length; i++) {
        if (strs[i].length < minLen) {
            minLen = strs[i].length;
            index = i;
        }
    }
    let res = '';
    for (let i = 0; i < minLen; i++) {
        const start = strs[index][i];
        let isSame = true;
        for (let j = 0; j < len; j++) {
            const str = strs[j];
            if (str[i] !== strs[index][i]) {
                isSame = false;
                break;
            }
        }
        if (isSame) {
            res += start;
        } else {
            break;
        }
    }
    return res;
};

/**
 * 15. 三数之和
**/ 
var threeSum1 = function(nums) {
    if (!nums || !nums.length) return [];
    // 三重循环，固定一个元素，循环其他两个元素，找到结果。为了方便比较且避免重复，需要对数据排序
    // 排序之后，相同的元素会顺序排在一起
    nums = nums.sort((a, b) => a - b);
    const length = nums.length;
    const res = [];
    for (let i = 0; i < length; i++) {
        const first = nums[i];
        if (i === 0 || first === nums[i - 1]) continue;
        for (let j = i + 1; j < length; j++) {
            const second = nums[j];
            if (j !== i + 1 && second === nums[j - 1]) continue;
            for (let k = j + 1; k < length; k++) {
                const third = nums[k];
                // 不和前一项相同, 并且不是上一轮的下一个，避免 -1,-1,2这种的被跳过
                if (k !== j + 1 && third === nums[k - 1]) continue;
                if (first + second + third === 0) {
                    res.push([first, second, third]);
                }
            }
        }
    }
    return res;
};

// 双指针法，固定a，让b和c分别从左右两端循环
function threeSum(nums) {
    if (!nums || !nums.length) return [];
    nums = nums.sort((a, b) => a - b);
    const length = nums.length;
    const res = [];
    for (let i = 0; i < length; i++) {
        // 固定值被枚举过的，不需要再参与枚举了
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        const target = 0 - nums[i];
        let k = length - 1; // 右边的指针 j
        for (let j = i + 1; j < length; j++) {
            // 同理，nums[j]作为固定被枚举过，就不再枚举
            if (j > i + 1 && nums[j] === nums[j - 1]) continue;
            // 右侧指针保证在右侧，因为是右侧指针从大往下排，nums[i] + nums[j] + nums[k] 只有 大于0，小于0，等于0
            // 这三种情况，对应的k越靠右，三者和越有可能大于0，那么需要递减，与大于0比较，大于0则递减，小于0，退出。
            // !!! nums[j] + nums[k] 小于target时，说明左边的的太小，需要往右移，即j太小了
            while (k > j && nums[j] + nums[k] > target) {
                k -= 1;
            }
            // 如果k与j重合，那么，k和j的继续增大已经没有意义了，结果肯定是大于target的
            if (j === k) break;
            // 等于结果，就是要的答案了。
            if (nums[k] + nums[j] === target) {
                res.push([nums[i], nums[j], nums[k]]);
            }
        }
    }
    return res;
}
/**
 * 16. 最接近的三数之和
 * 给定长度为n的整数数组nums，和一个目标值target。在nums中找出三个数，使得其和最接近 target，返回这三个数的和。
 * 思路：
 * 1. 暴力算法，三轮循环，分别固定三个值，找三个数之和与target的差的绝对值，最小者即为要求的值。
 * 2. 双指针法。优化暴力法，先对原数组排序，固定第一个数，剩余两个数从左右两边分别递增递减，左指针小于右指针时，求三数之和与target的差值
 * 	  最小者为最接近的，保存三数坐标
**/ 
var threeSumClosest = function(nums, target) {
    // 双指针
    if (!nums || !nums.length) return 0;
    const n = nums.length;
    // 排序
    let closest = Number.MAX_VALUE;
    let res = 0;
    nums = nums.sort((a, b) => a - b);
    for (let i = 0; i < n; i++) {
        const first = nums[i];
        let j = i + 1, k = n - 1;
        while (j < k) {
            const second = nums[j];
            const third = nums[k];
            const sum = first + second + third;
            const temp = Math.abs(target - sum);
            if (temp < closest) {
                res = sum;
                closest = temp;
            }
            if (sum > target) {
                k -= 1;
            } else if (sum < target) {
                j += 1;
            } else {
                return target;
            }
        }
    }
    return res;
};
/**
 * 17. 电话号码号码的字母组合。
 * 给定一个电话号码的键盘，数字2 - 9分别对应的不同字母：2: abc, 3: def, 4: ghi, 5: jkl, 6: mno, 7: pqrs, 8: tuv, 9: wxyz。
 * 给定一个2-9的数字字符串，返回所有可能组成的字母组合。
 * @思路
 * 回溯，从第一层开始循环，每次进入一层后，参数 i 自增 1，当层数增加到输入长度时，说明已经递归最深的那一层上，那么就可以将当前匹配到的字符
 * 放入结果中，否则继续深入。这里将没有将第一层拿出来，因为第一层也符合循环的方法。意思是从第 0 层开始。
**/
function letterCombinations(digits) {
	// '234'
	const map = ['', '', 'abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz'];
	if (!digits || !digits.length) return [];
	if (digits.length === 1) return map[digits[0]].split('');
	const length = digits.length;
	const res = [];
	// str 表示当前匹配到的组合字符，i 表示 level，即层数
	const dfs = (str, i) => {
		// 到最后一层，直接推入结果
		if (i === digits.length) {
			res.push(str);
			return;
		}
		const curNum = digits[i]; // 当前的数字，2\3\4
		const letters = map[curNum]; // 拿到对应的字母 'def' 等；
		for (let letter of letters) {
			// i + 1 表示继续深入一层
			dfs(str + letter, i + 1);
		}
	}
	// 这里是入口，从第 0 层入手，第 0 层是虚构出来的一层，任何输入都没有。
	dfs('', 0);
	return res;
}
/**
 * @队列方法 ⭐️⭐️⭐️⭐️⭐️
 * 同样是回溯，不同的是利用队列原理。
 * 维护一个队列。最初队列输入空字符串作为开始，之后将 digits 按顺序找到对应的字符串作为下一层当的字符串。
 * 当前字符串出列，作为构建下一层字符串的母串，拼入下一层输入字符串，入列。队列长度更新，循环继续进入下一层。
 */
function letterCombinations2(digits) {
	if (!digits || !digits.length) return [];
	if (digits.length === 1) return map[digits[0]].split('');
	const queue = []; // 定义队列
	const map = ['', '', 'abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz'];
	queue.push(''); // 队列开始
	// 循环数字 '234'
	for (let i = 0; i < digits.length; i++) {
		// 当前层的字符个数
		const curLevelSize = queue.length;
		for (let j = 0; j < curLevelSize; j++) {
			const cur = queue.shift(); // 从顶部出列
			const letters = map[digits[i]]; // 一层
			for (let letter of letters) {
				queue.push(cur + letter); // 拼入当前字符，入栈
			}
		}
	}
	return queue;
}
