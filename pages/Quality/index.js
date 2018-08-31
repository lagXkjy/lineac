// pages/Quality/index.js
let util = require('../../utils/util');
let common = require('../../config');
let $api = require('../../utils/api');
let service = common.service;
let countdown = 60;
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    brand:[],
    agent:[],
    press: [],//压力
    types: [],//机型
    serialNum: null,
    description: '',
    troublesBigPick: [],
    troublesLitPick: [],
    pressNotChecked: true,
    typesNotChecked: true,
    depNotChecked: true,
    brandNotChecked:true,
    agentNotChecked:true,
    depIndex: null,
    typeIndex: null,
    pressIndex: null,
    bigIndex: null,
    imgChoosed: false,
    vedioChoosed: false,
    canGetVerify: false,//是否可以获取验证码
    getted: false,
    time: 60,
    show: true,
    phone: '',//手机
    verify: null,//验证码
    showImgs: [],
    addres:'',
    showPhoneInp:true,
    userShow:true,
    canSubmit:true,
    preVideo:"",
    agentName:wx.getStorageSync('agentName')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  navToPreVideo(){
    wx.navigateTo({
      url: '../prevideo/prevideo',
    })
  },
  onLoad: function () {
    console.log("AGENT_NAME:",wx.getStorageSync('agentName'))
    let userId = wx.getStorageSync('userId')
    let openid = wx.getStorageSync('openid')
    if (userId){
      this.getUserType(openid)
    }
    this.setDate();
    this.getOpenId();
    this.getPickers();
    console.log("ZBNAME",wx.getStorageSync('ZBName'));
    console.log('ZBPhone', wx.getStorageSync('ZBPhone'));
    console.log('status',wx.getStorageSync('status'))
    console.log('userId', wx.getStorageSync('userId'))
    if (wx.getStorageSync('receiver')) {
      this.setData({
        receiver: wx.getStorageSync('receiver')
      })
    }
    if (wx.getStorageSync('tele')) {
      this.setData({
        tele: wx.getStorageSync('tele')
      })
    }
    if (wx.getStorageSync('receiveAddres')) {
      this.setData({
        receiveAddres: wx.getStorageSync('receiveAddres')
      })
    }
  },
  getUserType(openid){
    $api.request(
      service.GetUserType,
      "POST",
      {openid},
      (res)=>{
        console.log("获取用户类型", service.GetUserType,res)
        if(res.statusCode == 200){
          if (res.data.Status) {
            let userType = res.data.Results.usertype
            let userId = res.data.Results.userId
            let receiver = res.data.Results.receiver
            let tele = res.data.Results.phone
            let receiveAddres = res.data.Results.receiveAddres
            let agentName = res.data.Results.AgentName
            wx.setStorageSync('userType', userType)
            wx.setStorageSync('userId', userId)
            wx.setStorageSync('ZBName', receiver)
            wx.setStorageSync('ZBPhone', tele)
            wx.setStorageSync('ZBAddres', receiveAddres)
            this.setData({
              userType,
              userId,
              receiver,
              tele,
              receiveAddres,
              agentName
            })
          }else{
            if (res.data.Results == -1){
              util.showModel('提示','用户已删除')
            }
            if (res.data.Results == -2){
              util.showModel('提示', '用户未注册')
            }
            wx.setStorageSync('userType', 1)
            wx.setStorageSync('status', false)
            wx.setStorageSync('userId', null)
            this.setData({
              showPhoneInp:true,
              userType:1,
              userId:null
            })
            console.log("FALSE 重新获取")
            // util.getOpenId(()=>{

            // })
          }
        }
        
      },
      (err)=>{

      },
      (res)=>{

      }
    )
  },
  getOpenId() { //获取openid
    var that = this;
    let openid = wx.getStorageSync('openid');
    let userId = wx.getStorageSync('userId');
    console.log("openid:", openid);
    if (openid === null || openid === '') {
      console.log("首次进入没有openid:", openid);
      util.getOpenId(function () {
        console.log("没有openid请求之后且拿到userId,openid:", wx.getStorageSync('openid')); console.log("userType--:", wx.getStorageSync('userType'));
        if (wx.getStorageSync('status')){
          console.log("SET_SHOWPHONE5")
          that.setData({
            showPhoneInp:false,
            userId: wx.getStorageSync('userId'),
            agentName:wx.getStorageSync('agentName')
          })
        }
        console.log('ZBAddres',wx.getStorageSync('ZBAddres'));
        console.log('ZBAddres',wx.getStorageSync('ZBPhone'));
        console.log('ZBName', wx.getStorageSync('ZBName'));
        that.setData({
          userType: wx.getStorageSync('userType'),
          brand:wx.getStorageSync('brand'),
          receiver: wx.getStorageSync('ZBName'),
          tele: wx.getStorageSync('ZBPhone'),
          receiveAddres: wx.getStorageSync('ZBAddres')
        })
      });
      return;
    }
    console.log("首次进入有openid:", openid);
    console.log("userType:", wx.getStorageSync('userType'));
  },
  setDate:function(){
    let date =new Date();
    var today = util.formatDate(date);
    this.setData({
      today: today
    })
  },
  setLocation: function (lat,lon){
    var that = this;
    $api.request(
      service.GetUserAddress,
      "POST",
      {
        location: lat + "," + lon
      },
      (res) => {
        console.log("location:", res);
        if (res.data.Status) {
          that.setData({
            addres: res.data.Results
          })
        }else{
          if (res.data.Results){
            util.showModel("获取地址失败", res.data.Results)
          }else{
            util.showModel("获取地址失败", `错误代码：${res.statusCode}，请稍后再试`)
          }
        }
      },
      (err) => {
        console.log(err);
        util.showModel("获取地址错误，请稍后再试", err)
      },
      (res) => {
        console.log(res)
      }
    )
  },
  settime: function () {
    var that = this
    if (countdown == 0) {
      that.setData({
        show: true,
        getted: false,
        canGetVerify: true
      })
      countdown = 60;
      return
    } else {
      countdown--;
      that.setData({
        show: false,
        time: countdown
      })
    }
    var pp = setTimeout(function () {
      that.settime()
    }, 1000)
  },
  //初始化
  init: function () {
    util.showLoading('努力加载中...');
    $api.request(
      service.qualityUrl,
      "POST",
      {},
      (res) => {
        console.log(res);
        this.setData({
          press: res.press,//压力
          types: res.types,//机型
          brand:res.brand,
          agent:res.agent,
          serialNum: null,
          description: '',
          troubles: res.troubles,
          pressNotChecked: true,
          typesNotChecked: true,
          depNotChecked: true,
          depIndex: null,
          typeIndex: null,
          pressIndex: null,
          bigIndex: null,
          imgChoosed: false,
          vedioChoosed: false
        })
      },
      (err) => {
        console.log(err)
      },
      (res) => {
        //console.log(res);
        wx.hideLoading();
      },
    )
  },
  //设置pickers
  getPickers: function () {
    var that = this;
    //wx.showLoading({ title: '信息获取中' });
    var i = 0;
    let pickers = [
         service.getAgent,
         service.getType,
         service.getPress
    ];
    //,service.getTroubleBody
    picker();
    function picker(){
      console.log(i);
      console.log(pickers[i])
      $api.request(
        pickers[i],
        "POST",
        {},
        (res) => {
          console.log(res);
          if (res.data.Status) {
            let data = JSON.parse(res.data.Results)
            switch (i) {
              //代理商
              case 0:
                that.setData({
                  agent: data
                });
                break;
              // 机型
              case 1:
                that.setData({
                  types:data
                })
                break;
              // 压力
              case 2:
                that.setData({
                  press: data
                });
                break;
              // 故障部位
              // case 3:
              //   that.setData({
              //     troublesBigPick:data
              //   })
                break;
              default:
                break;
            }
          }else{
            if(res.data.Results){
              util.showModel('获取选择信息失败', res.data.Results)
            }else{
              util.showModel('获取选择信息失败', `错误代码:${res.statusCode}，请稍后再试`)
            }
          }
          if (i == pickers.length - 1) { return }
          i++;
          picker();
        },
        (err) => {
          util.showModel('获取选择信息错误,请稍后再试',err)
        },
        (res) => {
          // if(i == pickers.length-1){return};
          // i++;
          // this.picker(pickers,i);
        }
      )
    }
  },
  //手机号输入
  phoneInp(e) {
    let phone = e.detail.value;
    this.setData({
      canGetVerify: false,
      phone: phone
    })
    if (e.detail.value.length == 11) {
      console.log("11");
      let reg = /^1[3,4,5,7,8][0-9]{9}$/;
      if (reg.test(phone)) {
        this.setData({
          canGetVerify: true
        })
      }
    }
  },
  // 获取验证码
  getUserInfo: function () {
    var that = this;
    let phone = this.data.phone;
    let verify = this.data.verify;
    let verifyInp = this.data.verifyInp;
    let openid = wx.getStorageSync('openid');
    if (this.data.canGetVerify) {
      console.log(service);
      util.showLoading('获取验证码ing')
      $api.request(
        service.verifyUrl,
        'POST',
        {
          phone: this.data.phone
        },
        function (res) {
          console.log('verify:',res);
          if(res.data.Status){
            that.settime();
            that.setData({
              getted: true,
              verify: res.data.Results
            })
          }else{
            if (res.data.Results){
              util.showModel('失败提示', res.data.Results)
            }else{
              util.showModel('获取验证码失败', `错误代码${res.statusCode}`)
            }
          }
        },
        (err) => {
          console.log('验证码err：',err)
          util.showModel('提示', '验证码获取错误，请稍后再试')
        },
        (res) => {
          console.log(res);
          wx.hideLoading();
        }
      )
    } else {
      util.showModel("手机号未输入", "亲~请输入正确手机号");
    }
  },
  //验证码输入
  verifyInp(e) {
    console.log(e.detail.value);
    this.setData({
      verifyInp: e.detail.value
    });
  },
  //时间选择
  bindDateChange: function (e) {
    this.setData({
      date:e.detail.value
    })
  },
  //运行时间输入
  runTimeInp: function (e) {
    this.setData({
      runTime: e.detail.value
    })
    console.log('runTime:',this.data.runTime)
  },
  //问题描述
  descriptionInp: function (e) {
    this.setData({
      description: e.detail.value
    })
    console.log('description:', this.data.description)
  },
  // 索赔内容
  claimInp:function(e){
    this.setData({
      claim: e.detail.value
    })
    console.log('claim:', this.data.claim)
  },
  // 收货人
  receiverInp:function(e){
    this.setData({
      receiver: e.detail.value
    })
    console.log('receiver:', this.data.receiver)
  },
  receiverBlur(e){
    if(!e.detail.value){
      util.showModel('提示','请输入收货人')
    }
  },
  // 联系电话
  teleInp:function(e){
    let tele = e.detail.value;
    this.setData({
      tele:e.detail.value
    })
  },
  teleBlur(e){
    let tele = e.detail.value;
    if (tele === null || tele === undefined || tele === "") {
      util.showModel('提示', '请输入联系电话');
      return;
    }else{
      if (this.data.tele.length == 11) {
        let reg = /^1[3,4,5,7,8][0-9]{9}$/;
        if (!reg.test(this.data.tele)) {
          util.showModel('提示', '请输入正确联系电话格式');
          return;
        }
      }else{
        util.showModel('提示', '请输入正确联系电话格式');
        return;
      }
    }
  },
  // 联系地址
  receiveAddresInp:function(e){
    this.setData({
      receiveAddres: e.detail.value
    })
    console.log('receiveAddres:', this.data.receiveAddres)
  },
  receiveAddresBlur(e){
    if (!e.detail.value){
      util.showModel('提示','请输入收货地址')
    }
  },
  // 删除某张图片
  delImg:function(e){
    let index = Number(e.target.dataset.index);
    console.log(index);
    console.log(this.data.showImgs);
    let showImgs = this.data.showImgs;
    
    showImgs.splice(index,1);
    console.log(showImgs);
    // if(this.data.showImgs.length ==0){
    //   console.log("----------->>>>>>>>><<<<<<---------");
    //   this.setData({
    //     showImgs: []
    //   });
    //   showImgs = []
    //   app.data.Imgs = [];
    // }
    app.data.Imgs = showImgs;
    this.setData({
      showImgs: showImgs
    });
  },
  //删除选中视频
  delVideo(){
    this.setData({
      video:'',
      preVideo:'',
      showVideo:false
    })
  },
  //点击保存
  saveMsg:function(){
   
  },
  submitMsg: function () {
    let that = this;
    let count = 0;
    let length = 0;
    let AgentId;
    console.log("提交开始");
    console.log("verify", this.data.verify, "verifyInp", this.data.verifyInp);
    let photo = this.data.showImgs.join("|");
    let userId = wx.getStorageSync('userId')
    console.log(photo);
    if (!userId){
      if(!this.data.phone){
        util.showModel('提示', '请输入手机号');
        return;
      }
      if (Number(this.data.verify) != Number(this.data.verifyInp)){
        util.showModel('提示', '验证码错误');
        return;
      }
    }
    if(this.data.userType == 1){
      if (this.data.agentIndex === null || this.data.agentIndex === undefined || this.data.agentIndex === "") {
        util.showModel('提示', '请选择代理商');
        return;
      }
      AgentId = this.data.agent[this.data.agentIndex].Id
    }else{
      AgentId = wx.getStorageSync('agentId');
    }
    if (this.data.typeIndex === null || this.data.typeIndex === undefined || this.data.typeIndex === "") {
      util.showModel('提示', '请选择机型');
      return;
    }
    if (this.data.pressIndex === null || this.data.pressIndex === undefined || this.data.agentIndex === "") {
      util.showModel('提示', '请选择压力');
      return;
    }
    // if (this.data.bigIndex === null || this.data.bigIndex === undefined || this.data.bigIndex === "") {
    //   util.showModel('提示', '请选择故障部位');
    //   return;
    // }
    // if (this.data.litIndex === null || this.data.litIndex === undefined || this.data.litIndex === "") {
    //   util.showModel('提示', '请选择故障描述');
    //   return;
    // }
    if (this.data.clientName === null || this.data.clientName === undefined || this.data.clientName === "") {
      util.showModel('提示', '请输入客户名称');
      return;
    }
    if (this.data.serialNum === null || this.data.serialNum === undefined || this.data.serialNum === "") {
      util.showModel('提示', '请输入序列号');
      return;
    }else{
      let reg = /[\u4e00-\u9fa5]/g;
      if(reg.test(this.data.serialNum)){
        util.showModel('提示', '序列号不能包含中文');
        return;
      }
    }
    if (this.data.serialNum){
      //let reg =/^(CQL|CQA|COX|WUX)/;
      let reg = /^[A-Z]{3}/;
      if (!reg.test(this.data.serialNum)){
        util.showModel('提示', '序列号前三位必须为字母');
        return;
      }
    }
    if (this.data.runTime === null || this.data.runTime === undefined || this.data.runTime === "") {
      util.showModel('提示', '请输入运行时间');
      return;
    }
    if (this.data.description === null || this.data.description === undefined || this.data.description === "") {
      util.showModel('提示', '请输入问题描述');
      return;
    }
    if (!this.data.receiver || !this.data.receiveAddres || !this.data.tele){
      util.getOpenId(function(){
        that.setData({
          receiver: wx.getStorageSync('ZBName'),
          tele: wx.getStorageSync('ZBPhone'),
          receiveAddres: wx.getStorageSync('ZBAddres')
        })
      });
      return;
    }
    if (this.data.receiver === null || this.data.receiver === undefined || this.data.receiver === "") {
      util.showModel('提示', '请输入收货人');
      return;
    }
    if (this.data.receiveAddres === null || this.data.receiveAddres === undefined || this.data.receiveAddres === "") {
      util.showModel('提示', '请输入收货地址');
      return;
    }
    if (this.data.tele === null || this.data.tele === undefined || this.data.tele === "") {
      util.showModel('提示', '请输入正确联系电话格式');
      return;
    }else{
      if (this.data.tele.length == 11) {
        let reg = /^1[3,4,5,7,8][0-9]{9}$/;
        if (!reg.test(this.data.tele)) {
          util.showModel('提示', '请输入正确联系电话格式');
          return;
        }
      }else{
        util.showModel('提示', '请输入正确联系电话格式');
        return;
      }
    }
    if (photo === null || photo === undefined || photo === "") {
      util.showModel('提示', '请上传相关照片');
      return;
    }
    // if (this.data.video === null || this.data.video === undefined || this.data.video === "") {
    //   util.showModel('提示', '请上传相关视频');
    //   return;
    // }
    var upData = {
      phone: String(this.data.phone),
      openid: wx.getStorageSync('openid'),
      userId: wx.getStorageSync('userId'),
      Brand:this.data.brand,
      AgentId: AgentId,
      ClientName: this.data.clientName,
      ModelsType: this.data.types[this.data.typeIndex] + "-" + this.data.press[this.data.pressIndex],
      ModelsNum: this.data.serialNum,
      RuningTime:this.data.runTime,
      GPSLocation:this.data.addres,
      FaultBW:"",//this.data.troublesBigPick[this.data.bigIndex].Rem,
      FaultMS:"",//this.data.troublesLitPick[this.data.litIndex],
      ProblemRemark: this.data.description,
      ZbName: this.data.receiver,
      ZbAddress:this.data.receiveAddres,
      ZbPhone:this.data.tele,
      Photo:photo+"|",
      VideoUrl: this.data.video
    };
    if(this.data.claim){
      upData.ZbContent = this.data.claim;
    }
    if (this.data.date){
      upData.BootTime = this.data.date;
    }
    console.log("ZBDATAS>>",upData);

    if(this.data.canSubmit){
      console.log("可以提交");
      util.showLoading('质保申请中...');
      $api.request(
        service.UploadFeedBackDatas,
        "POST",
        upData,
        (res) => {
          console.log("ZBsuccess!!", res);
          if (res.statusCode == 200) {
            //util.showModel('提交结果', res.data.Results);
            if (res.data.Status) {
              let results = JSON.parse(res.data.Results)
              let userid = results.UserId;
              let userType = results.UserType
              //if (typeof (+userid) == 'number') {
                wx.setStorageSync('userId', userid);
                wx.setStorageSync('userType', userType);
                wx.setStorageSync('status', true);
                wx.setStorageSync('receiver', this.data.receiver);
                wx.setStorageSync('tele', this.data.tele);
                wx.setStorageSync('receiveAddres', this.data.receiveAddres);
                console.log("SET_SHOWPHONE6")
                this.setData({
                  showPhoneInp: false,
                  userType:userType
                })
              //}
              this.setData({
                agentIndex:null,
                clientName:'',
                pressIndex: null,
                typeIndex: null,
                serialNum: '',
                date: '',
                runTime: null,
                description: '',
                claim: '',
                showImgs: [],
                video: '',
              })
              wx.navigateTo({
                url: '../successTips/index',
              })
            }
          } else {
            this.setData({
              canSubmit: true
            })
            if(res.data.Results){
              util.showModel('提交失败！请稍后重试', res.data.Results)
            }else{
              util.showModel('提交失败！', `错误代码：${res.statusCode},请稍后重试`)
            }
          }
        },
        (err) => {
          this.setData({
            canSubmit: true
          })
          util.showModel('网络异常！请稍后重试', err)
        },
        (res) => {
          wx.hideLoading();
          console.log(res)
        }
      )
      this.setData({
        canSubmit: false
      })
    }else{
      util.showModel('提交', "提交过于频繁，请稍后提交")
    }
    setTimeout(() => {
      this.setData({
        canSubmit: true
      })
    },30000)
    // if (count == length - 1) {
    //   console.log("数据全部填写完成");
      
    //   $api.request(
    //     service.UploadFeedBackDatas,
    //     "POST",
    //     upData,
    //     (res)=>{
    //       console.log("ZBsuccess",res)
    //     },
    //     (err)=>{
    //       console.log(err)
    //     },
    //     (res)=>{
    //       console.log(res)
    //     }
    //   )
    // } else {
    //   console.log("数据没有全部填写完成");
    //   console.log(length, count);
    // }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    console.log('options:',options);
    console.log('onshowStatus', wx.getStorageSync('status'))
    let userId = wx.getStorageSync('userId')
    this.setData({
      userId
    })
   if(wx.getStorageSync('status')){
     console.log("SET_SHOWPHONE1")
     this.setData({
       showPhoneInp:false
     })
   }
    if (!userId) {
      console.log("SET_SHOWPHONE2")
     this.setData({
       showPhoneInp: true,
       userType:1
     })
   }
    console.log('ZBName', wx.getStorageSync('ZBName'))
    // if (wx.getStorageSync('ZBName')) {
    //   this.setData({
    //     receiver: wx.getStorageSync('ZBName')
    //   });
    // }
    // if (wx.getStorageSync('ZBPhone')) {
    //   this.setData({
    //     tele: wx.getStorageSync('ZBPhone')
    //   });
    // }
    // if (wx.getStorageSync('ZBAddres')) {
    //   this.setData({
    //     receiveAddres: wx.getStorageSync('ZBAddres')
    //   });
    // }
    if (wx.getStorageSync('clientName')) {
      this.setData({
        clientName: wx.getStorageSync('clientName')
      });
      console.log('clientName____________')
    }
    if (wx.getStorageSync('agentIndex')) {
      this.setData({
        agentIndex: wx.getStorageSync('agentIndex')
      })
      console.log('agentIndex____________', wx.getStorageSync('agentIndex'))
    }
    if (wx.getStorageSync('typeIndex')) {
      this.setData({
        typeIndex: wx.getStorageSync('typeIndex')
      })
      console.log('typeIndex____________', wx.getStorageSync('typeIndex'))
    }
    if (wx.getStorageSync('pressIndex')) {
      this.setData({
        pressIndex: wx.getStorageSync('pressIndex')
      })
    }
    if (wx.getStorageSync('bigIndex')) {
      this.setData({
        bigIndex: wx.getStorageSync('bigIndex')
      })
    }
    if (wx.getStorageSync('litIndex')) {
      let bigId = wx.getStorageSync('bigId')
      $api.request(
        service.getTroubleDescription,
        'POST',
        {
          FaultIocationId: bigId
        },
        (res) => {
          console.log("troubleDes", res);
          let data = JSON.parse(res.data.Results)
          if (res.data.Status) {
            this.setData({
              troublesLitPick: data
            })
          }
        },
        (err) => {
          console.log(err);
          util.showModel("网络异常", '获取信息失败，请稍后再试')
        },
        (res) => {
          console.log(res)
        }
      )
      this.setData({
        litIndex: wx.getStorageSync('litIndex')
      })
    }
    if (wx.getStorageSync('serialNum')) {
      this.setData({
        serialNum: wx.getStorageSync('serialNum')
      })
    }
    if (wx.getStorageSync('date')) {
      this.setData({
        date: wx.getStorageSync('date')
      })
    }
    if (wx.getStorageSync('runTime')) {
      this.setData({
        runTime: wx.getStorageSync('runTime')
      })
    }
    if (wx.getStorageSync('description')) {
      this.setData({
        description: wx.getStorageSync('description')
      })
    }
    if (wx.getStorageSync('claim')) {
      this.setData({
        claim: wx.getStorageSync('claim')
      })
    }
    // if (wx.getStorageSync('receiver')) {
    //   this.setData({
    //     receiver: wx.getStorageSync('receiver')
    //   })
    // }
    // if (wx.getStorageSync('tele')) {
    //   this.setData({
    //     tele: wx.getStorageSync('tele')
    //   })
    // }
    // if (wx.getStorageSync('receiveAddres')) {
    //   this.setData({
    //     receiveAddres: wx.getStorageSync('receiveAddres')
    //   })
    // }

    let brand = wx.getStorageSync('brand');
    let userType = wx.getStorageSync('userType');
    let agentId = wx.getStorageSync('agentId');
    let userShow = wx.getStorageSync('userShow');
    console.log("brand:",brand);
    console.log("onshowuserId:", wx.getStorageSync('userId'));
    console.log("userType:", userType);
    console.log("userShow:", wx.getStorageSync('userShow'));
    
    this.setData({
      brand:brand,
      userType:userType,
      agentId:agentId,
      userShow:userShow
    });
    // if (wx.getStorageSync('userId')) {
    //   console.log("onshow--userID")
    //   this.setData({
    //     showPhoneInp: false
    //   });
    //   wx.setStorageSync('status', true)
    // }


    //this.setLocation();
    util.GetSetting(
      () => {
        console.log("第一次进入获取位置");
        util.GetLocation((res) => {
          console.log('GetLocationSuccess:', res);
          this.setLocation(res.latitude, res.longitude)
        }, (err) => {
          console.log('GetLocationFial:', err);
          // wx.navigateTo({
          //   url: '../bus/bus',
          // })
        })
      },
      () => {
        // wx.navigateTo({
        //   url: '../bus/bus',
        // })
      },
      () => {
        console.log("获取位置成功重新定位");
        util.GetLocation((res) => {
          console.log('GetLocationSuccess:', res);
          this.setLocation(res.latitude, res.longitude);
        }, (err) => {
          console.log('GetLocationSuccess:', err)
        })
      },
      () => {
        console.log("获取位置失败重新定位");
      }
    )
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if(wx.getStorageSync('status')){
      console.log("SET_SHOWPHONE3")
      this.setData({
        showPhoneInp:false
      })
    };
    if (wx.getStorageSync('userId')){
      wx.setStorageSync('status', true);
      console.log("onhide userid get:", wx.getStorageSync('userId'))
      console.log("SET_SHOWPHONE4")
      this.setData({
        showPhoneInp: false
      });
    }
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
    //this.init();
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
      title: 'AC质保',
      path: '/pages/Quality/index'
    }
  },
  //   点击上传视频
  uploadAudio: function () {
    wx.pageScrollTo({
      scrollTop: 1600,
      duration: 300
    })
    var that = this;
    console.log('视频上传');
    let path;
    let usrId = wx.getStorageSync('userId');
    wx.chooseVideo({
      sourceType: ['album','camera'],
      camera: 'back',
      success: (res) => {
        if (res.size >= 10485760){
          //限制视频大小为10M 10485760
          util.showModel('提示','视频大于10M,无法上传');
          return;
        }
        path = res.tempFilePath;
        this.setData({
          video: path,
          vedioChoosed: true,
          preVideo: res.tempFilePath,
          scroll: "bottom"
        })
        util.showLoading('视频信息采集中')
        wx.uploadFile({
          url: service.uploadImgsUrl,
          filePath: path,
          name: 'file',
          formData: {},
          success: (res) => {
            console.log(res)
            let data = JSON.parse(res.data);
            if(data.result){
              that.setData({
                video: data.imgs,
                showVideo:true
              })
              app.data.video = data.imgs;
              wx.hideLoading();
              util.showModel('提示', '视频信息采集成功')
            }else{
              util.showModel('提示', '亲~视频信息采集失败了，再传一次吧')
            }
          },
          fail: (err) => {
            console.log(err);
            util.showModel('提示','视频信息采集失败')
          },
          complete: (res) => {
            console.log(res);
            wx.hideLoading();
          }
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  //   点击上传图片
  uploadImage: function () {
    console.log('照片上传');
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'],
      // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {//返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        this.setData({
          //img: res.tempFilePaths,
          imgChoosed: true
        });
        var i = 0; var length = res.tempFilePaths.length;
        var upload = function () {
          wx.uploadFile({
            url: service.uploadImgsUrl,
            filePath: res.tempFilePaths[i],
            name: 'file',
            formData: {},
            success: (res) => {
              console.log("success:", res);
              var datas = JSON.parse(res.data);
              console.log("IMAGE", datas.imgs)
              let showImgs = that.data.showImgs;
              showImgs.push(datas.imgs);
              that.setData({
                showImgs: showImgs
              })
            },
            fail: (err) => {
              console.log(err);
              util.showModel("上传失败", '网络异常，请稍后再试')
            },
            complete: (res) => {
              if (i == length-1){return}; 
              i++;
              upload();
            }
          });
        };
        upload();
        // util.uploadFiles('image',res.tempFilePaths,function(){
        //   console.log('AppImgs:', app.data.Imgs);
        //   that.setData({
        //     showImgs:app.data.Imgs
        //   })
        // })
      }
    })
    console.log(app.data.Imgs)
    console.log(this.data)
  },
  //图片预览
  preImage(e){
    console.log(e.target.dataset.path);
    let path = e.target.dataset.path;
    wx.previewImage({
      current: path, // 当前显示图片的http链接
      urls: [path] // 需要预览的图片http链接列表
    })
  },
  //品牌选择器
  bindPickerBrand: function (e) {
    this.setData({
      brandIndex: Number(e.detail.value),
      brandNotChecked: false
    })
  },
  //代理商选择器
  bindPickerAgent: function (e) {
    this.setData({
      agentIndex: Number(e.detail.value),
      agentNotChecked: false
    });
    let agentIndex = this.data.agentIndex;
    let agentId = this.data.agent[agentIndex].Id;
    util.showLoading('获取代理商信息ing...')
    $api.request(
      service.GetSaveReceiverMsg,
      "POST",
      {
        agentId:agentId
      },
      (res) => {
        console.log(res);
        if(res.data.Status){
          let data = JSON.parse(res.data.Results)
          this.setData({
              receiver:data.receiver,
              tele:data.phone,
              receiveAddres: data.receiveAddres,
          })
        }else{
          if (res.data.Results){
            util.showModel('获取收货人信息失败,请稍后再试', res.data.Results)
          }else{
            util.showModel('获取收货人信息失败', `错误代码${res.statusCode},请稍后再试`)
          }
        }
      },
      (err)=>{
        util.showModel("网络异常，请稍后再试", err)
      },
      (res) => {
        wx.hideLoading();
      },
    )
  },
  //客户名称输入
  clientNameInp:function(e){
    this.setData({
      clientName:e.detail.value
    });
    console.log("clientName:",this.data.clientName)
  },
  //压力选择器
  bindPickerPress: function (e) {
    this.setData({
      pressIndex: Number(e.detail.value),
      pressNotChecked: false
    })
  },
  //类型选择器
  bindPickerTypes: function (e) {

    this.setData({
      typeIndex: Number(e.detail.value),
      typesNotChecked: false
    })
  },
  //部门选择器
  bindPickerDepartment: function (e) {
    console.log(e);
    this.setData({
      depIndex: Number(e.detail.value),
      depNotChecked: false
    })
    console.log(this.data.depIndex)
  },
  //故障大类选择器
  bindPickerBigTrouble: function (e) {
    var that = this;
    this.setData({
      bigIndex: e.detail.value,
      litIndex: null,
    })
    //console.log(this.data.bigIndex);
    let bigIndex = this.data.bigIndex;
    let FaultIocationId = this.data.troublesBigPick[bigIndex].Id
    $api.request(
      service.getTroubleDescription,
      'POST',
      {
        FaultIocationId: FaultIocationId
      },
      (res) => {
        console.log("troubleDes", res);
        let data = JSON.parse(res.data.Results)
        if(res.data.Status){
          that.setData({
            troublesLitPick:data
          })
        }
      },
      (err) => {
        console.log(err);
        util.showModel("网络异常", '获取失败，请稍后再试')
      },
      (res) => {
        console.log(res)
      }
    )
  },
  //故障小类选择器
  bindPickerLitTrouble: function (e) {
    this.setData({
      litIndex: e.detail.value  
    })
    console.log(this.data.litIndex)
  },
  //序列号输入
  serialNumInp: function (e) {
    
    let reg = /[\u4e00-\u9fa5]/g;
    let UpCase = e.detail.value.toUpperCase();
    console.log("中文验证",reg.test(UpCase));
    // if (reg.test(UpCase)){
    //   util.showModel("提示","亲~序列号不能包含中文");
    //   compare = false;
    //   return;
    // }
    this.setData({
      serialNum: UpCase
    })
    console.log(this.data.serialNum)
  },
  serialblur(){
    let reg = /^[A-Z]{3}/;
    let reg2 = /[\u4e00-\u9fa5]/g;
    let serialNum = this.data.serialNum;
    if (!reg.test(this.data.serialNum)) {
      this.setData({
        serialNum: ''
      })
      util.showModel('提示', '序列号前三位必须为大写字母');
      return;
    };
    if (reg2.test(this.data.serialNum)) {
      this.setData({
        serialNum: serialNum.replace(/[\u4e00-\u9fa5]/g, '')
      })
      util.showModel('提示', '序列号不能包含中文');
      return;
    }
  },
  //描述输入
  desInp: function (e) {
    this.setData({
      description: e.detail.value
    })
    console.log(this.data.description)
  },
})