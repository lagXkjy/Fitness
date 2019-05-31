/**
 * 课程信息列表
 */
Component({
  properties: {
    iUrl: {
      type: String
    },
    isPrivate: {
      type: Boolean,
      value: false
    },
    isGroup: {
      type: Boolean,
      value: false
    },
    isCheck: {
      type: Boolean,
      value: false
    },
    isBuy: {
      type: Boolean,
      value: false
    },
    obj: {
      type: Object,
      // value: {
      //   image: '/images/***.png',
      //   name: 'BODYATTACK有氧挑战',
      //   info: 'LesMills | 燃脂 | 有氧',
      //   time: '16:30 - 17:30',
      //   price: '159',
      //   oldPrice: '200',
      //   isHot: false,
      //   isFull: false, //false 不显示，1满员 2结束
      // },
      observer(e) {
        if (e) {
          e.price && (e.price = parseFloat(e.price).toFixed(2));
          e.oldPrice && (e.oldPrice = parseFloat(e.oldPrice).toFixed(2));
          this.setData({
            obj: e
          })
        }
      }
    },
  },
  data: {

  },
  methods: {
    checkImage() {
      let image = this.data.obj.image;
      let iUrl = this.data.iUrl;
      wx.previewImage({
        urls: [iUrl && iUrl + image] // 需要预览的图片http链接列表
      })
    },
    skipCourseDetail() {
      this.triggerEvent('clicklist', null)
    }
  }
})
