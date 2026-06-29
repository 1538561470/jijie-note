/* ========================================
 * utils/lunar.js — 农历转换
 * 参考: openspec/specs/lunar-calendar.md
 * ======================================== */

const { formatDate, parseDate, addDays } = require('./date');
const { getFullGanzhi } = require('./ganzhi');

// 加载预置农历数据
let lunarData = {};
try {
  lunarData = require('../assets/data/lunar-data.json');
} catch (e) {
  // 数据文件未就绪
}

/* ---- 农历月份名 ---- */
const LUNAR_MONTH_NAMES = ['', '正月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '冬月', '腊月'];

/* ---- 农历日期名 ---- */
const LUNAR_DAY_NAMES = [
  '', '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十',
];

/**
 * 根据公历日期获取农历日期
 * @param {string} dateStr - 'YYYY-MM-DD'
 * @returns {{ lunarYear: string, lunarMonth: string, lunarDay: string, ganzhi: string, wuxing: string }}
 */
function getLunarDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);

  // 获取干支信息（始终需要）
  const { dayPillar, wuxing } = getFullGanzhi(dateStr);

  // 尝试从预置数据查找农历
  const cached = lookupLunar(y, m, d);

  return {
    lunarYear: cached ? cached.lunarYear : `${y}年`,
    lunarMonth: cached ? cached.lunarMonth : LUNAR_MONTH_NAMES[m],
    lunarDay: cached ? cached.lunarDay : LUNAR_DAY_NAMES[d],
    ganzhi: `${dayPillar.ganzhi}日`,
    wuxing: `${wuxing}旺`,
  };
}

/**
 * 从预置农历数据中查找
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {object|null}
 */
function lookupLunar(year, month, day) {
  // 简化实现: 如数据存在则使用，否则 null
  if (!lunarData || !lunarData[String(year)]) return null;

  const yearData = lunarData[String(year)];
  // 累计天数确定农历月份和日期
  const dayOfYear = getDayOfYear(year, month, day);
  let remaining = dayOfYear;
  let lunarMonth = 1;
  let lunarDay = 1;

  for (let m = 1; m <= 12; m++) {
    const monthData = yearData.months[String(m)];
    if (!monthData) break;
    const daysInLunarMonth = monthData.days;

    if (remaining <= daysInLunarMonth) {
      lunarDay = remaining;
      lunarMonth = m;
      break;
    }
    remaining -= daysInLunarMonth;
  }

  return {
    lunarYear: `${year}年`,
    lunarMonth: LUNAR_MONTH_NAMES[lunarMonth],
    lunarDay: LUNAR_DAY_NAMES[lunarDay],
  };
}

/**
 * 获取一年中的第几天
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {number}
 */
function getDayOfYear(year, month, day) {
  const monthDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  // 闰年判断
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    monthDays[2] = 29;
  }
  let days = day;
  for (let i = 1; i < month; i++) {
    days += monthDays[i];
  }
  return days;
}

module.exports = {
  getLunarDate,
  LUNAR_MONTH_NAMES,
  LUNAR_DAY_NAMES,
};
