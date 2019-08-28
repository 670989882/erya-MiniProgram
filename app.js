App({
  data: {
    requestUrl: 'https://erya.ychstudy.cn/',
    //requestUrl:'http://localhost:8081/erya_war/',
    openid: "",
    num: 0,
    question: "",
    answerslist: [],
    interstitialAd: false
  },
  // 监听错误
  onError: function (err) {
    let that = this;
    let info = wx.getSystemInfoSync();
    // 上报错误
    wx.request({
      url: this.reqquesUrl,
      method: "POST",
      data: {
        "question": that.data.question + "appReporter",
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
  }
})