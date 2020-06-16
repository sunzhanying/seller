
const service = require("../../../service/service.js");
const common = require("../../../assets/js/common.js");
const config = require('../../../utils/config.js'); 
Page({
    data: {
        orderId:'',
        orderList:[]
    },
    // 确认收货
    saveAddresss: function (e) {
        var that = this;
        wx.showModal({
            // title: '确认收货',
            // content: '未收到货物时确认可能会钱货两空哦～',
            content: '确认收货',
            confirmText:'确认',
            confirmColor:'#E7C778',
            cancelColor:'#777777',
            success(res) {
                if (res.confirm) {
                    // 订单状态   1未自提  传2    4已发货  传5
                    var formData = {
                        id: that.data.orderId,//订单id
                        zt: e.currentTarget.dataset.ddzt+1
                    }
                    goodsService.orderConfirmSh(formData).then(res => { 
                        console.log(res, '确认收货')
                        if (res.data.code == 200) {

                            let pages = getCurrentPages();
                            var Page = pages[pages.length - 1];//当前页
                            var prevPage = pages[pages.length - 2];  //上一个页面
                            var info = prevPage.data //取上页data里的数据也可以修改
                            prevPage.setData({
                                types: 5
                            })//设置数据
                            wx.navigateBack()

                        //    wx.navigateBack({
                        //        delta: 1,
                        //    })
                        } else {
                            common.showToast(res.data.message)
                        }
                    })
                    console.log('用户点击确定')
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
        
        // 发送formId
        service.formId(e.detail.formId).then(res => { })
    },
    // 回到首页
    delAdd:function(){
        wx.switchTab({
            url: '/pages/tab/home/home'
        })
    },
    // 确认支付
    pay:function(e){
        var that = this;
        var formData = {
            id: that.data.orderId,//订单id
            type:4
        }
        common.pay(formData, 2)
        // 发送formId
        service.formId(e.detail.formId).then(res => { })

    },
    // 获取订单详情
    getOrderDetail: function () {
        var that = this;
        var formData = {
            id: that.data.orderId,//订单id
        }
        goodsService.getOrderDetail(formData).then(res => {
            console.log(res, '获取订单详情')
            if (res.data.code == 200) { 
                res.data.data.zt = parseFloat(res.data.data.zt)
                res.data.data.orderMxList.map(_li => {
                    _li.spXx.img = config.NODOMAIN + _li.spXx.img;
                })
                    that.setData({
                        orderList: res.data.data,
                    })
            } else {
                common.showToast(res.data.message)
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        if(options.pay == '1'){
            that.data.isPay = true
        }
        console.log(options,'订单')
        if(options.type == '1'){
            that.setData({
                orderType:true
            })
        }
        this.setData({
            orderId: options.id,
            // orderZt: options.zt
        })
        this.getOrderDetail()

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
        if (this.data.isPay){
            // wx.navigateBack({
            //     delta: 2
            // })
            wx.switchTab({
                url: '/pages/tab/mine/mine'
            })
        }

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

    },
})