const app = getApp();

Page({
  data: {
    loading: true,
    topic: [],
    news: [],
    currentTopic: "headlines",
    currentPage: 0,
    currentTotal: 0,
  },
  // 切换话题
  clickTopic: function (e) {
    this.setData({ news: [], currentTopic: e.currentTarget.id }, function () { this.onPullDownRefresh() })
  },
  onLoad: function () {
    this.onPullDownRefresh();
  },
  // 下拉更新
  onPullDownRefresh: async function () {
    this.setData({ loading: true })
    // 加载话题列表
    const topicResponse = await wx.cloud.callContainer({ path: app.globalData.configs.container + '/news/topics/list' })
    if (topicResponse.data.Message === "Success") {
      // 保存话题列表
      this.setData({ topic: topicResponse.data.Data })
    } else {
      // 处理错误
      app.methods.handleError({ err: topicResponse, title: '获取话题列表失败', content: topicResponse.data.Message, reLaunch: false })
    }
    // 加载资讯列表
    const newsResponse = await wx.cloud.callContainer({ path: app.globalData.configs.container + '/news/news/' + this.data.currentTopic + '/list?limit=20' })
    if (newsResponse.data.Message === "Success") {
      if (newsResponse.data.Total > 0) {
        newsResponse.data.Data.length > 0 && require("../../utils/news").handleTimeString(newsResponse.data.Data); // 处理时间字符串
        this.setData({ news: newsResponse.data.Data, currentPage: 1, currentTotal: newsResponse.data.Total }) // 保存资讯列表
      } else {
        wx.showToast({ title: '该话题暂无资讯', icon: 'none' })
      }
    } else {
      // 处理错误
      app.methods.handleError({ err: newsResponse, title: '获取资讯列表失败', content: newsResponse.data.Message, reLaunch: false })
    }
    this.setData({ loading: false })
    wx.stopPullDownRefresh() // 停止下拉刷新，回弹页面
  },
  // 上拉刷新
  onReachBottom: async function () {
    if (this.data.news.length >= this.data.currentTotal) {
      wx.showToast({ title: '没有更多资讯啦', icon: 'none' })
      return
    }
    wx.showLoading({ title: '加载中...', mask: true }) // 弹出 Loading
    // 加载资讯列表
    const newsResponse = await wx.cloud.callContainer({ path: app.globalData.configs.container + '/news/news/' + this.data.currentTopic + '/list?limit=20&page=' + this.data.currentPage })
    if (newsResponse.data.Message === "Success") {
      wx.hideLoading() // 隐藏 loading
      if (newsResponse.data.Total > 0) {
        newsResponse.data.Data.length > 0 && require("../../utils/news").handleTimeString(newsResponse.data.Data); // 处理时间字符串
        this.setData({ news: this.data.news.concat(newsResponse.data.Data), currentPage: this.data.currentPage + 1, currentTotal: newsResponse.data.Total }) // 保存资讯列表
      } else {
        wx.showToast({ title: '该话题暂无资讯', icon: 'none' })
      }
    } else {
      wx.hideLoading() // 隐藏 loading
      // 处理错误
      app.methods.handleError({ err: newsResponse, title: '获取资讯列表失败', content: newsResponse.data.Message, reLaunch: false })
    }
  },

  // 分享给好友
  onShareAppMessage() {
    return {
      title: '"忻"鲜事 一起看',
      imageUrl: '/images/logo/share.png'
    }
  },
  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '"忻"鲜事 一起看',
    }
  },
});