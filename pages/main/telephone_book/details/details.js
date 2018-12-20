// pages/main/sxh/details/details.js
var app = getApp();
Page({
  data:{
    server: app.server,
    resData: []
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    wx.request({
      url: app.server + "WeAPP_DHB.php",
      data: {
        openID: app.globalData.openID,
        flag: "Details",
        id: options.id,
        user: app.globalData.user,
        usertype: app.globalData.usertype,
        nickname: app.globalData.userInfo.nickName,
        appver: app.appver,
        device: app.globalData.deviceInfo.model,
        vxversion: app.globalData.deviceInfo.version
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        that.setData({
          resData: res.data.result,
        });
      },
      fail: function () {
        return "fail";
      }
    });
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  call: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.id
    })
  },
  onShareAppMessage: function () {
    return {
      title: app.globalData.shareTitle.public,
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})