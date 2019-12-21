App({
  data: {
    requestUrl: 'https://erya.ychstudy.cn/',
    // requestUrl:'http://localhost:8080/',
    openid: "",
    num: 0,
    question: "",
    answerslist: [],
    interstitialAd: false,
    voice:''
  },
  // 监听错误
  onError: function (err) {
    let that = this;
    let info = wx.getSystemInfoSync();
    // 上报错误
    wx.request({
      url: this.requestUrl + "appReporter",
      method: "POST",
      data: {
        "question": that.data.question,
        "error": JSON.stringify(err),
        "time": require('utils/util.js').formatTime(new Date()),
        "devInfo": info.model + "|" + info.system + "|" + info.version + "|" + info.SDKVersion
      }
    })
  }, onLaunch: function (e) {
    let that = this;
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            method: 'post',
            url: that.data.requestUrl + "user/login/" + res.code,
            data: {
              code: res.code
            }, success: function (res) {
              that.data.openid = res.data.openid;
              that.data.num = res.data.num;
            }
          })
        }
      }
    })
    this.data.voice = wx.getStorageSync("voice");
  }, changeNum: function () {
    let that = this;
    if (that.data.openid != "") {
      wx.request({
        method: "POST",
        url: that.data.requestUrl + "user/change",
        data: {
          openid: that.data.openid,
          num: that.data.num
        }
      })
    }
  }
})