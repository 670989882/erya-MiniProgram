const api = require('./utils/api.js');
const request = require("./utils/request.js")

App({
  data: {
    question: "",
    answerslist: [],
    interstitialAd: false,
    voice: "",
  },
  // 监听错误
  onError: function (err) {
    let that = this;
    let info = wx.getSystemInfoSync();
    request.postData("/user/appErr/appReporter", {
      "question": that.data.question,
      "error": JSON.stringify(err),
      "time": require("utils/util.js").formatTime(new Date()),
      "devInfo": info.model + "|" + info.system + "|" + info.version + "|" + info.SDKVersion
    });
  }, onLaunch: function (e) {
    let that = this;
    this.init();
    this.data.voice = wx.getStorageSync("voice");
  }, async init() {
    await api.login();
    wx.login({
      success(res) {
        if (res.code) {
          request.postData("/user/user/login/" + res.code).then((result) => {
            api.setOpenid(result.data.openid);
            api.setNum(result.data.num);
          })
        }
      }
    })
  }, onShow() {
    if (new Date().getTime() - api.getExpiretime() < 3600000)
      api.login();
  }
})