// pages/study/cet/cet.js
var app = getApp();
Page({
  data: {
    res: [],
    modalHidden: true,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    var that = this
    wx.request({
      url: app.server + "WeAPP_CET.php",
      data: {
        openID: app.globalData.openID,
        flag: "CheckScore",
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
        if (res.data == "FALSE" || res.data == "NOTEXIST" || res.data == "NOTEXISTZKZ") {
          that.setData({
            loadHidden: true,
            modalHidden: false,
          });
        } else {
          if (res.data.result.pro != "英语四级" && res.data.result.pro != "英语六级") {
            that.setData({
              loadHidden: true,
            });
            wx.showModal({
              title: '提示',
              content: '考试成绩尚未公布或准考证填写错误。',
              confirmText: '我知道了',
              cancelText: '改准考证',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 1
                  });
                } else {
                  wx.navigateTo({
                    url: '/pages/my/SetCET/SetCET'
                  });
                }
              }
            });
          } else {
            that.setData({
              res: res.data.result,
              loadHidden: true,
            });
          }
        }
      },
      fail: function () {
        return "fail";
      }
    });
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  // 关闭--模态弹窗
  cancelChange: function () {
    this.setData({ modalHidden: true });
    wx.navigateBack({
      delta: 1
    });
  },
  // 确认--模态弹窗
  confirmChange: function () {
    this.setData({ modalHidden: true });
    wx.navigateTo({
      url: '/pages/my/SetCET/SetCET'
    });
  },
  onShareAppMessage: function () {
    return {
      title: app.globalData.shareTitle.cet,
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