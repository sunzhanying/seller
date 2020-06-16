const service = require("../../../service/service.js");
const common = require("../../../assets/js/common.js");
const config = require('../../../utils/config.js');
const app = getApp()
Page({
  data: {
    navList: [{
        title: '待审核',
        math: '1',
        index: 1
      },
      {
        title: '出售中',
        math: '1',
        index: 2
      },
      {
        title: '已出售',
        math: '1',
        index: 3
      },
      {
        title: '无效券',
        math: '1',
        index: 4
      }
    ],
    ydzsy: 0, //已到账收益
    ktxsy: 0, // 可提现
    userInfo: [], //个人信息
    wxtx: '', //头像
    wxnc: '', //昵称
    isPhone: false, //手机号是否存在
  },
  getCenterInfo: function() {
    service.centerInfo().then(res => {
      // console.log(res)
      res.data.data
      var list = this.data.navList
      list[0].math = res.data.data.dsh
      list[1].math = res.data.data.csz
      list[2].math = res.data.data.ysc
      list[3].math = res.data.data.wxq
      this.setData({
        navList: list,
        ydzsy: res.data.data.ydz,
        ktxsy: res.data.data.ktx
      })
    })

  },
  jumpDetail: function(e) {
    wx.navigateTo({
      url: `/pages/mine/orderRecord/orderRecord?index=${e.currentTarget.dataset.index}`,
    })
  },
  // 用户详情
  goUserDetail: function(e) {
    wx.navigateTo({
      url: '/pages/mine/accountDetail/accountDetail'
    })
  },
  // 获取微信信息1
  onGotUserInfo: function(e) {
    var that = this;
    var avatarUrl = '';
    if (e.detail.errMsg == "getUserInfo:ok") {
      avatarUrl = e.detail.userInfo.avatarUrl;
      const token = wx.getStorageSync('token') || '';

      var formData = {
        "nickname": e.detail.userInfo.nickName, // 昵称
        "avatar": e.detail.userInfo.avatarUrl, //头像
      }
      service.saveUserInfo(formData).then(res => {
        console.log(res, '提交获取用户信息')
        if (res.data.code == 200) {
          that.setData({
            wxtx: e.detail.userInfo.avatarUrl,
            wxnc: e.detail.userInfo.nickName
          })
          wx.navigateTo({
            url: '/pages/mine/accountDetail/accountDetail'
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },
  // 查看全部订单
  allOrderBtn: function() {
    wx.navigateTo({
      url: '/pages/mine/orderRecord/orderRecord?name='
    })
  },
  // 获取个人信息
  getUserInfo1: function() {
    var that = this;
    service.getUserInfo().then(res => {
      // console.log(res, '获取个人信息')
      if (res.data.code == 200) {
        that.setData({
          userInfo: res.data.data,
          wxtx: res.data.data.wxtx,
          wxnc: res.data.data.wxnc,
          isPhone: res.data.data.sj ? true : false
        })
      } else {
        common.showToast(res.data.message)
      }
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
    this.getCenterInfo()
    this.getUserInfo1()
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
})