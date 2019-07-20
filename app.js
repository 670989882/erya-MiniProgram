App({
  data: {
    requestUrl:'https://erya.ychstudy.cn/',
    question: "",
    answerslist: []
  },
  // 监听错误
  onError: function (err) {
    var that = this;
    var info = wx.getSystemInfoSync();
    // 上报错误
    wx.request({
      url: this.reqquesUrl,
      method:"POST",
      data: {
        "question": that.data.question +"appReporter",
        "error": JSON.stringify(err),
        "time": require('utils/util.js').formatTime(new Date()),
        "devInfo": info.model + "|" + info.system + "|" + info.version + "|" + info.SDKVersion
      }
    })
  }
})