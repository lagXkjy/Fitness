const $common = require('../../../common/common.js');
Page({
  data: {
    teaSrc: $common.config.teaSrc,
    corInfo: {}, //课程信息
    orderInfo: {}, //订单信息
    isOrderBtn: true, //删除订单按钮显隐
  },
  lookImage() { //查看图片
    wx.previewImage({
      urls: [`${this.data.teaSrc}${this.data.corInfo.CoaWeChatQrCode}`],
    });
  },
  delete() { //删除按钮
    $common.loading();
    if (this.data.isGroup === 2) { //两人同行一人免单
      $common.api.request(
        'POST',
        $common.config.DelCorBoInfo, {
          cboId: this.data.orderInfo.CoId,
          openId: wx.getStorageSync('openId')
        },
        (res) => {
          if (res.data.res) {
            wx.navigateBack({
              delta: 1
            });
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
      return;
    }
    $common.api.request(
      'POST',
      $common.config.DeleteMyOrderInfo, {
        codId: this.data.orderInfo.CodId,
      },
      (res) => {
        if (res.data.res) {
          wx.navigateBack({})
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
  skipCheckCourseTime() {
    let isGroup = this.data.isGroup;
    if (isGroup !== 0) return;
    let corInfo = this.data.corInfo;
    let orderInfo = this.data.orderInfo;
    wx.navigateTo({
      url: `/pages/my/setTime/setTime?codId=${orderInfo.CodId}&corId=${corInfo.CorId}`,
    })
  },
  getCourseInfo() { //获取团课课程信息
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
  getOrderInfo() { //获取订单信息
    $common.api.request(
      'POST',
      $common.config.GetOrderInfo, {
        codId: this.data.codId
      },
      (res) => {
        if (res.data.res) {
          let orderInfo = res.data.OdrInfo;
          let pay = $common.api.timeStamp(orderInfo.CodPayTime);
          orderInfo.payTime = `${pay.y}-${pay.m}-${pay.d} ${pay.h}:${pay.mi}:${pay.s}`;
          let create = $common.api.timeStamp(orderInfo.CodCreateOn);
          orderInfo.createTime = `${create.y}-${create.m}-${create.d} ${create.h}:${create.mi}:${create.s}`;
          orderInfo.CodPrice = parseFloat(orderInfo.CodPrice).toFixed(2);
          if (this.data.isGroup === 0) { //私课
            let start = $common.api.timeStamp(orderInfo.CodStartTime);
            let end = $common.api.timeStamp(orderInfo.CodEndTime);
            orderInfo.courseTime = `${start.y}-${start.m}-${start.d} ${start.h}:${start.mi}-${end.h}:${end.mi}`;
          }
          this.setData({
            orderInfo: orderInfo
          })
        } else {
          $common.err1();
        }
      },
      (res) => {
        $common.err2();
      },
      (res) => {

      },
      wx.getStorageSync('Ticket')
    )
  },
  getPrivateInfo() { //获取私课课程信息
    $common.api.request(
      'POST',
      $common.config.GetPriCorInfo, {
        codId: this.data.codId
      },
      (res) => {
        if (res.data.res) {
          let corInfo = res.data.CorInfo;
          corInfo.image = corInfo.CoaHeadPic;
          // corInfo.name = corInfo.CorName;
          corInfo.name = '私人教练课程';
          corInfo.info = corInfo.CorAbstract;
          corInfo.price = corInfo.CorRePrice;
          corInfo.oldPrice = corInfo.CorPrice;
          if (corInfo.CctStaTime) {
            let start = $common.api.timeStamp(corInfo.CctStaTime);
            let end = $common.api.timeStamp(corInfo.CctEndTime);
            corInfo.showTime = `${start.y}-${start.m}-${start.d} ${start.h}:${start.mi}-${end.h}:${end.mi}`;
          }
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
  getExemptionInfo() { //获取两人同行一人免单信息
    $common.api.request(
      'POST',
      $common.config.GetCorBoInfo, {
        cboId: this.data.codId
      },
      (res) => {
        if (res.data.res) {
          let corInfo = res.data.corInfo;
          let odrInfo = res.data.odrInfo;
          let coaInfo = res.data.coaInfo;
          corInfo.image = coaInfo.CoaHeadPic;
          corInfo.name = corInfo.CbTitle;
          corInfo.info = corInfo.CbAbstract;
          corInfo.price = corInfo.CbRePrice;
          corInfo.oldPrice = corInfo.CbPrice;
          corInfo.CoaWeChatQrCode = coaInfo.CoaWeChatQrCode;
          corInfo.CorAdress = corInfo.CbAddress;
          let start = $common.api.timeStamp(odrInfo.CoCorStartTime);
          let end = $common.api.timeStamp(odrInfo.CoCorEndTime);
          corInfo.showTime = `${start.y}-${start.m}-${start.d} ${start.h}:${start.mi}-${end.h}:${end.mi}`;
          odrInfo.CodAuthNum = odrInfo.CoVerCode;
          odrInfo.CodOutradeno = odrInfo.CoOutradeno;
          let create = $common.api.timeStamp(odrInfo.CoCreateOn);
          odrInfo.createTime = `${create.y}-${create.m}-${create.d} ${create.h}:${create.mi}:${create.s}`;
          let pay = $common.api.timeStamp(odrInfo.CoPayTime);
          odrInfo.payTime = `${pay.y} -${pay.m} -${pay.d} ${pay.h}: ${pay.mi}: ${pay.s}`;
          odrInfo.CodBuyNum = odrInfo.CoBuyNum;
          odrInfo.CodPrice = odrInfo.CoPrice;
          odrInfo.CodName = odrInfo.CoName;
          odrInfo.CodPhone = odrInfo.CoPhone;
          // CoIsItOver 0 已预约 1 已完成
          odrInfo.CodPayType = odrInfo.CoIsItOver + 1;
          this.setData({
            corInfo: corInfo,
            orderInfo: odrInfo
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
  init() {
    let isGroup = this.data.isGroup;
    switch (isGroup) {
      case 0: //私课
        this.getPrivateInfo();
        this.getOrderInfo();
        break;
      case 1: //团课
        this.getCourseInfo();
        this.getOrderInfo();
        break;
      case 2: //两人同行一人免单
        this.getExemptionInfo();
        break;
    }
  },
  goHome() { //返回首页
    wx.switchTab({
      url: '/pages/tabBar/shop/shop',
    })
  },
  onLoad: function(options) {
    let codId = options.codId && options.codId;
    this.data.codId = codId;
    let isGroup = options.isGroup && +options.isGroup;
    this.setData({
      isGroup: isGroup
    });
    let title = '';
    switch (isGroup) {
      case 0:
        title = '我的私课';
        break;
      case 1:
        title = '我的团课';
        break;
      case 2:
        title = '二人同行一人免单';
        break;
    }
    wx.setNavigationBarTitle({
      title: title
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    $common.getOpenId(this.init.bind(this)); //入口页面，获取openid
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      userType: wx.getStorageSync('userType')
    })
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