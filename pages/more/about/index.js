var app = getApp();
Page({
  data: {
    version: app.globalData.configs.version,
    developmentEnvironment: app.globalData.configs.environment !== 'release',
    showLog: false
  },
  onLoad: function () {
    this.setData({ year: new Date().getFullYear() });
  },
  toggleLog: function () {
    this.setData({ showLog: !this.data.showLog });
  },
  
  // 分享给好友
  onShareAppMessage() {
    return {
      title: "掌上忻师简介",
      imageUrl: '/images/logo/share.png'
    }
  },
  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: "掌上忻师简介"
    }
  },
});