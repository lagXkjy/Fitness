const $common = require('../../../common/common.js');
const app = getApp();
Page({
  data: {
    isPayment: false,
    listData: []
  },
  clickLiist(e) {
    let index = e.currentTarget.dataset.index;
    let listData = this.data.listData;
    if (listData[index].overdue) return; //不能用了，灰了
    if (this.data.isPayment) { //选择优惠券
      app.coupon = { type: 1, RcId: -1, ...listData[index] }
      wx.navigateBack({ delta: 1 })
    } else { //回到首页
      wx.switchTab({ url: '/pages/tabBar/shop/shop' })
    }
  },
  init() {
    $common.loading();
    $common.api.request(
      'POST',
      $common.config.GetStuCpInfos, {
        openId: wx.getStorageSync('openId')
      },
      (res) => {
        if (res.data.res) {
          let data = res.data.scpInfos;
          let coupon = app.coupon;
          for (let i = data.length - 1; i >= 0; i--) {
            if (i === 0) {
              data[i].bg = 'list-bg1';
              data[i].bottomBg = 'list-b1';
              data[i].btn = 'list-btn1';
            } else if (i === 1) {
              data[i].bg = 'list-bg2';
              data[i].bottomBg = 'list-b2';
              data[i].btn = 'list-btn2';
            } else if (i === 2) {
              data[i].bg = 'list-bg3';
              data[i].bottomBg = 'list-b3';
              data[i].btn = 'list-btn3';
            }
            if (data[i].ScpBeUsed > 0) {
              data[i].overdue = true; //使用过了，变灰
            }
            if (data[i].ScpId === coupon.ScpId) { //选中
              data[i].select = true;
            }
          }
          this.setData({
            listData: data
          })
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
  onLoad: function (options) {
    let isPayment = options.isPayment ? true : false; //true由购买页面进入，false我的进入，纯查看
    this.setData({
      isPayment: isPayment
    });
  },
  onReady: function () {
    $common.getOpenId(this.init.bind(this));
  },
  onShow: function () { },

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