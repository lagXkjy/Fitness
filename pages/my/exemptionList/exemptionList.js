const $common = require('../../../common/common.js');
Page({
  data: {
    listData: [],
    pageSize: 5,
    pageIndex: 1,
    teaSrc: $common.config.teaSrc,
  },
  skipMyCourseDetail(e) { //查看课程详情
    let listData = this.data.listData;
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: `/pages/my/myCourseDetail/myCourseDetail?isGroup=${2}&codId=${listData[index].CoId}`,
    })
  },
  clickRefund(e) { //点击退款
    $common.api.showModal('确认退款？', true,
      (res) => {
        if (!res.confirm) return;
        let index = e.currentTarget.dataset.index;
        let listData = this.data.listData;
        $common.loading();
        $common.api.request(
          'POST',
          $common.config.exemptionPutReFund, {
            cboId: listData[index].CoId,
            ltpPath: `pages/tabBar/shop/shop`
          },
          (res) => {
            if (res.data.res) {
              listData[index].CoPayType = 4;
              this.setData({
                listData: listData
              })
            } else {
              switch (+res.data.errType) {
                case 19:
                  $common.api.showModal('上课前6小时不可退款');
                  break;
                case 20:
                  $common.api.showModal('该订单已退款');
                  break;
                case 21:
                  $common.api.showModal('该订单未支付成功');
                  break;
                default:
                  $common.api.showModal('退款失败');
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
      }
    );
  },
  init(isReach) {
    $common.loading();
    let pageIndex = 1,
      pageSize = this.data.pageSize;
    isReach && (pageIndex = this.data.pageIndex);
    $common.api.request(
      'POST',
      $common.config.GetCorBoInfos, {
        openId: wx.getStorageSync('openId'),
        page: pageIndex,
        size: pageSize
      },
      (res) => {
        if (res.data.res) {
          let arr = res.data.data;
          let listData = [];
          isReach && (listData = this.data.listData);
          // CoIsItOver 0 已预约 1 已完成
          // CoPayType 1 未支付 2 已支付 3 支付失败 4 已退款
          for (let i = 0, len = arr.length; i < len; i++) {
            arr[i].image = arr[i].CoCoaInfo.CoaHeadPic;
            arr[i].name = arr[i].CorInfo.CbTitle;
            arr[i].info = arr[i].CorInfo.CbAbstract;
            arr[i].price = arr[i].CorInfo.CbRePrice;
            arr[i].oldPrice = arr[i].CorInfo.CbPrice;
            let start = $common.api.timeStamp(arr[i].CoCorStartTime);
            let end = $common.api.timeStamp(arr[i].CoCorEndTime);
            arr[i].showTime = `${start.y}-${start.m}-${start.d} ${start.h}:${start.mi}-${end.h}:${end.mi}`;
            listData.push(arr[i]);
          }
          arr.length >= pageSize && (this.data.pageIndex++);
          listData = $common.api.unique(listData, 'CoId');
          this.setData({
            listData: listData
          })
        } else {
          +res.data.errType !== 6 && ($common.err1());
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
  onShow: function() {
    this.setData({ //删除订单后返回来数据没变
      listData: []
    })
    this.init();
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
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.init(true);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return $common.api.share();
  }
})