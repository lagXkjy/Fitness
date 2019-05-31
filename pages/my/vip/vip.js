const $common = require('../../../common/common.js');
Page({
  data: {
    images: $common.config.images,
    contentSrc: $common.config.contentSrc,
    vipList: [],
    vip: {}
  },
  init() {
    $common.loading();
    $common.api.request(
      'POST',
      $common.config.GetFmInfos, {
        openId: wx.getStorageSync('openId')
      },
      (res) => {
        if (res.data.res) {
          let { data: vipList, stuFm } = res.data
          let { StuFmInfo } = stuFm
          let vip = {}
          if (!StuFmInfo) {
            vip = { FmTitle: '' }
          } else {
            StuFmInfo = JSON.parse(StuFmInfo)
            let { FmTitle, FmSellMoney, FmIntro, FmArrivalAccountPrice,
              FmIconGold, FmWhiteIcon, FmBackgroundMap } = StuFmInfo
            vip = {
              FmTitle, FmSellMoney, FmIntro,
              FmArrivalAccountPrice: stuFm.StuBalance, FmIconGold, FmWhiteIcon, FmBackgroundMap
            }
          }
          this.setData({ vipList, vip })
        } else {
          +res.data.errType !== 6 && ($common.err1());
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
  getUserInfo(e) {
    let userInfo = e.detail.userInfo;
    if (!userInfo) return;
    let index = e.currentTarget.dataset.index;
    $common.getUserInfo(userInfo, this.skipVipConfirmOrder.bind(this, index));
  },
  skipVipConfirmOrder(index) { //跳转到购买vip页面
    let vipList = this.data.vipList;
    wx.navigateTo({
      url: `/pages/my/vipConfirmOrder/vipConfirmOrder?fmId=${vipList[index].FmId}`,
    })
  },
  onLoad: function (options) { },
  onReady: function () { },
  onShow: function () {
    this.init();
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