const $common = require('../../../common/common.js');
Page({
  data: {
    abc: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    listData: [],
    queInfo: {},
    listIndex: 0
  },
  sync(arr) {
    let abc = this.data.abc;
    let str = '';
    for (let i = 0, len = arr.length; i < len; i++) {
      if (arr[i].select) {
        str = str + abc[i];
      }
    }
    return str;
  },
  queSelect(e) { //答题
    let index = +e.currentTarget.dataset.index;
    let listData = this.data.listData;
    let listIndex = this.data.listIndex;
    let queType = listData[listIndex].subType;
    let subAns = listData[listIndex].subAns;
    if (queType === 1) { //单选题
      for (let i = 0, len = subAns.length; i < len; i++) {
        subAns[i].select = i === index ? true : false;
      }
    } else { //多选题
      subAns[index].select = !subAns[index].select;
    }
    listData[listIndex].answer = this.sync(subAns);
    this.setData({
      listData: listData
    })
  },
  reduce() {
    let listIndex = this.data.listIndex;
    listIndex > 0 && listIndex--;
    this.setData({
      listIndex: listIndex
    })
  },
  add() {
    let listIndex = this.data.listIndex;
    let len = this.data.listData.length - 1;
    listIndex < len && listIndex++;
    this.setData({
      listIndex: listIndex
    })
  },
  submit() { //提交
    let listData = this.data.listData; //所有题必须答
    let num = 0; //存储已答题目数量
    let n = 0; //存储需要跳转到的题目位置
    for (let i = listData.length - 1; i >= 0; i--) {
      listData[i].answer ? num++ : n = i;
    }
    if (num < listData.length) { //答题不全面
      $common.api.showModal('请完善调查问卷', false, (res) => {
        if (res.confirm) {
          this.setData({
            listIndex: n
          })
        }
      });
    } else { //全部完成，发送请求
      let arr = [];
      for (let i = 0, len = listData.length; i < len; i++) {
        arr.push({
          QatId: this.data.queInfo.queId,
          QatQuesId: listData[i].subId,
          QatAns: listData[i].answer
        })
      }
      $common.api.request(
        'POST',
        $common.config.PutCorQuesAns, {
          odrId: this.data.odrId,
          queAns: arr,
        },
        (res) => {
          if (res.data.res) {
            wx.navigateTo({
              url: '/pages/my/answerSuccess/answerSuccess',
            })
          } else {
            $common.err1();
          }
        },
        (res) => {
          $common.err2();
        },
        (res) => {},
        wx.getStorageSync('Ticket')
      )
    }
  },
  init() {
    $common.api.request(
      'POST',
      $common.config.GetQuesInfo, {
        queId: this.data.queId
      },
      (res) => {
        if (res.data.res) {
          let data = res.data;
          this.data.queInfo = data.queInfo;
          this.setData({
            listData: data.subInfos
          })
        } else {
          switch (+res.data.errType) {
            case 6:
              break;
            case 16:
              $common.api.showModal('课程已下架');
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

      },
      wx.getStorageSync('Ticket')
    )
  },
  onLoad: function(options) {
    this.data.queId = options.queId;
    this.data.odrId = options.odrId;
  },
  onReady: function() {
    this.init();
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