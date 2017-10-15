var app = getApp();
Page({
  data: {
    server: app.server,
    loading: false,
    user: null,
    password: null,
    modalValue: null,
    modalHidden: true,
    nowUser: null,
  },
  onShow: function () {
    var that = this;
    var nowUseris = app.globalData.user;
    if(app.globalData.usertype == 'student'){
      nowUseris += "(学生)"
    } else if (app.globalData.usertype == 'teacher'){
      nowUseris += "(教师)"
    } else {
      nowUseris = "未登录"
    }
    this.setData({
      year: new Date().getFullYear(),
      nowUser: nowUseris
    });
  },
  userInput: function (e) {
    this.setData({
      user: e.detail.value
    });
  },
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    });
  },
  isLogin: function () {
    var that = this;
    that.setData({ loading: true });
    wx.request({
      url: app.server + "WeAPP_register.php",
      data: {
        user: that.data.user,
        password: that.data.password,
        openID: app.globalData.openID,
        nickname: app.globalData.userInfo.nickName,
        appver: app.appver,
        device: app.globalData.deviceInfo.model,
        vxversion: app.globalData.deviceInfo.version
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.data.result == "SETSUCCESS") {
          app.globalData.user = res.data.user
          app.globalData.usertype = res.data.type
          wx.showModal({
            title: '登陆成功',
            content: '您可以再次打开本页面重新登陆。',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                });
              }
            }
          });
        } else {
          that.setData({
            modalValue: res.data.result,
            modalHidden: false,
            loading: false
          });
        }
      },
      fail: function () {
        that.setData({
          modalValue: "无法连接服务器",
          modalHidden: false,
          loading: false
        });
        return;
      }
    });
  },
  cancelChange: function () {
    var that = this;
    that.setData({
      modalHidden: true
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
})
