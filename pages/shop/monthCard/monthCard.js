// pages/shop/monthCard/monthCard.js
const $common = require('../../../common/common.js');
const $api = require('../../../common/api.js');
Page({

  data: {
    teaSrc: $common.config.teaSrc,
    showPlay: true, //页面显示支付
    McoId: 0, //会员卡Id
    monthCardInfo: { //月卡信息
      CardData: [],
      Studata: {
        StuName: '',
        StuPhone: ''
      }
    },
    pickerIndex: 0,
    EffectiveDays: 0,
    list: [],
    total: 1,
    page: 1,
  },
  bindChange(e) {
    this.setData({ pickerIndex: e.detail.value })
  },
  renew() {
    this.setData({ showPlay: true })
    this.getMonthCardInfo()
  },
  toShop() {
    wx.switchTab({ url: '/pages/tabBar/shop/shop' })
  },
  clickList(e) {
    let list = this.data.list;
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: `/pages/my/myCourseDetail/myCourseDetail?isGroup=${1}&codId=${list[index].CodId}`,
    })
  },
  toRules() {
    wx.navigateTo({ url: '/pages/shop/rules/rules' })
  },
  formSubmit(e) {
    const { pickerIndex, monthCardInfo } = this.data
    $common.isRegister()
      .then(res => {
        $common.api.request('POST', $common.config.MonthPayMonthlyCard, {
          McId: monthCardInfo.CardData[pickerIndex].Mcid,
          OpenId: wx.getStorageSync('openId')
        },
          res => {
            if (res.data.res) {
              const McoId = res.data.Mcoid
              wx.requestPayment({
                ...res.data.paras,
                success: res => {
                  this.setData({ showPlay: false, McoId })
                  this.getMonthCardOrder()
                },
                fail: res => {
                  $common.api.request('POST', $common.config.MonthPlaceAnOrderFailed, {
                    McoId, PayType: McoId ? 1 : 0
                  })
                }
              })
            } 
            else if (res.data.errType==300) {
              $api.showModal('该商品已下架')
            } 
            else if (res.data.errType==2) {
              $api.showModal('用户不存在')
            } 
            else if (res.data.errType==5) {
              $api.showModal('下单失败')
            } 
            else {
              $common.err1()
            }
          },
          err => { $common.err2() },
          res => { })
      })
  },
  getMonthCardOrder() { //获取月卡消费订单
  console.log(this.data.McoId)
    let { list, page } = this.data
    $common.loading()
    $common.api.request('POST', $common.config.GetMonthlyCardCorOrder, {
      page: page,
      McoId: this.data.McoId,
    },
      res => {
        if (res.data.res) {
          let { EffectiveDays, data: arr, total } = res.data
          for (let i = 0, len = arr.length; i < len; i++) {
            arr[i].image = arr[i].CorMainPics;
            arr[i].name = arr[i].CorName;
            arr[i].info = arr[i].CorAbstract;
            arr[i].price = arr[i].CorRePrice;
            arr[i].oldPrice = arr[i].CorPrice;
            let start = $common.api.timeStamp(arr[i].CodStartTime);
            let end = $common.api.timeStamp(arr[i].CodEndTime);
            arr[i].showTime = `${start.y}-${start.m}-${start.d} ${start.h}:${start.mi}-${end.h}:${end.mi}`;
            let endT = +arr[i].CodEndTime.replace(/\D/g, '')
            arr[i].tabIndex = new Date().getTime() > endT ? 1 : 0
            list.push(arr[i])
          }
          this.setData({ EffectiveDays, list, total })
        } else {
          $common.err1()
        }
      },
      err => { $common.err2() },
      res => { $common.hide() })
  },
  getMonthCardInfo() { //获取月卡信息
    $common.loading()
    $common.api.request('POST', $common.config.GetMonthlyCardInfo, {
      OpenId: wx.getStorageSync('openId')
    },
      res => {
        if (res.data.res) {
          console.log(res.data)
          this.setData({ monthCardInfo: res.data })
        } else {
          $common.err1()
        }
      },
      err => { $common.err2() },
      res => { $common.hide() })
  },
  init() {
    $common.api.request('POST', $common.config.GetIsPayMonthlyCard, {
      OpenId: wx.getStorageSync('openId')
    },
      res => {
        if (res.data.res) {
          const { Mcoid: McoId } = res.data
          this.setData({ McoId })
          if (McoId) { //有购买过月卡
            this.setData({ showPlay: false })
            this.getMonthCardOrder()
          } else { //未购买过
            this.setData({ showPlay: true })
            this.getMonthCardInfo()
          }
        } else {
          $common.err1();
        }
      },
      err => {
        $common.err2()
      },
      res => { })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.init()
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.page++
    this.getMonthCardOrder()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return $common.api.share();
  }
})