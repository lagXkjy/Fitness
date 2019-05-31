// component/courseInfoBottom/courseInfoBottom.js
Component({
  properties: {
    tabText: {
      type: String,
      value: ''
    },
    showTime: { //显示时间
      type: String
    },
    isOrder: {
      type: String,
      value: ''
    },
    tabIndex: {
      type: Number,
      value: 0
    },
    isSet: { //设置上课时间
      type: Boolean,
      value: false,
    },
    isRefund: { //退款
      type: Boolean,
      value: false,
    },
    refundType: { //订单状态，2已支付 3已退款
      type: Number,
      value: 0,
    },
    isQuest: {
      type: Boolean,
      value: false
    },
    term: {
      type: String,
      value: ''
    },
    isTuiKuan:{
      type: Boolean,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  methods: {
    clickQuest() {
      this.triggerEvent('quest', null);
    },
    clickBtn() {
      this.triggerEvent('check', null);
    },
    clickSet() {
      this.triggerEvent('setTime');
    },
    clickRefund() {
      this.triggerEvent('refund');
    },
  }
})