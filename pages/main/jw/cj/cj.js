var app = getApp();
Page({
  data: {
    server: app.server,
    help_status: false,
    tips: '加载中...',
    result: null,
    isShare: false
  },
  onLoad: function (options){
    var that = this;
    if (options.shareSession) {
      var session = options.shareSession;
      that.setData({
        isShare: true
      });
    } else {
      var session = app.globalData.openID;
    }
    wx.request({
      url: app.server+"WeAPP_Jw_CJ_NEW.php",
      data: {
        openID: app.globalData.openID,
        usertype: app.globalData.usertype,
        nickname: app.globalData.userInfo.nickName,
        appver: app.appver,
        device: app.globalData.deviceInfo.model,
        vxversion: app.globalData.deviceInfo.version,
        session: session
      },
      method: 'POST',
      header: {"Content-Type":"application/x-www-form-urlencoded"},
      success: function(res){
        that.setData({
          tips: res.data.tips,
          result: res.data.result
        });
        if (that.data.isShare) {
          wx.setNavigationBarTitle({
            title: res.data.result.XM + '的课程表'
          });
        }
      },
      fail: function() {
        that.setData({
          tips: '网络请求出错！'
        });
        return "fail";
      }
    });

    //功能提示
    wx.showModal({
      title: '提示',
      content: '点击右上角的分享按钮可以直接把自己的考试成绩分享给微信好友！快试一试吧！',
      showCancel: false
    });
  },
  showHelp: function (e) {
    this.setData({
      'help_status': true
    });
  },
  tapHelp: function(e){
    if(e.target.id == 'help'){
      this.hideHelp();
    }
  },
  hideHelp: function (e) {
    this.setData({
      'help_status': false
    });
  },
  onShareAppMessage: function () {
    return {
      title: this.data.result.XM + ' 的考试成绩',
      path: '/pages/index/index?session=' + app.globalData.openID + '&location=/pages/main/jw/cj/cj',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})