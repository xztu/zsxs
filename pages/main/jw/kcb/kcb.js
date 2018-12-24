// pages/main/jw/kcb_old/kcb.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    server: app.server,
    tips: '加载中...',
    _days: ['一', '二', '三', '四', '五', '六', '日'],
    _kb_card_top: ['0', '100', '208', '308', '416', '536', '644', '752', '852', '964', '1064'], //每节课课表卡片样式中的top数值
    _time: [ //课程时间与指针位置的映射，{begin:课程开始,end:结束时间,top:指针距开始top格数}
      { begin: '0:00', end: '7:59', beginTop: -4, endTop: -4 },
      { begin: '8:00', end: '9:30', beginTop: 0, endTop: 200 }, //第一二节课
      { begin: '9:31', end: '9:44', beginTop: 201, endTop: 207 },
      { begin: '9:45', end: '11:15', beginTop: 208, endTop: 408 }, //第三四节课
      { begin: '11:16', end: '11:24', beginTop: 409, endTop: 415 },
      { begin: '11:25', end: '12:10', beginTop: 416, endTop: 516 }, //第五节课
      { begin: '12:11', end: '14:29', beginTop: 517, endTop: 535 }, //*6
      { begin: '14:30', end: '15:15', beginTop: 536, endTop: 736 }, //第六节课*7
      { begin: '15:16', end: '16:14', beginTop: 735, endTop: 643 }, //*8
      { begin: '15:25', end: '16:10', beginTop: 644, endTop: 744 }, //第七节课*9
      { begin: '16:11', end: '16:19', beginTop: 745, endTop: 751 }, //*10
      { begin: '16:20', end: '17:50', beginTop: 752, endTop: 952 },//第八九节课*11
      { begin: '17:51', end: '19:29', beginTop: 953, endTop: 963 },//*12
      { begin: '19:30', end: '21:00', beginTop: 964, endTop: 1164 },//第十到十一节课
      { begin: '21:01', end: '23:59', beginTop: 1165, endTop: 1166 },
    ],
    timelineTop: 0, //时间轴
    targetLessons: [],
    targetX: 0, //target x轴top距离
    targetY: 0, //target y轴left距离
    blur: false, //弹出层状态
    today: '',  //当前星期数
    lessons: [],  //课程data
    name: '', //用户姓名
    xn: '', //当前学年
    xq: '', //当前学期
    userType: '',   //用户类别
    isShare: false, //分享模式（打开别人分享的课表）
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.shareSession){
      that.get_kb(options.shareSession);
      that.setData({
        isShare: true
      });
    } else {
      that.get_kb(app.globalData.openID);
    }
    /*
    //取得打开分享页面获得的参数
    if(接收到的页面传参id！=空){
  id = 传参
  that.setData({
    teacher: 传参
  });
    } else
    if (app.globalData.usertype == "teacher") {
      that.setData({
        teacher: true
      });
    }*/
    
    //修正夏时制的时间
    var month = new Date().getMonth() + 1;//获取当前月份(0-11,0代表1月)
    if (month > 4 && month < 10) {
      that.data._time[6].end = "14:59";
      that.data._time[7].begin = "15:00";
      that.data._time[7].end = "15:45";
      that.data._time[8].begin = "15:46";
      that.data._time[8].end = "15:54";
      that.data._time[9].begin = "15:55";
      that.data._time[9].end = "16:40";
      that.data._time[10].begin = "16:41";
      that.data._time[10].end = "16:49";
      that.data._time[11].begin = "16:50";
      that.data._time[11].end = "18:20";
      that.data._time[12].begin = "18:21";
    }

    //功能提示
    wx.showModal({
      title: '提示',
      content: '点击右上角的分享按钮可以直接把自己的课程表分享给微信好友！快试一试吧！',
      showCancel: false
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    /*
    var _this = this;
    //查询其他人课表时显示
    if (_this.data.name) {
      wx.setNavigationBarTitle({
        title: _this.data.name + '的课表'
      });
    }*/
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    // 计算timeline时针位置
    function parseMinute(dateStr) { return dateStr.split(':')[0] * 60 + parseInt(dateStr.split(':')[1]); }
    function compareDate(dateStr1, dateStr2) {
      return parseMinute(dateStr1) <= parseMinute(dateStr2);
    }
    var nowTime = app.formatTime(new Date(), 'h:m'); 
    that.data._time.forEach(function (e, i) {
      if (compareDate(e.begin, nowTime) && compareDate(nowTime, e.end)) {
        that.setData({
          timelineTop: Math.round(e.beginTop + (e.endTop - e.beginTop) * (parseMinute(nowTime) - parseMinute(e.begin)) / 100)
        });
      };
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.name + ' 的课程表',
      path: '/pages/index/index?session=' + app.globalData.openID + '&location=/pages/main/jw/kcb/kcb',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  scrollXHandle: function (e) {
    // 鬼畜特效，为什么要加这个QAQ
    // this.setData({
    //   'scroll.left': e.detail.scrollLeft
    // });
  },

  showDetail: function (e) {
    // 点击课程卡片后执行
    //console.log(e.currentTarget.dataset)
    var that = this;
    that.setData({
      blur: true,
      targetX: (e.currentTarget.dataset.ckxx.XQJ - 1) * 130 + 35 + 8,
      targetY: (e.currentTarget.dataset.ckxx.DJJ - 1) * 100 + Math.floor((e.currentTarget.dataset.ckxx.DJJ - 1) / 2) * 8 + 60 + 8,
      targetLessons: e.currentTarget.dataset.ckxx
    });
  },

  hideDetail: function () {
    // 点击遮罩层时触发，取消主体部分的模糊，清空target
    this.setData({
      blur: false,
      targetLessons: [],
      targetX: 0,
      targetY: 0
    });
  },


  get_kb: function (session) {
    //数组去除指定值
    function removeByValue(array, val) {
      for (var i = 0, len = array.length; i < len; i++) {
        if (array[i] == val) { array.splice(i, 1); break; }
      }
      return array;
    }

    var that = this//, data = {
    //  openid: app._user.openid,
    //  id: id,
    //};

    //课表渲染that
    function kbRender(_data) {
      var colors = ['red', 'blue', 'purple', 'yellow'];
      var i, ilen, j, jlen;
      var colorsDic = {};
      var _lessons = _data;
      var _colors = colors.slice(0); //暂存一次都未用过的颜色

      // 循环课程
      for (var i in _lessons) {
        for (var j in _lessons[i]) {
          // 为课程上色
          if (!colorsDic[_lessons[i][j].KCMC]) { //如果该课还没有被上色
            var iColors = !_colors.length ? colors.slice(0) : _colors.slice(0); // 本课程可选颜色
            if (!_colors.length) { //未用过的颜色还没用过，就优先使用
              // 剔除掉其上边和左边的课程的可选颜色，如果i!==0则可剔除左边课程颜色，如果j!==0则可剔除上边课程颜色
              //左边
              var m, mlen;
              if (i != 1) {
                for (m = 1, mlen = _lessons[i - 1].length; m < mlen; m++) {
                  iColors = removeByValue(iColors, _lessons[i - 1][m].color);
                }
              }
              //上边
              if (j != 1 && _lessons[i][j - 1] && _lessons[i][j - 1].color) {
                for (m = 1, mlen = j - 1; m < mlen; m++) {
                  iColors = removeByValue(iColors, _lessons[i][m].color);
                }
              }
              // 如果k!==0则剔除之前所有课程的颜色
              if (j != 0) {
                for (m = 0; m < j; m++) {
                  iColors = removeByValue(iColors, _lessons[i][m].color);
                }
              }
              //如果为空，则重新补充可选颜色
              if (!iColors.length) { iColors = colors.slice(0); }
            }
            //剩余可选颜色随机/固定上色
            // var iColor = iColors[Math.floor(Math.random()*iColors.length)];
            var iColor = iColors[0];
            _lessons[i][j].color = iColor;
            colorsDic[_lessons[i][j].KCMC] = iColor;
            if (_colors.length) { _colors = removeByValue(_colors, iColor); }
          } else {
            //该课继续拥有之前所上的色
            _lessons[i][j].color = colorsDic[_lessons[i][j].KCMC];
          }
        }
      }
      var today = new Date().getDay();// parseInt(_data.day);  //0周日,1周一
      var lessons = _data.lessons;
      that.setData({
        today: today,
        lessons: _lessons,
      });
    }
    wx.showNavigationBarLoading();
    //获取课表
    wx.request({
      url: "https://api.rebeta.cn/WeAPP_Jw_KCB_NEW.php",
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      /*data: app.key(data),*/
      data: {
        openID: app.globalData.openID,
        usertype: app.globalData.usertype,
        nickname: app.globalData.userInfo.nickName,
        appver: app.appver,
        device: app.globalData.deviceInfo.model,
        vxversion: app.globalData.deviceInfo.version,
        session: session
      },
      success: function (res) {
        if (res.data) {
          var _data = res.data.result.lessons;
          if (_data) {
            kbRender(_data);
            that.setData({
              name: res.data.result.xm,
              xn: res.data.result.xn,
              xq: res.data.result.xq,
              userType: res.data.result.userType,
              tips: res.data.tips
            });
            if (that.data.isShare){
              wx.setNavigationBarTitle({
                title: that.data.name + '的课程表'
              });
            }
          } else { that.setData({ tips: '暂无数据'}); }
        } else {
          that.setData({
            thips: res.data.tips || '未知错误'
          });
        }
      },
      fail: function (res) {
        if (that.data.thips == '加载中') {
          that.setData({
            thips: '网络错误'
          });
        }
        console.warn('网络错误');
      },
      complete: function () {
        wx.hideNavigationBarLoading();
      }
    });
  },
})

/*
//kb.js
//获取应用实例

Page({
  //分享
  onShareAppMessage: function () {
    var name = this.data.name || app._user.we.info.name,
      id = this.data.id || app._user.we.info.id;
    return {
      title: name + '的课表',
      desc: 'We重邮 - 课表查询',
      path: '/pages/core/kb/kb?id=' + id + '&name=' + name
    };
  },
  //让分享时自动登录
  loginHandler: function (options) {
    var _this = this;
    _this.setData({
      'term': app._time.term,
      'teacher': app._user.teacher
    });
    // onLoad时获取一次课表
    var id = options.id || app._user.we.info.id;
    if (!id) {
      _this.setData({
        remind: '未绑定'
      });
      return false;
    }
    if (options.id && options.name) {
      _this.setData({
        name: options.name
      });
    }
    _this.get_kb(id);
  },
});*/