/* ========================================
 * 素简 — 应用入口
 * 参考: openspec/design.md
 * ======================================== */

App({
  onLaunch() {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    this.globalData.systemInfo = systemInfo;
    this.globalData.statusBarHeight = systemInfo.statusBarHeight;

    // 初始化云开发
    if (wx.cloud) {
      wx.cloud.init({
        env: 'production-xxxx', // TODO: 替换为实际云环境 ID
        traceUser: true,
      });
    }

    // 检查登录态
    this.checkLogin();
  },

  /** 检查登录态 */
  checkLogin() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      this.login();
    }
  },

  /** 微信登录 */
  login() {
    wx.login({
      success: (res) => {
        if (res.code) {
          // TODO: 将 code 发送到云函数换取 openid
        }
      },
    });
  },

  globalData: {
    systemInfo: null,
    statusBarHeight: 0,
    userInfo: null,
  },
});
