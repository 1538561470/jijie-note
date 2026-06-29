/* pages/profile/profile.js */
/* 我的页面 — 参考: openspec/specs/user-profile.md, koi-growth-system.md */

const userService = require('../../services/user');
const syncService = require('../../services/sync');

/* 段位称号 */
const RANK_TITLES = {
  0: '潜龙勿用',
  1: '潜龙勿用',
  2: '潜龙勿用',
  3: '见龙在田',
  4: '见龙在田',
  5: '君子终日乾乾',
  6: '君子终日乾乾',
  7: '或跃在渊',
  8: '或跃在渊',
  9: '飞龙在天',
  10: '飞龙在天',
};

/* 升级所需累计经验值 */
const LEVEL_EXP = [0, 100, 250, 450, 750, 1100, 1600, 2300, 3200, 4500, 6500];

Page({
  data: {
    userInfo: {},
    koiLevel: 0,
    koiExp: 0,
    levelTitle: '潜龙勿用',
    expPercent: 0,
    nextLevelExp: 100,
    progressHint: '',
    themeName: '素简（默认）',
    lunarEnabled: true,
    toastVisible: false,
    toastMessage: '',
  },

  onShow() {
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData().then(() => wx.stopPullDownRefresh());
  },

  async loadData() {
    try {
      const [userInfo, koiData] = await Promise.all([
        userService.getUser(),
        userService.getKoiExp(),
      ]);

      const level = koiData.level || 0;
      const exp = koiData.exp || 0;
      const levelTitle = RANK_TITLES[level] || '潜龙勿用';

      // 计算经验百分比
      const currLevelExp = LEVEL_EXP[level] || 0;
      const nextLevelExp = LEVEL_EXP[level + 1] || LEVEL_EXP[10];
      const expInLevel = exp - currLevelExp;
      const needExp = nextLevelExp - currLevelExp;
      const expPercent = Math.min(Math.round((expInLevel / needExp) * 100), 100);

      // 进度提示
      let progressHint = '';
      if (level >= 10) {
        progressHint = '鱼跃龙门·已达化龙之境 🐉';
      } else {
        const remaining = needExp - expInLevel;
        progressHint = `尚需 ${remaining} 经验值升至 Lv.${level + 1}`;
      }

      this.setData({
        userInfo: userInfo || {},
        koiLevel: level,
        koiExp: exp,
        levelTitle,
        expPercent,
        nextLevelExp: needExp,
        progressHint,
      });
    } catch (err) {
      console.error('加载用户数据失败:', err);
    }
  },

  /** 菜单点击 */
  onTapMenu(e) {
    const { menu } = e.currentTarget.dataset;
    switch (menu) {
      case 'gallery':
        this.showToast('锦鲤图鉴（Phase 5 实现）');
        break;
      case 'rewards':
        this.showToast('等级奖励（Phase 5 实现）');
        break;
      case 'tags':
        this.showToast('计划标签管理（即将上线）');
        break;
      case 'theme':
        this.showToast('主题切换（即将上线）');
        break;
      case 'about':
        wx.showModal({
          title: '关于素简',
          content: '素简 v1.0.0\n融合中国传统文化的个人计划管理小程序\n以「素简」为核心理念',
          showCancel: false,
        });
        break;
    }
  },

  /** 农历开关 */
  onToggleLunar(e) {
    const lunarEnabled = e.detail.value;
    this.setData({ lunarEnabled });
    wx.setStorageSync('lunarEnabled', lunarEnabled);
  },

  /** 数据导出 */
  async onExportData() {
    try {
      const data = await syncService.exportData();
      this.showToast('数据已准备（导出功能即将上线）');
    } catch (err) {
      this.showToast('导出失败，请重试');
    }
  },

  showToast(message) {
    this.setData({ toastVisible: true, toastMessage: message });
  },

  onHideToast() {
    this.setData({ toastVisible: false });
  },
});
