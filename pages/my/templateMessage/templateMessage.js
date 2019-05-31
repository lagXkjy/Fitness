const $common = require('../../../common/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    input: '',
    flag: true
  },
  bindinput(e) {
    this.data.input = e.detail.value;
  },
  submit() {
    if(!this.data.flag) return;
    this.data.flag = false;
    let input = this.data.input;
    if (!$common.config.phoneReg.test(input)) {
      $common.api.showModal('请填写正确的手机号');
      this.data.flag = true;
      return;
    }
    $common.getOpenId(this.bindPhone.bind(this));
  },
  bindPhone() {
    $common.loading();
    $common.api.request(
      'POST',
      $common.config.BindingUserPhone, {
        openId: wx.getStorageSync('openId'),
        bindPhone: this.data.input
      },
      (res) => {
        if (res.data.res) {
          $common.api.showModal('绑定成功！');
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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