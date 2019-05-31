const $common = require('../../../common/common.js');
Page({
  data: {
    allPrice: '',
    userName: '',
    userPhone: '',
    flag: true,
    allbalance: 0, //总余额
    balance: 0, //余额
  },
  packageMessage(codId, isFm) { //支付成功发送模板消息
    let path = `/pages/my/vip/vip`; //模板消息的地址
    $common.loading();
    $common.api.request( //发送模板消息
      'POST',
      $common.config.VipPayMentSuccess, {
        fmoId: codId,
        path: path,
        isFm: isFm
      },
      (res) => {
        if (res.data.res) {
          wx.navigateBack({
            delta: 1
          })
        }
      },
      (res) => {
        this.packageMessage(codId, isFm);
      },
      (res) => {
        this.data.flag = true;
        $common.hide();
      },
      wx.getStorageSync('Ticket')
    )
  },
  submit(e) { //提交订单
    let formId = e.detail.formId;
    if (!this.data.flag) return;
    this.data.flag = false;
    let userName = this.data.userName,
      userPhone = this.data.userPhone;
    if (userName.trim().length <= 0) {
      $common.api.showModal('请填写姓名');
      this.data.flag = true;
      return;
    }
    if (!$common.config.phoneReg.test(userPhone)) {
      $common.api.showModal('请填写正确的手机号');
      this.data.flag = true;
      return;
    }
    $common.isRegister()
      .then(res => {
        $common.loading();
        $common.api.request(
          'POST',
          $common.config.VipPlaceAnOrder, {
            openId: wx.getStorageSync('openId'),
            fmId: this.data.fmId,
            stuN: userName,
            stuP: userPhone,
            ubal: 0, //this.data.balance   目前购买会员卡不支持余额支付
            formId: formId
          },
          (res) => {
            $common.hide();
            if (res.data.res) {
              let codId = res.data.FmoId;
              let paras = res.data.paras;
              let isFm = res.data.isFm;
              if (!paras) { //支付成功，无需在线支付
                this.packageMessage(codId, isFm);
                return;
              }
              wx.requestPayment({ //在线支付
                timeStamp: paras.timeStamp,
                nonceStr: paras.nonceStr,
                package: paras.package,
                signType: paras.signType,
                paySign: paras.paySign,
                success: (res) => { //支付成功
                  this.packageMessage(codId, isFm);
                },
                fail: (res) => { //支付取消或失败
                  this.data.flag = true;
                  $common.api.request(
                    'POST',
                    $common.config.VipPlaceAnOrderFailed, {
                      fmoId: codId
                    },
                    (res) => { },
                    (res) => { },
                    (res) => { },
                    wx.getStorageSync('Ticket')
                  )
                },
                complete: (res) => {
                  this.data.flag = true;
                }
              });
            } else {
              this.data.flag = true;
              switch (+res.data.errType) {
                case 15:
                  $common.api.showModal('下单失败，请稍后重试');
                  break;
                case 16:
                  $common.api.showModal('该会员卡已下架');
                  break;
                case 25:
                  $common.api.showModal('余额不足');
                  break;
                case 35:
                  $common.api.showModal('已开通其他会员');
                  break;
                default:
                  $common.err1();
              }
            }
          },
          (res) => {
            this.data.flag = true;
            $common.hide();
            $common.err2();
          },
          (res) => { },
          wx.getStorageSync('Ticket')
        )
      })
  },

  userName(e) {
    this.data.userName = e.detail.value;
  },
  userPhone(e) {
    this.data.userPhone = e.detail.value;
  },
  countPrice() { //计算需要支付的金额
    let allbalance = this.data.allbalance;
    let total = this.data.total;
    let balance = 0;
    let allPrice = 0;
    if (allbalance >= total) { //余额充足
      balance = total;
    } else { //余额不足
      balance = allbalance;
      allPrice = total - allbalance;
    }
    this.setData({
      balance: balance.toFixed(2),
      allPrice: allPrice.toFixed(2),
    })
  },
  getPrice() {
    $common.loading();
    $common.api.request( //获取该会员卡的金额
      'POST',
      $common.config.GetFmInfo, {
        fmId: this.data.fmId
      },
      (res) => {
        if (res.data.res) {
          let fmInfo = res.data.fmInfo;
          this.setData({
            fmInfo: fmInfo,
            total: fmInfo.FmSellMoney,
            vipName: fmInfo.FmTitle
          })
          this.countPrice();
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
  getPhone() { //获取你的姓名he手机号
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
            allbalance: 0, //stuInfo.StuBalance  目前购买会员卡不能余额支付
          });
          this.getPrice();
        }
      },
      (res) => { },
      (res) => { },
      wx.getStorageSync('Ticket')
    )
  },
  onLoad: function (options) {
    this.data.fmId = options.fmId;
    this.getPhone();
  },
  onReady: function () { },
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
    this.getPhone();
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