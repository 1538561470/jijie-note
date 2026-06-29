/* components/koi-display/index.js */

Component({
  properties: {
    level: {
      type: Number,
      value: 1,
    },
    levelTitle: {
      type: String,
      value: '初识锦鲤',
    },
    exp: {
      type: Number,
      value: 0,
    },
    expPercent: {
      type: Number,
      value: 0,
    },
    nextLevelExp: {
      type: Number,
      value: 100,
    },
  },
});
