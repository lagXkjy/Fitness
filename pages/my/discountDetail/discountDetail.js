const $common = require('../../../common/common.js');
Page({
  data: {

  },
  discountUse() { //优惠包使用详情
    let data = this.data.mppInfo;
    wx.navigateTo({
      url: `/pages/my/discountUse/discountUse?mppId=${this.data.mppId}&MppSurplus=${data.MppSurplus}&MppNum=${data.MppNum}`,
    })
  },
  init() {
    $common.loading();
    $common.api.request(
      'POST',
      $common.config.GetMppInfo, {
        mppId: this.data.mppId
      },
      (res) => {
        if (res.data.res) {
          let data = res.data.data;
          let mppInfo = data.mppInfo;
          let ppkInfo = data.ppkInfo;
          let ppoInfo = data.ppoInfo;
          let term = $common.api.timeStamp(mppInfo.MppTermVal);
          mppInfo.term = `${term.y}-${term.m}-${term.d}`;
          let orderTime = $common.api.timeStamp(ppoInfo.PpoPlaceTime);
          ppoInfo.orderTime = `${orderTime.y}-${orderTime.m}-${orderTime.d} ${orderTime.h}:${orderTime.mi}:${orderTime.s}`;
          let buyTime = $common.api.timeStamp(ppoInfo.PpoBuyTime);
          ppoInfo.buyTime = `${buyTime.y}-${buyTime.m}-${buyTime.d} ${buyTime.h}:${buyTime.mi}:${buyTime.s}`;
          this.setData({
            mppInfo: mppInfo,
            ppkInfo: ppkInfo,
            ppoInfo: ppoInfo
          })
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
  onLoad: function(options) {
    this.data.mppId = options.mppId;
  },
  onReady: function() {
    this.init();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
    this.init();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return $common.api.share();
  }
})