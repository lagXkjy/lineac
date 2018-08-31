// pages/feedback/index.js
let util = require('../../utils/util');
let common = require('../../config');
let $api = require('../../utils/api');
let service = common.service;
var app = getApp();
let pageIndex = 0;
const pageSize = 20;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['待确认', '已采用', '未采用'],
    currentTab: 0,
    feedBackData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.data.feedBackData[1] = [];
  },
  init(){
    util.showLoading('努力加载中...');
    this.setData({
      currentTab: 0
    })
    this.getData();
  },
  navbarTap: function (e) {
    var that = this;
    that.setData({
      currentTab: e.currentTarget.dataset.idx,
    });
    this.getData();
  },
  getData: function () {
    var that = this;
    let currentTab = this.data.currentTab;
    let userId = wx.getStorageSync('userId');
    let url = '';
    let data = {
      userId: userId
    };
    
    switch (currentTab) {
      case 0:
        url = service.GetToBeConfirmedDatas;
        app.data.feedBackData[currentTab] = [];
        break;
      case 1:
        url = service.GetHasAcceptDatas;
        data.pageIndex = pageIndex;
        data.pageSize = pageSize;
        break;
      case 2:
        url =  service.GetNotAcceptDatas;
        app.data.feedBackData[currentTab] = [];
        break;
      default:
        break;
    }
    wx.showLoading({ title: '信息获取中' });
    $api.request(
      url,
      "POST",
      data,
      (res) => {
        console.log(res)
        console.log(app.data);
        res.data.map(function(item){
         console.log(item.applyTime);
         //item.applyTime = util.formatTime(item.applyTime)
         let date = new Date(parseInt(item.applyTime));
         item.applyTime = util.formatTime(date)
        })
        app.data.feedBackData[currentTab] = app.data.feedBackData[currentTab].concat(res.data);
        that.setData({
          feedBackData: app.data.feedBackData
        })
        if(currentTab == 1){
          pageIndex++;
        }
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
    pageIndex = 0;
    this.getData();
  },
  goToMy:function(options){
      console.log(options.target.dataset)
      let currentTab = this.data.currentTab;
      let index = options.target.dataset.index;
      wx.navigateTo({
        url: `../My/index?currentTab=${currentTab}&index=${index}`,
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
    this.init();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getData();
  },
  onShareAppMessage: function () {
    return {
      title: '质量反馈',
      path: '/pages/login/index'
    }
  }
})