/**
 * 课程日期切换
 */
const app = getApp();
const weekTransition = (n) => { //周转换
  let data;
  switch (parseInt(n)) {
    case 1:
      data = '一';
      break;
    case 2:
      data = '二';
      break;
    case 3:
      data = '三';
      break;
    case 4:
      data = '四';
      break;
    case 5:
      data = '五';
      break;
    case 6:
      data = '六';
      break;
    case 0:
      data = '日';
      break;
  }
  return data;
}
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
const init = () => { //初始组件数据
  let allWeek = []; //存储包括今天前七天和今天后七天
  let arr = []; //最终返回并展示与页面的数据
  for (let i = 0; i < 7; i++) {
    let date = new Date();
    date.setDate(date.getDate() + i);
    let m = date.getMonth() + 1,
      d = date.getDate(),
      w = date.getDay();
    m < 10 && (m = '0' + m);
    d < 10 && (d = '0' + d);;
    let week = weekTransition(w);
    allWeek.push({
      allTime: getTime(date),
      time: `${m}.${d}`,
      week: week,
      day: i === 0 ? '今天' : `周${week}`,
      w: w
    });
  }
  allWeek.push({
    day: '私教',
    week: '私教',
    time: false,
  });
  return allWeek;
}
Component({
  properties: {
    isFitness: {
      type: Boolean,
      value: false,
      observer(res) {
        let listData = this.data.listData;
        listData.pop();
        this.setData({
          listData: listData
        })
      }
    },
  },
  data: {
    listData: init(),
    weekIndex: 0
  },
  methods: {
    change(e) {
      let index = +e.currentTarget.dataset.index;
      this.setData({
        weekIndex: index
      })
      let listData = this.data.listData;
      let date = new Date();
      let obj = index === 0 ? {
        index: index,
        time: getTime(date, index === 0)
      } : {
        index: index,
        time: listData[index].allTime
      };
      this.triggerEvent('weekChange', obj);
    }
  },
  ready() {
    let scene = app.open.scene;
    let isTrue = false;
    switch (scene) {
      case 1020: //公众号 profile 页相关小程序列表
        isTrue = true;
        break;
      case 1035: //公众号自定义菜单
        isTrue = true;
        break;
      case 1043: //	公众号模板消息
        isTrue = true;
        break;
      case 1058: //	公众号文章
        isTrue = true;
        break;
      case 1067: //	公众号文章广告
        isTrue = true;
        break;
      case 1074: //	公众号会话下发的小程序消息卡片
        isTrue = true;
        break;
    }
    setTimeout(() => {
      this.triggerEvent('weekChange', {
        index: 0,
        time: getTime(new Date(), true),
        isScence: isTrue
      });
    }, 500);
  }
})