const $common = require('../../../common/common.js');
Page({
  data: {
    flag: true,
    pageSize: 5,
    pageIndex: 1, //团课
    pageIndexS: 1, //私课
    listData: [],
    teaSrc: $common.config.teaSrc,
    refundTime: 6, //上课前6个小时支持退款
    oneHour: 3600000, //一个小时的毫秒数
  },
  skipAnswer(e) { //跳转问卷调查
    let index = e.currentTarget.dataset.index;
    let listData = this.data.listData;
    wx.navigateTo({
      url: `/pages/my/answer/answer?queId=${listData[index].CorQuesId}&odrId=${listData[index].CodId}`,
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
          $common.config.PutReFund, {
            odrId: listData[index].CodId,
            corType: 1, //订单类型 0 私课   1 团课
            ltpPath: `pages/tabBar/shop/shop`
          },
          (res) => {
            if (res.data.res) {
              listData[index].CodPayType = 3;
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
                case 22:
                  $common.api.showModal('私课无法退款');
                  break;
                case 23:
                  $common.api.showModal('退款金额不足0元');
                  break;
                case 32:
                  $common.api.showModal('兑换码、优惠包、月卡购买的课程不可退款');
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
  skipMyCourseDetail(e) {
    let listData = this.data.listData;
    let index = e.currentTarget.dataset.index;
    let isGroup = this.data.isGroup;
    wx.navigateTo({
      url: `/pages/my/myCourseDetail/myCourseDetail?isGroup=${isGroup}&codId=${listData[index].CodId}`,
    })
  },
  getGroupList(isReach) { //获取团课列表
    $common.loading();
    let pageIndex = 1,
      pageSize = this.data.pageSize;
    isReach && (pageIndex = this.data.pageIndex);
    $common.api.request(
      'POST',
      $common.config.GetMyGroupCorInfos, {
        openid: wx.getStorageSync('openId'),
        pageIndex: pageIndex,
        pageSize: pageSize
      },
      (res) => {
        if (res.data.res) {
          let arr = res.data.OdrInfos;
          let listData = [];
          isReach && (listData = this.data.listData);
          let nowDate = new Date().getTime(); //获取当前时间的时间戳
          let refundTime = this.data.refundTime;
          let oneHour = this.data.oneHour;
          for (let i = 0, len = arr.length; i < len; i++) {
            arr[i].image = arr[i].CoaHeadPic;
            arr[i].name = arr[i].CorName;
            arr[i].info = arr[i].CorAbstract;
            arr[i].price = arr[i].CorRePrice;
            arr[i].oldPrice = arr[i].CorPrice;
            let start = $common.api.timeStamp(arr[i].CctStaTime);
            let end = $common.api.timeStamp(arr[i].CctEndTime);
            arr[i].showTime = `${start.y}-${start.m}-${start.d} ${start.h}:${start.mi}-${end.h}:${end.mi}`;
            let startTime = arr[i].CctStaTime.replace(/\D/g, '');
            arr[i].refund = startTime - nowDate > refundTime * oneHour ? true : false;
            listData.push(arr[i]);
          }
          arr.length >= pageSize && (this.data.pageIndex++);
          listData = $common.api.unique(listData, 'CodId');
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
        this.data.flag = true;
        $common.hide();
      },
      wx.getStorageSync('Ticket')
    )
  },
  getList(isReach) { //获取私课列表
    $common.loading();
    let pageIndexS = 1,
      pageSize = this.data.pageSize;
    isReach && (pageIndexS = this.data.pageIndexS);
    $common.api.request(
      'POST',
      $common.config.GetMyPrivateCorInfos, {
        openid: wx.getStorageSync('openId'),
        pageIndex: pageIndexS,
        pageSize: pageSize
      },
      (res) => {
        if (res.data.res) {
          let arr = res.data.OdrInfos;
          let listData = [];
          isReach && (listData = this.data.listData);
          for (let i = 0, len = arr.length; i < len; i++) {
            arr[i].image = arr[i].CoaHeadPic;
            arr[i].name = arr[i].CorName;
            arr[i].info = arr[i].CorAbstract;
            arr[i].price = arr[i].CorRePrice;
            arr[i].oldPrice = arr[i].CorPrice;
            arr[i].corTime = arr[i].CorClaTimes;
            listData.push(arr[i]);
          }
          arr.length >= pageSize && (this.data.pageIndexS++);
          listData = $common.api.unique(listData, 'CodId');
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
        this.data.flag = true;
        $common.hide();
      },
      wx.getStorageSync('Ticket')
    )
  },
  init() {
    let isGroup = this.data.isGroup;
    let title;
    if (isGroup === 1) {
      title = '我的团课';
      this.getGroupList();
    } else {
      title = '我的私教';
      this.getList();
    }
    wx.setNavigationBarTitle({
      title: title
    })
  },

  onLoad: function(options) {
    let isGroup = options.isGroup && +options.isGroup;
    this.setData({
      isGroup: isGroup
    })

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
    let isGroup = this.data.isGroup;
    if (isGroup === 1) {
      this.getGroupList();
    } else {
      this.getList();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!this.data.flag) return;
    this.data.flag = false;
    let isGroup = this.data.isGroup;
    if (isGroup === 1) {
      this.getGroupList(true);
    } else {
      this.getList(true);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return $common.api.share();
  }
})