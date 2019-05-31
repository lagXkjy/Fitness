const $common = require('../../../common/common.js');
Page({
  data: {
    listData: [],
    teaSrc: $common.config.teaSrc,
  },
  clickList(e) {
    let index = e.currentTarget.dataset.index;
    let listData = this.data.listData;
    let url = `/pages/shop/courseDetail/courseDetail?corId=${listData[index].CbId}&isGroup=2`;
    if (listData[index].isFull) { //结束或满员
      url = `/pages/shop/courseDetail/courseDetail?corId=${listData[index].CbId}&isGroup=2&isFull=false`;
    }
    wx.navigateTo({
      url: url,
    })
  },
  weekChange(e) { //选项切换
    let index = e.detail.index;
    this.data.weekIndex = index;
    this.data.courTime = e.detail.time;
    this.getCourseList();
  },
  getCourseList() { //获取课程列表
    $common.loading();
    this.setData({
      listData: [],
    })
    let weekIndex = +this.data.weekIndex;
    $common.api.request(
      'POST',
      $common.config.GetCbInfos, {
        st: this.data.courTime
      },
      (res) => {
        if (res.data.res) {
          let listData = res.data.data;
          for (let i = 0, len = listData.length; i < len; i++) {
            listData[i].image = listData[i].CbCoaHeadPic;
            listData[i].name = listData[i].CbTitle;
            listData[i].info = listData[i].CbAbstract;
            listData[i].price = listData[i].CbRePrice;
            listData[i].oldPrice = listData[i].CbPrice;
            let start = $common.api.timeStamp(listData[i].CbStartTime);
            let end = $common.api.timeStamp(listData[i].CbEndTime);
            listData[i].time = `${start.h}:${start.mi}-${end.h}:${end.mi}`;
            listData[i].isHot = listData[i].CbBeBuyC / listData[i].CbPerCount >= 0.7 ? true : false; //剩余不足3成为紧张
            let staTime = +listData[i].CbStartTime.replace(/\D/g, '');
            listData[i].isFull = new Date().getTime() >= staTime ? 2 : listData[i].CbBeBuyC >= listData[i].CbPerCount ? 1 : false; //1满员 2结束
          }
          this.setData({
            listData: listData
          })
        } else {
          if (+res.data.errType !== 6) {
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
  onLoad: function(options) {},
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
    this.getCourseList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return $common.api.share();
  }
})