/* ========================================
 * utils/date.js — 日期格式化工具
 * 参考: openspec/design.md
 * ======================================== */

/**
 * 格式化日期为 'YYYY-MM-DD'
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * 获取今日日期字符串 'YYYY-MM-DD'
 * @returns {string}
 */
function today() {
  return formatDate(new Date());
}

/**
 * 解析 'YYYY-MM-DD' 字符串为 Date
 * @param {string} dateStr
 * @returns {Date}
 */
function parseDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * 获取当前小时（用于问候语）
 * @returns {number} 0-23
 */
function currentHour() {
  return new Date().getHours();
}

/**
 * 日期加减天数
 * @param {string} dateStr - 'YYYY-MM-DD'
 * @param {number} days - 可为负数
 * @returns {string}
 */
function addDays(dateStr, days) {
  const d = parseDate(dateStr);
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

/**
 * 获取某月天数
 * @param {number} year
 * @param {number} month - 1-12
 * @returns {number}
 */
function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

/**
 * 获取某月第一天的星期几
 * @param {number} year
 * @param {number} month - 1-12
 * @returns {number} 0=周日
 */
function firstDayOfMonth(year, month) {
  return new Date(year, month - 1, 1).getDay();
}

/**
 * 获取某日期是星期几 (1=周一, 7=周日)
 * @param {string} dateStr - 'YYYY-MM-DD'
 * @returns {number}
 */
function dayOfWeek(dateStr) {
  const d = parseDate(dateStr);
  return d.getDay() === 0 ? 7 : d.getDay();
}

/**
 * 汉字数字月份显示
 * @param {number} month - 1-12
 * @returns {string}
 */
function monthNameCN(month) {
  const names = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
  return names[month] + '月';
}

/**
 * 汉字数字日期显示
 * @param {number} day - 1-31
 * @returns {string}
 */
function dayNameCN(day) {
  if (day <= 10) {
    const names = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    return names[day];
  }
  if (day < 20) return '十' + ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'][day - 10];
  if (day === 20) return '二十';
  if (day < 30) return '二十' + ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'][day - 20];
  if (day === 30) return '三十';
  return '三十' + ['', '一'][day - 30];
}

module.exports = {
  formatDate,
  today,
  parseDate,
  currentHour,
  addDays,
  daysInMonth,
  firstDayOfMonth,
  dayOfWeek,
  monthNameCN,
  dayNameCN,
};
