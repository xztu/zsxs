// pages/main/zshy/zshy.js
var app = getApp();
Page({
  data: {
    title_info: "一键核验证书真伪",
    firstload: true,
    result: null
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
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
  onUnload: function () {
    // 页面关闭
  },
  sc: function () {
    wx.scanCode({
      success: (res) => {
        var that = this;
        if (res.scanType == "QR_CODE") {
          wx.showLoading({
            title: '加载中',
            mask: true
          });
          wx.request({
            url: app.server + "WeAPP_ZSHY.php",
            data: {
              code: res.result,
              openID: app.globalData.openID,
              usertype: app.globalData.usertype,
              nickname: app.globalData.userInfo.nickName,
              appver: app.appver,
              device: app.globalData.deviceInfo.model,
              vxversion: app.globalData.deviceInfo.version
            },
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
              if (res.data != "FALSE") {
                that.setData({
                  result: res.data,
                });
              } else {
                wx.showModal({
                  title: '核验失败',
                  content: '未找到匹配的证书，请重试！',
                  showCancel: false,
                });
                that.setData({
                  firstload: true,
                  title_info: "一键核验证书真伪"
                });
                return;
              }
              that.setData({
                firstload: false,
                title_info: "请您查看核验结果"
              });
            },
            fail: function () {
              return "fail";
            }
          });
          wx.hideLoading();
        } else {
          wx.showModal({
            title: '核验失败',
            content: '扫描的图片不是防伪验证码！',
            showCancel: false,
          });
          that.setData({
            firstload: true,
            title_info: "一键核验证书真伪"
          });
        }
      },
      fail: function () {
        wx.showModal({
          title: '核验失败',
          content: '请尝试重新扫描防伪验证码！',
          showCancel: false,
        });
      }
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