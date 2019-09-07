App({
  data: {
    requestUrl: 'https://erya.ychstudy.cn/',
    // requestUrl:'http://localhost:8080/',
    openid: "",
    num: 0,
    question: "",
    voice: "",
    answerslist: [],
    interstitialAd: false,
    rewardedVideoAd:null
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
    that.data.voice = wx.getStorageSync("voice");
    this.data.rewardedVideoAd = wx.createRewardedVideoAd({
      adUnitId: 'adunit-6b662195440f652e'
    });
    this.data.rewardedVideoAd.onError((e) => {
      console.log(e)
      if (e.errCode == 1004) {
        that.data.num++;
        that.changeNum();
      }
    });
    this.data.rewardedVideoAd.onClose((res) => {
      if (res.isEnded) {
        that.data.num += 30;
        wx.showToast({
          title: '观看成功,积分加30',
          icon: 'none'
        })
        that.changeNum();
      }
    });
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