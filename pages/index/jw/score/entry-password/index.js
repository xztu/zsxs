var app = getApp();
Page({
  data: {
    loading: true,
    role: "",
    username: "",
    realName: "",
    semesterInfo: { Year: "", Semester: "" },
    passwords: [],
    supplementSemesterInfo: { Year: "", Semester: "" },
    supplementPasswords: [],

    passwordsShowIndex: -1,
    supplementPasswordsShowIndex: -1,
  },
  onShow: async function () {
    this.setData({ loading: true })
    const response = await wx.cloud.callContainer({ path: app.globalData.configs.container + '/index/jw/score/entry-password' })
    if (response.data.Message === "Success") {
      // 分解数据
      this.setData({ loading: false, role: response.data.Data.Role, username: response.data.Data.Username, realName: response.data.Data.RealName, semesterInfo: response.data.Data.SemesterInfo, passwords: response.data.Data.Passwords, supplementSemesterInfo: response.data.Data.SupplementSemesterInfo, supplementPasswords: response.data.Data.SupplementPasswords })
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
  // 展开密码卡片
  bindOpenPassword: function (e) {
    // 判断当前卡片是否已经展开
    if (parseInt(e.currentTarget.dataset.index) === this.data.passwordsShowIndex) {
      // 当前卡片已经展开, 将其关闭
      this.setData({ passwordsShowIndex: -1 });
    } else {
      // 展开当前卡片已经
      this.setData({ passwordsShowIndex: parseInt(e.currentTarget.dataset.index) });
    }
    if (this.data.supplementPasswordsShowIndex !== -1) {
      // 关闭补考密码卡片
      this.setData({ supplementPasswordsShowIndex: -1 });
    }
  },
  // 展开补考密码卡片
  bindOpenSupplementPassword: function (e) {
    // 判断当前卡片是否已经展开
    if (parseInt(e.currentTarget.dataset.index) === this.data.supplementPasswordsShowIndex) {
      // 当前卡片已经展开, 将其关闭
      this.setData({ supplementPasswordsShowIndex: -1 });
    } else {
      // 展开当前卡片已经
      this.setData({ supplementPasswordsShowIndex: parseInt(e.currentTarget.dataset.index) });
    }
    if (this.data.passwordsShowIndex !== -1) {
      // 关闭密码卡片
      this.setData({ passwordsShowIndex: -1 });
    }
  },

  // 分享给好友
  onShareAppMessage() {
    return {
      title: "成绩录入密码查询",
      imageUrl: '/images/logo/share.png'
    }
  },
  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: "成绩录入密码查询",
      imageUrl: '/images/logo/share.png'
    }
  },
})