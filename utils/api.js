let config = require('../config.js');
let service = config.service;
let DEBUG = false;//切换数据入口
var Mock = require('mock.js')
function request(url, method, data, success, fail, complete){
  fail = typeof (fail) === 'function' ? fail : function () { };
  complete = typeof (complete) === 'function' ? complete : function () { };
  wx.request({
    url: url,
    method: method,
    data: data,
    header: { 'content-type': 'application/json' },
    success: success,
    fail: fail,
    complete: complete
  })
}
// function request(url,method, data, success, fail, complete) {
//   complete = typeof (complete) === 'function' ? complete : function () { };
//   if (!DEBUG) {
//     fail = typeof (fail) === 'function' ? fail : function () { };
//     complete = typeof (complete) === 'function' ? complete : function () { };
//     wx.request({
//       url: url,
//       method: method,
//       data: data,
//       header: { 'content-type': 'application/json' },
//       success: success,
//       fail: fail,
//       complete: complete
//     })
//     success(res)
//   }
//   else if (url == service.uploadFeedBackDatas) {
//     // 模拟数据
//     var res = Mock.mock({
//       'res': true,
//       'data': data,
//       'msg': "你提交的信息"
//     })
//     // 输出结果
//     //console.log(JSON.stringify(res, null, 2))
//     success(res);
//   }
//   else if(url == service.verifyUrl){
//     // 模拟数据
//     var res = Mock.mock({
//       'status': 200,
//       'data':data,
//       'verify':468486,
//       'msg': "验证码已经发送"
//     })
//     // 输出结果
//     //console.log(JSON.stringify(res, null, 2))
//     success(res);
//   }
//   else if (url == service.GetTotalIntergral){
//     res = {
//       integral:150,
//       res:true
//     };
//     success(res)
//   }
//   else if (url == service.GetHasAcceptDatas){
//     var res = {
//       res: true,
//       data: [
//       ]
//     };
//     if(data.pageIndex ==0){
//       res.data = [
//         {
//           applyTime: 1525421198,
//           department: "产品部",
//           types: "LCH15-10",
//           serialNum: "COX004874",
//           des: "主机转子严重磨损，机器在卸载时间段",
//           desDetail: "电机噪音大。。。。。。。。。。。。。。。。",
//           bigTrouble: "故障大类3",
//           litTrouble: "故障小类3",
//           img: ['/images/upload_img2.png'],
//           video: "",
//           addIntegral: 50
//         },
//         {
//           applyTime: 1525421198,
//           department: "产品部",
//           types: "LCH15-10",
//           serialNum: "COX004874",
//           des: "主机转子严重磨损，机器在卸载时间段",
//           desDetail: "电机噪音大。。。。。。。。。。。。。。。。",
//           bigTrouble: "故障大类3",
//           litTrouble: "故障小类3",
//           img: ['/images/upload_img2.png'],
//           video: "",
//           addIntegral: 50
//         },
//         {
//           applyTime: 1525421198,
//           department: "产品部",
//           types: "LCH15-10",
//           serialNum: "COX004874",
//           des: "主机转子严重磨损，机器在卸载时间段",
//           desDetail: "电机噪音大。。。。。。。。。。。。。。。。",
//           bigTrouble: "故障大类3",
//           litTrouble: "故障小类3",
//           img: ['/images/upload_img2.png'],
//           video: "",
//           addIntegral: 50
//         },
//         {
//           applyTime: 1525421198,
//           department: "产品部",
//           types: "LCH15-10",
//           serialNum: "COX004874",
//           des: "主机转子严重磨损，机器在卸载时间段",
//           desDetail: "电机噪音大。。。。。。。。。。。。。。。。",
//           bigTrouble: "故障大类3",
//           litTrouble: "故障小类3",
//           img: ['/images/upload_img2.png'],
//           video: "",
//           addIntegral: 50
//         },
//       ]
//     }
//     else if (data.pageIndex == 1){
//       res.data = [
//         {
//           applyTime: 1525421198,
//           department: "产品部1",
//           types: "LCH15-10",
//           serialNum: "COX004874",
//           des: "主机转子严重磨损，机器在卸载时间段",
//           desDetail: "电机噪音大。。。。。。。。。。。。。。。。",
//           bigTrouble: "故障大类3",
//           litTrouble: "故障小类3",
//           img: ['/images/upload_img2.png'],
//           video: "",
//           addIntegral: 100
//         },
//         {
//           applyTime: 1525421198,
//           department: "产品部1",
//           types: "LCH15-10",
//           serialNum: "COX004874",
//           des: "主机转子严重磨损，机器在卸载时间段",
//           desDetail: "电机噪音大。。。。。。。。。。。。。。。。",
//           bigTrouble: "故障大类3",
//           litTrouble: "故障小类3",
//           img: ['/images/upload_img2.png'],
//           video: "",
//           addIntegral: 100
//         }
//       ]
//     }
//     else if (data.pageIndex == 2) {
//       res.data = [
//         {
//           applyTime: 1525421198,
//           department: "产品部1",
//           types: "LCH15-10",
//           serialNum: "COX004874",
//           des: "主机转子严重磨损，机器在卸载时间段",
//           desDetail: "电机噪音大。。。。。。。。。。。。。。。。",
//           bigTrouble: "故障大类3",
//           litTrouble: "故障小类3",
//           img: ['/images/upload_img2.png'],
//           video: "",
//           addIntegral: 200
//         },
//         {
//           applyTime: 1525421198,
//           department: "产品部1",
//           types: "LCH15-10",
//           serialNum: "COX004874",
//           des: "主机转子严重磨损，机器在卸载时间段",
//           desDetail: "电机噪音大。。。。。。。。。。。。。。。。",
//           bigTrouble: "故障大类3",
//           litTrouble: "故障小类3",
//           img: ['/images/upload_img2.png'],
//           video: "",
//           addIntegral: 200
//         }
//       ]
//     }
//     success(res)
//   }
//   else if (url == service.GetNotAcceptDatas) {
//     res = {
//       res:true,
//       data:[
//         {
//           applyTime: 1525421198,
//           department: "技术部-未采用",
//           types: "LCH15-10",
//           serialNum: "COX004874",
//           des: "主机转子严重磨损，机器在卸载时间段2",
//           desDetail: "电机噪音大主机转子严重磨损，机器在卸载时间段2主机转子严重磨损，机器在卸载时间段主机转子严重磨损，机器在卸载时间段2",
//           bigTrouble: "故障大类2",
//           litTrouble: "故障小类2",
//           img: ['/images/upload_img1.png', '/images/upload_img1.png'],
//           video: ""
//         },
//         {
//           applyTime: 1525421198,
//           department: "技术部-未采用",
//           types: "LCH15-10",
//           serialNum: "COX004874",
//           des: "主机转子严重磨损，机器在卸载时间段2",
//           desDetail: "电机噪音大主机转子严重磨损，机器在卸载时间段2主机转子严重磨损，机器在卸载时间段主机转子严重磨损，机器在卸载时间段2",
//           bigTrouble: "故障大类2",
//           litTrouble: "故障小类2",
//           img: ['/images/upload_img1.png', '/images/upload_img1.png'],
//           video: ""
//         }
//       ]
//     };
//     success(res);
//   }
//   else if (url == service.GetToBeConfirmedDatas) {
//     res = {
//       res: true,
//       data: [
//         {
//           applyTime: 1470220608533,
//           department: "技术部-待确定",
//           types: "LCH15-10",
//           serialNum: "COX004874",
//           des: "主机转子严重磨损，机器在卸载时间段2",
//           desDetail: "电机噪音大主机转子严重磨损，机器在卸载时间段2主机转子严重磨损，机器在卸载时间段主机转子严重磨损，机器在卸载时间段2",
//           bigTrouble: "故障大类2",
//           litTrouble: "故障小类2",
//           img: ['/images/upload_img1.png', '/images/upload_img1.png'],
//           video: ""
//         }
//       ]
//     };
//     success(res);
//   }
//   else if (url == service.qualityUrl) {
//     // 模拟数据
//     var res = {
//       brand:[
//         {
//           name: '京东',
//           id: 101
//         },
//         {
//           name: '盛大',
//           id: 102
//         },
//         {
//           name: '淘宝',
//           id: 103
//         }
//       ],
//       agent: [
//         {
//           name: '代理商1',
//           id: 201
//         },
//         {
//           name: '代理商2',
//           id: 202
//         },
//         {
//           name: '代理商3',
//           id: 203
//         }
//       ],
//       press: [
//         {
//           name: 2400,
//           id: 2400
//         },
//         {
//           name: 4800,
//           id: 4800
//         },
//         {
//           name: 9600,
//           id: 9600
//         }
//       ],//压力
//       types: [
//         {
//           name: '机型1',
//           id: 1101
//         },
//         {
//           name: '机型2',
//           id: 1102
//         },
//         {
//           name: '机型3',
//           id: 1103
//         }
//       ],//机型
//       serialNum: null,
//       description: '',
//       troubles: [
//         // range-key 的值就是你要显示的内容的属性名，例如这里的name
//         // 二维数组的第一个相当于第一列的选择
//         [
//           {
//             id: 2201,
//             name: '第一种'
//           },
//           {
//             id: 2202,
//             name: '第二种'
//           },
//           {
//             id: 2203,
//             name: '第三种'
//           }
//         ],
//         //二维数组的第二个相当于第二列的选择
//         [
//           [{
//             id: 11,
//             name: '11'
//           },
//           {
//             id: 22,
//             name: '22'
//           },
//           {
//             id: 33,
//             name: '33'
//           }],
//           [{
//             id: 1111,
//             name: '1111',
//           },
//           {
//             id: 2222,
//             name: '2222',
//           },
//           {
//             id: 3333,
//             name: '3333',
//           }],
//           [{
//             id: 7777,
//             name: '7777',
//           },
//           {
//             id: 8888,
//             name: '8888',
//           },
//           {
//             id: 9999,
//             name: '9999',
//           }]
//         ]
//       ]
//     }
//     // 输出结果
//     //console.log(JSON.stringify(res, null, 2))
//     // success(res);
//     complete({msg:"完成"})
//   }
//   else if(url == service.loginUrl){
//     // 模拟数据
//     var res = Mock.mock({
//       'status': 200,
//       'res':true,
//       'userId':'868465116487',
//       'userType':true,
//       'msg': "登录成功",
      
