//获取应用实例
var app = getApp()
Page({
  data: {
    server: app.server,
    idIsset: false,
    loadHidden: true,
    userInfo: {}
  },
  onLoad: function () {
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      });
    });
    /*
    wx.request({
      url: "http://lqcx.xzsyzjc.cn/api/wx_CreditNO.php",
      data: {
        "flag": "Check",
        "openid" : app.globalData.openid
      },
      method: 'POST',
      header: {"Content-Type":"application/x-www-form-urlencoded"},
      success: function(res){
        if(res.data != "CHECKFALSE"){
          that.setData({
            idIsset: true,
            loadHidden: true
          });
        }
      },
      fail: function() {
        that.setData({
          modalValue: "无法连接服务器",
        });
        return ;
      }
    });*/
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