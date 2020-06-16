
const service = require("../../../service/service.js");
const common = require("../../../assets/js/common.js");
const config = require('../../../utils/config.js');
var WxParse = require('../../../wxParse/wxParse.js');
Page({
    data: {
        addOrder: false, //购买订单弹框
        numData: 1, //订单数量
        addOrderaddOrder: true, //
        goodsId: '', //商品id
        goodsDetail: [], //商品详情

        // 绘图
        isShar:true,//是否已经生成本地图片
        isSharing: false, //弹框
        year: '2019', //年份
        moth: 'Jul', //月份
        day: '03', //日期
        introduceContent:'',//截取显示的富文本
        qrcode: '', 
        isOrder:false,//是否是下单购买  true 立即购买    false  加入购物车
        numShoppingData:1,//加入购物车数量
    },
    
    // 获取微信信息
    onGotUserInfo: function (e, val) {
        var that = this;
        var avatarUrl = '';
        if (e.detail.errMsg == "getUserInfo:ok") {
            avatarUrl = e.detail.userInfo.avatarUrl;
            const token = wx.getStorageSync('token') || '';

            var formData = {
                "nickname": e.detail.userInfo.nickName, // 昵称
                "avatar": e.detail.userInfo.avatarUrl, //头像
            }
            loginService.saveAvatarAndNickname(formData).then(res => {
                console.log(res, '提交获取用户信息')
                if (res.data.code == 200) {
                    if (val == '1') {
                        that.setData({
                            addOrderaddOrder: false,
                            isOrder: false
                        })
                    } else if (val == '2') {
                        that.setData({
                            addOrderaddOrder: false,
                            isOrder: true
                        })
                    }

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
    
    // 获取个人信息
    getUserInfo: function () {
        var that = this;
        service.getUserInfo().then(res => {
            console.log(res, '获取个人信息')
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
    // 获取二维码
    getSpQrcode:function(){
        var that = this;
        var formData = {
            id: that.data.goodsId, //
        }
        goodsService.getSpQrcode(formData).then(res => {
            // console.log(res, '获取二维码')
            if (res.data.code == 200) {
                // 自定义canvas海报弹框
                wx.downloadFile({
                    url: config.NODOMAIN + res.data.data,
                    success: function (ress) {
                        // that.data.qrcode = ress.tempFilePath;
                        if (that.data.isShar) {
                            wx.downloadFile({
                                url: that.data.shareUrl,
                                success: function (res) {
                                    that.setData({
                                        shareUrl: res.tempFilePath,
                                        isShar: false,
                                        qrcode: ress.tempFilePath
                                    })
                                    // that.data.shareUrl = ress.tempFilePath;
                                    // 自定义弹框
                                    that.camvasShare = that.selectComponent("#camvasShare");
                                    that.camvasShare.showShare();
                                },
                                fail: function (_err) {
                                    wx.showToast({
                                        title: '海报生成失败',
                                        icon: "none"
                                    })
                                    console.info(_err);
                                }
                            })
                        } else {
                            // 自定义弹框
                            that.camvasShare = that.selectComponent("#camvasShare");
                            that.camvasShare.showShare();
                        }
                    },
                    fail: function (_err) {
                        wx.showToast({
                            title: '海报生成失败',
                            icon: "none"
                        })
                        console.info(_err);
                    }
                })

             
            } else {
                common.showToast(res.data.message)
            }
        })
    },
    // 获取详情
    getSpDetails: function() {
        var that = this;
        var formData = {
            id: that.data.goodsId, //
        }
        goodsService.getSpDetails(formData).then(res => {
            console.log(res, '获取商品详情')
            if (res.data.code == 200) {
                var data = res.data.data;
                res.data.data.imgBig = res.data.data.imgBig ? config.NODOMAIN + res.data.data.imgBig : '';
                // data.bq = data.bq ? data.bq.split(','):[]
                var bq = []
                if (res.data.data.tagList.length>0){
                    res.data.data.tagList.map(item => {
                        bq.push(item.name)
                    })
                }
                data.bqList = bq
                that.setData({
                    numData: data.kc > 0 ? 1 : 0,
                    numShoppingData: data.kc > 0 ? 1 : 0,
                    goodsDetail: res.data.data,
                    shareUrl: res.data.data.imgBig
                })
                // 富文本
                if (data.description) {
                    var introduce = data.description.replace(/↵/g, '\n');
                    // var introduceContent = data.description.substr(0, 42) + '...';
                    if (introduce.substr(0, 1) == '<' || introduce.substr(0, 1) == '&') {
                        var introducetext = introduce;
                        WxParse.wxParse('introducetext', 'html', introducetext, that, 5);
                        that.setData({
                            introduceShow: false
                        })
                    } else {
                        that.setData({
                            introduce: introduce,
                            introduceShow: true
                        })
                    }
                }
            } else {
                common.showToast(res.data.message)
            }
        })
    },

    // 立即购买
    onWxPay: function (event) {
        var that = this;
        this.setData({
            addOrderaddOrder: true,
            isOrder:false
        })
        if (this.data.goodsDetail.kc>0){
            var spjg = parseFloat((this.data.goodsDetail.spjg * this.data.numData).toFixed(2))
            var data = [{
                spId: this.data.goodsDetail.id,
                sl: this.data.numData,
                jg: this.data.goodsDetail.spjg,
                spmc: this.data.goodsDetail.spmc
            }]
            // wx.navigateTo({
            //     url: '/pages/wine/orderConfirmation/orderConfirmation?title=' + this.data.goodsDetail.spmc + '&num=' + this.data.numData + '&price=' + this.data.goodsDetail.spjg + '&combined=' + spjg + '&spid=' + this.data.goodsDetail.id
            // })
            // delivery_way   配送方式  1 全部 2 自提 3 自取
            wx.navigateTo({
                url: '/pages/wine/orderConfirmation/orderConfirmation?data=' + JSON.stringify(data) + '&combined=' + spjg + '&pay=1&type=4&useYhq=' + that.data.goodsDetail.useYhq + '&deliveryWay=' + that.data.goodsDetail.spType.deliveryWay
            })
        }else{
            common.showToast('库存不足')
        }
    },
    // 点击弹框隐藏
    wineClose: function () {
        this.setData({
            addOrderaddOrder: true
        })
    },
    // 立即购买   显示订单弹框
    payOrderBtn: function(e) {
        var that = this;
        if (e.currentTarget.dataset.name == '1') {
            that.setData({
                addOrderaddOrder: false,
                isOrder: true
            })
        } else {
            that.onGotUserInfo(e, 2)
        }
    },

    // 加入购物车  显示购物车弹框
    shoppingOrderBtn: function (e) {
        var that = this;
        if (e.currentTarget.dataset.name == '1') {
            that.setData({
                addOrderaddOrder: false,
                isOrder: false
            })
        } else {
            that.onGotUserInfo(e, 1)
        }
    },
    // 回到首页
    goHomeTap: function() {
        wx.switchTab({
            url: '/pages/tab/home/home'
        })
    },

    // 购买订单弹框隐藏  立即购买
    onCancel: function () {
        this.setData({
            addOrderaddOrder: true
        })
    },
    //   删减数量  立即购买
    reductionNum: function() {
        var numData = this.data.numData;
        if (numData > 1) {
            numData--;
            this.setData({
                numData: numData,
                score: this.data.points * numData
            })
        }
    },
    //   添加数量  最多不能超过库存数  立即购买
    addNum: function(e) {
        var numData = this.data.numData;
        if (numData < this.data.goodsDetail.kc) {
            numData++;
            this.setData({
                numData: numData,
                score: this.data.points * numData
            })
        }
    },


    //   删减数量  加入购物车
    shoppingReductionNum: function () {
        var numShoppingData = this.data.numShoppingData;
        if (numShoppingData > 1) {
            numShoppingData--;
            this.setData({
                numShoppingData: numShoppingData,
                score: this.data.points * numShoppingData
            })
        }
    },
    //   添加数量  最多不能超过库存数  加入购物车
    shoppingAddNum: function (e) {
        var numShoppingData = this.data.numShoppingData;
        if (numShoppingData < this.data.goodsDetail.kc) {
            numShoppingData++;
            this.setData({
                numShoppingData: numShoppingData,
                score: this.data.points * numShoppingData
            })
        }
    },
    // 加入购物车
    onShopping: function (event) {

        var that = this;
        var formData={
            spid: that.data.goodsDetail.id,
            num: that.data.numShoppingData
        }

        that.setData({
            addOrderaddOrder: true,
            isOrder: false
        })
        if (this.data.goodsDetail.kc > 0) {
            goodsService.addGoodsCache(formData).then(res=>{
                // console.log(res,'加入购物车')
                if(res.data.code == 200){
                    wx.showToast({
                        title: '添加成功，在购物车中等亲~',
                        icon: "none"
                    })
                }
            })
        } else {
            common.showToast('库存不足')
        }
        // if (this.data.goodsDetail.kc > 0) {
        //     var spjg = parseFloat((this.data.goodsDetail.spjg * this.data.numData).toFixed(2))
        //     wx.navigateTo({
        //         url: '/pages/wine/orderConfirmation/orderConfirmation?title=' + this.data.goodsDetail.spmc + '&num=' + this.data.numData + '&price=' + this.data.goodsDetail.spjg + '&combined=' + spjg + '&spid=' + this.data.goodsDetail.id
        //     })
        
    },
    //海报生成分享弹框
    shareTap: function() {
        var that = this;

        that.getSpQrcode()
    },

    // closeAlertTap: function() {
    //     this.setData({
    //         isSharing: false
    //     })
    //     this.camvasShare.hideShare();
    // },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        const date = new Date();
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()
        if (month<10){
            month = '0' + month
        }
        if (day < 10) {
            day = '0' + day
        }
        that.getUserInfo()
        // that.data.isGoHome = options.name && options.name == 'login' ? true : false
        // console.log(that.data.isGoHome, 'that.data.isGoHome')
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    goodsId: options.id,
                    canvasWidth: res.windowWidth,
                    canvasHeight: res.windowHeight,
                    year: year,
                    moth: month,
                    day: day,
                })
            }
        })

        // that.drawCanvas()
    },
    //画布
    // drawCanvas: function() {
    //     let that = this
    //     const ctx = wx.createCanvasContext('myCanvas')
    //     let Rpx = this.data.canvasWidth / 375

    //     // //画布生成柱状图
    //     // const ctx = wx.createContext()
    //     // // const ctx = wx.createCanvasContext('myCanvas')
    //     // //背景
    //     this.drawMain(ctx, Rpx, that)

    //     // wx.drawCanvas({
    //     //     canvasId: 'myCanvas',
    //     //     actions: ctx.getActions()
    //     // })
    // },

    // //填充内容
    // drawMain: function(ctx, Rpx, that) {
    //     let _this = this

    //     // 绘制背景色
    //     ctx.beginPath();
    //     ctx.setFillStyle('#fff')
    //     ctx.fillRect(0, 0, 540, 776)

    //     // this.roundRect(ctx, 0, 0, 327 * Rpx, 520 * Rpx, 6 * Rpx)
    //     this.setData({
    //         // canvasWidth: 327 * Rpx,
    //         // canvasHeight: 776 * Rpx
    //     })
    //     // console.log(ctx, Rpx, that)
    //     /**
    //      * 40 * Rpx     至美推荐宽度
    //      * 60 * Rpx     至美推荐高度
    //      */
    //     // ctx.drawImage(that.data.tagUrl, 19 * Rpx, 0, 40 * Rpx, 60 * Rpx);

    //     // 填充文案
    //     ctx.beginPath();
    //     ctx.fillStyle = "#333333";
    //     ctx.font = "light 20px Arial";
    //     ctx.setFontSize(14 * Rpx)
    //     ctx.fillText('光明推荐', 15 * Rpx, 24 * Rpx);
    //     ctx.fill();


    //     // 绘制线条
    //     ctx.beginPath();
    //     ctx.moveTo(15, 35); //开始坐标
    //     ctx.lineTo(70, 35); //途经坐标
    //     ctx.strokeStyle = "#E7C778"
    //     ctx.lineWidth = 2
    //     ctx.stroke()

    //     // 日期
    //     ctx.beginPath();
    //     ctx.fillStyle = "#777777";
    //     ctx.font = "light 20px Arial";
    //     ctx.setFontSize(12 * Rpx)
    //     ctx.fillText(that.data.year, 220 * Rpx, 24 * Rpx)
    //     ctx.fill();

    //     ctx.beginPath();
    //     ctx.fillStyle = "#777777";
    //     ctx.font = "light 20px Arial";
    //     ctx.setFontSize(12 * Rpx)
    //     ctx.fillText(that.data.moth, 210 * Rpx, 40 * Rpx);
    //     ctx.fill();

    //     ctx.beginPath();
    //     ctx.fillStyle = "#777777";
    //     ctx.font = "light 20px Arial";
    //     ctx.setFontSize(12 * Rpx)
    //     ctx.fillText(that.data.day, 232 * Rpx, 40 * Rpx);
    //     ctx.fill();


    //     ctx.beginPath();
    //     ctx.moveTo(255 * Rpx, 16 * Rpx);
    //     ctx.lineTo(255 * Rpx, 40 * Rpx);
    //     ctx.strokeStyle = "#E7C778";
    //     ctx.lineWidth = 2
    //     ctx.stroke()

    //     // 商品图片
    //     /*
    //     context.drawImage(img,x,y);
    //     context.drawImage(img,x,y,width,height);
    //     context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
    //     img	规定要使用的图像、画布或视频。
    //     sx	可选。开始剪切的 x 坐标位置。
    //     sy	可选。开始剪切的 y 坐标位置。
    //     swidth	可选。被剪切图像的宽度。
    //     sheight	可选。被剪切图像的高度。
    //     x	在画布上放置图像的 x 坐标位置。
    //     y	在画布上放置图像的 y 坐标位置。
    //     width	可选。要使用的图像的宽度（伸展或缩小图像）。
    //     height	可选。要使用的图像的高度（伸展或缩小图像）。
    //     */
    //     ctx.drawImage(that.data.shareUrl, 15 * Rpx, 60 * Rpx, 240 * Rpx, 170 * Rpx);

    //     ctx.beginPath();
    //     ctx.fillStyle = "#777777";
    //     ctx.font = "bold 20px Arial";
    //     ctx.setFontSize(14 * Rpx)
    //     _this.drawText(ctx, Rpx, that.data.title, 20 * Rpx, 240 * Rpx, 200 * Rpx)
    //     ctx.fill();

    //     // 标签
    //     ctx.beginPath();
    //     ctx.fillStyle = "#333333";
    //     ctx.font = "bold 20px Arial";
    //     ctx.setFontSize(10 * Rpx)
    //     // ctx.fillText(that.data.shareLabel, 20 * Rpx, 280 * Rpx);
    //     that.data.shareLabel.map((item, Index) => {
    //         _this.drawText(ctx, Rpx, item, ((Index + 1) + (Index * 3)) * 20 * Rpx, 280 * Rpx, 60 * Rpx)
    //     })
    //     ctx.fill();

    //     // 内容文本
    //     ctx.beginPath();
    //     ctx.fillStyle = "#777777";
    //     ctx.font = "bold 20px Arial";
    //     ctx.setFontSize(10 * Rpx)
    //     _this.drawText(ctx, Rpx, that.data.shareContent, 20 * Rpx, 320 * Rpx, 170 * Rpx)
    //     ctx.fill();

    //     // // 二维码
    //     ctx.drawImage(that.data.qrcode, 210 * Rpx, 320 * Rpx, 50 * Rpx, 50 * Rpx);
    //     ctx.draw()
    // },
    // //自动换行  文本内容
    // drawText: function(ctx, Rpx, t, x, y, w) {
    //     var chr = t.split("");
    //     var temp = "";
    //     var row = [];

    //     // ctx.font = "light 12px Arial";
    //     // ctx.fillStyle = "#343434";
    //     // ctx.textBaseline = "middle";
    //     // ctx.setFontSize(11 * Rpx)

    //     for (var a = 0; a < chr.length; a++) {
    //         if (ctx.measureText(temp).width < w) {;
    //         } else {
    //             row.push(temp);
    //             temp = "";
    //         }
    //         temp += chr[a];
    //     }

    //     row.push(temp);

    //     for (var b = 0; b < row.length; b++) {
    //         ctx.fillText(row[b], x, y + (b + 1) * 15);
    //     }
    //     ctx.fill();

    // },
    // //保存图片到手机
    // saveImageBtn: function() {
    //     let that = this
    //     // 获取画布的总长（一个柱状图的高 * 柱状图的个数）
    //     // let width = 540
    //     // let height = 1077
    //     // let height = this.data.canvasHeight * 1.39
    //     let height = this.data.canvasHeight * 1.79
    //     let width = this.data.canvasWidth * 2
    //     console.log(height, "height", width, 'width', this.data.canvasHeight)

    //     //画布转为图片
    //     wx.canvasToTempFilePath({
    //         x: 0,
    //         y: 0,
    //         width: width,
    //         height: height,
    //         destWidth: width,
    //         destHeight: height,
    //         quality: 1,
    //         canvasId: 'myCanvas',
    //         success: function(res) {
    //             console.log(res.tempFilePath)
    //             // 保存到系统相册 获取授权
    //             wx.saveImageToPhotosAlbum({
    //                 filePath: res.tempFilePath,
    //                 success: function() {
    //                     wx.showToast({
    //                         title: '保存成功',
    //                         icon: 'none'
    //                     })
    //                 }
    //             })
    //         },
    //     })

    // },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getSpDetails()

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
        // if (this.data.isGoHome) {
        //     wx.switchTab({
        //         url: '/pages/tab/home/home'
        //     })
        // }
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

    // 分享
    message: function(e) {
        var formId = e.detail.formId;
        this.setData({
            formId: formId
        })
        // 发送formId
        // service.formId(e.detail.formId).then(res => { })
        this.onShareAppMessage(formId);
    },
    // 分享
    onShareAppMessage: function(res) {
        var that = this;
        var userId = wx.getStorageSync('userId') || '';
        var data = (new Date()).getTime() + '';
        var path = '/pages/login/login?userId=' + userId + '&time=' + data + '&goodsId=' + that.data.goodsId + '&typeid=1';
        // var image = '/images/loading.png'; 
        return {
            title: that.data.goodsDetail.spmc,
            path: path,
            //   imageUrl: image,
            success: function(res) { //点击确认转发

            },
            fail: function(res) { //点击取消转发
            }
        }
    }
})