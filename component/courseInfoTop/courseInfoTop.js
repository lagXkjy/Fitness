
Component({
  properties: {
    isGroup: {
      type: Boolean,
      value: true
    },
    tabIndex: {
      type: Number,
      value: 0
    },
    showTime: {
      type: String,
      value: '2018-04-28 13:30-14:30'
    },
    stuName: {
      type: String,
    },
    stuPhone: {
      type: null
    },
    now: {
      type: null
    },
    end: {
      type: null
    },
    isRight: {
      type: Boolean,
      value: false
    },
    buyTime:{ //课程包购买时间
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
