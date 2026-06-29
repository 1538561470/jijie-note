/* components/habit-card/index.js */

Component({
  properties: {
    habit: {
      type: Object,
      value: {},
    },
    count: {
      type: Number,
      value: 0,
    },
    checked: {
      type: Boolean,
      value: false,
    },
    streak: {
      type: Number,
      value: 0,
    },
    streakTitle: {
      type: String,
      value: '',
    },
  },

  methods: {
    /** 点击打卡 */
    onCheckin() {
      this.triggerEvent('checkin', { id: this.data.habit.id });
    },
  },
});
