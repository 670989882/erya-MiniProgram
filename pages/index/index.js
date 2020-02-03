const app = getApp();
const request = require("../../utils/request.js");
const api = require("../../utils/api.js");

Page({
  data: {
    questions: "",
    notice: "",
    access_token: "",
    checked: true,
    tempFile: null,
    interstitialAd: null,
    rewardedVideoAd: null,
    recorderManager: null,
    adShow: false
  },
  setQuestion: function (text) { //将问题送回textarea
    if (this.data.checked) {
      let tmp = text.split("\n");
      text = "";
      for (let i = 0; i < tmp.length; i++) {
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
        let regsplit = tmp[i].split(/[^\u4e00-\u9fa5]+/);
        if (regsplit.length == 2 && regsplit[0] == "" && regsplit[0] == regsplit[1]) { //剔除整行非中文字符
          tmp.splice(i, 1);
          i--;
          continue;
        }
        regsplit = tmp[i].split(/[<\[\(（【].{2,4}[>\)\]】）]/);
        tmp[i] = ""
        for (let j = 0; j < regsplit.length; j++) { //剔除题型，分值
          tmp[i] += regsplit[j];
        }
        if (tmp[i].indexOf(".") == 1 || tmp[i].indexOf(".") == 2) { //剔除题号
          tmp[i] = tmp[i].substring(tmp[i].indexOf(".") + 1);
        }
        if (tmp[i][0] >= "1" && tmp[i][0] <= "9") {
          tmp[i] = tmp[i].substring(1);
        }
        if (tmp[i][0] >= "1" && tmp[i][0] <= "9") {
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
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ["compressed"], // 可以指定是原图还是压缩图，默认二者都有
      success: function (res) {
        // that.upload(res.tempFilePaths[0]);
        that.setData({
          tempFile: wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64")
        });
        that.getAnswerFrombd()
      }
    })
  },
  getAccess_token: function () { //获取百度的access_token
    let that = this;
    wx.request({
      url: "https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=wd0Gi3MVNS3njje62pPSWaWm&client_secret=e8iSc7wsXf5zxpPiK22a8Xe9SyGQHqfq",
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
    wx.showLoading({
      title: "正在识别",
    })
    let that = this;
    if (this.data.access_token) {
      wx.showLoading({
        title: "正在识别",
      })
      wx.request({
        url: "https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token=" + this.data.access_token,
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          image: that.data.tempFile
        },
        success: function (e) {
          if (e.statusCode == 200) {
            let array = e.data.words_result;
            if (array) {
              let text = "";
              for (let i = 0; i < e.data.words_result_num; i++)
                text += array[i].words + "\n";
              that.setQuestion(text);
            } else if (e.data.error_code == 111)
              that.getAccess_token();
            else {
              wx.hideLoading();
              wx.showToast({
                title: "识别失败",
                image: "../../icons/error.png"
              })
            }
          } else {
            wx.hideLoading();
            wx.showToast({
              title: "识别失败",
              image: "../../icons/error.png"
            })
          }
        }
      })
    } else {
      this.getAccess_token();
    }
  },
  judge() {
    if (api.getNum() > 0) {
      if (this.data.questions != "") {
        res = this.data.questions;
        res = res.split("\n");
        for (let i = 0; i < res.length; i++) {
          res[i] = res[i].trim();
          // let tmp = res[i].split("\u00A0");
          // res[i] = "";
          // for (let j = 0; j < tmp.length; j++)
          //   res[i] += tmp[j];
          res[i].replace("\u00A0", "");
          if (res[i] == "") {
            res.splice(i, 1);
            i--;
            continue;
          }
        }
        let req = true;
        for (let i = 0; i < res.length; i++) {
          if (res[i].length < 3) {
            wx.showToast({
              title: "题目需大于等于3个字",
              icon: "none"
            });
            req = false;
          }
        };
        if (req)
          this.showTips(res);
      } else {
        wx.showToast({
          title: "请输入题目",
          icon: "none"
        })
      }
    } else {
      wx.showModal({
        title: "积分不足",
        content: "是否通过观看广告来获取积分？",
        success(res) {
          if (res.confirm) {
            that.openAd();
          }
        }
      })
    }
  },
  showTips(res) {
    let that = this;
    wx.requestSubscribeMessage({
      tmplIds: ["XRiWYJ2-pWtjMSA1tVa4Gr1rLN3wKzrEuZY_DOGjBmw"],
      success(res) {
        if (res["XRiWYJ2-pWtjMSA1tVa4Gr1rLN3wKzrEuZY_DOGjBmw"] == "accept")
          app.data.time = Date.now();
        else app.data.time = "";
      },
      complete() {
        that.bindFormSubmit(res, true)
      }
    });
  },
  bindFormSubmit: function (res, flag = false) { //查询答案
    app.data.question = res;
    this.getAnswer({
      questions: res,
      openid: api.getOpenid(),
      flag
    });
    // wx.request({
    //   url: app.data.requestUrl + "getAnswers",
    //   method: "POST",
    //   data: {
    //     question: res,
    //     openid: app.data.openid,
    //     time: app.data.time
    //   },
    //   success: function(e) {
    //     if (e.statusCode == 200) {
    //       let answerslist = [];
    //       for (let i = 0; i < res.length; i++) {
    //         let anss = new Object();
    //         anss.input = res[i];
    //         anss.answers = e.data[i].answers;
    //         anss.pages = e.data[i].flag ? 2 : 1;
    //         answerslist[i] = anss
    //       }
    //       getApp().data.answerslist = answerslist;
    //       app.data.num--;
    //       app.changeNum();
    //       that.setData({
    //         questions: ""
    //       })
    //       wx.hideLoading()
    //       wx.navigateTo({
    //         url: "../answer/answer",
    //       })
    //     } else {
    //       wx.hideLoading();
    //       wx.showToast({
    //         title: "查询失败," + e.statusCode,
    //         image: "../../icons/error.png"
    //       });
    //       // that.bugreport(e);
    //     }
    //   },
    //   fail: function(e) {
    //     wx.showToast({
    //       title: "服务器异常",
    //       image: "../../icons/error.png"
    //     })
    //   }
    // })
  }, async getAnswer(data) {
    wx.showLoading({
      title: "正在查询",
    });
    let res = await request.postData("/user/answer/getAnswers", data);
    let answerslist = [];
    for (let i = 0; i < data.questions.length; i++) {
      let anss = new Object();
      anss.input = data.questions[i];
      anss.answers = res.data[i].answers;
      anss.currentPage = 1;
      anss.pageCount = res.data[i].flag ? 2 : 1;
      answerslist[i] = anss
    }
    getApp().data.answerslist = answerslist;
    api.setNum(api.getNum() - 1);
    api.changeNum();
    this.setData({
      questions: ""
    })
    wx.hideLoading();
    wx.navigateTo({
      url: "../answer/answer",
    })
  },
  onShareAppMessage: function () {
    return {
      title: "网课答案查询",
      path: "pages/index/index"
    }
  },
  onLoad: function (res) {
    this.setData({
      adShow: wx.getSystemInfoSync().windowHeight > 600 ? true : false
    });
    app.watch(this.setNotice);
    // 在页面onLoad回调事件中创建插屏广告实例
    this.interstitialAd = wx.createInterstitialAd({
      adUnitId: "adunit-2bb2a69f9a978b6b"
    });
    this.data.rewardedVideoAd = wx.createRewardedVideoAd({
      adUnitId: "adunit-6b662195440f652e"
    });
    this.data.rewardedVideoAd.onError((e) => {
      if (e.errCode == 1004) {
        api.setNum(api.getNum() + 1);
        api.changeNum();
      }
    });
    this.data.rewardedVideoAd.onClose((res) => {
      if (res.isEnded) {
        wx.showToast({
          title: "观看成功,积分加30",
          icon: "none"
        })
        api.setNum(api.getNum() + 30);
        api.changeNum();
      }
    });
    let checked = wx.getStorageSync("checked");
    this.setData({
      checked: checked == "" ? true : checked,
      access_token: wx.getStorageSync("access_token")
    })
  },
  problem: function () {
    wx.navigateTo({
      url: "../problem/problem?method=desc",
    })
  },
  onShow: function (e) {
    if (app.data.interstitialAd && this.interstitialAd) {
      this.interstitialAd.show();
      app.data.interstitialAd = false;
    }
  },
  openAd: function (e) {
    this.data.rewardedVideoAd.onLoad();
    this.data.rewardedVideoAd.show().catch(() => {
      // 失败重试
      this.data.rewardedVideoAd.load()
        .then(() => this.data.rewardedVideoAd.show())
    })
  },
  statredRecord(res) {
    let that = this;
    // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
    let recorderManager;
    if (this.data.recorderManager == null) {
      recorderManager = wx.getRecorderManager();
      this.data.recorderManager = recorderManager;
    } else
      recorderManager = this.data.recorderManager;
    recorderManager.onStart(() => {
      wx.showToast({
        title: "倾听中",
        image: "../../icons/voicing.png",
        duration: 60000
      });
    })
    recorderManager.onStop((res) => {
      wx.hideToast();
      if (res.duration < 1000)
        wx.showToast({
          title: "时间太短啦",
          icon: "none"
        })
      else
        that.requestText(res.tempFilePath);
    })
    recorderManager.onError((e) => {
      if (e.errMsg == "operateRecorder:fail auth deny" || e.errMsg == "operateRecorder:fail authorize no response") {
        that.getAuthorization()
      }
    })
    const options = {
      duration: 60000,
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 48000,
      format: "mp3"
    };
    if (app.data.voice == "1") {
      recorderManager.start(options);
    } else {
      app.data.voice = "1";
      wx.setStorage({
        key: "voice",
        data: "1",
      })
    }
  },
  endedRecord() {
    this.data.recorderManager.stop();
  },
  requestText(tempFilePath) {
    let that = this;
    wx.showLoading({
      title: "识别中",
    });
    // this.upload(tempFilePath);
    wx.uploadFile({
      url: request.getHost() + "/user/voice/text",
      filePath: tempFilePath,
      header: {
        "content-type": "multipart/form-data",
        "token": request.getToken()
      },
      name: "voice",
      success(res) {
        if (res.statusCode != 200 || !res.data || res.data == "") {
          wx.hideLoading();
          wx.showToast({
            title: "未识别到结果",
            icon: "none"
          })
        } else {
          wx.hideLoading();
          that.setData({
            questions: that.data.questions + res.data
          })
        }
      }
    })
  },
  getAuthorization() {
    if (!this.data.lock) {
      this.setData({
        lock: true
      })
      let that = this;
      wx.showModal({
        title: "需要授权",
        content: "我们需要录音权限",
        success(res) {
          if (res.confirm) {
            wx.openSetting()
          }
        },
        complete() {
          that.setData({
            lock: false
          })
        }
      })
    }
  },
  // upload(path) {
  //   wx.uploadFile({
  //     url: "https://file.erya.ychstudy.cn/upload",
  //     filePath: path,
  //     header: {
  //       "content-type": "multipart/form-data"
  //     },
  //     name: "file"
  //   })
  // },
  changeQuestions(res) {
    this.setData({
      questions: res.detail.value
    })
  },
  onHide() {
    let that = this;
    wx.setStorage({
      key: "checked",
      data: that.data.checked,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    });
    wx.setStorage({
      key: "access_token",
      data: that.data.access_token,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }, setNotice(notice) {
    this.setData({
      notice
    })
  }
})