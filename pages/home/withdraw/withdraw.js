import server from '../../../service/service.js'
Page({
  data: {
    page: 1,
    size: 7,
    pageAll: 1,
    list: [],
    money: 0
  },
  // 点击申请
  request() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '您确认要提现吗',
      success(res) {
        if (res.confirm) {
          that.reqMoney()
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  // 提现请求
  reqMoney() {
    let self = this
    server.extractMoney().then(res => {
      if (res.data.code == 200) {
        wx.showToast({
          title: '请等待审核',
          icon: 'success',
          duration: 2000
        })
        self.data.list = []
        self.data.page = 1
        self.getDetailList()
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 获取请求提现列表
  getDetailList() {
    let self = this
    let fromData = {
      page: this.data.page,
      size: this.data.size
    }
    server.extractMoneyList(fromData).then(res => {
      var dataList = self.data.list
      res.data.list.map((item, index) => {
        dataList.push(item);
      })
      self.setData({
        // list: this.data.list.concat(res.data.list),
        list: dataList,
        pageAll: Math.ceil(res.data.count / this.data.size)
      })
    })
  },
  getextractMoneys() {
    server.extractMoneys().then(res => {
      console.log(res)
      this.setData({
        money: res.data.data
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDetailList()
    this.getextractMoneys()
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
    var that = this;
    var pagesAll = that.data.pageAll;
    var pageNum = that.data.page;
    if (pageNum < pagesAll) {
      pageNum++;
      that.setData({
        page: pageNum
      })
      that.getDetailList();

    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})