// 资讯模块通用工具
module.exports = {
  // 处理时间字符串
  handleTimeString: news => {
    news.forEach((value, index) => {
      let date = new Date(value.Time);
      news[index].Time = date.getFullYear() + "-" + ((date.getMonth() + 1) + "").padStart(2, "0") + "-" + (date.getDate() + "").padStart(2, "0")
    })
  }
}