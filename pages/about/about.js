// pages/about/about.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    about: null
  },
  copy: function () {
    wx.setClipboardData({
      data: "527812077",
      success: function (res) {
        wx.showToast({
          title: "复制成功！",
        })
      }
    })
  },
  /*saveing: function (res) {
    if (res.currentTarget.id == 1) {
      wx.downloadFile({
        url: "https://ychstudy.cn/erya/redwallet.jpg",
        success: function (res) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            fail:function(res){
              wx.showModal({
                title: "授权",
                content: "需要授权，请点击授权按钮",
                showCancel: false
              })
            }
          })
        }
      })
    } else {
      wx.downloadFile({
        url: "https://ychstudy.cn/erya/money.jpg",
        success: function (res) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            fail: function (res) {
              wx.showModal({
                title: "授权",
                content: "需要授权，请点击授权按钮",
                showCancel: false
              })
            }
          })
        }
      })
    }
  },
  opensetting: function () {
    wx.openSetting({
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },*/
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.request({
      url: app.data.requestUrl + "getNotice/ad",
      method: "POST",
      success: function (e) {
        if (e.statusCode == 200) {
          that.setData({
            about: e.data
          })
        }
      }
    })
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
      title: "网课答案查询",
      path: "pages/index/index"
    }
  }
})