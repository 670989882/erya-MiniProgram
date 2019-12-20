// pages/answer/answer.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    start: 2,
    size: 10,
    currentPage: 0,
    pageCount: 1,
    arr: []
  },
  onShareAppMessage: function () {
    return {
      title: '网课答案查询',
      path: 'pages/index/index'
    }
  },
  // //点击最外层列表展开收起
  // listTap(e) {
  //   let Index = e.currentTarget.dataset.parentindex,//获取点击的下标值
  //     list = this.data.list;
  //   list[Index].show = !list[Index].show || false;//变换其打开、关闭的状态
  //   this.setData({
  //     list
  //   });
  // },
  // //点击里面的子列表展开收起
  // listItemTap(e) {
  //   let parentindex = e.currentTarget.dataset.parentindex,//点击的内层所在的最外层列表下标
  //     Index = e.currentTarget.dataset.index,//点击的内层下标
  //     list = this.data.list;
  //   list[parentindex].answers[Index].show = !list[parentindex].answers[Index].show || false;//变换其打开、关闭的状态
  //   if (list[parentindex].answers[Index].show) {//如果是操作的打开状态，那么就让同级的其他列表变为关闭状态，保持始终只有一个打开
  //     for (let i = 0, len = list[parentindex].answers.length; i < len; i++) {
  //       if (i != Index) {
  //         list[parentindex].answers[i].show = false;
  //       }
  //     }
  //   }
  //   this.setData({ list });
  // },
  // //让所有的展开项，都变为收起
  // packUp(data, index) {
  //   for (let i = 0, len = data.length; i < len; i++) {//其他最外层列表变为关闭状态
  //     if (index != i) {
  //       data[i].show = false;
  //       for (let j = 0; j < data[i].answers.length; j++) {//其他所有内层也为关闭状态
  //         data[i].answers[j].show = false;
  //       }
  //     }
  //   }
  // }, 
  onreachbottom: function (e) {
    if (this.data.currentPage >= this.data.pageCount) {
      wx.showToast({
        title: '已经到底了！',
        icon: 'none'
      })
      return;
    }
    let index = e.target.dataset.index;
    let that = this;
    wx.request({
      url: 'https://admin.erya.ychstudy.cn/answer/' + this.data.start + '/' + this.data.size,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        search: e.target.dataset.question.input
      },
      success: function (res) {
        let list = that.data.list
        list[index].answers.push(...res.data.records)//添加到后面
        that.data.currentPage = res.data.current
        that.data.pageCount = res.data.pages
        that.data.arr[index] = res.data.current
        that.setData({
          list: list,
        })
        that.data.start++
      }
    })
  },
  /*解决bug切换swiper时start不从2开始 */
  onSwiperchange: function (e) {
    var currentSwiper = e.detail.current
    if (this.data.arr[currentSwiper]) {
      var start = this.data.arr[currentSwiper]
      console.log(start)
      this.setData({
        start: start,
        currentPage: start
      })
    } else {
      this.data.start = 2
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.data.interstitialAd = true;
    let list = app.data.answerslist;
    this.setData({
      list: list
    })
  },
  problem: function () {
    wx.navigateTo({
      url: '../problem/problem?method=question'
    })
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
    let app=getApp();
    app.data.interstitialAd = true;
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
      path: 'pages/index/index'
    }
  }
})