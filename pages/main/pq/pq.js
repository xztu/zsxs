var app = getApp();
Page({
  data: {
    title: null,
    xh: null,
    lb: null,
    bynf: null,
    sfres: null,
    syszd: null,
    sfindex: null,
    pqres: null,
    pq: null,
    loadHidden: false
  },
  onLoad: function () {
    // 页面显示
    var that = this;
    wx.request({
      url: app.server + "WeAPP_PQ.php",
      data: {
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
        if (res.data == "FALSE") {
          that.setData({
            loadHidden: true
          });
          wx.showModal({
            title: '统一认证',
            content: '完成统一认证后才可以使用，是否立即前往绑定？',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/my/register/register'
                });
              } else if (res.cancel) {
                wx.navigateBack({
                  delta: 1
                });
              }
            }
          });
        } else if (res.data == "NotGraduate") {
          that.setData({
            loadHidden: true
          });
          wx.showModal({
            title: '统一认证',
            content: '毕业生信息库中不存在您的信息，暂时无法使用本功能！',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                });
              }
            }
          });
        } else {
          that.setData({
            title: res.data.title,
            xh: res.data.xh,
            lb: res.data.lb,
            bynf: res.data.bynf,
            sfres: res.data.sfres,
            syszd: res.data.syszd,
            pqres: res.data.pqinfo,
            loadHidden: true
          });
        }
      },
      fail: function () {
        return "fail";
      }
    });
  },
  SubmintSYSZD: function () {
    var that = this;
    if (that.data.sfindex == null) {
      wx.showModal({
        title: '提交失败',
        content: '请先填写内容后再进行提交!',
        showCancel: false,
      });
      return
    }
    that.setData({
      loadHidden: false
    });
    wx.request({
      url: app.server + "WeAPP_PQ.php",
      data: {
        syszd: that.data.sfres[that.data.sfindex].syszd,
        syszddm: that.data.sfres[that.data.sfindex].syszddm,
        subtype: "SYSZD",
        openID: app.globalData.openID,
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
        that.setData({
          loadHidden: true,
        });
        if (res.data != "SUCCESS") {
          wx.showModal({
            title: '提交失败',
            content: ' ' + res.data,
            showCancel: false,
          });
        } else {
          wx.showModal({
            title: '提交成功',
            content: '您的生源所在地信息已经保存成功！',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '/pages/main/pq/pq'
                });
              }
            }
          });
        }
      },
      fail: function () {
        return "fail";
      }
    });
  },
  PQBL: function () {
    var that = this;
    that.setData({
      loadHidden: false,
    });
    wx.request({
      url: app.server + "WeAPP_PQ.php",
      data: {
        subtype: "PQ",
        openID: app.globalData.openID,
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
        that.setData({
          loadHidden: true,
        });
        if (res.data.state != "SUCCESS") {
          wx.showModal({
            title: '申请失败',
            content: ' ' + res.data.state,
            showCancel: false,
          });
        } else {
          that.setData({
            title: res.data.title,
            pqres: null,
            pq: res.data.pq,
            knslb: res.data.knslb,
            byqx: res.data.byqx
          });
          if (that.data.byqx){
            var e = new Object();
            e.detail = new Object();
            e.detail.value = that.data.byqx
            that.BYQXbindPickerChange(e)
          }
        }
      },
      fail: function () {
        return "fail";
      }
    });
  },
  bindPickerChange: function (e) {
    this.setData({
      sfindex: e.detail.value
    })
  },
  KNSLBbindPickerChange: function (e) {
    this.setData({
      knslb: e.detail.value
    })
  },
  BYQXbindPickerChange: function (e) {
    var that = this;
    that.setData({
      loadHidden: false,
      islock: false,
      isLastStep: false,
      byqx: e.detail.value
    });
    wx.request({
      url: app.server + "WeAPP_PQ.php",
      data: {
        byqx: that.data.pq.byqx_list[that.data.byqx].dm,
        subtype: "PQ_BYQX",
        openID: app.globalData.openID,
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
        that.setData({
          loadHidden: true,
        });
        if (res.data.state != "SUCCESS") {
          wx.showModal({
            title: '申请失败',
            content: ' ' + res.data.state,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '/pages/main/pq/pq'
                });
              }
            }
          });
        } else {
          that.setData({
            dwxz: null,
            dwxz_list: res.data.dwxz_list,
            dwxz: res.data.dwxz
          });
          if (that.data.dwxz != null) {
            var e = new Object();
            e.detail = new Object();
            e.detail.value = that.data.dwxz
            that.DWLXbindPickerChange(e)
          }
        }
      },
      fail: function () {
        return "fail";
      }
    });
  },
  DWLXbindPickerChange: function (e) {
    var that = this;
    that.setData({
      dwxz: e.detail.value,
      islock: false,
      isLastStep: false,
    });
    if (that.data.pq.byqx_list[that.data.byqx].byqx == '回生源地') {
      that.setData({
        islock: true
      });
      wx.request({
        url: app.server + "WeAPP_PQ.php",
        data: {
          byqx: that.data.pq.byqx_list[that.data.byqx].dm,
          subtype: "PQ_DWXX_AUTO",
          openID: app.globalData.openID,
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
          if (res.data.state != "SUCCESS") {
            wx.showModal({
              title: '申请失败',
              content: ' ' + res.data.state,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: '/pages/main/pq/pq'
                  });
                }
              }
            });
          } else {
            that.setData({
              dwxx: res.data.dwxx
            });
          }
        },
        fail: function () {
          return "fail";
        }
      });
    } else {
      wx.request({
        url: app.server + "WeAPP_PQ.php",
        data: {
          byqx: that.data.pq.byqx_list[that.data.byqx].dm,
          subtype: "PQ_DWXX",
          openID: app.globalData.openID,
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
          if (res.data.state != "SUCCESS") {
            wx.showModal({
              title: '申请失败',
              content: ' ' + res.data.state,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: '/pages/main/pq/pq'
                  });
                }
              }
            });
          } else {
            that.setData({
              dwxx: res.data.dwxx
            });
          }
        },
        fail: function () {
          return "fail";
        }
      });
      wx.request({
        url: app.server + "WeAPP_PQ.php",
        data: {
          subtype: "DAJSDZ_S",
          openID: app.globalData.openID,
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
          that.setData({
            loadHidden: true,
          });
          if (res.data.state != "SUCCESS") {
            wx.showModal({
              title: '申请失败',
              content: ' ' + res.data.state,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: '/pages/main/pq/pq'
                  });
                }
              }
            });
          } else {
            that.setData({
              dajsdz_s_list: res.data.dajsdz_s_list,
              dajsdz_s: res.data.dajsdz_s
            });
            if (that.data.dajsdz_s != null) {
              var e = new Object();
              e.detail = new Object();
              e.detail.value = that.data.dajsdz_s
              that.DAJSDZSbindPickerChange(e)
            }
          }
        },
        fail: function () {
          return "fail";
        }
      });
    }
    that.setData({
      loadHidden: true,
      isLastStep: true
    });
  },
  DAJSDZSbindPickerChange: function (e) {
    var that = this;
    this.setData({
      loadHidden: false,
      dajsdz_s: e.detail.value,
      'dwxx.dwszd' : null
    })
    wx.request({
      url: app.server + "WeAPP_PQ.php",
      data: {
        sfdm: that.data.dajsdz_s_list[that.data.dajsdz_s].sfdm,
        subtype: "DAJSDZ",
        openID: app.globalData.openID,
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
        that.setData({
          loadHidden: true,
        });
        if (res.data.state != "SUCCESS") {
          wx.showModal({
            title: '申请失败',
            content: ' ' + res.data.state,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '/pages/main/pq/pq'
                });
              }
            }
          });
        } else {
          that.setData({
            dajsdz: res.data.dajsdz,
            dajsdz_list: res.data.dajsdz_list
          });
          if (res.data.dajsdz != null){
            that.setData({
              'dwxx.dwszd': that.data.dajsdz_list[res.data.dajsdz].syszd
            })
          }
        }
      },
      fail: function () {
        return "fail";
      }
    });
  },
  DAJSDZbindPickerChange: function (e) {
    var that = this;
    this.setData({
      dajsdz: e.detail.value,
      'dwxx.dwszd': that.data.dajsdz_list[e.detail.value].syszd
    })
  },
  SQPQ: function () {
    var that = this;
    that.setData({
      loadHidden: false,
    });
    wx.request({
      url: app.server + "WeAPP_PQ.php",
      data: {
        knslb: that.data.knslb,
        byqx: that.data.pq.byqx_list[that.data.byqx].dm,
        dwmm: that.data.dwxx.dwmm,
        dwszd: that.data.dwxx.dwszd,
        dwxz: that.data.dwxz_list[that.data.dwxz].DM,
        dajsdz: that.data.dwxx.dwdz,
        dwyb: that.data.dwxx.dwyb,
        dajsr: that.data.dwxx.dajsr,
        dajsrdh: that.data.dwxx.dwmmlxdh,
        subtype: "SQPQ",
        openID: app.globalData.openID,
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
        that.setData({
          loadHidden: true,
        });
        if (res.data.state != "SUCCESS") {
          wx.showModal({
            title: '申请失败',
            content: ' ' + res.data.state,
            showCancel: false,
          });
        } else {
          wx.showModal({
            title: '申请成功',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '/pages/main/pq/pq'
                });
              }
            }
          });
        }
      },
      fail: function () {
        return "fail";
      }
    });
  },
  dwmmInput: function (e) {
    this.setData({
      'dwxx.dwmm': e.detail.value
    })
  },
  dajsdzInput: function (e) {
    this.setData({
      'dwxx.dwdz': e.detail.value
    })
  },
  dwybInput: function (e) {
    this.setData({
      'dwxx.dwyb': e.detail.value
    })
  },
 dajsrInput: function (e) {
    this.setData({
      'dwxx.dajsr': e.detail.value
    })
  },
  dwmmlxdhInput: function (e) {
    this.setData({
      'dwxx.dwmmlxdh': e.detail.value
    })
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