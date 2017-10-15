// pages/main/jyxx/jyxx.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jycs: null,
    fjgy: null,
    jy: null,
    fj: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    wx.showLoading({
      title: '玩命加载中...',
    })
    wx.request({
      url: app.server + "WeAPP_JYXX.php",
      data: {
        openID: app.globalData.openID,
        user: app.globalData.user,
        usertype: app.globalData.usertype,
        nickname: app.globalData.userInfo.nickName,
        appver: app.appver,
        device: app.globalData.deviceInfo.model,
        vxversion: app.globalData.deviceInfo.version
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        // console.log(res.data)
        if (res.data.tips == "SUCCESS"){
          that.setData({
            jycs: res.data.result[3],
            fjgy: res.data.result[5],
            jy: res.data.result[0],
            fj: res.data.result[2]
          });
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.tips,
            confirmText: '我知道了',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                });
              } else {
                //点击取消
              }
            }
          })
        }
        wx.hideLoading()
      },
      fail: function () {
        wx.hideLoading();
        return "fail";
      }
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
      title: app.globalData.shareTitle.cet,
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