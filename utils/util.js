let config = require('../config.js');
let $api = require('api.js');
let service = config.service;
let app = getApp();
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();
    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    })
}

var showLoading = (title)=>{
  wx.showLoading({
    title: title,
    mask: true,
    success: function (res) { },
    fail: function (res) { },
    complete: function (res) { },
  })
}
//获取openid以及个人头像等信息
const wxGetUserInfo = function (callback) {
  wx.login({
    complete: (res) => {
      if (res.code) {
        let code = res.code;
        //发请求
        
        $api.request(
          service.getSaveUserOpenId,
          'POST',
          {
            code: code,
            nickName: userInfo.nickName,
            avaUrl: userInfo.avatarUrl,
          },
          (res) => {
            console.log("openidsucces:", res)
            if (res.state) {
              //保存openid
              wx.setStorageSync('openid', res.data.openid);
              console.log("openid:" + wx.getStorageSync('openid'))
              //保存用户类型
              wx.setStorageSync('userType', res.data.userType);
              callback();
            }
          },
          (res) => {
            wx.showModal({
              title: '提示',
              content: '亲~网络不给力哦，请稍后重试',
              showCancel: false,
            })
          },
          (res)=>{
           
          }
        );
      } else {
        wx.showModal({
          title: '提示',
          content: '获取信息失败',
          showCancel: false,
        })
      }
    }
  })
}
const uploadFiles = function (types = 'image', files, callback) {
  callback = typeof (callback) === 'function' ? callback : function () { };
  showLoading('照片信息采集中');
  for (let i in files) {
    (function(i){
    wx.uploadFile({
      url: service.uploadImgsUrl,
      filePath: files[i],
      name: 'file',
      formData: {},
      success: (res) => {
        console.log("success:",res)
        let data = JSON.parse(res.data);
        console.log(data);
        console.log(data.imgs)
        if(data.result){
          //app.data.Imgs = app.data.Imgs.push(data.imgs);
          let imgs = app.data.Imgs;
          imgs.push(data.imgs);
          app.data.Imgs = imgs;
          console.log('path:', data.imgs)
        }
        
        if (i == files.length - 1) {
          // console.log(app.data.Imgs);
          // if (types == 'image') {
          //   app.data.Imgs = filePaths
          // } else if (types = 'video') {
          //   app.data.Video = filePaths
          // }
          console.log("Imgs:",app.data.Imgs);
          wx.hideLoading();
          callback();
        }
      },
      fail: (err) => {
        console.log(err);
        util.showModel("网络异常", '请稍后再试')
      },
      complete: (res) => {
        console.log(res)
        if (i == files.length - 1) {
          // console.log(app.data.Imgs);
          // if (types == 'image') {
          //   app.data.Imgs = filePaths
          // } else if (types = 'video') {
          //   app.data.Video = filePaths
          // }
          callback();
        }
      }
    });
    })(i)

  }

}
const uploadImgs = (files, userId)=> {
  let length = files.length;
  let count = 0;
  let filePaths = '';
  return uploadFile();
}
const uploadFile = ()=> {
  wx.uploadFile({
    url: service.uploadImgsUrl,
    filePath: files[count],
    name: 'file',
    formData: {},
    success: (res) => {
      console.log(res)
    },
    fail: (err) => {
      console.log(err);
      util.showModel("上传失败", '网络异常，请稍后再试')
    },
    complete: (res) => {
      count++;
      uploadFile();
    }
  })
}
//获取openid
const getOpenid = function (callback) {
  callback = typeof (callback) === 'function' ? callback : function (res) { };
  let openid = wx.getStorageSync('openid');
  if (openid) return;
  wx.login({
    complete: (res) => {
      if (res.code) {
        let code = res.code;
        showLoading('获取openid...');
        $api.request(
          service.getSaveUserOpenId,
          "POST",
          {
            code: code
          },
          (res) => {
            console.log(code)
            console.log(service.getSaveUserOpenId,res);
            console.log("RESULTS", res.data.Results.ZbPhone)
            if(res.statusCode == 200){
              wx.setStorageSync('openid', res.data.Results.openid);
              wx.setStorageSync('userId', res.data.Results.userId);
              wx.setStorageSync('userType', res.data.Results.userType);
              wx.setStorageSync('brand', res.data.Results.brand);
              wx.setStorageSync('ZBAddres', res.data.Results.ZbAddress);
              wx.setStorageSync('ZBName', res.data.Results.ZbName);
              wx.setStorageSync('ZBPhone', res.data.Results.ZbPhone);
              wx.setStorageSync('agentId', res.data.Results.agentId);
              wx.setStorageSync('brand', res.data.Results.brand);
              wx.setStorageSync('status', res.data.Status);
              wx.setStorageSync('agentName', res.data.Results.agentName);
              wx.setStorageSync('userShow', true);
              console.log('utiluserId:', res.data.Results.userId);
              console.log('agentName:', wx.getStorageSync('agentName'));

              if (res.data.Results.userId == 0  && res.data.Results.userType==0){
                wx.setStorageSync('userType',1);
                console.log('未知用户')
              }
              if (res.data.Status) {
                //保存openid
              }
              callback();
            }else{
              showModel('获取用户信息失败',`错误代码:${res.statusCode},请稍后再试`)
            }
          },
          (err) => {
            wx.showModal({
              title: '提示',
              content: '获取openid失败,请稍后再进行反馈',
              showCancel: false,
            })
          },
          (res) => {
            wx.hideLoading();
          }
        );
      }
    }
  })
}

