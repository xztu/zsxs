// pages/main/telephone_book/telephone_book.js
var app = getApp();
Page({
  data: {
    loadHidden: false,
    inputShowed: false,
    inputVal: "",
    resData: [],
    page: 1,
    remind: "上拉加载更多"
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    var that = this
    that.getdata();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  searchType: function (e) {
    this.setData({
      searchType: e.detail.value
    });
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
    var that = this;
    wx.navigateTo({
      url: 'search/search?searchType=' + e.currentTarget.id + '&text=' + that.data.inputVal
    });
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  onReachBottom: function () {
    var that = this;
    that.getdata();
  },
  getdata: function () {
    var that = this
    if (that.data.remind != "上拉加载更多") {
      return;
    }
    that.setData({ loadHidden: false });
    wx.request({
      url: app.server + "WeAPP_DHB.php",
      data: {
        openID: app.globalData.openID,
        flag: "Check",
        page: that.data.page,
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