/**
 * 轮播图
 */
const $common = require('../../common/common.js');
Component({
  properties: {
    iUrl: {
      type: String
    },
    height: {
      type: String,
    },
    arr: {
      type: Array,
    }
  },
  data: {
    current: 0,
  },
  methods: {
    change(e) {
      this.data.current = e.detail.current;
    },
    bindSwiper() {
      this.triggerEvent('clickSwiper', {
        index: this.data.current
      })
    },
  }
})