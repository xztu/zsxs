//about.js
//获取应用实例
var app = getApp();
Page({
  data: {
    version: app.appver,
    server: app.server,
    readme: null,
  },
  onLoad: function(){
    this.setData({
      year: new Date().getFullYear()
    });
    wx.request({
      url: app.server + 'WeAPP_readme.json',
      success: res => {
        if (res.data.Content && res.data.Footer) {
          this.setData({
            readme: res.data
          })
        }
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: app.globalData.shareTitle.public,
      path: '/pages/index/index'
    }
  }
});