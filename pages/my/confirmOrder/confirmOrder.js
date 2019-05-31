const $common = require('../../../common/common.js');
Page({
  data: {
    ppkInfo: {},
    userName: '', //姓名 
    userPhone: '', //手机号
    allbalance: 0, //总余额
    flage: true,
  },
  userName(e) {
    this.data.userName = e.detail.value;
  },
  userPhone(e) {
    this.data.userPhone = e.detail.value;
  },
  submit(e) {
    let formId = e.detail.formId;
    if (!this.data.flage) return;
    this.data.flage = false;
    let userName = this.data.userName,
      userPhone = this.data.userPhone;
    if (userName.trim().length <= 0) {
      $common.api.showModal('请填写姓名');
      this.data.flage = true;
      return;
    }
    if (!$common.config.phoneReg.test(userPhone)) {
      $common.api.showModal('请填写正确的手机号');
      this.data.flage = true;
      return;
    }
    $common.isRegister()
      .then(res => {
        $common.loading();
        $common.api.request(
          'POST',
          $common.config.PostPrePocOrder, {
            openId: wx.getStorageSync('openId'),
            ppkId: this.data.ppkId,
            payMoney: this.data.price,
            balMoney: this.data.balance,
            stuName: userName,
            stuPhone: userPhone,
            formId: formId
          },
          (res) => {
            if (res.data.res) {
              let paras = res.data.paras;
              let ppoId = res.data.ppoId;
              if (!paras) { //余额支付
                this.modalMessage(ppoId);
              } else { //在线支付
                wx.requestPayment({
                  timeStamp: paras.timeStamp,
                  nonceStr: paras.nonceStr,
                  package: paras.package,
                  signType: paras.signType,
                  paySign: paras.paySign,
                  success: (res) => { //支付成功
                    this.modalMessage(ppoId);
                  },
                  fail: (res) => { //支付取消或失败
                    this.data.flage = true;
                    $common.api.request(
                      'POST',
                      $common.config.PlaceAnOrderFailedBalance, {
                        ppoId: ppoId
                      },
                      (res) => { },
                      (res) => { },
                      (res) => { },
                      wx.getStorageSync('Ticket')
                    )
                  },
                  complete: (res) => {
                    this.data.flage = true;
                  }
                });
              }
            } else {
              switch (+res.data.errType) {
                case 15:
                  $common.api.showModal('下单失败');
                  break;
                case 16:
                  $common.api.showModal('该课程包已下架');
                  break;
                case 25:
                  $common.api.showModal('余额不足');
                  break;
                case 26:
                  $common.api.showModal('支付金额不正确');
                  break;
                case 31:
                  $common.api.showModal('兑换码已过期');
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
      })
  },
  modalMessage(ppoId) { //支付成功后发送模板消息
    let path = `pages/my/discount/discount`;
    $common.loading();
    $common.api.request(
      'POST',
      $common.config.PayMentSuccessBalance, {
        ppoId: ppoId,
        path: path
      },
      (res) => {
        wx.navigateTo({
          url: '/pages/my/discount/discount',
        })
      },
      (res) => {

      },
      (res) => {
        this.data.flage = true;
        $common.hide();
      },
      wx.getStorageSync('Ticket')
    )
  },
  init() {
    $common.api.request(
      'POST',
      $common.config.GetPrePackageInfo, {
        ppkId: this.data.ppkId
      },
      (res) => {
        if (res.data.res) {
          this.setData({
            ppkInfo: res.data.ppkInfo
          });
          this.getPhone();
        } else {
          switch (+res.data.errType) {
            case 16:
              $common.api.showModal('该课程优惠包已下架');
              break;
            case 31:
              $common.api.showModal('优惠包已过期');
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
  getPhone() { //获取你的姓名he手机号
    $common.loading();
    $common.api.request(
      'POST',
      $common.config.GetStuMemberInfo, {
        openId: wx.getStorageSync('openId')
      },
      (res) => {
        if (res.data.res) {
          let stuInfo = res.data.StuInfo;
          this.setData({
            userName: stuInfo.StuName,
            userPhone: stuInfo.StuPhone,
            allbalance: stuInfo.StuBalance
          });
          this.countPrice();
        }
      },
      (res) => { },
      (res) => {
        $common.hide();
      },
      wx.getStorageSync('Ticket')
    )
  },
  countPrice() { //计算金额
    let allbalance = this.data.allbalance; //总余额
    let allBuyPrice = this.data.ppkInfo.PpkPrice; //一共需要支付的金额
    let balance = 0;
    let price = 0;
    if (allbalance >= allBuyPrice) { //余额足够支付
      balance = allBuyPrice;
      price = 0;
    } else { //余额不足
      balance = allbalance;
      price = allBuyPrice - allbalance;
    }
    this.setData({
      balance: balance.toFixed(2),
      price: price.toFixed(2)
    })
  },
  onLoad: function (options) {
    let ppkId = options.ppkId;
    this.data.ppkId = ppkId;
  },
  onReady: function () {

  },
  onShow: function () {
    this.init();
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