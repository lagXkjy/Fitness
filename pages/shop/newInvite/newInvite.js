// pages/shop/newInvite/newInvite.js
const $common = require('../../../common/common.js')
Page({
  data: {
    contentSrc: $common.config.contentSrc,
    InvitCodeSrc: $common.config.InvitCodeSrc,
    canvasIsShow: false,
    bannerAndRules: {},
    InviData: {
      ArrivalMoneySum: 0,
      NoArrivalMoneySum: 0
    },
    src: '',
    downloadSrc: '',
    falg: false
  },
  toMyInvite(e) {
    let { type } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/shop/myInvite/myInvite?type=${type}` })
  },
  toShop() {
    wx.switchTab({ url: '/pages/tabBar/shop/shop' })
  },
  canvasShowChange() {
    let { canvasIsShow } = this.data
    this.setData({ canvasIsShow: !canvasIsShow })
    setTimeout(() => {
      this.createCanvas()
    }, 500)
  },
  getCodeUrl() {
    $common.api.request('POST', $common.config.GetInvCouQrCode,
      { OpenId: wx.getStorageSync('openId') },
      res => {
        if (res.data.res) {
          this.data.src = `${this.data.InvitCodeSrc}${res.data.QrCodeUrl}`
          this.download()
        }
      },
      err => { $common.err2() },
      res => { }
    )
  },
  download(callback = () => { }) {
    const { src } = this.data
    if (!src) return
    $common.api.downloadFile(src)
      .then(res => {
        if (res.statusCode === 200) {
          this.data.downloadSrc = res.tempFilePath
          callback()
        } else {
          $common.api.showModal('图片下载失败')
        }
      }).catch($common.err1)
  },
  createCanvas() {
    const { downloadSrc: img, falg } = this.data
    if (!img && !falg) {
      this.data.falg = true
      return this.download(this.createCanvas)
    }
    const fontBlod = (_this, str, w, y) => {
      const x = (w - _this.measureText(str).width) / 2
      _this.fillText(str, x, y - 0.5)
      _this.fillText(str, x, y + 0.5)
      _this.fillText(str, x - 0.5, y)
      _this.fillText(str, x + 0.5, y)
    }
    wx.createSelectorQuery().select('#cordcanvas').boundingClientRect(res => {
      const { width, height } = res
      const headH = parseInt(height * 0.3)
      const ctx = wx.createCanvasContext('cordcanvas')
      ctx.setFillStyle('#ff425b')
      //绘制头部区域
      ctx.fillRect(0, 0, width, headH)
      ctx.setFillStyle('#ffffff')
      const fontSize = 20
      const str1 = '新用户购买'
      const str2 = '领取20元代金券'
      const str1y = headH / 2 - fontSize / 2
      const str2y = headH / 2 + fontSize
      ctx.setFontSize(fontSize)
      //绘制文字1，并加粗
      fontBlod(ctx, str1, width, str1y)
      //绘制文字2，并加粗
      fontBlod(ctx, str2, width, str2y)
      //绘制白色区域
      const footH = height - headH
      ctx.fillRect(0, headH, width, footH)
      //绘制图片
      const imgW = parseInt(width * 0.6)
      const imgY = (footH - imgW) / 2 + headH
      const imgX = (width - imgW) / 2
      ctx.drawImage(img, imgX, imgY, imgW, imgW)
      ctx.draw()
    }).exec()
  },
  getBannerAndRules() {
    $common.api.request('POST', $common.config.GetInvCouBanner,
      { OpenId: wx.getStorageSync('openId') },
      res => {
        if (res.data.res) {
          let { RuleData: bannerAndRules, InviData } = res.data
          this.setData({ bannerAndRules, InviData })
        } else {
          $common.err1()
        }
      },
      err => {
        $common.err2()
      },
      res => { })
  },
  init() {
    this.getBannerAndRules()
    this.getCodeUrl()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      path: `/pages/shop/getInvite/getInvite?InvitationOpenId=${wx.getStorageSync('openId') || ''}`
    }
  }
})