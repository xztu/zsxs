var app = getApp();
Page({
  data: {
    loading: true,
    userInfo: null,
    username: "",
    password: "",
  },
  // 输入用户名
  usernameInput: function (e) {
    this.setData({
      username: e.detail.value
    });
  },
  // 输入密码
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    });
  },
  // 登陆
  signIn: async function () {
    wx.showLoading({ title: '加载中...', mask: true }) // 弹出 Loading
    const response = await wx.cloud.callContainer({ path: app.globalData.configs.container + '/more/account/sign-in', method: "POST", data: { Username: this.data.username, Password: this.data.password } })
    wx.hideLoading() // 隐藏 loading
    if (response.data.Message === "Success") {
      wx.showModal({
        title: '登陆成功',
        content: '您可以再次打开本页面退出登陆。',
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
      // 处理错误
      app.methods.handleError({ err: response, title: '登陆失败', content: response.data.Message, reLaunch: false })
    }
  },
  // 退出登陆
  signOut: async function () {
    wx.showLoading({ title: '加载中...', mask: true }) // 弹出 Loading
    const response = await wx.cloud.callContainer({ path: app.globalData.configs.container + '/more/account/sign-out', method: "POST" })
    wx.hideLoading() // 隐藏 loading
    if (response.data.Message === "Success") {
      wx.showModal({
        title: '退出登陆成功',
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
      // 处理错误
      app.methods.handleError({ err: response, title: '退出登陆失败', content: response.data.Message, reLaunch: false })
    }
  },
  onLoad: async function () {
    const response = await wx.cloud.callContainer({ path: app.globalData.configs.container + '/more/account/info' })
    if (response.data.Message === "Success") {
      this.setData({ userInfo: response.data.Data })
    }
    this.setData({ loading: false, year: new Date().getFullYear() })
  },
  
  // 分享给好友
  onShareAppMessage() {
    return {
      title: "掌上忻师登陆入口",
      imageUrl: '/images/logo/share.png'
    }
  },
  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: "掌上忻师登陆入口"
    }
  },
})
