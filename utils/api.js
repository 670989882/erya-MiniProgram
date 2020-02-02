const request = require("./request.js");
let username = "admin";
let password = "123456789";
let openid = "";
let num = 0;

let expiretime=0;

const login = () => {
  return new Promise((resolve, reject) => {
    // const CryptoJS=require("./aes.js");
    // var aseKey = '1234567890123456789012335475';//秘钥
    // var key = CryptoJS.enc.Utf8.parse(aesKey);//将秘钥转换成Utf8字节数组
    // var encrypt = CryptoJS.AES.encrypt(JSON.stringify(data1), key, {
    //   iv: CryptoJS.enc.Utf8.parse(aseKey.substr(0, 16)),
    //   mode: CryptoJS.mode.CBC,
    //   padding: CryptoJS.pad.Pkcs7
    // });
    // var data2 = encrypt.toString();//加密后的数据
    // console.log(data2);
    let time=new Date().getTime();
    console.log(time);
    return request.postData("/auth/auth/login", { username, password ,time}).then((res) => {
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