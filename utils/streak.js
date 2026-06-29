/* ========================================
 * utils/streak.js — 连续天数计算
 * 参考: openspec/specs/habit-tracking.md §4
 *        openspec/design.md §4.2
 * ======================================== */

const { formatDate, parseDate, addDays, today } = require('./date');
const { STREAK_TITLES, STREAK_EXP_REWARDS } = require('./constants');

/**
 * 判断某天是否为活跃频率日
 * @param {Date} date
 * @param {{ type: string, days?: number[] }} frequency
 * @returns {boolean}
 */
function isActiveDay(date, frequency) {
  if (!frequency || frequency.type === 'daily') return true;

  // weekday: 周一至周五
  if (frequency.type === 'weekday') {
    const dow = date.getDay();
    return dow >= 1 && dow <= 5;
  }

  // custom: 指定星期几 (1=周一, 7=周日)
  if (frequency.type === 'custom' && frequency.days) {
    const dow = date.getDay();
    const adjusted = dow === 0 ? 7 : dow;
    return frequency.days.includes(adjusted);
  }

  return false;
}

/**
 * 计算单个习惯的连续打卡天数
 * @param {Array<{date: string, count: number}>} records - 打卡记录
 * @param {string} todayStr - 今日日期 'YYYY-MM-DD'
 * @param {{ type: string, days?: number[] }} frequency - 频率配置
 * @returns {number} 连续天数
 */
function calcStreak(records, todayStr, frequency) {
  if (!records || records.length === 0) return 0;

  const recordMap = new Map();
  records.forEach(r => recordMap.set(r.date, r.count));

  let streak = 0;
  const current = parseDate(todayStr);

  // 从今天开始向前追溯
  while (true) {
    const dateStr = formatDate(current);
    const count = recordMap.get(dateStr) || 0;
    const isActive = isActiveDay(current, frequency);

    // 如果今天是活跃日但未打卡 -> 断点
    if (isActive && count <= 0) break;

    // 活跃日且已打卡 -> 连续+1
    if (isActive && count > 0) streak++;

    // 非活跃日 -> 不影响连续计数，继续向前
    current.setDate(current.getDate() - 1);
  }

  return streak;
}

/**
 * 获取连续天数对应的称号
 * @param {number} streak
 * @returns {string|null}
 */
function getStreakTitle(streak) {
  // 从高到低匹配
  const thresholds = Object.keys(STREAK_TITLES)
    .map(Number)
    .sort((a, b) => b - a);

  for (const threshold of thresholds) {
    if (streak >= threshold) {
      return STREAK_TITLES[threshold];
    }
  }
  return null;
}

/**
 * 计算称号奖励经验值（首次达到才发放）
 * @param {number} streak - 当前连续天数
 * @param {Array<number>} claimedMilestones - 已领取的里程碑
 * @returns {number} 应发放的经验值
 */
function calcStreakReward(streak, claimedMilestones) {
  const claimed = new Set(claimedMilestones || []);
  let reward = 0;

  const milestones = Object.keys(STREAK_EXP_REWARDS).map(Number).sort((a, b) => a - b);
  for (const m of milestones) {
    if (streak >= m && !claimed.has(m)) {
      reward += STREAK_EXP_REWARDS[m];
    }
  }
  return reward;
}

/**
 * 获取最长连续天数
 * @param {Array<{date: string, count: number}>} records
 * @param {{ type: string, days?: number[] }} frequency
 * @returns {number}
 */
function calcLongestStreak(records, frequency) {
  if (!records || records.length === 0) return 0;

  // 按日期排序
  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));

  let longest = 0;
  let current = 0;

  for (let i = 0; i < sorted.length; i++) {
    const d = parseDate(sorted[i].date);
    if (sorted[i].count > 0 && isActiveDay(d, frequency)) {
      if (i === 0) {
        current = 1;
      } else {
        const prev = parseDate(sorted[i - 1].date);
        const diff = (d - prev) / (1000 * 60 * 60 * 24);

        // 检查中间是否有未打卡的活跃日
        let missed = false;
        if (diff > 1) {
          for (let j = 1; j < diff; j++) {
            const check = new Date(prev);
            check.setDate(check.getDate() + j);
            if (isActiveDay(check, frequency)) {
              missed = true;
              break;
            }
          }
        }
        current = missed ? 1 : current + 1;
      }
      if (current > longest) longest = current;
    } else {
      current = 0;
    }
  }

  return longest;
}

module.exports = {
  calcStreak,
  getStreakTitle,
  calcStreakReward,
  calcLongestStreak,
  isActiveDay,
  STREAK_TITLES,
  STREAK_EXP_REWARDS,
};
