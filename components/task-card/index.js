/* components/task-card/index.js */

Component({
  properties: {
    task: {
      type: Object,
      value: {},
    },
    completed: {
      type: Boolean,
      value: false,
    },
  },

  methods: {
    /** 点击切换完成状态 */
    onToggleComplete() {
      this.triggerEvent('toggle', { id: this.data.task.id });
    },

    /** 长按显示操作菜单 */
    onShowActions() {
      this.triggerEvent('longpress', { id: this.data.task.id });
    },
  },
});
