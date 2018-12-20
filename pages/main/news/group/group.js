// pages/main/telephone_book/group/group.js

var app = getApp();
Page({
  data: {
    loadHidden: false,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.request({
      url: app.server + "WeAPP_News.php",
      data: {
        openID: app.globalData.openID,
        flag: options.bd,
        code: options.id,
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
        if (res.data.tip == "") {
          that.setData({
            resData: res.data.result,
          });
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.tip,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                });
              } else {
                //点击取消
              }
            }
          });
        }
      },
      fail: function () {
        return "fail";
      }
    });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
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