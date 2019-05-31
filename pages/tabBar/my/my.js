const $common = require('../../../common/common.js');
Page({
  data: {
    images: $common.config.images,
    contentSrc: $common.config.contentSrc,
    stuList: [{
      title: '充值中心',
      image: '/images/price.png',
      url: '/pages/my/recharge/recharge'
    },
    {
      title: '我的私教',
      image: '/images/private.png',
      url: '/pages/my/myCourseList/myCourseList?isGroup=0'
    }, {
      title: '我的团课',
      image: '/images/course.png',
      url: '/pages/my/myCourseList/myCourseList?isGroup=1'
    },
    {
      title: '我的课程优惠包',
      image: '/images/discount.png',
      url: '/pages/my/discount/discount'
    },
    {
      title: '二人同行一人免单',
      image: '/images/exemption.png',
      url: '/pages/my/exemptionList/exemptionList'
    },
    {
      title: '月卡',
      image: '/images/month.png',
      url: '/pages/shop/monthCard/monthCard'
    },
    {
      title: '邀请有礼',
      image: '/images/invite.png',
      url: '/pages/shop/newInvite/newInvite'
    },
    {
      title: '优惠券',
      image: '/images/coupon.png',
      url: '/pages/my/coupon/coupon'
    },
    {
      title: '代金券',
      image: '/images/money.png',
      url: '/pages/my/cashCoupon/cashCoupon'
    },
    {
      title: '模板消息设置',
      image: '/images/message.png',
      url: '/pages/my/templateMessage/templateMessage'
    }
    ],
    teaSrc: $common.config.teaSrc,
    CoaName: '',
    CoaHeadPic: '',
    FmTitle: false, //会员名
  },
  skipVip() { //跳转到会员卡页面
    wx.navigateTo({
      url: '/pages/my/vip/vip',
    })
  },
  skip(e) {
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  },
  init() {
    $common.loading();
    $common.api.request(
      'POST',
      $common.config.GetStuFmInfo, {
        openId: wx.getStorageSync('openId'),
      }, (res) => {
        if (res.data.res) {
          let { StuFmInfo, StuIntegral } = res.data
          if (!StuFmInfo) {
            this.setData({ FmTitle: '', StuIntegral })
          } else {
            StuFmInfo = JSON.parse(StuFmInfo)
            let { FmTitle, FmSellMoney, FmIntro, FmArrivalAccountPrice, FmIconGold, FmWhiteIcon, FmBackgroundMap } = StuFmInfo
            this.setData({ FmTitle, FmSellMoney, FmIntro, FmArrivalAccountPrice, FmIconGold, FmWhiteIcon, FmBackgroundMap, StuIntegral })
          }
        } else {
          $common.err1();
        }
      },
      (res) => {
        $common.err2();
      },
      (res) => {
        $common.hide();
      },
      wx.getStorageSync('Ticket')
    )
  },
  setUrl(path) {
    let src = `loginTo=${path}&loginData=${JSON.stringify({})}`
    return `/pages/my/register/register?${src}`
  },
  getIsRegister() { //未注册，去注册
    $common.api.request('POST', $common.config.IsStuRegister, {
      openId: wx.getStorageSync('openId')
    },
      res => {
        if (res.data.res) {
          const { Register } = res.data
          if (!Register) return wx.reLaunch({ url: this.setUrl('/pages/tabBar/my/my') })
        }
      })
  },
  onLoad: function (options) {
    this.getIsRegister()
  },
  onReady: function () { },
  onShow: function () {
    $common.getOpenId(this.init.bind(this)); //获取openid
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    this.init();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return $common.api.share();
  }
})