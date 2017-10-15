// pages/study/zygh/jtcy/jtcy.js
var app = getApp();
Page({
  data: {
    server: app.server,
    total: 0,
    onSubmit: false,
    loadHidden: false,
    resData: [],
    hiddenEdit: true,
    zhnhy: '2000-01-01',
    dhnhy: '2000-01-01',
    end: '2000-01-01',
    defaultValue: ""
  },
  onLoad: function (options) {
    var that = this;
    var date = new Date();
    that.setData({
      end: date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()
    });
    wx.request({
      url: app.server + "WeAPP_Zygh_Xxjl.php",
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
            total: res.data.num,
            resData: res.data.result,
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
  bindOpenList: function (e) {
    var index = !isNaN(e) ? e : parseInt(e.currentTarget.dataset.index),
      data = {};
    data['resData[' + index + '].display'] = !this.data.resData[index].display;
    this.setData(data);
  },
  zhnhyBind: function (e) {
    var that = this;
    that.setData({
      zhnhy: e.detail.value
    });
  },
  dhnhyBind: function (e) {
    var that = this;
    that.setData({
      dhnhy: e.detail.value
    });
  },
  formSubmit: function (e) {
    var that = this;
    that.setData({ onSubmit: true, loadHidden: false });
    wx.request({
      url: app.server + "WeAPP_Zygh_Xxjl.php",
      data: {
        openID: app.globalData.openID,
        flag: "Insert",
        zhnhy: e.detail.value.zhnhy,
        dhnhy: e.detail.value.dhnhy,
        byxx: e.detail.value.byxx,
        crzw: e.detail.value.crzw,
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
            total: res.data.num,
            resData: res.data.result,
          });
        }
        that.setData({
          onSubmit: false,
          loadHidden: true,
          defaultValue: "",
          zhnhy: that.data.start,
          dhnhy: that.data.start
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
            url: app.server + "WeAPP_Zygh_Xxjl.php",
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
                total: res.data.num,
                resData: res.data.result,
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