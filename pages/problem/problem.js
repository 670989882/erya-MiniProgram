// pages/problem/problem.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    question: "请写下您的题目。",
    desc: "请说出您遇到的问题。"
  },
  bindFormSubmit: function (res) {
    if (res.detail.value.textarea) {
      wx.showLoading({
        title: '正在反馈',
      })
      wx.request({
        url: app.data.requestUrl + "problem",
        method: "POST",
        data: {
          time: require('../../utils/util.js').formatTime(new Date()),
          problem: res.detail.value.textarea
        },
        success: function (e) {
          wx.hideLoading()
          wx.showToast({
            title: '反馈成功',
            icon: 'success'
          })
          setTimeout(function () {
            wx.navigateBack();
          }, 1600);
        }
      })
    }
  },
  onShareAppMessage: function () {
    return {
      title: '网课答案查询',
      path: 'pages/index/index'
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.method == "question") {
      this.setData({
        desc: this.data.question
      })
    }
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

  }
})