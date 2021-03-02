var app = getApp();
Page({
  data: {
    loading: true,
    role: "",
    username: "",
    realName: "",
    semesterInfo: {Year: "", Semester: ""},
    timetables: [],
  },
  onShow: function () {
    var week = String(new Date().getDay());
    if (week == "0") {
      week = "7";
    }
    this.updateBtnStatus(week);
  },
  xq: function (res) {
    var week = res.target.id;
    this.updateBtnStatus(week);
  },
  getData: async function (day) {
    this.setData({ loading: true })
    const response = await wx.cloud.callContainer({ path: app.globalData.configs.container + '/index/jw/timetable/week/' + day })
    if (response.data.Message === "Success") {
      this.setData({ loading: false, role: response.data.Data.Role, username: response.data.Data.Username, realName: response.data.Data.RealName, semesterInfo: response.data.Data.SemesterInfo, timetables: response.data.Data.Timetables[day] ? response.data.Data.Timetables[day] : [] })
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
  updateBtnStatus: function (k) {
    this.setData({
      xq1: this.getHoverd('1', k),
      xq2: this.getHoverd('2', k),
      xq3: this.getHoverd('3', k),
      xq4: this.getHoverd('4', k),
      xq5: this.getHoverd('5', k),
      xq6: this.getHoverd('6', k),
      xq7: this.getHoverd('7', k),
    });
    this.getData(k);
  },
  getHoverd: function (src, dest) {
    return (src === dest ? 'top-hoverd-btn' : '');
  },

  // 分享给好友
  onShareAppMessage() {
    return {
      title: this.data.realName + '的课程表',
      path: 'pages/index/jw/timetable/index?username=' + this.data.username,
      imageUrl: '/images/logo/share.png'
    }
  },
})