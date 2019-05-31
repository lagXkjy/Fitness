const $common = require('../../../common/common.js');
Page({
  data: {
    atyInfos: [],
    pageIndex: 1,
    pageSize: 5,
    flag: true
  },
  skipActivityDeail(e) { //页面跳转
    let index = e.currentTarget.dataset.index,
      atyInfos = this.data.atyInfos;
    wx.navigateTo({
      url: `/pages/activity/activityDetail/activityDetail?atyId=${atyInfos[index].AtyId}`,
    })
  },
  init(isReach) {
    $common.loading();
    let pageIndex = 1,
      pageSize = this.data.pageSize;
    isReach && (pageIndex = this.data.pageIndex);
    $common.api.request(
      'POST',
      $common.config.GetAtyInfos,
      {
        pageIndex: pageIndex,
        pageSize: pageSize
      },
      (res) => {
        if (res.data.res) {
          let atyInfos = [];
          let arr = res.data.atyInfos;
          isReach && (atyInfos = this.data.atyInfos);
          for (let i = 0, len = arr.length; i < len; i++) {
            atyInfos.push(arr[i]);
          }
          arr.length >= pageSize && (this.data.pageIndex++);
          atyInfos = $common.api.unique(atyInfos, 'AtyId'); //去重
          this.setData({
            atyInfos: atyInfos
          })
        } else {
          $common.err1();
        }
      },
      (res) => {
        $common.err2();
      },
      (res) => {
        this.data.flag = true;
        $common.hide();
      },
      wx.getStorageSync('Ticket')
    )
  },
  onLoad: function (options) {
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
    if (!this.data.flag) return;
    this.data.flag = false;
    this.init(true);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return $common.api.share();
  }
})