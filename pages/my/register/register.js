// pages/my/register/register.js
const $common = require('../../../common/common.js')
const getEndTime = () => {
  const o = $common.api.timeStamp('' + new Date().getTime())
  return `${o.y}-${o.m}-${o.d}`
}
Page({
  data: {
    Register: true, //true已注册 false未注册
    end: getEndTime(),
    options: null,
    StuName: '',
    StuPhone: '',
    Birthday: '',
  },
  inputName(e) {
    this.data.StuName = e.detail.value
  },
  inputPhone(e) {
    this.data.StuPhone = e.detail.value
  },
  bindDateChange(e) {
    this.setData({ Birthday: e.detail.value })
  },
  register() {
    $common.loading();
    let { StuName, StuPhone, Birthday } = this.data
    StuName = StuName.trim()
    if (StuName.length <= 0) return $common.api.showModal('请完善您的姓名')
    if (!$common.config.phoneReg.test(StuPhone)) return $common.api.showModal('请完善您的手机号')
    if (!Birthday) return $common.api.showModal('请选择出生日期')
    $common.api.request('POST', $common.config.PutStuRegister, {
      openId: wx.getStorageSync('openId'),
      StuName, StuPhone, Birthday
    },
      res => {
        if (res.data.res) {
          this.toURL()
        } else {
          $common.err1()
        }
      },
      err => { $common.err2() },
      res => { $common.hide() })
  },
  getUserInfo(e) {
    if (!e.detail.userInfo) return;
    $common.getUserInfo(e.detail.userInfo, this.register)
  },
  toURL() {
    let { options } = this.data
    if (options.loginTo) { //需要跳转至指定页面，目前只有“我的”页
      let url
      try {
        let obj = JSON.parse(options.loginData)
        let data = ''
        for (let k in obj) data += `${k}=${obj[k]}&`
        url = `${options.loginTo}?${data}`
      } catch (err) {
        url = '/pages/tabBar/shop/shop'
      }
      wx.reLaunch({ url })
    } else {
      wx.navigateBack({ detail: 1 })
    }
  },
  init() {
    if (!wx.getStorageSync('openId')) return $common.getOpenId(this.init)
    $common.api.request('POST', $common.config.IsStuRegister, {
      openId: wx.getStorageSync('openId')
    },
      res => {
        if (res.data.res) {
          const { Register } = res.data
          if (Register) return this.toURL()
          this.setData({ Register })
        } else {
          $common.err1()
        }
      },
      err => { $common.err2() },
      res => { })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.options = options
    this.init()
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
    return $common.api.share()
  }
})