const service = require("../../../service/service.js");
const config = require("../../../utils/config.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    size: 10,
    pagesAll: 1
  },
  collect(e) {
    let fromData = {
      spId: e.currentTarget.dataset.id
    }
    service.collect(fromData).then(res => {
      console.log(res)
    })
    let list = this.data.list
    let result = list.filter(item => {
      return item.spId != e.currentTarget.dataset.id
    })
    console.log(result)
    this.setData({
      list: result
    })
  },
  SignUpPsd: function(e) {
    wx.navigateTo({
      url: `/pages/mine/couponSell/couponSell?id=${e.currentTarget.dataset.id}`,
    })
  },
  collectList() {
    let fromData = {
      page: this.data.page,
      size: this.data.size
    }
    service.collectList(fromData).then(res => {
      console.log(res)
      res.data.list.forEach(item => {
        item.spXx.img = config.NODOMAIN + item.spXx.img
      })
      this.setData({
        list: res.data.list,
        pagesAll: Math.ceil(res.data.count / this.data.size)
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
    this.collectList()
    app.globalData.isRefresh = true
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

  }
})