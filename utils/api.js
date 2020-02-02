const request = require("./request.js");
let username = "admin";
let password = "123456789";
let openid = "";
let num = 0;

let expiretime=0;

const login = () => {
  return new Promise((resolve, reject) => {
    return request.postData("/auth/auth/login", { username, password }).then((res) => {
      if (res.data) {
        request.setToken(res.data.token);
        expiretime=res.data.expiretime;
      }
      resolve(res);
    })
  })
}

const getExpiretime=()=>expiretime;

const changeNum = () => {
  return request.postData("/user/user/change", { openid, num });
}

const getNum=()=>num;

const setNum=(n)=>num=n;

const getOpenid=()=>openid;

const setOpenid=(id)=>openid=id;

module.exports = {
  login,
  changeNum,
  setNum,
  getNum,
  getOpenid,
  setOpenid,
  getExpiretime
}