var app = getApp();
Page({
  data: {
    xn: null,
    xq: null,
    bkxn: null,
    bkxq: null,
    kc: null,
    bk: null,
    loadHidden: false,
    modalHidden: true,
    server: app.server
  },
  onShow:function(){
    // 页面显示
    var that = this;
    wx.request({
      url: app.server+"WeAPP_Jw_KCMM.php",
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
            xn: res.data.xn,
            xq: res.data.xq,
            bkxn: res.data.bkxn,
            bkxq: res.data.bkxq,
            kc: res.data.kc,
            bk: res.data.bk,
            loadHidden: true
          });
        }
      },
      fail: function() {
        return "fail";
      }
    });
  },
  bindOpenList: function (e) {
    var index = !isNaN(e) ? e : parseInt(e.currentTarget.dataset.index),
      data = {};
    data['kc[' + index + '].display'] = !this.data.kc[index].display;
    this.setData(data);
  },
  bindOpenList1: function (e) {
    var index = !isNaN(e) ? e : parseInt(e.currentTarget.dataset.index),
      data = {};
    data['bk[' + index + '].display'] = !this.data.bk[index].display;
    this.setData(data);
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
      title: app.globalData.shareTitle.kcmm,
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