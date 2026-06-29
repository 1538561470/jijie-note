/* ========================================
 * services/habit.js — 习惯数据服务
 * 参考: openspec/specs/habit-tracking.md
 * ======================================== */

const HABIT_STORAGE = 'habits';

/**
 * 获取所有习惯
 * @returns {Promise<Array>}
 */
function getHabits() {
  const habits = wx.getStorageSync(HABIT_STORAGE) || [];
  return Promise.resolve(habits);
}

/**
 * 按分类获取习惯
 * @param {string} category
 * @returns {Promise<Array>}
 */
function getHabitsByCategory(category) {
  return getHabits().then(habits =>
    habits.filter(h => h.category === category)
  );
}

/**
 * 创建习惯
 * @param {object} data - { name, target, unit, frequency, category }
 * @returns {Promise<object>}
 */
function createHabit(data) {
  const habits = wx.getStorageSync(HABIT_STORAGE) || [];
  const habit = {
    id: generateId(),
    userId: '',
    name: data.name,
    target: data.target || 1,
    unit: data.unit || '次',
    frequency: data.frequency || { type: 'daily' },
    category: data.category || '生活',
    type: 'habit',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  habits.unshift(habit);
  wx.setStorageSync(HABIT_STORAGE, habits);
  return Promise.resolve(habit);
}

/**
 * 更新习惯
 * @param {string} habitId
 * @param {object} data
 * @returns {Promise<object>}
 */
function updateHabit(habitId, data) {
  const habits = wx.getStorageSync(HABIT_STORAGE) || [];
  const habit = habits.find(h => h.id === habitId);
  if (!habit) return Promise.reject(new Error('习惯不存在'));
  Object.assign(habit, data, { updatedAt: new Date().toISOString() });
  wx.setStorageSync(HABIT_STORAGE, habits);
  return Promise.resolve(habit);
}

/**
 * 删除习惯
 * @param {string} habitId
 * @returns {Promise<void>}
 */
function deleteHabit(habitId) {
  const habits = wx.getStorageSync(HABIT_STORAGE) || [];
  const idx = habits.findIndex(h => h.id === habitId);
  if (idx === -1) return Promise.reject(new Error('习惯不存在'));
  habits.splice(idx, 1);
  wx.setStorageSync(HABIT_STORAGE, habits);
  // 同时删除相关打卡记录
  const records = wx.getStorageSync('checkin_records') || [];
  const filtered = records.filter(r => r.habitId !== habitId);
  wx.setStorageSync('checkin_records', filtered);
  return Promise.resolve();
}

/** 生成唯一 ID */
function generateId() {
  return 'h_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

module.exports = {
  getHabits,
  getHabitsByCategory,
  createHabit,
  updateHabit,
  deleteHabit,
};
