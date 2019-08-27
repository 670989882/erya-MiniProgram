let app = getApp();
Page({
  data: {
    questions: "",
    notice: "",
    checked: true,
    tempFile: null,
    access_token: null,
    interstitialAd: null
  },
  setQuestion: function (text) { //将问题送回textarea
    if (this.data.checked) {
      var tmp = text.split("\n");
      text = "";
      for (var i = 0; i < tmp.length; i++) {
        if (tmp[i].indexOf("A") != -1 || tmp[i].indexOf("B") != -1 || tmp[i].indexOf("C") != -1 || tmp[i].indexOf("D") != -1) { //剔除选项
          tmp.splice(i, 1);
          i--;
          continue;
        }
        if (tmp[i].length <= 5) { //剔除题干太短的题目
          tmp.splice(i, 1);
          i--;
          continue;
        }
        var regsplit = tmp[i].split(/[^\u4e00-\u9fa5]+/);
        if (regsplit.length == 2 && regsplit[0] == "" && regsplit[0] == regsplit[1]) { //剔除整行非中文字符
          tmp.splice(i, 1);
          i--;
          continue;
        }
        regsplit = tmp[i].split(/[<\[\(（【].{2,4}[>\)\]】）]/);
        tmp[i] = ""
        for (var j = 0; j < regsplit.length; j++) { //剔除题型，分值
          tmp[i] += regsplit[j];
        }
        if (tmp[i].indexOf(".") == 1 || tmp[i].indexOf(".") == 2) { //剔除题号
          tmp[i] = tmp[i].substring(tmp[i].indexOf(".") + 1);
        }
        if (tmp[i][0] >= '1' && tmp[i][0] <= '9') {
          tmp[i] = tmp[i].substring(1);
        }
        if (tmp[i][0] >= '1' && tmp[i][0] <= '9') {
          tmp[i] = tmp[i].substring(1);
        }
        text += (tmp[i] + "\n")
      }
    }
    this.setData({
      questions: text
    })
    wx.hideLoading()
  },
  checkboxChange: function (e) { //是否智能提取题目
    this.setData({
      checked: !this.data.checked
    })
  },
  getPicture: function (e) { //选择图片并且将图片Base64
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '正在识别',
        })
        that.setData({
          tempFile: wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64")
        })
        that.getAnswerFrombd()
      }
    })
  },
  getAccess_token: function () { //获取百度的access_token
    var that = this;
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=wd0Gi3MVNS3njje62pPSWaWm&client_secret=e8iSc7wsXf5zxpPiK22a8Xe9SyGQHqfq',
      success: function (e) {
        if (e.statusCode == 200) {
          that.setData({
            access_token: e.data.access_token
          })
          that.getAnswerFrombd()
        }
      }
    })
  },
  getAnswerFrombd: function () { //调用百度api获得文字
    var that = this;
    if (this.data.access_token) {
      wx.request({
        url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token=' + this.data.access_token,
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          image: this.data.tempFile
        },
        success: function (e) {
          if (e.statusCode == 200) {
            var array = e.data.words_result;
            if (array) {
              var text = "";
              for (var i = 0; i < e.data.words_result_num; i++)
                text += array[i].words + "\n";
              that.setQuestion(text);
            } else if (e.data.error_code == 111)
              that.getAccess_token();
            else {
              wx.hideLoading();
              wx.showToast({
                title: '识别失败',
                image: '../../icons/error.png'
              })
            }
          } else {
            wx.hideLoading();
            wx.showToast({
              title: '识别失败',
              image: '../../icons/error.png'
            })
          }
        }
      })
    } else {
      this.getAccess_token();
    }
  },
  bindFormSubmit: function (res) { //查询答案
    if (app.data.num > 0) {
      var that = this;
      var res = res.detail.value.textarea;
      if (res != "") {
        app.data.question = res;
        wx.showLoading({
          title: '正在查询',
        })
        var res = res.split("\n");
        for (var i = 0; i < res.length; i++) {
          if (res[i] == "") {
            res.splice(i, 1);
            i--;
            continue;
          }
          res[i] = res[i].trim();
          var tmp = res[i].split("\u00A0");
          res[i] = "";
          for (var j = 0; j < tmp.length; j++)
            res[i] += tmp[j];
        }
        let req = true;
        for (let i = 0; i < res.length; i++) {
          if (res[i].length < 4) {
            wx.showToast({
              title: '题目需大于3个字',
              icon: 'none'
            });
            req = false;
          }
        };
        if (req) {
          wx.request({
            url: app.data.requestUrl + "getAnswers",
            method: 'POST',
            data: {
              question: res
            },
            success: function (e) {
              if (e.statusCode == 200) {
                if (Array.isArray(e.data) == true) {
                  wx.hideLoading()
                  var answerslist = [];
                  for (var i = 0; i < res.length; i++) {
                    var anss = new Object();
                    anss.input = res[i];
                    anss.answers = e.data[i].answers
                    answerslist[i] = anss
                  }
                  wx.getStorage({
                    key: 'history',
                    success: function (res) {
                      var quesdata = res.data;
                      for (var i = 0; i < answerslist.length; i++)
                        quesdata.unshift(answerslist[i])
                      if (quesdata.length < 101)
                        wx.setStorage({
                          key: 'history',
                          data: quesdata,
                        }); else
                        wx.setStorage({
                          key: 'history',
                          data: quesdata.slice(0, 100),
                        });
                    },
                    fail: function (res) {
                      wx.setStorage({
                        key: 'history',
                        data: answerslist.reverse(),
                      })
                    }
                  })
                  getApp().data.answerslist = answerslist;
                  wx.navigateTo({
                    url: '../answer/answer',
                  })
                  that.setData({
                    questions: ""
                  })
                  app.data.num--;
                  that.changeNum();
                } else {
                  wx.hideLoading();
                  wx.showToast({
                    title: '查询失败',
                    image: '../../icons/error.png'
                  })
                  that.bugreport(e);
                }
              } else {
                wx.hideLoading();
                wx.showToast({
                  title: '查询失败,' + e.statusCode,
                  image: '../../icons/error.png'
                });
                that.bugreport(e);
              }
            },
            fail: function (e) {
              wx.showToast({
                title: '服务器异常',
                image: '../../icons/error.png'
              })
            }
          })
        }
      }
    } else
      wx.showToast({
        title: '积分不足',
        icon: "none"
      })
  },
  onShareAppMessage: function () {
    return {
      title: '网课答案查询',
      path: 'pages/index/index'
    }
  },
  onLoad: function (res) {
    wx.showLoading({
      title: '获取通知中',
    })
    var that = this;
    wx.request({
      url: app.data.requestUrl + "getNotice/notice",
      method: "POST",
      success: function (e) {
        if (e.statusCode == 200) {
          that.setData({
            notice: e.data
          })
          wx.hideLoading();
        } else {
          wx.showToast({
            title: '获取通知失败',
            image: '../../icons/error.png'
          })
          that.bugreport(e);
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '服务器异常',
          image: '../../icons/error.png'
        })
      }
    });
    // 在页面onLoad回调事件中创建插屏广告实例
    this.interstitialAd = wx.createInterstitialAd({
      adUnitId: 'adunit-2bb2a69f9a978b6b'
    })
  },
  problem: function () {
    wx.navigateTo({
      url: '../problem/problem?method=desc',
    })
  },
  bugreport: function (e) {
    var that = this;
    wx.request({
      url: app.data.requestUrl + "serverReporter",
      method: "POST",
      data: {
        "question": that.data.question,
        "dataerr": JSON.stringify(e),
        "time": require('../../utils/util.js').formatTime(new Date())
      }
    })
  }, onShow: function (e) {
    if (app.data.num > 0 && app.data.num % 2 == 0 && app.data.interstitialAd) {
      if (this.interstitialAd) {
        this.interstitialAd.show();
        app.data.interstitialAd = false;
      }
    }
  }, changeNum: function () {
    if (app.data.openid != "") {
      wx.request({
        method: "POST",
        url: app.data.requestUrl + "user/change",
        data: {
          openid: app.data.openid,
          num: app.data.num
        }
      })
    }
  },
})