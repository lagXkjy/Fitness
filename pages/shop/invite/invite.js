// pages/shop/invite/invite.js
const $common = require('../../../common/common.js');
Page({
  data: {
    bannerSrc: $common.config.bannerSrc,
    swiperList: [],
    pageInfo: null
  },
  clickSwiper() { },//轮播图点击事件
  getInviteInfo() { //获取邀请的信息 
    $common.api.request(
      'POST',
      $common.config.GetShareActivityInfos,
      null,
      (res) => {
        if (res.data.res) {
          let data = res.data.Data;
          this.setData({
            swiperList: [{
              image: `${data.Banner}`
            }],
            contextList: data.AvtivityRule.split(/\s/g),
            pageInfo: data
          })
        }
      },
      (res) => {

      },
      (res) => {

      }
    )
  },
  toCourseList(){ //跳转到团课列表
    wx.redirectTo({
      url: `/pages/shop/courseList/courseList?strId=${this.data.strId}&isGroup=1`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.strId = +options.strId;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getInviteInfo();
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