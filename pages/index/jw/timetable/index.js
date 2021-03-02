// pages/main/jw/kcb_old/kcb.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    username: "",
    realName: "",
    semesterInfo: { Year: "", Semester: "" },
    timetables: [],

    _days: ['一', '二', '三', '四', '五', '六', '日'],
    _kb_card_top: ['0', '120', '248', '368', '496', '636', '764', '892', '1012', '1144', '1264'], //每节课课表卡片样式中的top数值
    _time: [ //课程时间与指针位置的映射，{begin:课程开始,end:结束时间,top:指针距开始top格数}
      { begin: '0:00', end: '7:59', beginTop: -4, endTop: -1 }, // 0
      { begin: '8:00', end: '9:30', beginTop: 0, endTop: 248 }, // 第一二节课 1
      { begin: '9:31', end: '9:44', beginTop: 249, endTop: 255 }, // 课间 2
      { begin: '9:45', end: '11:15', beginTop: 256, endTop: 496 }, // 第三四节课 3
      { begin: '11:16', end: '11:24', beginTop: 497, endTop: 503 }, // 课间 4
      { begin: '11:25', end: '12:10', beginTop: 504, endTop: 624 }, // 第五节课 5
      { begin: '12:11', end: '14:29', beginTop: 625, endTop: 635 }, // 课间 6
      { begin: '14:30', end: '15:15', beginTop: 636, endTop: 756 }, // 第六节课 7
      { begin: '15:16', end: '15:24', beginTop: 757, endTop: 763 }, // 课间 8
      { begin: '15:25', end: '16:10', beginTop: 764, endTop: 884 }, // 第七节课 9
      { begin: '16:11', end: '16:19', beginTop: 885, endTop: 891 }, // 课间 10
      { begin: '16:20', end: '17:50', beginTop: 892, endTop: 1132 }, // 第八九节课 11
      { begin: '17:51', end: '19:29', beginTop: 1133, endTop: 1143 }, // 课间 12
      { begin: '19:30', end: '21:00', beginTop: 1144, endTop: 1384 }, // 第十到十一节课 13
      { begin: '21:01', end: '23:59', beginTop: 1385, endTop: 1390 }, // 14
    ],
    timelineTop: 0, //时间轴
    targetLessons: [],
    targetX: 0, // target x轴top距离
    targetY: 0, // target y轴left距离
    blur: false, //弹出层状态
    today: '',  //当前星期数

    isShare: false, // 分享模式 ( 打开别人分享的课表 )
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //修正夏时制的时间
    const month = new Date().getMonth() + 1;//获取当前月份(0-11,0代表1月)
    if (month > 4 && month < 10) {
      this.data._time[6].end = "14:59";
      this.data._time[7].begin = "15:00";
      this.data._time[7].end = "15:45";
      this.data._time[8].begin = "15:46";
      this.data._time[8].end = "15:54";
      this.data._time[9].begin = "15:55";
      this.data._time[9].end = "16:40";
      this.data._time[10].begin = "16:41";
      this.data._time[10].end = "16:49";
      this.data._time[11].begin = "16:50";
      this.data._time[11].end = "18:20";
      this.data._time[12].begin = "18:21";
    }

    if (typeof options.username !== "undefined") {
      this.setData({ username: options.username, isShare: true })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    // 获取课表
    this.setData({ loading: true })
    const response = await wx.cloud.callContainer({ path: app.globalData.configs.container + '/index/jw/timetable/all' + (this.data.isShare ? '?username=' + this.data.username : '') })
    if (response.data.Message === "Success") {
      this.setData({ loading: false, username: response.data.Data.Username, realName: response.data.Data.RealName, semesterInfo: response.data.Data.SemesterInfo, timetables: response.data.Data.Timetables })
      // 生成课程表
      this.render(response.data.Data.Timetables);
      if (this.data.isShare) {
        wx.setNavigationBarTitle({ title: response.data.Data.RealName + '的课程表' });
      }
    } else {
      if (response.data.Message === "未登陆") {
        // 未登陆
        wx.showModal({
          title: '未登陆',
          content: '是否前往登陆？',
          cancelText: '回首页',
          confirmText: '去登陆',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({ url: '/pages/more/account/index' })
            } else if (res.cancel) {
              wx.switchTab({ url: '/pages/index/index' })
            }
          }
        })
      } else {
        // 其他提示, 重定向到首页
        app.methods.handleError({ err: response, title: '查询失败', content: response.data.Message, reLaunch: true })
      }
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {
    await this.onShow();
    wx.stopPullDownRefresh() // 停止向下滑动刷新，回弹页面
  },

  // 点击课程卡片后弹出课程详情
  showDetail: function (e) {
    this.setData({
      blur: true,
      targetX: (e.currentTarget.dataset.day - 1) * 130 + 35 + 8,
      targetY: (e.currentTarget.dataset.ckxx.Number - 1) * 120 + Math.floor((e.currentTarget.dataset.ckxx.Number - 1) / 2) * 8 + 60 + 8 + (e.currentTarget.dataset.ckxx.Number > 5 ? 12 : 0),
      targetLessons: { ...e.currentTarget.dataset.ckxx, Day: e.currentTarget.dataset.day }
    });
  },

  // 点击遮罩层时隐藏课程详情
  hideDetail: function () {
    this.setData({
      blur: false,
      targetLessons: [],
      targetX: 0,
      targetY: 0
    });
  },

  // 课表渲染
  render: function (timetables) {
    //数组去除指定值
    function removeByValue(array, val) {
      for (var i = 0, len = array.length; i < len; i++) {
        if (array[i] == val) { array.splice(i, 1); break; }
      }
      return array;
    }

    const colors = ['red', 'blue', 'purple', 'yellow'];
    let colorsDic = {};
    let _colors = colors.slice(0); //暂存一次都未用过的颜色

    // 填充满数组
    for (let i = 1; i <= 7; i += 1) {
      if (typeof timetables[i] === "undefined") {
        timetables[i] = []
      }
    }

    // 循环课程
    for (let i in timetables) {
      for (let j in timetables[i]) {
        // 为课程上色
        if (!colorsDic[timetables[i][j].Name]) { //如果该课还没有被上色
          var iColors = !_colors.length ? colors.slice(0) : _colors.slice(0); // 本课程可选颜色
          if (!_colors.length) {
            // 未用过的颜色还没用过，就优先使用
            // 剔除掉其上边和左边的课程的可选颜色，如果i!==0则可剔除左边课程颜色，如果j!==0则可剔除上边课程颜色
            // 左边
            let m, mlen;
            if (i != 1) {
              for (m = 1, mlen = timetables[i - 1].length; m < mlen; m++) {
                iColors = removeByValue(iColors, timetables[i - 1][m].color);
              }
            }
            // 上边
            if (j != 1 && timetables[i][j - 1] && timetables[i][j - 1].color) {
              for (m = 1, mlen = j - 1; m < mlen; m++) {
                iColors = removeByValue(iColors, timetables[i][m].color);
              }
            }
            // 如果k!==0则剔除之前所有课程的颜色
            if (j != 0) {
              for (m = 0; m < j; m++) {
                iColors = removeByValue(iColors, timetables[i][m].color);
              }
            }
            // 如果为空，则重新补充可选颜色
            if (!iColors.length) { iColors = colors.slice(0); }
          }
          // 剩余可选颜色随机 / 固定上色
          // var iColor = iColors[Math.floor(Math.random()*iColors.length)];
          let iColor = iColors[0];
          timetables[i][j].color = iColor;
          colorsDic[timetables[i][j].Name] = iColor;
          if (_colors.length) { _colors = removeByValue(_colors, iColor); }
        } else {
          //该课继续拥有之前所上的色
          timetables[i][j].color = colorsDic[timetables[i][j].Name];
        }
      }
    }
    // 保存课表数据
    this.setData({ today: new Date().getDay(), timetables });

    // 计算 timeline 时针位置
    const _this = this;
    function parseMinute(dateStr) { return dateStr.split(':')[0] * 60 + parseInt(dateStr.split(':')[1]); }
    function compareDate(dateStr1, dateStr2) { return parseMinute(dateStr1) <= parseMinute(dateStr2); }
    let nowTime = (new Date()).getHours() + ":" + (new Date()).getMinutes();
    _this.data._time.forEach(function (e, i) {
      if (compareDate(e.begin, nowTime) && compareDate(nowTime, e.end)) {
        _this.setData({
          timelineTop: Math.round(e.beginTop + (e.endTop - e.beginTop) * (parseMinute(nowTime) - parseMinute(e.begin)) / (i===0||i===14?240:(i===6?140:(i===12?100:(i===2?15:(i===10||i===8||i===4?10:(i===1||i===3||i===11||i===13?90:45))))))),
        });
      };
    });
  },

  // 分享给好友
  onShareAppMessage() {
    return {
      title: this.data.realName + '的课程表',
      path: 'pages/index/jw/timetable/index?username=' + this.data.username,
      imageUrl: '/images/logo/share.png'
    }
  },
  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: this.data.realName + '的课程表',
      query: 'username=' + this.data.username,
      imageUrl: '/images/logo/share.png'
    }
  },
})