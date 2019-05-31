const $common = require('../../../common/common.js');
const app = getApp();
Page({
  data: {
    people: [1, 2, 3],
    peopleIndex: 0,
    allPrice: '',
    teacherName: '',
    classHour: 10,
    userName: '',
    userPhone: '',
    isGroup: true,
    flage: true,
    switchStatus: true,
    redeemCode: '', //兑换码
    allbalance: 0, //总余额
    balance: 0, //余额
    discount: 0, //课程包
    discountConsume: 0, //课程包消耗数量
    coupon: null, //优惠券
    monthCardNum: 0, //月卡可用次数
    McoId: 0,
    monthCardStatus: true,
    StuIntegral: 0, //可用积分数
    integralScale: '100:1', //积分抵用比例
    showIntegralPay: 0,  //显示需用的积分数
    integralStatus: true,
    CashCount: 0, // 可用代金券数量
    ScpCount: 0, // 可用优惠券数量
  },
  selectCash() { //跳转并选择代金券
    wx.navigateTo({ url: '/pages/my/cashCoupon/cashCoupon?isPayment=true' })
  },
  selectCoupon() { //跳转并选择优惠券
    wx.navigateTo({ url: '/pages/my/coupon/coupon?isPayment=true' })
  },
  inputRedeemCode(e) { //兑换码
    this.data.redeemCode = e.detail.value.trim()
    clearTimeout(this.data.timerCode) //节流
    this.data.timerCode = setTimeout(this.countPrice, 300)
  },
  countPrice() { //计算金额
    const { isGroup } = this.data
    if (isGroup === 1) { //团课
      this.getGroupMoneny()
    } else if (isGroup === 0) { //私课
      let total = this.data.corInfo.CorRePrice;
      let allbalance = this.data.allbalance;
      let price = 0;
      let balance = 0;
      if (allbalance >= total) {
        price = 0;
        balance = total;
      } else {
        price = total - allbalance;
        balance = allbalance;
      }
      this.setData({
        balance: balance.toFixed(2),
        allPrice: price.toFixed(2),
        total: total.toFixed(2)
      })
    } else if (isGroup === 2) { //买二付一
      let allbalance = this.data.allbalance; //总余额
      let payPrice = this.data.total; //单价,获取到金额的时候复制给该字段
      let allPrice = 0; //需要现金支付的额度
      let balance = 0; //需要余额支付的额度
      if (allbalance >= payPrice) { //余额充足
        balance = payPrice;
      } else { //余额不足
        balance = allbalance;
        allPrice = payPrice - allbalance;
      }
      this.setData({
        allPrice: allPrice.toFixed(2),
        balance: balance.toFixed(2),
      })
    }
  },
  switchChange(e) { //课程包使用切换
    this.data.switchStatus = e.detail.value
    this.countPrice()
  },
  monthCardChange(e) { //月卡使用切换
    console.log(e.detail.value)
    this.data.monthCardStatus = e.detail.value
    this.countPrice()
  },
  integralChange(e) { //积分使用切换
    this.setData({ integralStatus: e.detail.value })
    this.countPrice()
  },
  packageMessage(codId) { //支付成功发送模板消息
    let isGroup = this.data.isGroup;
    let path = `pages/my/myCourseDetail/myCourseDetail?codId=${codId}&isGroup=${isGroup}`; //模板消息的地址
    $common.loading();
    $common.api.request( //发送模板消息
      'POST',
      isGroup === 2 ? $common.config.exemptionPayMentSuccess : $common.config.PayMentSuccess, {
        codId: codId,
        cboId: codId,
        path: path,
        UserOpenid: wx.getStorageSync('openId'),
        ShareOpenid: app.shareOpenId || ''    //老带新活动，分享人的openId
      },
      (res) => {
        if (res.data.res) {
          let CodAuthNum = res.data.CodAuthNum; //验证码
          console.log(res, res.data.ShareCoponStaues);
          //ShareCoponStaues 3;//不存在分享,分享人OpenId为空 2;//失败 -1;//分享人数据不正常 -2;//活动已下架 1;//成功 4;//领过了
          wx.redirectTo({
            url: `/pages/shop/buySuccess/buySuccess?codId=${codId}&isGroup=${isGroup}&CodAuthNum=${CodAuthNum}&shareSuccess=${res.data.ShareCoponStaues === 1 ? res.data.ShareCoponStaues : ''}`,
          })
        }
      },
      (res) => { },
      (res) => {
        this.data.flage = true;
        $common.hide();
      },
      wx.getStorageSync('Ticket')
    )
  },
  exemptionPayment(formId) { //买二付一提交订单
    $common.isRegister()
      .then(res => {
        $common.loading();
        $common.api.request(
          'POST',
          $common.config.PubCbAnOrder, {
            cId: this.data.corId,
            oId: wx.getStorageSync('openId'),
            pN: this.data.userName,
            pP: this.data.userPhone,
            fId: formId,
            pR: this.data.total,
            pB: this.data.balance
          },
          (res) => {
            $common.hide();
            if (res.data.res) {
              let cboId = res.data.cboId;
              let paras = res.data.paras;
              if (!paras) { //支付成功，无需在线支付
                this.packageMessage(cboId);
                return;
              }
              wx.requestPayment({ //在线支付
                timeStamp: paras.timeStamp,
                nonceStr: paras.nonceStr,
                package: paras.package,
                signType: paras.signType,
                paySign: paras.paySign,
                success: (res) => { //支付成功
                  this.packageMessage(cboId);
                },
                fail: (res) => { //支付取消或失败
                  this.data.flage = true;
                  $common.api.request(
                    'POST',
                    $common.config.exemptionPlaceAnOrderFailed, {
                      cboId: cboId
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
            } else {
              switch (res.data.errType) {
                case 14:
                  $common.api.showModal('该课程名额已满');
                  break;
                case 15:
                  $common.api.showModal('下单失败');
                  break;
                case 16:
                  $common.api.showModal('该课程已下架');
                  break;
                case 26:
                  $common.api.showModal('支付金额不正确');
                  break;
                case 28:
                  $common.api.showModal('未查询到教练信息');
                  break;
              }
            }
          },
          (res) => {
            this.data.flage = true;
            $common.hide();
            $common.err2();
          },
          (res) => { },
          wx.getStorageSync('Ticket')
        )
      })
  },
  submit(e) { //提交订单
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
    if (this.data.isGroup === 2) { //买二付一
      this.exemptionPayment(formId);
      return;
    }
    let people = this.data.people,
      peopleIndex = this.data.peopleIndex,
      redeemCode = this.data.redeemCode ? this.data.redeemCode : '', //兑换码没有填空
      discount = this.data.switchStatus ? this.data.discountConsume : 0, //课程包确认使用
      balance = this.data.balance;
    let { monthCardStatus, McoId } = this.data
    if (!monthCardStatus) McoId = -1
    let { showIntegralPay, integralStatus } = this.data
    let IntegralPay = integralStatus ? showIntegralPay : 0
    $common.loading();
    $common.api.request(
      'POST',
      $common.config.PostAnOrderNew, {
        openId: wx.getStorageSync('openId'),
        corId: this.data.corId,
        payMoney: this.data.allPrice,
        stuName: userName,
        stuPhone: userPhone,
        excCode: redeemCode,
        corPoc: discount,
        stuBalance: balance,
        formId: formId,
        perCount: +people[peopleIndex],
        scpId: this.data.coupon.ScpId,
        RcId: this.data.coupon.RcId,
        McoId,
        IntegralPay,
        ShareOpenid: app.shareOpenId || ''    //老带新活动，分享人的openId
      },
      (res) => {
        $common.hide();
        if (res.data.res) {
          let codId = res.data.codId;
          let paras = res.data.paras;
          if (!paras) { //支付成功，无需在线支付
            this.packageMessage(codId);
            return;
          }
          wx.requestPayment({ //在线支付
            timeStamp: paras.timeStamp,
            nonceStr: paras.nonceStr,
            package: paras.package,
            signType: paras.signType,
            paySign: paras.paySign,
            success: (res) => { //支付成功
              this.packageMessage(codId);
            },
            fail: (res) => { //支付取消或失败
              this.data.flage = true;
              $common.api.request(
                'POST',
                $common.config.PlaceAnOrderFailed, {
                  codId: codId
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
        } else {
          this.data.flage = true;
          switch (+res.data.errType) {
            case 14:
              $common.api.showModal('该课程名额已满');
              break;
            case 15:
              $common.api.showModal('下单失败，请稍后重试');
              break;
            case 17:
              $common.api.showModal('已购买过该课程，无需重复购买');
              break;
            case 24:
              $common.api.showModal('兑换码错误');
              break;
            case 25:
              $common.api.showModal('余额不足');
              break;
            case 26:
              $common.api.showModal('支付金额不正确 ');
              break;
            case 28:
              $common.api.showModal('未找到该教练的信息');
              break;
            case 29:
              $common.api.showModal('私课购买数量只能为1');
              break;
            case 30:
              $common.api.showModal('该兑换码已被使用');
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
        this.data.flage = true;
        $common.hide();
        $common.err2();
      },
      (res) => {

      },
      wx.getStorageSync('Ticket')
    )
  },
  changePeople(e) { //人数切换
    this.data.monthCardStatus =true;
    this.setData({ peopleIndex: +e.detail.value })
    this.countPrice()
  },
  userName(e) {
    this.data.userName = e.detail.value
  },
  userPhone(e) {
    this.data.userPhone = e.detail.value
  },
  // ceshi(){
  //   $common.api.request('POST', $common.config.ceshi, {
  //     },(res) => {
  //       console.log(res)
  //     })
  // },
  getPagesInfo() { //团课或私课获取到页面信息
    $common.loading()
    $common.api.request('POST', $common.config.GetCourseAbsInfo, {
      corId: this.data.corId,
      corType: this.data.isGroup
    },
      (res) => {
        if (res.data.res) {
          let { corInfo } = res.data
          let { isGroup } = this.data
          if (isGroup === 1) { //团
            let start = $common.api.timeStamp(corInfo.CctStaTime)
            let end = $common.api.timeStamp(corInfo.CctEndTime)
            corInfo.showTime = `${start.m}月${start.d} ${start.h}:${start.mi}-${end.h}:${end.mi}`
            //有些课程不支持课程包购买
            this.setData({ corInfo, switchStatus: corInfo.IsUsePackage })
            this.data.allPrice = parseFloat(corInfo.CorRePrice).toFixed(2)
          } else { //私
            this.setData({ corInfo, allPrice: parseFloat(corInfo.CorRePrice).toFixed(2) })
          }
          this.getPhone()
        } else { $common.err1() }
      },
      (res) => { $common.err2() },
      (res) => { $common.hide() },
      wx.getStorageSync('Ticket')
    )
  },
  getStuIntegral() { //获取学生可用积分数
    $common.api.request('POST', $common.config.GetStuIntegral, {
      OpenId: wx.getStorageSync('openId')
    },
      (res) => {
        if (res.data.res) {
          this.data.StuIntegral = res.data.StuIntegral
        }
        this.getPagesInfo()
      }
    )
  },
  getMonthCard() { //获取月卡信息
    // $common.api.request('POST', $common.config.GetCardIsPayCorOrder_new, {
    //   OpenId: wx.getStorageSync('openId')
    // },
    //   (res) => {
    //     if (res.data.res) {
    //       const { McoId, IsPay: monthCardNum } = res.data
    //       this.setData({ monthCardNum, McoId })
    //     }
    //     this.getStuIntegral()
    //   }
    // )
    $common.api.request('POST', $common.config.ceshi, {
      OpenId: wx.getStorageSync('openId')
    },
      (res) => {
        if (res.data.res) {
          const { McoId, IsPay: monthCardNum } = res.data
          this.setData({ monthCardNum, McoId })
        }
        this.getStuIntegral()
      }
    )
  },
  init() {
    const { isGroup } = this.data
    switch (isGroup) {
      case 0: //私
        this.getPagesInfo()
        break
      case 1: //团
        this.getMonthCard()
        break
      case 2: //两人同行一人免单
        this.getExemption()
        break
    }
  },
  getExemption() { //买二付一课程信息
    $common.loading();
    $common.api.request('POST', $common.config.GetCbInfoInPo, {
      cbId: this.data.corId,
    },
      (res) => {
        if (res.data.res) {
          let corInfo = res.data.cbInfo;
          let start = $common.api.timeStamp(corInfo.CbStartTime);
          let end = $common.api.timeStamp(corInfo.CbEndTime);
          corInfo.showTime = `${start.m}月${start.d} ${start.h}:${start.mi}-${end.h}:${end.mi}`;
          corInfo.CorName = corInfo.CbTitle;
          corInfo.CorAdress = corInfo.CbAddress;
          let price = parseFloat(corInfo.CbPrice).toFixed(2);
          this.setData({ corInfo, allPrice: price, total: price })
          this.getPhone();
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
    $common.api.request('POST', $common.config.GetStuMemberInfo, {
      openId: wx.getStorageSync('openId')
    },
      (res) => {
        if (res.data.res) {
          let { StuName: userName, StuPhone: userPhone, StuBalance: allbalance, MppSurplus: discount } = res.data.StuInfo
          let { CashCount, ScpCount } = res.data
          this.setData({ userName, userPhone, allbalance, discount, CashCount, ScpCount })
          this.countPrice()
        }
      },
      (res) => { },
      (res) => { },
      wx.getStorageSync('Ticket')
    )
  },
  getGroupMoneny() { //调用接口获取团课待支付金额
    let people = this.data.people;
    let index = this.data.peopleIndex;
    let num = people[index]; //商品数量
    let redeemCode = this.data.redeemCode; //兑换码
    let discount = this.data.discount; //课程包数量
    let switchStatus = this.data.switchStatus; //是否使用课程包
    let discountConsume = 0; //课程包消耗数量
    let payPrice = this.data.corInfo.CorRePrice; //单价
    let total = payPrice * num; //合计价格
    redeemCode && (num--); //有兑换码，扣一个人的
    if (switchStatus) { //使用课程包
      if (discount >= num) { //课程包数量足够
        discountConsume = num;
        num = 0;
      } else { //课程包数量不足
        discountConsume = discount;
        num = num - discount;
      }
    }
    let { monthCardStatus, McoId } = this.data
    if (!monthCardStatus) McoId = -1
    let { StuIntegral, integralStatus } = this.data
    let IntegralPay = integralStatus ? StuIntegral : 0
    this.data.discountConsume = discountConsume;
    $common.loading()
    $common.api.request('POST', $common.config.GetPayMoney, {
      openId: wx.getStorageSync('openId'),
      corId: this.data.corId,
      buyCount: +people[index],
      excCode: redeemCode,
      scpId: this.data.coupon.ScpId,
      RcId: this.data.coupon.RcId,
      corPoc: discountConsume,
      McoId,
      IntegralPay
    },
      (res) => {
        if (res.data.res) {
          let dcMoney = res.data.dcMoney, //折扣了的金额，不管
            payMoney = res.data.payMoney; //需要支付的金额，包括余额和在线支付金额
          let IntegralPay = res.data.IntegralPay //使用的积分数
          let allbalance = +this.data.allbalance; //总余额
          let balance = 0; //要支付的余额
          let allPrice = 0; //要微信支付的金额
          if (allbalance >= payMoney) { //余额足够
            balance = +payMoney;
          } else { //余额不足
            balance = allbalance;
            allPrice = payMoney - allbalance;
          }
          this.setData({
            total: total.toFixed(2),
            showIntegralPay: IntegralPay,
            balance: balance.toFixed(2),
            allPrice: allPrice.toFixed(2),
          })
        } else {
          let err = res.data.errType;
          if (err === 24 || err === 30 || err === 31 || err === 33) { //兑换码问题不予理睬
          } else if (err === 36) {
            $common.api.showModal('优惠券与兑换码不可同时使用');
          } else { $common.err1() }
        }
      },
      (res) => { $common.err2() },
      (res) => { $common.hide() },
      wx.getStorageSync('Ticket')
    )
  },
  toRecharge() {
    wx.navigateTo({ url: '/pages/my/vip/vip' })
  },
  onLoad: function (options) {
    this.data.corId = options.corId && options.corId
    //1团0私2两人同行一人免单
    this.setData({ isGroup: +options.isGroup })
  },
  onReady: function () { },
  onShow: function () {
    this.setData({ coupon: app.coupon })
    this.init()
  },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
    this.init()
  },
  onReachBottom: function () { },
  onShareAppMessage: function () {
    return $common.api.share()
  }
})