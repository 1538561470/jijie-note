/* ========================================
 * services/task.js — 任务数据服务
 * 参考: openspec/specs/task-management.md
 * ======================================== */

const { EXP_PER_TASK } = require('../utils/constants');

const STORAGE_KEY = 'tasks';

/**
 * 获取所有任务
 * @returns {Promise<Array>}
 */
function getTasks() {
  const tasks = wx.getStorageSync(STORAGE_KEY) || [];
  return Promise.resolve(tasks);
}

/**
 * 按分类获取任务
 * @param {string} category
 * @returns {Promise<Array>}
 */
function getTasksByCategory(category) {
  return getTasks().then(tasks =>
    tasks.filter(t => t.category === category)
  );
}

/**
 * 获取待完成任务
 * @returns {Promise<Array>}
 */
function getPendingTasks() {
  return getTasks().then(tasks =>
    tasks.filter(t => !t.completed)
  );
}

/**
 * 创建任务
 * @param {object} data - { title, note, priority, category }
 * @returns {Promise<object>}
 */
function createTask(data) {
  const tasks = wx.getStorageSync(STORAGE_KEY) || [];
  const task = {
    id: generateId(),
    userId: '',
    title: data.title,
    note: data.note || '',
    priority: data.priority || 'mid',
    category: data.category || '生活',
    type: 'task',
    completed: false,
    completedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tasks.unshift(task);
  wx.setStorageSync(STORAGE_KEY, tasks);
  return Promise.resolve(task);
}

/**
 * 完成任务
 * @param {string} taskId
 * @returns {Promise<object>}
 */
function completeTask(taskId) {
  const tasks = wx.getStorageSync(STORAGE_KEY) || [];
  const task = tasks.find(t => t.id === taskId);
  if (!task) return Promise.reject(new Error('任务不存在'));
  task.completed = true;
  task.completedAt = new Date().toISOString();
  task.updatedAt = new Date().toISOString();
  wx.setStorageSync(STORAGE_KEY, tasks);
  return Promise.resolve(task);
}

/**
 * 取消完成任务
 * @param {string} taskId
 * @returns {Promise<object>}
 */
function uncompleteTask(taskId) {
  const tasks = wx.getStorageSync(STORAGE_KEY) || [];
  const task = tasks.find(t => t.id === taskId);
  if (!task) return Promise.reject(new Error('任务不存在'));
  task.completed = false;
  task.completedAt = null;
  task.updatedAt = new Date().toISOString();
  wx.setStorageSync(STORAGE_KEY, tasks);
  return Promise.resolve(task);
}

/**
 * 更新任务
 * @param {string} taskId
 * @param {object} data
 * @returns {Promise<object>}
 */
function updateTask(taskId, data) {
  const tasks = wx.getStorageSync(STORAGE_KEY) || [];
  const task = tasks.find(t => t.id === taskId);
  if (!task) return Promise.reject(new Error('任务不存在'));
  Object.assign(task, data, { updatedAt: new Date().toISOString() });
  wx.setStorageSync(STORAGE_KEY, tasks);
  return Promise.resolve(task);
}

/**
 * 删除任务
 * @param {string} taskId
 * @returns {Promise<void>}
 */
function deleteTask(taskId) {
  const tasks = wx.getStorageSync(STORAGE_KEY) || [];
  const idx = tasks.findIndex(t => t.id === taskId);
  if (idx === -1) return Promise.reject(new Error('任务不存在'));
  tasks.splice(idx, 1);
  wx.setStorageSync(STORAGE_KEY, tasks);
  return Promise.resolve();
}

/** 生成唯一 ID */
function generateId() {
  return 't_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

module.exports = {
  getTasks,
  getTasksByCategory,
  getPendingTasks,
  createTask,
  completeTask,
  uncompleteTask,
  updateTask,
  deleteTask,
};
