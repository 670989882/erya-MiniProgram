let host = "http://api.erya.ychstudy.cn";
let token = "";

const getData = (url, param) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: host + url,
      method: 'GET',
      data: param,
      header: {
        "token": token
      },
      success(res) {
        if (res.statusCode == 200) {
          resolve(res.data)
        } else {
          wx.showToast({
            title: res.data.code + ":" + res.data.data,
            image: "../../icons/error.png"
          });
          reject(res.data)
        }
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

// request post 请求
const postData = (url, param, content = "application/json") => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: host + url,
      method: 'POST',
      data: param,
      header: {
        "Content-Type": content,
        "token": token
      },
      success(res) {
        if (res.statusCode == 200) {
          resolve(res.data)
        } else {
          wx.showToast({
            title: res.data.code + ":" + res.data.data,
            image: "../../icons/error.png"
          });
          reject(res.data)
        }
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

const setToken = (res) => token = res;

const getToken = () => token;

module.exports = {
  getData,
  postData,
  setToken,
  getToken
}