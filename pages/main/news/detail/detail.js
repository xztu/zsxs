// pages/main/news/detail/detail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showBtn: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.request({
      url: app.server + "WeAPP_News.php",
      data: {
        openID: app.globalData.openID,
        flag: 'xsxx',
        code: options.id,
        user: app.globalData.user,
        usertype: app.globalData.usertype,
        nickname: app.globalData.userInfo.nickName,
        appver: app.appver,
        device: app.globalData.deviceInfo.model,
        vxversion: app.globalData.deviceInfo.version
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        if (res.data.tip == "") {
          that.setData({
            resData: res.data.result.info,
            showBtn: res.data.result.showBtn
          });
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.tip,
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                });
              } else {
                //点击取消
              }
            }
          });
        }
      },
      fail: function() {
        return "fail";
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: app.globalData.shareTitle.public,
      path: '/pages/index/index',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  call: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.id
    })
  },
  update: function(res) {
    var id = res.target.id;
    id = id.split("|");
    var that = this;
    if (id[1] == 'update_3') {
      var flag_zh = '放弃入学';
    } else if (id[1] == 'update_4') {
      var flag_zh = '延迟入学'
    } else {
      var flag_zh = '参军入伍'
    }
    wx.showModal({
      title: '提示',
      content: '确认提交该生状态为： ' + flag_zh + '？',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
            mask: true
          });
          wx.request({
            url: app.server + "WeAPP_News.php",
            data: {
              flag: id[1],
              code: id[0],
              openID: app.globalData.openID,
              usertype: app.globalData.usertype,
              nickname: app.globalData.userInfo.nickName,
              appver: app.appver,
              device: app.globalData.deviceInfo.model,
              vxversion: app.globalData.deviceInfo.version
            },
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
              wx.showModal({
                title: '提示',
                content: res.data.tip,
                showCancel: false
              });
              if (res.data.result == "diableBtn") {
                that.setData({
                  showBtn: false
                });
              }
            },
            fail: function() {
              return "fail";
            }
          });
          wx.hideLoading();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },
})