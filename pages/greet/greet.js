
const app = getApp();
Component({
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
    }
  },
  data: {
   isBuyer:false

  },
  methods: {
    Judge: function () {
      if (this.data.isBuyer){
        app.globalData.list = [{
          "pagePath": "/pages/tab/wineTasting/wineTasting",
          "iconPath": "/assets/images/tab/c.png",
          "selectedIconPath": "/assets/images/tab/c1.png",
          "text": "卡券查询",
        },
        {
          "pagePath": "/pages/tab/mine/mine",
          "iconPath": "/assets/images/tab/b.png",
          "selectedIconPath": "/assets/images/tab/b1.png",
          "text": "个人中心"
        }]
        wx.switchTab({
          url: '../tab/wineTasting/wineTasting',
        })
      }else{
        // 卖家版
        app.globalData.list = [{
          "pagePath": "/pages/tab/wineTasting/wineTasting",
          "iconPath": "/assets/images/tab/c.png",
          "selectedIconPath": "/assets/images/tab/c1.png",
          "text": "卡券出售",
        },
          {
            "pagePath": "/pages/tab/favorite/favorite",
            "iconPath": "/assets/images/tab/a.png",
            "selectedIconPath": "/assets/images/tab/a1.png",
            "text": "收藏",
          },
        {
          "pagePath": "/pages/tab/mine/mine",
          "iconPath": "/assets/images/tab/b.png",
          "selectedIconPath": "/assets/images/tab/b1.png",
          "text": "个人中心"
        }]
        wx.switchTab({
          url: '../tab/wineTasting/wineTasting',
        })
      }
      
    }
  }
})
