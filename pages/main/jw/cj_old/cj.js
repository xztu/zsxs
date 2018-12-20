var app = getApp();
Page({
  data: {
    xq: null,
    xm: null,
    xh: null,
    cj: null,
    loadHidden: false,
    modalHidden: true,
  },
  onShow:function(){
    // 页面显示
    var that = this;
    wx.request({
      url: app.server+"WeAPP_Jw_CJ.php",
      data: {
        openID: app.globalData.openID,
        usertype: app.globalData.usertype,
        nickname: app.globalData.userInfo.nickName,
        appver: app.appver,
        device: app.globalData.deviceInfo.model,
        vxversion: app.globalData.deviceInfo.version
      },
      method: 'POST',
      header: {"Content-Type":"application/x-www-form-urlencoded"},
      success: function(res){
        if(res.data == "FALSE"){
          that.setData({
            loadHidden: true,
            modalHidden: false,
          });
        }else{
          that.setData({
            xq: res.data.xq,
            xm: res.data.xm,
            xh: res.data.xh,
            cj: res.data.cj,
            loadHidden: true
          });
        }
      },
      fail: function() {
        return "fail";
      }
    });
  },
  // 关闭--模态弹窗
  cancelChange: function() {
    this.setData({ modalHidden: true });
    wx.navigateBack({
      delta: 1
    });
  },
  // 确认--模态弹窗
  confirmChange: function() {
    this.setData({ modalHidden: true });
    wx.navigateTo({
      url: '/pages/my/register/register'
    });
  },
  onShareAppMessage: function () {
    return {
      title: app.globalData.shareTitle.cj,
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