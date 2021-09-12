const api = require("./utils/api.js");
const request = require("./utils/request.js")

App({
  data: {
    question: "",
    answerslist: [],
    interstitialAd: false,
    voice: "",
    notice:""
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
    this.getNotice();
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
    if (api.getExpiretime()&&api.getExpiretime() - new Date().getTime()< 3600000){
      api.login();
    }
  },//app 全局属性监听
  watch(method) {
    var obj = this.data;
    Object.defineProperty(obj, "notice", {  //这里的 data 对应 上面 globalData 中的 data
      configurable: true,
      enumerable: true,
      set: function (value) {  //动态赋值，传递对象，为 globalData 中对应变量赋值
        method(value);
      },
      get: function () {  //获取全局变量值，直接返回全部
        return this.data;
      }
    })
  }, async getNotice() {
    wx.showLoading({
      title: '获取通知中',
    })
    let res = await request.postData("/user/notice/getNotice/notice");
    this.data.notice=res;
    wx.hideLoading();

  }
})
