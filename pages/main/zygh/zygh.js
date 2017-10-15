// pages/study/zygh/zygh.js
var app = getApp();
Page({
  data: {
    xq: null,
    xm: null,
    xh: null,
    cj: null,
    resData: [],
    nowResData: [],
    defaultValue: null,
    tipsText: null,
    server: app.server,
    loadHidden: false,
    hiddenEdit: true,
    modalHidden: true,
    modalHidden1: true,
    lxRange: ['请选择', '学习', '生活', '实践', '其他'],
    lx: 0
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
    wx.request({
      url: app.server + "WeAPP_Zygh_Index.php",
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
        if (res.data == "FALSE") {
          that.setData({
            loadHidden: true,
            modalHidden: false,
          });
        } else if (res.data == "NOTEXIST") {
          that.setData({
            loadHidden: true,
            modalHidden1: false,
          });
        } else {
          that.setData({
            resData: res.data.result,
            nowResData: res.data.nowResult,
            xq: res.data.xq,
            xm: res.data.xm,
            xh: res.data.xh,
            cj: res.data.cj,
            tipsText: res.data.tipsText,
            loadHidden: true,
          });
        }
      },
      fail: function () {
        return "fail";
      }
    });
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  formSubmit: function (e) {
    var that = this;
    that.setData({ onSubmit: true, loadHidden: false });
    wx.request({
      url: app.server + "WeAPP_Zygh_Index.php",
      data: {
        openID: app.globalData.openID,
        flag: "Submit",
        lx: that.data.lxRange[e.detail.value.lx],
        bt: e.detail.value.bt,
        nr: e.detail.value.nr,
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
            title: '添加失败',
            content: res.data.tips,
            showCancel: false,
          });
        } else {
          that.setData({
            resData: res.data.result,
            nowResData: res.data.nowResult
          });
        }
        that.setData({
          onSubmit: false,
          loadHidden: true,
          lx: 0,
          defaultValue: ""
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
  bindDelete: function (e) {
    var that = this
    wx.showModal({
      title: '警告',
      content: '删除后不可恢复，确认要进行删除？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.server + "WeAPP_Zygh_Index.php",
            data: {
              openID: app.globalData.openID,
              flag: "Delete",
              target: e.currentTarget.id,
              username: app.globalData.userInfo.nickName,
              usertype: app.usertype,
              appver: app.appver,
              device: app.globalData.deviceInfo.model,
              vxversion: app.globalData.deviceInfo.version
            },
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
              that.setData({
                resData: res.data.result,
                nowResData: res.data.nowResult
              });
            },
            fail: function () {
              return "fail";
            }
          });
        } else {
          return
        }
      }
    });
  },
  edit: function () {
    var that = this;
    that.setData({
      hiddenEdit: false
    });
  },
  lxBind: function (e) {
    var that = this;
    that.setData({
      lx: e.detail.value
    });
  },
  bindOpenList: function (e) {
    var index = !isNaN(e) ? e : parseInt(e.currentTarget.dataset.index),
      data = {};
    data['resData[' + index + '].display'] = !this.data.resData[index].display;
    this.setData(data);
  },
  nowBindOpenList: function (e) {
    var index = !isNaN(e) ? e : parseInt(e.currentTarget.dataset.index),
      data = {};
    data['nowResData[' + index + '].display'] = !this.data.nowResData[index].display;
    this.setData(data);
  },
  // 关闭--模态弹窗
  cancelChange: function () {
    this.setData({ modalHidden: true });
    wx.navigateBack({
      delta: 1
    });
  },
  // 确认--模态弹窗
  confirmChange: function () {
    this.setData({ modalHidden: true });
    wx.navigateTo({
      url: '/pages/my/SetCreditNo/SetCreditNo'
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