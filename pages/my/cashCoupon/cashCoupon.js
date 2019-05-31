// pages/my/cashCoupon/cashCoupon.js
const $common = require('../../../common/common.js');
Page({
  data: {
    isPayment: false, //支付页进来选
    currentDate: new Date().getTime(),
    list: []
  },
  clickSelect(e) {
    const { list, isPayment } = this.data
    if (!isPayment) return
    const { index } = e.currentTarget.dataset
    const data = list[index]
    //无法使用
    let currDate = new Date().getTime()
    let date = +data.RcClosingDate.replace(/\D/g, '')
    if (data.RcAlreadyUsed || currDate >= date) return
    getApp().coupon = { type: 2, ScpId: -1, ...data }
    wx.navigateBack({ delta: 1 })
  },
  getCouponList() {
    $common.api.request('POST', $common.config.GetUserCashList, {
      OpenId: wx.getStorageSync('openId')
    },
      res => {
        if (res.data.res) {
          this.setData({ list: res.data.data })
        } else {
          $common.err1()
        }
      },
      err => { $common.err2() },
      res => { })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.isPayment = Boolean(options.isPayment)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getCouponList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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