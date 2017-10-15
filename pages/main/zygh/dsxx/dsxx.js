// pages/study/zygh/jtcy/jtcy.js
var app = getApp();
Page({
  data: {
    server: app.server,
    onSubmit: false,
    loadHidden: false,
    resData: [],
    editBtn: null,
    hiddenEdit: true,
    tutorTypeRange: ['请选择', '带课教师', '辅导员', '学长', '学姐'],
    tutorType: 0,
    defaultValue: ""
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.server + "WeAPP_Zygh_Dsxx.php",
      data: {
        openID: app.globalData.openID,
        flag: "Check",
        username: app.globalData.userInfo.nickName,
        usertype: app.usertype,
        appver: app.appver,
        device: app.globalData.deviceInfo.model,
        vxversion: app.globalData.deviceInfo.version
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.data.tips != "") {
          wx.showModal({
            title: '提示',
            content: res.data.tips,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          });
        } else {
          that.setData({
            resData: res.data.result,
            editBtn: res.data.editBtn,
            term: res.data.term,
            loadHidden: true
          });
        }
      },
      fail: function () {
        return "fail";
      }
    });
  },
  edit: function () {
    var that = this;
    that.setData({
      hiddenEdit: false
    });
  },
  tutorTypeBind: function (e) {
    var that = this;
    that.setData({
      tutorType: e.detail.value
    });
  },
  formSubmit: function (e) {
    var that = this;
    that.setData({ onSubmit: true, loadHidden: false });
    wx.request({
      url: app.server + "WeAPP_Zygh_Dsxx.php",
      data: {
        openID: app.globalData.openID,
        flag: "Submit",
        xm: e.detail.value.xm,
        tutorType: that.data.tutorTypeRange[e.detail.value.tutorType],
        username: app.globalData.userInfo.nickName,
        usertype: app.usertype,
        appver: app.appver,
        device: app.globalData.deviceInfo.model,
        vxversion: app.globalData.deviceInfo.version
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.data.tips != "") {
          wx.showModal({
            title: '提交失败',
            content: res.data.tips,
            showCancel: false,
          });
        } else {
          that.setData({
            editBtn: res.data.editBtn,
            resData: res.data.result,
            term: res.data.term
          });
        }
        that.setData({
          onSubmit: false,
          loadHidden: true,
          defaultValue: "",
          tutorType: 0,
        });
      },
      fail: function () {
        return "fail";
      }
    });
    that.setData({
      hiddenEdit: true,
      onSubmit: false
    });
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