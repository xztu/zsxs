// pages/main/telephone_book/telephone_book.js
var app = getApp();
Page({
  data: {
    loading: true,
    currentTotal: 0,
    currentPage: 1,
    group: [],
    page: 1,
    inputShowed: false,
    inputVal: "",
    remind: "向上滑动加载更多 向下滑动刷新页面"
  },
  onLoad: async function (options) {
    // 加载列表
    const response = await wx.cloud.callContainer({ path: app.globalData.configs.container + '/index/telephone-book/group?limit=20' })
    if (response.data.Message === "Success") {
      if (response.data.Total > 0) {
        this.setData({ loading: false, group: response.data.Data, currentPage: this.data.currentPage + 1, currentTotal: response.data.Total, remind: response.data.Total > 20 ? "向上滑动加载更多 向下滑动刷新页面" : "向下滑动刷新页面" }) // 保存资讯列表
      } else {
        this.setData({ loading: false })
        wx.showToast({ title: '没有找到分组', icon: 'none' })
      }
    } else {
      // 处理错误
      app.methods.handleError({ err: response, title: '获取分组列表失败', content: response.data.Message, reLaunch: false })
    }
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  search: function (e) {
    wx.navigateTo({ url: 'search/index?name=' + this.data.inputVal });
    this.setData({ inputVal: "", inputShowed: false });
  },
  // 向上滑动 加载更多
  onReachBottom: async function () {
    if (this.data.remind != "向上滑动加载更多 向下滑动刷新页面") {
      return;
    }

    if (this.data.group.length >= this.data.currentTotal) {
      this.setData({ remind: "向下滑动刷新页面" })
      wx.showToast({ title: '没有更多分组啦', icon: 'none' })
      return
    }

    wx.showLoading({ title: '加载中...', mask: true }) // 弹出 Loading

    // 加载列表
    const response = await wx.cloud.callContainer({ path: app.globalData.configs.container + '/index/telephone-book/group?limit=20&page=' + this.data.currentPage })
    if (response.data.Message === "Success") {
      wx.hideLoading() // 隐藏 loading
      if (response.data.Total > 0) {
        this.setData({ group: this.data.group.concat(response.data.Data), currentPage: this.data.currentPage + 1, currentTotal: response.data.Total }) // 保存资讯列表
      } else {
        wx.showToast({ title: '没有找到分组', icon: 'none' })
      }
    } else {
      wx.hideLoading() // 隐藏 loading
      // 处理错误
      app.methods.handleError({ err: response, title: '获取分组列表失败', content: response.data.Message, reLaunch: false })
    }
  },
  // 向下滑动 刷新页面
  onPullDownRefresh: async function () {
    this.setData({ loading: true, remind: "向上滑动加载更多 向下滑动刷新页面", page: 1, currentTotal: 0, currentPage: 1, group: [] })
    await this.onLoad();
    wx.stopPullDownRefresh() // 停止向下滑动刷新，回弹页面
  },

  // 分享给好友
  onShareAppMessage() {
    return {
      title: "校内电话簿",
      imageUrl: '/images/logo/share.png'
    }
  },
  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: "校内电话簿",
      imageUrl: '/images/logo/share.png'
    }
  },
})