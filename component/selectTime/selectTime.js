const init = () => {
  //let date = new Date();
  //   date.setDate(date.getDate() + i);
  let date = new Date();
  let years = [],
    months = [],
    days = [],
    hours = [],
    minutes = [];
  for (let i = date.getFullYear(); i <= date.getFullYear() + 1; i++) {
    let j = i;
    j < 10 && (j = '0' + j);
    years.push({
      time: j,
      str: `${j}年`
    })
  }
  for (let i = 1; i <= 12; i++) {
    let j = i;
    j < 10 && (j = '0' + j);
    months.push({
      time: j,
      str: `${j}月`
    })
  }
  for (let i = 1; i <= 31; i++) {
    let j = i;
    j < 10 && (j = '0' + j);
    days.push({
      time: j,
      str: `${j}日`
    });
  }
  for (let i = 0; i < 24; i++) {
    let j = i;
    j < 10 && (j = '0' + j);
    hours.push({
      time: j,
      str: `${j}时`
    });
  }
  for (let i = 0; i < 60; i++) {
    let j = i;
    j < 10 && (j = '0' + j);
    minutes.push({
      time: j,
      str: `${j}分`
    });
  }
  return [years, months, days, hours, minutes];
}
Component({
  properties: {
    context: {
      type: String,
      value: '开始时间'
    }
  },
  data: {
    // timeData: init(),
    // timeIndex: [0, 0, 0, 0, 0],
    timeContext: ''
  },
  methods: {
    columnChange(e) {
      let column = e.detail.column,
        index = e.detail.value,
        timeData = this.data.timeData,
        timeIndex = this.data.timeIndex;
      this.data.timeIndex[column] = index;
      this.timeChange(timeData[0][timeIndex[0]], timeData[1][timeIndex[1]]);
    },
    change(e) {
      let timeData = this.data.timeData,
        timeIndex = this.data.timeIndex;
      let timeContext = `${timeData[0][timeIndex[0]].time}-${timeData[1][timeIndex[1]].time}-${timeData[2][timeIndex[2]].time} ${timeData[3][timeIndex[3]].time}:${timeData[4][timeIndex[4]].time}`;
      this.setData({
        timeContext: timeContext
      })
      this.triggerEvent('timeChange', timeContext);
    },
    timeChange(year, month) {
      let temp = new Date(parseInt(year.time), parseInt(month.time), 0);
      let len = temp.getDate();
      let days = [];
      for (let i = 1; i <= len; i++) {
        let j = i;
        j < 10 && (j = '0' + j);
        days.push({
          time: j,
          str: `${j}日`
        });
      }
      let timeData = this.data.timeData;
      let timeIndex = this.data.timeIndex;
      timeData[2] = days;
      timeIndex[2] > len && (timeIndex[2] = len - 1);
      this.setData({
        timeData: timeData,
        timeIndex: timeIndex
      })
    }
  },
  attached() {
    let data = init();
    let date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth() + 1,
      d = date.getDate(),
      h = date.getHours(),
      f = date.getMinutes();
    m < 10 && (m = '0' + m);
    d < 10 && (d = '0' + d);
    h < 10 && (h = '0' + h);
    f < 10 && (f = '0' + f);
    let arr = [0, 0, 0, 0, 0];
    // 使初始化的结果保持在当前时间点上
    for (let i = 0, len = data[0].length; i < len; i++) { //年
      if (y === data[0][i].time) {
        arr[0] = i;
        break;
      }
    }
    for (let i = 0, len = data[1].length; i < len; i++) { //月
      if (m === data[1][i].time) {
        arr[1] = i;
        break;
      }
    }
    for (let i = 0, len = data[2].length; i < len; i++) { //日
      if (d === data[2][i].time) {
        arr[2] = i;
        break;
      }
    }
    for (let i = 0, len = data[3].length; i < len; i++) { //时
      if (h === data[3][i].time) {
        arr[3] = i;
        break;
      }
    }
    for (let i = 0, len = data[4].length; i < len; i++) { //分
      if (f === data[4][i].time) {
        arr[4] = i;
        break;
      }
    }
    this.setData({
      timeData: data,
      timeIndex: arr,
    })
  }
})
