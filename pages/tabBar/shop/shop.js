const $common = require('../../../common/common.js');
Page({
  data: {
    shopSrc: $common.config.shopSrc,
    teaSrc: $common.config.teaSrc,
    bannerSrc: $common.config.bannerSrc,
    areaList: [],
    areaIndex: 0,
    swiperList: [], //轮播图
    storeInfos: [], //门店列表
    store: '',
    corInfos: [], //教练课程表
  },
  clickSwiper(e) { //轮播图点击事件
    let swiperList = this.data.swiperList;
    let index = e.detail.index;
    let url = swiperList[index].LpbPath;
    if (url) {
      if (url === '/pages/shop/invite/invite') { //老带新的活动，随便带个店铺id过去
        url = `/pages/shop/invite/invite?strId=${this.data.storeInfos.length > 0 ? this.data.storeInfos[0].StrId : 2}`;
      }
      wx.navigateTo({
        url,
      })
    }
  },
  areaChange(e) { //门店地点切换
    this.setData({
      areaIndex: +e.detail.value,
      storeInfos: []
    });
    this.getShoplist();
  },
  skipCourseList(e) { //跳转到区分团课或私课的页面
    let index = e.currentTarget.dataset.index,
      storeInfos = this.data.storeInfos;
    wx.navigateTo({
      url: `/pages/shop/groupOrPrivate/groupOrPrivate?strId=${storeInfos[index].StrId}`,
    })
  },

  weekChange(e) { //获取当前时间下的课程
    let time = e.detail.time;
    this.setData({
      corInfos: []
    })
    $common.loading();
    $common.api.request(
      'POST',
      $common.config.GetCoaCorInfos, {
        openId: wx.getStorageSync('openId'),
        corTime: time
      },
      (res) => {
        if (res.data.res) {
          let corInfos = res.data.corInfos;
          for (let i = 0, len = corInfos.length; i < len; i++) {
            corInfos[i].image = corInfos[i].CoaHeadPic;
            corInfos[i].info = corInfos[i].CorAbstract;
            corInfos[i].name = corInfos[i].CorName;
            let start = $common.api.timeStamp(corInfos[i].CctStaTime);
            let end = $common.api.timeStamp(corInfos[i].CctEndTime);
            corInfos[i].time = `${start.h}:${start.mi}-${end.h}:${end.mi}`;
          }
          this.setData({
            corInfos: corInfos
          })
        } else {
          if (res.data.errType !== 6) {
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
  getCityList() { //获取城市信息
    $common.api.request(
      'POST',
      $common.config.GetCityInfos,
      null,
      (res) => {
        if (res.data.res) {
          let areaList = res.data.Citys;
          $common.api.getLocation( //获取当前经纬度
            (res) => {
              let latitude = res.latitude;
              let longitude = res.longitude;
              this.data.latitude = latitude;
              this.data.longitude = longitude;
              $common.api.reverseGeocoder( //地址逆解析，获取当前位置
                {
                  latitude: latitude,
                  longitude: longitude,
                },
                (res) => {
                  let city = res.result.address_component.city;
                  let areaIndex = 0;
                  for (let i = 0, len = areaList.length; i < len; i++) {
                    if (city.indexOf(areaList[i].CtyName) != -1) {
                      areaIndex = i;
                      break;
                    }
                  }
                  this.setData({
                    areaList: areaList,
                    areaIndex: areaIndex
                  });
                  this.getShoplist();
                },
                (res) => {
                  this.setData({
                    areaList: areaList,
                    areaIndex: 0
                  });
                  this.getShoplist();
                }
              )
            },
            (res) => {
              this.setData({
                areaList: areaList,
                areaIndex: 0
              });
              this.getShoplist();
            }
          );
        } else {
          $common.err1();
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
  getDistance(storeInfos, i, len) { //获取距离
    $common.api.geocoder.call( //递归获取数组每一位的经纬度
      this,
      storeInfos[i].StrConAds,
      (res) => { },
      (res) => { },
      (res) => {
        if (res.status === 0) { //获取经纬度成功
          storeInfos[i].latitude = res.result.location.lat;
          storeInfos[i].longitude = res.result.location.lng;
        } else { //获取经纬度失败
          storeInfos[i].latitude = 0;
          storeInfos[i].longitude = 0;
        }
        let disance = $common.api.getDisance(this.data.latitude, this.data.longitude, storeInfos[i].latitude, storeInfos[i].longitude); //获取到当前位置与目标位置的距离，以米为单位
        storeInfos[i].disance = disance;
        i++;
        if (i < len) {
          this.getDistance(storeInfos, i, len);
        } else {
          storeInfos = storeInfos.sort(function (a, b) { //从小到大排序
            return a.disance - b.disance;
          });
          this.setData({
            storeInfos: storeInfos
          })
        }
      }
    )
  },
  getShoplist() { //获取门店列表
    let areaList = this.data.areaList,
      areaIndex = this.data.areaIndex;
    if (areaList.length <= 0) return;
    $common.loading();
    $common.api.request(
      'POST',
      $common.config.GetStoreInfos, {
        ctyId: areaList[areaIndex].CtyId
      },
      (res) => {
        if (res.data.res) {
          let storeInfos = res.data.storeInfos;
          let i = 0,
            len = storeInfos.length;
          this.getDistance(storeInfos, i, len);
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
  getBanner() { //获取banner图
    $common.api.request(
      'POST',
      $common.config.GetBanInfos,
      null,
      (res) => {
        if (res.data.res) {
          let arr = res.data.banInfos;
          for (let i = 0, len = arr.length; i < len; i++) {
            arr[i].image = arr[i].LpbName;
          }
          this.setData({
            swiperList: arr
          })
        } else {
          +res.data.errType !== 6 && ($common.err1());
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
    let userType = wx.getStorageSync('userType');
    this.setData({
      userType: userType
    });
    this.getCityList();
    this.getBanner();
  },
  onLoad: function (options) {
    $common.getOpenId(this.init.bind(this)); //获取openid
  },

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
    wx.stopPullDownRefresh();
    $common.getOpenId(this.init.bind(this)); //获取openid
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
    return $common.api.share();
  }
})