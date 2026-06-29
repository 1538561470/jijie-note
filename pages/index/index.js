/* pages/index/index.js */
/* 首页逻辑 — 参考: openspec/specs/home-dashboard.md */

const { today, formatDate, currentHour, monthNameCN, dayNameCN } = require('../../utils/date');
const { getGreeting, EXP_PER_TASK, EXP_PER_CHECKIN } = require('../../utils/constants');
const { getFullGanzhi, getYiji } = require('../../utils/ganzhi');
const { calcStreak, getStreakTitle } = require('../../utils/streak');
const taskService = require('../../services/task');
const habitService = require('../../services/habit');
const recordService = require('../../services/record');
const userService = require('../../services/user');

Page({
  data: {
    greeting: '',
    solarDate: '',
    ganzhiDisplay: '',
    yijiData: { yi: [], ji: [] },
    totalTasks: 0,
    pendingTasks: 0,
    todayHabitsStr: '0/0',
    items: [],
    loading: true,
    drawerVisible: false,
    toastVisible: false,
    toastMessage: '',
  },

  onLoad() {
    this.loadPageData();
  },

  onShow() {
    this.refreshData();
  },

  /** 页面下拉刷新 */
  onPullDownRefresh() {
    this.refreshData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  /** 加载页面初始化数据（问候、日期、宜忌 — 这些不变） */
  loadPageData() {
    const now = new Date();
    const hour = currentHour();
    const todayStr = today();
    const { wuxing, ganzhiDisplay: gz } = getFullGanzhi(todayStr);
    const yiji = getYiji(wuxing);

    this.setData({
      greeting: getGreeting(hour),
      solarDate: monthNameCN(now.getMonth() + 1) + dayNameCN(now.getDate()),
      ganzhiDisplay: gz,
      yijiData: yiji,
    });
  },

  /** 刷新动态数据 */
  async refreshData() {
    this.setData({ loading: true });
    try {
      const [tasks, habits] = await Promise.all([
        taskService.getTasks(),
        habitService.getHabits(),
      ]);

      const totalTasks = tasks.length;
      const pendingTasks = tasks.filter(t => !t.completed).length;

      // 今日习惯数据
      const todayStr = today();
      const habitStatuses = await Promise.all(
        habits.map(h => recordService.getRecord(h.id, todayStr))
      );
      const checkedCount = habitStatuses.filter(r => r && r.count >= 0).length;
      const todayHabitsStr = `${checkedCount}/${habits.length}`;

      // 构建混合列表：未完成任务 + 习惯
      const items = [];
      const pendingTaskItems = tasks
        .filter(t => !t.completed)
        .map(t => ({ ...t, _itemType: 'task' }));

      const habitItems = await Promise.all(habits.map(async (h) => {
        const record = habitStatuses[habits.indexOf(h)];
        const count = record ? record.count : 0;
        const checked = count >= h.target;
        const allRecords = await recordService.getRecordsByHabit(h.id);
        const streak = calcStreak(allRecords, todayStr, h.frequency);
        return {
          ...h,
          _itemType: 'habit',
          _todayCount: count,
          _checked: checked,
          _streak: streak,
          _streakTitle: getStreakTitle(streak),
        };
      }));

      // 合并：任务优先，再按优先级
      items.push(...pendingTaskItems);
      items.push(...habitItems);

      this.setData({
        items,
        totalTasks,
        pendingTasks,
        todayHabitsStr,
        loading: false,
      });
    } catch (err) {
      console.error('加载首页数据失败:', err);
      this.setData({ loading: false });
      this.showToast('数据加载失败，请下拉重试');
    }
  },

  /** 切换任务完成状态 */
  async onToggleTask(e) {
    const { id } = e.detail;
    const task = this.data.items.find(t => t.id === id && t._itemType === 'task');
    if (!task) return;

    try {
      if (task.completed) {
        await taskService.uncompleteTask(id);
      } else {
        await taskService.completeTask(id);
        // 增加经验值
        await userService.addKoiExp(EXP_PER_TASK);
      }
      this.refreshData();
      this.showToast(task.completed ? '已取消完成' : '任务完成！+10exp');
    } catch (err) {
      this.showToast('操作失败，请重试');
    }
  },

  /** 习惯打卡 */
  async onCheckinHabit(e) {
    const { id } = e.detail;
    const habit = this.data.items.find(h => h.id === id && h._itemType === 'habit');
    if (!habit) return;

    try {
      const todayStr = today();
      await recordService.checkin(id, todayStr, habit.target);
      await userService.addKoiExp(EXP_PER_CHECKIN);
      this.refreshData();
      this.showToast('打卡成功！+5exp');
    } catch (err) {
      this.showToast(err.message || '打卡失败，请重试');
    }
  },

  /** 长按任务 */
  onLongPressTask(e) {
    const { id } = e.detail;
    wx.showActionSheet({
      itemList: ['编辑', '删除'],
      success: (res) => {
        if (res.tapIndex === 0) {
          // TODO: 打开编辑抽屉
        } else if (res.tapIndex === 1) {
          this.onDeleteTask(id);
        }
      },
    });
  },

  /** 删除任务 */
  async onDeleteTask(id) {
    const res = await new Promise(r => wx.showModal({
      title: '确认删除',
      content: '确定删除此任务？',
    }));
    if (!res.confirm) return;
    try {
      await taskService.deleteTask(id);
      this.refreshData();
      this.showToast('已删除');
    } catch (err) {
      this.showToast('删除失败，请重试');
    }
  },

  /** 点击宜忌项 */
  onTapYiji(e) {
    const { name } = e.detail;
    // 跳转到对应习惯打卡
    wx.switchTab({ url: '/pages/list/list' });
  },

  /** 概览卡片点击 */
  onStatsTap() {
    wx.switchTab({ url: '/pages/list/list' });
  },

  /** 打开添加抽屉 */
  onOpenDrawer() {
    this.setData({ drawerVisible: true });
  },

  /** 关闭添加抽屉 */
  onCloseDrawer() {
    this.setData({ drawerVisible: false });
  },

  /** 创建计划 */
  async onCreatePlan(e) {
    const { type, data } = e.detail;
    try {
      if (type === 'task') {
        await taskService.createTask(data);
        this.showToast('任务已创建');
      } else {
        await habitService.createHabit(data);
        this.showToast('习惯已创建');
      }
      this.setData({ drawerVisible: false });
      this.refreshData();
    } catch (err) {
      this.showToast('创建失败，请重试');
    }
  },

  /** Toast 工具 */
  showToast(message) {
    this.setData({ toastVisible: true, toastMessage: message });
  },

  onHideToast() {
    this.setData({ toastVisible: false });
  },
});
