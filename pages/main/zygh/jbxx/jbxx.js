// pages/study/zygh/jbxx/jbxx.js
var app = getApp();
Page({
  data: {
    jkzkRange: ['请选择', '健康', '一般', '较差'],
    jkzk: 0,
    zzmmRange: ['请选择', '中共党员', '中共预备党员', '共青团员', '民革党员', '民盟盟员', '民建会员', '民进会员', '农工党党员', '致公党党员', '九三学社社员', '台盟盟员', '无党派民主人士', '普通公民'],
    zzmm: 0,
    mzRange: ['请选择', '汉族', '蒙古族', '回族', '藏族', '维吾尔族', '苗族', '彝族', '壮族', '布依族', '朝鲜族', '满族', '侗族', '瑶族', '白族', '土家族', '哈尼族', '哈萨克族', '傣族', '黎族', '傈傈族', '佤族', '畲族', '高山族', '拉祜族', '水族', '东乡族', '纳西族', '景颇族', '柯尔族', '土族', '达斡尔族', '仫佬族', '羌族', '布朗族', '撒拉族', '毛难族', '仡佬族', '锡伯族', '阿昌族', '普米族', '塔吉克族', '怒族', '乌孜别克族', '俄罗斯族', '鄂温克族', '崩龙族', '保安族', '裕固族', '京族', '塔塔尔族', '独龙族', '鄂伦春族', '赫哲族', '门巴族', '珞巴族', '基诺族', '其他', '外国血统中国籍人士'],
    mz: 0,
    sfyjz: '无',
    jtzyjjlyRange: ['请选择', '工资', '经商', '务农', '社会资助', '政府资助'],
    jtzyjjly: 0,
    resData: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    wx.request({
      url: app.server + "WeAPP_Zygh_Jbxx.php",
      data: {
        openID: app.globalData.openID,
        flag: "Check",
        username: app.globalData.userInfo.nickName,
        usertype: app.usertype,
        appver: app.appver,
        device: app.globalData.deviceInfo.model,
        vxversion: app.globalData.deviceInfo.version
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        that.setData({
          resData: res.data,
          sfyjz: res.data.sfyjzText,
          jkzk: res.data.jkzk,
          zzmm: res.data.zzmm,
          mz: res.data.mz,
          jtzyjjly: res.data.jtzyjjly
        });
      },
      fail: function () {
        return "fail";
      }
    });
  },
  jkzk: function (e) {
    this.setData({
      jkzk: e.detail.value
    });
  },
  zzmm: function (e) {
    this.setData({
      zzmm: e.detail.value
    });
  },
  mz: function (e) {
    this.setData({
      mz: e.detail.value
    });
  },
  jtzyjjly: function (e) {
    this.setData({
      jtzyjjly: e.detail.value
    });
  },
  sfyjz: function (e) {
    if (e.detail.value == true) {
      this.setData({
        sfyjz: '有'
      });
    } else {
      this.setData({
        sfyjz: '无'
      });
    }
  },
  formSubmit: function (e) {
    var that = this;
    wx.request({
      url: app.server + "WeAPP_Zygh_Jbxx.php",
      data: {
        openID: app.globalData.openID,
        flag: "Submit",
        jkzk: that.data.jkzkRange[e.detail.value.jkzk],
        zzmm: that.data.zzmmRange[e.detail.value.zzmm],
        mz: that.data.mzRange[e.detail.value.mz],
        sfyjz: e.detail.value.sfyjz,
        email: e.detail.value.email,
        qq: e.detail.value.qq,
        brdh: e.detail.value.brdh,
        jtdz: e.detail.value.jtdz,
        yzbm: e.detail.value.yzbm,
        jtzyjjly: that.data.jtzyjjlyRange[e.detail.value.jtzyjjly],
        tc: e.detail.value.tc,
        xqah: e.detail.value.xqah,
        fdyxm: e.detail.value.fdyxm,
        fdydh: e.detail.value.fdydh,
        shsj: e.detail.value.shsj,
        jcqk: e.detail.value.jcqk,
        username: app.globalData.userInfo.nickName,
        usertype: app.usertype,
        appver: app.appver,
        device: app.globalData.deviceInfo.model,
        vxversion: app.globalData.deviceInfo.version
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.data.tips != "") {
          wx.showModal({
            title: '保存失败',
            content: res.data.tips,
            showCancel: false,
          });
        } else {
          wx.showModal({
            title: '保存成功',
            content: '您可以再次打开本页面对已经保存的内容进行修改。',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          });
        }
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: "与服务器创建连接失败!",
          showCancel: false,
        });
      }
    });
  },
  onShareAppMessage: function () {
    return {
      title: app.globalData.shareTitle.public,
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