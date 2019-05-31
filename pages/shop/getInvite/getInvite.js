// pages/shop/getInvite/getInvite.js
const $common = require('../../../common/common.js')
Page({
  data: {
    contentSrc: $common.config.contentSrc,
    bannerAndRules: {},
    InvitationOpenId: 0,
  },
  addInviteInfo() {
    let { InvitationOpenId } = this.data
    if (!InvitationOpenId) return
    $common.api.request('POST', $common.config.AddUserInvitation,
      { OpenId: wx.getStorageSync('openId'), InvitationOpenId },
      res => {
        $common.isRegister()
          .then(res => {
            wx.switchTab({ url: '/pages/tabBar/shop/shop' })
          })
      },
      err => {
        $common.err2()
      })
  },
  getUserInfo(e) {
    if (!e.detail.userInfo) return;
    $common.getUserInfo(e.detail.userInfo, this.addInviteInfo);
  },
  getBannerAndRules() {
    $common.api.request('POST', $common.config.GetInvCouBanner,
      { OpenId: wx.getStorageSync('openId') },
      res => {
        if (res.data.res) {
          let { RuleData: bannerAndRules } = res.data
          this.setData({ bannerAndRules })
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
    this.getBannerAndRules()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.InvitationOpenId = options.InvitationOpenId
    $common.getOpenId(this.init.bind(this)); //获取openid
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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