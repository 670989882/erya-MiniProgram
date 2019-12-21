// pages/answer/answer.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    size: 10,
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
    let index = e.target.dataset.index;
    if (this.data.arr[index] > this.data.list[index].pages) {
      wx.showToast({
        title: '已经到底了！',
        icon: 'none'
      })
      return;
    };
    wx.showLoading({
      title: '正在加载...',
    })
    let that = this;
    wx.request({
      url: 'https://admin.erya.ychstudy.cn/answer/' + this.data.arr[index] + '/' + this.data.size,
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
        that.data.list[index].pages = res.data.pages
        that.data.arr[index]++;
        that.setData({
          list: list,
        })
      }, complete() {
        wx.hideLoading();
      }
    })
  },
  /*解决bug切换swiper时start不从2开始 */
  onSwiperchange: function (e) {
    // let currentSwiper = e.detail.current
    // if (this.data.arr[currentSwiper]) {
    //   let start = this.data.arr[currentSwiper]
    //   console.log(start)
    //   this.setData({
    //     start: start,
    //     currentPage: start
    //   })
    // } else {
    //   this.data.start = 2
    // }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.data.interstitialAd = true;
    let list = app.data.answerslist;
    let arr = Array(list.length).fill(2);
    this.setData({
      list: list,
      arr: arr
    })
  },
  problem: function () {
    wx.navigateTo({
      url: '../problem/problem?method=question'
    })
  },copy(e){
    wx.setClipboardData({
      data: e.currentTarget.dataset.item.answer,
      success: function (res) {
        wx.showToast({
          title: '答案已复制！',
          icon:'none'
        })
      }
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
    let storage = this.data.list;
    // let storage = JSON.parse(JSON.stringify(answerslist));
    storage.reverse();
    if (storage.length > 30)
      wx.setStorage({
        key: 'history',
        data: storage.slice(0, 30)
      });
    else {
      wx.getStorage({
        key: 'history',
        success: function (res) {
          storage.push(...res.data);
          if (storage.length < 31){
            wx.setStorage({
              key: 'history',
              data: storage,
            });
          }else{
            wx.setStorage({
              key: 'history',
              data: storage.slice(0, 30),
            });
          }
        },
        fail: function (res) {
          wx.setStorage({
            key: 'history',
            data: storage,
          })
        }
      })
    }
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