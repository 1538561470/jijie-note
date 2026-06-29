/* components/add-plan-drawer/index.js */

const { CATEGORIES } = require('../../utils/constants');

Component({
  properties: {
    visible: {
      type: Boolean,
      value: false,
    },
    isEditing: {
      type: Boolean,
      value: false,
    },
    editData: {
      type: Object,
      value: null,
    },
  },

  data: {
    type: 'task',
    categories: CATEGORIES,
    form: {
      // task fields
      title: '',
      note: '',
      priority: 'mid',
      category: '生活',
      // habit fields
      name: '',
      target: 1,
      unit: '次',
      frequencyType: 'daily',
    },
  },

  lifetimes: {
    attached() {
      if (this.data.editData) {
        this.loadEditData();
      }
    },
  },

  observers: {
    editData(val) {
      if (val) this.loadEditData();
    },
  },

  methods: {
    loadEditData() {
      const d = this.data.editData;
      if (d.type === 'task') {
        this.setData({
          type: 'task',
          form: {
            title: d.title || '',
            note: d.note || '',
            priority: d.priority || 'mid',
            category: d.category || '生活',
          },
        });
      } else {
        this.setData({
          type: 'habit',
          form: {
            name: d.name || '',
            target: d.target || 1,
            unit: d.unit || '次',
            frequencyType: d.frequency ? d.frequency.type : 'daily',
            category: d.category || '生活',
          },
        });
      }
    },

    onSwitchType(e) {
      this.setData({ type: e.currentTarget.dataset.type });
    },

    onFieldChange(e) {
      const { field } = e.currentTarget.dataset;
      const value = e.detail.value;
      this.setData({ [`form.${field}`]: value });
    },

    onSelectOption(e) {
      const { field, value } = e.currentTarget.dataset;
      this.setData({ [`form.${field}`]: value });
    },

    onSubmit() {
      const { type, form } = this.data;
      // 验证必填
      if (type === 'task' && !form.title.trim()) {
        wx.showToast({ title: '请输入计划名称', icon: 'none' });
        return;
      }
      if (type === 'habit' && !form.name.trim()) {
        wx.showToast({ title: '请输入习惯名称', icon: 'none' });
        return;
      }

      this.triggerEvent('submit', {
        type,
        data: {
          ...form,
          target: Number(form.target) || 1,
          frequency: { type: form.frequencyType || 'daily' },
        },
      });
    },

    onClose() {
      this.triggerEvent('close');
    },
  },
});
