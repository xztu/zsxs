// pages/main/telephone_book/group/group.js

var app = getApp();
Page({
  data: {
    loading: true,
    gid: 0,
    currentTotal: 0,
    currentPage: 1,
    contacts: [],
    page: 1,
    remind: "向上滑动加载更多 向下滑动刷新页面"
  },
  onLoad: async function (options) {
    if (typeof options.gid !== "string") {
      app.methods.handleError({ err: options, title: '参数错误', content: "", reLaunch: true })
      return
    }
    this.setData({ gid: options.gid });
    // 加载列表
    const response = await wx.cloud.callContainer({ path: app.globalData.configs.container + '/index/telephone-book/contacts?limit=20&gid=' + options.gid })
    if (response.data.Message === "Success") {
      if (response.data.Total > 0) {
        this.setData({ loading: false, contacts: response.data.Data, currentPage: this.data.currentPage + 1, currentTotal: response.data.Total, remind: response.data.Total > 20 ? "向上滑动加载更多 向下滑动刷新页面" : "向下滑动刷新页面" }) // 保存资讯列表
      } else {
        this.setData({ loading: false })
        wx.showToast({ title: '没有找到属于该分组的联系人', icon: 'none' })
      }
    } else {
      // 处理错误
      app.methods.handleError({ err: response, title: '获取联系人列表失败', content: response.data.Message, reLaunch: true })
    }
  },
  // 向下滑动 刷新页面 
  onPullDownRefresh: async function () {
    this.setData({ loading: true, remind: "向上滑动加载更多 向下滑动刷新页面", page: 1, currentTotal: 0, currentPage: 1, contacts: [] })
    await this.onLoad({ gid: this.data.gid });
    wx.stopPullDownRefresh() // 停止向下滑动刷新，回弹页面
  },
  // 向上滑动 加载更多
  onReachBottom: async function () {
    if (this.data.remind != "向上滑动加载更多 向下滑动刷新页面") {
      return;
    }

    if (this.data.contacts.length >= this.data.currentTotal) {
      this.setData({ remind: "向下滑动刷新页面" })
      wx.showToast({ title: '没有更多联系人啦', icon: 'none' })
      return
    }

    wx.showLoading({ title: '加载中...', mask: true }) // 弹出 Loading

    // 加载列表
    const response = await wx.cloud.callContainer({ path: app.globalData.configs.container + '/index/telephone-book/contacts?limit=20&gid=' + this.data.gid + '&page=' + this.data.currentPage })
    if (response.data.Message === "Success") {
      wx.hideLoading() // 隐藏 loading
      if (response.data.Total > 0) {
        this.setData({ contacts: this.data.contacts.concat(response.data.Data), currentPage: this.data.currentPage + 1, currentTotal: response.data.Total }) // 保存资讯列表
      } else {
        wx.showToast({ title: '没有找到属于该分组的联系人', icon: 'none' })
      }
    } else {
      wx.hideLoading() // 隐藏 loading
      // 处理错误
      app.methods.handleError({ err: response, title: '获取联系人列表失败', content: response.data.Message, reLaunch: true })
    }
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