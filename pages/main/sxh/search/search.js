// pages/main/sxh/sxh.js
var app = getApp();
Page({
  data: {
    loadHidden: false,
    resData: [],
    page: 1,
    options: null,
    remind: "上拉加载更多"
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    that.setData({ options: options });
    that.getdata();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  onReachBottom: function () {
    var that = this;
    that.getdata();
  },
  getdata: function (options) {
    var that = this;
    if (that.data.remind != "上拉加载更多") {
      return;
    }
    that.setData({ loadHidden: false });
    wx.request({
      url: app.server + "WeAPP_Sxh.php",
      data: {
        openID: app.globalData.openID,
        flag: "Search",
        page: that.data.page,
        searchType: that.data.options.searchType,
        text: that.data.options.text,
        user: app.globalData.user,
        usertype: app.globalData.usertype,
        nickname: app.globalData.userInfo.nickName,
        appver: app.appver,
        device: app.globalData.deviceInfo.model,
        vxversion: app.globalData.deviceInfo.version
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.data.tip == "end") {
          that.setData({
            remind: "已经没有更多了"
          });
        } else if (res.data.tip == "less") {
          that.setData({
            remind: ""
          });
        }
        that.setData({
          loadHidden: true,
          resData: that.data.resData.concat(res.data.result),
        });
      },
      fail: function () {
        return "fail";
      }
    });
    that.data.page += 1;
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