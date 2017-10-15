// /pages/my/SetCET/SetCET.js
var app = getApp();
Page({
  data: {
    server: app.server,
    zkzh: null,
    zkzhText: "在这里输入准考证号码",
    btnText: null,
    xm: null,
    loadHidden: false,
    modalHidden: true,
    modalHidden1: true
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
        flag: "Check",
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
        console.log(res)
        if (res.data.result == "FALSE") {
          that.setData({
            loadHidden: true,
            modalHidden: false,
          });
        } else if (res.data.result == "NOTEXISTZKZ") {
          that.setData({
            btnText: "绑 定",
            xm: res.data.xm,
            loadHidden: true,
          });
        } else {
          that.setData({
            btnText: "修 改",
            xm: res.data.xm,
            zkzhText: res.data.zkzh,
            loadHidden: true,
          });
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
  bindKeyInput: function (e) {
    this.setData({
      zkzh: e.detail.value
    });
  },
  isLogin: function () {
    var that = this;
    that.setData({ loading: true });
    wx.request({
      url: app.server + "WeAPP_CET.php",
      data: {
        flag: "Submit",
        openID: app.globalData.openID,
        zkzh: that.data.zkzh,
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
        if (res.data.tips != "") {
          wx.showModal({
            title: '保存失败',
            content: res.data.tips,
            showCancel: false,
          });
        } else {
          wx.showModal({
            title: '保存成功',
            content: '您可以再次打开本页面对已经保存的内容进行修改。',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          });
        }
        that.setData({ loading: false });
      },
      fail: function () {
        that.setData({
          modalValue: "无法连接服务器",
          modalHidden: false,
          disabled: true,
          btnHidden: true
        });
        return;
      }
    });
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
      url: '/pages/my/register/register'
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