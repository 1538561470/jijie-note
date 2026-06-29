/* pages/list/list.js */
/* 清单·打卡页 — 参考: task-management.md §6.2, habit-tracking.md */

const { today, daysInMonth } = require('../../utils/date');
const { CATEGORIES, EXP_PER_TASK, EXP_PER_CHECKIN } = require('../../utils/constants');
const { calcStreak, getStreakTitle, calcLongestStreak } = require('../../utils/streak');
const taskService = require('../../services/task');
const habitService = require('../../services/habit');
const recordService = require('../../services/record');
const userService = require('../../services/user');

Page({
  data: {
    activeTab: 'tasks',
    sortBy: 'priority',
    loading: true,
    tasks: [],
    groupedTasks: [],
    habits: [],
    habitNames: [],
    selectedHabitIdx: 0,
    selectedHabit: null,
    calYear: new Date().getFullYear(),
    calMonth: new Date().getMonth() + 1,
    checkStatus: {},
    habitStreak: 0,
    longestStreak: 0,
    streakTitle: '',
    toastVisible: false,
    toastMessage: '',
  },

  onLoad() {
    const now = new Date();
    this.setData({
      calYear: now.getFullYear(),
      calMonth: now.getMonth() + 1,
    });
  },

  onShow() {
    this.refreshData();
  },

  onPullDownRefresh() {
    this.refreshData().then(() => wx.stopPullDownRefresh());
  },

  /** 刷新全部数据 */
  async refreshData() {
    this.setData({ loading: true });
    try {
      const [tasks, habits] = await Promise.all([
        taskService.getTasks(),
        habitService.getHabits(),
      ]);

      const habitNames = habits.map(h => h.name);
      const selectedHabit = habits[this.data.selectedHabitIdx] || null;

      let checkStatus = {};
      let habitStreak = 0;
      let longestStreak = 0;
      let streakTitle = '';

      if (selectedHabit) {
        const monthStr = String(this.data.calMonth).padStart(2, '0');
        const yearMonth = `${this.data.calYear}-${monthStr}`;
        // 获取当月全部打卡状态
        const totalDays = daysInMonth(this.data.calYear, this.data.calMonth);
        const records = await recordService.getRecordsByHabit(selectedHabit.id);
        checkStatus = {};
        records
          .filter(r => r.date.startsWith(yearMonth))
          .forEach(r => { checkStatus[r.date] = r.count; });

        const todayStr = today();
        habitStreak = calcStreak(records, todayStr, selectedHabit.frequency);
        longestStreak = calcLongestStreak(records, selectedHabit.frequency);
        streakTitle = getStreakTitle(longestStreak);
      }

      // 分组任务
      const grouped = this.groupTasks(tasks);

      this.setData({
        tasks,
        groupedTasks: grouped,
        habits,
        habitNames,
        selectedHabit,
        checkStatus,
        habitStreak,
        longestStreak,
        streakTitle,
        loading: false,
      });
    } catch (err) {
      console.error('加载清单数据失败:', err);
      this.setData({ loading: false });
      this.showToast('加载失败，请检查网络');
    }
  },

  /** 任务分组 */
  groupTasks(tasks) {
    const sorted = [...tasks].sort((a, b) => {
      // 已完成排在末尾
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      // 按优先级
      if (this.data.sortBy === 'priority') {
        const prioOrder = { high: 0, mid: 1, low: 2 };
        return prioOrder[a.priority] - prioOrder[b.priority];
      }
      // 按创建时间
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const groups = {};
    CATEGORIES.forEach(cat => { groups[cat] = []; });
    sorted.forEach(t => {
      const cat = t.category || '生活';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(t);
    });

    return Object.entries(groups)
      .filter(([, items]) => items.length > 0)
      .map(([category, items]) => ({ category, tasks: items }));
  },

  /** 切换 Tab */
  onSwitchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab });
  },

  /** 切换排序 */
  onSort(e) {
    const sortBy = e.currentTarget.dataset.sort;
    this.setData({ sortBy }, () => {
      this.setData({ groupedTasks: this.groupTasks(this.data.tasks) });
    });
  },

  /** 选择习惯 */
  onSelectHabit(e) {
    const idx = Number(e.detail.value);
    this.setData({ selectedHabitIdx: idx }, () => {
      this.refreshData();
    });
  },

  /** 切换任务完成状态 */
  async onToggleTask(e) {
    const { id } = e.detail;
    const task = this.data.tasks.find(t => t.id === id);
    if (!task) return;
    try {
      if (task.completed) {
        await taskService.uncompleteTask(id);
      } else {
        await taskService.completeTask(id);
        await userService.addKoiExp(EXP_PER_TASK);
      }
      this.refreshData();
    } catch (err) {
      this.showToast('操作失败，请重试');
    }
  },

  /** 长按任务 */
  onLongPressTask(e) {
    const { id } = e.detail;
    wx.showActionSheet({
      itemList: ['编辑', '删除'],
      success: async (res) => {
        if (res.tapIndex === 0) {
          // TODO: 编辑任务
        } else if (res.tapIndex === 1) {
          const cfm = await new Promise(r => wx.showModal({
            title: '确认删除', content: '确定删除此任务？',
          }));
          if (!cfm.confirm) return;
          try {
            await taskService.deleteTask(id);
            this.refreshData();
            this.showToast('已删除');
          } catch (err) {
            this.showToast('删除失败，请重试');
          }
        }
      },
    });
  },

  showToast(message) {
    this.setData({ toastVisible: true, toastMessage: message });
  },

  onHideToast() {
    this.setData({ toastVisible: false });
  },
});
