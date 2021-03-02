var app = getApp();
Page({
  data: {
    loading: true,
    username: "",
    realName: "",
    semesterScore: {},

    isShare: false,
  },
  onLoad: function (options) {
    if (typeof options.username !== "undefined") {
      this.setData({ username: options.username, isShare: true })
    }
  },
  onShow: async function () {
    // 获取成绩
    this.setData({ loading: true })
    const response = await wx.cloud.callContainer({ path: app.globalData.configs.container + '/index/jw/score/last-semester' + (this.data.isShare ? '?username=' + this.data.username : '') })
    if (response.data.Message === "Success") {
      if (response.data.Data.SemesterScore[0]) response.data.Data.SemesterScore[0].GPA = response.data.Data.SemesterScore[0].GPA.toFixed(2)
      this.setData({ loading: false, username: response.data.Data.Username, realName: response.data.Data.RealName, semesterScore: response.data.Data.SemesterScore[0] ? response.data.Data.SemesterScore[0] : {} })
      if (this.data.isShare) wx.setNavigationBarTitle({ title: response.data.Data.RealName + '的期末成绩' });
    } else {
      if (response.data.Message === "未登陆") {
        // 未登陆
        wx.showModal({
          title: '未登陆',
          content: '是否前往登陆？',
          cancelText: '回首页',
          confirmText: '去登陆',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({ url: '/pages/more/account/index' })
            } else if (res.cancel) {
              wx.switchTab({ url: '/pages/index/index' })
            }
          }
        })
      } else {
        // 其他提示, 重定向到首页
        app.methods.handleError({ err: response, title: '查询失败', content: response.data.Message, reLaunch: true })
      }
    }
  },
  // 向下滑动 刷新页面
  onPullDownRefresh: async function () {
    await this.onShow();
    wx.stopPullDownRefresh() // 停止向下滑动刷新，回弹页面
  },

  // 分享给好友
  onShareAppMessage() {
    return {
      title: this.data.realName + '的期末成绩',
      path: 'pages/index/jw/score/last-semester/index?username=' + this.data.username,
      imageUrl: '/images/logo/share.png'
    }
  },
  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: this.data.realName + '的期末成绩',
      query: 'username=' + this.data.username,
      imageUrl: '/images/logo/share.png'
    }
  },
})