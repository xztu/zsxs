// app.js
App({
  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: this.globalData.configs.cloudEnvironment,
        traceUser: true,
      })
    }
  },
  globalData: {
    shareTitle: {
      basic: "全新改版！来看看吧～"
    },
    configs: {
      ...require("./config")
    }
  },
  methods: {
    /**
     * 处理错误
     * @param {Object} err 错误内容
     * @param {String} [ title = "出错啦" ] 标题
     * @param {String} [ content = "请您稍候再试～" ] 提示语
     * @param {String} [ confirmText = "我知道了" ] 确认按钮文字
     * @param {Boolean} [ reLaunch = false ] 是否重启
     */
    handleError({ err, title = "出错啦", content = "请您稍候再试～", confirmText = "我知道了", reLaunch = false } = {}) {
      // 打印错误到控制台
      console.error(err)
      // 震动反馈
      wx.vibrateLong()
      // 弹出弹窗
      wx.showModal({
        title: title,
        content: content,
        confirmText: confirmText,
        showCancel: false,
        success() { if (reLaunch) { wx.reLaunch({ url: '/pages/index/index' }) } }
      })
    },
  }
})