//     })
//     // 输出结果
//     setTimeout(function(){
//       success(res);
//     })
//   }
//   else if (url == service.getSaveUserOpenId) {
//     // 模拟数据
//     var res = {
//       data:{
//         openid:data.code,
//         res:true,
//         userId:'16498798131544',
//         userType:true,
//         'agentId': 'agentId465484898484',
//         'agentName': '代理商名字'
//       }
//     }
//     // 输出结果
//     //console.log(JSON.stringify(res, null, 2))
//     //setTimeout(function () {
//       success(res);
//       complete();
//     //})
//   }
//   else if(url == service.feedBackDataUrl){
//     var res = {
//       integral:100,
//       feedBackData:[
//       [
//         {
//           applyTime: "2018/3/17 16:14:25",
//           department: "工程部",
//           types: "LCH15-10",
//           serialNum: "COX004874",
//           des: "主机转子严重磨损，机器在卸载时间段1",
//           desDetail: "电机噪音大。。。。。。。。。。。。。。。。",
//           bigTrouble: "故障大类1",
//           litTrouble: "故障小类1",
//           img: ['/images/upload_img1.png', '/images/upload_img2.png'],
//           video: "/images/audio2.mp4"
//         },
//         {
//           applyTime: "2018/3/17 16:14:25",
//           department: "技术部",
//           types: "LCH15-10",
//           serialNum: "COX004874",
//           des: "主机转子严重磨损，机器在卸载时间段2",
//           desDetail: "电机噪音大主机转子严重磨损，机器在卸载时间段2主机转子严重磨损，机器在卸载时间段主机转子严重磨损，机器在卸载时间段2",
//           bigTrouble: "故障大类2",
//           litTrouble: "故障小类2",
//           img: ['/images/upload_img1.png', '/images/upload_img1.png'],
//           video: ""
//         }
//       ],
      
