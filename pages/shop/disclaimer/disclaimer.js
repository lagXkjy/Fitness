// pages/shop/disclaimer/disclaimer.js
Page({
  data: {
    title: 'ONEGROUPS运动风险免责协议',
    listData: ['1.参与ONEGROUPS健身服务的用户，具有完全的法律行为能力，同意遵守相关管理规章制度，应接受ONEGROUPS的相关服务协议，并已知晓有关的健身规则与警示，承诺遵守ONEGROUPS的相关规定。', '2.ONEGROUPS员工及教练对用户身体情况的任何询问、了解和建议都不构成本公司对用户身体状况是否符合任意健身课程和产品要求的承诺及保证。在确认本声明前，用户应自行到医疗机构进行体检，了解自身身体情况，以确保用户具备参与ONEGROUPS健身产品的身体条件，且没有任何不宜运动的疾病、损伤和其他缺陷。因用户自身的任何疾病、损伤或其他缺陷导致用户在接受服务时发生任何损害的，ONEGROUPS不承担任何法律责任。',
      '3.用户有任何身体方面的原因会影响或可能会影响使用ONEGROUPS健身产品的，在使用ONEGROUPS健身产品过程中感到任何不适的，请及时告知ONEGROUPS的健身教练。否则，如果发生身体损害，ONEGROUPS不承担法律责任。',
      '4.严禁心肺功能疾病、脊椎病、皮肤病、关节损伤及一切传染病患者等不适合健身运动者使用ONEGROUPS提供的健身产品，约课时如有隐瞒，所发生的一切后果及对他人产生的后果ONEGROUPS及教练组不负任何责任。如因此造成第三人损害的，则由其承担赔偿责任。',
      '5.经教练评估存在运动风险且坚持上课的用户，需现场签订《责任免除和豁免协议》。'
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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