//获取并更新用户头像等信息
const getUserInfo = function (userInfo, callback) {
  callback = typeof (callback) === 'function' ? callback : function (res) { };
  wx.setStorageSync('userInfo', userInfo);
  console.log(userInfo);
  wx.request({
    url: config.UpdateAvaUrlNick,
    data: {
      openId: wx.getStorageSync('openid'),
      avaUrl: userInfo.avatarUrl,
      nickName: userInfo.nickName,
    },
    header: { 'content-type': 'application/json' },
    method: 'POST',
    success: (res) => {
      if (res.data.res) {
        callback();
      }
    }
  });
}
//获取位置设置信息
const GetSetting = (init, refuse, allowed, refused) => {
  init = typeof (init) === 'function' ? init : function (res) { };
  allowed = typeof (allowed) === 'function' ? allowed : function (err) { };
  refuse = typeof (refuse) === 'function' ? refuse : function (res) { };
  refused = typeof (refused) === 'function' ? refused : function (res) { };
  wx.getSetting({
    success: (res) => {
      console.log(res);
      console.log(res.authSetting['scope.userLocation']);
      if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
        //非初始化进入该页面,且未授权
        wx.showModal({
          title: '是否授权当前位置',
          content: '需要获取您的地理位置，请确认授权，否则无法获取地址',
          success: function (res) {
            if (res.cancel) {
              console.info("1授权失败返回数据");
              refuse();
            } else if (res.confirm) {
              //village_LBS(that);
              wx.openSetting({
                success: function (data) {
                  console.log(data);
                  if (data.authSetting["scope.userLocation"] == true) {
                    wx.showToast({
                      title: '授权成功',
                      icon: 'success',
                      duration: 2000
                    })
                    //再次授权，调用getLocationt的API
                    refused();
                  } else {
                    wx.showToast({
                      title: '授权失败',
                      icon: 'none',
                      duration: 3000
                    });
                  }
                }
              })
            }
          }
        })
      } else if (res.authSetting['scope.userLocation'] == true) {
        allowed();
      }
      else if (res.authSetting['scope.userLocation'] == undefined) {
        //初始化进入
        init();
      }
    }
  })
}
const GetLocation = (success, fail) => {
  success = typeof (success) === 'function' ? success : function (res) { };
  fail = typeof (fail) === 'function' ? fail : function (res) { };
  wx.getLocation({
    type: 'wgs84',
    success: success,
    fail: fail
  })
}
module.exports = {
  formatTime,
  formatDate,
  showBusy,
  showSuccess,
  showModel,
  showLoading,
  getOpenId: getOpenid,
  getUserInfo: getUserInfo,
  uploadFiles,
  uploadImgs,
  GetSetting,
  GetLocation
}
