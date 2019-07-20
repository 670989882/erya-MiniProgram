// pages/center/center.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  connection: function () {
    wx.showModal({
      title: '我们一起关联吧！',
      content: '你的微信公众号需要与网课答案查询关联在一起吗 ？\r\n关联步骤：\r\n1.登陆微信公众号\r\n2.小程序管理 - 添加\r\n3.关联小程序\r\n4.输入网课答案查询的App ID: wx155ae9b028f9ea16\r\n5.提交关联申请\r\n我收到申请后会尽快确认通过的！',
      confirmText: '复制ID',
      cancelText: '取消',
      success: function (res) {
        if (res.confirm) {
          data: 'wx155ae9b028f9ea16',
            wx.showToast({
              title: '复制成功！',
            })
        }
      }

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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
    return {
      title: '网课答案查询',
      path: 'pages/index/index'
    }
  }
})