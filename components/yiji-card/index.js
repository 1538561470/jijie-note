/* components/yiji-card/index.js */

Component({
  properties: {
    yiji: {
      type: Object,
      value: { yi: [], ji: [] },
    },
  },

  methods: {
    /** 点击匹配的宜事项 */
    onTapYiji(e) {
      const name = e.currentTarget.dataset.name;
      this.triggerEvent('tapyiji', { name });
    },
  },
});
