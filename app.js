//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    //var logs = wx.getStorageSync('logs') || []
    //logs.unshift(Date.now())
    //wx.setStorageSync('logs', logs);
  },
  getUserInfo: function (cb) {
    var that = this
    if (that.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (res) {
          if (res.code) {
            that.globalData.openID = res.code
            //获取基本信息
            wx.getUserInfo({
              success: function (res) {
                that.globalData.userInfo = res.userInfo
                typeof cb == "function" && cb(that.globalData.userInfo)
                that.globalData.loginFail = false
              },
              fail: function () {
                that.globalData.loginFail = true
              }
            });
            //获取设备信息
            wx.getSystemInfo({
              success: function (res) {
                that.globalData.deviceInfo.model = res.model + '(' + res.platform + ' - ' + res.windowWidth + 'x' + res.windowHeight + ' - ' + res.language + ')';
                that.globalData.deviceInfo.version = res.version;
              }
            });
          } else {
            that.globalData.loginFail = true
          }
        },
        fail: function () {
          that.globalData.loginFail = true
        }
      });
    }
  },
  strlen: function (str) { //字符串长度计算函数
    var len = 0;
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i);
      //单字节加1 
      if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
        len++;
      }
      else {
        len += 2;
      }
    }
    return len;
  },
  globalData: {
    deviceInfo: [],
    userInfo: null,
    openID: false,
    user: 'unknow',
    usertype: null,
    shareTitle: { "public": "忻师人自己的小程序来啦，快试试吧！", "kcb": "这里查课程表超方便，快试试吧！", "cj": "这里查期末成绩超方便，快试试吧！", "kcmm":"这里查课程密码超方便，快试试吧！", "cet":"这里查四六级成绩超方便，快试试吧！"}
  },
  server: "接口服务器地址",
  appver: "0.3.5 Beta"
})