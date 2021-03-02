// pages/main/sxh/details/details.js
var app = getApp();
Page({
  data: {
    loading: true,
    cid: 0,
    contactInfo: {},
  },
  onLoad: function (options) {
    if (typeof options.cid !== "string") {
      app.methods.handleError({ err: options, title: '参数错误', content: "", reLaunch: true })
      return
    }
    this.setData({ cid: options.cid })
  },
  onShow: async function () {
    if (this.data.cid !== 0) {
      // 加载信息
      const response = await wx.cloud.callContainer({ path: app.globalData.configs.container + '/index/telephone-book/detail?cid=' + this.data.cid })
      console.log(response)
      if (response.data.Message === "Success") {
        this.setData({ loading: false, contactInfo: response.data.Data })
      } else {
        // 处理错误
        app.methods.handleError({ err: response, title: '获取联系人详情失败', content: response.data.Message, reLaunch: true })
      }
    } else {
      app.methods.handleError({ err: this.data, title: '参数错误', content: "", reLaunch: true })
    }
  },
  call: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.id
    })
  },

  // 分享给好友
  onShareAppMessage() {
    return {
      title: "校内电话簿 - 联系人 - " + this.data.contactInfo.Name,
      imageUrl: '/images/logo/share.png'
    }
  },
  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: "校内电话簿 - 联系人 - " + this.data.contactInfo.Name,
      imageUrl: '/images/logo/share.png'
    }
  },
})