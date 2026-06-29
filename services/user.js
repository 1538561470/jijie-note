/* ========================================
 * services/user.js — 用户数据服务
 * 参考: openspec/specs/user-profile.md
 * ======================================== */

const db = wx.cloud ? wx.cloud.database() : null;
const COLLECTION = 'users';

/**
 * 获取当前用户信息
 * @returns {Promise<object>}
 */
function getUser() {
  if (!db) return Promise.reject(new Error('云开发未初始化'));
  // 简化：返回本地缓存
  return Promise.resolve(wx.getStorageSync('userInfo') || null);
}

/**
 * 更新用户信息
 * @param {object} data - { nickname, avatarUrl, ... }
 * @returns {Promise<void>}
 */
function updateUser(data) {
  return new Promise((resolve, reject) => {
    const userInfo = wx.getStorageSync('userInfo') || {};
    Object.assign(userInfo, data, { updatedAt: new Date() });
    wx.setStorageSync('userInfo', userInfo);
    resolve(userInfo);
  });
}

/**
 * 获取锦鲤经验值和等级
 * @returns {Promise<{exp: number, level: number}>}
 */
function getKoiExp() {
  const koi = wx.getStorageSync('koiData') || { exp: 0, level: 1 };
  return Promise.resolve(koi);
}

/**
 * 增加锦鲤经验值
 * @param {number} amount
 * @returns {Promise<{exp: number, level: number}>}
 */
function addKoiExp(amount) {
  const koi = wx.getStorageSync('koiData') || { exp: 0, level: 1 };
  koi.exp += amount;
  // 简易等级计算：每 100 经验升一级
  koi.level = Math.floor(koi.exp / 100) + 1;
  wx.setStorageSync('koiData', koi);
  return Promise.resolve(koi);
}

module.exports = {
  getUser,
  updateUser,
  getKoiExp,
  addKoiExp,
};
