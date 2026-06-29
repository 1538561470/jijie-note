/* ========================================
 * services/record.js — 打卡记录服务
 * 参考: openspec/specs/habit-tracking.md §2.2
 * ======================================== */

const { formatDate } = require('../utils/date');

const RECORD_STORAGE = 'checkin_records';

/**
 * 获取某习惯的所有打卡记录
 * @param {string} habitId
 * @returns {Promise<Array>}
 */
function getRecordsByHabit(habitId) {
  const records = wx.getStorageSync(RECORD_STORAGE) || [];
  return Promise.resolve(records.filter(r => r.habitId === habitId));
}

/**
 * 获取某日的所有打卡记录
 * @param {string} dateStr - 'YYYY-MM-DD'
 * @returns {Promise<Array>}
 */
function getRecordsByDate(dateStr) {
  const records = wx.getStorageSync(RECORD_STORAGE) || [];
  return Promise.resolve(records.filter(r => r.date === dateStr));
}

/**
 * 获取某习惯某日的打卡记录
 * @param {string} habitId
 * @param {string} dateStr
 * @returns {Promise<object|null>}
 */
function getRecord(habitId, dateStr) {
  const records = wx.getStorageSync(RECORD_STORAGE) || [];
  const record = records.find(r => r.habitId === habitId && r.date === dateStr);
  return Promise.resolve(record || null);
}

/**
 * 打卡 (count +1)
 * @param {string} habitId
 * @param {string} dateStr
 * @param {number} target - 目标次数（用于判断上限）
 * @returns {Promise<object>}
 */
function checkin(habitId, dateStr, target) {
  const records = wx.getStorageSync(RECORD_STORAGE) || [];
  let record = records.find(r => r.habitId === habitId && r.date === dateStr);

  if (record) {
    // 上限保护：不能超过 target * 2
    if (record.count >= target * 2) {
      return Promise.reject(new Error('已达到当日打卡上限'));
    }
    record.count += 1;
  } else {
    record = {
      id: generateId(),
      habitId,
      userId: '',
      date: dateStr,
      count: 1,
      createdAt: new Date().toISOString(),
    };
    records.push(record);
  }

  wx.setStorageSync(RECORD_STORAGE, records);
  return Promise.resolve(record);
}

/**
 * 取消打卡 (count -1)
 * @param {string} habitId
 * @param {string} dateStr
 * @returns {Promise<object>}
 */
function uncheckin(habitId, dateStr) {
  const records = wx.getStorageSync(RECORD_STORAGE) || [];
  const idx = records.findIndex(r => r.habitId === habitId && r.date === dateStr);

  if (idx === -1) return Promise.reject(new Error('无打卡记录'));

  records[idx].count -= 1;
  if (records[idx].count <= 0) {
    records.splice(idx, 1);
  }
  wx.setStorageSync(RECORD_STORAGE, records);
  return Promise.resolve(records[idx] || { count: 0 });
}

/**
 * 获取某月所有日期的打卡状态（用于月历）
 * @param {string} habitId
 * @param {number} year
 * @param {number} month - 1-12
 * @returns {Promise<object>} - { 'YYYY-MM-DD': count }
 */
function getMonthStatus(habitId, year, month) {
  const records = wx.getStorageSync(RECORD_STORAGE) || [];
  const prefix = `${year}-${String(month).padStart(2, '0')}-`;
  const status = {};

  records
    .filter(r => r.habitId === habitId && r.date.startsWith(prefix))
    .forEach(r => {
      status[r.date] = r.count;
    });

  return Promise.resolve(status);
}

function generateId() {
  return 'r_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

module.exports = {
  getRecordsByHabit,
  getRecordsByDate,
  getRecord,
  checkin,
  uncheckin,
  getMonthStatus,
};
