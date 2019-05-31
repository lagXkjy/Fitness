const $common = require('../../../common/common.js');
Page({
  data: {
    balance: 0, //余额
    balanceFlag: true,
    tabIndex: 0,
    rechargeList: [1000, 2000, 3000], //充值
    giftList: [], // 优惠包
    detailList: [], //消费明细
    pageIndex: 1,
    pageSize: 10
  },
  confirmOrder(e) {
    let index = e.currentTarget.dataset.index;
    let giftList = this.data.giftList;
    wx.navigateTo({
      url: `/pages/my/confirmOrder/confirmOrder?ppkId=${giftList[index].PpkId}`,
    })
  },
  bindTab(e) { //tab切换
    this.setData({
      tabIndex: +e.currentTarget.dataset.index
    })
    this.tabChange();
  },
  tabChange() {
    let index = this.data.tabIndex;
    if (index === 0) {
      this.getCourseList();
    } else {
      this.getConsumptionDetail();
    }
  },
  getCourseList() { //获取课程优惠包
    $common.api.request(
      'POST',
      $common.config.GetPrePackageInfos,
      null,
      (res) => {
        if (res.data.res) {
          this.setData({
            giftList: res.data.PpkInfos
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

      },
      wx.getStorageSync('Ticket')
    )
  },
  getConsumptionDetail(isReach) { //获取消费明细
    let pageIndex = isReach ? this.data.pageIndex : 1;
    let pageSize = this.data.pageSize;
    $common.loading();
    $common.api.request(
      'POST',
      $common.config.GetMyFineBal, {
        openId: wx.getStorageSync('openId'),
        pageIndex: pageIndex,
        pageSize: pageSize
      },
      (res) => {
        if (res.data.res) {
          let detailList = isReach ? this.data.detailList : [];
          let arr = res.data.stuBal;
          for (let i = 0, len = arr.length; i < len; i++) {
            let time = $common.api.timeStamp(arr[i].FBPayTime);
            arr[i].showTime = `${time.y}-${time.m}-${time.d} ${time.h}:${time.mi}:${time.s}`;
            detailList.push(arr[i]);
          }
          arr.length >= pageSize && pageIndex++;
          this.data.pageIndex = pageIndex;
          this.setData({
            detailList: $common.api.unique(detailList, 'FBPayTime')
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
  getBalanceRechange(e) { //获取个人信息
    if (!e.detail.userInfo) return;
    $common.getUserInfo(e.detail.userInfo, this.balanceRechange(e));
  },
  getConfirmOrder(e) {
    if (!e.detail.userInfo) return;
    $common.getUserInfo(e.detail.userInfo, this.confirmOrder(e));
  },
  balanceRechange(e) { //余额充值
    let flag = this.data.balanceFlag;
    if (!flag) return;
    this.data.balanceFlag = false;
    let index = +e.currentTarget.dataset.index;
    $common.isRegister()
      .then(res => {
        $common.api.request(
          'POST',
          $common.config.PostReChargeOdr, {
            openId: wx.getStorageSync('openId'),
            brcType: index + 1, //1 1000 ； 2 2000 3 3000元 
          },
          (res) => {
            if (res.data.res) {
              let brcId = res.data.brcId,
                paras = res.data.paras;
              let path = `path/my/recharge/recharge`;
              wx.requestPayment({
                'timeStamp': paras.timeStamp,
                'nonceStr': paras.nonceStr,
                'package': paras.package,
                'signType': 'MD5',
                'paySign': paras.paySign,
                'success': (res) => { //支付成功
                  $common.api.request(
                    'POST',
                    $common.config.PayMentSuccessBlance, {
                      brcId: brcId,
                      path: path
                    },
                    (res) => {
                      if (res.data.res) {
                        this.getbalance();
                      } else {
                        $common.err1();
                      }
                    },
                    (res) => {
                      $common.err2();
                    },
                    (res) => { },
                    wx.getStorageSync('Ticket')
                  )
                },
                'fail': (res) => { //支付支付失败
                  $common.api.request(
                    'POST',
                    $common.config.PlaceAnOrderFailedBlance, {
                      brcId: brcId
                    },
                    (res) => { },
                    (res) => { },
                    (res) => { },
                    wx.getStorageSync('Ticket')
                  )
                }
              })
            } else {
              switch (+res.data.errType) {
                case 15:
                  $common.showModal('下单失败');
                default:
                  $common.err1();
              }
            }
          },
          (res) => {
            $common.err2();
          },
          (res) => {
            this.data.balanceFlag = true;
          },
          wx.getStorageSync('Ticket')
        )
      })
  },
  getbalance() { //获取余额
    $common.loading();
    $common.api.request(
      'POST',
      $common.config.GetMyBalance, {
        openId: wx.getStorageSync('openId')
      },
      (res) => {
        if (res.data.res) {
          let data = +res.data.stuBal;
          this.setData({
            balance: data.toFixed(2)
          })
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
    this.getbalance();
    this.tabChange();
  },
  onLoad: function (options) {

  },
  onReady: function () {
    $common.getOpenId(this.init.bind(this));
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
    this.getConsumptionDetail(true);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return $common.api.share();
  }
})