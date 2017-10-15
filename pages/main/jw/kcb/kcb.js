var app = getApp();
Page({
  data: {
    xq: null,
    xm: null,
    xh: null,
    kcb: null,
    loadHidden: true,
    modalHidden: true
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
  getData: function (xqj) {
    var that = this;
    that.setData({
      loadHidden: false,
    });
    wx.request({
      url: app.server + "WeAPP_Jw_KCB.php",
      data: {
        openID: app.globalData.openID,
        xqj: xqj,
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
            loadHidden: true,
            modalHidden: false,
          });
        } else {
          that.setData({
            xq: res.data.xq,
            xm: res.data.xm,
            xh: res.data.xh,
            cj: res.data.cj,
            kcb: res.data.kcb,
            loadHidden: true
          });
        }
      },
      fail: function () {
        return "fail";
      }
    });
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
  // 关闭--模态弹窗
  cancelChange: function () {
    this.setData({ modalHidden: true });
    wx.navigateBack({
      delta: 1
    });
  },
  // 确认--模态弹窗（二次验证是否进行统一认证，已经发生冗余，可以移除）
  confirmChange: function () {
    this.setData({ modalHidden: true });
    wx.navigateTo({
      url: '/pages/my/register/register'
    });
  },
  onShareAppMessage: function () {
    return {
      title: app.globalData.shareTitle.kcb,
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