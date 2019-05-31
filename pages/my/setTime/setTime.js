const $common = require('../../../common/common.js');
Page({
  data: {
    teaSrc: $common.config.teaSrc
  },
  setCourseTime(e) { //修改
    let listData = this.data.listData,
      index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: `/pages/my/setCourseTime/setCourseTime?isAdd=0&cctId=${listData[index].CctId}`,
    })
  },
  newTime() { //设置
    wx.navigateTo({
      url: `/pages/my/setCourseTime/setCourseTime?isAdd=1&corId=${this.data.corId}&codId=${this.data.codId}`,
    })
  },
  endTime(e) { //结束按钮
    let index = e.currentTarget.dataset.index;
    let listData = this.data.listData;
    $common.loading();
    $common.api.request(
      'POST',
      $common.config.FinishPriCorCct, {
        cctId: listData[index].CctId
      },
      (res) => {
        if (res.data.res) {
          listData[index].CctStatus = 2;
          this.setData({
            listData: listData
          })
        } else {
          switch (+res.data.errType) {
            case 9:
              $common.api.showModal('课程尚未开始，不可结束');
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
  getCourseInfo() { //获取课程信息
    $common.loading();
    $common.api.request(
      'POST',
      $common.config.GetPriCorInfo, {
        codId: this.data.codId
      },
      (res) => {
        if (res.data.res) {
          let corInfo = res.data.CorInfo;
          corInfo.image = corInfo.CoaHeadPic;
          corInfo.name = corInfo.CorName || '私人教练课程';
          corInfo.info = corInfo.CorAbstract;
          corInfo.price = corInfo.CorRePrice;
          corInfo.oldPrice = corInfo.CorPrice;
          corInfo.corTime = corInfo.CorClaTimes;
          this.setData({
            corInfo: corInfo
          });
          this.getCourseList();
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
  getCourseList() { //获取上课时间表
    $common.api.request(
      'POST',
      $common.config.GetPriCorCct, {
        codId: this.data.codId,
        corId: this.data.corId
      },
      (res) => {
        if (res.data.res) {
          let listData = [];
          let arr = res.data.cctInfos;
          for (let i = 0, len = arr.length; i < len; i++) {
            let start = $common.api.timeStamp(arr[i].CctStaTime);
            let end = $common.api.timeStamp(arr[i].CctEndTime);
            arr[i].showTime = `${start.y}-${start.m}-${start.d} ${start.h}:${start.mi}-${end.h}:${end.mi}`;
            listData.push(arr[i]);
          }
          let corInfo = this.data.corInfo;
          for (let i = 0, len = +corInfo.CorClaTimes - arr.length; i < len; i++) {
            listData.push({
              CctStatus: 0
            })
          }
          // let endTime = listData[0].CctEndTime.replace(/\D/g, '');
          // let nowTime = new Date().getTime();
          // if (nowTime > endTime) { //当前时间大于结束时间，结束了
          //   listData[0].CctStatus = 2;
          // }
          this.setData({
            listData: listData
          })
        } else {
          if (res.data.errType == 6) {
            let listData = [];
            let corInfo = this.data.corInfo;
            for (let i = 0, len = +corInfo.CorClaTimes; i < len; i++) {
              listData.push({
                CctStatus: 0
              })
            }
            this.setData({
              listData: listData
            })
          }
          res.data.errType != 6 && ($common.err1());
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
  init() {
    this.getCourseInfo();

  },
  onLoad: function(options) {
    let codId = options.codId && options.codId;
    let corId = options.corId && options.corId;
    this.data.codId = codId;
    this.data.corId = corId;

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let userType = +wx.getStorageSync('userType');
    this.setData({
      userType: userType
    })
    wx.setNavigationBarTitle({
      title: userType == 1 ? '查看上课时间' : '设置上课时间'
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
    this.init();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return $common.api.share();
  }
})