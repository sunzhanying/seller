// components/tabbar/tabBar.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    

  },
  lifetimes: {
    attached: function () {
     this.setData({
       itemIndex: app.globalData.index
     })
    //  如果是消费者
      if (app.globalData.isBuy){
        this.setData({
          list: [{
            text: '卡券查询',
            icon: '../../assets/images/tab/a.png',
            selectedicon: '../../assets/images/tab/a1.png',
            route: '/pages/tab/wineTasting/wineTasting'
          }, {
            text: '个人中心',
            icon: '../../assets/images/tab/b.png',
            selectedicon: '../../assets/images/tab/b1.png',
            route: '/pages/tab/mine/mine'
          }]
        })

     }else{
       this.setData({
         list: [{
           text: '',
           icon: '',
           selectedicon: '../../assets/images/tab/a1.png',
           route: ''
         }, {
           text: '',
           icon: '../../assets/images/tab/c.png',
           selectedicon: '../../assets/images/tab/c1.png',
           route: ''
         }, {
           text: '',
           icon: '../../assets/images/tab/b.png',
           selectedicon: '../../assets/images/tab/b1.png',
           route: '/'
         }]
       })
     }

    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    itemIndex: 0,
    list: [{
      text: '卡券查询',
      icon: '../../assets/images/tab/a.png',
      selectedicon: '../../assets/images/tab/a1.png',
      route: '/pages/tab/wineTasting/wineTasting'
    },{
        text: '个人中心',
        icon: '../../assets/images/tab/b.png',
        selectedicon: '../../assets/images/tab/b1.png',
        route: '/pages/tab/mine/mine'
      }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toggleItem(e){
      app.globalData.index = e.currentTarget.dataset.index
      console.log(app.globalData.index,'修改后')
      wx.switchTab({
        url: this.data.list[e.currentTarget.dataset.index].route
      })
      this.triggerEvent('toggleItem', e.currentTarget.dataset.index);   
    }
  }
})