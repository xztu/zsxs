// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    loading: true, // 是否加载中
    login: false, // 是否登陆
    role: "", // 用户角色
    semesterInfo: { Year: "", Semester: "" }, // 学年学期信息
    timetables: [], // 用户今日课表
    news: [], // 热点头条资讯
  },
  onShow: async function () {
    // 加载今日课表
    let day = String(new Date().getDay());
    if (day === 0) day = 7;
    const timetableResponse = await wx.cloud.callContainer({ path: app.globalData.configs.container + '/index/jw/timetable/week/' + day })
    if (timetableResponse.data.Message === "Success") {
      this.setData({ login: true, role: timetableResponse.data.Data.Role, semesterInfo: timetableResponse.data.Data.SemesterInfo,timetables: timetableResponse.data.Data.Timetables[day] })
    } else {
      this.setData({ login: false, role: "", timetables: [] }) // 清空登陆状态
    }
    // 加载资讯列表
    const newsResponse = await wx.cloud.callContainer({ path: app.globalData.configs.container + '/news/news/headlines/list' })
    if (newsResponse.data.Message === "Success") {
      if (newsResponse.data.Total > 0) {
        newsResponse.data.Data.length > 0 && require("../../utils/news").handleTimeString(newsResponse.data.Data); // 处理时间字符串
        this.setData({ news: newsResponse.data.Data }) // 保存资讯列表
      } else {
        this.setData({ news: [] }) // 清空资讯列表
      }
    } else {
      this.setData({ news: [] }) // 清空资讯列表
    }
    // 加载完成
    this.setData({ loading: false })
  },
  
  // 分享给好友
  onShareAppMessage() {
    return {
      title: app.globalData.shareTitle.basic,
      path: '/pages/index/index',
      imageUrl: '/images/logo/share.png'
    }
  },
  // 分享到朋友圈
  onShareTimeline() {
    return {
      imageUrl: '/images/logo/share.png'
    }
  },
})
