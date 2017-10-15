//about.js
//获取应用实例
var app = getApp();
Page({
  data: {
    version: '',
    server: app.server,
    showLog: false
  },
  onLoad: function(){
    this.setData({
      version: app.appver,
      year: new Date().getFullYear()
    });
  },
  toggleLog: function(){
    this.setData({
      showLog: !this.data.showLog
    });
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
});