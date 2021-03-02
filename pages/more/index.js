// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    loading: true,
    userInfo: null,
  },
  onShow: async function () {
    this.setData({ loading: true })
    const response = await wx.cloud.callContainer({ path: app.globalData.configs.container + '/more/account/info' })
    if (response.data.Message === "Success") {
      this.setData({ loading: false, userInfo: response.data.Data })
    } else {
      this.setData({ loading: false, userInfo: null })
    }
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
