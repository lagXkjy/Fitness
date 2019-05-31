const $common = require('../../../common/common.js');
const wxParse = require('../../../libs/wxParse/wxParse.js');
Page({
  data: {
    atyInfo: {},
    atyBans: []
  },

  init() {
    $common.loading();
    $common.api.request(
      'POST',
      $common.config.GetAtyInfo,
      {
        atyId: this.data.atyId
      },
      (res) => {
        if (res.data.res) {
          let atyBans = res.data.atyBans;
          let atyInfo = res.data.atyInfo;
          atyInfo.AtyPicName = atyBans[0].AbiImgName;
          wxParse.wxParse('article', 'html', atyInfo.AtyDesp, this, 5);
          this.setData({
            atyBans: atyBans,
            atyInfo: atyInfo
          })
        } else {

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
  onLoad: function (options) {
    let atyId = options.atyId;
    this.data.atyId = atyId;
    this.init();
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