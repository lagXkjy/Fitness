const $common = require('../../../common/common.js');
const wxParse = require('../../../libs/wxParse/wxParse.js');
Page({
  data: {
    shopSrc: $common.config.shopSrc,
    strInfo: {},
    banImgs: []
  },
  checkAddress() { //打开地图
    $common.api.geocoder(
      this.data.strInfo.StrConAds,
      (res) => {
        let obj = {
          latitude: res.result.location.lat,
          longitude: res.result.location.lng
        }
        $common.api.openLocation(obj);
      });
  },
  callPhone() { //打电话
    $common.api.makePhoneCall(this.data.strInfo.StrConNum);
  },
  skipCourseList() { //返回上一页
    let isUrl = this.data.isUrl;
    if (isUrl === 1) {
      wx.navigateBack();
    } else {
      wx.redirectTo({
        url: `/pages/shop/courseList/courseList?strId=${this.data.strId}`,
      })
    }
  },
  getShopInfo() { //获取门店信息
    $common.loading();
    $common.api.request(
      'POST',
      $common.config.GetStoreInfo,
      {
        strId: this.data.strId
      },
      (res) => {
        if (res.data.res) {
          let banImgs = res.data.banImgs;
          for (let i = 0, len = banImgs.length; i < len; i++) {
            banImgs[i].image = banImgs[i].SbiImgName;
          }
          let strInfo = res.data.strInfo;
          this.setData({
            strInfo: strInfo,
            banImgs: banImgs
          });
          wxParse.wxParse('article', 'html', strInfo.StrDesp, this, 5);
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
  init() {
    this.getShopInfo();
  },
  onLoad: function (options) {
    let strId = options.strId;
    this.data.strId = strId;
    this.data.isUrl = options.isUrl ? +options.isUrl : 0;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    $common.getOpenId(this.init.bind(this)); //获取openid
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userType: wx.getStorageSync('userType')
    })
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