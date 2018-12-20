// pages/main/zshy/zshy.js
var app = getApp();
Page({
  data: {
    /*name: "姓名",
    title_info: null,*/
    page: null,
    result: null
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
    var that = this;
    that.updateBtnStatus("1");
    that.updatePage("1");
    var that = this;
    wx.request({
      url: app.server + "WeAPP_News.php",
      data: {
        flag: "load",
        openID: app.globalData.openID,
        usertype: app.globalData.usertype,
        nickname: app.globalData.userInfo.nickName,
        appver: app.appver,
        device: app.globalData.deviceInfo.model,
        vxversion: app.globalData.deviceInfo.version
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.data.tip != "") {
          wx.showModal({
            title: '提示',
            content: res.data.tip,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                });
              } else {
                //点击取消
              }
            }
          });
        }
      },
      fail: function () {
        return "fail";
      }
    });
    /*var Interval = setInterval(function () {
      that.load(Interval);
    }, 6000);
    that.load(Interval);*/
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
  menu: function (res) {
    var menu = res.target.id;
    this.updateBtnStatus(menu);
    this.updatePage(menu);
  },
  updateBtnStatus: function (menu) {
    this.setData({
      menu1: this.getHoverd('1', menu),
      menu2: this.getHoverd('2', menu),
      menu3: this.getHoverd('3', menu),
      menu4: this.getHoverd('4', menu),
    });
    //this.getData(menu);
  },
  updatePage: function (menu) {
    //更新页面
    var that = this;
    switch (menu) {
      case "1":
        that.setData({
          page: null,
        });
        break;
      case "2":
        that.setData({
          page: "ybd",
        });
        that.bjlb();
        break;
      case "3":
        that.setData({
          page: "wbd",
        });
        that.bjlb();
        break;
      case "4":
        that.setData({
          page: "bdgk",
        });
        wx.showLoading({
          title: '加载中',
          mask: true
        });
        wx.request({
          url: app.server + "WeAPP_News.php",
          data: {
            flag: "bdgk",
            openID: app.globalData.openID,
            usertype: app.globalData.usertype,
            nickname: app.globalData.userInfo.nickName,
            appver: app.appver,
            device: app.globalData.deviceInfo.model,
            vxversion: app.globalData.deviceInfo.version
          },
          method: 'POST',
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          success: function (res) {
            if (res.data.tip == "") {
              var bkgk_info = new Array()
              res.data.result.forEach(function (bdgk_res) {
                bkgk_info.push("班级：" + bdgk_res.class + " 已报到：" + bdgk_res.ybd + " 未报到：" + bdgk_res.wbd);
              });
              that.setData({
                bkgk_info: bkgk_info,
                page: "bdgk",
              });
            } else {
              wx.showModal({
                title: '提示',
                content: res.data.tip,
                showCancel: false,
                success: function (res) {
                }
              });
            }
          },
          fail: function () {
            return "fail";
          }
        });
        wx.hideLoading();
        break;
      default:
        break;
    }
  },
  getHoverd: function (src, dest) {
    return (src === dest ? 'top-hoverd-btn' : '');
  },
  sc: function () {
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ("barCode"),
      success: (res) => {
        var that = this;
        if (res.scanType == "CODE_128") {
          wx.showLoading({
            title: '加载中',
            mask: true
          });
          wx.request({
            url: app.server + "WeAPP_News.php",
            data: {
              flag: "bd",
              code: res.result,
              openID: app.globalData.openID,
              usertype: app.globalData.usertype,
              nickname: app.globalData.userInfo.nickName,
              appver: app.appver,
              device: app.globalData.deviceInfo.model,
              vxversion: app.globalData.deviceInfo.version
            },
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
              if (res.data.tip == "") {
                that.setData({
                  result: res.data.result,
                  page: "bd",
                });
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.data.tip,
                  showCancel: false,
                  success: function (res) {
                  }
                });
              }
            },
            fail: function () {
              return "fail";
            }
          });
          wx.hideLoading();
        } else {
          wx.showModal({
            title: '扫描失败',
            content: '条形码类型不正确！',
            showCancel: false,
          });
        }
      },
      fail: function () {
        wx.showModal({
          title: '扫描失败',
          content: '请尝试重新扫描！',
          showCancel: false,
        });
      }
    })
  },
  pass: function (res) {
    var code = res.target.id;
    var that = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    wx.request({
      url: app.server + "WeAPP_News.php",
      data: {
        flag: "pass",
        code: code,
        openID: app.globalData.openID,
        usertype: app.globalData.usertype,
        nickname: app.globalData.userInfo.nickName,
        appver: app.appver,
        device: app.globalData.deviceInfo.model,
        vxversion: app.globalData.deviceInfo.version
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.data.result != null) {
          that.setData({
            result: res.data.result,
            page: "bd",
          });
        }
        wx.showModal({
          title: '提示',
          content: res.data.tip,
          showCancel: false,
          success: function (res) {
          }
        });
        wx.hideLoading();
      },
      fail: function () {
        return "fail";
      }
    });
    
  },
  review: function (res) {
    var code = res.target.id;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认提交复审？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '请稍候...',
            mask: true
          });
          wx.request({
            url: app.server + "WeAPP_News.php",
            data: {
              flag: "review",
              code: code,
              openID: app.globalData.openID,
              usertype: app.globalData.usertype,
              nickname: app.globalData.userInfo.nickName,
              appver: app.appver,
              device: app.globalData.deviceInfo.model,
              vxversion: app.globalData.deviceInfo.version
            },
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
              wx.showModal({
                title: '提示',
                content: res.data.tip,
                showCancel: false
              });
              wx.hideLoading();
            },
            fail: function () {
              return "fail";
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },
  bjlb: function () {
    var that = this;
    wx.showLoading({
      title: '请稍候...',
      mask: true
    });
    wx.request({
      url: app.server + "WeAPP_News.php",
      data: {
        flag: "bjlb",
        openID: app.globalData.openID,
        usertype: app.globalData.usertype,
        nickname: app.globalData.userInfo.nickName,
        appver: app.appver,
        device: app.globalData.deviceInfo.model,
        vxversion: app.globalData.deviceInfo.version
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.data.tip == "") {
          that.setData({
            bjlb: res.data.result,
          });
          /*var bkgk_info = new Array()
          res.data.result.forEach(function (bdgk_res) {
            bkgk_info.push("班级：" + bdgk_res.class + " 已报到：" + bdgk_res.ybd + " 未报到：" + bdgk_res.wbd);
          });
          */
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.tip,
            showCancel: false,
            success: function (res) {
            }
          });
        }
        wx.hideLoading();
      },
      fail: function () {
        return "fail";
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