const $common = require('../../../common/common.js');
Page({
  data: {
    navSrc: $common.config.navSrc,
    listData: []
  },
  skipCourseList(e) { //跳转到课程列表 0 私课 1 团课
    let type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/pages/shop/courseList/courseList?strId=${this.data.strId}&isGroup=${type}`,
    })
  },
  init() {
    $common.api.request(
      'POST',
      $common.config.GetNaviInfos,
      null,
      (res) => {
        let listData = res.data.cnInfos;
        for (let i = listData.length - 1; i >= 0; i--) {
          listData[i].isGroup = +listData[i].CnPath; //1团 0 私
        }
        this.setData({
          listData: listData
        })
      },
      (res) => {

      },
      (res) => {

      },
      wx.getStorageSync('Ticket')
    )
  },
  onLoad: function(options) {
    this.data.strId = options.strId;
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