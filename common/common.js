const config = require('./config.js');
const api = require('./api.js');
module.exports = Object.freeze({
  config: config,
  api: api,
  /**
   * 获取ticket,有效时间一小时
   */
  Login(callback = () => { }) {
    wx.showLoading({ title: '请求中...' })
    api.request(
      'POST',
      config.Login,
      { userName: 'FitnessApp', userPwd: 'FitnessApp123+-+.' }, //账号密码固定不变
      (res) => {
        wx.hideLoading();
        if (res.data.res) {
          console.log(res)
          const Ticket = res.data.userInfo.Ticket;
          wx.setStorageSync('Ticket', Ticket);
          wx.setStorageSync('TicketTime', new Date().getTime()); //ticket有效期一小时
          callback();
        } else {
          wx.setStorageSync('Ticket', '');
          api.showModal('您没有访问权限！');
        }
      },
      (res) => {
        wx.hideLoading();
        api.showModal('网络不给力，请稍后重试！');
      },
      (res) => { }
    )
  },
  /**
   * 获取openId
   */
  getOpenId(callback = () => { }) {
    let Ticket = wx.getStorageSync('Ticket');
    let TicketTime = wx.getStorageSync('TicketTime') || 0;
    let nowTime = new Date().getTime();
    if (!Ticket || nowTime - TicketTime > 3500000) { //即将过期，重新获取Ticket
      this.Login(this.getOpenId.bind(this, callback));
      return;
    }
    if (wx.getStorageSync('openId')) { //有openId
      callback();
      return;
    }
    wx.showLoading({ title: '请求中...' })
    wx.login({
      success: (res) => {
        if (res.code) {
          const code = res.code;
          api.request(
            'POST',
            config.GetUserOpenId,
            {
              code: code
            },
            (res) => {
              if (res.data.res) {
                wx.setStorageSync('openId', res.data.openid);
                wx.setStorageSync('userType', 1);
                // wx.setStorageSync('userType', res.data.userType);
                callback();
              } else {
                api.showModal('未知错误');
              }
            },
            (res) => {
              api.showModal('网络不给力，请稍后重试！');
            },
            (res) => {
              wx.hideLoading();
            },
            wx.getStorageSync('Ticket')
          )
        } else {
          // api.showModal('登录失败！');
        }
      },
      fail: () => {
        wx.hideLoading();
      }
    })
  },
  /**
   * 获取个人信息
   */
  getUserInfo(userInfo = {}, callback = () => { }) {
    wx.setStorageSync('userInfo', userInfo);
    let openId = wx.getStorageSync('openId');
    if (!openId) {
      this.getOpenId(this.getUserInfo);
      return;
    }
    api.request(
      'POST',
      config.PutUserNiAv,
      {
        openId: wx.getStorageSync('openId'),
        userNick: userInfo.nickName,
        userAva: userInfo.avatarUrl
      },
      (res) => {
        if (res.data.res) {
          callback();
        } else {
          api.showModal('未知错误');
        }
      },
      (res) => {
        api.showModal('网络不给力，请稍后重试！');
      },
      (res) => { },
      wx.getStorageSync('Ticket')
    )
  },
  /**
   * 判断Ticket是否过期
   */
  globalFun(callback = () => { }) {
    let nowTime = new Date().getTime();
    let beforeTime = wx.getStorageSync('TicketTime');
    if (nowTime - beforeTime > 3500000) { //即将过期，重新获取Ticket
      this.Login(callback);
    }
    callback();
  },
  //判断用户是否注册
  isRegister() {
    return new Promise((resolve) => {
      this.getOpenId(() => {
        api.request('POST', config.IsStuRegister, {
          openId: wx.getStorageSync('openId')
        }, res => {
          this.hide()
          if (res.data.res) {
            const { Register } = res.data
            if (Register) return resolve(Register)
            wx.navigateTo({ url: `/pages/my/register/register` })
          } else {
            this.err1()
          }
        }, err => {
          this.hide()
          this.err2()
        })
      })
    })
  },
  err1() {
    wx.showModal({
      title: '提示',
      content: '未知错误',
      showCancel: false,
    })
  },
  err2() {
    wx.showModal({
      title: '提示',
      content: '网络不给力，请稍后重试！',
      showCancel: false,
    })
  },
  loading() {
    wx.showLoading({
      title: '请求中...',
    })
  },
  hide() {
    wx.hideLoading();
  }

});