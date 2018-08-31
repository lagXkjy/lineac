// pages/Integral/index.js
let app = getApp();
let util = require('../../utils/util');
let common = require('../../config');
let $api = require('../../utils/api');
let service = common.service;
let pageIndex = 0;
const pageSize = 20;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      integral:null,
      integralData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  init:function(){
    pageIndex = 0;
    this.setData({
      integral:app.data.integral,
      integralData:app.data.feedBackData[1]
    });
    this.getData();
  },
  getData: function () {
    var that = this;
    wx.showLoading({ title: '信息获取中' });
    $api.request(
      service.GetHasAcceptDatas,
      "POST",
      {
        userId: wx.getStorageSync('userId'),
        pageIndex:pageIndex,
        pageSize:pageSize
      },
      (res) => {
        console.log(res)
        app.data.feedBackData[1] = app.data.feedBackData[1].concat(res.data);
        that.setData({
          integralData: app.data.feedBackData[1]
        })
        console.log(app.data);
        wx.hideLoading();
      },
      (err) => {
        console.log(err);
      },
      (res) => {
        console.log("complete:", res)
        wx.hideLoading();
      }
    )
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
    app.data.feedBackData[1] = []
    this.init();
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

      console.log('下拉刷新')
      pageIndex = 0;
      app.data.feedBackData[1] = [];
      this.setData({
        integralData: app.data.feedBackData[1]
      })
     this.getData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('上拉加载更多');
    pageIndex++;
    this.getData();
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