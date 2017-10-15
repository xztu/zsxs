// pages/study/zygh/jtcy/jtcy.js
var app = getApp();
Page({
  data: {
    server: app.server,
    total: null,
    onSubmit: false,
    loadHidden: false,
    resData: [],
    hiddenEdit: true,
    relationRange: ['请选择', '父亲', '母亲', '姐姐', '哥哥', '弟弟', '妹妹'],
    relation: 0,
    defaultValue: ""
  },
  onLoad: function (options) {
    var that = this
    wx.request({
      url: app.server + "WeAPP_Zygh_Jtcy.php",
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
  relationBind: function (e) {
    var that = this;
    that.setData({
      relation: e.detail.value
    });
  },
  formSubmit: function (e) {
    var that = this;
    that.setData({ onSubmit: true, loadHidden: false });
    wx.request({
      url: app.server + "WeAPP_Zygh_Jtcy.php",
      data: {
        openID: app.globalData.openID,
        flag: "Insert",
        name: e.detail.value.name,
        relation: that.data.relationRange[e.detail.value.relation],
        job: e.detail.value.job,
        postalcode: e.detail.value.postalcode,
        phone: e.detail.value.phone,
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
          relation: 0,
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
            url: app.server + "WeAPP_Zygh_Jtcy.php",
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
              console.log(res)
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