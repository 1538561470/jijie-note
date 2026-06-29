/* components/calendar/index.js */

const { daysInMonth, firstDayOfMonth, today, dayOfWeek } = require('../../utils/date');

Component({
  properties: {
    year: {
      type: Number,
      value: new Date().getFullYear(),
    },
    month: {
      type: Number,
      value: new Date().getMonth() + 1,
    },
    /** 打卡状态映射: { 'YYYY-MM-DD': count } */
    checkStatus: {
      type: Object,
      value: {},
    },
    /** 目标次数 (count >= target 则日期打勾) */
    target: {
      type: Number,
      value: 1,
    },
  },

  data: {
    weekDays: ['日', '一', '二', '三', '四', '五', '六'],
    days: [],
  },

  lifetimes: {
    attached() {
      this.buildCalendar();
    },
  },

  observers: {
    'year, month, checkStatus, target'() {
      this.buildCalendar();
    },
  },

  methods: {
    buildCalendar() {
      const { year, month, checkStatus, target } = this.data;
      const totalDays = daysInMonth(year, month);
      const firstDay = firstDayOfMonth(year, month);
      const todayStr = today();

      const days = [];

      // 填充前置空白
      for (let i = 0; i < firstDay; i++) {
        days.push({ empty: true });
      }

      // 填充日期
      for (let d = 1; d <= totalDays; d++) {
        const m = String(month).padStart(2, '0');
        const dd = String(d).padStart(2, '0');
        const dateStr = `${year}-${m}-${dd}`;

        days.push({
          day: d,
          today: dateStr === todayStr,
          checked: (checkStatus[dateStr] || 0) >= target,
        });
      }

      this.setData({ days });
    },
  },
});
