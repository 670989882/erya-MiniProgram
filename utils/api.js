const request = require("./request.js");
let username = "admin";
let password = "123456789";
let openid = "";
let num = 0;

let expiretime=0;

const login = () => {
  return new Promise((resolve, reject) => {
    // var aseKey = '1234567890123456789012335475';//秘钥
    // var key = CryptoJS.enc.Utf8.parse(aesKey);//将秘钥转换成Utf8字节数组
    // var encrypt = CryptoJS.AES.encrypt(JSON.stringify(data1), key, {
    //   iv: CryptoJS.enc.Utf8.parse(aseKey.substr(0, 16)),
    //   mode: CryptoJS.mode.CBC,
    //   padding: CryptoJS.pad.Pkcs7
    // });
    // var data2 = encrypt.toString();//加密后的数据
    // console.log(data2);
    let time = new Date().getTime();
    // console.log(time);
    const fun_aes = require("./aes.js");
    let srcs = fun_aes.CryptoJS.enc.Utf8.parse(password);
    var key = fun_aes.CryptoJS.enc.Utf8.parse(require("./md5.js").hex_md5(time.toString()));
    var encrypted = fun_aes.CryptoJS.AES.encrypt(srcs, key, {
      mode: fun_aes.CryptoJS.mode.ECB,
      padding: fun_aes.CryptoJS.pad.Pkcs7
    });
    password = require("./base64.js").Base64.encode(encrypted.toString());
    // let rasdasdes = encrypted.toString();
    // console.log(rasdasdes)
    // console.log(require("./base64.js").Base64.encode(rasdasdes));
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