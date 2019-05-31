let mapKey = require('./qqmap.js');
module.exports = {
  //发送请求
  request(method = 'GET', url = 'www.baidu.com', data = {}, success = () => { }, fail = () => { }, complete = () => { }, Ticket = wx.getStorageSync('Ticket')) {
    let header = Ticket ? { 'content-type': 'application/json', 'Ticket': Ticket } :
      { 'content-type': 'application/json', };
    // let header = Ticket ? { 'content-type': 'json', 'Ticket': Ticket } :
    //   { 'content-type': 'json', };
    wx.request({
      url: url,
      data: data,
      header: header,
      method: method,
      dataType: 'json',
      success: success,
      fail: fail,
      complete: complete
    })
  },
  //用户分享,默认展示首页
  share(path = '', title = '健身预约', imageUrl = '', success = () => { }) {
    path = `/pages/tabBar/shop/shop`
    return { title, path, imageUrl, success }
  },
  showModal(content = '你觉得缺点什么？', showCancel = false, success = () => { }, confirmText = '确定', title = '提示', cancelText = '取消') {
    wx.showModal({
      title: title,
      content: content,
      showCancel: showCancel,
      confirmText: confirmText,
      cancelText: cancelText,
      success: success
    })
  },
  //拨打电话
  makePhoneCall(phoneNumber = '1340000', success = () => { }, fail = () => { }, complete = () => { }) {
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
      success: success,
      fail: fail,
      complete: complete
    })
  },
  //获取当前位置
  getLocation(success = () => { }, fail = () => { }, type = 'wgs84') {
    wx.getLocation({
      type: type,
      success: success,
      fail: fail
    })
  },
  //查看位置
  openLocation(obj = { latitude: 39.984060, longitude: 116.307520 }, scale = 18) {
    wx.openLocation({
      latitude: obj.latitude,
      longitude: obj.longitude,
      scale: scale
    })
  },
  //腾讯地图地址解析
  geocoder(address = '北京市海淀区彩和坊路海淀西大街74号', success = () => { }, fail = () => { }, complete = () => { }) {
    mapKey.geocoder({
      address: address,
      success: success,
      fail: fail,
      complete: complete
    })
  },
  //腾讯地图逆地址解析
  reverseGeocoder(obj = { latitude: 39.984060, longitude: 116.307520 }, success = () => { }, fail = () => { }, complete = () => { }) {
    mapKey.reverseGeocoder({
      location: obj,
      success: success,
      fail: fail,
      complete: complete
    })
  },
  //腾讯地图计算距离
  calculateDistance(target, origin, success = () => { }, fail = () => { }, complete = () => { }) {
    mapKey.calculateDistance({
      from: origin,
      to: target,
      success: success,
      fail: fail,
      complete: complete
    });
  },
  //经纬度计算距离
  getDisance(lat1, lng1, lat2, lng2) {
    let toRad = d => d * Math.PI / 180;
    let radLat1 = toRad(lat1);
    let radLat2 = toRad(lat2);
    let deltaLat = radLat1 - radLat2;
    let deltaLng = toRad(lng1) - toRad(lng2);
    let dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
    return dis * 6378137;
  },
  //数组去重保留旧数据
  unique(arr, id) {
    let hash = {};
    return arr.reduce(function (item, target) {
      hash[target[id]] ? '' : hash[target[id]] = true && item.push(target);
      return item;
    }, []);
  },
  //数组去重保留新数据
  uniqueNew(arr, id) {
    let hash = {};
    return arr.reduce(function (item, target, index) {
      hash[target[id]] ? item[hash[target[id]].nowIndex] = target : hash[target[id]] = {
        nowIndex: item.push(target) && index
      }
      return item;
    }, []);
  },
  //时间戳转换为时间
  timeStamp(str) {
    let timeStamp = str.replace(/\D/g, '');
    let date = new Date(+timeStamp),
      y = date.getFullYear(),
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
    let obj = {
      y: y,
      m: m,
      d: d,
      h: h,
      mi: mi,
      s: s,
      w: w
    }
    return obj;
  },
  downloadFile(url) {
    return new Promise((resolve, reject) => wx.downloadFile({ url, success: resolve }))
  }
}