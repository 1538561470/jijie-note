/* components/stats-card/index.js */

Component({
  properties: {
    totalTasks: {
      type: Number,
      value: 0,
    },
    pendingTasks: {
      type: Number,
      value: 0,
    },
    todayHabits: {
      type: String,
      value: '0/0',
    },
  },
});
