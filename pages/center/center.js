// pages/center/center.js
const request=require("../../utils/request.js");
const api=require("../../utils/api.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 0,
    rewardedVideoAd: null,
    adShow:false
  },
  connection: function () {
    wx.showModal({
      title: "我们一起关联吧！",
      content: "你的微信公众号需要与网课答案查询关联在一起吗 ？\r\n关联步骤：\r\n1.登陆微信公众号\r\n2.小程序管理 - 添加\r\n3.关联小程序\r\n4.输入网课答案查询的App ID: wx155ae9b028f9ea16\r\n5.提交关联申请\r\n我收到申请后会尽快确认通过的！",
      confirmText: "复制ID",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          data: "wx155ae9b028f9ea16",
            wx.showToast({
              title: "复制成功！",
            })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.setData({
      adShow: wx.getSystemInfoSync().windowHeight > 600 ? true : false
    });
    this.data.rewardedVideoAd = wx.createRewardedVideoAd({
      adUnitId: "adunit-6b662195440f652e"
    });
    this.data.rewardedVideoAd.onError((e) => {
      if (e.errCode == 1004) {
        // app.data.num++;
        // app.setData({
        //   num: app.data.num
        // });
        // app.changeNum();
        that.setData({
          num:that.data.num+1
        });
        api.setNum(api.data.num);
        api.changeNum();
      }
    });
    this.data.rewardedVideoAd.onClose((res) => {
      if (res.isEnded) {
        // app.data.num += 30;
        wx.showToast({
          title: "观看成功,积分加30",
          icon: "none"
        })
        // that.setData({
        //   num: app.data.num
        // })
        // app.changeNum();
        that.setData({
          num: that.data.num + 30
        });
        api.setNum(api.data.num);
        api.changeNum();
      }
    });
  },
  openAd: function (e) {
    this.data.rewardedVideoAd.onLoad();
    this.data.rewardedVideoAd.show().catch(() => {
      // 失败重试
      this.data.rewardedVideoAd.load()
        .then(() => this.data.rewardedVideoAd.show())
    })
  },refresh: function (e) {
    // wx.showLoading({
    //   title: "获取中",
    // })
    // let that = this;
    // let res= request.postData("/user/user/refresh/"+api.getOpenid());
    // console.log(res);
    this.getNewData();
    // wx.login({
    //   success(res) {
    //     if (res.code) {
    //       //发起网络请求
    //       wx.request({
    //         method: "post",
    //         url: app.data.requestUrl + "user/login/" + res.code,
    //         data: {
    //           code: res.code
    //         }, success: function (res) {
    //           if (res.statusCode == 200) {
    //             app.data.openid = res.data.openid;
    //             app.data.num = res.data.num;
    //             that.setData({
    //               num: res.data.num
    //             });
    //           }
    //           wx.hideLoading();
    //         }
    //       })
    //     }
    //   }, fail(res) {
    //     wx.hideLoading();
    //     wx.showToast({
    //       title: "获取失败",
    //       image: "../../icons/error.png"
    //     })
    //   }
    // })
  },async getNewData(){
    wx.showLoading({
      title: "获取中",
    })
    let res =await request.postData("/user/user/refresh/" + api.getOpenid());
    this.setData({
      num:res.data.num
    })
    api.setNum(res.data.num);
    wx.hideLoading();
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
    this.setData({
      num: api.getNum()
    })
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