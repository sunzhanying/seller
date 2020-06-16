import config from '../../../utils/config.js'
import service from '../../../service/service.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleDetail: [],
    cardList: [{
      index: 0,
      kh: '',
      km: '',
      img: '',
      showimg: '',
      yxqDate: '',

    }],
    ruleTime: '',
    source: '',
    isPhone: false

  },
  changesource(e) {
    this.setData({
      source: e.detail.value
    })
  },
  singUp() {
    let tel = wx.getStorageSync('saveTel')
    if (tel || this.data.isPhone) {
      var pass = true

      this.data.cardList.forEach(item => {

        if (!item.yxqDate) {
          wx.showToast({
            title: '请选择有效期',
            icon: 'none',
            duration: 2000
          })
          pass = false
        }
        if (!item.kh) {
          wx.showToast({
            title: '请输入兑换码',
            icon: 'none',
            duration: 2000
          })
          pass = false
        }
        if (!item.img) {
          wx.showToast({
            title: '请选择图片',
            icon: 'none',
            duration: 2000
          })
          pass = false
        }
      })

      var fromData = {
        type: 3,
        source: this.data.source,
        qyhsMxes: this.data.cardList,
        qyqId: this.data.articleDetail.id
      }
      if (pass) {
        service.addCard(JSON.stringify(fromData)).then(res => {
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
    }else {
      wx.navigateTo({
        url: '/pages/mine/memberInformation/memberInformation',
      })
      return false
    }
  },
  changekh(e) {
    var list = this.data.cardList
    list.forEach(item => {
      if (item.index == e.currentTarget.dataset.index) {
        item.kh = e.detail.value
      }
    })
    this.setData({
      cardList: list
    })
  },
  // 修改时间
  bindDateChange(e) {
    var dataList = this.data.cardList
    dataList.forEach(item => {
      if (item.index == e.currentTarget.dataset.index) {
        item.yxqDate = e.detail.value
      }
    })
    this.setData({
      cardList: dataList
    })
  },
  chooseImageBtn: function(e) {
    var that = this;
    that.setData({
      index: e.currentTarget.dataset.index
    })
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success(res) {
        console.log(res)
        res.tempFilePaths.forEach(item => {
          that.uploadFile(item); //图片上传每次一张  每次遍历都调用这个借口
        });

      }
    })
  },
  uploadFile: function(url) {
    var that = this;
    const token = wx.getStorageSync('token') || '';

    wx.uploadFile({
      url: config.DOMAIN + '/api/qyq/upload', //将图片传到服务器的请求路径
      filePath: url, //图片在手机里的存储路径
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",
        "X-Auth-Token": token
      },
      formData: {
        'user': 'test'
      },
      success(res) {
        console.log(res, '返回值')
        const mata = JSON.parse(res.data)
        // 把数据存到imglist中去
        var list = that.data.cardList
        list.forEach(item => {
          if (item.index == that.data.index) {
            item.img = mata.fileUpload.fileUrl,
              item.showimg = config.DOMAIN + mata.fileUpload.fileUrl
          }
        })
        that.setData({
          cardList: list
        })

      }
    })
  },
  // 卡密-添加新卡密
  addCoupon: function() {
    let obj = {
      kh: '',
      km: '',
      img: '',
      showimg: '',
      yxqDate: '',
      index: this.data.cardList[this.data.cardList.length - 1].index + 1,
    }
    var arr = this.data.cardList
    arr.push(obj)
    this.setData({
      cardList: arr
    })
  },
  // 删除
  deletePsd: function(e) {
    let list = this.data.cardList.filter(item => {
      if (item.index !== e.currentTarget.dataset.index) {
        return item.index !== e.currentTarget.dataset.index
      }
    })
    this.setData({
      cardList: list
    })
  },
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
  getDetails(id) {
    let fromData = {
      id
    }
    service.getSpDetail(fromData).then(res => {
      console.log(res)
      this.setData({
        articleDetail: res.data.data
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