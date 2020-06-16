const service = require("../../../service/service.js");
const common = require("../../../assets/js/common.js");
const config = require('../../../utils/config.js');
Page({

  data: {
    BusinessTab: [{
        tit: '待审核',
        type: 1
      },
      {
        tit: '出售中',
        type: 2
      },
      {
        tit: '已出售',
        type: 3
      }, {
        tit: '无效券',
        type: 4
      }
    ],
    types: 1,
    yhqList: [], //订单记录
    isNull: false, // 数据是否为空
    pagesAll: 1, //总页数
    pageNum: 1, //第几页
    pageSize: 10, //每页多少条数据
  },
  // tab切换
  tabClick(e) {
    let _type = e.currentTarget.dataset.type;
    this.setData({
      types: _type,
      pageNum:1,
      yhqList: []
    })
    this.getDetail()
    // 请求接口
  },
  getDetail(){
    var that = this
    let fromData = {
      page:this.data.pageNum,
      size:this.data.pageSize,
      type: this.data.types
    }
    service.getTypeDetail(fromData).then(res=>{
      console.log(res)
      res.data.list.map(item=>{
        item.spXx.img = config.NODOMAIN + item.spXx.img
      })
        that.setData({
          yhqList: this.data.yhqList.concat(res.data.list),
          pagesAll: Math.ceil(res.data.count / this.data.pageSize)
        })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.index) {
      this.setData({
        types: options.index
      })
    }
    this.getDetail()
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
    var that = this;
    var pagesAll = that.data.pagesAll;
    var pageNum = that.data.pageNum;
    if (pageNum < pagesAll) {
      pageNum++;
      that.setData({
        pageNum: pageNum
      })
      that.getDetail();

    }
  },
})