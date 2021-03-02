//获取应用实例
var app = getApp();
Page({
  data: {
    loading: true,
    readme: null,
  },
  onLoad: function () {
    this.setData({ year: new Date().getFullYear() });
    // 获取配置 
    wx.cloud.database().collection('Readme').get({
      success: res => {
        this.setData({ loading: false, readme: res.data[0] })
      },
      fail: err => {
        this.setData({ loading: false })
        app.methods.handleError({ err: err, title: "出错啦", content: '获取配置失败', reLaunch: true })
      }
    })
  },
  
  // 分享给好友
  onShareAppMessage() {
    return {
      title: "一件很重要的事儿",
      imageUrl: '/images/logo/share.png'
    }
  },
});