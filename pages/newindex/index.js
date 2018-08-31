// pages/newindex/index.js
let util = require('../../utils/util');
let common = require('../../config');
let $api = require('../../utils/api');
let service = common.service;
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openid: wx.getStorageSync("openid"),
    userId: wx.getStorageSync("userId"),
    agentName:wx.getStorageSync('agentName'),
    integral: null,
  },

  JiLu: function () {
    wx.navigateTo({
      url: '../Integral/index',
    })
  },
  pian: function () {
    wx.navigateTo({
      url: '../feedback/index',
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getOpenId() { //获取openid
    var that = this;
    let openid = wx.getStorageSync('openid');
    console.log("openid:", openid)
    if (openid === null || openid === '') {
      console.log("beforegetDataif")
      util.getOpenId(that.getData()); //获取用户信息及openid；
      return;
    }
    console.log("openid:",openid)
  },
  init: function () {
    let userId = wx.getStorageSync('userId');
    if (!userId) {
      util.getOpenId(this.getData());
      return;
    }else{
      this.getData();
    }
    //this.getData();
  },
  getData:function(){
    var that = this;
    wx.showLoading({ title: '信息获取中' });
    let pickers = [
      {
        url:service.getAgent,
        setting:agent
      },
      {
        url: service.getTypes,
        setting: types
      },
      {
        url: service.getPress,
        setting: press
      }
    ];
    pickers.forEach(function(item){
      console.log(item)
    })
    $api.request(
      service.GetTotalIntergral,
      "POST",
      {
        userId: wx.getStorageSync('userId')
      },
      (res) => {
        console.log(res)
        
        wx.hideLoading();
      },
      (err) => {
        console.log(err);
      },
      (res) => {
        wx.hideLoading();
      }
    )
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 照片上传

  Pian: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.init();
  },
  login: function () {

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
      title: '质量反馈',
      path: '/pages/login/index'
    }
  }
})