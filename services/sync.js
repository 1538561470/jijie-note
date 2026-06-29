/* ========================================
 * services/sync.js — 数据同步服务
 * 参考: openspec/design.md
 * ======================================== */

/**
 * 同步本地数据到云端
 * @returns {Promise<void>}
 */
function syncToCloud() {
  // TODO: 实现云数据库同步
  return Promise.resolve();
}

/**
 * 从云端拉取数据
 * @returns {Promise<void>}
 */
function syncFromCloud() {
  // TODO: 实现云数据库同步
  return Promise.resolve();
}

/**
 * 导出用户数据
 * @returns {Promise<object>}
 */
function exportData() {
  const data = {
    tasks: wx.getStorageSync('tasks') || [],
    habits: wx.getStorageSync('habits') || [],
    checkin_records: wx.getStorageSync('checkin_records') || [],
    koiData: wx.getStorageSync('koiData') || {},
    exportedAt: new Date().toISOString(),
  };
  return Promise.resolve(data);
}

/**
 * 导入用户数据
 * @param {object} data
 * @returns {Promise<void>}
 */
function importData(data) {
  if (data.tasks) wx.setStorageSync('tasks', data.tasks);
  if (data.habits) wx.setStorageSync('habits', data.habits);
  if (data.checkin_records) wx.setStorageSync('checkin_records', data.checkin_records);
  if (data.koiData) wx.setStorageSync('koiData', data.koiData);
  return Promise.resolve();
}

module.exports = {
  syncToCloud,
  syncFromCloud,
  exportData,
  importData,
};
