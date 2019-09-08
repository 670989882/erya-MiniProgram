// pages/course/course.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    courses: [],
    pageNo: 0,
    pageSize: 10,
    search: "",
    hideLoading: true,
    pageTotal: 0,
    rewardedVideoAd:null
  }, requestData() {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    wx.request({
      url: app.data.requestUrl + 'course/1/' + that.data.pageSize,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        search: that.data.search
      }, success(res) {
        if (res.data.total != 0) {
          that.setData({
            courses: res.data.records,
            pageNo: res.data.current,
            hidden: true,
            pageTotal: res.data.pages,
            hideLoading: true
          });
        } else {
          that.setData({
            hidden: false,
            courses: [],
            hideLoading: true
          })
        }
      },complete(){
        wx.hideLoading()
      }
    })
  }, searchChanged(res) {
    this.data.search = res.detail.value;
  }, loadMoreData() {
    if (this.data.pageNo === this.data.pageTotal) {
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none'
      })
    } else {
      if (this.data.hideLoading) {
        this.setData({
          hideLoading: false,
        });
        let that = this;
        let pageNo = (that.data.pageNo + 1);
        wx.request({
          url: app.data.requestUrl + 'course/' + pageNo + '/' + that.data.pageSize,
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            search: that.data.search
          }, success(res) {
            that.data.courses.push(...res.data.records);
            that.setData({
              courses: that.data.courses,
              pageNo: res.data.current,
            });
          }, complete() {
            that.setData({
              hideLoading: true
            })
          }
        })
      }
    }
  }, getDetail(res) {
    let that=this;
    if (app.data.num < 1) {
      wx.showModal({
        title: '积分不足',
        content: '是否通过观看广告来获取积分？',
        success(res) {
          if (res.confirm) {
            that.openAd();
          }
        }
      })
     } else {
       app.data.num--;
       app.changeNum();
      wx.navigateTo({
        url: '../detail/detail?id=' + res.target.dataset.id,
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
    let that=this;
    this.data.rewardedVideoAd = wx.createRewardedVideoAd({
      adUnitId: 'adunit-6b662195440f652e'
    });
    this.data.rewardedVideoAd.onError((e) => {
      if (e.errCode == 1004) {
        app.data.num++;
        app.changeNum();
      }
    });
    this.data.rewardedVideoAd.onClose((res) => {
      if (res.isEnded) {
        app.data.num += 30;
        wx.showToast({
          title: '观看成功,积分+30',
          icon: 'none'
        })
        app.changeNum();
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
      title: '网课答案查询',
      path: 'pages/index/index',
      success() {
        wx.showToast({
          title: '分享成功，积分+5',
          icon: 'none'
        })
      }
    }
  }
})