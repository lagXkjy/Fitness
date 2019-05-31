const $common = require('../../../common/common.js');
Page({
  data: {
    listData: [],
  },
  init() {
    $common.loading();
    $common.api.request(
      'POST',
      $common.config.GetMppUseHis, {
        mppId: this.data.mppId
      },
      (res) => {
        if (res.data.res) {
          let arr = res.data.data;
          for (let i = 0, len = arr.length; i < len; i++) {
            let start = $common.api.timeStamp(arr[i].CorInfo.CctStaTime);
            let end = $common.api.timeStamp(arr[i].CorInfo.CctEndTime);
            arr[i].time = `${start.y}-${start.m}-${start.d} ${start.h}:${start.mi}-${end.h}:${end.mi}`;
          }
          this.setData({
            listData: arr
          })
        } else {
          switch (+res.data.errType) {
            case 6:
              break;
            default:
              $common.err1();
          }
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
    this.data.mppId = options.mppId;
    this.setData({
      MppSurplus: options.MppSurplus,
      MppNum: options.MppNum
    })
  },

  onReady: function () {
    this.init();
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