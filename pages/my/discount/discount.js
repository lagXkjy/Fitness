const $common = require('../../../common/common.js');
Page({
  data: {
    listData: [],
    pageIndex: 1,
    pageSize: 10,
  },
  discountDetail(e) { //优惠包详情
    let index = e.currentTarget.dataset.index;
    let listData = this.data.listData;
    wx.navigateTo({
      url: `/pages/my/discountDetail/discountDetail?mppId=${listData[index].MppId}`,
    })
  },
  init(isReach) {
    let pageIndex = isReach ? this.data.pageIndex : 1;
    let pageSize = this.data.pageSize;
    $common.loading();
    $common.api.request(
      'POST',
      $common.config.GetMppInfos, {
        openId: wx.getStorageSync('openId'),
        pageIndex: pageIndex,
        pageSize: pageSize
      },
      (res) => {
        if (res.data.res) {
          let listData = isReach ? this.data.listData : [];
          let arr = res.data.data;
          for (let i = 0, len = arr.length; i < len; i++) {
            let term = $common.api.timeStamp(arr[i].MppTermVal);
            let showTime = $common.api.timeStamp(arr[i].MppCreateOn);
            arr[i].term = `${term.y}-${term.m}-${term.d}`;
            arr[i].buyTime = `${showTime.y}-${showTime.m}-${showTime.d} ${showTime.h}:${showTime.mi}`;
            listData.push(arr[i]);
          }
          arr.length >= pageSize && pageIndex++;
          this.data.pageIndex = pageIndex;
          listData = $common.api.unique(listData, 'MppId');
          this.setData({
            listData: listData
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
    this.init(true);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return $common.api.share();
  }
})