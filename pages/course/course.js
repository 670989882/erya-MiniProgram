// pages/course/course.js
const app = getApp();
const api = require("../../utils/api.js");
const request = require("../../utils/request.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    courses: [],
    pageNo: 1,
    pageSize: 20,
    search: "",
    pageTotal: 0,
    isLoading:false,
    rewardedVideoAd: null,
    interstitialAd: null
  }, async requestData() {
    wx.showLoading({
      title: "加载中",
    });
    let res = await request.postData("/user/course/1/" + this.data.pageSize, { "search": this.data.search }, "application/x-www-form-urlencoded");
    if (res.data.total) {
      this.setData({
        courses: res.data.records,
        pageNo: res.data.current,
        hidden: true,
        pageTotal: res.data.pages,
      });
    } else {
      this.setData({
        hidden: false,
        courses: [],
      })
    }
    wx.hideLoading();
  }, searchChanged(res) {
    this.data.search = res.detail.value;
  }, loadMoreData() {
    if (this.data.pageNo === this.data.pageTotal) {
      wx.showToast({
        title: "没有更多数据了",
        icon: "none"
      })
    } else {
      if (!this.data.isLoading) {
        this.loadData();
      }
    }
  },async loadData(){
    wx.showLoading({
      title: '加载中...',
    })
    this.setData({
      isLoading:true
    })
    let pageNo = (this.data.pageNo + 1);
    let res = await request.postData("/user/course/" + pageNo + "/" + this.data.pageSize, { "search": this.data.search }, "application/x-www-form-urlencoded");
    this.data.courses.push(...res.data.records);
    this.setData({
      courses: this.data.courses,
      pageNo: res.data.current,
      isLoading:false
    });
    wx.hideLoading();
  }, getDetail(res) {
    let that = this;
    if (api.getNum() < 1) {
      wx.showModal({
        title: "积分不足",
        content: "是否通过观看广告来获取积分？",
        success(res) {
          if (res.confirm) {
            that.openAd();
          }
        }
      })
    } else {
      api.setNum(api.getNum() - 1);
      api.changeNum();
      wx.navigateTo({
        url: "../detail/detail?id=" + res.currentTarget.dataset.id,
      })
    }
  }, openAd: function (e) {
    this.data.rewardedVideoAd.onLoad();
    this.data.rewardedVideoAd.show().catch(() => {
      // 失败重试
      this.data.rewardedVideoAd.load()
        .then(() => this.data.rewardedVideoAd.show())
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestData();
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
          title: "观看成功,积分+30",
          icon: "none"
        })
        api.setNum(api.getNum() + 30);
        api.changeNum();
      }
    });
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
    if (app.data.interstitialAd && this.interstitialAd) {
      this.interstitialAd.show();
      app.data.interstitialAd = false;
    }
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