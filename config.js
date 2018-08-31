/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
//var host = 'https://2uxnt1f2.qcloud.la';
var host = 'https://zb.1-zhao.com';
var config = {
  // 下面的地址配合云端 Demo 工作
  service: {
    host,
    // picker  --start
    getAgent: `${host}/Picker/GetAgent`,
    getType: `${host}/Picker/GetTypes`,
    getPress: `${host}/Picker/GetPress`,
    getTroubleBody: `${host}/Picker/GetTroubleBody`,
    getTroubleDescription: `${host}/Picker/GetTroubleDescription`,
    // picker --over
    getSaveUserOpenId: `${host}/UserInfo/GetSaveUserOpenId`,
    //获取收货人信息
    GetSaveReceiverMsg: `${host}/UserInfo/GetSaveReceiverMsg`,
    //提交质保信息
    UploadFeedBackDatas: `${host}/FeedbackDatas/UploadFeedBackDatas`,
    GetTotalIntergral: `${host}/weapp/GetTotalIntergral`,
    GetHasAcceptDatas: `${host}/weapp/GetHasAcceptDatas`,
    GetToBeConfirmedDatas: `${host}/weapp/GetToBeConfirmedDatas`,
    GetNotAcceptDatas: `${host}/weapp/GetNotAcceptDatas`,
    uploadImgsUrl: `${host}/File/UploadFiles`,
    uploadFeedBackDatas: `${host}/weapp/uploadFeedBackDatas`,
    /*-----------------login-------------------*/ 
    // 登录地址，用于建立会话
    loginUrl: `${host}/weapp/login`,
    //获取验证码的地址，用于发送手机号，接受验证码
    verifyUrl: `${host}/UserInfo/GetVerify`,
    GetSaveReceiverMsg: `${host}/UserInfo/GetSaveReceiverMsg`,
    GetUserAddress: `${host}/UserInfo/GetUserAddress`,
    GetUserType: `${host}/UserInfo/GetUserType`, 
    //只有当 Status为true时。才是正确的用户类型， -1：用户已删除          -2：用户未注册
  }
};

module.exports = config;
