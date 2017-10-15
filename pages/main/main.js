// pages/study/study.js
var app = getApp();
Page({
  data: {
    server: app.server,
    usertype: null,
    loading: true,
    kcb: null,
    kb: false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
    setTimeout(function () {
      if (app.globalData.loginFail) {
        wx.showModal({
          title: '获取授权失败',
          content: '拒绝授权将无法关联账号并影响使用。请删本应用后重新添加，并点击允许授权！',
          showCancel: false,
          confirmText: '我知道了',
        });
      }
    }, 1500)
  },
  onShow: function () {
    // 页面显示
    /*
    app.globalData.usertype = "Na" //测试
    if (app.globalData.usertype == "Na") {
      wx.navigateTo({
      url: '/pages/index/index'
    });
    }*/
    var that = this;
    that.refresh();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  refresh: function () {
    var that = this;
    var week = String(new Date().getDay());
    if (week == "0") {
      week = "7";
    }
    that.setData({ usertype: app.globalData.usertype });
    wx.request({
      url: app.server + "WeAPP_Jw_KCB.php",
      data: {
        openID: app.globalData.openID,
        xqj: week,
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
        if (res.data != "FALSE" && res.data != "NOTEXIST" && res.data.kcb != "NULL") {
          that.setData({
            loading: false,
            kcb: res.data.kcb,
            kb: true
          });
        } else {
          that.setData({
            loading: false,
            kb: false
          });
        }
      },
      fail: function () {
        that.setData({
          loading: false,
          kb: false
        });
      }
    });
  },
  onShareAppMessage: function () {
    return {
      title: '忻师人自己的小程序来啦，快试试吧！',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
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