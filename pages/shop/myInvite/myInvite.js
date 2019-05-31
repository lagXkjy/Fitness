// pages/shop/myInvite/myInvite.js
const $common = require('../../../common/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0, //0我的邀请 1 成功邀请
    bannerAndRules: {},
    CashCouponTotalSum: 0,
    listData: []
  },
  getBannerAndRules() {
    const { type } = this.data
    if (type === 1) return
    $common.api.request('POST', $common.config.GetInvCouBanner,
      { OpenId: wx.getStorageSync('openId') },
      res => {
        if (res.data.res) {
          this.setData({ bannerAndRules: res.data.RuleData })
        } else {
          $common.err1()
        }
      },
      err => {
        $common.err2()
      },
      res => { })
  },
  getInviteList() {
    const { type: InvitType } = this.data
    $common.api.request('POST', $common.config.GetInvitationUser,
      { InvitType, OpenId: wx.getStorageSync('openId') },
      res => {
        if (res.data.res) {
          let { data: listData, CashCouponTotalSum } = res.data
          this.setData({listData, CashCouponTotalSum: +CashCouponTotalSum})
        } else {
          $common.err1()
        }
      },
      err => {
        $common.err2()
      },
      res => { })
  },
  init() {
    const { type } = this.data
    wx.setNavigationBarTitle({ title: type === 0 ? '我的邀请' : '成功邀请的用户' })
    this.getBannerAndRules()
    this.getInviteList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ type: +options.type })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.init()
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
    return {
      path: `/pages/shop/getInvite/getInvite?InvitationOpenId=${wx.getStorageSync('openId') || ''}`
    }
  }
})