const $common = require('../../../common/common.js');
const getTime = (date, isTrue) => {
  let y = date.getFullYear(),
    m = date.getMonth() + 1,
    d = date.getDate(),
    h = date.getHours(),
    mi = date.getMinutes(),
    s = date.getSeconds(),
    w = date.getDay();
  m < 10 && (m = '0' + m);
  d < 10 && (d = '0' + d);
  h < 10 && (h = '0' + h);
  mi < 10 && (mi = '0' + mi);
  s < 10 && (s = '0' + s);
  if (isTrue) {
    return `${y}-${m}-${d} ${h}:${mi}:${s}`;
  } else {
    return `${y}-${m}-${d} 00:00:00`;
  }
}
Page({
  data: {
    teaSrc: $common.config.teaSrc,
    shopSrc: $common.config.shopSrc,
    listData: [],
    StrInfo: {},
    house: [{
        name: '全部课程',
        id: -1,
      },
      {
        name: '操房一',
        id: 1,
      },
      {
        name: '操房二',
        id: 2,
      },
    ],
    houseIndex: 0,
    isHouse: false,
    pageIndex: 1,
    pageSize: 10
  },
  clickList(e) {
    let index = e.currentTarget.dataset.index;
    let listData = this.data.listData;
    let weekIndex = this.data.weekIndex;
    let isGroup = this.data.isGroup;
    let url = `/pages/shop/courseDetail/courseDetail?corId=${listData[index].CorId}&isGroup=${isGroup}`;
    if (listData[index].isFull) { //结束或满员
      url = `/pages/shop/courseDetail/courseDetail?corId=${listData[index].CorId}&isGroup=${isGroup}&isFull=false`;
    }
    wx.navigateTo({
      url: url,
    })
  },
  changeHourse(e) { //全部课程
    this.setData({
      houseIndex: e.currentTarget.dataset.index,
      isHouse: false
    });
    this.getCourseList();
  },
  weekChange(e) { //周切换
    let index = e.detail.index;
    this.data.weekIndex = index;
    if (index !== 7) {
      this.data.courTime = e.detail.time;
      if (e.detail.isScence) { //组件第一次加载完成
        let stop = setInterval(() => { //监听等到门店拿到之后再去请求
          if (this.data.isRequest) { //门店那里已经拿到数据了
            clearInterval(stop);
            this.getCourseList();
          }
        }, 100);
      } else {
        this.getCourseList();
      }

    } else {
      this.getPrivateList();
    }
  },
  getPrivateList(isReach) { //获取私教列表
    $common.loading();
    this.setData({
      listData: [],
    });
    let pageSize = this.data.pageSize,
      pageIndex = 1;
    isReach && (pageIndex = this.data.pageIndex);
    $common.api.request(
      'POST',
      $common.config.GetStrPriCourseInfos, {
        strId: this.data.strId,
        pageIndex: pageIndex,
        pageSize: pageSize
      },
      (res) => {
        if (res.data.res) {
          let arr = res.data.corInfos;
          let listData = [];
          isReach && (listData = this.data.listData);
          for (let i = 0, len = arr.length; i < len; i++) {
            arr[i].name = arr[i].CorName;
            arr[i].image = arr[i].CoaHeadPic;
            arr[i].info = arr[i].CorAbstract;
            arr[i].corTime = arr[i].CorClaTimes;
            arr[i].price = arr[i].CorRePrice;
            arr[i].oldPrice = arr[i].CorPrice;
            listData.push(arr[i]);
          }
          arr.length >= pageSize && (this.data.pageIndex++);
          listData = $common.api.unique(listData, 'CorId');
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
  getCourseList() { //获取课程列表，包含团课和私教
    $common.loading();
    this.setData({
      listData: [],
    })
    let weekIndex = +this.data.weekIndex;
    if (weekIndex == 0) {
      this.data.courTime = getTime(new Date(), true);
    }
    let d = $common.api.timeStamp('' + new Date().getTime());
    let str = `${d.h}${d.mi}${d.s}`;
    $common.api.request(
      'POST',
      $common.config.GetStrCourseInfo, {
        strId: this.data.strId,
        courTime: this.data.courTime,
        courType: this.data.isGroup === 0 ? 0 : this.data.house[this.data.houseIndex].id, //-1 全部类型团课  0 私课  1 操房一  2 操房二
        mark: str,
      },
      (res) => {
        if (res.data.res) {
          let listData = res.data.CorInfos;
          for (let i = 0, len = listData.length; i < len; i++) {
            listData[i].image = listData[i].CoaHeadPic;
            listData[i].name = listData[i].CorName;
            listData[i].info = listData[i].CorAbstract;
            listData[i].price = listData[i].CorRePrice;
            listData[i].oldPrice = listData[i].CorPrice;
            let start = $common.api.timeStamp(listData[i].CctStaTime);
            let end = $common.api.timeStamp(listData[i].CctEndTime);
            listData[i].time = `${start.h}:${start.mi}-${end.h}:${end.mi}`;
            listData[i].isHot = listData[i].CorAlready / listData[i].CorPerCount >= listData[i].TensionRatio ? true : false; //剩余不足3成为紧张
            let staTime = +listData[i].CctStaTime.replace(/\D/g, '');
            listData[i].isFull = new Date().getTime() >= staTime ? 2 : listData[i].CorAlready >= listData[i].CorPerCount ? 1 : false; //1满员 2结束
          }
          this.setData({
            listData: listData
          })
        } else {
          switch (+res.data.errType) {
            case 1:
              $common.api.showModal(`出错了！错误码：${mark}`);
              break;
            case 4:
              $common.api.showModal(`未知错误。错误码：${mark}`);
              break;
            case 6:
              break;
            default:
              $common.api.showModal(`未知错误!错误码：${mark}`);
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
  skipShopDetail() { //点击了解
    let StrInfo = this.data.StrInfo;
    wx.navigateTo({
      url: `/pages/shop/shopDetail/shopDetail?strId=${StrInfo.StrId}&isUrl=1`,
    })
  },
  changeHouse() {
    this.setData({
      isHouse: !this.data.isHouse
    })
  },
  getShopInfo() { //获取门店信息
    $common.api.request(
      'POST',
      $common.config.GetStoreAbsInfo, {
        strId: this.data.strId
      },
      (res) => {
        if (res.data.res) {
          this.setData({
            StrInfo: res.data.StrInfo
          })
        } else {}
      },
      (res) => {},
      (res) => {
        this.data.isRequest = true;
      },
      wx.getStorageSync('Ticket')
    )
  },
  init() {
    this.getShopInfo();
  },
  onLoad: function(options) {
    this.data.strId = options.strId && options.strId;
    this.setData({
      isGroup: +options.isGroup //1团 0私 2两人同行一人免单
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    $common.getOpenId(this.init.bind(this)); //获取openid
  },

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
    let weekIndex = this.data.weekIndex;
    if (weekIndex !== 7) {
      this.getCourseList();
    } else {
      this.getPrivateList();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let weekIndex = this.data.index;
    if (weekIndex === 7) {
      this.getPrivateList(true);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return $common.api.share();
  }
})