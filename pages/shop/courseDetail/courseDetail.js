const $common = require('../../../common/common.js');
const wxParse = require('../../../libs/wxParse/wxParse.js');
const app = getApp();
Page({
  data: {
    courseSrc: $common.config.courseSrc,
    teaSrc: $common.config.teaSrc,
    exemptionBanner: $common.config.exemptionBanner,
    isFull: true,
  },
  disclaimer() { //免责申明
    wx.navigateTo({
      url: '/pages/shop/disclaimer/disclaimer',
    })
  },
  checkAddress() { //查看地图
    $common.api.geocoder(
      this.data.corInfo.CorAdress,
      (res) => {
        let obj = {
          latitude: res.result.location.lat,
          longitude: res.result.location.lng
        }
        $common.api.openLocation(obj);
      });
  },
  getUserInfo(e) {
    let userInfo = e.detail.userInfo;
    if (!userInfo) return;
    $common.getUserInfo(userInfo, this.skipConfirmOrder.bind(this))
  },
  skipConfirmOrder() { //确认订单页
    $common.isRegister()
      .then(res => {
        let isGroup = this.data.isGroup;
        app.coupon = { //优惠券 和 代金券 互斥
          type: 1, // 1 选择优惠券 2 选择代金券
          ScpId: -1, //优惠券Id
          RcId: -1,  //代金券Id
        }
        wx.navigateTo({
          url: `/pages/shop/confirmOrder/confirmOrder?isGroup=${isGroup}&corId=${this.data.corId}`,
        })
      })
  },
  getGroup() { //团
    $common.loading();
    $common.api.request(
      'POST',
      $common.config.GetGroupCorInfo, {
        corId: this.data.corId
      },
      (res) => {
        if (res.data.res) {
          let CorBanners = res.data.CorBanners;
          for (let i = 0, len = CorBanners.length; i < len; i++) {
            CorBanners[i].image = CorBanners[i].CbiImgName;
          }
          let corInfo = res.data.corInfo;
          let start = $common.api.timeStamp(corInfo.CctStaTime);
          let end = $common.api.timeStamp(corInfo.CctEndTime);
          corInfo.showTime = `${start.y}.${start.m}.${start.d} ${start.h}:${start.mi}-${end.h}:${end.mi}`;
          corInfo.CorRePrice = parseFloat(corInfo.CorRePrice).toFixed(2);
          this.setData({
            CorBanners: CorBanners,
            corInfo: corInfo
          });
          // setTimeout(() => {
          wxParse.wxParse('article', 'html', corInfo.CorDesp, this, 5);
          // }, 300);
        } else {
          switch (+res.data.errType) {
            case 16:
              $common.api.showModal('该课程已下架，教练信息不存在');
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
  getNoGroup() { //私
    $common.loading();
    $common.api.request(
      'POST',
      $common.config.GetPrivateCorInfo, {
        corId: this.data.corId
      },
      (res) => {
        if (res.data.res) {
          let CorBanners = res.data.CorBanners;
          for (let i = 0, len = CorBanners.length; i < len; i++) {
            CorBanners[i].image = CorBanners[i].CbiImgName;
          }
          let corInfo = res.data.corInfo;
          corInfo.CorRePrice = parseFloat(corInfo.CorRePrice).toFixed(2);
          this.setData({
            CorBanners: CorBanners,
            corInfo: corInfo
          });
          // setTimeout(() => {
          wxParse.wxParse('article', 'html', corInfo.CorDesp, this, 5);
          // }, 300);
        } else {
          switch (+res.data.errType) {
            case 16:
              $common.api.showModal('该课程已下架，教练信息不存在');
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
  getExemption() { //两人同行一人免单
    $common.loading();
    $common.api.request(
      'POST',
      $common.config.GetCbInfo, {
        cbId: this.data.corId
      },
      (res) => {
        if (res.data.res) {
          let corInfo = res.data.corInfo;
          let coaInfo = res.data.coaInfo;
          let CorBanners = corInfo.XCb;
          for (let i = 0, len = CorBanners.length; i < len; i++) {
            CorBanners[i].image = CorBanners[i].PmPicName;
          }
          let start = $common.api.timeStamp(corInfo.CbStartTime);
          let end = $common.api.timeStamp(corInfo.CbEndTime);
          corInfo.showTime = `${start.y}.${start.m}.${start.d} ${start.h}:${start.mi}-${end.h}:${end.mi}`;
          corInfo.CorRePrice = parseFloat(corInfo.CbRePrice).toFixed(2);
          corInfo.CoaName = coaInfo.CoaName;
          corInfo.CoaAbstract = coaInfo.CoaAbstract;
          corInfo.CoaHeadPic = coaInfo.CoaHeadPic;
          corInfo.CorAdress = corInfo.CbAddress;
          corInfo.StrAction = corInfo.CbAtion;
          corInfo.CorDesp = corInfo.CbDescript;
          this.setData({
            CorBanners: CorBanners,
            corInfo: corInfo
          });
          setTimeout(() => {
            wxParse.wxParse('article', 'html', corInfo.CorDesp, this, 5);
          }, 300);
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
    let isGroup = this.data.isGroup;
    switch (isGroup) {
      case 0:
        this.getNoGroup();
        break;
      case 1:
        this.getGroup();
        break;
      case 2:
        wx.setNavigationBarTitle({
          title: '二人同行一人免单'
        })
        this.getExemption();
        break;
    }
  },
  onLoad: function (options) {
    let corId = options.corId;
    let isGroup = +options.isGroup; //1团0私2两人同行一人免单
    this.data.corId = corId;
    this.setData({
      isGroup: isGroup,
      isFull: options.isFull ? false : true //该课程是否过期或，满员， false不显示
    })
    if (options.shareOpenId) { //老带新活动，由分享链接进入
      app.shareOpenId = options.shareOpenId;
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    $common.getOpenId();
    this.init();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userType: wx.getStorageSync('userType')
      // userType: 1
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
    let data = this.data;
    return $common.api.share();
    // return data.isGroup == 1 ?
    //   $common.api.share('健身预约', `/pages/shop/courseDetail/courseDetail?shareOpenId=${wx.getStorageSync('openId')}&corId=${data.corId}&isGroup=1&isFull=${data.isFull ? '' : 1}`)
    //   : $common.api.share();
  }
})