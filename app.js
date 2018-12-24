//app.js
App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    //var logs = wx.getStorageSync('logs') || []
    //logs.unshift(Date.now())
    //wx.setStorageSync('logs', logs);
    var that = this;
    //调用登录接口
    wx.login({
      success: function(res) {
        if (res.code) {
          //把login的code暂存在全局数据openID中
          that.globalData.openID = res.code
          //获取设备信息
          wx.getSystemInfo({
            success: function(res) {
              that.globalData.deviceInfo.model = res.model + '(' + res.platform + ' - ' + res.windowWidth + 'x' + res.windowHeight + ' - ' + res.language + ')';
              that.globalData.deviceInfo.version = res.version;
            }
          });
        } else {
          that.globalData.loginFail = true
        }
      },
      fail: function() {
        that.globalData.loginFail = true
      }
    });
  },
  getUserInfo: function(cb) {
    var that = this
    if (that.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    }
    /* else {
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
        }*/
  },
  strlen: function(str) { //字符串长度计算函数
    var len = 0;
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i);
      //单字节加1 
      if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
        len++;
      } else {
        len += 2;
      }
    }
    return len;
  },
  formatTime: function(date, t) { //格式化时间
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    if (t === 'h:m') {
      return [hour, minute].map(formatNumber).join(':');
    } else {
      return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
    }
    function formatNumber(n) {
      n = n.toString();
      return n[1] ? n : '0' + n;
    }
  },
  globalData: {
    deviceInfo: [],
    userInfo: null,
    openID: false,
    user: 'unknow',
    usertype: null,
    shareTitle: {
      "public": "忻师人自己的小程序来啦，快试试吧！",
      "kcmm": "这里查课程密码超方便，快试试吧！"
    }
  },
  server: "https://api.rebeta.cn/", //"http://lqcx.xzsyzjc.cn/api/",//
  appver: "0.4.3 OBT"
})