//     ]
//   }
//     // 输出结果
//     //console.log(JSON.stringify(res, null, 2))
//     setTimeout(function () {
//       success(res);
//     },2000)
//     complete({
//       status:200,
//       msg:'请求完成'
//     })
//   }
//   else if(url == service.getAgent){
//     var res = {
//       state:true,
//       agent:[
//       {
//         name: '代理商1',
//         id: 201
//       },
//       {
//         name: '代理商2',
//         id: 202
//       },
//       {
//         name: '代理商3',
//         id: 203
//       }
//       ]
//     }
//     success(res)
//   }
//   else if (url == service.getType){
//     var res = {
//       state:true,
//       types:[
//       {
//         name: '机型1',
//         id: 1101
//       },
//       {
//         name: '机型2',
//         id: 1102
//       },
//       {
//         name: '机型3',
//         id: 1103
//       }
//       ]
//     }
//     success(res)
//   }
//   else if (url == service.getPress){
//     var res = {
//       state: true,
//       press: [
//         {
//           name: 2400,
//           id: 2400
//         },
//         {
//           name: 4800,
//           id: 4800
//         },
//         {
//           name: 9600,
//           id: 9600
//         }
//       ]
//     }
//     success(res)
//   }
//   else{
//     // 模拟数据
//     var res = {
      
//     }
//     // 输出结果
//     // console.log(JSON.stringify(res, null, 2))
//     fail({
//       'status': 300,
//       'msg': "接口错误"
//     });
//   }
// }
module.exports = {
  request: request
}