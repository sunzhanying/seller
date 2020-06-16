// pages/mine/couponSell/couponSell.js
import service from '../../../service/service.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: '',
    articleDetail: [],
    ruleTime: '',
    psdNum1: [{
      index: 0,
      kh: '',
      km: '',
      img: '',
      yxqDate: ''
    }], //卡密
    psdNum2: [{
      index: 0,
      kh: '',
      km: '',
      img: '',
      yxqDate: ''
    }], // 卡号+卡密
    source: '',
    isPhone: false

  },
  // 修改卡号
  changekh(e) {
    this.data.psdNum2.forEach(item => {
      if (item.index === e.currentTarget.dataset.item.index) {
        item.kh = e.detail.value
      }
    })
  },
  changesource(e) {
    this.setData({
      source: e.detail.value
    })
  },
  // 修改卡密
  changekm(e) {
    if (this.data.index == 1) {
      this.data.psdNum1.forEach(item => {
        if (item.index == e.currentTarget.dataset.item.index) {
          item.km = e.detail.value
        }
      })
    } else if (this.data.index == 2) {
      this.data.psdNum2.forEach(item => {
        if (item.index === e.currentTarget.dataset.item.index) {
          item.km = e.detail.value
        }
      })
    }
  },
  singUp: function() {

    let tel = wx.getStorageSync('saveTel')
    if (tel || this.data.isPhone) {
      var pass = true
      if (this.data.index == 1) {
        var fromData = {
          type: 1,
          // source: this.data.source,
          source:this.data.articleDetail.source,
          qyhsMxes: this.data.psdNum1,
          qyqId: this.data.articleDetail.id
        }
      } else if (this.data.index == 2) {
        var fromData = {
          type: 2,
          source: this.data.source,
          qyhsMxes: this.data.psdNum2,
          qyqId: this.data.articleDetail.id
        }
      }

      if (this.data.index == 1) {
        var pass = true
        this.data.psdNum1.forEach(item => {
          if (item.yxqDate == '') {
            wx.showToast({
              title: '请选择有效期',
              icon: 'none',
              duration: 2000
            })
            pass = false
          }
          if (item.km == '') {
            wx.showToast({
              title: '请输入卡密',
              icon: 'none',
              duration: 2000
            })
            pass = false
          }

        })
      } else if (this.data.index == 2) {
        // 表单效验
        var pass = true
        this.data.psdNum2.forEach(item => {
          if (!item.km) {
            wx.showToast({
              title: '请输入卡密',
              icon: 'none',
              duration: 2000
            })
            pass = false
          }
          if (!item.kh) {
            wx.showToast({
              title: '请输入卡号',
              icon: 'none',
              duration: 2000
            })
            pass = false
          }
          if (!item.yxqDate) {
            wx.showToast({
              title: '请选择有效期',
              icon: 'none',
              duration: 2000
            })
            pass = false
          }
        })
      }

      if (pass) {
        service.addCard(JSON.stringify(fromData)).then(res => {
          console.log(res)
          if (res.data.code === 200) {
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/tab/wineTasting/wineTasting',
              })

            }, 2000)
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000
            })
          }

        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/mine/memberInformation/memberInformation',
      })
      return false
    }
  },
  //选择有效期
  bindDateChange(e) {
    if (this.data.index == 1) {
      var dataList = this.data.psdNum1
      dataList.forEach(item => {
        if (item.index === e.currentTarget.dataset.index) {
          item.yxqDate = e.detail.value
        }
      })
      this.setData({
        psdNum1: dataList
      })
    } else if (this.data.index == 2) {
      var dataList = this.data.psdNum2
      dataList.forEach(item => {
        if (item.index === e.currentTarget.dataset.index) {
          item.yxqDate = e.detail.value
        }
      })
      this.setData({
        psdNum2: dataList
      })
    }

  },
  // 卡密的删除
  delete1: function(e) {
    if (e.currentTarget.dataset.index == 0) {
      return false
    }
    let list = this.data.psdNum1.filter(item => {
      if (item.index !== e.currentTarget.dataset.index) {
        return item.index !== e.currentTarget.dataset.index
      }
    })
    this.setData({
      psdNum1: list
    })
  },
  // 卡号+卡密的删除
  delete2: function(e) {
    if (e.currentTarget.dataset.id == 0) {
      return false
    }
    let list = this.data.psdNum2.filter(item => {
      if (item.index !== e.currentTarget.dataset.index) {
        return item.index !== e.currentTarget.dataset.index
      }
    })
    this.setData({
      psdNum2: list
    })
  },
  // 卡密的添加
  addCoupon1: function() {
    let obj = {
      kh: '',
      km: '',
      img: '',
      yxqDate: '',
      index: this.data.psdNum1[this.data.psdNum1.length - 1].index + 1
    }
    var arr = this.data.psdNum1
    arr.push(obj)
    this.setData({
      psdNum1: arr
    })
  },
  // 卡号+卡密的添加
  addCoupon2: function() {
    let obj = {
      kh: '',
      km: '',
      img: '',
      yxqDate: '',
      index: this.data.psdNum2[this.data.psdNum2.length - 1].index + 1
    }
    var arr = this.data.psdNum2
    arr.push(obj)
    this.setData({
      psdNum2: arr
    })
  },
  // 限制时间选择器范围
  setDate() {
    var date = new Date()
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    this.setData({
      ruleTime: y + '-' + m + '-' + d
    })
  },
  // 获取商品详情
  getDetails(id) {
    let fromData = {
      id
    }
    service.getSpDetail(fromData).then(res => {
      console.log(res)
      this.setData({
        articleDetail: res.data.data,
        index: res.data.data.type
      })
    })
  },
  getUserInfo: function() {
    var that = this;
    service.getUserInfo().then(res => {
      if (res.data.code == 200) {
        that.setData({
          isPhone: res.data.data.sj ? true : false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      index: options.type
    })
    this.setDate()
    this.getDetails(options.id)
    this.getUserInfo()

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

  }
})