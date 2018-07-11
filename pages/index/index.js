//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    server: app.server,
    userInfo: {},
    buttonText: "登录中...",
    buttonLoading: true,
    WaitData: 0
  },
  onShow: function () {
    var that = this
    //调用应用实例的方法获取全局数据（用户信息）
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      });
    });
    that.getOpenID();
  },
  //事件处理函数
  bindViewTap: function () {
    var that = this
    if (app.globalData.loginFail) {
      //获取用户信息
      app.getUserInfo(function (userInfo) {
        that.setData({
          userInfo: userInfo
        });
      });
      //提示需要授权
      that.notAuth();
      return;
    } else if (that.data.buttonLoading) {
      //获取openid
      that.getOpenID();
      //提示网络连接失败
      that.connectFail();
      return;
    } else {
      wx.switchTab({
        url: '../main/main'
      });
    }
  },
  notAuth: function () {
    var that = this
    app.getUserInfo();
    wx.showModal({
      title: '请设置允许授权！',
      content: '拒绝授权将无法关联账号并影响使用。请打开设置窗口，选择允许使用用户信息。（仅获取昵称、头像等公开信息）',
      showCancel: true,
      confirmText: '去设置',
      success: function (res) {
        if (res.confirm) {
          wx.openSetting({
            success: (res) => {
              /*
               * res.authSetting = {
               *   "scope.userInfo": true,
               *   "scope.userLocation": true
               * }
               */
            }
          })
        }
      }
    });
    that.setData({
      buttonText: "重 新 获 取 授 权",
      buttonLoading: false
    });
  },
  connectFail: function () {
    var that = this
    wx.showModal({
      title: '请稍候！',
      content: '正在登陆，请稍等片刻。',
      showCancel: false,
      confirmText: '我知道了',
    });
  },
  getOpenID: function () {
    var that = this
    //递归调用，在登陆完成前不断进行登陆尝试
    setTimeout(function () {
      if (that.data.buttonLoading) {
        if (app.globalData.loginFail) {
          that.notAuth();
          return;
        }
        that.getOpenID();
      } else {
        return;
      }
    }, 800);
    that.setData({
      buttonText: "登录中...",
      buttonLoading: true
    });
    if (that.data.WaitData < 3){
      try {
        //登陆
        //没有取到login的code则不增加请求次数计数器
        if (app.globalData.openID){
          that.setData({ WaitData: that.data.WaitData + 1 });
        }
        wx.request({
          url: app.server + "WeAPP_login.php",
          data: {
            code: app.globalData.openID,
            nickname: app.globalData.userInfo.nickName,
            appver: app.appver,
            device: app.globalData.deviceInfo.model,
            vxversion: app.globalData.deviceInfo.version
          },
          method: 'POST',
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          success: function (res) {
            //检查是否有返回数据，及返回的数据是否正确
            if (res.data != 'fail' & res.data != '') {
              app.globalData.openID = res.data.openid
              app.globalData.user = res.data.user
              app.globalData.usertype = res.data.type
              that.setData({
                buttonText: "开 始 使 用",
                buttonLoading: false
              });
            }
            //检查是否取回数据，结束递归
            if (app.globalData.user != 'unknow') {
              that.setData({
                buttonText: "开 始 使 用",
                buttonLoading: false
              });
            }
            //登陆失败，不做操作，globalData.openID依旧为false
          },
          fail: function () {
            return;
          }
        });
      } catch (e) {
        //捕捉错误提示（在wx.login登陆异步执行结束前app.globalData.userInfo.nickName变量为null）并丢弃
        //console.log('错误：'+e)
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