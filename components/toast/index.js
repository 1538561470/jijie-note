/* components/toast/index.js */

Component({
  properties: {
    message: {
      type: String,
      value: '',
    },
    visible: {
      type: Boolean,
      value: false,
    },
    duration: {
      type: Number,
      value: 1800,
    },
  },

  observers: {
    visible(val) {
      if (val && this.data.duration > 0) {
        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
          this.triggerEvent('hide');
        }, this.data.duration);
      }
    },
  },

  lifetimes: {
    detached() {
      clearTimeout(this._timer);
    },
  },
});
