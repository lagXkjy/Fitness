const $common = require('../../../common/common.js');
Page({
  data: {
    teaSrc: $common.config.teaSrc,
  },
  skipMyCourseDetail() {
    wx.redirectTo({
      url: `/pages/my/myCourseDetail/myCourseDetail?codId=${this.data.codId}&isGroup=${this.data.isGroup}`,
    })
  },
  lookImage() { //查看图片
    wx.previewImage({
      urls: [`${this.data.teaSrc}${this.data.corInfo.CoaWeChatQrCode}`],
    });
  },
  init() { //获取团课课程信息
    $common.api.request(
      'POST',
      $common.config.GetCorInfo, {
        codId: this.data.codId
      },
      (res) => {
        if (res.data.res) {
          let corInfo = res.data.corInfo;
          corInfo.image = corInfo.CoaHeadPic;
          corInfo.name = corInfo.CorName;
          corInfo.info = corInfo.CorAbstract;
          corInfo.price = corInfo.CorRePrice;
          corInfo.oldPrice = corInfo.CorPrice;
          let start = $common.api.timeStamp(corInfo.CctStaTime);
          let end = $common.api.timeStamp(corInfo.CctEndTime);
          corInfo.showTime = `${start.y}-${start.m}-${start.d} ${start.h}:${start.mi}-${end.h}:${end.mi}`;
          this.setData({
            corInfo: corInfo
          })
        } else {
          $common.err1();
        }
      },
      (res) => {
        $common.err2()
      },
      (res) => {

      },
      wx.getStorageSync('Ticket')
    )
  },
  toCoupon() { //查看会员卡
    wx.redirectTo({
      url: `/pages/my/coupon/coupon`
    })
  },
  onLoad: function (options) {
    let codId = options.codId && options.codId;
    let isGroup = options.isGroup && +options.isGroup;
    let CodAuthNum = options.CodAuthNum && options.CodAuthNum; //验证码
    this.data.codId = codId;
    this.setData({
      CodAuthNum: CodAuthNum,
      isGroup: isGroup,
      shareSuccess: options.shareSuccess ? true : false
    });
    if (isGroup === 2) { //0 私 1 团 2 买二付一
      return
    }
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